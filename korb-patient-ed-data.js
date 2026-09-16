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

    injectionSafety: [
      'Use a new insulin needle and syringe for every injection. Do not reuse.',
      'Never mix peptides. Use a separate needle and syringe for each peptide and ' +
      'each injection; do not combine them into one syringe.',
      'Follow your state or local rules for sharps disposal. Use an FDA-cleared ' +
      'sharps container, and do not put used needles or syringes in household ' +
      'trash unless your local guidance specifically allows it.'
    ],

    contact: {
      operations: {
        title: 'Contact KORB Operations',
        lines: ['Email: info@korbhealth.com', 'Phone: +1 (888) 959-7299',
                'Hours: Mon–Fri, 9 AM–6 PM CT'],
        items: ['Questions about timing, storage or administration',
                'Scheduling, billing and shipping']
      },
      portal: {
        title: 'Patient Portal — message your provider',
        items: ['Injection-site irritation or redness that does not resolve',
                'Mild but persistent side effects',
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
  docs: {

    sermorelin: {
      key: 'sermorelin',
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
    }

  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PATIENT_ED; }
