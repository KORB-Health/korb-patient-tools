/* korb-dots-snippets.js
   Chart and patient snippets for the Premier semaglutide Dots and the Metabolic
   Low-Dose Pathway. Don, 2026-10-29.

   ONE SOURCE FOR TWO PLACES. Each `text` is written in Text Blaze syntax, so a
   provider can paste it into Text Blaze under its `shortcut`, and
   KORB_GLP1_Dots_Chart_Snippets.html reads the same string and turns each
   {formmenu: ...} into a drop-down and each {formtext: ...} into a box. Change
   the wording here and both follow.

   TEXT BLAZE RULE: a ; ends a setting. Never put a ; inside a default value or a
   drop-down choice; use a comma. selfCheck() fails if one does.

   Every justification snippet asks for the real result, its date and its source.
   It records what the chart shows; it never supplies a reason. Below every route,
   the snippet is /ponotyet.

   No PHI, no prices, no charge codes: this file is public (GitHub Pages). */
var KORB_DOTS_SNIPPETS = {
  meta: {
    version: '1.0',
    updated: '2026-10-29',
    owner: 'Donald Stevenson, PA-C, Director of Clinical Operations',
    policy: 'GLP-1 Therapy Clinical Governance Policy v2.0 (draft for Medical Director signature)'
  },

  snippets: [
    {
      key: 'maint', shortcut: '/pomaint', label: 'Maintenance (door 2)', group: 'Chart note',
      when: 'Documented past BMI of 25 or higher, now at or near goal, current BMI 20 or higher.',
      text: 'METABOLIC LOW-DOSE PATHWAY - DOOR 2, MAINTENANCE\n' +
        'History: BMI {formtext: name=pastbmi; default=xx.x} on {formtext: name=pastdate; default=MM/DD/YYYY}, source {formmenu: KORB chart; prior provider records; prior GLP-1 prescription; pharmacy label; lab or visit report listing weight; name=source}, BMI 25 or higher at the time (Z86.39).\n' +
        'Current BMI {formtext: name=bmi; default=xx.x} ({formtext: name=z68; default=Z68.xx}), verified at video visit, 20 or higher.\n' +
        'Why now: {formmenu: weight regain has started; hormonal transition (perimenopause, menopause or andropause); already maintaining on a GLP-1 elsewhere; KORB patient continuing maintenance; name=whynow}.\n' +
        'Plan: semaglutide sublingual {formmenu: 1 mg; 5 mg; name=dose} daily, {formmenu: 90-day; 30-day; name=supply} supply, to maintain the result. Reduce as BMI nears 20; stop below 20.\n' +
        'Why this product: {formmenu: patient prefers a daily option to injections; needle aversion; GI tolerance of injectable; no commercial sublingual form; name=why}.'
    },
    {
      key: 'dx', shortcut: '/podx', label: 'Low dose, diagnosis (door 3)', group: 'Chart note',
      when: 'A qualifying metabolic diagnosis already documented in outside records, BMI 20 or higher.',
      text: 'METABOLIC LOW-DOSE PATHWAY - DOOR 3\n' +
        'Indication: {formmenu: prediabetes (R73.03); impaired fasting glucose (R73.01); insulin resistance (E88.819); metabolic syndrome (E88.810); PCOS with insulin resistance (E28.2, E88.819); fatty liver, MASLD (K76.0); name=dx}.\n' +
        'Meets criterion: {formtext: name=result; default=e.g. A1c 5.9%} dated {formtext: name=resultdate; default=MM/DD/YYYY}, source {formmenu: PCP labs; specialist records; prior lab report; outside imaging; name=src}.\n' +
        'BMI {formtext: name=bmi; default=xx.x} ({formtext: name=z68; default=Z68.xx}), at or above floor of 20. Below weight loss criteria.\n' +
        'Plan: semaglutide sublingual 1 mg daily, 90-day supply, held at the low dose.\n' +
        'Treating this condition with this medicine only. PCP {formtext: name=pcp; default=name, or advised to establish} manages all other care for it.\n' +
        'Why this product: {formmenu: no commercial sublingual form; patient preference for a daily option; needle aversion; GI tolerance; name=why}.\n' +
        'Goal marker: {formmenu: A1c; HOMA-IR; triglycerides and HDL; ALT; name=marker}. Recheck yearly before renewal (PCP labs). Stop or reduce if BMI below 20.'
    },
    {
      key: 'homa', shortcut: '/pohoma', label: 'HOMA-IR calculation', group: 'Chart note',
      when: 'Insulin resistance in door 3. Add under /podx.',
      text: 'HOMA-IR = fasting glucose {formtext: name=glu; default=mg/dL} x fasting insulin {formtext: name=ins; default=uIU/mL} / 405 = {formtext: name=homa; default=x.x} (2.5 or higher meets the criterion).'
    },
    {
      key: 'wl', shortcut: '/powl', label: 'Weight loss start', group: 'Chart note',
      when: 'Current BMI 25 or higher, starting the Dots for weight loss.',
      text: 'SEMAGLUTIDE SUBLINGUAL (PREMIER DOT) - WEIGHT LOSS\n' +
        'BMI {formtext: name=bmi; default=xx.x} ({formtext: name=z68; default=Z68.xx}); {formmenu: E66.811; E66.812; E66.813; E66.3; name=e66}; weight-related condition: {formmenu: none needed, Dots open at BMI 25 or higher; hypertension (I10); hyperlipidemia (E78.5); obstructive sleep apnea (G47.33); prediabetes (R73.03); type 2 diabetes (E11.9); fatty liver (K76.0); PCOS (E28.2); coronary artery disease (I25.10); knee osteoarthritis (M17.9); name=comorb}.\n' +
        'Start: semaglutide sublingual 5 mg daily, {formmenu: 30-day starter; 90-day; name=supply} supply. {formmenu: GLP-1 naive.; Coming from injectable semaglutide: restarted at 5 mg, not converted by equivalence.; name=hx}\n' +
        'Why sublingual: {formmenu: patient prefers a daily option to injections; needle aversion; GI tolerance of injectable; name=why}.\n' +
        'Follow-up: {formmenu: 30; 90; name=fu} days, matching supply.'
    },
    {
      key: 'up', shortcut: '/poup', label: 'Step up', group: 'Chart note',
      when: 'At least 4 weeks on the current Dot, response short, side effects mild.',
      text: 'Dose change: semaglutide sublingual {formmenu: 5 mg to 10 mg; 10 mg to 20 mg; name=step} daily. On current dose {formtext: name=weeks; default=xx} weeks; response {formtext: name=resp; default=e.g. weight down 2 lb in 6 weeks}; side effects {formmenu: none; mild, tolerated; name=se}. 90-day supply; follow-up 90 days.'
    },
    {
      key: 'consent', shortcut: '/poconsent', label: 'Compounded consent', group: 'Chart note',
      when: 'Every first compounded prescription, and again on any change of drug or form (LegitScript #40).',
      text: 'Consent: verbal consent obtained for compounded medication. Discussed: compounded by Premier Pharmacy, not FDA-approved, no commercial equivalent, off-label at this dose; how much is absorbed under the tongue is not known, so the dose is adjusted by response and tolerance; FDA-approved options exist and were discussed. Take on an empty stomach, let it dissolve fully, nothing by mouth for 15 minutes. Common GI side effects reviewed. Stop and contact KORB or go to the ER for severe abdominal pain, pain to the back, persistent vomiting or a neck mass. Patient verbalized understanding and agrees.'
    },
    {
      key: 'screen', shortcut: '/poscreen', label: 'Safety screen', group: 'Chart note',
      when: 'Every start.',
      text: 'Screen: no personal or family history of MTC or MEN2; not pregnant, breastfeeding or planning pregnancy; no hypersensitivity to semaglutide; no active eating disorder (SCOFF {formtext: name=scoff; default=0/5}). Relative items: {formtext: name=rel; default=none}. BMI 20 or higher.'
    },
    {
      key: 'rfc', shortcut: '/porfc', label: 'Reason for compounding (Tebra, 30 max)', group: 'Tebra field',
      when: 'Pick the one that is true for this patient. Paste into Reason for Compounding.',
      limit: 30,
      text: '{formmenu: Sublingual, no commercial form; Needle aversion, SL daily dose; GI intol inj, SL daily dose; Pt pref daily SL option; name=rfc}'
    },
    {
      key: 'notyet', shortcut: '/ponotyet', label: 'Not eligible yet (chart)', group: 'Chart note',
      when: 'No route applies today: current BMI below 25, no documented past BMI of 25 or higher, no documented diagnosis.',
      text: 'GLP-1 evaluated. Current BMI below 25; no documented past BMI of 25 or higher and no documented qualifying metabolic diagnosis on file. Not eligible for GLP-1 under KORB policy at this time. Discussed: patient may provide recent PCP labs or records (A1c, fasting glucose, fasting insulin, lipids) for review; {formmenu: Functional Health & Longevity offered; healthy eating and activity counseling provided (Z71.3); name=offer}. Reassess if new records or circumstances.'
    },
    {
      key: 'notyetmsg', shortcut: '/ponotyetmsg', label: 'Not eligible yet (patient message)', group: 'Patient message',
      when: 'Send after /ponotyet.',
      text: 'Thank you for meeting with me today. Based on what we have on file right now, a GLP-1 is not the right fit yet. If you have recent lab results from your primary care provider, such as A1c, fasting glucose, fasting insulin or cholesterol, send them to us and I will review them. I am also happy to talk about other KORB programs that may help with your goals.'
    },
    {
      key: 'pt', shortcut: '/popt', label: 'Low dose 1 mg (patient message)', group: 'Patient message',
      when: 'After prescribing the 1 mg Dot.',
      text: 'I sent your semaglutide prescription to Premier Pharmacy: one 1 mg Dot under your tongue each morning on an empty stomach. Let it dissolve fully, and wait 15 minutes before you eat or drink. This is a low daily dose. Most people have mild or no side effects; the most common are nausea, fullness or constipation, usually early on. If you have severe stomach pain, pain that goes to your back, or vomiting you cannot stop, stop the medication and contact us or go to the ER.'
    }
  ]
};

