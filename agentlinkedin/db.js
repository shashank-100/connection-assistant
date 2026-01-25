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

export default pool;
