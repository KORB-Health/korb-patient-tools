/*
   KORB HEALTH — SHARED PHARMACY & STATE LAYER

   One source of truth for which pharmacy ships where, which is preferred where,
   and what each one is used for. Extracted from korb-glp1-data.js on 2026-09-11
   because the same facts were being restated in korb-dosing-data.js, the Add-On
   Clinical Reference and the provider tools, and they had drifted:

     - The Add-On Clinical Reference published FarmaKeio's PREFERRED list as its
       SHIP-TO list, wrongly excluding AZ, FL, NV and TX.
     - The Women's Health Clinical Reference said Belmar is not used for women's
       testosterone. It is, everywhere except Texas.

   PREFERRED IS NOT THE SAME AS SHIPS-TO. Preferred states are a GLP-1 routing
   default and are overridable. Ships-to is licensure and is not. Do not collapse
   the two. Confirmed with Don Stevenson 2026-09-10.

   2026-09-11 — GREENWICH CHANGE. Two separate things happened on the same day
   and they should not be collapsed into one:

     1. Greenwich stopped shipping to AR, CA, IN, NH and WA. That is licensure,
        it is not overridable, and because Premier cannot ship to any of those
        five either, Functional Health & Longevity is now closed in all five.
        The FH&L state lists live in korb-dosing-data.js.
     2. Greenwich GLP-1 is retired outright, in every state. Not California
        only. All tirzepatide moves to Belmar. Greenwich is a peptide pharmacy
        now and nothing else.

   VERSION: 1.1   CREATED: 2026-09-11   UPDATED: 2026-09-11
   OWNER: Director of Clinical Operations
*/

