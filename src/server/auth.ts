import { createRemoteJWKSet, jwtVerify, JWTPayload } from 'jose';

const SUPABASE_URL = process.env.SUPABASE_URL as string;

export async function verifySupabaseJWT(authorizationHeader?: string): Promise<JWTPayload> {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  const token = authorizationHeader.slice(7);

  if (!SUPABASE_URL) {
    throw new Error('Server misconfigured: SUPABASE_URL is missing');
  }

  const jwks = createRemoteJWKSet(new URL(`${SUPABASE_URL}/auth/v1/keys`));
  const { payload } = await jwtVerify(token, jwks, {});
  return payload;
}
