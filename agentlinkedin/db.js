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
          lead.status,
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

// Get all leads for a user
export async function getLeads(userId, filters = {}) {
  const client = await pool.connect();
  try {
    let query = 'SELECT * FROM leads WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters.source) {
      query += ` AND source = $${paramIndex}`;
      params.push(filters.source);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

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

export default pool;
