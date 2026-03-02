import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const PROFILE_URL = "https://www.linkedin.com/in/aanchal-kaushik-98050a203/";

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const browser = new BrowserManager();
  try {
    console.log("🚀 Launching browser...");
    await browser.launch({ headless: true });
    const page = browser.getPage();
    await page.context().addCookies(cookies);
    
    const vanityName = "aanchal-kaushik-98050a203";
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
    
    console.log("Extracted IDs:", JSON.stringify(state));
  } catch (err) {
    console.error("Fatal Error:", err);
  } finally {
    await browser.close();
  }
}
main();
