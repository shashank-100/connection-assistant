import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database schema
export async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_cookies (
        user_id VARCHAR(255) PRIMARY KEY,
        cookies JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
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
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, completed
        steps JSONB NOT NULL, -- Array of steps: [{ type: 'connect', delay: 0, template: '...' }]
        settings JSONB, -- Daily limits, schedule, etc.
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS campaign_leads (
        id VARCHAR(255) PRIMARY KEY, -- usually campaignId_leadId
        campaign_id VARCHAR(255) REFERENCES campaigns(id),
        lead_id VARCHAR(255) REFERENCES leads(id),
        user_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
        current_step INTEGER DEFAULT 0,
        next_action_at TIMESTAMP DEFAULT NOW(),
        history JSONB DEFAULT '[]', -- Log of actions taken: [{ step: 1, action: 'connect', status: 'success', time: '...' }]
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(campaign_id, lead_id)
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_campaign_leads_processing ON campaign_leads(campaign_id, status, next_action_at)
    `);

    console.log('[DB] Database schema initialized');
  } catch (err) {
    console.error('[DB] Error initializing database:', err);
  } finally {
    client.release();
  }
}

// Save or update user cookies
export async function saveCookies(userId, cookies) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO user_cookies (user_id, cookies, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET cookies = $2, updated_at = NOW()`,
      [userId, JSON.stringify(cookies)]
    );
    console.log(`[DB] Saved cookies for user: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error saving cookies:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Get user cookies
export async function getCookies(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT cookies FROM user_cookies WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].cookies;
  } catch (err) {
    console.error('[DB] Error getting cookies:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Delete user cookies
export async function deleteCookies(userId) {
  const client = await pool.connect();
  try {
    await client.query(
      'DELETE FROM user_cookies WHERE user_id = $1',
      [userId]
    );
    console.log(`[DB] Deleted cookies for user: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error deleting cookies:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function deleteLeadsBySource(userId, source) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM leads WHERE user_id = $1 AND source = $2',
      [userId, source]
    );
    console.log(`[DB] Deleted ${result.rowCount} leads for user: ${userId} with source: ${source}`);
    return { success: true, count: result.rowCount };
  } catch (err) {
    console.error('[DB] Error deleting leads:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Save or update leads
export async function saveLeads(userId, leads) {
  const client = await pool.connect();
  try {
    for (const lead of leads) {
      await client.query(
        `INSERT INTO leads (id, user_id, name, title, company, profile_url, profile_picture, status, source, sent_at, connected_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
         ON CONFLICT (id)
         DO UPDATE SET
           name = $3,
           title = $4,
           company = $5,
           profile_url = $6,
           profile_picture = $7,
           status = $8,
           source = $9,
           sent_at = $10,
           connected_at = $11,
           updated_at = NOW()`,
        [
          lead.id,
          userId,
          lead.name,
          lead.title || lead.headline,
          lead.company,
          lead.profileUrl,
          lead.profilePicture,
          lead.status || 'not_started',
          lead.source,
          lead.sentAt,
          lead.connectedAt
        ]
      );
    }
    console.log(`[DB] Saved ${leads.length} leads for user: ${userId}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error saving leads:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Get all leads for a user with their campaign progress
export async function getLeads(userId, filters = {}) {
  const client = await pool.connect();
  try {
    let query = `
      SELECT 
        l.*,
        cl.status as campaign_status,
        cl.current_step,
        cl.next_action_at,
        cl.history as campaign_history,
        c.name as campaign_name,
        c.steps as campaign_steps
      FROM leads l
      LEFT JOIN campaign_leads cl ON l.id = cl.lead_id
      LEFT JOIN campaigns c ON cl.campaign_id = c.id
      WHERE l.user_id = $1`;
    
    const params = [userId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND l.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.source) {
      query += ` AND l.source = $${paramIndex}`;
      params.push(filters.source);
      paramIndex++;
    }

    query += ' ORDER BY l.created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
    }

    const result = await client.query(query, params);
    return result.rows;
  } catch (err) {
    console.error('[DB] Error getting leads:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Update lead status
export async function updateLeadStatus(leadId, status) {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, leadId]
    );
    console.log(`[DB] Updated lead ${leadId} status to ${status}`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error updating lead status:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Get lead statistics for a user
export async function getLeadStats(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT
        COUNT(*) as total_leads,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN status = 'connected' THEN 1 END) as recent_connections,
        COUNT(CASE WHEN source = 'csv_import' THEN 1 END) as imported_leads
       FROM leads WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  } catch (err) {
    console.error('[DB] Error getting lead stats:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Get unique lead lists (sources) for a user
export async function getLeadLists(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT
        source,
        source as source_name,
        COUNT(*) as count
       FROM leads
       WHERE user_id = $1 AND source IS NOT NULL
       GROUP BY source
       ORDER BY count DESC`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    console.error('[DB] Error getting lead lists:', err);
    throw err;
  } finally {
    client.release();
  }
}

// --- CAMPAIGN FUNCTIONS ---

export async function saveCampaign(userId, campaignData) {
  const client = await pool.connect();
  try {
    const { id, name, status, steps, settings } = campaignData;
    await client.query(
      `INSERT INTO campaigns (id, user_id, name, status, steps, settings, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         name = $3,
         status = $4,
         steps = $5,
         settings = $6,
         updated_at = NOW()`,
      [id, userId, name, status, JSON.stringify(steps), JSON.stringify(settings)]
    );
    console.log(`[DB] Saved campaign: ${name} (${id})`);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error saving campaign:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function addLeadsToCampaign(userId, campaignId, leadIds) {
  const client = await pool.connect();
  try {
    let addedCount = 0;
    for (const leadId of leadIds) {
      // Check if lead exists first
      const leadCheck = await client.query('SELECT 1 FROM leads WHERE id = $1', [leadId]);
      if (leadCheck.rowCount === 0) continue;

      const id = `${campaignId}_${leadId}`;
      await client.query(
        `INSERT INTO campaign_leads (id, campaign_id, lead_id, user_id, status, current_step, next_action_at, updated_at)
         VALUES ($1, $2, $3, $4, 'pending', 0, NOW(), NOW())
         ON CONFLICT (campaign_id, lead_id) DO NOTHING`, // Don't reset if already added
        [id, campaignId, leadId, userId]
      );
      addedCount++;
    }
    console.log(`[DB] Added ${addedCount} leads to campaign ${campaignId}`);
    return { success: true, count: addedCount };
  } catch (err) {
    console.error('[DB] Error adding leads to campaign:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getPendingCampaignActions(userId) {
  const client = await pool.connect();
  try {
    // Join campaign_leads with campaigns to get the steps
    // Join with leads to get profile info
    const result = await client.query(
      `SELECT 
         cl.*,
         c.steps,
         l.profile_url,
         l.name as lead_name
       FROM campaign_leads cl
       JOIN campaigns c ON cl.campaign_id = c.id
       JOIN leads l ON cl.lead_id = l.id
       WHERE cl.user_id = $1
         AND cl.status IN ('pending', 'processing')
         AND c.status = 'active'
         AND cl.next_action_at <= NOW()
       ORDER BY cl.next_action_at ASC
       LIMIT 5`, // Process 5 at a time
      [userId]
    );
    return result.rows;
  } catch (err) {
    console.error('[DB] Error getting pending actions:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function updateCampaignLeadStatus(id, updates) {
  const client = await pool.connect();
  try {
    const { status, current_step, next_action_at, historyEntry } = updates;
    
    let query = `UPDATE campaign_leads SET updated_at = NOW()`;
    const params = [id];
    let paramIndex = 2;

    if (status) {
      query += `, status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (current_step !== undefined) {
      query += `, current_step = $${paramIndex}`;
      params.push(current_step);
      paramIndex++;
    }
    if (next_action_at) {
      query += `, next_action_at = $${paramIndex}`;
      params.push(next_action_at);
      paramIndex++;
    }
    if (historyEntry) {
      query += `, history = history || $${paramIndex}::jsonb`;
      params.push(JSON.stringify([historyEntry])); // Append to array
      paramIndex++;
    }

    query += ` WHERE id = $1`;

    await client.query(query, params);
    return { success: true };
  } catch (err) {
    console.error('[DB] Error updating campaign lead:', err);
    throw err;
  } finally {
    client.release();
  }
}

export default pool;
