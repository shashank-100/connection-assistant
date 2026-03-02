import { BaseLinkedInService } from "./base.js";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export class LinkedInConnectService extends BaseLinkedInService {

  /**
   * Simulate human-like mouse movements on the page
   */
  async _simulateMouseMovements(page) {
    const movements = 3 + Math.floor(Math.random() * 3); // 3-5 movements
    for (let i = 0; i < movements; i++) {
      const x = 200 + Math.random() * 600;
      const y = 200 + Math.random() * 400;
      await page.mouse.move(x, y, { steps: 10 + Math.floor(Math.random() * 20) });
      await sleep(300 + Math.random() * 700); // 0.3-1s between movements
    }
  }

  /**
   * Simulate human-like scrolling to read the profile
   */
  async _simulateScrolling(page) {
    // Scroll down in chunks like a human reading
    const scrolls = 2 + Math.floor(Math.random() * 3); // 2-4 scrolls
    for (let i = 0; i < scrolls; i++) {
      const scrollAmount = 300 + Math.random() * 400; // 300-700px
      await page.evaluate((pixels) => {
        window.scrollBy({ top: pixels, behavior: 'smooth' });
      }, scrollAmount);
      await sleep(800 + Math.random() * 1200); // 0.8-2s between scrolls
    }

    // Sometimes scroll back up a bit (like re-reading)
    if (Math.random() > 0.5) {
      await page.evaluate(() => {
        window.scrollBy({ top: -200 - Math.random() * 200, behavior: 'smooth' });
      });
      await sleep(500 + Math.random() * 500);
    }
  }

  /**
   * Parse the profile HTML to extract connection state + memberId.
   *
   * LinkedIn pre-renders ALL button states (Connect, Pending, Withdraw) in the HTML.
   * The actual current state is stored in the SDUI state map:
   *   "state:invitation:urn:li:member:{memberId}" → stringValue: "Connect" | "Pending" | ...
   *
   * Returns { status: "connect"|"pending"|"not_available", memberId, profileUrn }
   */
  _parseProfileState(html, vanityName) {
    // Step 1: find the memberId for this profile from any vanityName occurrence
    const vanityEscaped = `\\"inviteeVanityName\\":\\"${vanityName}\\"`;
    const vPos = html.indexOf(vanityEscaped);

    let memberId = null;
    let profileUrn = null;
    let firstName = null;
    let lastName = null;

    if (vPos !== -1) {
      const ctx = html.substring(Math.max(0, vPos - 800), vPos + 200);
      const memberIdMatch = ctx.match(/\\"memberId\\":\\"(\d+)\\"/);
      memberId = memberIdMatch ? memberIdMatch[1] : null;
      const urnMatch = ctx.match(/urn:li:fsd_profile:([A-Za-z0-9_-]{20,})/);
      profileUrn = urnMatch ? urnMatch[0] : null;

      // Extract first and last name
      const firstNameMatch = ctx.match(/\\"firstName\\":\\"([^"\\]+)\\"/);
      firstName = firstNameMatch ? firstNameMatch[1] : null;
      const lastNameMatch = ctx.match(/\\"lastName\\":\\"([^"\\]+)\\"/);
      lastName = lastNameMatch ? lastNameMatch[1] : null;
    }

    if (!memberId) {
      return { status: "not_available", memberId: null, profileUrn: null, firstName: null, lastName: null };
    }

    // Step 2: check the SDUI state key to get the ACTUAL current button state
    // "state:invitation:urn:li:member:{memberId}" → stringValue tells us the real state
    const stateKey = `state:invitation:urn:li:member:${memberId}`;
    const statePos = html.indexOf(stateKey);

    if (statePos !== -1) {
      const stateCtx = html.substring(statePos, statePos + 400);
      const valueMatch = stateCtx.match(/\\"stringValue\\":\\"([^"\\]+)\\"/);
      const currentValue = valueMatch ? valueMatch[1] : null;
      console.log(`[LinkedInConnectService] SDUI state for memberId=${memberId}: "${currentValue}"`);

      if (currentValue === 'Connect') {
        return { status: "connect", memberId, profileUrn, firstName, lastName };
      } else if (currentValue) {
        // "Pending", "Message", "Follow", etc.
        return { status: "pending", memberId, profileUrn, firstName, lastName };
      }
    }

    // Step 3: fallback — look for addaAddConnection payload for this profile's canonical URL
    let pos = 0;
    while ((pos = html.indexOf('addaAddConnection', pos)) !== -1) {
      const ctx = html.substring(pos, pos + 1500);
      if (ctx.includes(`linkedin.com/in/${vanityName}`) || ctx.includes(`linkedin.com\\/in\\/${vanityName}`)) {
        const memberIdMatch = ctx.match(/\\"memberId\\":\\"(\d+)\\"/);
        if (memberIdMatch) {
          return {
            status: "connect",
            memberId: memberIdMatch[1],
            profileUrn,
            firstName,
            lastName,
          };
        }
      }
      pos++;
    }

    return { status: "not_available", memberId, profileUrn, firstName, lastName };
  }

  async _tryDomConnect(page, profileUrl) {
    try {
      // LinkedIn Connect button selectors (try multiple)
      const connectSelectors = [
        'button[aria-label^="Connect"]',
        'button[aria-label*="Invite"][aria-label*="connect"]',
        '.pvs-profile-actions button[aria-label*="Connect"]',
        '.ph5 button[aria-label*="Connect"]',
      ];

      let connectBtn = null;
      for (const sel of connectSelectors) {
        const btn = page.locator(sel).first();
        if (await btn.count() > 0) {
          connectBtn = btn;
          console.log(`[LinkedInConnectService] Found Connect button via: ${sel}`);
          break;
        }
      }

      // Try text-based match if selectors didn't work
      if (!connectBtn) {
        const byText = page.getByRole('button', { name: /^Connect$/ }).first();
        if (await byText.count() > 0) {
          connectBtn = byText;
          console.log('[LinkedInConnectService] Found Connect button via text match');
        }
      }

      if (!connectBtn) {
        // Check if already pending
        const pendingBtn = page.locator('button[aria-label*="Pending"]').first();
        if (await pendingBtn.count() > 0) {
          console.log('[LinkedInConnectService] Already pending');
          return { success: true, status: 'already_sent', profileUrl };
        }
        console.log('[LinkedInConnectService] No Connect button found in DOM');
        return { success: false, status: 'not_available', profileUrl };
      }

      await connectBtn.click();
      await sleep(1500 + Math.random() * 1000);

      // Handle "Add a note" dialog — click "Send without a note"
      const sendWithoutNote = page.getByRole('button', { name: /Send without a note/i }).first();
      if (await sendWithoutNote.count() > 0) {
        await sendWithoutNote.click();
        console.log('[LinkedInConnectService] Sent without note');
        await sleep(1000 + Math.random() * 1000);
        return { success: true, status: 'sent', profileUrl };
      }

      // Some flows show "Send" directly
      const sendBtn = page.getByRole('button', { name: /^Send$/i }).first();
      if (await sendBtn.count() > 0) {
        await sendBtn.click();
        console.log('[LinkedInConnectService] Sent via Send button');
        await sleep(1000 + Math.random() * 1000);
        return { success: true, status: 'sent', profileUrl };
      }

      // Dialog didn't appear but button was clicked — treat as success
      return { success: true, status: 'sent', profileUrl };

    } catch (err) {
      console.log(`[LinkedInConnectService] DOM click failed: ${err.message}`);
      return { success: false, status: 'dom_error', profileUrl };
    }
  }

  async sendConnectRequest(profileUrl) {
    console.log(`[LinkedInConnectService] Processing: ${profileUrl}`);

    const vanityName = profileUrl.replace(/\/$/, '').split('/').pop();
    const page = this.browser.getPage();

    // Verify login first
    console.log('[LinkedInConnectService] Verifying login...');
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'load', timeout: 30000 });
    await sleep(2000);
    const currentUrl = page.url();
    if (currentUrl.includes('login') || currentUrl.includes('authwall') || currentUrl.includes('checkpoint')) {
      throw new Error('Not logged in — cookies expired or invalid');
    }
    console.log('[LinkedInConnectService] Logged in ✓');

    // Capture the profile HTML response (it embeds the SDUI action payload)
    let profileHtml = null;
    const onResponse = async (resp) => {
      try {
        const url = resp.url();
        const ct = resp.headers()['content-type'] || '';
        if (url.includes(`/in/${vanityName}`) && ct.includes('text/html')) {
          profileHtml = await resp.text().catch(() => null);
        }
      } catch (e) {}
    };
    page.on('response', onResponse);

    try {
      await page.goto(profileUrl, { waitUntil: 'load', timeout: 45000 });
    } catch (e) {
      page.off('response', onResponse);
      throw new Error(`Failed to navigate: ${e.message}`);
    }

    // Human-like behavior: Wait for page to render
    await sleep(2000 + Math.random() * 1000); // 2-3 seconds
    page.off('response', onResponse);

    // Simulate human reading the profile
    console.log('[LinkedInConnectService] Simulating human behavior...');

    // Random mouse movements
    await this._simulateMouseMovements(page);

    // Scroll down the page to "read" the profile
    await this._simulateScrolling(page);

    // Wait as if reading content
    const readTime = 3000 + Math.random() * 4000; // 3-7 seconds
    console.log(`[LinkedInConnectService] Reading profile for ${Math.round(readTime/1000)}s...`);
    await sleep(readTime);

    if (!profileHtml) {
      console.log('[LinkedInConnectService] Could not capture profile HTML');
      return { success: false, status: "no_html", profileUrl };
    }

    const state = this._parseProfileState(profileHtml, vanityName);
    console.log(`[LinkedInConnectService] State: ${state.status}, memberId: ${state.memberId}`);

    if (state.status === "pending") {
      return { success: true, status: "already_sent", profileUrl };
    }

    if (state.status === "not_available" || !state.memberId) {
      // Fallback: try clicking the Connect button directly via DOM
      console.log('[LinkedInConnectService] Falling back to DOM click...');
      const domResult = await this._tryDomConnect(page, profileUrl);
      return domResult;
    }

    // Get FRESH CSRF token from the page cookies (not the stored ones)
    const freshCookies = await page.context().cookies();
    const jsessionCookie = freshCookies.find(c => c.name === 'JSESSIONID')?.value;
    const csrfToken = jsessionCookie?.replace(/^"(.*)"$/, '$1');

    console.log(`[LinkedInConnectService] Using fresh CSRF token: ${csrfToken?.substring(0, 20)}...`);

    const sduiId = 'com.linkedin.sdui.requests.mynetwork.addaAddConnection';

    // Build the inner payload — required fields from the SDUI action spec
    const innerPayload = {
      inviteeUrn: { memberId: state.memberId },
      renderMode: "IconAndText",
      isDisabled: { key: `connect-button-disabled-${vanityName}`, namespace: null },
      connectionState: { key: `state:invitation:urn:li:member:${state.memberId}`, namespace: null },
      origin: "InvitationOrigin_PROFILE",
      profileCanonicalUrl: `https://www.linkedin.com/in/${vanityName}`,
      firstFiveInviteCount: { key: "guidedFlowNumSentInvites", namespace: "" },
      guidedFlowUrlandProfileList: { key: "guidedFlowUrlAndPictureList", namespace: "guidedFlowUrlAndPictureListNameSpace" },
      postActionSentConfigs: [],
    };
    if (state.profileUrn) {
      innerPayload.nonIterableProfileId = state.profileUrn;
    }
    if (state.firstName) {
      innerPayload.firstName = state.firstName;
    }
    if (state.lastName) {
      innerPayload.lastName = state.lastName;
    }

    const requestedStateKeys = [
      { "$type": "proto.sdui.StateKey", value: "guidedFlowNumSentInvites", key: { "$type": "proto.sdui.Key", value: { "$case": "id", id: "guidedFlowNumSentInvites" } }, namespace: "", isEncrypted: false },
      { "$type": "proto.sdui.StateKey", value: "guidedFlowUrlAndPictureList", key: { "$type": "proto.sdui.Key", value: { "$case": "id", id: "guidedFlowUrlAndPictureList" } }, namespace: "guidedFlowUrlAndPictureListNameSpace", isEncrypted: false },
    ];

    const requestBody = {
      requestId: sduiId,
      serverRequest: {
        "$type": "proto.sdui.actions.core.ServerRequest",
        requestId: sduiId,
        requestedArguments: {
          "$type": "proto.sdui.actions.requests.RequestedArguments",
          payload: innerPayload,
          requestedStateKeys,
          requestMetadata: { "$type": "proto.sdui.common.RequestMetadata" },
        },
        isStreaming: false,
        rumPageKey: "",
        isApfcEnabled: false,
      },
      states: [],
      requestedArguments: {
        "$type": "proto.sdui.actions.requests.RequestedArguments",
        payload: innerPayload,
        requestedStateKeys,
        requestMetadata: { "$type": "proto.sdui.common.RequestMetadata" },
        states: [],
        screenId: "com.linkedin.sdui.flagshipnav.profile.Profile",
      },
    };

    console.log(`[LinkedInConnectService] Calling API for memberId=${state.memberId}, profileUrn=${state.profileUrn}`);

    const apiUrl = `https://www.linkedin.com/flagship-web/rsc-action/actions/server-request?sduiid=${sduiId}`;

    // Use page.evaluate to call fetch from inside the browser — cookies and SDUI headers native
    const result = await page.evaluate(async ({ url, body, csrf, referer }) => {
      try {
        const resp = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'csrf-token': csrf,
            'x-li-rsc-stream': 'true',
            'x-li-application-version': '0.2.4113',
            'x-li-anchor-page-key': 'd_flagship3_profile_view_base',
            'x-li-track': JSON.stringify({
              clientVersion: '0.2.4113',
              mpVersion: '0.2.4113',
              osName: 'web',
              timezoneOffset: 5.5,
              timezone: 'Asia/Calcutta',
              deviceFormFactor: 'DESKTOP',
              mpName: 'web',
              displayDensity: 1,
              displayWidth: 1280,
              displayHeight: 720
            }),
            'referer': referer,
            'sec-ch-ua': '"Chromium";v="143", "Not A(Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
          },
          body: JSON.stringify(body),
        });
        const text = await resp.text();
        return { status: resp.status, body: text.substring(0, 500) };
      } catch (e) {
        return { status: -1, body: e.message };
      }
    }, { url: apiUrl, body: requestBody, csrf: csrfToken || '', referer: profileUrl });

    console.log(`[LinkedInConnectService] API status: ${result.status}`);
    if (result.body) console.log(`[LinkedInConnectService] API response: ${result.body}`);

    // Human-like behavior: Wait after sending request (like reviewing the confirmation)
    const afterRequestWait = 2000 + Math.random() * 3000; // 2-5 seconds
    console.log(`[LinkedInConnectService] Waiting ${Math.round(afterRequestWait/1000)}s after request...`);
    await sleep(afterRequestWait);

    // Maybe move mouse again (natural fidgeting)
    if (Math.random() > 0.5) {
      await page.mouse.move(
        300 + Math.random() * 400,
        200 + Math.random() * 300,
        { steps: 15 }
      );
    }

    if (result.status >= 200 && result.status < 300) {
      return { success: true, status: "sent", profileUrl };
    }

    if (result.body?.includes('pending') || result.body?.includes('already')) {
      return { success: true, status: "already_sent", profileUrl };
    }

    return { success: false, status: `api_error_${result.status}`, profileUrl };
  }
}
