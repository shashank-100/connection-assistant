import chromium from "@sparticuz/chromium";
import { BrowserManager } from "../node_modules/agent-browser/dist/browser.js";
import { getPendingCampaignActions, updateCampaignLeadStatus, getCookies } from "../db.js";
import { LinkedInConnectService } from "./services/connect.js";
import { LinkedInMessageService } from "./services/message.js";
import { LinkedInVisitService } from "./services/visit.js";

const LOOP_INTERVAL_MS = 60 * 1000;
const BROWSER_TIMEOUT_MS = 10 * 60 * 1000;

export class CampaignRunner {
  constructor() {
    this.isRunning = false;
    this.browser = null;
    this.lastBrowserInit = 0;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[Runner] Campaign runner started');
    this.loop();
  }

  async loop() {
    while (this.isRunning) {
      try {
        await this.processPendingActions();
      } catch (err) {
        console.error('[Runner] Error in loop:', err);
      }
      await new Promise(r => setTimeout(r, LOOP_INTERVAL_MS));
    }
  }

  async getBrowser(userId) {
    if (!this.browser || (Date.now() - this.lastBrowserInit > BROWSER_TIMEOUT_MS)) {
      if (this.browser) {
        try { await this.browser.close(); } catch (e) {}
      }
      
      this.browser = new BrowserManager();
      const isRailway = !!process.env.RAILWAY_ENVIRONMENT;
      const isDocker = !!process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
      
      const launchOptions = {
        id: "campaign-runner",
        action: "launch",
        headless: true,
      };

      if (isRailway || isDocker) {
        launchOptions.executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium-browser';
        launchOptions.args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'];
      }

      await this.browser.launch(launchOptions);
      this.lastBrowserInit = Date.now();
    }

    const cookies = await getCookies(userId);
    if (cookies) {
      const page = this.browser.getPage();
      await page.context().addCookies(cookies);
    }

    return this.browser;
  }

  async processPendingActions() {
    const userId = 'shashank';
    const actions = await getPendingCampaignActions(userId); 
    
    if (actions.length === 0) return;

    console.log(`[Runner] Processing ${actions.length} actions...`);
    const browser = await this.getBrowser(userId);

    for (const item of actions) {
      try {
        await updateCampaignLeadStatus(item.id, { status: 'processing' });

        const stepConfig = item.steps[item.current_step];
        const profileUrl = item.profile_url;
        
        if (!stepConfig) {
          await updateCampaignLeadStatus(item.id, { status: 'failed' });
          continue;
        }

        console.log(`[Runner] Executing ${stepConfig.type} for ${item.lead_name}`);
        let result = { success: false };

        switch (stepConfig.type) {
          case 'visit_profile':
            await browser.getPage().goto(profileUrl, { waitUntil: 'load', timeout: 30000 });
            result = { success: true };
            break;

          case 'connection_request':
            result = await new LinkedInConnectService(browser).sendConnectRequest(profileUrl);
            break;

          case 'send_message':
            result = await new LinkedInMessageService(browser).sendMessage(profileUrl, stepConfig.template || "Hello!");
            break;
        }

        if (result.success) {
            const nextStepIndex = item.current_step + 1;
            const nextStepConfig = item.steps[nextStepIndex];
            
            let updates = {
                status: nextStepConfig ? 'pending' : 'completed',
                current_step: nextStepIndex,
                historyEntry: { step: item.current_step, type: stepConfig.type, status: 'success', timestamp: new Date().toISOString() }
            };

            if (nextStepConfig && nextStepConfig.delay) {
                const nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + (parseInt(nextStepConfig.delay) || 1));
                updates.next_action_at = nextDate.toISOString();
            }

            await updateCampaignLeadStatus(item.id, updates);
            console.log(`[Runner] Success for ${item.lead_name}. Waiting 2 mins for next action...`);
            
            // Mandatory 2-minute wait after a successful action
            await new Promise(r => setTimeout(r, 2 * 60 * 1000));

        } else {
            await updateCampaignLeadStatus(item.id, { 
                status: 'failed',
                historyEntry: { step: item.current_step, type: stepConfig.type, status: 'failed', error: result.error, timestamp: new Date().toISOString() }
            });
        }
      } catch (err) {
        console.error(`[Runner] Error processing ${item.id}:`, err);
        await updateCampaignLeadStatus(item.id, { status: 'failed' });
      }
    }
  }
}
