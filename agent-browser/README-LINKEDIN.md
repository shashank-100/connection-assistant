## 🤖 LinkedIn Automation Suite

**Complete LinkedIn outreach automation powered by agent-browser**

Stop manually sending connection requests, messages, and visiting profiles. Automate your entire LinkedIn outreach workflow with intelligent scheduling, rate limiting, and analytics.

---

## ✨ Features

### 🔗 Connection Automation
- Search and send connection requests automatically
- Smart filtering and targeting
- Avoid duplicates and already connected
- Daily limits and safety features

### 💬 Messaging Automation
- Send personalized messages to connections
- Template system with variables ({name}, {company}, etc.)
- Filter by company, title, or keywords
- Track responses and follow-ups

### 🔍 Profile Scraping
- Extract detailed profile data
- Export to CSV or JSON
- Build prospect databases
- Research and lead generation

### 👀 Profile Visiting
- Visit profiles to increase visibility
- Appear in "Who viewed your profile"
- Passive outreach strategy
- Visit connections or search results

### 📅 Scheduling
- Schedule tasks to run automatically
- Set daily quotas and limits
- Run during optimal times
- Set it and forget it

### 📊 Analytics & Reporting
- Track connection acceptance rates
- Monitor message response rates
- View daily/weekly activity
- Export detailed reports

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
npm run build
./bin/agent-browser install
```

### 2. First Run - Connect with People

```bash
node linkedin-agent.js "software engineer" --max 5
```

This will:
- Open LinkedIn login (manual login required)
- Search for "software engineer"
- Send 5 connection requests
- Save results to JSON

### 3. View Results

```bash
node linkedin-analytics.js summary
```

---

## 📋 All Commands

### Master CLI (Recommended)

```bash
# Unified interface
node linkedin.js <command> [options]

# Examples
node linkedin.js connect "product manager" --max 10
node linkedin.js message --message "Hi {name}!" --max 5
node linkedin.js visit "CTO" --max 20
node linkedin.js analytics summary
```

### Individual Scripts

#### 1️⃣ Connection Automation

```bash
node linkedin-agent.js "search term" [options]

Options:
  --max <number>     Max connections to send (default: 5)

Examples:
  node linkedin-agent.js "software engineer" --max 10
  node linkedin-agent.js "product manager" --max 5
  node linkedin-agent.js "VP of Sales" --max 3
```

**What it does:**
- Searches LinkedIn for your keyword
- Finds people with "Connect" button
- Sends connection requests
- Saves to `linkedin-data/sent-requests.json`

---

#### 2️⃣ Messaging Automation

```bash
node linkedin-messenger.js --message "text" [options]

Options:
  --message <text>   Message to send (required)
  --max <number>     Max messages to send (default: 5)
  --filter <term>    Filter connections by keyword

Examples:
  node linkedin-messenger.js --message "Hi {name}!" --max 5
  node linkedin-messenger.js --message "Hey {name}, noticed you work at {company}" --max 10
  node linkedin-messenger.js --message "Hello!" --filter "Google" --max 5
```

**Variables you can use:**
- `{name}` - First name
- `{fullname}` - Full name
- `{headline}` - Their headline
- `{company}` - Their company (if in headline)

**What it does:**
- Loads your connections
- Filters by keyword (optional)
- Sends personalized messages
- Tracks who you've messaged
- Saves to `linkedin-data/messages-sent.json`

---

#### 3️⃣ Profile Scraping

```bash
node linkedin-scraper.js "search term" [options]

Options:
  --max <number>        Max profiles to scrape (default: 20)
  --export <filename>   Export to file (.json or .csv)
  --connections         Scrape your connections instead of search

Examples:
  node linkedin-scraper.js "data scientist" --max 50 --export leads.csv
  node linkedin-scraper.js "CTO SaaS" --max 100 --export prospects.json
  node linkedin-scraper.js --connections --export my-network.csv
```

**Data extracted:**
- Name, headline, location
- About section
- Experience history
- Education
- Profile URL

**What it does:**
- Searches or loads connections
- Visits each profile
- Extracts data
- Exports to CSV or JSON
- Saves to `linkedin-data/profiles-scraped.json`

---

#### 4️⃣ Profile Visiting

```bash
node linkedin-profile-visitor.js "search term" [options]

Options:
  --max <number>     Max profiles to visit (default: 20)
  --connections      Visit your connections
  --2nd-degree       Visit 2nd degree connections

