import { readFileSync } from 'fs';
import handler from './api/index.js';

const cookies = JSON.parse(readFileSync('./cookies.json', 'utf-8'));

const req = {
  method: 'POST',
  body: {
    action: 'linkedin-connect',
    profileUrl: 'https://www.linkedin.com/in/anubhav-jaiswal-97b06b248/',
    cookies: cookies
  }
};

const res = {
  statusCode: 200,
  data: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.data = data;
    console.log('\n=== API RESPONSE ===');
    console.log('Status:', this.statusCode);
    console.log('Response:', JSON.stringify(data, null, 2));
    return this;
  }
};

console.log('Sending LinkedIn connection request...');
console.log('Target Profile:', req.body.profileUrl);
console.log('---\n');

try {
  await handler(req, res);
} catch (err) {
  console.error('Execution failed:', err.message);
}
