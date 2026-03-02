const fs = require('fs');
const https = require('https');

// Railway API endpoint
const RAILWAY_URL = 'https://courteous-empathy-production-9e68.up.railway.app';
const CSV_FILE = '/Users/shashank/Documents/GitHub/connection-assistant/linkedin_first_100.csv';

// Parse CSV function
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const leads = [];

  console.log('CSV Headers:', headers);

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    // Parse CSV with quoted fields
    for (let char of lines[i]) {
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue); // Push last value

    const lead = {};
    headers.forEach((header, index) => {
      lead[header] = values[index] ? values[index].trim().replace(/^"(.*)"$/, '$1') : '';
    });

    // Transform to the format expected by the API
    const transformedLead = {
      id: lead.id || lead.memberId || `linkedin_${Date.now()}_${i}`,
      name: lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim(),
      title: lead.bio ? lead.bio.substring(0, 200) : '',
      company: '',
      profile_url: lead.linkLinkedin || lead.profileUrl,
      profile_picture: lead.pictureProfile || lead.pictureBubble,
      status: 'not_started',
      source: 'linkedin_first_100',
      sent_at: null,
      connected_at: null
    };

    if (transformedLead.profile_url) {
      leads.push(transformedLead);
    }
  }

  return leads;
}

// Upload leads to Railway
async function uploadLeads(leads) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      userId: 'shashank',
      leads: leads
    });

    const options = {
      hostname: 'courteous-empathy-production-9e68.up.railway.app',
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

      res.on('data', (chunk) => {
        data += chunk;
      });

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

    console.log('Parsing CSV...');
    const leads = parseCSV(csvContent);

    console.log(`Found ${leads.length} leads to upload`);
    console.log('First lead sample:', JSON.stringify(leads[0], null, 2));

    console.log('\nUploading to Railway...');
    const result = await uploadLeads(leads);

    console.log('\n✅ Upload complete!');
    console.log('Result:', result);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
