import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const PROFILE_URL = "https://www.linkedin.com/in/ryanjvig/";
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const cookiesPath = './cookies.json';
  if (!fs.existsSync(cookiesPath)) {
    console.error("No cookies.json found!");
    process.exit(1);
  }
  
  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
  const browser = new BrowserManager();
  
  try {
    console.log("🚀 Launching browser...");
    await browser.launch({ headless: true });
    
    const page = browser.getPage();
    await page.context().addCookies(cookies);
    
    console.log("🏠 Checking Authentication...");
    await page.goto("https://www.linkedin.com/feed/", { waitUntil: 'load', timeout: 60000 });
    
    if (page.url().includes("login")) {
      console.error("❌ Login failed. Cookies expired.");
      process.exit(1);
    }
    console.log("✅ Authenticated.");

    console.log(`🔗 Navigating to profile: ${PROFILE_URL}`);
    await page.goto(PROFILE_URL, { waitUntil: 'load', timeout: 60000 });
    await wait(5000);

    console.log("📸 Taking snapshot...");
    // Try both method names
    const snapshot = browser.snapshot ? await browser.snapshot() : await browser.getSnapshot({ interactive: true });

    // Check if already pending
    const isPending = Object.values(snapshot.refs).some(
      el => el.role === 'button' && el.name?.toLowerCase().includes('pending')
    );

    if (isPending) {
      console.log("⚠️ Connection already pending!");
      return;
    }

    // Find Connect button
    let connectRef = Object.keys(snapshot.refs).find(id => {
      const el = snapshot.refs[id];
      return el.role === 'button' && el.name?.toLowerCase().includes('connect');
    });

    if (!connectRef) {
      console.log("🖱️ Connect button not found. Checking 'More' menu...");
      const moreRef = Object.keys(snapshot.refs).find(id => {
        const el = snapshot.refs[id];
        return el.role === 'button' && (el.name === 'More' || el.name === 'More actions');
      });

      if (moreRef) {
        const moreEl = snapshot.refs[moreRef];
        await page.locator(moreEl.selector).first().click();
        await wait(2000);
        
        const dropdownSnapshot = browser.snapshot ? await browser.snapshot() : await browser.getSnapshot({ interactive: true });
        connectRef = Object.keys(dropdownSnapshot.refs).find(id => {
          const el = dropdownSnapshot.refs[id];
          return el.name?.toLowerCase().includes('connect');
        });
      }
    }

    if (connectRef) {
      console.log("🖱️ Clicking Connect...");
      const latestSnapshot = browser.snapshot ? await browser.snapshot() : await browser.getSnapshot({ interactive: true });
      const finalConnectEl = latestSnapshot.refs[connectRef];
      
      if (finalConnectEl) {
        await page.locator(finalConnectEl.selector).first().click();
        await wait(2000);

        console.log("📸 Handling Modal...");
        const modalSnapshot = browser.snapshot ? await browser.snapshot() : await browser.getSnapshot({ interactive: true });
        const sendRef = Object.keys(modalSnapshot.refs).find(id => {
          const el = modalSnapshot.refs[id];
          return el.role === 'button' && 
                 (el.name?.includes('Send without a note') || 
                  el.name?.includes('Send now') || 
                  el.name?.toLowerCase() === 'send');
        });

        if (sendRef) {
          console.log("🖱️ Clicking Send...");
          await page.locator(modalSnapshot.refs[sendRef].selector).first().click();
          await wait(2000);
          console.log("✅ Connection request sent successfully!");
        } else {
          console.log("❌ Send button not found in modal.");
        }
      }
    } else {
      console.log("❌ Could not find Connect button.");
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await browser.close();
  }
}

main();
