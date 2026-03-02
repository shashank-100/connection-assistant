import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const targets = [
  { name: "Kadhiresan Kanniyappan", headline: "Vice President of Software Engineering" },
  { name: "Vamsi Krishna B", headline: "Senior Data Engineer at Capital One" },
  { name: "Pierre Sarabamoun", headline: "Associate Software Engineer at Capital One" },
  { name: "Nick Munson", headline: "Chief Audit Executive" },
  { name: "Susmit Kumar Mishra", headline: "Senior Software Engineer Capital One" },
  { name: "Alfredo Pozos Nicolau", headline: "SWE @ Capital One" },
  { name: "Samuel Supriana", headline: "DevOps Engineer" },
  { name: "Niyi Okejide", headline: "Cloud Security Engineer" }
];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function humanInteraction(page) {
  try {
    await page.evaluate(() => window.scrollBy(0, Math.random() * 400 + 100));
    await wait(1000);
    await page.mouse.move(Math.random() * 200, Math.random() * 200);
  } catch (e) {}
}

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const browser = new BrowserManager();
  
  try {
    console.log("🚀 Launching browser...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    const context = page.context();
    await context.addCookies(cookies);
    
    console.log("🏠 Authenticating...");
    await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'load' });
    if (page.url().includes("login")) throw new Error("Cookies expired.");

    for (const target of targets) {
      console.log(`\n🔍 Searching for: ${target.name} (${target.headline})`);
      const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(target.name + " " + target.headline)}`;
      
      await page.goto(searchUrl, { waitUntil: 'load' });
      await wait(4000);

      const html = await page.content();
      const profileUrlMatch = html.match(/https:\/\/www\.linkedin\.com\/in\/[^"/?\s]+/);
      
      if (!profileUrlMatch) {
        console.log(`❌ Could not find profile for ${target.name}`);
        continue;
      }

      const profileUrl = profileUrlMatch[0];
      console.log(`✅ Found: ${profileUrl}`);

      console.log(`🔗 Visiting profile...`);
      await page.goto(profileUrl, { waitUntil: 'load' });
      await wait(3000);
      await humanInteraction(page);

      // Extract URN
      const pageHtml = await page.content();
      const urnMatch = pageHtml.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{10,})/);
      
      if (!urnMatch) {
        console.log(`❌ Could not extract URN for ${target.name}`);
        continue;
      }

      const urn = urnMatch[0];
      console.log(`📡 Sending request to ${urn}...`);

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
            body: JSON.stringify({ invitee: { inviteeUnion: { memberProfile: urn } } })
          });
          return { status: resp.status };
        } catch (e) { return { status: -1 }; }
      }, { urn, csrf: jsessionid });

      if (result.status >= 200 && result.status < 300) {
        console.log(`🎉 SUCCESS: Invitation sent to ${target.name}`);
      } else {
        console.log(`⚠️ FAILED: Status ${result.status}`);
      }

      const cooldown = 15000 + Math.random() * 10000;
      console.log(`⏳ Cooldown: ${Math.round(cooldown/1000)}s...`);
      await wait(cooldown);
    }

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  } finally {
    await browser.close();
    console.log("\n🏁 Search & Connect Batch Done.");
  }
}

main();
