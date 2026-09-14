/*
   KORB HEALTH — OPTIMIZATION PRODUCTS (ADD-ON) DATA

   Single source of truth for the products a provider can add alongside a main
   program: sexual health, hair loss, skin care and anti-aging.

   WHY THIS FILE EXISTS
     These products were hardcoded inside KORB_Optimization_Products.html. GLP-1 and the
     peptide programs each had a data file; add-ons did not. That is why add-on
     facts drifted from the Add-On Clinical Reference and why the tool could not
     be reused anywhere else. Extracted 2026-09-11.

   NAMING
     "Optimization products" matches the patient hub, which presents these under
     "Optimize Your Weight Loss". Categories match the hub's guide names, so
     Anti-Aging rather than Longevity.

   SURESCRIPTS / TEBRA CHANGE
     These records used to carry a commercial drop-down entry (for example
     "Viagra 50 mg tablet (from drop-down)") because a prescription had to hang
     off a selectable commercial product. Tebra now takes a genuine custom
     compounded drug, so drugFormulation holds the real compound and the old
     entry is kept only as retiredDropdownEntry for reference.

   NEEDS SIGN-OFF
     Every record promoted from the old tool carries needsSignoff: true. The
     formulation strings were promoted from the compound text already in the
     tool, not re-derived from Tebra. Don to confirm each before they are treated
     as final. Call listNeedingSignoff() for the outstanding list.

   Pharmacy routing, ship-to and preferred states live in korb-pharmacies.js.

   THE DOCUMENT LIVES HERE TOO
     As of v1.1 this file also carries the Add-On Clinical Reference narrative
     under `document`. The reference PDF was built on 2026-09-10 by a ReportLab
     script that was never committed and no longer exists, which is the third
     time a KORB document set has been orphaned by an uncommitted generator.
     The document now renders from this file through clinical-doc-render.js and
     build-clinical-docs.js, both in the repo, so it can always be rebuilt.

   WHAT CHANGED IN 1.2  (2026-09-14, Don's review of the generated reference)
     Clinical content DID change. Read this list before trusting a v1.1 copy.

     STANDING RULES, applied to all 23 products and to be applied to every
     product added after this:
       - Strength, concentration, quantity and container size belong in
         drugFormulation, the custom compound name the pharmacy fills from.
         They are NOT repeated in tebra.pharmacyNotes. Notes carry bill-and-ship
         plus the compounding reason, nothing else. 12 records cleaned.
       - The retired Tebra drop-down entry is never rendered. Kept as data.
       - No price and no charge code in the clinical reference. price and
         chargeCode stay here because build-embed.js feeds the provider tool
         from them; the document no longer shows them.

     Clinical changes:
       - PERFORM dosing corrected to ½ to 1 ODT, matching KORB Rise, and supply
         restated as 20 ODTs / approx 20-40 encounters. It previously read as a
         fixed single ODT, which understated the range the supply assumes.
       - Four records had no sig, quantity, unit or pharmacy notes at all:
         both PT-141 records and both Belmar NAD+ records. Sigs derived from the
         existing approved `dosing` line. NAD+ FastSL quantity set to 20 tablets
         (once daily Monday to Friday over 28 days), per Don 2026-09-14.
       - Finasteride warning made absolute: not prescribed to women at KORB under
         any circumstance, rather than qualified by childbearing potential.
       - "sex-specific" reworded to "gender-specific"; "before sex" reworded to
         "before intercourse" in PERFORM and KORB Rise.

     STILL OPEN: reasonForCompounding is null on both PT-141 records. The
     boilerplate used elsewhere ("no FDA-approved or commercially available
     equivalent") would be FALSE — bremelanotide is FDA-approved as Vyleesi.
     Do not fill it with the boilerplate. Needs the real rationale.

   VERSION: 1.2   CREATED: 2026-09-11   UPDATED: 2026-09-14
   OWNER: Director of Clinical Operations
*/