/* Parse one snippet into parts: plain text, and fields with their options. */
KORB_DOTS_SNIPPETS.parse = function (text) {
  var parts = [], re = /\{(formtext|formmenu):\s*([^}]*)\}/g, last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ type: 'text', value: text.slice(last, m.index) });
    var args = m[2].split(';').map(function (s) { return s.trim(); }).filter(Boolean);
    var f = { type: m[1], name: '', def: '', options: [] };
    args.forEach(function (a) {
      var kv = /^(name|default)=(.*)$/.exec(a);
      if (kv) { if (kv[1] === 'name') f.name = kv[2]; else f.def = kv[2]; }
      else f.options.push(a);
    });
    if (f.type === 'formmenu' && !f.def) f.def = f.options[0] || '';
    parts.push(f);
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ type: 'text', value: text.slice(last) });
  return parts;
};

/* Placeholders that mean "not filled in yet". The page warns while any remain. */
KORB_DOTS_SNIPPETS.isPlaceholder = function (v) {
  return /^(xx(\.x)?|x\.x|MM\/DD\/YYYY|Z68\.xx|mg\/dL|uIU\/mL|e\.g\. .*|name, or advised to establish)$/.test(String(v).trim());
};

KORB_DOTS_SNIPPETS.selfCheck = function () {
  var S = KORB_DOTS_SNIPPETS, problems = [], seen = {};
  S.snippets.forEach(function (s) {
    if (seen[s.shortcut]) problems.push(s.shortcut + ': duplicate shortcut');
    seen[s.shortcut] = 1;
    if (!/^\/po/.test(s.shortcut)) problems.push(s.shortcut + ': shortcuts start with /po (a /do... shortcut clashes in Text Blaze)');
    var names = {};
    S.parse(s.text).forEach(function (p) {
      if (p.type === 'text') return;
      if (!p.name) problems.push(s.shortcut + ': a field has no name');
      if (names[p.name]) problems.push(s.shortcut + ': field name ' + p.name + ' used twice');
      names[p.name] = 1;
      if (p.type === 'formmenu' && p.options.length < 2) problems.push(s.shortcut + ': drop-down ' + p.name + ' has fewer than 2 choices (a ; inside a choice splits it)');
      if (s.limit) p.options.forEach(function (o) { if (o.length > s.limit) problems.push(s.shortcut + ': "' + o + '" is over ' + s.limit + ' characters'); });
    });
    if (/[^\x00-\x7F]/.test(s.text)) problems.push(s.shortcut + ': non-ASCII character; Tebra and Text Blaze paste may drop it');
  });
  return problems;
};
