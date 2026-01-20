#!/usr/bin/env node

/**
 * Browser Helper - Utilities for agent-browser operations
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

class BrowserHelper {
  constructor(sessionName = 'linkedin-agent') {
    this.sessionName = sessionName;
    const config = JSON.parse(readFileSync('./config.json', 'utf-8'));
    this.config = config.linkedin;
    this.delays = config.limits;
    this.auto = process.argv.includes('--auto') || process.argv.includes('--yes');
  }

  // Run agent-browser command
  run(command, options = {}) {
    try {
      const jsonFlag = options.json ? '--json' : '';
      const fullCommand = `./bin/agent-browser --session ${this.sessionName} ${jsonFlag} ${command}`;

      const result = execSync(fullCommand, {
        encoding: 'utf-8',
        stdio: options.silent ? 'pipe' : 'inherit',
        cwd: process.cwd()
      });

      return options.json ? JSON.parse(result) : result;
    } catch (error) {
      if (options.ignoreError) {
        return null;
      }
      console.error(`Error running command: ${command}`);
      console.error(error.message);
      throw error;
    }
  }

  // Wait with optional variation
  async wait(ms = null) {
    const baseDelay = ms || this.delays.delayBetweenActions;
    const variation = this.delays.delayVariation;
    const actualDelay = baseDelay + Math.random() * variation;

    return new Promise(resolve => setTimeout(resolve, actualDelay));
  }

  // Open URL
  open(url) {
    return this.run(`open "${url}"`);
  }

  // Get snapshot
  snapshot(options = '') {
    return this.run(`snapshot ${options}`, { json: true });
  }

  // Click element
  click(selector) {
    return this.run(`click ${selector}`);
  }

  // Type text
  type(selector, text) {
    return this.run(`type ${selector} "${text}"`);
  }

  // Fill input
  fill(selector, text) {
    return this.run(`fill ${selector} "${text}"`);
  }

  // Get text
  getText(selector) {
    return this.run(`get text ${selector}`, { silent: true }).trim();
  }

  // Get URL
  getUrl() {
    return this.run(`get url`, { silent: true }).trim();
  }

  // Scroll
  scroll(direction = 'down', pixels = 1000) {
    return this.run(`scroll ${direction} ${pixels}`);
  }

  // Screenshot
  screenshot(filename) {
    return this.run(`screenshot ${filename}`);
  }

  // Close browser
  close() {
    return this.run(`close`);
  }

  // Save auth state
  saveAuth() {
    return this.run(`state save ${this.config.authFile}`);
  }

  // Load auth state
  loadAuth() {
    return this.run(`state load ${this.config.authFile}`);
  }

  // Parse snapshot to find elements
  parseSnapshot(snapshot, searchTerm) {
    if (!snapshot || !snapshot.data) return [];

    const snapshotText = snapshot.data.snapshot;
    const lines = snapshotText.split('\n');
    const results = [];

    for (const line of lines) {
      if (line.toLowerCase().includes(searchTerm.toLowerCase()) && line.includes('[ref=')) {
        const refMatch = line.match(/\[ref=(\w+)\]/);
        if (refMatch) {
          results.push({
            line,
            ref: '@' + refMatch[1]
          });
        }
      }
    }

    return results;
  }

  // Find button by text
  findButton(snapshot, buttonText) {
    const buttons = this.parseSnapshot(snapshot, `button "${buttonText}"`);
    return buttons.length > 0 ? buttons[0].ref : null;
  }

  // Find link by text
  findLink(snapshot, linkText) {
    const links = this.parseSnapshot(snapshot, `link "${linkText}"`);
    return links.length > 0 ? links[0].ref : null;
  }

  // Extract people from search results
  extractPeopleFromSearch(snapshot) {
    if (!snapshot || !snapshot.data) return [];

    const snapshotText = snapshot.data.snapshot;
    const lines = snapshotText.split('\n');
    const people = [];

    let currentPerson = null;

    for (const line of lines) {
      // Look for name in links
      if (line.includes('link') && !line.includes('Connect') && !line.includes('Message')) {
        const match = line.match(/link "([^"]+)"/);
        if (match && match[1].length > 5 && !match[1].includes('LinkedIn') && !match[1].includes('View')) {
          currentPerson = { name: match[1] };
        }
      }

      // Look for headline
      if (currentPerson && line.includes('text') && !line.includes('button') && !line.includes('link')) {
        const match = line.match(/text "([^"]+)"/);
        if (match && match[1].length > 10) {
          currentPerson.headline = match[1];
        }
      }

      // Look for Connect button
      if (line.includes('button "Connect"') && line.includes('[ref=')) {
        const refMatch = line.match(/\[ref=(\w+)\]/);
        if (refMatch && currentPerson) {
          people.push({
            ...currentPerson,
            connectRef: '@' + refMatch[1],
            foundDate: new Date().toISOString()
          });
          currentPerson = null;
        }
      }

      // Look for Message button (already connected)
      if (line.includes('button "Message"') && currentPerson) {
        currentPerson.alreadyConnected = true;
        currentPerson = null;
      }
    }

    return people;
  }

  // Check if logged in
  async isLoggedIn() {
    const url = this.getUrl();
    return url.includes('feed') || url.includes('mynetwork') || url.includes('in/');
  }

  // Login helper
  async login() {
    console.log('🔐 Starting LinkedIn login...');

    this.open('https://www.linkedin.com/login');
    await this.wait(3000);

    this.screenshot('linkedin-login.png');
    console.log('📸 Screenshot saved to linkedin-login.png');

    if (!this.auto) {
      console.log('\n⚠️  MANUAL STEP REQUIRED:');
      console.log('Please enter your LinkedIn credentials manually.');
      console.log('Press Enter after you have logged in successfully...');

      await new Promise(resolve => {
        process.stdin.once('data', resolve);
      });
    } else {
      console.log('🤖 Auto-mode: Skipping manual login check. Ensure auth state is valid.');
      await this.wait(5000);
    }

    if (await this.isLoggedIn()) {
      console.log('✅ Successfully logged in!');
      this.saveAuth();
      console.log('💾 Auth state saved');
      return true;
    } else {
      console.log('❌ Login failed or incomplete');
      return false;
    }
  }

  // Ensure logged in
  async ensureLoggedIn() {
    const { existsSync } = await import('fs');

    if (existsSync(this.config.authFile)) {
      console.log('📂 Loading saved auth state...');
      this.loadAuth();
      this.open('https://www.linkedin.com/feed/');
      await this.wait(3000);

      if (await this.isLoggedIn()) {
        console.log('✅ Logged in from saved session');
        return true;
      }
    }

    return await this.login();
  }
}

export default BrowserHelper;
