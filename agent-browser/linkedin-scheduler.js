#!/usr/bin/env node

/**
 * LinkedIn Scheduler
 * Schedule and run LinkedIn automation tasks
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import DataManager from './lib/data-manager.js';

const execAsync = promisify(exec);

const SCHEDULE_FILE = 'linkedin-data/schedule.json';

const DEFAULT_SCHEDULE = {
  enabled: true,
  tasks: [
    {
      name: 'Morning Connections',
      script: 'linkedin-agent.js',
      args: ['software engineer', '--max', '10'],
      schedule: '09:00',
      enabled: true
    },
    {
      name: 'Afternoon Messages',
      script: 'linkedin-messenger.js',
      args: ['--message', 'Hi {name}, great to connect!', '--max', '5'],
      schedule: '14:00',
      enabled: true
    },
    {
      name: 'Evening Profile Visits',
      script: 'linkedin-profile-visitor.js',
      args: ['product manager', '--max', '20'],
      schedule: '18:00',
      enabled: true
    }
  ],
  lastRun: {},
  logs: []
};

class Scheduler {
  constructor() {
    this.schedule = this.loadSchedule();
    this.dataManager = new DataManager();
    this.running = false;
  }

  loadSchedule() {
    if (existsSync(SCHEDULE_FILE)) {
      return JSON.parse(readFileSync(SCHEDULE_FILE, 'utf-8'));
    }
    this.saveSchedule(DEFAULT_SCHEDULE);
    return DEFAULT_SCHEDULE;
  }

  saveSchedule(schedule = this.schedule) {
    writeFileSync(SCHEDULE_FILE, JSON.stringify(schedule, null, 2));
  }

  async runTask(task) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Running: ${task.name}`);
    console.log(`⏰ Time: ${new Date().toLocaleTimeString()}`);
    console.log(`${'='.repeat(60)}\n`);

    const command = `node ${task.script} ${task.args.join(' ')}`;

    try {
      const { stdout, stderr } = await execAsync(command);

      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);

      this.logTaskRun(task.name, 'success');
      console.log(`\n✅ Task "${task.name}" completed successfully`);

    } catch (error) {
      console.error(`\n❌ Task "${task.name}" failed:`, error.message);
      this.logTaskRun(task.name, 'failed', error.message);
    }
  }

  logTaskRun(taskName, status, error = null) {
    this.schedule.lastRun[taskName] = {
      timestamp: new Date().toISOString(),
      status,
      error
    };

    this.schedule.logs.push({
      task: taskName,
      timestamp: new Date().toISOString(),
      status,
      error
    });

    // Keep only last 100 logs
    if (this.schedule.logs.length > 100) {
      this.schedule.logs = this.schedule.logs.slice(-100);
    }

    this.saveSchedule();
  }

  shouldRunTask(task) {
    if (!task.enabled) return false;
    if (!this.schedule.enabled) return false;

    const now = new Date();
    const [hours, minutes] = task.schedule.split(':').map(Number);

    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Check if current time is within 5 minutes of scheduled time
    const diff = Math.abs(now - scheduledTime);
    const fiveMinutes = 5 * 60 * 1000;

    if (diff > fiveMinutes) return false;

    // Check if already run today
    const lastRun = this.schedule.lastRun[task.name];
    if (lastRun) {
      const lastRunDate = new Date(lastRun.timestamp).toDateString();
      const todayDate = now.toDateString();

      // Check if last run was for this scheduled time today
      const lastRunTime = new Date(lastRun.timestamp);
      if (lastRunDate === todayDate &&
          lastRunTime.getHours() === hours &&
          Math.abs(lastRunTime.getMinutes() - minutes) < 10) {
        return false; // Already ran
      }
    }

    return true;
  }

  async checkAndRunTasks() {
    console.log(`\n⏰ Checking scheduled tasks... [${new Date().toLocaleTimeString()}]`);

    for (const task of this.schedule.tasks) {
      if (this.shouldRunTask(task)) {
        await this.runTask(task);
      }
    }
  }

  async start() {
    console.log('📅 LinkedIn Scheduler Started');
    console.log('🔄 Checking for tasks every minute...\n');
    console.log('Press Ctrl+C to stop\n');

    this.running = true;

    // Check immediately
    await this.checkAndRunTasks();

    // Then check every minute
    this.interval = setInterval(async () => {
      if (this.running) {
        await this.checkAndRunTasks();
      }
    }, 60 * 1000); // Every minute
  }

  stop() {
    console.log('\n🛑 Stopping scheduler...');
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
    console.log('✅ Scheduler stopped');
  }

  status() {
    console.log('\n📊 LinkedIn Scheduler Status\n');
    console.log(`Status: ${this.schedule.enabled ? '🟢 Enabled' : '🔴 Disabled'}\n`);

    console.log('Scheduled Tasks:');
    console.log('─'.repeat(80));

    for (const task of this.schedule.tasks) {
      const status = task.enabled ? '✅' : '❌';
      const lastRun = this.schedule.lastRun[task.name];

      console.log(`\n${status} ${task.name}`);
      console.log(`   Schedule: ${task.schedule}`);
      console.log(`   Script: ${task.script} ${task.args.join(' ')}`);

      if (lastRun) {
        const lastRunTime = new Date(lastRun.timestamp).toLocaleString();
        const statusIcon = lastRun.status === 'success' ? '✅' : '❌';
        console.log(`   Last Run: ${lastRunTime} ${statusIcon}`);
      } else {
        console.log(`   Last Run: Never`);
      }
    }

    console.log('\n' + '─'.repeat(80));

    // Daily limits
    const remaining = this.dataManager.getRemainingActions();
    console.log('\n📊 Daily Limits Remaining:');
    console.log(`   Connections: ${remaining.connections}`);
    console.log(`   Messages: ${remaining.messages}`);
    console.log(`   Visits: ${remaining.visits}`);
  }

  addTask(task) {
    this.schedule.tasks.push(task);
    this.saveSchedule();
    console.log(`✅ Added task: ${task.name}`);
  }

  removeTask(taskName) {
    this.schedule.tasks = this.schedule.tasks.filter(t => t.name !== taskName);
    this.saveSchedule();
    console.log(`✅ Removed task: ${taskName}`);
  }

  enableTask(taskName) {
    const task = this.schedule.tasks.find(t => t.name === taskName);
    if (task) {
      task.enabled = true;
      this.saveSchedule();
      console.log(`✅ Enabled task: ${taskName}`);
    }
  }

  disableTask(taskName) {
    const task = this.schedule.tasks.find(t => t.name === taskName);
    if (task) {
      task.enabled = false;
      this.saveSchedule();
      console.log(`✅ Disabled task: ${taskName}`);
    }
  }

  viewLogs(count = 10) {
    console.log(`\n📜 Recent Logs (last ${count}):\n`);

    const recentLogs = this.schedule.logs.slice(-count).reverse();

    for (const log of recentLogs) {
      const timestamp = new Date(log.timestamp).toLocaleString();
      const statusIcon = log.status === 'success' ? '✅' : '❌';

      console.log(`${statusIcon} [${timestamp}] ${log.task}`);
      if (log.error) {
        console.log(`   Error: ${log.error}`);
      }
    }
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const scheduler = new Scheduler();

  switch (command) {
    case 'start':
      await scheduler.start();
      // Keep process running
      process.on('SIGINT', () => {
        scheduler.stop();
        process.exit(0);
      });
      break;

    case 'status':
      scheduler.status();
      break;

    case 'logs':
      const count = parseInt(args[1]) || 10;
      scheduler.viewLogs(count);
      break;

    case 'enable':
      if (args[1]) {
        scheduler.enableTask(args[1]);
      } else {
        scheduler.schedule.enabled = true;
        scheduler.saveSchedule();
        console.log('✅ Scheduler enabled');
      }
      break;

    case 'disable':
      if (args[1]) {
        scheduler.disableTask(args[1]);
      } else {
        scheduler.schedule.enabled = false;
        scheduler.saveSchedule();
        console.log('✅ Scheduler disabled');
      }
      break;

    case 'setup':
      console.log('📝 Setting up default schedule...');
      scheduler.saveSchedule(DEFAULT_SCHEDULE);
      console.log('✅ Default schedule created');
      console.log('\nEdit linkedin-data/schedule.json to customize');
      scheduler.status();
      break;

    default:
      console.log('📅 LinkedIn Scheduler\n');
      console.log('Usage:');
      console.log('  node linkedin-scheduler.js start          # Start scheduler');
      console.log('  node linkedin-scheduler.js status         # Show status');
      console.log('  node linkedin-scheduler.js logs [count]   # View logs');
      console.log('  node linkedin-scheduler.js enable [task]  # Enable scheduler/task');
      console.log('  node linkedin-scheduler.js disable [task] # Disable scheduler/task');
      console.log('  node linkedin-scheduler.js setup          # Create default schedule');
      break;
  }
}

main().catch(console.error);
