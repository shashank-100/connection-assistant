import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const TARGET_URN = "urn:li:fsd_profile:ACoAADkC978B4_R-57I7L55K5-q9-u8-u8-u8-u8"; // Rahul Konda's URN

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const browser = new BrowserManager();
  try {
    console.log("🚀 Launching browser for direct API connect...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    await page.context().addCookies(cookies);
    
    // Go to a simple page to establish context
    await page.goto("https://www.linkedin.com/preload/", { waitUntil: 'load' });
    
    const jsessionid = cookies.find(c => c.name === 'JSESSIONID')?.value;
    
    console.log(`🔗 Attempting direct API connection to: ${TARGET_URN}`);
    
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
        const text = await resp.text();
        return { status: resp.status, body: text };
      } catch (e) {
        return { status: -1, error: e.message };
      }
    }, { urn: TARGET_URN, csrf: jsessionid });

    console.log("API Result Status:", result.status);
    if (result.status >= 200 && result.status < 300) {
      console.log("✅ Connection request SENT successfully to Rahul Konda!");
    } else {
      console.log("❌ API Error:", result.body);
    }
  } catch (err) {
    console.error("Fatal Error:", err);
  } finally {
    await browser.close();
  }
}
main();
