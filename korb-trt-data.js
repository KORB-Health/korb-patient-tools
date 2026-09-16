/* ============================================================================
   KORB HEALTH - MALE TRT CLINICAL DATA                    SOURCE OF TRUTH

   Testosterone cypionate for male testosterone replacement. Every fact a KORB
   tool or document states about TRT is written here once and read from here.

   WHERE THIS CAME FROM

   Open item 6. Until 2026-09-16 there was no TRT data file, and every fact
   below lived inside Provider_Reference/KORB_TRT_Provider_Tool.html as
   JavaScript - the dose ladder, the lab panel, the titration thresholds, the
   contraindications, the Tebra favorite, the visit-note template. That tool is
   hand-built, which CLAUDE.md lists as the liability it is: the Dose Guide went
   stale in production the same way and told providers to prescribe a retired
   Greenwich ladder.

   The content here is EXTRACTED, not authored. Nothing clinical was invented,
   reworded or improved on the way across. Where the tool was ambiguous it is
   marked below rather than resolved.

   WHAT IS NOT HERE, ON PURPOSE

   State and pharmacy facts. Those live in korb-pharmacies.js and are read at
   load by hydrate(), the same wiring korb-glp1-data.js took under open item 3
   and korb-dosing-data.js under open item 4. The tool typed its own:

       var PHARM = { TX: {name:"Premier Pharmacy", ...},
                     CA: {name:"Empower Pharmacy", ...} };

   plus its own 51-entry STATE_NAME map. Both are gone from here. A program file
   may name a pharmacy by key and may never hold a state list.

   TESTOSTERONE IS SCHEDULE III and that shaped the shared layer. A pharmacy's
   controlled-substance licensure is much narrower than the states it can ship
   an ordinary compound to - Premier ships peptides to 38 states and testosterone
   to Texas. korb-pharmacies.js v1.6 gained `only` on a program so it can narrow
   a footprint rather than subtract 37 states from it by hand.

   VERIFIED 2026-09-16. Don confirmed the routing. Premier is in live use for
   Texas patients today; Empower has accepted and approved test prescriptions for
   California, with no live patient prescription sent there yet.

   NOT COMPOUNDED, and this is the thing to get right. Testosterone cypionate
   200 mg/mL is a COMMERCIAL product that happens to be dispensed by a compounding
   pharmacy. Those are two different facts, and conflating them is what produced
   the original Compounded Drug Favorite entry carrying a Reason for Compounding
   on a commercial generic. It is a Tebra STANDARD prescription: the drug is
   selected from the drop-down, and the word compounded appears nowhere a provider
   can see. selfCheck asserts all of that.
   ============================================================================ */

