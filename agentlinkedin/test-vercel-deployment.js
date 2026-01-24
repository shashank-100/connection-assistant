// Test the Vercel deployment
const API_URL = 'https://agentlinkedin-ac7awpkm6-shashank100s-projects.vercel.app/api';

console.log('Testing Vercel API deployment...');
console.log('URL:', API_URL);
console.log('---\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'linkedin-me',
      cookies: [] // Empty cookies, will fail auth but should test browser launch
    })
  });

  const data = await response.json();

  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (response.status === 500 && data.error?.includes('auth failed')) {
    console.log('\n✅ SUCCESS: Browser launched successfully on Vercel!');
    console.log('The auth error is expected (no cookies provided).');
  } else if (response.status === 500 && data.error?.includes('ENOEXEC')) {
    console.log('\n❌ FAILED: Chromium binary still not working on Vercel');
  } else {
    console.log('\n⚠️ Unexpected response');
  }

} catch (error) {
  console.error('❌ Request failed:', error.message);
}
