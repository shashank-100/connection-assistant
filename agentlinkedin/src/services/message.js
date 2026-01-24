import { BaseLinkedInService } from "./base.js";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForCondition(fn, {
  timeout = 25000,
  interval = 1200,
  description = "condition"
} = {}) {
  const start = Date.now();
  let attempts = 0;
  while (Date.now() - start < timeout) {
    attempts++;
    console.log(`[LinkedInMessageService] Attempt ${attempts} for: ${description}`);
    const result = await fn();
    if (result) {
      console.log(`[LinkedInMessageService] Success after ${attempts} attempts`);
      return result;
    }
    await sleep(interval);
  }
  throw new Error(`Timeout waiting for ${description} after ${attempts} attempts (${Math.round((Date.now() - start) / 1000)}s)`);
}

export class LinkedInMessageService extends BaseLinkedInService {
  async humanIdle() {
    try {
      const page = this.browser.getPage();
      await sleep(800 + Math.random() * 1200);

      await page.mouse.move(
        200 + Math.random() * 200,
        300 + Math.random() * 200
      );
      await sleep(300 + Math.random() * 500);

      await page.mouse.move(
        400 + Math.random() * 300,
        500 + Math.random() * 300
      );
      await sleep(600 + Math.random() * 800);
    } catch (e) {
      console.log("[LinkedInMessageService] Human idle skipped:", e.message);
    }
  }

  async sendMessage(profileUrl, message) {
    console.log(`[LinkedInMessageService] Opening profile: ${profileUrl}`);

    const page = this.browser.getPage();

    try {
      console.log(`[LinkedInMessageService] Navigating to profile...`);
      await page.goto(profileUrl, {
        waitUntil: "load",
        timeout: 45000,
      });
      console.log(`[LinkedInMessageService] Navigation completed`);
    } catch (e) {
      console.error(`[LinkedInMessageService] Navigation error: ${e.message}`);
      throw new Error(`Failed to navigate to profile: ${e.message}`);
    }

    await this.humanIdle();

    console.log(`[LinkedInMessageService] Searching for Message button...`);
    const messageButtonRef = await waitForCondition(async () => {
      const snapshot = await this.browser.getSnapshot({ interactive: true });

      const direct = Object.entries(snapshot.refs).find(([_, el]) => {
        const name = el.name?.toLowerCase() ?? "";
        return el.role === "button" && name.includes("message");
      });
      if (direct) {
        console.log(`[LinkedInMessageService] Found direct Message button`);
        return direct[0];
      }

      const more = Object.entries(snapshot.refs).find(([_, el]) => {
        const name = el.name?.toLowerCase() ?? "";
        return el.role === "button" && (name.includes("more") || name === "More actions");
      });

      if (more) {
        console.log(`[LinkedInMessageService] Clicking More: @${more[0]}`);
        await this.browser.getLocator(`@${more[0]}`).click();
        await sleep(1500);
      }

      return null;
    }, {
      description: "Message button",
    });

    console.log(`[LinkedInMessageService] Clicking Message: @${messageButtonRef}`);
    await this.browser.getLocator(`@${messageButtonRef}`).click();
    await sleep(1500);
    await this.humanIdle();

    const messageBoxRef = await waitForCondition(async () => {
      const snapshot = await this.browser.getSnapshot({ interactive: true });

      console.log("[LinkedInMessageService] Searching for message box in snapshot...");
      Object.entries(snapshot.refs).forEach(([ref, el]) => {
        const name = el.name?.toLowerCase() ?? "";
        if (el.role === "textbox" || el.contentEditable === true || name.includes("message")) {
          console.log(`[LinkedInMessageService] Found candidate: @${ref} - role: ${el.role}, name: "${el.name}", contentEditable: ${el.contentEditable}`);
        }
      });

      const entry = Object.entries(snapshot.refs).find(([_, el]) => {
        const name = el.name?.toLowerCase() ?? "";
        return (
          (el.role === "textbox" || el.contentEditable === true) &&
          !name.includes("search") &&
          el.role !== "button"
        );
      });
      return entry?.[0];
    }, {
      description: "Message input box",
    });

    console.log(`[LinkedInMessageService] Typing message: @${messageBoxRef}`);
    const messageBox = this.browser.getLocator(`@${messageBoxRef}`);
    await messageBox.click();
    await sleep(800);

    await messageBox.pressSequentially(message, {
      delay: 50 + Math.random() * 50,
    });

    await sleep(800);

    console.log("[LinkedInMessageService] Pressing Enter to send...");
    await messageBox.press("Enter");

    await sleep(1500);

    console.log("[LinkedInMessageService] Message sent successfully");
    return {
      success: true,
      status: "sent",
      message: "Message sent successfully.",
      profileUrl,
    };
  }
}
