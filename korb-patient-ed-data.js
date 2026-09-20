/* ============================================================================
   KORB HEALTH - PATIENT EDUCATION CONTENT            SOURCE OF TRUTH

   The patient handouts were 27 hand-made PDFs with no source. A PDF a patient
   downloaded in March is frozen forever and cannot be corrected; the only fix
   is to stop shipping the document as the master. So the content lives here,
   once, and build-patient-ed.js renders BOTH the live HTML and the PDF from it.
   Neither can disagree with the other, because neither is typed by hand.

   WHAT IS LIVE AND WHAT IS NOT. Say this accurately rather than generously:

     LIVE      Facts pulled from korb-dosing-data.js at page load - schedule,
               timing, route, active weeks. Change the data file and every
               handout that shows them changes on the next page load.
     SHARED    Blocks in this file used by every handout - storage, travel,
               contact, sharps. Written once, so a correction lands in all of
               them in one edit rather than eight.
     PROSE     Per-drug explanation. Versioned and diffable, and it changes
               when someone edits it.

   THE ENTITY. Clinical patient instruction carries KORB Health Medical Texas
   PA, the practice. The MSO, KORB Health Group LLC, appears only where it is
   genuinely acting as itself - Operations contact, billing. The 27 PDFs these
   replace had that backwards: 25 of them named only the MSO, including every
   injectable handout. Same fault fixed in the provider references on
   2026-09-14 under open item 1b; the patient set was never in that scope.

   Do not put a dose, a schedule or a route in the prose here. If it exists in
   korb-dosing-data.js, reference it. Two copies of a dose is how a patient
   ends up reading one number and injecting another.
   ============================================================================ */

