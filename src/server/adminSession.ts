import crypto from 'node:crypto';

const COOKIE_NAME = 'admin_session';

function base64url(input: string | Buffer): string {
  const buf: Buffer = typeof input === 'string' ? Buffer.from(input, 'utf8') : (input as Buffer);
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export function buildAdminSessionCookie(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'change-me';
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 24 * 2; // 2 days
  const payload = { iat: now, exp };
  const payloadB64 = base64url(JSON.stringify(payload));
  const sig = sign(payloadB64, secret);
  return `${COOKIE_NAME}=${payloadB64}.${sig}; Path=/; HttpOnly; SameSite=Lax${isProd() ? '; Secure' : ''}; Max-Age=${60 * 60 * 24 * 2}`;
}

export function buildClearAdminSessionCookie(): string {
  return `${COOKIE_NAME}=deleted; Path=/; HttpOnly; SameSite=Lax${isProd() ? '; Secure' : ''}; Max-Age=0`;
}

function sign(payloadB64: string, secret: string) {
  return base64url(crypto.createHmac('sha256', secret).update(payloadB64).digest());
}

function isProd() {
  return process.env.NODE_ENV === 'production';
}

// Decode base64url (RFC 4648 §5) back to a string
function base64urlDecode(input: string): string {
  const padLen = input.length % 4;
  const padded = input + (padLen === 2 ? '==' : padLen === 3 ? '=' : padLen === 1 ? '===' : '');
  const b64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64').toString();
}

export function setAdminSession(res: any) {
  const cookie = buildAdminSessionCookie();
  res.setHeader('Set-Cookie', cookie);
}

export function clearAdminSession(res: any) {
  const cookie = buildClearAdminSessionCookie();
  res.setHeader('Set-Cookie', cookie);
}

export function verifyAdminSession(req: any): boolean {
  try {
    const cookieHeader = req.headers?.cookie || '';
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c: string) => {
        const [k, ...rest] = c.trim().split('=');
        return [k, rest.join('=')];
      })
    );
    const token = cookies[COOKIE_NAME];
    if (!token) return false;
    const [payloadB64, sig] = token.split('.');
    if (!payloadB64 || !sig) return false;
    const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'change-me';
    const expected = sign(payloadB64, secret);
    if (sig.length !== expected.length) return false;
    const a = new Uint8Array(Buffer.from(sig, 'utf8'));
    const b = new Uint8Array(Buffer.from(expected, 'utf8'));
    if (!crypto.timingSafeEqual(a, b)) return false;
    const payload = JSON.parse(base64urlDecode(payloadB64));
    if (!payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return now < payload.exp;
  } catch {
    return false;
  }
}
