import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

// Convert Netscape cookies to Playwright storage state
function netscapeToCookies(netscapeText) {
  const lines = netscapeText.split('\n');
  const cookies = [];

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;

    const parts = line.split('\t');
    if (parts.length < 7) continue;

    const [domain, includeSubdomains, path, secure, expiry, name, value] = parts;

    cookies.push({
      name,
      value,
      domain: domain.startsWith('.') ? domain.substring(1) : domain,
      path,
      expires: parseInt(expiry),
      httpOnly: false,
      secure: secure === 'TRUE',
      sameSite: 'Lax'
    });
  }

  return {
    cookies,
    origins: []
  };
}

async function runConnect() {
  // Read and convert cookies
  const netscapeText = fs.readFileSync('./cookies_netscape.txt', 'utf-8');
  const storageState = netscapeToCookies(netscapeText);

  // Save as JSON
  fs.writeFileSync('./cookies_new.json', JSON.stringify(storageState, null, 2));
  console.log('✅ Converted cookies to Playwright format');

  const targetProfile = 'https://www.linkedin.com/in/aditya-bagde-691a97233/';
  const browser = new BrowserManager();

  try {
    console.log('\n🌐 Launching browser...');
    await browser.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
      ],
    });

    console.log('🔐 Loading cookies...');
    // Use execute to load state
    const context = browser.contexts[0];
    await context.addCookies(storageState.cookies);
    console.log('✅ Cookies loaded');

    console.log(`\n🔗 Opening profile: ${targetProfile}`);
    const page = browser.getPage();
    await page.goto(targetProfile, { waitUntil: 'networkidle2', timeout: 45000 });

    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    if (currentUrl.includes('login')) {
      throw new Error('Not logged in – cookies expired');
    }

    console.log('✅ Logged in successfully\n');

    await new Promise(r => setTimeout(r, 2000));

    console.log('📸 Taking snapshot...');
    const snapshot = await browser.snapshot();

    console.log('\nAvailable buttons:');
    Object.entries(snapshot.refs)
      .filter(([_, el]) => el.role === 'button' && el.name)
      .slice(0, 10)
      .forEach(([ref, el]) => {
        console.log(`  ${ref}: "${el.name}"`);
      });

    // Find Connect button
    let connectRef = Object.entries(snapshot.refs).find(
      ([_, el]) => el.role === 'button' && el.name?.toLowerCase().includes('connect')
    )?.[0];

    if (!connectRef) {
      // Try More button
      const moreRef = Object.entries(snapshot.refs).find(
        ([_, el]) => el.role === 'button' && (el.name === 'More' || el.name === 'More actions')
      )?.[0];

      if (!moreRef) {
        console.log('❌ No Connect or More button found');
        throw new Error('No Connect/More button');
      }

      console.log(`\n🖱️  Clicking More: @${moreRef}`);
      await browser.click(`@${moreRef}`);
      await new Promise(r => setTimeout(r, 2000));

      const dropdownSnapshot = await browser.snapshot();

      console.log('\nDropdown items:');
      Object.entries(dropdownSnapshot.refs)
        .filter(([_, el]) => el.name)
        .slice(0, 10)
        .forEach(([ref, el]) => {
          console.log(`  ${ref}: "${el.name}"`);
        });

      connectRef = Object.entries(dropdownSnapshot.refs).find(
        ([_, el]) => el.name?.toLowerCase().includes('connect')
      )?.[0];

      if (!connectRef) {
        console.log('❌ Connect not found in dropdown');
        throw new Error('No Connect in dropdown');
      }
    }

    console.log(`\n🖱️  Clicking Connect: @${connectRef}`);
    await browser.click(`@${connectRef}`);
    await new Promise(r => setTimeout(r, 2000));

    const modalSnapshot = await browser.snapshot();

    console.log('\nModal buttons:');
    Object.entries(modalSnapshot.refs)
      .filter(([_, el]) => el.role === 'button' && el.name)
      .forEach(([ref, el]) => {
        console.log(`  ${ref}: "${el.name}"`);
      });

    const sendRef = Object.entries(modalSnapshot.refs).find(
      ([_, el]) =>
        el.role === 'button' &&
        el.name &&
        (
          el.name.toLowerCase().includes('send without a note') ||
          el.name.toLowerCase().includes('send now') ||
          el.name.toLowerCase().includes('send')
        )
    )?.[0];

    if (!sendRef) {
      console.log('❌ Send button not found');
      throw new Error('No Send button');
    }

    console.log(`\n🖱️  Clicking Send: @${sendRef}`);
    await browser.click(`@${sendRef}`);

    console.log('\n✅ Connection request sent successfully!');

    console.log('\nBrowser will stay open for 60 seconds...');
    await new Promise(r => setTimeout(r, 60000));

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.log('\nBrowser will stay open for inspection...');
    await new Promise(r => setTimeout(r, 60000));
  } finally {
    await browser.close();
    console.log('✅ Done!');
  }
}

runConnect();
