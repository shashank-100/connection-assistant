import { LinkedInConnectService } from './src/services/connect.js';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const PROFILE_URL = "https://www.linkedin.com/in/bimlendu-kumar-930497ab/";

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const browser = new BrowserManager();
  try {
    await browser.launch({ headless: true });
    await browser.getPage().context().addCookies(cookies);
    
    const vanityName = "bimlendu-kumar-930497ab";
    const page = browser.getPage();
    let profileHtml = "";
    
    page.on('response', async (resp) => {
      if (resp.url().includes(`/in/${vanityName}`) && (resp.headers()['content-type'] || '').includes('text/html')) {
        profileHtml = await resp.text().catch(() => "");
      }
    });

    await page.goto(PROFILE_URL, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 2000));

    const service = new LinkedInConnectService();
    const state = service._parseProfileState(profileHtml, vanityName);
    
    console.log(JSON.stringify(state));
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}
main();
