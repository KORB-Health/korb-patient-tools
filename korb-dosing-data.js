/* ============================================================================
   KORB HEALTH — SHARED DOSING & PRESCRIBING DATA
   Single source of truth for peptide dosing, schedules, pharmacy instructions,
   and Tebra prescribing fields across KORB tools.

   VERSION: 2.6   UPDATED: 2026-08-12

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
     `instructions`   patient-facing phrasing (Patient Treatment Schedule, Tracker)
     `instructionsRx` provider phrasing shown in the Provider Reference
     `prescribing[].fields 'Patient Instructions'` the actual Tebra value sent to the
       pharmacy. Premier carries the full direction; Greenwich carries
       "as directed by provider" because Greenwich requires it, KORB not following
       their protocols. The provider still sees the full direction in instructionsRx.
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
  '6 days ON / 1 day OFF pattern must be followed — your rest day is shown in your KORB treatment schedule',
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
  '6 days ON / 1 day OFF pattern must be followed — your rest day is shown in your KORB treatment schedule',
  'Take at bedtime on an empty stomach — timing is clinically relevant',
  'Discard vial 28 days after initial puncture — do not use beyond this date regardless of remaining volume',
];
var TESA_COUNSEL = [
  'GH secretagogue targeting visceral fat reduction and body composition — not GH replacement',
  'Lifestyle (nutrition, resistance training, sleep) remains critical — not a substitute',
  'Response varies between patients; benefit not guaranteed',
  'Do not combine with other GH-axis therapies without provider approval',
  '6 days ON / 1 day OFF pattern must be followed — your rest day is shown in your KORB treatment schedule',
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
    version: '2.7',
    lastVerified: '2026-08-12',
    verifiedAgainst: [
      'KORB_Patient_Treatment_Schedule.html',
      'KORB_Provider_Clinical_Reference.html'
    ],
    changelog: [
    '2026-09-06 (v2.7): THE FOUNDATION TITRATION IS NOW REACHABLE. v2.6 added ' +
    'programs.foundation.primaryDoseOptions - sermorelin 200/300/400, CJC ' +
    '100/150/200 - with prescribing records, sig text and schedules behind all ' +
    'six. None of it rendered. The provider tool reads foundationAgents, which ' +
    'still said titrate:false with a single fixed doseLabel, so a provider saw ' +
    'one dose per agent and the ladder existed only as a declaration. Two parts ' +
    'of this file disagreeing, and the tool read the half nobody updated. ' +
    'foundationAgents is reconciled: titrate:true for sermorelin and CJC, ' +
    'titrationLadder on each, doseLabel demoted to a starting-dose fallback. The ' +
    'tool gains a Foundation Dose selector populated from the data, and resolves ' +
    'the selection through resolvePrimaryKey so the Tebra fields, patient ' +
    'directions, counseling and copy-paste note all follow the chosen dose ' +
    'rather than the starting one. Verified by driving it: sermorelin dispenses ' +
    '18/27/36 ml across the ladder and CJC stays at 9 ml at all three, which is ' +
    'the arithmetic the v2.6 note claimed. The 50 mcg increment wording is ' +
    'replaced by the real ladder. GUARD ADDED, regression-tested four ways: ' +
    'primaryDoseOptions and foundationAgents.titrationLadder must match in both ' +
    'directions, and an agent with more than one option must declare ' +
    'titrate:true. WHY THIS WAS MISSED: the v2.6 guard checked that every ' +
    'offered dose resolved to a prescribing record. It passed. It verified the ' +
    'back half of the path and never asked whether anything surfaced the front ' +
    'half. A dose nothing exposes is not an offered dose.',

      '2026-09-05 (v2.6): FOUNDATION GAINS TITRATION. Decided by Don. ' +
      'CJC-1295/Ipamorelin in Foundation now matches Peak Pathway A exactly at ' +
      '100 / 150 / 200 mcg. Sermorelin matches Gateway minus the 500 mcg step, so ' +
      '200 / 300 / 400. Foundation previously offered a single dose per agent. ' +
      'WHY 500 IS EXCLUDED, and it is a margin decision rather than a clinical ' +
      'ceiling: Premier sermorelin is 1 mg/ml so dispensed volume scales with the ' +
      'dose - 18 ml at 200 mcg, 27 at 300, 36 at 400, and 45 at a correctly ' +
      'supplied 500. That last step is the one that puts a Foundation patient into ' +
      'another vial each month and Foundation margin does not cover it. A patient ' +
      'who needs 500 mcg moves to Gateway rather than being held at 400. VERIFIED ' +
      'WHILE IMPLEMENTING: CJC titration costs nothing. Its dispensed quantity is ' +
      '9 ml at all three doses because at 2 mg/ml even 200 mcg needs only 7.2 ml a ' +
      'cycle, so the 9 ml already carries the house 1.25x margin at the top of the ' +
      'ladder. Adding 150 and 200 changes no quantity, no vial and no cost - the ' +
      'reasoning behind the decision holds against the records. ALSO FIXED: ' +
      'peakSchedule was missing cjcipam150, cjcipam200 and tesamorelin15mg, all ' +
      'three reachable from primaryDoseOptions, so a provider selecting them got a ' +
      'blank schedule. Added. GUARD ADDED and verified by regression: every dose a ' +
      'program offers must resolve to a prescribing record, and to a peakSchedule ' +
      'entry where the program declares usesPeakSchedule. Gateway is staggered but ' +
      'renders its schedule from hardcoded strings in the provider tool rather than ' +
      'from this file, so it declares false - that hardcoding is a separate known ' +
      'defect and this flag records it rather than hiding it.',

      '2026-07-31 (v1.1): Foundation BPC-157 corrected from [1,6] to [1,8] per confirmation ' +
      'from Don (Director of Clinical Operations & Lead Provider) — the course was updated ' +
      'to 8 weeks on / 8-week washout some weeks prior, to align with the 16-week cycle. ' +
      'The live Provider Clinical Reference was patched to [1,8] on 2026-08-11. Gateway/Peak BPC-157 (6-week base-protocol course, Weeks 3-8) ' +
      'is unaffected and unchanged.',

      '2026-08-10 (v1.2, live lineage): Rest-day language corrected across all 6-on/1-off ' +
      'agents. Dr. Rose confirmed the protocol is 6 days on, 1 day off, and that the ' +
      'specific weekday is a RECOMMENDATION for ease of patient recall, not a clinical ' +
      'requirement. Sunday is no longer stated as a fixed rest day. This correction was ' +
      'made in the deployed v1.2 file only; v2.2 predates it.',

      '2026-08-11 (v2.3): MERGE. v2.2 architecture (prescribing, syringes, selfCheck, ' +
      'instructionsRx, foundationAgents, peakSchedule, peakPathways) combined with the ' +
      'v1.2 rest-day correction. Ported: 20 instructions strings, 10 agents.schedule ' +
      'fields, 15 display schedule fields across prescribing / foundationAgents / ' +
      'peakSchedule, and 3 counseling lines. NOT ported, on purpose: the 20 ' +
      'instructionsRx strings and the 20 prescribing Patient Instructions values. Those ' +
      'are the Tebra Compounded Drug Favorite fields that reach Premier and Greenwich, ' +
      'so they were held for clinical review rather than changed in the same pass. They ' +
      'remained as v2.2 had them, phrased three different ways across the agent ' +
      'families. Normalised in v2.4 below.',

      '2026-08-12 (v2.4): Sig standardisation, approved by Don. (1) The weekday is out of ' +
      'every direction string. 6 days on / 1 day off is the clinical requirement; the ' +
      'weekday was only a recall aid, and the Tracker already derives each patient\'s rest ' +
      'day from their own start date - leaving a fixed weekday on the label meant the bottle ' +
      'and the app could disagree. (2) Greenwich Tebra Patient Instructions are now ' +
      '"Inject as directed by provider. Follow your KORB treatment schedule." across all 12 ' +
      'agents. Greenwich requires this because KORB does not follow their protocols; it was ' +
      'already the stored value for sermorelin 200, BPC-157 and GHK-Cu, and is now ' +
      'consistent. The treatment-schedule pointer was added so the label is not ' +
      'instruction-free. (3) HS -> AT BEDTIME and SUBQ -> SUBCUTANEOUSLY, spelled out. ' +
      '(4) SYR QTY moved out of Patient Instructions into Pharmacy Instructions - it is an ' +
      'instruction to the pharmacy, not a direction to the patient, and it was printing on ' +
      'the label as though it were one. Also fixed: three Greenwich sermorelin sigs were 145 ' +
      'characters against a 140 limit and were at risk of silent truncation; two Greenwich ' +
      'tesamorelin pharmacy notes were 208 and 183 against a 170 limit. All strings are now ' +
      'ASCII-only - an en dash in the CJC-1295/Ipamorelin sig was the last non-ASCII ' +
      'character reaching a pharmacy system. instructionsRx stays detailed for both ' +
      'pharmacies so the provider still sees dose and timing. Sig wording approved 2026-08-12 ' +
      'by Don (Director of Clinical Operations & Lead Provider), the same authority that ' +
      'confirmed the BPC-157 [1,8] correction in v1.1. No further clinical sign-off is ' +
      'outstanding. REMAINING ACTION IS OPERATIONAL, NOT CLINICAL: the Tebra Compounded ' +
      'Drug Favorite entries are typed by hand inside Tebra and must be updated there ' +
      'before these sigs reach Premier or Greenwich. Deploying this file updates the ' +
      'tools only.',

      '2026-08-12 (v2.5): Pricing, lab protocol and state routing moved out of ' +
      'KORB_Provider_Clinical_Reference.html and into this file as pricing, labs and ' +
      'states. The provider tool now holds no clinical, pricing or routing values of ' +
      'its own - only presentation. This closes the last of the hardcoding: the tool ' +
      'previously carried 33 copies of the rest day while this file sat beside it in ' +
      'the same repo. Values were copied verbatim, not retyped, and the rewired tool ' +
      'was rendered and diffed against the previous build to confirm no behaviour ' +
      'change. FIELD_LEGEND and the US state-name lookup stay in the tool - they are ' +
      'presentation, not KORB data. Enables the FH&L provider reference documents to ' +
      'be generated from one source, the way the eleven GLP-1 documents are.'
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
      premier:   'Inject 20 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
      greenwich: 'Inject 7 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
    },
    sermorelin300: {
      premier:   'Inject 30 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
      greenwich: 'Inject 10 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
    },
    sermorelin400: {
      premier:   'Inject 40 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
      greenwich: 'Inject 13 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
    },
    sermorelin500: {
      premier:   'Inject 50 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
      greenwich: 'Inject 17 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
    },
    bpc157: {
      premier:   'Inject 13 units subcutaneously once daily.',
      greenwich: 'Inject 17 units subcutaneously once daily.'
    },
    cjcipam: {
      premier:   'Inject 5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
      greenwich: 'Inject 5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
    },
    cjcipam150: {
      premier:   'Inject 7.5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
      greenwich: 'Inject 7.5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
    },
    cjcipam200: {
      premier:   'Inject 10 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
      greenwich: 'Inject 10 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
    },
    ghkcu: {
      premier:   'Inject 20 units subcutaneously three times weekly in the evening.',
      greenwich: 'Inject 20 units subcutaneously three times weekly in the evening.'
    },
    tesamorelin1mg: {
      premier:   'Inject 20 units subcutaneously in the evening, 6 days on, 1 day off.',
      greenwich: 'Inject 33 units subcutaneously in the evening, 6 days on, 1 day off.'
    },
    tesamorelin15mg: {
      premier:   'Inject 30 units subcutaneously in the evening, 6 days on, 1 day off.',
      greenwich: 'Inject 50 units subcutaneously in the evening, 6 days on, 1 day off.'
    },
    tesamorelin2mg: {
      premier:   'Inject 40 units subcutaneously in the evening, 6 days on, 1 day off.',
      greenwich: 'Inject 67 units subcutaneously in the evening, 6 days on, 1 day off.'
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
    premier:'Inject 20 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
    greenwich:'Inject 7 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
  },
  sermorelin300: {
    premier:'Inject 30 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
    greenwich:'Inject 10 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
  },
  sermorelin400: {
    premier:'Inject 40 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
    greenwich:'Inject 13 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
  },
  sermorelin500: {
    premier:'Inject 50 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
    greenwich:'Inject 17 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
  },
  bpc157: {
    premier:'Inject 13 units subcutaneously once daily.',
    greenwich:'Inject 17 units subcutaneously once daily.'
  },
  cjcipam: {
    premier:'Inject 5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
    greenwich:'Inject 5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
  },
  cjcipam150: {
    premier:'Inject 7.5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
    greenwich:'Inject 7.5 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
  },
  cjcipam200: {
    premier:'Inject 10 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.',
    greenwich:'Inject 10 units subcutaneously at bedtime, 6 days on, 1 day off, on an empty stomach.'
  },
  ghkcu: {
    premier:'Inject 20 units subcutaneously three times weekly in the evening.',
    greenwich:'Inject 20 units subcutaneously three times weekly in the evening.'
  },
  tesamorelin1mg: {
    premier:'Inject 20 units subcutaneously in the evening, 6 days on, 1 day off.',
    greenwich:'Inject 33 units subcutaneously in the evening, 6 days on, 1 day off.'
  },
  tesamorelin15mg: {
    premier:'Inject 30 units subcutaneously in the evening, 6 days on, 1 day off.',
    greenwich:'Inject 50 units subcutaneously in the evening, 6 days on, 1 day off.'
  },
  tesamorelin2mg: {
    premier:'Inject 40 units subcutaneously in the evening, 6 days on, 1 day off.',
    greenwich:'Inject 67 units subcutaneously in the evening, 6 days on, 1 day off.'
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
        { field: 'Patient Instructions', val: 'INJECT SERMORELIN 20 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON 1 DAY OFF, ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active all 16 weeks of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT SERMORELIN 30 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON 1 DAY OFF, ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active all 16 weeks of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT SERMORELIN 40 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON 1 DAY OFF, ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active all 16 weeks of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT SERMORELIN 50 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON 1 DAY OFF, ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active all 16 weeks of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT 13 UNITS SUBCUTANEOUSLY ONCE DAILY', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 60 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
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
        { field: 'Patient Instructions', val: 'INJECT 5 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON 1 DAY OFF, ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT 7.5 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON 1 DAY OFF, ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT 10 UNITS SUBCUTANEOUSLY AT BEDTIME, 6 DAYS ON 1 DAY OFF, ON AN EMPTY STOMACH', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT 20 UNITS SUBCUTANEOUSLY THREE TIMES WEEKLY IN THE EVENING', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 20 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
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
        { field: 'Patient Instructions', val: 'INJECT 20 UNITS SUBCUTANEOUSLY IN THE EVENING, 6 DAYS ON 1 DAY OFF', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT 30 UNITS SUBCUTANEOUSLY IN THE EVENING, 6 DAYS ON 1 DAY OFF', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. DISPENSE 100-UNIT SYRINGES - the 50-unit dose fills a 50-unit syringe with no headroom.', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
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
        { field: 'Patient Instructions', val: 'INJECT 40 UNITS SUBCUTANEOUSLY IN THE EVENING, 6 DAYS ON 1 DAY OFF', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. Dispense 80 insulin syringes.', copy: true },
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
        { field: 'Patient Instructions', val: 'Inject as directed by provider. Follow your KORB treatment schedule.', copy: true },
        { field: 'Reason for Compounding', val: 'Customized peptide dosing', copy: true },
        { field: 'Pharmacy Instructions', val: 'Bill to KORB Health Group and ship to the patient. Customized peptide dosing. DISPENSE 100-UNIT SYRINGES - the 67-unit dose exceeds a 50-unit syringe.', copy: true },
      ]
    },
    schedule: 'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing: 'Evening',
    storage: 'Refrigerate (36\u201346 \u00b0F). Do not freeze. Protect from light. Discard 28 days after initial puncture.',
    counseling: TESA_COUNSEL,
    monitor: TESA_MONITOR
  }
},

  // ── PROGRAM SHAPE ────────────────────────────────────────
  /* RECONCILED 2026-09-06. These entries said titrate:false and carried a single
     fixed doseLabel, while programs.foundation.primaryDoseOptions offered three
     doses for sermorelin and three for CJC. Two parts of the same file
     disagreeing, and the provider tool reads THIS one - which is why the
     titration decided on 2026-09-05 was invisible to a provider for a day.
     doseLabel is now the STARTING dose and a fallback only; the tool shows
     whichever dose is selected. titrationLadder is the authority for what the
     ladder is, and selfCheck asserts it matches primaryDoseOptions exactly. */
  foundationAgents: {
  sermorelin: { key:'sermorelin', label:'Sermorelin', onWeeks:[1,12],
    doseLabel:'200 mcg (starting dose)', titrate:true,
    titrationLadder:['200','300','400'],
    titrationNote:'Titrate 200 → 300 → 400 mcg at 16-week visits, based on IGF-1. ' +
      '500 mcg is NOT a Foundation dose - a patient who needs it moves to Gateway ' +
      'rather than being held at 400. See programs.foundation.sermorelin500ExclusionReason.',
    schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing:'Bedtime, on an empty stomach (\u22652 hrs post-meal)' },
  bpc157: { key:'bpc157', label:'BPC-157', onWeeks:[1,8], doseLabel:'500 mcg', titrate:false,
    schedule:'Daily SQ · Active Weeks 1–8, off Weeks 9–16 of cycle',
    timing:'Any consistent time daily. No food restriction.' },
  cjcipam: { key:'cjcipam', label:'CJC-1295 / Ipamorelin', onWeeks:[1,12],
    doseLabel:'100 mcg / 100 mcg (starting dose)',
    doseLabelByPharm:{ greenwich:'100 mcg CJC-1295 / 100 mcg Ipamorelin', premier:'100 mcg CJC-1295 / 100 mcg Ipamorelin' },
    titrate:true,
    titrationLadder:['100','150','200'],
    titrationNote:'Titrate 100 → 150 → 200 mcg at 16-week visits. All three doses ' +
      'dispense the same quantity, so titration changes no vial and no cost.',
    schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle',
    timing:'Before bed, on an empty stomach' }
},
  /* Every dose a program can offer needs an entry here or the schedule renders
     blank for that selection. cjcipam150, cjcipam200 and tesamorelin15mg were
     reachable from primaryDoseOptions and missing from this object - added
     2026-09-05. Schedule does not vary by dose within an agent; the entries exist
     so the lookup cannot miss. selfCheck now asserts the coverage. */
  peakSchedule: {
  cjcipam: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Before bed, on an empty stomach' },
  cjcipam150: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Before bed, on an empty stomach' },
  cjcipam200: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Before bed, on an empty stomach' },
  tesamorelin1mg: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Evening' },
  tesamorelin15mg: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Evening' },
  tesamorelin2mg: { schedule:'Nightly SQ · 6 days ON / 1 day OFF · Active Weeks 1–12, off Weeks 13–16 of cycle', timing:'Evening' },
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
      schedule: '6 days on, 1 day off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin300: {
      label: 'Sermorelin', dose: '300 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: '6 days on, 1 day off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin400: {
      label: 'Sermorelin', dose: '400 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: '6 days on, 1 day off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin500: {
      label: 'Sermorelin', dose: '500 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: '6 days on, 1 day off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    bpc157: {
      label: 'BPC-157', dose: '500 mcg', color: '#1D7A35',
      // CONFIRMED 2026-07-31 by Don (Director of Clinical Operations & Lead Provider):
      // Foundation BPC-157 was updated from a 6-week course to an 8-week course
      // (8 weeks on, 8-week washout) some weeks prior to this file's creation, so it
      // fits the 16-week cycle the same way every other program does. Both live
      // tools showed the pre-update 6-week value [1,6] at the time this comment was
      // first written. The live Provider Clinical Reference was patched to [1,8] on
      // 2026-08-11; once this file is deployed both tools read [1,8] from here.
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
      schedule: '6 days on, 1 day off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    cjcipam150: {
      label: 'CJC-1295 / Ipamorelin', dose: '150 mcg CJC-1295 / 150 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: '6 days on, 1 day off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    cjcipam200: {
      label: 'CJC-1295 / Ipamorelin', dose: '200 mcg CJC-1295 / 200 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: '6 days on, 1 day off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
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
      schedule: '6 days on, 1 day off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    tesamorelin15mg: {
      label: 'Tesamorelin 1.5 mg', dose: '1.5 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: '6 days on, 1 day off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    tesamorelin2mg: {
      label: 'Tesamorelin 2 mg', dose: '2 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: '6 days on, 1 day off', timing: 'Evening',
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
      optionalAddon: null,  // GHK-Cu is never a Foundation option

      /* Titration added to Foundation 2026-09-05, decided by Don.
         CJC-1295/Ipamorelin matches Peak Pathway A exactly - 100 / 150 / 200.
         Sermorelin matches Gateway MINUS the 500 mcg step.

         Why 500 is excluded, and it is a margin reason rather than a clinical
         one: Premier sermorelin is 1 mg/ml, so dispensed volume scales with the
         dose - 200 mcg is 18 ml, 300 is 27, 400 is 36, and a correctly supplied
         500 is 45. That last step is the one that puts a Foundation patient into
         another vial each month, and Foundation's markup does not cover it.
         Gateway keeps 500 because its pricing does. A Foundation patient who
         needs 500 mcg moves to Gateway rather than being held at 400.

         CJC costs nothing to titrate. Its dispensed quantity is 9 ml at all
         three doses, because at 2 mg/ml even 200 mcg needs only 7.2 ml a cycle -
         the 9 ml already carries the house 1.25x margin at the top dose. Adding
         150 and 200 to Foundation changes no quantity, no vial and no cost.
         Verified against the prescribing records 2026-09-05.

         BPC-157 has no dose options in any program; it is 500 mcg throughout. */
      primaryDoseOptions: {
        sermorelin: ['200', '300', '400'],
        cjcipam:    ['100', '150', '200'],
        bpc157:     null
      },
      /* Foundation timing comes from foundationAgents, not peakSchedule. */
      usesPeakSchedule: false,
      doseOptionsAddedOn: '2026-09-05',
      doseOptionsDecidedBy: 'Don',
      sermorelin500Excluded: true,
      sermorelin500ExclusionReason:
        'A correctly supplied 500 mcg is 45 ml a cycle against 36 ml at 400 mcg, ' +
        'which requires an additional vial each month. Foundation margin does not ' +
        'justify it. Gateway retains 500 mcg. This is a commercial ceiling, not a ' +
        'clinical one - escalate the patient to Gateway rather than holding at 400.'
    },
    gateway: {
      label: 'Gateway Program',
      primaryFamily: 'sermorelin',
      /* Gateway's schedule strings are currently hardcoded in
         KORB_Provider_Clinical_Reference.html rather than read from here. That is
         a known defect - see the audit - and it is why this is false rather than
         true: Gateway does not read peakSchedule, so asserting coverage against it
         would report a problem that is not one. */
      usesPeakSchedule: false,
      primaryDoseOptions: ['200', '300', '400', '500'],
      baseProtocol: ['sermorelin', 'bpc157'],   // BPC-157 is part of the base protocol, not optional
      optionalAddon: 'ghkcu',                    // the only optional add-on
      stagger: true   // primary day 1, BPC-157 week 3, GHK-Cu (if on) week 5
    },
    peakA: {
      label: 'Peak Performance — Pathway A',
      usesPeakSchedule: true,   // reads peakSchedule for its agent timing
      primaryFamily: 'cjcipam',
      primaryDoseOptions: ['100', '150', '200'],
      baseProtocol: ['cjcipam', 'bpc157'],
      optionalAddon: 'ghkcu',
      stagger: true
    },
    peakB: {
      label: 'Peak Performance — Pathway B',
      usesPeakSchedule: true,   // reads peakSchedule for its agent timing
      primaryFamily: 'tesamorelin',
      primaryDoseOptions: ['1mg', '15mg', '2mg'],
      baseProtocol: ['tesamorelin', 'bpc157'],
      optionalAddon: 'ghkcu',
      stagger: true
    }
  },

  // ── PRICING ───────────────────────────────────────────────────────────────
  // PROVIDER AND INTERNAL ONLY. Never render in a patient-facing tool or document.
  // Moved out of KORB_Provider_Clinical_Reference.html 2026-08-12 so a price change
  // lands in the tool and every generated document at once.
  pricing: {
    baseline: {
      label: 'Baseline Labs (one-time, before program selection)',
      website: 99.00, partner: 99.00, code: 'BASEPeptideLab'
    },
    foundation: {
      label: 'Foundation Program',
      website: { payment: 249.00, total: 996.00 }, partner: { payment: 199.00, total: 796.00 },
      // Foundation bills per agent, not one flat program code.
      codeByAgent: {
        bpc157:  { website: 'FndnPeptide001', partner: 'FndnPeptideP01' },
        sermorelin: { website: 'FndnPeptide002', partner: 'FndnPeptideP02' },
        cjcipam: { website: 'FndnPeptide003', partner: 'FndnPeptideP03' }
      }
    },
    gateway: {
      label: 'Gateway Program',
      website: { payment: 349.00, total: 1396.00 }, partner: { payment: 299.00, total: 1196.00 },
      code: { website: 'GatePeptide001', partner: 'GatePeptideP01' }
    },
    peakA: {
      label: 'Peak Performance — Pathway A',
      website: { payment: 449.00, total: 1796.00 }, partner: { payment: 399.00, total: 1596.00 },
      code: { website: 'PeakPeptide001', partner: 'PeakPeptideP01' }
    },
    peakB: {
      label: 'Peak Performance — Pathway B',
      website: { payment: 449.00, total: 1796.00 }, partner: { payment: 399.00, total: 1596.00 },
      code: { website: 'PeakPeptide002', partner: 'PeakPeptideP02' }
    },
    ghkcu: {
      label: 'GHK-Cu Add-On (one-time)',
      website: 199.00, partner: 199.00, code: 'GHKCUPeptide01'
    }
  },

  // ── LAB PROTOCOL ──────────────────────────────────────────────────────────
  labs: {
    base: [
      { name: 'CBC w/ Differential', code: '6399' },
      { name: 'CMP', code: '10231' },
      { name: 'Lipid Panel', code: '7600' },
      { name: 'HbA1c', code: '496' },
      { name: 'Fasting Glucose', code: '483' },
      { name: 'Fasting Insulin', code: '561' },
      { name: 'IGF-1 (LC/MS)', code: '16293' },
      { name: 'TSH', code: '899' },
      { name: 'Free T4', code: '866' },
      { name: 'T3, Free', code: '34429' },
      { name: 'Copper, RBC', code: '3481' },
      { name: 'Zinc, RBC', code: '6354' },
      { name: 'Ceruloplasmin', code: '326' },
    ],
    men45Plus: { name: 'PSA, Total (Men 45+)', code: '5363', note: 'Men age 45 and older only' }
  },

  // ── STATE ROUTING AND AVAILABILITY ────────────────────────────────────────
  // premierRouting: states that default to Premier. Everything else goes to
  // Greenwich, which ships to all 50 states plus DC.
  // unavailable: FH&L is not offered in these states. This is the list the
  //   provider tool blocks on - if a state is here, no visit, no prescription,
  //   no shipment.
  // unavailableNoShip: a subset of unavailable with a harder reason. These are
  //   not "not yet" states waiting on coverage or bandwidth - they are excluded
  //   from the offering, and no peptide or other Functional Health & Longevity
  //   product may be shipped there. Treated as a permanent exclusion until
  //   Compliance says otherwise, not a Phase 1 sequencing item.
  // unavailableLabWorkflow: a distinct reason - lab workflow and state-specific
  //   legislation, not provider coverage.
  //
  // 2026-08-24: MS added to unavailable and to the new unavailableNoShip list,
  // and removed from premierRouting. AL and SC were already blocked and are now
  // also flagged no-ship, so the tool states the real reason rather than the
  // generic "provider coverage and operational bandwidth" line. Source: notice
  // to Don, 2026-08-24, that MS, AL and SC are out of the FH&L offering.
  states: {
    premierRouting: ['AZ','CO','CT','DC','DE','FL','GA','IL','KS','KY','LA','MD','ME','MI','MO','MT','NC','ND','NE','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SD','TN','TX','UT','VA','VT','WI','WV','WY'],
    unavailable: ['AL','AK','DC','GA','HI','MA','MN','MS','NJ','NY','RI','SC','WV'],
    unavailableNoShip: ['AL','MS','SC'],
    unavailableLabWorkflow: ['NY','NJ','RI']
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

  /* Syringe count against actual dose count. BPC-157 dispensed 50 syringes for a
     56-day daily course - the patient ran out six days early. Nothing checked it
     because the syringe guard above only looks at 100-unit callouts, not counts.
     Daily records only; the weekly and 6-on/1-off agents are covered by their own
     quantities. */
  Object.keys(KORB_DOSING.prescribing).forEach(function(k){
    ['premier','greenwich'].forEach(function(ph){
      var e = KORB_DOSING.prescribing[k] && KORB_DOSING.prescribing[k][ph];
      if (!e || !e.fields) return;
      var g = function(f){ var x = e.fields.filter(function(y){return y.field===f;})[0]; return x ? x.val : null; };
      var sig = g('Patient Instructions') || '';
      if (!/ONCE DAILY/i.test(sig)) return;
      var days = parseInt(g('Days Supply'), 10);
      var m = (g('Pharmacy Instructions') || '').match(/Dispense\s+(\d+)\s+insulin syringes/i);
      if (!days || !m) return;
      var syringes = parseInt(m[1], 10);
      if (syringes < days) {
        problems.push('SYRINGE COUNT ' + k + '/' + ph + ': dispenses ' + syringes +
                      ' syringes for ' + days + ' daily doses - the patient runs out ' +
                      (days - syringes) + ' days early');
      }
    });
  });

  /* Added 2026-09-05 with Foundation titration. Every dose a program offers must
     resolve to a real key in every object that consumes it. Foundation gained
     per-agent dose options, and Peak already offered doses whose peakSchedule
     entries did not exist - a provider could select 150 mcg and get a blank
     schedule. This keeps the option lists and the records in step.

     Reads primaryDoseOptions in both shapes: an array where a program has one
     primary family, or a map keyed by agent, which is what Foundation needs since
     its ladder differs per agent. peakSchedule is asserted only where a program
     declares usesPeakSchedule - Gateway is staggered but renders its schedule from
     elsewhere, so asserting it there would report a problem that is not one. */
  Object.keys(KORB_DOSING.programs).forEach(function(pk){
    var prog = KORB_DOSING.programs[pk];
    var opts = prog.primaryDoseOptions;
    if (!opts) return;
    var byFamily = Array.isArray(opts)
      ? (function(){ var o = {}; o[prog.primaryFamily] = opts; return o; })()
      : opts;
    Object.keys(byFamily).forEach(function(fam){
      (byFamily[fam] || []).forEach(function(dv){
        var key = KORB_DOSING.resolvePrimaryKey(fam, dv);
        if (!KORB_DOSING.prescribing[key]) {
          problems.push('DOSE OPTION ' + pk + '/' + fam + ' ' + dv + ' -> ' + key +
                        ': no prescribing record, nothing to prescribe from');
        }
        if (prog.usesPeakSchedule && !KORB_DOSING.peakSchedule[key]) {
          problems.push('DOSE OPTION ' + pk + '/' + fam + ' ' + dv + ' -> ' + key +
                        ': no peakSchedule entry, the schedule renders blank');
        }
      });
    });
  });

  /* Foundation's dose ladder is declared in TWO places and the provider tool
     reads only one of them. programs.foundation.primaryDoseOptions is what the
     decision was recorded in; foundationAgents is what the tool renders from.
     On 2026-09-05 the first was updated and the second was not, so the titration
     existed in the file and was unreachable by a provider - the decision looked
     done and was not. This asserts the two agree, in both directions.

     The deeper lesson, recorded here because it cost a day: the guard written
     alongside that change checked that every offered dose resolved to a
     prescribing record. It passed. It verified the back half of the path and
     never asked whether anything surfaced the front half. A dose that nothing
     exposes is not an offered dose. */
  (function () {
    var opts = KORB_DOSING.programs.foundation.primaryDoseOptions || {};
    Object.keys(opts).forEach(function (fam) {
      var ladder = opts[fam];
      var agent = KORB_DOSING.foundationAgents[fam];
      if (!ladder) return;                       // bpc157 has no ladder, correctly
      if (!agent) {
        problems.push('FOUNDATION ' + fam + ': primaryDoseOptions offers doses but ' +
                      'there is no foundationAgents entry, so the tool cannot render it');
        return;
      }
      if (ladder.length > 1 && agent.titrate !== true) {
        problems.push('FOUNDATION ' + fam + ': ' + ladder.length + ' dose options but ' +
                      'foundationAgents.titrate is not true - the tool will present it ' +
                      'as a fixed-dose agent and the ladder stays invisible');
      }
      var declared = agent.titrationLadder || [];
      if (declared.join(',') !== ladder.join(',')) {
        problems.push('FOUNDATION ' + fam + ': primaryDoseOptions [' + ladder.join(',') +
                      '] does not match foundationAgents.titrationLadder [' +
                      declared.join(',') + ']. These are read by different code paths ' +
                      'and must not disagree.');
      }
    });
    /* And the reverse: an agent claiming a ladder the program does not offer. */
    Object.keys(KORB_DOSING.foundationAgents).forEach(function (fam) {
      var agent = KORB_DOSING.foundationAgents[fam];
      if (!agent.titrationLadder) return;
      if (!opts[fam]) {
        problems.push('FOUNDATION ' + fam + ': foundationAgents declares a titration ' +
                      'ladder but programs.foundation.primaryDoseOptions offers none');
      }
    });
  })();

  if (!problems.length) console.log('KORB_DOSING selfCheck: OK');
  else problems.forEach(function(p){ console.warn('KORB_DOSING selfCheck: ' + p); });
  return problems;
};
