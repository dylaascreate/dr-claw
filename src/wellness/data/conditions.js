// Chronic disease catalog grouped into 4 vascular families + a general bucket.
// Categories: 'arterial' | 'venous' | 'clot' | 'systemic-vascular' | 'other'

export const CATEGORIES = [
  {
    id: 'arterial',
    label: 'Arterial Diseases',
    blurb: 'Arteries get narrowed, hardened, or blocked.',
  },
  {
    id: 'venous',
    label: 'Venous Diseases',
    blurb: 'Veins struggle to return blood back to the heart.',
  },
  {
    id: 'clot',
    label: 'Clot-Related Conditions',
    blurb: 'Blood clots or long-term clot damage in vessels.',
  },
  {
    id: 'systemic-vascular',
    label: 'Systemic Vascular Damage',
    blurb: 'Whole-body vessel damage from chronic disease.',
  },
  {
    id: 'other',
    label: 'Other Common Chronic Diseases',
    blurb: 'Long-term conditions beyond the vascular system.',
  },
];

export const CONDITIONS = [
  // ── Arterial ───────────────────────────────────────────────────────────────
  {
    slug: 'atherosclerosis',
    category: 'arterial',
    name: 'Atherosclerosis',
    tagline: 'Plaque build-up that hardens and narrows arteries.',
    desc: 'Plaque build-up that narrows arteries and restricts blood flow.',
    img: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Vascular Specialist',
    definition:
      'Atherosclerosis is the gradual build-up of cholesterol, fat, and other substances (plaque) inside artery walls. Over time it stiffens and narrows the arteries, reducing blood flow to vital organs.',
    symptoms: [
      'Often silent in early stages',
      'Chest pain or pressure when active',
      'Leg pain or cramping with walking',
      'Shortness of breath or fatigue',
    ],
    causes: [
      'High LDL cholesterol and triglycerides',
      'High blood pressure',
      'Smoking and diabetes',
      'Family history and ageing',
    ],
    management: [
      'Statins and blood pressure control',
      'Heart-healthy diet (DASH / Mediterranean)',
      'Regular aerobic exercise',
      'Smoking cessation and weight control',
    ],
  },
  {
    slug: 'coronary-artery-disease',
    category: 'arterial',
    name: 'Coronary Artery Disease',
    tagline: 'Narrowed heart arteries reducing blood to the heart muscle.',
    desc: 'Reduced blood flow to the heart muscle from narrowed coronary arteries.',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Cardiologist',
    definition:
      'Coronary artery disease (CAD) occurs when the arteries supplying the heart become narrowed by plaque, reducing oxygen-rich blood to the heart muscle. It is the leading cause of heart attacks worldwide.',
    symptoms: [
      'Chest pain or tightness (angina)',
      'Shortness of breath',
      'Palpitations or irregular heartbeat',
      'Fatigue with exertion',
    ],
    causes: [
      'Atherosclerosis of coronary arteries',
      'High blood pressure and cholesterol',
      'Diabetes and obesity',
      'Smoking and chronic stress',
    ],
    management: [
      'Antiplatelets, statins, beta-blockers',
      'Cardiac rehabilitation programs',
      'Lifestyle changes: diet, exercise, no smoking',
      'Angioplasty or bypass surgery if severe',
    ],
  },
  {
    slug: 'peripheral-artery-disease',
    category: 'arterial',
    name: 'Peripheral Artery Disease',
    tagline: 'Narrowed arteries reducing blood flow to the limbs.',
    desc: 'Reduced circulation to the legs and arms from narrowed arteries.',
    img: 'https://images.unsplash.com/photo-1599045118108-bf9954418b76?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Vascular Surgeon',
    definition:
      'Peripheral artery disease (PAD) is narrowing of arteries that carry blood to the limbs, most often the legs. It causes pain, reduced mobility, and raises the risk of heart attack and stroke.',
    symptoms: [
      'Leg cramping while walking (claudication)',
      'Numbness or weakness in the legs',
      'Cold lower leg or foot',
      'Slow-healing wounds on toes or feet',
    ],
    causes: [
      'Atherosclerosis (main cause)',
      'Smoking and diabetes',
      'High blood pressure and cholesterol',
      'Age over 60 and family history',
    ],
    management: [
      'Supervised walking and exercise therapy',
      'Antiplatelets and cholesterol-lowering drugs',
      'Strict smoking cessation',
      'Angioplasty or bypass when symptoms are severe',
    ],
  },

  // ── Venous ─────────────────────────────────────────────────────────────────
  {
    slug: 'chronic-venous-insufficiency',
    category: 'venous',
    name: 'Chronic Venous Insufficiency',
    tagline: 'Leg veins fail to return blood back to the heart efficiently.',
    desc: 'Poor return of blood from the legs, causing swelling and skin changes.',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Vascular Specialist',
    definition:
      'Chronic venous insufficiency (CVI) occurs when leg vein valves are damaged, causing blood to pool in the legs. It leads to swelling, skin changes, and in severe cases venous ulcers.',
    symptoms: [
      'Swelling in ankles and lower legs',
      'Aching, heaviness, or cramping',
      'Skin discoloration around the ankles',
      'Slow-healing venous ulcers',
    ],
    causes: [
      'Damaged or weakened vein valves',
      'Previous deep vein thrombosis',
      'Prolonged standing or sitting',
      'Obesity, pregnancy, and ageing',
    ],
    management: [
      'Graduated compression stockings',
      'Leg elevation and regular walking',
      'Weight management',
      'Sclerotherapy or vein ablation when needed',
    ],
  },
  {
    slug: 'varicose-veins',
    category: 'venous',
    name: 'Varicose Veins',
    tagline: 'Twisted, enlarged surface veins, usually in the legs.',
    desc: 'Enlarged, twisted surface veins from weakened valves.',
    img: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Vascular Surgeon',
    definition:
      'Varicose veins are enlarged, twisted veins that appear just under the skin, most often in the legs. They form when valves inside veins weaken and allow blood to pool.',
    symptoms: [
      'Visible bulging blue or purple veins',
      'Aching, throbbing, or burning sensation',
      'Heaviness or swelling in the legs',
      'Itching around affected veins',
    ],
    causes: [
      'Weak or damaged vein valves',
      'Family history',
      'Pregnancy and hormonal changes',
      'Long periods of standing',
    ],
    management: [
      'Compression stockings',
      'Regular exercise and leg elevation',
      'Avoiding long periods of standing',
      'Sclerotherapy, laser ablation, or surgery',
    ],
  },

  // ── Clot-related ───────────────────────────────────────────────────────────
  {
    slug: 'deep-vein-thrombosis',
    category: 'clot',
    name: 'Deep Vein Thrombosis',
    tagline: 'Blood clot forming in a deep vein, usually in the leg.',
    desc: 'A blood clot in a deep leg vein with risk of pulmonary embolism.',
    img: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Haematologist',
    definition:
      'Deep vein thrombosis (DVT) is a blood clot that forms in a deep vein, most commonly in the leg. If it breaks loose, it can travel to the lungs and cause a life-threatening pulmonary embolism.',
    symptoms: [
      'Swelling in one leg',
      'Pain or tenderness in the calf or thigh',
      'Warmth and red or discoloured skin',
      'Sudden shortness of breath (if clot moves to lungs)',
    ],
    causes: [
      'Prolonged immobility (long flights, bed rest)',
      'Recent surgery or injury',
      'Cancer, pregnancy, or hormonal therapy',
      'Inherited clotting disorders',
    ],
    management: [
      'Anticoagulant (blood-thinning) medication',
      'Compression stockings',
      'Early mobilisation after surgery',
      'Lifestyle changes to reduce clotting risk',
    ],
  },
  {
    slug: 'post-thrombotic-syndrome',
    category: 'clot',
    name: 'Post-Thrombotic Syndrome',
    tagline: 'Long-term leg damage following a DVT.',
    desc: 'Chronic leg symptoms after a previous deep vein thrombosis.',
    img: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Vascular Specialist',
    definition:
      'Post-thrombotic syndrome (PTS) is a long-term complication of deep vein thrombosis in which damaged vein valves cause chronic leg pain, swelling, and skin changes.',
    symptoms: [
      'Chronic leg swelling and heaviness',
      'Persistent aching or cramping',
      'Skin pigmentation changes',
      'Recurring venous ulcers',
    ],
    causes: [
      'Previous deep vein thrombosis',
      'Recurrent clots in the same vein',
      'Incomplete clot resolution',
      'Obesity and prolonged immobility',
    ],
    management: [
      'Daily compression therapy',
      'Skin and wound care',
      'Regular low-impact exercise',
      'Anticoagulation as advised by your specialist',
    ],
  },

  // ── Systemic vascular damage ───────────────────────────────────────────────
  {
    slug: 'diabetes',
    category: 'systemic-vascular',
    name: 'Diabetes',
    tagline: 'Chronic high blood sugar that damages vessels throughout the body.',
    desc: 'High blood sugar that damages small and large vessels over time.',
    img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Endocrinologist',
    definition:
      "Diabetes is a chronic condition where the body either doesn't produce enough insulin or can't use it effectively. Persistently high glucose damages blood vessels throughout the body, raising the risk of heart, kidney, eye, and nerve disease.",
    symptoms: [
      'Excessive thirst and frequent urination',
      'Unexplained weight loss and fatigue',
      'Blurred vision',
      'Slow-healing wounds and frequent infections',
    ],
    causes: [
      'Autoimmune destruction of insulin cells (Type 1)',
      'Insulin resistance from obesity and inactivity (Type 2)',
      'Family history and genetics',
      'Gestational hormones during pregnancy',
    ],
    management: [
      'Balanced low-glycemic diet and regular exercise',
      'Metformin, GLP-1 agonists, or insulin as prescribed',
      'Daily glucose monitoring and quarterly HbA1c',
      'Annual eye, foot, and kidney screening',
    ],
  },
  {
    slug: 'hypertension',
    category: 'systemic-vascular',
    name: 'Hypertension',
    tagline: 'Persistently high blood pressure that damages vessel walls.',
    desc: 'High blood pressure that quietly damages arteries and organs.',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Cardiologist',
    definition:
      'Hypertension is persistently high pressure inside the arteries. Over time it damages vessel walls and raises the risk of stroke, heart attack, kidney disease, and vision loss. It often has no symptoms until complications appear.',
    symptoms: [
      'Often no symptoms — the "silent killer"',
      'Headaches in severe cases',
      'Dizziness or vision changes',
      'Chest discomfort or shortness of breath',
    ],
    causes: [
      'Age, family history, and genetics',
      'High-salt diet and excess alcohol',
      'Obesity and physical inactivity',
      'Chronic stress and underlying kidney disease',
    ],
    management: [
      'Daily home blood pressure monitoring',
      'Low-sodium DASH-style diet',
      'Regular exercise and weight control',
      'Antihypertensive medications as prescribed',
    ],
  },
  {
    slug: 'chronic-kidney-disease',
    category: 'systemic-vascular',
    name: 'Chronic Kidney Disease',
    tagline: 'Gradual loss of kidney function, closely tied to vascular health.',
    desc: 'Gradual loss of kidney function linked to blood vessel damage.',
    img: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Nephrologist',
    definition:
      'Chronic Kidney Disease (CKD) is the gradual loss of kidney function. Because kidneys are densely vascular, vessel damage from diabetes and hypertension is the leading driver, and CKD in turn worsens overall vascular health.',
    symptoms: [
      'Swelling in feet and ankles',
      'Fatigue, poor appetite, and nausea',
      'Foamy or bloody urine',
      'Difficulty concentrating and trouble sleeping',
    ],
    causes: [
      'Diabetes and high blood pressure (most common)',
      'Glomerulonephritis and polycystic kidney disease',
      'Prolonged use of certain medications (e.g. NSAIDs)',
      'Recurrent urinary tract infections',
    ],
    management: [
      'Strict blood pressure and glucose control',
      'Low-sodium, kidney-friendly diet',
      'Regular eGFR, creatinine, and urine albumin monitoring',
      'Nephrology referral for advanced stages and dialysis planning',
    ],
  },

  // ── Other common chronic diseases ──────────────────────────────────────────
  {
    slug: 'alzheimers-disease',
    category: 'other',
    name: "Alzheimer's Disease",
    tagline: 'Progressive memory loss and cognitive decline.',
    desc: 'Memory care, cognitive assessments, and caregiver support resources.',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Neurologist',
    definition:
      "Alzheimer's disease is a progressive neurodegenerative disorder that slowly destroys memory, thinking skills, and eventually the ability to carry out simple tasks. It is the most common cause of dementia in older adults.",
    symptoms: [
      'Memory loss that disrupts daily life',
      'Difficulty planning or solving problems',
      'Confusion with time or place',
      'Changes in mood, personality, or social withdrawal',
    ],
    causes: [
      'Build-up of amyloid plaques and tau tangles in the brain',
      'Age (most common after 65)',
      'Family history and genetic factors (e.g. APOE-e4)',
      'Cardiovascular risk factors like hypertension and diabetes',
    ],
    management: [
      'Cognitive stimulation and structured daily routines',
      'Medications such as cholinesterase inhibitors and memantine',
      'Regular physical activity and a Mediterranean-style diet',
      'Caregiver support, safety planning, and care coordination',
    ],
  },
  {
    slug: 'arthritis',
    category: 'other',
    name: 'Arthritis',
    tagline: 'Chronic joint inflammation, stiffness, and pain.',
    desc: 'Joint pain management, mobility programs, and rheumatology follow-ups.',
    img: 'https://images.unsplash.com/photo-1599045118108-bf9954418b76?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Rheumatologist',
    definition:
      'Arthritis is inflammation of one or more joints, causing pain and stiffness that can worsen with age. The most common types are osteoarthritis and rheumatoid arthritis.',
    symptoms: [
      'Persistent joint pain and tenderness',
      'Morning stiffness lasting more than 30 minutes',
      'Reduced range of motion',
      'Swelling, warmth, or redness around joints',
    ],
    causes: [
      'Wear and tear of cartilage (osteoarthritis)',
      'Autoimmune attack on joint lining (rheumatoid arthritis)',
      'Previous joint injury or repetitive stress',
      'Obesity and family history',
    ],
    management: [
      'Low-impact exercise: swimming, cycling, physiotherapy',
      'NSAIDs, DMARDs, or biologics as prescribed',
      'Weight management to reduce joint load',
      'Joint protection techniques and assistive devices',
    ],
  },
  {
    slug: 'cancer',
    category: 'other',
    name: 'Cancer',
    tagline: 'Uncontrolled growth of abnormal cells in the body.',
    desc: 'Oncology care plans, screening reminders, and survivorship support.',
    img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Oncologist',
    definition:
      'Cancer is a group of diseases involving abnormal cell growth with the potential to invade or spread to other parts of the body. Early detection and personalized treatment dramatically improve outcomes.',
    symptoms: [
      'Unexplained weight loss or fatigue',
      'New lumps, persistent pain, or skin changes',
      'Changes in bowel or bladder habits',
      'Persistent cough, hoarseness, or difficulty swallowing',
    ],
    causes: [
      'Genetic mutations (inherited or acquired)',
      'Tobacco, alcohol, and dietary factors',
      'Exposure to UV radiation and certain chemicals',
      'Chronic infections (e.g. HPV, hepatitis B/C)',
    ],
    management: [
      'Regular screening based on age and risk profile',
      'Surgery, chemotherapy, radiotherapy, or immunotherapy',
      'Nutrition and rehabilitation support during treatment',
      'Survivorship plans and mental health support',
    ],
  },
  {
    slug: 'chronic-liver-disease',
    category: 'other',
    name: 'Chronic Liver Disease',
    tagline: 'Long-term liver damage affecting detoxification.',
    desc: 'Hepatology consults, LFT tracking, and lifestyle interventions.',
    img: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Hepatologist',
    definition:
      'Chronic liver disease is a progressive deterioration of liver function lasting more than six months. It includes conditions like fatty liver disease, hepatitis, and cirrhosis.',
    symptoms: [
      'Fatigue and persistent itching',
      'Yellowing of skin or eyes (jaundice)',
      'Swelling in the abdomen or legs',
      'Easy bruising and dark urine',
    ],
    causes: [
      'Chronic viral hepatitis (B or C)',
      'Excessive alcohol consumption',
      'Non-alcoholic fatty liver disease (NAFLD)',
      'Autoimmune and genetic liver disorders',
    ],
    management: [
      'Abstain from alcohol and hepatotoxic medications',
      'Weight loss and Mediterranean-style diet',
      'Antiviral therapy where indicated',
      'Regular LFTs, fibroscan, and hepatology follow-ups',
    ],
  },
  {
    slug: 'chronic-respiratory-diseases',
    category: 'other',
    name: 'Chronic Respiratory Diseases',
    tagline: 'Long-term conditions of the airways and lungs.',
    desc: 'COPD & asthma management, spirometry, and pulmonology care.',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Pulmonologist',
    definition:
      'Chronic respiratory diseases such as asthma, COPD, and pulmonary fibrosis affect the airways and lungs, causing breathing difficulties that persist or worsen over time.',
    symptoms: [
      'Shortness of breath, especially with activity',
      'Chronic cough with or without mucus',
      'Wheezing and chest tightness',
      'Frequent respiratory infections',
    ],
    causes: [
      'Smoking and second-hand smoke',
      'Long-term exposure to air pollution or workplace dust',
      'Allergens and respiratory infections',
      'Genetic conditions like alpha-1 antitrypsin deficiency',
    ],
    management: [
      'Inhalers (bronchodilators and corticosteroids)',
      'Pulmonary rehabilitation and breathing exercises',
      'Smoking cessation and vaccination (flu, pneumococcal)',
      'Routine spirometry and pulmonology reviews',
    ],
  },
  {
    slug: 'mental-health-disorders',
    category: 'other',
    name: 'Mental Health Disorders',
    tagline: 'Conditions affecting mood, thinking, and behavior.',
    desc: 'Therapy access, mood tracking, and psychiatric care coordination.',
    img: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Psychiatrist',
    definition:
      'Mental health disorders such as depression, anxiety, and bipolar disorder affect how a person thinks, feels, and behaves. They are common, treatable, and benefit greatly from early support.',
    symptoms: [
      'Persistent sadness, hopelessness, or irritability',
      'Excessive worry, panic attacks, or restlessness',
      'Changes in sleep, appetite, or energy',
      'Difficulty concentrating or social withdrawal',
    ],
    causes: [
      'Genetic and biological factors',
      'Chronic stress, trauma, or grief',
      'Substance use',
      'Underlying medical conditions and hormonal changes',
    ],
    management: [
      'Cognitive behavioral therapy (CBT) and counseling',
      'Antidepressants, anxiolytics, or mood stabilizers',
      'Mindfulness, exercise, and sleep hygiene',
      'Strong social support and regular psychiatric review',
    ],
  },
  {
    slug: 'obesity',
    category: 'other',
    name: 'Obesity',
    tagline: 'Excess body fat that raises health risks.',
    desc: 'Weight management programs, metabolic health, and lifestyle support.',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop',
    specialist: 'Bariatric Physician',
    definition:
      'Obesity is a chronic condition defined by excessive body fat (typically BMI ≥ 30) that increases the risk of diabetes, heart disease, and several cancers. It is influenced by genetics, environment, and behavior.',
    symptoms: [
      'BMI ≥ 30 or large waist circumference',
      'Breathlessness with mild activity',
      'Joint and back pain',
      'Snoring or sleep apnea',
    ],
    causes: [
      'Caloric intake exceeding energy expenditure',
      'Sedentary lifestyle',
      'Genetic predisposition and hormonal imbalances',
      'Certain medications and poor sleep',
    ],
    management: [
      'Structured nutrition plan with calorie awareness',
      'Regular exercise: strength + cardio',
      'Behavioral therapy and group support',
      'Medical or surgical options (GLP-1, bariatric surgery) when indicated',
    ],
  },
];

export function getConditionBySlug(slug) {
  return CONDITIONS.find((c) => c.slug === slug);
}

export function getConditionsByCategory(categoryId) {
  return CONDITIONS.filter((c) => c.category === categoryId);
}
