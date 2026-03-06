-- Fix: anon SELECT policy on bookings was too permissive (using(true) exposed all PII)
-- The edge functions use the service_role key which bypasses RLS, so anon doesn't need SELECT at all.
drop policy if exists "Allow anon read own booking" on public.bookings;
