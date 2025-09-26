import type { NextApiRequest, NextApiResponse } from 'next';
import { signAdminJWT, setAdminCookie } from '@/server/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { id, password } = req.body || {};
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || process.env.ADMIN_ID || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  if (!id || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  if (id !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = await signAdminJWT({ sub: id });
  setAdminCookie(res, token);
  return res.status(200).json({ ok: true });
}
