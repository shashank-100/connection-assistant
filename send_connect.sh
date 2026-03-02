#!/bin/bash

echo "🚀 Sending connection request to Aanchal Kaushik..."

curl -i -X POST 'https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreateV2&decorationId=com.linkedin.voyager.dash.deco.relationships.InvitationCreationResultWithInvitee-2' \
  -H 'authority: www.linkedin.com' \
  -H 'accept: application/vnd.linkedin.normalized+json+2.1' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'content-type: application/json; charset=UTF-8' \
  -H 'csrf-token: ajax:3174930809465974889' \
  -H 'origin: https://www.linkedin.com' \
  -H 'referer: https://www.linkedin.com/in/aanchal-kaushik-98050a203/' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' \
  -H 'x-li-lang: en_US' \
  -H 'x-restli-protocol-version: 2.0.0' \
  -H 'Cookie: li_at=AQEDASgZjt8DbToYAAABnJNY-98AAAGct2V_304AJeE1jYyeT72qywM7O34TsEGOraf598S37HSwlLuymBL8NPNHNS49CVJqr_3iCCDwLYCPVtdmcaIgQBi0ha5oNyhj-Bfe9FujkCSpyeS_2rL63cJA; JSESSIONID="ajax:3174930809465974889"; liap=true; bcookie="v=2&f16abdbd-5df3-43dc-8673-012f62692f81"; bscookie="v=1&20260223050742e48ed3e0-a151-4f13-8b7a-9ec31a3f61e7AQG8N0G98lOy6-Oq9NqCdZkCVKrfSbeq";' \
  --data @payload.json

echo -e "\n\n✅ Request finished."
