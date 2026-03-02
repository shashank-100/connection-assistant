import { LinkedInConnectService } from './src/services/connect.js';
import { getCookies } from './db.js';

const profiles = [
  'https://www.linkedin.com/in/vishaljain',
  'https://www.linkedin.com/in/harshalsuple',
  'https://www.linkedin.com/in/chetnaganatra',
  'https://www.linkedin.com/in/ektarawat',
  'https://www.linkedin.com/in/parthraut',
  'https://www.linkedin.com/in/prafullchaware',
  'https://www.linkedin.com/in/shrishukhalkar',
  'https://www.linkedin.com/in/divyawaghmare'
];

async function testConnect() {
  console.log('Loading cookies for user: shashank');
  const cookies = await getCookies('shashank');

  if (!cookies) {
    console.error('No cookies found!');
    return;
  }

  console.log(`Loaded ${cookies.length} cookies`);

  const service = new LinkedInConnectService(cookies);
  await service.init();

  console.log('\n=== Starting connection requests ===\n');

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];
    console.log(`\n[${i + 1}/${profiles.length}] Processing: ${profile}`);

    try {
      const result = await service.sendConnectRequest(profile);
      console.log('Result:', result);

      if (!result.success) {
        console.log('❌ Failed:', result.status);
      } else {
        console.log('✓ Success:', result.status);
      }

      // Add delay between connections (60-90 seconds)
      if (i < profiles.length - 1) {
        const delay = Math.floor(Math.random() * 30000) + 60000; // 60-90 seconds
        console.log(`Waiting ${Math.round(delay/1000)}s before next request...`);
        await new Promise(r => setTimeout(r, delay));
      }

    } catch (err) {
      console.error('Error:', err.message);
    }
  }

  await service.close();
  console.log('\n=== Test completed ===');
  process.exit(0);
}

testConnect().catch(console.error);
