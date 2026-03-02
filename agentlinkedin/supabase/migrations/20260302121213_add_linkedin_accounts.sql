CREATE TABLE IF NOT EXISTS linkedin_accounts (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  label       TEXT NOT NULL,
  cookies     JSONB,
  status      TEXT DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='campaigns' AND column_name='linkedin_account_id'
  ) THEN
    ALTER TABLE campaigns ADD COLUMN linkedin_account_id TEXT REFERENCES linkedin_accounts(id);
  END IF;
END$$;
