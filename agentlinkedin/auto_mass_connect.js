import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const COOKIES_PATH = './cookies.json';
const LEADS_PATH = '../leads_to_process.csv';

async function main() {
  if (!fs.existsSync(COOKIES_PATH)) {
    console.error("❌ No cookies.json found!");
    process.exit(1);
  }
  
  const leadsRaw = fs.readFileSync(LEADS_PATH, 'utf-8');
  const leads = parse(leadsRaw, { columns: true, skip_empty_lines: true });
  const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
  const browser = new BrowserManager();
  
  try {
    console.log("🚀 Launching browser for mass connect...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    const context = page.context();
    await context.addCookies(cookies);
    
    // Auth Check
    console.log("🏠 Authenticating...");
    await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'load', timeout: 60000 });
    if (page.url().includes("login")) {
      throw new Error("Cookies expired.");
    }
    console.log("✅ Authenticated.");

    for (const lead of leads) {
      if (!lead.profile_url) continue;
      
      console.log(`\n--------------------------------------------------`);
      console.log(`👤 Processing: ${lead.name}`);
      console.log(`🔗 URL: ${lead.profile_url}`);
      
      const vanityName = lead.profile_url.split('/in/')[1].split('/')[0].replace(/\/$/, '');
      let profileHtml = "";
      
      // Listener for profile data
      const onResponse = async (resp) => {
        try {
          if (resp.url().includes(`/in/${vanityName}`) && (resp.headers()['content-type'] || '').includes('text/html')) {
            profileHtml = await resp.text().catch(() => "");
          }
        } catch (e) {}
      };
      page.on('response', onResponse);

      try {
        // Set a hard timeout to prevent getting stuck on redirect loops
        const navPromise = page.goto(lead.profile_url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        await Promise.race([
            navPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Navigation Timeout')), 30000))
        ]);

        await new Promise(r => setTimeout(r, 5000));
        page.off('response', onResponse);

        const service = new LinkedInConnectService();
        let state = service._parseProfileState(profileHtml, vanityName);
        
        if (state.status === 'pending') {
          console.log(`⚠️  Already pending. Skipping.`);
          continue;
        }

        if (!state.profileUrn) {
          // Fallback extraction
          const html = await page.content();
          const urnMatch = html.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{10,})/);
          state.profileUrn = urnMatch ? urnMatch[0] : null;
        }

        if (!state.profileUrn) {
          console.log(`❌ Could not extract URN. Profile might be private or redirecting.`);
          continue;
        }

        console.log(`✅ Found URN: ${state.profileUrn}`);
        console.log(`📡 Sending request...`);

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
            return { status: resp.status, body: await resp.text() };
          } catch (e) {
            return { status: -1, error: e.message };
          }
        }, { urn: state.profileUrn, csrf: jsessionid });

        await apiPage.close();

        if (result.status >= 200 && result.status < 300) {
          console.log(`🎉 SUCCESS: Invitation sent to ${lead.name}`);
        } else {
          console.log(`❌ FAILED: API status ${result.status}`);
          if (result.body) console.log(`   Response: ${result.body.substring(0, 100)}`);
        }

        // Random delay to be safe
        const delay = 8000 + Math.random() * 5000;
        console.log(`⏳ Waiting ${Math.round(delay/1000)}s...`);
        await new Promise(r => setTimeout(r, delay));

      } catch (err) {
        console.error(`❌ Error with ${lead.name}: ${err.message}`);
        page.off('response', onResponse);
      }
    }

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  } finally {
    if (browser) await browser.close();
    console.log("\n🏁 Done.");
  }
}

main();
