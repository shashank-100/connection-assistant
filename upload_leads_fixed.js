const fs = require('fs');
const { parse } = require('csv-parse/sync');
const https = require('https');

const RAILWAY_URL = 'courteous-empathy-production-9e68.up.railway.app';
const CSV_FILE = '/Users/shashank/Documents/GitHub/connection-assistant/linkedin_first_100.csv';

// Upload leads to Railway
async function uploadLeads(leads) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      userId: 'shashank',
      leads: leads
    });

    const options = {
      hostname: RAILWAY_URL,
      port: 443,
      path: '/api/leads',
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
        console.log('Status Code:', res.statusCode);
        console.log('Response:', data);
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', (error) => {
      console.error('Error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main execution
async function main() {
  try {
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');

    console.log('Parsing CSV with csv-parse...');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      relax_quotes: true
    });

    console.log(`Found ${records.length} records in CSV`);
    console.log('Sample record:', records[0]);

    const leads = records
      .filter(record => record.linkLinkedin && record.linkLinkedin.includes('linkedin.com/in/'))
      .map(record => ({
        id: record.id,
        name: record.name || `${record.firstName || ''} ${record.lastName || ''}`.trim(),
        title: record.bio ? record.bio.substring(0, 500) : '',
        company: '',
        profileUrl: record.linkLinkedin,  // camelCase to match db.js
        profilePicture: record.pictureProfile || record.pictureBubble || null,  // camelCase
        status: 'not_started',
        source: 'linkedin_first_100',
        sentAt: null,
        connectedAt: null
      }));

    console.log(`\nTransformed ${leads.length} leads with LinkedIn URLs`);
    console.log('\nFirst lead sample:');
    console.log(JSON.stringify(leads[0], null, 2));

    console.log('\nUploading to Railway...');
    const result = await uploadLeads(leads);

    console.log('\n✅ Upload complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
