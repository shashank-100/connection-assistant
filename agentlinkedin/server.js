import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import handler from './api/index.js';
import leadsHandler from './api/leads.js';
import campaignsHandler from './api/campaigns.js';
import { CampaignRunner } from './src/campaign-runner.js';
import { initDB, saveCookies, getCookies, deleteCookies } from './db-supabase.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Unified CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://frontend-production-50ccc.up.railway.app',
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Save user cookies
app.post('/auth/linkedin', async (req, res) => {
  try {
    const { userId, cookies } = req.body;

    if (!userId || !cookies || !Array.isArray(cookies)) {
      return res.status(400).json({
        success: false,
        error: 'userId and cookies array required'
      });
    }

    await saveCookies(userId, cookies);

    res.json({
      success: true,
      message: `Cookies saved for user: ${userId}`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[AUTH] Error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Get user cookies
app.get('/auth/linkedin/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cookies = await getCookies(userId);

    if (!cookies) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      userId,
      cookies
    });
  } catch (err) {
    console.error('[AUTH] Error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Delete user cookies
app.delete('/auth/linkedin/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await deleteCookies(userId);

    res.json({
      success: true,
      message: `Cookies deleted for user: ${userId}`
    });
  } catch (err) {
    console.error('[AUTH] Error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Main API endpoint
app.post('/api', async (req, res) => {
  await handler(req, res);
});

// Leads API endpoint (no browser needed)
app.get('/api/leads', async (req, res) => {
  await leadsHandler(req, res);
});

app.post('/api/leads', async (req, res) => {
  await leadsHandler(req, res);
});

app.delete('/api/leads', async (req, res) => {
  await leadsHandler(req, res);
});

// Campaigns API endpoint
app.post('/api/campaigns', async (req, res) => {
  await campaignsHandler(req, res);
});

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    
    // Start background campaign runner with delay
    setTimeout(() => {
      const runner = new CampaignRunner();
      runner.start().catch(err => {
        console.error('[SERVER] Failed to start campaign runner:', err);
      });
    }, 5000);
  });
}).catch(err => {
  console.error('[SERVER] Failed to initialize database:', err);
  process.exit(1);
});
