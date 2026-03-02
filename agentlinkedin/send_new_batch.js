import { LinkedInConnectService } from './src/services/connect.js';
import { readFileSync } from 'fs';

const profiles = [
  { name: 'Blake Mattos', url: 'https://www.linkedin.com/in/blakemattos' },
  { name: 'Nanzui Palomino', url: 'https://www.linkedin.com/in/nanzui-palomino-3882b68' },
  { name: 'Himanshu Bharadwaj', url: 'https://www.linkedin.com/in/himanb' },
  { name: 'Sheryl Maloney', url: 'https://www.linkedin.com/in/sherylmaloney' },
  { name: 'Trevor Jones', url: 'https://www.linkedin.com/in/jonesctrevor' },
  { name: 'Kevin Strasser', url: 'https://www.linkedin.com/in/kevinstrasser' },
  { name: 'Richard Banfield', url: 'https://www.linkedin.com/in/richardbanfield' },
  { name: 'Ken Otte', url: 'https://www.linkedin.com/in/kenotte' },
  { name: 'Koji Pereira', url: 'https://www.linkedin.com/in/kojieumesmo' },
  { name: 'Vazken Kalayjian', url: 'https://www.linkedin.com/in/vaskenkalayjian' },
  { name: 'Jessica Campbell', url: 'https://www.linkedin.com/in/campbell-jessica' },
  { name: 'Nathaniel Victor', url: 'https://www.linkedin.com/in/nathaniel-victor-836a995' }
];

async function sendConnections() {
  console.log('=== LinkedIn Connection Batch ===');
  console.log(`Total profiles: ${profiles.length}\n`);

  const cookiesRaw = readFileSync('./cookies.json', 'utf-8');
  const cookies = JSON.parse(cookiesRaw);
  if (!cookies) {
    console.error('❌ No cookies found!');
    return;
  }

  console.log(`✓ Loaded ${cookies.length} cookies\n`);

  const service = new LinkedInConnectService(cookies);
  await service.init();

  const results = [];
  let sentCount = 0;
  let alreadySentCount = 0;
  let failedCount = 0;

  for (let i = 0; i < profiles.length; i++) {
    const { name, url } = profiles[i];

    console.log(`\n[${ i + 1}/${profiles.length}] ${name}`);
    console.log('─'.repeat(70));
    console.log(`URL: ${url}`);

    try {
      const result = await service.sendConnectRequest(url);
      results.push({ name, url, result });

      if (result.success) {
        if (result.status === 'sent') {
          sentCount++;
          console.log(`✅ NEW CONNECTION SENT`);
        } else if (result.status === 'already_sent') {
          alreadySentCount++;
          console.log(`✓ Already sent previously`);
        }
      } else {
        failedCount++;
        console.log(`❌ FAILED: ${result.status}`);
      }

      if (i < profiles.length - 1) {
        console.log(`\n⏳ Waiting 5s before next profile...`);
        await new Promise(r => setTimeout(r, 5000));
      }

    } catch (err) {
      failedCount++;
      console.error(`❌ ERROR: ${err.message}`);
      results.push({ name, url, error: err.message });
    }
  }

  // Final wait before closing browser
  const finalWait = 5000 + Math.random() * 5000; // 5-10 seconds
  console.log(`\n⏳ Waiting ${Math.round(finalWait/1000)}s before closing browser...\n`);
  await new Promise(r => setTimeout(r, finalWait));

  await service.close();

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(70));

  console.log(`\n📊 Statistics:`);
  console.log(`  ✅ New connections sent: ${sentCount}`);
  console.log(`  ✓  Already sent: ${alreadySentCount}`);
  console.log(`  ❌ Failed/Not available: ${failedCount}`);
  console.log(`  📋 Total processed: ${results.length}`);

  console.log(`\n📝 Detailed Results:`);
  results.forEach(({ name, result, error }, idx) => {
    if (error) {
      console.log(`  ${idx + 1}. ❌ ${name}: ERROR - ${error}`);
    } else if (result.status === 'sent') {
      console.log(`  ${idx + 1}. ✅ ${name}: NEW CONNECTION SENT`);
    } else if (result.status === 'already_sent') {
      console.log(`  ${idx + 1}. ✓  ${name}: Already sent`);
    } else {
      console.log(`  ${idx + 1}. ❌ ${name}: ${result.status}`);
    }
  });

  console.log('\n' + '='.repeat(70));
  process.exit(0);
}

sendConnections().catch(console.error);
