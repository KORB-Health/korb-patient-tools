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
    version: '1.1',
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
      'is, pending the formal program review.'
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
    maxDaysWhy: 'Nothing is dispensed or scheduled beyond 90 days. At 96, 120 ' +
                'and 144 mg per week the vial physically outlasts 90 days and the ' +
                'remainder is discarded. Never tell a patient the vial lasts ' +
                'longer than 90 days.',
    refillCountsFrom: 'PMP last fill date, not the visit date.'
  },

  /* ── DOSES AND ROUTES ──────────────────────────────────────────────────────
     Every weekly dose divides exactly by every frequency at 200 mg/mL, which is
     why the ladder needs no rounding and the weekly dose in the chart is the
     weekly dose in the patient whatever the route. selfCheck asserts it. */
  weeklyDosesMg: [96, 120, 144, 168],
  startingDosesMg: [96, 120],

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
    timing: 'Draw testosterone at trough, on an injection day before the dose is ' +
            'given. A peak draw will read high and hide a symptomatic trough.',
    cadence: 'Full panel at baseline and at each follow-up. Recheck 6 to 8 weeks ' +
             'after any change.',
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
      'Uncontrolled polycythemia, or elevated hematocrit at baseline',
      'Severe untreated obstructive sleep apnea',
      'Uncontrolled heart failure; MI or stroke within the last 6 months',
      'Thrombophilia',
      'Active desire for fertility in the near term (relative; counsel and consider referral)',
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
      'Add-on pricing is held in korb-addons-data.js so it is maintained in one place.'
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
  prescribers: {
    TX: 'Don Stevenson',
    CA: 'Larisa or LaTonya',
    warning: 'Testosterone may only be prescribed in a state by the provider named ' +
             'for it. If that is not you, do not send the prescription. Route the ' +
             'patient to a provider registered in that state.'
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
        var pi = self.ptInstructions(w, rk);
        if (pi.length > self.tebra.caps.ptInstructions) {
          problems.push(w + '/' + rk + ' patient instructions are ' + pi.length +
            ' characters, over the ' + self.tebra.caps.ptInstructions + ' cap');
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

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_TRT; }
