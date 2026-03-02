# LinkedIn Automation Backend API Documentation

Base URL: `http://localhost:3000` (Development)
Production URL: `https://agentlinkedin-production.up.railway.app` (or your deployed backend)

## Table of Contents
1. [Authentication](#authentication)
2. [Leads Management](#leads-management)
3. [Campaigns Management](#campaigns-management)
4. [LinkedIn Accounts (Senders)](#linkedin-accounts-senders)
5. [LinkedIn Browser Actions](#linkedin-browser-actions)
6. [Data Models](#data-models)

---

## Authentication

### Save LinkedIn Cookies
**POST** `/auth/linkedin`

Store LinkedIn session cookies for a user to enable automation.

**Request Body:**
```json
{
  "userId": "string",
  "cookies": [
    {
      "name": "string",
      "value": "string",
      "domain": "string",
      "path": "string",
      "expires": "number",
      "httpOnly": "boolean",
      "secure": "boolean"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cookies saved for user: {userId}",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get User Cookies
**GET** `/auth/linkedin/:userId`

Retrieve stored cookies for a user.

**Response:**
```json
{
  "success": true,
  "userId": "string",
  "cookies": [...]
}
```

### Delete User Cookies
**DELETE** `/auth/linkedin/:userId`

Remove stored cookies for a user.

**Response:**
```json
{
  "success": true,
  "message": "Cookies deleted for user: {userId}"
}
```

---

## Leads Management

### Get All Leads
**GET** `/api/leads?userId={userId}`

Fetch all leads for a user.

**Query Parameters:**
- `userId` (optional, default: "shashank")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "title": "string",
      "company": "string",
      "profileUrl": "string",
      "profilePicture": "string",
      "status": "pending|sent|connected|replied|not_interested",
      "source": "string",
      "campaignId": "string|null",
      "createdAt": "timestamp",
      "sentAt": "timestamp|null",
      "connectedAt": "timestamp|null"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Get Lead Lists
**GET** `/api/leads?userId={userId}&action=lists`

Fetch grouped lead lists (sources).

**Query Parameters:**
- `userId` (optional, default: "shashank")
- `action=lists` (required)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "memberCount": 100,
      "totalCapacity": 100,
      "importedAt": "string",
      "status": "not_started|in_progress|completed"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Add Leads
**POST** `/api/leads`

Import multiple leads.

**Request Body:**
```json
{
  "userId": "shashank",
  "leads": [
    {
      "name": "string",
      "title": "string",
      "company": "string",
      "profile_url": "string",
      "profile_picture": "string",
      "source": "string",
      "status": "pending"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 10,
    "message": "Added 10 leads"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Delete Leads by Source
**DELETE** `/api/leads`

Delete all leads from a specific source (list).

**Request Body:**
```json
{
  "userId": "shashank",
  "source": "list-name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Deleted leads from source: list-name"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Campaigns Management

### Get All Campaigns
**GET** `/api/campaigns?userId={userId}`

Fetch all campaigns with statistics.

**Query Parameters:**
- `userId` (optional, default: "shashank")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "name": "string",
      "status": "draft|active|paused|completed",
      "steps": [...],
      "settings": {...},
      "linkedin_account_id": "string|null",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "stats": {
        "total": 100,
        "pending": 50,
        "sent": 30,
        "connected": 15,
        "replied": 5
      }
    }
  ]
}
```

### Create/Update Campaign
**POST** `/api/campaigns`

Create or update a campaign configuration.

**Request Body:**
```json
{
  "userId": "shashank",
  "id": "campaign-id",
  "name": "Campaign Name",
  "status": "draft",
  "steps": [
    {
      "type": "connection_request",
      "delay_hours": 0,
      "message": "Hi {firstName}, let's connect!"
    },
    {
      "type": "follow_up_message",
      "delay_hours": 48,
      "message": "Thanks for connecting!"
    }
  ],
  "settings": {
    "daily_limit": 20,
    "timezone": "UTC"
  },
  "linkedin_account_id": "account_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campaign saved successfully",
  "campaignId": "campaign-id"
}
```

### Launch Campaign
**POST** `/api/campaigns`

Add leads to a campaign and prepare for execution.

**Request Body (Option 1 - By Source):**
```json
{
  "userId": "shashank",
  "action": "launch",
  "campaignId": "campaign-id",
  "source": "list-name",
  "excludeInNetwork": true
}
```

**Request Body (Option 2 - By Lead IDs):**
```json
{
  "userId": "shashank",
  "action": "launch",
  "campaignId": "campaign-id",
  "leadIds": ["lead-1", "lead-2", "lead-3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Launched campaign with 50 leads",
  "count": 50
}
```

### Start Campaign
**POST** `/api/campaigns`

Activate a campaign (change status to active).

**Request Body:**
```json
{
  "userId": "shashank",
  "action": "start",
  "campaignId": "campaign-id"
}
```

**Response:**
```json
{
  "success": true,
  "status": "started",
  "message": "Campaign campaign-id is now active"
}
```

### Pause Campaign
**POST** `/api/campaigns`

Pause an active campaign.

**Request Body:**
```json
{
  "userId": "shashank",
  "action": "pause",
  "campaignId": "campaign-id"
}
```

**Response:**
```json
{
  "success": true,
  "status": "paused"
}
```

### Resume Campaign
**POST** `/api/campaigns`

Resume a paused campaign.

**Request Body:**
```json
{
  "userId": "shashank",
  "action": "resume",
  "campaignId": "campaign-id"
}
```

**Response:**
```json
{
  "success": true,
  "status": "active"
}
```

---

## LinkedIn Accounts (Senders)

### Get All LinkedIn Accounts
**GET** `/api/linkedin-accounts?userId={userId}`

Fetch all LinkedIn sender accounts for a user.

**Query Parameters:**
- `userId` (required)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "account_123",
      "user_id": "shashank",
      "label": "Primary Account",
      "created_at": "timestamp"
    }
  ]
}
```

### Add LinkedIn Account
**POST** `/api/linkedin-accounts`

Add a new LinkedIn sender account.

**Request Body:**
```json
{
  "userId": "shashank",
  "label": "Primary Account",
  "cookies": [...],
  "senderLimit": 5
}
```

**Response:**
```json
{
  "success": true,
  "accountId": "account_1234567890",
  "label": "Primary Account"
}
```

**Error (Limit Reached):**
```json
{
  "success": false,
  "error": "Sender limit reached (5/5). Remove an account before adding a new one."
}
```

### Delete LinkedIn Account
**DELETE** `/api/linkedin-accounts/:id`

Remove a LinkedIn sender account.

**Response:**
```json
{
  "success": true
}
```

---

## LinkedIn Browser Actions

### Execute Browser Action
**POST** `/api`

Execute various LinkedIn automation actions using a headless browser.

**Common Request Fields:**
```json
{
  "userId": "shashank",
  "action": "action-type",
  "cookies": [...] // Optional if userId has cookies stored
}
```

### Available Actions

#### 1. Snapshot
Get a snapshot of the current page state.

**Request:**
```json
{
  "action": "snapshot",
  "userId": "shashank",
  "url": "https://www.linkedin.com/in/someone" // Optional
}
```

#### 2. Check Authentication
**Request:**
```json
{
  "action": "linkedin-me",
  "userId": "shashank"
}
```

**Response:**
```json
{
  "success": true,
  "action": "linkedin-me",
  "data": {
    "authenticated": true,
    "url": "https://www.linkedin.com/feed/",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Search People
**Request:**
```json
{
  "action": "linkedin-search",
  "userId": "shashank",
  "searchTerm": "software engineer"
}
```

#### 4. Send Connection Request
**Request:**
```json
{
  "action": "linkedin-connect",
  "userId": "shashank",
  "profileUrl": "https://www.linkedin.com/in/someone"
}
```

#### 5. Visit Profiles
**Request:**
```json
{
  "action": "linkedin-visit",
  "userId": "shashank",
  "searchTerm": "software engineer",
  "max": 5
}
```

#### 6. Send Message
**Request:**
```json
{
  "action": "linkedin-message",
  "userId": "shashank",
  "profileUrl": "https://www.linkedin.com/in/someone",
  "message": "Hi there!"
}
```

#### 7. Get Conversations
**Request:**
```json
{
  "action": "linkedin-conversations",
  "userId": "shashank",
  "max": 50
}
```

#### 8. Get My Profile
**Request:**
```json
{
  "action": "linkedin-profile",
  "userId": "shashank"
}
```

#### 9. Get Campaigns Data
**Request:**
```json
{
  "action": "linkedin-campaigns",
  "userId": "shashank"
}
```

#### 10. Get All Leads from LinkedIn
**Request:**
```json
{
  "action": "linkedin-leads",
  "userId": "shashank"
}
```

---

## Data Models

### Lead
```typescript
interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  profileUrl: string;
  profilePicture: string;
  status: 'pending' | 'sent' | 'connected' | 'replied' | 'not_interested';
  source: string;
  campaignId: string | null;
  createdAt: string;
  sentAt: string | null;
  connectedAt: string | null;
}
```

### Campaign
```typescript
interface Campaign {
  id: string;
  user_id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  steps: CampaignStep[];
  settings: CampaignSettings;
  linkedin_account_id: string | null;
  created_at: string;
  updated_at: string;
}

interface CampaignStep {
  type: 'connection_request' | 'follow_up_message' | 'inmail';
  delay_hours: number;
  message: string;
}

interface CampaignSettings {
  daily_limit: number;
  timezone: string;
  [key: string]: any;
}
```

### LinkedIn Account
```typescript
interface LinkedInAccount {
  id: string;
  user_id: string;
  label: string;
  created_at: string;
  // cookies are stored but not returned in GET requests
}
```

### Cookie
```typescript
interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "error": "Error message description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `403` - Forbidden (e.g., sender limit reached)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## Notes

1. **Default User ID**: Most endpoints default to `userId: "shashank"` if not provided
2. **CORS**: Backend allows these origins:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - Production frontend URL
3. **Rate Limiting**: Campaign settings include `daily_limit` to prevent LinkedIn restrictions
4. **Authentication**: LinkedIn session cookies must be valid and not expired
5. **Background Jobs**: Campaign execution runs in background via CampaignRunner
