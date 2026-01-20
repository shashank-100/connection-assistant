# LinkedIn Connection Agent

Automated LinkedIn connection tool that searches for people and sends connection requests.

## Features

- ✅ Login to LinkedIn (with session persistence)
- ✅ Search for people by keyword
- ✅ Extract list of people from search results
- ✅ Send connection requests automatically
- ✅ Rate limiting and safety features
- ✅ Save results to JSON files
- ✅ Screenshot capture for debugging

## Installation

1. Make sure you have Node.js installed
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Install Chromium browser:
   ```bash
   ./bin/agent-browser install
   ```

## Usage

### Basic Usage

Run with a search term:

```bash
node linkedin-agent.js "software engineer"
```

Or:

```bash
node linkedin-agent.js "product manager"
```

### How It Works

1. **Login Phase**
   - Opens LinkedIn login page
   - Waits for you to manually enter credentials
   - Saves authentication state for future runs

2. **Search Phase**
   - Searches LinkedIn for your specified term
   - Scrolls through results
   - Extracts people with "Connect" buttons

3. **Connection Phase**
   - Shows you the list of people found
   - Asks for confirmation
   - Sends connection requests (default: max 10)

### Configuration

Edit the `CONFIG` object in `linkedin-agent.js`:

```javascript
const CONFIG = {
  sessionName: 'linkedin-agent',
  maxConnections: 10,              // Maximum connections per run
  delayBetweenActions: 3000,       // Delay between requests (ms)
  searchTerm: process.argv[2],     // Search term from command line
  resultsFile: 'linkedin-results.json'
};
```

## Safety Features

- **Rate Limiting**: 3-second delay between connection requests
- **Max Connections**: Default limit of 10 connections per run (configurable)
- **Manual Login**: Requires human verification for login
- **Confirmation Step**: Asks for confirmation before sending requests
- **Session Isolation**: Uses isolated browser session

## Output Files

The agent creates several files:

1. **linkedin-auth.json** - Saved authentication state (reusable)
2. **linkedin-login.png** - Screenshot of login page
3. **linkedin-search-results.png** - Full page screenshot of search results
4. **linkedin-results.json** - List of people found
5. **linkedin-connections-sent.json** - Results of connection requests

### Example Output (linkedin-connections-sent.json)

```json
{
  "searchTerm": "software engineer",
  "timestamp": "2024-01-20T15:30:00.000Z",
  "totalFound": 25,
  "totalSent": 10,
  "results": [
    {
      "name": "John Doe",
      "connectRef": "@e42",
      "status": "sent",
      "timestamp": "2024-01-20T15:30:15.000Z"
    }
  ]
}
```

## Troubleshooting

### "No binary found for darwin-arm64"

Build the native binary:
```bash
npm run build:native
```

Or use the Node.js fallback by editing `bin/agent-browser`.

### Login Issues

1. Delete `linkedin-auth.json` to force fresh login
2. Make sure you manually complete any 2FA/CAPTCHA
3. Check screenshots for debugging

### No People Found

- Try a different search term
- LinkedIn may have changed their UI (check screenshots)
- You may need to adjust the parsing logic in `searchPeople()`

### Rate Limited by LinkedIn

If LinkedIn blocks you:
- Increase `delayBetweenActions` (e.g., 5000ms)
- Decrease `maxConnections` (e.g., 5)
- Wait 24 hours before trying again

## Important Notes

⚠️ **LinkedIn Terms of Service**

This tool is for educational purposes. Automated actions may violate LinkedIn's Terms of Service. Use at your own risk:

- LinkedIn may suspend or ban accounts that use automation
- Keep `maxConnections` low to avoid detection
- Add delays between actions
- Consider using LinkedIn's official API for production use

⚠️ **Best Practices**

- Don't send too many requests at once
- Personalize connection requests when possible
- Only connect with relevant people
- Respect people's privacy

## Advanced Usage

### Reusing Auth State

After first login, the agent saves your session:

```bash
# First run - requires manual login
node linkedin-agent.js "data scientist"

# Future runs - auto-login
node linkedin-agent.js "machine learning engineer"
```

### Custom Search Filters

Modify the `searchUrl` in the script to add filters:

```javascript
// Search with location filter
const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}&geoUrn=%5B"103644278"%5D`;

// Search in connections of connections
const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchTerm)}&network=%5B"S"%5D`;
```

### Debugging

Enable headed mode to see the browser:

In the script, modify `runBrowser()` calls to add `--headed`:

```javascript
runBrowser('open https://www.linkedin.com/login --headed');
```

## Extending the Agent

### Add Custom Messages

Modify the connection request sending to include a note:

```javascript
// In sendConnectionRequests() function
// After clicking Connect, add:
const noteRef = findRefByText(modalSnapshot, 'Add a note');
if (noteRef) {
  runBrowser(`click ${noteRef}`);
  await wait(1000);
  runBrowser(`type ${textareaRef} "Hi, I'd love to connect!"`);
}
```

### Filter Results

Add filters before sending requests:

```javascript
// Only connect with people who have certain keywords in their profile
const filteredPeople = people.filter(person =>
  person.name.toLowerCase().includes('engineer')
);
```

## License

Apache-2.0 (same as agent-browser)
