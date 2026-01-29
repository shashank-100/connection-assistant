import { saveLeads, getLeads, deleteLeadsBySource, deleteCampaignLeadsBySource, getLeadLists } from "../db.js";

export default async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    'https://frontend-production-50ccc.up.railway.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Fetch leads or lists
    if (req.method === 'GET') {
      const { userId = 'shashank', action } = req.query;

      if (action === 'lists') {
        console.log('[Leads API] Fetching lists for userId:', userId);
        const lists = await getLeadLists(userId);
        console.log('[Leads API] Found lists:', lists);
        return res.status(200).json({
          success: true,
          data: lists,
          timestamp: new Date().toISOString(),
        });
      }

      const leads = await getLeads(userId);
      return res.status(200).json({
        success: true,
        data: leads,
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
