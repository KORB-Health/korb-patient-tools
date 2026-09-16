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
    }

  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PATIENT_ED; }
