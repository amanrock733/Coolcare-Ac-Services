import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { NextApiRequest, NextApiResponse } from 'next';

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'admin_token';
// Support legacy env var ADMIN_SESSION_SECRET too
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_SESSION_SECRET || 'dev-admin-secret-change-this';
const secret = new TextEncoder().encode(ADMIN_JWT_SECRET);

export async function signAdminJWT(payload: JWTPayload = {}) {
  return await new SignJWT({ role: 'admin', ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export function setAdminCookie(res: NextApiResponse, token: string) {
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${60 * 60 * 24 * 7}`;
  res.setHeader('Set-Cookie', cookie);
}

export function clearAdminCookie(res: NextApiResponse) {
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
  const cookie = `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=0`;
  res.setHeader('Set-Cookie', cookie);
}

export async function verifyAdminRequest(req: NextApiRequest, res: NextApiResponse) {
  const token = (req.cookies && (req.cookies as any)[COOKIE_NAME]) || '';
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secret);
    if ((payload as any).role !== 'admin') throw new Error('invalid role');
    return payload;
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
}
