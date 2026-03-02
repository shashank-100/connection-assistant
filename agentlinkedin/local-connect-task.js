import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { LinkedInConnectService } from './src/services/connect.js';

async function main() {
  const csvFilePath =
    '/Users/shashank/Documents/GitHub/connection-assistant/agentlinkedin/test_leads.csv';
  const cookiesFilePath =
    '/Users/shashank/Documents/GitHub/connection-assistant/agentlinkedin/cookies.json';

  console.log('Reading CSV file...');
  const fileContent = fs.readFileSync(csvFilePath);
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const profiles = records
    .map(r => r.linkedin_url)
    .filter(url => url && url.includes('linkedin.com/in/'));

  if (profiles.length === 0) {
    console.log('No valid LinkedIn profiles found');
    return;
  }

  console.log(`Found ${profiles.length} profiles to process\n`);

  // Load cookies
  let cookies = null;
  if (fs.existsSync(cookiesFilePath)) {
    console.log('Loading cookies...');
    cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf-8'));
  }

  const connectService = new LinkedInConnectService(cookies);

  try {
    console.log('Initializing browser...');
    await connectService.init();

    const results = [];

    for (let i = 0; i < profiles.length; i++) {
      console.log(`\n[${i + 1}/${profiles.length}] Processing: ${profiles[i]}`);

      const result = await connectService.sendConnectRequest(profiles[i]);
      results.push(result);

      // Wait between profiles to avoid rate limiting
      if (i < profiles.length - 1) {
        const waitTime = 5000 + Math.random() * 3000; // 5-8 seconds
        console.log(`Waiting ${Math.round(waitTime/1000)}s before next profile...`);
        await new Promise(r => setTimeout(r, waitTime));
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('SUMMARY');
    console.log('='.repeat(50));

    const sent = results.filter(r => r.status === 'sent').length;
    const alreadySent = results.filter(r => r.status === 'already_sent').length;
    const failed = results.filter(r => !r.success).length;

    console.log(`✅ Sent: ${sent}`);
    console.log(`⏭️  Already sent: ${alreadySent}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
      console.log('\nFailed profiles:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.profileUrl}: ${r.status}`);
      });
    }

  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    console.error(err.stack);
  } finally {
    await connectService.close();
    console.log('\nTask finished');
  }
}

main();