Examples:
  node linkedin-profile-visitor.js "CTO" --max 30
  node linkedin-profile-visitor.js "VP Engineering" --max 50
  node linkedin-profile-visitor.js --connections --max 20
  node linkedin-profile-visitor.js "founder" --2nd-degree --max 40
```

**Why visit profiles?**
- You appear in their "Who viewed your profile"
- Many people visit back
- Passive way to get noticed
- Can lead to connection requests

**What it does:**
- Searches or loads connections
- Visits each profile
- Scrolls to simulate real viewing
- Tracks visits
- Saves to `linkedin-data/profile-visits.json`

---

#### 5️⃣ Scheduling

```bash
node linkedin-scheduler.js <command>

Commands:
  setup          Create default schedule
  start          Start scheduler (runs continuously)
  status         Show current schedule and stats
  logs [count]   View recent logs
  enable [task]  Enable scheduler or specific task
  disable [task] Disable scheduler or specific task

Examples:
  node linkedin-scheduler.js setup
  node linkedin-scheduler.js start
  node linkedin-scheduler.js status
  node linkedin-scheduler.js logs 20
```

**Default schedule:**
- 9:00 AM - Send 10 connection requests
- 2:00 PM - Send 5 messages
- 6:00 PM - Visit 20 profiles

**Customization:**
Edit `linkedin-data/schedule.json` to customize tasks, times, and limits.

**What it does:**
- Checks every minute for scheduled tasks
- Runs tasks at specified times
- Respects daily limits
- Logs all activity
- Saves to `linkedin-data/schedule.json`

---

#### 6️⃣ Analytics

```bash
node linkedin-analytics.js <report>

Reports:
  summary       Overall summary (default)
  connections   Connection request report
  messages      Messages report
  visits        Profile visits report
  daily         Today's activity
  weekly        Last 7 days activity
  export <file> Export full report

Examples:
  node linkedin-analytics.js summary
  node linkedin-analytics.js connections
  node linkedin-analytics.js weekly
  node linkedin-analytics.js export report.json
  node linkedin-analytics.js export report.csv
```

**What it does:**
- Reads all data files
- Calculates metrics
- Shows visualizations
- Exports reports
- Updates `linkedin-data/analytics.json`

---

## ⚙️ Configuration

Edit `config.json` to customize:

```json
{
  "limits": {
    "maxConnectionsPerDay": 50,
    "maxMessagesPerDay": 20,
    "maxProfileVisitsPerDay": 100,
    "delayBetweenActions": 3000,
    "delayVariation": 2000
  },
  "targeting": {
    "searchTerms": ["software engineer", "product manager"],
    "excludeKeywords": ["recruiter", "recruiting"],
    "locations": ["San Francisco Bay Area", "New York"],
    "companies": ["Google", "Meta", "Amazon"]
  },
  "messaging": {
    "templates": {
      "initial": "Hi {name}, I noticed we both work in {industry}...",
      "followup": "Hey {name}, hope you're doing well!",
      "thankyou": "Thanks for connecting, {name}!"
    }
  }
}
```

---

## 📁 Data Files

All data is stored in `linkedin-data/`:

```
linkedin-data/
├── auth.json              # Saved login session
├── connections.json       # All connections
├── sent-requests.json     # Connection requests sent
├── messages-sent.json     # Messages sent
├── profiles-scraped.json  # Scraped profile data
├── profile-visits.json    # Profiles visited
├── analytics.json         # Analytics data
├── schedule.json          # Scheduler configuration
└── logs/
    ├── 2024-01-20.log
    └── errors.log
```

---

## 🎯 Real-World Workflows

### Workflow 1: Daily Lead Generation

```bash
# Morning: Connect with prospects
node linkedin.js connect "VP of Sales SaaS" --max 10

# Afternoon: Message accepted connections
node linkedin.js message --message "Thanks for connecting, {name}!" --max 5

# Evening: Visit more profiles
node linkedin.js visit "Director of Sales" --max 20

# Check results
node linkedin.js analytics daily
```

### Workflow 2: Build Network in Target Company

```bash
# Scrape employees
node linkedin.js scrape "engineer at Google" --max 50 --export google-engineers.csv

# Visit their profiles
node linkedin.js visit "Google engineer" --max 30

# Connect with them
node linkedin.js connect "Google engineer" --max 10

# Message after they accept
node linkedin.js message --filter "Google" --message "Hi {name}!" --max 5
```

### Workflow 3: Automated Daily Outreach

```bash
# Set up schedule
node linkedin.js schedule setup

# Edit schedule.json to customize

# Start automation
node linkedin.js schedule start

