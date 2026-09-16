/* ============================================================================
   KORB HEALTH - WOMEN'S HEALTH / MENOPAUSE CLINICAL DATA    SOURCE OF TRUTH

   Menopausal hormone therapy: estradiol, progesterone, testosterone, estriol,
   plus PT-141. Every fact a KORB tool or document states about the women's
   health programme is written here once and read from here.

   WHERE THIS CAME FROM

   Open item 6, second half. Extracted from
   Provider_Reference/KORB_Womens_Health_Provider_Tool.html, which already held
   the current model as JavaScript - the ingredient list, the pharmacy-specific
   strengths, the pricing tiers, the testosterone state restriction and the
   clinical gates.

   NOT from docs/programs/Womens_Health_Menopause_2025-11-26.md in
   korb-clinical-docs. That document is from November 2025 and Don confirmed on
   2026-09-16 that anything in it beyond what the tool carries is out of date -
   the same thing that turned out to be true of the February TRT documents. It
   is cited below only where it is the sole source for something the tool does
   not encode, and every such case says so.

   THE ROUTING RULE, in Don's words on 2026-09-16:

       "The default pharmacy is Premier for all premier states and then any
        other ones are Belmar."

   So Premier where Premier is licensed, Belmar everywhere else. That is the
   OPPOSITE of the November document, which says Belmar for all states except
   Texas and Premier for Texas only. The tool already had the current rule and
   its 38-state Premier list is byte-identical to the shared footprint, which is
   why routing is computed rather than typed - see hydrate().

   The November document also names the partner pharmacies as "Premier & FKO"
   on every pricing tier. FarmaKeio has no part in this programme. Recorded in
   sourceConflicts rather than silently dropped, because it appears nine times
   and the next person to read that document will hit it too.
   ============================================================================ */

