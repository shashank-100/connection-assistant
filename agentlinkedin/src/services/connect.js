import { BaseLinkedInService } from "./base.js";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export class LinkedInConnectService extends BaseLinkedInService {

  async humanIdle() {
    await sleep(2000 + Math.random() * 2000);
    try {
      const page = this.browser.getPage();
      await page.mouse.move(200, 300);
      await sleep(600);
      await page.mouse.move(400, 500);
      await sleep(1200);
    } catch (e) {
      console.log("Mouse move failed", e.message);
    }
  }

  async sendConnectRequest(profileUrl) {
    console.log(`[LinkedInConnectService] Opening profile: ${profileUrl}`);

    const page = this.browser.getPage();

    try {
      await page.goto(profileUrl, { waitUntil: 'load', timeout: 45000 });
      console.log(`[LinkedInConnectService] Navigation completed`);
    } catch (e) {
      console.error(`[LinkedInConnectService] Navigation error: ${e.message}`);
      throw new Error(`Failed to navigate to profile: ${e.message}`);
    }

    await sleep(1500);
    await this.humanIdle();
    console.log(`[LinkedInConnectService] Human idle completed`);

    console.log(`[LinkedInConnectService] Getting page snapshot...`);
    const snapshot = await this.browser.getSnapshot({ interactive: true });

    const pendingPrimary = Object.values(snapshot.refs).find(
      el =>
        el.role === "button" &&
        el.name?.toLowerCase().includes("pending")
    );

    if (pendingPrimary) {
      console.log("[LinkedInConnectService] Connection request already sent (Pending)");
      return { success: true, status: "already_sent", profileUrl };
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
        console.log("[LinkedInConnectService] No Connect or More button found");
        return { success: false, status: "not_available", profileUrl };
      }

      console.log(`[LinkedInConnectService] Clicking More: @${moreRef}`);
      await this.browser.getLocator(`@${moreRef}`).click();

      await sleep(1500);
      await this.humanIdle();

      const dropdownSnapshot = await this.browser.getSnapshot({ interactive: true });

      const pendingDropdown = Object.values(dropdownSnapshot.refs).find(
        el => el.name?.toLowerCase().includes("pending")
      );

      if (pendingDropdown) {
        console.log("[LinkedInConnectService] Connection request already sent (Pending in More)");
        return { success: true, status: "already_sent", profileUrl };
      }

      const dropdownConnectRef = Object.entries(dropdownSnapshot.refs).find(
        ([_, el]) => el.name?.toLowerCase().includes("connect")
      )?.[0];

      if (!dropdownConnectRef) {
        console.log("[LinkedInConnectService] Connect not found in More dropdown");
        return { success: false, status: "not_found", profileUrl };
      }

      connectRef = dropdownConnectRef;
    }

    console.log(`[LinkedInConnectService] Clicking Connect: @${connectRef}`);
    await this.browser.getLocator(`@${connectRef}`).click();

    await sleep(1500);
    await this.humanIdle();

    const modalSnapshot = await this.browser.getSnapshot({ interactive: true });

    const modalPending = Object.values(modalSnapshot.refs).find(
      el => el.name?.toLowerCase().includes("pending")
    );

    if (modalPending) {
      console.log("[LinkedInConnectService] Connection request already sent (Modal)");
      return { success: true, status: "already_sent", profileUrl };
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
      console.log("[LinkedInConnectService] Send button not found in modal");
      return { success: false, status: "modal_missing", profileUrl };
    }

    console.log(`[LinkedInConnectService] Clicking Send: @${sendRef}`);
    await this.browser.getLocator(`@${sendRef}`).click();

    console.log("[LinkedInConnectService] Connection request sent successfully");
    return { success: true, status: "sent", profileUrl };
  }
}
