import { BaseLinkedInService } from "./base.js";

export class LinkedInMessageService extends BaseLinkedInService {
  async sendMessage(profileUrl, message) {
    const page = await this.getPage();
    await page.goto(profileUrl, { waitUntil: "networkidle" });
    await this.wait(3000);

    const messageButton = page.locator('button:has-text("Message")').first();
    if (await messageButton.isVisible()) {
      await messageButton.click();
      await this.wait(2000);

      const messageBox = page
        .locator('.msg-form__contenteditable[role="textbox"]')
        .first();
      if (await messageBox.isVisible()) {
        await messageBox.fill(message);
        await this.wait(1000);

        const sendButton = page.locator("button.msg-form__send-button").first();
        await sendButton.click();
        return { success: true, message: "Message sent successfully." };
      }
    }

    throw new Error(
      'Could not find message box or "Message" button. You might need to be connected first.',
    );
  }
}
