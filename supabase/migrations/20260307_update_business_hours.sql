-- Update business hours: Mon-Fri 8AM-6PM, Saturday 9AM-4PM
UPDATE scheduler_config
SET value = '{"weekday": {"start": "08:00", "end": "18:00"}, "saturday": {"start": "09:00", "end": "16:00"}}'::jsonb,
    description = 'Business hours (Mountain Time). Weekday = Mon-Fri, Saturday separate.',
    updated_at = now()
WHERE key = 'business_hours';
