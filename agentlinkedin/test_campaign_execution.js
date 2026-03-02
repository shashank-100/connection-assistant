import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { initDB, saveCampaign, saveLeads, addLeadsToCampaign, updateCampaignStatus } from './db.js';
import { CampaignRunner } from './src/campaign-runner.js';

async function runTest() {
  console.log('🚀 STEP 0: Initializing DB...');
  await initDB();

  const userId = 'shashank';
  const campaignId = 'test_campaign_' + Date.now();

  // ✅ STEP 1 — Insert Prospects Properly
  console.log('✅ STEP 1: Creating Draft Campaign and Inserting Prospects...');
  
  const csvContent = fs.readFileSync('test_leads.csv', 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  await saveCampaign(userId, {
    id: campaignId,
    name: 'Test LinkedIn Campaign',
    status: 'draft',
    steps: [{ type: 'connect', label: 'Connect Request', enabled: true, order: 1 }],
    settings: { daily_limit: 20 }
  });

  const leads = records.map((r, i) => ({
    id: `lead_${campaignId}_${i}`,
    name: r.name,
    profileUrl: r.linkedin_url,
    status: 'not_started',
    source: 'test_csv'
  }));

  await saveLeads(userId, leads);
  await addLeadsToCampaign(userId, campaignId, leads.map(l => l.id));

  console.log(`Inserted ${leads.length} prospects in 'pending' status.`);

  // ✅ STEP 2 — Start Route (Flip Status)
  console.log('✅ STEP 2: Flipping Campaign Status to Active...');
  await updateCampaignStatus(campaignId, 'active');

  // ✅ STEP 3 — Worker Loop (The Engine)
  console.log('✅ STEP 3: Starting the Worker Loop Engine...');
  const runner = new CampaignRunner();
  
  // For the test, we'll speed up the delay slightly to see it work
  runner.minDelay = 5000; 
  runner.maxDelay = 10000;
  
  runner.start().catch(err => {
    console.error('Runner failed:', err);
  });

  console.log('Worker is now running. Observe the logs below...');
}

runTest().catch(console.error);
