#!/usr/bin/env node

/**
 * LinkedIn Messenger
 * Send messages to your LinkedIn connections
 */

import BrowserHelper from './lib/browser-helper.js';
import DataManager from './lib/data-manager.js';

const args = process.argv.slice(2);

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessages() {
  const browser = new BrowserHelper();
  const dataManager = new DataManager();

  console.log('📨 LinkedIn Messenger Starting...\n');

  // Parse arguments
  const messageText = args.find((arg, i) => args[i - 1] === '--message');
  const maxMessages = parseInt(args.find((arg, i) => args[i - 1] === '--max')) || 5;
  const filterTerm = args.find((arg, i) => args[i - 1] === '--filter');

  if (!messageText) {
    console.error('❌ Error: Please provide a message using --message flag');
    console.log('\nUsage:');
    console.log('  node linkedin-messenger.js --message "Your message here" --max 5');
    console.log('  node linkedin-messenger.js --message "Hi {name}!" --filter "Google" --max 10');
    process.exit(1);
  }

  // Check daily limit
  const remaining = dataManager.getRemainingActions();
  if (remaining.messages <= 0) {
    console.log('⚠️  Daily message limit reached. Try again tomorrow.');
    process.exit(0);
  }

  const actualMax = Math.min(maxMessages, remaining.messages);
  console.log(`📊 Daily limit: ${remaining.messages} messages remaining`);
  console.log(`🎯 Will send up to: ${actualMax} messages\n`);

  try {
    // Ensure logged in
    if (!await browser.ensureLoggedIn()) {
      console.error('❌ Could not log in to LinkedIn');
      process.exit(1);
    }

    // Navigate to messaging page
    console.log('📬 Opening LinkedIn messaging...');
    browser.open('https://www.linkedin.com/messaging/');
    await browser.wait(5000);

    // Navigate to connections page to get list
    console.log('👥 Loading connections...');
    browser.open('https://www.linkedin.com/mynetwork/invite-connect/connections/');
    await browser.wait(5000);

    // Scroll to load more connections
    console.log('📜 Loading more connections...');
    for (let i = 0; i < 3; i++) {
      browser.scroll('down', 1000);
      await browser.wait(2000);
    }

    // Get snapshot of connections
    const snapshot = browser.snapshot('-i');

    if (!snapshot || !snapshot.data) {
      console.error('❌ Failed to load connections');
      browser.close();
      process.exit(1);
    }

    // Extract connections
    const connections = extractConnections(snapshot, filterTerm);
    console.log(`\n✅ Found ${connections.length} connections`);

    if (filterTerm) {
      console.log(`   (filtered by: "${filterTerm}")`);
    }

    if (connections.length === 0) {
      console.log('⚠️  No connections found to message');
      browser.close();
      return;
    }

    // Get already messaged people
    const messagesSent = dataManager.readData('messagesSent');
    const alreadyMessaged = new Set(messagesSent.messages.map(m => m.profileUrl));

    // Filter out already messaged
    const toMessage = connections.filter(c => !alreadyMessaged.has(c.profileUrl));

    console.log(`📝 ${toMessage.length} new people to message`);
    console.log(`⏭️  Skipping ${connections.length - toMessage.length} already messaged\n`);

    if (toMessage.length === 0) {
      console.log('✅ All connections already messaged!');
      browser.close();
      return;
    }

    // Limit to max
    const targets = toMessage.slice(0, actualMax);

    console.log(`💬 Preparing to send ${targets.length} messages...\n`);

    // Send messages
    const results = [];
    for (let i = 0; i < targets.length; i++) {
      const person = targets[i];
      console.log(`[${i + 1}/${targets.length}] Messaging: ${person.name}`);

      try {
        // Personalize message
        const personalizedMessage = personalizeMessage(messageText, person);

        // Navigate to profile
        browser.open(person.profileUrl);
        await browser.wait(3000);

        // Get snapshot
        const profileSnapshot = browser.snapshot('-i');

        // Find Message button
        const messageButton = browser.findButton(profileSnapshot, 'Message');

        if (!messageButton) {
          console.log('  ⚠️  Message button not found, skipping\n');
          results.push({ ...person, status: 'failed', error: 'No message button' });
          continue;
        }

        // Click Message button
        browser.click(messageButton);
        await browser.wait(2000);

        // Get snapshot of message box
        const messageSnapshot = browser.snapshot('-i');

        // Find message textarea
        const textareaRef = findMessageTextarea(messageSnapshot);

        if (!textareaRef) {
          console.log('  ⚠️  Message textarea not found, skipping\n');
          results.push({ ...person, status: 'failed', error: 'No textarea' });
          continue;
        }

        // Type message
        browser.fill(textareaRef, personalizedMessage);
        await browser.wait(1000);

        // Find and click Send button
        const sendButton = browser.findButton(messageSnapshot, 'Send');

        if (sendButton) {
          browser.click(sendButton);
          await browser.wait(2000);

          console.log('  ✅ Message sent\n');

          // Save to data
          dataManager.addMessage(person.profileUrl, personalizedMessage);

          results.push({ ...person, status: 'sent', message: personalizedMessage });
        } else {
          console.log('  ⚠️  Send button not found, skipping\n');
          results.push({ ...person, status: 'failed', error: 'No send button' });
        }

        // Delay between messages
        await browser.wait();

      } catch (error) {
        console.error(`  ❌ Error: ${error.message}\n`);
        results.push({ ...person, status: 'failed', error: error.message });
      }
    }

    // Summary
    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;

    console.log('\n✅ MESSAGING COMPLETE!');
    console.log(`📊 Results:`);
    console.log(`   Messages sent: ${sent}`);
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

function extractConnections(snapshot, filterTerm = null) {
  if (!snapshot || !snapshot.data) return [];

  const snapshotText = snapshot.data.snapshot;
  const lines = snapshotText.split('\n');
  const connections = [];

  let currentPerson = null;

  for (const line of lines) {
    // Look for profile link
    if (line.includes('link') && line.includes('linkedin.com/in/')) {
      const nameMatch = line.match(/link "([^"]+)"/);
      const urlMatch = line.match(/linkedin\.com\/in\/([^\s\]"]+)/);

      if (nameMatch && urlMatch) {
        currentPerson = {
          name: nameMatch[1],
          profileUrl: `https://www.linkedin.com/in/${urlMatch[1]}`
        };
      }
    }

    // Look for headline
    if (currentPerson && line.includes('text') && !line.includes('link')) {
      const headlineMatch = line.match(/text "([^"]+)"/);
      if (headlineMatch && headlineMatch[1].length > 10) {
        currentPerson.headline = headlineMatch[1];

        // Add if matches filter or no filter
        if (!filterTerm || currentPerson.headline.toLowerCase().includes(filterTerm.toLowerCase()) ||
            currentPerson.name.toLowerCase().includes(filterTerm.toLowerCase())) {
          connections.push(currentPerson);
        }

        currentPerson = null;
      }
    }
  }

  return connections;
}

function findMessageTextarea(snapshot) {
  if (!snapshot || !snapshot.data) return null;

  const lines = snapshot.data.snapshot.split('\n');

  for (const line of lines) {
    if ((line.includes('textbox') || line.includes('textarea')) &&
        (line.includes('Write a message') || line.includes('message'))) {
      const refMatch = line.match(/\[ref=(\w+)\]/);
      if (refMatch) {
        return '@' + refMatch[1];
      }
    }
  }

  return null;
}

function personalizeMessage(template, person) {
  let message = template;

  // Replace placeholders
  message = message.replace(/{name}/g, person.name.split(' ')[0]); // First name
  message = message.replace(/{fullname}/g, person.name);
  message = message.replace(/{headline}/g, person.headline || '');

  // Extract company if in headline
  const companyMatch = person.headline?.match(/at (.+?)(?:\s*\||$)/);
  if (companyMatch) {
    message = message.replace(/{company}/g, companyMatch[1]);
  }

  return message;
}

sendMessages().catch(console.error);
