import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { BrowserManager } from 'agent-browser/dist/browser.js';
import { LinkedInConnectService } from './src/services/connect.js';

async function runLocalConnect() {
    const csvFilePath = '/Users/shashank/geodo-vercel-agent-browser/referral_1-40.csv';
    
    console.log('Reading CSV file...');
    const fileContent = fs.readFileSync(csvFilePath);
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    const profiles = records
        .map(record => record.linkedin_profile_url)
        .filter(url => url && url.includes('linkedin.com/in/'));

    console.log(`Found ${profiles.length} LinkedIn profiles in CSV.`);

    if (profiles.length === 0) {
        console.log('No valid LinkedIn profiles found. Exiting.');
        return;
    }

    const targetProfile = profiles[0];
    console.log(`Targeting profile: ${targetProfile}`);

    const browser = new BrowserManager();
    
    try {
        console.log('Launching browser (non-headless for local visibility)...');
        await browser.launch({
            headless: false,
        });

        const cookiesFilePath = './cookies.txt';
        try {
            const cookiesData = fs.readFileSync(cookiesFilePath, 'utf8');
            if (cookiesData) {
                const cookies = JSON.parse(cookiesData);
                if (cookies.length > 0) {
                    console.log('Loading cookies from file...');
                    await browser.getPage().context().addCookies(cookies);
                    console.log('Cookies loaded successfully.');
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not load cookies from ${cookiesFilePath}. Proceeding without authentication. Error: ${error.message}`);
        }

        const connectService = new LinkedInConnectService(browser);
        
        console.log(`Attempting to send connection request to: ${targetProfile}`);
        const result = await connectService.sendConnectRequest(targetProfile);
        
        console.log('Result:', JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Error during local connection task:', error);
    } finally {
        console.log('Task finished. Browser remains open if headless was false.');
    }
}

runLocalConnect();
