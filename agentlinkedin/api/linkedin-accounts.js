import {
  saveLinkedInAccount,
  getLinkedInAccounts,
  deleteLinkedInAccount,
  countLinkedInAccounts,
} from '../db-supabase.js';

const SENDER_LIMIT = 5;

export default async function handler(req, res) {
  try {
    // GET /api/linkedin-accounts?userId=X — list accounts (no cookies returned)
    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ success: false, error: 'userId required' });

      const accounts = await getLinkedInAccounts(userId);
      return res.status(200).json({ success: true, data: accounts });
    }

    // POST /api/linkedin-accounts — add a new sender account
    if (req.method === 'POST') {
      const { userId, label, cookies, senderLimit } = req.body;
      if (!userId || !label || !cookies) {
        return res.status(400).json({ success: false, error: 'userId, label, and cookies are required' });
      }

      const limit = senderLimit || SENDER_LIMIT;
      const count = await countLinkedInAccounts(userId);
      if (count >= limit) {
        return res.status(403).json({
          success: false,
          error: `Sender limit reached (${count}/${limit}). Remove an account before adding a new one.`,
        });
      }

      const accountId = `account_${Date.now()}`;
      await saveLinkedInAccount(userId, { id: accountId, label, cookies });

      return res.status(201).json({ success: true, accountId, label });
    }

    // DELETE /api/linkedin-accounts/:id — remove an account
    if (req.method === 'DELETE') {
      const id = req.params?.id || req.body?.accountId;
      if (!id) return res.status(400).json({ success: false, error: 'accountId required' });

      await deleteLinkedInAccount(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[LinkedIn Accounts API] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
