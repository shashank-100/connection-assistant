export class LinkedInCampaignsService {
  constructor(browser) {
    this.browser = browser;
  }

  /**
   * Get campaign activity stats from LinkedIn
   * This tracks profile visits, connection requests sent, messages sent
   */
  async getCampaignStats() {
    const page = this.browser.getPage();

    try {
      console.log('[Campaigns] Fetching campaign stats...');

      // Get stats from different sources
      const stats = await page.evaluate(async () => {
        const results = {
          profileVisits: 0,
          connectionsSent: 0,
          messagesSent: 0,
          postsLiked: 0,
        };

        try {
          // Fetch sent invitations count
          const invitationsResponse = await fetch('https://www.linkedin.com/voyager/api/relationships/sentInvitationViewsV2?start=0&count=0&invitationType=CONNECTION', {
            method: 'GET',
            headers: {
              'accept': 'application/vnd.linkedin.normalized+json+2.1',
              'x-li-lang': 'en_US',
              'x-restli-protocol-version': '2.0.0',
            },
            credentials: 'include'
          });

          if (invitationsResponse.ok) {
            const invData = await invitationsResponse.json();
            results.connectionsSent = invData.paging?.total || 0;
          }
        } catch (err) {
          console.error('Error fetching invitations:', err);
        }

        try {
          // Fetch conversations count (proxy for messages sent)
          const conversationsResponse = await fetch('https://www.linkedin.com/voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX&q=inbox&start=0&count=0', {
            method: 'GET',
            headers: {
              'accept': 'application/vnd.linkedin.normalized+json+2.1',
              'x-li-lang': 'en_US',
              'x-restli-protocol-version': '2.0.0',
            },
            credentials: 'include'
          });

          if (conversationsResponse.ok) {
            const convData = await conversationsResponse.json();
            results.messagesSent = convData.paging?.total || 0;
          }
        } catch (err) {
          console.error('Error fetching conversations:', err);
        }

        return results;
      });

      console.log('[Campaigns] Stats:', stats);
      return stats;
    } catch (error) {
      console.error('[Campaigns] Error fetching stats:', error);
      return {
        profileVisits: 0,
        connectionsSent: 0,
        messagesSent: 0,
        postsLiked: 0,
      };
    }
  }

  /**
   * Get "campaigns" - really just tracking groups of actions
   * Since LinkedIn doesn't have a campaign API, we'll track based on recent activity
   */
  async getCampaigns() {
    try {
      console.log('[Campaigns] Fetching campaign data...');

      const stats = await this.getCampaignStats();

      // Create a virtual campaign based on recent activity
      const campaigns = [];

      if (stats.connectionsSent > 0 || stats.messagesSent > 0) {
        campaigns.push({
          id: 'default_outreach',
          name: 'LinkedIn Outreach',
          status: stats.connectionsSent > 0 ? 'running' : 'completed',
          recipientCount: stats.connectionsSent,
          stats: {
            visited: stats.profileVisits || 0,
            connected: stats.connectionsSent || 0,
            messaged: stats.messagesSent || 0,
            replied: 0, // Would need to parse conversation replies
          },
          createdAt: new Date().toISOString(),
        });
      }

      // Add mock sequences data (LinkedIn doesn't provide this)
      campaigns.forEach(campaign => {
        campaign.sequences = [
          { id: '1', type: 'visit_profile', label: 'Visit profile', enabled: true, order: 1 },
          { id: '2', type: 'connection_request', label: 'Connection request', enabled: true, order: 2 },
          { id: '3', type: 'send_message', label: 'Send message', enabled: stats.messagesSent > 0, order: 3 },
        ];
      });

      console.log(`[Campaigns] Found ${campaigns.length} campaigns`);
      return {
        campaigns,
        stats,
      };
    } catch (error) {
      console.error('[Campaigns] Error:', error);
      return {
        campaigns: [],
        stats: {
          profileVisits: 0,
          connectionsSent: 0,
          messagesSent: 0,
          postsLiked: 0,
        },
      };
    }
  }
}
