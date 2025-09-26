import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAdminCookie } from '@/server/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  clearAdminCookie(res);
  return res.status(200).json({ ok: true });
}
