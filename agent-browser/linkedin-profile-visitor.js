#!/usr/bin/env node

/**
 * LinkedIn Profile Visitor
 * Visit profiles to increase visibility and appear in "Who viewed your profile"
 */

import BrowserHelper from './lib/browser-helper.js';
import DataManager from './lib/data-manager.js';

const args = process.argv.slice(2);

async function visitProfiles() {
  const browser = new BrowserHelper();
  const dataManager = new DataManager();

  console.log('👀 LinkedIn Profile Visitor Starting...\n');

  // Parse arguments
  const searchTerm = args.find(arg => !arg.startsWith('--')) || 'CTO';
  const maxVisits = parseInt(args.find((arg, i) => args[i - 1] === '--max')) || 20;
  const visitConnections = args.includes('--connections');
  const visitSecondDegree = args.includes('--2nd-degree');

  console.log(`🎯 Target: ${visitConnections ? 'My Connections' : `"${searchTerm}"`}`);
  console.log(`📊 Max visits: ${maxVisits}\n`);

  // Check daily limit
  const remaining = dataManager.getRemainingActions();
  if (remaining.visits <= 0) {
    console.log('⚠️  Daily visit limit reached. Try again tomorrow.');
    process.exit(0);
  }

  const actualMax = Math.min(maxVisits, remaining.visits);
  console.log(`📊 Daily limit: ${remaining.visits} visits remaining`);
  console.log(`🎯 Will visit: ${actualMax} profiles\n`);

  try {
    // Ensure logged in
    if (!await browser.ensureLoggedIn()) {
      console.error('❌ Could not log in to LinkedIn');
      process.exit(1);
    }

    // Get profile URLs to visit
    let profileUrls = [];

    if (visitConnections) {
      console.log('👥 Loading your connections...');
      profileUrls = await getConnectionProfiles(browser);
    } else if (visitSecondDegree) {
      console.log('🔗 Loading 2nd degree connections...');
      profileUrls = await getSecondDegreeProfiles(browser, searchTerm);
    } else {
      console.log(`🔍 Searching for: "${searchTerm}"`);
      profileUrls = await searchForProfiles(browser, searchTerm);
    }

    if (profileUrls.length === 0) {
      console.log('⚠️  No profiles found to visit');
      browser.close();
      return;
    }

    console.log(`\n✅ Found ${profileUrls.length} profiles`);

    // Get already visited profiles (from today)
    const visited = dataManager.readData('profileVisits');
    const today = new Date().toISOString().split('T')[0];
    const visitedToday = new Set(
      visited.visits
        .filter(v => v.visitDate.startsWith(today))
        .map(v => v.profileUrl)
    );

    // Filter out already visited
    const toVisit = profileUrls.filter(url => !visitedToday.has(url));

    console.log(`📝 ${toVisit.length} new profiles to visit`);
    console.log(`⏭️  Skipping ${profileUrls.length - toVisit.length} already visited today\n`);

    if (toVisit.length === 0) {
      console.log('✅ All found profiles already visited today!');
      browser.close();
      return;
    }

    // Limit to max
    const targets = toVisit.slice(0, actualMax);

    console.log(`👀 Starting to visit ${targets.length} profiles...\n`);

    // Visit each profile
    const results = [];
    for (let i = 0; i < targets.length; i++) {
      const profile = targets[i];
      console.log(`[${i + 1}/${targets.length}] Visiting: ${profile.name || profile.url}`);

      try {
        // Navigate to profile
        browser.open(profile.url);
        await browser.wait(3000);

        // Scroll down a bit to simulate real viewing
        browser.scroll('down', 500);
        await browser.wait(1000);
        browser.scroll('down', 500);
        await browser.wait(1000);

        // Extract name if not already present
        if (!profile.name) {
          const snapshot = browser.snapshot('-i');
          profile.name = extractNameFromSnapshot(snapshot);
        }

        console.log(`  ✅ Visited: ${profile.name || 'Profile'}\n`);

        // Save to data
        dataManager.addProfileVisit(profile.url, profile.name);

        results.push({ ...profile, status: 'visited' });

        // Random delay between visits
        await browser.wait();

      } catch (error) {
        console.error(`  ❌ Error: ${error.message}\n`);
        results.push({ ...profile, status: 'failed', error: error.message });
      }
    }

    // Summary
    const visited_count = results.filter(r => r.status === 'visited').length;
    const failed = results.filter(r => r.status === 'failed').length;

    console.log('\n✅ PROFILE VISITING COMPLETE!');
    console.log(`📊 Results:`);
    console.log(`   Profiles visited: ${visited_count}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total processed: ${results.length}`);

    // Update analytics
    dataManager.updateAnalytics();

    browser.close();

  } catch (error) {
    console.error('\n❌ Error:', error);
    browser.close();
    process.exit(1);
  }
}

