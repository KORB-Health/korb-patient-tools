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
      travelNote:
        'TSA asks that you tell the officer at the start of screening that you are carrying ' +
        'medically necessary liquids, and they may need to be inspected separately. The current ' +
        'rules are at tsa.gov/travel/travel-tips.',
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
      travelNote:
        'TSA asks that you tell the officer at the start of screening that you are carrying ' +
        'medically necessary liquids, and they may need to be inspected separately. The current ' +
        'rules are at tsa.gov/travel/travel-tips.',
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
       korb-trt-data.js does not exist - open item 6 in CLAUDE.md. Its route,
       schedule and storage are stated below rather than read, and source:'none'
       makes that explicit so the page does not imply it is live when it is not.

       When korb-trt-data.js lands: delete `facts`, set source and a product key,
       and check whether `storage` can move into it too. Testosterone storage is
       NOT the shared peptide block - room temperature, 90 days - and inheriting
       the shared one would tell a patient to refrigerate a medication that must
       not be refrigerated. */
    testosterone: {
      key: 'testosterone',
      file: 'KORB_Patient_Ed_Testosterone',
      title: 'Testosterone',
      source: 'none',
      program: 'Men\u2019s Health',
      facts: {
        how: 'Injection \u2014 subcutaneous or intramuscular, as your provider directs',
        timing: 'On your scheduled injection day, as stated on your label',
        schedule: 'As stated on your prescription label'
      },

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
              ['1', 'Wash your hands. Set out your syringe, both needles, alcohol swabs and your vial.'],
              ['2', 'Wipe the top of the vial with an alcohol swab and let it dry.'],
              ['3', 'Attach the wider needle. Draw up the exact amount on your prescription label.'],
              ['4', 'Remove that needle and attach the finer needle. Do not draw through the fine needle.'],
              ['5', 'Clean your injection site with a fresh alcohol swab and let it dry.'],
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

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PATIENT_ED; }
