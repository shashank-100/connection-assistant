import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const COOKIES_PATH = './cookies.json';
const LEADS_PATH = '../leads_to_process.csv';

async function main() {
  const leadsRaw = fs.readFileSync(LEADS_PATH, 'utf-8');
  const leads = parse(leadsRaw, { columns: true, skip_empty_lines: true });
  const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
  
  const browser = new BrowserManager();
  
  try {
    console.log("🚀 Launching browser...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    const context = page.context();
    await context.addCookies(cookies);
    
    // Auth Check
    await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'load' });
    if (page.url().includes("login")) {
      throw new Error("Cookies expired. Please update cookies.json");
    }
    console.log("✅ Authenticated.");

    for (const lead of leads) {
      console.log(`\nProcessing: ${lead.name} (${lead.profile_url})`);
      
      const vanityName = lead.profile_url.split('/in/')[1].split('/')[0];
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
        await page.goto(lead.profile_url, { waitUntil: 'load', timeout: 60000 });
        await new Promise(r => setTimeout(r, 4000)); // Longer wait for profile data
        page.off('response', onResponse);

        const service = new LinkedInConnectService();
        const state = service._parseProfileState(profileHtml, vanityName);
        
        if (state.status === 'pending') {
          console.log(`⚠️  Already pending for ${lead.name}`);
          continue;
        }

        if (!state.profileUrn) {
          console.log(`❌ Could not extract URN for ${lead.name}`);
          continue;
        }

        console.log(`🔗 Sending request to ${lead.name} (URN: ${state.profileUrn})...`);

        const jsessionid = cookies.find(c => c.name === 'JSESSIONID').value;

        // Use a clean page for the API request to avoid context destruction
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
          console.log(`✅ Request sent successfully to ${lead.name}`);
        } else {
          console.log(`❌ Failed to send to ${lead.name}. Status: ${result.status}`);
          if (result.body) console.log(`   Response: ${result.body.substring(0, 100)}`);
        }

        const delay = 10000 + Math.random() * 5000;
        console.log(`⏳ Waiting ${Math.round(delay/1000)}s...`);
        await new Promise(r => setTimeout(r, delay));

      } catch (err) {
        console.error(`❌ Error processing ${lead.name}: ${err.message}`);
        page.off('response', onResponse);
      }
    }

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  } finally {
    await browser.close();
    console.log("\n🏁 Done.");
  }
}

main();
