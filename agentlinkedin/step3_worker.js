import { initDB } from './db.js';
import { CampaignRunner } from './src/campaign-runner.js';

async function runWorker() {
  await initDB();
  console.log('✅ STEP 3: Starting Engine Worker Loop...');
  
  const runner = new CampaignRunner();
  runner.minDelay = 30000; // 30s for testing
  runner.maxDelay = 60000; // 60s for testing
  
  await runner.start();
}

runWorker().catch(console.error);
