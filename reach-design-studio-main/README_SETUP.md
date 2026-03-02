# LinkedIn Automation Platform - Setup Guide

This guide will help you set up and run both the frontend and backend of the LinkedIn automation platform.

## Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- PostgreSQL database (via Supabase)

## Project Structure

```
connection-assistant/
├── agentlinkedin/          # Backend (Express.js + Playwright)
└── reach-design-studio-main/  # Frontend (Vite + React + TypeScript)
```

## Backend Setup

### 1. Navigate to backend directory
```bash
cd /Users/shashank/Documents/GitHub/connection-assistant/agentlinkedin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the `agentlinkedin` directory:

```env
PORT=3000
FRONTEND_URL=http://localhost:8080

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# PostgreSQL (if not using Supabase)
DATABASE_URL=your_postgres_connection_string

# Playwright (for Railway deployment)
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

### 4. Start the backend server
```bash
npm start
```

The backend will run on `http://localhost:3000`

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd /Users/shashank/Documents/GitHub/connection-assistant/reach-design-studio-main
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
The `.env` file has already been created with:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USER_ID=shashank
```

You can modify `VITE_USER_ID` to match your user ID in the database.

### 4. Start the development server
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## Running Both Together

### Option 1: Using separate terminals

**Terminal 1 - Backend:**
```bash
cd /Users/shashank/Documents/GitHub/connection-assistant/agentlinkedin
npm start
```

**Terminal 2 - Frontend:**
```bash
cd /Users/shashank/Documents/GitHub/connection-assistant/reach-design-studio-main
npm run dev
```

### Option 2: Using a process manager (recommended)

Install `concurrently`:
```bash
npm install -g concurrently
```

Create a script in the root directory or use this command:
```bash
concurrently "cd agentlinkedin && npm start" "cd reach-design-studio-main && npm run dev"
```

## Accessing the Application

1. Open your browser and navigate to: `http://localhost:8080`
2. The backend API is available at: `http://localhost:3000`

## Features Available

### Pages
- **Dashboard** - Overview of metrics and activity
- **Leads** - View and manage imported leads
- **Campaigns** - Create and manage outreach campaigns
- **LinkedIn Accounts** - Manage connected LinkedIn sender accounts
- **Inbox** - View conversations (coming soon)
- **Workflows** - Automation workflows (coming soon)

### API Endpoints

Full API documentation is available in `API_DOCUMENTATION.md`

Key endpoints:
- `GET /api/leads` - Fetch all leads
- `POST /api/leads` - Add new leads
- `GET /api/campaigns` - Fetch all campaigns
- `POST /api/campaigns` - Create/update campaigns
- `GET /api/linkedin-accounts` - Fetch LinkedIn accounts
- `POST /auth/linkedin` - Save LinkedIn cookies

## Troubleshooting

### CORS Issues
- Make sure the backend is running on port 3000
- Verify that `http://localhost:8080` is in the allowed origins (already configured)

### Database Connection
- Check your Supabase credentials in the backend `.env` file
- Ensure the database schema is properly set up

### API Not Responding
- Verify the backend is running: `http://localhost:3000/health`
- Check the console for any errors
- Ensure environment variables are properly set

### Frontend Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are installed correctly

## Database Schema

The backend expects the following tables in your Supabase database:
- `leads` - Store lead information
- `campaigns` - Store campaign configurations
- `campaign_leads` - Junction table for campaign-lead relationships
- `linkedin_accounts` - Store LinkedIn sender accounts
- `user_cookies` - Store LinkedIn session cookies

Refer to the backend's Supabase migration files for the exact schema.

## Production Deployment

### Backend (Railway)
The backend is configured for Railway deployment with:
- Chromium browser support
- Environment variable configuration
- Health check endpoint

### Frontend (Vercel/Netlify)
Build command: `npm run build`
Output directory: `dist`
Environment variables: Set `VITE_API_BASE_URL` to your production backend URL

## Next Steps

1. Import leads via CSV or add them manually
2. Create a LinkedIn account connection
3. Build your first campaign
4. Launch and monitor your outreach

For detailed API documentation, see `API_DOCUMENTATION.md`
