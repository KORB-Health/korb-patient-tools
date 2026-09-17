/* ============================================================================
   KORB HEALTH - WOMEN'S HEALTH / MENOPAUSE CLINICAL DATA    SOURCE OF TRUTH

   Menopausal hormone therapy: estradiol, progesterone, testosterone and estriol.
   Every fact a KORB tool or document states about the women's
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
  rxSignoff: {
    records: {
      /* Signed 2026-09-16, at the end of the session that built this document.
         Don read it through on screen across several passes and drove most of
         what is in it: the destination split, the 12-week supply, commercial
         progesterone, the patch boxes, and the three clinical sections he
         approved by name. */
      "womens:womens": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-16",
        "dataVersion": "1.0",
        "fingerprint": "fp-0663145a-88756",
        "blocks": 41,
        "attests": "Reviewed the prescribing blocks on this document as rendered - drug formulation, Tebra favorite name, quantity, unit, refill, days supply, patient instructions, reason for compounding, pharmacy instructions and the charge codes - and approve them for use in prescribing."
      }
    }
  },

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

  /* -- SUPPLY LENGTH AND VISIT CADENCE ---------------------------------------
     Don asked on 2026-09-16 whether to call everything 90 days, rename the
     programme to 12 weeks, or state each product honestly. He then settled it:
     EVERYTHING IS 12 WEEKS. Not some products at 84 days and some at 90 with a
     note explaining the difference - one number across the whole programme.

       12 weekly patches                     3 boxes of 4       84 days
       progesterone cycled 21-on / 7-off     63 capsules        84 days
       progesterone daily                    84 capsules        84 days
       cream                                 one 30 mL bottle   84 days
       Belmar estradiol/testosterone cream   28-day bottle x3   84 days

     The daily capsules went from 90 to 84 because KORB buys progesterone BY THE
     CAPSULE, so 84 is orderable and there is no reason to write 90. The creams
     hold more than 84 days of clicks and the remainder is discarded, which is
     the same rule the GLP-1 and TRT vials already run on.

     WHY NOT 90. Ninety days and "quarterly" are marketing words - they read
     better on the website and they are staying there. This is an internal
     provider document, so it says what the prescription is. Twelve weeks is
     eighty-four days, and a follow-up booked at twelve weeks lands exactly when
     the medication runs out instead of six days early or six days late. */
  supply: {
    visitCadence: '12 weeks',
    visitRule: 'Everything in this programme is a 12-WEEK supply and the follow-up ' +
      'is at 12 WEEKS. One number, every product, every patient. Nothing runs out ' +
      'before the visit and nothing carries a leftover clock.',
    billingNote: 'The charge codes and the price are unchanged. The website and ' +
      'the patient-facing material say 90 days or quarterly because it reads ' +
      'better; this is an internal document, so it says what the prescription ' +
      'actually is. 12 weeks and 84 days are the same thing.',
    byProduct: [
      { product: 'Estradiol patch', supply: '84 days', why: '3 boxes of 4 = 12 patches, one a week' },
      { product: 'Progesterone, cycled', supply: '84 days', why: '63 capsules, 21 on and 7 off, three cycles' },
      { product: 'Progesterone, daily', supply: '84 days', why: '84 capsules, one a night' },
      { product: 'Creams', supply: '84 days', why: 'One 30 mL bottle. It holds more than 84 days of clicks; the remainder is discarded' },
      { product: 'Belmar estradiol/testosterone cream', supply: '84 days', why: 'A 28-day bottle with 2 refills' }
    ]
  },

  /* -- ESTRADIOL PATCHES -----------------------------------------------------
     The one product where the Tebra drop-down offers a real choice that changes
     the prescription. Don, 2026-09-16. */
  patchGuidance: {
    weekly: 'Tebra lists ONCE-weekly and TWICE-weekly transdermal patches, and ' +
      'the local commercial route now carries BOTH at all five strengths. Write ' +
      'whichever the patient\'s pharmacy can actually source. The once-weekly is ' +
      'fewer applications, but it is the harder of the two to get.',
    sourcing: 'TWO SEPARATE THINGS, and they are easy to run together. ' +
      'FIRST, the ONCE-weekly patch is in short supply generally. That is a ' +
      'market shortage and not a Premier problem, so Premier is still a route ' +
      'for it and its entries below stand. CONFIRM WITH PREMIER THAT THEY CAN ' +
      'GET IT before sending a once-weekly patch there. SECOND, the ' +
      'TWICE-weekly patch is NOT ordered through Premier at all. Premier was ' +
      'asked on 2026-09-16 and CAN source it, but not at a price that works ' +
      'against KORB pricing with the compounded partner pharmacies, and ' +
      'raising the price was considered and rejected. So the twice-weekly ' +
      'presentation goes to the patient\'s own local pharmacy only.',
    boxRule: 'Box sizes differ by presentation and BOTH come to 3 BOXES for ' +
      'twelve weeks - quantity 3 BX either way, which is arithmetic and not a ' +
      'copy-paste. Once-weekly: BOX OF 4, 3 x 4 = 12 patches, one a week. ' +
      'Twice-weekly: BOX OF 8, 3 x 8 = 24 patches, two a week. The pharmacy ' +
      'note spells that out so the pharmacy tells us if their pack size differs.',
    daysRule: 'These are an 84-DAY supply, not 90 - for both presentations. ' +
      'Twelve weekly patches is twelve weeks, and twenty-four twice-weekly ' +
      'patches is also twelve weeks. Book the follow-up at 12 weeks. Corrected ' +
      '2026-09-16 after Don raised it - the entries had read 90 since the ' +
      'source document.'
  },

  /* -- WHO PAYS THE PHARMACY -------------------------------------------------
     The distinction that decides the pharmacy note, and it is NOT commercial
     versus compounded. Don, 2026-09-16:

       PARTNER PHARMACY (Premier, Belmar) - KORB pays the pharmacy and the
         patient pays KORB. The note must carry "Bill to office/ship to
         patient". This is true of a COMMERCIAL product sent to a partner
         pharmacy as much as a compounded one: a patch filled by Premier is
         still billed to the office.

       LOCAL PHARMACY - the patient pays the pharmacy directly, as a cash
         customer. The note must NOT say bill to office, because nobody is
         billing the office.

     Getting that wrong in the local direction sends the bill to KORB for a
     medication the patient has already paid for. So the entries that CAN go
     either way carry two separate notes, and a provider copies the one that
     matches where it is going rather than editing a line under time pressure. */
  dispensing: {
    rule: 'The pharmacy note depends on WHERE it goes, not on whether the product ' +
      'is commercial or compounded.',
    partner: 'Partner pharmacy (Premier or Belmar): KORB pays the pharmacy, the ' +
      'patient pays KORB. The note says Bill to office/ship to patient. True for a ' +
      'commercial patch filled by Premier just as much as for a compound.',
    local: 'Local pharmacy: the patient pays the pharmacy as a cash customer. The ' +
      'note must NOT say bill to office.',
    /* Flagged 2026-09-16 while checking the supply arithmetic, not changed:
       the Belmar estradiol/testosterone cream is written for 28 DAYS while its
       Premier twin is written for 90, and every other cream in the programme is
       90. One of the two is wrong. A days-supply figure is a prescribing
       decision so it is left as the source had it and raised with Don. */
    openQuestion28Day: 'Belmar Estradiol/Testosterone cream reads 28 days; the ' +
      'Premier equivalent reads 90, as does every other cream. Needs Don.',
    whatCanGoLocal: 'Only commercially available products can go to a local ' +
      'pharmacy. In this programme that is the estradiol patches and COMMERCIAL ' +
      'progesterone at 100 mg or 200 mg. Every cream, every compounded capsule ' +
      'and the 300 mg progesterone go to a partner pharmacy, full stop.'
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
    fourRule: 'Four hormones bill at the three-hormone tier, $299 / WMNHlth3. ' +
      'There is no fourth tier.',
    includes: 'Visit, 12-week supply and shipping, from a partner pharmacy.',
    /* NOT "insurance". The charge code is historic and stays, but the wording
       does not: describing this as an insurance option implies KORB bills
       insurance, and that carries obligations - prior authorisations, medical
       necessity letters, appeals - that KORB does not take on and that $79 does
       not cover. The patient pays cash at their own pharmacy. If they choose to
       run it through their plan that is theirs to do, and theirs to paper.
       Don, 2026-09-16. */
    insurance: { label: 'Local pharmacy - 12-week supply, patient pays the pharmacy',
                 price: '$79', code: 'WMNHlthINS' },
    localPharmacyRule: 'The $79 covers the VISIT and the 12-week prescription. The patient ' +
      'pays their own pharmacy for the medication, as a cash customer. KORB does ' +
      'not bill insurance for it.',
    localPharmacyDisclaimer: 'If a patient chooses to run the prescription through ' +
      'their insurance, that is their decision and their paperwork. KORB does NOT ' +
      'complete prior authorisations, medical necessity letters, appeals or any ' +
      'other insurance documentation for these prescriptions. None of that is ' +
      'included in the $79, and it is not available separately - refer the patient ' +
      'to their primary care provider for it.',
    /* Put first in the document. It is the cheapest option and, as of
       2026-09-16, the one most providers are actually using. */
    insuranceFirst: true,
    insuranceIntent: 'ONE 12-week supply, sent and billed at the same time. Not ' +
      'monthly, and not two shorter fills billed as one. No mid-cycle visits for ' +
      'dose adjustments either - a change inside the 12 weeks is another visit ' +
      'and another charge, not a free follow-up.',
    offCadence: 'If the patient needs to be seen between 12-week supplies, that ' +
      'visit is charged at $79 (WMNHlthINS) like any other visit. Do not send a ' +
      'short supply and bill it against the next quarter - that is where charges ' +
      'get missed, and it is the commonest billing error on this programme.',
    /* Structured rather than one prose label each, so the document can lay them
       out in columns and the wording stays consistent with the tier table. */
    withLabs: [
      { hormones: 1, labs: 'Basic Hormones (saliva)', price: '$339', code: 'WMNHlth1Bsc' },
      { hormones: 1, labs: 'Complete Hormones (saliva and blood spot)', price: '$469', code: 'WMNHlth1Cmp' },
      { hormones: 2, labs: 'Basic Hormones (saliva)', price: '$369', code: 'WMNHlth2Bsc' },
      { hormones: 2, labs: 'Complete Hormones (saliva and blood spot)', price: '$499', code: 'WMNHlth2Cmp' },
      { hormones: 3, labs: 'Basic Hormones (saliva)', price: '$418', code: 'WMNHlth3Bsc' },
      { hormones: 3, labs: 'Complete Hormones (saliva and blood spot)', price: '$548', code: 'WMNHlth3Cmp' }
    ],
    labsAlone: [
      { label: 'Women Basic Hormones (saliva)', price: '$119', code: 'LABHlthBsc' },
      { label: 'Women Health Complete Hormones (saliva and blood spot)', price: '$249', code: 'LABHlthCmp' }
    ],
    /* PT-141 is NOT here. It was in this programme at launch, in the wrong
       place, and moved to sexual health - korb-addons-data.js carries it at the
       same $119 add-on / $149 standalone. Don, 2026-09-16. Recorded so nobody
       adds it back from the November document, which still lists it. */
    sexualHealthMovedTo: 'korb-addons-data.js. The peptide that used to be ' +
      'priced here is there now, at the same add-on and standalone prices.',
    /* A SIGNPOST, not a re-import. PT-141 launched inside this programme, in the
       wrong place, and moved to sexual health. Providers who used it will come
       looking here - Don named Kim Y. specifically - and finding nothing reads
       as "KORB dropped it". So the document says where it went. It carries no
       pricing and no Tebra entry; selfCheck still blocks those. */
    pt141Signpost: 'Looking for PT-141? It is still available. It moved out of ' +
      'Women\'s Health and into SEXUAL HEALTH, where it sits with the other ' +
      'sexual health products - see the Add-On Clinical Reference for pricing, ' +
      'charge codes and the Tebra entries. Belmar fills the nasal spray and ' +
      'Premier the injection.',
    cadence: 'One visit, one 12-week supply, every 12 weeks.'
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

  /* -- STAGES. Source: the November document, section 2. --------------------- */
  stages: 'Menopause happens in three stages. PERIMENOPAUSE - fluctuating ' +
    'hormones and irregular periods. MENOPAUSE - twelve months without a period, ' +
    'with significant hormone decline. POSTMENOPAUSE - ongoing low hormone levels ' +
    'and rising risk of osteoporosis and heart disease.',

  /* -- WHAT THE PANELS MEASURE, AND WHAT EACH RESULT MEANS --------------------
     Source: the November document, which carries an Ayumetrix explanation of
     every marker. Don asked on 2026-09-16 whether a section explaining the
     hormones was missing - it was, and this is it.

     PROGESTERONE IS NOT EXPLAINED IN THE SOURCE. It is on the Basic panel and
     on the Complete panel, and the explanation section covers estradiol,
     testosterone, DHEA, cortisol and the four thyroid markers and simply skips
     it. Recorded as a gap rather than filled in, because writing a clinical
     interpretation nobody approved and presenting it beside eight that were is
     exactly the wrong thing to do. See marker.missing below.

     This is also the seed of open item 12a, the cross-program lab reference and
     if-then chart. Whoever builds that should start here rather than from
     scratch. */
  panelMarkers: {
    basic: ['Estradiol (E2)', 'Testosterone (T)', 'Progesterone (Pg)', 'DHEA', 'Cortisol x 1'],
    complete: {
      saliva: ['Estradiol (E2)', 'Testosterone (T)', 'Progesterone (Pg)', 'DHEA', 'Cortisol x 4'],
      bloodSpot: ['TSH', 'Free T3', 'Free T4', 'Thyroid peroxidase (TPO) antibodies']
    }
  },

  markerMeaning: [
    { marker: 'Estradiol (E2)',
      text: 'Acts mainly as a growth hormone for the female reproductive structures, ' +
        'and works with progesterone through the cycle. Low estrogen can cause low ' +
        'libido; too much causes the symptoms of estrogen dominance. It also ' +
        'maintains bone growth, improves coronary blood flow and is neuroprotective. ' +
        'Estrogens contribute to breast cancer risk and to non-cancerous conditions ' +
        'such as endometriosis and uterine fibroids.' },
    { marker: 'Testosterone (T)',
      text: 'Maintains bone strength, muscle mass and energy, and in women drives ' +
        'libido. Menopause causes a significant decline. Low levels can produce hair ' +
        'loss, reduced muscle mass, hot flashes, depression and increased breast ' +
        'size. High levels are linked with aggression, acne, liver disease and heart ' +
        'muscle damage.' },
    { marker: 'Progesterone (Pg)',
      text: 'Produced mainly by the corpus luteum after ovulation, with a smaller ' +
        'adrenal contribution. It opposes estrogen at the endometrium, which is ' +
        'why it is what protects the uterine lining. Through its metabolite ' +
        'allopregnanolone it also has a calming effect and supports sleep, which ' +
        'is why it is dosed at night. Levels fall through perimenopause and are ' +
        'low after menopause. Low progesterone RELATIVE to estrogen gives the ' +
        'picture usually called estrogen dominance - heavy or irregular bleeding, ' +
        'breast tenderness, fluid retention, irritability and poor sleep. On ' +
        'saliva testing in a woman using a topical, remember the result reflects ' +
        'tissue delivery rather than a serum level.' },
    { marker: 'DHEA',
      text: 'Made by the adrenal glands and a precursor to both testosterone and the ' +
        'estrogens; also a neurohormone made in small amounts in the brain. Improves ' +
        'energy, mood, memory, libido and immune function. In women it helps balance ' +
        'the other hormones, and low levels can cause weight gain, depression, ' +
        'fatigue and low libido.' },
    { marker: 'Cortisol',
      text: 'The stress hormone, and also central to glucose metabolism. Imbalance ' +
        'produces irritability, fatigue, depression, foggy thinking, weight gain and ' +
        'bone loss. The Complete panel measures it four times across a day rather ' +
        'than once, because the shape of the curve is the finding.' },
    { marker: 'TSH',
      text: 'Elevated in primary hypothyroidism, low in primary hyperthyroidism. ' +
        'Distinguishes primary thyroid disease from secondary (pituitary) and ' +
        'tertiary (hypothalamic). An abnormal TSH with a normal free T4 is ' +
        'subclinical hypo- or hyperthyroidism.' },
    { marker: 'Free T3',
      text: 'Only about 0.3% of T3 is unbound, and the free fraction is the active ' +
        'one. Usually raised alongside T4 in hyperthyroidism; in a small subset - T3 ' +
        'toxicosis - only T3 is raised.' },
    { marker: 'Free T4',
      text: 'A small fraction of total thyroxine and the metabolically active part. ' +
        'Raised causes hyperthyroidism, low causes hypothyroidism.' },
    { marker: 'TPO antibodies',
      text: 'Thyroid disorders are often autoimmune. In subclinical hypothyroidism, ' +
        'TPO antibodies predict a higher rate of progression to overt disease - 4.3% ' +
        'per year against 2.1% without them - and flag risk of other autoimmune ' +
        'disease such as adrenal insufficiency and type 1 diabetes.' }
  ],

  /* The progesterone entry above was drafted on 2026-09-16 because the source
     document explains every panel marker except that one, and approved by Don
     the same day. The other eight are Ayumetrix wording; that one is not, and
     this note is why. */
  markerProvenance: 'Eight of the nine marker explanations are Ayumetrix wording ' +
    'carried from the programme document. PROGESTERONE is not: the source omits ' +
    'it, so it was drafted and approved by Don Stevenson on 2026-09-16.',

  labDisclaimer: 'Ayumetrix developed these tests and determined their performance ' +
    'characteristics. They have not been cleared or approved by the FDA. The lab is ' +
    'CLIA-regulated as qualified for high-complexity testing. Results are ' +
    'informational and do not themselves provide a diagnosis.',

  /* -- APPROVED 2026-09-16 --------------------------------------------------
     Three pieces of clinical writing were drafted on 2026-09-16 and held out of
     the document until Don read them. He approved all three the same day:

       progesterone-marker       -> markerMeaning, in panel order
       estrogen-vs-estradiol     -> estrogenNaming, its own section
       single-before-combination -> combinationRule, its own section

     The mechanism stays: pendingApproval is empty, not deleted, and selfCheck
     still fails if anything is added here and starts rendering before it is
     moved out. Content a provider reads is content the Director of Clinical
     Operations has signed. */
  pendingApproval: [],

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

  /* -- WHO IS A CANDIDATE -----------------------------------------------------
     Source: the November programme document. Clinical content rather than
     dosing, so Don's "everything else is out of date" does not reach it. */
  candidacy: {
    lead: 'Candidates typically have moderate to severe symptoms affecting quality ' +
          'of life.',
    symptoms: ['Hot flashes', 'Night sweats', 'Vaginal dryness or painful intercourse',
               'Mood disturbance', 'Sleep problems', 'Cognitive complaints - brain fog'],
    earlyMenopause: 'Women in early menopause are at higher risk of osteoporosis and ' +
      'heart disease, and usually BENEFIT from hormone therapy until at least the ' +
      'average age of natural menopause, around 51, unless contraindicated.',
    window: 'Best outcomes when therapy starts under age 60 AND within 10 years of ' +
      'the last menstrual period. Lower cardiovascular risk inside that window of ' +
      'opportunity, which is the single most useful thing to establish at the first ' +
      'visit.'
  },

  /* -- WHAT EACH HORMONE IS FOR -----------------------------------------------
     The part a provider needs before choosing, and the part the first cut of
     this document was missing entirely. */
  hormoneGuide: [
    {
      name: 'Estradiol - patch or cream',
      firstLine: 'FIRST-LINE for a patient WITHOUT a uterus, on its own.',
      does: 'Bioidentical estradiol through the skin for steady levels. Reduces hot ' +
            'flashes, night sweats and mood swings; supports vaginal health and sleep.',
      why: 'Transdermal carries a lower clot risk than oral estrogen.',
      caution: 'Unopposed estrogen in a patient WITH a uterus causes endometrial ' +
               'hyperplasia and can lead to cancer. Add progesterone.',
      route: 'Patch goes to Premier or the patient own pharmacy. Cream goes to a ' +
             'partner pharmacy only - never to a local pharmacy.'
    },
    {
      name: 'Progesterone - capsule',
      firstLine: 'REQUIRED alongside estrogen for any patient WITH a uterus.',
      does: 'Protects the endometrium. Also helps perimenopausal hot flashes, night ' +
            'sweats and mood, and taken at night it supports sleep.',
      why: 'It is the reason estrogen is safe to give a woman who still has a uterus. ' +
           'This is not optional and it is not a preference.',
      dosing: 'Start 200 mg nightly, increase to 300 mg if needed. Patients with ' +
              'regular cycles take it 21 days on and 7 days off - 63 capsules over ' +
              'the 12 weeks. Patients without regular cycles take it daily - 84 ' +
              'capsules.',
      caution: 'PEANUT ALLERGY - do NOT use a COMMERCIAL progesterone capsule, ' +
               'generic or brand: they are suspended in peanut oil. A COMPOUNDED ' +
               'capsule from Belmar or Premier is fine and is the answer here. ' +
               'The allergy rules out the product, not the hormone - which is the ' +
               'difference between referring her out and treating her.',
      route: 'COMMERCIAL or COMPOUNDED - the prescription must say which, and ' +
             'Premier can fill either. Commercial exists at 100 mg and 200 mg ' +
             'only; there is no commercial 300 mg, so a 300 mg dose is either a ' +
             'compounded capsule or one 200 mg plus one 100 mg. Belmar is ' +
             'compounded only. A commercial capsule can go to the patient own ' +
             'pharmacy; a compounded one cannot.'
    },
    {
      name: 'Testosterone - cream, compounded',
      firstLine: 'Texas and California only. See the testosterone restriction.',
      does: 'Supports libido, energy, mood, muscle strength and cognition.',
      dosing: 'Begin at one click daily of 2% cream - 5 mg per click - from a 30 mL ' +
              'dispenser, then adjust to response and side effects.',
      route: 'Partner pharmacy only. Never to a local pharmacy.'
    },
    {
      name: 'Testosterone + estradiol cream',
      does: 'Both hormones in one application. Menopausal symptom relief plus ' +
            'sexual wellness, energy, mood and muscle tone.',
      dosing: 'Testosterone 2% (1 click = 5 mg) with estradiol 0.4% (1 click = 1 mg). ' +
              'One click daily.',
      billing: 'Two hormones for pricing, in a single tube.'
    },
    {
      name: 'Progesterone / testosterone / estradiol',
      does: 'Comprehensive support - vasomotor symptoms, mood, libido and energy.',
      route: 'Testosterone and estradiol as cream, progesterone as capsules, from a ' +
             'partner pharmacy. Through a local pharmacy this becomes estradiol ' +
             'PATCH plus progesterone capsules only - no cream, no testosterone.',
      billing: 'Three hormones for pricing.'
    },
    {
      name: 'Four-hormone oral capsule',
      does: 'Progesterone, testosterone, estriol and estradiol in one daily capsule, ' +
            'for a patient who would rather not use a topical.',
      dosing: 'Progesterone 100 mg, testosterone 4 mg, estriol 0.45 mg, estradiol ' +
              '0.45 mg. One daily, 84 capsules for 12 weeks.',
      caution: 'ORAL combination MAY INCREASE THE RISK OF BLOOD CLOTS. Transdermal ' +
               'does not carry the same risk, so this is a real trade-off to discuss ' +
               'rather than a formality.',
      billing: 'Bills at the three-hormone tier - four hormones, no fourth tier.'
    }
  ],

  /* -- NAMING, AND WHY IT MATTERS ON A PRESCRIPTION --------------------------
     Drafted 2026-09-16 after Don asked what the difference is between estrogen
     and estradiol, and whether "Estriol/Estradiol" on the Belmar capsule was an
     error. Approved the same day. */
  estrogenNaming: {
    heading: 'Estrogen, estradiol, estriol - not the same word',
    body: [
      'ESTROGEN is the class. ESTRADIOL is one hormone in that class. The three ' +
        'human estrogens are estrone (E1), estradiol (E2) and estriol (E3).',
      'ESTRADIOL is the most potent and the dominant estrogen through the ' +
        'reproductive years. It is what estrogen therapy almost always means at ' +
        'KORB, and it is what the patches and the single-hormone creams contain.',
      'ESTRIOL is the weakest of the three, roughly a tenth as potent at the ' +
        'receptor, and predominates in pregnancy. It appears at KORB in exactly ' +
        'one place: the four-hormone capsule, at 0.45 mg alongside 0.45 mg of ' +
        'estradiol.',
      'So Estriol/Estradiol on the Belmar capsule is NOT a typo and not a ' +
        'duplicate. They are two different hormones and the capsule contains ' +
        'both. A combination of estriol and estradiol is sometimes called ' +
        'Bi-Est. The near-identical spelling is the only thing they share.'
    ],
    callout: 'On a prescription the two are not interchangeable words. Write the ' +
      'hormone, not the class.'
  },

  /* -- SINGLE BEFORE COMBINATION ---------------------------------------------
     Don's own clinical position, stated and approved 2026-09-16. */
  combinationRule: {
    heading: 'Start with single hormones, combine later',
    body: [
      'A combination product is one prescription, so every component moves ' +
        'together. If a patient on the four-hormone capsule needs more ' +
        'progesterone, there is no way to give her more progesterone - only more ' +
        'capsule, which also raises her testosterone, her estradiol and her estriol.',
      'So START on single-hormone products while dose-finding. Adjust one thing at ' +
        'a time, the same discipline as every other KORB programme, and let ' +
        'symptoms and labs settle.',
      'ONCE SHE IS STABLE, moving to a combination is reasonable and is often ' +
        'better for adherence - one cream or one capsule instead of three. The ' +
        'trade-off is that the next adjustment means unpicking it again.'
    ],
    callout: 'Convenience is the reason to combine, and it is a good reason - but ' +
      'only after the doses are settled. A combination started on day one is a ' +
      'plan that cannot be tuned.'
  },

  /* -- THE UTERUS DECISION ----------------------------------------------------
     Written as a decision rather than prose because it is the first question of
     the visit and it determines everything after it. */
  uterusRule: {
    question: 'Does the patient still have a uterus?',
    withUterus: 'YES - estrogen must ALWAYS be paired with progesterone. Unopposed ' +
      'estrogen causes endometrial hyperplasia and can lead to endometrial cancer. ' +
      'There is no dose of estrogen that is safe on its own here.',
    withoutUterus: 'NO - estradiol alone is first-line. Progesterone is not required, ' +
      'because there is no endometrium to protect. Adding it is not harmful but it is ' +
      'not indicated, and it moves the patient up a pricing tier for no benefit.',
    cycling: 'A patient with regular cycles takes progesterone 21 days on and 7 off, ' +
      'which is 63 capsules over the 12 weeks. A post-menopausal patient takes it ' +
      'daily, which is 84. Getting this wrong means the quantity on the ' +
      'prescription does not match the regimen.'
  },

  /* -- SIDE EFFECTS. Source: the November document, section 8. ---------------- */
  sideEffects: [
    { hormone: 'Estrogens - estradiol and estriol',
      effects: 'Headache, nausea, bloating, mood swings, breast swelling and ' +
        'tenderness, change in vaginal bleeding. Increased risk of blood clots, ' +
        'breast cancer, and endometrial cancer - the last of which is reduced by ' +
        'adding progesterone.' },
    { hormone: 'Progesterone',
      effects: 'Headache, mood swings, breast tenderness, change in vaginal bleeding.' },
    { hormone: 'Testosterone',
      effects: 'Acne, facial and body hair growth, voice deepening, weight gain. ' +
        'Voice deepening does not reverse - counsel before starting, not after.' }
  ],

  /* -- TEBRA ENTRIES ----------------------------------------------------------
     Twenty-eight entries, parsed out of the November programme document rather
     than retyped: 28 blocks of eight fields is 224 chances to mistype, and a
     wrong quantity or days supply is a wrong prescription. PT-141 was in that
     list and is NOT here - it moved to sexual health and lives in
     korb-addons-data.js, which already carries it at the same $119 add-on /
     $149 standalone pricing.

     THE DRUG FIELD IS A PLACEHOLDER ON EVERY COMPOUNDED CREAM, and a provider
     needs to know that before reading one. Tebra has no listing for a 0.2% or
     0.6% topical estradiol cream, so the entry selects the nearest thing in the
     drop-down - "estradiol 0.01% (0.1 mg/gram) vaginal cream" - and the REAL
     compound is specified in the pharmacy note. So the Drug line says 0.01% and
     vaginal while the patient receives 0.2% to 0.8% applied to the inner thigh
     or arm. The pharmacy note governs. Read alone, that Drug line is wrong by a
     factor of twenty to eighty and wrong about the route.

     Every entry selects its drug from the drop-down; none is typed. The
     compounded ones simply carry their real formulation in the note beneath.

     The strengths agree with pharmacyOffers, which came from the live tool:
     Belmar 0.2 / 0.4 / 0.8, Premier 0.2 / 0.6. selfCheck asserts that rather
     than leaving it to the reader. */
  tebra: {
    caps: { ptInstructions: 140, pharmacyNotes: 170 },
    selectOnlyNote: 'Select this from the Tebra drop-down. Do not copy and paste.',
    /* WHICH ENTRIES ARE COMPOUNDED. Five are commercial - the estradiol
       patches - and those are SELECTED from the Tebra drop-down. The other
       twenty-three are custom compounds and the drug is TYPED, exactly like the
       GLP-1 and Functional Health products.

       Until 2026-09-16 all twenty-eight carried a drop-down placeholder, with
       the real compound only in the pharmacy note, because Tebra had no way to
       send a custom compound through SureScripts - so a provider picked the
       nearest listed item and the note carried the truth. The placeholders were
       badly wrong on their face: a 0.2% to 0.8% topical cream entered as
       "estradiol 0.01% VAGINAL cream", a 2% testosterone cream as a "1%
       transdermal gel", and the four-hormone CAPSULE as a "testosterone 100 mg
       implant PELLET". Both 300 mg progesterone entries pointed at a 200 mg
       listing.

       Tebra takes custom compounds now, so the workaround is retired and every
       compounded entry names what it actually is, derived from the compound
       already written in its own pharmacy note. Don, 2026-09-16. */
    entries: [
    /* ===== LOCAL pharmacy - patient collects and pays - 9 entries ===== */
    /* Estradiol patch - TWO presentations at every strength.
       The local commercial route carries BOTH at all five strengths and the
       provider picks whichever the patient's pharmacy can actually get.

       TWO SEPARATE FACTS. Corrected 2026-09-17 after an earlier version of
       this block ran them together and got the reason backwards.

       1. The ONCE-weekly patch is in SHORT SUPPLY generally. A market
          shortage, nothing to do with Premier.
       2. The TWICE-weekly patch is a COST decision. Don asked Premier on
          2026-09-16 whether they could be a source for it. They CAN get it.
          It is not cost-effective for KORB against the pricing structure with
          the compounded partner pharmacies, and raising the price was
          considered and rejected.

         ONCE weekly   1 patch/week  x 12 weeks = 12 patches  = 3 boxes of 4
         TWICE weekly  2 patches/wk  x 12 weeks = 24 patches  = 3 boxes of 8

       Both land on quantity 3 BX and 84 days, which is a coincidence of the box
       sizes and not a copy-paste: 3x4=12 at one a week and 3x8=24 at two a week
       are both exactly twelve weeks. The pharmacy note spells the arithmetic out
       so a pharmacy with a different pack size tells us.

       SO: the TWICE-weekly presentation is LOCAL ONLY, on cost. Premier's
       five ONCE-weekly entries STAND - Don, 2026-09-17 - because a shortage is
       not a delisting and the control is a provider confirming with Premier
       before sending. Belmar carries no patch at all. */
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.025 mg Patch, ONCE WEEKLY)',
      drug: 'estradiol 0.025 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.025 mg Patch - once weekly (4/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.025 mg Patch, TWICE WEEKLY)',
      drug: 'estradiol 0.025 mg/24 hr semiweekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.025 mg Patch - twice weekly (8/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks twice weekly, on the same 2 days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 8 patches = 24 patches, two a week for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.0375 mg Patch, ONCE WEEKLY)',
      drug: 'estradiol 0.0375 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.0375 mg Patch - once weekly (4/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.0375 mg Patch, TWICE WEEKLY)',
      drug: 'estradiol 0.0375 mg/24 hr semiweekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.0375 mg Patch - twice weekly (8/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks twice weekly, on the same 2 days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 8 patches = 24 patches, two a week for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.05 mg Patch, ONCE WEEKLY)',
      drug: 'estradiol 0.05 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.05 mg Patch - once weekly (4/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.05 mg Patch, TWICE WEEKLY)',
      drug: 'estradiol 0.05 mg/24 hr semiweekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.05 mg Patch - twice weekly (8/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks twice weekly, on the same 2 days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 8 patches = 24 patches, two a week for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.075 mg Patch, ONCE WEEKLY)',
      drug: 'estradiol 0.075 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.075 mg Patch - once weekly (4/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.075 mg Patch, TWICE WEEKLY)',
      drug: 'estradiol 0.075 mg/24 hr semiweekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.075 mg Patch - twice weekly (8/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks twice weekly, on the same 2 days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 8 patches = 24 patches, two a week for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.1 mg Patch, ONCE WEEKLY)',
      drug: 'estradiol 0.1 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.1 mg Patch - once weekly (4/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks.' },
    { destination: 'local', family: 'estradiol-patch', pharmacy: 'local', heading: 'Estrogen (0.1 mg Patch, TWICE WEEKLY)',
      drug: 'estradiol 0.1 mg/24 hr semiweekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.1 mg Patch - twice weekly (8/box)',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks twice weekly, on the same 2 days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 8 patches = 24 patches, two a week for 12 weeks.' },
    /* Progesterone capsule */
    { destination: 'local', family: 'progesterone', pharmacy: 'local', heading: 'Progesterone (100 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 100 mg capsule',
      compounded: false,
      label: 'Progesterone COMMERCIAL 100 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'Dispense as written.' },
    { destination: 'local', family: 'progesterone', pharmacy: 'local', heading: 'Progesterone (200 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 200 mg capsule',
      compounded: false,
      label: 'Progesterone COMMERCIAL 200 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'Dispense as written.' },
    { destination: 'local', family: 'progesterone', pharmacy: 'local', heading: 'Progesterone (100 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 100 mg capsule',
      compounded: false,
      label: 'Progesterone COMMERCIAL 100 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'Dispense as written.' },
    { destination: 'local', family: 'progesterone', pharmacy: 'local', heading: 'Progesterone (200 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 200 mg capsule',
      compounded: false,
      label: 'Progesterone COMMERCIAL 200 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'Dispense as written.' },

    /* ===== PREMIER pharmacy - 20 entries ===== */
    /* Estradiol patch */
    { destination: 'premier', family: 'estradiol-patch', pharmacy: 'premier', heading: 'Estrogen (0.025 mg Patch)',
      drug: 'estradiol 0.025 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.025 mg Patch',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks. Bill to office/ship to patient' },
    { destination: 'premier', family: 'estradiol-patch', pharmacy: 'premier', heading: 'Estrogen (0.0375 mg Patch)',
      drug: 'estradiol 0.0375 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.0375 mg Patch',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks. Bill to office/ship to patient' },
    { destination: 'premier', family: 'estradiol-patch', pharmacy: 'premier', heading: 'Estrogen (0.05 mg Patch)',
      drug: 'estradiol 0.05 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.05 mg Patch',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks. Bill to office/ship to patient' },
    { destination: 'premier', family: 'estradiol-patch', pharmacy: 'premier', heading: 'Estrogen (0.075 mg Patch)',
      drug: 'estradiol 0.075 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.075 mg Patch',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks. Bill to office/ship to patient' },
    { destination: 'premier', family: 'estradiol-patch', pharmacy: 'premier', heading: 'Estrogen (0.1 mg Patch)',
      drug: 'estradiol 0.1 mg/24 hr weekly transdermal patch',
      compounded: false,
      label: 'Estrogen 0.1 mg Patch',
      ptInstructions: 'Apply 1 patch to the lower abdomen or buttocks weekly. Replace the same days each week. Avoid breasts/irritated skin. Rotate sites.',
      quantity: '3', unit: 'BX', refill: '0', days: '84',
      pharmacyNotes: '3 boxes of 4 patches = 12 patches, one weekly for 12 weeks. Bill to office/ship to patient' },
    /* Estradiol cream */
    { destination: 'premier', family: 'estradiol-cream', pharmacy: 'premier', heading: 'Estrogen (0.2% Cream)',
      drug: 'Estradiol 0.2%, 2 mg/ml cream',
      compounded: true,
      label: 'Estradiol Cream 0.2%',
      ptInstructions: 'Apply (1 click/0.25ml/0.5 mg) daily to hairless skin. Let dry. Avoid contact. Wash hands after.',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'QTY 30 ml, Bill office/ship to patient' },
    { destination: 'premier', family: 'estradiol-cream', pharmacy: 'premier', heading: 'Estrogen (0.6% Cream)',
      drug: 'Estradiol 0.6%, 6 mg/ml cream',
      compounded: true,
      label: 'Estradiol Cream 0.6%',
      ptInstructions: 'Apply (1 click/0.25 ml/1.5 mg) daily to hairless skin. Let dry. Avoid contact. Wash hands after.',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'QTY 30 ml, Bill office/ship to patient' },
    /* Progesterone capsule */
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (100 mg Capsule)',
      drug: 'Progesterone SR 100 mg capsule',
      compounded: true,
      label: 'Premier Progesterone COMPOUNDED SR 100 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (200 mg Capsule)',
      drug: 'Progesterone SR 200 mg capsule',
      compounded: true,
      label: 'Premier Progesterone COMPOUNDED SR 200 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (300 mg Capsule)',
      drug: 'Progesterone SR 300 mg capsule',
      compounded: true,
      label: 'Premier Progesterone COMPOUNDED SR 300 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'COMPOUNDED. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (100 mg Capsule)',
      drug: 'Progesterone SR 100 mg capsule',
      compounded: true,
      label: 'Premier Progesterone COMPOUNDED SR 100 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (200 mg Capsule)',
      drug: 'Progesterone SR 200 mg capsule',
      compounded: true,
      label: 'Premier Progesterone COMPOUNDED SR 200 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (300 mg Capsule)',
      drug: 'Progesterone SR 300 mg capsule',
      compounded: true,
      label: 'Premier Progesterone COMPOUNDED SR 300 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'COMPOUNDED. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (100 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 100 mg capsule',
      compounded: false,
      label: 'Premier Progesterone COMMERCIAL 100 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'COMMERCIAL product, NOT compounded. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (200 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 200 mg capsule',
      compounded: false,
      label: 'Premier Progesterone COMMERCIAL 200 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'COMMERCIAL product, NOT compounded. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (100 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 100 mg capsule',
      compounded: false,
      label: 'Premier Progesterone COMMERCIAL 100 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'COMMERCIAL product, NOT compounded. Bill to office/ship to patient' },
    { destination: 'premier', family: 'progesterone', pharmacy: 'premier', heading: 'Progesterone (200 mg Capsule, COMMERCIAL)',
      drug: 'progesterone micronized 200 mg capsule',
      compounded: false,
      label: 'Premier Progesterone COMMERCIAL 200 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      pharmacyNotes: 'COMMERCIAL product, NOT compounded. Bill to office/ship to patient' },
    /* Testosterone cream */
    { destination: 'premier', family: 'testosterone-cream', pharmacy: 'premier', heading: 'Testosterone (2% Cream)',
      drug: 'Testosterone 2%, 20 mg/ml cream',
      compounded: true,
      label: 'Testosterone Cream Premier Pharmacy',
      ptInstructions: 'Apply (1 click/0.25 ml/5 mg) daily to hairless skin. Let dry. Avoid contact. Wash hands after',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'No female-dose product',
      pharmacyNotes: 'QTY 23 ml, Bill to office/ship to patient' },
    /* Testosterone + estradiol cream */
    { destination: 'premier', family: 'test-estradiol-cream', pharmacy: 'premier', heading: 'Testosterone + Estradiol (Cream)',
      drug: 'Testosterone 2% & Estradiol 0.4%, (20 mg/4 mg)/ml cream',
      compounded: true,
      label: 'Testosterone + Estradiol (Cream) Premier Pharmacy',
      ptInstructions: 'Apply (1 click/0.25 ml/5 mg/0.1 mg) daily to hairless skin. Let dry. Avoid contact. Wash hands after',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'Multi-active combination',
      pharmacyNotes: 'QTY 23 ml, Bill to office/ship to patient' },
    /* Four-hormone oral capsule */
    { destination: 'premier', family: 'four-hormone-capsule', pharmacy: 'premier', heading: 'Progesterone / Testosterone / Estriol/ Estradiol (Tablet)',
      drug: 'Progesterone 100 mg/Testosterone 4 mg/ Estriol 0.45 mg/Estradiol 0.45 mg ODT tablet',
      compounded: true,
      label: 'Progesterone / Testosterone / Estriol / Estradiol (SL ODT Tab)',
      ptInstructions: 'Dissolve 1 tablet under the tongue daily',
      quantity: '84', unit: 'tablet', refill: '0', days: '84',
      reasonForCompounding: 'Multi-active combination',
      pharmacyNotes: 'Bill office/ship patient' },

    /* ===== BELMAR pharmacy - 12 entries ===== */
    /* Estradiol cream */
    { destination: 'belmar', family: 'estradiol-cream', pharmacy: 'belmar', heading: 'Estrogen (0.2% Cream)',
      drug: 'Estradiol 0.2%, 2 mg/ml cream',
      compounded: true,
      label: 'Belmar Estradiol Cream 0.2%',
      ptInstructions: 'Apply 1 click/0.25ml daily to hairless skin. Let dry. Avoid contact. Wash hands after.',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'Medical Necessity Required, QTY 30 ml, Bill to office/ship to patient, Allergies:' },
    { destination: 'belmar', family: 'estradiol-cream', pharmacy: 'belmar', heading: 'Estrogen (0.4% Cream)',
      drug: 'Estradiol 0.4%, 4 mg/ml cream',
      compounded: true,
      label: 'Belmar Estradiol Cream 0.4%',
      ptInstructions: 'Apply 1 click/0.25ml daily to hairless skin. Let dry. Avoid contact. Wash hands after.',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'QTY 30 ml, Bill office/ship patient Allergies:' },
    { destination: 'belmar', family: 'estradiol-cream', pharmacy: 'belmar', heading: 'Estrogen (0.8% Cream)',
      drug: 'Estradiol 0.8%, 8 mg/ml cream',
      compounded: true,
      label: 'Belmar Estradiol Cream 0.8%',
      ptInstructions: 'Apply 1 click/0.25ml daily to hairless skin. Let dry. Avoid contact. Wash hands after.',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'Medical Necessity Required, QTY 30 ml, Bill office/ship to patient, Allergies:' },
    /* Progesterone capsule */
    { destination: 'belmar', family: 'progesterone', pharmacy: 'belmar', heading: 'Progesterone (100 mg Capsule)',
      drug: 'Progesterone (clear) MCC 100 mg capsule',
      compounded: true,
      label: 'Belmar Progesterone COMPOUNDED MCC 100 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill office/ship to patient Allergies:' },
    { destination: 'belmar', family: 'progesterone', pharmacy: 'belmar', heading: 'Progesterone (200 mg Capsule)',
      drug: 'Progesterone (clear) MCC 200 mg capsule',
      compounded: true,
      label: 'Belmar Progesterone COMPOUNDED MCC 200 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill office/ship to patient Allergies:' },
    { destination: 'belmar', family: 'progesterone', pharmacy: 'belmar', heading: 'Progesterone (300 mg Capsule)',
      drug: 'Progesterone (clear) MCC 300 mg capsule',
      compounded: true,
      label: 'Belmar Progesterone COMPOUNDED MCC 300 mg NO cycles',
      ptInstructions: 'Take 1 cap PO QHS',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'COMPOUNDED. Bill office/ship to patient Allergies:' },
    { destination: 'belmar', family: 'progesterone', pharmacy: 'belmar', heading: 'Progesterone (100 mg Capsule)',
      drug: 'Progesterone (clear) MCC 100 mg capsule',
      compounded: true,
      label: 'Belmar Progesterone COMPOUNDED MCC 100 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill office/ship to patient Allergies:' },
    { destination: 'belmar', family: 'progesterone', pharmacy: 'belmar', heading: 'Progesterone (200 mg Capsule)',
      drug: 'Progesterone (clear) MCC 200 mg capsule',
      compounded: true,
      label: 'Belmar Progesterone COMPOUNDED MCC 200 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Peanut-free base',
      pharmacyNotes: 'COMPOUNDED. Bill office/ship to patient Allergies:' },
    { destination: 'belmar', family: 'progesterone', pharmacy: 'belmar', heading: 'Progesterone (300 mg Capsule)',
      drug: 'Progesterone (clear) MCC 300 mg capsule',
      compounded: true,
      label: 'Belmar Progesterone COMPOUNDED MCC 300 mg with cycles',
      ptInstructions: 'Take 1 cap PO QHS, cycle 21 days on / 7 days off',
      quantity: '63', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Strength not commercial',
      pharmacyNotes: 'COMPOUNDED. Bill office/ship to patient Allergies:' },
    /* Testosterone cream */
    { destination: 'belmar', family: 'testosterone-cream', pharmacy: 'belmar', heading: 'Testosterone (2% Cream)',
      drug: 'Testosterone 2%, 20 mg/ml cream',
      compounded: true,
      label: 'Belmar Testosterone 2% Cream',
      ptInstructions: 'Apply 1 click 0.25 ml daily to hairless skin. Let dry. Avoid contact. Wash hands after.',
      quantity: '1', unit: 'bottle', refill: '0', days: '84',
      reasonForCompounding: 'No female-dose product',
      pharmacyNotes: 'QTY 30 ml, Bill office/ship patient Allergies:' },
    /* Testosterone + estradiol cream */
    { destination: 'belmar', family: 'test-estradiol-cream', pharmacy: 'belmar', heading: 'Estradiol/Testosterone (Cream)',
      drug: 'Estradiol/Testosterone 4/20 mg/ml cream',
      compounded: true,
      label: 'Belmar Estradiol/Testosterone (Topical Cream)',
      ptInstructions: 'Apply one click/0.25 ml daily to hairless skin. Let dry. Avoid contact. Wash hands after.',
      quantity: '1', unit: 'bottle', refill: '2', days: '28',
      reasonForCompounding: 'Multi-active combination',
      pharmacyNotes: 'QTY 30 ml, Bill office/ship patient Allergies:' },
    /* Four-hormone oral capsule */
    { destination: 'belmar', family: 'four-hormone-capsule', pharmacy: 'belmar', heading: 'Estriol/ Estradiol / Progesterone / Testosterone (Capsule)',
      drug: 'Estriol/Estradiol/Progesterone/Testosterone 0.45/0.45/100/4 mg cap',
      compounded: true,
      label: 'Belmar Estriol/Estradiol/Progesterone/Testosterone (capsule)',
      ptInstructions: 'Take 1 capsule PO daily.',
      quantity: '84', unit: 'capsule', refill: '0', days: '84',
      reasonForCompounding: 'Multi-active combination',
      pharmacyNotes: 'Bill office/ship patient Allergies:' },
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
      'estriol. Pricing is tiered by how many hormones a plan ' +
      'contains, not by how many prescriptions are written, and the available ' +
      'strengths differ between the two partner pharmacies. Both of those are ' +
      'easy to get wrong and both are set out below.',
    pharmacyOrder: ['premier', 'belmar'],
    sections: []
  },

  documentBuild: function () {
    var W = this, d = this.document;
    var PH = (typeof KORB_PHARMACIES !== 'undefined') ? KORB_PHARMACIES : null;
    var stName = function (st) { return PH ? PH.stateName(st) + ' (' + st + ')' : st; };
    /* Spelled out, no abbreviation. The grouped lists are read, not looked up. */
    var nameOf = function (st) { return PH ? PH.stateName(st) : st; };

    d.sections = [
      {
        id: 'how', heading: 'How the programme works',
        body: [
          'Four hormones can appear in a plan: estradiol, progesterone, testosterone ' +
            'and estriol. Each counts as ONE hormone toward the price, and one ' +
            'product can carry two - a progesterone and estradiol cream is a ' +
            'two-hormone plan in a single tube.',
          W.pricing.cadence,
          'Creams go to a partner pharmacy. ' + W.gates.localPharmacy.text
        ]
      },
      {
        id: 'stages', heading: 'The three stages',
        body: [W.stages]
      },
      {
        id: 'candidacy', heading: 'Who is a candidate',
        render: 'bullets',
        body: [W.candidacy.lead],
        bullets: W.candidacy.symptoms,
        callouts: [W.candidacy.window, W.candidacy.earlyMenopause]
      },
      {
        id: 'uterus', heading: 'First question: does she still have a uterus?',
        render: 'bullets',
        warn: true,
        body: ['This determines the whole plan, so establish it before anything else.'],
        bullets: [W.uterusRule.withUterus, W.uterusRule.withoutUterus],
        callouts: [W.uterusRule.cycling]
      },
      {
        id: 'hormones', heading: 'What each hormone is for, and when to use it',
        render: 'hormoneGuide',
        body: ['The clinical reason to choose each one, and what it changes about ' +
               'pharmacy and pricing.']
      },
      {
        id: 'supply', heading: 'Supply length and when to see her back',
        render: 'table',
        columns: ['Product', 'Supply', 'Why'],
        rows: W.supply.byProduct.map(function (r) { return [r.product, r.supply, r.why]; }),
        body: [W.supply.visitRule],
        callouts: [W.supply.billingNote]
      },
      {
        id: 'dispensing', heading: 'Who pays the pharmacy',
        render: 'bullets',
        body: [W.dispensing.rule],
        bullets: [W.dispensing.partner, W.dispensing.local, W.dispensing.whatCanGoLocal]
      },
      {
        id: 'naming', heading: W.estrogenNaming.heading,
        render: 'bullets',
        /* A lead line, then the three that are being told apart. Rendered as
           paragraphs when the draft was promoted, which ran them together and
           lost the parallel structure that is the whole point of the section. */
        body: [W.estrogenNaming.body[0]],
        bullets: W.estrogenNaming.body.slice(1),
        callouts: [W.estrogenNaming.callout]
      },
      {
        id: 'combination', heading: W.combinationRule.heading,
        render: 'bullets',
        body: [W.combinationRule.body[0]],
        bullets: W.combinationRule.body.slice(1),
        callouts: [W.combinationRule.callout]
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
        render: 'stateGroups',
        /* GROUPED BY PHARMACY, not sorted by abbreviation. The first attempt was
           51 rows of two-letter codes interleaved three pairs to a row, and Don
           read it as "everything looks like Premier" - which it nearly is, 38 of
           51, so an alphabetical mix hides the 13 that matter. Grouping puts the
           short list where it can be seen, and the names are spelled out because
           nobody carries all 51 abbreviations in their head. */
        body: ['Premier is the default wherever Premier is licensed. Belmar covers ' +
               'every remaining state. Both lists are computed from the shared ' +
               'pharmacy layer, not maintained here.'],
        groups: [
          { pharmacy: 'Premier Pharmacy', count: W.states.premierStates.length,
            states: W.states.premierStates.map(nameOf) },
          { pharmacy: 'Belmar Pharmacy', count: W.states.belmarStates.length,
            states: W.states.belmarStates.map(nameOf) }
        ],
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
        callouts: [W.patchGuidance.weekly, W.patchGuidance.sourcing,
                   W.patchGuidance.boxRule,
                   'Only ' + W.sharedStrength + ' exists at both. Every other estradiol ' +
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
        /* ONE WORDING THROUGHOUT. The first version said "1 hormone" at the top
           and "One medication" lower down for the same thing, spelled the number
           both ways, and repeated "Visit, 90-day supply and shipping" on every
           row until the column was unreadable. The shared terms are stated once
           in the body and the rows just say what differs. Insurance goes first
           because it is the cheapest and the one most providers use. Don,
           2026-09-16. */
        columns: ['Plan', 'Price', 'Charge code'],
        rows: [[W.pricing.insurance.label, W.pricing.insurance.price, W.pricing.insurance.code]]
          .concat(W.pricing.tiers.map(function (t) {
            return [t.ingredients + (t.ingredients > 1 ? ' hormones' : ' hormone') +
                    ' from a partner pharmacy', t.price, t.code];
          })),
        copyColumn: 2,
        body: [
          'Every plan below is a VISIT plus a 12-WEEK SUPPLY plus SHIPPING. Only ' +
            'what differs is in the table.',
          'Tiered by how many HORMONES the plan contains, not how many ' +
            'prescriptions are written. One product can carry more than one: a ' +
            'progesterone and estradiol cream is two hormones in a single tube, and ' +
            'bills as two.'
        ],
        callouts: [W.pricing.pt141Signpost, W.pricing.localPharmacyRule,
                   W.pricing.localPharmacyDisclaimer,
                   W.pricing.insuranceIntent, W.pricing.offCadence, W.pricing.fourRule]
      },
      {
        id: 'pricing-labs', heading: 'Pricing with labs included',
        render: 'table',
        /* A separate table. Bundling these into the one above put six long
           sentences in a column already carrying three, and the two are read at
           different moments - one when planning the prescription, one when the
           patient wants labs. */
        columns: ['Hormones', 'Labs included', 'Price', 'Charge code'],
        rows: W.pricing.withLabs.map(function (r) {
          return [r.hormones + (r.hormones > 1 ? ' hormones' : ' hormone'), r.labs, r.price, r.code];
        }),
        copyColumn: 3,
        body: ['Same visit and 12-week supply as above, with a lab panel added. ' +
               'Labs on their own, without a prescription, are in the Labs section.'],
        callouts: [W.pricing.cadence]
      },
      {
        id: 'labs-alone', heading: 'Labs on their own',
        render: 'table',
        /* Kept with the other pricing rather than eleven sections away. Don,
           2026-09-16: all the pricing and billing codes belong together. */
        columns: ['Panel', 'Collection', 'Price', 'Charge code'],
        rows: W.labs.panels.map(function (l) { return [l.name, l.type, l.price, l.code]; }),
        copyColumn: 3,
        body: ['Without a prescription. Collected at home through ' + W.labs.vendor +
               '. ' + W.labs.vendorNote],
        callouts: [W.labs.salivaRationale]
      },
      {
        id: 'rx', heading: 'Tebra entries',
        render: 'womensTebra',
        /* No count in the prose. It has been 28, then 32, then 41 in a single
           day, and a number written beside a list goes stale the moment the list
           moves - the same reason the GLP-1 builder stopped saying "eleven
           documents". The jump links carry live counts instead. */
        body: ['Grouped by WHERE the prescription goes, because that is the first ' +
               'decision and it determines the pharmacy note. Commercial products ' +
               'select their drug from the Tebra drop-down; compounded products are ' +
               'typed, and their formulation is the drug line.']
      },
      {
        id: 'markers', heading: 'What the panels measure, and what each result means',
        render: 'table',
        columns: ['Marker', 'What it means'],
        rows: W.markerMeaning.map(function (m) { return [m.marker, m.text]; }),
        body: ['Basic panel (saliva): ' + W.panelMarkers.basic.join(', ') + '.',
               'Complete panel adds a four-point cortisol and a blood spot for ' +
                 W.panelMarkers.complete.bloodSpot.join(', ') + '.'],
        callouts: [W.labDisclaimer]
      },
      {
        id: 'side-effects', heading: 'Side effects to counsel on',
        render: 'table',
        columns: ['Hormone', 'What to tell her'],
        rows: W.sideEffects.map(function (r) { return [r.hormone, r.effects]; })
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
    this.pricing.withLabs.concat(this.pricing.labsAlone)
      .forEach(function (r) { codes.push(r.code); });
    codes.push(this.pricing.insurance.code);
    codes.forEach(function (c, i) {
      if (codes.indexOf(c) !== i) problems.push('duplicate charge code: ' + c);
    });
    /* PT-141 belongs to sexual health. It was in this programme at launch, in
       the wrong place, and the November document still lists it - so the risk is
       somebody adding it back from there. Assert it stays out. */
    /* Nothing provider-facing may mention PT-141: it moved to sexual health and
       the November document still lists it here, so the risk is a re-import.
       Checked across the whole document, not just the charge codes - the first
       version checked codes alone and three prose mentions sailed through. */
    /* PT-141 may be SIGNPOSTED but not SOLD here. A pointer telling a provider
       where it went is the opposite of the problem; a price or a Tebra entry is
       the problem. So the check looks at the entries and the codes, not at every
       mention - the first version banned the word outright and would now flag
       the signpost Don asked for. */
    if ((this.tebra.entries || []).some(function (e) { return /141/.test(JSON.stringify(e)); })) {
      problems.push('a PT-141 Tebra entry is in the women\'s health programme. ' +
        'It belongs to sexual health, in korb-addons-data.js.');
    }
    if (codes.some(function (c) { return /141/.test(c); })) {
      problems.push('PT-141 pricing is back in the women\'s health programme. It ' +
        'lives in korb-addons-data.js under sexual health.');
    }
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

    /* Drafted content must not reach a provider before Don has approved it.
       The report says how many are waiting rather than letting them sit silent. */
    var rendered = JSON.stringify(this.document.sections || []);
    (this.pendingApproval || []).forEach(function (d) {
      var probe = (d.draft && (d.draft.text || (d.draft.body || [])[0])) || '';
      if (probe && rendered.indexOf(probe.slice(0, 40)) !== -1) {
        problems.push('pendingApproval draft "' + d.id + '" is rendering into the ' +
          'document but has not been approved. Either approve it and move it out ' +
          'of pendingApproval, or take it off the page.');
      }
    });

    if (typeof console !== 'undefined' && console.log) {
      if ((this.pendingApproval || []).length) {
        console.log('KORB_WOMENS: ' + this.pendingApproval.length +
          ' draft(s) awaiting Don - ' +
          this.pendingApproval.map(function (d) { return d.id; }).join(', '));
      }
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
