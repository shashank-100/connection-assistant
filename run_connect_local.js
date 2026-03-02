import { BrowserManager } from 'agent-browser';
import fs from 'fs';
import https from 'https';

const RAILWAY_URL = 'courteous-empathy-production-9e68.up.railway.app';
const COOKIES_PATH = './agentlinkedin/cookies.json';

// Load cookies
const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
console.log('✅ Loaded cookies');

// Fetch leads from Railway
async function getLeads() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: RAILWAY_URL,
      port: 443,
      path: '/api/leads?userId=shashank',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(JSON.parse(data)));
    });

    req.on('error', reject);
    req.end();
  });
}

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

    console.log(`🖱️  Clicking More button...`);
    await browser.click(`@${moreRef}`);
    await sleep(1500);
    await humanIdle(browser);

    const dropdownSnapshot = await browser.snapshot();

    const dropdownConnectRef = Object.entries(dropdownSnapshot.refs).find(
      ([_, el]) => el.name?.toLowerCase().includes("connect")
    )?.[0];

    if (!dropdownConnectRef) {
      console.log('❌ Connect not found in dropdown');
      return { success: false, status: "not_found" };
    }

    connectRef = dropdownConnectRef;
  }

  console.log(`🖱️  Clicking Connect button...`);
  await browser.click(`@${connectRef}`);
  await sleep(1500);
  await humanIdle(browser);

  const modalSnapshot = await browser.snapshot();

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

  console.log(`🖱️  Clicking Send button...`);
  await browser.click(`@${sendRef}`);

  console.log('✅ Connection request sent!');
  return { success: true, status: "sent" };
}

// Main execution
async function main() {
  console.log('\n📊 Fetching leads from Railway...');
  const response = await getLeads();

  if (!response.success) {
    throw new Error('Failed to fetch leads');
  }

  const leads = response.data.filter(lead =>
    lead.status === 'not_started' &&
    lead.source === 'linkedin_first_100' &&
    lead.profile_url
  );

  console.log(`✅ Found ${leads.length} leads to connect\n`);

  // Limit to first 3 for testing
  const leadsToProcess = leads.slice(0, 3);
  console.log(`🚀 Processing ${leadsToProcess.length} leads (limited for testing)\n`);

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

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < leadsToProcess.length; i++) {
      const lead = leadsToProcess[i];
      console.log(`\n${'='.repeat(60)}`);
      console.log(`[${i + 1}/${leadsToProcess.length}] ${lead.name}`);
      console.log(`${'='.repeat(60)}`);

      try {
        const result = await sendConnectRequest(browser, lead.profile_url);

        if (result.success) {
          successCount++;
          console.log(`\n✅ Result: ${result.status}`);
        } else {
          failCount++;
          console.log(`\n⚠️  Result: ${result.status}`);
        }
      } catch (err) {
        failCount++;
        console.log(`\n❌ Error: ${err.message}`);
      }

      // Wait between requests
      if (i < leadsToProcess.length - 1) {
        const waitTime = 5000 + Math.random() * 5000;
        console.log(`\n⏳ Waiting ${(waitTime / 1000).toFixed(1)}s before next request...`);
        await sleep(waitTime);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total: ${leadsToProcess.length}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
  } finally {
    console.log('\n🔒 Closing browser...');
    await browser.close();
    console.log('✅ Done!');
  }
}

main();
