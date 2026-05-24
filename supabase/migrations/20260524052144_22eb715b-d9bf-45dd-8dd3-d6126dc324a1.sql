
-- Daily check-ins for chronic care tracking
CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meds_taken BOOLEAN,
  missed_doses BOOLEAN,
  feeling TEXT, -- 'good' | 'okay' | 'unwell'
  energy_level INTEGER, -- 1-10 optional
  measurements JSONB NOT NULL DEFAULT '{}'::jsonb, -- {bp_systolic, bp_diastolic, heart_rate, glucose, weight_kg, spo2, peak_flow}
  symptoms JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of symptom keys
  follow_up JSONB NOT NULL DEFAULT '{}'::jsonb, -- conditional answers
  lifestyle JSONB NOT NULL DEFAULT '{}'::jsonb, -- {exercise, sleep, smoking, diet}
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_check_ins_user_date ON public.check_ins(user_id, check_in_date DESC);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own check-ins" ON public.check_ins
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own check-ins" ON public.check_ins
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own check-ins" ON public.check_ins
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own check-ins" ON public.check_ins
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_check_ins_updated_at
  BEFORE UPDATE ON public.check_ins
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