var KORB_TRT = {

  meta: {
    version: '1.4',
    created: '2026-09-16',
    updated: '2026-09-16',
    owner: 'Director of Clinical Operations',
    extractedFrom: 'Provider_Reference/KORB_TRT_Provider_Tool.html as at 2026-09-16',
    scope: 'Male testosterone replacement only. Female testosterone is a women\'s ' +
           'health question and belongs in korb-womens-data.js, not here.',
    entity: 'KORB Health Medical Texas PA',
    changelog: [
      '2026-09-16 (v1.0): CREATED. Open item 6. Extracted whole from ' +
      'KORB_TRT_Provider_Tool.html, which had held every one of these facts as ' +
      'JavaScript inside a hand-built page. No clinical content was changed, ' +
      'reworded or added in the move; two things the tool got wrong are recorded ' +
      'as questions rather than fixed silently. Pharmacy and state facts were NOT ' +
      'copied; they come from korb-pharmacies.js at load.',
      '2026-09-16 (v1.1): NOT COMPOUNDED. Don answered all three questions. The ' +
      'Tebra entry matches the brand products: a STANDARD prescription, the drug ' +
      'selected from the drop-down, no Reason for Compounding, and the word ' +
      'compounded nowhere - the field and its cap are removed rather than emptied, ' +
      'because an empty field still renders a blank row and still invites somebody ' +
      'to fill it in. Routing verified. SHBG recorded as an add-on lab and left as ' +
      'is, pending the formal program review.',
      '2026-09-16 (v1.2): CLINICAL CONTENT CHANGED - THE 96 MG STEP IS GONE. ' +
      'Premier will not fill a 90-day supply at 96 mg/week: the vial runs 145 days ' +
      'at that dose, so a 90-day prescription leaves more than a third unused. The ' +
      'ladder now starts at 120, which is also the only starting dose. What this ' +
      'does and does not fix, measured rather than assumed: leftover volume on a ' +
      '90-day Rx goes 96mg=55 days wasted, 120mg=26, 144mg=7, 168mg=0. Removing 96 ' +
      'removes by far the worst case, but 120 and 144 still cap at 90 and still ' +
      'discard a remainder, and 168 is written for 83 days and discards nothing. So ' +
      'the discard counselling is NOT one rule across the ladder - an earlier draft ' +
      'of this entry claimed it was, which was wrong. A patient who needs less than 120 is ' +
      'instructed to take less and titrate up rather than being put back on a step ' +
      'the pharmacy will not dispense. The dose is recorded in removedDoses with ' +
      'the reason so it is not reinstated by someone reading an old document. ' +
      'Source: Don Stevenson, after speaking with Premier the week of 2026-09-08.',
      '2026-09-16 (v1.3): THE SAFETY PROTOCOL, which was entirely absent. This file ' +
      'was first extracted from KORB_TRT_Provider_Tool.html, and that tool is a ' +
      'calculator - it carries dosing and Tebra fields and no safety protocol at all. ' +
      'So the reference shipped without an eligibility gate, precautions, hematologic ' +
      'or prostate management, cardiovascular screening, fertility counselling, a ' +
      'monitoring timeline, side effects or any discontinuation guidance. Don noticed ' +
      'and named most of it. Added from the Men\'s Health Testosterone SOP of ' +
      '2026-02-10: eligibility gate (Hct below 52, age-adjusted PSA, symptoms and labs ' +
      'aligned), relative contraindications, hematologic safety with the phlebotomy ' +
      'rule, age-banded PSA ranges, cardiometabolic screening, fertility with the ' +
      'adjuncts KORB does NOT offer stated as such, the baseline / 4-6 week / 12-week / ' +
      'annual timeline, the side-effect table, and stopping therapy. Two absolute ' +
      'contraindications gained the numbers the SOP carries and the tool did not: ' +
      'hematocrit above 52 at baseline, and desire for fertility WITHOUT gonadotropin ' +
      'or enclomiphene support. ' +
      'DOSING WAS NOT TAKEN FROM THE SOP. Don reworked TRT dosing the week of ' +
      '2026-09-08 and the SOP is last year, so the live values govern. The three ' +
      'disagreements - target band 400-700 against 600-800, ladder steps against ' +
      '10-15 percent adjustments, and the SOP Tebra favorites at 150 and 165 mg/week ' +
      'in units rather than mL - are recorded in sourceConflicts rather than ' +
      'reconciled, because reconciling them is a clinical decision.',
      '2026-09-16 (v1.4): FERTILITY MADE UNMISSABLE, and a cap check that was not ' +
      'checking. Don asked for both. Fertility moved from section 15 to section 3, ' +
      'so it is read before the dose ladder and before any prescribing block, and ' +
      'the standing warning is written once and rendered in three places - the ' +
      'baseline gate, its own section, and above BOTH sets of prescribing blocks, ' +
      'which is where a provider actually is when it matters. It uses the house ' +
      '.callout.warn style, which nothing else on this document claims. ' +
      'selfCheck now measures PHARMACY instructions as well as patient ' +
      'instructions; it had only ever measured the latter, and on the ' +
      'kit-shipping pharmacies the pharmacy note is the longer of the two.'
    ]
  },

  /* ── PRESCRIBING SIGN-OFF ──────────────────────────────────────────────────
     See rx-signoff.js. Empty: no TRT document has been through review, and the
     provider tool is not yet generated so it is not in the inventory either. */
  rxSignoff: { records: {} },

  /* -- DECISIONS -------------------------------------------------------------
     Three things were flagged on 2026-09-16 when this file was extracted from
     the hand-built tool. Don answered all three the same day. Recorded with the
     answer AND the reasoning, because the reasoning is what stops the next
     person quietly re-opening them. */
  decisions: [
    {
      id: 'commercial-not-compounded',
      question: 'The Tebra entry was built as a Compounded Drug Favorite with a ' +
        'Reason for Compounding field, while the drug string read "commercial generic".',
      answer: 'NOT COMPOUNDED. Testosterone cypionate 200 mg/mL is a commercial ' +
        'product. It is dispensed BY a compounding pharmacy, which is a different ' +
        'fact, and conflating the two is what produced the original entry. It is a ' +
        'Tebra STANDARD prescription: the drug is selected from the drop-down, there ' +
        'is no Reason for Compounding because nothing is compounded, and the word ' +
        'compounded appears nowhere. Same treatment as the brand GLP-1 products took ' +
        'on 2026-09-15.',
      decidedBy: 'Don Stevenson, PA-C',
      decidedOn: '2026-09-16'
    },
    {
      id: 'trt-pharmacy-licensure',
      question: 'TX to Premier and CA to Empower had never been verified against ' +
        'anything except the provider tool asserting it.',
      answer: 'CONFIRMED. Both pharmacies are set up. Premier is in live use for ' +
        'Texas patients today. Empower has accepted and approved test prescriptions ' +
        'for California; no live patient prescription has gone there yet. ' +
        'korb-pharmacies.js carries verified:true on both.',
      decidedBy: 'Don Stevenson, PA-C',
      decidedOn: '2026-09-16'
    },
    {
      id: 'shbg-not-on-panel',
      question: 'The criterion for second-line SQ three times weekly is low SHBG, ' +
        'and SHBG is not on the standard panel.',
      answer: 'LEAVE IT. SHBG is an ADD-ON lab, ordered when it is wanted rather ' +
        'than drawn by default, so the criterion is reachable - it just is not ' +
        'answered by the standard panel. Whether SHBG should join that panel belongs ' +
        'to the formal TRT and Men\'s Health program review, not to a piecemeal change.',
      decidedBy: 'Don Stevenson, PA-C',
      decidedOn: '2026-09-16'
    }
  ],

  /* ── THE PRODUCT ───────────────────────────────────────────────────────────
     One presentation. Everything downstream is arithmetic on these numbers, so
     they are stated once and never restated. */
  product: {
    drug: 'Testosterone cypionate',
    schedule: 'III',
    concentrationMgPerMl: 200,
    vialMl: 10,
    vialMg: 2000,
    /* The exact string a provider SELECTS in the Tebra drug drop-down. Named
       `drug` rather than `drugFormulation` to match the brand GLP-1 products,
       because that is what it is: a commercial listing, not a compounded recipe. */
    drug: 'Testosterone Cypionate 200mg per mL inj (commercial generic)',
    commercial: true,
    compounded: false,
    dispensingNote: 'Dispensed BY a compounding pharmacy - Premier in TX, Empower ' +
      'in CA - but the product itself is commercial. Those are different facts, and ' +
      'conflating them is what produced the original Compounded Drug Favorite entry ' +
      'on a commercial generic. Confirmed by Don 2026-09-16.',
    storage: 'Room temperature. Do NOT refrigerate at any point, including in ' +
             'transit. Discard 90 days after first use.',
    storageDays: 90
  },

  /* ── SCHEDULING CONSTANTS ──────────────────────────────────────────────────
     Controlled-substance workflow. Lifted unchanged from the tool. */
  scheduling: {
    sendLeadDays: 4,
    sendLeadWhy: 'Send the prescription 4 days before the pharmacy can release ' +
                 'it. Earlier is what triggers the too-early callback.',
    labLeadDays: 14,
    labLeadWhy: 'Order labs 14 days before the next visit. Results can take a ' +
                'week, so the draw must not be left to the final days.',
    maxDays: 90,
    maxDaysWhy: 'Nothing is dispensed or scheduled beyond 90 days. At 120 and ' +
                '144 mg per week the vial physically outlasts 90 days and the ' +
                'remainder is discarded; at 168 it runs out at 83 days and the ' +
                'prescription is written for 83. Never tell a patient the vial ' +
                'lasts longer than 90 days.',
    refillCountsFrom: 'PMP last fill date, not the visit date.',
    /* Checking the state prescription-monitoring database before writing a
       Schedule III is a per-state legal requirement, and the database has a
       different name in each state - which is exactly why a single line saying
       "check the PMP" is not enough for a provider working in two states.
       Added at Don's request 2026-09-16. CONFIRM the California entry before
       relying on it: the Texas system is the one KORB uses daily. */
    pdmp: {
      TX: { name: 'Texas Prescription Monitoring Program (PMP Aware)', verified: true },
      CA: { name: 'CURES - Controlled Substance Utilization Review and Evaluation System',
            verified: false,
            note: 'Named from general knowledge of California controlled-substance ' +
                  'requirements, NOT from a KORB source document. Confirm before the ' +
                  'first California prescription.' }
    },
    pdmpRule: 'Check the patient prescription-monitoring database in THEIR state before ' +
      'every controlled-substance prescription, not just the first. It is how you find ' +
      'a patient receiving testosterone or other controlled substances from another ' +
      'prescriber. Record that you checked, and the last fill date, in the visit note.'
  },

  /* ── DOSES AND ROUTES ──────────────────────────────────────────────────────
     Every weekly dose divides exactly by every frequency at 200 mg/mL, which is
     why the ladder needs no rounding and the weekly dose in the chart is the
     weekly dose in the patient whatever the route. selfCheck asserts it. */
  /* 96 mg/week was removed on 2026-09-16. Premier will not fill a 90-day
     supply at that dose: at 96 mg a 10 mL vial runs 145 days, so a 90-day
     prescription leaves more than a third of the vial unused and the pharmacy
     would not dispense against it. Starting at 120 brings the written days and
     the vial closer together - 96 mg wasted 55 days of vial against a 90-day
     prescription, 120 wastes 26 - and a patient who needs less can be instructed
     to take less and titrate up. It does NOT make the discard rule uniform: 120
     and 144 still cap at 90 and discard a remainder, 168 runs the vial out at
     83 days and discards nothing.
     Source: Don Stevenson, after speaking with Premier the week of 2026-09-08. */
  weeklyDosesMg: [120, 144, 168],
  startingDosesMg: [120],
  removedDoses: [
    { mg: 96, removedOn: '2026-09-16',
      why: 'Premier will not fill 90 days at 96 mg/week - the vial runs 145 days ' +
           'and too much goes unused. Instruct a patient who needs less to take ' +
           'less from the 120 mg regimen rather than reinstating this step.' }
  ],

  routes: {
    im1: {
      key: 'im1', label: 'IM once weekly', short: 'IM', freq: 1, sq: false,
      freqWord: 'weekly',
      syringe: '3 mL Luer lock', drawNeedle: '23G 1in', injectNeedle: '25G 1in',
      secondLine: false
    },
    sq2: {
      key: 'sq2', label: 'SQ twice weekly', short: 'SQ', freq: 2, sq: true,
      freqWord: 'two times a week',
      syringe: '1 mL Luer lock', drawNeedle: '23G 1in', injectNeedle: '27G 1/2in',
      secondLine: false
    },
    sq3: {
      key: 'sq3', label: 'SQ three times weekly', short: 'SQ', freq: 3, sq: true,
      freqWord: 'three times a week',
      syringe: '1 mL Luer lock', drawNeedle: '23G 1in', injectNeedle: '27G 1/2in',
      secondLine: true,
      secondLineNote: 'Use when a patient on twice weekly has low SHBG, trough ' +
        'symptoms, or rising estradiol or hematocrit. It is not a starting ' +
        'regimen. Document the reason for the frequency in the note.'
    }
  },

  /* Two needles, always. The one instruction most likely to be dropped in a
     rewrite and the one that makes the injection possible. */
  technique: 'Testosterone cypionate is a viscous oil: draw up with the wider ' +
    'needle, then change to the finer needle to inject. Do not use insulin ' +
    'syringes, which have a fixed needle and are marked in units. All volumes ' +
    'are read in mL on a Luer lock barrel.',

  /* ── LAB PANEL ─────────────────────────────────────────────────────────────
     Quest codes. Ordered in full at baseline and at every follow-up. */
  labPanel: {
    tests: [
      { name: 'FSH & LH', code: '7137' },
      { name: 'PSA, Total', code: '5363' },
      { name: 'Prolactin', code: '746' },
      { name: 'CBC', code: '1759' },
      { name: 'Estradiol', code: '4021' },
      { name: 'Testosterone, Total, MS', code: '15983' }
    ],
    orderedAs: 'Select the KORB TRT panel in the Quest integration in Tebra. The ' +
               'panel is already built; the tests below are listed for reference and are ' +
               'NOT ordered individually.',
    timing: 'Draw in the MORNING, FASTING, before 10:00 - the KORB standard for all ' +
            'lab draws, and the window the Men\'s Health SOP specifies for testosterone ' +
            '(7 to 10 AM). Draw testosterone at trough, on an injection day before the ' +
            'dose is given. A peak draw will read high and hide a symptomatic trough.',
    cadence: 'Full panel at baseline and at each follow-up. Recheck 6 to 8 weeks ' +
             'after any change.',
    /* ADD-ON LABS, with the billing code and price. From the Men's Health
       protocol of 2026-02-10, which is where this table lives; the provider tool
       never carried it and the first cut of the reference did not either. The
       provider who orders one of these owns every result it returns, including
       findings unrelated to testosterone - that disclaimer is the SOP's and is
       reproduced rather than summarised. */
    addOn: [
      { name: 'Testosterone, Free (Dialysis) and Total, LC/MS/MS', quest: '37073', code: 'KLAB37073', price: '$275' },
      { name: 'Sex Hormone-Binding Globulin (SHBG)', quest: '30740', code: 'KLAB30740', price: '$105' },
      { name: 'Comprehensive Metabolic Panel', quest: '10231', code: 'KLAB10231', price: '$45' },
      { name: 'Lipid Panel', quest: '7600', code: 'KLAB7600', price: '$95' },
      { name: 'Hemoglobin A1c', quest: '496', code: 'KLAB496', price: '$55' },
      { name: 'Thyroid Panel with TSH, Free T3, Free T4', quest: '34429', code: 'KLAB34429', price: '$165' },
      { name: 'Vitamin D, 25-Hydroxy, Total, Immunoassay', quest: '17306', code: 'KLAB17306', price: '$185' },
      { name: 'DHEA Sulfate', quest: '402', code: 'KLAB402', price: '$155' },
      { name: 'C-Reactive Protein, Cardiac (High Sensitivity)', quest: '10124', code: 'KLAB10124', price: '$75' },
      { name: 'Ferritin', quest: '457', code: 'KLAB457', price: '$85' }
    ],
    addOnDisclaimer: 'Providers who order optional or add-on labs are responsible for ' +
      'reviewing, addressing and documenting ALL results, including abnormalities not ' +
      'directly related to TRT. Ordering additional labs expands the clinical scope of ' +
      'the encounter and may uncover comorbidities that require counselling, follow-up ' +
      'or referral. Order them when clinically indicated and when you are prepared to ' +
      'manage whatever comes back.',
    addOnLabs: ['SHBG', 'Free testosterone'],
    addOnLabsNote: 'ADD-ON labs, not part of the standard panel - ordered when they ' +
      'are wanted. The criterion for moving to SQ three times weekly is written ' +
      'against low SHBG, so that call needs the add-on drawn; it is reachable, just ' +
      'not answered by the default panel. Whether SHBG should join the standard ' +
      'panel belongs to the formal TRT and Men\'s Health program review. ' +
      'Confirmed by Don 2026-09-16: leave as is.'
  },

  /* ── TITRATION ─────────────────────────────────────────────────────────────
     Marker, threshold, action. Kept as rows because that is how it is read. */
  titration: {
    rule: 'Change one variable at a time. Adjusting dose and frequency together ' +
          'makes it impossible to know which one worked. Recheck labs 6 to 8 ' +
          'weeks after any change, drawn at trough.',
    rows: [
      { marker: 'Total testosterone (trough)', threshold: 'Goal band 400 - 700 ng/dL',
        action: 'In band with symptoms resolved: hold current dose.' },
      { marker: 'Total testosterone (trough)', threshold: 'Below 400 ng/dL with persistent symptoms',
        action: 'Move up one step on the ladder. Recheck in 6 to 8 weeks.' },
      { marker: 'Total testosterone (trough)', threshold: 'Above 700 ng/dL',
        action: 'Move down one step, even if the patient feels well.' },
      { marker: 'Total testosterone (trough)', threshold: 'Above 1000 ng/dL',
        action: 'Reduce dose regardless of symptoms. Supraphysiologic levels carry ' +
                'cardiovascular and polycythemia risk.' },
      { marker: 'Hematocrit', threshold: '50 - 53%',
        action: 'Warning range. Recheck, review sleep apnea and hydration, consider ' +
                'increasing injection frequency.' },
      { marker: 'Hematocrit', threshold: 'Above 54%',
        action: 'Intervene. Hold or reduce dose, increase frequency, and discuss ' +
                'therapeutic phlebotomy. Do not continue unchanged.' },
      { marker: 'Estradiol', threshold: 'Elevated with symptoms (gynecomastia, nipple ' +
                'tenderness, mood, fluid retention)',
        action: 'Increase injection frequency first. Reduce dose if that is ' +
                'insufficient. An aromatase inhibitor is a last resort.' },
      { marker: 'PSA', threshold: 'Rise greater than 1.4 ng/mL within 12 months, or ' +
                'absolute above 4.0 ng/mL',
        action: 'Refer to urology before continuing therapy.' }
    ]
  },

  /* ── DO NOT INITIATE ───────────────────────────────────────────────────────
     Absolute unless marked relative. Refer out. */
  contraindications: {
    lead: 'Do not initiate testosterone therapy with any of the following. Refer ' +
          'to PCP, urology, or the appropriate specialist.',
    items: [
      'Known or suspected prostate or breast cancer',
      'Hematocrit above 52% at baseline - hold and evaluate for erythrocytosis, ' +
      'dehydration or sleep apnea',
      'Severe untreated obstructive sleep apnea',
      'Uncontrolled heart failure; MI or stroke within the last 6 months',
      'Thrombophilia',
      'Active desire for fertility WITHOUT concurrent gonadotropin or enclomiphene ' +
      'support - KORB does not currently offer either, so this means refer',
      'PSA above 4.0 ng/mL, or above 3.0 ng/mL with high prostate cancer risk, ' +
      'without urological evaluation first'
    ]
  },

  /* ── PRICING ───────────────────────────────────────────────────────────────
     Program-wide, not per dose or per route. */
  pricing: {
    rows: [
      { item: 'Initial TRT labs', price: '$99', code: 'FITTRTQ100' },
      { item: 'Quarterly TRT - visit, medication, shipping', price: '$399', code: 'FITTRTQ001' }
    ],
    notes: [
      'KORB does not accept insurance.',
      'Add-on pricing is in the Optimization Products tool, so it is maintained in one place.'
    ]
  },

  /* ── TEBRA ─────────────────────────────────────────────────────────────────
     Caps are the house values. reasonForCompounding at 30 is tighter than
     anything in the other programs and came from the tool; it is kept because a
     cap that is too small only ever fails safe. */
  tebra: {
    /* STANDARD prescription, not a Compounded Drug Favorite. The drug is chosen
       from the Tebra drop-down. There is no Reason for Compounding field on a
       standard prescription, and nothing is being compounded to state in one, so
       the field and its 30-character cap are REMOVED from this file rather than
       left empty - an empty field still renders a blank row and still invites
       somebody to fill it in. Decided 2026-09-16; the same rule the brand GLP-1
       documents took on 2026-09-15. */
    kind: 'standard',
    caps: { ptInstructions: 140, pharmacyNotes: 170 },
    selectOnly: ['Drug'],
    selectOnlyNote: 'Select this from the Tebra drop-down. Do not copy and paste.',
    allowSubstitution: true,
    refill: '0',
    unit: 'ml',
    quantity: '10'
  },

  /* ── PHARMACY, FROM THE SHARED LAYER ───────────────────────────────────────
     Empty in source and filled by hydrate(). A typed fallback here would be a
     second copy of a pharmacy fact, and a stale one answers confidently. */
  states: {
    /* COMPUTED AT LOAD. { TX: 'premier', CA: 'empower' } */
    routing: {},
    /* COMPUTED AT LOAD. Every state where any pharmacy can fill TRT. */
    offered: []
  },

  /* Who may prescribe a Schedule III in each state. A licensure fact about
     PEOPLE, not about a pharmacy, so korb-pharmacies.js is the wrong home and it
     stays here. korb-licensing is the register; this is the operating summary. */
  /* Names and credentials as the licensing register spells them - Don asked for
     consistency on 2026-09-16 after seeing "Larisa or LaTonya" here against
     "Latanya" elsewhere. korb-licensing is the register; these are copied from
     korb-providers.js in that repo, not typed from memory. */
  prescribers: {
    TX: 'Don Stevenson, PA-C',
    CA: 'Larisa Hammond, NP or LaTonya King, DNP',
    warning: 'Testosterone may only be prescribed in a state by the provider named ' +
             'for it. If that is not you, do not send the prescription. Route the ' +
             'patient to a provider registered in that state.'
  },

  /* -- WHERE THE SAFETY CONTENT CAME FROM -------------------------------------
     Sections below marked `source: 'SOP'` are from the Men's Health Testosterone
     SOP dated 2026-02-10, in korb-clinical-docs/docs/programs/. The first cut of
     this file was extracted only from the provider tool, which is a calculator
     and carries no safety protocol at all, so everything here was missing:
     the eligibility gate, precautions, hematologic and prostate management,
     cardiovascular screening, fertility, the monitoring timeline, side effects
     and discontinuation.

     DOSING WAS NOT TAKEN FROM THE SOP. Don reworked the TRT dosing in the week
     of 2026-09-08 and the SOP predates that, so on anything to do with dose,
     ladder, titration targets or Tebra fields the live data above governs and
     the SOP is stale. See sourceConflicts for the specific disagreements, which
     are recorded rather than reconciled - reconciling them is a clinical
     decision and belongs to Don, not to this file. */
  sourceConflicts: [
    {
      topic: 'Total testosterone target band',
      current: '400 - 700 ng/dL at trough, per titration.rows above.',
      sop: 'SOP 4.3 says target 600 - 800 ng/dL (mid-normal), sub-therapeutic ' +
           'below 500, supraphysiologic above 900.',
      resolution: 'CURRENT GOVERNS. The band is part of the dosing work of ' +
        '2026-09-08 and the SOP predates it. NOT merged. Flagged for Don because ' +
        'the two documents will be read side by side and the difference is large ' +
        'enough to change a dose decision.'
    },
    {
      topic: 'Titration step size',
      current: 'Move one step on the ladder - 120 / 144 / 168 mg per week.',
      sop: 'SOP 5.3 says adjust the total weekly dose by 10 - 15%.',
      resolution: 'CURRENT GOVERNS. A fixed ladder and a percentage adjustment ' +
        'are different methods, and the ladder is what the pharmacy fills.'
    },
    {
      topic: 'Starting dose and available doses',
      current: 'Start 120 mg/week. Ladder 120 / 144 / 168.',
      sop: 'SOP 5.3 says start 100 mg/week, with alternatives at 80 and 120 - 140. ' +
           'Its Tebra favorites are written at 150 and 165 mg/week and express the ' +
           'dose in UNITS rather than mL.',
      resolution: 'CURRENT GOVERNS, confirmed by Don 2026-09-16. The SOP favorites ' +
        'are last year and would not fill: 96 mg was removed because Premier will ' +
        'not dispense 90 days at that dose.'
    }
  ],

  /* -- ELIGIBILITY AND THE BASELINE GATE --------------------------------------
     source: SOP 2.4.2 and 3.3. What must be true before a first prescription.
     The provider tool had no concept of this at all - it would compute a
     perfectly good prescription for a patient who should not be started. */
  eligibility: {
    source: 'SOP',
    lead: 'Confirm ALL of the following before the first prescription. If any is ' +
          'not met, defer therapy and repeat testing or refer - hematology, ' +
          'urology or endocrinology as the finding indicates.',
    gates: [
      'Hematocrit below 52%.',
      'PSA within the age-adjusted normal range for the patient (see Prostate safety).',
      'Normal liver and kidney function, if tested.',
      'No absolute contraindication present.',
      'Symptoms and laboratory findings align. Testosterone deficiency is diagnosed ' +
      'on both, not on a number alone.',
      'FERTILITY HAS BEEN ASKED ABOUT AND THE ANSWER DOCUMENTED. See the next section.'
    ],
    documentation: 'Abnormal labs must be documented in Tebra with an interpretation ' +
      'and a plan, not merely filed. Where therapy proceeds despite a borderline ' +
      'finding, the note must carry the rationale.'
  },

  /* -- PRECAUTIONS. Not absolute bars; things to settle first. source: SOP 3.4 */
  precautions: {
    source: 'SOP',
    lead: 'Relative contraindications. These are not absolute bars, but each needs ' +
          'addressing before therapy rather than after.',
    items: [
      'Polycythemia, or hematocrit above 50% - re-evaluate for sleep apnea, ' +
      'dehydration or high-dose therapy.',
      'Prostate enlargement (BPH) - monitor urinary symptoms and the PSA trend.',
      'Severe lower urinary tract symptoms (AUA score above 19) - refer to urology first.',
      'Untreated thyroid dysfunction, metabolic syndrome or severe obesity - optimise first.',
      'Psychiatric instability or uncontrolled mood disorder - stabilise first, and ' +
      'coordinate with the PCP.',
      'High cardiovascular risk or active atherosclerosis - obtain clearance from the ' +
      'PCP or a cardiologist.'
    ]
  },

  /* -- HEMATOLOGIC SAFETY. source: SOP 3.5 and 4.3 ---------------------------
     The one safety rule most likely to be needed and least likely to be
     remembered: what to do when the hematocrit climbs. */
  hematologic: {
    source: 'SOP',
    rules: [
      'Hold or reduce the dose if hematocrit reaches 54%.',
      'Require documented blood donation or therapeutic phlebotomy before restarting.',
      'Resume only after hematocrit is below 52%, with the intervention documented in the EHR.',
      'If hematocrit stays elevated despite intervention, refer to hematology.',
      'Above 52% on therapy, re-evaluate for dehydration or dosing interval before ' +
      'assuming the dose is the cause.'
    ],
    note: 'Erythrocytosis is the commonest reason to stop testosterone. More frequent ' +
      'smaller injections lower the peak and often resolve it without a dose reduction.'
  },

  /* -- PROSTATE SAFETY. source: SOP 3.6 -------------------------------------- */
  prostate: {
    source: 'SOP',
    lead: 'Obtain a baseline PSA for all men, and particularly those 40 and older ' +
          'or with risk factors. Use age-adjusted ranges.',
    ranges: [
      { age: '40 - 49', range: '0.0 - 2.5 ng/mL', action: 'Above 2.5, evaluate family history and risk.' },
      { age: '50 - 59', range: '0.0 - 3.5 ng/mL', action: 'Above 3.5, consider urology referral.' },
      { age: '60 - 69', range: '0.0 - 4.5 ng/mL', action: 'Above 4.5, further diagnostic review.' },
      { age: '70 and older', range: '0.0 - 6.5 ng/mL', action: 'Evaluate in the context of comorbidities.' }
    ],
    holdRule: 'Hold TRT and refer to urology if PSA is above 4.0 ng/mL, or above ' +
      '3.0 in a high-risk group, or has risen more than 1.4 ng/mL in 12 months. ' +
      'Resume only after urology clearance and a documented negative malignancy ' +
      'evaluation.'
  },

  /* -- CARDIOVASCULAR AND METABOLIC. source: SOP 3.7 ------------------------- */
  cardiometabolic: {
    source: 'SOP',
    items: [
      'Do not begin TRT until blood pressure is controlled, below 140/90. This is ' +
      'harder over telemedicine - confirm the PCP or specialist is managing it and ' +
      'that it is in range.',
      'Screen for sleep apnea and obesity-related hypoventilation by referring the ' +
      'patient to their PCP.',
      'Assess HbA1c and a lipid panel for metabolic syndrome.',
      'Coordinate with the PCP or cardiology for known ASCVD or diabetes.',
      'Emphasise lifestyle optimisation - nutrition, exercise, stress reduction.'
    ]
  },

  /* -- FERTILITY. source: SOP 3.8 and 6 --------------------------------------
     Stated carefully. The SOP records that KORB does NOT currently offer the
     adjuncts, while listing them, and a document that lists a drug without that
     qualifier reads as an offer. */
  fertility: {
    source: 'SOP',
    /* One sentence, written once and rendered in three places: the baseline
       gate, its own section near the top, and above both sets of prescribing
       blocks. Don, 2026-09-16 - the providers who need it are the ones about to
       write a prescription, so it has to be where they are looking then, not
       eleven sections further down. */
    standingWarning: 'ASK ABOUT FERTILITY BEFORE YOU PRESCRIBE. Testosterone ' +
      'suppresses sperm production, and it can do so in a man who never raised ' +
      'the subject because he came in about energy or libido. Ask every patient ' +
      'whether he may want children, document the answer, and refer rather than ' +
      'treat if he does - KORB does not currently offer the adjuncts that ' +
      'preserve fertility alongside therapy.',
    lead: 'Testosterone suppresses spermatogenesis. Counsel every patient who may ' +
          'want children before starting, and document the discussion and the ' +
          'patient preference in the chart.',
    adjuncts: 'Enclomiphene 25 mg orally daily, or hCG 500 IU two to three times ' +
      'weekly, are the adjuncts that preserve fertility alongside therapy. ' +
      'KORB DOES NOT CURRENTLY OFFER EITHER. They are recorded here so the option ' +
      'is discussed and referred rather than overlooked, and they may be offered ' +
      'if a need arises.',
    absolute: 'An active desire for fertility WITHOUT that support is an absolute ' +
      'contraindication, not a relative one. Refer rather than treat.'
  },

  /* -- MONITORING TIMELINE. source: SOP 4.2 ---------------------------------- */
  monitoring: {
    source: 'SOP',
    rows: [
      { when: 'Baseline, before TRT', labs: 'TT, E2, LH/FSH, CBC, PSA, prolactin',
        why: 'Establish the diagnosis, confirm eligibility, identify contraindications.' },
      { when: '4 to 6 weeks after starting', labs: 'TT, E2, LH/FSH, CBC, PSA, prolactin',
        why: 'Initial therapeutic response, erythrocytosis risk, dose accuracy.' },
      { when: 'Every 12 weeks', labs: 'TT, E2, CBC, drawn 48 hours post-injection',
        why: 'Therapeutic response, erythrocytosis risk, dose accuracy.' },
      { when: 'Annually', labs: 'Full panel - TT, E2, LH/FSH, CBC, PSA, prolactin',
        why: 'Full annual review.' },
      { when: 'As indicated', labs: 'Any of the above, plus add-ons',
        why: 'Dose changes, side effects, or abnormal prior results.' }
    ],
    note: 'PSA applies to men 40 and older or with risk factors. Recheck 6 to 8 ' +
      'weeks after any dose or frequency change, drawn at trough.'
  },

  /* -- SIDE EFFECTS. source: SOP 9.4 ----------------------------------------- */
  sideEffects: {
    source: 'SOP',
    rows: [
      { system: 'Hematologic', effect: 'Elevated hematocrit',
        action: 'Increase hydration; consider dose adjustment, more frequent smaller ' +
                'injections, or phlebotomy if hematocrit reaches 54%.' },
      { system: 'Endocrine', effect: 'Elevated estradiol',
        action: 'Review for mood change, bloating and gynecomastia. Treat only if symptomatic.' },
      { system: 'Dermatologic', effect: 'Acne, oily skin, hair thinning',
        action: 'Advise skin hygiene; avoid over-supplementation such as DHEA.' },
      { system: 'Mood and CNS', effect: 'Irritability, mood swings',
        action: 'Assess estradiol and stress. Avoid abrupt dose increases.' },
      { system: 'Cardiovascular', effect: 'Fluid retention, raised blood pressure',
        action: 'Monitor blood pressure; ensure hydration and reduce sodium.' },
      { system: 'Genitourinary', effect: 'Reduced fertility, testicular atrophy',
        action: 'Discuss fertility preservation. See Fertility - KORB does not ' +
                'currently offer the adjuncts.' }
    ],
    note: 'Document the symptom review, the education given and the plan for any ' +
      'side effect the patient reports.'
  },

  /* -- DISCONTINUATION. source: SOP 9.7 -------------------------------------- */
  discontinuation: {
    source: 'SOP',
    triggers: [
      'Hematocrit persistently above 54%.',
      'PSA elevation not cleared by urology.',
      'Patient preference, or side effects that outweigh the benefit.'
    ],
    counselling: [
      'Endogenous testosterone may take 6 to 12 weeks to return to normal.',
      'Taper gradually rather than stopping abruptly, or transition to enclomiphene ' +
      'to support recovery, noting that KORB does not currently offer it.',
      'Schedule a follow-up telemedicine visit 6 to 8 weeks after stopping, to ' +
      'review labs and symptoms.'
    ],
    refusal: 'If the patient declines recommended labs, phlebotomy or a follow-up ' +
      'visit, document the refusal and the counselling on the associated risks.'
  },

  /* -- THE STANDALONE DOCUMENT ------------------------------------------------
     Every other KORB program has a reference a provider can read without
     driving a tool: GLP-1 has ten monographs, FH&L four references, add-ons
     one. TRT had only the interactive tool, so a provider who wanted to read
     the protocol had to operate a calculator to see it. This is that document.

     Generated by build-clinical-docs.js from this file, so it cannot drift from
     the tool - both read the same doses, the same ladder, the same thresholds.
     Sections are ordered the way a provider actually needs them: what this is,
     what it costs, where it can go, then the dosing, then the prescriptions,
     then the monitoring, then the stop conditions.

     The tables are NOT typed here. Anything derivable is built in documentBuild()
     below from the same values the tool uses, because a second copy of the dose
     ladder is a second thing to forget. */
  document: {
    id: 'trt',
    file: 'KORB_TRT_Clinical_Reference',
    title: 'Testosterone Replacement Clinical Reference',
    subtitle: 'Male TRT - testosterone cypionate',
    kicker: 'Provider use only',
    entity: 'KORB Health Medical Texas PA',
    version: '1.1',
    effective: '2026-09-16',
    supersedes: 'Nothing. This is the first standalone TRT reference; before it, ' +
      'the protocol existed only inside the TRT Provider Tool.',
    intro: 'Testosterone cypionate 200 mg/mL for male testosterone replacement. ' +
      'This document is the protocol. The TRT Provider Tool computes the visit, ' +
      'refill and lab dates for a specific patient and produces the same ' +
      'prescribing fields shown here; both read this data file, so they cannot ' +
      'disagree.',
    pharmacyOrder: ['premier', 'empower'],
    sections: []   /* built below - see documentBuild() */
  },

  /* Fills document.sections from the clinical data above. Called at the bottom
     of this file, so the document is ready whether it is loaded in a browser or
     required by the builder, and so no fact in it is typed twice. */
  documentBuild: function () {
    var T = this, d = this.document;
    var money = function (r) { return [r.item, r.price, r.code]; };
    var ladder = T.ladder();
    var routeOrder = ['im1', 'sq2', 'sq3'];

    d.sections = [
      {
        id: 'how', heading: 'How TRT works at KORB',
        body: [
          T.product.drug + '. One presentation, one concentration: ' +
            T.product.concentrationMgPerMl + ' mg/mL in a ' + T.product.vialMl +
            ' mL vial (' + T.product.vialMg + ' mg).',
          'This is a COMMERCIAL product. It is dispensed by a compounding pharmacy, ' +
            'which is a different thing, and the Tebra entry is an ordinary standard ' +
            'prescription - the drug is selected from the drop-down and there is no ' +
            'reason for compounding, because nothing is compounded.',
          'Testosterone is a Schedule ' + T.product.schedule + ' controlled substance. ' +
            'Refills run from the PMP last fill date, not the visit date, and nothing ' +
            'is dispensed or scheduled beyond ' + T.scheduling.maxDays + ' days.',
          'Storage: ' + T.product.storage
        ]
      },
      {
        id: 'eligibility', heading: 'Before you start - the baseline gate',
        render: 'bullets',
        body: [T.eligibility.lead],
        bullets: T.eligibility.gates,
        callouts: [T.eligibility.documentation]
      },
      {
        id: 'fertility', heading: 'Fertility - ask before you prescribe',
        render: 'bullets',
        warn: true,
        body: [T.fertility.lead],
        bullets: [T.fertility.absolute, T.fertility.adjuncts],
        callouts: [T.fertility.standingWarning]
      },
      {
        id: 'pricing', heading: 'Pricing and charge codes',
        render: 'table',
        columns: ['Item', 'Price', 'Charge code'],
        rows: T.pricing.rows.map(money),
        copyColumn: 2,
        /* Only the patient-facing fact. "Add-on pricing is in the Optimization
           Products tool" is an instruction to whoever maintains the data, not
           something a prescriber needs mid-consultation - Don, 2026-09-16. */
        callouts: [T.pricing.notes[0]]
      },
      {
        id: 'availability', heading: 'Pharmacy, states and who may prescribe',
        render: 'table',
        columns: ['State', 'Pharmacy', 'Prescriber', 'Ships the injection kit'],
        rows: Object.keys(T.states.routing).sort().map(function (st) {
          var key = T.states.routing[st];
          var ph = KORB_PHARMACIES.pharmacies[key];
          return [KORB_PHARMACIES.stateName(st) + ' (' + st + ')', ph.name,
                  T.prescribers[st] || 'NONE NAMED',
                  ph.programs.trt.suppliesKit ? 'Yes' : 'No'];
        }),
        body: ['TRT is offered in these states only. Testosterone is Schedule ' +
               T.product.schedule + ' and controlled-substance licensure is far narrower ' +
               'than a pharmacy general shipping footprint, so a pharmacy that fills ' +
               'peptides into a state cannot necessarily fill testosterone there.'],
        callouts: [T.prescribers.warning]
      },
      {
        id: 'ladder', heading: 'Dose ladder',
        render: 'table',
        columns: ['Weekly dose'].concat(routeOrder.map(function (rk) {
          return T.routes[rk].label + ' (' + T.routes[rk].syringe + ')';
        })).concat(['Vial lasts', 'Days written']),
        rows: ladder.map(function (r) {
          return [r.weeklyMg + ' mg'].concat(routeOrder.map(function (rk) {
            return r.volumes[rk].toFixed(2) + ' mL';
          })).concat([r.vialDays + ' days', r.rxDays + ' days']);
        }),
        body: ['Start at ' + T.startingDosesMg.join(' or ') + ' mg per week. Every step ' +
               'is exact on all three routes at ' + T.product.concentrationMgPerMl +
               ' mg/mL, so the weekly dose in this table is the weekly dose in the ' +
               'patient regardless of route. All volumes are read in mL on a Luer lock barrel.'],
        callouts: [
          T.technique,
          'Where the vial lasts longer than the days written, the prescription stops at ' +
            T.scheduling.maxDays + ' days and the patient discards the remainder when the ' +
            'next supply arrives. Never tell a patient the vial lasts longer than ' +
            T.scheduling.maxDays + ' days.',
          T.routes.sq3.secondLineNote
        ]
      },
      {
        id: 'rx-premier', heading: 'Prescribing - Premier Pharmacy',
        render: 'trtPrescribing', pharmacy: 'premier',
        warnBefore: T.fertility.standingWarning,
        body: ['One complete entry per dose and route. The Name field encodes both, ' +
               'so each combination is its own Tebra favorite and is written out in full ' +
               'rather than factored - a provider copies a whole block into Tebra.']
      },
      {
        id: 'rx-empower', heading: 'Prescribing - Empower Pharmacy',
        render: 'trtPrescribing', pharmacy: 'empower',
        warnBefore: T.fertility.standingWarning,
        body: ['Empower ships the injection kit with the vial, so the pharmacy ' +
               'instructions carry the supply counts. That is the only difference from ' +
               'the Premier entries above.']
      },
      {
        id: 'labs', heading: 'Standard lab panel',
        render: 'table',
        columns: ['Test', 'Quest code'],
        rows: T.labPanel.tests.map(function (t) { return [t.name, t.code]; }),
        /* No copy buttons. The panel is already built in the Quest integration
           in Tebra - a provider selects "KORB TRT panel" and does not order
           these one at a time, so a Copy button offers a workflow nobody uses.
           Don, 2026-09-16. */
        body: [T.labPanel.orderedAs, T.labPanel.cadence],
        callouts: [T.labPanel.timing]
      },
      {
        id: 'addon-labs', heading: 'Add-on labs',
        render: 'table',
        columns: ['Lab', 'Quest code', 'Charge code', 'Price'],
        rows: T.labPanel.addOn.map(function (l) { return [l.name, l.quest, l.code, l.price]; }),
        copyColumn: 2,
        body: ['Ordered individually when clinically indicated, not part of the KORB ' +
               'TRT panel. Same draw conditions as the standard panel.'],
        callouts: [T.labPanel.addOnDisclaimer]
      },
      {
        id: 'monitoring', heading: 'Monitoring timeline',
        render: 'table',
        columns: ['When', 'Labs', 'Purpose'],
        rows: T.monitoring.rows.map(function (r) { return [r.when, r.labs, r.why]; }),
        callouts: [T.monitoring.note]
      },
      {
        id: 'titration', heading: 'Titration targets and action thresholds',
        render: 'table',
        columns: ['Marker', 'Threshold', 'Action'],
        rows: T.titration.rows.map(function (r) { return [r.marker, r.threshold, r.action]; }),
        callouts: [T.titration.rule]
      },
      {
        id: 'hematologic', heading: 'Hematologic safety and phlebotomy',
        render: 'bullets',
        body: [T.hematologic.note],
        bullets: T.hematologic.rules
      },
      {
        id: 'prostate', heading: 'Prostate safety and PSA',
        render: 'table',
        columns: ['Age', 'Age-adjusted PSA range', 'Action above the range'],
        rows: T.prostate.ranges.map(function (r) { return [r.age, r.range, r.action]; }),
        body: [T.prostate.lead],
        callouts: [T.prostate.holdRule]
      },
      {
        id: 'cardiometabolic', heading: 'Cardiovascular and metabolic safety',
        render: 'bullets',
        bullets: T.cardiometabolic.items
      },
      {
        id: 'side-effects', heading: 'Side effects and counselling',
        render: 'table',
        columns: ['System', 'Effect', 'Counselling and action'],
        rows: T.sideEffects.rows.map(function (r) { return [r.system, r.effect, r.action]; }),
        callouts: [T.sideEffects.note]
      },
      {
        id: 'workflow', heading: 'Controlled substance workflow',
        render: 'bullets',
        body: ['Timing is computed per patient by the TRT Provider Tool. The rules it ' +
               'applies are these.'],
        bullets: [
          T.scheduling.pdmpRule,
          'Texas: ' + T.scheduling.pdmp.TX.name + '.',
          'California: ' + T.scheduling.pdmp.CA.name + '. ' +
            (T.scheduling.pdmp.CA.verified ? '' : 'CONFIRM this before the first ' +
             'California prescription - it has not been checked against a KORB source.'),
          'Refills count from the PMP last fill date, not the visit date.',
          'Order labs ' + T.scheduling.labLeadDays + ' days before the next visit. ' +
            T.scheduling.labLeadWhy,
          'Send the prescription ' + T.scheduling.sendLeadDays + ' days before the ' +
            'pharmacy can release it. ' + T.scheduling.sendLeadWhy,
          'Nothing is dispensed or scheduled beyond ' + T.scheduling.maxDays + ' days. ' +
            T.scheduling.maxDaysWhy,
          'Review the PMP at every visit and record the last fill date in the note.'
        ]
      },
      {
        id: 'contra', heading: 'Do not initiate - absolute contraindications',
        render: 'bullets',
        body: [T.contraindications.lead],
        bullets: T.contraindications.items
      },
      {
        id: 'precautions', heading: 'Precautions - settle these first',
        render: 'bullets',
        body: [T.precautions.lead],
        bullets: T.precautions.items
      },
      {
        id: 'discontinuation', heading: 'Stopping therapy',
        render: 'bullets',
        body: ['TRT may be discontinued under supervision when any of the following ' +
               'applies. Stopping is a clinical event with its own follow-up, not ' +
               'simply the absence of a prescription.'],
        bullets: T.discontinuation.triggers
          .concat(T.discontinuation.counselling)
          .concat([T.discontinuation.refusal])
      }
    ];
    return d;
  },

  hydrated: false,

  hydrate: function (PH) {
    if (!PH || !PH.pharmacies) throw new Error(
      'korb-trt-data.js: korb-pharmacies.js must be loaded first.');
    var routing = {}, offered = [];
    Object.keys(PH.pharmacies).forEach(function (key) {
      PH.statesFor(key, 'trt').forEach(function (st) {
        /* Two pharmacies claiming the same state is not a preference to resolve
           quietly - it is a question about a controlled substance. Throw. */
        if (routing[st] && routing[st] !== key) {
          throw new Error('korb-trt-data.js: ' + st + ' is claimed for TRT by both ' +
            routing[st] + ' and ' + key + '. Controlled-substance routing cannot be ' +
            'ambiguous. Fix korb-pharmacies.js.');
        }
        routing[st] = key;
        if (offered.indexOf(st) < 0) offered.push(st);
      });
    });
    this.states.routing = routing;
    this.states.offered = offered.sort();
    this.hydrated = true;
    return this;
  },

  requireHydrated: function () {
    if (!this.hydrated) throw new Error(
      'korb-trt-data.js: TRT pharmacy routing was asked for before ' +
      'korb-pharmacies.js was loaded. Add <script src="korb-pharmacies.js"></script> ' +
      'BEFORE this file.');
  },

  /* ── CALCULATION ───────────────────────────────────────────────────────────
     The one piece of arithmetic in the program, written once so the provider
     tool, the patient handout and any future document cannot each round it
     their own way. */
  calc: function (weeklyMg, routeKey) {
    var R = this.routes[routeKey];
    if (!R) throw new Error('korb-trt-data.js: unknown route "' + routeKey + '"');
    if (this.weeklyDosesMg.indexOf(weeklyMg) < 0) {
      throw new Error('korb-trt-data.js: ' + weeklyMg + ' mg/week is not on the ladder');
    }
    var conc = this.product.concentrationMgPerMl;
    var mgDose = weeklyMg / R.freq;
    var mlWeek = weeklyMg / conc;
    var vialDays = Math.floor((this.product.vialMl / mlWeek) * 7);
    /* Injections are counted over the days actually WRITTEN on the Rx, not over
       the days the vial physically lasts. Counting on vialDays over-ordered
       supplies for Empower and printed an injection count the prescription does
       not cover. */
    var rxDays = Math.min(vialDays, this.scheduling.maxDays);
    return {
      route: R,
      weeklyMg: weeklyMg,
      mgDose: mgDose,
      mlDose: mgDose / conc,
      mlWeek: mlWeek,
      vialDays: vialDays,
      rxDays: rxDays,
      capped: vialDays > this.scheduling.maxDays,
      injections: Math.ceil(rxDays * R.freq / 7)
    };
  },

  /* The ladder is COMPUTED, never typed. The tool printed it as a static table
     beside the live calculation, which is two places for one number. */
  ladder: function () {
    var self = this;
    return this.weeklyDosesMg.map(function (w) {
      var row = { weeklyMg: w, volumes: {} };
      Object.keys(self.routes).forEach(function (rk) {
        var c = self.calc(w, rk);
        row.volumes[rk] = c.mlDose;
        row.rxDays = c.rxDays;
        row.vialDays = c.vialDays;
      });
      return row;
    });
  },

  /* Patient instructions, built rather than stored, because the text restates
     numbers that must agree with calc(). */
  ptInstructions: function (weeklyMg, routeKey) {
    var c = this.calc(weeklyMg, routeKey);
    return 'Inject ' + c.mlDose.toFixed(2) + ' ml (' + c.mgDose.toFixed(0) + ' mg) ' +
      c.route.short + ' ' + c.route.freqWord + ' or as directed by the physician. ' +
      c.rxDays + ' day supply.' +
      (c.capped ? ' Discard unused portion after 90 days.' : '');
  },

  /* Empower supplies the injection kit and Premier does not, so the pharmacy
     note differs by pharmacy rather than by state. */
  pharmacyNotes: function (weeklyMg, routeKey, pharmacyKey, PH) {
    var c = this.calc(weeklyMg, routeKey);
    var base = 'Bill to office/ship to patient';
    var ph = PH && PH.pharmacies[pharmacyKey];
    var supplies = !!(ph && ph.programs && ph.programs.trt && ph.programs.trt.suppliesKit);
    if (!supplies) return base;
    var n = c.injections;
    var syr = c.route.sq ? '1mL LL syr' : '3mL LL syr';
    return 'Alc pads x' + n + '; ' + syr + ' x' + n + '; ' +
      c.route.drawNeedle + ' x' + n + ' (draw); ' +
      c.route.injectNeedle + ' x' + n + ' (inject), ' + base;
  },

  favoriteName: function (weeklyMg, routeKey, pharmacyKey) {
    var R = this.routes[routeKey];
    return String(pharmacyKey).toUpperCase() + ' - Testosterone ' + weeklyMg + ' mg - ' +
      (R.freq === 1 ? 'IM Weekly' : 'SQ ' + R.freq + 'x Weekly');
  },

  /* ── SELF CHECK ────────────────────────────────────────────────────────────
     Negative-tested when written: breaking the exactness assertion, the cap
     assertion and the ladder assertion each made this return a problem. */
  selfCheck: function () {
    var problems = [], self = this;

    /* Every dose must divide exactly by every frequency at this concentration.
       The whole ladder rests on it and the tool asserted it only in prose. */
    this.weeklyDosesMg.forEach(function (w) {
      Object.keys(self.routes).forEach(function (rk) {
        var ml = (w / self.routes[rk].freq) / self.product.concentrationMgPerMl;
        if (Math.abs(ml * 100 - Math.round(ml * 100)) > 1e-9) {
          problems.push(w + ' mg/week on ' + rk + ' gives ' + ml +
            ' mL, which is not exact to 2 decimal places');
        }
      });
    });

    if (this.product.vialMl * this.product.concentrationMgPerMl !== this.product.vialMg) {
      problems.push('vialMg does not equal vialMl x concentration');
    }

    this.startingDosesMg.forEach(function (d) {
      if (self.weeklyDosesMg.indexOf(d) < 0) problems.push('starting dose ' + d + ' is not on the ladder');
    });

    /* The cap itself, not the clamped value. An earlier version of this check
       asserted calc().rxDays <= maxDays, which calc() guarantees with a
       Math.min - it compared a value against the thing that had just clamped it
       and could never fail. Found by breaking maxDays and watching the check
       stay silent. 90 days is the controlled-substance limit, so the number is
       what needs guarding, not the arithmetic. */
    if (this.scheduling.maxDays > 90) {
      problems.push('maxDays is ' + this.scheduling.maxDays + '. Nothing may be ' +
        'written past 90 days on a Schedule III prescription; confirm the ' +
        'dispense length is permitted in the patient state before changing this.');
    }

    this.weeklyDosesMg.forEach(function (w) {
      Object.keys(self.routes).forEach(function (rk) {
        var c = self.calc(w, rk);
        /* The instructions restate the days supply, so they must agree with it.
           This is the pair that can actually diverge. */
        if (self.ptInstructions(w, rk).indexOf(c.rxDays + ' day supply') < 0) {
          problems.push(w + '/' + rk + ' patient instructions do not state the ' +
            c.rxDays + '-day supply that calc() produces');
        }
        /* BOTH copied values, for every pharmacy. Only patient instructions were
           checked here until 2026-09-16; pharmacy instructions were not, and they
           are the longer of the two on the kit-shipping pharmacies. Tebra
           truncates silently, so a sig that loses its tail still looks like a sig
           and a supply list that loses its tail ships the wrong needles. */
        var pi = self.ptInstructions(w, rk);
        if (pi.length > self.tebra.caps.ptInstructions) {
          problems.push(w + '/' + rk + ' patient instructions are ' + pi.length +
            ' characters, over the ' + self.tebra.caps.ptInstructions + ' cap');
        }
        if (typeof KORB_PHARMACIES !== 'undefined' && self.hydrated) {
          Object.keys(self.states.routing).forEach(function (st) {
            var phKey = self.states.routing[st];
            var pn = self.pharmacyNotes(w, rk, phKey, KORB_PHARMACIES);
            if (pn.length > self.tebra.caps.pharmacyNotes) {
              problems.push(w + '/' + rk + ' pharmacy instructions for ' + phKey +
                ' are ' + pn.length + ' characters, over the ' +
                self.tebra.caps.pharmacyNotes + ' cap');
            }
          });
        }
      });
    });

    /* Nothing provider-facing in this program may say compounded. The product is
       commercial; only the dispensing pharmacy compounds other things. This is
       the assertion that stops the original mistake returning through a
       copy-paste from one of the peptide files, where the wording is correct. */
    if (this.tebra.kind !== 'standard') {
      problems.push('tebra.kind is "' + this.tebra.kind + '". Testosterone cypionate ' +
        'is commercial and must be a Tebra STANDARD prescription.');
    }
    if (this.tebra.reasonForCompounding !== undefined) {
      problems.push('tebra.reasonForCompounding exists. Nothing is compounded, so ' +
        'there is no reason to give and no field to give it in.');
    }
    if (this.product.compounded !== false) {
      problems.push('product.compounded is not false');
    }
    [this.product.drug, this.tebra.selectOnlyNote, this.tebra.kind].forEach(function (v) {
      if (/compound/i.test(String(v))) {
        problems.push('the word "compound" appears in a provider-facing TRT value: ' +
          String(v).slice(0, 60));
      }
    });

    /* A route's rxDays must not depend on the route - the days supply comes from
       the vial and the weekly dose, and a route that changed it would mean the
       ladder's single Days column is a lie. */
    this.weeklyDosesMg.forEach(function (w) {
      var seen = Object.keys(self.routes).map(function (rk) { return self.calc(w, rk).rxDays; });
      if (seen.filter(function (v, i) { return seen.indexOf(v) === i; }).length !== 1) {
        problems.push(w + ' mg/week gives different days supply by route: ' + seen.join(', '));
      }
    });

    if (this.hydrated) {
      var offered = this.states.offered;
      if (!offered.length) {
        problems.push('hydrated but no state offers TRT - check korb-pharmacies.js');
      }
      offered.forEach(function (st) {
        if (!self.prescribers[st]) {
          problems.push(st + ' can be filled but has no named prescriber. ' +
            'Testosterone is Schedule III; a state with no named prescriber is a ' +
            'state nobody may write in.');
        }
      });
    }

    if (typeof console !== 'undefined' && console.log) {
      console.log('KORB_TRT selfCheck: ' +
        (problems.length ? problems.length + ' problem(s)' : 'OK') +
        ', ' + this.decisions.length + ' recorded decision(s)');
    }
    return problems;
  }
};

/* Hydrate on load when the pharmacy layer is present - the same line the other
   two program files carry. A Node caller requiring this file directly must call
   hydrate() itself. */
if (typeof KORB_PHARMACIES !== 'undefined') { KORB_TRT.hydrate(KORB_PHARMACIES); }

/* Sections are derived from the clinical data, so they are built after
   hydrate() - the availability table reads the routing it produces. */
if (KORB_TRT.hydrated) { KORB_TRT.documentBuild(); }

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_TRT; }
