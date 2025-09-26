import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message } = (req.body || {}) as { message?: string };
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // Simple echo stub; replace with real LLM or workflow later
  return res.status(200).json({ reply: `You said: ${message}` });
}
