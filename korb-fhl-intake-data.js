/* ============================================================================
   korb-fhl-intake-data.js - the FH&L new consultation intake, for a PROVIDER
   to ask during the visit when the patient never completed the online intake.

   Built 2026-11-04 at Don's request. Read by
   Provider_Reference/KORB_FHL_Intake_Provider_Tool.html, which draws the
   buttons and writes the chart note sections. Every question, every flag and
   every note line is here; the page owns none of them.

   WHERE THE QUESTIONS COME FROM. The Tebra New Consultation Peptide
   Questionnaire dated 29 June 2026, confirmed final by Don on 14 September
   2026, as built in KORB_Scheduler_Intake_AllPrograms.html pages 12 to 17.
   Same questions, same order, same flags. The wording is the clinical form of
   each answer rather than the patient-facing phrasing, because a provider is
   reading it aloud and a chart note is what comes out. Nothing clinical has
   been added to the questionnaire.

   TWO THINGS HERE ARE NOT ON THE QUESTIONNAIRE, and they are marked
   `korbAdded: true` so they can be found: the visit section (identity,
   telehealth consent, peptide consent). A patient who skipped the online
   intake also skipped the consents it carries, so the note has to say where
   consent stands. Neither blocks a baseline visit.

   THE SCREEN RULE, Don 2026-09-14. DOES NOT QUALIFY is Part B only: the
   absolutes, pregnancy and breastfeeding, and a prior serious reaction to a
   peptide. Everything in Part C is discussed and nothing in it blocks. Nobody
   is prescribed anything at an FH&L baseline visit. Two follow-ups take an
   absolute back down to a flag: cancer treatment finished 5 or more years
   ago, and sleep apnea that is treated.

   A SECOND COPY. The scheduler holds the same question set as hand-written
   HTML, and it is in build and not released. When it is released or changed,
   this file and that page must be compared. Nothing checks that today.

   ASCII ONLY. Every string in this file reaches a chart note. selfCheck()
   fails on a non-ASCII character anywhere in the question set.

   v1.0  2026-11-04  First version. Don Stevenson, PA-C.
   ============================================================================ */

