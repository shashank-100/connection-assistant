import fs from 'fs';
import { LinkedInConnectService } from './src/services/connect.js';

async function main() {
  const cookiesFilePath = '/Users/shashank/Documents/GitHub/connection-assistant/agentlinkedin/cookies.json';
  const testProfile = 'https://www.linkedin.com/in/bradenswatt/';

  let cookies = null;
  if (fs.existsSync(cookiesFilePath)) {
    console.log('Loading cookies...');
    cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf-8'));
  }

  const connectService = new LinkedInConnectService(cookies);

  try {
    console.log('Initializing browser...');
    await connectService.init();

    console.log(`\nTesting profile: ${testProfile}`);
    const result = await connectService.sendConnectRequest(testProfile);

    console.log('\n=== RESULT ===');
    console.log(JSON.stringify(result, null, 2));

  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  } finally {
    await connectService.close();
    console.log('\nDone');
  }
}

main();
