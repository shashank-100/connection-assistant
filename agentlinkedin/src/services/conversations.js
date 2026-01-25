export class LinkedInConversationsService {
  constructor(browser) {
    this.browser = browser;
  }

  /**
   * Fetch conversations using LinkedIn's GraphQL API
   */
  async getConversations(limit = 50) {
    const page = this.browser.getPage();

    try {
      console.log('[Conversations] Fetching conversations...');

      // Navigate to messaging page to ensure cookies are set
      await page.goto('https://www.linkedin.com/messaging/', {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });

      await page.waitForTimeout(3000);

      // Execute GraphQL query to fetch conversations
      const conversations = await page.evaluate(async (limit) => {
        try {
          // Use the messaging conversations endpoint
          const response = await fetch(`https://www.linkedin.com/voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX&q=inbox&start=0&count=${limit}`, {
            method: 'GET',
            headers: {
              'accept': 'application/vnd.linkedin.normalized+json+2.1',
              'x-li-lang': 'en_US',
              'x-restli-protocol-version': '2.0.0',
            },
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch conversations: ${response.status}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Fetch error:', error);
          throw error;
        }
      }, limit);

      console.log('[Conversations] Raw response:', JSON.stringify(conversations).substring(0, 500));

      // Parse and format conversations
      const formattedConversations = this.parseConversations(conversations);

      console.log(`[Conversations] Found ${formattedConversations.length} conversations`);
      return formattedConversations;

    } catch (error) {
      console.error('[Conversations] Error:', error.message);
      throw error;
    }
  }

  /**
   * Parse LinkedIn API response into structured data
   */
  parseConversations(data) {
    try {
      const conversations = [];

      const included = data.included || [];
      const elements = data.elements || [];

      // Build a map of entities by their entityUrn
      const entityMap = new Map();
      included.forEach(item => {
        if (item.entityUrn) {
          entityMap.set(item.entityUrn, item);
        }
      });

      // Process each conversation
      elements.forEach((element, index) => {
        try {
          const conversationId = element.entityUrn || `conv_${index}`;

          // Get the last event/message
          const lastEvent = element['*events'] && element['*events'].length > 0
            ? entityMap.get(element['*events'][0])
            : null;

          // Get participants (usually one other person in 1-1 conversations)
          const participants = [];
          if (element['*participants']) {
            element['*participants'].forEach(participantUrn => {
              const participant = entityMap.get(participantUrn);
              if (participant && participant.$type === 'com.linkedin.voyager.messaging.MessagingMember') {
                const miniProfile = entityMap.get(participant['*miniProfile']);
                if (miniProfile) {
                  participants.push({
                    name: `${miniProfile.firstName || ''} ${miniProfile.lastName || ''}`.trim(),
                    title: miniProfile.occupation || '',
                    profileUrl: miniProfile.publicIdentifier
                      ? `https://www.linkedin.com/in/${miniProfile.publicIdentifier}/`
                      : '',
                    profilePicture: miniProfile.picture?.rootUrl || '',
                  });
                }
              }
            });
          }

          const conversation = {
            id: conversationId,
            name: participants.length > 0 ? participants[0].name : 'Unknown',
            title: participants.length > 0 ? participants[0].title : '',
            profileUrl: participants.length > 0 ? participants[0].profileUrl : '',
            lastMessage: lastEvent?.eventContent?.['com.linkedin.voyager.messaging.event.MessageEvent']?.attributedBody?.text ||
                        lastEvent?.body ||
                        '',
            lastMessageTime: lastEvent?.createdAt ? new Date(lastEvent.createdAt).toISOString() : new Date().toISOString(),
            sentByMe: lastEvent?.['*from']?.includes('fsd_profile') || false,
            isRead: element.read || true,
            unreadCount: element.unreadCount || 0,
            lastActivityAt: element.lastActivityAt || Date.now(),
          };

          conversations.push(conversation);
        } catch (err) {
          console.error('[Conversations] Error parsing conversation:', err);
        }
      });

      return conversations;
    } catch (error) {
      console.error('[Conversations] Parse error:', error);
      return [];
    }
  }

  /**
   * Get user's profile information
   */
  async getMyProfile() {
    const page = this.browser.getPage();

    try {
      console.log('[Profile] Fetching profile data...');

      const profileData = await page.evaluate(async () => {
        // Try to get profile data from LinkedIn's internal state
        const response = await fetch('https://www.linkedin.com/voyager/api/me', {
          method: 'GET',
          headers: {
            'accept': 'application/vnd.linkedin.normalized+json+2.1',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        return await response.json();
      });

      console.log('[Profile] Profile data fetched');

      return {
        name: `${profileData.plain?.firstName || ''} ${profileData.plain?.lastName || ''}`.trim(),
        headline: profileData.plain?.headline || '',
        profilePicture: profileData.plain?.profilePicture?.displayImageUrn || '',
      };

    } catch (error) {
      console.error('[Profile] Error:', error.message);
      return {
        name: 'User',
        headline: '',
        profilePicture: '',
      };
    }
  }
}
