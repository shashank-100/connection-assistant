export class LinkedInLeadsService {
  constructor(browser) {
    this.browser = browser;
  }

  /**
   * Fetch pending connection requests (people waiting to accept)
   */
  async getPendingConnectionRequests(limit = 50) {
    const page = this.browser.getPage();

    try {
      console.log('[Leads] Fetching pending connection requests...');

      // Navigate to My Network -> Manage invitations
      await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/sent/', {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });

      await page.waitForTimeout(3000);

      // Fetch sent invitations via API
      const invitations = await page.evaluate(async (limit) => {
        try {
          const response = await fetch(`https://www.linkedin.com/voyager/api/relationships/sentInvitationViewsV2?start=0&count=${limit}&invitationType=CONNECTION`, {
            method: 'GET',
            headers: {
              'accept': 'application/vnd.linkedin.normalized+json+2.1',
              'x-li-lang': 'en_US',
              'x-restli-protocol-version': '2.0.0',
            },
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch invitations: ${response.status}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Fetch error:', error);
          throw error;
        }
      }, limit);

      console.log('[Leads] Raw invitations response:', JSON.stringify(invitations).substring(0, 500));

      const parsedLeads = this.parsePendingInvitations(invitations);
      console.log(`[Leads] Found ${parsedLeads.length} pending connection requests`);

      return parsedLeads;
    } catch (error) {
      console.error('[Leads] Error fetching pending connections:', error.message);
      throw error;
    }
  }

  /**
   * Parse pending invitations response
   */
  parsePendingInvitations(data) {
    try {
      const leads = [];
      const included = data.included || [];
      const elements = data.elements || [];

      // Build entity map
      const entityMap = new Map();
      included.forEach(item => {
        if (item.entityUrn) {
          entityMap.set(item.entityUrn, item);
        }
      });

      elements.forEach((element, index) => {
        try {
          const toMember = element['*toMember'] ? entityMap.get(element['*toMember']) : null;

          if (toMember && toMember.$type === 'com.linkedin.voyager.identity.shared.MiniProfile') {
            leads.push({
              id: element.entityUrn || `lead_${index}`,
              name: `${toMember.firstName || ''} ${toMember.lastName || ''}`.trim(),
              title: toMember.occupation || '',
              profileUrl: toMember.publicIdentifier
                ? `https://www.linkedin.com/in/${toMember.publicIdentifier}/`
                : '',
              profilePicture: toMember.picture?.rootUrl || '',
              sentAt: element.sentTime ? new Date(element.sentTime).toISOString() : new Date().toISOString(),
              status: 'pending',
              source: 'connection_request',
            });
          }
        } catch (err) {
          console.error('[Leads] Error parsing invitation:', err);
        }
      });

      return leads;
    } catch (error) {
      console.error('[Leads] Parse error:', error);
      return [];
    }
  }

  /**
   * Fetch recent connections (newly accepted)
   */
  async getRecentConnections(limit = 50) {
    const page = this.browser.getPage();

    try {
      console.log('[Leads] Fetching recent connections...');

      await page.goto('https://www.linkedin.com/mynetwork/invite-connect/connections/', {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });

      await page.waitForTimeout(3000);

      const connections = await page.evaluate(async (limit) => {
        try {
          const response = await fetch(`https://www.linkedin.com/voyager/api/relationships/dash/connections?decorationId=com.linkedin.voyager.dash.deco.web.mynetwork.ConnectionListWithProfile-16&count=${limit}&q=search&sortType=RECENTLY_ADDED&start=0`, {
            method: 'GET',
            headers: {
              'accept': 'application/vnd.linkedin.normalized+json+2.1',
              'x-li-lang': 'en_US',
              'x-restli-protocol-version': '2.0.0',
            },
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch connections: ${response.status}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Fetch error:', error);
          throw error;
        }
      }, limit);

      console.log('[Leads] Raw connections response:', JSON.stringify(connections).substring(0, 500));

      const parsedConnections = this.parseRecentConnections(connections);
      console.log(`[Leads] Found ${parsedConnections.length} recent connections`);

      return parsedConnections;
    } catch (error) {
      console.error('[Leads] Error fetching recent connections:', error.message);
      throw error;
    }
  }

  /**
   * Parse recent connections response
   */
  parseRecentConnections(data) {
    try {
      const connections = [];
      const included = data.included || [];
      const elements = data.elements || [];

      const entityMap = new Map();
      included.forEach(item => {
        if (item.entityUrn) {
          entityMap.set(item.entityUrn, item);
        }
      });

      elements.forEach((element, index) => {
        try {
          const profile = element['*connectedMemberResolutionResult']
            ? entityMap.get(element['*connectedMemberResolutionResult'])
            : null;

          if (profile) {
            const miniProfile = profile['*miniProfile'] ? entityMap.get(profile['*miniProfile']) : null;

            if (miniProfile) {
              connections.push({
                id: element.entityUrn || `connection_${index}`,
                name: `${miniProfile.firstName || ''} ${miniProfile.lastName || ''}`.trim(),
                title: miniProfile.occupation || '',
                profileUrl: miniProfile.publicIdentifier
                  ? `https://www.linkedin.com/in/${miniProfile.publicIdentifier}/`
                  : '',
                profilePicture: miniProfile.picture?.rootUrl || '',
                connectedAt: element.createdAt ? new Date(element.createdAt).toISOString() : new Date().toISOString(),
                status: 'connected',
                source: 'recent_connection',
              });
            }
          }
        } catch (err) {
          console.error('[Leads] Error parsing connection:', err);
        }
      });

      return connections;
    } catch (error) {
      console.error('[Leads] Parse error:', error);
      return [];
    }
  }

  /**
   * Get all leads (pending + recent connections)
   */
  async getAllLeads() {
    try {
      console.log('[Leads] Fetching all leads...');

      const [pending, recent] = await Promise.all([
        this.getPendingConnectionRequests(50).catch(err => {
          console.error('[Leads] Error fetching pending:', err);
          return [];
        }),
        this.getRecentConnections(50).catch(err => {
          console.error('[Leads] Error fetching recent:', err);
          return [];
        })
      ]);

      const allLeads = [...pending, ...recent];

      console.log(`[Leads] Total leads: ${allLeads.length} (${pending.length} pending, ${recent.length} recent)`);

      return {
        all: allLeads,
        pending: pending,
        recent: recent,
        stats: {
          totalLeads: allLeads.length,
          pendingRequests: pending.length,
          recentConnections: recent.length,
        }
      };
    } catch (error) {
      console.error('[Leads] Error fetching all leads:', error);
      throw error;
    }
  }
}
