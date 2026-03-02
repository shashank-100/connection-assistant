import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const PROFILE_URL = "https://www.linkedin.com/in/rahulkonda1824";

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const browser = new BrowserManager();
  try {
    console.log("🚀 Launching browser...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    await page.context().addCookies(cookies);
    
    const vanityName = "rahulkonda1824";
    let profileHtml = "";
    
    page.on('response', async (resp) => {
      try {
        if (resp.url().includes(`/in/${vanityName}`) && (resp.headers()['content-type'] || '').includes('text/html')) {
          profileHtml = await resp.text().catch(() => "");
        }
      } catch (e) {}
    });

    console.log(`🔗 Navigating to: ${PROFILE_URL}`);
    await page.goto(PROFILE_URL, { waitUntil: 'load', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));

    const service = new LinkedInConnectService();
    const state = service._parseProfileState(profileHtml, vanityName);
    
    console.log("Extracted State:", JSON.stringify(state));

    if (state.status === "connect" && state.memberId) {
       console.log("Attempting API connect...");
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
        
        console.log("API Result:", JSON.stringify(result));
    } else {
       console.log("Profile not in 'connect' state or ID not found.");
    }
  } catch (err) {
    console.error("Fatal Error:", err);
  } finally {
    await browser.close();
  }
}
main();
