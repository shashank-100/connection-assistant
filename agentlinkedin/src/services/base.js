import { BrowserManager } from 'agent-browser/dist/browser.js';

export class BaseLinkedInService {
  constructor(cookies) {
    this.cookies = cookies;
    this.browser = new BrowserManager();
  }

  async init() {
    console.log('[BaseLinkedInService] Launching browser...');
    await this.browser.launch({
      headless: process.env.HEADLESS !== 'false',
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    console.log('[BaseLinkedInService] Adding cookies...');
    if (this.cookies && Array.isArray(this.cookies)) {
      await this.browser.getPage().context().addCookies(this.cookies);
    }
    
    return this.browser;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getPage() {
    return this.browser.getPage();
  }
}
