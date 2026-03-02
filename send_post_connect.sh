#!/bin/bash

echo "🚀 Sending Post-Connect Interop request for Ryan Vig..."

curl -i -X POST 'https://www.linkedin.com/flagship-web/rsc-action/actions/server-request?sduiid=com.linkedin.sdui.requests.mynetwork.handlePostInteropConnection&parentSpanId=Yc%2BNq775KTE%3D' 
  -H 'accept: */*' 
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' 
  -H 'content-type: application/json' 
  -H 'csrf-token: ajax:3174930809465974889' 
  -H 'origin: https://www.linkedin.com' 
  -H 'referer: https://www.linkedin.com/in/ryanjvig/' 
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36' 
  -H 'x-li-anchor-page-key: d_flagship3_profile_view_base' 
  -H 'x-li-application-instance: XzdrBgk+Q/WRJjEsrrfU0w==' 
  -H 'x-li-page-instance: urn:li:page:d_flagship3_profile_view_base;1ivjZfuLSpqIBw1J7cOy9A==' 
  -H 'x-li-rsc-stream: true' 
  -H 'x-restli-protocol-version: 2.0.0' 
  -H 'Cookie: _pxvid=39183aaf-eb88-11f0-9eb6-7e368b228959; bitmovin_analytics_uuid=8b51c166-4705-4667-8c2a-5ef8072026da; s_fid=607B2B66DCCB751C-1973103AB084D4D0; aam_uuid=04531731842349333520821774331657812458; g_state={"i_l":0}; VID=V_2026_01_26_09_1248; gpv_pn=www.linkedin.com%2Flearning%2Fbuilding-full-stack-apps-with-react-and-spring; s_ips=2350; s_tp=3430; s_tslv=1769480423388; bcookie="v=2&f16abdbd-5df3-43dc-8673-012f62692f81"; bscookie="v=1&20260223050742e48ed3e0-a151-4f13-8b7a-9ec31a3f61e7AQG8N0G98lOy6-Oq9NqCdZkCVKrfSbeq"; JSESSIONID="ajax:3174930809465974889"; timezone=Asia/Calcutta; li_theme=light; li_theme_set=app; dfpfpt=226ea03d5e6d4d4486de95e0b3fd2bfe; li_sugr=085e36c4-53c2-4016-89f8-cd07b9844203; _guid=afcf0b5a-c5e1-4160-b347-1556f7a47cc1; AnalyticsSyncHistory=AQJjSOZ2TP-B2gAAAZyPKByHLxR1VTlQI9MMK7SK-bkLk1wbDuRCk-vT5asdGFrk-6-5qDwHksj8LFyStPLNhA; sdui_ver=sdui-flagship:0.1.28681+SduiFlagship0; lms_ads=AQE7dsmnJKcrLwAAAZySigPrs3OskZHNAMjK64KfJ1MPvZwu_jQmIqaMiYaNDnzRW3L4m9BWdnXIBypM_cBp-IL3CdHDmfDr; lms_analytics=AQE7dsmnJKcrLwAAAZySigPrs3OskZHNAMjK64KfJ1MPvZwu_jQmIqaMiYaNDnzRW3L4m9BWdnXIBypM_cBp-IL3CdHDmfDr; lang=v=2&lang=en-us; li_at=AQEDASgZjt8BJ-s2AAABnJM7NYgAAAGct0e5iE4Apa6odFWAi6kpyOC7XYq5k7tYQt8O5UjNBf9sqmb6uC9GdCCkVkkIU4jCFMGaTKyXBCPIa5lJZG5nUbvPgQWhngORFU2xnhqdWYNNYbMlr6DM4WMV; liap=true; UserMatchHistory=AQLNXasahbuC8wAAAZyTO3oYKZAZf5JixBflGesqRsN6temp5bm450pRSYSLhin2IeRgCcURydyndDlAOwur3NFdiwBwchUsTsfSaLySKH5SGnH6tn2cERG7w8Pvaf4Q1PtMRTIrfKZQg4gK-TELcujf6SbHHFnEp8TyzY3EERZVLEirNI2pJNqz2SjNYIad181h5f-t8z5C136TYp5e86VE0EvuvvqG23nf9TUbXWQ13FhEVfTMSv8czxj2Iw8kgnc-7IpegK--U5Q4dq4FUtTxtcw1pl0WcVldMp5HmlC1P0G-hgx0o08U0LylsNAy2LpoHi39YAp0DlXY9twpnU9pRTR4oWbUPuHQkRWga7fIomvPng; lidc="b=TB15:s=T:r=T:a=T:p=T:g=6059:u=1119:x=1:i=1771996680:t=1772069905:v=2:sig=AQHLH864AuXCg_74OYn4uGAd3lMeVXXd"' 
  --data-raw '{"requestId":"com.linkedin.sdui.requests.mynetwork.handlePostInteropConnection","serverRequest":{"$type":"proto.sdui.actions.core.ServerRequest","requestId":"com.linkedin.sdui.requests.mynetwork.handlePostInteropConnection","requestedArguments":{"$type":"proto.sdui.actions.requests.RequestedArguments","payload":{"profileId":"ACoAAC8Qz-0BSBHRbP1rG49hpCPLmfUFi1Q1DXg","vanityName":"ryanjvig","firstName":"Ryan","lastName":"Vig","success":true,"errorType":"","showVerificationPostConnectNBA":true},"requestedStateKeys":[]},"isStreaming":false,"isApfcEnabled":false,"rumPageKey":""},"states":[],"requestedArguments":{"$type":"proto.sdui.actions.requests.RequestedArguments","payload":{"profileId":"ACoAAC8Qz-0BSBHRbP1rG49hpCPLmfUFi1Q1DXg","vanityName":"ryanjvig","firstName":"Ryan","lastName":"Vig","success":true,"errorType":"","showVerificationPostConnectNBA":true},"requestedStateKeys":[],"states":[],"screenId":""}}'

echo -e "

✅ Post-Connect Interop Request finished."
