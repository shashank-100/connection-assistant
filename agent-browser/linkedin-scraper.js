#!/usr/bin/env node

/**
 * LinkedIn Scraper
 * Extract profile data from LinkedIn search results
 */

import BrowserHelper from './lib/browser-helper.js';
import DataManager from './lib/data-manager.js';
import { writeFileSync } from 'fs';

const args = process.argv.slice(2);

async function scrapeProfiles() {
  const browser = new BrowserHelper();
  const dataManager = new DataManager();

  console.log('🔍 LinkedIn Scraper Starting...\n');

  // Parse arguments
  const searchTerm = args.find(arg => !arg.startsWith('--')) || 'software engineer';
  const maxProfiles = parseInt(args.find((arg, i) => args[i - 1] === '--max')) || 20;
  const exportFormat = args.find((arg, i) => args[i - 1] === '--export') || 'json';
  const scrapeConnections = args.includes('--connections');

  console.log(`🎯 Search term: "${searchTerm}"`);
  console.log(`📊 Max profiles: ${maxProfiles}`);
  console.log(`💾 Export format: ${exportFormat}\n`);

  try {
    // Ensure logged in
    if (!await browser.ensureLoggedIn()) {
      console.error('❌ Could not log in to LinkedIn');
      process.exit(1);
    }

    let profileUrls = [];

    if (scrapeConnections) {
      console.log('👥 Scraping connections...');
      profileUrls = await getConnectionUrls(browser);
    } else {
      console.log('🔍 Searching for profiles...');
      profileUrls = await searchProfiles(browser, searchTerm, maxProfiles);
    }

    if (profileUrls.length === 0) {
      console.log('⚠️  No profiles found');
      browser.close();
      return;
    }

    console.log(`\n✅ Found ${profileUrls.length} profiles to scrape`);
    console.log('🤖 Starting scraping...\n');

    // Scrape each profile
    const profiles = [];
    for (let i = 0; i < Math.min(profileUrls.length, maxProfiles); i++) {
      const url = profileUrls[i];
      console.log(`[${i + 1}/${Math.min(profileUrls.length, maxProfiles)}] Scraping: ${url}`);

      try {
        const profile = await scrapeProfile(browser, url);
        if (profile) {
          profiles.push(profile);
          dataManager.addScrapedProfile(profile);
          console.log(`  ✅ Name: ${profile.name}`);
          console.log(`     Headline: ${profile.headline || 'N/A'}\n`);
        }

        await browser.wait();
      } catch (error) {
        console.error(`  ❌ Error scraping: ${error.message}\n`);
      }
    }

    // Export data
    console.log(`\n📁 Exporting ${profiles.length} profiles...`);

    if (exportFormat.endsWith('.csv')) {
      exportToCSV(profiles, exportFormat);
    } else {
      const filename = exportFormat.endsWith('.json') ? exportFormat : `linkedin-scraped-${Date.now()}.json`;
      writeFileSync(filename, JSON.stringify(profiles, null, 2));
      console.log(`✅ Exported to: ${filename}`);
    }

    console.log('\n✅ SCRAPING COMPLETE!');
    console.log(`📊 Total profiles scraped: ${profiles.length}`);

    browser.close();

  } catch (error) {
    console.error('\n❌ Error:', error);
    browser.close();
    process.exit(1);
  }
}

async function searchProfiles(browser, searchTerm, maxProfiles) {
  const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}`;
  browser.open(searchUrl);
  await browser.wait(5000);

  // Scroll to load more results
  const scrolls = Math.ceil(maxProfiles / 10);
  for (let i = 0; i < scrolls; i++) {
    browser.scroll('down', 1000);
    await browser.wait(2000);
  }

  // Get snapshot
  const snapshot = browser.snapshot('-i');

  if (!snapshot || !snapshot.data) {
    return [];
  }

  // Extract profile URLs
  const lines = snapshot.data.snapshot.split('\n');
  const profileUrls = [];

  for (const line of lines) {
    if (line.includes('linkedin.com/in/')) {
      const urlMatch = line.match(/linkedin\.com\/in\/([^\s\]"?]+)/);
      if (urlMatch) {
        const url = `https://www.linkedin.com/in/${urlMatch[1]}`;
        if (!profileUrls.includes(url)) {
          profileUrls.push(url);
        }
      }
    }
  }

  return profileUrls;
}

