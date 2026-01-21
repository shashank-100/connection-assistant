import handler from './api/index.js';

const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log(JSON.stringify(data, null, 2));
    return this;
  }
};

async function run() {
  await handler({
    method: 'POST',
    body: {
      action: 'get-cookies'
    }
  }, mockRes);
}

run().catch(console.error);
