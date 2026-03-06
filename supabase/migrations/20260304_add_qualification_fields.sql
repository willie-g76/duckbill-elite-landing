-- Add qualification fields for sales reps
alter table public.leads
  add column if not exists street_address text,
  add column if not exists postal_code text,
  add column if not exists province text default 'AB',
  add column if not exists roof_type text,
  add column if not exists roof_type_other text,
  add column if not exists project_type text,
  add column if not exists project_type_other text,
  add column if not exists qualified_at timestamptz,
  add column if not exists qualified_by text;
