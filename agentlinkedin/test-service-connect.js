import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';
import { LinkedInConnectService } from './src/services/connect.js';

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

async function testConnectService() {
  const browser = new BrowserManager();
  const cookies = await parseNetscapeCookies('cookies.txt');
  const profileUrl = 'https://www.linkedin.com/in/aarshiyaguneja/';

  try {
    console.log('Launching browser with stealth flags...');
    await browser.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
      ],
    });

    console.log('Loading cookies...');
    await browser.getPage().context().addCookies(cookies);

    console.log('Navigating to feed to validate session...');
    await browser.getPage().goto('https://www.linkedin.com/feed/', { waitUntil: 'load', timeout: 120000 });

    const currentUrl = browser.getPage().url();
    if (currentUrl.includes('login')) {
      throw new Error('Cookies invalid or expired');
    }
    console.log('Session valid.');

    const connectService = new LinkedInConnectService(browser);
    console.log(`Starting connection request to: ${profileUrl}`);
    
    await new Promise(r => setTimeout(r, 5000));
    await browser.getPage().screenshot({ path: 'test_priya_profile.png' });
    
    const result = await connectService.sendConnectRequest(profileUrl);
    
    console.log('Test Result:', result);

  } catch (err) {
    console.error('Test Failed:', err.message);
  } finally {
    await browser.close();
  }
}

testConnectService();
