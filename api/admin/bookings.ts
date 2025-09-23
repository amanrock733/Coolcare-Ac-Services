import { verifyAdminSession } from '../../src/server/adminSession';
import { supabaseAdmin } from '../../src/server/supabaseAdmin';
import { setCorsHeaders, handleOptions } from '../../src/server/http';
import { applyRateLimit } from '../../src/server/rateLimit';

export default async function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const ok = verifyAdminSession(req);
    if (!ok) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const max = Number(process.env.RATE_LIMIT_MAX || '60');
    if (!applyRateLimit(req, res, { windowMs, max, key: 'admin:bookings:get' })) return;

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ bookings: data || [] });
  } catch (err: any) {
    if (err?.message === 'Unauthorized') {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    console.error('Fetch bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}
