import { getActiveCampaigns, getNextPendingProspect, markProspectDone, markProspectFailed, checkAndCompleteCampaign, getCookies } from '../db-supabase.js';
import { LinkedInConnectService } from './services/connect.js';

export class CampaignRunner {
  constructor() {
    this.running = false;
    this.checkInterval = 5000; // 5 seconds
    this.minDelay = 45000; // 45 seconds
    this.maxDelay = 90000; // 90 seconds
  }

  async start() {
    if (this.running) return;
    this.running = true;
    console.log('[RUNNER] Campaign engine started...');

    while (this.running) {
      try {
        const activeCampaigns = await getActiveCampaigns();

        if (activeCampaigns.length === 0) {
          await this.sleep(this.checkInterval);
          continue;
        }

        for (const campaign of activeCampaigns) {
          // STEP 3: The Engine - Process ONE prospect per campaign loop
          const prospect = await getNextPendingProspect(campaign.id);

          if (!prospect) {
            // STEP 5: Stop after all are finished
            await checkAndCompleteCampaign(campaign.id);
            continue;
          }

          console.log(`[RUNNER] Processing ${prospect.leadName} (${prospect.profileUrl})`);

          try {
            // Perform action (LinkedIn Connection)
            const cookies = await getCookies(prospect.user_id);
            if (!cookies) throw new Error(`No cookies for user: ${prospect.user_id}`);

            // Initialize browser via ConnectService (which inherits from BaseLinkedInService)
            const connectService = new LinkedInConnectService(cookies);
            await connectService.init(); // Must initialize browser
            
            const result = await connectService.sendConnectRequest(prospect.profileUrl);

            // Mark as done
            await markProspectDone(prospect.id, {
              action: 'connect',
              status: 'success',
              result: result,
              time: new Date()
            });

            console.log(`[RUNNER] Success: ${prospect.leadName}`);

            // Wait before closing browser (human-like - reviewing LinkedIn notifications, etc.)
            const preCloseWait = 3000 + Math.random() * 4000; // 3-7 seconds
            console.log(`[RUNNER] Waiting ${Math.round(preCloseWait/1000)}s before closing browser...`);
            await this.sleep(preCloseWait);

            await connectService.close(); // Clean up browser

            // Random delay between 45 and 90 seconds
            const delay = Math.floor(Math.random() * (this.maxDelay - this.minDelay + 1)) + this.minDelay;
            console.log(`[RUNNER] Sleeping for ${Math.round(delay/1000)}s...`);
            await this.sleep(delay);

          } catch (err) {
            console.error(`[RUNNER] Failed processing prospect ${prospect.id}:`, err.message);
            await markProspectFailed(prospect.id, err.message);
          }
        }

      } catch (err) {
        console.error('[RUNNER] Fatal loop error:', err);
      }

      await this.sleep(this.checkInterval);
    }
  }

  stop() {
    this.running = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
