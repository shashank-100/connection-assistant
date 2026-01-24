// Test API with actual cookies
import { readFileSync } from 'fs';
import handler from './api/index.js';

// Load cookies from file
const cookies = JSON.parse(readFileSync('./cookies.json', 'utf-8'));

// Mock request and response objects
const req = {
  method: 'POST',
  body: {
    action: 'linkedin-me',
    cookies: cookies
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
    console.log('\n=== API RESPONSE ===');
    console.log('Status:', this.statusCode);
    console.log('Response:', JSON.stringify(data, null, 2));
    return this;
  }
};

console.log('Testing API handler with LinkedIn cookies...');
console.log('Action:', req.body.action);
console.log('Cookies loaded:', cookies.length);
console.log('---\n');

await handler(req, res);
