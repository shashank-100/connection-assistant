import handler from './api/index.js';

const mockReq = {
  method: 'POST',
  body: {
    action: 'snapshot',
    url: 'https://example.com'
  }
};

const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log(`Response Code: ${this.statusCode}`);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    return this;
  }
};

console.log('Starting local test with agent-browser...');
handler(mockReq, mockRes).catch(err => {
  console.error('Test Failed:', err);
});
