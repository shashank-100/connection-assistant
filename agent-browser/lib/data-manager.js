#!/usr/bin/env node

/**
 * Data Manager - Centralized data storage and retrieval
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

class DataManager {
  constructor(configPath = './config.json') {
    this.config = JSON.parse(readFileSync(configPath, 'utf-8'));
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    const dirs = ['linkedin-data', 'linkedin-data/logs'];
    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  readData(key) {
    const filePath = this.config.dataFiles[key];
    if (!filePath) {
      throw new Error(`Unknown data key: ${key}`);
    }

    if (!existsSync(filePath)) {
      return this.getDefaultData(key);
    }

    try {
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error.message);
      return this.getDefaultData(key);
    }
  }

  writeData(key, data) {
    const filePath = this.config.dataFiles[key];
    if (!filePath) {
      throw new Error(`Unknown data key: ${key}`);
    }

    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  getDefaultData(key) {
    const defaults = {
      connections: { connections: [], total: 0, lastUpdated: null },
      sentRequests: { requests: [], total: 0, lastUpdated: null },
      messagesSent: { messages: [], total: 0, lastUpdated: null },
      profilesScraped: { profiles: [], total: 0, lastUpdated: null },
      profileVisits: { visits: [], total: 0, lastUpdated: null },
      analytics: {
        connections: { sent: 0, accepted: 0, pending: 0, acceptanceRate: 0 },
        messages: { sent: 0, responses: 0, responseRate: 0 },
        visits: { total: 0 },
        lastUpdated: null
      }
    };
    return defaults[key] || {};
  }

  // Helper: Add connection request
  addConnectionRequest(person) {
    const data = this.readData('sentRequests');
    data.requests.push({
      ...person,
      sentDate: new Date().toISOString(),
      status: 'pending'
    });
    data.total = data.requests.length;
    data.lastUpdated = new Date().toISOString();
    this.writeData('sentRequests', data);
  }

  // Helper: Add message
  addMessage(profileUrl, message, response = null) {
    const data = this.readData('messagesSent');
    data.messages.push({
      profileUrl,
      message,
      response,
      sentDate: new Date().toISOString(),
      hasResponse: !!response
    });
    data.total = data.messages.length;
    data.lastUpdated = new Date().toISOString();
    this.writeData('messagesSent', data);
  }

  // Helper: Add profile visit
  addProfileVisit(profileUrl, name) {
    const data = this.readData('profileVisits');
    data.visits.push({
      profileUrl,
      name,
      visitDate: new Date().toISOString()
    });
    data.total = data.visits.length;
    data.lastUpdated = new Date().toISOString();
    this.writeData('profileVisits', data);
  }

  // Helper: Add scraped profile
  addScrapedProfile(profile) {
    const data = this.readData('profilesScraped');

    // Check if profile already exists
    const existingIndex = data.profiles.findIndex(p => p.profileUrl === profile.profileUrl);

    if (existingIndex >= 0) {
      // Update existing profile
      data.profiles[existingIndex] = {
        ...profile,
        scrapedDate: new Date().toISOString()
      };
    } else {
      // Add new profile
      data.profiles.push({
        ...profile,
        scrapedDate: new Date().toISOString()
      });
    }

    data.total = data.profiles.length;
    data.lastUpdated = new Date().toISOString();
    this.writeData('profilesScraped', data);
  }

  // Helper: Update analytics
  updateAnalytics() {
    const sentRequests = this.readData('sentRequests');
    const messagesSent = this.readData('messagesSent');
    const profileVisits = this.readData('profileVisits');

    const accepted = sentRequests.requests.filter(r => r.status === 'accepted').length;
    const pending = sentRequests.requests.filter(r => r.status === 'pending').length;
    const responses = messagesSent.messages.filter(m => m.hasResponse).length;

    const analytics = {
      connections: {
        sent: sentRequests.total,
        accepted,
        pending,
        acceptanceRate: sentRequests.total > 0 ? (accepted / sentRequests.total * 100).toFixed(2) : 0
      },
      messages: {
        sent: messagesSent.total,
        responses,
        responseRate: messagesSent.total > 0 ? (responses / messagesSent.total * 100).toFixed(2) : 0
      },
      visits: {
        total: profileVisits.total
      },
      lastUpdated: new Date().toISOString()
    };

    this.writeData('analytics', analytics);
    return analytics;
  }

  // Helper: Get daily action counts
  getDailyActionCounts() {
    const today = new Date().toISOString().split('T')[0];

    const sentRequests = this.readData('sentRequests');
    const messagesSent = this.readData('messagesSent');
    const profileVisits = this.readData('profileVisits');

    const connectionsToday = sentRequests.requests.filter(r =>
      r.sentDate.startsWith(today)
    ).length;

    const messagesToday = messagesSent.messages.filter(m =>
      m.sentDate.startsWith(today)
    ).length;

    const visitsToday = profileVisits.visits.filter(v =>
      v.visitDate.startsWith(today)
    ).length;

    return {
      connections: connectionsToday,
      messages: messagesToday,
      visits: visitsToday,
      date: today
    };
  }

  // Helper: Check if daily limit reached
  canPerformAction(actionType) {
    const counts = this.getDailyActionCounts();
    const limits = this.config.limits;

    const limitMap = {
      connection: limits.maxConnectionsPerDay,
      message: limits.maxMessagesPerDay,
      visit: limits.maxProfileVisitsPerDay
    };

    const countMap = {
      connection: counts.connections,
      message: counts.messages,
      visit: counts.visits
    };

    return countMap[actionType] < limitMap[actionType];
  }

  // Helper: Get remaining actions for today
  getRemainingActions() {
    const counts = this.getDailyActionCounts();
    const limits = this.config.limits;

    return {
      connections: limits.maxConnectionsPerDay - counts.connections,
      messages: limits.maxMessagesPerDay - counts.messages,
      visits: limits.maxProfileVisitsPerDay - counts.visits
    };
  }

  // Log to file
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

    const today = new Date().toISOString().split('T')[0];
    const logFile = `linkedin-data/logs/${today}.log`;

    try {
      const fs = await import('fs');
      fs.appendFileSync(logFile, logMessage);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }

    console.log(logMessage.trim());
  }
}

export default DataManager;
