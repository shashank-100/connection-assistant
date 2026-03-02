-- Supabase Database Schema Migration
-- Run this in your Supabase SQL Editor

-- Create user_cookies table
CREATE TABLE IF NOT EXISTS user_cookies (
  user_id VARCHAR(255) PRIMARY KEY,
  cookies JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(500),
  title VARCHAR(500),
  company VARCHAR(500),
  profile_url TEXT,
  profile_picture TEXT,
  status VARCHAR(50) DEFAULT 'not_started',
  source VARCHAR(50),
  sent_at TIMESTAMP,
  connected_at TIMESTAMP,
  campaign_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, completed
  steps JSONB NOT NULL, -- Array of steps: [{ type: 'connect', delay: 0, template: '...' }]
  settings JSONB, -- Daily limits, schedule, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create campaign_leads table
CREATE TABLE IF NOT EXISTS campaign_leads (
  id VARCHAR(255) PRIMARY KEY, -- usually campaignId_leadId
  campaign_id VARCHAR(255) REFERENCES campaigns(id) ON DELETE CASCADE,
  lead_id VARCHAR(255) REFERENCES leads(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
  current_step INTEGER DEFAULT 0,
  next_action_at TIMESTAMP DEFAULT NOW(),
  history JSONB DEFAULT '[]', -- Log of actions taken: [{ step: 1, action: 'connect', status: 'success', time: '...' }]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(campaign_id, lead_id)
);

-- Create indexes for campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_processing ON campaign_leads(campaign_id, status, next_action_at);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE user_cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (bypass RLS for service role)
-- This allows your backend to access all data
CREATE POLICY "Enable all access for service role" ON user_cookies
  FOR ALL USING (true);

CREATE POLICY "Enable all access for service role" ON leads
  FOR ALL USING (true);

CREATE POLICY "Enable all access for service role" ON campaigns
  FOR ALL USING (true);

CREATE POLICY "Enable all access for service role" ON campaign_leads
  FOR ALL USING (true);
