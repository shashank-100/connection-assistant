import fs from 'fs';

const cookies = [
  { "name": "li_at", "value": "AQEDASgZjt8E2iwbAAABnJRFaf0AAAGcuFHt_U0Arm6JSgZMgbOakdaBqvyN6C4cr44vhiZuggRQ4_n3VBrjKVRXK1ck4dw1XjgIrCg0OcjGHs8Wz-MPr5GgWZXq6CcTZkgxJ5Dwvb6G15yHis5yC75k", "domain": ".www.linkedin.com", "path": "/", "secure": true, "httpOnly": true },
  { "name": "JSESSIONID", "value": "ajax:3174930809465974889", "domain": ".www.linkedin.com", "path": "/", "secure": true, "httpOnly": true },
  { "name": "liap", "value": "true", "domain": ".linkedin.com", "path": "/", "secure": true },
  { "name": "bcookie", "value": "v=2&f16abdbd-5df3-43dc-8673-012f62692f81", "domain": ".linkedin.com", "path": "/", "secure": true },
  { "name": "bscookie", "value": "v=1&20260223050742e48ed3e0-a151-4f13-8b7a-9ec31a3f61e7AQG8N0G98lOy6-Oq9NqCdZkCVKrfSbeq", "domain": ".www.linkedin.com", "path": "/", "secure": true, "httpOnly": true },
  { "name": "fid", "value": "AQHKPr3tBnpjFAAAAZyTWP1U9WDX6QQCLuoiXF9UumrAEN5Ss4SBDDCIQpXIs1oGmPOqdn2diV_Kng", "domain": ".www.linkedin.com", "path": "/" },
  { "name": "lidc", "value": "b=TB15:s=T:r=T:a=T:p=T:g=6059:u=1119:x=1:i=1772014680:t=1772069905:v=2:sig=AQH7Is--xbY9bOHPVP_jzJwXMYHsT98r", "domain": ".linkedin.com", "path": "/", "secure": true }
];

fs.writeFileSync('agentlinkedin/cookies.json', JSON.stringify(cookies, null, 2));
console.log('✅ Cookies updated with fresh session.');
