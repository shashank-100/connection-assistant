import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const SEARCH_QUERY = "Rahul Konda Capital One";

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
    await page.waitForTimeout(3000);
    
    if (page.url().includes("login") || page.url().includes("authwall")) {
       console.error("❌ Session validation failed.");
       process.exit(1);
    }
    console.log("✅ Authenticated.");

    console.log(`🔍 Searching for: ${SEARCH_QUERY}`);
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(SEARCH_QUERY)}`;
    await page.goto(searchUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    const html = await page.content();
    
    // Find URN in search results
    // Search results typically contain: "urn:li:fsd_profile:ACoAA..."
    const profileUrnMatch = html.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{10,})/);
    
    console.log("Search Result Extraction:", {
      profileUrn: profileUrnMatch ? profileUrnMatch[0] : null
    });

    if (profileUrnMatch) {
       const profileUrn = profileUrnMatch[0];
       console.log(`Found target in search: ${profileUrn}. Attempting API connect...`);
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
            console.log("✅ Connection request SENT successfully via Search!");
        } else {
            console.log("❌ API Error:", result.body);
        }
    } else {
       console.log("Could not find Rahul Konda in search results.");
       await page.screenshot({ path: 'rahul_search_error.png' });
    }
  } catch (err) {
    console.error("Fatal Error:", err);
  } finally {
    await browser.close();
  }
}
main();
