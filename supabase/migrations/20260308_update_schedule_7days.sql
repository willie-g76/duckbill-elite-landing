-- 7 days a week, 8AM-6PM, 2-hour slots, no travel buffer
UPDATE scheduler_config SET value = '{"start": "08:00", "end": "18:00"}'::jsonb, description = 'Business hours — same every day', updated_at = now() WHERE key = 'business_hours';
UPDATE scheduler_config SET value = '120'::jsonb, updated_at = now() WHERE key = 'slot_duration_minutes';
UPDATE scheduler_config SET value = '0'::jsonb, updated_at = now() WHERE key = 'travel_buffer_minutes';
UPDATE scheduler_config SET value = '0'::jsonb, updated_at = now() WHERE key = 'rush_travel_buffer_minutes';
