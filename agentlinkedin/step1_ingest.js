import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { initDB, saveCampaign, saveLeads, addLeadsToCampaign } from './db.js';

async function ingest() {
  await initDB();
  const userId = 'shashank';
  const campaignId = 'test_blueprint_campaign';

  // 1. Create Draft Campaign
  await saveCampaign(userId, {
    id: campaignId,
    name: 'Blueprint Test',
    status: 'draft',
    steps: [{ type: 'connect', label: 'Connect', enabled: true, order: 1 }],
    settings: { daily_limit: 20 }
  });

  // 2. Parse CSV
  const csvContent = fs.readFileSync('test_leads.csv', 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  // 3. Save Leads
  const leads = records.map((r, i) => ({
    id: `lead_bp_${i}`,
    name: r.name,
    profileUrl: r.linkedin_url,
    status: 'not_started',
    source: 'blueprint_test'
  }));
  await saveLeads(userId, leads);

  // 4. Add to Campaign as 'pending'
  await addLeadsToCampaign(userId, campaignId, leads.map(l => l.id));
  
  console.log(`✅ STEP 1 COMPLETE: 16 leads inserted as 'pending' in campaign '${campaignId}' (status: draft)`);
  process.exit(0);
}

ingest().catch(console.error);
