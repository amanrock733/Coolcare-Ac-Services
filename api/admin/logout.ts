import { clearAdminSession } from '../../src/server/adminSession';
import { setCorsHeaders, handleOptions } from '../../src/server/http';
import { applyRateLimit } from '../../src/server/rateLimit';

export default async function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const max = Number(process.env.RATE_LIMIT_MAX || '60');
    if (!applyRateLimit(req, res, { windowMs, max, key: 'admin:logout:post' })) return;
    clearAdminSession(res);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Admin logout error:', err);
    res.status(500).json({ error: 'Failed to logout' });
  }
}
