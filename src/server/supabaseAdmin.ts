import { createClient } from '@supabase/supabase-js';

// Prefer server-only SUPABASE_URL, but fall back to NEXT_PUBLIC_SUPABASE_URL for local dev
const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) as string;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!process.env.SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('[supabaseAdmin] Using NEXT_PUBLIC_SUPABASE_URL as fallback for SUPABASE_URL (set SUPABASE_URL for production).');
} else if (!SUPABASE_URL) {
  console.warn('SUPABASE_URL is not set. Set it in your Vercel Environment Variables.');
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Set it in your Vercel Environment Variables.');
}

export const supabaseAdmin = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: { persistSession: false },
});

export default supabaseAdmin;
