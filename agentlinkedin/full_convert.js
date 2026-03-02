import fs from 'fs';

const netscapeContent = `# Netscape HTTP Cookie File
# https://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file! Do not edit.

www.linkedin.com	FALSE	/	FALSE	1803532239	_pxvid	39183aaf-eb88-11f0-9eb6-7e368b228959
www.linkedin.com	FALSE	/	FALSE	1803447643	bitmovin_analytics_uuid	8b51c166-4705-4667-8c2a-5ef8072026da
.linkedin.com	TRUE	/	FALSE	1785032423	s_fid	607B2B66DCCB751C-1973103AB084D4D0
.linkedin.com	TRUE	/	FALSE	1774588649	aam_uuid	04531731842349333520821774331657812458
www.linkedin.com	FALSE	/	FALSE	1787548656	g_state	{"i_l":0}
.linkedin.com	TRUE	/	FALSE	1800957450	VID	V_2026_01_26_09_1248
.linkedin.com	TRUE	/	FALSE	1785032423	gpv_pn	www.linkedin.com%2Flearning%2Fbuilding-full-stack-apps-with-react-and-spring
.linkedin.com	TRUE	/	FALSE	1785032418	s_ips	2350
.linkedin.com	TRUE	/	FALSE	1785032419	s_tp	3430
.linkedin.com	TRUE	/	FALSE	1785032423	s_tslv	1769480423388
.linkedin.com	TRUE	/	TRUE	1803532678	bcookie	"v=2&f16abdbd-5df3-43dc-8673-012f62692f81"
.www.linkedin.com	TRUE	/	TRUE	1803532675	bscookie	"v=1&20260223050742e48ed3e0-a151-4f13-8b7a-9ec31a3f61e7AQG8N0G98lOy6-Oq9NqCdZkCVKrfSbeq"
.www.linkedin.com	TRUE	/	TRUE	1779772657	JSESSIONID	"ajax:3174930809465974889"
.www.linkedin.com	TRUE	/	TRUE	1773206275	timezone	Asia/Calcutta
.www.linkedin.com	TRUE	/	TRUE	1787548675	li_theme	light
.www.linkedin.com	TRUE	/	TRUE	1787548675	li_theme_set	app
.linkedin.com	TRUE	/	TRUE	1803359601	dfpfpt	226ea03d5e6d4d4486de95e0b3fd2bfe
.linkedin.com	TRUE	/	TRUE	1779772677	li_sugr	085e36c4-53c2-4016-89f8-cd07b9844203
.linkedin.com	TRUE	/	TRUE	1779599601	_guid	afcf0b5a-c5e1-4160-b347-1556f7a47cc1
.linkedin.com	TRUE	/	TRUE	1774520297	AnalyticsSyncHistory	AQJjSOZ2TP-B2gAAAZyPKByHLxR1VTlQI9MMK7SK-bkLk1wbDuRCk-vT5asdGFrk-6-5qDwHksj8LFyStPLNhA
.linkedin.com	TRUE	/	FALSE	1803532675	sdui_ver	sdui-flagship:0.1.28681+SduiFlagship0
.linkedin.com	TRUE	/	TRUE	1774577045	lms_ads	AQE7dsmnJKcrLwAAAZySigPrs3OskZHNAMjK64KfJ1MPvZwu_jQmIqaMiYaNDnzRW3L4m9BWdnXIBypM_cBp-IL3CdHDmfDr
.linkedin.com	TRUE	/	TRUE	1774577045	lms_analytics	AQE7dsmnJKcrLwAAAZySigPrs3OskZHNAMjK64KfJ1MPvZwu_jQmIqaMiYaNDnzRW3L4m9BWdnXIBypM_cBp-IL3CdHDmfDr
.linkedin.com	TRUE	/	TRUE	0	lang	v=2&lang=en-us
.linkedin.com	TRUE	/	TRUE	0	fptctx2	taBcrIH61PuCVH7eNCyH0CYjjbqLuI8XF8pleSQW5NYO4Ft%252be33i0DTVeGZwipzfZ3TUm9pQwDf9Mu9cevDVMpRIz4D7Hakb5Is2ovgaSAWYVr9ppnepUm7xiWQzQexbN5Hb5BPim0ObJ0jm09lUBHmAYLJAptzyKdekz0UmbfhmjILftmJRAm6JuRyqrJTH8fd%252fj7O20SjJ8mirt%252fHCvDFthjcifeUzbmgvNrCEkQHhfKCcEBmsmz8GazCXRKJ0x%252bUzUAP8WGidP1G3n2J6xySZJPPumPpBHVsJVlEHlIC6du3URYJbpBcz2lKDTsddcLqdUhFCC%252fJhFJhzT3ZFsBGzM8xzRiEptN18U3MBN6DciVX%252bVp1QsqjDfCwQfpSsfBZsubjCWAJGIsMG56o35g%253d%253d
.linkedin.com	TRUE	/	TRUE	1771997752	__cf_bm	iu10.PXfvu5Nnd3LV25rE34owVcEF2tl3Wuu1o8Dqv8-1771995952-1.0.1.1-NhO6lIYVGx_0e6i9Le6Qo0aWHRo6K8tHM3QUSIib99iZ7AW8P7bpz4Lc1jvceab2NW44adfTDmTW0wYWHNr0xhfBfz1ytR6i3sNkVlML8hc
.linkedin.com	TRUE	/	FALSE	0	AMCVS_14215E3D5995C57C0A495C55%40AdobeOrg	1
.linkedin.com	TRUE	/	FALSE	1787548649	AMCV_14215E3D5995C57C0A495C55%40AdobeOrg	-637568504%7CMCIDTS%7C20510%7CvVersion%7C5.1.1%7CMCMID%7C04702936986642512990840106435794536993%7CMCAAMLH-1772601449%7C12%7CMCAAMB-1772601449%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1772003849s%7CNONE
.www.linkedin.com	TRUE	/	TRUE	1803532657	li_at	AQEDASgZjt8BJ-s2AAABnJM7NYgAAAGct0e5iE4Apa6odFWAi6kpyOC7XYq5k7tYQt8O5UjNBf9sqmb6uC9GdCCkVkkIU4jCFMGaTKyXBCPIa5lJZG5nUbvPgQWhngORFU2xnhqdWYNNYbMlr6DM4WMV
.linkedin.com	TRUE	/	TRUE	1779772657	liap	true
.linkedin.com	TRUE	/	TRUE	1774588675	UserMatchHistory	AQLNXasahbuC8wAAAZyTO3oYKZAZf5JixBflGesqRsN6temp5bm450pRSYSLhin2IeRgCcURydyndDlAOwur3NFdiwBwchUsTsfSaLySKH5SGnH6tn2cERG7w8Pvaf4Q1PtMRTIrfKZQg4gK-TELcujf6SbHHFnEp8TyzY3EERZVLEirNI2pJNqz2SjNYIad181h5f-t8z5C136TYp5e86VE0EvuvvqG23nf9TUbXWQ13FhEVfTMSv8czxj2Iw8kgnc-7IpegK--U5Q4dq4FUtTxtcw1pl0WcVldMp5HmlC1P0G-hgx0o08U0LylsNAy2LpoHi39YAp0DlXY9twpnU9pRTR4oWbUPuHQkRWga7fIomvPng
.linkedin.com	TRUE	/	TRUE	1772069906	lidc	"b=TB15:s=T:r=T:a=T:p=T:g=6059:u=1119:x=1:i=1771996680:t=1772069905:v=2:sig=AQHLH864AuXCg_74OYn4uGAd3lMeVXXd"`;

function parseNetscape(str) {
  return str.split('
').filter(l => l.trim() && !l.startsWith('#')).map(l => {
    const parts = l.split('	');
    if (parts.length < 7) return null;
    const [domain, flag, path, secure, expires, name, value] = parts;
    return {
      name,
      value: value.replace(/^"(.*)"$/, '$1'),
      domain,
      path,
      expires: parseInt(expires),
      secure: secure === 'TRUE',
      httpOnly: flag === 'TRUE',
      sameSite: 'Lax'
    };
  }).filter(Boolean);
}

const cookies = parseNetscape(netscapeContent);
fs.writeFileSync('agentlinkedin/cookies.json', JSON.stringify(cookies, null, 2));
console.log('Successfully converted all cookies to cookies.json');
