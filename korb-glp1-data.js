/* ============================================================================
   KORB HEALTH — SHARED GLP-1 DOSING, PHARMACY & PRESCRIBING DATA
   Single source of truth for GLP-1 (semaglutide / tirzepatide) dosing,
   pharmacy routing, state coverage, Tebra prescribing fields, and charge
   codes across KORB tools and documents.

   VERSION: 1.0   CREATED: 2026-08-06

   WHY THIS FILE EXISTS
     The same facts — Premier's ship-to state list, dose ladders, Tebra
     Compounded Drug Favorite fields, charge codes — were duplicated across
     eight pharmacy documents plus the provider and patient tools. A single
     typo in one copy (UT rendered as UV in a Premier state list) survived
     because there was no canonical copy to check against. Every downstream
     document and tool should now derive from this file.

   HOW TO USE
     <script src="korb-glp1-data.js"></script>
   Then reference KORB_GLP1 instead of any local copy.

   VISIBILITY MODEL — READ THIS BEFORE BUILDING ANY TOOL
     Every product carries a `visibility` value. The data lives here in full;
     what surfaces is a rendering decision, not a data decision.
       'patient'   safe to render in patient-facing tools and documents
       'provider'  provider tools only — never render patient-side

     CONFIRMED POLICY (2026-08-06): patients never see dose ladders, mg values,
     unit counts, pharmacy names or pricing. Every product in this file is
     therefore 'provider'. `patientSafeProducts()` returning an empty array is
     correct behaviour, not a bug — do not "fix" it by relabelling products.

     Patient-facing tools render from `patientView()`, which strips the ladder
     and returns only route, frequency, and the counseling and safety language.
     Brand-name products (Zepbound, Oral Wegovy) are additionally never named
     patient-side: KORB prescribes them for existing patients but does not
     advertise them.

   CONVENTIONS
     - `supply4` / `supply8` = 4-week and 8-week program variants.
     - `rx` blocks are the exact Tebra Compounded Drug Favorite field values.
       Copy them literally. Do not paraphrase into a prescription.
     - `derived: true` marks a value this file computed rather than copied
       from a source document. Verify before it reaches a patient.
     - Anything in KORB_GLP1.needsConfirmation is NOT cleared for use.
   ============================================================================ */

