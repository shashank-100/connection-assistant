import { saveCampaign, addLeadsToCampaign, getLeads, getLeadLists } from '../db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId = 'shashank' } = req.body || req.query;

  try {
    // POST /api/campaigns - Create/Update Campaign
    if (req.method === 'POST') {
      const { action } = req.body;

      // LAUNCH: Add leads to campaign
      if (action === 'launch') {
        const { campaignId, source, excludeInNetwork, leadIds } = req.body;
        
        if (!campaignId) throw new Error('Campaign ID required');

        let targetLeadIds = leadIds || [];

        // If a source (list) is provided, fetch all leads from that source
        if (source && (!leadIds || leadIds.length === 0)) {
          const leads = await getLeads(userId, { source });
          targetLeadIds = leads.map(l => l.id);
        }

        if (targetLeadIds.length === 0) {
          return res.status(400).json({ success: false, error: 'No leads selected for campaign' });
        }

        const result = await addLeadsToCampaign(userId, campaignId, targetLeadIds);
        
        return res.status(200).json({
          success: true,
          message: `Launched campaign with ${result.count} leads`,
          count: result.count
        });
      }

      // SAVE: Create or update campaign config
      const { id, name, status, steps, settings } = req.body;
      
      if (!id || !steps) throw new Error('Invalid campaign data');

      await saveCampaign(userId, {
        id, 
        name, 
        status: status || 'active', 
        steps, 
        settings: settings || {}
      });

      return res.status(200).json({
        success: true,
        message: 'Campaign saved successfully',
        campaignId: id
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[Campaigns API] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
