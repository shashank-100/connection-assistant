import { readFileSync } from 'fs';
import handler from './api/index.js';

const cookies = JSON.parse(readFileSync('./cookies.json', 'utf-8'));

const req = {
  method: 'POST',
  body: {
    action: 'linkedin-me',
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
    if (data.success) {
      console.log('Success: true');
      console.log('Authenticated:', data.data?.authenticated);
    } else {
      console.log('Error:', data.error);
    }
    return this;
  }
};

console.log('Testing API handler with LinkedIn cookies...');
console.log('Cookies loaded:', cookies.length);
console.log('---\n');

try {
  await handler(req, res);
} catch (err) {
  console.error('Execution failed:', err.message);
}
