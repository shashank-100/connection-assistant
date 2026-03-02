import fs from 'fs';
import { BaseLinkedInService } from './src/services/base.js';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf-8'));
  const csrf = cookies.find(c => c.name === 'JSESSIONID')?.value;

  const service = new BaseLinkedInService(cookies);
  await service.init();
  const page = service.browser.getPage();

  // Intercept responses to see what the state says for each test profile
  page.on('response', async (resp) => {
    if (resp.url().includes('addaAddConnection')) {
      const body = await resp.text().catch(() => '');
      console.log('  → addaAddConnection response:', resp.status(), body.substring(0, 150));
    }
  });

  // Test several profiles — check their state and try the API
  const testProfiles = [
    { vanityName: 'maxwell-riseman-72812822a', memberId: null },
    { vanityName: 'jennykovacs', memberId: null },
    { vanityName: 'imakecomics', memberId: null },
  ];

  const sduiId = 'com.linkedin.sdui.requests.mynetwork.addaAddConnection';

  for (const profile of testProfiles) {
    const { vanityName } = profile;
    console.log(`\n\n=== Testing: ${vanityName} ===`);

    let profileHtml = null;
    const handler = async (resp) => {
      try {
        const url = resp.url();
        const ct = resp.headers()['content-type'] || '';
        if (url.includes(`/in/${vanityName}`) && ct.includes('text/html')) {
          profileHtml = await resp.text().catch(() => null);
        }
      } catch(e) {}
    };
    page.on('response', handler);
    await page.goto(`https://www.linkedin.com/in/${vanityName}/`, { waitUntil: 'load', timeout: 45000 });
    await sleep(2000);
    page.off('response', handler);

    if (!profileHtml) { console.log('  No HTML captured'); continue; }

    // Find memberId and state
    const vanityEscaped = `\\"inviteeVanityName\\":\\"${vanityName}\\"`;
    const vPos = profileHtml.indexOf(vanityEscaped);
    if (vPos === -1) { console.log('  inviteeVanityName not found'); continue; }

    const ctx = profileHtml.substring(Math.max(0, vPos - 800), vPos + 200);
    const memberIdMatch = ctx.match(/\\"memberId\\":\\"(\d+)\\"/);
    const memberId = memberIdMatch ? memberIdMatch[1] : null;
    if (!memberId) { console.log('  memberId not found'); continue; }

    const stateKey = `state:invitation:urn:li:member:${memberId}`;
    const statePos = profileHtml.indexOf(stateKey);
    let currentState = 'unknown';
    if (statePos !== -1) {
      const sc = profileHtml.substring(statePos, statePos + 200);
      const vm = sc.match(/\\"stringValue\\":\\"([^"\\]+)\\"/);
      currentState = vm ? vm[1] : 'unknown';
    }
    console.log(`  memberId: ${memberId}, state: ${currentState}`);

    if (currentState !== 'Connect') {
      console.log('  Skipping (not Connect state)');
      continue;
    }

    // Try the API
    const innerPayload = {
      inviteeUrn: { memberId },
      renderMode: "IconAndText",
      isDisabled: { key: `connect-button-disabled-${vanityName}`, namespace: null },
      connectionState: { key: `state:invitation:urn:li:member:${memberId}`, namespace: null },
      origin: "InvitationOrigin_PROFILE",
      profileCanonicalUrl: `https://www.linkedin.com/in/${vanityName}`,
      firstFiveInviteCount: { key: "guidedFlowNumSentInvites", namespace: "" },
      guidedFlowUrlandProfileList: { key: "guidedFlowUrlAndPictureList", namespace: "guidedFlowUrlAndPictureListNameSpace" },
      postActionSentConfigs: [],
    };
    const requestedStateKeys = [
      { "$type": "proto.sdui.StateKey", value: "guidedFlowNumSentInvites", key: { "$type": "proto.sdui.Key", value: { "$case": "id", id: "guidedFlowNumSentInvites" } }, namespace: "", isEncrypted: false },
      { "$type": "proto.sdui.StateKey", value: "guidedFlowUrlAndPictureList", key: { "$type": "proto.sdui.Key", value: { "$case": "id", id: "guidedFlowUrlAndPictureList" } }, namespace: "guidedFlowUrlAndPictureListNameSpace", isEncrypted: false },
    ];
    const requestBody = {
      requestId: sduiId,
      serverRequest: {
        "$type": "proto.sdui.actions.core.ServerRequest",
        requestId: sduiId,
        requestedArguments: { "$type": "proto.sdui.actions.requests.RequestedArguments", payload: innerPayload, requestedStateKeys, requestMetadata: { "$type": "proto.sdui.common.RequestMetadata" } },
        isStreaming: false, rumPageKey: "", isApfcEnabled: false,
      },
      states: [],
      requestedArguments: { "$type": "proto.sdui.actions.requests.RequestedArguments", payload: innerPayload, requestedStateKeys, requestMetadata: { "$type": "proto.sdui.common.RequestMetadata" }, states: [], screenId: "com.linkedin.sdui.flagshipnav.profile.Profile" },
    };

    const result = await page.evaluate(async ({ url, body, csrf }) => {
      const resp = await fetch(url, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'csrf-token': csrf, 'Accept': '*/*', 'x-li-rsc-stream': 'true', 'x-li-application-version': '0.2.4113', 'x-li-anchor-page-key': 'd_flagship3_profile_view_base' }, body: JSON.stringify(body) });
      const text = await resp.text();
      return { status: resp.status, body: text.substring(0, 200) };
    }, { url: `https://www.linkedin.com/flagship-web/rsc-action/actions/server-request?sduiid=${sduiId}`, body: requestBody, csrf });

    console.log(`  API result: ${result.status} - ${result.body?.substring(0, 100)}`);
  }

  await service.close();
}

main().catch(console.error);