async function getConnectionUrls(browser) {
  browser.open('https://www.linkedin.com/mynetwork/invite-connect/connections/');
  await browser.wait(5000);

  // Scroll to load connections
  for (let i = 0; i < 5; i++) {
    browser.scroll('down', 1000);
    await browser.wait(2000);
  }

  const snapshot = browser.snapshot('-i');

  if (!snapshot || !snapshot.data) {
    return [];
  }

  const lines = snapshot.data.snapshot.split('\n');
  const profileUrls = [];

  for (const line of lines) {
    if (line.includes('linkedin.com/in/')) {
      const urlMatch = line.match(/linkedin\.com\/in\/([^\s\]"?]+)/);
      if (urlMatch) {
        const url = `https://www.linkedin.com/in/${urlMatch[1]}`;
        if (!profileUrls.includes(url)) {
          profileUrls.push(url);
        }
      }
    }
  }

  return profileUrls;
}

async function scrapeProfile(browser, profileUrl) {
  browser.open(profileUrl);
  await browser.wait(3000);

  // Scroll down to load full profile
  browser.scroll('down', 500);
  await browser.wait(1000);
  browser.scroll('down', 500);
  await browser.wait(1000);

  // Get snapshot
  const snapshot = browser.snapshot();

  if (!snapshot || !snapshot.data) {
    return null;
  }

  const snapshotText = snapshot.data.snapshot;
  const lines = snapshotText.split('\n');

  // Extract profile data
  const profile = {
    profileUrl,
    name: null,
    headline: null,
    location: null,
    about: null,
    experience: [],
    education: [],
    skills: [],
    scrapedDate: new Date().toISOString()
  };

  // Extract name from page title or heading
  for (const line of lines) {
    if (line.includes('heading') && line.includes('[level=1]')) {
      const nameMatch = line.match(/heading "([^"]+)"/);
      if (nameMatch) {
        profile.name = nameMatch[1];
        break;
      }
    }
  }

  // Extract headline and location
  let inHeader = false;
  for (const line of lines) {
    if (line.includes('heading') && profile.name) {
      inHeader = true;
    }

    if (inHeader && line.includes('text') && !profile.headline) {
      const match = line.match(/text "([^"]+)"/);
      if (match && match[1].length > 10 && !match[1].includes('connection')) {
        profile.headline = match[1];
      }
    }

    if (inHeader && line.includes('location') || (line.includes('text') && profile.headline)) {
      const match = line.match(/text "([^"]+)"/);
      if (match && match[1].length > 3 && match[1].length < 100) {
        if (!profile.location && match[1] !== profile.headline) {
          profile.location = match[1];
          break;
        }
      }
    }
  }

  // Extract about section
  let inAbout = false;
  let aboutText = [];
  for (const line of lines) {
    if (line.toLowerCase().includes('about')) {
      inAbout = true;
      continue;
    }

    if (inAbout && line.includes('text')) {
      const match = line.match(/text "([^"]+)"/);
      if (match) {
        aboutText.push(match[1]);
        if (aboutText.join(' ').length > 200) break;
      }
    }

    if (inAbout && (line.includes('heading') || line.includes('Experience'))) {
      break;
    }
  }
  profile.about = aboutText.join(' ').trim();

  // Extract experience
  let inExperience = false;
  let currentJob = null;
  for (const line of lines) {
    if (line.includes('Experience')) {
      inExperience = true;
      continue;
    }

    if (inExperience) {
      if (line.includes('heading') && line.includes('[level=3]')) {
        if (currentJob) {
          profile.experience.push(currentJob);
        }
        const match = line.match(/heading "([^"]+)"/);
        if (match) {
          currentJob = { title: match[1], company: null, duration: null };
        }
      }

      if (currentJob && line.includes('text') && !currentJob.company) {
        const match = line.match(/text "([^"]+)"/);
        if (match) {
          currentJob.company = match[1];
        }
      }

      if (line.includes('Education') || profile.experience.length > 3) {
        if (currentJob) {
          profile.experience.push(currentJob);
        }
        break;
      }
    }
  }

  return profile;
}

function exportToCSV(profiles, filename) {
  const headers = ['Name', 'Headline', 'Location', 'About', 'Profile URL', 'Experience', 'Scraped Date'];
  const rows = profiles.map(p => [
    p.name || '',
    p.headline || '',
    p.location || '',
    (p.about || '').replace(/"/g, '""').substring(0, 200),
    p.profileUrl,
    p.experience.map(e => `${e.title} at ${e.company}`).join('; '),
    p.scrapedDate
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  writeFileSync(filename, csvContent);
  console.log(`✅ Exported to: ${filename}`);
}

scrapeProfiles().catch(console.error);
