import { BaseLinkedInService } from "./base.js";

export class LinkedInConnectService extends BaseLinkedInService {
  async sendConnectRequest(profileUrl) {
    const page = await this.getPage();
    await page.goto(profileUrl, { waitUntil: "load" });
    await this.wait(3000);

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    
    const connectRef = Object.entries(snapshot.refs).find(([id, el]) => 
      el.role === 'button' && el.name === 'Connect'
    );

    if (!connectRef) {
      throw new Error('Could not find a "Connect" button on the profile page.');
    }
    
    await this.browser.getLocator(`@${connectRef[0]}`).click();
    await this.wait(2000);

    const modalSnapshot = await this.browser.getSnapshot({ interactive: true });
    const sendRef = Object.entries(modalSnapshot.refs).find(([id, el]) => 
      el.role === 'button' && el.name === 'Send now'
    );

    if (sendRef) {
      await this.browser.getLocator(`@${sendRef[0]}`).click();
    }

    return { success: true };
  }
}
