
-- SPECIALTIES
CREATE TABLE public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view specialties"
  ON public.specialties FOR SELECT
  TO authenticated
  USING (true);

-- DOCTORS
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Dr.',
  specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE RESTRICT,
  years_experience INTEGER NOT NULL DEFAULT 0,
  bio TEXT,
  avatar_url TEXT,
  languages TEXT[] NOT NULL DEFAULT ARRAY['English'],
  clinic_location TEXT,
  accepting_new_patients BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view doctors"
  ON public.doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_doctors_specialty ON public.doctors(specialty_id);

-- CONDITIONS
CREATE TABLE public.conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  primary_specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE RESTRICT,
  secondary_specialty_id UUID REFERENCES public.specialties(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view conditions"
  ON public.conditions FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_conditions_primary_specialty ON public.conditions(primary_specialty_id);

-- SEED SPECIALTIES
INSERT INTO public.specialties (slug, name, description) VALUES
  ('vascular-surgeon', 'Vascular Surgeon', 'Specialist in arteries, veins and lymphatic system — surgical and minimally invasive treatment of vascular disease.'),
  ('cardiologist', 'Cardiologist', 'Heart and coronary artery specialist — diagnosis and management of cardiovascular disease.'),
  ('haematologist', 'Haematologist', 'Blood disorder specialist — clotting, anticoagulation and thrombotic conditions.'),
  ('endocrinologist', 'Endocrinologist', 'Hormone and metabolic specialist — diabetes and related vascular complications.'),
  ('nephrologist', 'Nephrologist', 'Kidney specialist — chronic kidney disease and vascular access management.');

-- SEED DOCTORS (2-3 per specialty)
INSERT INTO public.doctors (full_name, title, specialty_id, years_experience, bio, languages, clinic_location, accepting_new_patients)
SELECT * FROM (VALUES
  -- Vascular Surgeons
  ('Amelia Tan', 'Dr.', (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'), 18, 'Consultant vascular surgeon with a focus on peripheral artery disease and limb salvage.', ARRAY['English','Mandarin'], 'Orchard Medical Suites', true),
  ('Rajesh Kumar', 'Dr.', (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'), 22, 'Senior vascular surgeon specialising in venous insufficiency, varicose veins and endovenous procedures.', ARRAY['English','Tamil','Hindi'], 'Novena Specialist Centre', true),
  ('Sophie Lim', 'Dr.', (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'), 12, 'Vascular surgeon with subspecialty interest in deep vein thrombosis and post-thrombotic syndrome.', ARRAY['English','Mandarin'], 'Mount Elizabeth Clinic', true),

  -- Cardiologists
  ('Marcus Chen', 'Dr.', (SELECT id FROM public.specialties WHERE slug='cardiologist'), 20, 'Interventional cardiologist specialising in coronary artery disease and complex angioplasty.', ARRAY['English','Mandarin','Cantonese'], 'Heart Centre @ Paragon', true),
  ('Priya Nair', 'Dr.', (SELECT id FROM public.specialties WHERE slug='cardiologist'), 15, 'General and preventive cardiologist with expertise in hypertension and lipid management.', ARRAY['English','Malayalam'], 'Gleneagles Medical Centre', true),

  -- Haematologists
  ('Daniel Wong', 'Dr.', (SELECT id FROM public.specialties WHERE slug='haematologist'), 17, 'Consultant haematologist managing thrombosis, anticoagulation and clotting disorders.', ARRAY['English','Mandarin'], 'Camden Medical Centre', true),
  ('Aisha Rahman', 'Dr.', (SELECT id FROM public.specialties WHERE slug='haematologist'), 11, 'Haematologist with a focus on venous thromboembolism and long-term DVT care.', ARRAY['English','Malay'], 'Farrer Park Hospital', true),

  -- Endocrinologists
  ('Hannah Goh', 'Dr.', (SELECT id FROM public.specialties WHERE slug='endocrinologist'), 14, 'Endocrinologist specialising in type 2 diabetes and vascular complication prevention.', ARRAY['English','Mandarin'], 'Mount Alvernia Clinic', true),
  ('Vikram Shah', 'Dr.', (SELECT id FROM public.specialties WHERE slug='endocrinologist'), 19, 'Senior endocrinologist with expertise in diabetic foot, neuropathy and metabolic syndrome.', ARRAY['English','Hindi','Gujarati'], 'Novena Specialist Centre', true),
  ('Charlotte Yeo', 'Dr.', (SELECT id FROM public.specialties WHERE slug='endocrinologist'), 9, 'Endocrinologist focused on continuous glucose monitoring and lifestyle-based diabetes care.', ARRAY['English'], 'Raffles Medical', true),

  -- Nephrologists
  ('Edward Sim', 'Dr.', (SELECT id FROM public.specialties WHERE slug='nephrologist'), 21, 'Consultant nephrologist with expertise in chronic kidney disease and vascular access for dialysis.', ARRAY['English','Mandarin','Hokkien'], 'Mount Elizabeth Novena', true),
  ('Nadia Karim', 'Dr.', (SELECT id FROM public.specialties WHERE slug='nephrologist'), 13, 'Nephrologist focused on hypertension-related kidney damage and CKD progression.', ARRAY['English','Malay'], 'Parkway East Clinic', true)
) AS d(full_name, title, specialty_id, years_experience, bio, languages, clinic_location, accepting_new_patients);

-- SEED CONDITIONS (10 vascular)
INSERT INTO public.conditions (slug, name, category, primary_specialty_id, secondary_specialty_id) VALUES
  ('atherosclerosis', 'Atherosclerosis', 'arterial',
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'),
    (SELECT id FROM public.specialties WHERE slug='cardiologist')),
  ('coronary-artery-disease', 'Coronary Artery Disease', 'arterial',
    (SELECT id FROM public.specialties WHERE slug='cardiologist'), NULL),
  ('peripheral-artery-disease', 'Peripheral Artery Disease', 'arterial',
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'), NULL),
  ('chronic-venous-insufficiency', 'Chronic Venous Insufficiency', 'venous',
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'), NULL),
  ('varicose-veins', 'Varicose Veins', 'venous',
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'), NULL),
  ('deep-vein-thrombosis', 'Deep Vein Thrombosis', 'clot',
    (SELECT id FROM public.specialties WHERE slug='haematologist'),
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon')),
  ('post-thrombotic-syndrome', 'Post-thrombotic Syndrome', 'clot',
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'), NULL),
  ('diabetes-vascular', 'Diabetes-related Vascular Disease', 'systemic-vascular',
    (SELECT id FROM public.specialties WHERE slug='endocrinologist'),
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon')),
  ('hypertension-vascular', 'Hypertension-related Vessel Damage', 'systemic-vascular',
    (SELECT id FROM public.specialties WHERE slug='cardiologist'),
    (SELECT id FROM public.specialties WHERE slug='nephrologist')),
  ('chronic-kidney-disease', 'Chronic Kidney Disease (Vascular)', 'systemic-vascular',
    (SELECT id FROM public.specialties WHERE slug='nephrologist'),
    (SELECT id FROM public.specialties WHERE slug='vascular-surgeon'));
