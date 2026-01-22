import fs from 'fs';
import { parse } from 'csv-parse/sync';

async function runTest() {
  const csvFilePath = '/Users/shashank/geodo-vercel-agent-browser/referral_1-40.csv';
  const cookiesPath = '/Users/shashank/geodo-vercel-agent-browser/agentlinkedin/cookies.json';
  
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    escape: '\\',
    relax_column_count: true
  });

  const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
  const profilesToConnect = records
    .map(r => r.linkedin_profile_url)
    .filter(url => url && url.includes('linkedin.com/in/'))
    .slice(0, 5);

  console.log(`Starting connection task for ${profilesToConnect.length} profiles...`);

  for (const url of profilesToConnect) {
    console.log(`Sending connection request to: ${url}`);
    try {
      const response = await fetch('http://localhost:3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'snapshot',
          url: url,
          cookies: cookies
        })
      });
      const visitResult = await response.json();
      console.log(`Visit/Snapshot Result for ${url}:`, JSON.stringify(visitResult.success, null, 2));

      if (visitResult.success) {
        console.log(`Proceeding to connect for ${url}`);
        const connectResponse = await fetch('http://localhost:3000', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'linkedin-connect',
            profileUrl: url,
            cookies: cookies
          })
        });
        const connectResult = await connectResponse.json();
        console.log(`Connect Result for ${url}:`, JSON.stringify(connectResult, null, 2));
      }
    } catch (error) {
      console.error(`Error processing ${url}:`, error.message);
    }
  }
}

runTest();
