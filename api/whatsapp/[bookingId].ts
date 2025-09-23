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
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const max = Number(process.env.RATE_LIMIT_MAX || '60');
    if (!applyRateLimit(req, res, { windowMs, max, key: 'whatsapp:get' })) return;
    const { bookingId } = req.query || {};
    if (!bookingId) {
      res.status(400).json({ error: 'bookingId is required' });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', Number(bookingId))
      .single();

    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const number = (process.env.WHATSAPP_BUSINESS_NUMBER || '').replace(/\D/g, '');
    if (!number) {
      res.status(500).json({ error: 'Server not configured (WHATSAPP_BUSINESS_NUMBER missing)' });
      return;
    }

    const message = `Hello! I've booked ${data.service_type} service for my ${data.ac_type} AC unit.\n\nDetails:\n📅 Date: ${data.preferred_date}\n⏰ Time: ${data.preferred_time}\n📍 Address: ${data.address}\n👤 Name: ${data.customer_name}\n📞 Phone: ${data.customer_phone}${data.notes ? `\n\n📝 Notes: ${data.notes}` : ''}\n\nBooking ID: #${data.id}\n\nPlease confirm this appointment. Thank you!`;

    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    res.status(200).json({ whatsappUrl });
  } catch (err) {
    console.error('WhatsApp URL generation error:', err);
    res.status(500).json({ error: 'Failed to generate WhatsApp link' });
  }
}