# Check weekly progress
node linkedin.js analytics weekly
```

### Workflow 4: Research and Export

```bash
# Scrape multiple search terms
node linkedin.js scrape "CTO" --max 100 --export ctos.csv
node linkedin.js scrape "VP Engineering" --max 100 --export vps.csv
node linkedin.js scrape "Director Product" --max 100 --export directors.csv

# Analyze in Excel/Google Sheets
# Filter and create target list

# Import and connect (manual list)
# Then message them
```

---

## 🔒 Safety Features

### Rate Limiting
- Daily limits for all actions
- Configurable delays between actions
- Random variation in timing
- Respects LinkedIn's limits

### Detection Avoidance
- Human-like behavior patterns
- Random delays
- Scrolling simulation
- Session management

### Data Protection
- Local storage only
- No data sent to third parties
- Auth state saved securely
- Full control over your data

### Manual Override
- Can stop anytime with Ctrl+C
- Manual login required
- Review before sending
- Adjustable limits

---

## ⚠️ Important Notes

### LinkedIn Terms of Service

This tool is for **educational purposes**. Automated actions may violate LinkedIn's Terms of Service. Use at your own risk:

- LinkedIn may suspend or ban accounts using automation
- Keep limits conservative (50 connections/day max)
- Add delays between actions (3-5 seconds)
- Consider using LinkedIn's official API for production

### Best Practices

✅ **DO:**
- Start with low limits (5-10 actions)
- Test on your own account first
- Personalize messages
- Only connect with relevant people
- Monitor analytics regularly
- Respect people's privacy

❌ **DON'T:**
- Send 100+ connections per day
- Use generic spam messages
- Connect with everyone you find
- Run 24/7 without breaks
- Ignore LinkedIn warnings
- Use on valuable accounts initially

---

## 🐛 Troubleshooting

### "No binary found for darwin-arm64"

```bash
npm run build:native
```

Or edit `bin/agent-browser` to use Node.js fallback.

### Login Issues

1. Delete `linkedin-data/auth.json`
2. Run any command to force fresh login
3. Complete any 2FA/CAPTCHA manually
4. Check screenshots in current directory

### "No profiles found"

- Try a different search term
- Check if you're logged in
- LinkedIn UI may have changed
- Try with `--headed` flag to see browser

### Rate Limited by LinkedIn

- Decrease `maxConnectionsPerDay` in config
- Increase `delayBetweenActions` (5000ms+)
- Wait 24 hours before trying again
- Consider LinkedIn Premium

### Script Errors

Check logs:
```bash
cat linkedin-data/logs/$(date +%Y-%m-%d).log
```

---

## 📊 Expected Results

### Connection Requests
- **Acceptance Rate**: 20-40% typical
- **Daily Limit**: 50 max (start with 10-20)
- **Best Times**: 9-11 AM, 2-4 PM (weekdays)

### Messages
- **Response Rate**: 10-30% typical
- **Daily Limit**: 20 max
- **Best Times**: Morning and early afternoon

### Profile Visits
- **Return Visits**: 5-15% will visit back
- **Daily Limit**: 100 max
- **Best for**: Passive outreach

---

## 🚀 Advanced Usage

### Running in Background

```bash
# Use nohup to run scheduler in background
nohup node linkedin-scheduler.js start > scheduler.log 2>&1 &

# Check if running
ps aux | grep linkedin-scheduler

# Stop
pkill -f linkedin-scheduler
```

### Deploy to Server

```bash
# Use PM2 for production
npm install -g pm2
pm2 start linkedin-scheduler.js --name linkedin-automation
pm2 logs linkedin-automation
pm2 stop linkedin-automation
```

### Cron Job

```bash
# Run daily at 9 AM
0 9 * * * cd /path/to/agent-browser && node linkedin-agent.js "software engineer" --max 10
```

---

## 📞 Support

- Issues: Check logs in `linkedin-data/logs/`
- Questions: Review this README
- Bugs: Create GitHub issue

---

## 📝 License

Apache-2.0 (same as agent-browser)

---

## 🎯 Summary

You now have a **complete LinkedIn automation suite** with:

✅ Connection automation
✅ Messaging automation
✅ Profile scraping
✅ Profile visiting
✅ Scheduling
✅ Analytics

**Start with:**
```bash
node linkedin.js connect "your target" --max 5
node linkedin.js analytics summary
```

**Scale up with:**
```bash
node linkedin.js schedule setup
node linkedin.js schedule start
```

Happy automating! 🚀
