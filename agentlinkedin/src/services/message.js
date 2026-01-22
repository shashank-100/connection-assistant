import { BaseLinkedInService } from "./base.js";

export class LinkedInMessageService extends BaseLinkedInService {
  async sendMessage(profileUrl, message) {
    await this.browser.getPage().goto(profileUrl, { waitUntil: "networkidle" });
    await this.wait(3000);

    const snapshot = await this.browser.getSnapshot({ interactive: true });
    const messageButtonRef = Object.keys(snapshot.refs).find(id => {
      const el = snapshot.refs[id];
      return el.role === 'button' && el.name === 'Message';
    });

    if (messageButtonRef) {
      await this.browser.getLocator(`@${messageButtonRef}`).click();
      await this.wait(2000);

      const modalSnapshot = await this.browser.getSnapshot({ interactive: true });
      const messageBoxRef = Object.keys(modalSnapshot.refs).find(id => {
        const el = modalSnapshot.refs[id];
        return el.role === 'textbox' && el.name?.toLowerCase().includes('message');
      });

      if (messageBoxRef) {
        await this.browser.getLocator(`@${messageBoxRef}`).fill(message);
        await this.wait(1000);

        const sendButtonRef = Object.keys(modalSnapshot.refs).find(id => {
          const el = modalSnapshot.refs[id];
          return el.role === 'button' && el.name === 'Send';
        });
        if (sendButtonRef) {
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
