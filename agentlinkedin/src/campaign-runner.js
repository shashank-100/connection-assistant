import { getActiveCampaigns, getNextPendingProspect, markProspectDone, markProspectFailed, checkAndCompleteCampaign, getCookies, getLinkedInAccount } from '../db-supabase.js';
import { LinkedInConnectService } from './services/connect.js';

export class CampaignRunner {
  constructor() {
    this.running = false;
    this.checkInterval = 10000; // 10s poll interval
    this.batchSize = 3;         // leads per browser session
    this.minInBatchDelay = 30000;  // 30s between leads in same session
    this.maxInBatchDelay = 50000;  // 50s between leads in same session
    this.minBatchDelay = 120000;   // 2 min between batches
    this.maxBatchDelay = 180000;   // 3 min between batches

    // Track per-sender state so parallel senders don't clobber each other
    this._senderBusy = new Map(); // senderKey → true/false
  }

  async start() {
    if (this.running) return;
    this.running = true;
    console.log('[RUNNER] Campaign engine started (multi-sender mode)...');

    while (this.running) {
      try {
        const activeCampaigns = await getActiveCampaigns();

        if (activeCampaigns.length === 0) {
          await this.sleep(this.checkInterval);
          continue;
        }

        // Group campaigns by sender:
        //   - If campaign has linkedin_account_id → key = account_xxx (specific LinkedIn account)
        //   - Otherwise → key = user:shashank (falls back to user_cookies table)
        const bySender = new Map();
        for (const campaign of activeCampaigns) {
          const key = campaign.linkedin_account_id || `user:${campaign.user_id}`;
          if (!bySender.has(key)) bySender.set(key, []);
          bySender.get(key).push(campaign);
        }

        // Fire one async chain per sender — they all run in parallel
        const senderPromises = [];
        for (const [senderKey, campaigns] of bySender) {
          if (this._senderBusy.get(senderKey)) continue; // already processing
          this._senderBusy.set(senderKey, true);
          senderPromises.push(
            this._runSender(senderKey, campaigns).finally(() => {
              this._senderBusy.set(senderKey, false);
            })
          );
        }

        await Promise.all(senderPromises);

      } catch (err) {
        console.error('[RUNNER] Fatal loop error:', err);
        await this.sleep(5000);
      }

      await this.sleep(this.checkInterval);
    }
  }

  /**
   * Resolve cookies for a sender key.
   * - "account_xxx" → fetch from linkedin_accounts table
   * - "user:shashank" → fetch from user_cookies table (legacy)
   */
  async _getCookiesForSender(senderKey) {
    if (senderKey.startsWith('user:')) {
      const userId = senderKey.replace('user:', '');
      return getCookies(userId);
    }
    const account = await getLinkedInAccount(senderKey);
    return account?.cookies || null;
  }

  /**
   * Process one batch round for a single sender.
   * Multiple campaigns for the same sender run sequentially (one browser session at a time).
   */
  async _runSender(senderKey, campaigns) {
    console.log(`[RUNNER] [${senderKey}] Processing ${campaigns.length} campaign(s)...`);

    for (const campaign of campaigns) {
      const batch = [];
      for (let i = 0; i < this.batchSize; i++) {
        const prospect = await getNextPendingProspect(campaign.id);
        if (!prospect) break;
        batch.push(prospect);
      }

      if (batch.length === 0) {
        await checkAndCompleteCampaign(campaign.id);
        continue;
      }

      console.log(`[RUNNER] [${senderKey}] "${campaign.name}" — batch of ${batch.length} lead(s)`);

      const cookies = await this._getCookiesForSender(senderKey);
      if (!cookies) {
        console.error(`[RUNNER] [${senderKey}] No cookies found — skipping batch`);
        for (const p of batch) await markProspectFailed(p.id, `No cookies for sender: ${senderKey}`);
        continue;
      }

      const connectService = new LinkedInConnectService(cookies);
      try {
        await connectService.init();

        for (let i = 0; i < batch.length; i++) {
          const prospect = batch[i];
          console.log(`[RUNNER] [${senderKey}] [${i + 1}/${batch.length}] ${prospect.leadName}`);

          try {
            const result = await connectService.sendConnectRequest(prospect.profileUrl);
            await markProspectDone(prospect.id, { action: 'connect', status: 'success', result, time: new Date() });
            console.log(`[RUNNER] [${senderKey}] ✅ ${prospect.leadName}`);
          } catch (err) {
            console.error(`[RUNNER] [${senderKey}] ❌ ${prospect.leadName} — ${err.message}`);
            await markProspectFailed(prospect.id, err.message);
          }

          if (i < batch.length - 1) {
            const delay = this.minInBatchDelay + Math.random() * (this.maxInBatchDelay - this.minInBatchDelay);
            console.log(`[RUNNER] [${senderKey}] Waiting ${Math.round(delay / 1000)}s before next lead...`);
            await this.sleep(delay);
          }
        }

      } finally {
        const preClose = 3000 + Math.random() * 4000;
        await this.sleep(preClose);
        await connectService.close();
      }

      const batchDelay = this.minBatchDelay + Math.random() * (this.maxBatchDelay - this.minBatchDelay);
      console.log(`[RUNNER] [${senderKey}] Batch done. Sleeping ${Math.round(batchDelay / 1000)}s...`);
      await this.sleep(batchDelay);
    }
  }

  stop() {
    this.running = false;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
