import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { bookingId } = req.query as { bookingId?: string };
  if (!bookingId) return res.status(400).json({ error: 'Missing bookingId' });

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Stub: integrate WhatsApp API provider here
  return res.status(200).json({ ok: true, bookingId });
}
