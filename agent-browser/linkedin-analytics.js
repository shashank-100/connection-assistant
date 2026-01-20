#!/usr/bin/env node

/**
 * LinkedIn Analytics
 * Generate reports and analytics from LinkedIn automation data
 */

import DataManager from './lib/data-manager.js';
import { writeFileSync } from 'fs';

class Analytics {
  constructor() {
    this.dataManager = new DataManager();
  }

  generateReport(type = 'summary') {
    switch (type) {
      case 'summary':
        return this.summaryReport();
      case 'connections':
        return this.connectionsReport();
      case 'messages':
        return this.messagesReport();
      case 'visits':
        return this.visitsReport();
      case 'daily':
        return this.dailyReport();
      case 'weekly':
        return this.weeklyReport();
      default:
        return this.summaryReport();
    }
  }

  summaryReport() {
    console.log('\n📊 LinkedIn Automation Summary Report');
    console.log('═'.repeat(80));

    const analytics = this.dataManager.updateAnalytics();
    const sentRequests = this.dataManager.readData('sentRequests');
    const messagesSent = this.dataManager.readData('messagesSent');
    const profileVisits = this.dataManager.readData('profileVisits');
    const profilesScraped = this.dataManager.readData('profilesScraped');

    console.log('\n🔗 Connections:');
    console.log(`   Total Requests Sent: ${analytics.connections.sent}`);
    console.log(`   Accepted: ${analytics.connections.accepted}`);
    console.log(`   Pending: ${analytics.connections.pending}`);
    console.log(`   Acceptance Rate: ${analytics.connections.acceptanceRate}%`);

    console.log('\n💬 Messages:');
    console.log(`   Total Sent: ${analytics.messages.sent}`);
    console.log(`   Responses: ${analytics.messages.responses}`);
    console.log(`   Response Rate: ${analytics.messages.responseRate}%`);

    console.log('\n👀 Profile Visits:');
    console.log(`   Total Visits: ${analytics.visits.total}`);

    console.log('\n📁 Data Collected:');
    console.log(`   Profiles Scraped: ${profilesScraped.total}`);

    console.log('\n📅 Today\'s Activity:');
    const today = this.dataManager.getDailyActionCounts();
    console.log(`   Connections Sent: ${today.connections}`);
    console.log(`   Messages Sent: ${today.messages}`);
    console.log(`   Profiles Visited: ${today.visits}`);

    console.log('\n📊 Daily Limits Remaining:');
    const remaining = this.dataManager.getRemainingActions();
    console.log(`   Connections: ${remaining.connections}`);
    console.log(`   Messages: ${remaining.messages}`);
    console.log(`   Visits: ${remaining.visits}`);

    console.log('\n' + '═'.repeat(80));

    return analytics;
  }

  connectionsReport() {
    console.log('\n🔗 LinkedIn Connections Report');
    console.log('═'.repeat(80));

    const sentRequests = this.dataManager.readData('sentRequests');

    if (sentRequests.total === 0) {
      console.log('\nNo connection requests sent yet.');
      return;
    }

    // Group by status
    const byStatus = {
      pending: sentRequests.requests.filter(r => r.status === 'pending'),
      accepted: sentRequests.requests.filter(r => r.status === 'accepted'),
      ignored: sentRequests.requests.filter(r => r.status === 'ignored')
    };

    console.log('\n📊 By Status:');
    console.log(`   Pending: ${byStatus.pending.length}`);
    console.log(`   Accepted: ${byStatus.accepted.length}`);
    console.log(`   Ignored: ${byStatus.ignored.length}`);

    // Recent connections
    console.log('\n📅 Recent Connection Requests (Last 10):');
    const recent = sentRequests.requests.slice(-10).reverse();

    for (const req of recent) {
      const date = new Date(req.sentDate).toLocaleDateString();
      const statusIcon = req.status === 'accepted' ? '✅' : req.status === 'pending' ? '⏳' : '❌';
      console.log(`   ${statusIcon} ${req.name || 'Unknown'} - ${date}`);
    }

    // Group by date
    console.log('\n📈 Connection Requests by Day (Last 7 days):');
    const byDay = this.groupByDay(sentRequests.requests, 7);

    for (const [date, count] of Object.entries(byDay)) {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`   ${date}: ${bar} ${count}`);
    }

