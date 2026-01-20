#!/usr/bin/env node

/**
 * LinkedIn Connection Agent
 * Automates login, search, and connection requests on LinkedIn
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONFIG = {
  sessionName: 'linkedin-agent',
  maxConnections: 5, // Safety limit
  delayBetweenActions: 3000, // 3 seconds delay between actions
  searchTerm: process.argv[2] || 'software engineer',
  resultsFile: 'linkedin-results.json',
  auto: process.argv.includes('--auto') || process.argv.includes('--yes')
};

// Helper to run agent-browser commands
function runBrowser(command, options = {}) {
  try {
    const result = execSync(
      `./bin/agent-browser --session ${CONFIG.sessionName} ${options.json ? '--json' : ''} ${command}`,
      {
        encoding: 'utf-8',
        stdio: options.silent ? 'pipe' : 'inherit',
        cwd: process.cwd()
      }
    );
    return options.json ? JSON.parse(result) : result;
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    if (options.json) return null;
    throw error;
  }
}

// Helper to wait
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loginToLinkedIn() {
  console.log('🔐 Starting LinkedIn login...');

  // Open LinkedIn login page
  runBrowser('open https://www.linkedin.com/login');
  await wait(3000);

  // Take a screenshot so user can see the page
  runBrowser('screenshot linkedin-login.png');
  console.log('📸 Screenshot saved to linkedin-login.png');

  // Get snapshot to see login form
  console.log('\n📋 Getting page snapshot...');
  const snapshot = runBrowser('snapshot -i', { json: true });

  if (snapshot && snapshot.data) {
    console.log('\nAvailable interactive elements:');
    console.log(snapshot.data.snapshot);
  }

  if (!CONFIG.auto) {
    console.log('\n⚠️  MANUAL STEP REQUIRED:');
    console.log('Please enter your LinkedIn credentials manually.');
    console.log('Press Enter after you have logged in successfully...');

    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  } else {
    console.log('🤖 Auto-mode: Skipping manual login check. Ensure auth state is valid.');
    await wait(5000); 
  }

  // Verify we're logged in by checking the URL
  const currentUrl = runBrowser('get url', { silent: true, json: false }).trim();
  console.log(`Current URL: ${currentUrl}`);

  if (currentUrl.includes('feed') || currentUrl.includes('mynetwork')) {
    console.log('✅ Successfully logged in!');
    // Save auth state for future use
    runBrowser('state save linkedin-auth.json');
    console.log('💾 Auth state saved to linkedin-auth.json');
    return true;
  } else {
    console.log('❌ Login failed or incomplete');
    return false;
  }
}

async function searchPeople(searchTerm) {
  console.log(`\n🔍 Searching LinkedIn for: "${searchTerm}"`);

  // Navigate to LinkedIn search for people
  const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
  runBrowser(`open "${searchUrl}"`);

  await wait(5000); // Wait for search results to load

  // Take screenshot of search results
  runBrowser('screenshot linkedin-search-results.png --full');
  console.log('📸 Search results screenshot saved');

  // Scroll down to load more results
  console.log('📜 Scrolling to load more results...');
  for (let i = 0; i < 3; i++) {
    runBrowser('scroll down 1000');
    await wait(2000);
  }

  // Get snapshot of the page
  console.log('\n📋 Extracting people from search results...');
  const snapshot = runBrowser('snapshot -i', { json: true });

  if (!snapshot || !snapshot.data) {
    console.error('Failed to get snapshot');
    return [];
  }

  // Parse the snapshot to find people profiles
  const snapshotText = snapshot.data.snapshot;
  const refs = snapshot.data.refs || {};

  console.log('\n=== SEARCH RESULTS SNAPSHOT ===');
  console.log(snapshotText);
  console.log('=== END SNAPSHOT ===\n');

  // Find all "Connect" buttons
  const connectButtons = [];
  const lines = snapshotText.split('\n');

  let currentPerson = null;
  for (const line of lines) {
    // Look for names (typically in links or headings)
    if (line.includes('link') && !line.includes('Connect') && !line.includes('Message')) {
      const match = line.match(/link "([^"]+)"/);
      if (match && match[1].length > 5 && !match[1].includes('LinkedIn')) {
        currentPerson = { name: match[1] };
      }
    }

    // Look for Connect buttons with refs
    if (line.includes('button "Connect"') && line.includes('[ref=')) {
      const refMatch = line.match(/\[ref=(\w+)\]/);
      if (refMatch && currentPerson) {
        connectButtons.push({
          ...currentPerson,
          connectRef: '@' + refMatch[1],
          fullLine: line
        });
        currentPerson = null;
      }
    }
  }

  console.log(`\n✅ Found ${connectButtons.length} people with "Connect" buttons`);

  return connectButtons;
}

async function sendConnectionRequests(people, maxRequests = CONFIG.maxConnections) {
  console.log(`\n📨 Preparing to send connection requests...`);
  console.log(`Limit: ${Math.min(people.length, maxRequests)} requests\n`);

  const results = [];
  const limit = Math.min(people.length, maxRequests);

  for (let i = 0; i < limit; i++) {
    const person = people[i];
    console.log(`[${i + 1}/${limit}] Connecting with: ${person.name || 'Unknown'}`);

    try {
      // Click the Connect button
      runBrowser(`click ${person.connectRef}`);
      await wait(2000);

      // Check if there's a modal to send note (sometimes LinkedIn asks)
      const modalSnapshot = runBrowser('snapshot -i', { json: true });

      if (modalSnapshot && modalSnapshot.data.snapshot.includes('Send now')) {
        // Find and click "Send now" or "Send without a note"
        const lines = modalSnapshot.data.snapshot.split('\n');
        for (const line of lines) {
          if ((line.includes('Send now') || line.includes('Send without')) && line.includes('[ref=')) {
            const refMatch = line.match(/\[ref=(\w+)\]/);
            if (refMatch) {
              console.log('  → Clicking "Send now"');
              runBrowser(`click @${refMatch[1]}`);
              break;
            }
          }
        }
      }

      results.push({ ...person, status: 'sent', timestamp: new Date().toISOString() });
      console.log(`  ✅ Connection request sent\n`);

      // Delay between requests to avoid rate limiting
      await wait(CONFIG.delayBetweenActions);

    } catch (error) {
      console.error(`  ❌ Failed to send request: ${error.message}\n`);
      results.push({ ...person, status: 'failed', error: error.message, timestamp: new Date().toISOString() });
    }
  }

  return results;
}

async function main() {
  console.log('🤖 LinkedIn Connection Agent Starting...\n');
  console.log(`Search term: "${CONFIG.searchTerm}"`);
  console.log(`Max connections: ${CONFIG.maxConnections}\n`);

  try {
    // Check if we have saved auth state
    if (existsSync('linkedin-auth.json')) {
      console.log('📂 Found saved auth state, loading...');
      runBrowser('state load linkedin-auth.json');
      runBrowser('open https://www.linkedin.com/feed/');
      await wait(3000);
    } else {
      // Login
      const loggedIn = await loginToLinkedIn();
      if (!loggedIn) {
        console.error('❌ Could not log in to LinkedIn. Exiting.');
        process.exit(1);
      }
    }

    // Search for people
    const people = await searchPeople(CONFIG.searchTerm);

    if (people.length === 0) {
      console.log('⚠️  No people found to connect with.');
      runBrowser('close');
      return;
    }

    // Save the list
    writeFileSync(CONFIG.resultsFile, JSON.stringify(people, null, 2));
    console.log(`💾 People list saved to ${CONFIG.resultsFile}`);

    // Display the list
    console.log('\n👥 People found:');
    people.forEach((person, i) => {
      console.log(`${i + 1}. ${person.name || 'Unknown'}`);
    });

    if (!CONFIG.auto) {
      console.log(`\n⚠️  Ready to send ${Math.min(people.length, CONFIG.maxConnections)} connection requests.`);
      console.log('Press Enter to continue or Ctrl+C to cancel...');
      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });
    }

    // Send connection requests
    const results = await sendConnectionRequests(people, CONFIG.maxConnections);

    // Save results
    const resultsWithTimestamp = {
      searchTerm: CONFIG.searchTerm,
      timestamp: new Date().toISOString(),
      totalFound: people.length,
      totalSent: results.filter(r => r.status === 'sent').length,
      results
    };

    writeFileSync('linkedin-connections-sent.json', JSON.stringify(resultsWithTimestamp, null, 2));

    console.log('\n✅ COMPLETE!');
    console.log(`📊 Results saved to linkedin-connections-sent.json`);
    console.log(`   Total found: ${people.length}`);
    console.log(`   Requests sent: ${results.filter(r => r.status === 'sent').length}`);
    console.log(`   Failed: ${results.filter(r => r.status === 'failed').length}`);

    // Close browser
    runBrowser('close');

  } catch (error) {
    console.error('\n❌ Error:', error);
    runBrowser('close');
    process.exit(1);
  }
}

// Run the agent
main().catch(console.error);
