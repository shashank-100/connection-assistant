import { saveCampaign, addLeadsToCampaign, getLeads, getLeadLists, getCampaigns, getCampaignStats } from '../db-supabase.js';

export default async function handler(req, res) {
  const { userId = 'shashank' } = req.body || req.query;

  try {
    // GET /api/campaigns - List all campaigns with stats
    if (req.method === 'GET') {
      const campaigns = await getCampaigns(userId);
      const withStats = await Promise.all(campaigns.map(async (c) => {
        const stats = await getCampaignStats(c.id);
        return { ...c, stats };
      }));
      return res.status(200).json({ success: true, data: withStats });
    }

    // POST /api/campaigns - Create/Update/Start Campaign
    if (req.method === 'POST') {
      const { action } = req.body;

      // STEP 2: Start Route (Strictly flips status)
      if (action === 'start') {
        const { campaignId } = req.body;
        if (!campaignId) throw new Error('Campaign ID required');
        const { updateCampaignStatus } = await import('../db-supabase.js');
        await updateCampaignStatus(campaignId, 'active');
        return res.status(200).json({ success: true, status: 'started', message: `Campaign ${campaignId} is now active` });
      }

      // PAUSE
      if (action === 'pause') {
        const { campaignId } = req.body;
        if (!campaignId) throw new Error('Campaign ID required');
        const { updateCampaignStatus } = await import('../db-supabase.js');
        await updateCampaignStatus(campaignId, 'paused');
        return res.status(200).json({ success: true, status: 'paused' });
      }

      // RESUME
      if (action === 'resume') {
        const { campaignId } = req.body;
        if (!campaignId) throw new Error('Campaign ID required');
        const { updateCampaignStatus } = await import('../db-supabase.js');
        await updateCampaignStatus(campaignId, 'active');
        return res.status(200).json({ success: true, status: 'active' });
      }

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
      const { id, name, status, steps, settings, linkedin_account_id } = req.body;

      if (!id || !steps) throw new Error('Invalid campaign data');

      await saveCampaign(userId, {
        id,
        name,
        status: status || 'active',
        steps,
        settings: settings || {},
        linkedin_account_id: linkedin_account_id || null,
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
