import { LinkedInConnectService } from './src/services/connect.js';
import { getCookies } from './db.js';

const remainingProfiles = [
  'https://www.linkedin.com/in/ektarawat',
  'https://www.linkedin.com/in/prafullchaware',
  'https://www.linkedin.com/in/shrishukhalkar',
  'https://www.linkedin.com/in/divyawaghmare'
];

async function sendConnections() {
  console.log('=== Sending Connection Requests ===\n');

  const cookies = await getCookies('shashank');
  if (!cookies) {
    console.error('No cookies found!');
    return;
  }

  console.log(`Loaded ${cookies.length} cookies\n`);

  const service = new LinkedInConnectService(cookies);
  await service.init();

  const results = [];

  for (let i = 0; i < remainingProfiles.length; i++) {
    const profile = remainingProfiles[i];
    console.log(`\n[${ i + 1}/${remainingProfiles.length}] Processing: ${profile}`);
    console.log('─'.repeat(60));

    try {
      const result = await service.sendConnectRequest(profile);
      results.push({ profile, result });

      if (result.success) {
        console.log(`✓ SUCCESS: ${result.status}`);
      } else {
        console.log(`✗ FAILED: ${result.status}`);
      }

      // Human-like delay between profiles (90-150 seconds)
      if (i < remainingProfiles.length - 1) {
        const delay = 90000 + Math.random() * 60000; // 90-150 seconds
        console.log(`\n⏳ Waiting ${Math.round(delay/1000)}s before next profile...\n`);
        await new Promise(r => setTimeout(r, delay));
      }

    } catch (err) {
      console.error(`✗ ERROR: ${err.message}`);
      results.push({ profile, error: err.message });
    }
  }

  // Final wait before closing browser
  const finalWait = 5000 + Math.random() * 5000; // 5-10 seconds
  console.log(`\n⏳ Waiting ${Math.round(finalWait/1000)}s before closing...\n`);
  await new Promise(r => setTimeout(r, finalWait));

  await service.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.result?.success);
  const failed = results.filter(r => !r.result?.success || r.error);

  console.log(`✓ Successful: ${successful.length}`);
  console.log(`✗ Failed: ${failed.length}`);
  console.log(`Total: ${results.length}`);

  console.log('\nDetails:');
  results.forEach(({ profile, result, error }) => {
    const name = profile.split('/').pop();
    if (error) {
      console.log(`  ✗ ${name}: ERROR - ${error}`);
    } else if (result.success) {
      console.log(`  ✓ ${name}: ${result.status}`);
    } else {
      console.log(`  ✗ ${name}: ${result.status}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  process.exit(0);
}

sendConnections().catch(console.error);
