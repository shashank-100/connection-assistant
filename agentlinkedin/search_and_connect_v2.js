import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const targets = [
  { name: "Kadhiresan Kanniyappan", url: "https://www.linkedin.com/in/kadhir" },
  { name: "Pierre Sarabamoun", url: "https://www.linkedin.com/in/pisarabamoun" },
  { name: "Nick Munson", url: "https://www.linkedin.com/in/nicholascmunson" },
  { name: "Alfredo Pozos Nicolau", url: "https://www.linkedin.com/in/alfredopozosnicolau" },
  { name: "Samuel Supriana", url: "https://www.linkedin.com/in/samuelsupriana" },
  { name: "Niyi Okejide", url: "https://www.linkedin.com/in/niyiokejide" }
];

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const browser = new BrowserManager();
  
  try {
    console.log("🚀 Launching browser for UI-based connect...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    await page.context().addCookies(cookies);
    
    for (const target of targets) {
      console.log(`\n👤 Processing: ${target.name}`);
      try {
        await page.goto(target.url, { waitUntil: 'load', timeout: 60000 });
        await wait(5000);

        // Check if already connected/pending
        const html = await page.content();
        if (html.includes("Pending") || html.includes("Remove Connection") || html.includes("Withdraw")) {
          console.log("⚠️ Already connected or pending. Skipping.");
          continue;
        }

        // 1. Try to find visible Connect button
        let connectBtn = page.locator('button:has-text("Connect")').first();
        if (await connectBtn.isVisible()) {
          console.log("🖱️ Found visible Connect button.");
          await connectBtn.click();
        } else {
          // 2. Click "More" (Three dots)
          console.log("🖱️ Connect hidden. Clicking 'More'...");
          const moreBtn = page.locator('button:has-text("More")').first();
          if (await moreBtn.isVisible()) {
            await moreBtn.click();
            await wait(2000);
            
            // 3. Find Connect in dropdown
            const dropdownConnect = page.locator('div[role="button"]:has-text("Connect"), span:has-text("Connect")').last();
            if (await dropdownConnect.isVisible()) {
              await dropdownConnect.click();
            } else {
              console.log("❌ Connect not found in 'More' menu.");
              continue;
            }
          } else {
            console.log("❌ 'More' button not found.");
            continue;
          }
        }

        await wait(2000);
        
        // 4. Handle the "Send without a note" modal
        const sendNow = page.locator('button:has-text("Send without a note"), button:has-text("Send now")').first();
        if (await sendNow.isVisible()) {
          await sendNow.click();
          console.log(`🎉 SUCCESS: Invitation sent to ${target.name}`);
        } else {
          console.log("⚠️ Modal appeared but 'Send' button not found.");
        }

      } catch (innerErr) {
        console.error(`❌ Error during UI interaction: ${innerErr.message}`);
      }

      const cooldown = 10000 + Math.random() * 5000;
      console.log(`⏳ Cooldown: ${Math.round(cooldown/1000)}s...`);
      await wait(cooldown);
    }

  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  } finally {
    await browser.close();
    console.log("\n🏁 UI Connect Batch Done.");
  }
}

main();
