# Supabase Migration Guide

## ✅ Migration Completed

Your backend has been successfully migrated from PostgreSQL (Railway) to Supabase!

---

## 🎯 What Changed

### Backend Files Updated
- ✅ Created `db-supabase.js` - New Supabase client with all database functions
- ✅ Updated `server.js` - Now imports from `db-supabase.js`
- ✅ Updated `api/leads.js` - Using Supabase database
- ✅ Updated `api/campaigns.js` - Using Supabase database
- ✅ Updated `api/index.js` - Using Supabase for cookies
- ✅ Updated `src/campaign-runner.js` - Using Supabase database
- ✅ Created `supabase-schema.sql` - Database schema for Supabase

### New Files
- `.env` - Environment variables with Supabase credentials
- `.env.example` - Template for environment variables
- `test-supabase.js` - Connection test script

### Database Schema
All tables created in Supabase:
- ✅ `user_cookies` - LinkedIn session cookies
- ✅ `leads` - Contact/lead information
- ✅ `campaigns` - Campaign configurations
- ✅ `campaign_leads` - Campaign execution tracking

---

## 🚀 Deployment Instructions

### For Railway (Backend)

1. **Go to your Railway project dashboard**

2. **Update Environment Variables:**
   - Remove old `DATABASE_URL` (if you want to completely switch)
   - Add new variables:
     ```
     SUPABASE_URL=https://zywelnojvoaieeesqafi.supabase.co
     SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d2Vsbm9qdm9haWVlZXNxYWZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQxNzQ2NywiZXhwIjoyMDg3OTkzNDY3fQ.XHUQDiRLY8RYbRHHyr4GaG7FqQ5-EN7R4qSBru7fp_o
     ```

3. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "feat: migrate backend to Supabase"
   git push origin main
   ```

4. **Railway will automatically redeploy with Supabase**

### For Vercel/Other Platforms

Add the same environment variables in your platform's settings:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `FRONTEND_URL` (optional, for CORS)
- `PORT` (optional, defaults to 3000)

---

## 🧪 Testing Locally

1. **Start the server:**
   ```bash
   cd agentlinkedin
   npm start
   ```

2. **Run the test script (optional):**
   ```bash
   node test-supabase.js
   ```

3. **Test endpoints:**
   ```bash
   # Health check
   curl http://localhost:3000/health

   # Get leads
   curl http://localhost:3000/api/leads?userId=shashank
   ```

---

## 📊 Supabase Dashboard

Access your database at: https://supabase.com/dashboard/project/zywelnojvoaieeesqafi

### Useful Features:
- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **Database**: Monitor connections and performance
- **API Docs**: Auto-generated REST API documentation

---

## 🔄 Data Migration (if needed)

If you have existing data in Railway PostgreSQL that you want to migrate:

### Option 1: Export/Import via CSV
1. Export data from Railway:
   ```bash
   pg_dump --data-only --table=leads,campaigns,campaign_leads,user_cookies \
     -h your-railway-host -U postgres -d railway > data.sql
   ```

2. Import to Supabase:
   ```bash
   PGPASSWORD='yAhFJI2g1Ywicdrr' psql \
     -h aws-1-us-west-1.pooler.supabase.com \
     -p 5432 \
     -U postgres.zywelnojvoaieeesqafi \
     -d postgres < data.sql
   ```

### Option 2: API-based migration
Run a custom script to fetch from Railway API and insert via Supabase client.

---

## 🔐 Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Service role key bypasses RLS (for backend use)
- ⚠️ **Never expose `SUPABASE_SERVICE_KEY` in frontend code**
- ✅ Use Supabase anon key for client-side operations (if needed in future)

---

## 🐛 Troubleshooting

### Connection Issues
- Verify `SUPABASE_URL` is correct
- Check `SUPABASE_SERVICE_KEY` is the service role key (not anon key)
- Ensure Supabase project is active and not paused

### Migration Issues
- Check Railway logs: `railway logs`
- Verify all environment variables are set
- Test with: `node test-supabase.js`

### RLS Errors
- Ensure you're using the service role key (not anon key)
- Check policies in Supabase dashboard

---

## 📝 Next Steps

1. ✅ Backend migrated to Supabase
2. ⏭️ Test all features thoroughly
3. ⏭️ Update frontend if needed (likely no changes required)
4. ⏭️ Monitor Supabase usage and performance
5. ⏭️ Consider migrating existing data from Railway (if any)

---

## 💡 Benefits of Supabase

- ✅ **Free tier**: 500MB database, 2GB file storage
- ✅ **Auto-scaling**: Handles traffic spikes automatically
- ✅ **Built-in auth**: Can add user authentication later
- ✅ **Real-time**: WebSocket support for live updates
- ✅ **Storage**: File storage with CDN (can store profile pictures)
- ✅ **Dashboard**: Easy data management and monitoring

---

## 🔗 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Your Project](https://supabase.com/dashboard/project/zywelnojvoaieeesqafi)
