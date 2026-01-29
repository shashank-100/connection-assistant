import fs from 'fs/promises';

async function testVoyagerDirectly() {
  try {
    const cookiesRaw = await fs.readFile('agentlinkedin/cookies.json', 'utf8');
    const cookies = JSON.parse(cookiesRaw);

    // Convert cookies array to header string
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    
    // Extract JSESSIONID for CSRF token (remove quotes if present)
    const jsessionid = cookies.find(c => c.name === 'JSESSIONID')?.value.replace(/"/g, '');
    
    if (!jsessionid) {
      console.error('Error: JSESSIONID cookie not found!');
      return;
    }

    console.log('Using JSESSIONID (CSRF):', jsessionid);

    const response = await fetch('https://www.linkedin.com/voyager/api/messaging/conversations?keyVersion=LEGACY_INBOX&q=inbox&start=0&count=5', {
      method: 'GET',
      headers: {
        'cookie': cookieHeader,
        'csrf-token': jsessionid,
        'x-li-lang': 'en_US',
        'x-restli-protocol-version': '2.0.0',
        'accept': 'application/vnd.linkedin.normalized+json+2.1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    console.log('Status:', response.status, response.statusText);

    if (!response.ok) {
      const text = await response.text();
      console.log('Error Body:', text);
      return;
    }

    const data = await response.json();
    console.log('Success! Found conversations:', data.elements?.length || 0);
    // console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

testVoyagerDirectly();
