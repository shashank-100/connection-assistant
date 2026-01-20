# 📁 LinkedIn Automation Suite - Project Structure

## Complete File List

```
agent-browser/
│
├── 🤖 MAIN SCRIPTS
│   ├── linkedin.js                    # Master CLI (unified interface)
│   ├── linkedin-agent.js              # Connection automation
│   ├── linkedin-messenger.js          # Messaging automation
│   ├── linkedin-scraper.js            # Profile scraping
│   ├── linkedin-profile-visitor.js    # Profile visiting
│   ├── linkedin-scheduler.js          # Task scheduler
│   └── linkedin-analytics.js          # Analytics & reporting
│
├── ⚙️ CONFIGURATION
│   └── config.json                    # Centralized settings
│
├── 📚 LIBRARIES
│   └── lib/
│       ├── data-manager.js            # Data storage utilities
│       └── browser-helper.js          # Browser automation helpers
│
├── 💾 DATA (auto-created)
│   └── linkedin-data/
│       ├── auth.json                  # Saved login session
│       ├── connections.json           # All connections
│       ├── sent-requests.json         # Connection requests sent
│       ├── messages-sent.json         # Messages sent
│       ├── profiles-scraped.json      # Scraped profiles
│       ├── profile-visits.json        # Profile visits
│       ├── analytics.json             # Performance metrics
│       ├── schedule.json              # Scheduler config
│       └── logs/
│           └── YYYY-MM-DD.log         # Daily logs
│
├── 📖 DOCUMENTATION
│   ├── QUICKSTART.md                  # Quick start guide (START HERE)
│   ├── README-LINKEDIN.md             # Complete documentation
│   ├── AGENT-BROWSER-PLAN.md          # Architecture plan
│   └── PROJECT-STRUCTURE.md           # This file
│
└── 🔧 AGENT-BROWSER (existing)
    ├── bin/agent-browser              # Browser CLI
    ├── src/                           # Source code
    ├── dist/                          # Built code
    └── package.json                   # Dependencies
```

## 🎯 What Each Script Does

### linkedin.js
**Unified CLI for all tools**
- Single entry point
- Cleaner commands
- Built-in help

```bash
node linkedin.js connect "engineer" --max 10
node linkedin.js message --message "Hi!" --max 5
node linkedin.js analytics summary
```

### linkedin-agent.js
**Send connection requests**
- Search LinkedIn
- Find people
- Send requests
- Track results

```bash
node linkedin-agent.js "software engineer" --max 10
```

### linkedin-messenger.js
**Message connections**
- Load connections
- Send messages
- Personalization
- Track responses

```bash
node linkedin-messenger.js --message "Hi {name}!" --max 5
```

### linkedin-scraper.js
**Extract profile data**
- Search or connections
- Visit profiles
- Extract data
- Export CSV/JSON

```bash
node linkedin-scraper.js "CTO" --max 50 --export leads.csv
```

### linkedin-profile-visitor.js
**Visit profiles for visibility**
- Search profiles
- Visit each one
- Appear in their views
- Track visits

```bash
node linkedin-profile-visitor.js "VP Sales" --max 20
```

### linkedin-scheduler.js
**Schedule automation**
- Run tasks at set times
- Manage daily limits
- Background execution
- Activity logs

```bash
node linkedin-scheduler.js start
```

### linkedin-analytics.js
**View reports**
- Connection stats
- Message metrics
- Activity graphs
- Export reports

```bash
node linkedin-analytics.js summary
node linkedin-analytics.js weekly
```

## 🔧 Helper Libraries

### lib/data-manager.js
- Read/write data files
- Track daily limits
- Update analytics
- Logging

### lib/browser-helper.js
- Browser automation
- Snapshot parsing
- Element finding
- Session management

## 📊 Data Files

### auth.json
Saved login session (reusable)
```json
{
  "cookies": [...],
  "localStorage": {...}
}
```

### sent-requests.json
Connection requests tracking
```json
{
  "requests": [
    {
      "name": "John Doe",
      "status": "pending",
      "sentDate": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 1
}
```

### messages-sent.json
Message history
```json
{
  "messages": [
    {
      "profileUrl": "...",
      "message": "Hi John!",
      "sentDate": "2024-01-20T11:00:00Z",
      "hasResponse": false
    }
  ],
  "total": 1
}
```

### analytics.json
Performance metrics
```json
{
  "connections": {
    "sent": 50,
    "accepted": 15,
    "acceptanceRate": 30
  },
  "messages": {
    "sent": 20,
    "responses": 5,
    "responseRate": 25
  }
}
```

## 🚀 Getting Started

1. **Read QUICKSTART.md** - 5 minute setup
2. **Run first command** - Send 5 connections
3. **Check results** - View analytics
4. **Scale up** - Use scheduler

## 📚 Full Documentation

See **README-LINKEDIN.md** for complete guide.

---

**Total Scripts:** 7 main + 2 helpers = **9 files**
**Total Lines:** ~2,500 lines of code
**Fully functional** LinkedIn automation suite ✅
