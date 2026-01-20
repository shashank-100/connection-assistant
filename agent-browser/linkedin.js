#!/usr/bin/env node

/**
 * LinkedIn Automation Suite - Master CLI
 * Unified interface for all LinkedIn automation tools
 */

import { execSync } from 'child_process';

const TOOLS = {
  connect: {
    script: 'linkedin-agent.js',
    description: 'Send connection requests',
    examples: [
      'linkedin connect "software engineer" --max 10',
      'linkedin connect "product manager" --max 5'
    ]
  },
  message: {
    script: 'linkedin-messenger.js',
    description: 'Send messages to connections',
    examples: [
      'linkedin message --message "Hi {name}!" --max 5',
      'linkedin message --message "Hello!" --filter "Google" --max 10'
    ]
  },
  scrape: {
    script: 'linkedin-scraper.js',
    description: 'Scrape profile data',
    examples: [
      'linkedin scrape "data scientist" --max 20 --export leads.csv',
      'linkedin scrape --connections --export network.json'
    ]
  },
  visit: {
    script: 'linkedin-profile-visitor.js',
    description: 'Visit profiles for visibility',
    examples: [
      'linkedin visit "CTO" --max 20',
      'linkedin visit --connections --max 30'
    ]
  },
  schedule: {
    script: 'linkedin-scheduler.js',
    description: 'Schedule automation tasks',
    examples: [
      'linkedin schedule start',
      'linkedin schedule status',
      'linkedin schedule logs'
    ]
  },
  analytics: {
    script: 'linkedin-analytics.js',
    description: 'View analytics and reports',
    examples: [
      'linkedin analytics summary',
      'linkedin analytics connections',
      'linkedin analytics weekly',
      'linkedin analytics export report.json'
    ]
  }
};

function showHelp() {
  console.log('🤖 LinkedIn Automation Suite\n');
  console.log('═'.repeat(80));
  console.log('\nA complete LinkedIn outreach automation tool\n');
  console.log('USAGE:');
  console.log('  linkedin <command> [options]\n');
  console.log('COMMANDS:\n');

  for (const [cmd, info] of Object.entries(TOOLS)) {
    console.log(`  ${cmd.padEnd(12)} ${info.description}`);
  }

  console.log('\nEXAMPLES:\n');

  for (const [cmd, info] of Object.entries(TOOLS)) {
    console.log(`  # ${info.description}`);
    for (const example of info.examples) {
      console.log(`  ${example}`);
    }
    console.log('');
  }

  console.log('For more info on a specific command:');
  console.log('  linkedin <command> --help\n');
  console.log('═'.repeat(80));
}

function showQuickStart() {
  console.log('\n🚀 Quick Start Guide\n');
  console.log('═'.repeat(80));
  console.log('\n1. Connect with people:');
  console.log('   linkedin connect "software engineer" --max 5\n');
  console.log('2. Message your connections:');
  console.log('   linkedin message --message "Hi {name}!" --max 5\n');
  console.log('3. Visit profiles for visibility:');
  console.log('   linkedin visit "CTO" --max 20\n');
  console.log('4. View analytics:');
  console.log('   linkedin analytics summary\n');
  console.log('5. Schedule automation:');
  console.log('   linkedin schedule setup');
  console.log('   linkedin schedule start\n');
  console.log('═'.repeat(80));
}

function runCommand(command, args) {
  const tool = TOOLS[command];

  if (!tool) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('\nRun "linkedin help" to see available commands');
    process.exit(1);
  }

  try {
    const scriptArgs = args.join(' ');
    const fullCommand = `node ${tool.script} ${scriptArgs}`;

    console.log(`\n🚀 Running: ${command}`);
    console.log('─'.repeat(80));

    execSync(fullCommand, {
      stdio: 'inherit',
      cwd: process.cwd()
    });

  } catch (error) {
    console.error(`\n❌ Command failed: ${error.message}`);
    process.exit(1);
  }
}

// Main
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  if (args[0] === 'quickstart' || args[0] === 'quick-start') {
    showQuickStart();
    return;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  runCommand(command, commandArgs);
}

main().catch(console.error);
