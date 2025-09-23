## CoolCare AC Services

This app provides professional AC repair, maintenance, and rental services. It uses:

- React + Vite for the frontend
- Vercel Serverless Functions for the backend API (see `api/` folder)
- Supabase Auth (Email/Password) for admin login
- Supabase Postgres for data storage
- Google Gemini for the chatbot (`/api/chat`)

### Setup

1. Create a Supabase project and enable Email/Password provider (Auth → Providers → Email).
   - Optional: If you don't want email confirmations, disable "Confirm email" or configure SMTP to send confirmation emails.
2. Frontend environment (.env.local):
   - `VITE_SUPABASE_URL=YOUR_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY`
3. Server environment (Vercel Project Settings → Environment Variables):
   - `SUPABASE_URL=YOUR_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY=YOUR_GEMINI_API_KEY`
   - `WHATSAPP_BUSINESS_NUMBER=919911111111` (digits only)

### Database (Supabase Postgres)
Run this SQL in Supabase SQL editor to create the `bookings` table:

```sql
create table if not exists public.bookings (
  id bigserial primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  service_type text not null check (service_type in ('repair','maintenance','rent')),
  ac_type text not null check (ac_type in ('window','split','central')),
  address text not null,
  preferred_date text not null,
  preferred_time text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- optional: update trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();
```

### Run locally
Two terminals:

1) Frontend (Vite)
```
pnpm install
pnpm run dev
```

2) Backend (Vercel Functions)
```
npx vercel dev
```
Vite is configured to proxy `/api/*` to `http://localhost:3000` in `vite.config.ts`.

Admin routes:
- Visit `/admin` to sign in with email/password
- Admin dashboard at `/admin/dashboard`
