ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'scheduled';

-- Allowed values: 'scheduled', 'attended', 'cancelled', 'rescheduled'
ALTER TABLE public.appointments
DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments
ADD CONSTRAINT appointments_status_check
CHECK (status IN ('scheduled', 'attended', 'cancelled', 'rescheduled'));