var KORB_ADDONS = {
  meta: {
    version: "1.2",
    created: "2026-09-11",
    updated: "2026-09-14",
    owner: "Director of Clinical Operations",
    sourceOfTruth: "Add-On Clinical Reference + KORB_Optimization_Products.html as at 2026-09-11",
    pharmacyLayer: "korb-pharmacies.js",
    signoff: { clinical: "Dr. Rose", compliance: "VP Finance/Compliance for pricing and charge codes" }
  },

  /* Provider-facing label for the whole category, matching the patient hub. */
  label: "Optimization Products",
  patientFacingLabel: "Optimize Your Weight Loss",

  groups: [
    { key: "sexual",    label: "Sexual Health", followUp: "No follow-up scheduled. Patient requests refills through the portal; provider completes an async visit." },
    { key: "hair",      label: "Hair Loss",     followUp: "90-day check. No routine labs." },
    { key: "skin",      label: "Skin Care",     followUp: "As needed. No labs." },
    { key: "antiaging", label: "Anti-Aging",    followUp: "NAD+ every 28 days. Metformin every 90 days." }
  ],

  rules: {
    minimumAge: 18,
    ageNote: "Hair loss products are for patients 18 and older. KORB does not treat patients under 18.",
    skinCarePharmacy: "premier",
    skinCareNote: "Skin care is Premier only. It cannot be routed to FarmaKeio.",
    routing: "If the patient's GLP-1 already comes from FarmaKeio, take the add-on from FarmaKeio when it stocks the product. Otherwise Premier. Confirmed with Don Stevenson 2026-09-10.",
    california: "Premier and FarmaKeio do not ship to California. Belmar does, and supplies PT-141 and NAD+ there. Pricing has been vetted for those two and no others; the rest would dispense at a loss once shipping is added.",
    nitrates: "Absolute contraindication for any sexual health product. Ask directly at every visit rather than relying on the medication list."
  },

  products: [
  {
    "key": "farmakeio_metformin_er_500_mg",
    "group": "antiaging",
    "category": "Anti-Aging",
    "sex": "any",
    "pharmacy": "farmakeio",
    "name": "Metformin ER 500 mg",
    "price": "$99",
    "chargeCode": "AGEMETF009",
    "formulation": "Metformin ER 500 mg tablet",
    "dosing": "One tablet daily",
    "supply": "90 tablets, 90 days",
    "drugFormulation": "Metformin ER 500 mg tablet",
    "retiredDropdownEntry": "metFORMIN ER 500 mg tablet, extended release 24 hr (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – Metformin ER 500 mg – 90-Day Supply",
      "sig": "TAKE ONE TAB PO QD",
      "quantity": "90",
      "unit": "tablet",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to KORB / ship to patient"
    },
    "nitrateContraindicated": false,
    "warn": "Do not prescribe with eGFR under 30. Do not initiate between 30 and 45. Also screen for acute or unstable heart failure or any state causing tissue hypoxia, severe hepatic impairment, heavy or binge alcohol use, and metabolic acidosis of any cause. Boxed warning for lactic acidosis. Hold before and after iodinated contrast imaging or surgery.",
    "warnAmber": "Blunts training adaptations. In the MASTERS trial (randomized, double-blind, placebo-controlled, 94 adults 65+, 14 weeks of progressive resistance training) metformin 1,700 mg/day produced smaller gains than placebo in lean body mass (p=.003), thigh muscle mass (p<.001) and thigh muscle area (p=.005). A companion trial found blunted mitochondrial adaptations to aerobic training. Those doses are well above KORB's 500 mg ER, so the size of the effect here is unknown, but raise it with any patient whose goal is strength or performance, including gym-partner referrals.",
    "note": "Patient will not feel noticeably different. Set that expectation. Side effects: nausea, upset stomach, headache, fatigue, mild hypoglycaemia symptoms.",
    "monitor": [
      "Baseline: eGFR, hepatic function, and a vitamin B12 level. A longevity indication has no endpoint, so treat this as long-term therapy from day one.",
      "eGFR: annually at 60 or above, every 3 to 6 months at 45 to 60, every 3 months at 30 to 45 with a 50% dose reduction (FDA).",
      "Vitamin B12: ADA Standards of Care 2026 recommendation 3.10 (grade B) is periodic assessment on long-term metformin, especially with anemia or peripheral neuropathy. Annual is reasonable past 4 years of therapy or with independent risk factors. Deficiency is below 148 pmol/L, borderline below 200; methylmalonic acid or holotranscobalamin resolve an equivocal level.",
      "KORB doses 500 mg ER daily, below the 1,500 mg/day threshold where B12 risk rises most sharply, but duration is the other driver and a longevity course is indefinite."
    ]
  },
  {
    "key": "farmakeio_nad",
    "group": "antiaging",
    "category": "Anti-Aging",
    "sex": "any",
    "pharmacy": "farmakeio",
    "name": "NAD+",
    "price": "$179",
    "chargeCode": "AGENAV2001",
    "formulation": "NAD+ 200 mg/mL, 5 mL vial (1000 mg) SQ injection",
    "dosing": "Start 50 mg SQ twice weekly. Increase to 100 mg twice weekly if needed.",
    "supply": "28 days",
    "drugFormulation": "NAD+ 200mg/mL 5mL vial",
    "retiredDropdownEntry": "Nicotinamide (with chromium) 500 mcg-750 mg tablet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – NAD+ Injection – 28-Day Supply",
      "sig": "Injectable 50 mg subcutaneously twice a week, discard unused medication 28 days after first puncture",
      "quantity": "1",
      "unit": "vial",
      "refill": "0",
      "days": "28",
      "reasonForCompounding": "No FDA-approved NAD+",
      "pharmacyNotes": "Bill to office / ship to patient. Compounded, no FDA-approved NAD+, individualized dosing."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "28-day supply, not 90. The vial outlasts 28 days at either dose — patient discards the remainder. Follow-up every 28 days.",
    "note": "Do not combine with isotretinoin (Accutane). Counsel on nausea, fatigue, headache, indigestion.",
    "monitor": null
  },
  {
    "key": "premier_metformin_er_500_mg",
    "group": "antiaging",
    "category": "Anti-Aging",
    "sex": "any",
    "pharmacy": "premier",
    "name": "Metformin ER 500 mg",
    "price": "$99",
    "chargeCode": "AGEMETF009",
    "formulation": "Metformin ER 500 mg tablet",
    "dosing": "One tablet daily",
    "supply": "90 tablets, 90 days",
    "drugFormulation": "Metformin ER 500 mg tablet",
    "retiredDropdownEntry": "metFORMIN ER 500 mg tablet, extended release 24 hr (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Metformin ER 500 mg – 90-Day Supply",
      "sig": "TAKE ONE TAB PO QD",
      "quantity": "90",
      "unit": "tablet",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to KORB / ship to patient"
    },
    "nitrateContraindicated": false,
    "warn": "Do not prescribe with eGFR under 30. Do not initiate between 30 and 45. Also screen for acute or unstable heart failure or any state causing tissue hypoxia, severe hepatic impairment, heavy or binge alcohol use, and metabolic acidosis of any cause. Boxed warning for lactic acidosis. Hold before and after iodinated contrast imaging or surgery.",
    "warnAmber": "Blunts training adaptations. In the MASTERS trial (randomized, double-blind, placebo-controlled, 94 adults 65+, 14 weeks of progressive resistance training) metformin 1,700 mg/day produced smaller gains than placebo in lean body mass (p=.003), thigh muscle mass (p<.001) and thigh muscle area (p=.005). A companion trial found blunted mitochondrial adaptations to aerobic training. Those doses are well above KORB's 500 mg ER, so the size of the effect here is unknown, but raise it with any patient whose goal is strength or performance, including gym-partner referrals.",
    "note": "Patient will not feel noticeably different. Set that expectation. Side effects: nausea, upset stomach, headache, fatigue, mild hypoglycaemia symptoms.",
    "monitor": [
      "Baseline: eGFR, hepatic function, and a vitamin B12 level. A longevity indication has no endpoint, so treat this as long-term therapy from day one.",
      "eGFR: annually at 60 or above, every 3 to 6 months at 45 to 60, every 3 months at 30 to 45 with a 50% dose reduction (FDA).",
      "Vitamin B12: ADA Standards of Care 2026 recommendation 3.10 (grade B) is periodic assessment on long-term metformin, especially with anemia or peripheral neuropathy. Annual is reasonable past 4 years of therapy or with independent risk factors. Deficiency is below 148 pmol/L, borderline below 200; methylmalonic acid or holotranscobalamin resolve an equivocal level.",
      "KORB doses 500 mg ER daily, below the 1,500 mg/day threshold where B12 risk rises most sharply, but duration is the other driver and a longevity course is indefinite."
    ]
  },
  {
    "key": "premier_nad",
    "group": "antiaging",
    "category": "Anti-Aging",
    "sex": "any",
    "pharmacy": "premier",
    "name": "NAD+",
    "price": "$179",
    "chargeCode": "AGENAV2001",
    "formulation": "NAD+ 200 mg/mL, 5 mL vial (1000 mg) SQ injection",
    "dosing": "Start 50 mg SQ twice weekly. Increase to 100 mg twice weekly if needed.",
    "supply": "28 days",
    "drugFormulation": "NAD+ 200mg/mL 5mL vial",
    "retiredDropdownEntry": "Nicotinamide (with chromium) 500 mcg-750 mg tablet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – NAD+ Injection – 28-Day Supply",
      "sig": "Injectable 50 mg subcutaneously twice a week, discard unused medication 28 days after first puncture",
      "quantity": "1",
      "unit": "vial",
      "refill": "0",
      "days": "28",
      "reasonForCompounding": "No FDA-approved NAD+",
      "pharmacyNotes": "Bill to office / ship to patient. Compounded, no FDA-approved NAD+, individualized dosing."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "28-day supply, not 90. The vial outlasts 28 days at either dose — patient discards the remainder. Follow-up every 28 days.",
    "note": "Do not combine with isotretinoin (Accutane). Counsel on nausea, fatigue, headache, indigestion.",
    "monitor": null
  },
  {
    "key": "farmakeio_spironolactone_50_mg_f",
    "group": "hair",
    "category": "Hair Loss — oral",
    "sex": "f",
    "pharmacy": "farmakeio",
    "name": "Spironolactone 50 mg",
    "price": "$99",
    "chargeCode": "AGEHairPLreg",
    "formulation": "Spironolactone 50 mg tablet",
    "dosing": "50 mg daily. Increase to 100 mg at the 90-day follow-up if needed.",
    "supply": "90 tablets, 90 days",
    "drugFormulation": "Spironolactone 50mg tablet",
    "retiredDropdownEntry": "Spironolactone 50mg tablet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – Spironolactone 50 mg – 90-Day Supply",
      "sig": "Take one tablet daily for hair loss",
      "quantity": "90",
      "unit": "tablet",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to office/Ship to patient"
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": null,
    "note": "3 to 6 months before visible results. Side effects: dizziness, low energy, raised potassium, breast enlargement and tenderness. Also used for acne, hirsutism, PCOS.",
    "monitor": null
  },
  {
    "key": "farmakeio_topical_spray_f",
    "group": "hair",
    "category": "Hair Loss — topical",
    "sex": "f",
    "pharmacy": "farmakeio",
    "name": "Topical spray",
    "price": "$149",
    "chargeCode": "AGEHairFOreg",
    "formulation": "Minoxidil 2% / Spironolactone 0.05% / Latanoprost 0.01% — 30 mL spray, 120 sprays",
    "dosing": "Apply 1 to 2 sprays to dry hair once daily, leave on at least 4 hours or overnight",
    "supply": "60 days at 2/day, up to 120 at 1/day",
    "drugFormulation": "Minoxidil 2% / Spironolactone 0.05% / Latanoprost 0.01% topical spray, 30 mL (120 sprays)",
    "retiredDropdownEntry": "Hair Regrowth Treatment 2 % topical solution (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – Minoxidil 2% Topical Spray – 60-Day Supply",
      "sig": "Apply 1-2 sprays topically once daily to dry hair, leave on for at least 4 hours or overnight",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "60",
      "reasonForCompounding": "Multi-active combination",
      "pharmacyNotes": "Bill to office / ship to patient. No equivalent commercial option."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Days field is 60, not 90. This product does not last 90 days at two applications daily.",
    "note": null,
    "monitor": null
  },
  {
    "key": "farmakeio_finasteride_1_mg",
    "group": "hair",
    "category": "Hair Loss — oral",
    "sex": "m",
    "pharmacy": "farmakeio",
    "name": "Finasteride 1 mg",
    "price": "$99",
    "chargeCode": "AGEHairPLreg",
    "formulation": "Finasteride 1 mg tablet",
    "dosing": "One tablet daily",
    "supply": "90 tablets, 90 days",
    "drugFormulation": "Finasteride 1mg tablet",
    "retiredDropdownEntry": "finasteride 1mg (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – Finasteride 1 mg – 90-Day Supply",
      "sig": "Take one tablet daily for hair loss",
      "quantity": "90",
      "unit": "tablet",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to office/Ship to patient"
    },
    "nitrateContraindicated": false,
    "warn": "Never prescribe finasteride to women. Teratogenic.",
    "warnAmber": null,
    "note": "3 to 6 months before visible results. Side effects: reduced libido, mood changes, gynecomastia, orthostatic hypotension.",
    "monitor": null
  },
  {
    "key": "farmakeio_topical_spray",
    "group": "hair",
    "category": "Hair Loss — topical",
    "sex": "m",
    "pharmacy": "farmakeio",
    "name": "Topical spray",
    "price": "$149",
    "chargeCode": "AGEHairFOreg",
    "formulation": "Minoxidil 6% / Finasteride 0.3% / Tretinoin 0.025% — 30 mL spray, 120 sprays",
    "dosing": "Apply 1 to 2 sprays to dry hair once daily, leave on at least 4 hours or overnight",
    "supply": "60 days at 2/day, up to 120 at 1/day",
    "drugFormulation": "Minoxidil 6% / Finasteride 0.3% / Tretinoin 0.025% topical spray, 30 mL (120 sprays)",
    "retiredDropdownEntry": "Hair Regrowth Treatment 5 % topical solution (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – Minoxidil 6% Topical Spray – 60-Day Supply",
      "sig": "Apply 1-2 sprays topically once daily to dry hair, leave on for at least 4 hours or overnight",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "60",
      "reasonForCompounding": "Multi-active combination",
      "pharmacyNotes": "Bill to office / ship to patient. No equivalent commercial option."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Days field is 60, not 90. This product does not last 90 days at two applications daily.",
    "note": null,
    "monitor": null
  },
  {
    "key": "premier_spironolactone_50_mg_f",
    "group": "hair",
    "category": "Hair Loss — oral",
    "sex": "f",
    "pharmacy": "premier",
    "name": "Spironolactone 50 mg",
    "price": "$99",
    "chargeCode": "AGEHairPLreg",
    "formulation": "Spironolactone 50 mg tablet",
    "dosing": "50 mg daily. Increase to 100 mg at the 90-day follow-up if needed.",
    "supply": "90 tablets, 90 days",
    "drugFormulation": "Spironolactone 50mg tablet",
    "retiredDropdownEntry": "Spironolactone 50mg tablet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Spironolactone 50 mg – 90-Day Supply",
      "sig": "Take one tablet daily for hair loss",
      "quantity": "90",
      "unit": "tablet",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to office/Ship to patient"
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": null,
    "note": "3 to 6 months before visible results. Side effects: dizziness, low energy, raised potassium, breast enlargement and tenderness. Also used for acne, hirsutism, PCOS.",
    "monitor": null
  },
  {
    "key": "premier_topical_foam_f",
    "group": "hair",
    "category": "Hair Loss — topical",
    "sex": "f",
    "pharmacy": "premier",
    "name": "Topical foam",
    "price": "$149",
    "chargeCode": "AGEHairFOreg",
    "formulation": "Minoxidil 2% / Spironolactone 0.05% / Latanoprost 0.01% — 60 mL foam",
    "dosing": "Apply 1 to 2 pumps to dry hair once daily",
    "supply": "42 days at 2/day, up to 85 at 1/day",
    "drugFormulation": "Minoxidil 2% / Spironolactone 0.05% / Latanoprost 0.01% topical foam, 60 mL bottle",
    "retiredDropdownEntry": "MinoxidiL 2% topical solution (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Minoxidil 2% Topical Foam – 42-Day Supply",
      "sig": "Apply 1-2 pumps topically to dry hair once daily",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "42",
      "reasonForCompounding": "Multi-active combination",
      "pharmacyNotes": "Bill to office / ship to patient. No equivalent commercial option."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Days field is 42, not 90. This product does not last 90 days at two applications daily.",
    "note": null,
    "monitor": null
  },
  {
    "key": "premier_finasteride_1_mg",
    "group": "hair",
    "category": "Hair Loss — oral",
    "sex": "m",
    "pharmacy": "premier",
    "name": "Finasteride 1 mg",
    "price": "$99",
    "chargeCode": "AGEHairPLreg",
    "formulation": "Finasteride 1 mg tablet",
    "dosing": "One tablet daily",
    "supply": "90 tablets, 90 days",
    "drugFormulation": "Finasteride 1mg tablet",
    "retiredDropdownEntry": "finasteride 1mg (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Finasteride 1 mg – 90-Day Supply",
      "sig": "Take one tablet daily for hair loss",
      "quantity": "90",
      "unit": "tablet",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to office/Ship to patient"
    },
    "nitrateContraindicated": false,
    "warn": "Never prescribe finasteride to women. Teratogenic.",
    "warnAmber": null,
    "note": "3 to 6 months before visible results. Side effects: reduced libido, mood changes, gynecomastia, orthostatic hypotension.",
    "monitor": null
  },
  {
    "key": "premier_topical_foam",
    "group": "hair",
    "category": "Hair Loss — topical",
    "sex": "m",
    "pharmacy": "premier",
    "name": "Topical foam",
    "price": "$149",
    "chargeCode": "AGEHairFOreg",
    "formulation": "Minoxidil 6% / Finasteride 0.3% / Tretinoin 0.025% — 60 mL foam",
    "dosing": "Apply 1 to 2 pumps to dry hair once daily",
    "supply": "42 days at 2/day, up to 85 at 1/day",
    "drugFormulation": "Minoxidil 6% / Finasteride 0.3% / Tretinoin 0.025% topical foam, 60 mL bottle",
    "retiredDropdownEntry": "minoxidiL 5% topical solution (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Minoxidil 6% Topical Foam – 42-Day Supply",
      "sig": "Apply 1-2 pumps topically to dry hair once daily",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "42",
      "reasonForCompounding": "Multi-active combination",
      "pharmacyNotes": "Bill to office / ship to patient. No equivalent commercial option."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Days field is 42, not 90. This product does not last 90 days at two applications daily.",
    "note": null,
    "monitor": null
  },
  {
    "key": "farmakeio_korb_electric_f",
    "group": "sexual",
    "category": "Sexual Health",
    "sex": "f",
    "pharmacy": "farmakeio",
    "name": "KORB Electric",
    "price": "$99",
    "chargeCode": "INTELEC001",
    "formulation": "Arginine HCl 6% / Sildenafil 2% / DHEA 1% topical",
    "dosing": "Apply 1–2 clicks to the clitoris 30 min before sexual activity",
    "supply": "One bottle, approx. 20 encounters",
    "drugFormulation": "Arginine HCl/Sildenafil/DHEA 6/2/1% topical",
    "retiredDropdownEntry": "vaginal lubricant inserts (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – KORB Electric Topical – 90-Day Supply",
      "sig": "KORB ELECTRIC Apply 1-2 clicks topically to the clitoris 30 minutes before a sexual encounter",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": "Female arousal topical",
      "pharmacyNotes": "Bill to office / ship to patient. No FDA-approved or commercially available equivalent."
    },
    "nitrateContraindicated": true,
    "warn": null,
    "warnAmber": null,
    "note": null,
    "monitor": null
  },
  {
    "key": "farmakeio_perform",
    "group": "sexual",
    "category": "Sexual Health",
    "sex": "m",
    "pharmacy": "farmakeio",
    "name": "PERFORM",
    "price": "$99",
    "chargeCode": "INTRISE001",
    "formulation": "Sildenafil 88 mg / Tadalafil 22 mg rapid ODT",
    "dosing": "½ to 1 ODT 30 min before intercourse, increase by ½ as needed. Up to 36 hours.",
    "supply": "20 ODTs, approx. 20–40 encounters",
    "drugFormulation": "Sildenafil/Tadalafil 88/22mg rapid ODT",
    "retiredDropdownEntry": "Viagra 50 mg tablet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "FARMAKEIO – PERFORM Rapid ODT – 90-Day Supply",
      "sig": "PERFORM Rapid ODT: Take ½ - 1 ODT 30 minutes before intercourse as needed",
      "quantity": "20",
      "unit": "tablet",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": "ED combination therapy",
      "pharmacyNotes": "Bill to office / ship to patient. No FDA-approved or commercially available equivalent."
    },
    "nitrateContraindicated": true,
    "warn": null,
    "warnAmber": null,
    "note": "No L-Arginine in this formulation, so headache may be more noticeable than with KORB Rise. Advise emergency care for an erection lasting more than 4 hours.",
    "monitor": null
  },
  {
    "key": "premier_korb_electric_f",
    "group": "sexual",
    "category": "Sexual Health",
    "sex": "f",
    "pharmacy": "premier",
    "name": "KORB Electric",
    "price": "$99",
    "chargeCode": "INTELEC001",
    "formulation": "Sildenafil 1.5% / Theophylline 3% / L-Arginine 6% topical",
    "dosing": "Apply 1–2 clicks to the clitoris 30 min before sexual activity",
    "supply": "One bottle, approx. 20 encounters",
    "drugFormulation": "Sildenafil/Theophylline/L-Arginine 1.5/3/6% topical",
    "retiredDropdownEntry": "vaginal lubricant inserts (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – KORB Electric Topical – 90-Day Supply",
      "sig": "KORB ELECTRIC Apply 1-2 clicks topically to the clitoris 30 minutes before a sexual encounter",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": "Female arousal topical",
      "pharmacyNotes": "Bill to office / ship to patient. No FDA-approved or commercially available equivalent."
    },
    "nitrateContraindicated": true,
    "warn": null,
    "warnAmber": null,
    "note": null,
    "monitor": null
  },
  {
    "key": "premier_korb_rise",
    "group": "sexual",
    "category": "Sexual Health",
    "sex": "m",
    "pharmacy": "premier",
    "name": "KORB Rise",
    "price": "$99",
    "chargeCode": "INTRISE001",
    "formulation": "Sildenafil 50 mg / Tadalafil 10 mg / L-Arginine 90 mg / Oxytocin 0.04 mg troche",
    "dosing": "½ to 1 troche 30 min before intercourse, increase by ½ as needed. Up to 36 hours.",
    "supply": "20 troches, approx. 20–40 encounters",
    "drugFormulation": "Sildenafil/Tadalafil/L-Arginine/Oxytocin 50/10/90/0.04mg troche",
    "retiredDropdownEntry": "Viagra 50 mg tablet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – KORB Rise Troche – 90-Day Supply",
      "sig": "KORB RISE Take ½ - 1 troche 30 minutes before intercourse as needed",
      "quantity": "20",
      "unit": "troche",
      "refill": "0",
      "days": "90",
      "reasonForCompounding": "ED combination therapy",
      "pharmacyNotes": "Bill to office / ship to patient. No FDA-approved equivalent."
    },
    "nitrateContraindicated": true,
    "warn": null,
    "warnAmber": null,
    "note": "Sildenafil and tadalafil increase blood flow. L-Arginine reduces headache, the most common side effect. Oxytocin was added to the formulation in September 2026. Side effects: headache, nasal congestion, blurred vision, nausea, upset stomach, prolonged erection. Advise emergency care for an erection lasting more than 4 hours.",
    "monitor": null
  },
  {
    "key": "premier_combo_cream",
    "group": "skin",
    "category": "Skin Care",
    "sex": "any",
    "pharmacy": "premier",
    "name": "Combo cream",
    "price": "$99",
    "chargeCode": "AGESkinCRCmb",
    "formulation": "Estriol 0.3% / GHK-Cu 0.3% / Hyaluronic Acid 0.2% / Niacinamide 0.5% — 30 mL",
    "dosing": "Apply 1 click (0.25 mL) once daily",
    "supply": "120 days",
    "drugFormulation": "Estriol 0.3% / GHK-Cu 0.3% / Hyaluronic Acid 0.2% / Niacinamide 0.5% cream, 30 mL",
    "retiredDropdownEntry": "estradioL 0.25 mg/0.25 gram (0.1 %) transdermal gel packet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Estriol Combo Cream – 120-Day Supply",
      "sig": "Apply (1 click/0.25 ml/0.25 g) to the affected area once daily as directed",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "120",
      "reasonForCompounding": "Multi-active combination",
      "pharmacyNotes": "Bill to office / ship to patient. No FDA-approved or commercially available equivalent."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Contains estriol, a hormone. Same consideration as above.",
    "note": null,
    "monitor": null
  },
  {
    "key": "premier_estriol_cream_0_3",
    "group": "skin",
    "category": "Skin Care",
    "sex": "any",
    "pharmacy": "premier",
    "name": "Estriol cream 0.3%",
    "price": "$49",
    "chargeCode": "AGESkinCRToE",
    "formulation": "Estriol 0.3% — 30 mL",
    "dosing": "Apply 1 click (0.25 mL) once daily",
    "supply": "120 days",
    "drugFormulation": "Estriol 0.3% topical cream, 30 mL",
    "retiredDropdownEntry": "estradioL 0.75 mg/0.75 gram (0.1%) transdermal gel packet (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Estriol Cream 0.3% – 120-Day Supply",
      "sig": "Apply (1 click/0.25 ml/0.25 g, containing estriol 0.075%) to the affected external area once daily as directed",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "120",
      "reasonForCompounding": "Compounded strength",
      "pharmacyNotes": "Bill to office / ship to patient. No FDA-approved or commercially available equivalent."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Contains a hormone. Can cause breast tenderness or bleeding. Consider carefully for a patient already on hormone therapy.",
    "note": null,
    "monitor": null
  },
  {
    "key": "premier_tretinoin_cream",
    "group": "skin",
    "category": "Skin Care",
    "sex": "any",
    "pharmacy": "premier",
    "name": "Tretinoin cream",
    "price": "$49",
    "chargeCode": "AGESkinCRToE",
    "formulation": "0.025%, 0.05%, or 0.1% — 20 g tube",
    "dosing": "Apply a pea-sized amount once daily",
    "supply": "approx. 80 days",
    "drugFormulation": "Tretinoin 0.025% topical cream",
    "retiredDropdownEntry": "tretinoin 0.025 % topical cream (from drop-down)",
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – Tretinoin Cream 0.025% – 80-Day Supply",
      "sig": "Apply a pea-sized amount daily as needed",
      "quantity": "1",
      "unit": "tube",
      "refill": "0",
      "days": "80",
      "reasonForCompounding": "Strength not commercial",
      "pharmacyNotes": "20 gm Tube, Bill to office/Ship to patient"
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": null,
    "note": "For acne, oily skin, scarring, spots. Causes sun sensitivity — counsel on sun protection.",
    "monitor": null
  },
  {
    "key": "belmar_pt141_nasal",
    "group": "sexual",
    "category": "Sexual Health",
    "sex": "any",
    "pharmacy": "belmar",
    "name": "PT-141 nasal spray",
    "price": "$119 add-on / $149 standalone",
    "chargeCode": "WMN141add",
    "chargeCodeStandalone": "WMN141reg",
    "formulation": "Bremelanotide 5 mg/mL, 15 mL bottle",
    "dosing": "One spray in each nostril 1 to 2 hours before activity",
    "supply": "28-day supply",
    "drugFormulation": "Bremelanotide 5mg/mL nasal spray 15mL",
    "retiredDropdownEntry": null,
    "needsSignoff": true,
    "tebra": {
      "name": "BELMAR – PT-141 Nasal Spray – 28-Day Supply",
      "sig": "One spray in each nostril 1 to 2 hours before intercourse as needed",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "28",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to office / ship to patient."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Tebra favorite fields are not yet defined for this product. Build the prescription from the Add-On Clinical Reference.",
    "note": "Acts on the nervous system to increase desire and arousal, independent of hormone levels. Side effects: nausea, dizziness, fatigue, cough, skin darkening. Raise skin darkening before starting, not after - it is a known effect of the mechanism and patients who are not warned tend to stop. Does not follow the 90-day cadence; do not schedule refills alongside quarterly visits.",
    "monitor": null
  },
  {
    "key": "premier_pt141_inj",
    "group": "sexual",
    "category": "Sexual Health",
    "sex": "any",
    "pharmacy": "premier",
    "name": "PT-141 injection",
    "price": "$119 add-on / $149 standalone",
    "chargeCode": "WMN141add",
    "chargeCodeStandalone": "WMN141reg",
    "formulation": "Bremelanotide 10 mg/mL, 5 mL vial",
    "dosing": "Inject 1 to 2 mg subcutaneously about 2 hours before anticipated activity",
    "supply": "28-day supply",
    "drugFormulation": "Bremelanotide 10mg/mL 5mL vial",
    "retiredDropdownEntry": null,
    "needsSignoff": true,
    "tebra": {
      "name": "PREMIER – PT-141 Injection – 28-Day Supply",
      "sig": "Inject 1 to 2 mg subcutaneously about 2 hours before intercourse as needed",
      "quantity": "1",
      "unit": "vial",
      "refill": "0",
      "days": "28",
      "reasonForCompounding": null,
      "pharmacyNotes": "Bill to office / ship to patient."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Tebra favorite fields are not yet defined for this product. Build the prescription from the Add-On Clinical Reference.",
    "note": "Acts on the nervous system to increase desire and arousal, independent of hormone levels. Side effects: nausea, dizziness, fatigue, cough, skin darkening. Raise skin darkening before starting. Does not follow the 90-day cadence.",
    "monitor": null
  },
  {
    "key": "belmar_nad_nasal",
    "group": "antiaging",
    "category": "Anti-Aging",
    "sex": "any",
    "pharmacy": "belmar",
    "name": "NAD+ nasal spray",
    "price": "$179",
    "chargeCode": "AGENAV2001",
    "formulation": "NAD+ 300 mg/mL, 15 mL bottle",
    "dosing": "Start 1 spray per nostril once daily. Increase to 2 sprays per nostril once daily.",
    "supply": "28 days",
    "drugFormulation": "NAD+ 300mg/mL nasal spray 15mL",
    "retiredDropdownEntry": null,
    "needsSignoff": true,
    "tebra": {
      "name": "BELMAR – NAD+ Nasal Spray – 28-Day Supply",
      "sig": "Start 1 spray in each nostril once daily. May increase to 2 sprays in each nostril once daily.",
      "quantity": "1",
      "unit": "bottle",
      "refill": "0",
      "days": "28",
      "reasonForCompounding": "No FDA-approved NAD+",
      "pharmacyNotes": "Bill to office / ship to patient. Compounded, no FDA-approved NAD+, individualized dosing."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Tebra favorite fields are not yet defined for this product. Build the prescription from the Add-On Clinical Reference.",
    "note": "28-day supply, driven by beyond-use dating on a compounded product. Follow-up every 28 days, not on the 90-day cadence.",
    "monitor": null
  },
  {
    "key": "belmar_nad_fastsl",
    "group": "antiaging",
    "category": "Anti-Aging",
    "sex": "any",
    "pharmacy": "belmar",
    "name": "NAD+ FastSL sublingual",
    "price": "$179",
    "chargeCode": "AGENAV2001",
    "formulation": "NAD+ 100 mg sublingual tablet",
    "dosing": "Start half a tablet under the tongue each morning, Monday to Friday, off at weekends. Increase to one tablet.",
    "supply": "28 days",
    "drugFormulation": "NAD+ 100mg sublingual tablet",
    "retiredDropdownEntry": null,
    "needsSignoff": true,
    "tebra": {
      "name": "BELMAR – NAD+ FastSL Sublingual – 28-Day Supply",
      "sig": "Dissolve ½ to 1 tablet under the tongue each morning Monday to Friday. No dose at weekends.",
      "quantity": "20",
      "unit": "tablet",
      "refill": "0",
      "days": "28",
      "reasonForCompounding": "No FDA-approved NAD+",
      "pharmacyNotes": "Bill to office / ship to patient. Compounded, no FDA-approved NAD+, individualized dosing."
    },
    "nitrateContraindicated": false,
    "warn": null,
    "warnAmber": "Tebra favorite fields are not yet defined for this product. Build the prescription from the Add-On Clinical Reference.",
    "note": "28-day supply. Follow-up every 28 days, not on the 90-day cadence.",
    "monitor": null
  }
],

  /* ── THE DOCUMENT ─────────────────────────────────────────────────────────
     Narrative for the Add-On Clinical Reference. Everything a provider reads
     that is NOT a product field lives here, so the document and the tool are
     one artifact rather than two that drift.

     Three rules govern what may be written below.

     1. NO STATE OR PHARMACY FACT IS RESTATED HERE. Ship-to lists, excluded
        states and pharmacy footprints are read from korb-pharmacies.js at
        render time. The 2026-09-10 review found this document publishing
        FarmaKeio's PREFERRED list as its SHIP-TO list, wrongly excluding AZ,
        FL, NV and TX. That class of error is now structurally impossible.
     2. NO PRODUCT FIELD IS RESTATED HERE. Prices, codes, sigs, days and
        quantities come from products[] above.
     3. NO OPEN ITEMS SECTION. The Clinical Document Style Standard forbids
        it: an unresolved question either names a decider inline or stays out.
        The former Open Items are folded into the sections they belong to,
        under `decider`. ────────────────────────────────────────────────── */
  document: {
    id: "addons",
    file: "KORB_AddOn_Clinical_Reference",
    title: "Add-On Clinical Reference",
    subtitle: "Provider Source of Truth",
    kicker: "Sexual Health · Hair Loss · Skin Care · Anti-Aging",
    /* KORB Health Group LLC is the MSO and does not practise medicine. This is
       clinical protocol, so it carries the PA that holds licensure, matching
       the TRT Provider Tool. Review finding ST-3, 2026-09-10. */
    entity: "KORB Health Medical Texas PA",
    version: "2.0",
    effective: "2026-09-12",
    supersedes: "The Add-On Clinical Reference generated 2026-09-10, and before it the individual Get Intimate Now, Hair Loss and Skin Care documents dated 11/26/2025.",
    intro: "This is the single source of truth for all KORB add-on products. Add-ons attach to any of the four main programs. The program references link here rather than repeating this content, so a product is never described in two places.",
    /* Review item 4, 2026-09-10: distinguish an inherited decision from one the
       current clinical director has reviewed. */
    inheritedDecisions: "Dr. Scott owned protocol decisions historically and Dr. Rose owns them on the program re-evaluation. Anything in this document carried forward from the prior protocols is Dr. Scott's until Dr. Rose has reviewed it, and is marked where it applies.",

    /* Order the pharmacy table prints in. Which pharmacies actually appear is
       derived from products[], so a pharmacy that stops sourcing add-ons drops
       out on its own. Footprints are NOT listed here — the renderer reads them
       from korb-pharmacies.js. */
    pharmacyOrder: ["premier", "farmakeio", "belmar"],
    /* What each one sources FOR ADD-ONS. This is the only pharmacy fact the
       document owns, because it is an add-on fact rather than a pharmacy fact.
       Derived from products[]; keep in step if a product moves. */
    pharmacySources: {
      premier:   "KORB Rise, KORB Electric, PT-141 injection, all hair loss, all skin care, NAD+ injection, metformin",
      farmakeio: "PERFORM, KORB Electric, hair loss, NAD+ injection, metformin. No skin care.",
      belmar:    "California only in practice: PT-141 nasal spray, NAD+ nasal spray, NAD+ FastSL sublingual."
    },

    sections: [
      {
        id: "how",
        heading: "How add-ons work",
        body: [
          "Add-ons are not standalone programs. They attach to whichever program the patient is already enrolled in: Weight Loss and Metabolic Health, Men's Health, Women's Health, or Functional Health and Longevity. A patient in any of those four can be offered any appropriate add-on.",
          "Two products are gender-specific and must not be crossed. Finasteride is for men only. Spironolactone is the women's oral agent. The topical formulations also differ by gender and are not interchangeable. Use the Add-On Selector to confirm before prescribing."
        ],
        render: "matrix"
      },
      {
        id: "routing",
        heading: "Pharmacy and state availability",
        body: [
          "Every add-on is sourced from Premier or FarmaKeio, except in California. Neither ships to California.",
          "California is not a blanket exclusion. Belmar ships to all 50 states and DC, and supplies PT-141 and the NAD+ forms there. Those two have vetted pricing. Everything else Belmar could source is priced above what KORB charges patients once shipping is added, so it would dispense at a loss. That is a cost decision, not a licensure one, and it is under review.",
          "Confirm the patient's state before offering an add-on, so you are not withdrawing something you have already raised."
        ],
        render: "pharmacyTable",
        decider: {
          question: "Pharmacy sourcing is under review. Belmar pricing is what limits California to two products.",
          owner: "Director of Clinical Operations, with VP Finance on pricing"
        }
      },
      {
        id: "sexual",
        heading: "Sexual health",
        group: "sexual",
        render: "productDetail",
        callouts: [
          { tone: "stop", heading: "Absolute contraindication: nitrates", body: "Patients taking nitrates for chest pain must not receive KORB Rise, PERFORM or KORB Electric. The combination can cause a life-threatening drop in blood pressure. Ask directly at every visit rather than relying on the medication list." },
          { tone: "warn", heading: "PT-141 is off the 90-day cadence", body: "The labelled beyond-use date is 45 days, but the 28-day-after-first-puncture rule governs, so it is dispensed as a 28-day supply. Do not schedule refills alongside quarterly visits. The patient contacts KORB when they need more." },
          { tone: "info", heading: "Raise skin darkening before starting, not after", body: "It is a known effect of the PT-141 mechanism rather than a reaction, and patients who are not warned tend to stop." }
        ],
        decider: {
          question: "PERFORM has no price or charge code in this document. The Selector quotes $99 and INTRISE001, carried over from KORB Rise, and that assignment is not sourced. Confirm before quoting.",
          owner: "Nick, VP Finance"
        }
      },
      {
        id: "hair",
        heading: "Hair loss",
        group: "hair",
        body: [
          "Men and women, 18 and older. Oral and topical are billed separately. Days supply varies by product and by how often the patient uses it. Pricing and charge codes are in the Add-On provider tool."
        ],
        render: "productDetail",
        callouts: [
          { tone: "stop", heading: "Never prescribe finasteride to a woman", body: "Finasteride is not prescribed to women at KORB under any circumstance, regardless of childbearing potential. It is teratogenic. Women use spironolactone as the oral agent." },
          { tone: "warn", heading: "Do not label topicals as a 90-day supply", body: "Neither product lasts 90 days at twice-daily use, and the FarmaKeio spray exceeds 90 days at once-daily use. Enter the conservative figure in the Days field so the patient is never left short, and tell them the realistic range. Premier foam, 60 mL, one pump is 0.7 mL: 85 days at once daily, 42 at twice daily, Days field 42. FarmaKeio spray, 30 mL and 120 sprays: 120 days at once daily, 60 at twice daily, Days field 60." },
          { tone: "info", heading: "Counsel on timeline up front", body: "Both oral agents take 3 to 6 months to show results. Patients who are not told this discontinue early and conclude the product failed. Spironolactone is also used for acne, hirsutism and PCOS, which may be relevant for Women's Health patients." }
        ]
      },
      {
        id: "skin",
        heading: "Skin care",
        group: "skin",
        body: [
          "Topical treatment for acne, oily skin, dry skin, wrinkles, loss of elasticity and discolouration. Available to men and women. Most patients add this to an existing program. Tretinoin is for acne, oily skin, scarring and spots; estriol is for dry skin, wrinkles, spots and elasticity. All creams are applied once daily.",
          "Skin care is Premier only and cannot be routed to FarmaKeio. Patients in FarmaKeio-only states cannot receive it."
        ],
        render: "productDetail",
        callouts: [
          { tone: "warn", heading: "The days figures are the conservative ones, and they are not 90", body: "Tretinoin runs about 80 days on a 20 g tube at a pea-sized amount. Estriol 0.3% and the combo cream both run 120 days on 30 mL at one click, 0.25 mL, once daily. Enter those figures, not 90. Earlier versions of this document carried a 90-day sig line that contradicted its own supply table; the supply table was right." },
          { tone: "info", heading: "Estriol contains a hormone", body: "It can cause breast tenderness or bleeding. Consider carefully before adding it for a patient already on hormone therapy in Women's Health, and counsel accordingly. General side effects across skin care: dry skin and flaking, sun sensitivity, redness, itching. Counsel on sun protection." }
        ],
        decider: {
          question: "The tretinoin days figure assumes a pea-sized amount of roughly 0.25 g. It is an estimate rather than a measured value and is worth confirming with Premier.",
          owner: "Director of Clinical Operations"
        }
      },
      {
        id: "antiaging",
        heading: "Anti-aging: NAD+ and metformin",
        group: "antiaging",
        body: [
          "Longevity-focused add-on, available to patients in any program. NAD+ and metformin are prescribed independently of each other; a patient may receive either or both. No laboratory testing is required to start either product, though metformin has monitoring requirements once started.",
          "NAD+ is a naturally occurring coenzyme involved in metabolism, DNA repair and immune function, and levels decline with age. Injection is the fastest route, usually into the lower abdomen, and may also be given in the arm, buttock or thigh."
        ],
        render: "productDetail",
        callouts: [
          { tone: "warn", heading: "Every NAD+ form is a 28-day supply", body: "That is driven by beyond-use dating on a compounded product. The injection vial holds 1000 mg, which outlasts 28 days at either dose, so the patient discards the remainder. Say so on the prescription. NAD+ follow-up is every 28 days, not on the 90-day cadence." },
          { tone: "stop", heading: "Metformin is not contraindication-free", body: "It carries a boxed warning for lactic acidosis. Do not prescribe with eGFR below 30 mL/min/1.73m², and do not initiate between 30 and 45. Also screen for acute or unstable heart failure or any state causing tissue hypoxia, severe hepatic impairment, heavy or binge alcohol use, and metabolic acidosis of any cause. Hold before and after iodinated contrast imaging or surgery. Renal function must be known before starting. Metformin is cleared and in use; the screening criteria here come from standard prescribing guidance because the source protocol listed none." },
          { tone: "info", heading: "Metformin rationale, stated with its limits", body: "On the WHO List of Essential Medicines. The evidence cited for lower rates of dementia and some cancers, reduced cardiovascular risk, reduced inflammation and reduced diabetes risk is largely observational for an off-label longevity indication. Patients will not feel noticeably different; set that expectation up front." }
        ],
        decider: {
          question: "Do not combine NAD+ with isotretinoin. This restriction is carried forward from the source protocol without independent verification and is not a widely documented interaction.",
          owner: "Dr. Rose",
          inherited: true
        }
      },
      {
        id: "documentation",
        heading: "Documentation",
        render: "bullets",
        bullets: [
          "Record the add-on in the patient's chart and add it to the CC section so it carries forward.",
          "Document that nitrate use was asked about and excluded before prescribing any sexual health product.",
          "For hair loss and skin care, document the counselling on the 3 to 6 month timeline and on sun sensitivity.",
          "Add-ons bill separately from the base program. Confirm the charge code against the product record rather than from memory."
        ],
        decider: {
          question: "korbhealth.com lists KORB Rise as sildenafil and tadalafil only, omitting oxytocin, and shows hair loss starting at $99 without noting that topicals are $149. Skin care is not listed publicly as a Men's Health add-on although it is available to men on request.",
          owner: "Marketing, with the Director of Clinical Operations on the clinical wording"
        }
      }
    ]
  },

  /* ---- helpers ---- */

  forPatient: function (opts) {
    var pharmacyKey = opts.pharmacy, sex = opts.sex, group = opts.group;
    return this.products.filter(function (p) {
      if (pharmacyKey && p.pharmacy !== pharmacyKey) return false;
      if (sex && p.sex !== "any" && p.sex !== sex) return false;
      if (group && p.group !== group) return false;
      return true;
    });
  },

  groupLabel: function (key) {
    var g = this.groups.filter(function (x) { return x.key === key; })[0];
    return g ? g.label : key;
  },

  followUpFor: function (key) {
    var g = this.groups.filter(function (x) { return x.key === key; })[0];
    return g ? g.followUp : null;
  },

  listNeedingSignoff: function () {
    return this.products.filter(function (p) { return p.needsSignoff; })
      .map(function (p) { return { key: p.key, name: p.name, drugFormulation: p.drugFormulation }; });
  },

  selfCheck: function () {
    var problems = [], self = this, seen = {};
    var groupKeys = this.groups.map(function (g) { return g.key; });
    this.products.forEach(function (p) {
      if (seen[p.key]) problems.push("duplicate key: " + p.key);
      seen[p.key] = 1;
      if (groupKeys.indexOf(p.group) < 0) problems.push(p.key + ": unknown group " + p.group);
      if (!p.chargeCode) problems.push(p.key + ": no charge code");
      if (!p.price) problems.push(p.key + ": no price");
      if (!p.drugFormulation) problems.push(p.key + ": no drugFormulation");
      if (["m", "f", "any"].indexOf(p.sex) < 0) problems.push(p.key + ": bad sex value " + p.sex);
      if (p.group === "skin" && p.pharmacy !== self.rules.skinCarePharmacy) {
        problems.push(p.key + ": skin care must be " + self.rules.skinCarePharmacy);
      }
      /* Finasteride is teratogenic and must never reach a female record. */
      if (p.sex === "f" && /finasteride/i.test(p.drugFormulation || "")) {
        problems.push(p.key + ": finasteride on a female product");
      }
    });
    var pending = this.listNeedingSignoff().length;
    if (problems.length) {
      console.warn("KORB_ADDONS.selfCheck found " + problems.length + " problem(s):");
      problems.forEach(function (p) { console.warn("  - " + p); });
    } else {
      console.log("KORB_ADDONS.selfCheck passed.");
    }
    console.log("Products awaiting formulation sign-off: " + pending + " of " + this.products.length);
    return problems;
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_ADDONS; }
