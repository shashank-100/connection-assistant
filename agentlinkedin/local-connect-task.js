import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { BrowserManager } from 'agent-browser';

async function runLocalConnect() {
  const csvFilePath =
    '/Users/shashank/geodo-vercel-agent-browser/referral_1-40.csv';
  const cookiesFilePath =
    '/Users/shashank/geodo-vercel-agent-browser/agentlinkedin/cookies.json';

  console.log('Reading CSV file...');
  const fileContent = fs.readFileSync(csvFilePath);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const profiles = records
    .map(r => r.linkedin_profile_url)
    .filter(url => url && url.includes('linkedin.com/in/'));

  if (profiles.length === 0) {
    console.log('No valid LinkedIn profiles found');
    return;
  }

  const targetProfile = profiles[0];
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
    console.log('Task finished');
  }
}

runLocalConnect();