var KORB_GLP1 = {

  meta: {
    version: '1.2',
    created: '2026-08-06',
    lastUpdated: '2026-08-09',
    owner: 'Director of Clinical Operations',
    signoff: {
      clinical: 'Clinical Director — dosing, titration, contraindications',
      compliance: 'VP Finance/Compliance — pricing, charge codes, program structure'
    },
    derivedFrom: [
      'Premier_Pharmacy_-_Semaglutide_11-26-2025',
      'Glycine_Premier_Pharmacy_-_Semaglutide_11-26-2025',
      'Premier_Pharmacy_-_Tirzepatide_11-26-2025',
      'Belmar_Pharmacy_-_Semaglutide_11-26-2025',
      'Belmar_Pharmacy_-_Tirzepatide_06-01-2026',
      'Farmakeio_Pharmacy_-_Semaglutide_11-26-2025',
      'Farmakeio_Pharmacy_-_Tirzepatide_11-26-2025',
      'Greenwich_Pharmacy_-_Tirzepatide_11-26-2025',
      'Zepbound_and_Oral_Wegovy'
    ],
    changelog: [
      '2026-08-06 (v1.0): Initial consolidation. Eight pharmacy documents plus ' +
      'the brand-name document merged into one structure. Boilerplate that was ' +
      'identical across all eight (indications, candidate criteria, ' +
      'contraindications, side effects) collapsed into KORB_GLP1.clinical and ' +
      'is now stated once.',

      '2026-08-06: Premier glycine semaglutide BUD extended to 90 days. The ' +
      '8-week program moves from a 1-month supply with 1 refill to the full ' +
      '8-week supply shipped in a single fill. Rx records updated: Refill 0, ' +
      'Days 56, two vials per fill. Vial quantities are derived (2x the 4-week ' +
      'quantity) and need pharmacy confirmation — see needsConfirmation.',

      '2026-08-06: California routing resolved. Belmar now carries tirzepatide in ' +
      'addition to semaglutide and is the single California pharmacy for both drugs. ' +
      'Greenwich moves to legacy-continuity status: no new starts, existing ' +
      'tirzepatide patients stay only if they choose to. The earlier ' +
      'CA-PHARMACY-CONFLICT item is closed.',

      '2026-08-06: Semaglutide pricing captured. 4-week standard $269, 4-week ' +
      'corporate $199, 8-week $349. A closed legacy cohort exists at a different ' +
      '8-week rate; details held by Operations and deliberately not stored here.',

      '2026-08-06: Indiana routed to Premier provisionally. Farmakeio ships ' +
      'everywhere except California and Indiana, which leaves Premier as the only ' +
      'option for an Indiana patient. Premier does not list IN in its documented ' +
      'ship-to. Marked unconfirmed pending verification with Premier.',

      '2026-08-09 (PUBLIC-SAFE): Legacy cohort rate and the client organisations ' +
      'behind it removed from this file ahead of publishing to GitHub Pages, which ' +
      'serves without authentication. The fact that a closed cohort exists is retained ' +
      'so an unexpected legacy charge is not mistaken for an error; the figure and the ' +
      'organisation names are held by Operations. Do not add them back to this file.',

      '2026-08-09 (FINAL AUDIT): Days supply convention settled and recorded \u2014 the ' +
      'field describes the fill, not the program. Injectable single fills are 28 or 56; ' +
      'fill-plus-refill programs are 28 per fill; brand orals 30 or 60; compounded orals ' +
      '90 only. Audited across all 140 records with no exceptions. Wegovy tablet sig ' +
      'shortened from 191 to 129 characters \u2014 it came in over the 140 cap from the ' +
      'source document and would have truncated in Tebra. Dead MDToolbox rendering ' +
      'removed from the provider tool.',

      '2026-08-09 (TEBRA STRINGS VERIFIED): All 22 brand drug-dropdown strings captured ' +
      'from the Tebra drug search and stored verbatim, including the lowercase ' +
      '\u201ckwikpen\u201d and \u201chd\u201d, and the inconsistent spacing before the bracketed ' +
      'pen content. Zepbound KwikPen entries carry a total-content figure (4 doses x ' +
      '0.6 mL = 2.4 mL) that independently confirms quantity 1. Wegovy pen volume varies ' +
      'by dose: 0.5 mL at 0.25/0.5/1 mg, 0.75 mL at 1.7/2.4/7.2 mg. Wegovy tablet and ' +
      'Foundayo strings already matched. BRAND-KWIKPEN-STRING and WEGOVY-PEN-QUANTITY ' +
      'both closed.',

      '2026-08-09 (BRAND CORRECTIONS): Zepbound corrected to ONE KwikPen per 4-week ' +
      'supply. The pen is a multi-dose device holding 4 fixed weekly doses; the source ' +
      'document quantity of 4 referred to single-dose vials, so prescribing 4 pens ' +
      'would have dispensed sixteen weeks. Foundayo and Wegovy pen prescribing values ' +
      'added, both previously missing entirely. Foundayo and Wegovy tablet long ' +
      'programs are a 60-day supply with no refill; the pens are 4-week plus one ' +
      'refill. Semaglutide 4-week website code FITSema001 added at $269.',

      '2026-08-09 (BRAND PRESCRIBING): Real Tebra Standard prescribing values loaded ' +
      'from the brand prescribing document for Zepbound (6 doses x 2 programs) and the ' +
      'Wegovy oral tablet (4 doses x 2 programs), including pharmacy addresses and ' +
      'phone numbers. Brand pathways restricted to TX, CA, AL and WI \u2014 a program ' +
      'limit the data did not previously capture. Brand visit fee confirmed identical ' +
      'for both program lengths; the short/long choice is clinical, driven by dose ' +
      'stability. Premier glycine 8-week ladder strings corrected \u2014 they had implied ' +
      '2, 3 and 4 mL vial sizes that do not exist, when Premier stocks 1 mL only.',

      '2026-08-09 (BRAND SELECTION): Brand products now carry brandFamily and ' +
      'presentationLabel so they are chosen by brand rather than molecule. A provider ' +
      'picks Wegovy then Pen or Oral tablet, not semaglutide then a formulation. ' +
      'Zepbound and Foundayo have a single presentation each, so the formulation step ' +
      'resolves itself.',

      '2026-08-09 (PROVIDER TOOL PASS): Premier notes made consistent \u2014 all three ' +
      'products offer 4-week and 8-week, all carry a 90-day BUD, and every 8-week ' +
      'program ships complete in one initial shipment. Brand-name billing consolidated ' +
      'to a single $79 prescription visit fee under code FITGLP1001 across LillyDirect, ' +
      'NovoCare and local pharmacy. Oral pricing now resolves from the charge code via ' +
      'priceForCode() rather than being duplicated on each dose.',

      '2026-08-09 (PRESCRIBING REWORK COMPLETE): All 96 compounded records converted ' +
      'to the Functional Health field layout. Premier\u2019s cyanocobalamin dropdown ' +
      'workaround is gone \u2014 every pharmacy now uses a real Tebra Compound drug ' +
      'formulation. QUANTITY IS NOW TOTAL MILLILITRES, not a vial count, matching how ' +
      'Tebra calculates the dose. Oral formulations split by strength: Premier and ' +
      'Farmakeio each have a 0.5 mg and a 1 mg entry that were previously collapsed ' +
      'into one. Naming settled: Premier orals are Dots (KORB marketing term, though ' +
      'Premier compounds them as troches), Farmakeio is RDT, Belmar is FastSL. Seven ' +
      '8-week quantities corrected where the entered figure was the 4-week value; the ' +
      'row notes and the drug math both confirmed the doubled figure.',

      '2026-08-09 (BELMAR): Belmar tirzepatide sig converted from units/mL to mg so it ' +
      'matches Belmar semaglutide, which has been ordered in mg for a couple of years. ' +
      'Semaglutide left byte-identical. Insulin-syringe note stays in the patient ' +
      'directions, not Pharmacy Instructions, because that is the field Belmar reads. ' +
      'Belmar 100-unit no-headroom draw confirmed as intended, no callout.',

      '2026-08-09 (TEBRA FIELDS): Character caps recorded \u2014 Reason for Compounding 30, ' +
      'Patient Instructions 140, Pharmacy Instructions 170. Premier keeps mg-based sig ' +
      'text: that is what Premier wants, has been in place three years, and a previous ' +
      'attempt to standardise it had to be reversed. Greenwich 50-unit dosing into ' +
      '50-unit syringes confirmed deliberate, so the Functional Health syringe callout ' +
      'rule explicitly does not apply to Greenwich GLP-1. Belmar oral semaglutide ' +
      'confirmed as rapid-dissolving tablets. Empty-stomach and 15-minute sublingual ' +
      'instructions extended to all oral products.',

      '2026-08-09 (DECISIONS): Three items settled. Premier\u2019s licensed footprint is ' +
      'final \u2014 routing defaults are overridable, the footprint is not. Manufacturer ' +
      'brand pricing will NOT be stored, by policy: it changes without notice, KORB does ' +
      'not control it, and a stale figure becomes a wrong price quoted to a patient. ' +
      'Oral products follow a 30-day or 60-day provider-set follow-up rather than the ' +
      'injectable 4-week / 8-week cadence, for both compounded and brand orals.',

      '2026-08-09 (STRUCTURAL ROUND): Routing and pharmacy records reworked. Florida ' +
      'added to Premier\u2019s preferred states and routing. KORB active states set to ' +
      'all 50 plus DC. Premier\u2019s shipping list confirmed as a hard licensed ' +
      'footprint \u2014 13 jurisdictions it does not serve are now hard exclusions. ' +
      'Belmar widened to all 50 plus DC but flagged as discouraged outside California ' +
      'on price. Farmakeio set to 49 states plus DC with California the single hard ' +
      'exclusion, and Lifefile removed. Greenwich moved off MDToolbox, preferred states ' +
      'cleared, and restricted to continuing tirzepatide patients only. Every ' +
      'compounding pharmacy now orders via Tebra Compound and bills identically. ' +
      'Brand-name pathways moved to Tebra Standard with a shared brandRules block, ' +
      'and a local-pharmacy channel added. Brand catalogue rebuilt: Zepbound KwikPen ' +
      '(vial presentation dropped), Foundayo added, Wegovy split into pen and tablet ' +
      'with the 7.2 mg pen marked as Wegovy HD. Visit cadence now allows video or ' +
      'asynchronous visits.',

      '2026-08-06 (CONFIRMATION ROUND — supersedes the entry above): Seven open items ' +
      'closed on direct confirmation. Indiana goes to FARMAKEIO, not Premier — the ' +
      'provisional Premier routing has been reversed and removed. Farmakeio ships to ' +
      'all states and DC with California as the only exclusion. Premier glycine 8-week ' +
      'confirmed as a single full-supply fill. Belmar refill trigger confirmed at ' +
      'week 3. Farmakeio top semaglutide dose corrected from 2.4 to 2.5 mg on the ' +
      'label. Greenwich 8-week corrected to Days 56 with two vials. Oral charge codes ' +
      'confirmed for Premier and Belmar only and stripped from Farmakeio oral. ' +
      'Two items remain open, neither blocking.'
    ]
  },

  /* ── NEEDS CONFIRMATION ──────────────────────────────────────────────────
     Open items surfaced by consolidating the documents. Each is a place the
     sources disagreed, were silent, or where this file derived a value.
     Nothing here should reach a patient or a prescription until closed. */
  needsConfirmation: [
    {
      id: 'BRAND-DOC-OUTDATED',
      severity: 'low',
      issue: 'The brand prescribing document predates Foundayo, the Zepbound KwikPen and ' +
             'the Wegovy pen, and its Program Supply Options section has the two products ' +
             'swapped. Every current value now lives in this file instead.',
      question: 'Regenerate the brand document from korb-glp1-data.js so there is one ' +
                'current source rather than a stale one to work around.',
      owner: 'Clinical Operations'
    },
    {
      id: 'BELMAR-TIRZ-8WK-CODE',
      severity: 'medium',
      type: 'placeholder',
      issue: 'Belmar 8-week is a split fill. The charge code is what tells Ops to order ' +
             'the second 4 weeks. Semaglutide has FITSemaMBL; tirzepatide does not yet.',
      question: 'Swap PLACEHOLDER-TIRZ-8WK-BELMAR once VP Finance issues the real code.',
      owner: 'VP Finance/Compliance'
    }
  ],

  /* ── PROGRAM PROGRESSION ─────────────────────────────────────────────────
     How a patient moves between the 4-week and 8-week programs. Provider-driven
     throughout, and internal only. */
  progression: {
    appliesTo: ['semaglutide', 'tirzepatide'],
    appliesToNote: 'Identical for both drugs. No drug-specific variation.',
    visibility: 'internal',
    doNotPublish: true,
    publishNote: 'Internal and provider-facing only. Do not put this rule in a patient handout, the website, a pricing flyer, or any Circle post. A patient should not arrive expecting to graduate to 8-week.',
    startsAt: '4-week',
    startRule: 'Every patient starts on the 4-week program. No exceptions.',
    eightWeekEligibility: 'A patient may be offered the 8-week program once they are stable at the dose they have landed on after escalation.',
    mandatory: false,
    decisionOwner: 'Provider',
    patientInitiated: false,
    decisionNote: 'Provider-driven throughout. The 8-week program is an offer the provider extends, not a milestone the patient reaches or requests. Escalation, holding, reducing and weaning off are all provider discretion.',
    weaning: { decisionOwner: 'Provider', note: 'Dose reduction and weaning off therapy are entirely at provider discretion. No fixed taper schedule is defined at the program level.' },
    reasonsToStayOnFourWeek: [
      'Cost \u2014 the 4-week program is the lower per-visit outlay and carries the discounted rate.',
      'Accountability \u2014 some patients want to see the provider monthly.',
      'Clinical \u2014 the provider judges that side effects are not adequately controlled and the patient needs to be seen more often.'
    ],
    visitCadence: {
      fourWeek: 'Monthly provider visit',
      eightWeek: 'Provider visit every 8 weeks',
      modality: 'Either a video visit or an asynchronous visit. Both are acceptable for 4-week and 8-week follow-ups.'
    },
    /* Oral products do not follow the injectable 4-week / 8-week rhythm. */
    oral: {
      appliesTo: 'All oral products \u2014 compounded (Premier dots, Belmar FastSL, Farmakeio) and brand (Foundayo, Wegovy tablet).',
      followUpOptions: ['30 days', '60 days'],
      decisionOwner: 'Provider',
      rule: 'The provider sets a 30-day or 60-day follow-up to keep the patient on track, rather than using the 4-week / 8-week injectable cadence.',
      supplyIsNotCadence: 'Dispensed quantity and follow-up interval are separate decisions. The compounded orals dispense as a 90-day supply, but the patient is still seen at 30 or 60 days. Do not read a 90-day supply as a 90-day follow-up.',
      modality: 'Video or asynchronous, same as the injectable programs.'
    }
  },

  /* ── TEBRA FIELD LIMITS ─────────────────────────────────────────────────
     Hard character caps in Tebra. Confirmed 2026-08-09. Any tool or document
     that generates prescribing text must respect these. */
  /* ── DAYS SUPPLY CONVENTION ──────────────────────────────────────────────
     Settled 2026-08-09. Days supply describes THE FILL, not the whole program.
       Injectable, single fill      4-week = 28   8-week = 56
       Injectable, fill + refill    28 per fill, refill 1 (Belmar, Zepbound, Wegovy pen)
       Oral, brand                  30 or 60
       Oral, compounded             90 only
     Writing 56 on a refill fill would read as 112 days of medication. Audited
     across all 140 records; every value conforms. */
  daysConvention: {
    injectableSingleFill: { fourWeek: 28, eightWeek: 56 },
    injectableWithRefill: { perFill: 28, refills: 1,
      appliesTo: ['belmar', 'zepbound', 'wegovy_pen'] },
    oralBrand: [30, 60],
    oralCompounded: [90],
    rule: 'Days supply describes the fill, not the program.'
  },

  tebraLimits: {
    reasonForCompounding: 30,
    patientInstructions: 140,
    pharmacyInstructions: 170,
    note: 'Exceeding a cap truncates silently in some views, so text is written ' +
          'to fit rather than trimmed later.'
  },

  /* ── STATES ──────────────────────────────────────────────────────────────
     The canonical state data. This is the block that caused the original
     typo. It is now stated exactly once. Every document and tool that shows
     a state list must read from here. */
  states: {

    // KORB's affiliated practice is active in all 50 states and DC.
    korbActive: [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
      'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
      'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
      'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
      'WY'
    ],

    // Routing rule, evaluated in order. First match wins.
    // Applies to NEW starts. Patients already established with a pharmacy stay
    // where they are unless there is a clinical or supply reason to move them.
    // A default can be overridden; whether a given pharmacy can actually serve
    // the state is a separate question answered by hardExcludes.
    routing: [
      { states: ['TX', 'NV', 'AZ', 'FL'], pharmacy: 'premier', basis: 'preferred pharmacy' },
      { states: ['CA'],                   pharmacy: 'belmar',
        basis: 'sole California pharmacy \u2014 semaglutide and tirzepatide',
        note: 'Farmakeio cannot ship to CA at all. Greenwich is continuation only.' },
      { states: ['*'],                    pharmacy: 'farmakeio', basis: 'all other new patients' }
    ],

    // Resolve a two-letter state code to a pharmacy key.
    routeTo: function (stateCode) {
      var s = String(stateCode || '').toUpperCase();
      for (var i = 0; i < KORB_GLP1.states.routing.length; i++) {
        var r = KORB_GLP1.states.routing[i];
        if (r.states.indexOf('*') !== -1 || r.states.indexOf(s) !== -1) return r;
      }
      return null;
    }
  },

  /* ── PHARMACIES ──────────────────────────────────────────────────────── */
  pharmacies: {

    premier: {
      key: 'premier',
      name: 'Premier Pharmacy',
      color: '#1565C0',
      type: 'compounding',
      visibility: 'provider',
      status: 'active',
      preferredStates: ['TX', 'NV', 'AZ', 'FL'],
      shipsTo: [
        'AZ', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'IL', 'KS', 'KY',
        'LA', 'MD', 'ME', 'MI', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE',
        'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SD',
        'TN', 'TX', 'UT', 'VA', 'VT', 'WI', 'WV', 'WY'
      ],
      // Premier's list IS its licensed footprint. Anything not on it is a hard
      // exclusion, not a preference. The routing default can be overridden;
      // the shipping footprint cannot.
      hardExcludes: [
        'AK', 'AL', 'AR', 'CA', 'HI', 'IA', 'ID', 'IN', 'MA', 'MN',
        'NH', 'SC', 'WA'
      ],
      shipsToNote: 'Licensed shipping list. Premier cannot ship anywhere outside it, ' +
                   'including California. Confirmed 2026-08-09.',
      footprintIsSettled:
        'SETTLED \u2014 do not soften this back to a preference. Two different things were ' +
        'being confused: the ROUTING DEFAULT for a state is overridable (a provider may ' +
        'choose Premier where Farmakeio is default, or vice versa), but Premier\u2019s ' +
        'LICENSED FOOTPRINT is not. States outside shipsTo are hard exclusions.',
      orderVia: 'Tebra Compound',
      billing: 'Bill to KORB Health Group, ship to patient',
      notes: [
        'All Premier programs offer a 4-week and an 8-week option \u2014 semaglutide, ' +
        'semaglutide with glycine, and tirzepatide alike.',
        'All Premier compounds carry a 90-day BUD as of 2026-08. There is no longer a ' +
        'difference between the glycine and non-glycine products on this.',
        '8-week programs ship the full eight weeks of medication and supplies in a ' +
        'single initial shipment. No refill and no second shipment.',
        'Vials remain 28 days from first use regardless of BUD. On lower doses this ' +
        'produces overage. Counsel the patient to discard at 28 days.'
      ]
    },

    belmar: {
      key: 'belmar',
      name: 'Belmar Pharmacy',
      color: '#6A1B9A',
      type: 'compounding',
      visibility: 'provider',
      status: 'active',
      preferredStates: ['CA'],
      shipsTo: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
        'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
        'WY'
      ],
      hardExcludes: [],
      shipsToNote: 'Ships to all 50 states and DC. Preferred for California only.',
      discouragedOutsidePreferred: true,
      discouragedReason:
        'Belmar pricing is higher than the other compounding pharmacies, which is why ' +
        'patients are kept in California unless there is a specific reason. Selecting ' +
        'Belmar outside California is allowed but should be a deliberate exception.',
      orderVia: 'Tebra Compound',
      billing: 'Bill to KORB Health Group, ship to patient',
      notes: [
        'Belmar historically carried semaglutide only, which is why California ' +
        'tirzepatide went to Greenwich. Belmar now carries both, so all new ' +
        'California starts go here regardless of drug.',
        'SPLIT FILL \u2014 Belmar is the only pharmacy that will not ship an 8-week ' +
        'supply at one time. Their 8-week program is a 4-week supply with one ' +
        'refill, for both semaglutide and tirzepatide.',
        'The refill is not automatic. Ops must manually approve and order the ' +
        'second 4 weeks. The 8-week charge code is what triggers that Ops action, ' +
        'which is why Belmar 8-week uses its own code rather than the standard one.',
        'Semaglutide 2.5 mg / 1 mg / ml is used for 1.7 and 2.4 mg doses; ' +
        '1 mg / 1 mg / ml for 0.25, 0.5 and 1.0 mg doses.',
        'Tirzepatide is compounded with L-carnitine, not B-12.',
        'SYRINGES GO IN THE DIRECTIONS, NOT PHARMACY INSTRUCTIONS. Belmar reads the ' +
        'patient directions field. If the insulin-syringe note is moved to Pharmacy ' +
        'Instructions they may not see it and will not ship syringes. Keep ' +
        '"(Include one pack of insulin syringes)" at the end of every Belmar sig.',
        'Belmar doses in MG, both drugs. Semaglutide has been ordered this way for a ' +
        'couple of years and tirzepatide was brought over to match it. Do not convert ' +
        'either to units/mL.',
        'Belmar sigs always read "AS DIRECTED FOR 4 WEEKS" on both programs, because ' +
        'the 8-week program is a 4-week fill plus a refill. The sig describes the fill.',
        'Belmar 1.0 mg semaglutide draws 100 units into a 100-unit syringe with no ' +
        'headroom. That is how Belmar wants it. No syringe callout \u2014 same as Greenwich, ' +
        'the Functional Health callout rule does not apply here.'
      ],
      splitFill: {
        applies: ['8-week'],
        drugs: ['semaglutide', 'tirzepatide'],
        structure: '4-week supply with 1 refill',
        refillOwner: 'Operations',
        refillAutomatic: false,
        trigger: 'The Belmar-specific 8-week charge code flags the order for Ops to ' +
                 'place the second 4-week fill.',
        timing: {
          opsTriggeredAt: 'Week 3',
          opsTriggeredAtApproximate: false,
          confirmed: '2026-08-06',
          goal: 'The second 4-week supply should reach the patient a few days before ' +
                'their next set of injections is due, so there is no lapse in dosing.'
        },
        providerScript: 'Tell a California patient on the 8-week program that their ' +
                        'medication arrives in two shipments, and that the second ' +
                        'arrives before the first runs out. They do not need to ' +
                        'request it.'
      }
    },

    farmakeio: {
      key: 'farmakeio',
      name: 'Farmakeio Pharmacy',
      abbrev: 'FKO',
      color: '#EF6C00',
      type: 'compounding',
      visibility: 'provider',
      status: 'active',
      preferredStates: [
        'AK', 'AL', 'AR', 'CO', 'CT', 'DC', 'DE', 'GA', 'HI', 'IA',
        'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI',
        'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
        'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'UT',
        'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
      ],
      shipsTo: [
        'AK', 'AL', 'AR', 'AZ', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
        'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD',
        'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
        'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
      ],
      hardExcludes: ['CA'],
      shipsToNote: 'Ships to 49 states plus DC. California is the single state Farmakeio ' +
                   'will not ship to, and that cannot be overridden. Preferred everywhere ' +
                   'except CA, TX, FL, AZ and NV.',
      orderVia: 'Tebra Compound',
      billing: 'Bill to KORB Health Group, ship to patient',
      notes: [
        'Products ship as a HOME KIT that includes syringes and supplies.',
        'Compounded with pyridoxine (B-6) for nausea prevention, not B-12.',
        'Semaglutide is a single concentration (2.5 mg/25 mg per mL). Dose is set by ' +
        'volume; the only variable on the Rx is how many mL.',
        'Tirzepatide is a single concentration (18 mg/25 mg per mL).'
      ]
    },

    greenwich: {
      key: 'greenwich',
      name: 'Greenwich Pharmacy',
      abbrev: 'GWP',
      color: '#2E7D32',
      type: 'compounding',
      visibility: 'provider',
      status: 'legacy-continuity',
      statusNote: 'NOT USED FOR GLP-1 except to continue an existing tirzepatide ' +
                  'patient who does not want to switch. Greenwich is now primarily a ' +
                  'Functional Health peptide pharmacy. Do not route a new GLP-1 patient ' +
                  'here and do not offer it as a GLP-1 option.',
      overrideOnlyFor: 'An established Greenwich tirzepatide patient continuing therapy.',
      preferredStates: [],
      shipsTo: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
        'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
        'WY'
      ],
      hardExcludes: [],
      shipsToNote: 'Ships to all 50 states and DC, but see the status note \u2014 shipping ' +
                   'reach is not the limiting factor, program policy is.',
      address: 'Greenwich Rx, 9733 FM 2920 Rd, Suite 100, Tomball, TX 77375',
      orderVia: 'Tebra Compound',
      orderViaNote: 'Moved from MDToolbox to Tebra Compound. MDToolbox is being turned ' +
                    'off at the end of August 2026.',
      billing: 'Bill to KORB Health Group, ship to patient',
      bud: '90 days',
      notes: [
        'Ships FedEx next-day only, Monday through Thursday. Patient should receive ' +
        'within three business days of order.',
        'The patient does not receive a shipping confirmation from the pharmacy.',
        'Ships in disposable coolers with ice packs in summer, Kangaroo Pouch Mailers ' +
        'the rest of the year.',
        'Will NOT accept a do-not-fill date.',
        'B-12 only. No other added formulations.',
        'Patient is automatically shipped a 10-pack of 50-unit insulin syringes.',
        'SYRINGE NOTE \u2014 every Greenwich GLP-1 dose is exactly 50 units in a 50-unit ' +
        'syringe. That is deliberate and has been their practice for all GLP-1s since ' +
        'before KORB started using them. Do NOT add the 100-UNIT SYRINGE callout used ' +
        'for Functional Health peptides; the FH&L syringe rule does not apply here.',
        'Ordering 4 mL on the prescription ships two 2 mL vials.',
        'Dose is set by concentration, not volume. Every dose injects 50 units.'
      ]
    },

    lillydirect: {
      key: 'lillydirect',
      name: 'LillyDirect',
      color: '#C62828',
      type: 'manufacturer-direct',
      visibility: 'provider',
      status: 'active',
      preferredStates: [],
      shipsTo: [],
      hardExcludes: [],
      orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
      billing: 'Patient pays the manufacturer program directly. See brandRules.',
      notes: [
        'Cash-pay, direct-to-patient. Dispensing, payment, shipping and delivery ' +
        'are managed by the manufacturer. KORB does not manage fulfillment.',
        'Carries Zepbound KwikPen and Foundayo (orforglipron) oral tablets.',
        'Not a KORB compounding pharmacy. Provider-side only.'
      ]
    },

    novocare: {
      key: 'novocare',
      name: 'NovoCare',
      color: '#00695C',
      type: 'manufacturer-direct',
      visibility: 'provider',
      status: 'active',
      preferredStates: [],
      shipsTo: [],
      hardExcludes: [],
      orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
      billing: 'Patient pays the manufacturer program directly. See brandRules.',
      notes: [
        'Cash-pay manufacturer program. KORB does not manage fulfillment.',
        'Carries the Wegovy pen and the Wegovy oral tablet.',
        'Not a KORB compounding pharmacy. Provider-side only.'
      ]
    },

    local_pharmacy: {
      key: 'local_pharmacy',
      name: 'Patient\u2019s local pharmacy',
      color: '#455A64',
      type: 'retail',
      visibility: 'provider',
      status: 'active',
      brandOnly: true,
      preferredStates: [],
      shipsTo: [],
      hardExcludes: [],
      orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
      billing: 'Patient pays the pharmacy directly. See brandRules.',
      notes: [
        'BRAND-NAME PRODUCTS ONLY. Compounded products cannot be sent here.',
        'Available on patient request, under the same brand rules.',
        'KORB will not re-send a prescription between pharmacies to find a lower ' +
        'price. The patient compares pricing before asking for the prescription.'
      ]
    }
  },

  /* ── BRAND-NAME RULES ────────────────────────────────────────────────────
     Apply to every brand-name pathway regardless of channel: LillyDirect,
     NovoCare, or the patient's local pharmacy. */
  brandRules: {
    availableStates: ['TX', 'CA', 'AL', 'WI'],
    availableStatesNote:
      'Brand-name GLP-1 through the manufacturer programs is only available in Texas, ' +
      'California, Alabama and Wisconsin. Source: the brand prescribing document. ' +
      'This is a program limit, not a shipping limit \u2014 do not offer a brand pathway ' +
      'to a patient outside these four states.',
    orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
    billing: 'Patient pays the manufacturer program or the local pharmacy directly.',
    noPriorAuth: true,
    noCoupons: true,
    patientResponsibility:
      'KORB does not complete insurance prior authorizations and does not handle ' +
      'coupons or manufacturer savings cards. The patient is responsible for ' +
      'checking pricing, coverage and every other aspect of the medication.',
    localPharmacyAllowed: true,
    noPharmacyShopping:
      'A brand prescription can be sent to the patient\u2019s local pharmacy on request, ' +
      'under the same rules. KORB will not re-send a prescription between pharmacies ' +
      'to chase a lower price. The patient does that comparison before ordering.'
  },

  /* ── CLINICAL BOILERPLATE ────────────────────────────────────────────────
     Identical in all eight pharmacy documents. Stated once here. */
  clinical: {

    programName: 'Get Fit Now',
    visitCadence: 'Every 4 to 8 weeks',

    indications: [
      'Weight loss',
      'Medically driven weight loss',
      'Increased energy',
      'Better sleep',
      'Improved mental health',
      'Improved cardiovascular health'
    ],

    candidateCriteria: {
      bmi: [
        'BMI greater than 25 is overweight',
        'BMI greater than 30 is obese'
      ],
      fdaApproved: [
        'Weight loss',
        'Type 2 diabetes',
        'Prevention of cardiovascular death, myocardial infarction and stroke in ' +
        'adults with established cardiovascular disease who are overweight or obese'
      ],
      diabetesNote:
        'KORB treats weight loss. Patients who are diabetic or pre-diabetic are ' +
        'acceptable. Diabetic patients can usually obtain coverage through insurance; ' +
        'where cost or availability prevents that, KORB can supply the medication. ' +
        'The patient must continue diabetes management with their PCP.'
    },

    contraindications: [
      'Personal or family history of medullary thyroid carcinoma (MTC)',
      'Multiple endocrine neoplasia syndrome type 2 (MEN2)',
      'Hypersensitivity to the active drug or any component of the formulation',
      'Current pregnancy, breastfeeding, or planning pregnancy',
      'Active gallbladder disease or history of gallbladder-related surgical complications',
      'History of pancreatitis (use with caution)',
      'Severe gastrointestinal disorders such as gastroparesis',
      'Severe renal impairment (eGFR below 30 mL/min/1.73 m²)',
      'Uncontrolled diabetic retinopathy (primarily relevant in type 2 diabetes)'
    ],

    sideEffects: {
      common: [
        'Pain, redness or swelling at the injection site',
        'Nausea and vomiting',
        'Diarrhea',
        'Stomach pain',
        'Constipation',
        'Low appetite',
        'Headaches',
        'Dizziness'
      ],
      lessCommon: [
        'Pancreatitis',
        'Gastroparesis',
        'Bowel obstruction',
        'Gallstone attacks'
      ]
    },

    counseling: [
      'Gastrointestinal side effects are most common during dose escalation.',
      'Slower titration or holding at the current dose may improve tolerability.',
      'Instruct the patient to report persistent, severe or worsening symptoms.',
      'New or severe symptoms may require dose adjustment, temporary hold, or discontinuation.',
      'Vials are good for 28 days from first use regardless of the pharmacy BUD. ' +
      'Counsel the patient to discard at 28 days even if medication remains.'
    ]
  },

  /* ── PRODUCTS ────────────────────────────────────────────────────────────
     One entry per pharmacy + drug + formulation. Prescribing fields follow the
     Functional Health layout exactly, in Tebra Compound order:
       Drug Formulation, Name, Allow Substitution, Quantity, Unit, Refill,
       Days Supply, Patient Instructions, Reason for Compounding,
       Pharmacy Instructions.

     QUANTITY IS TOTAL MILLILITRES, not a vial count. Greenwich 15 mg 8-week is
     quantity 4 = two 2 mL vials. Do not "correct" these to vial counts.

     Reviewed line by line and corrected 2026-08-09. Brand-name products further
     down are Tebra STANDARD prescriptions and deliberately do not use this shape.
     ──────────────────────────────────────────────────────────────────────── */
  products: {

    premier_sema: {
      key: 'premier_sema',
      pharmacy: 'premier',
      drug: 'semaglutide',
      label: 'Premier \u2014 Semaglutide / B-12',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide 3 mg / B-12 0.5 mg per mL',
      doses: [
        {
          dose: '0.3 mg', mg: 0.3, units: 10,
          vials4: '0.6 ml', vials8: '0.6 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 0.3 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 0.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 0.3 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 1.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '0.6 mg', mg: 0.6, units: 20,
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 0.6 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 0.6 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '1.2 mg', mg: 1.2, units: 40,
          vials4: '0.6 ml x 1 & 1 ml x 1', vials8: '0.6 ml x 2 & 1 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 1.2 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 1.2 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 3.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '1.8 mg', mg: 1.8, units: 60,
          vials4: '2.4 ml', vials8: '2.4 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 1.8 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2.4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 1.8 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4.8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '2.7 mg', mg: 2.7, units: 90,
          vials4: '3.6 ml', vials8: '3.6 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 2.7 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 2.7 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 7.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        }
      ]
    },

    premier_sema_glycine: {
      key: 'premier_sema_glycine',
      pharmacy: 'premier',
      drug: 'semaglutide',
      label: 'Premier \u2014 Semaglutide / B-12 / Glycine',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide 3 mg / B-12 0.5 mg / Glycine 5 mg per mL',
      doses: [
        {
          dose: '0.3 mg', mg: 0.3, units: 10,
          vials4: '1 ml vial', vials8: '1 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.3 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.3 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '0.6 mg', mg: 0.6, units: 20,
          vials4: '1 ml vial', vials8: '1 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.6 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.6 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '1.2 mg', mg: 1.2, units: 40,
          vials4: '1 ml x 2 vials', vials8: '1 ml x 4 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.2 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.2 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '1.8 mg', mg: 1.8, units: 60,
          vials4: '1 ml x 3 vials', vials8: '1 ml x 5 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.8 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.8 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '2.7 mg', mg: 2.7, units: 90,
          vials4: '1 ml x 4 vials', vials8: '1 ml x 8 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 2.7 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 2.7 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        }
      ]
    },

    premier_tirz: {
      key: 'premier_tirz',
      pharmacy: 'premier',
      drug: 'tirzepatide',
      label: 'Premier \u2014 Tirzepatide / B-12',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Tirzepatide 18 mg / B-12 0.5 mg per mL',
      doses: [
        {
          dose: '2 mg', mg: 2, units: 11, priceTier: 'T1A',
          vials4: '0.6 ml', vials8: '0.6 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 2 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 0.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 2 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 1.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '4 mg', mg: 4, units: 22, priceTier: 'T1A',
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 4 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 4 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '6.5 mg', mg: 6.5, units: 36, priceTier: 'T2A',
          vials4: '0.6 ml & 1 ml', vials8: '0.6 ml x 2 & 1 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 6.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 6.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 6.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 3.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 6.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '8.5 mg', mg: 8.5, units: 47, priceTier: 'T2A',
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 8.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 8.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 8.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 8.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '13.5 mg', mg: 13.5, units: 75, priceTier: 'T3A',
          vials4: '1 ml & 2 ml', vials8: '2 ml x 3',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 13.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 13.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 13.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 13.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '16 mg', mg: 16, units: 89, priceTier: 'T3A',
          vials4: '3.6 ml', vials8: '3.6 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 16 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 16 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 16 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 7.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 16 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        }
      ]
    },

    belmar_sema: {
      key: 'belmar_sema',
      pharmacy: 'belmar',
      drug: 'semaglutide',
      label: 'Belmar \u2014 Semaglutide / B-12',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide / B-12, two concentrations by dose band',
      supplyNote: '8-week program is a 1-month supply with 1 refill.',
      doses: [
        {
          dose: '0.25 mg', mg: 0.25, units: 25,
          conc: '1 mg/1 mg/ml',
          vials4: '1 ml x 1 vial', vials8: '1 ml x 1 vial (each fill)',
          drugFormulation: 'Semaglutide/B-12 1mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 0.25 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.25 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 0.25 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 0.25 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '0.5 mg', mg: 0.5, units: 50,
          conc: '1 mg/1 mg/ml',
          vials4: '1 ml x 2 vials', vials8: '1 ml x 2 vials (each fill)',
          drugFormulation: 'Semaglutide/B-12 1mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 0.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 0.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 0.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '1.0 mg', mg: 1, units: 100,
          conc: '1 mg/1 mg/ml',
          vials4: '5 ml x 1 vial', vials8: '5 ml x 1 vial (each fill)',
          drugFormulation: 'Semaglutide/B-12 1mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 1.0 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 1.0 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 1 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '1.7 mg', mg: 1.7, units: 68,
          conc: '2.5 mg/1 mg/ml',
          vials4: '5 ml x 1 vial', vials8: '5 ml x 1 vial (each fill)',
          drugFormulation: 'Semaglutide/B-12 2.5mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 1.7 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 1.7 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 1.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '2.4 mg', mg: 2.4, units: 96,
          conc: '2.5 mg/1 mg/ml',
          vials4: '5 ml x 1 vial', vials8: '5 ml x 1 vial (each fill)',
          drugFormulation: 'Semaglutide/B-12 2.5mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 2.4 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2.4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 2.4 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 2.4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        }
      ]
    },

    belmar_tirz: {
      key: 'belmar_tirz',
      pharmacy: 'belmar',
      drug: 'tirzepatide',
      label: 'Belmar \u2014 Tirzepatide / L-Carnitine',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
      supplyNote: '8-week program provides a 1-month supply with 1 refill.',
      doses: [
        {
          dose: '2.5 mg', mg: 2.5, units: 25, priceTier: 'T1A',
          vials4: '1 ml x 1 vial', vials8: '1 ml x 1 vial (each fill)',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 2.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '5 mg', mg: 5, units: 50, priceTier: 'T1A',
          vials4: '1 ml x 2 vials', vials8: '1 ml x 2 vials (each fill)',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '7.5 mg', mg: 7.5, units: 75, priceTier: 'T2A',
          vials4: '1 ml x 3 vials', vials8: '1 ml x 3 vials (each fill)',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 7.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 7.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 7.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 7.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '10 mg', mg: 10, units: 100, priceTier: 'T2A',
          vials4: '4 ml x 1 vial', vials8: '4 ml x 1 vial (each fill)',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 10 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 10 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 10 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 10 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '12.5 mg', mg: 12.5, units: 125, priceTier: 'T3A',
          vials4: '1 ml x 1 vial & 4 ml x 1 vial', vials8: '1 ml x 1 vial & 4 ml x 1 vial (each fill)',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 12.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 12.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 12.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 12.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        },
        {
          dose: '15 mg', mg: 15, units: 150, priceTier: 'T3A',
          vials4: '1 ml x 2 vials & 4 ml x 1 vial', vials8: '1 ml x 2 vials & 4 ml x 1 vial (each fill)',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 15 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 15 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 15 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 1,
            days: 28,
            ptInstructions: 'INJECT 15 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes)',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:'
          }
        }
      ]
    },

    farmakeio_sema: {
      key: 'farmakeio_sema',
      pharmacy: 'farmakeio',
      drug: 'semaglutide',
      label: 'Farmakeio \u2014 Semaglutide / B-6 Home Kit',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide 2.5 mg / Pyridoxine (B-6) 25 mg per mL \u2014 HOME KIT',
      formulationNote: 'Single concentration for every dose. Dose is set by volume; the only variable is how many mL (1, 2, 3, 4, 5).',
      doses: [
        {
          dose: '0.25 mg', mg: 0.25, units: 10,
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.25 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.10ML (10 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.25 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.10ML (10 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '0.5 mg', mg: 0.5, units: 20,
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.20ML (20 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.20ML (20 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '1.0 mg', mg: 1, units: 40,
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.0 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.40ML (40 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.0 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.40ML (40 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '1.7 mg', mg: 1.7, units: 68,
          vials4: '3 ml', vials8: '3 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.7 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.68ML (68 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.7 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.68ML (68 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '2.5 mg', mg: 2.5, units: 100,
          vials4: '4 ml', vials8: '4 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.00ML (100 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1.00ML (100 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        }
      ]
    },

    farmakeio_tirz: {
      key: 'farmakeio_tirz',
      pharmacy: 'farmakeio',
      drug: 'tirzepatide',
      label: 'Farmakeio \u2014 Tirzepatide / B-6 Home Kit',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Tirzepatide 18 mg / Pyridoxine (B-6) 25 mg per mL \u2014 HOME KIT',
      formulationNote: 'Single concentration for every dose. Dose is set by volume.',
      doses: [
        {
          dose: '2.5 mg', mg: 2.5, units: 13, priceTier: 'T1A',
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.13ML (13 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.13ML (13 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '4.5 mg', mg: 4.5, units: 25, priceTier: 'T1A',
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 4.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.25ML (25 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 4.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.25ML (25 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '7.5 mg', mg: 7.5, units: 42, priceTier: 'T2A',
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 7.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.42ML (42 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 7.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.42ML (42 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '9 mg', mg: 9, units: 50, priceTier: 'T2A',
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 9 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 9 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '13.5 mg', mg: 13.5, units: 75, priceTier: 'T3A',
          vials4: '3 ml', vials8: '3 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 13.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.75ML (75 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 13.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.75ML (75 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '15 mg', mg: 15, units: 83, priceTier: 'T3A',
          vials4: '4 ml', vials8: '4 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 15 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.83ML (83 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 15 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.83ML (83 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        }
      ]
    },

    greenwich_tirz: {
      key: 'greenwich_tirz',
      pharmacy: 'greenwich',
      drug: 'tirzepatide',
      label: 'Greenwich \u2014 Tirzepatide / B-12',
      visibility: 'provider',
      status: 'legacy-continuity',
      statusNote: 'Continuation only, for established Greenwich tirzepatide patients who chose not to move to Belmar. Not available for new starts.',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'KBH Tirzepatide + B12 Injection \u2014 concentration varies by dose',
      formulationNote: 'Dose is set by concentration, not volume. Every dose injects 0.50 mL (50 units). 4-week supply is written as 2 ml (one 2 ml vial); 8-week supply is written as 4 ml (two 2 ml vials).',
      doses: [
        {
          dose: '2.5 mg', mg: 2.5, units: 50, priceTier: 'T1A',
          conc: '5 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 5mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '5 mg', mg: 5, units: 50, priceTier: 'T1A',
          conc: '10 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 10mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '7.5 mg', mg: 7.5, units: 50, priceTier: 'T2A',
          conc: '15 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 15mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 7.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 7.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '10 mg', mg: 10, units: 50, priceTier: 'T2A',
          conc: '20 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 20mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 10 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 10 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '12.5 mg', mg: 12.5, units: 50, priceTier: 'T3A',
          conc: '25 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 25mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 12.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 12.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '15 mg', mg: 15, units: 50, priceTier: 'T3A',
          conc: '30 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 30mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 15 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 15 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        }
      ]
    },

    premier_oral_sema: {
      key: 'premier_oral_sema',
      pharmacy: 'premier',
      drug: 'semaglutide',
      label: 'Premier \u2014 Oral Semaglutide Dots',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      positioning: 'Consider for patients focused on long-term metabolic resilience and longevity optimization, or who cannot tolerate injectables.',
      doses: [
        {
          dose: '0.5 mg', mg: 0.5,
          presentation: 'Oral Dot #90',
          chargeCode: 'FITSemOrl90',
          drugFormulation: 'Semaglutide Oral Dot 0.5mg',
          rx: {
            name: 'PREMIER \u2013 Oral Semaglutide 0.5 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 DOT UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '1 mg', mg: 1,
          presentation: 'Oral Dot #90',
          chargeCode: 'FITSemOrl180',
          drugFormulation: 'Semaglutide Oral Dot 1mg',
          rx: {
            name: 'PREMIER \u2013 Oral Semaglutide 1 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 DOT UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    premier_oral_tirz: {
      key: 'premier_oral_tirz',
      pharmacy: 'premier',
      drug: 'tirzepatide',
      label: 'Premier \u2014 Oral Tirzepatide Dots',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      doses: [
        {
          dose: '3 mg', mg: 3,
          presentation: 'Oral Dot #90',
          chargeCode: 'FITTirOrl90',
          drugFormulation: 'Tirzepatide Oral Dot 3mg',
          rx: {
            name: 'PREMIER \u2013 Oral Tirzepatide 3 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 DOT UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '6 mg', mg: 6,
          presentation: 'Oral Dot #180',
          chargeCode: 'FITTirOrl180',
          drugFormulation: 'Tirzepatide Oral Dot 3mg',
          rx: {
            name: 'PREMIER \u2013 Oral Tirzepatide 6 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 180,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 2 DOTS UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    belmar_oral_sema: {
      key: 'belmar_oral_sema',
      pharmacy: 'belmar',
      drug: 'semaglutide',
      label: 'Belmar \u2014 Oral Semaglutide FastSL',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      doses: [
        {
          dose: '0.5 mg', mg: 0.5,
          presentation: 'FastSL Tablet #45',
          chargeCode: 'FITSemOrl90',
          drugFormulation: 'Semaglutide FastSL 1mg',
          rx: {
            name: 'BELMAR \u2013 Oral Semaglutide 0.5 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 45,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1/2 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '1 mg', mg: 1,
          presentation: 'FastSL Tablet #90',
          chargeCode: 'FITSemOrl180',
          drugFormulation: 'Semaglutide FastSL 1mg',
          rx: {
            name: 'BELMAR \u2013 Oral Semaglutide 1 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    farmakeio_oral_sema: {
      key: 'farmakeio_oral_sema',
      pharmacy: 'farmakeio',
      drug: 'semaglutide',
      label: 'Farmakeio \u2014 Oral Semaglutide',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      presentationNote: 'The Farmakeio pricing section calls these Oral Dots; the Tebra favorites section calls them Oral RDT. Same product, 90-day supply.',
      doses: [
        {
          dose: '0.5 mg', mg: 0.5,
          presentation: 'Oral Dot / RDT #90',
          chargeCode: 'FITSemOrl90', price: 299,
          drugFormulation: 'Semaglutide Oral RDT 0.5mg',
          rx: {
            name: 'FARMAKEIO \u2013 Oral Semaglutide 0.5 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '1 mg', mg: 1,
          presentation: 'Oral Dot / RDT #90',
          chargeCode: 'FITSemOrl180', price: 399,
          drugFormulation: 'Semaglutide Oral RDT 1mg',
          rx: {
            name: 'FARMAKEIO \u2013 Oral Semaglutide 1 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    /* ── BRAND NAME — Tebra STANDARD prescriptions, not Compound ─────────── */
    zepbound: {
      key: 'zepbound',
      brandFamily: 'Zepbound',
      presentationLabel: 'KwikPen',
      pharmacy: 'lillydirect',
      altChannels: ['local_pharmacy'],
      drug: 'tirzepatide',
      label: 'Zepbound (tirzepatide) \u2014 brand name',
      brandName: true,
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      presentation: 'KwikPen \u2014 disposable multi-dose, single-patient-use prefilled pen',
      presentationNote: 'KwikPen only. Do NOT prescribe the single-dose vial presentation.',
      penContains: 'One KwikPen holds 4 fixed weekly doses. The pen locks out after the ' +
        'fourth dose and is then discarded, including any leftover medicine. Do not ' +
        'transfer from the pen into a syringe.',
      dropdownWarning: 'Tebra lists BOTH presentations. The vial reads "Zepbound X mg/' +
        '0.5 ml subcutaneous solution"; the pen reads "Zepbound kwikpen X mg/0.6 ml ...". ' +
        'Selecting the 0.5 mL vial with quantity 1 dispenses ONE WEEK instead of four. ' +
        'The bracketed figure in the pen entry is total pen content \u2014 4 doses x 0.6 mL ' +
        '= 2.4 mL \u2014 which is Tebra confirming the 4-dose device.',
      dropdownNote: 'Strings verified against the Tebra drug search 2026-08-09. The 12.5 mg ' +
        'entry displays as "...pen inject" in the dropdown; that is the list truncating ' +
        'on width, not the stored text.',
      strengths: '2.5, 5, 7.5, 10, 12.5 and 15 mg \u2014 all 0.6 mL',
      retailOption: 'LillyDirect self-pay with free home delivery, or retail pickup at ' +
                    'Walmart Pharmacy.',
      orderVia: 'Tebra Standard prescription',
      pharmacyAddress: 'LillyDirect Self Pay Pharmacy Solutions, 4343 Equity Dr, Columbus, OH 43228-3842 \u00b7 (833) 432-4322',
      dispensing: [
        { key: 'rx4', label: '4-week (28-day)', quantity: 1, unit: 'pen', refill: 0, days: 28,
          use: 'New prescription or any dose change. Use until the dose is stable.' },
        { key: 'rx8', label: '8-week (56-day) \u2014 1 pen + 1 refill', quantity: 1, unit: 'pen', refill: 1, days: 28,
          use: 'Clinically stable patients only. Each fill is one pen covering 4 weeks.' }
      ],
      doses: [
        { dose: '2.5 mg', mg: 2.5, use: 'Initiation',
          rx4: { drug: 'Zepbound kwikpen 2.5 mg/0.6 ml(10 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 2.5 mg SQ 4-week',
                 ptInstructions: 'Inject 2.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 2.5 mg/0.6 ml(10 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 2.5 mg SQ 8-week',
                 ptInstructions: 'Inject 2.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '5 mg', mg: 5, use: 'Titration',
          rx4: { drug: 'Zepbound kwikpen 5 mg/0.6 ml (20 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 5 mg SQ 4-week',
                 ptInstructions: 'Inject 5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 5 mg/0.6 ml (20 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 5 mg SQ 8-week',
                 ptInstructions: 'Inject 5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '7.5 mg', mg: 7.5, use: 'Titration',
          rx4: { drug: 'Zepbound kwikpen 7.5 mg/0.6 ml(30 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 7.5 mg SQ 4-week',
                 ptInstructions: 'Inject 7.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 7.5 mg/0.6 ml(30 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 7.5 mg SQ 8-week',
                 ptInstructions: 'Inject 7.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '10 mg', mg: 10, use: 'Advanced dose',
          rx4: { drug: 'Zepbound kwikpen 10 mg/0.6 ml (40 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 10 mg SQ 4-week',
                 ptInstructions: 'Inject 10 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 10 mg/0.6 ml (40 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 10 mg SQ 8-week',
                 ptInstructions: 'Inject 10 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '12.5 mg', mg: 12.5, use: 'Advanced dose',
          rx4: { drug: 'Zepbound kwikpen 12.5 mg/0.6 ml (50 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 12.5 mg SQ 4-week',
                 ptInstructions: 'Inject 12.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 12.5 mg/0.6 ml (50 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 12.5 mg SQ 8-week',
                 ptInstructions: 'Inject 12.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '15 mg', mg: 15, use: 'Maintenance / maximum dose',
          rx4: { drug: 'Zepbound kwikpen 15 mg/0.6 ml (60 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 15 mg SQ 4-week',
                 ptInstructions: 'Inject 15 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 15 mg/0.6 ml (60 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 15 mg SQ 8-week',
                 ptInstructions: 'Inject 15 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } }
      ],
      prescribingNotes: [
        'Sent electronically through Tebra as a STANDARD prescription. No insurance ' +
        'billing and no prior authorization.',
        'Patient completes enrolment, payment and shipping directly with LillyDirect.',
        'PEN NEEDLES ARE REQUIRED and are not included. The patient purchases them, ' +
        'and they can be added at LillyDirect checkout. Each injection uses a new needle.',
        'Zepbound is sold in three formats. KORB uses the KwikPen only.',
        'Rotate injection sites. Follow standard tirzepatide titration principles.',
        'Early refills or replacement shipments are decided by the pharmacy, not KORB.'
      ]
    },
    foundayo: {
      key: "foundayo",
      brandFamily: "Foundayo",
      presentationLabel: "Oral tablet",
      pharmacy: "lillydirect",
      altChannels: [
        "local_pharmacy"
      ],
      drug: "orforglipron",
      label: "Foundayo (orforglipron) — brand name oral",
      brandName: true,
      visibility: "provider",
      route: "oral",
      frequency: "once daily",
      presentation: "Oral tablet",
      orderVia: "Tebra Standard prescription",
      pharmacyAddress: "LillyDirect Self Pay Pharmacy Solutions, 4343 Equity Dr, Columbus, OH 43228-3842 \u00b7 (833) 432-4322",
      titration: "Start 0.8 mg once daily. Increase to 2.5 mg after at least 30 days, then 5.5 mg after at least 30 days. Further increases to 9, 14.5 or 17.2 mg at minimum 30-day intervals based on response and tolerability. Maximum 17.2 mg daily.",
      dispensing: [
        { key: "rx30", label: "30-day supply", quantity: 30, refill: 0, days: 30,
          use: "New prescription or any dose change. Use until the dose is stable." },
        { key: "rx60", label: "60-day supply", quantity: 60, refill: 0, days: 60,
          use: "Clinically stable patients only. Quantity 60, no refill." }
      ],
      doses: [
        {
      dose: "0.8 mg",
      mg: 0.8,
      use: "Starting dose",
      rx30: { drug: "Foundayo 0.8 mg tablet", label: "Foundayo 0.8 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx60: { drug: "Foundayo 0.8 mg tablet", label: "Foundayo 0.8 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "2.5 mg",
      mg: 2.5,
      use: "Titration",
      rx30: { drug: "Foundayo 2.5 mg tablet", label: "Foundayo 2.5 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx60: { drug: "Foundayo 2.5 mg tablet", label: "Foundayo 2.5 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "5.5 mg",
      mg: 5.5,
      use: "Titration",
      rx30: { drug: "Foundayo 5.5 mg tablet", label: "Foundayo 5.5 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx60: { drug: "Foundayo 5.5 mg tablet", label: "Foundayo 5.5 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "9 mg",
      mg: 9,
      use: "Advanced dose",
      rx30: { drug: "Foundayo 9 mg tablet", label: "Foundayo 9 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx60: { drug: "Foundayo 9 mg tablet", label: "Foundayo 9 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "14.5 mg",
      mg: 14.5,
      use: "Advanced dose",
      rx30: { drug: "Foundayo 14.5 mg tablet", label: "Foundayo 14.5 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx60: { drug: "Foundayo 14.5 mg tablet", label: "Foundayo 14.5 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "17.2 mg",
      mg: 17.2,
      use: "Maintenance / maximum dose",
      rx30: { drug: "Foundayo 17.2 mg tablet", label: "Foundayo 17.2 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx60: { drug: "Foundayo 17.2 mg tablet", label: "Foundayo 17.2 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        }
      ],
      prescribingNotes: [
        "Once-daily oral GLP-1. No injection, no pen needles.",
        "Dose selection and titration follow FDA-approved labeling."
      ]
    },
    wegovy_pen: {
      key: "wegovy_pen",
      brandFamily: "Wegovy",
      presentationLabel: "Pen",
      pharmacy: "novocare",
      altChannels: [
        "local_pharmacy"
      ],
      drug: "semaglutide",
      label: "Wegovy pen (semaglutide) — brand name",
      brandName: true,
      visibility: "provider",
      route: "subcutaneous",
      frequency: "once weekly",
      presentation: "Single-patient-use pen",
      orderVia: "Tebra Standard prescription",
      pharmacyAddress: "NovoCare Pharmacy, 2400 Sand Lake Road, Suite 200B, Orlando, FL 32809 \u00b7 (833) 949-5527",
      quantityNote: "Wegovy pens are SINGLE-DOSE, so 4 pens covers 4 weeks. This is the " +
        "opposite of the Zepbound KwikPen, where ONE pen holds all four weekly doses. " +
        "The Tebra entries confirm it: each Wegovy line is one strength at one volume, " +
        "with no total-content figure in brackets.",
      volumeNote: "Volume varies by dose. 0.25, 0.5 and 1 mg are 0.5 mL; 1.7, 2.4 and " +
        "7.2 mg are 0.75 mL. The 7.2 mg strength is listed as \"Wegovy hd\".",
      dispensing: [
        { key: "rx4", label: "4-week (28-day)", quantity: 4, refill: 0, days: 28,
          use: "New prescription or any dose change. Use until the dose is stable." },
        { key: "rx8", label: "8-week (56-day) \u2014 4 pens + 1 refill", quantity: 4, refill: 1, days: 28,
          use: "Clinically stable patients only." }
      ],
      doses: [
        {
      dose: "0.25 mg",
      mg: 0.25,
      use: "Initiation",
      rx4: { drug: "Wegovy 0.25 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.25 mg SQ 4-week",
             ptInstructions: "Inject 0.25 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx8: { drug: "Wegovy 0.25 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.25 mg SQ 8-week",
             ptInstructions: "Inject 0.25 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "0.5 mg",
      mg: 0.5,
      use: "Titration",
      rx4: { drug: "Wegovy 0.5 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.5 mg SQ 4-week",
             ptInstructions: "Inject 0.5 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx8: { drug: "Wegovy 0.5 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.5 mg SQ 8-week",
             ptInstructions: "Inject 0.5 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "1 mg",
      mg: 1,
      use: "Titration",
      rx4: { drug: "Wegovy 1 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 1 mg SQ 4-week",
             ptInstructions: "Inject 1 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx8: { drug: "Wegovy 1 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 1 mg SQ 8-week",
             ptInstructions: "Inject 1 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "1.7 mg",
      mg: 1.7,
      use: "Advanced dose",
      rx4: { drug: "Wegovy 1.7 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 1.7 mg SQ 4-week",
             ptInstructions: "Inject 1.7 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx8: { drug: "Wegovy 1.7 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 1.7 mg SQ 8-week",
             ptInstructions: "Inject 1.7 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "2.4 mg",
      mg: 2.4,
      use: "Maintenance dose",
      rx4: { drug: "Wegovy 2.4 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 2.4 mg SQ 4-week",
             ptInstructions: "Inject 2.4 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx8: { drug: "Wegovy 2.4 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 2.4 mg SQ 8-week",
             ptInstructions: "Inject 2.4 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "7.2 mg",
      mg: 7.2,
      use: "High dose — marketed as Wegovy HD",
      brandVariant: "Wegovy HD",
      rx4: { drug: "Wegovy hd 7.2 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 7.2 mg SQ 4-week",
             ptInstructions: "Inject 7.2 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx8: { drug: "Wegovy hd 7.2 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 7.2 mg SQ 8-week",
             ptInstructions: "Inject 7.2 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 1, days: 28 }
        }
      ],
      prescribingNotes: [
        "The 7.2 mg strength is marketed as Wegovy HD. Same molecule, higher strength.",
        "Dose escalation follows FDA-approved labeling and is individualized."
      ]
    },
    wegovy_pill: {
      key: 'wegovy_pill',
      brandFamily: 'Wegovy',
      presentationLabel: 'Oral tablet',
      pharmacy: 'novocare',
      altChannels: ['local_pharmacy'],
      drug: 'semaglutide',
      label: 'Wegovy oral tablet (semaglutide) \u2014 brand name',
      brandName: true,
      visibility: 'provider',
      route: 'oral',
      frequency: 'once daily',
      presentation: 'Oral tablet',
      orderVia: 'Tebra Standard prescription',
      pharmacyAddress: 'NovoCare Pharmacy, 2400 Sand Lake Road, Suite 200B, Orlando, FL 32809 \u00b7 (833) 949-5527',
      dispensing: [
        { key: 'rx30', label: '30-day supply', quantity: 30, refill: 0, days: 30,
          use: 'New prescription or any dose change. Use until the dose is stable.' },
        { key: 'rx60', label: '60-day supply', quantity: 60, refill: 0, days: 60,
          use: 'Clinically stable patients only. Quantity 60, no refill \u2014 not 30 with a refill.' }
      ],
      doses: [
        { dose: '1.5 mg', mg: 1.5, use: 'Initiation',
          rx30: { drug: 'Wegovy 1.5 mg tablet', label: 'Wegovy 1.5 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx60: { drug: 'Wegovy 1.5 mg tablet', label: 'Wegovy 1.5 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } },
        { dose: '4 mg', mg: 4, use: 'Early titration',
          rx30: { drug: 'Wegovy 4 mg tablet', label: 'Wegovy 4 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx60: { drug: 'Wegovy 4 mg tablet', label: 'Wegovy 4 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } },
        { dose: '9 mg', mg: 9, use: 'Intermediate dose',
          rx30: { drug: 'Wegovy 9 mg tablet', label: 'Wegovy 9 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx60: { drug: 'Wegovy 9 mg tablet', label: 'Wegovy 9 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } },
        { dose: '25 mg', mg: 25, use: 'Advanced titration',
          rx30: { drug: 'Wegovy 25 mg tablet', label: 'Wegovy 25 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx60: { drug: 'Wegovy 25 mg tablet', label: 'Wegovy 25 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } }
      ],
      prescribingNotes: [
        'Sent electronically through Tebra as a STANDARD prescription. No insurance ' +
        'billing and no prior authorization.',
        'Patient completes enrolment, payment and shipping directly with NovoCare.',
        'Oral semaglutide has lower and more variable bioavailability than injectable. ' +
        'Adherence to the empty-stomach and 30-minute rules is critical to efficacy.',
        'Weight loss response may be less pronounced than with injectable GLP-1 therapy.'
      ]
    }
  },

  /* ── PRICING & CHARGE CODES — PROVIDER ONLY ──────────────────────────────
     Never render in a patient-facing tool or document. Tirzepatide pricing is
     uniform across Premier, Belmar, Farmakeio and Greenwich and is keyed by
     dose tier, not by pharmacy. */
  pricing: {
    visibility: 'provider',
    includes: 'Telehealth visit, medication, shipping and supplies',
    billingSheet: 'PROCEDURE CODE CHEAT SHEET & BILLING ISSUES (Google Sheets)',

    tirzepatideTiers: {
      corporateDiscount: false,
      corporateNote: 'Tirzepatide has no corporate discount. The corp partner code ' +
                     'exists for attribution and tracking, not a lower price — it is ' +
                     'the same figure as the standard 4-week at every tier. Do not ' +
                     'present it to a corporate partner as a saving.',
      T1A: {
        tier: 'T1A',
        appliesTo: 'Low doses — 2 / 2.5 / 4 / 4.5 / 5 mg depending on pharmacy',
        corpPartner: { price: 349, code: 'FITTirzCP2' },
        fourWeek:    { price: 349, code: 'FITTirz002' },
        eightWeek:   { price: 599, code: 'FITTirzMT1' }
      },
      T2A: {
        tier: 'T2A',
        appliesTo: 'Mid doses — 6.5 / 7.5 / 8.5 / 9 / 10 mg depending on pharmacy',
        corpPartner: { price: 399, code: 'FITTirzCP3' },
        fourWeek:    { price: 399, code: 'FITTirz003' },
        eightWeek:   { price: 649, code: 'FITTirzMT2' }
      },
      T3A: {
        tier: 'T3A',
        appliesTo: 'High doses — 12.5 / 13.5 / 15 / 16 mg depending on pharmacy',
        corpPartner: { price: 449, code: 'FITTirzCP4' },
        fourWeek:    { price: 449, code: 'FITTirz004' },
        eightWeek:   { price: 799, code: 'FITTirzMT3' }
      },

      /* Belmar splits the 8-week into 4 weeks plus a refill, so it needs its own
         code to trigger the Ops action. Placeholder until Finance issues the real one. */
      belmarEightWeek: {
        code: 'PLACEHOLDER-TIRZ-8WK-BELMAR',
        isPlaceholder: true,
        pending: true,
        flag: 'BELMAR-TIRZ-8WK-CODE',
        note: 'Belmar-only 8-week tirzepatide code, confirmed in progress with ' +
              'VP Finance 2026-08-06. Replace the code string when issued — this is ' +
              'the only place it needs changing. Any tool rendering this must show ' +
              'it visibly as a placeholder, not as a usable code.',
        renderAs: 'Code pending — contact Operations before booking'
      }
    },

    semaglutide: {
      note: 'Flat pricing, not dose-tiered. Unlike tirzepatide, the price does not ' +
            'change as the patient titrates up.',

      /* CHARGE CODES ARE DELIBERATELY NOT STORED FOR THE 4-WEEK PROGRAM.
         Semaglutide has many codes. The price is largely the same across them,
         but each organization gets its own code so volume can be tracked, and
         some partners cover part or all of the cost. That set changes often and
         is not something a provider needs to hold. Operations supplies the
         correct code when the patient is scheduled.

         What a provider needs to know is the price band, and there are three.
         Do not add code fields back to this block. If a tool needs a code, it
         should say "Operations will provide" rather than guess. */
      chargeCodePolicy: {
        storeCodes: false,
        reason: 'Many codes per organization for tracking; partner contributions vary ' +
                'and change often.',
        providedBy: 'Operations, at the time the patient is scheduled',
        renderAs: 'Operations will provide the charge code at scheduling'
      },

      fourWeek: {
        discountAppliesTo: '4-week only. There is no discounted rate on the 8-week program.',
        bands: [
          { key: 'standard',   price: 269, code: 'FITSema001', label: 'Full price — website rate',
            note: 'KORB Get Fit Now Semaglutide Standard' },
          { key: 'discounted', price: 199, label: 'Discounted rate',
            eligibility: ['Corporate partners', 'Friends and family', 'Military'],
            uniform: true,
            note: 'One rate across all three categories. No per-partner variation.' },
          { key: 'other',      price: null, label: 'All others',
            note: 'Partner-funded, partially covered, and other arrangements. Highly ' +
                  'variable and changes often. Operations confirms the figure and the ' +
                  'code at scheduling. Do not quote a price from this tool.' }
        ]
      },

      eightWeek: {
        price: 349,
        label: 'All 8-week semaglutide, every patient, every pharmacy',
        discountedRate: null,
        discountNote: 'No discounted rate on 8-week. Corporate, friends and family, ' +
                      'and military patients all pay $349 for 8-week. The $199 rate ' +
                      'is 4-week only.',
        /* These two codes ARE retained, unlike the 4-week codes, because they are
           operationally load-bearing rather than a tracking label: the Belmar code
           is what triggers Ops to place the second half of the split fill. */
        codes: {
          standard: { code: 'FITSemaMNT', pharmacies: ['premier', 'farmakeio'],
                      note: 'Single fill, full 8-week supply shipped at once.' },
          belmar:   { code: 'FITSemaMBL', pharmacies: ['belmar'],
                      note: 'Split fill. This code is what triggers Ops to order the ' +
                            'second 4-week supply. Do not substitute the standard code ' +
                            'for a Belmar patient.' }
        }
      },

      /* Closed cohort. Internal reference only so billing questions can be answered.
         Never quote, publish, or offer this price. It is not available to anyone
         not already in it, and there are no new additions. */
      grandfathered: {
        exists: true,
        closedCohort: true,
        visibility: 'internal',
        detailsRedacted: true,
        note: 'A small closed cohort of original patients holds a legacy 8-week rate. ' +
              'It is closed \u2014 no new patients enter it, and it is never quoted or ' +
              'offered. Every other patient is $349 for 8-week. The rate itself and the ' +
              'organisations it came from are deliberately NOT stored in this file, ' +
              'because this file is published to GitHub Pages and served without ' +
              'authentication. Operations and Finance hold the detail. If you are ' +
              'looking at a legacy charge that does not match $349, ask Operations ' +
              'rather than assuming it is an error.'
      }
    },

    oral: {
      semaglutide90:  { price: 299, code: 'FITSemOrl90'  },
      semaglutide180: { price: 399, code: 'FITSemOrl180' },
      tirzepatide90:  { price: 499, code: 'FITTirOrl90'  },
      tirzepatide180: { price: 599, code: 'FITTirOrl180' }
    },

    brandName: {
      prescriptionVisitFee: 79,
      sameFeeBothPrograms: true,
      programChoiceNote:
        'The visit fee is identical for the short and long program. The choice is ' +
        'clinical, not financial: a new prescription or any dose change goes out as ' +
        'the short program (4-week injectable / 30-day oral) until the dose is stable. ' +
        'Once stable, the long program (8-week injectable / 60-day oral) is appropriate.',
      nonRefundable:
        'The visit fee is non-refundable once the visit has occurred or a prescription ' +
        'has been issued. Medication cost is not included.',
      billingCode: 'FITGLP1001',
      appliesTo: 'Every brand-name pathway \u2014 LillyDirect, NovoCare and the ' +
                 'patient\u2019s local pharmacy. One fee, one code, no variation by ' +
                 'product or channel.',

      /* SETTLED POLICY 2026-08-09 \u2014 DO NOT ADD MANUFACTURER PRICING HERE.
         Brand pricing is set by LillyDirect, NovoCare or the patient's local
         pharmacy, changes without notice, and KORB does not control it. Storing
         it means someone has to chase every change, and a stale figure on a
         provider's screen becomes a wrong price quoted to a patient. Checking
         price and coverage is the patient's responsibility, not KORB's. If a
         provider needs a figure, send the patient to the manufacturer site. */
      doNotStorePricing: true,
      doNotStoreReason:
        'Manufacturer pricing changes without notice and KORB does not control it. ' +
        'Storing it creates a maintenance burden and risks providers quoting ' +
        'incorrect pricing to patients. Price and coverage are the patient\u2019s ' +
        'responsibility.',
      note: 'Cash-pay only. The fee covers the clinical visit, prescription issuance ' +
            'and program administration. Medication cost, pharmacy processing, ' +
            'shipping and supplies are set by the external pharmacy and paid ' +
            'directly by the patient.'
    }
  },

  /* ── HELPERS ─────────────────────────────────────────────────────────── */

  // All products, optionally filtered by visibility, pharmacy or drug.
  listProducts: function (opts) {
    opts = opts || {};
    var out = [];
    for (var k in KORB_GLP1.products) {
      if (!KORB_GLP1.products.hasOwnProperty(k)) continue;
      var p = KORB_GLP1.products[k];
      if (opts.visibility && p.visibility !== opts.visibility) continue;
      if (opts.pharmacy) {
        var chans = [p.pharmacy].concat(p.altChannels || []);
        if (chans.indexOf(opts.pharmacy) === -1) continue;
      }
      if (opts.drug && p.drug !== opts.drug) continue;
      if (opts.excludeBrand && p.brandName) continue;
      out.push(p);
    }
    return out;
  },

  // Intentionally returns an empty array. Patients never see dose ladders, so no
  // product is marked 'patient'. Kept as a guard: if a future edit mislabels a
  // product, this starts returning it and selfCheck will say so.
  patientSafeProducts: function () {
    return KORB_GLP1.listProducts({ visibility: 'patient', excludeBrand: true });
  },

  // The only sanctioned way to render product information patient-side. Strips
  // the dose ladder, mg values, unit counts, pharmacy name, formulation and
  // pricing. Returns route, frequency and safety language only.
  patientView: function (productKey) {
    var p = KORB_GLP1.getProduct(productKey);
    if (!p) return null;
    if (p.brandName) return null; // brand-name products are never surfaced patient-side
    return {
      route: p.route,
      frequency: p.frequency,
      counseling: KORB_GLP1.clinical.counseling,
      sideEffects: KORB_GLP1.clinical.sideEffects,
      contraindications: KORB_GLP1.clinical.contraindications
    };
  },

  // Oral pricing is keyed to the charge code, so look it up rather than storing
  // the figure on every dose. One code, one price, one place to change it.
  priceForCode: function (code) {
    if (!code) return null;
    var o = KORB_GLP1.pricing.oral;
    for (var k in o) {
      if (o.hasOwnProperty(k) && o[k].code === code) return o[k].price;
    }
    return null;
  },

  getProduct: function (key) {
    return KORB_GLP1.products[key] || null;
  },

  getDose: function (productKey, doseLabel) {
    var p = KORB_GLP1.getProduct(productKey);
    if (!p || !p.doses) return null;
    for (var i = 0; i < p.doses.length; i++) {
      if (p.doses[i].dose === doseLabel) return p.doses[i];
    }
    return null;
  },

  // Price lookup for a tirzepatide dose by product + dose label.
  getTirzepatidePrice: function (productKey, doseLabel) {
    var d = KORB_GLP1.getDose(productKey, doseLabel);
    if (!d || !d.priceTier) return null;
    return KORB_GLP1.pricing.tirzepatideTiers[d.priceTier] || null;
  },

  /* ── PHARMACY SELECTION ──────────────────────────────────────────────────
     State routing gives the default. It is a default, not a lock. Providers
     override it routinely and for good reasons: a patient already established
     at another pharmacy, a patient who has moved, a preference for a particular
     added vitamin, or the provider's own preference.

     The tool should therefore pre-select from state and let the provider change
     it, but warn when the combination will not actually work. Call
     checkPharmacyForState() on every change and render the result. */
  pharmacySelection: {
    defaultFrom: 'patient state',
    overrideAllowed: true,
    overrideReasons: [
      'Patient is already established with another pharmacy and does not want to switch',
      'Patient has moved between states',
      'Patient prefers a formulation with a different added vitamin (B-12, B-6, L-carnitine)',
      'Provider preference'
    ],
    brandProgramsNote: 'LillyDirect and NovoCare are manufacturer programs and are not ' +
                       'state-routed. They never appear as a state default and are ' +
                       'selected deliberately or not at all.'
  },

  /* Returns { status, message }. Status is one of:
       'ok'      valid, and it is the default for this state
       'info'    valid, but an override away from the state default
       'warning' allowed, but outside the pharmacy's known list or otherwise
                 needs checking before the prescription goes out
       'error'   will not work; the pharmacy genuinely cannot serve this state

     Only a hard licensing exclusion produces 'error'. A state simply being
     absent from a pharmacy's list is a warning, not a block: the lists are
     preferences and Operations can verify a one-off. Blocking a valid choice
     is worse than asking the provider to confirm. */
  checkPharmacyForState: function (pharmacyKey, stateCode) {
    var ph = KORB_GLP1.pharmacies[pharmacyKey];
    var st = String(stateCode || '').toUpperCase();
    if (!ph) return { status: 'error', message: 'Unknown pharmacy.' };
    if (!st)  return { status: 'error', message: 'Select a state first.' };

    if (ph.brandOnly) {
      return { status: 'info', message: ph.name + ' is for BRAND-NAME products only and ' +
               'is not state-routed. Compounded products cannot be sent here.' };
    }

    if (ph.type === 'manufacturer-direct') {
      return { status: 'info', message: ph.name + ' is a manufacturer program and is ' +
               'not state-routed. Written as a Tebra Standard prescription, not Compound.' };
    }

    // Hard licensing exclusions are the only true blocks.
    var hard = (ph.hardExcludes || []).concat(ph.excludes || []);
    if (hard.indexOf(st) !== -1) {
      return { status: 'error', message: ph.name + ' cannot ship to ' + st + '. This is a ' +
               'licensing limit, not a preference \u2014 it cannot be overridden.' };
    }

    if (ph.status === 'legacy-continuity') {
      return { status: 'warning', message: ph.name + ' is not used for new GLP-1 patients. ' +
               (ph.overrideOnlyFor ? 'Select only for: ' + ph.overrideOnlyFor : '') };
    }

    if ((ph.shipsToUnconfirmed || []).indexOf(st) !== -1) {
      return { status: 'warning', message: ph.name + ' shipping to ' + st + ' is not ' +
               'confirmed. Verify with Operations before sending the prescription.' };
    }

    // Ships there, but the program discourages it outside its preferred states.
    if (ph.discouragedOutsidePreferred && (ph.preferredStates || []).indexOf(st) === -1) {
      return { status: 'warning', message: ph.name + ' can ship to ' + st + ', but is ' +
               'discouraged outside ' + (ph.preferredStates || []).join('/') + '. ' +
               ph.discouragedReason };
    }

    var def = KORB_GLP1.states.routeTo(st);
    if (def && def.pharmacy !== pharmacyKey) {
      var defName = (KORB_GLP1.pharmacies[def.pharmacy] || {}).name || def.pharmacy;
      return { status: 'info', message: ph.name + ' can ship to ' + st + ', but the ' +
               'default for ' + st + ' is ' + defName + '. Continue if this is intentional.' };
    }

    return { status: 'ok', message: ph.name + ' is the default pharmacy for ' + st + '.' };
  },

  // Every pharmacy with its compatibility verdict for a state. Feeds the picker
  // directly so unusable options can be disabled or greyed rather than hidden.
  pharmacyOptionsForState: function (stateCode) {
    var out = [];
    for (var k in KORB_GLP1.pharmacies) {
      if (!KORB_GLP1.pharmacies.hasOwnProperty(k)) continue;
      var check = KORB_GLP1.checkPharmacyForState(k, stateCode);
      out.push({
        key: k,
        name: KORB_GLP1.pharmacies[k].name,
        status: check.status,
        message: check.message,
        selectable: check.status !== 'error'
      });
    }
    return out;
  },

  // Structural integrity check. Run in the console after any edit.
  selfCheck: function () {
    var problems = [];
    var flagIds = KORB_GLP1.needsConfirmation.map(function (f) { return f.id; });

    for (var k in KORB_GLP1.products) {
      if (!KORB_GLP1.products.hasOwnProperty(k)) continue;
      var p = KORB_GLP1.products[k];

      if (p.key !== k) problems.push(k + ': key field does not match its object key');
      if (!KORB_GLP1.pharmacies[p.pharmacy]) problems.push(k + ': unknown pharmacy "' + p.pharmacy + '"');
      if (['patient', 'provider'].indexOf(p.visibility) === -1) problems.push(k + ': invalid visibility');
      if (!p.doses || !p.doses.length) problems.push(k + ': no doses');

      (p.doses || []).forEach(function (d) {
        if (d.flag && flagIds.indexOf(d.flag) === -1) problems.push(k + ' ' + d.dose + ': flag "' + d.flag + '" not in needsConfirmation');
        if (d.priceTier && !KORB_GLP1.pricing.tirzepatideTiers[d.priceTier]) problems.push(k + ' ' + d.dose + ': unknown price tier');
        ['supply4', 'supply8'].forEach(function (s) {
          if (!d[s]) return;
          if (d[s].flag && flagIds.indexOf(d[s].flag) === -1) problems.push(k + ' ' + d.dose + ' ' + s + ': unknown flag');
          if (typeof d[s].quantity === 'undefined') problems.push(k + ' ' + d.dose + ' ' + s + ': missing quantity');
          if (typeof d[s].refill === 'undefined') problems.push(k + ' ' + d.dose + ' ' + s + ': missing refill');
          if (typeof d[s].days === 'undefined') problems.push(k + ' ' + d.dose + ' ' + s + ': missing days');
        });
      });
    }

    // Every KORB active state must resolve to a pharmacy that actually ships there.
    var warnings = [];
    KORB_GLP1.states.korbActive.forEach(function (st) {
      var r = KORB_GLP1.states.routeTo(st);
      if (!r) { problems.push('state ' + st + ': no routing rule'); return; }
      var ph = KORB_GLP1.pharmacies[r.pharmacy];
      if (!ph) { problems.push('state ' + st + ': routes to unknown pharmacy'); return; }
      if (ph.status === 'legacy-continuity') {
        problems.push('state ' + st + ': routes to ' + ph.name + ' which is legacy-continuity and takes no new starts');
      }
      var hardEx = (ph.hardExcludes || []).concat(ph.excludes || []);
      if (hardEx.indexOf(st) !== -1) {
        problems.push('state ' + st + ': routes to ' + ph.name + ' which hard-excludes ' + st);
      } else if (ph.shipsTo.length && ph.shipsTo.indexOf(st) === -1) {
        warnings.push('state ' + st + ': default pharmacy ' + ph.name + ' does not list ' + st + ' (preference list, not a block)');
      }
      if ((ph.shipsToUnconfirmed || []).indexOf(st) !== -1) {
        warnings.push('state ' + st + ': routes to ' + ph.name + ' on an UNCONFIRMED ship-to');
      }
      if (r.provisional) {
        warnings.push('state ' + st + ': routing rule is provisional' + (r.flag ? ' (' + r.flag + ')' : ''));
      }
    });

    // Legacy products should never be reachable from a routing rule.
    KORB_GLP1.states.routing.forEach(function (r) {
      var ph = KORB_GLP1.pharmacies[r.pharmacy];
      if (ph && ph.status === 'legacy-continuity') {
        problems.push('routing rule for ' + r.states.join('/') + ' points at legacy pharmacy ' + ph.name);
      }
    });

    if (warnings.length) {
      console.warn('KORB_GLP1.selfCheck warnings (' + warnings.length + '):');
      warnings.forEach(function (w) { console.warn('  ! ' + w); });
    }

    if (problems.length) {
      console.warn('KORB_GLP1.selfCheck found ' + problems.length + ' problem(s):');
      problems.forEach(function (p) { console.warn('  - ' + p); });
    } else {
      console.log('KORB_GLP1.selfCheck passed.');
    }
    console.log('Open items in needsConfirmation: ' + KORB_GLP1.needsConfirmation.length);
    return problems;
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_GLP1; }
