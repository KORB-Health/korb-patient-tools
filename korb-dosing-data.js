/* ============================================================================
   KORB HEALTH — SHARED DOSING & PRESCRIBING DATA
   Single source of truth for peptide dosing, schedules, pharmacy instructions,
   and Tebra prescribing fields across KORB tools.

   VERSION: 2.2   UPDATED: 2026-08-05

   WHAT CHANGED IN 2.0
     - Added `prescribing`: the exact Tebra Compounded Drug Favorite fields
       (drug formulation, quantity, unit, refill, days supply, patient
       instructions, pharmacy instructions) per agent per pharmacy. Moved out
       of KORB_Provider_Clinical_Reference.html, which no longer holds a copy.
     - Added `instructionsRx`, `foundationAgents`, `peakSchedule`,
       `peakPathways`, and the counseling / monitoring text blocks.
     - KORB_Patient_Treatment_Schedule.html and
       KORB_Provider_Clinical_Reference.html now LOAD this file instead of
       carrying their own copies. KORB_Functional_Health_Tracker.html already did.
     - KORB_Injection_Tracker.html is intentionally NOT wired in.

   TWO INSTRUCTION SETS, ON PURPOSE
     `instructions`   patient-facing phrasing (Patient Treatment Schedule)
     `instructionsRx` provider phrasing pasted into Tebra (Provider Reference)
     Same clinical content, different words. Unit counts are identical and are
     verified by KORB_DOSING.selfCheck(). They are kept separate so that wiring
     the tools together did not silently rewrite prescription text. Unify only
     with clinical sign-off.

   HOW TO USE
     <script src="korb-dosing-data.js"></script>
   Then reference KORB_DOSING instead of any local copy.
   ============================================================================ */

/* Counseling and monitoring text, declared first because `prescribing` references them. */
var SERM_COUNSEL = [
  'Not GH replacement — stimulates body\'s own GH signaling pathway',
  'Lifestyle (nutrition, resistance training, sleep) remains critical — not a substitute',
  'Response varies between patients; benefit not guaranteed',
  'Do not combine with other GH-axis therapies without provider approval',
  '6 days ON / 1 day OFF pattern must be followed — Monday through Saturday, Sunday off (recommended)',
  'Take at bedtime on an empty stomach — timing is clinically relevant',
  'Discard vial 28 days after initial puncture — do not use beyond this date regardless of remaining volume',
];
var SERM_MONITOR = [
  'Sleep quality and recovery quality',
  'Energy and wellness trend',
  'Body composition / waist circumference trend',
  'Exercise tolerance and lean mass preservation',
  'Edema / fluid retention',
  'Headache',
  'Joint discomfort',
  'Paresthesias / tingling',
  'Glucose-related changes (if at-risk)',
  'IGF-1 (per lab protocol)',
  'Injection site reactions',
  'Adherence to 6-on/1-off schedule',
];
var CJC_COUNSEL  = [
  'Dual-peptide GH secretagogue combo — not GH replacement',
  'Lifestyle (nutrition, resistance training, sleep) remains critical — not a substitute',
  'Response varies between patients; benefit not guaranteed',
  'Do not combine with other GH-axis therapies without provider approval',
  '6 days ON / 1 day OFF pattern must be followed — Monday through Saturday, Sunday off',
  'Take at bedtime on an empty stomach — timing is clinically relevant',
  'Discard vial 28 days after initial puncture — do not use beyond this date regardless of remaining volume',
];
var TESA_COUNSEL = [
  'GH secretagogue targeting visceral fat reduction and body composition — not GH replacement',
  'Lifestyle (nutrition, resistance training, sleep) remains critical — not a substitute',
  'Response varies between patients; benefit not guaranteed',
  'Do not combine with other GH-axis therapies without provider approval',
  '6 days ON / 1 day OFF pattern must be followed — Monday through Saturday, Sunday off',
  'Discard vial 28 days after initial puncture — do not use beyond this date regardless of remaining volume',
];
var TESA_MONITOR = [
  'Body composition / visceral fat trend',
  'Energy and wellness trend',
  'Edema / fluid retention',
  'Glucose-related changes (if at-risk)',
  'IGF-1 (per lab protocol)',
  'Injection site reactions',
  'Adherence to 6-on/1-off schedule',
];


