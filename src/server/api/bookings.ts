import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/server/supabaseAdmin';
import { CreateBookingSchema } from '@/shared/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const parse = CreateBookingSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
    }

    const payload = parse.data;
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email || null,
        service_type: payload.service_type,
        ac_type: payload.ac_type,
        address: payload.address,
        preferred_date: payload.preferred_date,
        preferred_time: payload.preferred_time,
        notes: payload.notes || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[api/bookings] insert error', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }

    return res.status(200).json({ bookingId: data.id });
  } catch (err) {
    console.error('[api/bookings] unexpected', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
