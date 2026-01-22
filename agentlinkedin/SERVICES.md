# LinkedIn Agent Services Documentation

The `api/index.js` acts as the entry point for the LinkedIn automation agent. It provides several specialized services for interacting with LinkedIn profiles.

## Core Capabilities

### 1. Navigation & Inspection
- **Snapshot (`snapshot`)**: Takes a simplified, interactive tree view of any web page. Useful for debugging or manual inspection.
- **Login Check (`linkedin-me`)**: Navigates to the LinkedIn feed to check if the current session (provided via cookies) is authenticated.

### 2. Search & Exploration
- **Search People (`linkedin-search`)**: 
  - Searches for people on LinkedIn using a keyword.
  - Returns a list of profiles including names and profile URLs.
  - *Required parameter*: `searchTerm`
- **Visit Profiles (`linkedin-visit`)**:
  - Searches for profiles and visits each one individually (increases visibility/notifies the user).
  - *Required parameters*: `searchTerm`, `max` (number of profiles to visit).

### 3. Networking
- **Send Connection Request (`linkedin-connect`)**:
  - Navigates to a specific profile and attempts to click the "Connect" button.
  - Handles hidden "Connect" buttons inside the "More" dropdown.
  - *Required parameter*: `profileUrl`
- **Send Message (`linkedin-message`)**:
  - Navigates to a profile and sends a direct message.
  - *Note*: Usually requires you to be already connected.
  - *Required parameters*: `profileUrl`, `message`

### 4. Utility Actions
- **Get Cookies (`get-cookies`)**: Retrieves current browser cookies.
- **Get Storage (`get-storage`)**: Retrieves Local and Session storage data.
- **Network Tracking (`get-network`)**: Retrieves captured network requests (filtering available by search term).
- **Clear Network (`clear-network`)**: Clears the current network request logs.

---

## Request Format (POST)

All requests should be sent as a JSON POST to the `/api` endpoint.

```json
{
  "action": "ACTION_NAME",
  "cookies": [ ...optional session cookies... ],
  "searchTerm": "optional keyword",
  "profileUrl": "optional profile link",
  "message": "optional message text",
  "max": 5
}
```

## Implementation Details

The services are built on top of:
- **`agent-browser`**: Provides the interactive snapshot and locator logic.
- **Playwright**: The underlying browser engine.
- **LinkedIn Services (`src/services/`)**: Custom logic for handling LinkedIn's specific UI components (buttons, modals, search results).
