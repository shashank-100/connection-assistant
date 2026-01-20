# 🚀 LinkedIn Automation Suite - Quick Start

## You have a complete LinkedIn outreach tool!

### ✅ What's Included

1. **linkedin-agent.js** - Send connection requests
2. **linkedin-messenger.js** - Send messages to connections
3. **linkedin-scraper.js** - Extract profile data
4. **linkedin-profile-visitor.js** - Visit profiles for visibility
5. **linkedin-scheduler.js** - Schedule automation
6. **linkedin-analytics.js** - View reports and analytics
7. **linkedin.js** - Master CLI (unified interface)

Plus:
- **config.json** - Centralized configuration
- **lib/data-manager.js** - Data storage utilities
- **lib/browser-helper.js** - Browser automation helpers

---

## 🎯 Get Started in 3 Steps

### Step 1: Install Browser
```bash
./bin/agent-browser install
```

### Step 2: Send Your First Connections
```bash
node linkedin-agent.js "software engineer" --max 5
```

This will:
- Open LinkedIn login (enter credentials manually)
- Search for "software engineer"
- Send 5 connection requests
- Save results

### Step 3: Check Results
```bash
node linkedin-analytics.js summary
```

---

## 📖 Common Commands

### Connect with People
```bash
node linkedin-agent.js "product manager" --max 10
node linkedin-agent.js "CTO" --max 5
```

### Send Messages
```bash
node linkedin-messenger.js --message "Hi {name}!" --max 5
node linkedin-messenger.js --message "Hello {name}, saw you work at {company}" --filter "Google" --max 10
```

### Scrape Profiles
```bash
node linkedin-scraper.js "data scientist" --max 50 --export leads.csv
node linkedin-scraper.js --connections --export my-network.json
```

### Visit Profiles
```bash
node linkedin-profile-visitor.js "VP Sales" --max 20
node linkedin-profile-visitor.js --connections --max 30
```

### View Analytics
```bash
node linkedin-analytics.js summary
node linkedin-analytics.js weekly
node linkedin-analytics.js export report.json
```

### Schedule Automation
```bash
node linkedin-scheduler.js setup
node linkedin-scheduler.js start
node linkedin-scheduler.js status
```

### Master CLI (Easier)
```bash
node linkedin.js connect "engineer" --max 10
node linkedin.js message --message "Hi!" --max 5
node linkedin.js visit "CTO" --max 20
node linkedin.js analytics summary
```

---

## 📊 What Gets Tracked

All data saved to `linkedin-data/`:

- **sent-requests.json** - Connection requests sent
- **messages-sent.json** - Messages sent
- **profiles-scraped.json** - Scraped profiles
- **profile-visits.json** - Profile visits
- **analytics.json** - Performance metrics
- **auth.json** - Login session (reusable)

---

## ⚙️ Configuration

Edit `config.json`:

```json
{
  "limits": {
    "maxConnectionsPerDay": 50,
    "maxMessagesPerDay": 20,
    "maxProfileVisitsPerDay": 100
  }
}
```

---

## 🎯 Recommended Workflow

### Day 1: Manual Testing
```bash
# Start small
node linkedin-agent.js "your target" --max 5
node linkedin-analytics.js summary
```

### Day 2-7: Increase Volume
```bash
# Scale up gradually
node linkedin-agent.js "target" --max 10
node linkedin-messenger.js --message "Hi {name}!" --max 5
node linkedin-profile-visitor.js "target" --max 20
```

### Week 2+: Automate
```bash
# Set up scheduler
node linkedin-scheduler.js setup

# Edit linkedin-data/schedule.json to customize

# Start automation
node linkedin-scheduler.js start
```

---

## 🔒 Safety Settings

**Default limits are SAFE:**
- Max 50 connections/day
- Max 20 messages/day
- 3 second delays between actions
- Random timing variations

**Start conservative:**
- 5-10 connections/day first week
- Monitor for any LinkedIn warnings
- Increase gradually

---

## ⚠️ Important

1. **This tool is for educational purposes**
2. **May violate LinkedIn ToS** - use at own risk
3. **Start with low limits** (5-10 actions)
4. **Manual login required** (no stored passwords)
5. **Use on test account first**

---

## 🐛 Troubleshooting

### Login Issues
```bash
# Delete saved session and try again
rm linkedin-data/auth.json
node linkedin-agent.js "test"
```

### No Results
- Try different search terms
- Check if you're logged in
- Look at screenshots (auto-saved)

### Rate Limited
- Lower limits in config.json
- Wait 24 hours
- Increase delays to 5000ms

---

## 📚 Full Documentation

See **README-LINKEDIN.md** for:
- Complete command reference
- All configuration options
- Advanced workflows
- Best practices
- Troubleshooting guide

---

## 🎉 You're Ready!

Start with:
```bash
node linkedin-agent.js "software engineer" --max 5
```

Then explore:
```bash
node linkedin.js help
```

Happy automating! 🚀
