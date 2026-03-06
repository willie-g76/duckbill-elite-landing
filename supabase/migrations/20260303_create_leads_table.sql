create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text,
  email text,
  phone text not null,
  address text,
  city text,
  service_type text,
  urgency text,
  preferred_date text,
  preferred_time text,
  details text,
  source text not null,
  community text,
  email_sent boolean not null default false
);

-- Allow the edge function (anon key) to insert rows
alter table public.leads enable row level security;

create policy "Allow anon insert" on public.leads
  for insert
  to anon
  with check (true);

-- Allow authenticated reads (for future admin dashboard)
create policy "Allow authenticated read" on public.leads
  for select
  to authenticated
  using (true);
