// Run locally WITHOUT simulating Vercel (so it uses local Playwright)
// process.env.VERCEL = '1';
// process.env.CI = '1';

import handler from './api/index.js';

// Mock request and response objects
const req = {
  method: 'POST',
  body: {
    action: 'linkedin-me', // This just checks if browser can launch
    cookies: [] // Empty cookies to skip auth check
  }
};

const res = {
  statusCode: null,
  data: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.data = data;
    console.log('Status:', this.statusCode);
    console.log('Response:', JSON.stringify(data, null, 2));
    return this;
  }
};

console.log('Testing API handler locally...');
console.log('Request:', JSON.stringify(req.body, null, 2));
console.log('---');

await handler(req, res);
