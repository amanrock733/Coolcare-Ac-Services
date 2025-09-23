import type { NextRequest } from 'next/server';

export function getAllowedOrigins(): string[] {
  const env = process.env.ALLOWED_ORIGINS || '';
  return env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildCorsHeaders(req: NextRequest): HeadersInit {
  const origin = req.headers.get('origin') || '';
  const allowed = getAllowedOrigins();
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (origin && allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else if (!allowed.length && process.env.NODE_ENV !== 'production') {
    headers['Access-Control-Allow-Origin'] = origin || '*';
    headers['Vary'] = 'Origin';
    headers['Access-Control-Allow-Credentials'] = 'true';
  }
  return headers;
}
