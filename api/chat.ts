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
    const { message } = raw || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || '60000');
    const max = Number(process.env.RATE_LIMIT_MAX || '60');
    if (!applyRateLimit(req, res, { windowMs, max, key: 'chat:post' })) return;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server is not configured (GEMINI_API_KEY missing)' });
      return;
    }

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are CoolCare's helpful AC service assistant. You help customers with:\n- AC repair questions and troubleshooting\n- Maintenance tips and scheduling\n- AC rental options and pricing\n- General AC-related inquiries\n\nKeep responses helpful, professional, and concise. If customers need to book a service, direct them to use the booking form on the website. Our services include:\n- Repair: Fix broken AC units\n- Maintenance: Regular servicing and cleaning\n- Rent: Short-term and long-term AC rentals\n\nWe service window, split, and central AC systems.\n\nUser: ${message}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    } as const;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('Gemini API error:', resp.status, txt);
      res.status(500).json({ reply: "I'm experiencing technical difficulties. Please try again later." });
      return;
    }

    const data: any = await resp.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't process your message. Please try again.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: "I'm experiencing technical difficulties. Please try again later." });
  }
}
