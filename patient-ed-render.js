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

  /* Testosterone reads korb-mens-data.js. WHICH ROUTES EXIST is a fact that
     lives in that file and is used by the provider reference and the tool, so
     the handout derives its route sentence rather than typing a fourth copy.

     This is the TODO that sat in korb-patient-ed-data.js from the day the
     handout was written - "when korb-trt-data.js lands, delete doc.facts and
     give the handout a source" - and was still open after the file landed on
     2026-09-16, which left the two free to disagree.

     Only `how` is derived, because only `how` is a fact the data file holds.
     Timing and schedule stay as prose: what day a patient injects and how often
     is on their own prescription label and varies by the route prescribed, so
     there is nothing upstream to read. Deriving a sentence that is not in the
     data would be dressing prose up as live. */
  function mensFacts(MENS, doc) {
    if (!MENS || !MENS.routes) {
      throw new Error('patient-ed-render: korb-mens-data.js must be loaded first, ' +
        'and after korb-pharmacies.js.');
    }
    var routes = Object.keys(MENS.routes).map(function (k) { return MENS.routes[k]; });
    if (!routes.length) {
      throw new Error('patient-ed-render: korb-mens-data.js declares no routes, so ' +
        'the handout cannot say how the injection is given. Fix the data file ' +
        'rather than typing the sentence here.');
    }
    var anySq = routes.some(function (r) { return r.sq; });
    var anyIm = routes.some(function (r) { return !r.sq; });
    var how = anySq && anyIm
      ? 'Injection — subcutaneous or intramuscular, as your provider directs'
      : anySq ? 'Injection — subcutaneous, as your provider directs'
              : 'Injection — intramuscular, as your provider directs';
    return {
      how: how,
      timing: doc.timingText || '',
      schedule: doc.scheduleText || '',
      windows: [], activeWeeks: '', offWeeks: ''
    };
  }

  function agentFacts(DOSING, doc) {
    if (doc.source === 'glp1') { return glp1Facts(DOSING, doc); }
    if (doc.source === 'mens') { return mensFacts(DOSING, doc); }
    /* NO DATA FILE YET. Testosterone has no korb-mens-data.js - that is open item
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
  /* esc() first, then a single markdown-ish flourish: **text** becomes bold.
     Escaping happens BEFORE this, so the asterisks cannot smuggle in markup.
     It exists because the patient guides carry safety lines - nitrates,
     finasteride in pregnancy, a four-hour erection - that should not read at
     the same weight as the sentence around them. */
  function rich(t) {
    return esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function ul(items) {
    return '<ul>' + (items || []).map(function (i) { return '<li>' + rich(i) + '</li>'; }).join('') + '</ul>';
  }
  function paras(items) {
    return (items || []).map(function (p) { return '<p>' + rich(p) + '</p>'; }).join('');
  }
  function twoCol(rows, h1, h2) {
    return '<table class="grid"><thead><tr><th>' + esc(h1) + '</th><th>' + esc(h2) +
      '</th></tr></thead><tbody>' + rows.map(function (r) {
        return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }


  /* ------------------------------------------------------------------
     Program overviews (Foundation, Gateway, Peak, Longevity).

     A program overview is NOT a molecule handout. renderBody resolves one
     agent out of korb-dosing-data.js and describes it; a program describes a
     tier, which agents it can use, and how the 16-week cycle runs. Different
     shape, so a different renderer rather than a pile of conditionals in the
     old one.

     The narrative lives in korb-patient-ed-data.js. The part that goes stale -
     which agents a tier offers and when each one is active inside the cycle -
     is read from korb-dosing-data.js on every page load. That is the whole
     reason these exist as HTML: the PDFs stated "active for the first 12
     weeks" as fixed text, so a change to onWeeksFoundation reached the data
     file and never reached the patient.
     ------------------------------------------------------------------ */

  function windowSentence(DOSING, agentKey, context, cycleWeeks) {
    var w = DOSING.getActiveWeeks && DOSING.getActiveWeeks(agentKey, context);
    if (!w) { return ''; }
    var start = w[0], end = w[1], off = cycleWeeks - end;
    /* "an 8-week", not "a 8-week". Only 8, 11 and 18 take "an" in the range a
       cycle can produce. */
    function art(n) { return (n === 8 || n === 11 || n === 18) ? 'an ' : 'a '; }

    if (start > 1) {
      /* A staggered agent stops mid-cycle while the primary is still running, so
         calling the rest of the cycle a "washout before your next cycle" reads as
         though the whole program has stopped. It has not. */
      return 'Active from week ' + start + ' through week ' + end + ' of your ' +
             cycleWeeks + '-week cycle, then stopped for the remainder of the cycle.';
    }
    var active = 'Active for the first ' + end + ' weeks of your ' + cycleWeeks + '-week cycle';
    if (off > 0) {
      active += ', followed by ' + art(off) + off + '-week washout before your next cycle begins';
    }
    return active + '.';
  }

  function agentBlocks(DATA, DOSING, prog) {
    return (prog.agents || []).map(function (a) {
      var agent = DOSING.agents[a.key];
      if (!agent) {
        throw new Error('patient-ed-render: program "' + prog.key + '" names agent "' +
          a.key + '", which is not in korb-dosing-data.js. Fix the key; do not ' +
          'hardcode the text.');
      }
      var name = a.label || agent.label || a.key;
      var win = windowSentence(DOSING, a.key, a.context || 'foundation', prog.cycleWeeks || 16);
      return '<h3>' + esc(name) + '</h3><p>' + esc(a.text) +
             (win ? ' ' + esc(win) : '') + '</p>';
    }).join('');
  }

  function renderProgramBody(DATA, DOSING, prog) {
    var sh = DATA.shared || {};
    var h = '';

    h += '<p class="lede">' + esc(prog.disclaimer) + '</p>';

    h += '<h2>What the ' + esc(prog.title) + ' is</h2>' + paras(prog.what);

    /* Tiers before agents. On Peak the reader has to know which pathway they are
       on before a list of agents that "run alongside your pathway" means
       anything. */
    if (prog.tiers && prog.tiers.length) {
      h += '<h2>' + esc(prog.tiersHeading || 'Choosing your program') + '</h2>';
      if (prog.tiersLead) { h += '<p>' + esc(prog.tiersLead) + '</p>'; }
      h += prog.tiers.map(function (t) {
        return '<h3>' + esc(t.name) + '</h3><p>' + esc(t.text) + '</p>';
      }).join('');
    }

    if (prog.agents && prog.agents.length) {
      h += '<h2>' + esc(prog.agentsHeading || 'Your agent options') + '</h2>';
      if (prog.agentsLead) { h += '<p>' + esc(prog.agentsLead) + '</p>'; }
      h += agentBlocks(DATA, DOSING, prog);
    }

    if (prog.note) {
      h += '<p><strong>' + esc(prog.note.label) + '</strong> ' + esc(prog.note.text) + '</p>';
    }

    h += '<p><strong>Pricing.</strong> ' + esc(prog.pricing) + '</p>';

    h += '<h2>How your ' + (prog.cycleWeeks || 16) + '-week cycle works</h2>' + ul(prog.cycle);
    h += '<h2>What to expect</h2>' + paras(prog.expect);
    h += '<h2>Labs and monitoring</h2>' + paras(prog.labs);
    h += '<h2>Safety reminders</h2>' + ul(prog.safety);

    /* shared.contact is {operations, portal, emergency}, each {title, items,
       lines?}. It is shared with the molecule handouts, so it is read as it is
       rather than reshaped here. */
    if (sh.contact) {
      h += '<h2>When to contact KORB, and when to seek emergency care</h2>';
      ['operations', 'portal', 'emergency'].forEach(function (k) {
        var c = sh.contact[k];
        if (!c) { return; }
        h += '<h3>' + esc(c.title) + '</h3>';
        if (c.items) { h += ul(c.items); }
        if (c.lines) { h += paras(c.lines); }
      });
      h += '<p>Phone and email are not appropriate for emergencies. When in doubt, ' +
           'go to urgent care or the emergency room.</p>';
    }

    h += '<h2>Key reminders</h2>' + ul(prog.keyReminders);
    return h;
  }


  /* ------------------------------------------------------------------
     Standalone guides: Start Here, Welcome, Lab Scheduling, Injection &
     Storage Safety, When to Contact KORB.

     Generic on purpose. A guide is a list of sections, and a section is
     paragraphs, bullets, a two-column card table, a link list, or a named
     block out of DATA.shared. The shared route is the point: the Injection &
     Storage guide and every molecule handout render the SAME storage cards,
     travel paragraph and injection-safety rules from one place, so the
     standalone guide cannot drift from the handout the way two PDFs did.
     ------------------------------------------------------------------ */

  function cards(rows) {
    return '<table class="grid"><tbody>' + (rows || []).map(function (r) {
      return '<tr><th>' + rich(r[0]) + '</th><td>' + rich(r[1]) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }

  /* Buttons, not a bulleted list of links.

     The Welcome Letter these replaced used centred branded buttons, and that is
     not decoration: it is what tells a patient the thing is tappable. A blue
     underlined word in a wall of text does not.

     Styles are inline on each element rather than in a stylesheet, because
     these render into a PDF through Playwright and an inline style is the one
     thing that cannot be lost on the way. */
  /* Teal fill with navy text, not navy fill. The section headings are navy
     bands, so navy buttons under them read as more heading rather than as
     something to press. Teal is the other brand colour and separates action
     from label at a glance. Navy on teal is legible at this weight and size;
     white on teal is not, so the text is navy. */
  var BTN = 'display:block;box-sizing:border-box;width:100%;max-width:420px;' +
            'margin:0 auto 9px;padding:12px 18px;text-align:center;' +
            'background:#00B2C3;color:#0E1236;border:2px solid #00808D;' +
            'border-radius:6px;text-decoration:none;font-weight:700;' +
            'font-size:11.5pt;line-height:1.3;letter-spacing:.01em;';
  var BTN_ALT = BTN.replace('background:#00B2C3;', 'background:#FBB040;')
                   .replace('border:2px solid #00808D;', 'border:2px solid #C8862A;');
  var NOTE = 'display:block;text-align:center;font-size:9.5pt;color:#4A4F6B;' +
             'margin:-4px auto 11px;max-width:420px;';

  function links(items, alt) {
    return '<div class="linklist" style="margin:10px 0 4px;">' + (items || []).map(function (l) {
      return '<a href="' + esc(l.href) + '" style="' + (alt ? BTN_ALT : BTN) + '">' +
             esc(l.label) + '</a>' +
             (l.note ? '<span style="' + NOTE + '">' + esc(l.note) + '</span>' : '');
    }).join('') + '</div>';
  }

  function sharedBlock(DATA, name) {
    var sh = DATA.shared || {};
    if (name === 'storage') {
      if (!sh.storage) { return ''; }
      return cards(sh.storage.cards) + paras(sh.storage.notes);
    }
    if (name === 'travel') { return sh.travel ? paras([sh.travel]) : ''; }
    if (name === 'injectionSafety') { return ul(sh.injectionSafety); }
    if (name === 'contact') {
      if (!sh.contact) { return ''; }
      return ['operations', 'portal', 'emergency'].map(function (k) {
        var c = sh.contact[k];
        if (!c) { return ''; }
        return '<h3>' + esc(c.title) + '</h3>' + (c.items ? ul(c.items) : '') +
               (c.lines ? paras(c.lines) : '');
      }).join('');
    }
    throw new Error('patient-ed-render: guide asks for shared block "' + name +
      '", which does not exist in korb-patient-ed-data.js.');
  }

  function renderGuideBody(DATA, DOSING, guide) {
    var h = '';
    if (guide.disclaimer) { h += '<p class="lede">' + esc(guide.disclaimer) + '</p>'; }
    if (guide.intro) { h += paras(guide.intro); }

    (guide.sections || []).forEach(function (sec) {
      if (sec.h) { h += '<h2>' + esc(sec.h) + '</h2>'; }
      if (sec.lead) { h += '<p>' + rich(sec.lead) + '</p>'; }
      if (sec.paras) { h += paras(sec.paras); }
      if (sec.cards) { h += cards(sec.cards); }
      if (sec.items) { h += ul(sec.items); }
      if (sec.links) { h += links(sec.links); }
      if (sec.shared) { h += sharedBlock(DATA, sec.shared); }
      if (sec.after) { h += paras(sec.after); }
    });

    if (guide.keyReminders) {
      h += '<h2>Key reminders</h2>' + ul(guide.keyReminders);
    }
    return h;
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
         '<div class="callout"><p>' + esc(doc.authoritySource || S.authoritySource) + '</p></div>' +
         '<table class="kv">' +
         /* Labels are per-handout. Eight of the nine are injections and these
            defaults suit them; Hormone Therapy is patches, creams and capsules
            and "How to inject" was simply wrong on it. */
         '<tr><th>' + esc((doc.factLabels || {}).how || 'How to inject') + '</th><td>' +
           esc(F.how) + '</td></tr>' +
         '<tr><th>' + esc((doc.factLabels || {}).timing || 'When to inject') + '</th><td>' +
           esc(F.timing) + '</td></tr>' +
         '<tr><th>Schedule</th><td>' + esc(F.schedule) + '</td></tr>' +
         (F.windows.length
            ? F.windows.map(function (w) {
                return '<tr><th>' + esc(w[0]) + '</th><td>' + esc(w[1]) + '</td></tr>'; }).join('')
            : (F.activeWeeks ? '<tr><th>Active weeks</th><td>' + esc(F.activeWeeks) + '</td></tr>' : '')) +
         (F.offWeeks ? '<tr><th>Off weeks</th><td>' + esc(F.offWeeks) + '</td></tr>' : '') +
         '</table>' +
         (doc.weeksNote ? '<p class="fine">' + esc(doc.weeksNote) + '</p>' : '');

    (doc.extraSections || []).forEach(function (sec) {
      /* `body` is accepted alongside `p`. Writing `body` used to render the
         heading and drop the paragraphs, which is how "How to use a patch"
         shipped as a title over empty space - visible to Don on the page and to
         nothing in the build. A section that renders no content now throws
         rather than printing a bare heading. */
      var content = sec.p || sec.body;
      if (!content && !sec.table && !sec.ul && !sec.callout && !sec.warn) {
        throw new Error('patient-ed-render: extraSection "' + sec.h +
          '" has no renderable content. Use p/body, table, ul, callout or warn.');
      }
      h += '<h2>' + esc(sec.h) + '</h2>';
      if (content) h += paras(content);
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

    /* The shared injection-safety block - fresh needle every time, sharps
       disposal - is appended to every handout. On Hormone Therapy there is
       nothing to inject and it read as though there were. A handout says so with
       noInjectionSafety rather than the block being dropped for everyone. */
    h += '<h2>Safety reminders</h2>' +
         ul((doc.safety || []).concat(doc.noInjectionSafety ? [] : S.injectionSafety));

    var C = S.contact;
    h += '<h2>When to contact KORB</h2>' +
         '<table class="grid"><thead><tr><th>' + esc(C.operations.title) + '</th><th>' +
         esc(C.portal.title) + '</th><th>' + esc(C.emergency.title) + '</th></tr></thead><tbody><tr>' +
         '<td>' + ul(C.operations.items) + paras(C.operations.lines) + '</td>' +
         '<td>' + ul(doc.portalItems || C.portal.items) + '</td>' +
         '<td>' + ul(C.emergency.items) + '</td>' +
         '</tr></tbody></table>' +
         '<p class="fine">' + esc(C.portalNote) + '</p>' +
         '<div class="callout warn"><p>' + esc(C.emergencyNote) + '</p></div>';

    if (doc.keyReminders) h += '<h2>Key reminders</h2>' + ul(doc.keyReminders);

    return h;
  }

  var DOCS = ['sermorelin'];

  return { DOCS: DOCS, esc: esc, renderBody: renderBody, renderProgramBody: renderProgramBody, renderGuideBody: renderGuideBody, agentFacts: agentFacts,
           contraindications: contraindications,
           CSS: CSS, LOGO_URI: LOGO_URI };
}));