async function searchForProfiles(browser, searchTerm) {
  const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
  browser.open(searchUrl);
  await browser.wait(5000);

  // Scroll to load more results
  for (let i = 0; i < 3; i++) {
    browser.scroll('down', 1000);
    await browser.wait(2000);
  }

  // Get snapshot
  const snapshot = browser.snapshot('-i');

  if (!snapshot || !snapshot.data) {
    return [];
  }

  // Extract profiles
  return extractProfilesFromSnapshot(snapshot);
}

async function getConnectionProfiles(browser) {
  browser.open('https://www.linkedin.com/mynetwork/invite-connect/connections/');
  await browser.wait(5000);

  // Scroll to load more
  for (let i = 0; i < 3; i++) {
    browser.scroll('down', 1000);
    await browser.wait(2000);
  }

  const snapshot = browser.snapshot('-i');

  if (!snapshot || !snapshot.data) {
    return [];
  }

  return extractProfilesFromSnapshot(snapshot);
}

async function getSecondDegreeProfiles(browser, searchTerm) {
  const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}&network=%5B%22S%22%5D`;
  browser.open(searchUrl);
  await browser.wait(5000);

  // Scroll to load more
  for (let i = 0; i < 3; i++) {
    browser.scroll('down', 1000);
    await browser.wait(2000);
  }

  const snapshot = browser.snapshot('-i');

  if (!snapshot || !snapshot.data) {
    return [];
  }

  return extractProfilesFromSnapshot(snapshot);
}

function extractProfilesFromSnapshot(snapshot) {
  if (!snapshot || !snapshot.data) return [];

  const snapshotText = snapshot.data.snapshot;
  const lines = snapshotText.split('\n');
  const profiles = [];

  let currentProfile = null;

  for (const line of lines) {
    // Look for profile links
    if (line.includes('link') && line.includes('linkedin.com/in/')) {
      const nameMatch = line.match(/link "([^"]+)"/);
      const urlMatch = line.match(/linkedin\.com\/in\/([^\s\]"?]+)/);

      if (nameMatch && urlMatch) {
        const name = nameMatch[1];
        const url = `https://www.linkedin.com/in/${urlMatch[1]}`;

        // Skip LinkedIn internal links
        if (name.length > 5 && !name.includes('LinkedIn') && !name.includes('View')) {
          if (!profiles.find(p => p.url === url)) {
            profiles.push({ name, url });
          }
        }
      }
    }
  }

  return profiles;
}

function extractNameFromSnapshot(snapshot) {
  if (!snapshot || !snapshot.data) return 'Unknown';

  const lines = snapshot.data.snapshot.split('\n');

  for (const line of lines) {
    if (line.includes('heading') && line.includes('[level=1]')) {
      const match = line.match(/heading "([^"]+)"/);
      if (match) {
        return match[1];
      }
    }
  }

  return 'Unknown';
}

visitProfiles().catch(console.error);
