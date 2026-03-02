import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const COOKIES_PATH = './cookies.json';
const LEADS_PATH = '../leads_to_process.csv';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function humanInteraction(page) {
  console.log("🖱️ Simulating human interaction...");
  try {
    await page.evaluate(() => window.scrollBy(0, Math.random() * 500 + 200));
    await wait(1000 + Math.random() * 1000);
    await page.evaluate(() => window.scrollBy(0, -Math.random() * 200));
    await page.mouse.move(Math.random() * 100 + 100, Math.random() * 100 + 100);
  } catch (e) {
    console.log("⚠️ Interaction error:", e.message);
  }
}

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
    console.log("🚀 Launching browser for HUMAN mass connect...");
    await browser.launch({ headless: false });
    const page = browser.getPage();
    const context = page.context();
    await context.addCookies(cookies);
    
    console.log("🏠 Checking Authentication...");
    await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'load', timeout: 60000 });
    if (page.url().includes("login")) {
      throw new Error("Cookies expired. Please update session.");
    }
    console.log("✅ Authenticated.");

    for (const lead of leads) {
      if (!lead.profile_url) continue;
      
      console.log(`\n--------------------------------------------------`);
      console.log(`👤 Processing: ${lead.name}`);
      
      const vanityName = lead.profile_url.split('/in/')[1].split('/')[0].replace(/\/$/, '');
      let profileHtml = "";
      
      const onResponse = async (resp) => {
        try {
          if (resp.url().includes(`/in/${vanityName}`) && (resp.headers()['content-type'] || '').includes('text/html')) {
            profileHtml = await resp.text().catch(() => "");
          }
        } catch (e) {}
      };
      page.on('response', onResponse);

      try {
        console.log(`🔗 Navigating to profile...`);
        await page.goto(lead.profile_url, { waitUntil: 'load', timeout: 45000 });
        await humanInteraction(page);
        await wait(1000 + Math.random() * 1000);
        page.off('response', onResponse);

        const service = new LinkedInConnectService();
        let state = service._parseProfileState(profileHtml, vanityName);
        
        if (state.status === 'pending') {
          console.log(`⚠️ Connection already pending.`);
          continue;
        }

        if (!state.profileUrn) {
          const html = await page.content();
          const urnMatch = html.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{10,})/);
          state.profileUrn = urnMatch ? urnMatch[0] : null;
        }

        if (!state.profileUrn) {
          console.log(`❌ Could not extract ID for ${lead.name}`);
          continue;
        }

        console.log(`✅ ID Found: ${state.profileUrn}`);
        console.log(`📡 Sending Voyager request...`);

        const jsessionid = cookies.find(c => c.name === 'JSESSIONID')?.value;
        
        const result = await page.evaluate(async ({ urn, csrf }) => {
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

        if (result.status >= 200 && result.status < 300) {
          console.log(`🎉 SUCCESS: Invitation sent to ${lead.name}`);
        } else {
          console.log(`❌ FAILED: API status ${result.status}`);
        }

        const delay = 3000 + Math.random() * 2000;
        console.log(`⏳ Cooldown: ${Math.round(delay/1000)}s...`);
        await wait(delay);

      } catch (err) {
        console.error(`❌ Error: ${err.message}`);
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
