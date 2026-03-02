const https = require('https');
const fs = require('fs');

const RAILWAY_URL = 'courteous-empathy-production-9e68.up.railway.app';
const COOKIES_PATH = './agentlinkedin/cookies.json';

// Read cookies
let cookies;
try {
  cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
  console.log('✅ Loaded cookies from', COOKIES_PATH);
} catch (err) {
  console.error('❌ Error loading cookies:', err.message);
  process.exit(1);
}

// Fetch leads from Railway
async function getLeads() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: RAILWAY_URL,
      port: 443,
      path: '/api/leads?userId=shashank',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Send connection request via Railway API
async function sendConnectionRequest(lead) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      action: 'linkedin-connect',
      profileUrl: lead.profile_url,
      cookies: cookies,
      leadId: lead.id
    });

    const options = {
      hostname: RAILWAY_URL,
      port: 443,
      path: '/api',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (err) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main execution
async function main() {
  try {
    console.log('\n📊 Fetching leads from Railway...');
    const response = await getLeads();

    if (!response.success) {
      throw new Error('Failed to fetch leads: ' + JSON.stringify(response));
    }

    console.log('Total leads fetched:', response.data.length);

    const leads = response.data.filter(lead => {
      const matches = lead.status === 'not_started' &&
                     lead.source === 'linkedin_first_100' &&
                     lead.profile_url;
      return matches;
    });

    console.log('Leads breakdown:');
    console.log('  - Total:', response.data.length);
    console.log('  - With source "linkedin_first_100":', response.data.filter(l => l.source === 'linkedin_first_100').length);
    console.log('  - With status "not_started":', response.data.filter(l => l.status === 'not_started').length);
    console.log('  - With profile_url:', response.data.filter(l => l.profile_url).length);

    console.log(`✅ Found ${leads.length} leads ready to connect\n`);

    if (leads.length === 0) {
      console.log('No leads with status "not_started" found');
      return;
    }

    // Limit to first 5 for safety
    const leadsToProcess = leads.slice(0, 5);
    console.log(`🚀 Processing ${leadsToProcess.length} leads (limited to 5 for safety)\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < leadsToProcess.length; i++) {
      const lead = leadsToProcess[i];
      console.log(`\n[${i + 1}/${leadsToProcess.length}] Connecting to: ${lead.name}`);
      console.log(`   Profile: ${lead.profile_url}`);

      try {
        const result = await sendConnectionRequest(lead);

        if (result.statusCode === 200 && result.body.success) {
          console.log(`   ✅ Success: ${result.body.message || 'Connected'}`);
          successCount++;
        } else {
          console.log(`   ⚠️  Failed: ${result.body.error || result.body.message || 'Unknown error'}`);
          failCount++;
        }
      } catch (err) {
        console.log(`   ❌ Error: ${err.message}`);
        failCount++;
      }

      // Wait between requests (5-10 seconds)
      if (i < leadsToProcess.length - 1) {
        const waitTime = 5000 + Math.random() * 5000;
        console.log(`   ⏳ Waiting ${(waitTime / 1000).toFixed(1)}s before next request...`);
        await delay(waitTime);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📈 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`📊 Total processed: ${leadsToProcess.length}`);
    console.log(`📋 Remaining: ${leads.length - leadsToProcess.length}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
