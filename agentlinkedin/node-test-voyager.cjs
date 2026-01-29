const fs = require('fs');
const https = require('https');

async function testVoyager() {
  const cookies = JSON.parse(fs.readFileSync('agentlinkedin/cookies.json', 'utf8'));
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  const jsessionid = cookies.find(c => c.name === 'JSESSIONID')?.value;
  const csrf = jsessionid ? jsessionid.replace(/"/g, '') : '';

  const options = {
    hostname: 'www.linkedin.com',
    path: '/voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX&q=inbox&start=0&count=5',
    method: 'GET',
    headers: {
      'accept': 'application/vnd.linkedin.normalized+json+2.1',
      'csrf-token': csrf,
      'x-restli-protocol-version': '2.0.0',
      'cookie': cookieHeader,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Response Success:', !!data.elements);
        if (data.elements) console.log('Count:', data.elements.length);
        else console.log('Body:', body);
      } catch (e) {
        console.log('Body:', body);
      }
    });
  });

  req.on('error', (e) => console.error(e));
  req.end();
}

testVoyager();
