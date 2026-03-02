import fs from 'fs';

const cookies = [
  { "name": "_pxvid", "value": "39183aaf-eb88-11f0-9eb6-7e368b228959", "domain": ".linkedin.com", "path": "/" },
  { "name": "bitmovin_analytics_uuid", "value": "8b51c166-4705-4667-8c2a-5ef8072026da", "domain": ".linkedin.com", "path": "/" },
  { "name": "s_fid", "value": "607B2B66DCCB751C-1973103AB084D4D0", "domain": ".linkedin.com", "path": "/" },
  { "name": "aam_uuid", "value": "04531731842349333520821774331657812458", "domain": ".linkedin.com", "path": "/" },
  { "name": "VID", "value": "V_2026_01_26_09_1248", "domain": ".linkedin.com", "path": "/" },
  { "name": "liap", "value": "true", "domain": ".linkedin.com", "path": "/", "secure": true },
  { "name": "li_at", "value": "AQEDASgZjt8DbToYAAABnJNY-98AAAGct2V_304AJeE1jYyeT72qywM7O34TsEGOraf598S37HSwlLuymBL8NPNHNS49CVJqr_3iCCDwLYCPVtdmcaIgQBi0ha5oNyhj-Bfe9FujkCSpyeS_2rL63cJA", "domain": ".www.linkedin.com", "path": "/", "secure": true, "httpOnly": true },
  { "name": "JSESSIONID", "value": "ajax:3174930809465974889", "domain": ".www.linkedin.com", "path": "/", "secure": true, "httpOnly": true },
  { "name": "li_sugr", "value": "085e36c4-53c2-4016-89f8-cd07b9844203", "domain": ".linkedin.com", "path": "/", "secure": true },
  { "name": "_guid", "value": "afcf0b5a-c5e1-4160-b347-1556f7a47cc1", "domain": ".linkedin.com", "path": "/", "secure": true },
  { "name": "lidc", "value": "b=TB15:s=T:r=T:a=T:p=T:g=6059:u=1119:x=1:i=1772001557:t=1772069905:v=2:sig=AQF5ggQLuiVKLuuPethWCB3TWp8duV8F", "domain": ".linkedin.com", "path": "/", "secure": true }
];

fs.writeFileSync('agentlinkedin/cookies.json', JSON.stringify(cookies, null, 2));
console.log('✅ Cookies updated with latest session.');
