import fs from 'fs';

const netscapeStr = `# Netscape HTTP Cookie File
# https://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file! Do not edit.

www.linkedin.com	FALSE	/	FALSE	1803532239	_pxvid	39183aaf-eb88-11f0-9eb6-7e368b228959
www.linkedin.com	FALSE	/	FALSE	1803447643	bitmovin_analytics_uuid	8b51c166-4705-4667-8c2a-5ef8072026da
.linkedin.com	TRUE	/	FALSE	1785032423	s_fid	607B2B66DCCB751C-1973103AB084D4D0
.linkedin.com	TRUE	/	FALSE	1774415334	aam_uuid	04531731842349333520821774331657812458
www.linkedin.com	FALSE	/	FALSE	1787375339	g_state	{"i_l":0}
.linkedin.com	TRUE	/	FALSE	1800957450	VID	V_2026_01_26_09_1248
.linkedin.com	TRUE	/	FALSE	1785032423	gpv_pn	www.linkedin.com%2Flearning%2Fbuilding-full-stack-apps-with-react-and-spring
.linkedin.com	TRUE	/	FALSE	1785032418	s_ips	2350
.linkedin.com	TRUE	/	FALSE	1785032419	s_tp	3430
.linkedin.com	TRUE	/	FALSE	1785032423	s_tslv	1769480423388
.linkedin.com	TRUE	/	TRUE	1803532348	bcookie	"v=2&f16abdbd-5df3-43dc-8673-012f62692f81"
.www.linkedin.com	TRUE	/	TRUE	1803532345	bscookie	"v=1&20260223050742e48ed3e0-a151-4f13-8b7a-9ec31a3f61e7AQG8N0G98lOy6-Oq9NqCdZkCVKrfSbeq"
.linkedin.com	TRUE	/	FALSE	1787375266	AMCV_14215E3D5995C57C0A495C55%40AdobeOrg	-637568504%7CMCIDTS%7C20508%7CvVersion%7C5.1.1%7CMCMID%7C04702936986642512990840106435794536993%7CMCAAMLH-1772428066%7C7%7CMCAAMB-1772428066%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1771830466s%7CNONE
.linkedin.com	TRUE	/	TRUE	1779599340	liap	true
.www.linkedin.com	TRUE	/	TRUE	1803359340	li_at	AQEDASgZjt8C1E5bAAABnIjmmYkAAAGcrPMdiU0AQzhyaF2JqdQRcLUrJ4mdMD7R6u4CqZe6CyAIUpzeDPATvNX4mwnmZPlMqpy9BbV3aU1jyDLFYlcHZz3xLGXorkP9mInr-61tfJq9HONdMcFel97S
.www.linkedin.com	TRUE	/	TRUE	1779599340	JSESSIONID	"ajax:3174930809465974889"
.www.linkedin.com	TRUE	/	TRUE	1773205945	timezone	Asia/Calcutta
.www.linkedin.com	TRUE	/	TRUE	1787548345	li_theme	light
.www.linkedin.com	TRUE	/	TRUE	1787548345	li_theme_set	app
.linkedin.com	TRUE	/	TRUE	1803359601	dfpfpt	226ea03d5e6d4d4486de95e0b3fd2bfe
.linkedin.com	TRUE	/	TRUE	1779772348	li_sugr	085e36c4-53c2-4016-89f8-cd07b9844203
.linkedin.com	TRUE	/	TRUE	1779599601	_guid	afcf0b5a-c5e1-4160-b347-1556f7a47cc1
.linkedin.com	TRUE	/	TRUE	1774520297	AnalyticsSyncHistory	AQJjSOZ2TP-B2gAAAZyPKByHLxR1VTlQI9MMK7SK-bkLk1wbDuRCk-vT5asdGFrk-6-5qDwHksj8LFyStPLNhA
.linkedin.com	TRUE	/	FALSE	1803532345	sdui_ver	sdui-flagship:0.1.28681+SduiFlagship0
.linkedin.com	TRUE	/	TRUE	1774577045	lms_ads	AQE7dsmnJKcrLwAAAZySigPrs3OskZHNAMjK64KfJ1MPvZwu_jQmIqaMiYaNDnzRW3L4m9BWdnXIBypM_cBp-IL3CdHDmfDr
.linkedin.com	TRUE	/	TRUE	1774577045	lms_analytics	AQE7dsmnJKcrLwAAAZySigPrs3OskZHNAMjK64KfJ1MPvZwu_jQmIqaMiYaNDnzRW3L4m9BWdnXIBypM_cBp-IL3CdHDmfDr
.linkedin.com	TRUE	/	TRUE	0	lang	v=2&lang=en-us
.linkedin.com	TRUE	/	TRUE	0	fptctx2	taBcrIH61PuCVH7eNCyH0CYjjbqLuI8XF8pleSQW5NYO4Ft%252be33i0DTVeGZwipzfZ3TUm9pQwDf9Mu9cevDVMpRIz4D7Hakb5Is2ovgaSAWYVr9ppnepUm7xiWQzQexbN5Hb5BPim0ObJ0jm09lUBHmAYLJAptzyKdekz0UmbfhmjILftmJRAm6JuRyqrJTH8fd%252fj7O20SjJ8mirt%252fHCvDFthjcifeUzbmgvNrCEkQHhfKCcEBmsmz8GazCXRKJ0x%252bUzUAP8WGidP1G3n2J6xySZJPPumPpBHVsJVlEHlIC6du3URYJbpBcz2lKDTsddcLqdUhFCC%252fJhFJhzT3ZFsBGzM8xzRiEptN18U3MBN6DciVX%252bVp1QsqjDfCwQfpSsfBZsubjCWAJGIsMG56o35g%253d%253d
.linkedin.com	TRUE	/	TRUE	1771997752	__cf_bm	iu10.PXfvu5Nnd3LV25rE34owVcEF2tl3Wuu1o8Dqv8-1771995952-1.0.1.1-NhO6lIYVGx_0e6i9Le6Qo0aWHRo6K8tHM3QUSIib99iZ7AW8P7bpz4Lc1jvceab2NW44adfTDmTW0wYWHNr0xhfBfz1ytR6i3sNkVlML8hc
.linkedin.com	TRUE	/	TRUE	1774588344	UserMatchHistory	AQIrc9cDWP0SwwAAAZyTNm-EwtgUc_6ne5Zfo5X2hytUl6gAhw4D7tPbIIkD7YnU2HWc8dpjFrMYZwgRxHAfvQIHdBy1l5hG6mBloKNEveS027qZNxBj-kduAxAvu1xov0RFx7PygK1jtUiUal3Xk6mu6ffNUnxgoa3qCKsF6FRUxeNxlvRnguBzm-o_CYq9B4zbMMCTdJyptc_ZFYnmdv6oQRw5HMdRWWYGBCFp8cBOi67ZcjoWyQLk0kM2vcdfTgITSVQ6yBIZoOEb1n8Ux8q4bSyIAFsZrnQjDYftuZIGCvMYbdviXk6geAN4aI6Uz4SM3e0HUMwNqi8d235MjvkRdqNtoY0vV7j4nrBIm9o4Vc3aqw
.linkedin.com	TRUE	/	TRUE	1772069906	lidc	"b=TB15:s=T:r=T:a=T:p=T:g=6059:u=1119:x=1:i=1771996349:t=1772069905:v=2:sig=AQGfU12hMwwadJtP6hghEP1DMoV72n8_"`;

