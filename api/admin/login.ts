import { setAdminSession } from '../../src/server/adminSession';
import { setCorsHeaders, handleOptions, parseJsonBody } from '../../src/server/http';
import { applyRateLimit } from '../../src/server/rateLimit';

export default async function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const raw = parseJsonBody(req);
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const max = Number(process.env.RATE_LIMIT_MAX || '60');
    if (!applyRateLimit(req, res, { windowMs, max, key: 'admin:login:post' })) return;
    const { id, password } = raw || {};

    const ADMIN_ID = process.env.ADMIN_ID;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_ID || !ADMIN_PASSWORD) {
      res.status(500).json({ error: 'Server not configured (ADMIN_ID/ADMIN_PASSWORD missing)' });
      return;
    }

    if (id !== ADMIN_ID || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    setAdminSession(res);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
}
