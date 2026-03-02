import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

async function main() {
  const profileUrl = process.argv[2];
  if (!profileUrl) {
    console.error("❌ Please provide a LinkedIn profile URL.");
    process.exit(1);
  }

  const cookiesPath = './cookies.json';
  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
  const browser = new BrowserManager();
  
  try {
    console.log(`🚀 Starting automated connect for: ${profileUrl}`);
    await browser.launch({ headless: true });
    const page = browser.getPage();
    const context = page.context();
    await context.addCookies(cookies);
    
    const vanityName = profileUrl.split('/in/')[1].split('/')[0].replace(/\/$/, '');
    let profileHtml = "";
    
    page.on('response', async (resp) => {
      try {
        if (resp.url().includes(`/in/${vanityName}`) && (resp.headers()['content-type'] || '').includes('text/html')) {
          profileHtml = await resp.text().catch(() => "");
        }
      } catch (e) {}
    });

    console.log("🔗 Navigating to profile...");
    await page.goto(profileUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);

    const service = new LinkedInConnectService();
    const state = service._parseProfileState(profileHtml, vanityName);
    
    if (state.status === 'pending') {
      console.log("⚠️ Connection already pending.");
      return;
    }

    if (!state.profileUrn) {
      const html = await page.content();
      const urnMatch = html.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{10,})/);
      state.profileUrn = urnMatch ? urnMatch[0] : null;
    }

    if (!state.profileUrn) {
      console.error("❌ Could not find profile URN.");
      return;
    }

    console.log(`✅ Found URN: ${state.profileUrn}`);

    console.log("📡 Sending Voyager connection request via API page...");
    const jsessionid = cookies.find(c => c.name === 'JSESSIONID')?.value;
    
    const apiPage = await context.newPage();
    await apiPage.goto("https://www.linkedin.com/preload/", { waitUntil: 'load' });

    const result = await apiPage.evaluate(async ({ urn, csrf }) => {
      try {
        const resp = await fetch('https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreateV2&decorationId=com.linkedin.voyager.dash.deco.relationships.InvitationCreationResultWithInvitee-2', {
          method: 'POST',
          headers: {
            'accept': 'application/vnd.linkedin.normalized+json+2.1',
            'content-type': 'application/json; charset=UTF-8',
            'csrf-token': csrf,
            'x-restli-protocol-version': '2.0.0'
          },
          body: JSON.stringify({
            invitee: {
              inviteeUnion: {
                memberProfile: urn
              }
            }
          })
        });
        const text = await resp.text();
        return { status: resp.status, body: text };
      } catch (e) {
        return { status: -1, error: e.message };
      }
    }, { urn: state.profileUrn, csrf: jsessionid });

    await apiPage.close();

    if (result.status >= 200 && result.status < 300) {
      console.log("🎉 SUCCESS: Connection request sent!");
    } else {
      console.error(`❌ FAILED: API returned status ${result.status}`);
      console.log("Response:", result.body);
    }

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  } finally {
    await browser.close();
    console.log("🏁 Finished.");
  }
}

main();