var KORB_PHARMACIES = {
  meta: {
    version: "1.1",
    created: "2026-09-11",
    owner: "Director of Clinical Operations",
    derivedFrom: "korb-glp1-data.js v2.15",
    note: "Products live in the per-program files. This file holds pharmacies and states only."
  },

  pharmacies: {
    "empower": {
      "key": "empower",
      "name": "Empower Pharmacy",
      "type": "compounding",
      "visibility": "provider",
      "status": "active",
      "preferredStates": ["CA"],
      "shipsTo": ["CA"],
      "hardExcludes": [],
      "shipsToNote": "California only, and used for one thing: commercial testosterone for male TRT. Confirmed with Don Stevenson 2026-09-10.",
      "billing": "Bill to office, ship to patient",
      "notes": [
        "Supplies are itemised on the Tebra favorite: alcohol pads, syringes, draw-up and injecting needles, one set per injection in the fill.",
        "Added to this file 2026-09-11. Empower was named in the Men's Health Clinical Reference and hardcoded in the TRT Provider Tool, but was absent from every data file."
      ]
    },
  "premier": {
    "key": "premier",
    "name": "Premier Pharmacy",
    "color": "#1565C0",
    "type": "compounding",
    "visibility": "provider",
    "status": "active",
    "preferredStates": [
      "TX",
      "NV",
      "AZ",
      "FL",
      "IL",
      "MD",
      "MO",
      "NJ",
      "NY",
      "OH"
    ],
    "shipsTo": [
      "AZ",
      "CO",
      "CT",
      "DC",
      "DE",
      "FL",
      "GA",
      "IL",
      "KS",
      "KY",
      "LA",
      "MD",
      "ME",
      "MI",
      "MO",
      "MS",
      "MT",
      "NC",
      "ND",
      "NE",
      "NJ",
      "NM",
      "NV",
      "NY",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SD",
      "TN",
      "TX",
      "UT",
      "VA",
      "VT",
      "WI",
      "WV",
      "WY"
    ],
    "hardExcludes": [
      "AK",
      "AL",
      "AR",
      "CA",
      "HI",
      "IA",
      "ID",
      "IN",
      "MA",
      "MN",
      "NH",
      "SC",
      "WA"
    ],
    "shipsToNote": "Licensed shipping list. Premier cannot ship anywhere outside it, including California. Confirmed 2026-08-09.",
    "footprintIsSettled": "SETTLED — do not soften this back to a preference. Two different things were being confused: the ROUTING DEFAULT for a state is overridable (a provider may choose Premier where Farmakeio is default, or vice versa), but Premier’s LICENSED FOOTPRINT is not. States outside shipsTo are hard exclusions.",
    "address": "Premier Pharmacy, 2425 Babcock Rd, Ste 108A, San Antonio, TX 78229",
    "orderVia": "Tebra Compound",
    "billing": "Bill to KORB Health Group, ship to patient",
    "notes": [
      "All Premier programs offer a 4-week and an 8-week option — semaglutide, semaglutide with glycine, and tirzepatide alike.",
      "All Premier compounds carry a 90-day BUD as of 2026-08. There is no longer a difference between the glycine and non-glycine products on this.",
      "8-week programs ship the full eight weeks of medication and supplies in a single initial shipment. No refill and no second shipment.",
      "Vials remain 28 days from first use regardless of BUD. On lower doses this produces overage. Counsel the patient to discard at 28 days."
    ]
  },
  "belmar": {
    "key": "belmar",
    "name": "Belmar Pharmacy",
    "color": "#6A1B9A",
    "type": "compounding",
    "visibility": "provider",
    "status": "active",
    "preferredStates": [
      "CA"
    ],
    "shipsTo": [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "DC",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY"
    ],
    "hardExcludes": [],
    "shipsToNote": "Ships to all 50 states and DC. Preferred for California only.",
    "discouragedOutsidePreferred": true,
    "discouragedReason": "Belmar is the California pharmacy. Patients are routed here for California and kept on the other compounding pharmacies elsewhere. Selecting Belmar outside California is allowed but should be a deliberate exception.",
    "address": "Belmar Pharmacy — ARIZONA location, 12012 N 111th Ave, Youngtown, AZ 85363-1339",
    "addressWarning": "Belmar has several locations across the US. KORB uses the ARIZONA address. Confirm the Arizona address is the one selected in Tebra before sending — another Belmar location will be wrong.",
    "orderVia": "Tebra Compound",
    "billing": "Bill to KORB Health Group, ship to patient",
    "notes": [
      "Carries both semaglutide and tirzepatide. All new California starts go here regardless of drug.",
      "SINGLE FILL as of 2026-09-05. Belmar now ships the full 8-week supply at one time for both semaglutide and tirzepatide. The split fill is retired. Belmar no longer differs from the other pharmacies on fill structure.",
      "Belmar 8-week now bills on the standard 8-week charge code. The Belmar-specific codes are retired — they existed only to trigger the second fill, and there is no second fill.",
      "Semaglutide 2.5 mg / 1 mg / ml is used for 1.7 and 2.4 mg doses; 1 mg / 1 mg / ml for 0.25, 0.5 and 1.0 mg doses.",
      "SYRINGES GO IN THE DIRECTIONS, NOT PHARMACY INSTRUCTIONS. Belmar reads the patient directions field. If the insulin-syringe note is moved to Pharmacy Instructions they may not see it and will not ship syringes. Keep \"(Include one pack of insulin syringes)\" at the end of every Belmar sig."
    ],
    "vialConstraints": {
      "punctureDays": 28,
      "maxDosesPerVial": 4,
      "doseDays": [
        0,
        7,
        14,
        21
      ],
      "rule": "single-vial volume divided by weekly volume must be <= 4",
      "whyNotFive": "A fifth dose from the same vial lands on day 28 itself, which is the limit rather than inside it.",
      "sizingPrinciple": "Do not ship a vial with meaningful leftover. Make a fifth dose impossible, not merely discouraged.",
      "bud": {
        "days": 90,
        "from": "compound date, NOT ship date",
        "lastDoseDay": 49,
        "maxCompoundToShipDays": 41,
        "note": "Reference only. Deliberately NOT stated on the order or in the sig - removed 2026-09-05, the pharmacy manages its own BUD."
      },
      "dosesPerVial": "Four doses per vial, never five. A fifth dose would fall on day 28 itself, and the 28-day in-use limit is read as a limit rather than a day inside the window. See acceptedLimitations BELMAR-DAY28-DOSE-CEILING."
    },
    "fillStructure": {
      "fourWeek": "Single fill, 28 days, no refill.",
      "eightWeek": "Single fill, 56 days, no refill.",
      "changedOn": "2026-09-05",
      "note": "Belmar previously split the 8-week program into two 4-week fills. It no longer does. No pharmacy on the GLP-1 program splits a fill."
    },
    "splitFillRetired": {
      "retired": true,
      "retiredOn": "2026-09-05",
      "historicalOnly": true,
      "doNotApplyToNewOrders": true,
      "appliedTo": [
        "8-week semaglutide",
        "8-week tirzepatide"
      ],
      "structure": "4-week supply with 1 refill, second fill placed manually by Operations",
      "trigger": "A Belmar-specific 8-week charge code flagged the order for Ops.",
      "opsTriggeredAt": "Week 3",
      "whyRetained": "A patient dispensed under this structure is still working through it. Ops and Finance need the old shape to answer questions about those orders. It is not a live workflow."
    },
    "transition": {
      "active": true,
      "decision": "Patients already dispensed under the split fill finish that 8-week cycle on the old structure. They convert to the single fill at their next 8-week order, not mid-cycle.",
      "decidedBy": "Don",
      "decidedOn": "2026-09-05",
      "appliesTo": "California Belmar patients on the 8-week program",
      "newStarts": "Any 8-week order placed on or after 2026-09-05 is a single fill.",
      "opsAction": "Operations still owes a second fill to every patient whose first 4-week Belmar fill went out before 2026-09-05. Do not cancel those second fills. Stop placing new ones once the backlog clears.",
      "providerScript": "A California patient starting the 8-week program now receives their full eight weeks in one shipment. A patient who started before the change still has a second shipment coming and does not need to request it.",
      "endsWhen": "The last pre-change second fill has shipped. Operations closes this block and sets active to false."
    }
  },
  "farmakeio": {
    "key": "farmakeio",
    "name": "Farmakeio Pharmacy",
    "abbrev": "FKO",
    "color": "#EF6C00",
    "type": "compounding",
    "visibility": "provider",
    "status": "active",
    "preferredStates": [
      "AK",
      "AL",
      "AR",
      "CO",
      "CT",
      "DC",
      "DE",
      "GA",
      "HI",
      "IA",
      "ID",
      "IN",
      "KS",
      "KY",
      "LA",
      "MA",
      "ME",
      "MI",
      "MN",
      "MS",
      "MT",
      "NC",
      "ND",
      "NE",
      "NH",
      "NM",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "UT",
      "VA",
      "VT",
      "WA",
      "WI",
      "WV",
      "WY"
    ],
    "shipsTo": [
      "AK",
      "AL",
      "AR",
      "AZ",
      "CO",
      "CT",
      "DC",
      "DE",
      "FL",
      "GA",
      "HI",
      "IA",
      "ID",
      "IL",
      "IN",
      "KS",
      "KY",
      "LA",
      "MA",
      "MD",
      "ME",
      "MI",
      "MN",
      "MO",
      "MS",
      "MT",
      "NC",
      "ND",
      "NE",
      "NH",
      "NJ",
      "NM",
      "NV",
      "NY",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VA",
      "VT",
      "WA",
      "WI",
      "WV",
      "WY"
    ],
    "hardExcludes": [
      "CA"
    ],
    "shipsToNote": "Ships to 49 states plus DC. California is the single state Farmakeio will not ship to, and that cannot be overridden. Preferred everywhere except CA, TX, FL, AZ and NV.",
    "address": "Farmakeio Pharmacy, 1736 N Greenville Ave, Richardson, TX 75081",
    "orderVia": "Tebra Compound",
    "billing": "Bill to KORB Health Group, ship to patient",
    "notes": [
      "Products ship as a HOME KIT that includes syringes and supplies.",
      "Compounded with pyridoxine (B-6) for nausea prevention, not B-12.",
      "Semaglutide is a single concentration (2.5 mg/25 mg per mL). Dose is set by volume; the only variable on the Rx is how many mL.",
      "Tirzepatide is a single concentration (18 mg/25 mg per mL)."
    ]
  },
  "greenwich": {
    "key": "greenwich",
    "name": "Greenwich Pharmacy",
    "abbrev": "GWP",
    "color": "#2E7D32",
    "type": "compounding",
    "visibility": "provider",
    "status": "peptides-only",
    "statusNote": "NOT USED FOR GLP-1 AT ALL as of 2026-09-11. Greenwich tirzepatide is retired in every state, not only California — all tirzepatide moves to Belmar. Greenwich is a Functional Health & Longevity peptide pharmacy only. Do not route any GLP-1 patient here, new or established, and do not offer it as a GLP-1 option anywhere.",
    "glp1Retired": {
      "retired": true,
      "retiredOn": "2026-09-11",
      "movesTo": "belmar",
      "decidedBy": "Don Stevenson",
      "reason": "Greenwich stopped shipping to California, which removed the last reason to keep a second tirzepatide route open. Rather than carve California out, the whole Greenwich GLP-1 line is retired and every tirzepatide patient moves to Belmar.",
      "opsAction": "Every established Greenwich tirzepatide patient is moved to Belmar at their next fill, California first. Do not place another Greenwich GLP-1 order."
    },
    "preferredStates": [],
    "shipsTo": [
      "AL",
      "AK",
      "AZ",
      "CO",
      "CT",
      "DE",
      "DC",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WV",
      "WI",
      "WY"
    ],
    "hardExcludes": [
      "AR",
      "CA",
      "IN",
      "NH",
      "WA"
    ],
    "shipsToNote": "Ships to 45 states and DC as of 2026-09-11. Greenwich stopped shipping to Arkansas, California, Indiana, New Hampshire and Washington. Premier's licensed footprint excludes all five as well, so those states have no peptide source and Functional Health & Longevity is closed there. Confirmed with Don Stevenson 2026-09-11.",
    "address": "Greenwich Rx, 9733 FM 2920 Rd, Suite 100, Tomball, TX 77375",
    "orderVia": "Tebra Compound",
    "orderViaNote": "Moved from MDToolbox to Tebra Compound. MDToolbox is being turned off at the end of August 2026.",
    "billing": "Bill to KORB Health Group, ship to patient",
    "bud": "90 days",
    "notes": [
      "Ships FedEx next-day only, Monday through Thursday. Patient should receive within three business days of order.",
      "The patient does not receive a shipping confirmation from the pharmacy.",
      "Ships in disposable coolers with ice packs in summer, Kangaroo Pouch Mailers the rest of the year.",
      "Will NOT accept a do-not-fill date.",
      "B-12 only. No other added formulations.",
      "Patient is automatically shipped a 10-pack of 50-unit insulin syringes.",
      "Ordering 4 mL on the prescription ships two 2 mL vials.",
      "Dose is set by concentration, not volume.",
      "HISTORICAL — GLP-1 only, and GLP-1 at Greenwich ended 2026-09-11: every Greenwich GLP-1 dose was exactly 50 units in a 50-unit syringe, and the 100-UNIT SYRINGE callout used for Functional Health peptides was deliberately kept off those sigs. Kept for anyone reading an order placed before the retirement. It says nothing about peptide sigs, which follow the FH&L syringe rule.",
      "AR, CA, IN, NH and WA: do not send anything here, peptide or otherwise. Greenwich stopped shipping to these five states on 2026-09-11."
    ]
  },
  "lillydirect": {
    "key": "lillydirect",
    "name": "LillyDirect",
    "color": "#C62828",
    "type": "manufacturer-direct",
    "visibility": "provider",
    "status": "active",
    "preferredStates": [],
    "shipsTo": [],
    "hardExcludes": [],
    "orderVia": "Tebra Standard prescription (NOT Tebra Compound)",
    "billing": "Patient pays the manufacturer program directly. See brandRules.",
    "notes": [
      "Cash-pay, direct-to-patient. Dispensing, payment, shipping and delivery are managed by the manufacturer. KORB does not manage fulfillment.",
      "Carries Zepbound KwikPen and Foundayo (orforglipron) oral tablets.",
      "Not a KORB compounding pharmacy. Provider-side only."
    ]
  },
  "novocare": {
    "key": "novocare",
    "name": "NovoCare",
    "color": "#00695C",
    "type": "manufacturer-direct",
    "visibility": "provider",
    "status": "active",
    "preferredStates": [],
    "shipsTo": [],
    "hardExcludes": [],
    "orderVia": "Tebra Standard prescription (NOT Tebra Compound)",
    "billing": "Patient pays the manufacturer program directly. See brandRules.",
    "notes": [
      "Cash-pay manufacturer program. KORB does not manage fulfillment.",
      "Carries the Wegovy pen and the Wegovy oral tablet.",
      "Not a KORB compounding pharmacy. Provider-side only."
    ]
  },
  "local_pharmacy": {
    "key": "local_pharmacy",
    "name": "Patient’s local pharmacy",
    "color": "#455A64",
    "type": "retail",
    "visibility": "provider",
    "status": "active",
    "brandOnly": true,
    "preferredStates": [],
    "shipsTo": [],
    "hardExcludes": [],
    "orderVia": "Tebra Standard prescription (NOT Tebra Compound)",
    "billing": "Patient pays the pharmacy directly. See brandRules.",
    "notes": [
      "BRAND-NAME PRODUCTS ONLY. Compounded products cannot be sent here.",
      "Available on patient request, under the same brand rules.",
      "KORB will not re-send a prescription between pharmacies to find a lower price. The patient compares pricing before asking for the prescription."
    ]
  }
},

  states: {
  "korbActive": [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY"
  ],
  "routing": [
    {
      "states": [
        "TX",
        "NV",
        "AZ",
        "FL",
        "IL",
        "MD",
        "MO",
        "NJ",
        "NY",
        "OH"
      ],
      "pharmacy": "premier",
      "basis": "preferred pharmacy"
    },
    {
      "states": [
        "CA"
      ],
      "pharmacy": "belmar",
      "basis": "sole California pharmacy — semaglutide and tirzepatide",
      "note": "Belmar is the only California option. Farmakeio cannot ship to CA at all, Premier cannot either, and Greenwich stopped shipping to CA on 2026-09-11. Every California GLP-1 goes to Belmar, including tirzepatide patients moving off Greenwich."
    },
    {
      "states": [
        "*"
      ],
      "pharmacy": "farmakeio",
      "basis": "all other new patients"
    }
  ]
},

  /* ---- helpers ---- */

  shipsTo: function (pharmacyKey, state) {
    var p = this.pharmacies[pharmacyKey];
    if (!p) return false;
    if (p.hardExcludes && p.hardExcludes.indexOf(state) > -1) return false;
    return !p.shipsTo || p.shipsTo.indexOf(state) > -1;
  },

  isPreferred: function (pharmacyKey, state) {
    var p = this.pharmacies[pharmacyKey];
    return !!(p && p.preferredStates && p.preferredStates.indexOf(state) > -1);
  },

  /* Every pharmacy that can legally ship to a state, preferred ones first. */
  optionsForState: function (state) {
    var self = this, out = [];
    Object.keys(this.pharmacies).forEach(function (k) {
      if (self.shipsTo(k, state)) {
        out.push({ key: k, name: self.pharmacies[k].name, preferred: self.isPreferred(k, state) });
      }
    });
    return out.sort(function (a, b) { return (b.preferred ? 1 : 0) - (a.preferred ? 1 : 0); });
  },

  selfCheck: function () {
    var problems = [], self = this;
    Object.keys(this.pharmacies).forEach(function (k) {
      var p = self.pharmacies[k];
      if (!p.name) problems.push(k + ": no name");
      /* Brand channels (LillyDirect, NovoCare) and the retail route have no
         ship-to list of their own - the manufacturer or the patient's own
         pharmacy handles it. Only compounding pharmacies must declare one. */
      if (p.type === "compounding" && (!p.shipsTo || !p.shipsTo.length)) {
        problems.push(k + ": compounding pharmacy with empty shipsTo");
      }
      (p.hardExcludes || []).forEach(function (s) {
        if (p.shipsTo && p.shipsTo.indexOf(s) > -1) {
          problems.push(k + ": " + s + " is in both shipsTo and hardExcludes");
        }
      });
      (p.preferredStates || []).forEach(function (s) {
        if (!self.shipsTo(k, s)) problems.push(k + ": preferred in " + s + " but cannot ship there");
      });
    });
    if (problems.length) { console.warn("KORB_PHARMACIES.selfCheck found " + problems.length + " problem(s):");
      problems.forEach(function (p) { console.warn("  - " + p); }); }
    else console.log("KORB_PHARMACIES.selfCheck passed.");
    return problems;
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PHARMACIES; }
