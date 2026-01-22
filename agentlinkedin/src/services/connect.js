import { BaseLinkedInService } from "./base.js";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export class LinkedInConnectService extends BaseLinkedInService {

  async humanIdle() {
    await sleep(2500 + Math.random() * 2000);
    try {
      const page = this.browser.getPage();
      await page.mouse.move(200, 300);
      await sleep(700);
      await page.mouse.move(450, 420);
      await sleep(1200);
    } catch (e) {
      console.log("Mouse move failed", e.message);
    }
  }

  async sendConnectRequest(profileUrl) {
    console.log(`Opening profile: ${profileUrl}`);

    try {
      await this.browser.getPage().goto(profileUrl, { waitUntil: 'load', timeout: 60000 });
    } catch (e) {
      console.log(`Navigation warning: ${e.message}`);
    }

    await sleep(2000);
    await this.humanIdle();

    const snapshot = await this.browser.getSnapshot({ interactive: true });

    if (snapshot.tree?.includes('"1st"')) {
      console.log("Already connected (1st degree)");
      return { success: true, status: "already_connected" };
    }

    const pendingPrimary = Object.values(snapshot.refs).find(
      el =>
        el.role === "button" &&
        el.name?.toLowerCase().includes("pending")
    );

    if (pendingPrimary) {
      console.log("Connection request already sent (Pending)");
      return { success: true, status: "already_sent" };
    }

    let connectRef = Object.entries(snapshot.refs).find(
      ([_, el]) =>
        el.role === "button" &&
        el.name?.toLowerCase().includes("connect")
    )?.[0];

    if (!connectRef) {
      const moreRef = Object.entries(snapshot.refs).find(
        ([_, el]) =>
          el.role === "button" &&
          (el.name === "More" || el.name === "More actions")
      )?.[0];

      if (!moreRef) {
        console.log("No Connect or More button found");
        return { success: false, status: "not_available" };
      }

      console.log(`Clicking More: @${moreRef}`);
      await this.browser.getLocator(`@${moreRef}`).click();

      await sleep(2000);
      await this.humanIdle();

      const dropdownSnapshot = await this.browser.getSnapshot({ interactive: true });

      const pendingDropdown = Object.values(dropdownSnapshot.refs).find(
        el => el.name?.toLowerCase().includes("pending")
      );

      if (pendingDropdown) {
        console.log("Connection request already sent (Pending in More)");
        return { success: true, status: "already_sent" };
      }

      const dropdownConnectRef = Object.entries(dropdownSnapshot.refs).find(
        ([_, el]) => el.name?.toLowerCase().includes("connect")
      )?.[0];

      if (!dropdownConnectRef) {
        console.log("Connect not found in More dropdown");
        return { success: false, status: "not_found" };
      }

      connectRef = dropdownConnectRef;
    }

    console.log(`Clicking Connect: @${connectRef}`);
    await this.browser.getLocator(`@${connectRef}`).click();

    await sleep(2000);
    await this.humanIdle();

    const modalSnapshot = await this.browser.getSnapshot({ interactive: true });

    const modalPending = Object.values(modalSnapshot.refs).find(
      el => el.name?.toLowerCase().includes("pending")
    );

    if (modalPending) {
      console.log("Connection request already sent (Modal)");
      return { success: true, status: "already_sent" };
    }

    const sendRef = Object.entries(modalSnapshot.refs).find(
      ([_, el]) =>
        el.role === "button" &&
        el.name &&
        (
          el.name.toLowerCase().includes("send now") ||
          el.name.toLowerCase().includes("without a note") ||
          el.name.toLowerCase().includes("send")
        )
    )?.[0];

    if (!sendRef) {
      console.log("Send button not found in modal");
      return { success: false, status: "modal_missing" };
    }

    console.log(`Clicking Send: @${sendRef}`);
    await this.browser.getLocator(`@${sendRef}`).click();

    return { success: true, status: "sent" };
  }
}
