import 'dotenv/config';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { saveLeads, saveCampaign, addLeadsToCampaign, updateCampaignStatus } from './db-supabase.js';

const USER_ID = 'shashank';
const SOURCE = 'linkedin_leads_full';
const CAMPAIGN_NAME = 'LinkedIn Outreach - Agency CEOs/COOs';

const csv = readFileSync('./linkedin_leads_full.csv', 'utf-8');
const rows = parse(csv, { columns: true, skip_empty_lines: true, relax_column_count: true, relax_quotes: true, quote: '"' });

// Map CSV rows to lead objects
const leads = rows
  .filter(r => r['LinkedIn Profile URL'] || r['Profile URL'])
  .map(r => {
    const profileUrl = r['LinkedIn Profile URL'] || r['Profile URL'];
    const vmid = r['VMID'] || profileUrl.split('/in/')[1]?.replace('/', '') || `lead_${Date.now()}_${Math.random()}`;
    return {
      id: vmid,
      name: r['Full Name']?.trim(),
      title: r['Headline']?.trim(),
      company: r['Company']?.trim(),
      profileUrl: profileUrl?.trim(),
      profilePicture: r['Profile Image URL']?.trim(),
      source: SOURCE,
      status: 'not_started',
    };
  });

console.log(`📋 Parsed ${leads.length} leads from CSV`);

// 1. Upload leads directly to Supabase
console.log('📤 Uploading leads...');
await saveLeads(USER_ID, leads);
console.log(`✅ Uploaded ${leads.length} leads (source: ${SOURCE})`);

// 2. Create campaign
const campaignId = 'campaign_' + Date.now();
console.log('🎯 Creating campaign...');
await saveCampaign(USER_ID, {
  id: campaignId,
  name: CAMPAIGN_NAME,
  status: 'draft',
  steps: [{ id: '1', type: 'connection_request', label: 'Connection Request', enabled: true, order: 1 }],
  settings: {},
});
console.log(`✅ Campaign created: ${campaignId}`);

// 3. Add all leads to campaign
console.log('👥 Adding leads to campaign...');
const leadIds = leads.map(l => l.id);
const result = await addLeadsToCampaign(USER_ID, campaignId, leadIds);
console.log(`✅ Added ${result.count} leads to campaign`);

// 4. Start campaign
console.log('🚀 Starting campaign...');
await updateCampaignStatus(campaignId, 'active');

console.log(`\n🎉 Campaign "${CAMPAIGN_NAME}" is now ACTIVE!`);
console.log(`   Campaign ID: ${campaignId}`);
console.log(`   Leads: ${result.count}`);
console.log(`   The Railway background runner will pick it up within 5 seconds.`);