var KORB_PATIENT_ED = {

  /* See artifact-signoff.js. This file had NO sign-off structure of any kind
     until 2026-09-17: nine patient handouts carrying clinical content, none of
     them with anywhere to record that a clinician had read one. The fingerprint
     is over the RENDERED body text, because a handout has no prescribing blocks
     and the text is the whole of what a patient receives.

     Signing is not releasing. CLAUDE.md's RELEASE STATUS is the record of what
     patients can actually see, and a signature here does not move it. */
  artifactSignoff: {
    records: {
      "handout:testosterone": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-17",
        "fingerprint": "fp-982b0eb4-11974",
        "covers": "11509 characters, 17 headings",
        "attests": "Reviewed this patient handout as rendered - the clinical content, the dosing and administration guidance, the storage and travel instructions, the side effect and safety sections and the instructions on when to make contact - and approve it for release to patients."
      },
      "handout:hormonetherapy": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-17",
        "fingerprint": "fp-174b6821-11389",
        "covers": "10869 characters, 17 headings",
        "attests": "Reviewed this patient handout as rendered - the clinical content, the dosing and administration guidance, the storage and travel instructions, the side effect and safety sections and the instructions on when to make contact - and approve it for release to patients."
      }
    }
  },


  meta: {
    version: '1.0',
    lastUpdated: '2026-09-15',
    changelog: [
      '2026-09-15 (v1.0): First generated patient handouts. Content transcribed ' +
      'from the existing PDFs, which had no source. Sermorelin first, as the ' +
      'pattern. Clinical facts now read from korb-dosing-data.js rather than ' +
      'being restated, and the byline is the medical PA rather than the MSO.'
    ]
  },

  /* ── SHARED BLOCKS ──────────────────────────────────────────────────────
     Every injectable handout says these same things. They were eight separate
     copies in eight PDFs; a correction to the sharps rule meant eight edits and
     eight chances to miss one. */
  shared: {

    authoritySource:
      'Your prescription label, or the instructions given to you by your KORB ' +
      'clinical provider, is the authoritative source for your dose and ' +
      'directions. Some pharmacies label vials "as directed by provider" rather ' +
      'than printing exact instructions. What follows is a general reference. ' +
      'Do not adjust anything without speaking to your provider first.',

    disclaimer:
      'This handout is for educational reference only. It is not medical advice. ' +
      'Always follow your prescription label, your pharmacy-specific ' +
      'instructions, and your KORB provider’s guidance. If you have ' +
      'questions, contact KORB using the details at the end of this handout.',

    /* USP <797>: a multi-dose container is 28 days from first entry OR the
       assigned BUD, whichever is shorter. Never tell a patient to disregard a
       printed date - see Conventions in CLAUDE.md. */
    storage: {
      cards: [
        ['Refrigerate', '36°F – 46°F (2°C – 8°C)'],
        ['Do not freeze', 'Freezing damages medication'],
        ['Protect from light', 'Keep away from direct sunlight'],
        ['Discard at 28 days', 'Write the open date on the vial']
      ],
      notes: [
        'Before first use: refrigerate, protect from light, do not freeze or shake.',
        'After opening: write the open date on your vial and discard 28 days after ' +
        'first use, even if medication remains. If your label shows an earlier ' +
        'beyond-use date, follow the earlier one.',
        'Do not use if the solution appears cloudy or discolored, or contains particles.'
      ]
    },

    travel:
      'Traveling does not have to interrupt your program. Keep your medication ' +
      'with you, in your carry-on or personal item rather than checked baggage, ' +
      'in its original labeled vial or packaging. It does not need to be packed ' +
      'in ice during travel; keep it away from excessive heat (above 86°F / ' +
      '30°C) and from freezing, and refrigerate it again when you arrive. ' +
      'Medication and syringes are permitted in carry-on luggage, and TSA ' +
      'recommends keeping the original pharmacy label visible. Crossing time ' +
      'zones can shift your injection time by a few hours without a problem; if ' +
      'you will be off your usual schedule for several days, contact KORB.',

    /* WHAT TO DO AT THE CHECKPOINT, and where the current rules are. One fact,
       so it is written once.

       It lived on the Semaglutide and Tirzepatide handouts as doc.travelNote
       and nowhere else, so the Injection, Storage and Safety Guide - the
       document a patient is actually sent before their first injection, and the
       one whose whole last section is travel - said only that TSA "recommends
       keeping the original pharmacy label visible" and gave them no link and
       nothing to say to the officer. Don asked for the better wording on
       2026-09-18 and it was already in the repo, on two handouts that are not
       released to patients.

       Every travel section renders this: the shared one, and the handouts that
       override travel with their own text because their storage rules differ.
       A patient carrying testosterone needs the checkpoint sentence as much as
       one carrying semaglutide. */
    travelScreening: {
      /* The sentence ENDS. It used to trail off into "the current rules are at"
         with the address as the last words, which reads correctly only while the
         link is inline. Don asked for a button on 2026-09-18, and a sentence
         written to hand off to its own final phrase does not survive that move.
         buttonLabel says what pressing it does; the URL is not a label. */
      text: 'TSA asks that you tell the officer at the start of screening that ' +
            'you are carrying medically necessary liquids, and they may need to ' +
            'be inspected separately. TSA sets these rules and can change them, ' +
            'so check before you fly.',
      buttonLabel: 'Check the current TSA rules',
      href: 'https://www.tsa.gov/travel/travel-tips'
    },

    injectionSafety: [
      'Use a new insulin needle and syringe for every injection. Do not reuse.',
      'Never combine two medications in one syringe. Use a separate needle and ' +
      'syringe for each medication and each injection.',
      'Put used needles and syringes straight into a rigid, puncture-resistant ' +
      'container. Sharps rules are set locally and vary by state and by city, so ' +
      'follow the ones where you live, and do not put needles or syringes loose ' +
      'in household trash unless your local guidance specifically allows it.'
    ],

    contact: {
      operations: {
        title: 'Contact KORB Operations',
        /* STRUCTURED, BECAUSE THESE WERE PRINTED AND NOT REACHABLE.
           'Email: info@korbhealth.com' was a string in a paragraph on every page
           that renders this block. It read as contact information and none of it
           was a link - no mailto:, no tel:, and the Patient Portal had no URL at
           all. The lab page rendered one link in the whole document and it was
           Print. Don, 2026-09-18: the contact information "doesn't stand out",
           and on the lab page he could not find it.
           value is what a patient reads, href is what a phone dials. */
        ways: [
          { label: 'Phone', value: '(888) 959-7299', href: 'tel:+18889597299' },
          { label: 'Email', value: 'info@korbhealth.com', href: 'mailto:info@korbhealth.com' },
          { label: 'Hours', value: 'Mon–Fri, 9 AM–6 PM CT' }
        ],
        items: ['Questions about timing, storage or administration',
                'Scheduling, billing and shipping']
      },
      portal: {
        title: 'Patient Portal — message your provider',
        /* The URL the Welcome Letter has always used. It was on the designed PDF
           and on no generated page, so a patient told to "use the Patient Portal"
           was told to find it themselves. */
        ways: [
          { label: 'Portal', value: 'Sign in to the Patient Portal',
            href: 'https://portal.kareo.com/app/new/login' }
        ],
        /* NOT "injection-site". This renders on the When to Contact guide, which
           serves all four programs: Women's Health is patches, creams and
           capsules, and gut health will add more oral products. Naming only
           injections tells every other patient their side effects are not the
           kind KORB wants to hear about. Don, 2026-09-19. */
        items: ['Localized irritation, redness or soreness that does not resolve, ' +
                'wherever you inject or apply your medication',
                'Nausea, digestive upset or appetite changes that are not settling',
                'Mild but persistent side effects of any kind',
                'Questions about whether to continue therapy']
      },
      emergency: {
        title: 'Seek emergency care immediately',
        items: ['Trouble breathing, or swelling of the face, lips, tongue or throat',
                'Severe rash or widespread hives',
                'Chest pain or fainting',
                'Severe or rapidly worsening symptoms',
                'Confusion or severe weakness',
                'Any symptom that feels urgent or unsafe']
      },
      portalNote:
        'The Patient Portal is the only HIPAA-compliant way to message your ' +
        'provider directly. Providers check portal messages once per day on their ' +
        'clinic days. For anything that does not need your provider’s direct ' +
        'medical judgment, contact KORB Operations by phone or email instead.',
      emergencyNote:
        'Phone and email are not appropriate for emergencies. When in doubt, go to ' +
        'urgent care or the emergency room.'
    }
  },

  /* ── THE HANDOUTS ───────────────────────────────────────────────────────
     agentKey ties a handout to korb-dosing-data.js. Route, schedule, timing and
     active weeks are read from there and are never restated below. */

  /* Program overviews. Rendered by renderProgramBody in patient-ed-render.js,
     not by renderBody: a tier is not a molecule. Narrative lives here; which
     agents a tier offers and when each is active inside the cycle are read
     from korb-dosing-data.js at page load, because that is the part the PDFs
     stated as fixed text and got wrong the moment the data moved. */
  programs: {
    foundation: {
      key: 'foundation',
      file: 'Patient_Education/KORB_Foundation_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Foundation Program',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which agent and dosing schedule are right for you. If you have questions, contact KORB by phone or email.',
      what: [
        'Foundation is the single-agent tier of KORB\'s Functional Health and Longevity Program. At any given time one peptide is active, and your provider selects it based on your goals and clinical profile. You may switch to a different agent at each 16-week follow-up, but Foundation never combines two agents at once.',
        'If a staggered, multi-agent approach interests you, ask your provider about the Gateway or Peak Performance programs.',
        'These peptides are used in an investigational capacity. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific agent before you begin.'
      ],
      agentsHeading: 'Your Foundation agent options',
      agentsLead: 'Your provider selects one of the following based on your goals. Each has its own active window inside your 16-week cycle. Your Treatment Schedule shows exact dates.',
      agents: [
        {
          key: 'sermorelin',
          context: 'foundation',
          text: 'A growth hormone-releasing peptide. Possible support for sleep quality, recovery and body composition goals. Injected most nights, 6 on and 1 off.'
        },
        {
          key: 'cjcipam',
          context: 'foundation',
          text: 'A growth hormone-releasing peptide combination. Possible support for similar goals to Sermorelin, with a different release profile. Injected most nights, 6 on and 1 off.'
        },
        {
          key: 'bpc157',
          context: 'foundation',
          text: 'A peptide studied for possible support of soft tissue recovery and musculoskeletal health. Injected daily.'
        }
      ],
      note: {
        label: 'One agent at a time.',
        text: 'Foundation never combines two agents simultaneously. At each 16-week follow-up you and your provider may continue your current agent or switch to a different one. See the Patient Education handout for your specific agent for full dosing, timing and storage instructions.'
      },
      pricing: 'For current Foundation Program pricing, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your agent\'s active window, before your follow-up, is an off period for lab review and lifestyle focus.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your Foundation agent only as prescribed. Do not change your dose, course length or schedule without provider direction.',
        'Do not add a second peptide or combine agents on your own. Foundation is single-agent only.',
        'This program is not appropriate during active malignancy or pregnancy.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the authoritative source for your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local regulations for sharps disposal.'
      ],
      keyReminders: [
        'Your provider selects your Foundation agent. This guide is a general orientation, not personalized medical advice.',
        'Only one agent is active at a time. You may switch to a different agent at your next follow-up if you and your provider agree.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    },

    gateway: {
      key: 'gateway',
      file: 'Patient_Education/KORB_Gateway_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Gateway Program',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines your exact schedule and add-ons. If you have questions, contact KORB by phone or email.',
      what: [
        'Gateway is KORB\'s staggered two-medication tier within the Functional Health and Longevity Program. Unlike Foundation\'s single-agent model, Gateway combines Sermorelin with BPC-157 on a fixed staggered schedule, so the two do not start on the same day. An optional GHK-Cu add-on is available on Gateway if your provider prescribes it.',
        'These peptides are used in an investigational capacity. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific agent before you begin.'
      ],
      agentsHeading: 'How your Gateway combination works',
      agentsLead: 'Two agents started at different points in the cycle by design, plus one optional add-on. Your Treatment Schedule shows your exact dates.',
      agents: [
        {
          key: 'sermorelin',
          context: 'foundation',
          text: 'Your primary agent, begun on your start date. Injected most nights, 6 on and 1 off.'
        },
        {
          key: 'bpc157',
          context: 'gatewayPeakBase',
          text: 'Added after Sermorelin is already under way, not on your start date. Injected daily.'
        },
        {
          key: 'ghkcu',
          context: 'optionalAddon',
          text: 'An optional add-on, included only if your provider prescribes it.'
        }
      ],
      note: {
        label: 'Staggered by design.',
        text: 'The two agents start at different times on purpose, so that if something does not agree with you it is clearer which one is responsible. Do not start them together to catch up, and do not change the order.'
      },
      pricing: 'For current Gateway Program pricing, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your agent\'s active window, before your follow-up, is an off period for lab review and lifestyle focus.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your Gateway agents only as prescribed. Do not change your dose, course length or schedule without provider direction.',
        'Keep the stagger. Do not start both agents on the same day.',
        'GHK-Cu is an add-on only if your provider prescribed it. Do not add it yourself.',
        'This program is not appropriate during active malignancy or pregnancy.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the authoritative source for your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local regulations for sharps disposal.'
      ],
      keyReminders: [
        'Gateway is two agents on a fixed staggered schedule, not two agents started together.',
        'GHK-Cu is optional and only included if prescribed.',
        'Your provider sets your schedule. This guide is a general orientation, not personalized medical advice.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    },

    peak: {
      key: 'peak',
      file: 'Patient_Education/KORB_Peak_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Peak Performance Program',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which pathway and dose are right for you. If you have questions, contact KORB by phone or email.',
      what: [
        'Peak Performance is KORB\'s performance and body-composition focused tier within the Functional Health and Longevity Program. It offers two pathways, A and B, each pairing a primary growth hormone-releasing agent with staggered BPC-157, and each with an optional GHK-Cu add-on.',
        'Your provider selects your pathway. You do not choose between them on your own, and they are not combined.',
        'These peptides are used in an investigational capacity. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific agent before you begin.'
      ],
      tiersHeading: 'Choosing your pathway',
      tiersLead: 'Both pathways run on the same 16-week cycle. The difference is the primary agent.',
      tiers: [
        {
          name: 'Pathway A, CJC-1295 / Ipamorelin',
          text: 'A growth hormone-releasing peptide combination as your primary agent, with staggered BPC-157 and an optional GHK-Cu add-on.'
        },
        {
          name: 'Pathway B, Tesamorelin',
          text: 'Tesamorelin as your primary agent, with staggered BPC-157 and an optional GHK-Cu add-on. Tesamorelin is dose-selectable, so your provider sets your strength.'
        }
      ],
      agentsHeading: 'The agents that run alongside your pathway',
      agentsLead: 'Whichever pathway you are on, these run on the same schedule inside your cycle.',
      agents: [
        {
          key: 'bpc157',
          context: 'gatewayPeakBase',
          text: 'Added after your primary agent is already under way, not on your start date. Injected daily.'
        },
        {
          key: 'ghkcu',
          context: 'optionalAddon',
          text: 'An optional add-on, included only if your provider prescribes it.'
        }
      ],
      note: {
        label: 'Staggered by design.',
        text: 'Your agents start at different points in the cycle on purpose, so that if something does not agree with you it is clearer which one is responsible. Do not start them together and do not change the order.'
      },
      pricing: 'For current Peak Performance Program pricing, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your agent\'s active window, before your follow-up, is an off period for lab review and lifestyle focus.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your Peak agents only as prescribed. Do not change your dose, course length or schedule without provider direction.',
        'Keep the stagger. Do not start your agents on the same day to catch up.',
        'GHK-Cu is an add-on only if your provider prescribed it. Do not add it yourself.',
        'This program is not appropriate during active malignancy or pregnancy.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the authoritative source for your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local regulations for sharps disposal.'
      ],
      keyReminders: [
        'Your provider selects your pathway. Pathways A and B are alternatives, not a combination.',
        'GHK-Cu is optional and only included if prescribed.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    },

    longevity: {
      key: 'longevity',
      file: 'Patient_Education/KORB_Longevity_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Functional Health and Longevity Program',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which program and medication(s) are right for you. If you have questions, contact KORB by phone or email.',
      what: [
        'KORB\'s Functional Health and Longevity Program is a physician-guided, cash-pay telemedicine program built around select injectable peptide therapies. After a clinical intake and review, your provider determines which program tier and medication or medications are appropriate for your goals.',
        'This guide is a general orientation to the whole program. Your tier has its own guide with more detail, and your provider gives you individualized guidance.',
        'These peptides are used in an investigational capacity. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific agent before you begin.'
      ],
      tiersHeading: 'Choosing your program',
      tiersLead: 'All three tiers run on the same 16-week cycle. They differ in how many agents are active and whether they are staggered.',
      tiers: [
        {
          name: 'Foundation',
          text: 'The single-agent tier. One peptide is active at a time, chosen by your provider from Sermorelin, CJC-1295 / Ipamorelin or BPC-157. Agents are never combined, though you may switch at a follow-up.'
        },
        {
          /* GHK-Cu on Gateway is not new. korb-dosing-data.js has had Gateway at
             optionalAddon: 'ghkcu' alongside both Peak pathways, and Foundation
             at null with the comment "GHK-Cu is never a Foundation option". Only
             the patient documents left it out. Don, 2026-09-19. */
          name: 'Gateway',
          text: 'The staggered two-medication tier. Sermorelin with BPC-157 added later in the cycle rather than on the same day, and an optional GHK-Cu add-on.'
        },
        {
          name: 'Peak Performance',
          text: 'The performance and body-composition tier. Two pathways, each pairing a primary growth hormone-releasing agent with staggered BPC-157, and each with an optional GHK-Cu add-on.'
        }
      ],
      pricing: 'For current pricing on any tier, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your agent\'s active window, before your follow-up, is an off period for lab review and lifestyle focus.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your medication only as prescribed. Do not change your dose, course length or schedule without provider direction.',
        'Do not add an agent or change tiers on your own. Your tier is a clinical decision.',
        'This program is not appropriate during active malignancy or pregnancy.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the authoritative source for your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local regulations for sharps disposal.'
      ],
      keyReminders: [
        'Your provider decides your tier after your intake and labs. This guide is a general orientation, not personalized medical advice.',
        'All tiers run on the same 16-week cycle with a lab draw between weeks 12 and 14.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    }
  },


  /* Standalone guides, rendered by renderGuideBody. Sections that duplicate a
     handout - storage, injection safety, travel, contact - are declared as
     shared block references rather than retyped, so the guide and the handouts
     cannot disagree. That divergence is exactly what two separate PDFs
     produced. */
  guides: {
    anti_aging: {
      key: 'anti_aging',
      file: 'Patient_Education/KORB_Patient_Ed_Anti_Aging',
      program: 'KORB Health',
      title: 'Anti-Aging',
      disclaimer: 'This handout is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        'Two treatments aimed at how you age rather than at a specific symptom. They can be added to any KORB program, and you may be prescribed one or both. Neither requires lab work to start.'
      ],
      sections: [
        {
          h: 'NAD+',
          paras: [
            'NAD+ is a coenzyme your body already makes. It is involved in energy production, DNA repair and immune function. Levels fall steadily with age, and supplementing aims to restore some of what has been lost.',
            'Most people take it hoping for better energy, sharper focus, and less of the general worn-down feeling that creeps in with age. Research is promising but still developing, so think of it as supporting how you feel rather than producing a dramatic change.'
          ],
          cards: [
            [
              'Injection under the skin',
              'Twice a week. Most people use the lower abdomen; the arm, thigh or buttock also work. Rotate the site.'
            ],
            [
              'Nasal spray',
              'Once daily, one or two sprays in each nostril as directed.'
            ],
            [
              'Dissolving tablet',
              'Under the tongue each morning, Monday to Friday, with weekends off. Let it dissolve fully; do not chew or swallow it whole.'
            ]
          ],
          after: [
            'Your NAD+ supply lasts 28 days and you refill monthly rather than quarterly. If you use the injection there will still be medication in the vial at 28 days. That is expected. Discard it and start your new vial. Compounded medication is not considered safe to use past that point once the vial has been punctured.',
            'Tell your provider if you take isotretinoin, sold as Accutane. NAD+ is not used alongside it.'
          ]
        },
        {
          h: 'Metformin',
          paras: [
            'Metformin has been used for decades for blood sugar and is on the World Health Organization\'s list of essential medicines. It is prescribed here for a different reason: a growing body of research links it to lower rates of dementia and some cancers, reduced cardiovascular risk, and less inflammation.',
            'One extended-release tablet daily. Your supply is 90 days, so it follows the usual quarterly rhythm.',
            'You will probably not feel any different, and that is normal. Unlike a medication that treats a symptom you can notice, metformin here is aimed at long-term risk. Not feeling a change does not mean it is not working.',
            'You do not need to be diabetic to take it. At this dose it may nudge your blood sugar slightly lower, but it is unlikely to cause symptoms of low blood sugar.'
          ],
          after: [
            'Before you start, your provider needs to know about kidney problems, liver problems, heart failure or heavy alcohol use. Metformin is not appropriate for everyone and these are the things that matter most. Also tell us if you are scheduled for surgery or an imaging scan that uses contrast dye, since metformin is usually paused around those.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Nausea or upset stomach',
              'The most common effect for both. Usually settles. Taking metformin with food helps.'
            ],
            [
              'Headache, fatigue or indigestion (NAD+)',
              'May occur early on. Tell your provider if it persists.'
            ],
            [
              'Dizziness, sweating and headache together (metformin)',
              'Can indicate blood sugar dipping. Have something to eat and tell your provider.'
            ],
            [
              'Injection site soreness or redness (NAD+)',
              'Rotate sites and use new equipment each time. Metformin is taken by mouth and has no injection site.'
            ]
          ],
          after: [
            'Seek urgent care for unusual muscle pain or weakness, trouble breathing, unusual sleepiness, severe stomach pain with nausea and vomiting, or feeling very cold or lightheaded. These are rare but are the symptoms that matter most while taking metformin. Do not wait to hear back from KORB.'
          ]
        }
      ],
      keyReminders: [
        'Neither treatment requires lab work to start.',
        'NAD+ injection: discard the vial 28 days after first puncture even if medication remains.',
        'Tell your provider about kidney or liver problems, heart failure or heavy alcohol use before starting metformin.',
        'Metformin is usually paused around surgery and contrast imaging. Tell us if either is scheduled.',
        'Do not take NAD+ alongside isotretinoin (Accutane).'
      ]
    },

    hair_loss: {
      key: 'hair_loss',
      file: 'Patient_Education/KORB_Patient_Ed_Hair_Loss',
      program: 'KORB Health',
      title: 'Hair Loss Treatment',
      disclaimer: 'This handout is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        'Hair loss treatment comes as a once-daily pill, a once-daily topical you apply to your scalp, or both together. Your provider chooses based on your pattern of loss, your health history and your preference.'
      ],
      sections: [
        {
          h: 'What you may be prescribed',
          cards: [
            [
              'Men',
              'Pill: finasteride. Topical: minoxidil with finasteride and tretinoin.'
            ],
            [
              'Women',
              'Pill: spironolactone. Topical: minoxidil with spironolactone and latanoprost.'
            ]
          ],
          after: [
            'These are not interchangeable between people. **The men\'s pill, finasteride, must never be taken by a woman who is or could become pregnant, because it can cause serious birth defects.** Never take, share or borrow someone else\'s prescription, including a partner\'s.'
          ]
        },
        {
          h: 'Give it three to six months',
          paras: [
            'This is the single most important thing to understand before you start. Hair grows slowly, and these treatments work by protecting the hair you have and improving the quality of new growth. Most people see no visible change for the first three months, and the clearest results appear between three and six months.',
            'Some people notice increased shedding in the first few weeks. That is usually a normal part of the cycle resetting and not a sign the treatment is failing. Stopping early is the most common reason treatment does not work. If you stop, any gains will gradually reverse.'
          ]
        },
        {
          h: 'How to use the topical',
          items: [
            'Apply once daily to a dry scalp, not damp or freshly washed hair.',
            'Use one to two applications depending on how much area you are covering. Your provider will tell you which.',
            'Work it into the scalp where you are thinning, not onto the hair itself.',
            'Wash your hands afterwards.',
            'Leave it on for at least four hours, or overnight if that suits your routine better.'
          ],
          after: [
            'How long your bottle lasts depends on how much you use. Two doses a day runs out roughly twice as fast as one. Tell us early if you are running low rather than at the last minute.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Scalp redness, itching or dryness (topical)',
              'Common early on. Tell your provider if it is severe or does not settle.'
            ],
            [
              'Increased shedding in the first few weeks',
              'Usually normal. Contact KORB if it is heavy or lasts beyond about six weeks.'
            ],
            [
              'Reduced sex drive or difficulty with erections (finasteride)',
              'Uncommon but real. Tell your provider rather than stopping on your own.'
            ],
            [
              'Breast tenderness or swelling (either pill)',
              'Tell your provider.'
            ],
            [
              'Dizziness or feeling lightheaded (spironolactone)',
              'Stand up slowly. Tell your provider if it continues.'
            ],
            [
              'Unwanted hair growth where the topical has run',
              'Tell your provider.'
            ]
          ]
        }
      ],
      keyReminders: [
        'Finasteride must never be taken by a woman who is or could become pregnant. It causes serious birth defects.',
        'Never share or borrow a hair loss prescription, including a partner\'s.',
        'Give it three to six months. Stopping early is the commonest reason it does not work.',
        'Apply the topical to a dry scalp and leave it at least four hours.'
      ]
    },

    sexual_health: {
      key: 'sexual_health',
      file: 'Patient_Education/KORB_Patient_Ed_Sexual_Health',
      program: 'KORB Health',
      title: 'Sexual Health',
      disclaimer: 'This handout is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        '**Do not use these medications if you take nitrates for chest pain.** Nitrates include nitroglycerin, isosorbide and similar heart medications, whether you take them daily or only occasionally. Combining them with this treatment can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you use rarely.'
      ],
      sections: [
        {
          h: 'For men: KORB Rise',
          paras: [
            'KORB Rise is a dissolvable troche you place in your mouth. It contains the same active ingredients found in Viagra and Cialis, combined with L-Arginine and oxytocin. L-Arginine is included specifically to reduce headache, which is the most common side effect.',
            'Oxytocin does something different from the other ingredients. Sildenafil and tadalafil work on blood flow. Oxytocin acts on the brain, where it plays a part in arousal, desire and feeling relaxed and connected with a partner. It was added to address the side of the response that blood flow alone does not reach, particularly where stress or anxiety is part of the picture. This use of oxytocin is newer and less well established than the other ingredients, so tell your provider how it works for you.'
          ],
          cards: [
            [
              'How to take it',
              'Let half to one troche dissolve in your mouth. Do not swallow it whole.'
            ],
            [
              'When',
              'About 30 minutes before sexual activity.'
            ],
            [
              'How long it lasts',
              'Up to 36 hours, so it does not need tight planning.'
            ]
          ],
          after: [
            'Start with half a troche. If that is not enough, your provider may tell you to increase to a full one. Do not take more than one troche in a 24-hour period unless your provider specifically tells you to.',
            'If you live in a state we serve through a different pharmacy you may receive PERFORM instead. It is the same idea in a fast-dissolving tablet, taken 30 minutes before sexual activity. It does not contain L-Arginine, so headache may be a little more noticeable.'
          ]
        },
        {
          h: 'For women: KORB Electric',
          paras: [
            'KORB Electric is a topical gel applied directly to the clitoris about 30 minutes before sexual activity. It works by increasing local blood flow rather than acting on the whole body.',
            'Apply one to two clicks from the applicator. Wash your hands before and after. One bottle covers roughly 20 uses.'
          ]
        },
        {
          h: 'What to expect',
          items: [
            'These medications support your body\'s normal response. They do not create arousal on their own, so interest and stimulation still matter.',
            'The first attempt is not always the best measure. It is common to need a few tries to find your timing and the right amount.',
            'Alcohol and heavy meals both blunt the effect. A large, fatty meal beforehand is the most common reason people feel it did not work.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Headache',
              'The most common effect. Usually mild. Stay hydrated. Tell your provider if it persists.'
            ],
            [
              'Stuffy nose or flushing',
              'Common and temporary.'
            ],
            [
              'Upset stomach or nausea',
              'Common. Taking it on a lighter stomach may help.'
            ],
            [
              'Changes in vision, such as a blue tinge or blurring',
              'Uncommon. Stop and contact KORB if it happens.'
            ],
            [
              'Local irritation (KORB Electric)',
              'Wash the area. Tell your provider if it does not settle.'
            ]
          ],
          after: [
            '**Seek emergency care right away** for an erection lasting more than 4 hours, chest pain during or after sex, sudden loss of vision or hearing, fainting, or severe dizziness. An erection that will not go down is a medical emergency and can cause permanent damage if untreated.'
          ]
        },
        {
          h: 'Getting refills',
          paras: [
            'There is no lab work and no scheduled follow-up for this add-on. When you need more, send a message through the patient portal and your provider will review it. Do not wait until you are completely out.'
          ]
        }
      ],
      keyReminders: [
        'Never combine with nitrates for chest pain. This can be life-threatening.',
        'Take about 30 minutes before sexual activity. The effect lasts up to 36 hours.',
        'An erection lasting more than 4 hours is a medical emergency. Go to the emergency room.',
        'No lab work and no scheduled follow-up. Request refills through the portal before you run out.'
      ]
    },

    skin_care: {
      key: 'skin_care',
      file: 'Patient_Education/KORB_Patient_Ed_Skin_Care',
      program: 'KORB Health',
      title: 'Skin Care Treatment',
      disclaimer: 'This handout is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        'All three creams are applied once daily. Your provider selects which one fits your skin and your goals, and may start you at a lower strength.'
      ],
      sections: [
        {
          h: 'What you may be prescribed',
          cards: [
            [
              'Tretinoin',
              'Acne, oily skin, scarring and dark spots. A pea-sized amount once daily.'
            ],
            [
              'Estriol',
              'Dry skin, fine lines, elasticity and spots. One click once daily.'
            ],
            [
              'Combo cream',
              'A broader approach combining several active ingredients. One click once daily.'
            ]
          ]
        },
        {
          h: 'How to apply',
          items: [
            'Wash your face and let it dry completely first. Applying to damp skin increases irritation.',
            'Use only the amount described. More does not work faster and will irritate your skin.',
            'Apply at night unless your provider tells you otherwise.',
            'Avoid the corners of your nose, your eyes and your lips.',
            'Wash your hands afterwards.',
            'Follow with a plain moisturizer if your skin feels tight or dry.'
          ],
          after: [
            'These creams make your skin more sensitive to the sun. Use sunscreen daily, even in winter and on overcast days. Without it you are more likely to burn, and sun exposure will work directly against the spots and discolouration you are treating.'
          ]
        },
        {
          h: 'What to expect',
          paras: [
            'Skin often looks slightly worse before it looks better. Dryness, flaking and mild redness in the first few weeks are expected as your skin adjusts. Acne can briefly flare as blocked pores clear.',
            'If irritation is uncomfortable, tell your provider. Often the answer is to use it every other night for a while rather than stopping altogether. Most people see steady improvement over six to twelve weeks.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Dryness, flaking or peeling',
              'Expected early on. Moisturize and tell your provider if severe.'
            ],
            [
              'Redness or mild stinging on application',
              'Common at first. Should settle within a few weeks.'
            ],
            [
              'A short-lived acne flare',
              'Common as pores clear. Give it a few weeks.'
            ],
            [
              'Sunburn more easily than usual',
              'Use sunscreen daily. This is expected with these creams.'
            ],
            [
              'Breast tenderness or unexpected bleeding (estriol)',
              'Estriol contains a hormone. Contact KORB if this happens.'
            ]
          ],
          after: [
            'Tell your provider if you are pregnant, trying to conceive or breastfeeding. Tretinoin is not used in pregnancy. Estriol contains a hormone, so mention it if you already take hormone therapy through another KORB program so your full plan can be reviewed together.'
          ]
        }
      ],
      keyReminders: [
        'Apply once daily to clean, completely dry skin.',
        'A pea-sized amount is enough. More causes irritation without better results.',
        'Wear sunscreen every day.',
        'Expect dryness and a possible flare in the first few weeks.',
        'If irritation is too much, ask about every-other-night use rather than stopping.',
        'Tretinoin is not used in pregnancy. Tell your provider if you are pregnant or trying to conceive.'
      ]
    },

    weight_loss: {
      key: 'weight_loss',
      file: 'Patient_Education/KORB_WeightLoss_Program_Overview',
      program: 'KORB Health',
      title: 'Weight Loss Program Overview',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which treatment and dose are right for you. If you have questions, contact KORB.',
      intro: [
        'KORB\'s Weight Loss Program uses GLP-1 medication, semaglutide or tirzepatide, prescribed by your KORB provider and dispensed by a licensed US pharmacy. Your provider selects your medication and starting dose based on your goals and health history, and adjusts your plan at regular follow-up visits.'
      ],
      sections: [
        {
          h: 'About compounded medication',
          paras: [
            'Your medication is prepared for you by a licensed US compounding pharmacy. Compounding pharmacies are state-licensed and regulated, and they prepare each prescription to your provider\'s specifications rather than mass-producing it. This is what allows your dose to be tailored to you and adjusted over time.',
            'Because the FDA reviews mass-manufactured products rather than individual prescriptions, compounded preparations are not FDA-approved. The active ingredient is the same one used in the brand-name medication. If you would like to discuss a brand-name option, ask your provider whether it is a fit for you.'
          ]
        },
        {
          h: 'If you are also managing diabetes',
          paras: [
            'If you are managing diabetes or pre-diabetes, KORB can continue to provide your GLP-1 medication, but you should continue your diabetes care, including any related lab monitoring, with the clinician who manages it. That may be your primary care provider, an endocrinologist or another specialist.'
          ]
        },
        {
          h: 'Your medication options',
          cards: [
            [
              'Semaglutide',
              'A GLP-1 receptor agonist. Slows digestion and reduces appetite, which supports gradual, sustained weight loss. Injected once weekly, starting low and increasing every 4 weeks as tolerated.'
            ],
            [
              'Tirzepatide',
              'A dual GIP/GLP-1 receptor agonist. Works through two hormone pathways rather than one, which may support greater appetite reduction for some patients. Injected once weekly, with the same gradual increase.'
            ]
          ],
          after: [
            'Your provider will recommend which to start with, and may also discuss a daily oral option, either a tablet or a dissolvable troche, if injections are not the right fit.'
          ],
          links: [
            {
              href: 'KORB_Patient_Ed_Semaglutide.html',
              label: 'Semaglutide handout',
              note: 'full dosing, timing and storage'
            },
            {
              href: 'KORB_Patient_Ed_Tirzepatide.html',
              label: 'Tirzepatide handout',
              note: 'full dosing, timing and storage'
            }
          ]
        },
        {
          h: 'Pricing',
          paras: [
            'For current Weight Loss Program pricing, contact KORB Operations or ask your provider at your visit.'
          ]
        },
        {
          h: 'How your program works',
          items: [
            'Your first visit includes a full history and a review of whether GLP-1 therapy is safe and appropriate for you.',
            'Your provider selects your medication and starting dose.',
            'Your dose increases gradually, typically every 4 weeks, based on how you are tolerating it.',
            'You are reviewed at regular follow-up visits, where your plan is adjusted.'
          ]
        }
      ],
      keyReminders: [
        'Compounded medication is not FDA-approved. The active ingredient is the same one used in the brand-name product.',
        'If you have diabetes or pre-diabetes, keep that care with the clinician who manages it.',
        'Your dose increases gradually. Do not change it on your own.',
        'For current pricing, contact KORB Operations or ask your provider.'
      ]
    },

    mens_health: {
      key: 'mens_health',
      file: 'Patient_Education/KORB_MensHealth_Program_Overview',
      program: 'KORB Health',
      title: 'Men\'s Health Program Overview',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which treatment and dose are right for you. If you have questions, contact KORB.',
      intro: [
        'KORB\'s Men\'s Health Program is built around how you actually feel. The main program is Testosterone Replacement Therapy for men with lab-confirmed low testosterone and symptoms that go with it. Three optional add-ons are available alongside it: KORB Rise for sexual health, a hair loss treatment, and skin care.',
        'Men\'s Health also works alongside other KORB programs. Many men combine it with Weight Loss and Metabolic Health, or with Functional Health and Longevity. Your provider will confirm the combination is appropriate and make sure nothing conflicts.'
      ],
      sections: [
        {
          h: 'Testosterone Replacement Therapy',
          paras: [
            'Testosterone naturally declines with age. When levels fall low enough to cause symptoms, replacing it can help. Common reasons men start include ongoing fatigue, reduced strength or muscle mass, increased body fat, low sex drive, low mood or motivation, and poor recovery from exercise.'
          ],
          cards: [
            [
              'What it is',
              'Testosterone cypionate, a long-acting injectable form of testosterone.'
            ],
            [
              'How it is given',
              'A small injection you give yourself at home, either under the skin or into the muscle.'
            ],
            [
              'Labs',
              'Required before starting and at every follow-up.'
            ],
            [
              'Follow-up',
              'Every 12 weeks, or sooner if your provider recommends it.'
            ]
          ],
          after: [
            '**Testosterone is currently available to KORB patients in Texas and California only.** If you live elsewhere, ask your provider about other options that may fit your goals.',
            '**Labs are not optional.** Testosterone affects your red blood cell count, your prostate and your hormone balance, and those changes are not always something you can feel. Regular lab work is how your provider keeps your dose in the right range and catches problems early.'
          ]
        },
        {
          h: 'Add-ons available alongside',
          links: [
            {
              href: 'KORB_Patient_Ed_Sexual_Health.html',
              /* No note. It carried "no lab work required" and its two siblings
                 carried nothing, so one button in three had a caption hanging
                 under it and the set read as cluttered rather than as a set.
                 Don, 2026-09-18. Nothing is lost: the handout this opens says
                 "There is no lab work and no scheduled follow-up for this
                 add-on" in its body and again in its reminders. The button is a
                 way in, not the place to state the fact. */
              label: 'KORB Rise, sexual health'
            },
            {
              href: 'KORB_Patient_Ed_Hair_Loss.html',
              label: 'Hair loss treatment'
            },
            {
              href: 'KORB_Patient_Ed_Skin_Care.html',
              label: 'Skin care'
            }
          ],
          after: [
            '**Do not take KORB Rise if you take nitrates for chest pain.** The combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.'
          ]
        },
        {
          h: 'Pricing',
          paras: [
            'For current Men\'s Health Program pricing, contact KORB Operations or ask your provider at your visit.'
          ]
        }
      ],
      keyReminders: [
        'Testosterone is available to KORB patients in Texas and California only.',
        'Labs are required before starting and at every follow-up. They are not optional.',
        'Follow-up is every 12 weeks, or sooner if your provider recommends it.',
        'Never take KORB Rise with nitrates for chest pain.'
      ]
    },

    womens_health: {
      key: 'womens_health',
      file: 'Patient_Education/KORB_WomensHealth_Program_Overview',
      program: 'KORB Health',
      title: 'Women\'s Health Program Overview',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which treatment and dose are right for you. If you have questions, contact KORB.',
      intro: [
        'KORB\'s Women\'s Health Program treats the symptoms of perimenopause, menopause and the years after. Treatment is hormone therapy, matched to your symptoms and your health history, and prescribed by a licensed KORB provider.',
        'Most women come to us for hot flashes, night sweats, disrupted sleep, mood changes, vaginal dryness or painful intercourse, low libido, or the mental fog that often comes with this stage. You do not need to have all of them, and you do not need to wait until they are severe.'
      ],
      sections: [
        {
          h: 'The three stages',
          cards: [
            [
              'Perimenopause',
              'Hormones fluctuate and periods become irregular. Symptoms often start here.'
            ],
            [
              'Menopause',
              'Twelve months without a period.'
            ],
            [
              'Postmenopause',
              'The years afterwards, when lower hormone levels affect bone and heart health.'
            ]
          ]
        },
        {
          h: 'What you may be prescribed',
          lead: 'Your provider chooses from three hormones, alone or in combination.',
          cards: [
            [
              'Estradiol',
              'The main treatment for hot flashes, night sweats, sleep and vaginal dryness. Comes as a skin patch or cream.'
            ],
            [
              'Progesterone',
              'Protects the uterus when you take estrogen. Also helps sleep and mood. A capsule taken at night.'
            ],
            [
              'Testosterone',
              'Supports libido, energy, mood and muscle strength. A cream.'
            ]
          ],
          after: [
            'Testosterone is currently available to KORB patients in Texas and California only. Estradiol and progesterone are available everywhere we operate.',
            '**If you still have your uterus, you will always be prescribed progesterone alongside estrogen. This is not optional and it is not an upsell.** Estrogen on its own thickens the lining of the uterus over time, which raises cancer risk. Progesterone prevents that.'
          ]
        },
        {
          h: 'Timing matters',
          paras: [
            'Hormone therapy works best and carries the least risk when it is started under age 60 and within about ten years of your last period. That does not mean it is unavailable outside that window, but your provider will weigh it differently and will talk it through with you.'
          ]
        },
        {
          h: 'How your treatment is adjusted',
          paras: [
            'This program is guided by how you feel, not by a lab number. There is no blood test that tells us the right dose for you, so your provider adjusts based on your symptoms and how you are responding.'
          ]
        },
        {
          h: 'Pricing',
          paras: [
            'For current Women\'s Health Program pricing, contact KORB Operations or ask your provider at your visit.'
          ]
        }
      ],
      keyReminders: [
        'If you still have your uterus, progesterone is always prescribed alongside estrogen. This is not optional.',
        'Testosterone is available in Texas and California only. Estradiol and progesterone are available everywhere we operate.',
        'Hormone therapy works best started under 60 and within about ten years of your last period.',
        'This program is guided by your symptoms, not by a lab number.'
      ]
    },

    start_here: {
      key: 'start_here',
      file: 'Patient_Education/KORB_Start_Here_Guide',
      program: 'Functional Health & Longevity',
      title: 'Start Here Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'This is the first thing to read after your baseline visit. It tells you what order to read everything else in, what happens in your first cycle, and what to do if something does not feel right.'
      ],
      sections: [
        {
          h: 'Read your materials in this order',
          lead: 'Each one assumes you have read the one before it.',
          links: [
            {
              href: 'KORB_Longevity_Program_Overview.html',
              label: 'Program Overview',
              note: 'what the program is and how a cycle runs'
            },
            {
              label: 'Your Tier Overview',
              note: 'open the one your provider confirmed for you',
              choices: [
                { href: 'KORB_Foundation_Program_Overview.html', label: 'Foundation' },
                { href: 'KORB_Gateway_Program_Overview.html', label: 'Gateway' },
                { href: 'KORB_Peak_Program_Overview.html', label: 'Peak Performance' }
              ]
            },
            {
              label: 'Your Medication Guide',
              note: 'open the handout for the agent you were prescribed',
              choices: [
                { href: 'KORB_Patient_Ed_Sermorelin.html', label: 'Sermorelin' },
                { href: 'KORB_Patient_Ed_CJC_Ipamorelin.html', label: 'CJC-1295 / Ipamorelin' },
                { href: 'KORB_Patient_Ed_BPC157.html', label: 'BPC-157' },
                { href: 'KORB_Patient_Ed_Tesamorelin.html', label: 'Tesamorelin' },
                { href: 'KORB_Patient_Ed_GHK_Cu.html', label: 'GHK-Cu (Add-On)' }
              ]
            },
            {
              href: 'KORB_Injection_Storage_Safety_Guide.html',
              label: 'Injection, Storage and Safety Guide',
              note: 'read before your first injection'
            },
            {
              href: 'KORB_When_to_Contact_KORB_or_ER.html',
              label: 'When to Contact KORB or the ER',
              note: 'keep this one handy'
            }
          ],
          after: [
            'Your pharmacy also sends instructions with your medication. Those are specific to what you were dispensed, and they take priority over anything general written here.'
          ]
        },
        {
          h: 'Your first cycle, in order',
          items: [
            'Baseline visit. Labs only. No prescription is sent at this visit.',
            'Your labs come back, usually within about a week.',
            'KORB Operations schedules the visit that starts your 16-week cycle.',
            'At that visit your provider reviews your labs and confirms your tier and your medication.',
            'Your medication ships from the pharmacy with its own instructions.',
            'A lab order is placed for a draw between weeks 12 and 14, so results are back before your follow-up.',
            'At your 16-week follow-up your provider reviews everything and decides the next cycle with you.'
          ]
        },
        {
          h: 'Lifestyle still matters',
          lead: 'These therapies support nutrition, training and sleep. They do not replace them, and response is noticeably better in people who have the basics in place.',
          items: [
            'Nutrition. Adequate protein, and enough total food to support recovery.',
            'Movement. Resistance training if you are able, plus regular general activity.',
            'Recovery. Consistent sleep, and honest management of stress and alcohol.'
          ]
        },
        {
          h: 'What to expect after starting',
          paras: [
            'Response varies between patients. These are not guaranteed treatments, and results, if any, usually emerge gradually across a cycle rather than in the first week or two.',
            'Mild injection-site redness or irritation is common early on and usually settles. Anything severe, spreading, or accompanied by trouble breathing or swelling is not expected, and is covered in the contact guide.'
          ]
        }
      ],
      keyReminders: [
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'Your pharmacy instructions and your prescription label take priority over any general guide.',
        'Read the Injection, Storage and Safety Guide before your first injection.',
        'Nothing here is personalized medical advice. Your provider decides your tier and your medication.'
      ]
    },

    /* BOTH WELCOME LETTERS WERE RETIRED HERE ON 2026-09-19, by Don.
       `glp1_welcome` (KORB_GLP1_Welcome_Letter) and `welcome`
       (KORB_Welcome_Letter, the Functional Health & Longevity one) stood here.
       Git has them.

       WHY THEY ARE GONE FROM THE DATA AND NOT JUST UNLINKED. build-patient-ed.js
       writes a page for every key in these collections. Leaving the entries and
       putting a redirect at the .html would have worked exactly until the next
       build overwrote the redirect with a regenerated letter. A retired page has
       no entry.

       WHY THEY WERE RETIRED. From Monday 2026-09-22 patients are sent to
       KORB_Patient_Hub.html by a text snippet with a per-program dropdown, not
       to a letter. The hub carries the same information, shows a patient the
       other programs they may want, and is one place to update instead of
       three. The GLP-1 letter was written and, per Don, never actually used.

       THE TWO .html FILES ARE STILL PUBLISHED, as redirects to the hub. They
       are NOT deleted, for the same reason KORB_GLP1_Provider_Tool.html was not:
       those URLs were handed out. Same rule as the bridge PDF. */

    labs: {
      key: 'labs',
      file: 'KORB_Schedule_Your_Lab_Appointment',
      /* NOT a program document. Men's Health uses this same page for its
         baseline and trough draws, and it sits in the hub's cross-program
         reference row beside sharps disposal and the compounding Q&A. It said
         Functional Health & Longevity because that is who it was written for
         first. Don, 2026-09-19. */
      program: 'All Programs',
      title: 'Schedule Your Quest Lab Appointment',
      root: true,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'Your Quest Diagnostics lab order has been placed. The next step is to book your draw.'
      ],
      sections: [
        {
          h: 'Book your appointment',
          paras: [
            'Booking at Quest Diagnostics takes about a minute.'
          ],
          /* The URLs are in korb-quest.js, because KORB_Patient_Treatment_Schedule
             .html needs the same four and is a weekly tool that has no business
             downloading 184KB of handout prose to render one info box. That page
             is the one the Functional Health and Longevity welcome letter links
             to, and Don confirmed on 2026-09-18 it is the one to keep. */
          shared: 'quest'
        },
        {
          h: 'How to prepare',
          lead: 'Unless your provider has told you otherwise:',
          items: [
            'Fast for 8 to 12 hours.',
            'Drink plenty of water.',
            'Complete your draw before 10:00 AM.',
            'Morning and fasting is preferred wherever possible.'
          ]
        },
        {
          h: 'What happens next',
          paras: [
            'Results usually take about a week from the day your blood is drawn. The clock starts at your draw, not when your order was placed and not when you booked. Once we have received and reviewed them, our team contacts you to schedule your follow-up appointment and discuss next steps.',
            'If your results are not back in time, your follow-up visit may need to be rescheduled. Completing your draw in the window you were given is what prevents that.'
          ]
        },
      ]
    },

    injection: {
      key: 'injection',
      file: 'Patient_Education/KORB_Injection_Storage_Safety_Guide',
      /* NOT an FH&L document, and NOT an all-programs one either. GLP-1, weight
         loss and Men's Health all use it and the technique is the same
         subcutaneous injection in all three. Women's Health is patches, creams
         and capsules and none of this applies to it, and gut health will add
         oral products. It said All Programs for part of 2026-09-19, which told
         a woman on a patch that a syringe document was written for her.
         A document about injecting says who injects. */
      program: 'All injectable programs',
      title: 'Injection, Storage and Safety Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'Read this before your first injection. It covers what to have ready, how to check your medication, how to store it, sharps disposal and travel.'
      ],
      sections: [
        {
          h: 'Before you inject',
          lead: 'Have these ready before you start.',
          items: [
            'Your medication, taken out of the fridge.',
            'Alcohol pads.',
            'A new insulin needle and syringe.',
            'A rigid, puncture-resistant container for the used needle and syringe.',
            'A clean surface and good lighting.'
          ]
        },
        {
          h: 'Check your medication first',
          lead: 'Do not inject, and contact KORB, if any of these are true.',
          items: [
            'The solution is cloudy or discolored, or has particles in it.',
            'The vial is cracked or damaged.',
            'The vial is past 28 days from first use, or past the beyond-use date on your label.',
            'The medication has been frozen, or has been left in heat above 86°F (30°C).'
          ]
        },
        {
          h: 'Storage',
          shared: 'storage'
        },
        {
          h: 'Injection safety',
          shared: 'injectionSafety'
        },
        {
          /* Don, 2026-09-19: sharps disposal is the patient's responsibility and
             it is set locally, so the job of this document is to say that plainly
             and hand them the lookup - not to imply KORB requires a particular
             product. SafeNeedleDisposal.org is the same source the hub already
             uses for this. */
          h: 'Sharps disposal',
          paras: [
            'Used needles and syringes go straight into something rigid and puncture-resistant. Never loose into household trash, and never into recycling.',
            'What counts as an acceptable container, and how you get rid of it once it is full, is decided where you live and varies by state and by city. Some areas have drop-off sites, some run mail-back programs, some allow a sealed heavy-duty household container. Looking up your own area is the only way to get this right, and it is yours to do.'
          ],
          links: [
            {
              href: 'https://safeneedledisposal.org/',
              label: 'Find sharps disposal near you',
              note: 'search by ZIP code, from SafeNeedleDisposal.org'
            }
          ]
        },
        {
          h: 'Injection technique',
          paras: [
            'Prepare the exact dose you were instructed to use. Your prescription label and your pharmacy instructions are the authoritative source for your dose, not any general guide.',
            'These medications are given subcutaneously, into the fat layer just under the skin, not into muscle or a vein. Rotate your injection sites rather than using the same spot repeatedly.'
          ]
        },
        {
          h: 'Mild injection-site reactions',
          paras: [
            'Some redness, mild swelling or itching at the injection site is common and usually settles on its own within a day or two. Rotating sites helps.',
            'Contact KORB if a reaction does not resolve, keeps getting worse, or spreads well beyond the injection site. Trouble breathing, or swelling of the face, lips, tongue or throat, is an emergency and is not something to message about.'
          ]
        },
        {
          h: 'Traveling with your medication',
          shared: 'travel'
        }
      ],
      keyReminders: [
        'A new needle and syringe every time. Never reuse, and never combine two medications in one syringe.',
        'Write the open date on the vial and discard 28 days after first use, or earlier if your label says so.',
        'Your prescription label is the authoritative source for your dose and directions.',
        'Sharps rules are local and they are yours to look up. Find what your area requires and dispose of needles and syringes that way.'
      ]
    },

    contact: {
      key: 'contact',
      file: 'Patient_Education/KORB_When_to_Contact_KORB_or_ER',
      /* Every program contacts KORB the same way and the emergency list is not
         program-specific. Don, 2026-09-19, same correction as the lab page and
         the injection guide. */
      program: 'All Programs',
      title: 'When to Contact KORB or the ER',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'Keep this one handy. It covers who to contact, for what, and what counts as an emergency rather than a message.'
      ],
      sections: [
        {
          h: 'Who to contact, and for what',
          shared: 'contact'
        },
        {
          /* ASK ONLY FOR WHAT KORB DOES NOT ALREADY HAVE. Don, 2026-09-19: a
             message through the portal already carries the patient's name, and
             the prescription and schedule are on file. What is not on file is
             what actually went in and when. The old list asked for the name,
             the prescribed dose and the therapy start date - three things the
             chart already answers - and it did not ask for the one injection
             the patient is calling about. */
          h: 'What to include in your message',
          lead: 'Your name reaches us with the message, and we have your prescription on file. What we do not have is what you actually took and when, so start with these.',
          /* NOT "injected". This document now serves all four programs, and
             Women's Health hormone therapy is patches, creams and capsules -
             nothing in that program is injected. Asking a woman on a patch how
             much she injected reads as a document written for somebody else.
             Same correction as "never mix peptides" on the injection guide. */
          items: [
            'Which product you took.',
            'How much you actually took.',
            'When your last dose was.',
            'What you are experiencing, and when it started.',
            'Anything you have already tried, and anything else you think matters.'
          ]
        },
        {
          h: 'Not an emergency, but worth a message',
          items: [
            'Mild side effects that are not urgent, whatever form your medication takes.',
            'Localized irritation, redness or soreness that does not resolve, wherever you inject or apply your medication.',
            'Nausea, digestive upset or appetite changes that are not settling.',
            'Sleep changes, flushing, or a mild rash or itching.',
            'Questions about whether to continue therapy.',
            'A concern that therapy is not helping.',
            'Dose instructions, timing or storage questions.',
            'Pharmacy, shipping, scheduling or billing questions.'
          ]
        },
        {
          h: 'Go to emergency care instead of messaging',
          lead: 'These are not things to email about. Call 911 or go to your nearest emergency room.',
          items: [
            'Trouble breathing, or swelling of the face, lips, tongue or throat.',
            'Severe rash or widespread hives.',
            'Chest pain, or fainting.',
            'Confusion, or severe weakness.',
            'Severe or rapidly worsening symptoms.',
            'Any symptom that feels urgent or unsafe.'
          ],
          after: [
            'Phone and email are not appropriate for emergencies, and they are not monitored around the clock. When in doubt, go to urgent care or the emergency room. Nobody at KORB will think you overreacted.'
          ]
        }
      ],
      keyReminders: [
        'Phone and email are business hours only and are not for emergencies.',
        'Trouble breathing or swelling of the face, lips, tongue or throat is an emergency. Call 911.',
        'Tell us which product you took, how much, and when, so your provider can answer in one reply.'
      ]
    }
  },

  docs: {
    /* ------------------------------------------------------------------------
       HORMONE THERAPY - the ninth handout, and the first for Women's Health.

       Converted 2026-09-16, the last of the patient PDFs still unconverted. The
       other eight cover peptides, GLP-1 and testosterone; women's health had
       three hand-made PDFs from 9 and 10 September and no HTML.

       ONE handout, not one per hormone. The peptide handouts are one per agent
       because a patient takes one peptide. A woman on hormone therapy is
       usually on two or three at once - estradiol with progesterone, often
       testosterone as well - so splitting them would hand her three documents
       that each omit two thirds of what she is taking.

       Clinical content follows korb-womens-data.js, which Don signed the same
       day, rather than the November 2025 programme document. Where that file
       says something in provider language this says the same thing in hers.

       STORAGE AND TRAVEL ARE OVERRIDDEN. The shared blocks say refrigerate,
       which is right for peptides and wrong for every product here - patches,
       creams and capsules are all room temperature. That is the mistake the
       testosterone handout hit in September and it is the same fix.
       ------------------------------------------------------------------------ */
    hormone_therapy: {
      key: 'hormone_therapy',
      file: 'KORB_Patient_Ed_HormoneTherapy',
      title: 'Hormone Therapy',
      source: 'none',
      program: "Women's Health",

      /* NOTHING IN THIS PROGRAMME IS INJECTED. The shared blocks are written for
         the eight injectable handouts and said so in four places - the facts
         table headed "How to inject", the "as directed" note about vials, the
         injection-safety list with sharps disposal, and injection-site
         irritation in the portal column. All four are overridden here. */
      factLabels: { how: 'How you take it', timing: 'When to take it' },
      noInjectionSafety: true,

      authoritySource: 'Your prescription label, or the instructions given to you ' +
        'by your KORB clinical provider, is the authoritative source for your dose ' +
        'and directions. What follows is a general reference. Do not adjust ' +
        'anything without speaking to your provider first.',

      portalItems: [
        'Skin irritation where you apply a cream or patch',
        'Mild but persistent side effects',
        'Questions about whether to continue therapy',
        'Interest in other KORB programmes, including sexual health'
      ],

      facts: {
        how: 'Patch, cream or capsule, depending on which hormones you are prescribed',
        timing: 'Follow your label. Progesterone capsules are taken at night; ' +
                'creams and patches are applied at the same time each day.',
        schedule: 'As stated on your prescription label'
      },

      what: [
        'Hormone therapy replaces hormones your body has stopped making in the ' +
        'amounts it used to. Around menopause, estrogen and progesterone fall, ' +
        'and testosterone falls too. That decline is what causes hot flashes, ' +
        'night sweats, disturbed sleep, vaginal dryness, low mood and the ' +
        'difficulty concentrating many women describe as brain fog.',

        'The hormones KORB prescribes are bioidentical, meaning they are ' +
        'structurally the same as the ones your body makes. You may be ' +
        'prescribed one, two or three of them, and they are counted that way ' +
        'when your programme is priced.',

        'Most of them are absorbed through the skin rather than swallowed. That ' +
        'matters: going through the skin avoids the first pass through your ' +
        'liver, which is why a patch or cream carries a lower risk of blood ' +
        'clots than an oral estrogen does.'
      ],

      mayHelp: {
        lead: 'Hormone therapy is prescribed for symptoms that are affecting ' +
              'your quality of life, most commonly:',
        items: [
          'Hot flashes and night sweats',
          'Sleep that is broken or unrefreshing',
          'Vaginal dryness, or discomfort with intercourse',
          'Low mood, irritability, or mood that swings more than it used to',
          'Difficulty concentrating - brain fog',
          'Low libido, low energy, loss of muscle tone'
        ]
      },

      extraSections: [
        {
          h: 'The hormones you may be taking',
          table: {
            head: ['Hormone', 'What it is for', 'How you take it'],
            rows: [
              ['Estradiol',
               'The main estrogen. Treats hot flashes, night sweats, sleep and ' +
               'vaginal dryness, and supports bone.',
               'A patch changed once a week, or a cream you apply daily.'],
              ['Progesterone',
               'Protects the lining of the uterus, and helps sleep.',
               'A capsule taken at night.'],
              ['Testosterone',
               'Supports libido, energy, mood and muscle. Women make it too, and ' +
               'it falls at menopause.',
               'A cream you apply daily. Available in Texas and California only.']
            ]
          }
        },
        {
          h: 'Why progesterone matters if you still have a uterus',
          callout: 'If you still have a uterus, you will always be prescribed ' +
            'progesterone alongside estrogen. Estrogen on its own thickens the ' +
            'lining of the uterus, and over time that can lead to cancer. ' +
            'Progesterone prevents it. This is not optional and it is not a ' +
            'preference - if you have been prescribed estrogen without ' +
            'progesterone and you have not had a hysterectomy, contact us before ' +
            'you start.',
          p: [
            'If you have had a hysterectomy, you do not need progesterone. There ' +
            'is no lining to protect, and adding it would not help you.',
            'If you still have regular periods, your progesterone is taken on a ' +
            'cycle - 21 days on, then 7 days off - rather than every night. Your ' +
            'label will tell you which.'
          ]
        },
        {
          h: 'How to apply a cream',
          callout: 'One click is one measured dose. Do not guess at it and do ' +
            'not double up if you miss one.',
          table: {
            head: ['Step', 'What to do'],
            rows: [
              ['1', 'Wash your hands.'],
              ['2', 'Apply to thin, hairless skin - the inner thigh, the inner ' +
                    'forearm, or the back of the upper arm.'],
              ['3', 'Rub it in and let it dry completely before you dress or ' +
                    'touch anyone.'],
              ['4', 'Wash your hands again, thoroughly.'],
              ['5', 'Rotate where you apply it. Using the same patch of skin ' +
                    'every day reduces how well it absorbs.']
            ]
          },
          p: [
            'Hormone cream transfers by skin contact. Until it has dried, it can ' +
            'pass to a partner, a child or a pet. Let it dry, and wash your hands.'
          ]
        },
        {
          h: 'How to use a patch',
          /* Same shape as the cream section above - a lead line, a numbered
             table, then the one rule worth pulling out. It was three loose
             paragraphs and read as an afterthought beside the cream steps. */
          p: [
            'A patch is changed once a week and worn continuously in between, ' +
            'including in the shower.'
          ],
          table: {
            head: ['Step', 'What to do'],
            rows: [
              ['1', 'Wash your hands.'],
              ['2', 'Apply to clean, dry skin on the lower abdomen or the upper ' +
                    'buttock. Never the breasts, and never on skin that is broken ' +
                    'or irritated.'],
              ['3', 'Press it flat with your palm for about 10 seconds so the ' +
                    'edges seal.'],
              ['4', 'Leave it on until your change day. It is fine to shower, ' +
                    'bathe and swim with it on.'],
              ['5', 'Change it on the SAME day each week, and put the new one on ' +
                    'a slightly different spot.']
            ]
          },
          callout: 'If a patch falls off, put a new one on straight away and keep ' +
            'your usual change day. Do not wait, and do not double up.'
        }
      ],

      storage: {
        cards: [
          ['Patches and capsules', 'Room temperature, 68°F – 77°F (20°C – 25°C). No refrigeration.'],
          ['Compounded creams', 'FOLLOW THE INSTRUCTIONS THAT CAME WITH YOUR CREAM. Some compounding pharmacies ship them cold and ask you to keep them refrigerated; others do not. Your pharmacy label is the answer.'],
          ['Keep the cap on the pump', 'And store creams upright'],
          ['Out of reach', 'Of children, and of anyone else in the house']
        ],
        notes: [
          'Your programme runs in 12-week blocks, but the amount dispensed at one ' +
          'time varies by product and by pharmacy - anywhere from about 4 weeks to ' +
          '12. Some creams are sent a month at a time with refills. Go by what your ' +
          'label and your pharmacy tell you rather than by the calendar.',
          'If medication is left over when your next supply arrives, start the new ' +
          'one rather than finishing the old.'
        ]
      },

      travel: 'Hormone therapy travels easily. Keep everything in your carry-on ' +
        'rather than a checked bag, leave it in its original labelled container, ' +
        'Patches and capsules need no cold storage at all; if your cream came ' +
        'with instructions to keep it refrigerated, take a small insulated bag. ' +
        'If you are crossing time ' +
        'zones, keep your patch change day and your nightly capsule on your home ' +
        'schedule until you are settled.',

      common: [
        ['Breast tenderness or swelling',
         'Common in the first few weeks. Tell us if it does not settle - it often ' +
         'responds to a small change in dose.'],
        ['Headache',
         'Usually early and short-lived. Tell us if it is new for you or persistent.'],
        ['Bloating or fluid retention',
         'Common early. Reducing salt and keeping hydrated helps.'],
        ['Mood changes',
         'Tell us. Mood is one of the things dose adjustment tends to fix.'],
        ['Nausea',
         'More common with capsules. Taking it with a little food at night helps.'],
        ['Spotting, or a change in your bleeding',
         'Expected in the first months, especially if you are cycling ' +
         'progesterone. Tell us at your visit, and sooner if it is heavy.'],
        ['Acne, or more hair growth on the face or body',
         'Usually testosterone. Tell us - the dose can come down.']
      ],
      monitorAndTell: [
        ['Bleeding that is new, heavy, or after you had stopped altogether',
         'Always tell us. It needs looking at rather than waiting for your visit.'],
        ['A lump in the breast, or breast pain that does not settle',
         'Tell us, and book with your primary care provider or your gynecologist. ' +
         'KORB is a telemedicine practice and cannot examine or image you - a ' +
         'breast lump needs someone in the room.'],
        ['Mood that is getting worse rather than better',
         'Tell us. Do not wait out a low mood on the assumption it will pass.'],
        ['Headaches that are new or unusual for you',
         'Tell us before your next dose.'],
        ['A change in your voice, or hair growth you are unhappy with',
         'Tell us early. Voice changes do not reverse, so we would rather hear ' +
         'about it at the first sign.'],
        ['No improvement at all after 12 weeks',
         'Tell us at your visit. It usually means the dose or the route needs ' +
         'changing, not that hormone therapy will not work for you.']
      ],
      labs: {
        lead: 'KORB uses at-home saliva collection rather than a blood draw for ' +
              'hormone levels.',
        items: [
          'A kit is mailed to you. You collect the sample at home and mail it ' +
          'back in the prepaid envelope provided.',
          'Saliva is used deliberately. It measures the fraction of the hormone ' +
          'that is actually reaching your tissues, which is what matters when ' +
          'the hormone is going through your skin. A blood level barely moves ' +
          'after a cream, so it would tell your provider very little.',
          'The complete panel adds a small finger-prick blood spot for thyroid, ' +
          'because thyroid problems cause many of the same symptoms and are ' +
          'worth ruling out.'
        ]
      },

      safety: [
        'Tell your provider before you start if you have had breast cancer, ' +
        'endometrial cancer, or any cancer that was sensitive to estrogen.',
        'Tell your provider if you have had a blood clot or a clotting disorder, ' +
        'or if a close relative has.',
        'Tell your provider if you have had a stroke or a heart attack, or if ' +
        'your blood pressure is not controlled.',
        'Tell your provider if you have liver disease.',
        'Tell your provider about any vaginal bleeding that has not been explained.',
        'Tell us if you have a PEANUT ALLERGY. The commercial progesterone ' +
        'capsule is made with peanut oil. A compounded capsule is not, and we ' +
        'will prescribe that one instead - so this does not stop you having ' +
        'progesterone.',
        'If you still have a uterus, never take estrogen without progesterone.',
        'Do not change your own dose, and do not use anyone else\'s hormones.'
      ],
      emergencyLead: 'Call 911 or go to an emergency room if you have any of these:',

      keyReminders: [
        'If you have a uterus, never take estrogen without progesterone.',
        'Let creams dry fully before contact with anyone else, and wash your hands.',
        'Progesterone is taken at night. It helps you sleep.',
        'Your prescriptions run 12 weeks, and your follow-up is at 12 weeks.',
        'Do not change your own dose. Tell us what you are feeling and we will ' +
        'change it with you.',
        'Patches and capsules need no refrigeration. For creams, follow the ' +
        'instructions that came with them.',
        'KORB also offers a SEXUAL HEALTH programme. If low libido or arousal is ' +
        'something you would like addressed, tell your provider - there are ' +
        'options beyond hormone therapy.'
      ]
    },


    sermorelin: {
      key: 'sermorelin',
      file: 'KORB_Patient_Ed_Sermorelin',   /* the PUBLISHED name. Deriving it from the title
                                  invented KORB_Patient_Ed_CJC_1295_Ipamorelin and would
                                  have left the old file beside the new one. */
      title: 'Sermorelin',
      agentKey: 'sermorelin',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      washoutWeeks: 4,

      what: [
        'Sermorelin is a synthetic peptide that stimulates your pituitary gland to ' +
        'release growth hormone (GH) naturally. It belongs to a class of compounds ' +
        'called growth hormone releasing hormone (GHRH) analogs.',
        'The key distinction: Sermorelin does not replace growth hormone. It ' +
        'encourages your own pituitary gland to produce and release GH through its ' +
        'normal pathways. Because it works with your body’s existing system, it ' +
        'is considered a more physiologic approach than direct GH replacement.',
        'Growth hormone release triggered by Sermorelin also stimulates your liver ' +
        'to produce IGF-1 (insulin-like growth factor 1). Your IGF-1 level is one of ' +
        'the key markers your provider will monitor throughout your program.'
      ],

      mayHelp: {
        lead: 'This medication is one possible adjunctive support option for patients ' +
              'with goals related to:',
        items: [
          'Sleep quality, particularly deep, restorative sleep',
          'Recovery, both exercise recovery and general recovery physiology',
          'Body composition, lean mass preservation and fat metabolism as part of a lifestyle program',
          'Energy and wellness, a general sense of vitality',
          'GH-axis support as part of a structured longevity program'
        ],
        after: 'Response to Sermorelin varies from patient to patient. Some patients ' +
               'notice changes within the first few weeks; others notice little or ' +
               'nothing over an entire cycle. This is normal. Sermorelin is an ' +
               'adjunctive support option, not a cure, not a guaranteed treatment, and ' +
               'not a replacement for lifestyle foundations.'
      },

      timingNotes: [
        ['Timing matters',
         'Sermorelin should be injected at bedtime, on an empty stomach. GH is ' +
         'released naturally in pulses during sleep, particularly during the first ' +
         'few hours of deep sleep, and injecting at bedtime aligns with that rhythm. ' +
         'Food, particularly carbohydrates, can blunt GH release. Wait at least two ' +
         'hours after your last meal before injecting.'],
        ['The rest day is intentional',
         'Do not inject on your rest day, and do not make up a missed dose on it. If ' +
         'you miss a dose on a scheduled day, skip it rather than doubling up the ' +
         'next day.']
      ],

      timeline: [
        ['Weeks 1–4', 'Starting out',
         'Some patients notice early changes in sleep quality or morning energy.'],
        ['Weeks 4–8', 'Early response',
         'Many notice nothing yet. This is normal.'],
        ['Weeks 8–12', 'Continued support',
         'Sleep quality, recovery and energy may begin to improve. Do not adjust your schedule.'],
        ['Weeks 13–16', 'Off cycle — labs and lifestyle',
         'No injections; this is intentional. Your labs, drawn between weeks 12 and 14, ' +
         'are reviewed during this window, and it is a good stretch to focus on ' +
         'nutrition, exercise and sleep before your next cycle. Do not restart early ' +
         'without provider direction.']
      ],
      timelineNote:
        'Do not compare your response to others. Response is highly individual. Age, ' +
        'baseline GH levels, body composition, sleep quality and lifestyle habits all ' +
        'influence it.',

      common: [
        ['Injection site redness or irritation',
         'Common, usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Flushing or warmth after injection', 'Typically brief, and usually settles within minutes.'],
        ['Headache', 'May occur early in therapy. Usually mild and short-lived.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Water retention or puffiness',
         'Can occur with GH stimulation. Tell your KORB provider if noticeable.'],
        ['Joint discomfort or tingling',
         'May indicate a dose adjustment is needed. Tell your KORB provider.'],
        ['Sleep changes',
         'Some patients report improved sleep; rarely, disrupted sleep early on.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. Your ' +
              'provider uses labs to assess your response and your safety.',
        items: [
          'IGF-1, your primary response marker. The target is the physiologic range; higher is not better.',
          'HbA1c and fasting glucose, because GH stimulation can affect glucose metabolism.',
          'Thyroid (TSH, free T4, free T3). Sermorelin requires a functioning thyroid axis.',
          'CBC, CMP, lipid panel, copper, zinc and ceruloplasmin, at baseline and every 16-week follow-up.',
          'PSA, added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use Sermorelin only as prescribed. Do not change your dose, schedule or route without provider direction.',
        'Do not combine it with other GH-axis therapies unless KORB specifically instructs you to.',
        'Sermorelin is not appropriate during active malignancy, uncontrolled thyroid disease, or pregnancy.',
        'Do not restart after your off weeks early. The washout period is intentional.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Sermorelin stimulates your own GH. It is not GH replacement.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Your washout period is intentional. Do not restart early.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Response varies, and more is not better. Do not adjust your dose without provider direction.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    tesamorelin: {
      key: 'tesamorelin',
      file: 'KORB_Patient_Ed_Tesamorelin',   /* the PUBLISHED name. Deriving it from the title
                                  invented KORB_Patient_Ed_CJC_1295_Ipamorelin and would
                                  have left the old file beside the new one. */
      title: 'Tesamorelin',
      agentKey: 'tesamorelin1mg',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      washoutWeeks: 4,

      what: [
        'Tesamorelin is a synthetic analog of growth hormone releasing factor (GRF). ' +
        'It stimulates the pituitary gland to release growth hormone (GH) naturally. ' +
        'It does not replace GH; it encourages your own body to produce it.',
        'Tesamorelin has the strongest human clinical evidence base among the peptides ' +
        'in the KORB Longevity Program. It is FDA-approved for HIV-associated ' +
        'lipodystrophy and is used in the KORB program off-label for body composition ' +
        'support, specifically targeting visceral adiposity reduction.',
        'Your provider selects your dose based on your goals, labs and clinical profile. ' +
        'Your IGF-1 and glucose response will be reviewed at every 16-week follow-up visit.'
      ],

      mayHelp: {
        lead: 'This medication is one possible adjunctive support option for patients ' +
              'with goals related to:',
        items: [
          'Visceral and central adiposity reduction, the fat around the organs',
          'Body composition and metabolic health',
          'IGF-1 axis support as part of a structured longevity program'
        ],
        after: 'Response varies between patients. Clinical studies show visceral fat ' +
               'reduction over sustained cycles, but individual results depend on ' +
               'baseline body composition, lifestyle, diet, exercise and other factors. ' +
               'Your provider will assess your response at each follow-up visit.'
      },

      timingNotes: [
        ['Timing matters',
         'Tesamorelin should be injected at bedtime, on an empty stomach. GH is released ' +
         'naturally in pulses during sleep, particularly during the first few hours of ' +
         'deep sleep, and injecting at bedtime aligns with that rhythm. Food, ' +
         'particularly carbohydrates, can blunt GH release. Wait at least two hours ' +
         'after your last meal before injecting.'],
        ['Your dose is chosen for you',
         'Your specific dose and strength are decisions your KORB provider makes based ' +
         'on your goals, labs and clinical profile. They are not something to choose or ' +
         'change yourself. Your dose is compounded specifically for you, so always ' +
         'follow the exact units on your prescription label, or your provider\u2019s ' +
         'direction if your label does not list exact units.'],
        ['The rest day is intentional',
         'Do not inject on your rest day, and do not make up a missed dose on it. If ' +
         'you miss a dose on a scheduled day, skip it rather than doubling up the next day.']
      ],

      timeline: [
        ['Weeks 1\u20134', 'Starting out',
         'Most patients notice little initially. Energy or sleep changes are occasionally reported early.'],
        ['Weeks 4\u20138', 'Active course', 'Changes, if any, begin emerging over time.'],
        ['Weeks 8\u201312', 'Continued support',
         'GH/IGF-1 axis support continues. Your provider will review your IGF-1 and glucose at your follow-up visit.'],
        ['Weeks 13\u201316', 'Off cycle \u2014 labs and lifestyle',
         'No injections; this is intentional. Your labs, drawn between weeks 12 and 14, ' +
         'are reviewed during this window, and it is a good stretch to focus on ' +
         'nutrition, exercise and sleep before your next cycle. Do not restart early ' +
         'without provider direction.']
      ],
      timelineNote:
        'Tesamorelin has the strongest human evidence base in this program for visceral ' +
        'fat reduction, and results still vary. Your dose may be assessed and adjusted ' +
        'at your 16-week follow-up visit based on your IGF-1 response, as tolerated and ' +
        'as directed by your KORB provider.',

      common: [
        ['Injection site redness or irritation',
         'Common and usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Flushing or warmth after injection', 'Typically brief, and usually settles within minutes.'],
        ['Headache', 'May occur early in therapy. Usually mild and short-lived.'],
        ['Nausea', 'Occasionally reported. Usually mild and self-limiting.']
      ],
      monitorAndTell: [
        ['Water retention or puffiness', 'Can occur with GH stimulation. Tell your KORB provider if noticeable.'],
        ['Joint discomfort or tingling', 'May indicate a dose adjustment is needed. Tell your KORB provider.'],
        ['Glucose or HbA1c changes',
         'Tesamorelin is glycemically neutral, but glucose monitoring is required. Tell ' +
         'your KORB provider if you notice changes.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. Your ' +
              'provider uses labs to assess your response and your safety.',
        items: [
          'IGF-1, your primary response marker. The target is the physiologic range; higher is not better.',
          'HbA1c and fasting glucose. Tesamorelin is glycemically neutral, but glucose monitoring remains required throughout.',
          'CBC, CMP, lipid panel, TSH, free T4, free T3, copper, zinc and ceruloplasmin, at baseline and every 16-week follow-up.',
          'PSA, added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use Tesamorelin only as prescribed. Do not change your dose, schedule or route without provider direction.',
        'Do not combine it with other GH-axis therapies unless KORB specifically instructs you to.',
        'Tesamorelin requires careful provider oversight if you have uncontrolled diabetes.',
        'Do not restart after your off weeks early. The washout period is intentional.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Tesamorelin stimulates your own GH. It is not GH replacement.',
        'Always follow your prescription label for your exact dose and units.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Your washout period is intentional. Do not restart early.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    cjc_ipamorelin: {
      key: 'cjc_ipamorelin',
      file: 'KORB_Patient_Ed_CJC_Ipamorelin',   /* the PUBLISHED name. Deriving it from the title
                                  invented KORB_Patient_Ed_CJC_1295_Ipamorelin and would
                                  have left the old file beside the new one. */
      title: 'CJC-1295 / Ipamorelin',
      agentKey: 'cjcipam',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      washoutWeeks: 4,

      what: [
        'CJC-1295 / Ipamorelin is a dual-peptide combination used to stimulate growth ' +
        'hormone (GH) release. CJC-1295 extends GH-releasing signals while Ipamorelin ' +
        'directly stimulates GH release from the pituitary gland. Together they promote ' +
        'a more sustained, pulsatile GH effect.',
        'Like Sermorelin, this combination stimulates your own pituitary to produce GH. ' +
        'It does not replace growth hormone; it acts through your body\u2019s existing system.',
        'Your IGF-1 level is one of the key response markers your provider will monitor ' +
        'throughout your program.'
      ],

      mayHelp: {
        lead: 'This medication is one possible adjunctive support option for patients ' +
              'with goals related to:',
        items: [
          'Body composition, lean mass preservation and fat metabolism support as part of a lifestyle program',
          'Sleep quality and recovery physiology',
          'GH/IGF-1 axis support',
          'Exercise recovery and general wellness'
        ],
        after: 'Response varies from patient to patient. CJC-1295 / Ipamorelin has human ' +
               'pharmacokinetic data, but body composition benefits are extrapolated. ' +
               'Your provider will assess your IGF-1 and your response at your follow-up visit.'
      },

      timingNotes: [
        ['Timing matters',
         'Inject at bedtime on an empty stomach. GH is released naturally during sleep, ' +
         'and food, particularly carbohydrates, can blunt that release. Wait at least ' +
         'two hours after your last meal.'],
        ['Your dose is compounded for you',
         'Always follow the units and schedule on your prescription label. Do not ' +
         'estimate a dose or adjust it based on a prior fill.'],
        ['The rest day is intentional',
         'Do not inject on your rest day, and do not make up a missed dose on it. If ' +
         'you miss a dose on a scheduled day, skip it rather than doubling up the next day.']
      ],

      timeline: [
        ['Weeks 1\u20134', 'Starting out',
         'Some patients notice early improvements in sleep or morning energy.'],
        ['Weeks 4\u20138', 'Early response', 'Many notice nothing yet. This is normal.'],
        ['Weeks 8\u201312', 'Continued support',
         'Sleep, recovery and body composition changes may begin to emerge. Do not adjust your schedule.'],
        ['Weeks 13\u201316', 'Off cycle \u2014 labs and lifestyle',
         'No injections; this is intentional. Your labs, drawn between weeks 12 and 14, ' +
         'are reviewed during this window, and it is a good stretch to focus on ' +
         'nutrition, exercise and sleep before your next cycle. Do not restart early ' +
         'without provider direction.']
      ],
      timelineNote:
        'Do not compare your response to others. Response is highly individual and ' +
        'influenced by age, baseline GH levels, body composition, sleep quality and ' +
        'lifestyle habits.',

      common: [
        ['Injection site redness or irritation',
         'Common and usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Flushing or warmth after injection', 'Typically brief, and usually settles within minutes.'],
        ['Headache', 'May occur early in therapy. Usually mild and short-lived.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Water retention or puffiness', 'Can occur with GH stimulation. Tell your KORB provider if noticeable.'],
        ['Joint discomfort or tingling', 'May indicate a dose adjustment is needed. Tell your KORB provider.'],
        ['Glucose changes', 'GH stimulation can affect blood sugar. Tell your KORB provider if you notice changes.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. Your ' +
              'provider uses labs to assess your response and your safety.',
        items: [
          'IGF-1, your primary response marker. The target is the physiologic range; higher is not better.',
          'HbA1c and fasting glucose, because GH stimulation can affect glucose metabolism.',
          'Thyroid (TSH, free T4, free T3). A functioning thyroid axis is important for optimal GH response.',
          'CBC, CMP and lipid panel, at baseline and every 16-week follow-up.',
          'PSA, added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use CJC-1295 / Ipamorelin only as prescribed. Do not change your dose, schedule or route without provider direction.',
        'Do not combine it with other GH-axis therapies unless KORB specifically instructs you to.',
        'CJC-1295 / Ipamorelin is not appropriate during active malignancy, uncontrolled thyroid disease, or pregnancy.',
        'Do not restart after your off weeks early. The washout period is intentional.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'CJC-1295 / Ipamorelin stimulates your own GH. It is not GH replacement.',
        'Always follow your prescription label for your exact dose and units.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Your washout period is intentional. Do not restart early.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    bpc157: {
      key: 'bpc157',
      file: 'KORB_Patient_Ed_BPC157',
      title: 'BPC-157',
      agentKey: 'bpc157',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      /* Two windows, each read from its own field on the agent record. One
         "active weeks" row cannot say that Foundation runs 1-8 and Gateway and
         Peak run 3-8, and the PDF this replaces spelled both out in prose. */
      weeksRows: [
        ['Foundation \u2014 active weeks', 'onWeeksFoundation'],
        ['Gateway / Peak \u2014 active weeks', 'onWeeksGatewayPeakBase']
      ],
      weeksNote: 'On Gateway and Peak the course starts two weeks after your ' +
                 'start date, which is why it begins later and runs shorter.',

      what: [
        'BPC-157 is a synthetic peptide derived from a protein found naturally in the ' +
        'stomach lining. Its full name is Body Protection Compound 157. It is being ' +
        'studied for possible support of soft tissue recovery, musculoskeletal health ' +
        'and gut health.'
      ],

      mayHelp: {
        lead: 'This medication is one possible adjunctive support option for patients ' +
              'with goals related to:',
        items: [
          'Soft tissue recovery, including tendon, ligament and connective tissue support',
          'Musculoskeletal wellness during rehabilitation or recovery',
          'Exercise recovery quality and return-to-activity support',
          'Gut support in select clinical contexts, discussed with your provider'
        ],
        after: 'Response to BPC-157 varies from patient to patient and results are not ' +
               'guaranteed. Some patients notice changes during their active course and ' +
               'others do not. Your provider will assess whether to continue at your ' +
               'follow-up visit.'
      },

      timingNotes: [
        ['If you miss a dose',
         'If you miss a dose on a scheduled day, skip it. Do not double up the next day.']
      ],

      timeline: [
        ['Weeks 1\u20132', 'Getting started',
         'No immediate noticeable effect is common. The therapy works gradually. Continue your schedule.'],
        ['Active course', 'Foundation 8 weeks; Gateway and Peak 6 weeks',
         'Recovery quality may begin to shift. Individual response varies from patient to patient.'],
        ['Off weeks', 'Washout \u2014 labs and lifestyle',
         'No injections during this window; this is intentional. Your labs, drawn between ' +
         'weeks 12 and 14, are reviewed during this time, and it is a good stretch to focus ' +
         'on nutrition, exercise and sleep before your next course.']
      ],
      timelineNote:
        'Your provider will assess whether therapy is appropriate to continue based on ' +
        'your response, tolerability and goals.',

      common: [
        ['Injection site redness or irritation',
         'Common and usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Nausea or GI discomfort', 'Occasionally reported. Usually mild and self-limiting. Tell your KORB provider if it persists.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Unusual pain or swelling at the injection site',
         'Could indicate infection. Contact KORB promptly if redness spreads or a fever develops.'],
        ['Systemic rash or hives',
         'Tell your KORB provider at your next visit, or sooner if it is spreading or severe.'],
        ['Any unexplained systemic symptom',
         'Tell your KORB provider. Do not continue without guidance if you have a significant new symptom.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. Your ' +
              'provider uses labs to assess your response and your safety.',
        items: [
          'Standard longevity panel: CBC, CMP, lipid panel, HbA1c, fasting glucose, fasting ' +
          'insulin, IGF-1, TSH, free T4, free T3, copper, zinc and ceruloplasmin, at ' +
          'baseline and every 16-week follow-up.',
          'PSA, added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use BPC-157 only as prescribed. Do not change your dose, course length or schedule without provider direction.',
        'BPC-157 is not appropriate during active malignancy or pregnancy.',
        'Do not restart the course early after your off weeks without provider direction.',
        'Tell your KORB provider if you develop a new medical condition or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'BPC-157 is taken every day, including weekends, for the length of your course.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Do not restart your course early after the off weeks.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    ghkcu: {
      key: 'ghkcu',
      file: 'KORB_Patient_Ed_GHK_Cu',
      title: 'GHK-Cu',
      agentKey: 'ghkcu',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      weeksRows: [
        ['Gateway / Peak add-on \u2014 active weeks', 'onWeeksOptionalAddon']
      ],
      weeksNote: 'GHK-Cu is an optional add-on. It begins two weeks after you start ' +
                 'BPC-157 and runs for four weeks.',

      what: [
        'GHK-Cu is a copper-binding peptide that occurs naturally in the human body. It ' +
        'is found in blood plasma, saliva and urine, and its levels decline with age. It ' +
        'is being studied for possible support of tissue health, collagen support, wound ' +
        'healing and anti-inflammatory processes.',
        'GHK-Cu contains copper as part of its structure. Copper, zinc and ceruloplasmin ' +
        'are part of your standard lab panel, and your provider will pay particular ' +
        'attention to these results while you are on GHK-Cu.'
      ],

      mayHelp: {
        lead: 'This medication is one possible adjunctive support option for patients ' +
              'with goals related to:',
        items: [
          'Skin quality, collagen support and tissue healing',
          'Anti-inflammatory support in the context of a structured program',
          'Wound healing and cellular tissue wellness',
          'Recovery physiology as an adjunctive support option'
        ],
        after: 'Response to GHK-Cu varies from patient to patient. It is not a cosmetic ' +
               'treatment or a guaranteed skin improvement product. Your provider will ' +
               'assess whether therapy is appropriate to continue at your follow-up visit.'
      },

      timingNotes: [
        ['Choosing your three days',
         'Choose three consistent days each week, for example Monday, Wednesday and ' +
         'Friday, and keep the same days each week to build a reliable routine.'],
        ['Copper, zinc and ceruloplasmin are watched closely',
         'These are part of your standard lab panel. While you are on GHK-Cu your ' +
         'provider reviews them closely at baseline and at each follow-up visit, and ' +
         'therapy may be discontinued if copper or ceruloplasmin levels trend upward.'],
        ['If you miss a dose',
         'If you miss a dose on a scheduled day, skip it. Do not double up the next day.']
      ],

      timeline: [
        ['First 2 weeks', 'Active course begins',
         'Most patients notice nothing initially. This is normal; the therapy works gradually.'],
        ['Weeks 3\u20134', 'Active course continues',
         'Skin quality or tissue changes may begin to emerge. Individual response varies.'],
        ['After your course', 'Washout \u2014 labs and lifestyle',
         'No GHK-Cu injections. Your copper, zinc and ceruloplasmin results will be ' +
         'reviewed at your 16-week follow-up visit, and this is a good window to focus ' +
         'on nutrition, exercise and sleep before your next course.']
      ],
      timelineNote:
        'Your provider will review copper, zinc and ceruloplasmin closely at baseline and ' +
        'at your follow-up visit while GHK-Cu is active. Therapy may be discontinued if ' +
        'copper or ceruloplasmin levels rise.',

      common: [
        ['Injection site redness or irritation',
         'Common and usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Mild skin changes at the injection site',
         'Occasional mild discoloration or sensitivity. Usually self-limiting.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Copper or ceruloplasmin trending up on labs',
         'Your provider will review this at your follow-up visit. Therapy may be discontinued if levels rise.'],
        ['Unusual rash, hives or skin reaction',
         'Tell your KORB provider promptly. Copper-containing compounds can occasionally cause hypersensitivity.'],
        ['Any systemic symptom',
         'Tell your KORB provider. Do not continue without guidance if you have a new unexplained systemic symptom.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. Your ' +
              'provider uses labs to assess your response and your safety.',
        items: [
          'Standard longevity panel: CBC, CMP, lipid panel, HbA1c, fasting glucose, fasting ' +
          'insulin, IGF-1, TSH, free T4, free T3, copper, zinc and ceruloplasmin, at ' +
          'baseline and every 16-week follow-up.',
          'PSA, added for men aged 45 and older at every draw.',
          'Copper, zinc and ceruloplasmin get particular attention while you are on ' +
          'GHK-Cu, and therapy may be discontinued if copper or ceruloplasmin trend upward.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use GHK-Cu only as prescribed. Do not change your dose, schedule or course length without provider direction.',
        'GHK-Cu is absolutely contraindicated if you have Wilson\u2019s disease, a copper metabolism disorder.',
        'Copper, zinc and ceruloplasmin are part of your standard labs. Do not skip your scheduled draw between weeks 12 and 14.',
        'Tell your KORB provider if you develop a new medical condition or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'GHK-Cu is taken three times a week in the evening, on consistent days.',
        'It is absolutely contraindicated in Wilson\u2019s disease.',
        'Copper, zinc and ceruloplasmin are watched closely and may end therapy if they rise.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    semaglutide: {
      key: 'semaglutide',
      file: 'KORB_Patient_Ed_Semaglutide',
      title: 'Semaglutide',
      source: 'glp1',
      productKey: 'premier_sema',
      program: 'Weight Loss & Metabolic Health',
      howText: 'Subcutaneous (SQ) injection \u2014 fatty tissue under the skin ' +
               '(abdomen, thigh, or back of the arm)',
      timingText: 'Same day each week, with or without food',

      what: [
        'Semaglutide is a GLP-1 (glucagon-like peptide-1) receptor agonist. It mimics a ' +
        'natural gut hormone that slows digestion, reduces appetite and helps you feel ' +
        'fuller longer after eating.',
        'Your semaglutide is prepared for you by a licensed U.S. compounding pharmacy, ' +
        'which prepares each prescription to your provider\u2019s specifications rather than ' +
        'mass-producing it. Because the FDA reviews mass-manufactured products rather than ' +
        'individual prescriptions, compounded preparations are not FDA-approved. The active ' +
        'ingredient is the same one used in the brand-name medication, which is approved for ' +
        'weight management, for type 2 diabetes, and for reducing the risk of cardiovascular ' +
        'death, heart attack and stroke in adults with cardiovascular disease who are ' +
        'overweight or obese. At KORB your provider prescribes a compounded formulation that ' +
        'includes a small amount of cyanocobalamin (vitamin B-12) to help with tolerability.'
      ],

      mayHelp: {
        lead: 'This medication is one possible support option for patients with goals related to:',
        items: [
          'Weight loss, through a gradual, sustained reduction in appetite and food intake',
          'Increased energy as excess weight decreases',
          'Better sleep quality, for some patients',
          'Improved cardiovascular health markers',
          'Support for blood sugar management, if that applies to you'
        ],
        after: 'Response varies from patient to patient. Most patients notice reduced appetite ' +
               'within the first few weeks, with weight loss building gradually over months. ' +
               'Semaglutide is a tool that supports weight loss, not a shot that works on its ' +
               'own. It works best paired with the nutrition and activity habits below, not as ' +
               'a substitute for them.'
      },

      nutrition: {
        lead: 'These habits help your body respond well to Semaglutide and reduce the chance ' +
              'of digestive side effects. They are general guidance rather than a meal plan. ' +
              'If you want a plan built around your own needs, a registered dietitian is the ' +
              'right person to see, and your provider can talk through whether that would help you.',
        items: [
          'Prioritize protein at each meal. It helps preserve muscle while you lose weight.',
          'Eat slowly and stop when you feel satisfied rather than full. Semaglutide slows ' +
          'digestion, so it takes longer to feel full and it is easy to overeat before your ' +
          'body catches up.',
          'Eat smaller, more frequent meals if large meals feel uncomfortable.',
          'Avoid greasy, fried or very high-fat foods. These commonly worsen nausea.',
          'Stay well hydrated through the day.',
          'Limit alcohol, which can worsen nausea and interferes with steady progress.',
          'Stay physically active as you are able. Movement supports muscle retention and overall results.',
          'Prioritize consistent sleep. It supports appetite regulation and metabolic health.'
        ]
      },
      timingNotes: [
        ['Already taking a GLP-1?',
         'If you are transferring to KORB from another provider and want to continue at your ' +
         'current dose rather than start at the beginning of the ladder, we need documentation ' +
         'of the dose you are on: a pharmacy record, a prescription label, or a note from your ' +
         'prescriber. This is required before we can start you above the usual starting dose, ' +
         'and it is kept in your chart. Without it your provider will start you at the beginning ' +
         'dose and titrate up, which protects you from being started higher than your body has ' +
         'actually tolerated.'],
        ['Your titration schedule',
         'Your provider starts you at a low dose and increases it gradually, based on how you ' +
         'are tolerating the current one. The exact milligram steps and injection volume depend ' +
         'on which pharmacy fills your prescription, because KORB works with more than one ' +
         'compounding pharmacy and each uses a slightly different concentration and step ' +
         'schedule. Your prescription label always reflects your correct dose and volume for ' +
         'your pharmacy. For a quick reference showing injection volume and syringe markings by ' +
         'pharmacy and dose, ask your provider about KORB\u2019s GLP-1 Dose & Injection Guide.'],
        ['Do not increase your own dose',
         'Even if you feel ready or your symptoms are mild. Increasing too quickly raises the ' +
         'risk of nausea and other side effects. If a dose is not well tolerated, tell your ' +
         'provider; they may extend that step before increasing further.'],
        ['If you miss a dose',
         'If it has been less than 5 days since your missed dose, inject as soon as you ' +
         'remember, then resume your normal weekly schedule. If it has been 5 days or more, ' +
         'skip it and take your next dose on your regular day. Do not double up.']
      ],
      timeline: [
        ['Starting out', 'First few weeks',
         'Reduced appetite often begins here. Some patients notice mild nausea while their body adjusts.'],
        ['Titration', 'Finding your dose',
         'Your dose increases as tolerated, only under provider direction. How quickly you respond depends on your dose and your body.'],
        ['Effective dose', 'Continued progress',
         'Most of the change happens once you reach a dose that works for you.'],
        ['Ongoing', 'Maintenance',
         'Most patients remain on a steady dose long-term to sustain results.']
      ],
      timelineNote:
        'Do not compare your response to others. Response is highly individual and depends ' +
        'on starting weight, metabolism, diet, activity and other factors.',
      common: [
        ['Nausea, vomiting or diarrhea',
         'Common, most often after a dose increase. Smaller, lower-fat meals usually help. ' +
         'Tell your provider if it is severe or persistent.'],
        ['Constipation or stomach pain',
         'May occur. Stay hydrated and tell your provider if it does not improve.'],
        ['Low appetite',
         'Expected, and part of how the medication works. Tell your provider if you cannot ' +
         'eat or drink adequately.'],
        ['Injection site redness or irritation', 'Some patients notice this. Usually mild. Rotate injection sites.'],
        ['Headache or dizziness',
         'May occur early on, often from not eating or drinking enough. Usually mild and short-lived.']
      ],
      monitorAndTell: [
        ['Severe or persistent abdominal pain, especially spreading to your back',
         'Can indicate pancreatitis. Tell your provider.'],
        ['Pain in the upper right abdomen, fever, or yellowing of the skin or eyes',
         'Possible gallbladder problem. Tell your provider.'],
        ['Unable to keep fluids down for more than 24 hours', 'Tell your provider.']
      ],
      contraPhrasing: {
        'Personal or family history of medullary thyroid carcinoma (MTC)':
          'A personal or family history of medullary thyroid carcinoma (MTC), a rare thyroid cancer',
        'Multiple endocrine neoplasia syndrome type 2 (MEN2)':
          'A personal or family history of multiple endocrine neoplasia syndrome type 2 (MEN2)',
        'Hypersensitivity to the active drug or any component of the formulation':
          'A known allergy to Semaglutide or to anything else in the formulation',
        'Current pregnancy, breastfeeding, or planning pregnancy':
          'Pregnancy, breastfeeding, or planning a pregnancy',
        'Active gallbladder disease or history of gallbladder-related surgical complications':
          'Active gallbladder disease, or a history of complications from gallbladder surgery',
        'History of pancreatitis (use with caution)':
          'A history of pancreatitis. This needs discussing with your provider rather than ruling you out automatically',
        'Severe gastrointestinal disorders such as gastroparesis':
          'A severe digestive condition such as gastroparesis, where the stomach empties too slowly',
        'Severe renal impairment (eGFR below 30 mL/min/1.73 m\u00b2)':
          'Severely reduced kidney function. Your provider will explain where your kidney results sit',
        'Uncontrolled diabetic retinopathy (primarily relevant in type 2 diabetes)':
          'Uncontrolled diabetic eye disease (retinopathy), which mainly applies if you have type 2 diabetes'
      },
      labs: {
        lead: 'Routine labs are not required to participate in this program.',
        items: [
          'If you are also managing diabetes or pre-diabetes, continue that care, including ' +
          'any related labs, with the clinician who manages it, whether that is your primary ' +
          'care provider, an endocrinologist or another specialist, alongside your KORB visits.',
          'If your KORB provider has an individual clinical reason to order labs for you, they ' +
          'will explain why and what to expect.'
        ],
        after: 'There is no routine draw scheduled for this program.'
      },
      safety: [
        'Use Semaglutide only as prescribed. Do not change your dose, schedule or route without provider direction.',
        'Do not combine it with another GLP-1 or GIP medication from another source at the same time.',
        'Semaglutide is not appropriate during pregnancy or breastfeeding, or with a personal or family history of MTC or MEN2.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],
      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Semaglutide reduces appetite gradually. Most weight loss builds over months, not days.',
        'Dose increases happen only under provider direction. Never increase on your own.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Most patients do well when they follow the nutrition guidance above. Tell your provider if nausea is severe or persistent.',
        'Routine labs are not required for this program.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    tirzepatide: {
      key: 'tirzepatide',
      file: 'KORB_Patient_Ed_Tirzepatide',
      title: 'Tirzepatide',
      source: 'glp1',
      productKey: 'premier_tirz',
      program: 'Weight Loss & Metabolic Health',
      howText: 'Subcutaneous (SQ) injection \u2014 fatty tissue under the skin ' +
               '(abdomen, thigh, or back of the arm)',
      timingText: 'Same day each week, with or without food',

      what: [
        'Tirzepatide is a dual GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 ' +
        'receptor agonist. It works through two separate gut hormone pathways rather than ' +
        'one, which slows digestion and reduces appetite, often more strongly than a ' +
        'single-pathway medication for some patients.',
        'Your tirzepatide is prepared for you by a licensed U.S. compounding pharmacy, which ' +
        'prepares each prescription to your provider\u2019s specifications rather than ' +
        'mass-producing it. Because the FDA reviews mass-manufactured products rather than ' +
        'individual prescriptions, compounded preparations are not FDA-approved. The active ' +
        'ingredient is the same one used in the brand-name medication, which is approved for ' +
        'weight management and for type 2 diabetes. At KORB your provider prescribes a ' +
        'compounded formulation that includes a small amount of cyanocobalamin (vitamin B-12) ' +
        'to help with tolerability.'
      ],

      mayHelp: {
        lead: 'This medication is one possible support option for patients with goals related to:',
        items: [
          'Weight loss, often more pronounced than single-pathway GLP-1 medications for some patients',
          'Increased energy as excess weight decreases',
          'Better sleep quality, for some patients',
          'Improved cardiovascular health markers',
          'Support for blood sugar management, if that applies to you'
        ],
        after: 'Response varies from patient to patient. Most patients notice reduced appetite ' +
               'within the first few weeks, with weight loss building gradually over months. ' +
               'Tirzepatide is a tool that supports weight loss, not a shot that works on its ' +
               'own. It works best paired with the nutrition and activity habits below, not as ' +
               'a substitute for them.'
      },

      nutrition: {
        lead: 'These habits help your body respond well to Tirzepatide and reduce the chance ' +
              'of digestive side effects. They are general guidance rather than a meal plan. ' +
              'If you want a plan built around your own needs, a registered dietitian is the ' +
              'right person to see, and your provider can talk through whether that would help you.',
        items: [
          'Prioritize protein at each meal. It helps preserve muscle while you lose weight.',
          'Eat slowly and stop when you feel satisfied rather than full. Tirzepatide slows ' +
          'digestion, so it takes longer to feel full and it is easy to overeat before your ' +
          'body catches up.',
          'Eat smaller, more frequent meals if large meals feel uncomfortable.',
          'Avoid greasy, fried or very high-fat foods. These commonly worsen nausea.',
          'Stay well hydrated through the day.',
          'Limit alcohol, which can worsen nausea and interferes with steady progress.',
          'Stay physically active as you are able. Movement supports muscle retention and overall results.',
          'Prioritize consistent sleep. It supports appetite regulation and metabolic health.'
        ]
      },
      timingNotes: [
        ['Already taking a GLP-1?',
         'If you are transferring to KORB from another provider and want to continue at your ' +
         'current dose rather than start at the beginning of the ladder, we need documentation ' +
         'of the dose you are on: a pharmacy record, a prescription label, or a note from your ' +
         'prescriber. This is required before we can start you above the usual starting dose, ' +
         'and it is kept in your chart. Without it your provider will start you at the beginning ' +
         'dose and titrate up, which protects you from being started higher than your body has ' +
         'actually tolerated.'],
        ['Your titration schedule',
         'Your provider starts you at a low dose and increases it gradually, based on how you ' +
         'are tolerating the current one. The exact milligram steps and injection volume depend ' +
         'on which pharmacy fills your prescription, because KORB works with more than one ' +
         'compounding pharmacy and each uses a slightly different concentration and step ' +
         'schedule. Your prescription label always reflects your correct dose and volume for ' +
         'your pharmacy. For a quick reference showing injection volume and syringe markings by ' +
         'pharmacy and dose, ask your provider about KORB\u2019s GLP-1 Dose & Injection Guide.'],
        ['Do not increase your own dose',
         'Even if you feel ready or your symptoms are mild. Increasing too quickly raises the ' +
         'risk of nausea and other side effects. If a dose is not well tolerated, tell your ' +
         'provider; they may extend that step before increasing further.'],
        ['If you miss a dose',
         'If it has been less than 4 days since your missed dose, inject as soon as you ' +
         'remember, then resume your normal weekly schedule. If it has been 4 days or more, ' +
         'skip it and take your next dose on your regular day. Do not double up.']
      ],
      timeline: [
        ['Starting out', 'First few weeks',
         'Reduced appetite often begins here. Some patients notice mild nausea while their body adjusts.'],
        ['Titration', 'Finding your dose',
         'Your dose increases as tolerated, only under provider direction. How quickly you respond depends on your dose and your body.'],
        ['Effective dose', 'Continued progress',
         'Most of the change happens once you reach a dose that works for you.'],
        ['Ongoing', 'Maintenance',
         'Most patients remain on a steady dose long-term to sustain results.']
      ],
      timelineNote:
        'Do not compare your response to others. Response is highly individual and depends ' +
        'on starting weight, metabolism, diet, activity and other factors.',
      common: [
        ['Nausea, vomiting or diarrhea',
         'Common, most often after a dose increase. Smaller, lower-fat meals usually help. ' +
         'Tell your provider if it is severe or persistent.'],
        ['Constipation or stomach pain',
         'May occur. Stay hydrated and tell your provider if it does not improve.'],
        ['Low appetite',
         'Expected, and part of how the medication works. Tell your provider if you cannot ' +
         'eat or drink adequately.'],
        ['Injection site redness or irritation', 'Some patients notice this. Usually mild. Rotate injection sites.'],
        ['Headache or dizziness',
         'May occur early on, often from not eating or drinking enough. Usually mild and short-lived.']
      ],
      monitorAndTell: [
        ['Severe or persistent abdominal pain, especially spreading to your back',
         'Can indicate pancreatitis. Tell your provider.'],
        ['Pain in the upper right abdomen, fever, or yellowing of the skin or eyes',
         'Possible gallbladder problem. Tell your provider.'],
        ['Unable to keep fluids down for more than 24 hours', 'Tell your provider.']
      ],
      contraPhrasing: {
        'Personal or family history of medullary thyroid carcinoma (MTC)':
          'A personal or family history of medullary thyroid carcinoma (MTC), a rare thyroid cancer',
        'Multiple endocrine neoplasia syndrome type 2 (MEN2)':
          'A personal or family history of multiple endocrine neoplasia syndrome type 2 (MEN2)',
        'Hypersensitivity to the active drug or any component of the formulation':
          'A known allergy to Tirzepatide or to anything else in the formulation',
        'Current pregnancy, breastfeeding, or planning pregnancy':
          'Pregnancy, breastfeeding, or planning a pregnancy',
        'Active gallbladder disease or history of gallbladder-related surgical complications':
          'Active gallbladder disease, or a history of complications from gallbladder surgery',
        'History of pancreatitis (use with caution)':
          'A history of pancreatitis. This needs discussing with your provider rather than ruling you out automatically',
        'Severe gastrointestinal disorders such as gastroparesis':
          'A severe digestive condition such as gastroparesis, where the stomach empties too slowly',
        'Severe renal impairment (eGFR below 30 mL/min/1.73 m\u00b2)':
          'Severely reduced kidney function. Your provider will explain where your kidney results sit',
        'Uncontrolled diabetic retinopathy (primarily relevant in type 2 diabetes)':
          'Uncontrolled diabetic eye disease (retinopathy), which mainly applies if you have type 2 diabetes'
      },
      labs: {
        lead: 'Routine labs are not required to participate in this program.',
        items: [
          'If you are also managing diabetes or pre-diabetes, continue that care, including ' +
          'any related labs, with the clinician who manages it, whether that is your primary ' +
          'care provider, an endocrinologist or another specialist, alongside your KORB visits.',
          'If your KORB provider has an individual clinical reason to order labs for you, they ' +
          'will explain why and what to expect.'
        ],
        after: 'There is no routine draw scheduled for this program.'
      },
      safety: [
        'Use Tirzepatide only as prescribed. Do not change your dose, schedule or route without provider direction.',
        'Do not combine it with another GLP-1 or GIP medication from another source at the same time.',
        'Tirzepatide is not appropriate during pregnancy or breastfeeding, or with a personal or family history of MTC or MEN2.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],
      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Tirzepatide works through two hormone pathways and may support more pronounced weight loss for some patients.',
        'Dose increases happen only under provider direction. Never increase on your own.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Most patients do well when they follow the nutrition guidance above. Tell your provider if nausea is severe or persistent.',
        'Routine labs are not required for this program.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    /* NO DATA FILE. Testosterone is the one handout here that cannot pull, because
       korb-mens-data.js does not exist - open item 6 in CLAUDE.md. Its route,
       schedule and storage are stated below rather than read, and source:'none'
       makes that explicit so the page does not imply it is live when it is not.

       When korb-mens-data.js lands: delete `facts`, set source and a product key,
       and check whether `storage` can move into it too. Testosterone storage is
       NOT the shared peptide block - room temperature, 90 days - and inheriting
       the shared one would tell a patient to refrigerate a medication that must
       not be refrigerated. */
    testosterone: {
      key: 'testosterone',
      file: 'KORB_Patient_Ed_Testosterone',
      title: 'Testosterone',
      source: 'mens',
      program: 'Men\u2019s Health',
      /* `how` is DERIVED from korb-mens-data.js routes - see mensFacts() in
         patient-ed-render.js. Timing and schedule stay here as prose because
         neither is a fact that file holds: both depend on the individual
         prescription, so deriving them would dress prose up as live. Wired
         2026-09-17, closing the TODO in the comment above, which had been open
         since the data file landed on 2026-09-16. */
      timingText: 'On your scheduled injection day, as stated on your label',
      scheduleText: 'As stated on your prescription label',

      what: [
        'Testosterone cypionate is a long-acting injectable form of testosterone. It ' +
        'replaces what your body is no longer producing in adequate amounts, bringing ' +
        'your levels back into a healthy range.',
        'It is a thick, oil-based medication, which is why it comes with a specific type ' +
        'of syringe and two different needles.'
      ],

      mayHelp: {
        lead: 'Testosterone replacement therapy may help with:',
        items: [
          'Energy and reduced fatigue',
          'Muscle mass, strength, and recovery from exercise',
          'Sex drive and sexual function',
          'Mood, motivation and mental clarity',
          'Body composition, including reduced body fat'
        ],
        after: 'Most men notice changes gradually rather than immediately. Energy and mood ' +
               'often shift first, within a few weeks. Changes in body composition and ' +
               'strength typically take three to six months. Your provider will adjust your ' +
               'dose over time based on your labs and how you feel.'
      },

      extraSections: [
        {
          h: 'How to give your injection',
          callout: 'Your medication is a thick oil. It comes with a Luer lock syringe and two ' +
                   'separate needles: a wider one to draw the medication out of the vial, and a ' +
                   'finer one to inject with. Use both. The oil will not draw properly through ' +
                   'the fine needle, and drawing with the injecting needle dulls it and makes ' +
                   'the injection hurt more.',
          table: {
            head: ['Step', 'What to do'],
            rows: [
              ['1', 'Wash your hands. Set out your syringe, both needles, alcohol pads and your vial.'],
              ['2', 'Wipe the top of the vial with an alcohol pad and let it dry.'],
              ['3', 'Attach the wider needle. Draw up the exact amount on your prescription label.'],
              ['4', 'Remove that needle and attach the finer needle. Do not draw through the fine needle.'],
              ['5', 'Clean your injection site with a fresh alcohol pad and let it dry.'],
              ['6', 'Inject, then dispose of the needles and syringe in a sharps container immediately.']
            ]
          },
          p: [
            'Where to inject. If you inject under the skin, use the abdomen, upper thigh, or ' +
            'the fatty area of the buttock. If you inject into the muscle, use the outer thigh, ' +
            'the gluteal muscle, or the shoulder. Your provider will tell you which route you ' +
            'are using and show you the technique.',
            'Rotate every time. Move at least an inch or two from your last injection site. ' +
            'Injecting into the same spot repeatedly causes soreness, lumps and scar tissue ' +
            'that make future injections harder.',
            'Take your time drawing up. The oil moves slowly, and pulling too hard creates air ' +
            'bubbles. Warming the vial briefly in your hand can help it draw more easily.'
          ]
        },
        {
          h: 'Reading your syringe',
          p: [
            'Your prescription label tells you how many mL to draw. Find that number on the ' +
            'barrel and pull the plunger back until the FRONT EDGE of the black stopper lines ' +
            'up with it, not the middle or the back of it.',
            'The numbered lines are tenths of a mL and the smaller unnumbered lines between ' +
            'them are hundredths, so 0.42 mL is four numbered lines past zero plus two small ' +
            'lines. Subcutaneous doses use a 1 mL syringe and intramuscular doses use a 3 mL ' +
            'syringe; your own dose is on your label.'
          ],
          warn: 'If you have drawn past your number, do not inject the extra. Push the plunger ' +
                'gently back down to the correct line, or push it all the way in and start ' +
                'again. Injecting more than you were prescribed raises your levels too high and ' +
                'shows up on your labs.'
        },
        {
          h: 'Your dose',
          p: ['Your prescription label states your exact dose, your volume and how often to ' +
              'inject. Your provider selects your starting dose based on your labs and symptoms, ' +
              'and may adjust it over time.'],
          warn: 'Never increase your own dose. More testosterone is not better. Levels that run ' +
                'too high raise your risk of thickened blood, elevated estrogen and ' +
                'cardiovascular problems, and they do not produce better results. If you feel ' +
                'your dose is not working, tell your provider so it can be adjusted properly ' +
                'and rechecked with labs.'
        },
        {
          h: 'Refills and timing',
          p: ['Testosterone is a controlled medication. Pharmacies are legally limited in how ' +
              'early they can release a refill, and they count from the date of your LAST FILL, ' +
              'not from the date you run out or the date of your visit.'],
          ul: [
            'Your provider calculates your refill date and sends your prescription a few days ' +
            'before the pharmacy can release it.',
            'Asking the pharmacy to fill early will not move the date up.',
            'If you are traveling or think you may run short, tell us well in advance rather ' +
            'than at the last minute.'
          ]
        }
      ],

      /* Its own travel text, because the shared one says to refrigerate on
         arrival. Correct for the peptides, wrong here, and the two sat two
         inches apart contradicting each other on the first build. */
      travel:
        'Keep your medication with you, in your carry-on or personal item rather than ' +
        'checked baggage, in its original labeled carton. Keep it at room temperature ' +
        'and out of direct sunlight, and do not let it freeze or get cold enough to ' +
        'form crystals. Do not refrigerate it at any point, including on arrival. ' +
        'Medication and syringes are permitted in carry-on luggage, and TSA recommends ' +
        'keeping the original pharmacy label visible. Because this is a controlled ' +
        'medication, keep it in the labeled carton so it is clearly identifiable.',

      /* NOT the shared peptide storage block. Room temperature, and 90 days. */
      storage: {
        cards: [
          ['Store at room temperature', '68\u00b0F \u2013 77\u00b0F (20\u00b0C \u2013 25\u00b0C)'],
          ['Protect from light', 'Keep in the carton, away from direct sunlight'],
          ['Do not refrigerate or freeze', 'Cold can form crystals in the oil'],
          ['Keep secured', 'A controlled medication. Store out of reach of others.']
        ],
        notes: [
          'Discard your vial 90 days after you first use it, even if medication is left in it. ' +
          'Once a vial has been opened and punctured it is no longer considered safe to use ' +
          'beyond that point. Write the date you first used it on the label.',
          'Depending on your dose there may still be medication in the vial at 90 days. That is ' +
          'expected. Discard it when your new supply arrives rather than stretching it further. ' +
          'Never save leftover medication to use later, and never share it.',
          'If the oil looks cloudy, has particles, or has changed color, do not use it and ' +
          'contact the pharmacy or KORB. Small crystals can form if the vial gets cold, and ' +
          'warming it gently in your hand usually clears them. If they do not clear, do not use it.'
        ]
      },

      common: [
        ['Injection site soreness, redness or a small lump',
         'Common. Rotate sites and use a fresh needle each time. Tell KORB if it worsens or does not resolve.'],
        ['Acne or oilier skin', 'Common, especially early on. Tell your provider if it becomes bothersome.'],
        ['Fluid retention or mild swelling', 'Tell your provider. Your dose may need adjusting.'],
        ['Mood changes, irritability or trouble sleeping',
         'Tell your provider. This can indicate your dose is too high.'],
        ['Breast tenderness or swelling',
         'Tell your provider. This may mean estrogen is running high, and it is adjustable.'],
        ['Reduced testicle size, or reduced fertility',
         'Expected with testosterone therapy. If you are planning to father children, tell your provider before continuing.']
      ],
      monitorAndTell: [
        ['Headaches, flushing, or feeling unusually warm', 'Can suggest thickened blood. Tell your provider.'],
        ['New or worsening snoring, or pauses in breathing during sleep', 'Tell your provider.'],
        ['Difficulty urinating or a weak stream', 'Tell your provider.'],
        ['Any new medical diagnosis, new medication, or planned surgery', 'Tell your provider.']
      ],

      labs: {
        lead: 'Timing matters more than most patients expect. Get your blood drawn on a day you ' +
              'are scheduled to inject, BEFORE you take that dose. This is called a trough level. ' +
              'If you are drawn right after an injection your level reads artificially high, and ' +
              'your provider may lower a dose that was actually correct.',
        items: [
          'Your panel checks your testosterone level, your red blood cell count, your prostate marker and your hormone balance.',
          'Labs are ordered about two weeks before your follow-up visit so results are ready when you meet, and you will get a reminder.'
        ],
        after: 'Results can take up to a week to come back, which leaves roughly a one-week ' +
               'window once your reminder arrives. Going early is fine. Waiting until the last ' +
               'few days risks your results not being ready, which can delay your visit and your refill.'
      },

      safety: [
        'Use testosterone only as prescribed. Never change your dose, timing or route without provider direction.',
        'Use a new syringe and new needles for every injection. Never reuse or share them.',
        'Draw up with the wider needle and inject with the finer one.',
        'Do not share this medication with anyone. It is a controlled substance and sharing it is illegal.',
        'Get your labs drawn at trough, on an injection day before your dose.',
        'Tell your provider if you are planning to father children.'
      ],

      emergencyLead:
        'Seek emergency care immediately for chest pain, trouble breathing, sudden weakness or ' +
        'numbness on one side, trouble speaking, swelling or pain in one leg, or any symptom ' +
        'that feels severe or unsafe. Do not wait to hear back from KORB.',

      keyReminders: [
        'Draw up with the wider needle, then switch to the finer needle to inject.',
        'Rotate your injection site every single time.',
        'Get labs drawn on an injection day, before your dose.',
        'Your refill date is set by your last fill date. Early requests will not move it up.',
        'Discard your vial 90 days after first use, even if medication is left.',
        'Never increase your own dose. Higher is not better and carries real risk.',
        'Store at room temperature, not in the refrigerator.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    }

  }
};

/* Quest facts come from korb-quest.js, which must load FIRST. Throwing by name
   beats rendering a lab page with no way to book on it: check-pages.js knows the
   dependency and the build fails rather than shipping a page that tells a patient
   to schedule and gives them nothing to press. */
KORB_PATIENT_ED.hydrate = function (Q) {
  if (!Q || !Q.book) {
    throw new Error('korb-patient-ed-data.js: korb-quest.js must be loaded first.');
  }
  KORB_PATIENT_ED.shared.quest = Q;
  KORB_PATIENT_ED.hydrated = true;
  return KORB_PATIENT_ED;
};
KORB_PATIENT_ED.hydrated = false;

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PATIENT_ED; }
