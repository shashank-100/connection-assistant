import handler from './api/index.js';
import fs from 'fs';

const cookies = JSON.parse(fs.readFileSync('./cookies.json', 'utf8'));

const targets = [
  "Bhavya Modi Software Engineer at Google",
  "Pratyaksh Dugar Senior Software Engineer @Optum",
  "Racchit Jain Microsoft Research",
  "Dhrumit Patel Senior SDE @ Freecharge",
  "Dnyanada Wankhede HRBP Recruitment"
];

const messageTemplate = "Hi nice to connect with you";

async function run() {
  for (const searchTerm of targets) {
    console.log(`\nProcessing: ${searchTerm}`);
    
    let searchResult;
    const searchMockRes = {
      status() { return this; },
      json(data) { searchResult = data; return this; }
    };

    await handler({
      method: 'POST',
      body: { action: 'linkedin-search', searchTerm, cookies }
    }, searchMockRes);

    if (searchResult?.success && searchResult.data?.length > 0) {
      const person = searchResult.data[0];
      console.log(`Matched: ${person.name}`);
      
      const messageMockRes = {
        status() { return this; },
        json(data) { console.log('Message Result:', JSON.stringify(data)); return this; }
      };

      await handler({
        method: 'POST',
        body: { 
          action: 'linkedin-message', 
          profileUrl: person.profileUrl, 
          message: messageTemplate,
          cookies 
        }
      }, messageMockRes);
    }
  }
}

run().catch(console.error);
