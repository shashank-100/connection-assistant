import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

async function runLocalConnect() {
  const cookiesFilePath = './cookies.json';
  const targetProfile = 'https://www.linkedin.com/in/aditya-bagde-691a97233/';

  console.log('Target profile:', targetProfile);

  const browser = new BrowserManager();

  try {
    console.log('Launching browser...');
    await browser.launch({
      headless: false,
      userDataDir: './linkedin-session',
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
      ],
    });

    if (fs.existsSync(cookiesFilePath)) {
      console.log('Loading cookies...');
      await browser.loadState(cookiesFilePath);
    }

    console.log('Opening LinkedIn profile...');
    await browser.open(targetProfile);
    await browser.waitForLoad();

    const currentUrl = await browser.getUrl();
    console.log('Current URL:', currentUrl);

    if (currentUrl.includes('login')) {
      throw new Error('Not logged in – cookies expired');
    }

    console.log('Taking snapshot...');
    let snapshot = await browser.snapshot();

    // 1️⃣ Try direct Connect button
    let connectRef = Object.entries(snapshot.refs).find(
      ([_, el]) =>
        el.role === 'button' &&
        el.name &&
        el.name.toLowerCase().includes('connect')
    )?.[0];

    if (!connectRef) {
      // 2️⃣ Click "More"
      const moreRef = Object.entries(snapshot.refs).find(
        ([_, el]) =>
          el.role === 'button' &&
          el.name &&
          el.name.toLowerCase().includes('more')
      )?.[0];

      if (!moreRef) {
        throw new Error('Neither Connect nor More button found');
      }

      console.log('Clicking More...');
      await browser.click(`@${moreRef}`);
      await browser.wait(2000);

      snapshot = await browser.snapshot();
      connectRef = Object.entries(snapshot.refs).find(
        ([_, el]) =>
          el.name &&
          el.name.toLowerCase().includes('connect')
      )?.[0];

      if (!connectRef) {
        throw new Error('Connect not found in More dropdown');
      }
    }

    console.log('Clicking Connect...');
    await browser.click(`@${connectRef}`);
    await browser.wait(2000);

    // Modal
    snapshot = await browser.snapshot();
    const sendRef = Object.entries(snapshot.refs).find(
      ([_, el]) =>
        el.role === 'button' &&
        el.name &&
        (
          el.name.toLowerCase().includes('send without a note') ||
          el.name.toLowerCase().includes('send now')
        )
    )?.[0];

    if (!sendRef) {
      console.log('Send button not found – maybe already connected');
      return;
    }

    console.log('Sending request...');
    await browser.click(`@${sendRef}`);

    console.log('✅ Connection request sent successfully');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    console.log('Task finished - browser will stay open for 30 seconds');
    await new Promise(resolve => setTimeout(resolve, 30000));
    await browser.close();
  }
}

runLocalConnect();
