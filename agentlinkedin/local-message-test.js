import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';
import chromium from "@sparticuz/chromium";
import { LinkedInMessageService } from './src/services/message.js';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function parseNetscapeCookies(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const cookies = [];

  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const parts = line.split('\t');
    if (parts.length < 7) continue;

    cookies.push({
      name: parts[5],
      value: parts[6].replace(/^"(.*)"$/, '$1'),
      domain: parts[0],
      path: parts[2],
      secure: parts[3] === 'TRUE',
      httpOnly: false,
      expires: parseInt(parts[4], 10),
    });
  }
  return cookies;
}

export default async function runLinkedInMessage({
  profileUrl,
  message,
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

    const feedUrl = page.url();
    if (feedUrl.includes('login')) {
      throw new Error('Cookies invalid or expired. Current URL: ' + feedUrl);
    }

    console.log('Session confirmed');

    const messageService = new LinkedInMessageService(browserManager);
    console.log(`Starting message service logic for: ${profileUrl}`);
    const result = await messageService.sendMessage(profileUrl, message);
    
    return result;

  } catch (err) {
    console.error('Error:', err.message);
    return { status: 'error', error: err.message };
  } finally {
    if (browserManager) {
      await sleep(2000);
      await browserManager.close();
    }
  }
}

async function main() {
  const cookies = await parseNetscapeCookies('cookies.txt');
  const profileUrl = 'https://www.linkedin.com/in/kiran-bari-a31361168/';
  const testMessage = "Hi Kiran, I'd like to connect and discuss potential opportunities.";
  
  console.log(`Attempting to send message to ${profileUrl}`);
  const result = await runLinkedInMessage({ profileUrl, message: testMessage, cookies });
  console.log('Result:', result);
}

main().catch(console.error);