var KORB_WOMENS = {

  meta: {
    version: '1.0',
    created: '2026-09-16',
    updated: '2026-09-16',
    owner: 'Director of Clinical Operations',
    entity: 'KORB Health Medical Texas PA',
    extractedFrom: 'Provider_Reference/KORB_Womens_Health_Provider_Tool.html as at 2026-09-16',
    scope: 'Menopausal hormone therapy for women. Male testosterone replacement ' +
           'is korb-trt-data.js.',
    changelog: [
      '2026-09-16 (v1.0): CREATED. Open item 6, second half. Extracted from the ' +
      'hand-built provider tool, which already carried the current model. The ' +
      'November 2025 programme document was NOT used as the source: Don confirmed ' +
      'the same day that anything in it beyond the tool is out of date, including ' +
      'its pharmacy routing, which is backwards, and its naming of FarmaKeio as a ' +
      'partner pharmacy for this programme. Pharmacy and state facts come from ' +
      'korb-pharmacies.js at load.'
    ]
  },

  /* See rx-signoff.js. Nothing reviewed yet. */
  rxSignoff: { records: {} },

  sourceConflicts: [
    {
      topic: 'Which pharmacy is the default',
      current: 'Premier in every state Premier is licensed for; Belmar in the ' +
               'other 13. Confirmed by Don 2026-09-16 and already what the tool did.',
      sop: 'Womens_Health_Menopause_2025-11-26.md says Belmar for all states ' +
           'except Texas, and Premier for Texas only.',
      resolution: 'CURRENT GOVERNS. The November rule is backwards.'
    },
    {
      topic: 'Which pharmacies are partners',
      current: 'Premier and Belmar.',
      sop: 'The November pricing section says "Premier & FKO Pharmacies" on every ' +
           'tier - nine occurrences. FarmaKeio has no part in this programme.',
      resolution: 'CURRENT GOVERNS. Recorded because a reader of that document ' +
        'will hit it nine times and needs to know it is wrong, not ambiguous.'
    }
  ],

  /* -- THE FOUR BILLABLE INGREDIENTS -----------------------------------------
     Pricing is tiered by how many of these a plan contains, NOT by how many
     prescriptions are written. One product can carry two ingredients: a
     progesterone/estradiol cream is a two-ingredient plan in a single tube. */
  hormones: [
    { id: 'e2',   name: 'Estradiol',    form: 'patch or cream', compounded: false },
    { id: 'prog', name: 'Progesterone', form: 'capsule',        compounded: false },
    { id: 'test', name: 'Testosterone', form: 'cream, compounded only', compounded: true,
      restricted: true },
    { id: 'estr', name: 'Estriol',      form: 'only in the oral four-hormone capsule',
      compounded: true }
  ],

  /* -- WHAT EACH PARTNER PHARMACY OFFERS --------------------------------------
     The strengths differ by pharmacy, which is the single most common way a
     women's health prescription goes wrong: a provider switches a patient
     between pharmacies and carries the old strength across. Belmar has a 0.4%
     and a 0.8% estradiol cream that Premier does not; Premier has a 0.6% that
     Belmar does not. Only 0.2% exists at both. */
  pharmacyOffers: {
    premier: {
      estradiolCream: ['0.2% (0.5 mg/click)', '0.6% (1.5 mg/click)'],
      estradiolPatch: true,
      progesterone: 'Both commercial and compounded. State which you want.',
      testosterone: 'Texas only, and restricted to named prescribers.'
    },
    belmar: {
      estradiolCream: ['0.2% (0.5 mg/click)', '0.4% (1 mg/click)', '0.8% (2 mg/click)'],
      estradiolPatch: false,
      progesterone: 'Compounded only.',
      testosterone: 'Every state except Texas - but see the testosterone restriction: ' +
                    'in practice that means California only.'
    }
  },

  /* The only strength both pharmacies carry. Anything else changes when the
     patient moves, and the prescription has to change with it. */
  sharedStrength: '0.2% (0.5 mg/click)',

  belmarAddress: {
    warning: 'Belmar has several locations. KORB uses the ARIZONA address.',
    address: '12012 N 111th Ave, Youngtown, AZ 85363-1339',
    why: 'Confirm that is the Belmar selected in Tebra before sending. Another ' +
         'Belmar location will be the wrong one.'
  },

  /* -- CREAM ARITHMETIC -------------------------------------------------------
     Pharmacies want the sig in mg AND clicks, so the conversion has to be right
     and has to be written down once. A click is 0.25 mL, so a percentage
     converts as: 1% = 10 mg/mL, and one click delivers a quarter of that.
     Source: the November document, which is the only place this is written.
     It is arithmetic rather than a clinical decision, so it does not age. */
  creamMath: {
    clickMl: 0.25,
    clicksPerTube: 120,
    tubeMl: 30,
    rule: 'Percent to mg per mL: multiply by 10. One click is 0.25 mL, so one ' +
          'click delivers a quarter of the mg/mL figure.',
    examples: [
      '2% testosterone = 20 mg/mL, so 1 click = 5 mg.',
      '0.6% estradiol = 6 mg/mL, so 1 click = 1.5 mg.'
    ],
    sigRule: 'Write the sig in BOTH mg and clicks. The pharmacies ask for it that way.',
    application: 'Apply to hairless, thin skin - inner thigh, labia, back of the ' +
      'upper arm, forearm. Let it dry before contact with another person, to ' +
      'prevent transfer. Wash hands after applying. Patches go on the lower ' +
      'abdomen or upper buttock.'
  },

  /* -- CLINICAL GATES ---------------------------------------------------------
     The two rules a provider must not get wrong, and one document requirement. */
  gates: {
    unopposedEstrogen: {
      trigger: 'Estrogen prescribed to a patient WITH a uterus and no progesterone.',
      severity: 'stop',
      text: 'Unopposed estrogen in a patient with a uterus causes endometrial ' +
            'hyperplasia and can lead to cancer. Add progesterone before sending.'
    },
    noUterus: {
      trigger: 'Patient without a uterus.',
      severity: 'info',
      text: 'Estradiol alone is first-line for a patient without a uterus. ' +
            'Progesterone is not required to protect an endometrium that is not there.'
    },
    medicalNecessity: {
      trigger: 'Any compounded item in the plan.',
      severity: 'warn',
      text: 'A Medical Necessity Statement is required for any compounded item. ' +
            'It is wider than the local-pharmacy block: it applies whenever a ' +
            'compounded product is dispensed, whichever partner pharmacy fills it.'
    },
    localPharmacy: {
      trigger: 'Patient wants to use insurance at their own pharmacy.',
      severity: 'warn',
      text: 'Local pharmacies take the estradiol PATCH and commercial capsules ' +
            'only. NO topical creams and no compounded item goes to a local ' +
            'pharmacy - those go to Premier or Belmar.'
    }
  },

  /* -- TESTOSTERONE RESTRICTION -----------------------------------------------
     Women's testosterone is the same Schedule III molecule as male TRT, so the
     same DEA constraint applies and it is much narrower than the programme. */
  testosterone: {
    states: ['TX', 'CA'],
    prescribers: { TX: 'Don Stevenson, PA-C', CA: 'Larisa Hammond, NP or LaTonya King, DNP' },
    why: 'Texas and California only, because those are the only states where a ' +
         'KORB provider holds the required DEA registration.',
    outsideRule: 'Outside those two states, remove testosterone from the plan. ' +
      'Every other hormone in the programme is still available.',
    sourceRule: 'Testosterone comes from Belmar, except in Texas where it comes ' +
      'from Premier - which follows from the routing rule rather than being a ' +
      'separate one.',
    prescriberRule: 'Testosterone may only be prescribed in a state by the provider ' +
      'named for it. If that is not you, do not send the prescription.'
  },

  /* -- PRICING ----------------------------------------------------------------
     Tiered by ingredient count, not prescription count. A four-ingredient plan
     bills at the three-ingredient tier - there is no fourth tier. */
  pricing: {
    tiers: [
      { ingredients: 1, price: '$220', code: 'WMNHlth1' },
      { ingredients: 2, price: '$250', code: 'WMNHlth2' },
      { ingredients: 3, price: '$299', code: 'WMNHlth3' }
    ],
    fourRule: 'Four ingredients bill at the three-ingredient tier, $299 / WMNHlth3. ' +
      'There is no fourth tier.',
    includes: 'Visit, 90-day supply and shipping, from a partner pharmacy.',
    insurance: { label: 'Insurance - 90-day supply to the patient local pharmacy',
                 price: '$79', code: 'WMNHlthINS' },
    withLabs: [
      { label: 'One medication + Basic Hormones (saliva)', price: '$339', code: 'WMNHlth1Bsc' },
      { label: 'One medication + Complete Hormones (saliva and blood spot)', price: '$469', code: 'WMNHlth1Cmp' },
      { label: 'Two medications + Basic Hormones (saliva)', price: '$369', code: 'WMNHlth2Bsc' },
      { label: 'Two medications + Complete Hormones (saliva and blood spot)', price: '$499', code: 'WMNHlth2Cmp' },
      { label: 'Three medications + Basic Hormones (saliva)', price: '$418', code: 'WMNHlth3Bsc' },
      { label: 'Three medications + Complete Hormones (saliva and blood spot)', price: '$548', code: 'WMNHlth3Cmp' }
    ],
    labsAlone: [
      { label: 'Women Basic Hormones (saliva)', price: '$119', code: 'LABHlthBsc' },
      { label: 'Women Health Complete Hormones (saliva and blood spot)', price: '$249', code: 'LABHlthCmp' }
    ],
    pt141: [
      { label: 'PT-141 added to another women health product', price: '$119', code: 'WMN141add' },
      { label: 'PT-141 as a standalone product', price: '$149', code: 'WMN141reg' }
    ],
    cadence: 'Prescriptions and dosing are quarterly. PT-141 is the exception and ' +
             'is a 28-day supply only.'
  },

  /* -- LABS -------------------------------------------------------------------
     The only KORB programme that does not use Quest. At-home collection through
     Ayumetrix, and saliva rather than serum for a stated reason. */
  labs: {
    vendor: 'Ayumetrix',
    vendorNote: 'At-home collection. This is the only KORB programme that does ' +
      'not order through the Quest integration in Tebra.',
    salivaRationale: 'Saliva measures the bioavailable, non-protein-bound fraction ' +
      'that can diffuse into tissue, so it reflects what a TOPICAL hormone actually ' +
      'delivers. Serum does not rise meaningfully after topical dosing, so a normal ' +
      'serum level on a patient using a cream tells you very little.',
    panels: [
      { name: 'Women Basic Hormones', type: 'Saliva', price: '$119', code: 'LABHlthBsc' },
      { name: 'Women Health Complete Hormones', type: 'Saliva and blood spot',
        price: '$249', code: 'LABHlthCmp' }
    ]
  },

  /* -- CONTRAINDICATIONS. Source: the November document, section 4. -----------
     Clinical safety rather than dosing, so it does not fall under Don's
     "everything else is out of date". */
  contraindications: {
    lead: 'Hormone therapy is not recommended for women with any of the following. ' +
          'Refer to the PCP or OBGYN. Do not prescribe.',
    items: [
      'History of breast cancer, endometrial cancer, or any estrogen-sensitive cancer',
      'History of venous thromboembolism or a clotting disorder',
      'History of stroke or heart attack, or uncontrolled hypertension',
      'Active liver disease',
      'Unexplained vaginal bleeding'
    ]
  },

  /* -- PHARMACY ROUTING, FROM THE SHARED LAYER --------------------------------
     Empty in source and filled by hydrate(). */
  states: {
    /* COMPUTED AT LOAD: { AZ:'premier', ..., CA:'belmar', ... } for all 51. */
    routing: {},
    premierStates: [],
    belmarStates: []
  },

  /* -- THE STANDALONE DOCUMENT ------------------------------------------------
     Built by documentBuild() from the clinical data above, so no fact in it is
     typed twice. Ordered the way a provider needs it: what the programme is,
     the two clinical gates that stop a prescription being wrong, then the
     pharmacy and what each one stocks, then prescribing detail, pricing, labs,
     and the contraindications last. */
  document: {
    id: 'womens',
    file: 'KORB_Womens_Health_Clinical_Reference',
    title: "Women's Health Clinical Reference",
    subtitle: 'Menopausal hormone therapy',
    kicker: 'Provider use only',
    entity: 'KORB Health Medical Texas PA',
    version: '1.0',
    effective: '2026-09-16',
    supersedes: 'The Women\'s Health Clinical Reference PDF of 2026-09-10, which was ' +
      'hand-produced and carried no version or effective date.',
    intro: 'Menopausal hormone therapy: estradiol, progesterone, testosterone and ' +
      'estriol, plus PT-141. Pricing is tiered by how many hormones a plan ' +
      'contains, not by how many prescriptions are written, and the available ' +
      'strengths differ between the two partner pharmacies. Both of those are ' +
      'easy to get wrong and both are set out below.',
    pharmacyOrder: ['premier', 'belmar'],
    /* Declared, not accidental. rx-signoff treats a document that renders no
       prescribing blocks as a broken extractor unless the data file says
       otherwise, which is the right default - this is the first honest case. */
    noPrescribingBlocks: 'This programme\'s Tebra entries are per-hormone and ' +
      'per-strength and were never encoded in the hand-built tool, so there are ' +
      'none to render yet. The document carries the routing, the strengths, the ' +
      'pricing and the clinical gates; the prescribing blocks are still to be built.',
    sections: []
  },

  documentBuild: function () {
    var W = this, d = this.document;
    var PH = (typeof KORB_PHARMACIES !== 'undefined') ? KORB_PHARMACIES : null;
    var stName = function (st) { return PH ? PH.stateName(st) + ' (' + st + ')' : st; };

    d.sections = [
      {
        id: 'how', heading: 'How the programme works',
        body: [
          'Four hormones can appear in a plan: estradiol, progesterone, testosterone ' +
            'and estriol. Each counts as ONE ingredient toward the price, and one ' +
            'product can carry two - a progesterone and estradiol cream is a ' +
            'two-ingredient plan in a single tube.',
          W.pricing.cadence,
          'Creams go to a partner pharmacy. ' + W.gates.localPharmacy.text
        ]
      },
      {
        id: 'gates', heading: 'The two gates - check these before you send',
        render: 'bullets',
        warn: true,
        body: ['Both of these make a prescription wrong rather than suboptimal.'],
        bullets: [
          W.gates.unopposedEstrogen.text,
          W.gates.medicalNecessity.text
        ],
        callouts: [W.gates.noUterus.text]
      },
      {
        id: 'routing', heading: 'Which pharmacy fills for your patient',
        render: 'table',
        /* A LOOKUP, one state per cell, not a list of states in a sentence.
           build-clinical-docs.js refuses a document that restates a state list
           as narrative - the guard exists because a document once published a
           pharmacy's PREFERRED states as its SHIP-TO states - and it is right
           to. This is computed from korb-pharmacies.js at load and laid out
           three pairs to a row so all 51 fit without scrolling. */
        columns: ['State', 'Pharmacy', 'State', 'Pharmacy', 'State', 'Pharmacy'],
        rows: (function () {
          var keys = Object.keys(W.states.routing).sort();
          var name = { premier: 'Premier', belmar: 'Belmar' };
          var per = Math.ceil(keys.length / 3), out = [];
          for (var r = 0; r < per; r++) {
            var row = [];
            for (var c = 0; c < 3; c++) {
              var k = keys[c * per + r];
              row.push(k || '', k ? name[W.states.routing[k]] : '');
            }
            out.push(row);
          }
          return out;
        })(),
        body: ['Premier is the default wherever Premier is licensed. Belmar covers ' +
               'every remaining state. All 51 jurisdictions resolve to one of the two, ' +
               'and this table is computed from the shared pharmacy layer rather than ' +
               'maintained by hand.'],
        callouts: [
          W.belmarAddress.warning + ' ' + W.belmarAddress.address + '. ' + W.belmarAddress.why
        ]
      },
      {
        id: 'testosterone', heading: 'Testosterone - two states only',
        render: 'bullets',
        warn: true,
        body: [W.testosterone.why],
        bullets: W.testosterone.states.map(function (st) {
          return stName(st) + ' - may only be prescribed by ' + W.testosterone.prescribers[st] + '.';
        }).concat([W.testosterone.outsideRule, W.testosterone.sourceRule]),
        callouts: [W.testosterone.prescriberRule]
      },
      {
        id: 'strengths', heading: 'What each pharmacy stocks',
        render: 'table',
        columns: ['', 'Premier', 'Belmar'],
        rows: [
          ['Estradiol cream', W.pharmacyOffers.premier.estradiolCream.join('; '),
           W.pharmacyOffers.belmar.estradiolCream.join('; ')],
          ['Estradiol patch', W.pharmacyOffers.premier.estradiolPatch ? 'Yes' : 'No',
           W.pharmacyOffers.belmar.estradiolPatch ? 'Yes' : 'No'],
          ['Progesterone', W.pharmacyOffers.premier.progesterone, W.pharmacyOffers.belmar.progesterone],
          ['Testosterone', W.pharmacyOffers.premier.testosterone, W.pharmacyOffers.belmar.testosterone]
        ],
        body: ['The strengths are NOT the same at both pharmacies, and that is the ' +
               'commonest way a women\'s health prescription goes wrong: a patient ' +
               'moves between pharmacies and the old strength is carried across.'],
        callouts: ['Only ' + W.sharedStrength + ' exists at both. Every other estradiol ' +
                   'cream strength changes when the pharmacy changes, so the prescription ' +
                   'has to change with it.']
      },
      {
        id: 'creams', heading: 'Writing a cream prescription',
        render: 'bullets',
        body: [W.creamMath.rule, W.creamMath.sigRule],
        bullets: W.creamMath.examples.concat([
          'A 30 mL tube is ' + W.creamMath.clicksPerTube + ' clicks at ' +
            W.creamMath.clickMl + ' mL each.',
          W.creamMath.application
        ])
      },
      {
        id: 'pricing', heading: 'Pricing and charge codes',
        render: 'table',
        columns: ['Plan', 'Price', 'Charge code'],
        rows: W.pricing.tiers.map(function (t) {
          return [t.ingredients + ' hormone' + (t.ingredients > 1 ? 's' : '') +
                  ' - ' + W.pricing.includes, t.price, t.code];
        }).concat([[W.pricing.insurance.label, W.pricing.insurance.price, W.pricing.insurance.code]])
          .concat(W.pricing.withLabs.map(function (r) { return [r.label, r.price, r.code]; }))
          .concat(W.pricing.pt141.map(function (r) { return [r.label, r.price, r.code]; })),
        copyColumn: 2,
        body: ['Tiered by the number of HORMONES in the plan, not the number of ' +
               'prescriptions.'],
        callouts: [W.pricing.fourRule, W.pricing.cadence]
      },
      {
        id: 'labs', heading: 'Labs',
        render: 'table',
        columns: ['Panel', 'Collection', 'Price', 'Charge code'],
        rows: W.labs.panels.map(function (l) { return [l.name, l.type, l.price, l.code]; }),
        copyColumn: 3,
        body: ['Collected at home through ' + W.labs.vendor + '. ' + W.labs.vendorNote],
        callouts: [W.labs.salivaRationale]
      },
      {
        id: 'contra', heading: 'Contraindications - do not prescribe',
        render: 'bullets',
        body: [W.contraindications.lead],
        bullets: W.contraindications.items
      }
    ];
    return d;
  },

  hydrated: false,

  /* Premier where Premier is licensed, Belmar everywhere else. The rule is a
     PROGRAMME decision and lives here; the footprints it reads are pharmacy
     facts and live in korb-pharmacies.js. Belmar is licensed in all 51, so
     every state resolves - requireHydrated throws rather than leaving a gap. */
  hydrate: function (PH) {
    if (!PH || !PH.pharmacies) throw new Error(
      'korb-womens-data.js: korb-pharmacies.js must be loaded first.');
    var premier = PH.statesFor('premier', 'womens');
    var routing = {}, belmarStates = [];
    PH.states.korbActive.forEach(function (st) {
      if (premier.indexOf(st) > -1) { routing[st] = 'premier'; return; }
      if (PH.servesState('belmar', st, 'womens')) { routing[st] = 'belmar'; belmarStates.push(st); return; }
      throw new Error('korb-womens-data.js: ' + st + ' routes to neither Premier nor ' +
        'Belmar for women\'s health. Every active state must resolve to a pharmacy; ' +
        'fix korb-pharmacies.js rather than leaving a state unrouted.');
    });
    this.states.routing = routing;
    this.states.premierStates = premier.slice().sort();
    this.states.belmarStates = belmarStates.sort();
    this.hydrated = true;
    return this;
  },

  requireHydrated: function () {
    if (!this.hydrated) throw new Error(
      'korb-womens-data.js: pharmacy routing was asked for before ' +
      'korb-pharmacies.js was loaded. Add <script src="korb-pharmacies.js"></script> ' +
      'BEFORE this file.');
  },

  /* Which pharmacy fills for a state, and whether testosterone is even allowed. */
  routeFor: function (state) {
    this.requireHydrated();
    return {
      pharmacy: this.states.routing[state] || null,
      testosteroneAllowed: this.testosterone.states.indexOf(state) > -1,
      prescriber: this.testosterone.prescribers[state] || null
    };
  },

  /* Ingredient count to price. Four bills at three. */
  tierFor: function (n) {
    if (!n) return null;
    var t = this.pricing.tiers;
    return t[Math.min(n, t.length) - 1];
  },

  selfCheck: function () {
    var problems = [], self = this;

    if (this.hydrated) {
      var n = Object.keys(this.states.routing).length;
      if (n !== 51) problems.push('routing covers ' + n + ' states, not 51');
      if (this.states.premierStates.length + this.states.belmarStates.length !== n) {
        problems.push('premierStates and belmarStates do not partition the routing');
      }
      /* A state cannot be in both lists. The two are a partition, and an overlap
         would mean a provider could be shown either answer. */
      var both = this.states.premierStates.filter(function (s) {
        return self.states.belmarStates.indexOf(s) > -1;
      });
      if (both.length) problems.push('states in BOTH pharmacy lists: ' + both.join(','));

      this.testosterone.states.forEach(function (st) {
        if (!self.states.routing[st]) {
          problems.push('testosterone is allowed in ' + st + ' but it routes to no pharmacy');
        }
        if (!self.testosterone.prescribers[st]) {
          problems.push(st + ' allows testosterone but names no prescriber. It is ' +
            'Schedule III; a state with no named prescriber is a state nobody may write in.');
        }
      });
    }

    /* Pricing: every tier and every code present and distinct. A duplicated
       charge code bills the wrong thing and nothing downstream would notice. */
    var codes = [];
    this.pricing.tiers.forEach(function (t) { codes.push(t.code); });
    this.pricing.withLabs.concat(this.pricing.labsAlone, this.pricing.pt141)
      .forEach(function (r) { codes.push(r.code); });
    codes.push(this.pricing.insurance.code);
    codes.forEach(function (c, i) {
      if (codes.indexOf(c) !== i) problems.push('duplicate charge code: ' + c);
    });
    if (this.pricing.tiers.length !== 3) {
      problems.push('expected 3 pricing tiers, found ' + this.pricing.tiers.length);
    }
    if (this.tierFor(4) !== this.pricing.tiers[2]) {
      problems.push('four ingredients must bill at the three-ingredient tier');
    }

    /* The cream arithmetic, checked rather than trusted - it is the number a
       provider writes on a prescription. */
    var mgPerClick = function (pct) { return pct * 10 * self.creamMath.clickMl; };
    if (mgPerClick(2) !== 5) problems.push('2% cream should be 5 mg per click, got ' + mgPerClick(2));
    if (mgPerClick(0.6) !== 1.5) problems.push('0.6% cream should be 1.5 mg per click');
    if (self.creamMath.clicksPerTube * self.creamMath.clickMl !== self.creamMath.tubeMl) {
      problems.push('clicks per tube x mL per click does not equal the tube size');
    }

    /* The one strength both pharmacies carry must actually be in both lists. */
    ['premier', 'belmar'].forEach(function (k) {
      if (self.pharmacyOffers[k].estradiolCream.indexOf(self.sharedStrength) < 0) {
        problems.push(k + ' does not list the strength recorded as shared: ' + self.sharedStrength);
      }
    });

    if (typeof console !== 'undefined' && console.log) {
      console.log('KORB_WOMENS selfCheck: ' +
        (problems.length ? problems.length + ' problem(s)' : 'OK'));
    }
    return problems;
  }
};

if (typeof KORB_PHARMACIES !== 'undefined') { KORB_WOMENS.hydrate(KORB_PHARMACIES); }

/* After hydrate(): the routing table section reads the states it produces. */
if (KORB_WOMENS.hydrated) { KORB_WOMENS.documentBuild(); }

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_WOMENS; }
