/* ============================================================================
   KORB HEALTH - FH&L PEPTIDE Q&A AND COUNSELING GUIDE        SOURCE OF TRUTH

   The counseling and regulatory language a provider uses with a Functional
   Health & Longevity peptide patient. Rendered as
   Provider_Reference/KORB_FHL_Peptide_Counseling_Guide.html by
   build-clinical-docs.js.

   WHERE THIS CAME FROM

   "KORB Provider Peptide QA Counseling Guide.docx", a Word file created
   2026-07-04 in the shared drive's archive folder, 20 Archived Documents &
   Products > Q&A -- Talking Points. A provider asked Don on 2026-09-29 for
   permission to use it. Checked against the repo that day it had three errors
   (standalone GHK-Cu offered in Foundation, a $199 baseline lab fee against
   the real $99, Tesamorelin at two doses instead of three), the MSO in its
   byline, a question about the July 2026 FDA meeting still written as future,
   and partner prices shown as though they were the only prices. Every one of
   those is a fact korb-dosing-data.js already held correctly. The Word copy
   could not read it, so it drifted for three months.

   WHAT IS HERE AND WHAT IS NOT

   Only the PROSE lives here: the positioning of each agent, the Q&A, the
   approved and forbidden language, the safety and documentation lists. That
   prose appears nowhere else in the repo.

   Every PROGRAM FACT is read from korb-dosing-data.js at build(): which agents
   each tier offers, the dose options, the stagger weeks, the prices, the
   baseline lab fee. None of them is typed below. If a price or a dose changes
   in the dosing file, this document follows on the next page load.

   The formulary rows here carry positioning text only. selfCheck() asserts the
   set of agents they cover is exactly the set the dosing file's programs
   offer, so an agent added to or removed from a program cannot be missing from
   or left behind on this page.

   korb-dosing-data.js MUST LOAD FIRST. build() runs at load when KORB_DOSING
   is present, and the document is null until it has. The builder refuses a
   document with no sections, so a missing script fails loudly.

   NOT YET SIGNED. The prose is carried over from the July Word file with the
   corrections above and Don's 2026-09-29 answer on question 7. Nobody has
   reviewed it in this repo. The regulatory answers (questions 4 to 7) and
   the language lists are compliance language; Nick should read them too.
   Sign-off lives in artifactSignoff below, read by artifact-signoff.js.
   ============================================================================ */