    console.log('\n' + '═'.repeat(80));
  }

  messagesReport() {
    console.log('\n💬 LinkedIn Messages Report');
    console.log('═'.repeat(80));

    const messagesSent = this.dataManager.readData('messagesSent');

    if (messagesSent.total === 0) {
      console.log('\nNo messages sent yet.');
      return;
    }

    const withResponse = messagesSent.messages.filter(m => m.hasResponse).length;
    const responseRate = (withResponse / messagesSent.total * 100).toFixed(2);

    console.log('\n📊 Message Stats:');
    console.log(`   Total Sent: ${messagesSent.total}`);
    console.log(`   With Response: ${withResponse}`);
    console.log(`   Response Rate: ${responseRate}%`);

    // Recent messages
    console.log('\n📅 Recent Messages (Last 10):');
    const recent = messagesSent.messages.slice(-10).reverse();

    for (const msg of recent) {
      const date = new Date(msg.sentDate).toLocaleDateString();
      const responseIcon = msg.hasResponse ? '✅' : '⏳';
      console.log(`   ${responseIcon} ${date} - ${msg.message.substring(0, 50)}...`);
    }

    // Group by date
    console.log('\n📈 Messages by Day (Last 7 days):');
    const byDay = this.groupByDay(messagesSent.messages, 7);

    for (const [date, count] of Object.entries(byDay)) {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`   ${date}: ${bar} ${count}`);
    }

    console.log('\n' + '═'.repeat(80));
  }

  visitsReport() {
    console.log('\n👀 Profile Visits Report');
    console.log('═'.repeat(80));

    const profileVisits = this.dataManager.readData('profileVisits');

    if (profileVisits.total === 0) {
      console.log('\nNo profile visits recorded yet.');
      return;
    }

    console.log(`\n📊 Total Visits: ${profileVisits.total}`);

    // Recent visits
    console.log('\n📅 Recent Visits (Last 10):');
    const recent = profileVisits.visits.slice(-10).reverse();

    for (const visit of recent) {
      const date = new Date(visit.visitDate).toLocaleDateString();
      console.log(`   👤 ${visit.name || 'Unknown'} - ${date}`);
    }

    // Group by date
    console.log('\n📈 Visits by Day (Last 7 days):');
    const byDay = this.groupByDay(profileVisits.visits, 7);

    for (const [date, count] of Object.entries(byDay)) {
      const bar = '█'.repeat(Math.ceil(count / 5));
      console.log(`   ${date}: ${bar} ${count}`);
    }

    console.log('\n' + '═'.repeat(80));
  }

  dailyReport() {
    console.log('\n📅 Daily Activity Report');
    console.log('═'.repeat(80));

    const today = new Date().toISOString().split('T')[0];
    console.log(`\nDate: ${today}`);

    const counts = this.dataManager.getDailyActionCounts();

    console.log('\n📊 Actions Today:');
    console.log(`   Connection Requests: ${counts.connections}`);
    console.log(`   Messages Sent: ${counts.messages}`);
    console.log(`   Profiles Visited: ${counts.visits}`);

    const remaining = this.dataManager.getRemainingActions();

    console.log('\n📊 Remaining Today:');
    console.log(`   Connection Requests: ${remaining.connections}`);
    console.log(`   Messages: ${remaining.messages}`);
    console.log(`   Visits: ${remaining.visits}`);

    console.log('\n' + '═'.repeat(80));
  }

  weeklyReport() {
    console.log('\n📅 Weekly Activity Report');
    console.log('═'.repeat(80));

    const sentRequests = this.dataManager.readData('sentRequests');
    const messagesSent = this.dataManager.readData('messagesSent');
    const profileVisits = this.dataManager.readData('profileVisits');

    const last7Days = this.getLast7Days();

    console.log('\n📊 Activity by Day:\n');

    // Connections
    const connectionsByDay = this.groupByDay(sentRequests.requests, 7);
    console.log('🔗 Connection Requests:');
    for (const date of last7Days) {
      const count = connectionsByDay[date] || 0;
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`   ${date}: ${bar} ${count}`);
    }

    // Messages
    const messagesByDay = this.groupByDay(messagesSent.messages, 7);
    console.log('\n💬 Messages:');
    for (const date of last7Days) {
      const count = messagesByDay[date] || 0;
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(`   ${date}: ${bar} ${count}`);
    }

    // Visits
    const visitsByDay = this.groupByDay(profileVisits.visits, 7);
    console.log('\n👀 Profile Visits:');
    for (const date of last7Days) {
      const count = visitsByDay[date] || 0;
      const bar = '█'.repeat(Math.ceil(count / 5));
      console.log(`   ${date}: ${bar} ${count}`);
    }

    console.log('\n' + '═'.repeat(80));
  }

  exportReport(filename, format = 'json') {
    const analytics = this.dataManager.readData('analytics');
    const sentRequests = this.dataManager.readData('sentRequests');
    const messagesSent = this.dataManager.readData('messagesSent');
    const profileVisits = this.dataManager.readData('profileVisits');

    const report = {
      generatedAt: new Date().toISOString(),
      summary: analytics,
      connections: sentRequests,
      messages: messagesSent,
      visits: profileVisits,
      daily: this.dataManager.getDailyActionCounts(),
      remaining: this.dataManager.getRemainingActions()
    };

    if (format === 'json') {
      writeFileSync(filename, JSON.stringify(report, null, 2));
    } else if (format === 'csv') {
      // Simple CSV export for connections
      const csv = this.exportToCSV(sentRequests.requests);
      writeFileSync(filename, csv);
    }

    console.log(`✅ Report exported to: ${filename}`);
  }

  exportToCSV(data) {
    const headers = ['Name', 'Status', 'Date Sent', 'Profile URL'];
    const rows = data.map(item => [
      item.name || 'Unknown',
      item.status || 'pending',
      item.sentDate || '',
      item.profileUrl || ''
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }

  groupByDay(items, days = 7) {
    const result = {};
    const dates = this.getLast7Days(days);

    for (const date of dates) {
      result[date] = 0;
    }

    for (const item of items) {
      const dateKey = item.sentDate || item.visitDate || item.scrapedDate;
      if (dateKey) {
        const date = dateKey.split('T')[0];
        if (result.hasOwnProperty(date)) {
          result[date]++;
        }
      }
    }

    return result;
  }

  getLast7Days(days = 7) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'summary';

  const analytics = new Analytics();

  switch (command) {
    case 'summary':
      analytics.generateReport('summary');
      break;

    case 'connections':
      analytics.generateReport('connections');
      break;

    case 'messages':
      analytics.generateReport('messages');
      break;

    case 'visits':
      analytics.generateReport('visits');
      break;

    case 'daily':
      analytics.generateReport('daily');
      break;

    case 'weekly':
      analytics.generateReport('weekly');
      break;

    case 'export':
      const filename = args[1] || `linkedin-report-${Date.now()}.json`;
      const format = filename.endsWith('.csv') ? 'csv' : 'json';
      analytics.exportReport(filename, format);
      break;

    default:
      console.log('📊 LinkedIn Analytics\n');
      console.log('Usage:');
      console.log('  node linkedin-analytics.js summary       # Overall summary');
      console.log('  node linkedin-analytics.js connections   # Connection report');
      console.log('  node linkedin-analytics.js messages      # Messages report');
      console.log('  node linkedin-analytics.js visits        # Visits report');
      console.log('  node linkedin-analytics.js daily         # Today\'s activity');
      console.log('  node linkedin-analytics.js weekly        # Last 7 days');
      console.log('  node linkedin-analytics.js export [file] # Export report');
      break;
  }
}

main().catch(console.error);
