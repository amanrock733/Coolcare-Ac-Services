import z from 'zod';
import { CreateBookingSchema, BookingStatus } from '../src/shared/types';
import { supabaseAdmin } from '../src/server/supabaseAdmin';
import { setCorsHeaders, handleOptions, parseJsonBody } from '../src/server/http';
import { applyRateLimit } from '../src/server/rateLimit';

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
    if (!applyRateLimit(req, res, { windowMs, max, key: 'bookings:post' })) return;

    const bookingData = CreateBookingSchema.parse(raw);

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        customer_name: bookingData.customer_name,
        customer_phone: bookingData.customer_phone,
        customer_email: bookingData.customer_email || null,
        service_type: bookingData.service_type,
        ac_type: bookingData.ac_type,
        address: bookingData.address,
        preferred_date: bookingData.preferred_date,
        preferred_time: bookingData.preferred_time,
        notes: bookingData.notes || null,
        status: BookingStatus.PENDING,
      })
      .select('id')
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      bookingId: data?.id,
      message: 'Booking submitted successfully!',
    });
  } catch (err: any) {
    console.error('Booking creation error:', err);
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input' });
      return;
    }
    res.status(500).json({ error: 'Failed to create booking' });
  }
}
