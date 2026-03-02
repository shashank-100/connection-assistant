import { saveLeads, getLeads, deleteLeadsBySource, deleteCampaignLeadsBySource, getLeadLists } from "../db-supabase.js";

export default async function handler(req, res) {
  try {
    // GET - Fetch leads or lists
    if (req.method === 'GET') {
      const { userId = 'shashank', action } = req.query;

      if (action === 'lists') {
        console.log('[Leads API] Fetching lists for userId:', userId);
        const lists = await getLeadLists(userId);
        
        // Map to LeadList type
        const mappedLists = lists.map(item => ({
          id: item.source,
          name: item.source_name || item.source,
          memberCount: parseInt(item.count || '0'),
          totalCapacity: parseInt(item.count || '0'),
          importedAt: new Date().toLocaleDateString(), // Placeholder until tracked in DB
          status: 'not_started'
        }));

        return res.status(200).json({
          success: true,
          data: mappedLists,
          timestamp: new Date().toISOString(),
        });
      }

      const leads = await getLeads(userId);
      
      // Map DB snake_case to Frontend camelCase
      const mappedLeads = leads.map(l => ({
        id: l.id,
        name: l.name,
        title: l.title,
        company: l.company,
        profileUrl: l.profile_url,
        profilePicture: l.profile_picture,
        status: l.status,
        source: l.source,
        campaignId: l.campaign_id,
        createdAt: l.created_at,
        sentAt: l.sent_at,
        connectedAt: l.connected_at
      }));

      return res.status(200).json({
        success: true,
        data: mappedLeads,
        timestamp: new Date().toISOString(),
      });
    }

    const { userId = 'shashank' } = req.body || {};

    // POST - Add leads
    if (req.method === 'POST') {
      const { leads } = req.body;

      if (!leads || !Array.isArray(leads)) {
        return res.status(400).json({
          success: false,
          error: 'leads array required',
          timestamp: new Date().toISOString(),
        });
      }

      await saveLeads(userId, leads);

      return res.status(200).json({
        success: true,
        data: { count: leads.length, message: `Added ${leads.length} leads` },
        timestamp: new Date().toISOString(),
      });
    }

    // DELETE - Delete leads by source
    if (req.method === 'DELETE') {
      const { source } = req.body;

      if (!source) {
        return res.status(400).json({
          success: false,
          error: 'source required',
          timestamp: new Date().toISOString(),
        });
      }

      const campaignResult = await deleteCampaignLeadsBySource(userId, source);
      const result = await deleteLeadsBySource(userId, source);

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('[Leads API] Error:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
