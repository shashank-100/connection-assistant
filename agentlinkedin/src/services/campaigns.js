import pool from "../../db.js"; 

export class LinkedInCampaignsService {
  constructor(browser) {
    this.browser = browser;
  }

  /**
   * Get campaigns and stats from the database
   */
  async getCampaigns(userId = 'shashank') {
    try {
      console.log('[Campaigns] Fetching real campaign data...');

      // 1. Fetch campaigns
      const campaignsResult = await pool.query(
        'SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );

      // 2. Fetch stats for each campaign
      const campaigns = await Promise.all(campaignsResult.rows.map(async (camp) => {
        const statsResult = await pool.query(
          `SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
            COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing
           FROM campaign_leads WHERE campaign_id = $1`,
          [camp.id]
        );
        
        const stats = statsResult.rows[0];

        return {
          id: camp.id,
          name: camp.name,
          status: camp.status,
          recipientCount: parseInt(stats.total),
          steps: camp.steps,
          stats: {
            visited: 0, // Would need more granular history tracking
            connected: parseInt(stats.completed), 
            messaged: 0,
            replied: 0,
          },
          createdAt: camp.created_at,
        };
      }));

      return {
        campaigns,
        stats: {
          profileVisits: 0,
          connectionsSent: campaigns.reduce((acc, c) => acc + c.stats.connected, 0),
          messagesSent: 0,
          postsLiked: 0,
        }
      };
    } catch (error) {
      console.error('[Campaigns] Error:', error);
      return { campaigns: [], stats: {} };
    }
  }
}
