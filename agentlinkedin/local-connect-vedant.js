import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';
import chromium from "@sparticuz/chromium";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function humanIdle(page) {
  await sleep(2000 + Math.random() * 2000);
  await page.mouse.move(200, 300);
  await sleep(600);
  await page.mouse.move(400, 500);
  await sleep(1200);
}

export default async function runLinkedInConnect({
  profileUrl,
  cookies,
}) {
  const browserManager = new BrowserManager();
  let page;

  try {
    let executablePath;
    let args = [];
    let headless = true;

    if (process.env.VERCEL) {
      executablePath = await chromium.executablePath();
      args = chromium.args;
      headless = chromium.headless;
    }

    console.log('Launching browser (fresh context)…');

    await browserManager.launch({
      headless: false,
      executablePath,
      args: args.concat([
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
      ]),
    });

    page = browserManager.getPage();
    browserManager.startRequestTracking();

    console.log('Injecting cookies BEFORE any navigation');
    if (cookies && Array.isArray(cookies)) {
      await page.context().addCookies(cookies);
    }

    console.log('Opening feed to validate session');
    try {
      await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'load', timeout: 120000 });
    } catch (e) {
      console.error('Error navigating to feed:', e.message);
      await page.screenshot({ path: 'error_feed_navigation.png' });
      throw e;
    }

    await humanIdle(page);

    const feedUrl = page.url();
    if (!feedUrl.includes('/feed')) {
      throw new Error('Cookies invalid or expired. Current URL: ' + feedUrl);
    }

    console.log('Session confirmed');

    console.log('Navigating to profile');
    try {
      await page.goto(profileUrl, { waitUntil: 'load', timeout: 120000 });
    } catch (e) {
      console.error('Error navigating to profile:', e.message);
      await page.screenshot({ path: 'error_profile_navigation.png' });
      throw e;
    }
    
    await humanIdle(page);

    console.log('Taking ONE snapshot (safe)');
    const snapshot = await browserManager.getSnapshot();

    const connectRef = Object.entries(snapshot.refs).find(
      ([_, el]) =>
        el.role === 'button' &&
        el.name &&
        el.name.toLowerCase().includes('connect')
    )?.[0];

    if (!connectRef) {
      console.log('No Connect button available');
      return { status: 'skipped' };
    }

    console.log('Clicking Connect');
    await browserManager.getLocator(`@${connectRef}`).click();
    await sleep(2000);

    const modal = await browserManager.getSnapshot();
    const sendRef = Object.entries(modal.refs).find(
      ([_, el]) =>
        el.role === 'button' &&
        el.name &&
        (
          el.name.toLowerCase().includes('send now') ||
          el.name.toLowerCase().includes('without a note')
        )
    )?.[0];

    if (sendRef) {
      console.log('Sending connection request');
      await browserManager.getLocator(`@${sendRef}`).click();
    } else {
      console.log('No send button found');
    }

    return { status: 'success' };

  } catch (err) {
    console.error('Error:', err.message);
    return { status: 'error', error: err.message };
  } finally {
    if (browserManager) {
      await browserManager.close();
    }
  }
}

async function main() {
  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
  const profileUrl = 'https://www.linkedin.com/in/vedant-pimprikar-3ba760246/';
  console.log(`Attempting to send connection request to ${profileUrl}`);
  const result = await runLinkedInConnect({ profileUrl, cookies });
  console.log('Result:', result);
}

main().catch(console.error);