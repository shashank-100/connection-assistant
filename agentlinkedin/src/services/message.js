import { BaseLinkedInService } from "./base.js";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForCondition(fn, {
  timeout = 15000,
  interval = 800,
  description = "condition"
} = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await fn();
    if (result) return result;
    await sleep(interval);
  }
  throw new Error(`Timeout waiting for ${description}`);
}

export class LinkedInMessageService extends BaseLinkedInService {
  async humanIdle() {
    try {
      const page = this.browser.getPage();
      await sleep(1000 + Math.random() * 2000);

      await page.mouse.move(
        200 + Math.random() * 200,
        300 + Math.random() * 200
      );
      await sleep(400 + Math.random() * 800);

      await page.mouse.move(
        400 + Math.random() * 300,
        500 + Math.random() * 300
      );
      await sleep(800 + Math.random() * 1200);
    } catch (e) {
      console.log("Human idle skipped:", e.message);
    }
  }

  async sendMessage(profileUrl, message) {
    console.log(`Opening profile: ${profileUrl}`);

    const page = this.browser.getPage();

    try {
      await page.goto(profileUrl, {
        waitUntil: "load",
        timeout: 20000,
      });
    } catch (e) {
      console.log(`Navigation warning: ${e.message}`);
    }

    await this.humanIdle();

    const messageButtonRef = await waitForCondition(async () => {
      const snapshot = await this.browser.getSnapshot({ interactive: true });

      const direct = Object.entries(snapshot.refs).find(([_, el]) => {
        const name = el.name?.toLowerCase() ?? "";
        return el.role === "button" && name.includes("message");
      });
      if (direct) return direct[0];

      const more = Object.entries(snapshot.refs).find(([_, el]) => {
        const name = el.name?.toLowerCase() ?? "";
        return el.role === "button" && (name.includes("more") || name === "More actions");
      });

      if (more) {
        console.log(`Clicking More: @${more[0]}`);
        await this.browser.getLocator(`@${more[0]}`).click();
        await sleep(1500);
      }

      return null;
    }, {
      description: "Message button",
    });

    console.log(`Clicking Message: @${messageButtonRef}`);
    await this.browser.getLocator(`@${messageButtonRef}`).click();
    await sleep(2000);
    await this.humanIdle();

    const messageBoxRef = await waitForCondition(async () => {
      const snapshot = await this.browser.getSnapshot({ interactive: true });
      
      console.log("Searching for message box in snapshot...");
      Object.entries(snapshot.refs).forEach(([ref, el]) => {
        const name = el.name?.toLowerCase() ?? "";
        if (el.role === "textbox" || el.contentEditable === true || name.includes("message")) {
          console.log(`Found candidate: @${ref} - role: ${el.role}, name: "${el.name}", contentEditable: ${el.contentEditable}`);
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

    console.log(`Typing message: @${messageBoxRef}`);
    const messageBox = this.browser.getLocator(`@${messageBoxRef}`);
    await messageBox.click();
    await sleep(1000);

    await messageBox.pressSequentially(message, {
      delay: 50 + Math.random() * 50,
    });

    await sleep(1000);

    console.log("Pressing Enter to send...");
    await messageBox.press("Enter");

    await sleep(2000);

    return {
      success: true,
      status: "sent",
      message: "Message sent successfully.",
    };
  }
}
