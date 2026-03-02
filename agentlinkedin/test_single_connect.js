import { LinkedInConnectService } from './src/services/connect.js';
import { getCookies } from './db.js';

async function test() {
  console.log('=== Single Connect Test ===');

  const cookies = await getCookies('shashank');
  console.log(`Loaded ${cookies?.length || 0} cookies`);

  const service = new LinkedInConnectService(cookies);
  await service.init();

  const testProfile = 'https://www.linkedin.com/in/divyawaghmare';
  console.log(`Testing: ${testProfile}`);

  try {
    const result = await service.sendConnectRequest(testProfile);
    console.log('\n=== RESULT ===');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  }

  await service.close();
  process.exit(0);
}

test();
