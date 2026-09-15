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

   2026-09-12 — GREENWICH ROSTER LOADED FROM THE PHARMACY'S OWN NOTICE.
   Greenwich's customer letter of 11 Sept 2026 (Kelli Gay, Director of
   Strategic Account Support) is the source. Greenwich stopped relying on
   central-fill arrangements with affiliated pharmacies after Board of
   Pharmacy guidance in Texas and other states, so from 11:59 pm on 11 Sept
   it dispenses ONLY into the 23 states where it is itself licensed:

     AK AZ CO FL HI IA ID KS MA MD ME MO MT NE NY OH OR PA RI TX UT WI WY

   footprint and footprintExcludes below are now that list exactly. Applications are
   pending in the uncovered states and Greenwich expects to substantially
   resume within 30 to 60 days.

   WHAT THIS ACTUALLY COSTS KORB. Premier fills peptides across its own
   38-state footprint, so most of what Greenwich dropped is covered:

     1. NEWLY WITHOUT A PEPTIDE PHARMACY — AR, CA, IN, NH, WA. Five states,
        not eight. Premier is not licensed in any of them either. These are
        the only states this change closed, and the only ones on the restore
        clock. Recorded as a PAUSE: documents say temporarily unavailable
        with the restore window, never discontinued.
     2. ALSO LOST GREENWICH BUT ALREADY CLOSED — AL, MN, SC. Every one was
        out of the peptide program before this happened (AL and SC as
        compliance exclusions, MN from Phase One). The prior reason governs,
        and none of the three reopens when Greenwich comes back, so none is
        on the restore clock. Named for the record only.
     3. SINGLE-SOURCE GREENWICH — AK, HI, IA, ID, MA. Greenwich ships here
        and Premier cannot, so there is no backup. IA and ID are the two
        that are open and taking patients and carry a provider-facing
        caution. AK, HI and MA are already closed for other reasons.

   The FH&L closed list is unchanged at 18 states and matches the peptide
   program notice Ops sent on 11 Sept. GLP-1 is untouched: all 50 states and
   DC are still served by Premier, Belmar and FarmaKeio.

   WHAT CHANGED IN 1.4  (2026-09-15) — open item 2, the pharmacy x program reshape

     The flat shipsTo could hold one answer per pharmacy, and Greenwich has two:
     it ships peptides and it does not ship GLP-1 at all. That is why this file
     and korb-glp1-data.js disagreed for four days while both were internally
     consistent.

     A pharmacy now carries a LICENSURE FOOTPRINT, which is one fact and does not
     vary by program, plus a `programs` block giving each program a status and,
     where it genuinely differs, a narrowing:

       footprint          where the pharmacy may ship at all
       footprintExcludes  permanent exclusions from that licence
       programs.<x>.status    active | retired | not-offered
       programs.<x>.excludes  states this PROGRAM does not reach, inside the
                              footprint. Rare. Use only for a real per-program
                              difference, never to restate the footprint.

     The alternative shape, a full state list per program, was rejected: it would
     write Belmar's 51 states four times inside the one file whose purpose is
     that a fact appears once.

     Effective coverage is COMPUTED, never stored: statesFor(pharmacy, program)
     applies the three gates in order. Nothing can drift from the footprint it is
     derived from because nothing is copied from it.

     Every list was verified to reproduce the old data exactly before this was
     written: 12 active pharmacy x program combinations, all matching.

     Greenwich is an ordinary pharmacy in this shape, with footprint 23 and GLP-1
     retired. A first attempt modelled its 23 states as a commercial PAUSE
     narrowing a 46-state footprint. That was wrong and the header above says so:
     Greenwich ended its central-fill arrangements with affiliated pharmacies and
     now dispenses only where it is ITSELF licensed. The 46 was reach through
     affiliates, never Greenwich's own licence, and it survives only as a stale
     copy in korb-glp1-data.js that open item 3 removes.

     New: crossCheck(), which compares this file against the program files that
     still carry their own copy. selfCheck() validates this file against itself
     and could never have caught the Greenwich split. Run `node check-pharmacies.js`.

   VERSION: 1.4   CREATED: 2026-09-11   UPDATED: 2026-09-15
   OWNER: Director of Clinical Operations
*/

