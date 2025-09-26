import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/server/supabaseAdmin';
import { verifyAdminRequest } from '@/server/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const admin = await verifyAdminRequest(req, res);
  if (!admin) return; // verifyAdminRequest already responded 401

  try {
    const { search = '', status = '', date_from = '', date_to = '' } = req.query as Record<string, string>;

    let query = supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (date_from) {
      query = query.gte('preferred_date', date_from);
    }
    if (date_to) {
      query = query.lte('preferred_date', date_to);
    }

    if (search) {
      // Search by name/phone/email as a simple ilike OR
      const s = `%${search}%`;
      query = query.or(
        `customer_name.ilike.${s},customer_phone.ilike.${s},customer_email.ilike.${s}`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error('[api/admin/bookings] fetch error', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    return res.status(200).json({ bookings: data || [] });
  } catch (err) {
    console.error('[api/admin/bookings] unexpected', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
