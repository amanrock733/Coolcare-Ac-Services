import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/server/supabaseAdmin';
import { verifyAdminRequest } from '@/server/adminAuth';
import { UpdateBookingStatusSchema } from '@/shared/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const admin = await verifyAdminRequest(req, res);
  if (!admin) return;

  try {
    const parse = UpdateBookingStatusSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
    }

    const { id, status } = parse.data;
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('[api/admin/bookings/status] update error', error);
      return res.status(500).json({ error: 'Failed to update status' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/admin/bookings/status] unexpected', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