var KORB_PHARMACIES = {
  meta: {
    version: "1.4",
    created: "2026-09-11",
    updated: "2026-09-15",
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
      "billing": "Bill to office, ship to patient",
      "footprint": [
        "CA"
      ],
      "footprintExcludes": [],
      "footprintNote": "California only, and used for one thing: commercial testosterone for male TRT. Confirmed with Don Stevenson 2026-09-10.",
      "preferredStates": [
        "CA"
      ],
      "programs": {
        "glp1": {
          "status": "not-offered"
        },
        "peptides": {
          "status": "not-offered"
        },
        "addons": {
          "status": "not-offered"
        },
        "trt": {
          "status": "active",
          "note": "Commercial testosterone for male TRT. No TRT data file exists yet — see open item 6."
        },
        "womens": {
          "status": "not-offered"
        }
      },
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
      "orderVia": "Tebra Compound",
      "billing": "Bill to KORB Health Group, ship to patient",
      "footprint": [
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
      "footprintExcludes": [
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
      "footprintNote": "Licensed shipping list. Premier cannot ship anywhere outside it, including California. Confirmed 2026-08-09.",
      "footprintIsSettled": "SETTLED — do not soften this back to a preference. Two different things were being confused: the ROUTING DEFAULT for a state is overridable (a provider may choose Premier where FarmaKeio is default, or vice versa), but Premier’s LICENSED FOOTPRINT is not. States outside shipsTo are hard exclusions.",
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
      "programs": {
        "glp1": {
          "status": "active"
        },
        "peptides": {
          "status": "active"
        },
        "addons": {
          "status": "active"
        },
        "trt": {
          "status": "not-offered"
        },
        "womens": {
          "status": "not-offered"
        }
      },
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
      "orderVia": "Tebra Compound",
      "billing": "Bill to KORB Health Group, ship to patient",
      "footprint": [
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
      "footprintExcludes": [],
      "footprintNote": "Ships to all 50 states and DC. Preferred for California only.",
      "preferredStates": [
        "CA"
      ],
      "programs": {
        "glp1": {
          "status": "active"
        },
        "peptides": {
          "status": "not-offered"
        },
        "addons": {
          "status": "active"
        },
        "trt": {
          "status": "not-offered"
        },
        "womens": {
          "status": "not-offered"
        }
      },
      "notes": [
        "Carries both semaglutide and tirzepatide. All new California starts go here regardless of drug.",
        "SINGLE FILL as of 2026-09-05. Belmar now ships the full 8-week supply at one time for both semaglutide and tirzepatide. The split fill is retired. Belmar no longer differs from the other pharmacies on fill structure.",
        "Belmar 8-week now bills on the standard 8-week charge code. The Belmar-specific codes are retired — they existed only to trigger the second fill, and there is no second fill.",
        "Semaglutide 2.5 mg / 1 mg / ml is used for 1.7 and 2.4 mg doses; 1 mg / 1 mg / ml for 0.25, 0.5 and 1.0 mg doses.",
        "SYRINGES GO IN THE DIRECTIONS, NOT PHARMACY INSTRUCTIONS. Belmar reads the patient directions field. If the insulin-syringe note is moved to Pharmacy Instructions they may not see it and will not ship syringes. Keep \"(Include one pack of insulin syringes)\" at the end of every Belmar sig."
      ]
    },
    "farmakeio": {
      "key": "farmakeio",
      "name": "FarmaKeio Pharmacy",
      "abbrev": "FKO",
      "color": "#EF6C00",
      "type": "compounding",
      "visibility": "provider",
      "status": "active",
      "orderVia": "Tebra Compound",
      "billing": "Bill to KORB Health Group, ship to patient",
      "footprint": [
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
      "footprintExcludes": [
        "CA"
      ],
      "footprintNote": "Ships to 49 states plus DC. California is the single state FarmaKeio will not ship to, and that cannot be overridden. Preferred everywhere except CA, TX, FL, AZ and NV.",
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
      "programs": {
        "glp1": {
          "status": "active"
        },
        "peptides": {
          "status": "not-offered"
        },
        "addons": {
          "status": "active"
        },
        "trt": {
          "status": "not-offered"
        },
        "womens": {
          "status": "not-offered"
        }
      },
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
      "orderVia": "Tebra Compound",
      "billing": "Bill to KORB Health Group, ship to patient",
      "footprint": [
        "AK",
        "AZ",
        "CO",
        "FL",
        "HI",
        "IA",
        "ID",
        "KS",
        "MA",
        "MD",
        "ME",
        "MO",
        "MT",
        "NE",
        "NY",
        "OH",
        "OR",
        "PA",
        "RI",
        "TX",
        "UT",
        "WI",
        "WY"
      ],
      "footprintExcludes": [
        "AL",
        "AR",
        "CA",
        "CT",
        "DC",
        "DE",
        "GA",
        "IL",
        "IN",
        "KY",
        "LA",
        "MI",
        "MN",
        "MS",
        "NC",
        "ND",
        "NH",
        "NJ",
        "NM",
        "NV",
        "OK",
        "SC",
        "SD",
        "TN",
        "VA",
        "VT",
        "WA",
        "WV"
      ],
      "footprintNote": "Restricted to 23 states effective 2026-09-11. Eight states lost their peptide source because Premier's licensed footprint does not cover them either: AL, AR, CA, IN, MN, NH, SC and WA. This is a pause, not a withdrawal — Greenwich expects to restore coverage in 30 to 60 days from 2026-09-11. AL and SC are separately and permanently excluded for compliance, so they do not come back with the restore. Five states are served by Greenwich alone with no Premier backup: AK, HI, IA, ID and MA. Confirmed with Don Stevenson 2026-09-12.",
      "preferredStates": [],
      "programs": {
        "glp1": {
          "status": "retired",
          "retiredOn": "2026-09-11",
          "movesTo": "belmar",
          "decidedBy": "Don Stevenson",
          "reason": "Greenwich stopped shipping to California, which removed the last reason to keep a second tirzepatide route open. Rather than carve California out, the whole Greenwich GLP-1 line is retired and every tirzepatide patient moves to Belmar.",
          "opsAction": "Every established Greenwich tirzepatide patient is moved to Belmar at their next fill, California first. Do not place another Greenwich GLP-1 order."
        },
        "peptides": {
          "status": "active",
          "note": "Greenwich ended its central-fill arrangements with affiliated pharmacies after Board of Pharmacy guidance, effective 11:59pm on 2026-09-11, and now dispenses only into the states where it is itself licensed. That is a licensure change, not a commercial pause: the footprint above IS the new licence. Applications are pending elsewhere and Greenwich expects to substantially resume within 30 to 60 days. AL and SC are separately and permanently excluded for compliance and will not return with the rest."
        },
        "addons": {
          "status": "not-offered"
        },
        "trt": {
          "status": "not-offered"
        },
        "womens": {
          "status": "not-offered"
        }
      },
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
        "Greenwich dispenses to 23 states only as of 11:59 pm 11 Sept 2026. Of what it dropped, AR, CA, IN, NH and WA are the states Premier cannot cover, so those five have no peptide pharmacy at all. Treat as a pause with an expected 30 to 60 day restore, not a discontinuation. AL, MN and SC also lost Greenwich but were already out of the peptide program and stay closed regardless of the restore.",
        "Prescriptions received before 11:59 pm 11 Sept 2026 were filled and shipped by 13 Sept with tracking by 14 Sept. No reshipments approved or shipped after 14 Sept 2026.",
        "AK, HI, IA, ID and MA are served by Greenwich alone. Premier is not licensed in any of them, so there is no second route if Greenwich changes again. IA and ID are the two that are live and taking patients."
      ]
    },
    "lillydirect": {
      "key": "lillydirect",
      /* DISPENSING ADDRESS. Supplied by Don 2026-09-15 from the brand
         prescribing document. A provider writing a brand prescription has to
         pick the right pharmacy in Tebra, and until now no address or phone
         existed anywhere in the repo - the 2026-08-09 changelog said they had
         been loaded and they had not. Stored here because a pharmacy fact
         belongs in the pharmacy layer and nowhere else. */
      "dispensingName": "LillyDirect Self Pay Pharmacy Solutions",
      "address1": "4343 Equity Dr",
      "cityStateZip": "Columbus, OH, 432283842",
      "phone": "(833) 432-4322",
      "name": "LillyDirect",
      "color": "#C62828",
      "type": "manufacturer-direct",
      "visibility": "provider",
      "status": "active",
      "orderVia": "Tebra Standard prescription (NOT Tebra Compound)",
      "billing": "Patient pays the manufacturer program directly. See brandRules.",
      "footprint": [],
      "footprintExcludes": [],
      "preferredStates": [],
      "programs": {
        "glp1": {
          "status": "active",
          "note": "Manufacturer-direct brand channel. No footprint of its own."
        },
        "peptides": {
          "status": "not-offered"
        },
        "addons": {
          "status": "not-offered"
        },
        "trt": {
          "status": "not-offered"
        },
        "womens": {
          "status": "not-offered"
        }
      },
      "notes": [
        "Cash-pay, direct-to-patient. Dispensing, payment, shipping and delivery are managed by the manufacturer. KORB does not manage fulfillment.",
        "Carries Zepbound KwikPen and Foundayo (orforglipron) oral tablets.",
        "Not a KORB compounding pharmacy. Provider-side only."
      ]
    },
    "novocare": {
      "key": "novocare",
      /* DISPENSING ADDRESS. Supplied by Don 2026-09-15 from the brand
         prescribing document. A provider writing a brand prescription has to
         pick the right pharmacy in Tebra, and until now no address or phone
         existed anywhere in the repo - the 2026-08-09 changelog said they had
         been loaded and they had not. Stored here because a pharmacy fact
         belongs in the pharmacy layer and nowhere else. */
      "dispensingName": "NovoCare Pharmacy",
      "address1": "2400 Sand Lake Road, Suite 200B",
      "cityStateZip": "Orlando, FL, 32809",
      "phone": "(833) 949-5527",
      "name": "NovoCare",
      "color": "#00695C",
      "type": "manufacturer-direct",
      "visibility": "provider",
      "status": "active",
      "orderVia": "Tebra Standard prescription (NOT Tebra Compound)",
      "billing": "Patient pays the manufacturer program directly. See brandRules.",
      "footprint": [],
      "footprintExcludes": [],
      "preferredStates": [],
      "programs": {
        "glp1": {
          "status": "active",
          "note": "Manufacturer-direct brand channel. No footprint of its own."
        },
        "peptides": {
          "status": "not-offered"
        },
        "addons": {
          "status": "not-offered"
        },
        "trt": {
          "status": "not-offered"
        },
        "womens": {
          "status": "not-offered"
        }
      },
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
      "orderVia": "Tebra Standard prescription (NOT Tebra Compound)",
      "billing": "Patient pays the pharmacy directly. See brandRules.",
      "footprint": [],
      "footprintExcludes": [],
      "preferredStates": [],
      "programs": {
        "glp1": {
          "status": "active",
          "note": "Brand-name products only, dispensed by the patient’s own pharmacy. See brandRules."
        },
        "peptides": {
          "status": "not-offered"
        },
        "addons": {
          "status": "not-offered"
        },
        "trt": {
          "status": "not-offered"
        },
        "womens": {
          "status": "not-offered"
        }
      },
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
      "note": "Belmar is the only California option. FarmaKeio cannot ship to CA at all, Premier cannot either, and Greenwich stopped shipping to CA on 2026-09-11. Every California GLP-1 goes to Belmar, including tirzepatide patients moving off Greenwich."
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

  /* Can this pharmacy ship this program to this state?

     Three gates, in order:
       footprint          licensure. Where the pharmacy may ship at all.
       footprintExcludes  permanent exclusions from that licence.
       programs[x].excludes  a narrowing of that program only, such as a
                          commercial pause. The footprint is untouched by it,
                          which is the distinction the old flat shipsTo could
                          not hold and the reason Greenwich read two ways.

     `program` is optional. Omitted, it answers the licensure question only,
     which is what the old two-argument shipsTo() meant. Callers that care
     about a specific program must say which. */
  servesState: function (pharmacyKey, state, program) {
    var p = this.pharmacies[pharmacyKey];
    if (!p) return false;
    if ((p.footprintExcludes || []).indexOf(state) > -1) return false;
    if (p.footprint && p.footprint.length && p.footprint.indexOf(state) < 0) return false;
    if (!program) return true;
    var pr = (p.programs || {})[program];
    if (!pr || pr.status !== 'active') return false;
    return (pr.excludes || []).indexOf(state) < 0;
  },

  /* Kept so existing callers do not silently change meaning. It answers the
     licensure question, not the program one. */
  shipsTo: function (pharmacyKey, state) {
    return this.servesState(pharmacyKey, state, null);
  },

  /* Every state this pharmacy actually serves for a program, computed rather
     than stored, so it cannot drift from the footprint it is derived from. */
  statesFor: function (pharmacyKey, program) {
    var self = this, p = this.pharmacies[pharmacyKey];
    if (!p || !p.footprint) return [];
    return p.footprint.filter(function (st) { return self.servesState(pharmacyKey, st, program); });
  },

  /* Which programs this pharmacy offers at all. */
  programsFor: function (pharmacyKey) {
    var p = this.pharmacies[pharmacyKey];
    if (!p || !p.programs) return [];
    return Object.keys(p.programs).filter(function (k) { return p.programs[k].status === 'active'; });
  },

  isPreferred: function (pharmacyKey, state) {
    var p = this.pharmacies[pharmacyKey];
    return !!(p && p.preferredStates && p.preferredStates.indexOf(state) > -1);
  },

  /* Every pharmacy that can legally ship to a state, preferred ones first. */
  optionsForState: function (state, program) {
    var self = this, out = [];
    Object.keys(this.pharmacies).forEach(function (k) {
      if (self.servesState(k, state, program)) {
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
      if (p.type === "compounding" && (!p.footprint || !p.footprint.length)) {
        problems.push(k + ": compounding pharmacy with an empty footprint");
      }
      (p.footprintExcludes || []).forEach(function (s) {
        if (p.footprint && p.footprint.indexOf(s) > -1) {
          problems.push(k + ": " + s + " is in both footprint and footprintExcludes");
        }
      });
      /* A program may narrow the footprint. It may not reach outside it, which
         would be a claim to ship somewhere the pharmacy is not licensed. */
      Object.keys(p.programs || {}).forEach(function (pr) {
        (p.programs[pr].excludes || []).forEach(function (s) {
          if (p.footprint && p.footprint.indexOf(s) < 0) {
            problems.push(k + "/" + pr + ": excludes " + s + ", which is not in the footprint anyway");
          }
        });
      });
      if (p.type === "compounding" && p.programs &&
          !Object.keys(p.programs).some(function (pr) { return p.programs[pr].status === "active"; })) {
        problems.push(k + ": compounding pharmacy offering no active program");
      }
      (p.preferredStates || []).forEach(function (s) {
        if (!self.shipsTo(k, s)) problems.push(k + ": preferred in " + s + " but cannot ship there");
      });
    });
    if (problems.length) { console.warn("KORB_PHARMACIES.selfCheck found " + problems.length + " problem(s):");
      problems.forEach(function (p) { console.warn("  - " + p); }); }
    else console.log("KORB_PHARMACIES.selfCheck passed.");
    return problems;
  },

  /* --------------------------------------------------------------------------
     CROSS-FILE CHECK — open item 2.

     selfCheck() above validates this file against itself, which is exactly how
     the Greenwich drift went unnoticed for two days: both files were internally
     consistent and said different things. This one compares the shared layer
     against the program files that still carry their own copy of the same facts.

     Pass the program data in rather than loading it, so this works unchanged in
     a browser and in a builder:

       KORB_PHARMACIES.crossCheck({ glp1: KORB_GLP1, dosing: KORB_DOSING })

     Every argument is optional. A file that is not passed is not checked, and
     the result says so rather than counting as agreement — a check that scores
     an absent file as a pass is the "green light earned by not looking" this
     repo keeps re-learning.
     -------------------------------------------------------------------------- */
  crossCheck: function (sources) {
    var problems = [], checked = [], self = this, derived = false;
    sources = sources || {};

    function setEq(a, b) {
      a = a || []; b = b || [];
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (b.indexOf(a[i]) < 0) return false;
      return true;
    }
    function only(a, b) {
      return (a || []).filter(function (x) { return (b || []).indexOf(x) < 0; }).sort();
    }

    /* 1. A program file that carries its own pharmacy block must agree with
          this one, field by field. */
    if (sources.glp1 && sources.glp1.pharmacies) {
      checked.push("korb-glp1-data.js");
      Object.keys(sources.glp1.pharmacies).forEach(function (k) {
        var mine = self.pharmacies[k], theirs = sources.glp1.pharmacies[k];
        if (!mine) {
          problems.push('korb-glp1-data.js describes pharmacy "' + k + '" which this file does not have');
          return;
        }
        /* Since open item 3, korb-glp1-data.js takes these lists FROM this file
           at load. Comparing them then proves nothing: it compares a value with
           itself and reports agreement it did not earn. Say so instead. */
        if (sources.glp1.hydrated) { derived = true; return; }

        /* Compare the EFFECTIVE GLP-1 list, not the raw footprint. A pharmacy
           whose GLP-1 is retired serves no states for it, and that is the
           comparison that matters — comparing footprints would reopen exactly
           the Greenwich confusion this reshape closed. */
        var prog = (mine.programs || {}).glp1 || { status: "not-offered" };
        var effective = prog.status === "active" ? self.statesFor(k, "glp1") : [];
        var theirsList = (theirs.shipsTo || []).filter(function (st) {
          return (theirs.hardExcludes || []).indexOf(st) < 0;
        });
        if (prog.status === "retired") {
          /* korb-glp1-data.js may still carry the pre-retirement footprint on a
             retired pharmacy. That is a stale copy rather than a disagreement,
             so it is reported once and plainly, not as a per-state diff. */
          if (theirsList.length) {
            problems.push(k + ": GLP-1 is retired here, but korb-glp1-data.js still lists a " +
              theirsList.length + "-state GLP-1 footprint for it. Remove it when GLP-1 is wired onto this file (open item 3).");
          }
        } else if (!setEq(effective, theirsList)) {
          problems.push(k + " GLP-1 states: this file computes " + effective.length +
            ", korb-glp1-data.js lists " + theirsList.length +
            (only(effective, theirsList).length ? " | only here: " + only(effective, theirsList).join(",") : "") +
            (only(theirsList, effective).length ? " | only there: " + only(theirsList, effective).join(",") : ""));
        }
        if (!setEq(mine.preferredStates, theirs.preferredStates)) {
          problems.push(k + ".preferredStates: this file has " + (mine.preferredStates || []).length +
            ", korb-glp1-data.js has " + (theirs.preferredStates || []).length);
        }
      });
    }

    /* 2. A pharmacy this file calls peptides-only must not be offering a live
          GLP-1 product. A record kept for history is marked retired and does
          not count. */
    if (sources.glp1 && sources.glp1.products) {
      Object.keys(sources.glp1.products).forEach(function (k) {
        var pr = sources.glp1.products[k];
        if (pr.retired || pr.status === "retired") return;
        var ph = self.pharmacies[pr.pharmacy];
        var g = ph && ph.programs && ph.programs.glp1;
        if (g && g.status !== "active") {
          problems.push(pr.pharmacy + ": GLP-1 is " + g.status + " here, but korb-glp1-data.js offers live product " + k);
        }
      });
    }

    /* 3. A pharmacy named by a program file must exist here. This is the
          direction that catches a new pharmacy added to a program and never
          added to the shared layer. */
    if (sources.dosing && sources.dosing.prescribing) {
      checked.push("korb-dosing-data.js");
      var seen = {};
      Object.keys(sources.dosing.prescribing).forEach(function (k) {
        var e = sources.dosing.prescribing[k];
        Object.keys(e).forEach(function (sub) {
          if (e[sub] && e[sub].label) seen[sub] = true;
        });
      });
      Object.keys(seen).forEach(function (k) {
        if (!self.pharmacies[k]) {
          problems.push('korb-dosing-data.js prescribes from pharmacy "' + k + '" which this file does not have');
        }
      });
    }

    var absent = ["glp1", "dosing"].filter(function (k) { return !sources[k]; });
    if (problems.length) {
      console.warn("KORB_PHARMACIES.crossCheck found " + problems.length + " disagreement(s):");
      problems.forEach(function (p) { console.warn("  - " + p); });
    } else {
      console.log("KORB_PHARMACIES.crossCheck: " + checked.length + " file(s) agree" +
        (checked.length ? " (" + checked.join(", ") + ")" : ""));
    }
    if (derived) {
      console.log("  korb-glp1-data.js takes its footprints from this file at load, so there");
      console.log("  is nothing left to disagree. Its state lists were NOT independently");
      console.log("  verified here because there is no longer a second copy to verify against.");
    }
    if (absent.length) console.warn("  NOT CHECKED, not passed in: " + absent.join(", "));
    return { problems: problems, checked: checked, notChecked: absent, derived: derived };
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PHARMACIES; }
