import { BaseLinkedInService } from "./base.js";

export class LinkedInConnectService extends BaseLinkedInService {
  async sendConnectRequest(profileUrl) {
    const page = await this.getPage();
    await page.goto(profileUrl, { waitUntil: "load" });
    await this.wait(3000);

    console.log("Searching for 'Connect' button...");
    const connectButton = page.locator('button:has-text("Connect")').first();
    const connectButtonCount = await connectButton.count();

    if (connectButtonCount === 0) {
      console.log("Could not find 'Connect' button. Checking for 'Pending' or other states...");
      throw new Error('Could not find a "Connect" button on the profile page. The user may already be a connection or a request may be pending.');
    }
    
    console.log("'Connect' button found. Clicking it...");
    await connectButton.click();

    console.log("Waiting for connection modal...");
    await this.wait(2000);

    console.log("Searching for 'Send now' button...");
    const sendButton = page.locator('button[aria-label="Send now"]');
    if (await sendButton.isVisible()) {
      console.log("'Send now' button is visible. Clicking it...");
      await sendButton.click();
      console.log("Connection request sent.");
    } else {
      console.log("'Send now' button not found or not visible. The request might have been sent automatically after clicking 'Connect', or the modal did not appear as expected.");
    }

    return { success: true };
  }
}