function parseNetscape(str) {
  return str.split('
').filter(l => l.trim() && !l.startsWith('#')).map(l => {
    const [domain, flag, path, secure, expires, name, value] = l.split('	');
    return {
      name,
      value: value.replace(/^"(.*)"$/, '$1'),
      domain,
      path,
      expires: parseInt(expires),
      secure: secure === 'TRUE',
      httpOnly: flag === 'TRUE'
    };
  });
}

const cookies = parseNetscape(netscapeStr);
fs.writeFileSync('agentlinkedin/cookies.json', JSON.stringify(cookies, null, 2));

const li_at = cookies.find(c => c.name === 'li_at').value;
const jsessionid = cookies.find(c => c.name === 'JSESSIONID').value;
const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');

const scriptContent = `#!/bin/bash

echo "🚀 Sending connection request to Ryan Vig with updated session..."

curl -i -X POST 'https://www.linkedin.com/flagship-web/rsc-action/actions/server-request?sduiid=com.linkedin.sdui.requests.mynetwork.addaAddConnection' 
  -H 'authority: www.linkedin.com' 
  -H 'accept: */*' 
  -H 'accept-language: en-US,en;q=0.9' 
  -H 'content-type: application/json' 
  -H 'csrf-token: ${jsessionid}' 
  -H 'origin: https://www.linkedin.com' 
  -H 'referer: https://www.linkedin.com/in/ryanjvig/' 
  -H 'sec-ch-ua: "Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"' 
  -H 'sec-ch-ua-mobile: ?0' 
  -H 'sec-ch-ua-platform: "macOS"' 
  -H 'sec-fetch-dest: empty' 
  -H 'sec-fetch-mode: cors' 
  -H 'sec-fetch-site: same-origin' 
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36' 
  -H 'x-li-anchor-page-key: d_flagship3_profile_view_base' 
  -H 'x-li-page-instance: urn:li:page:d_flagship3_profile_view_base;MJBfPWo3TxWNJeEVqBOPew==' 
  -H 'x-li-rsc-stream: true' 
  -H 'x-restli-protocol-version: 2.0.0' 
  -H 'Cookie: ${cookieStr}' 
  --data @payload.json

echo -e "

✅ Request finished."
`;

fs.writeFileSync('send_connect.sh', scriptContent);
console.log('Session updated and send_connect.sh regenerated.');
