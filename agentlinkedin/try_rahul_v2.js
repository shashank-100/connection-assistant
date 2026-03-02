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
    
    console.log(`🔗 Navigating to: ${PROFILE_URL}`);
    await page.goto(PROFILE_URL, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    const html = await page.content();
    
    // Manual extraction search
    const memberIdMatch = html.match(/"memberId":"(\d+)"/);
    const profileUrnMatch = html.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{20,})/);
    
    console.log("Raw Extraction:", {
      memberId: memberIdMatch ? memberIdMatch[1] : null,
      profileUrn: profileUrnMatch ? profileUrnMatch[0] : null
    });

    if (memberIdMatch) {
       const memberId = memberIdMatch[1];
       const profileUrn = profileUrnMatch ? profileUrnMatch[0] : `urn:li:fsd_profile:${memberId}`;
       
       console.log(`Found memberId: ${memberId}. Attempting API connect...`);
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
        }, { urn: profileUrn, csrf: jsessionid });
        
        console.log("API Result:", JSON.stringify(result));
    } else {
       console.log("Still could not find memberId.");
       await page.screenshot({ path: 'rahul_debug.png' });
       console.log("Screenshot saved to rahul_debug.png");
    }
  } catch (err) {
    console.error("Fatal Error:", err);
  } finally {
    await browser.close();
  }
}
main();
