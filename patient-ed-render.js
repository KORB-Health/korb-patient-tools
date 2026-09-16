/* ============================================================================
   PATIENT EDUCATION RENDERER

   Renders one handout from korb-patient-ed-data.js. Runs in the browser, where
   the page is live, and in build-patient-ed.js, where it produces the PDF. One
   renderer, so the two cannot drift.

   CSS comes from provider-doc-render.js rather than being written again. The
   provider references already carry the brand type scale, the cream/document/
   card surfaces and the Montserrat faces, and a second stylesheet is how a
   patient handout ends up looking almost but not quite like the rest - see the
   note on the screen type scale in that file, which existed in three copies
   before 2026-09-15 and drifted in all three.

   CLINICAL FACTS ARE PULLED, NOT RESTATED. Route, schedule, timing and active
   weeks come from korb-dosing-data.js through agentKey. If a fact is in that
   file this module reads it; if it is written in the prose instead, that is a
   bug, because it is then a second copy that can disagree with the sig.
   ============================================================================ */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = factory(); }
  else { root.KORB_PATIENT_ED_DOCS = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var GLP1DOCS = (typeof module !== 'undefined' && module.exports)
    ? require('./provider-doc-render.js')
    : (typeof KORB_DOCS !== 'undefined' ? KORB_DOCS : null);
  var CSS = GLP1DOCS ? GLP1DOCS.CSS : '';
  var LOGO_URI = GLP1DOCS ? GLP1DOCS.LOGO_URI : '';

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---- the facts that must come from the dosing data ---------------------
     Throws rather than falling back. A handout that quietly prints nothing
     where the schedule should be is worse than a build that stops: the first
     reaches a patient, the second reaches whoever ran the build. */
  /* GLP-1 handouts read a DIFFERENT data file. Same principle, different source:
     korb-glp1-data.js holds route and frequency per product, plus the
     contraindication list every GLP-1 document shares.

     NOT pulled: the titration progression rule. korb-glp1-data.js marks it
     doNotPublish:true, with the note "Internal and provider-facing only. Do not
     put this rule in a patient handout." Checked before reading it rather than
     discovered afterwards. */
  function glp1Facts(GLP1, doc) {
    if (!GLP1 || !GLP1.getProduct) {
      throw new Error('patient-ed-render: korb-glp1-data.js must be loaded first.');
    }
    var p = GLP1.getProduct(doc.productKey);
    if (!p) {
      throw new Error('patient-ed-render: no product "' + doc.productKey + '" in ' +
        'korb-glp1-data.js. Fix the key rather than typing the facts here.');
    }
    return {
      how: doc.howText || 'Subcutaneous (SQ) injection',
      timing: doc.timingText || '',
      schedule: p.frequency || '',
      windows: [],
      activeWeeks: '',
      offWeeks: '',
      additive: p.additive || ''
    };
  }

  /* WHICH contraindications exist is one fact, held in korb-glp1-data.js and
     shared with every provider document. HOW they are said to a patient is a
     different question: the provider list says "eGFR below 30 mL/min/1.73 m2",
     which is not patient language.

     So the list is PULLED and each item is reworded through contraPhrasing,
     keyed by the exact provider string. If a contraindication is added, renamed
     or removed upstream, its key stops matching and the build STOPS. That is
     the point. The alternative is a patient handout quietly missing one, which
     is how the PDF being replaced came to state seven of the nine. */
  function contraindications(GLP1, doc) {
    var list = (GLP1.clinical && GLP1.clinical.contraindications) || [];
    var map = doc.contraPhrasing || {};
    var out = [];
    list.forEach(function (c) {
      if (!Object.prototype.hasOwnProperty.call(map, c)) {
        throw new Error('patient-ed-render: no patient wording for the contraindication "' +
          c + '". It is in korb-glp1-data.js clinical.contraindications but not in ' +
          'contraPhrasing for "' + doc.key + '". Add the wording; do not drop the item.');
      }
      if (map[c]) out.push(map[c]);
    });
    return out;
  }

  function agentFacts(DOSING, doc) {
    if (doc.source === 'glp1') { return glp1Facts(DOSING, doc); }
    /* NO DATA FILE YET. Testosterone has no korb-trt-data.js - that is open item
       6 - so its route and schedule are prose here rather than pulled, and this
       says so plainly instead of letting the page imply it is live. When that
       file exists, delete doc.facts and give the handout a source and a key.
       The "Live" badge is suppressed for these in the builder. */
    if (doc.source === 'none') {
      if (!doc.facts) throw new Error('patient-ed-render: "' + doc.key + '" has source ' +
        '"none" and no facts block. Either give it a data source or state the facts.');
      return { how: doc.facts.how || '', timing: doc.facts.timing || '',
               schedule: doc.facts.schedule || '', windows: [], activeWeeks: '', offWeeks: '' };
    }
    if (!DOSING || !DOSING.agents) {
      throw new Error('patient-ed-render: korb-dosing-data.js must be loaded first.');
    }
    var a = DOSING.agents[doc.agentKey];
    if (!a) {
      throw new Error('patient-ed-render: no agent "' + doc.agentKey + '" in korb-dosing-data.js. ' +
        'The handout names an agent the dosing data does not have, so its route, ' +
        'schedule and timing cannot be read. Fix the key rather than typing the facts here.');
    }
    /* ACTIVE WEEKS VARY BY PROGRAM for some agents, and one row cannot say so.
       BPC-157 runs weeks 1-8 on Foundation and 3-8 on Gateway/Peak; GHK-Cu is an
       add-on at weeks 5-8 and has no Foundation window at all, so asking
       getActiveWeeks for 'foundation' returns undefined and the row would have
       rendered empty. The PDFs these replace spelled both windows out in prose.

       A handout with more than one window lists them, each read from its own
       field on the agent record, so they stay pulled rather than retyped. */
    var windows = (doc.weeksRows || []).map(function (r) {
      var w = a[r[1]];
      if (!w) {
        throw new Error('patient-ed-render: agent "' + doc.agentKey + '" has no "' + r[1] +
          '". The handout asks for a weeks window the dosing data does not hold.');
      }
      return [r[0], 'Weeks ' + w[0] + '–' + w[1]];
    });
    var weeks = (DOSING.getActiveWeeks && DOSING.getActiveWeeks(doc.agentKey, 'foundation'))
      || a.onWeeksFoundation || null;
    return {
      how: a.how || '',
      schedule: a.schedule || '',
      timing: a.timing || '',
      activeWeeks: weeks ? ('Weeks ' + weeks[0] + '–' + weeks[1] + ' of your ' +
        (doc.cycleWeeks || 16) + '-week cycle') : '',
      windows: windows,
      offWeeks: (weeks && doc.cycleWeeks && weeks[1] < doc.cycleWeeks && !windows.length)
        ? ('Weeks ' + (weeks[1] + 1) + '–' + doc.cycleWeeks + ', a ' +
           (doc.cycleWeeks - weeks[1]) + '-week washout before your next cycle')
        : ''
    };
  }

  /* ---- small builders ---------------------------------------------------- */
  function ul(items) {
    return '<ul>' + (items || []).map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>';
  }
  function paras(items) {
    return (items || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }
  function twoCol(rows, h1, h2) {
    return '<table class="grid"><thead><tr><th>' + esc(h1) + '</th><th>' + esc(h2) +
      '</th></tr></thead><tbody>' + rows.map(function (r) {
        return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }

  function renderBody(DATA, DOSING, doc) {
    var S = DATA.shared;
    var F = agentFacts(DOSING, doc);
    var h = '';

    h += '<div class="lede"><p>' + esc(S.disclaimer) + '</p></div>';

    h += '<h2>What ' + esc(doc.title) + ' is</h2>' + paras(doc.what);

    if (doc.mayHelp) {
      h += '<h2>What it may support</h2><p>' + esc(doc.mayHelp.lead) + '</p>' +
           ul(doc.mayHelp.items) + '<p>' + esc(doc.mayHelp.after) + '</p>';
    }

    if (doc.nutrition) {
      h += '<h2>Nutrition and lifestyle that support your results</h2><p>' +
           esc(doc.nutrition.lead) + '</p>' + ul(doc.nutrition.items);
    }

    /* Route, schedule, timing and weeks - every value read from the dosing
       data, so a change there reaches this handout on the next page load. */
    h += '<h2>How to use it</h2>' +
         '<div class="callout"><p>' + esc(S.authoritySource) + '</p></div>' +
         '<table class="kv">' +
         '<tr><th>How to inject</th><td>' + esc(F.how) + '</td></tr>' +
         '<tr><th>When to inject</th><td>' + esc(F.timing) + '</td></tr>' +
         '<tr><th>Schedule</th><td>' + esc(F.schedule) + '</td></tr>' +
         (F.windows.length
            ? F.windows.map(function (w) {
                return '<tr><th>' + esc(w[0]) + '</th><td>' + esc(w[1]) + '</td></tr>'; }).join('')
            : (F.activeWeeks ? '<tr><th>Active weeks</th><td>' + esc(F.activeWeeks) + '</td></tr>' : '')) +
         (F.offWeeks ? '<tr><th>Off weeks</th><td>' + esc(F.offWeeks) + '</td></tr>' : '') +
         '</table>' +
         (doc.weeksNote ? '<p class="fine">' + esc(doc.weeksNote) + '</p>' : '');

    (doc.extraSections || []).forEach(function (sec) {
      h += '<h2>' + esc(sec.h) + '</h2>';
      if (sec.p) h += paras(sec.p);
      if (sec.table) {
        h += '<table class="grid"><thead><tr>' +
             sec.table.head.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') +
             '</tr></thead><tbody>' + sec.table.rows.map(function (r) {
               return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
             }).join('') + '</tbody></table>';
      }
      if (sec.ul) h += ul(sec.ul);
      if (sec.callout) h += '<div class="callout"><p>' + esc(sec.callout) + '</p></div>';
      if (sec.warn) h += '<div class="callout warn"><p>' + esc(sec.warn) + '</p></div>';
    });

    (doc.timingNotes || []).forEach(function (n) {
      h += '<h3>' + esc(n[0]) + '</h3><p>' + esc(n[1]) + '</p>';
    });

    /* The shared storage block is the refrigerated, 28-day peptide rule. A
       handout whose storage genuinely differs states its own: testosterone is
       room temperature and 90 days, and inheriting the shared block would have
       told a patient to refrigerate a medication that must not be. */
    var ST = doc.storage || S.storage;
    h += '<h2>Storage and handling</h2>' +
         twoCol(ST.cards, 'What to do', 'Detail') + paras(ST.notes);

    /* The shared travel text tells the patient to refrigerate again on arrival,
       which is right for every refrigerated peptide and WRONG for testosterone,
       whose own storage block says do not refrigerate. The page contradicted
       itself on the first build. A handout whose storage differs states its own
       travel text too - the two belong together. */
    h += '<h2>Traveling with your medication</h2><p>' + esc(doc.travel || S.travel) + '</p>' +
         (doc.travelNote ? '<p>' + esc(doc.travelNote) + '</p>' : '');

    if (doc.timeline) {
      h += '<h2>What to expect</h2><table class="grid"><thead><tr><th>Timeline</th>' +
           '<th>Phase</th><th>What to expect</th></tr></thead><tbody>' +
           doc.timeline.map(function (r) {
             return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
           }).join('') + '</tbody></table>' +
           (doc.timelineNote ? '<p class="fine">' + esc(doc.timelineNote) + '</p>' : '');
    }

    h += '<h2>Side effects and what to watch for</h2>';
    if (doc.common) h += '<h3>What you may notice</h3>' + twoCol(doc.common, 'What you may notice', 'What to do');
    if (doc.monitorAndTell) h += '<h3>Tell your KORB provider at your next visit</h3>' +
      twoCol(doc.monitorAndTell, 'What you may notice', 'What to do');
    if (doc.emergencyLead) h += '<div class="callout warn"><p>' + esc(doc.emergencyLead) + '</p></div>';

    if (doc.source === 'glp1' && doc.contraPhrasing) {
      h += '<h2>Who should not use ' + esc(doc.title) + '</h2>' +
           ul(contraindications(DOSING, doc));
    }

    if (doc.labs) {
      h += '<h2>Lab monitoring</h2><p>' + esc(doc.labs.lead) + '</p>' + ul(doc.labs.items) +
           '<p>' + esc(doc.labs.after) + '</p>';
    }

    h += '<h2>Safety reminders</h2>' + ul((doc.safety || []).concat(S.injectionSafety));

    var C = S.contact;
    h += '<h2>When to contact KORB</h2>' +
         '<table class="grid"><thead><tr><th>' + esc(C.operations.title) + '</th><th>' +
         esc(C.portal.title) + '</th><th>' + esc(C.emergency.title) + '</th></tr></thead><tbody><tr>' +
         '<td>' + ul(C.operations.items) + paras(C.operations.lines) + '</td>' +
         '<td>' + ul(C.portal.items) + '</td>' +
         '<td>' + ul(C.emergency.items) + '</td>' +
         '</tr></tbody></table>' +
         '<p class="fine">' + esc(C.portalNote) + '</p>' +
         '<div class="callout warn"><p>' + esc(C.emergencyNote) + '</p></div>';

    if (doc.keyReminders) h += '<h2>Key reminders</h2>' + ul(doc.keyReminders);

    return h;
  }

  var DOCS = ['sermorelin'];

  return { DOCS: DOCS, esc: esc, renderBody: renderBody, agentFacts: agentFacts,
           contraindications: contraindications,
           CSS: CSS, LOGO_URI: LOGO_URI };
}));