var KORB_DOSING = {

  meta: {
    version: '2.2',
    lastVerified: '2026-08-05',
    verifiedAgainst: [
      'KORB_Patient_Treatment_Schedule.html',
      'KORB_Provider_Clinical_Reference.html'
    ],
    changelog: [
      '2026-07-31 (v1.1): Foundation BPC-157 corrected from [1,6] to [1,8] per confirmation ' +
      'from Don (Director of Clinical Operations & Lead Provider) — the course was updated ' +
      'to 8 weeks on / 8-week washout some weeks prior, to align with the 16-week cycle. ' +
      'Both live tools still show the pre-update 6-week value as of this date and need ' +
      'a matching correction. Gateway/Peak BPC-157 (6-week base-protocol course, Weeks 3-8) ' +
      'is unaffected and unchanged.'
    ]
  },

  // ── PHARMACIES ────────────────────────────────────────────────────────────
  pharmacies: {
    premier:   { name: 'Premier Pharmacy',   color: '#1565C0' },
    greenwich: { name: 'Greenwich Pharmacy', color: '#2E7D32' }
  },

  // ── INJECTION INSTRUCTIONS (per agent/dose key, per pharmacy) ────────────
  // This is the number that matters most. Verified identical between
  // Patient Treatment Schedule's INSTR block and Provider Clinical
  // Reference's ACTUAL_DIRECTIONS block on 2026-07-31.
  instructions: {
    sermorelin: {
      premier:   'Inject 20 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 7 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    sermorelin300: {
      premier:   'Inject 30 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 10 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    sermorelin400: {
      premier:   'Inject 40 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 13 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    sermorelin500: {
      premier:   'Inject 50 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 17 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    bpc157: {
      premier:   'Inject 13 units subcutaneously once daily.',
      greenwich: 'Inject 17 units subcutaneously once daily.'
    },
    cjcipam: {
      premier:   'Inject 5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.',
      greenwich: 'Inject 5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.'
    },
    cjcipam150: {
      premier:   'Inject 7.5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.',
      greenwich: 'Inject 7.5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.'
    },
    cjcipam200: {
      premier:   'Inject 10 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.',
      greenwich: 'Inject 10 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.'
    },
    ghkcu: {
      premier:   'Inject 20 units subcutaneously three times weekly in the evening.',
      greenwich: 'Inject 20 units subcutaneously three times weekly in the evening.'
    },
    tesamorelin1mg: {
      premier:   'Inject 20 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).',
      greenwich: 'Inject 33 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).'
    },
    tesamorelin15mg: {
      premier:   'Inject 30 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).',
      greenwich: 'Inject 50 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).'
    },
    tesamorelin2mg: {
      premier:   'Inject 40 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).',
      greenwich: 'Inject 67 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).'
    }
  },

  // ── SYRINGE STANDARDS BY PHARMACY ───────────────────────────────
  // Premier ships 100-unit syringes as standard for every prescription, so no
  // dose requires a label callout. Greenwich ships 50-unit syringes as standard,
  // so any dose that fills or exceeds that barrel must state 100-UNIT SYRINGES
  // in its Pharmacy Instructions. Enforced by selfCheck().
  syringes: {
    premier:   { standardUnits: 100, calloutAtOrAbove: null },
    greenwich: { standardUnits: 50,  calloutAtOrAbove: 50 }
  },

  // ── PROVIDER / TEBRA INSTRUCTION PHRASING ────────────────────────
  instructionsRx: {
  sermorelin: {
    premier:'Inject 20 units subcutaneously at bedtime, 6 days on, 1 day off (Monday through Saturday, Sunday off recommended), on an empty stomach.',
    greenwich:'Inject 7 units subcutaneously once daily at bedtime, on an empty stomach. Monday through Saturday, Sunday off recommended.'
  },
  sermorelin300: {
    premier:'Inject 30 units subcutaneously at bedtime, 6 days on, 1 day off (Monday through Saturday, Sunday off recommended), on an empty stomach.',
    greenwich:'Inject 10 units subcutaneously once daily at bedtime, on an empty stomach. Monday through Saturday, Sunday off recommended.'
  },
  sermorelin400: {
    premier:'Inject 40 units subcutaneously at bedtime, 6 days on, 1 day off (Monday through Saturday, Sunday off recommended), on an empty stomach.',
    greenwich:'Inject 13 units subcutaneously once daily at bedtime, on an empty stomach. Monday through Saturday, Sunday off recommended.'
  },
  sermorelin500: {
    premier:'Inject 50 units subcutaneously at bedtime, 6 days on, 1 day off (Monday through Saturday, Sunday off recommended), on an empty stomach.',
    greenwich:'Inject 17 units subcutaneously once daily at bedtime, on an empty stomach. Monday through Saturday, Sunday off recommended.'
  },
  bpc157: {
    premier:'Inject 13 units subcutaneously once daily.',
    greenwich:'Inject 17 units subcutaneously once daily.'
  },
  cjcipam: {
    premier:'Inject 5 units subcutaneously Monday through Saturday, before bed, on an empty stomach.',
    greenwich:'Inject 5 units subcutaneously once daily before bed, on an empty stomach. Monday through Saturday, Sunday off recommended.'
  },
  cjcipam150: {
    premier:'Inject 7.5 units subcutaneously Monday through Saturday, before bed, on an empty stomach.',
    greenwich:'Inject 7.5 units subcutaneously once daily before bed, on an empty stomach. Monday through Saturday, Sunday off recommended.'
  },
  cjcipam200: {
    premier:'Inject 10 units subcutaneously Monday through Saturday, before bed, on an empty stomach.',
    greenwich:'Inject 10 units subcutaneously once daily before bed, on an empty stomach. Monday through Saturday, Sunday off recommended.'
  },
  ghkcu: {
    premier:'Inject 20 units subcutaneously three times weekly in the evening.',
    greenwich:'Inject 20 units subcutaneously three times weekly in the evening.'
  },
  tesamorelin1mg: {
    premier:'Inject 20 units subcutaneously every evening, Monday through Saturday (6 days on, 1 day off).',
    greenwich:'Inject 33 units subcutaneously every evening, Monday through Saturday (6 days on, 1 day off).'
  },
  tesamorelin15mg: {
    premier:'Inject 30 units subcutaneously every evening, Monday through Saturday (6 days on, 1 day off).',
    greenwich:'Inject 50 units subcutaneously every evening, Monday through Saturday (6 days on, 1 day off).'
  },
  tesamorelin2mg: {
    premier:'Inject 40 units subcutaneously every evening, Monday through Saturday (6 days on, 1 day off).',
    greenwich:'Inject 67 units subcutaneously every evening, Monday through Saturday (6 days on, 1 day off).'
  }
},

  // ── COUNSELING / MONITORING ────────────────────────────────
  counselingText: { serm: SERM_COUNSEL, cjc: CJC_COUNSEL, tesa: TESA_COUNSEL },
  monitoringText: { serm: SERM_MONITOR, tesa: TESA_MONITOR },

  // ── TEBRA COMPOUNDED DRUG FAVORITE FIELDS ───────────────────────
  // Exact values entered in Tebra. Every entry is Refill 0.
  prescribing: {
  sermorelin: {
    name: 'Sermorelin',
    premier: {
      label: 'PREMIER – Sermorelin 200 mcg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'Sermorelin 1 mg/ml inj', copy: true },
        { field: 'Name', val: 'PREMIER – Sermorelin 200 mcg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '18', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ SERMORELIN 20 UNITS SUBQ HS, MON-SAT, EMPTY STOMACH. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – Sermorelin 0.6 mg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'KBH   Sermorelin 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – Sermorelin 0.6 mg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '15', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'Inject as directed by prescriber.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Sunday off recommended · Active all 16 weeks of cycle',
    timing: 'Bedtime, on an empty stomach (\u22652 hrs post-meal)',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: SERM_COUNSEL,
    monitor: SERM_MONITOR
  },
  sermorelin300: {
    name: 'Sermorelin 300mcg',
    premier: {
      label: 'PREMIER – Sermorelin 300 mcg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'Sermorelin 1 mg/ml inj', copy: true },
        { field: 'Name', val: 'PREMIER – Sermorelin 300 mcg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '27', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ SERMORELIN 30 UNITS SUBQ HS, MON-SAT, EMPTY STOMACH. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – Sermorelin 0.9 mg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'KBH   Sermorelin 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – Sermorelin 0.9 mg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '15', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT SERMORELIN 10 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON, 1 DAY OFF (MONDAY THROUGH SATURDAY, SUNDAY OFF RECOMMENDED), ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Sunday off recommended · Active all 16 weeks of cycle',
    timing: 'Bedtime, on an empty stomach (\u22652 hrs post-meal)',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: SERM_COUNSEL,
    monitor: SERM_MONITOR
  },
  sermorelin400: {
    name: 'Sermorelin 400mcg',
    premier: {
      label: 'PREMIER – Sermorelin 400 mcg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'Sermorelin 1 mg/ml inj', copy: true },
        { field: 'Name', val: 'PREMIER – Sermorelin 400 mcg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '36', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ SERMORELIN 40 UNITS SUBQ HS, MON-SAT, EMPTY STOMACH. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – Sermorelin 1.2 mg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'KBH   Sermorelin 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – Sermorelin 1.2 mg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '15', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT SERMORELIN 13 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON, 1 DAY OFF (MONDAY THROUGH SATURDAY, SUNDAY OFF RECOMMENDED), ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Sunday off recommended · Active all 16 weeks of cycle',
    timing: 'Bedtime, on an empty stomach (\u22652 hrs post-meal)',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: SERM_COUNSEL,
    monitor: SERM_MONITOR
  },
  sermorelin500: {
    name: 'Sermorelin 500mcg',
    premier: {
      label: 'PREMIER – Sermorelin 500 mcg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'Sermorelin 1 mg/ml inj', copy: true },
        { field: 'Name', val: 'PREMIER – Sermorelin 500 mcg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '36', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ SERMORELIN 50 UNITS SUBQ HS, MON-SAT, EMPTY STOMACH. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – Sermorelin 1.5 mg SQ Injection',
      fields: [
        { field: 'Drug Formulation', val: 'KBH   Sermorelin 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – Sermorelin 1.5 mg SQ Injection', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '15', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT SERMORELIN 17 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON, 1 DAY OFF (MONDAY THROUGH SATURDAY, SUNDAY OFF RECOMMENDED), ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Sunday off recommended · Active all 16 weeks of cycle',
    timing: 'Bedtime, on an empty stomach (\u22652 hrs post-meal)',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: SERM_COUNSEL,
    monitor: SERM_MONITOR
  },
  bpc157: {
    name: 'BPC-157',
    premier: {
      label: 'PREMIER – BPC-157 500 mcg SQ Inj Daily',
      fields: [
        { field: 'Drug Formulation', val: 'BPC-157, 4mg/ml inj', copy: true },
        { field: 'Name', val: 'PREMIER – BPC-157 500mcg SQ Inj Daily', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '12', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '56', copy: true },
        { field: 'Patient Instructions', val: 'INJ 13 UNITS SUBQ DAILY. SYR QTY #50', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – BPC-157 0.6 MG SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH   BPC-157 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – BPC-157 0.6 MG SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '10', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '56', copy: true },
        { field: 'Patient Instructions', val: 'Inject as directed by prescriber.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Daily SQ · Weeks 3–8 of each 16-week cycle (starts 2 weeks after Sermorelin)',
    timing: 'Any consistent time daily. No food restriction.',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: [
      'Investigational recovery-support adjunct — not a cure or injury reversal',
      'Does not replace appropriate medical evaluation, imaging, or physical therapy when indicated',
      'Course-based cycling — do not continue indefinitely without provider reassessment',
      'Report injection site reactions, rash, swelling, or difficulty breathing immediately',
      'Lifestyle foundations (sleep, nutrition, structured rehab) remain critical',
      'Discard vial 28 days after initial puncture — do not use beyond this date regardless of remaining volume',
    ],
    monitor: [
      'Recovery progress toward documented goal',
      'Soft tissue / tendon / musculoskeletal symptom trend',
      'Exercise recovery quality',
      'Injection site reactions',
      'Any systemic symptoms (rash, swelling, breathing change)',
      'Need for specialist evaluation',
      'Course completion vs. discontinuation',
      'Lifestyle: sleep, nutrition, structured rehab adherence',
    ]
  },
  cjcipam: {
    name: 'CJC-1295 / Ipamorelin 100mcg/100mcg',
    premier: {
      label: 'PREMIER – CJC/Ipam 100 mcg/100 mcg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'CJC-1295 / Ipamorelin 2 mg/2 mg per 1mL inj', copy: true },
        { field: 'Name', val: 'PREMIER – CJC/Ipam 100 mcg/100 mcg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '9', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ 5 UNITS SUBQ HS, MON-SAT, EMPTY STOMACH. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – CJC/Ipam 100 mcg/100 mcg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH CJC/Ipamorelin 2mg/2mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – CJC/Ipam 100 mcg/100 mcg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '15', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT 5 UNITS SUBCUTANEOUSLY MON–SAT BEFORE BED ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing: 'Before bed, on an empty stomach',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: CJC_COUNSEL,
    monitor: SERM_MONITOR
  },
  cjcipam150: {
    name: 'CJC-1295 / Ipamorelin 150mcg/150mcg',
    premier: {
      label: 'PREMIER – CJC/Ipam 150 mcg/150 mcg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'CJC-1295 / Ipamorelin 2 mg/2 mg per 1mL inj', copy: true },
        { field: 'Name', val: 'PREMIER – CJC/Ipam 150 mcg/150 mcg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '9', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ 7.5 UNITS SUBQ HS, MON-SAT, EMPTY STOMACH. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – CJC/Ipam 150 mcg/150 mcg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH CJC/Ipamorelin 2mg/2mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – CJC/Ipam 150 mcg/150 mcg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '15', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT 7.5 UNITS SUBCUTANEOUSLY MON–SAT BEFORE BED ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing: 'Before bed, on an empty stomach',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: CJC_COUNSEL,
    monitor: SERM_MONITOR
  },
  cjcipam200: {
    name: 'CJC-1295 / Ipamorelin 200mcg/200mcg',
    premier: {
      label: 'PREMIER – CJC/Ipam 200 mcg/200 mcg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'CJC-1295 / Ipamorelin 2 mg/2 mg per 1mL inj', copy: true },
        { field: 'Name', val: 'PREMIER – CJC/Ipam 200 mcg/200 mcg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '9', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ 10 UNITS SUBQ HS, MON-SAT, EMPTY STOMACH. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – CJC/Ipam 200 mcg/200 mcg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH CJC/Ipamorelin 2mg/2mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – CJC/Ipam 200 mcg/200 mcg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '15', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT 10 UNITS SUBCUTANEOUSLY MON–SAT BEFORE BED ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing: 'Before bed, on an empty stomach',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: CJC_COUNSEL,
    monitor: SERM_MONITOR
  },
  ghkcu: {
    name: 'GHK-Cu',
    premier: {
      label: 'PREMIER – GHK-Cu 2 mg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'GHK-Cu 10 mg/ml inj', copy: true },
        { field: 'Name', val: 'PREMIER – GHK-Cu 2 mg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '6', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '28', copy: true },
        { field: 'Patient Instructions', val: 'INJ 20 UNITS SUBQ, 3X/WK EVENING. SYR QTY #20', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – GHK-Cu 2mg SQ Inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH GHK-Cu 10mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – GHK-Cu 2mg SQ Inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '5', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '28', copy: true },
        { field: 'Patient Instructions', val: 'Inject as directed by prescriber.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: '3x weekly SQ (evening) · Active Weeks 1–4, off Weeks 5–16 of cycle',
    timing: '3 times weekly, evening',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: [
      'Investigational tissue/skin-support peptide — not a cure or guaranteed outcome',
      'Copper-containing compound — requires copper/zinc lab monitoring per protocol',
      'Course-based cycling (4 weeks on / 12 weeks off) — do not extend without provider reassessment',
      'Report injection site reactions, rash, or unusual symptoms immediately',
      'Discard vial 28 days after initial puncture — do not use beyond this date regardless of remaining volume',
    ],
    monitor: [
      'Skin / tissue quality trend toward documented goal',
      'Injection site reactions',
      'Copper, RBC / Zinc, RBC / Ceruloplasmin (baseline Standard panel)',
      'Any systemic symptoms',
      'Course completion vs. discontinuation',
    ]
  },
  tesamorelin1mg: {
    name: 'Tesamorelin 1mg',
    premier: {
      label: 'PREMIER – Tesamorelin SQ 1 mg inj',
      fields: [
        { field: 'Drug Formulation', val: 'Tesamorelin inj 5 mg/ml', copy: true },
        { field: 'Name', val: 'PREMIER – Tesamorelin SQ 1 mg inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '18', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ 20 UNITS SUBQ, EVENING, MON-SAT. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – Tesamorelin SQ 1 mg inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH Tesamorelin 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – Tesamorelin SQ 1 mg inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '30', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT 33 UNITS SUBCUTANEOUSLY EVERY EVENING MONDAY THROUGH SATURDAY (6 DAYS ON, 1 DAY OFF)', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing: 'Evening',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: TESA_COUNSEL,
    monitor: TESA_MONITOR
  },
  tesamorelin15mg: {
    name: 'Tesamorelin 1.5mg',
    premier: {
      label: 'PREMIER – Tesamorelin SQ 1.5 mg inj',
      fields: [
        { field: 'Drug Formulation', val: 'Tesamorelin inj 5 mg/ml', copy: true },
        { field: 'Name', val: 'PREMIER – Tesamorelin SQ 1.5 mg inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '27', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ 30 UNITS SUBQ, EVENING, MON-SAT. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – Tesamorelin SQ 1.5 mg inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH Tesamorelin 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – Tesamorelin SQ 1.5 mg inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '45', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT 50 UNITS SUBCUTANEOUSLY EVERY EVENING MONDAY THROUGH SATURDAY (6 DAYS ON, 1 DAY OFF)', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. DISPENSE 100-UNIT SYRINGES for this prescription \u2014 the 50-unit dose fills a standard 50-unit syringe to capacity with no headroom.', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing: 'Evening',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: TESA_COUNSEL,
    monitor: TESA_MONITOR
  },
  tesamorelin2mg: {
    name: 'Tesamorelin 2mg',
    premier: {
      label: 'PREMIER – Tesamorelin SQ 2 mg inj',
      fields: [
        { field: 'Drug Formulation', val: 'Tesamorelin inj 5 mg/ml', copy: true },
        { field: 'Name', val: 'PREMIER – Tesamorelin SQ 2 mg inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '36', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJ 40 UNITS SUBQ, EVENING, MON-SAT. SYR QTY #80', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    greenwich: {
      label: 'GREENWICH – Tesamorelin SQ 2 mg inj',
      fields: [
        { field: 'Drug Formulation', val: 'KBH Tesamorelin 3mg/mL', copy: true },
        { field: 'Name', val: 'GREENWICH – Tesamorelin SQ 2 mg inj', copy: true },
        { field: 'Allow Substitution', val: 'Yes — select Allow Substitution', copy: false },
        { field: 'Quantity', val: '60', copy: true },
        { field: 'Unit', val: 'ml', copy: true },
        { field: 'Refill', val: '0', copy: true },
        { field: 'Days Supply', val: '84', copy: true },
        { field: 'Patient Instructions', val: 'INJECT 67 UNITS SUBCUTANEOUSLY EVERY EVENING MONDAY THROUGH SATURDAY (6 DAYS ON, 1 DAY OFF)', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. DISPENSE 100-UNIT SYRINGES for this prescription \u2014 the 67-unit dose exceeds the standard 50-unit syringe.', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing: 'Evening',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: TESA_COUNSEL,
    monitor: TESA_MONITOR
  }
},

  // ── PROGRAM SHAPE ────────────────────────────────────────
  foundationAgents: {
  sermorelin: { key:'sermorelin', label:'Sermorelin', onWeeks:[1,12], doseLabel:'200 mcg', titrate:false,
    schedule:'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off recommended · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing:'Bedtime, on an empty stomach (\u22652 hrs post-meal)' },
  bpc157: { key:'bpc157', label:'BPC-157', onWeeks:[1,8], doseLabel:'500 mcg', titrate:false,
    schedule:'Daily SQ · Active Weeks 1–8, off Weeks 9–16 of cycle',
    timing:'Any consistent time daily. No food restriction.' },
  cjcipam: { key:'cjcipam', label:'CJC-1295 / Ipamorelin', onWeeks:[1,12], doseLabel:'(per pharmacy — see Rx reference)',
    doseLabelByPharm:{ greenwich:'100 mcg CJC-1295 / 100 mcg Ipamorelin', premier:'100 mcg CJC-1295 / 100 mcg Ipamorelin' },
    titrate:false,
    schedule:'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing:'Before bed, on an empty stomach' }
},
  peakSchedule: {
  cjcipam: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Before bed, on an empty stomach' },
  tesamorelin1mg: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Evening' },
  tesamorelin2mg: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Mon–Sat, Sunday off · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Evening' },
  bpc157: { schedule:'Daily SQ · Weeks 3–8 of each 16-week cycle (starts 2 weeks after primary agent)', timing:'Any consistent time daily. No food restriction.' },
  ghkcu: { schedule:'3x weekly SQ (evening) · Optional add-on · Weeks 5–8 of each 16-week cycle', timing:'3 times weekly, evening' }
},
  peakPathways: {
  peakA: {
    label: 'Peak Performance — Pathway A',
    primaryKey: 'cjcipam',
    primaryLabel: 'CJC-1295 / Ipamorelin',
    doseSelectable: false
  },
  peakB: {
    label: 'Peak Performance — Pathway B',
    primaryKey: null, // resolved at runtime to tesamorelin1mg / tesamorelin2mg based on dose selector
    primaryLabel: 'Tesamorelin',
    doseSelectable: true
  }
},

  // ── AGENT METADATA ────────────────────────────────────────────────────────
  // label / dose / color / schedule / timing / how = display metadata.
  // onWeeksFoundation = active-week range when this agent runs as a Foundation
  //   standalone agent (single-agent program, no stagger).
  // onWeeksAddon = active-week range when this agent runs inside Gateway or
  //   Peak (staggered start behind the primary agent).
  agents: {
    sermorelin: {
      label: 'Sermorelin', dose: '200 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin300: {
      label: 'Sermorelin', dose: '300 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin400: {
      label: 'Sermorelin', dose: '400 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin500: {
      label: 'Sermorelin', dose: '500 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    bpc157: {
      label: 'BPC-157', dose: '500 mcg', color: '#1D7A35',
      // CONFIRMED 2026-07-31 by Don (Director of Clinical Operations & Lead Provider):
      // Foundation BPC-157 was updated from a 6-week course to an 8-week course
      // (8 weeks on, 8-week washout) some weeks prior to this file's creation, so it
      // fits the 16-week cycle the same way every other program does. Both live
      // tools (Patient Treatment Schedule, Provider Clinical Reference) still show
      // the pre-update 6-week value [1,6] as of this date and need to be corrected —
      // see korb_doc verification doc, "Where This Data Still Lives."
      onWeeksFoundation: [1, 8],
      // BPC-157 inside Gateway/Peak is part of the BASE PROTOCOL, not an optional
      // add-on — only GHK-Cu is optional. Unchanged by the above: still a 6-week
      // course, starting Week 3 (2 weeks after the primary agent), through Week 8.
      onWeeksGatewayPeakBase: [3, 8],
      schedule: 'Every day (7 days a week)', timing: 'Any consistent time · No food restriction',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: 'daily', pillBg: '#1D7A35'
    },
    cjcipam: {
      label: 'CJC-1295 / Ipamorelin', dose: '100 mcg CJC-1295 / 100 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    cjcipam150: {
      label: 'CJC-1295 / Ipamorelin', dose: '150 mcg CJC-1295 / 150 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    cjcipam200: {
      label: 'CJC-1295 / Ipamorelin', dose: '200 mcg CJC-1295 / 200 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    ghkcu: {
      label: 'GHK-Cu', dose: '2 mg', color: '#4A148C',
      onWeeksOptionalAddon: [5, 8],   // Gateway/Peak optional add-on only — never Foundation. This is the ONLY true optional add-on in the program structure.
      schedule: '3 times per week (evenings)', timing: 'Evening · Choose consistent days (e.g. Mon / Wed / Fri)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '3×/week', pillBg: '#6A1B9A'
    },
    tesamorelin1mg: {
      label: 'Tesamorelin 1 mg', dose: '1 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    tesamorelin15mg: {
      label: 'Tesamorelin 1.5 mg', dose: '1.5 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    tesamorelin2mg: {
      label: 'Tesamorelin 2 mg', dose: '2 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    }
  },

  // ── PROGRAM → AGENT MAPPING ──────────────────────────────────────────────
  // How each program tier resolves to a set of agent keys. Dose-selectable
  // programs resolve the primary agent key at runtime from the patient's
  // dose selection (see resolvePrimaryKey below).
  programs: {
    foundation: {
      label: 'Foundation Program',
      agentChoices: ['sermorelin', 'cjcipam', 'bpc157'],   // provider selects ONE
      stagger: false,
      optionalAddon: null   // GHK-Cu is never a Foundation option
    },
    gateway: {
      label: 'Gateway Program',
      primaryFamily: 'sermorelin',
      primaryDoseOptions: ['200', '300', '400', '500'],
      baseProtocol: ['sermorelin', 'bpc157'],   // BPC-157 is part of the base protocol, not optional
      optionalAddon: 'ghkcu',                    // the only optional add-on
      stagger: true   // primary day 1, BPC-157 week 3, GHK-Cu (if on) week 5
    },
    peakA: {
      label: 'Peak Performance — Pathway A',
      primaryFamily: 'cjcipam',
      primaryDoseOptions: ['100', '150', '200'],
      baseProtocol: ['cjcipam', 'bpc157'],
      optionalAddon: 'ghkcu',
      stagger: true
    },
    peakB: {
      label: 'Peak Performance — Pathway B',
      primaryFamily: 'tesamorelin',
      primaryDoseOptions: ['1mg', '15mg', '2mg'],
      baseProtocol: ['tesamorelin', 'bpc157'],
      optionalAddon: 'ghkcu',
      stagger: true
    }
  },

  // ── HELPERS ───────────────────────────────────────────────────────────────
  // Resolve a dose-selector value to its AGENTS/instructions key.
  // e.g. resolvePrimaryKey('sermorelin','200') -> 'sermorelin'
  //      resolvePrimaryKey('sermorelin','400') -> 'sermorelin400'
  //      resolvePrimaryKey('tesamorelin','1mg') -> 'tesamorelin1mg'
  resolvePrimaryKey: function (family, doseVal) {
    if (family === 'sermorelin') return (doseVal === '200') ? 'sermorelin' : 'sermorelin' + doseVal;
    if (family === 'cjcipam')    return (doseVal === '100') ? 'cjcipam'    : 'cjcipam' + doseVal;
    if (family === 'tesamorelin') return 'tesamorelin' + doseVal;
    return family;
  },

  // Get the injection instruction text for a given agent key + pharmacy.
  getInstruction: function (agentKey, pharmacyKey) {
    var entry = this.instructions[agentKey];
    return entry ? entry[pharmacyKey] : 'Follow your prescription label.';
  },

  // Get the active-week range [start, end] for an agent key in a given
  // program context: 'foundation' (standalone course), 'gatewayPeakBase'
  // (BPC-157 as part of the Gateway/Peak base protocol — NOT optional), or
  // 'optionalAddon' (GHK-Cu only — the one true optional add-on).
  getActiveWeeks: function (agentKey, context) {
    var a = this.agents[agentKey];
    if (!a) return null;
    if (context === 'foundation') return a.onWeeksFoundation;
    if (context === 'gatewayPeakBase') return a.onWeeksGatewayPeakBase;
    if (context === 'optionalAddon') return a.onWeeksOptionalAddon;
    return null;
  }
};

/* ============================================================================
   MIGRATION NOTE FOR WHOEVER WIRES THIS IN LATER:

   Patient Treatment Schedule currently reads from its own local `INSTR` and
   `AGENTS` variables. Provider Clinical Reference currently reads from its
   own local `ACTUAL_DIRECTIONS`, `FOUNDATION_AGENTS`, and `PEAK_SCHEDULE`
   variables. Neither file loads this script yet.

   To adopt this file in either tool:
     1. Add <script src="korb-dosing-data.js"></script> before that tool's
        own <script> block.
     2. Replace local lookups (INSTR[key][pk], AGENTS[key].onWeeks, etc.)
        with the equivalent KORB_DOSING call.
     3. Re-render the tool and visually diff against the current live
        version before pushing — a wiring mistake here touches every
        patient's dosing instructions.
     4. Do this one tool at a time, not both at once, so a problem in one
        doesn't take down the other.
   ============================================================================ */


/* ---------------------------------------------------------------------------
   selfCheck(): verifies the two instruction sets agree on unit counts, and that
   every prescribing entry is Refill 0. Returns an array of problems (empty = OK).
   Call from the browser console: KORB_DOSING.selfCheck()
   --------------------------------------------------------------------------- */
KORB_DOSING.selfCheck = function(){
  var problems = [];
  var units = function(t){ var m = t && t.match(/([0-9]+(?:\.[0-9]+)?)\s*units/i); return m ? m[1] : null; };
  Object.keys(KORB_DOSING.instructions).forEach(function(k){
    ['premier','greenwich'].forEach(function(ph){
      var a = KORB_DOSING.instructions[k] && KORB_DOSING.instructions[k][ph];
      var b = KORB_DOSING.instructionsRx[k] && KORB_DOSING.instructionsRx[k][ph];
      if (a && b && units(a) !== units(b)) {
        problems.push('UNIT MISMATCH ' + k + '/' + ph + ': patient=' + units(a) + ' rx=' + units(b));
      }
    });
  });
  Object.keys(KORB_DOSING.prescribing).forEach(function(k){
    ['premier','greenwich'].forEach(function(ph){
      var e = KORB_DOSING.prescribing[k] && KORB_DOSING.prescribing[k][ph];
      if (!e || !e.fields) return;
      e.fields.forEach(function(f){
        if (f.field === 'Refill' && f.val !== '0') {
          problems.push('UNEXPECTED REFILL ' + k + '/' + ph + ': ' + f.val);
        }
      });
    });
  });
  // Syringe capacity guard, driven by KORB_DOSING.syringes above.
  Object.keys(KORB_DOSING.instructions).forEach(function(k){
    Object.keys(KORB_DOSING.syringes).forEach(function(ph){
      var cfg = KORB_DOSING.syringes[ph];
      if (!cfg || cfg.calloutAtOrAbove == null) return;
      var t = KORB_DOSING.instructions[k] && KORB_DOSING.instructions[k][ph];
      var m = t && t.match(/([0-9.]+)\s*units/i);
      if (!m) return;
      var n = parseFloat(m[1]);
      if (n < cfg.calloutAtOrAbove) return;
      var e = KORB_DOSING.prescribing[k] && KORB_DOSING.prescribing[k][ph];
      var pi = e && e.fields && (e.fields.filter(function(f){return f.field==='Pharmacy Instructions';})[0]||{}).val;
      if (!pi || pi.indexOf('100-UNIT SYRINGES') === -1) {
        problems.push('SYRINGE ' + k + '/' + ph + ': ' + n + ' units meets or exceeds the ' +
                      cfg.standardUnits + '-unit standard syringe, but Pharmacy Instructions does not state 100-UNIT SYRINGES');
      }
    });
  });

  if (!problems.length) console.log('KORB_DOSING selfCheck: OK');
  else problems.forEach(function(p){ console.warn('KORB_DOSING selfCheck: ' + p); });
  return problems;
};