var KORB_FHL_COUNSEL = {
  meta: {
    version: '1.0',
    updated: '2026-09-29',
    source: 'KORB Provider Peptide QA Counseling Guide.docx (2026-07-04), corrected'
  },

  /* Read by artifact-signoff.js. The page is fingerprinted on its rendered
     text, like a handout, because it has no prescribing blocks. */
  artifactSignoff: {
    records: {}
  },

  /* ── PROSE ──────────────────────────────────────────────────────────── */
  content: {
    intro:
      'How to explain the Functional Health & Longevity peptide program, what each ' +
      'agent is and is not, and the regulatory, safety and documentation points every ' +
      'visit has to cover. Program structure, doses and prices on this page are read ' +
      'from the program data file, so they match the provider references and the ' +
      'patient pages.',

    overview: [
      'The KORB Functional Health & Longevity peptide program is a telemedicine-based, ' +
      'provider-led program under Medical Director oversight. It uses select compounded ' +
      'or off-label peptide therapies as adjunctive support for recovery, body ' +
      'composition, performance and healthy-aging goals.',
      'Peptide therapy is not a cure, not a replacement for standard medical care, and ' +
      'not a substitute for lifestyle foundations such as nutrition, resistance ' +
      'training, sleep and stress management.'
    ],
    pricingRule:
      'Billing, CPT and pricing changes must be confirmed with Nick before quoting ' +
      'anything beyond the approved pricing language.',

    /* One row per agent family the programs offer. Keyed by the family name
       the dosing file uses (programs.<x>.primaryFamily, agentChoices,
       baseProtocol, optionalAddon). Positioning only - no dose, no week, no
       price. */
    formulary: {
      sermorelin: {
        positioning: 'GHRH analog',
        talkingPoint: 'Stimulates the patient\'s own GH/IGF-1 production. Not growth ' +
          'hormone replacement. May support sleep, recovery and body composition.'
      },
      bpc157: {
        positioning: 'Investigational recovery-support peptide',
        talkingPoint: 'The evidence base is primarily preclinical and animal data. No ' +
          'large human trials. Counsel conservatively.'
      },
      cjcipam: {
        positioning: 'Dual GH-axis stimulator',
        talkingPoint: 'Supports pulsatile GH/IGF-1 signaling. Human pharmacokinetic and ' +
          'endocrine data exist, but body composition outcomes are extrapolated.'
      },
      ghkcu: {
        positioning: 'Copper-binding peptide',
        talkingPoint: 'Used for skin, collagen and tissue-support goals. Requires copper, ' +
          'zinc and ceruloplasmin monitoring. Contraindicated in Wilson\'s disease.'
      },
      tesamorelin: {
        positioning: 'GHRH analog with the strongest human evidence',
        talkingPoint: 'FDA-approved for HIV-associated lipodystrophy. Use in this program ' +
          'is off-label for visceral adiposity and body composition goals.'
      }
    },

    notOffered: ['TB-500', 'AOD-9604', 'Epithalon', 'Thymosin Alpha-1',
                 'Troches or sublingual formats'],
    notOfferedAnswer:
      '"That therapy is not part of KORB\'s current active peptide formulary. The ' +
      'provider can discuss current program options during your visit."',

    cycle: [
      'All programs run on a 16-week active cycle.',
      'Baseline visit: labs only. No prescription is sent and no follow-up is scheduled ' +
      'at that visit. Operations schedules the next visit once Quest results are back ' +
      'and available for provider review.',
      'Week 12: mandatory Quest lab draw, completed at least one week before the ' +
      'Week 16 renewal visit.',
      'Week 16: renewal visit. The provider reviews labs, response, side effects, ' +
      'adherence, goals and safety, and decides whether to continue, adjust, ' +
      'discontinue or switch therapy.'
    ],
    cycleWhy:
      'Why no prescription at the baseline visit? Labs are part of the safety screen. ' +
      'Therapy does not start until the provider has reviewed the baseline data and ' +
      'confirmed the plan is clinically appropriate.',

    /* The Q&A. `{TESA_DOSES}` and `{FOUNDATION_AGENTS}` are filled from the
       dosing file at build(); nothing else is templated. */
    qa: [
      { q: 'Are these peptides FDA-approved?',
        a: ['Most peptide therapies in this program are not FDA-approved for the way ' +
            'they are used here. Some agents have stronger human data than others. ' +
            'Tesamorelin is FDA-approved for HIV-associated lipodystrophy, but its use ' +
            'in this program is off-label. Compounded therapies are not the same as ' +
            'FDA-approved commercial products.'],
        dontSay: ['"These are FDA-approved peptides."', '"The FDA approved this program."',
                  '"Compounded means safer."', '"This is basically the same as an approved product."'] },
      { q: 'What does "off-label" mean?',
        a: ['Off-label use means a medication is used outside its FDA-approved indication. ' +
            'Off-label prescribing is common in medicine when clinically appropriate, but ' +
            'it requires a clear risk-benefit discussion, realistic expectations and ' +
            'appropriate monitoring.'] },
      { q: 'What does "compounded" mean?',
        a: ['A compounded medication is prepared by a licensed compounding pharmacy for a ' +
            'patient-specific use. Compounded medications are not FDA-approved products ' +
            'and have not gone through FDA review for safety, purity or efficacy of the ' +
            'specific compounded formulation.'] },
      { q: 'What do Category 1 and Category 2 mean?',
        a: ['These are FDA compounding categories for bulk drug substances under the 503A ' +
            'framework. Category 1 generally refers to substances under FDA evaluation ' +
            'that may be eligible for compounding under FDA\'s interim policy. Category 2 ' +
            'refers to substances FDA has identified as raising potential significant ' +
            'safety risks. Neither category means FDA approval or FDA endorsement.'] },
      { q: 'Does removal from Category 2 mean FDA approval?',
        a: ['No. Removal from Category 2 does not mean FDA approval, and it does not ' +
            'automatically place a substance in Category 1. It means the regulatory ' +
            'status may be changing or unresolved. KORB uses only current, approved ' +
            'protocols and KORB-approved pharmacy pathways.'] },
      { q: 'What should I say if the patient asks, "Is this legal?"',
        a: ['The regulatory framework for compounded peptides is evolving. KORB follows ' +
            'current guidance, uses KORB-approved licensed pharmacy pathways, and offers ' +
            'only therapies included in the approved formulary. Availability can change ' +
            'with federal guidance, state rules and pharmacy policy.'],
        dontSay: ['"It is legal now."', '"It is a gray zone."', '"The FDA reversed the ban."',
                  '"We can prescribe it because you have a prescription."'] },
      /* Rewritten 2026-09-29 on Don's answer. The July text said the meeting was
         scheduled and the outcome pending. The committee met 23-24 July 2026 and
         voted to recommend several peptides, BPC-157 among them, for the 503A
         bulks list. The vote is advisory; FDA's final decision was still pending
         at the end of September. Don: none of KORB's formulary agents is on the
         Category 2 list, so the outcome changes nothing KORB is proposing. */
      { q: 'What should I say about the July 2026 FDA meeting?',
        a: ['FDA\'s Pharmacy Compounding Advisory Committee met in July 2026 and voted to ' +
            'recommend several peptides, BPC-157 among them, for the 503A bulks list. The ' +
            'vote is a recommendation, not a decision. FDA has not yet issued its final ' +
            'decision, which is expected in the coming months.',
            'It does not change KORB\'s current program. None of the agents on KORB\'s ' +
            'formulary is on the Category 2 list, so KORB continues to offer the same ' +
            'therapies through the same pharmacy pathways while FDA finalizes.',
            'Do not describe the vote as FDA approval, and do not predict the final ' +
            'decision. The committee also recommended some peptides KORB does not offer; ' +
            'that does not add them to the formulary. Any formulary change goes through ' +
            'KORB leadership, Medical Director oversight and the pharmacy partners first.'] },
      { q: 'How should I explain BPC-157?',
        a: ['BPC-157 is investigational. The rationale for use rests largely on animal and ' +
            'preclinical data on tissue and musculoskeletal recovery. There are no large, ' +
            'high-quality human trials proving benefit or long-term safety. If used, frame ' +
            'it as an adjunctive support tool, not a treatment or cure.'],
        phrase: '"BPC-157 may be considered for recovery-support goals, but the human ' +
                'evidence is limited, and results are not guaranteed."' },
      { q: 'How should I explain Sermorelin?',
        a: ['Sermorelin is a GHRH analog that stimulates the pituitary to release the ' +
            'patient\'s own growth hormone in a more physiologic pattern. It is not ' +
            'exogenous growth hormone replacement. Monitoring focuses on IGF-1 response ' +
            'and metabolic safety.',
            'Monitoring matters because GH-class effects can include fluid retention, ' +
            'arthralgia, carpal-tunnel-type symptoms and insulin resistance.'] },
      { q: 'How should I explain CJC-1295/Ipamorelin?',
        a: ['CJC-1295/Ipamorelin is a dual GH-axis stimulation approach. It may support ' +
            'GH/IGF-1 signaling, sleep, recovery and body composition goals, but the body ' +
            'composition benefits are extrapolated from GH-axis literature rather than ' +
            'proven in large outcome trials for this use.'] },
      { q: 'How should I explain GHK-Cu?',
        a: ['GHK-Cu is a copper-binding peptide used for tissue, collagen and skin-support ' +
            'goals. Because it involves copper biology, KORB requires copper-related ' +
            'monitoring: copper, zinc and ceruloplasmin. Wilson\'s disease is an absolute ' +
            'contraindication.'] },
      { q: 'How should I explain Tesamorelin?',
        a: ['Tesamorelin has the strongest human clinical evidence of the current ' +
            'formulary because it is FDA-approved for HIV-associated lipodystrophy. In ' +
            'KORB\'s program it is used off-label for body composition and visceral ' +
            'adiposity goals. The dose ({TESA_DOSES}) is a provider decision based on ' +
            'clinical factors, not a patient preference menu.'] },
      { q: 'Can patients choose their peptide?',
        a: ['Patients can share their goals and preferences, but the provider determines ' +
            'what is clinically appropriate based on history, labs, contraindications, ' +
            'goals and program tier.'] },
      { q: 'Why is Foundation limited to one peptide?',
        a: ['Foundation is intentionally conservative. One active peptide at a time, ' +
            'chosen from {FOUNDATION_AGENTS}, allows better attribution of response, ' +
            'tolerability, side effects and value. It also reduces complexity and avoids ' +
            'unnecessary stacking.'] },
      { q: 'Why are Gateway and Peak staggered?',
        a: ['Staggering allows cleaner adverse-event attribution and a more controlled ' +
            'introduction of therapies. If several agents start at once and the patient ' +
            'develops side effects, it becomes harder to tell which therapy caused them.'] },
      { q: 'Can peptides be stacked?',
        a: ['Only within the approved Gateway or Peak Performance structures. Foundation ' +
            'does not allow simultaneous agents, and GHK-Cu is never a Foundation option. ' +
            'Add-ons are restricted to eligible tiers and follow the approved staggered ' +
            'schedule.'] }
    ],

    safety: ['Subcutaneous injection technique', 'Site rotation',
             'New syringe for every injection', 'Never combine two products in one syringe',
             'Refrigerate at 36\u201346\u00b0F', 'Do not freeze', 'Protect from light',
             'Discard 28 days after first puncture or opening',
             'Sharps disposal is the patient\'s responsibility',
             'Pregnancy requires a hold and reassessment',
             'Active malignancy is a universal contraindication',
             'WADA and anti-doping risk disclosure'],

    contraindications: ['Active malignancy', 'Pregnancy or breastfeeding',
                        'Known hypersensitivity to the peptide or formulation components',
                        'Inability or unwillingness to complete monitoring',
                        'Unreliable follow-up', 'Serious adverse reaction to therapy',
                        'Concerning unexplained symptoms requiring evaluation'],
    contraindicationsNote:
      'Provider-only clinical language. Not for Operations to interpret or use for ' +
      'disqualification. Agent-specific contraindications and cautions follow the ' +
      'provider protocol.',

    documentation: ['Patient goals', 'Program tier selected', 'Peptide selected',
                    'Baseline labs reviewed', 'Risk/benefit discussion',
                    'FDA, off-label and compounded medication counseling',
                    'Evidence limitations', 'Contraindications reviewed',
                    'WADA and anti-doping disclosure when applicable',
                    'Dosing and administration counseling',
                    'Storage and 28-day discard counseling',
                    'Follow-up and lab monitoring plan', 'Patient questions answered',
                    'Patient understanding and agreement'],

    escalate: ['Abnormal labs that change risk', 'New cancer diagnosis or concern',
               'Pregnancy or breastfeeding', 'Serious allergic reaction',
               'Injection-site infection', 'New systemic symptoms',
               'Significant glucose or insulin worsening on GH-axis therapy',
               'IGF-1 above the protocol target', 'Copper abnormality on GHK-Cu',
               'Patient using non-KORB peptides or research-use products',
               'Patient unwilling to complete labs or follow-up'],

    approved: [
      ['General program', '"This is a provider-led, Medical Director-overseen program using ' +
        'select peptide therapies as adjunctive support for recovery, body composition, ' +
        'performance, and healthy-aging goals."'],
      ['FDA and compounded medication', '"Most therapies in this program are not ' +
        'FDA-approved for the way they are used here. Some may be compounded or prescribed ' +
        'off-label. Your provider will explain the risks, benefits, alternatives, and ' +
        'monitoring before treatment."'],
      ['Results', '"Results vary and are not guaranteed. Each therapy is treated as a ' +
        'time-limited trial and reassessed based on response, tolerability, labs, and safety."'],
      ['BPC-157', '"BPC-157 is investigational. The evidence is primarily preclinical, and ' +
        'there are no large human trials proving benefit or long-term safety for the ' +
        'recovery goals commonly discussed."'],
      ['Tesamorelin', '"Tesamorelin is FDA-approved for HIV-associated lipodystrophy. In ' +
        'this program, it is used off-label when clinically appropriate."'],
      ['Safety', '"The provider reviews your history, labs, and risk factors to determine ' +
        'whether the potential benefits outweigh the risks."']
    ],

    avoidClaims: ['"Heals injuries"', '"Repairs tendons"', '"Regenerates tissue"',
                  '"Reverses aging"', '"Melts fat"', '"Boosts immunity"',
                  '"Cures inflammation"', '"Guaranteed results"',
                  '"Clinically proven peptide stack"', '"Wolverine stack"',
                  '"No side effects"', '"Safe for everyone"'],
    avoidRegulatory: ['"FDA-approved peptide program"', '"FDA approved this peptide"',
                      '"FDA says this is safe now"', '"The ban was reversed"',
                      '"Legal again"', '"Gray zone"',
                      '"Research peptides are fine if prescribed"',
                      '"Compounded peptides are safer"',
                      '"This is the same as the commercial drug"']
  },

  document: null,

  /* ── BUILD ───────────────────────────────────────────────────────────
     Assembles the document from the prose above and the program facts in
     korb-dosing-data.js. Throws rather than guessing when a fact it needs is
     missing, because a tier row with a blank price reads as "free". */
  build: function (DOS) {
    var C = this.content;
    var P = DOS.programs, PR = DOS.pricing, A = DOS.agents;

    function money(n) {
      if (typeof n !== 'number') throw new Error('korb-fhl-counsel-data: missing price');
      return '$' + (n % 1 ? n.toFixed(2) : String(n));
    }
    function name(family) {
      var a = A[family] || A[family + '1mg'];
      if (!a) throw new Error('korb-fhl-counsel-data: no agent "' + family + '" in korb-dosing-data.js');
      return a.label.replace(/ \d.*$/, '');
    }
    function list(items) {
      return items.length < 2 ? items.join('') :
        items.slice(0, -1).join(', ') + ' or ' + items[items.length - 1];
    }
    /* A dose option to its label. Numeric options are micrograms; the
       tesamorelin keys ('1mg', '15mg') resolve through the agent record,
       which is the only place 1.5 mg is spelled. */
    function dose(family, opt) {
      if (/^\d+$/.test(opt)) return opt + ' mcg';
      var a = A[family + opt];
      if (!a || !a.dose) throw new Error('korb-fhl-counsel-data: cannot resolve dose ' + family + ' ' + opt);
      return a.dose;
    }
    function doses(family, opts) {
      if (!opts) return A[family].dose;
      return list(opts.map(function (o) { return dose(family, o); }));
    }
    function price(key) {
      return money(PR[key].partner.payment) + ' partner / ' +
             money(PR[key].website.payment) + ' website';
    }
    function weeks(w) { return 'Weeks ' + w[0] + '-' + w[1]; }

    var bpcW = A.bpc157.onWeeksGatewayPeakBase;
    var ghkW = A.ghkcu.onWeeksOptionalAddon;
    var ghk = 'optional GHK-Cu ' + A.ghkcu.dose + ' add-on, ' + weeks(ghkW) + ' (' +
              money(PR.ghkcu.partner) + ' one-time)';

    var fnd = P.foundation;
    if (fnd.optionalAddon) {
      throw new Error('korb-fhl-counsel-data: Foundation now declares an add-on; this ' +
        'guide says GHK-Cu is never a Foundation option. Update the prose first.');
    }
    var fndAgents = fnd.agentChoices.map(name);
    var fndRow = 'One active peptide at a time, chosen from ' + list(fndAgents) + '. ' +
      fnd.agentChoices.map(function (k) {
        return name(k) + ' ' + doses(k, fnd.primaryDoseOptions[k]);
      }).join('; ') +
      '. No simultaneous agents. Switchable only at each 16-week renewal. GHK-Cu is not ' +
      'a Foundation option.';

    function stagger(key) {
      var p = P[key];
      return name(p.primaryFamily) + ' ' + doses(p.primaryFamily, p.primaryDoseOptions) +
        ' from Week 1, then BPC-157 ' + A.bpc157.dose + ' ' + weeks(bpcW) + ', then ' + ghk + '.';
    }

    var tesaDoses = doses('tesamorelin', P.peakB.primaryDoseOptions);
    function fill(t) {
      return t.replace('{TESA_DOSES}', tesaDoses)
              .replace('{FOUNDATION_AGENTS}', list(fndAgents));
    }

    /* Every family any program offers, in first-seen order. */
    var families = [];
    ['foundation', 'gateway', 'peakA', 'peakB'].forEach(function (k) {
      var p = P[k];
      [].concat(p.agentChoices || [], p.baseProtocol || [], p.optionalAddon || [])
        .forEach(function (f) { if (families.indexOf(f) < 0) families.push(f); });
    });
    this.families = families;

    var baseline = PR.baseline.website === PR.baseline.partner
      ? money(PR.baseline.website) : money(PR.baseline.partner) + ' partner / ' + money(PR.baseline.website) + ' website';

    this.document = {
      title: 'Peptide Q&A and Counseling Guide',
      subtitle: 'Functional Health & Longevity Program',
      kicker: 'Provider Reference',
      entity: 'KORB Health Medical Texas PA',
      version: this.meta.version,
      effective: this.meta.updated,
      intro: C.intro,
      supersedes: 'KORB Provider Peptide QA Counseling Guide.docx (July 2026), which ' +
        'offered GHK-Cu in Foundation, quoted a $199 baseline lab fee and gave ' +
        'Tesamorelin two doses. Do not use the Word copy.',
      noPrescribingBlocks: 'Counseling guide. It carries no Tebra entries; its text is ' +
        'signed in artifact-signoff.js, not here.',
      sections: [
        { id: 'overview', heading: 'Program overview',
          body: C.overview.concat(['Baseline labs: ' + baseline + ' one-time, before program ' +
            'selection. ' + C.pricingRule]) },
        { id: 'tiers', heading: 'Program tiers', render: 'table',
          columns: ['Tier', 'Monthly price', 'Structure'],
          rows: [
            ['Foundation', price('foundation'), fndRow],
            ['Gateway', price('gateway'), 'Staggered. ' + stagger('gateway')],
            ['Peak Performance, Pathway A', price('peakA'), 'Staggered. ' + stagger('peakA')],
            ['Peak Performance, Pathway B', price('peakB'), 'Staggered. ' + stagger('peakB') +
              ' The Tesamorelin dose is the provider\'s decision.']
          ] },
        { id: 'formulary', heading: 'Current active formulary', render: 'table',
          body: ['Only these ' + families.length + ' agents are currently offered.'],
          columns: ['Agent', 'Positioning', 'Key talking point'],
          rows: families.map(function (f) {
            var r = C.formulary[f];
            if (!r) throw new Error('korb-fhl-counsel-data: no formulary row for "' + f + '"');
            var tp = f === 'tesamorelin'
              ? r.talkingPoint + ' Dose (' + tesaDoses + ') is provider-selected, not patient-selected.'
              : r.talkingPoint;
            return [name(f), r.positioning, tp];
          }) },
        { id: 'notoffered', heading: 'Not currently offered', render: 'bullets',
          body: ['Do not reference these as active options.'],
          bullets: C.notOffered,
          callouts: ['If a patient asks about one of these, the approved answer is: ' + C.notOfferedAnswer] },
        { id: 'cycle', heading: 'Cycle structure', render: 'bullets',
          bullets: C.cycle, callouts: [C.cycleWhy] },
        { id: 'qa', heading: 'Provider Q&A', render: 'qa',
          items: C.qa.map(function (x) {
            return { q: x.q, a: x.a.map(fill), dontSay: x.dontSay || null, phrase: x.phrase || null };
          }) },
        { id: 'safety', heading: 'Universal safety counseling points', render: 'bullets',
          bullets: C.safety },
        { id: 'contra', heading: 'Universal contraindications', render: 'bullets',
          bullets: C.contraindications, callouts: [C.contraindicationsNote], warn: true },
        { id: 'docs', heading: 'What must be documented', render: 'bullets',
          bullets: C.documentation },
        { id: 'escalate', heading: 'Hold, stop or escalate', render: 'bullets',
          bullets: C.escalate },
        { id: 'approved', heading: 'Approved language', render: 'table',
          columns: ['Topic', 'Approved wording'], rows: C.approved },
        { id: 'avoid1', heading: 'Language to avoid: overclaiming', render: 'bullets',
          bullets: C.avoidClaims },
        { id: 'avoid2', heading: 'Language to avoid: regulatory', render: 'bullets',
          bullets: C.avoidRegulatory }
      ]
    };
    return this.document;
  },

  selfCheck: function () {
    var problems = [];
    if (!this.document) {
      problems.push('document not built - korb-dosing-data.js must load before korb-fhl-counsel-data.js');
      return problems;
    }
    var fam = this.families || [];
    var rows = Object.keys(this.content.formulary);
    fam.forEach(function (f) {
      if (rows.indexOf(f) < 0) problems.push('program offers "' + f + '" but the formulary has no row for it');
    });
    rows.forEach(function (f) {
      if (fam.indexOf(f) < 0) problems.push('formulary row "' + f + '" is offered by no program in korb-dosing-data.js');
    });
    var txt = JSON.stringify(this.document);
    if (/\{[A-Z_]+\}/.test(txt)) problems.push('an unfilled {TEMPLATE} token reached the document');
    if (/KORB Health Group/.test(txt)) problems.push('document names the MSO; clinical content carries the PA');
    return problems;
  }
};

if (typeof KORB_DOSING !== 'undefined') { KORB_FHL_COUNSEL.build(KORB_DOSING); }
