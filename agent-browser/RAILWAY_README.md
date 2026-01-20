# Deploying to Railway

This document provides instructions for deploying the `agent-browser` frontend to Railway.

## 1. Connect to Railway

- Create a new project on Railway and connect it to your Git repository.

## 2. Configure the Project

- **Root Directory**: Keep the default root directory (`.`). Do not change it to `frontend`.
- **Build Command**: `npm run frontend:build`
- **Install Command**: `pnpm install`

## 3. Environment Variables

The application requires Vercel KV for session storage. Since you are deploying to Railway, you will need to set up an alternative Redis-compatible storage solution and configure the following environment variables accordingly:

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

You will also need to address the incomplete serverless functionality in `frontend/src/app/api/agent/route.ts` for the application to work correctly in a serverless environment like Railway.
