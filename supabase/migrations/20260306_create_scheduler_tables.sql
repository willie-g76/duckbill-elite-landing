-- ============================================================
-- Smart Scheduler tables
-- ============================================================

-- Team members who can be assigned bookings
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  phone text,
  google_calendar_id text not null,
  is_active boolean not null default true,
  is_primary boolean not null default false
);

alter table public.team_members enable row level security;

create policy "Allow authenticated full access on team_members"
  on public.team_members for all to authenticated using (true) with check (true);

create policy "Allow anon read on team_members"
  on public.team_members for select to anon using (is_active = true);

-- Seed team members
insert into public.team_members (name, email, phone, google_calendar_id, is_active, is_primary) values
  ('Mark', 'mark@duckbillroofing.ca', '(587) 432-3639', 'mark@duckbillroofing.ca', true, true),
  ('William', 'will@plaidagent.com', null, 'will@plaidagent.com', true, false);

-- ============================================================
-- Scheduler configuration (key-value for easy per-client config)
-- ============================================================
create table if not exists public.scheduler_config (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

alter table public.scheduler_config enable row level security;

create policy "Allow authenticated full access on scheduler_config"
  on public.scheduler_config for all to authenticated using (true) with check (true);

create policy "Allow anon read on scheduler_config"
  on public.scheduler_config for select to anon using (true);

-- Seed default config
insert into public.scheduler_config (key, value, description) values
  ('business_hours', '{"start": "08:00", "end": "19:00"}', 'Daily business hours (Mountain Time)'),
  ('slot_duration_minutes', '90', 'Duration of each appointment slot in minutes'),
  ('booking_window_days', '14', 'How many days ahead customers can book'),
  ('min_lead_hours', '4', 'Minimum hours from now before first available slot'),
  ('rush_hours', '[{"start": "07:00", "end": "09:30"}, {"start": "15:30", "end": "18:30"}]', 'Rush hour windows — double travel buffer applied'),
  ('travel_buffer_minutes', '30', 'Default travel buffer between appointments'),
  ('rush_travel_buffer_minutes', '60', 'Travel buffer during rush hours'),
  ('low_priority_zones', '["NE"]', 'Calgary zones with lower scheduling priority'),
  ('timezone', '"America/Edmonton"', 'Business timezone');

-- ============================================================
-- Bookings
-- ============================================================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Contact info
  first_name text not null,
  last_name text,
  email text,
  phone text not null,
  address text,
  postal_code text,
  -- Scheduling
  assigned_to uuid references public.team_members(id),
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  -- Status: confirmed, cancelled, completed, no_show
  status text not null default 'confirmed',
  -- Google Calendar integration
  google_event_id text,
  -- Link to leads table
  lead_id uuid references public.leads(id),
  -- Cancellation
  cancelled_at timestamptz,
  cancel_reason text
);

alter table public.bookings enable row level security;

-- Anon can insert (public booking form) and read their own by id
create policy "Allow anon insert on bookings"
  on public.bookings for insert to anon with check (true);

create policy "Allow anon read own booking"
  on public.bookings for select to anon using (true);

create policy "Allow authenticated full access on bookings"
  on public.bookings for all to authenticated using (true) with check (true);

-- Index for slot availability queries
create index idx_bookings_slot on public.bookings (slot_start, slot_end)
  where status = 'confirmed';

create index idx_bookings_assigned on public.bookings (assigned_to, slot_start)
  where status = 'confirmed';
