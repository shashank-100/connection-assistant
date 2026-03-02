import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

// Trying without www.
const PROFILE_URL = "https://linkedin.com/in/rahulkonda1824";

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const browser = new BrowserManager();
  try {
    console.log("🚀 Launching browser...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    await page.context().addCookies(cookies);
    
    console.log("🏠 Validating session at feed...");
    await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    if (page.url().includes("login") || page.url().includes("authwall")) {
       console.error("❌ Session validation failed.");
       process.exit(1);
    }
    console.log("✅ Authenticated.");

    console.log(`🔗 Navigating to: ${PROFILE_URL}`);
    try {
      await page.goto(PROFILE_URL, { waitUntil: 'load', timeout: 60000 });
    } catch (e) {
      console.warn("⚠️ Initial navigation failed, trying with www and relaxed wait...", e.message);
      await page.goto("https://www.linkedin.com/in/rahulkonda1824", { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    
    await page.waitForTimeout(5000);
    const html = await page.content();
    
    // Improved manual extraction
    const memberIdMatch = html.match(/"memberId":"(\d+)"/) || html.match(/memberId=(\d+)/) || html.match(/"id":"urn:li:fsd_profile:(\d+)"/);
    const profileUrnMatch = html.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{10,})/);
    
    console.log("Raw Extraction:", {
      memberId: memberIdMatch ? memberIdMatch[1] : null,
      profileUrn: profileUrnMatch ? profileUrnMatch[0] : null
    });

    if (memberIdMatch || profileUrnMatch) {
       const profileUrn = profileUrnMatch ? profileUrnMatch[0] : `urn:li:fsd_profile:${memberIdMatch[1]}`;
       
       console.log(`Found target: ${profileUrn}. Attempting API connect...`);
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
            const text = await resp.text();
            return { status: resp.status, body: text };
          } catch (e) {
            return { status: -1, error: e.message };
          }
        }, { urn: profileUrn, csrf: jsessionid });
        
        console.log("API Result Status:", result.status);
        if (result.status >= 200 && result.status < 300) {
            console.log("✅ Connection request SENT successfully!");
        } else {
            console.log("❌ API Error:", result.body);
        }
    } else {
       console.log("Still could not find memberId.");
       await page.screenshot({ path: 'rahul_final_debug.png' });
    }
  } catch (err) {
    console.error("Fatal Error:", err);
  } finally {
    await browser.close();
  }
}
main();
