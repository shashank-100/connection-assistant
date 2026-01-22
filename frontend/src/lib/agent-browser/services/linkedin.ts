import { BrowserManager } from '../browser';
import { EnhancedSnapshot } from '../snapshot';

export class LinkedInAgentService {
  constructor(private browser: BrowserManager) {}

  async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async login() {
    const page = this.browser.getPage();
    const url = page.url();
    if (url.includes('feed') || url.includes('mynetwork')) {
      return true;
    }
    return false;
  }

  async searchPeople(searchTerm: string) {
    const page = this.browser.getPage();
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
    await page.goto(searchUrl);
    await this.wait(5000);

    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1000));
      await this.wait(2000);
    }

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    return this.extractConnectButtons(snapshot);
  }

  private extractConnectButtons(snapshot: EnhancedSnapshot) {
    const lines = snapshot.tree.split('\n');
    const connectButtons: any[] = [];
    let currentPerson: any = null;

    for (const line of lines) {
      if (line.includes('link') && !line.includes('Connect') && !line.includes('Message')) {
        const match = line.match(/link "([^"]+)"/);
        if (match && match[1].length > 5 && !match[1].includes('LinkedIn')) {
          currentPerson = { name: match[1] };
        }
      }

      if (line.includes('button "Connect"') && line.includes('[ref=')) {
        const refMatch = line.match(/\[ref=(\w+)\]/);
        if (refMatch && currentPerson) {
          connectButtons.push({
            ...currentPerson,
            connectRef: '@' + refMatch[1]
          });
          currentPerson = null;
        }
      }
    }
    return connectButtons;
  }

  async sendConnectRequest(connectRef: string) {
    const locator = this.browser.getLocator(connectRef);
    await locator.click();
    await this.wait(2000);

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    if (snapshot.tree.includes('Send now')) {
      const lines = snapshot.tree.split('\n');
      for (const line of lines) {
        if ((line.includes('Send now') || line.includes('Send without')) && line.includes('[ref=')) {
          const refMatch = line.match(/\[ref=(\w+)\]/);
          if (refMatch) {
            const sendBtn = this.browser.getLocator('@' + refMatch[1]);
            await sendBtn.click();
            break;
          }
        }
      }
    }
    return { success: true };
  }
}
