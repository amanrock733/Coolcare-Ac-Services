import z from 'zod';
import { UpdateBookingStatusSchema } from '../../../src/shared/types';
import { verifyAdminSession } from '../../../src/server/adminSession';
import { supabaseAdmin } from '../../../src/server/supabaseAdmin';
import { setCorsHeaders, handleOptions, parseJsonBody } from '../../../src/server/http';
import { applyRateLimit } from '../../../src/server/rateLimit';

export default async function handler(req: any, res: any) {
  if (handleOptions(req, res)) return;
  setCorsHeaders(req, res);
  if (req.method !== 'PUT') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const ok = verifyAdminSession(req);
    if (!ok) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const raw = parseJsonBody(req);
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const max = Number(process.env.RATE_LIMIT_MAX || '60');
    if (!applyRateLimit(req, res, { windowMs, max, key: 'admin:bookings:status:put' })) return;
    const { id, status } = UpdateBookingStatusSchema.parse(raw);

    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err: any) {
    if (err?.message === 'Unauthorized') {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input' });
      return;
    }
    console.error('Update booking status error:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
}