var KORB_FHL_INTAKE = (function () {
  'use strict';

  var YN = [{ v: 'Yes' }, { v: 'No' }];

  /* Item shapes
       single  one answer. options[].lv 'stop' | 'review' raises a flag.
       multi   any number. options[].none is exclusive in its own group.
               options[].via names the follow-up item that decides an
               absolute; its options carry clear: true to take it down.
       text, area, num   typed.
       when(A, ctx)      shown only if true. A hidden item's answer is cleared
                         by the page and ignored here.
       follow-up items carry `sub: true` and sit straight under their parent. */
  var SECTIONS = [
    {
      key: 'visit', head: 'Visit and consent', korbAdded: true,
      sub: 'Not on the questionnaire. The online intake carries the consents, so a patient who skipped it has not signed them.',
      items: [
        { id: 'identity', q: 'Patient identity verified (name and date of birth)', type: 'single', options: YN.concat() },
        { id: 'teleconsent', q: 'Telehealth consent', type: 'single', options: [
          { v: 'Obtained verbally at this visit' }, { v: 'Signed and on file' },
          { v: 'Not obtained', lv: 'review', f: 'Telehealth consent not obtained' }] },
        { id: 'pepconsent', q: 'Peptide therapy consent', type: 'single', options: [
          { v: 'Signed and on file' },
          { v: 'Sent to patient to sign', lv: 'review', f: 'Peptide therapy consent not yet signed, must be on file before any prescription' },
          { v: 'Not yet sent', lv: 'review', f: 'Peptide therapy consent not yet signed, must be on file before any prescription' }] }
      ]
    },
    {
      key: 'hw', head: 'Height and weight',
      sub: 'For the chart. No BMI is calculated and there is no weight requirement for this program.',
      items: [
        { id: 'ht_ft', q: 'Height, feet', type: 'num', min: 3, max: 7 },
        { id: 'ht_in', q: 'Height, inches', type: 'num', min: 0, max: 11 },
        { id: 'wt', q: 'Weight, lb', type: 'num', min: 80, max: 700 }
      ]
    },
    {
      key: 'why', head: 'What brings them here',
      sub: 'One agent is started, chosen from the main goal, so these answers shape the plan.',
      items: [
        { id: 'goals', q: 'What are they hoping peptide therapy will do?', type: 'multi', options: [
          { v: 'Recovery from injury, surgery or chronic pain' },
          { v: 'Soft tissue, tendon or joint support' },
          { v: 'Reduce body fat, particularly central' },
          { v: 'Preserve muscle or change body composition' },
          { v: 'Energy or performance' },
          { v: 'Healthy aging and longevity' },
          { v: 'Immune support' },
          { v: 'Sleep and recovery' },
          { v: 'Hormone or growth hormone support' },
          { v: 'General metabolic health' },
          { v: 'Undecided, wants to discuss', lv: 'review', f: 'Primary goal not yet decided, wants to discuss' }] },
        { id: 'dur', q: 'How long has this been going on?', type: 'single', options: [
          { v: 'Less than 1 month' }, { v: '1 to 3 months' }, { v: '3 to 6 months' },
          { v: '6 to 12 months' }, { v: 'More than a year' }, { v: 'Long-term goal, not a new problem' }] },
        { id: 'tried', q: 'What have they already tried?', type: 'multi', options: [
          { v: 'Nothing yet', none: true },
          { v: 'Diet and nutrition changes' },
          { v: 'Exercise or a training program' },
          { v: 'Physical therapy or rehab' },
          { v: 'Chiropractic or massage' },
          { v: 'OTC supplements or vitamins' },
          { v: 'Prescription medication' },
          { v: 'Prior peptide therapy', lv: 'review' },
          { v: 'Compounded peptides from a non-KORB source', lv: 'review', f: 'Compounded peptides obtained from another source' },
          { v: 'Hormone therapy, testosterone or HRT' },
          { v: 'GLP-1 medication' },
          { v: 'Other, described at visit' }] },
        { id: 'impact', q: 'How much is it affecting day-to-day life?', type: 'single', options: [
          { v: 'Not at all' }, { v: 'Mildly' }, { v: 'Moderately' }, { v: 'Significantly' }, { v: 'Severely' }] }
      ]
    },
    {
      key: 'life', head: 'Routine',
      sub: 'These therapies support nutrition, training and sleep rather than replacing them.',
      items: [
        { id: 'prot', q: 'Daily protein intake', type: 'single', options: [
          { v: 'Less than 50g' }, { v: '50 to 100g' }, { v: '100 to 150g' }, { v: '150 to 200g' },
          { v: 'More than 200g' }, { v: 'Does not track protein' }] },
        { id: 'nutr', q: 'Overall nutrition', type: 'single', options: [
          { v: 'Poor' }, { v: 'Fair' }, { v: 'Mostly healthy' }, { v: 'Very healthy' }] },
        { id: 'resist', q: 'Resistance training (weights or strength work)', type: 'single', options: YN.concat() },
        { id: 'exd', q: 'Exercise days per week, any kind', type: 'single', options: [
          { v: '0 days' }, { v: '1 to 2 days' }, { v: '3 to 4 days' }, { v: '5 to 6 days' }, { v: 'Every day' }] },
        { id: 'act', q: 'Activity level', type: 'single', options: [
          { v: 'Sedentary' }, { v: 'Lightly active' }, { v: 'Moderately active' }, { v: 'Very active' }, { v: 'Athlete' }],
          hint: { when: 'Athlete', text: 'Ask about drug testing in the safety screen. Every peptide in this program is prohibited in tested sport.' } },
        { id: 'slh', q: 'Usual sleep', type: 'single', options: [
          { v: 'Less than 5 hours' }, { v: '5 to 6 hours' }, { v: '6 to 7 hours' }, { v: '7 to 8 hours' }, { v: 'More than 8 hours' }] },
        { id: 'slq', q: 'Sleep quality', type: 'single', options: [
          { v: 'Poor' }, { v: 'Fair' }, { v: 'Good' }, { v: 'Excellent' }] },
        { id: 'str', q: 'Current stress', type: 'single', options: [
          { v: 'Low' }, { v: 'Mild' }, { v: 'Moderate' }, { v: 'High' }, { v: 'Very high' }] },
        { id: 'alc', q: 'Alcohol', type: 'single', options: [
          { v: 'Never' }, { v: 'Rarely' }, { v: 'Light, 1 to 3 per week' }, { v: 'Moderate, 4 to 7 per week' },
          { v: 'Heavy, more than 7 per week' }] },
        { id: 'tob', q: 'Tobacco', type: 'single', options: [
          { v: 'Never used' }, { v: 'Former user' }, { v: 'Current, occasional' }, { v: 'Current, daily' }] },
        { id: 'coach', q: 'Working with a coach, trainer, physio or dietitian', type: 'single', options: YN.concat() }
      ]
    },
    {
      key: 'safety', head: 'Safety screen',
      sub: 'Part B (red) is the only thing that declines. Part C (amber) is discussed and never blocks.',
      items: [
        { id: 'pmh', q: 'Past medical history', type: 'multi', options: [
          { v: 'Heart attack or stroke' }, { v: 'Hypertension' }, { v: 'Hyperlipidemia' },
          { v: 'Autoimmune disease' }, { v: 'Chronic kidney disease' }, { v: 'Depression or anxiety' },
          { v: 'Chronic pain condition' }, { v: 'Bleeding disorder or on an anticoagulant' },
          { v: 'Unexplained mass, lesion or systemic symptoms', lv: 'review' },
          { v: 'Active infection, open wound or abscess', lv: 'review' },
          { v: 'Taking immunosuppressant medication', lv: 'review', f: 'Currently taking immunosuppressant medication' },
          { v: 'None of these', none: true }] },
        { id: 'partb', q: 'Part B. Ever diagnosed with or treated for:', type: 'multi', options: [
          { v: 'Active malignancy or currently in cancer treatment', lv: 'stop' },
          { v: 'Cancer history, treatment finished', lv: 'stop', via: 'cahx' },
          { v: 'Pituitary tumor, hypopituitarism or HPA axis disruption', lv: 'stop' },
          { v: 'Active proliferative retinopathy or advanced diabetic eye disease', lv: 'stop' },
          { v: "Wilson's disease or copper metabolism disorder", lv: 'stop' },
          { v: 'Prior anaphylaxis requiring emergency treatment', lv: 'stop' },
          { v: 'Sleep apnea', lv: 'stop', via: 'osa' },
          { v: 'None of these', none: true }] },
        { id: 'cahx', sub: true, q: 'When did cancer treatment finish?', type: 'single',
          when: function (A) { return has(A.partb, 'Cancer history, treatment finished'); },
          options: [{ v: 'Less than 5 years ago' }, { v: '5 or more years ago', clear: true }, { v: 'Not sure' }] },
        { id: 'osa', sub: true, q: 'Is the sleep apnea treated?', type: 'single',
          when: function (A) { return has(A.partb, 'Sleep apnea'); },
          options: [{ v: 'Treated, uses CPAP or other treatment regularly', clear: true },
                    { v: 'Treatment prescribed but not used' }, { v: 'Untreated' }] },
        { id: 'preg', q: 'Pregnancy, conception, breastfeeding', type: 'single',
          when: function (A, c) { return c.sex === 'F'; },
          options: [{ v: 'Pregnant or possibly pregnant', lv: 'stop' },
                    { v: 'Trying to conceive, or planning to within 3 months', lv: 'stop' },
                    { v: 'Currently breastfeeding', lv: 'stop' },
                    { v: 'None of these' }] },
        { id: 'pepb', q: 'Taken a peptide medication before?', type: 'single', options: [
          { v: 'Yes' }, { v: 'No, this would be the first' }] },
        { id: 'peprxn', sub: true, q: 'Serious reaction to a peptide or an ingredient in one?', type: 'single',
          when: function (A) { return A.pepb === 'Yes'; },
          options: [{ v: 'No' }, { v: 'Yes', lv: 'stop', f: 'Prior serious reaction to a peptide or formulation component' }] },
        { id: 'peprxn_what', sub: true, q: 'Which peptide, and what happened?', type: 'text',
          when: function (A) { return A.pepb === 'Yes' && A.peprxn === 'Yes'; } },
        { id: 'partc', q: 'Part C. Discussed, never blocks:', type: 'multi', options: [
          { v: 'Diabetes, prediabetes or insulin resistance', lv: 'review', via: 'a1c' },
          { v: 'Thyroid condition', lv: 'review', via: 'thy' },
          { v: 'Chronic liver disease or hepatic impairment', lv: 'review' },
          { v: 'High-dose copper or zinc supplementation', lv: 'review' },
          { v: 'Competitive athlete subject to drug testing', lv: 'review', via: 'wada' },
          { v: 'None of these', none: true }] },
        { id: 'a1c', sub: true, q: 'Last HbA1c, if known (it is on the baseline panel anyway)', type: 'text',
          when: function (A) { return has(A.partc, 'Diabetes, prediabetes or insulin resistance'); } },
        { id: 'thy', sub: true, q: 'Is the thyroid condition treated?', type: 'single',
          when: function (A) { return has(A.partc, 'Thyroid condition'); },
          options: [{ v: 'Yes, on medication' }, { v: 'No, untreated', hot: true }] },
        { id: 'wada', sub: true, q: 'Which is closest?', type: 'single',
          when: function (A) { return has(A.partc, 'Competitive athlete subject to drug testing'); },
          options: [{ v: 'Tested in competition', hot: true }, { v: 'Tested in training, not in competition' },
                    { v: 'Competes, not tested' }],
          note: 'Not a disqualification. Every peptide in this program is prohibited in tested sport, so the patient could test positive. Counsel, and document that they accept the risk before starting.' },
        { id: 'surg', q: 'Major surgery', type: 'multi', options: [
          { v: 'No major surgery', none: true },
          { v: 'Joint surgery (knee, shoulder, hip)' },
          { v: 'Cancer-related surgery', lv: 'review' },
          { v: 'Major surgery within the past 3 months', lv: 'review' },
          { v: 'Other, described at visit' }] },
        { id: 'fhx', q: 'Family history, first degree (parent, sibling, child)', type: 'multi', options: [
          { v: 'Cancer, any type' },
          { v: 'Thyroid cancer', lv: 'review', f: 'Family history of thyroid cancer' },
          { v: 'Type 2 diabetes' },
          { v: 'Heart disease or MI before 60' },
          { v: 'Pituitary or adrenal disorder', lv: 'review', f: 'Family history of pituitary or adrenal disorder' },
          { v: 'Autoimmune disease' },
          { v: 'None of these', none: true }] },
        { id: 'otherhx', q: 'Anything else about their health not asked about?', type: 'text' }
      ]
    },
    {
      key: 'meds', head: 'Medications and allergies',
      items: [
        { id: 'rx', q: 'Prescription medications', type: 'single', options: YN.concat() },
        { id: 'rx_list', sub: true, q: 'List, with dose and frequency', type: 'area',
          when: function (A) { return A.rx === 'Yes'; } },
        { id: 'supp', q: 'Vitamins, supplements or OTC products', type: 'single', options: YN.concat() },
        { id: 'supp_list', sub: true, q: 'List them', type: 'area',
          when: function (A) { return A.supp === 'Yes'; } },
        { id: 'curpep', q: 'Currently using peptides, growth hormone, or hormone therapy (testosterone, HRT)', type: 'single',
          options: [{ v: 'Yes', lv: 'review', f: 'Currently using peptides, growth hormone or hormone therapy' }, { v: 'No' }],
          note: 'Anything already acting on the growth hormone axis changes the baseline results, and this program starts one agent at a time.' },
        { id: 'curpep_list', sub: true, q: 'List them', type: 'area',
          when: function (A) { return A.curpep === 'Yes'; } },
        { id: 'cuzn', q: 'Copper or zinc, including in a multivitamin', type: 'single', options: [
          { v: 'Yes', lv: 'review', f: 'Copper or zinc supplementation, including multivitamin' }, { v: 'No' },
          { v: 'Not sure', lv: 'review', f: 'Copper or zinc supplementation, including multivitamin' }],
          note: 'Copper and zinc are on the baseline panel, and supplements move those results.' },
        { id: 'cuzn_what', sub: true, q: 'Which product, if known?', type: 'text',
          when: function (A) { return A.cuzn === 'Yes' || A.cuzn === 'Not sure'; } },
        { id: 'alg', q: 'Medication allergies', type: 'single', options: YN.concat() },
        { id: 'alg_list', sub: true, q: 'List, with the reaction', type: 'area',
          when: function (A) { return A.alg === 'Yes'; } },
        { id: 'exc', q: 'Allergy to preservatives, dyes or inactive ingredients', type: 'single', options: [
          { v: 'Yes', lv: 'review', f: 'Allergy to preservatives, dyes or inactive ingredients' }, { v: 'No' },
          { v: 'Not sure', lv: 'review', f: 'Allergy to preservatives, dyes or inactive ingredients' }],
          note: 'Worth asking for compounded medicines, because inactive ingredients differ between pharmacies.' },
        { id: 'exc_what', sub: true, q: 'Which ones, if known?', type: 'text',
          when: function (A) { return A.exc === 'Yes' || A.exc === 'Not sure'; } }
      ]
    },
    {
      key: 'ros', head: 'Review of systems',
      sub: 'Current symptoms only. None of this affects eligibility; it is the starting point.',
      items: [
        { id: 'ros_h', label: 'Hormonal / body composition', q: 'Hormones and body composition', type: 'multi', options: [
          { v: 'Central fat gain despite diet and exercise' }, { v: 'Loss of muscle or strength despite training' },
          { v: 'Decreased libido' }, { v: 'Mood changes, irritability or low motivation' }, { v: 'None of these', none: true }] },
        { id: 'ros_r', label: 'Recovery / musculoskeletal', q: 'Recovery, joints and muscles', type: 'multi', options: [
          { v: 'Joint pain or stiffness, reduced mobility' }, { v: 'Current soft tissue, tendon or ligament problem' },
          { v: 'Slower recovery from exercise' }, { v: 'Pain limiting activity' }, { v: 'None of these', none: true }] },
        { id: 'ros_m', label: 'Metabolic / cardiovascular', q: 'Heart and metabolism', type: 'multi', options: [
          { v: 'Elevated blood glucose or A1c reported' }, { v: 'Polydipsia or polyuria' },
          { v: 'Peripheral edema' },
          { v: 'Chest pain', lv: 'review', f: 'Currently reporting chest pain' },
          { v: 'Shortness of breath', lv: 'review', f: 'Currently reporting shortness of breath' },
          { v: 'None of these', none: true }] },
        { id: 'ros_s', label: 'Skin', q: 'Skin', type: 'multi', options: [
          { v: 'Delayed wound healing' },
          { v: 'New skin lesions or growths', lv: 'review', f: 'Significant skin changes, new lesions or growths' },
          { v: 'Rash or hives' }, { v: 'None of these', none: true }] },
        { id: 'ros_z', label: 'Sleep', q: 'Sleep', type: 'multi', options: [
          { v: 'Difficulty falling or staying asleep' }, { v: 'Unrefreshing sleep' }, { v: 'None of these', none: true }] },
        { id: 'ros_g', label: 'Gastrointestinal', q: 'Digestion', type: 'multi', options: [
          { v: 'Bloating' }, { v: 'Belching' }, { v: 'Early satiety' }, { v: 'Heartburn' }, { v: 'Nausea' },
          { v: 'Vomiting' }, { v: 'Constipation' }, { v: 'Diarrhea' },
          { v: 'Rectal bleeding', lv: 'review', f: 'Currently reporting rectal bleeding' },
          { v: 'None of these', none: true }] },
        { id: 'ros_n', label: 'General', q: 'General', type: 'multi', options: [
          { v: 'Fatigue' }, { v: 'Headaches' }, { v: 'Easy bruising' }, { v: 'Heat or cold intolerance' },
          { v: 'Low mood' }, { v: 'Anxiety' }, { v: 'Mood swings' }, { v: 'Weight change' },
          { v: 'Decreased appetite' }, { v: 'Nocturia' }, { v: 'None of these', none: true }] }
      ]
    },
    {
      key: 'prev', head: 'Preventive screening',
      items: [
        { id: 'psa', q: 'PSA blood test', type: 'single', when: function (A, c) { return c.sex === 'M'; },
          options: [{ v: 'Within the last 12 months' }, { v: 'More than 12 months ago' }, { v: 'Never' }, { v: 'Not applicable' }] },
        { id: 'mam', q: 'Mammogram', type: 'single', when: function (A, c) { return c.sex === 'F'; },
          options: [{ v: 'Within the last 12 months' }, { v: 'More than 12 months ago' }, { v: 'Never' }, { v: 'Not applicable' }] },
        { id: 'col', q: 'Colonoscopy (asked at 45 and over)', type: 'single',
          when: function (A, c) { return c.age !== null && c.age >= 45; },
          options: [{ v: 'Within the last 5 years' }, { v: 'More than 5 years ago' }, { v: 'Never' }, { v: 'Not applicable or declined' }] },
        { id: 'dexa', q: 'DEXA scan, bone density or body composition', type: 'single',
          options: [{ v: 'Within the last 12 months' }, { v: 'More than 12 months ago' }, { v: 'Never' }] },
        { id: 'inbody', q: 'Recent InBody or body composition result to share', type: 'single',
          options: [{ v: 'Yes' }, { v: 'No' }, { v: 'Not sure' }],
          hint: { when: 'Yes', text: 'Ask the patient to send the printout so the care team can scan it into the chart.' } }
      ]
    }
  ];

  /* ── helpers ──────────────────────────────────────────────────────────── */
  function has(arr, v) { return Array.isArray(arr) && arr.indexOf(v) >= 0; }
  function answered(v) { return v != null && v !== '' && !(Array.isArray(v) && !v.length); }
  function allItems() {
    var out = [];
    SECTIONS.forEach(function (s) { s.items.forEach(function (it) { out.push(it); }); });
    return out;
  }
  function item(id) {
    var f = null; allItems().forEach(function (it) { if (it.id === id) f = it; }); return f;
  }
  function opt(it, v) {
    var f = null; (it.options || []).forEach(function (o) { if (o.v === v) f = o; }); return f;
  }
  function visible(it, A, ctx) { return !it.when || !!it.when(A, ctx); }

  /* The sections as they should be drawn for these answers. */
  function sections(A, ctx) {
    return SECTIONS.map(function (s) {
      return { key: s.key, head: s.head, sub: s.sub || '', korbAdded: !!s.korbAdded,
        items: s.items.filter(function (it) { return visible(it, A, ctx); }) };
    });
  }

  /* Hidden items must not drive a verdict nobody can see. The page calls this
     after every change. */
  function prune(A, ctx) {
    allItems().forEach(function (it) { if (!visible(it, A, ctx)) delete A[it.id]; });
    return A;
  }

  /* ── the screen ───────────────────────────────────────────────────────── */
  function evaluate(A, ctx) {
    var stops = [], revs = [];
    allItems().forEach(function (it) {
      if (!visible(it, A, ctx) || !it.options) return;
      var vals = it.type === 'multi' ? (A[it.id] || []) : (answered(A[it.id]) ? [A[it.id]] : []);
      vals.forEach(function (v) {
        var o = opt(it, v); if (!o || !o.lv) return;
        var label = o.f || o.v;
        if (it.id === 'preg') label = 'Pregnancy status: ' + o.v.toLowerCase();
        var fu = o.via ? item(o.via) : null;
        if (fu) {
          var a = A[fu.id];
          if (!answered(a)) {
            if (o.lv === 'stop') { revs.push(label + ' - detail not yet given'); return; }
          } else {
            var fo = opt(fu, a);
            label += ' - ' + a;
            if (o.lv === 'stop' && fo && fo.clear) { revs.push(label); return; }
            if (fo && fo.hot) label = 'PRIORITY: ' + label;
          }
        }
        (o.lv === 'stop' ? stops : revs).push(label);
      });
    });

    var st = stateStatus(ctx);
    var minor = ctx.age !== null && ctx.age < 18;
    if (minor) stops.unshift('Under 18. KORB treats adults only');

    var verdict = st.closed ? 'NOT OFFERED IN ' + ctx.stateName.toUpperCase()
      : stops.length ? 'DOES NOT QUALIFY'
      : revs.length ? 'QUALIFIES WITH REVIEW' : 'QUALIFIES';
    return { verdict: verdict, stops: stops, revs: revs, state: st, minor: minor };
  }

  /* Where FH&L is offered is a program decision held in korb-dosing-data.js.
     Read, never copied. */
  function stateStatus(ctx) {
    var D = (typeof KORB_DOSING !== 'undefined') ? KORB_DOSING : null;
    if (!ctx.state || !D) return { closed: false, paused: false, line: '' };
    var S = D.states, p = S.pausedPharmacy || {};
    if ((S.unavailable || []).indexOf(ctx.state) < 0) return { closed: false, paused: false, line: '' };
    var paused = (p.states || []).indexOf(ctx.state) >= 0;
    var why = (S.unavailableNoShip || []).indexOf(ctx.state) >= 0 ? 'Do not ship to this state.'
      : (S.unavailableLabWorkflow || []).indexOf(ctx.state) >= 0 ? 'Closed for lab workflow and state rules.'
      : (S.unavailableNoPharmacy || []).indexOf(ctx.state) >= 0 ? 'No peptide pharmacy can fill here.' : '';
    return { closed: true, paused: paused,
      line: paused ? p.providerLine : 'Functional Health and Longevity is not offered in ' + ctx.stateName + '. ' + why };
  }

  /* ── the note ─────────────────────────────────────────────────────────── */
  var NA = '[not asked]';
  function pick(A, id) { return answered(A[id]) ? A[id] : NA; }
  function txt(A, id) { return answered(A[id]) ? String(A[id]).trim() : ''; }
  function grp(A, id, denyWord) {
    var a = A[id], it = item(id);
    if (!answered(a)) return NA;
    var none = (it.options || []).filter(function (o) { return o.none; }).map(function (o) { return o.v; });
    var real = a.filter(function (v) { return none.indexOf(v) < 0; });
    if (!real.length) return denyWord || 'denies';
    return real.join('; ');
  }
  function list(A, yn, listId) {
    var v = A[yn];
    if (!answered(v)) return NA;
    if (v !== 'Yes') return 'none';
    var t = txt(A, listId);
    return t ? 'yes\n' + t.split(/\r?\n/).filter(Boolean).map(function (l) { return '  - ' + l.trim(); }).join('\n')
             : 'yes, [not listed]';
  }

  function panel(ctx) {
    var D = (typeof KORB_DOSING !== 'undefined') ? KORB_DOSING : null;
    var known = ctx.sex && ctx.age !== null;
    var men45 = ctx.sex === 'M' && ctx.age !== null && ctx.age >= 45;
    var name = !known ? 'KORB Standard Longevity, or KORB Men 45 Longevity if male and 45 or older'
      : men45 ? 'KORB Men 45 Longevity' : 'KORB Standard Longevity';
    var tests = D ? D.labs.base.map(function (l) { return l.name; }) : [];
    if (D && (men45 || !known)) tests.push(D.labs.men45Plus.name);
    var fee = D && D.pricing && D.pricing.baseline ? D.pricing.baseline.partner : null;
    return { name: name, tests: tests, fee: fee, code: D && D.pricing.baseline ? D.pricing.baseline.code : '' };
  }

  function note(A, ctx) {
    var r = evaluate(A, ctx), S = [], pl = panel(ctx);
    var ht = answered(A.ht_ft) ? A.ht_ft + ' ft ' + (answered(A.ht_in) ? A.ht_in : 0) + ' in' : NA;

    S.push({ t: 'CC', body:
      'Functional Health and Longevity new patient consultation. Synchronous audio-video telehealth. ' +
      'Patient did not complete the online KORB peptide intake; the intake questions were asked and answered with the provider during this visit' +
      (ctx.date ? ', ' + ctx.date : '') + '.' });

    S.push({ t: 'SCREENING RESULT', body:
      'SCREENING RESULT: ' + r.verdict +
      '\nFLAGGED FOR REVIEW: ' + (r.revs.length ? r.revs.join('; ') : 'none') +
      (r.stops.length ? '\nABSOLUTE CONTRAINDICATION REPORTED: ' + r.stops.join('; ') : '') +
      (r.state.closed ? '\nSTATE: ' + r.state.line : '') +
      '\nNo prescription at this visit. Program decision at the follow-up once baseline results are reviewed.' });

    S.push({ t: 'VITALS', tebra: true, body:
      'Height: ' + ht + '\nWeight: ' + (answered(A.wt) ? A.wt + ' lb' : NA) +
      '\nPatient-reported. No BMI criterion applies to this program.' });

    S.push({ t: 'VISIT AND CONSENT', body:
      'Patient physically located in ' + (ctx.stateName || '[state]') + ' at the time of service.' +
      '\nIdentity verified: ' + pick(A, 'identity') +
      '\nTelehealth consent: ' + pick(A, 'teleconsent') +
      '\nPeptide therapy consent: ' + pick(A, 'pepconsent') });

    S.push({ t: 'HPI', body:
      'Goals: ' + grp(A, 'goals') +
      '\nDuration: ' + pick(A, 'dur') +
      '\nAlready tried: ' + grp(A, 'tried', 'nothing yet') +
      '\nImpact on daily life: ' + pick(A, 'impact') });

    S.push({ t: 'LIFESTYLE FOUNDATION', body:
      'Protein: ' + pick(A, 'prot') +
      '\nNutrition: ' + pick(A, 'nutr') +
      '\nResistance training: ' + pick(A, 'resist') +
      '\nExercise days per week: ' + pick(A, 'exd') +
      '\nActivity level: ' + pick(A, 'act') +
      '\nSleep: ' + pick(A, 'slh') + ', quality ' + pick(A, 'slq') +
      '\nStress: ' + pick(A, 'str') +
      '\nAlcohol: ' + pick(A, 'alc') +
      '\nTobacco: ' + pick(A, 'tob') +
      '\nWorking with a coach or therapist: ' + pick(A, 'coach') +
      '\n\nLifestyle foundation documented at intake, per program requirement.' });

    var partbAsked = answered(A.partb), partcAsked = answered(A.partc);
    S.push({ t: 'ELIGIBILITY AND SAFETY SCREEN', body:
      'ABSOLUTE (Part B): ' + (r.stops.length ? r.stops.join('; ') : (partbAsked ? 'all denied' : NA)) +
      '\nRELATIVE (Part C) and other flags: ' + (r.revs.length ? r.revs.join('; ') : (partcAsked ? 'all denied' : NA)) +
      '\nPregnancy, conception, breastfeeding: ' + (ctx.sex === 'M' ? 'not applicable'
          : A.preg === 'None of these' ? 'denied' : answered(A.preg) ? 'REPORTED - ' + A.preg : NA) +
      '\nPrior peptide exposure: ' + pick(A, 'pepb') +
      (A.pepb === 'Yes' ? '\nPrior serious reaction to a peptide: ' + pick(A, 'peprxn') +
        (txt(A, 'peprxn_what') ? ' - ' + txt(A, 'peprxn_what') : '') : '') +
      (txt(A, 'a1c') ? '\nLast HbA1c, patient-reported: ' + txt(A, 'a1c') : '') +
      '\nPast medical history: ' + grp(A, 'pmh') +
      '\nSurgical history: ' + grp(A, 'surg', 'no major surgery') +
      '\nFamily history: ' + grp(A, 'fhx') +
      '\nOther history volunteered: ' + (txt(A, 'otherhx') || NA) });

    S.push({ t: 'PREVENTIVE SCREENING', body:
      'PSA: ' + (ctx.sex === 'F' ? 'not applicable' : pick(A, 'psa')) +
      '\nMammogram: ' + (ctx.sex === 'M' ? 'not applicable' : pick(A, 'mam')) +
      '\nColonoscopy: ' + (ctx.age !== null && ctx.age < 45 ? 'not asked, under 45' : pick(A, 'col')) +
      '\nDEXA: ' + pick(A, 'dexa') +
      '\nInBody: ' + pick(A, 'inbody') });

    S.push({ t: 'MEDICATIONS, SUPPLEMENTS, ALLERGIES', body:
      'Prescription medications: ' + list(A, 'rx', 'rx_list') +
      '\nSupplements and OTC: ' + list(A, 'supp', 'supp_list') +
      '\nCurrent peptides, GH or hormone therapy: ' + list(A, 'curpep', 'curpep_list') +
      '\nCopper or zinc: ' + pick(A, 'cuzn') + (txt(A, 'cuzn_what') ? ' - ' + txt(A, 'cuzn_what') : '') +
      '\nMedication allergies: ' + (A.alg === 'No' ? 'NKDA' : list(A, 'alg', 'alg_list')) +
      '\nExcipient allergies: ' + pick(A, 'exc') + (txt(A, 'exc_what') ? ' - ' + txt(A, 'exc_what') : '') });

    var ros = SECTIONS.filter(function (s) { return s.key === 'ros'; })[0].items;
    S.push({ t: 'ROS', body:
      ros.map(function (it) { return it.label + ': ' + grp(A, it.id); }).join('\n') +
      '\n\nPatient-reported at this visit.' });

    var steps = [
      'Baseline labs ordered today: ' + pl.name + '. ' +
        (pl.tests.length ? pl.tests.join('; ') + '. ' : '') +
        (pl.fee !== null ? '$' + pl.fee.toFixed(0) + ' one-time baseline lab fee, billed to the patient.' : ''),
      'No prescription issued at this visit.',
      'Ops schedules the 45-minute lab review once results are in. IGF-1 required and never waived. Zinc and copper required before scheduling only if GHK-Cu is being considered.',
      'Program and agent selected at that visit. One agent at initiation.',
      'Investigational status counseling documented. No outcome guarantees.'
    ];
    if (A.pepconsent && A.pepconsent !== 'Signed and on file')
      steps.push('Peptide therapy consent to be signed before any prescription.');
    if (A.teleconsent === 'Not obtained')
      steps.push('Telehealth consent to be obtained and documented.');
    S.push({ t: 'PLAN', body: steps.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') });

    return { sections: S, result: r, panel: pl };
  }

  /* ── self-check ───────────────────────────────────────────────────────────
     node -e "require('./korb-fhl-intake-data.js').selfCheck()" or from the page
     console. Exits by throwing, so a node run fails loudly. */
  function selfCheck() {
    var problems = [], seen = {};
    function nonAscii(s) { return /[^\x00-\x7E\n]/.test(s); }
    allItems().forEach(function (it) {
      if (seen[it.id]) problems.push('duplicate item id ' + it.id);
      seen[it.id] = 1;
      if (nonAscii(it.q) || nonAscii(it.note || '') || nonAscii((it.hint || {}).text || ''))
        problems.push(it.id + ': non-ASCII text');
      (it.options || []).forEach(function (o) {
        if (nonAscii(o.v) || nonAscii(o.f || '')) problems.push(it.id + ': non-ASCII option ' + o.v);
        if (o.lv && o.lv !== 'stop' && o.lv !== 'review') problems.push(it.id + ': bad level ' + o.lv);
        if (o.via) {
          var fu = item(o.via);
          if (!fu) problems.push(it.id + ': via ' + o.via + ' does not exist');
          else if (!fu.when) problems.push(o.via + ': follow-up with no when()');
        }
        if (o.none && it.type !== 'multi') problems.push(it.id + ': none option on a non-multi');
      });
    });
    /* Don's rule as structure: only Part B, pregnancy and a prior peptide
       reaction may decline. A behavioural test alone missed a Part C item
       turned into an absolute, because its unanswered follow-up softened it. */
    var MAY_STOP = ['partb', 'preg', 'peprxn'];
    allItems().forEach(function (it) {
      (it.options || []).forEach(function (o) {
        if (o.lv === 'stop' && MAY_STOP.indexOf(it.id) < 0) problems.push(it.id + ': "' + o.v + '" declines, and only Part B may');
      });
    });
    ['partb', 'partc', 'pmh', 'goals', 'tried', 'surg', 'fhx', 'ros_h', 'ros_r', 'ros_m', 'ros_s', 'ros_z', 'ros_g', 'ros_n']
      .forEach(function (id) { if (!item(id)) problems.push('missing item ' + id); });

    /* The rule, tested both ways rather than read. */
    var c = { state: 'TX', stateName: 'Texas', date: '', sex: 'F', age: 40 };
    function v(A, cx) { return evaluate(A, cx || c).verdict; }
    if (v({}) !== 'QUALIFIES') problems.push('empty answers should qualify, got ' + v({}));
    if (v({ partb: ['Sleep apnea'], osa: 'Untreated' }) !== 'DOES NOT QUALIFY') problems.push('untreated OSA must decline');
    if (v({ partb: ['Sleep apnea'], osa: 'Treated, uses CPAP or other treatment regularly' }) !== 'QUALIFIES WITH REVIEW') problems.push('treated OSA must be review');
    if (v({ partb: ['Cancer history, treatment finished'], cahx: '5 or more years ago' }) !== 'QUALIFIES WITH REVIEW') problems.push('cancer 5y+ must be review');
    if (v({ partb: ['Cancer history, treatment finished'], cahx: 'Not sure' }) !== 'DOES NOT QUALIFY') problems.push('cancer unsure must decline');
    if (v({ partc: ['Thyroid condition', 'Chronic liver disease or hepatic impairment'] }) !== 'QUALIFIES WITH REVIEW') problems.push('Part C must never decline');
    if (v({ partc: ['Thyroid condition', 'Competitive athlete subject to drug testing'], thy: 'No, untreated', wada: 'Tested in competition' }) !== 'QUALIFIES WITH REVIEW') problems.push('Part C with follow-ups answered must never decline');
    if (v({ preg: 'Currently breastfeeding' }) !== 'DOES NOT QUALIFY') problems.push('breastfeeding must decline');
    if (v({ preg: 'Currently breastfeeding' }, { state: 'TX', stateName: 'Texas', sex: 'M', age: 40 }) !== 'QUALIFIES') problems.push('pregnancy answer must be ignored for a male');
    if (v({ pepb: 'No', peprxn: 'Yes' }) !== 'QUALIFIES') problems.push('hidden peptide reaction must be ignored');
    if (v({}, { state: 'TX', stateName: 'Texas', sex: 'M', age: 17 }) !== 'DOES NOT QUALIFY') problems.push('under 18 must decline');

    /* Every note section builds, and is ASCII, for an empty and a full answer set. */
    var full = {};
    allItems().forEach(function (it) {
      if (it.type === 'multi') full[it.id] = it.options.filter(function (o) { return !o.none; }).map(function (o) { return o.v; });
      else if (it.options) full[it.id] = it.options[0].v;
      else full[it.id] = it.type === 'num' ? 5 : 'x';
    });
    [{}, full].forEach(function (A, i) {
      ['M', 'F'].forEach(function (sx) {
        var n = note(A, { state: 'TX', stateName: 'Texas', date: '11/04/2026', sex: sx, age: 50 });
        n.sections.forEach(function (s) {
          if (!s.body) problems.push('empty section ' + s.t);
          if (nonAscii(s.body)) problems.push('non-ASCII in ' + s.t + (i ? ' (full)' : ' (empty)'));
          if (/undefined|null|NaN|\[object/.test(s.body)) problems.push('bad value in ' + s.t + ': ' + s.body.slice(0, 80));
        });
      });
    });

    if (problems.length) throw new Error('KORB_FHL_INTAKE.selfCheck failed:\n  ' + problems.join('\n  '));
    return 'KORB_FHL_INTAKE OK: ' + allItems().length + ' items in ' + SECTIONS.length + ' sections';
  }

  return {
    meta: { version: '1.0', date: '2026-11-04',
      source: 'Tebra New Consultation Peptide Questionnaire, 29 June 2026 (confirmed final by Don 14 Sep 2026)' },
    sections: sections, prune: prune, evaluate: evaluate, note: note, panel: panel,
    item: item, answered: answered, selfCheck: selfCheck
  };
})();

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_FHL_INTAKE; }
