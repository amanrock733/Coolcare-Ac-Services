export function getAllowedOrigins(): string[] {
  const env = process.env.ALLOWED_ORIGINS || '';
  return env
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function setCorsHeaders(req: any, res: any) {
  const origin = req.headers?.origin;
  const allowed = getAllowedOrigins();

  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!allowed.length && process.env.NODE_ENV !== 'production') {
    // In dev, if ALLOWED_ORIGINS is not set, allow any for convenience
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function isPreflight(req: any) {
  return req.method === 'OPTIONS';
}

export function handleOptions(req: any, res: any) {
  if (isPreflight(req)) {
    setCorsHeaders(req, res);
    res.status(204).end();
    return true;
  }
  return false;
}

export function parseJsonBody<T = any>(req: any): T {
  const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || '{}');
  try {
    return typeof req.body === 'string' ? JSON.parse(raw) : (req.body as T);
  } catch {
    // Some runtimes put the raw body on req.rawBody
    try {
      if (req.rawBody && typeof req.rawBody === 'string') return JSON.parse(req.rawBody);
    } catch {}
    return {} as T;
  }
}
