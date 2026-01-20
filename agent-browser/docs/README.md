# Agent Browser Frontend

This is the web frontend for the agent-browser project, featuring LinkedIn outreach management tools.

## Features

### Documentation
- Installation guides
- Quick start tutorials
- Command references
- API documentation

### LinkedIn Outreach Management
- **Outreach Dashboard** - View and manage LinkedIn conversations
- **Campaigns** - Build and manage outreach campaigns
- **Leads** - Manage lead lists and imports
- **Contacts (228)** - View all contacts from the imported CSV file
- **Templates** - Create and manage message templates

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   └── leads/         # Leads API endpoint
│   ├── campaigns/         # Campaign builder page
│   ├── leads/             # Leads management
│   │   └── contacts/      # Contacts list from CSV
│   ├── outreach/          # Outreach dashboard
│   └── templates/         # Message templates
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── outreach/         # Outreach-specific components
│   ├── campaigns/        # Campaign components
│   ├── leads/            # Leads components
│   └── templates/        # Template components
├── data/                 # Mock and real data
├── types/                # TypeScript type definitions
├── lib/                  # Utility functions
└── hooks/                # Custom React hooks
```

## CSV Data Integration

The application reads from `/public/referral_1-40.csv` which contains 228 LinkedIn contacts with the following data:
- Name and LinkedIn profile
- Company and job title
- Location
- Contact information (email, phone)
- Connection count
- Match status

Access the contacts at: [http://localhost:3000/leads/contacts](http://localhost:3000/leads/contacts)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
