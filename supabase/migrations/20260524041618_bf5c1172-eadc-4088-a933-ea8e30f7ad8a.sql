
-- Claims table per user
CREATE TABLE public.claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  insurer TEXT,
  claim_type TEXT NOT NULL DEFAULT 'self',
  stage TEXT NOT NULL DEFAULT 'submitted',
  remarks TEXT,
  file_path TEXT,
  file_name TEXT,
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own claims" ON public.claims FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own claims" ON public.claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own claims" ON public.claims FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own claims" ON public.claims FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_claims_user_id ON public.claims(user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for claim receipts (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('claim-receipts', 'claim-receipts', false);

CREATE POLICY "Users view own receipts" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'claim-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own receipts" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'claim-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own receipts" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'claim-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
