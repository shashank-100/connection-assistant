import fs from 'fs';
import { BaseLinkedInService } from './src/services/base.js';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const cookiesFilePath = '/Users/shashank/Documents/GitHub/connection-assistant/agentlinkedin/cookies.json';
  const profileUrl = 'https://www.linkedin.com/in/venkata-padmasri-vaddadi-308807215/';

  let cookies = null;
  if (fs.existsSync(cookiesFilePath)) {
    console.log('Loading cookies...');
    cookies = JSON.parse(fs.readFileSync(cookiesFilePath, 'utf-8'));
  }

  const service = new BaseLinkedInService(cookies);

  try {
    console.log('Initializing browser...');
    await service.init();

    console.log(`Opening profile: ${profileUrl}`);
    const page = service.browser.getPage();
    await page.goto(profileUrl, { waitUntil: 'load', timeout: 45000 });

    await sleep(3000);

    console.log('\n=== Getting snapshot ===');
    const snapshot = await service.browser.getSnapshot({ interactive: true });

    // Write full snapshot to file for analysis
    const snapshotFile = '/Users/shashank/Documents/GitHub/connection-assistant/profile-snapshot.json';
    fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2));
    console.log(`Full snapshot written to: ${snapshotFile}`);

    console.log('\n=== All Connect-related buttons ===');
    const connectElements = Object.entries(snapshot.refs).filter(
      ([_, el]) =>
        (el.role === "button" || el.role === "link") &&
        el.name &&
        (
          el.name.toLowerCase().includes("connect") ||
          el.name.toLowerCase().includes("invite")
        )
    );

    connectElements.forEach(([ref, el], idx) => {
      console.log(`\n${idx + 1}. @${ref}`);
      console.log(`   Role: ${el.role}`);
      console.log(`   Name: "${el.name}"`);
    });

    console.log('\n\nBrowser will stay open for 60 seconds so you can inspect...');
    await sleep(60000);

  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  } finally {
    await service.close();
  }
}

main();
