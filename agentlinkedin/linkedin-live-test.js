import handler from './api/index.js';

const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log(`\nResponse Code: ${this.statusCode}`);
    console.log('Response Data:', JSON.stringify(data, null, 2));
    return this;
  }
};

async function run() {
  console.log('--- Phase 1: Checking LinkedIn Login Status ---');
  await handler({
    method: 'POST',
    body: {
      action: 'snapshot',
      url: 'https://www.linkedin.com/feed/'
    }
  }, mockRes);

  console.log('\n--- Phase 2: Searching for People (Search Term: "Recruiter") ---');
  await handler({
    method: 'POST',
    body: {
      action: 'linkedin-search',
      searchTerm: 'Recruiter'
    }
  }, mockRes);
}

run().catch(console.error);
