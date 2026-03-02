import { updateCampaignStatus, initDB } from './db.js';

async function start() {
  await initDB();
  const campaignId = 'test_blueprint_campaign';

  // Strictly flip status
  await updateCampaignStatus(campaignId, 'active');
  
  console.log(`✅ STEP 2 COMPLETE: Campaign '${campaignId}' set to 'active'.`);
  process.exit(0);
}

start().catch(console.error);
