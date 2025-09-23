type RateLimitOptions = {
  windowMs: number; // in ms
  max: number; // max requests per window
  key: string; // route key
};

// In-memory store (best-effort for serverless; resets on cold start)
const buckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: any): string {
  const xf = (req.headers?.['x-forwarded-for'] || req.headers?.['X-Forwarded-For'] || '') as string;
  const first = xf.split(',')[0].trim();
  return first || (req.socket?.remoteAddress || 'unknown');
}

export function applyRateLimit(req: any, res: any, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const ip = getClientIp(req);
  const key = `${opts.key}:${ip}`;
  const cur = buckets.get(key);
  let bucket = cur;

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + opts.windowMs };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(0, opts.max - bucket.count);
  const resetSeconds = Math.ceil(bucket.resetAt / 1000);
  res.setHeader('X-RateLimit-Limit', String(opts.max));
  res.setHeader('X-RateLimit-Remaining', String(remaining));
  res.setHeader('X-RateLimit-Reset', String(resetSeconds));

  if (bucket.count > opts.max) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    res.setHeader('Retry-After', String(retryAfter));
    res.status(429).json({ error: 'Too many requests, please try again later.' });
    return false;
  }

  return true;
}
