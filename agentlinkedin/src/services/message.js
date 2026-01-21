import { BaseLinkedInService } from "./base.js";

export class LinkedInMessageService extends BaseLinkedInService {
  async sendMessage(profileUrl, message) {
    const page = await this.getPage();
    await page.goto(profileUrl, { waitUntil: "networkidle" });
    await this.wait(3000);

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    const messageButton = Object.values(snapshot.refs).find(el => 
      el.role === 'button' && el.name === 'Message'
    );

    if (messageButton) {
      await this.browser.getLocator(`@${Object.keys(snapshot.refs).find(key => snapshot.refs[key] === messageButton)}`).click();
      await this.wait(2000);

      const modalSnapshot = await this.browser.getSnapshot({ interactive: true });
      const messageBox = Object.values(modalSnapshot.refs).find(el => 
        el.role === 'textbox' && el.name?.toLowerCase().includes('message')
      );

      if (messageBox) {
        const messageBoxRef = Object.keys(modalSnapshot.refs).find(key => modalSnapshot.refs[key] === messageBox);
        await this.browser.getLocator(`@${messageBoxRef}`).fill(message);
        await this.wait(1000);

        const sendButton = Object.values(modalSnapshot.refs).find(el => 
          el.role === 'button' && el.name === 'Send'
        );
        if (sendButton) {
          const sendButtonRef = Object.keys(modalSnapshot.refs).find(key => modalSnapshot.refs[key] === sendButton);
          await this.browser.getLocator(`@${sendButtonRef}`).click();
          return { success: true, message: "Message sent successfully." };
        }
      }
    }

    throw new Error(
      'Could not find message box or "Message" button. You might need to be connected first.',
    );
  }
}
