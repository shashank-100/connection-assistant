import { BrowserManager } from 'agent-browser';
import fs from 'fs';

const COOKIES_PATH = './agentlinkedin/cookies.json';
const TARGET_PROFILE = 'https://www.linkedin.com/in/aditya-bagde-691a97233/';

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Human-like idle behavior
async function humanIdle(browser) {
  await sleep(2000 + Math.random() * 2000);
  try {
    const page = browser.getPage();
    await page.mouse.move(200, 300);
    await sleep(600);
    await page.mouse.move(400, 500);
    await sleep(1200);
  } catch (e) {
    console.log("Mouse move failed:", e.message);
  }
}

// Send connection request
async function sendConnectRequest(browser, profileUrl) {
  console.log(`\n🔗 Opening profile: ${profileUrl}`);

  const page = browser.getPage();

  try {
    await page.goto(profileUrl, { waitUntil: 'networkidle2', timeout: 45000 });
    console.log('✅ Navigation completed');
  } catch (e) {
    console.error('❌ Navigation error:', e.message);
    throw new Error(`Failed to navigate: ${e.message}`);
  }

  await sleep(1500);
  await humanIdle(browser);
  console.log('✅ Human idle completed');

  console.log('📸 Taking snapshot...');
  const snapshot = await browser.snapshot();

  console.log('Available buttons:');
  Object.entries(snapshot.refs)
    .filter(([_, el]) => el.role === 'button')
    .forEach(([ref, el]) => {
      console.log(`  - ${ref}: "${el.name}"`);
    });

  // Check if already pending
  const pendingButton = Object.values(snapshot.refs).find(
    el => el.role === "button" && el.name?.toLowerCase().includes("pending")
  );

  if (pendingButton) {
    console.log('⚠️  Connection already pending');
    return { success: true, status: "already_sent" };
  }

  // Find Connect button
  let connectRef = Object.entries(snapshot.refs).find(
    ([_, el]) => el.role === "button" && el.name?.toLowerCase().includes("connect")
  )?.[0];

  if (!connectRef) {
    // Try More button
    const moreRef = Object.entries(snapshot.refs).find(
      ([_, el]) => el.role === "button" && (el.name === "More" || el.name === "More actions")
    )?.[0];

    if (!moreRef) {
      console.log('❌ No Connect or More button found');
      return { success: false, status: "not_available" };
    }

    console.log(`🖱️  Clicking More button: @${moreRef}`);
    await browser.click(`@${moreRef}`);
    await sleep(1500);
    await humanIdle(browser);

    const dropdownSnapshot = await browser.snapshot();

    console.log('\nDropdown buttons:');
    Object.entries(dropdownSnapshot.refs)
      .filter(([_, el]) => el.role === 'button' || el.role === 'menuitem')
      .forEach(([ref, el]) => {
        console.log(`  - ${ref}: "${el.name}"`);
      });

    const dropdownConnectRef = Object.entries(dropdownSnapshot.refs).find(
      ([_, el]) => el.name?.toLowerCase().includes("connect")
    )?.[0];

    if (!dropdownConnectRef) {
      console.log('❌ Connect not found in dropdown');
      return { success: false, status: "not_found" };
    }

    connectRef = dropdownConnectRef;
  }

  console.log(`🖱️  Clicking Connect button: @${connectRef}`);
  await browser.click(`@${connectRef}`);
  await sleep(1500);
  await humanIdle(browser);

  const modalSnapshot = await browser.snapshot();

  console.log('\nModal buttons:');
  Object.entries(modalSnapshot.refs)
    .filter(([_, el]) => el.role === 'button')
    .forEach(([ref, el]) => {
      console.log(`  - ${ref}: "${el.name}"`);
    });

  const sendRef = Object.entries(modalSnapshot.refs).find(
    ([_, el]) =>
      el.role === "button" &&
      el.name &&
      (
        el.name.toLowerCase().includes("send now") ||
        el.name.toLowerCase().includes("without a note") ||
        el.name.toLowerCase().includes("send")
      )
  )?.[0];

  if (!sendRef) {
    console.log('❌ Send button not found in modal');
    return { success: false, status: "modal_missing" };
  }

  console.log(`🖱️  Clicking Send button: @${sendRef}`);
  await browser.click(`@${sendRef}`);

  console.log('✅ Connection request sent!');
  return { success: true, status: "sent" };
}

// Main execution
async function main() {
  const browser = new BrowserManager();

  try {
    console.log('🌐 Launching browser...');
    await browser.launch({
      headless: false,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars'
      ]
    });

    console.log('🔐 Loading cookies...');
    await browser.loadState(COOKIES_PATH);

    console.log('🏠 Navigating to LinkedIn...');
    await browser.open('https://www.linkedin.com/feed/');
    await sleep(2000);

    const currentUrl = await browser.getUrl();
    if (currentUrl.includes('login')) {
      throw new Error('Not logged in - cookies expired');
    }

    console.log('✅ Logged in successfully\n');

    const result = await sendConnectRequest(browser, TARGET_PROFILE);

    console.log('\n' + '='.repeat(60));
    console.log('📈 RESULT');
    console.log('='.repeat(60));
    console.log(`Status: ${result.status}`);
    console.log(`Success: ${result.success}`);
    console.log('='.repeat(60) + '\n');

    // Keep browser open for inspection
    console.log('Browser will stay open. Press Ctrl+C to close.');
    await sleep(60000);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
  } finally {
    console.log('\n🔒 Closing browser...');
    await browser.close();
    console.log('✅ Done!');
  }
}

main();
