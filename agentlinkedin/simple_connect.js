import { BrowserManager } from 'agent-browser/dist/browser.js';
import fs from 'fs';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function connectToProfile() {
  // Convert cookies
  const netscapeText = fs.readFileSync('./cookies_netscape.txt', 'utf-8');
  const lines = netscapeText.split('\n');
  const cookies = [];

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length < 7) continue;
    const [domain, _, path, secure, expiry, name, value] = parts;
    cookies.push({
      name, value,
      domain: domain.startsWith('.') ? domain.substring(1) : domain,
      path,
      expires: parseInt(expiry),
      httpOnly: false,
      secure: secure === 'TRUE',
      sameSite: 'Lax'
    });
  }

  const browser = new BrowserManager();

  try {
    console.log('🌐 Launching browser...');
    await browser.launch({ headless: false });

    console.log('🔐 Loading cookies...');
    const context = browser.contexts[0];
    await context.addCookies(cookies);

    console.log('🏠 Navigating to LinkedIn feed FIRST...');
    const page = browser.getPage();
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'networkidle' });
    await wait(3000);

    const feedUrl = page.url();
    console.log('Feed URL:', feedUrl);

    if (feedUrl.includes('login') || feedUrl.includes('authwall')) {
      throw new Error('Not logged in - cookies expired or invalid');
    }

    console.log('✅ Logged in successfully!\n');

    // NOW go to the profile
    const targetProfile = 'https://www.linkedin.com/in/aditya-bagde-691a97233/';
    console.log(`🔗 Navigating to profile: ${targetProfile}`);
    await page.goto(targetProfile, { waitUntil: 'networkidle' });
    await wait(3000);

    console.log('📸 Taking snapshot...');
    const snapshot = await browser.snapshot();

    // Check for Pending button
    const pendingButton = Object.values(snapshot.refs).find(
      el => el.role === 'button' && el.name?.toLowerCase().includes('pending')
    );

    if (pendingButton) {
      console.log('⚠️  Connection already pending!');
      return;
    }

    // Find Connect button
    let connectRef = Object.keys(snapshot.refs).find(id => {
      const el = snapshot.refs[id];
      return el.role === 'button' && el.name?.toLowerCase().includes('connect');
    });

    if (!connectRef) {
      // Try More button
      const moreRef = Object.keys(snapshot.refs).find(id => {
        const el = snapshot.refs[id];
        return el.role === 'button' && (el.name === 'More' || el.name === 'More actions');
      });

      if (!moreRef) {
        console.log('❌ No Connect or More button found');
        console.log('\nAvailable buttons:');
        Object.entries(snapshot.refs)
          .filter(([_, el]) => el.role === 'button' && el.name)
          .slice(0, 10)
          .forEach(([ref, el]) => console.log(`  @${ref}: "${el.name}"`));
        return;
      }

      console.log('🖱️  Clicking More button...');
      await page.locator(`[data-test-app-aware-link="${snapshot.refs[moreRef].selector}"]`).first().click();
      await wait(2000);

      const dropdownSnapshot = await browser.snapshot();
      connectRef = Object.keys(dropdownSnapshot.refs).find(id => {
        const el = dropdownSnapshot.refs[id];
        return el.name?.toLowerCase().includes('connect');
      });

      if (!connectRef) {
        console.log('❌ Connect not found in More dropdown');
        return;
      }
    }

    console.log('🖱️  Clicking Connect button...');
    const connectEl = snapshot.refs[connectRef];
    await page.locator(connectEl.selector).first().click();
    await wait(2000);

    // Handle modal
    console.log('📸 Checking modal...');
    const modalSnapshot = await browser.snapshot();

    const sendRef = Object.keys(modalSnapshot.refs).find(id => {
      const el = modalSnapshot.refs[id];
      return el.role === 'button' &&
             (el.name?.includes('Send without a note') ||
              el.name?.includes('Send now') ||
              el.name?.toLowerCase() === 'send');
    });

    if (!sendRef) {
      console.log('❌ Send button not found in modal');
      console.log('\nModal buttons:');
      Object.entries(modalSnapshot.refs)
        .filter(([_, el]) => el.role === 'button' && el.name)
        .forEach(([ref, el]) => console.log(`  @${ref}: "${el.name}"`));
      return;
    }

    console.log('🖱️  Clicking Send button...');
    const sendEl = modalSnapshot.refs[sendRef];
    await page.locator(sendEl.selector).first().click();

    console.log('\n✅ Connection request sent successfully!');

    console.log('\nBrowser will stay open for 30 seconds...');
    await wait(30000);

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.log('\nBrowser will stay open for inspection...');
    await wait(60000);
  } finally {
    await browser.close();
    console.log('✅ Done!');
  }
}

connectToProfile();
