import fs from 'fs/promises';

async function testConversations() {
  try {
    const cookies = JSON.parse(await fs.readFile('agentlinkedin/cookies.json', 'utf8'));
    console.log('Read cookies:', cookies.length);

    const response = await fetch('https://courteous-empathy-production-9e68.up.railway.app/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'linkedin-conversations',
        max: 5,
        cookies: cookies,
        userId: 'shashank'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testConversations();
