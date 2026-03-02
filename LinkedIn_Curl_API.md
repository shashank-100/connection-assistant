# LinkedIn Connection Request API Documentation

This document contains two ways to send a LinkedIn connection request to **Ryan Vig** (`https://www.linkedin.com/in/ryanjvig/`) via `curl`.

---

## 1. Simplified App API (Recommended)
This uses your local or Railway backend which handles all the complex SDUI payload generation and cookie management automatically.

**Prerequisite:** Ensure your server is running (e.g., `npm start` in `agentlinkedin`).

```bash
curl -X POST http://localhost:3000/api 
  -H "Content-Type: application/json" 
  -d '{
    "action": "linkedin-connect",
    "profileUrl": "https://www.linkedin.com/in/ryanjvig/",
    "userId": "shashank"
  }'
```

---

## 2. Direct LinkedIn Internal API (Advanced)
This mimics the exact request made by the LinkedIn web application. It requires manual extraction of the `memberId`, `csrf-token`, and active session cookies.

**Note:** The cookies and tokens below are extracted from your local `cookies.json`.

```bash
curl -X POST 'https://www.linkedin.com/flagship-web/rsc-action/actions/server-request?sduiid=com.linkedin.sdui.requests.mynetwork.addaAddConnection' 
  -H 'Content-Type: application/json' 
  -H 'csrf-token: ajax:1849305005458482706' 
  -H 'x-li-rsc-stream: true' 
  -H 'x-li-anchor-page-key: d_flagship3_profile_view_base' 
  -H 'Cookie: JSESSIONID="ajax:1849305005458482706"; li_at=AQEDASgZjt8E9IT-AAABm9sOOxMAAAGcIyOs104AAbiHF74zZxSBPD0KK4t9GBwv2-isb0bMkBDpeRyi7IjYYBD0w0e_XJ-L6v9k3147rE_xsIbdHkUk86qTDGCTZznMYXmluZxJSDVWOD5mtJxvypRu;' 
  --data-raw '{
    "requestId": "com.linkedin.sdui.requests.mynetwork.addaAddConnection",
    "serverRequest": {
      "$type": "proto.sdui.actions.core.ServerRequest",
      "requestId": "com.linkedin.sdui.requests.mynetwork.addaAddConnection",
      "requestedArguments": {
        "$type": "proto.sdui.actions.requests.RequestedArguments",
        "payload": {
          "inviteeUrn": { "memberId": "789630957" },
          "renderMode": "IconAndText",
          "isDisabled": { "key": "connect-button-disabled-ryanjvig", "namespace": null },
          "connectionState": { "key": "state:invitation:urn:li:member:789630957", "namespace": null },
          "origin": "InvitationOrigin_PROFILE",
          "profileCanonicalUrl": "https://www.linkedin.com/in/ryanjvig",
          "firstFiveInviteCount": { "key": "guidedFlowNumSentInvites", "namespace": "" },
          "guidedFlowUrlandProfileList": { "key": "guidedFlowUrlAndPictureList", "namespace": "guidedFlowUrlAndPictureListNameSpace" },
          "nonIterableProfileId": "urn:li:fsd_profile:ACoAAC8Qz-0BSBHRbP1rG49hpCPLmfUFi1Q1DXg",
          "postActionSentConfigs": []
        },
        "requestedStateKeys": [
          { "$type": "proto.sdui.StateKey", "value": "guidedFlowNumSentInvites", "key": { "$type": "proto.sdui.Key", "value": { "$case": "id", "id": "guidedFlowNumSentInvites" } }, "namespace": "", "isEncrypted": false },
          { "$type": "proto.sdui.StateKey", "value": "guidedFlowUrlAndPictureList", "key": { "$type": "proto.sdui.Key", "value": { "$case": "id", "id": "guidedFlowUrlAndPictureList" } }, "namespace": "guidedFlowUrlAndPictureListNameSpace", "isEncrypted": false }
        ],
        "requestMetadata": { "$type": "proto.sdui.common.RequestMetadata" }
      },
      "isStreaming": false,
      "rumPageKey": "",
      "isApfcEnabled": false
    },
    "states": [],
    "requestedArguments": {
      "$type": "proto.sdui.actions.requests.RequestedArguments",
      "payload": {
        "inviteeUrn": { "memberId": "789630957" },
        "renderMode": "IconAndText",
        "isDisabled": { "key": "connect-button-disabled-ryanjvig", "namespace": null },
        "connectionState": { "key": "state:invitation:urn:li:member:789630957", "namespace": null },
        "origin": "InvitationOrigin_PROFILE",
        "profileCanonicalUrl": "https://www.linkedin.com/in/ryanjvig",
        "firstFiveInviteCount": { "key": "guidedFlowNumSentInvites", "namespace": "" },
        "guidedFlowUrlandProfileList": { "key": "guidedFlowUrlAndPictureList", "namespace": "guidedFlowUrlAndPictureListNameSpace" },
        "nonIterableProfileId": "urn:li:fsd_profile:ACoAAC8Qz-0BSBHRbP1rG49hpCPLmfUFi1Q1DXg",
        "postActionSentConfigs": []
      },
      "requestedStateKeys": [
        { "$type": "proto.sdui.StateKey", "value": "guidedFlowNumSentInvites", "key": { "$type": "proto.sdui.Key", "value": { "$case": "id", "id": "guidedFlowNumSentInvites" } }, "namespace": "", "isEncrypted": false },
        { "$type": "proto.sdui.StateKey", "value": "guidedFlowUrlAndPictureList", "key": { "$type": "proto.sdui.Key", "value": { "$case": "id", "id": "guidedFlowUrlAndPictureList" } }, "namespace": "guidedFlowUrlAndPictureListNameSpace", "isEncrypted": false }
      ],
      "requestMetadata": { "$type": "proto.sdui.common.RequestMetadata" },
      "states": [],
      "screenId": "com.linkedin.sdui.flagshipnav.profile.Profile"
    }
  }'
```
