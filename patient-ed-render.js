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

  /* The three fact-table cells are sentence case. 'Schedule' comes from
     korb-glp1-data.js `frequency`, which reads 'once weekly' - correct as a
     fragment, wrong as a table cell beside 'Same day each week'. Capitalised
     HERE rather than in the data, because KORB_GLP1_Provider_Reference.html
     renders the same value in a provider table and must not move.
     Don, 2026-09-23. */
  function sentence(v) {
    v = String(v == null ? '' : v);
    return v ? v.charAt(0).toUpperCase() + v.slice(1) : v;
  }

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* The thing a sentence is about, not the document's title. On 2026-09-22 the
     titles gained their "Guide" and "Program Overview" suffixes, and three
     headings built from the title started reading "Who should not use
     Semaglutide Guide" and "What the Foundation Program Overview is". A title
     names the document; a heading names the medicine or the program. `name`
     overrides for an entry whose title does not follow the convention. Throws
     rather than guessing, so a new title shape fails the build, not the page. */
  function subjectOf(d) {
    if (d.name) return d.name;
    var m = /^(.*) (Guide|Program Overview)$/.exec(d.title || '');
    if (!m) throw new Error('No subject for "' + d.title + '": add name: to its entry in korb-patient-ed-data.js');
    return m[2] === 'Program Overview' ? m[1] + ' Program' : m[1];
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
      ? 'Injection under the skin (subcutaneous) or into the muscle (intramuscular), as your provider tells you'
      : anySq ? 'Injection under the skin (subcutaneous), as your provider tells you'
              : 'Injection into the muscle (intramuscular), as your provider tells you';
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
           (doc.cycleWeeks - weeks[1]) + '-week break with no injections before your next cycle')
        : ''
    };
  }

  /* ---- small builders ---------------------------------------------------- */
  /* esc() first, then a single markdown-ish flourish: **text** becomes bold.
     Escaping happens BEFORE this, so the asterisks cannot smuggle in markup.
     It exists because the patient guides carry safety lines - nitrates,
     finasteride in pregnancy, a four-hour erection - that should not read at
     the same weight as the sentence around them. */
  /* [text](https://...) is a link, added 2026-09-22 so a sharps disposal line
     can hand the patient the lookup where it says to look one up (Kris Mulkey's
     review). https only, and it runs after escaping, so the url cannot carry a
     quote out of the attribute. Opens in a new tab like every other outbound
     link on these pages. */
  function rich(t) {
    return esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>');
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
      active += ', followed by ' + art(off) + off + '-week break with no injections before your next cycle begins';
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

    h += '<h2>What the ' + esc(subjectOf(prog)) + ' is</h2>' + paras(prog.what);

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
      h += '<h2>' + esc(prog.agentsHeading || 'Your medication options') + '</h2>';
      if (prog.agentsLead) { h += '<p>' + esc(prog.agentsLead) + '</p>'; }
      h += agentBlocks(DATA, DOSING, prog);
    }

    if (prog.note) {
      h += '<p><strong>' + esc(prog.note.label) + '</strong> ' + esc(prog.note.text) + '</p>';
    }

    /* OPTIMIZATION PRODUCTS. The guide-shaped overviews (Weight Loss, Men's
       Health, Women's Health) carry these in a `sections` entry, which this
       renderer has no concept of. Rather than teach it sections, programs
       declare `optimization` and get the same block in the same place, before
       Pricing. Added 2026-09-19 so the Functional Health and Longevity overview
       could list them at all: it was one of three overviews that never did. */
    h += '<h2>How your ' + (prog.cycleWeeks || 16) + '-week cycle works</h2>' + ul(prog.cycle);
    h += '<h2>What to expect</h2>' + paras(prog.expect);
    h += '<h2>Labs and monitoring</h2>' + paras(prog.labs);
    h += '<h2>Safety reminders</h2>' + ul(prog.safety);

    /* ONE ORDER FOR EVERY OVERVIEW, 2026-09-22: what it is, the options, how it
       works and what to expect, safety, then the optimization products, then
       Pricing, then reminders. Optimization sat second and Pricing was a bold
       line mid-page; the guide-shaped overviews already ended this way. */
    if (prog.optimization) {
      h += '<h2>' + esc(prog.optimization.heading || 'Additional optimization products') + '</h2>';
      if (prog.optimization.lead) { h += '<p>' + esc(prog.optimization.lead) + '</p>'; }
      if (prog.optimization.links) { h += links(prog.optimization.links); }
      if (prog.optimization.after) { h += paras(prog.optimization.after); }
    }

    h += '<h2>Pricing</h2><p>' + esc(prog.pricing) + '</p>';

    h += '<h2>Key reminders</h2>' + ul(prog.keyReminders);
    h += contactFooter(sh, prog);
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

  /* A step in a reading order that is a SET, not a document: "your tier
     overview" is one of three and "your medication guide" is one of five.
     Both used to be a single button pointing at Foundation and at Sermorelin -
     the first item of each set standing in for the whole of it, which sent
     every Gateway and every Peak patient to the wrong tier and everyone not on
     Sermorelin to the wrong handout. Don found both on 2026-09-18.

     A step that is a SET gets a PANEL, not a button. It first shipped as a
     cream button with a navy border - a different colour but the same shape, so
     Don clicked it on 2026-09-18 and nothing happened, which is exactly what a
     thing shaped like a button promises. A bordered panel holding a label, a
     line of guidance and the real choices cannot be mistaken for something
     clickable, because the clickable things are visibly sitting inside it.

     ONE SET OF RULES, USED IN BOTH PLACES. This shipped twice on 2026-09-18 -
     inline styles here, CSS classes in HUB_CSS - and measuring the two rendered
     pages put them eight properties apart, the consequential one being a 38px
     choice button on the guide against 44px on the welcome letters. 44px is the
     tap target the rest of this stylesheet holds to deliberately, and these are
     the buttons a patient uses to reach the RIGHT tier and the RIGHT handout,
     on a page whose whole point is being opened from a text message. Same idea,
     same rules, declared once. Every colour here is a brand variable the
     handout stylesheet already defines on every patient page; only
     --k-teal-ink is hub-local, so it is set here too. */
  var CHOICE_CSS = [
    ':root{--k-teal-ink:#00808D;}',
    '.k-panel{box-sizing:border-box;max-width:470px;margin:0 auto;padding:15px;',
    'background:#F7F5E9;border:1px solid var(--rule);border-radius:10px;}',

    /* pick exactly one of these: sized to the word, not to the column */
    '.k-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:9px;',
    'max-width:470px;margin:0 auto;}',
    '.k-panel .k-pills{max-width:none;}',
    '.k-pill{display:inline-flex;align-items:center;padding:10px 16px;background:#fff;',
    'color:var(--navy);border:1.5px solid var(--k-teal-ink);border-radius:7px;',
    'text-decoration:none;font-weight:700;font-size:14.5px;line-height:1.3;min-height:44px;}',
    '.k-pill:hover{background:var(--teal);color:var(--navy);}',
    '.k-pill:focus-visible{outline:3px solid var(--navy);outline-offset:2px;}',

    /* the label and the line of guidance above the choices. The hub has no
       equivalent - its section heading already says what the set is - so these
       two rules are only ever exercised by links(). */
    '.k-panel-h{display:block;font-size:15px;font-weight:800;color:var(--navy);',
    'line-height:1.3;margin:0 0 3px;text-align:center;}',
    '.k-panel-n{display:block;font-size:13px;color:var(--ink2);line-height:1.4;',
    'margin:0 0 11px;text-align:center;}',

    /* In a reading order the panel sits under the step buttons, which cap at
       420px. A 470px panel below them would read as a different column. */
    '.linklist .k-panel{max-width:420px;margin:0 auto 14px;}',

    /* A phone number and an email address in a contact row are links, and a
       bare inline <a> is an 18px tap target. Screen only: on paper a 44px
       minimum on a table cell just pads the row. */
    '@media screen{.k-val{display:inline-flex;align-items:center;min-height:44px;}}'
  ].join('');

  function links(items, alt) {
    /* CHOICE_CSS used to be emitted here, inside the body, because the guide and
       handout bodies contributed no stylesheet of their own. Since 2026-09-18
       build-patient-ed.js inlines it into every patient page, so a button works
       wherever one is rendered - including ways() and screening(), which are
       nowhere near a links() call. */
    return '<div class="linklist" style="margin:10px 0 4px;">' + (items || []).map(function (l) {
      if (l.choices && l.choices.length) {
        return '<div class="k-panel">' +
               '<span class="k-panel-h">' + esc(l.label) + '</span>' +
               (l.note ? '<span class="k-panel-n">' + esc(l.note) + '</span>' : '') +
               '<div class="k-pills">' +
               l.choices.map(function (c) {
                 return '<a class="k-pill" href="' + esc(c.href) + '">' +
                        esc(c.label) + '</a>';
               }).join('') + '</div></div>';
      }
      return '<a href="' + esc(l.href) + '" style="' + (alt ? BTN_ALT : BTN) + '">' +
             esc(l.label) + '</a>' +
             (l.note ? '<span style="' + NOTE + '">' + esc(l.note) + '</span>' : '');
    }).join('') + '</div>';
  }

  /* The checkpoint sentence and the TSA link, from shared.travelScreening.

     A live link rather than prose, because "the current rules are at
     tsa.gov/travel/travel-tips" printed as flat text is a thing a patient has
     to retype on a phone at an airport. rich() only does bold, so this is built
     here rather than smuggled into the prose as markup a renderer would escape. */
  function screening(sh) {
    var t = sh && sh.travelScreening;
    if (!t) { return ''; }
    /* A BUTTON, NOT A WORD IN A SENTENCE. Don, 2026-09-18: a patient should be
       able to press something rather than find the one underlined phrase in a
       paragraph. Same .k-pill as every other choice in the patient set, so it
       is already a 44px target. */
    return '<p>' + esc(t.text) + '</p>' +
           buttons([{ href: t.href, value: t.buttonLabel || t.linkLabel }]);
  }

  /* A way to reach a human, as a table rather than a paragraph.

     .kv is the label/value table the rest of the patient set already uses, so
     this needs no new rules and picks up the row treatment corrected on
     2026-09-18. A value with an href is a link; Hours has none and stays text,
     which is the whole point of storing value and href separately. */
  /* A VALUE goes in a row. A DESTINATION gets a button.

     Phone, email and hours are values: a patient reads them, copies them, or
     taps the native affordance a phone already gives tel: and mailto:. A portal
     sign-in is a place you go, and Don asked on 2026-09-18 for those to be
     buttons rather than an underlined phrase to hunt for in a line of text.

     They are split rather than mixed, because a one-row table whose only cell
     holds a button looks like a mistake - which is exactly how the Patient
     Portal row rendered on the first attempt. */
  function ways(list, inline) {
    if (!list || !list.length) { return ''; }
    var rows = [], btns = [];
    list.forEach(function (w) {
      (w.href && /^https?:/i.test(w.href) ? btns : rows).push(w);
    });

    var h = '';
    if (rows.length) {
      h += inline
        ? rows.map(function (w) {
            return '<p><strong>' + esc(w.label) + ':</strong> ' + valueOf(w) + '</p>';
          }).join('')
        : '<table class="kv"><tbody>' + rows.map(function (w) {
            return '<tr><th>' + esc(w.label) + '</th><td>' + valueOf(w) + '</td></tr>';
          }).join('') + '</tbody></table>';
    }
    if (btns.length) { h += buttons(btns); }
    return h;
  }

  function valueOf(w) {
    if (!w.href) { return esc(w.value); }
    /* k-val, because a bare inline <a> in a table cell is an 18px tap target
       and this is the phone number a patient presses. */
    return '<a class="k-val" href="' + esc(w.href) + '">' + esc(w.value) + '</a>';
  }

  /* CENTRED, like every other button in the patient set.

     These first shipped left-aligned on the argument that they sit under a
     heading and a list rather than in the middle of a reading order. Don looked
     at the rendered page on 2026-09-18 and called it: a lone button hard against
     the left margin reads as left-heavy and unfinished, and it disagreed with
     the choice panels two sections above it, which .k-pills already centres.
     One alignment for every button on the page. */
  function buttons(list) {
    /* margin:10px AUTO 4px, and the auto is load-bearing. Writing `10px 0 4px`
       here overrode the `margin:0 auto` on .k-pills, so the 470px flex box sat
       flush left in a 762px column and only the button inside it was centred.
       It moved a little and looked worse than before, which is exactly what Don
       saw on 2026-09-18.

       The first measurement missed it because it compared the gutters to the
       VIEWPORT rather than to the text column, and at 375px the body fills the
       viewport, so the wrong reference agreed by coincidence. Measure a centred
       thing against its PARENT. */
    return '<p class="k-pills" style="margin:10px auto 4px;">' +
      list.map(function (w) {
        return '<a class="k-pill" href="' + esc(w.href) + '" target="_blank" ' +
               'rel="noopener">' + esc(w.value) + ' ↗</a>';
      }).join('') + '</p>';
  }

  /* THE CONTACT FOOTER, ON EVERY PATIENT PAGE, IN THE SAME PLACE.

     Don asked on 2026-09-18 whether contact details belonged at the foot of
     every page and left the placement to judgement. They do, and the foot is
     the place. Until now the block appeared wherever a document happened to
     declare `shared: 'contact'`, so it was mid-document on one page, a
     three-column table on another, a "Questions" section on the lab page, and
     absent from several entirely. A patient who opens a page from a text
     message should find how to reach a human in the same place every time,
     whatever the page was about, without reading the page to look for it.

     Compact on purpose. It is a footer, not the triage guide: how to reach us,
     the portal, and the one line that says phone and email are not for
     emergencies. WHICH problem goes to whom is a clinical decision and stays on
     When to Contact KORB or the ER, which is the whole subject of that
     document - and which is why that page suppresses this footer rather than
     printing the same details twice in a row. */
  function contactFooter(S, doc) {
    var C = S && S.contact;
    if (!C || (doc && doc.key === 'contact')) { return ''; }
    var all = (C.operations.ways || []).concat(C.portal.ways || []);
    return '<h2>How to reach KORB</h2>' +
           ways(all) +
           (C.emergencyNote ? '<div class="callout warn"><p>' +
              esc(C.emergencyNote) + '</p></div>' : '');
  }

  function sharedBlock(DATA, name) {
    var sh = DATA.shared || {};
    if (name === 'storage') {
      if (!sh.storage) { return ''; }
      return cards(sh.storage.cards) + paras(sh.storage.notes);
    }
    /* Quest, from korb-quest.js through KORB_PATIENT_ED.hydrate. Throws by
       name rather than rendering a lab page with nothing to press on it - a
       page that tells a patient to book and then offers no way to is worse than
       a page that refuses to load. */
    if (name === 'quest') {
      var Q = sh.quest;
      if (!Q) {
        throw new Error('patient-ed-render: shared.quest is empty. Load ' +
          'korb-quest.js and call KORB_PATIENT_ED.hydrate(KORB_QUEST) before rendering.');
      }
      return links([Q.book, Q.findLocation]) +
             (Q.walkIn ? paras([Q.walkIn]) : '') +
             '<h2>Schedule from your phone</h2>' +
             '<p>You can also book through the MyQuest app, and view your results ' +
             'there once they are available.</p>' +
             links([Q.app]);
    }

    if (name === 'travel') {
      return (sh.travel ? paras([sh.travel]) : '') + screening(sh);
    }
    /* The shared "Injection safety" SECTION keeps the device sentence. Only a
       per-handout safety LIST drops it, and only for a handout that states its
       own device. Splitting injectionSafetyDevice out on 2026-09-21 removed it
       from here by accident, which took the "use a new insulin needle and
       syringe" instruction off the Injection, Storage and Safety Guide - the
       one page whose job is to say it. Caught the same day by rendering. */
    if (name === 'injectionSafety') {
      return ul([sh.injectionSafetyDevice].concat(sh.injectionSafety));
    }
    if (name === 'contact') {
      if (!sh.contact) { return ''; }
      return ['operations', 'portal', 'emergency'].map(function (k) {
        var c = sh.contact[k];
        if (!c) { return ''; }
        return '<h3>' + esc(c.title) + '</h3>' + (c.items ? ul(c.items) : '') +
               ways(c.ways);
      }).join('');
    }
    throw new Error('patient-ed-render: guide asks for shared block "' + name +
      '", which does not exist in korb-patient-ed-data.js.');
  }


  /* ------------------------------------------------------------------
     HUB LAYOUT  (renderHubBody)

     Used by the Welcome Letter, which is not a document. It is a set of
     destinations, and it is the page that gets texted to patients, so it is
     opened on a phone far more often than it is read on a desk.

     The shell's stylesheet is built for handouts: pt units, an 8.5in sheet with
     a border, margins that imply paper. That is right for a dosing guide and
     wrong here, so this overrides the document chrome and lays the page out as
     a web page. A stylesheet rather than inline styles is fine now: this page
     is no longer the source of a generated PDF, so nothing has to survive a
     print pipeline.

     One column under 620px, two above, and the two tools a patient needs every
     week sit above everything else in their own treatment.
     ------------------------------------------------------------------ */

  /* Brand palette comes from the shell's :root, which is the one defined in
     docs/KORB_Brand_Guidelines.md: --navy #21275B, --teal #00B2C3, --cream
     #ECE9D1, --orange #FBB040, plus its ink and rule greys. Nothing here
     redefines them.

     One colour is introduced: #00808D, teal darkened for small text. Teal at
     full strength fails contrast against white at 13px. It is not a new brand
     colour and it is not new here either - both scheduler intake forms already
     use it as --teal-ink for the same reason.

     Type is inherited, which is the point: the shell sets Montserrat and the
     hub does not override font-family anywhere. */
  var HUB_CSS = [
    ':root{--k-teal-ink:#00808D;}',

    /* THE WELCOME LETTERS KEEP THE SHEET OF PAPER. Don, 2026-09-18: the GLP-1
       letter read as "one big, huge glob of cream" and looked unfinished beside
       the rest of the set.

       This block used to say "undo the sheet-of-paper chrome the handout
       stylesheet imposes" and flooded the body with brand cream at full width.
       That removed the only thing telling a reader where the document starts
       and the desk ends: page cream behind, a lighter panel with a hairline
       edge in front. Every other patient page has it, so the two letters - the
       FIRST thing a new patient opens - were the two that looked half-built.

       So only the TYPE SCALE is overridden here. The surface, the width and the
       side rules are left to the builder's @media screen block, which is where
       they are set for the whole set. #doc no longer caps its own width either:
       body already caps at 8.5in, and a second 780px cap inside it produced a
       narrower column on a letter than on the handout beside it. */
    'body{font-size:16px!important;line-height:1.55!important;color:var(--ink)!important;}',
    '#doc{max-width:none;margin:0;padding:0 0 12px;}',

    '.hub-mast{text-align:center;padding:22px 0 14px;}',
    '.hub-mast img{height:30px;width:auto;}',

    '.hub-hero{background:var(--navy);color:#fff;border-radius:14px;',
    'padding:28px 24px;margin:0 0 22px;}',
    '.hub-hero h1{margin:0 0 6px;font-size:30px;line-height:1.15;font-weight:800;color:#fff;}',
    '.hub-hero .k-sub{color:var(--teal);font-weight:700;font-size:14px;',
    'letter-spacing:.04em;text-transform:uppercase;margin:0 0 14px;}',
    '.hub-hero p{margin:0 0 10px;color:var(--cream);font-size:15.5px;}',
    '.hub-hero p:last-child{margin-bottom:0;}',

    /* A section heading has to beat the card labels inside it. It used to lose:
       13px uppercase against a 16.5px card name and an 18px primary one, which
       is why the page read as an undifferentiated run of buttons with no sense
       of where one group ended. Don flagged exactly that on 2026-09-18. The
       teal rule carries the grouping; the sections are separated by a hairline
       so the eye has somewhere to stop. */
    '.hub-sec{margin:0 0 34px;}',
    '.hub-sec + .hub-sec{padding-top:30px;border-top:1px solid var(--rule);}',
    '.hub-sec > h2{background:none!important;color:var(--navy)!important;',
    'font-size:21px!important;font-weight:800!important;letter-spacing:-.01em;',
    'line-height:1.25;text-transform:none;margin:0 0 7px!important;',
    'padding:1px 0 1px 13px!important;border-left:4px solid var(--teal);}',
    '.hub-sec .k-lead{margin:0 0 15px;color:var(--ink2);font-size:15px;}',

    '.hub-grid{display:grid;gap:12px;grid-template-columns:1fr;}',
    '@media(min-width:620px){.hub-grid.two{grid-template-columns:1fr 1fr;}}',

    /* THREE WEIGHTS OF DESTINATION, not one.

       Every link on the page used to render as the same white card with the
       same teal stripe, so a five-item pick-your-handout list shouted exactly
       as loudly as the tracker a patient opens weekly. The teal stripe moved to
       the section heading; a plain card no longer competes with it. */

    /* a destination card: the whole card is the tap target */
    '.k-card{display:block;background:#fff;border:1px solid var(--rule);',
    'border-radius:10px;padding:15px 17px;',
    'text-decoration:none;color:var(--navy);min-height:44px;}',
    '.k-card .k-name{display:block;font-weight:800;font-size:16.5px;line-height:1.3;}',
    '.k-card .k-desc{display:block;margin-top:5px;color:var(--ink2);',
    'font-size:14px;font-weight:400;line-height:1.45;}',
    '.k-card .k-go{display:inline-block;margin-top:9px;font-size:13px;',
    'font-weight:700;color:var(--k-teal-ink);letter-spacing:.02em;}',
    '.k-card:hover{border-color:var(--teal);box-shadow:0 2px 10px rgba(33,39,91,.10);}',

    /* the two weekly tools, raised above the rest. Teal, not orange: orange is
       the callout colour everywhere else in the system and reads as a warning
       when it fronts a navigation card. */
    '.k-card.k-primary{background:var(--navy);border-color:var(--navy);',
    'border-left:5px solid var(--teal);color:#fff;}',
    '.k-card.k-primary .k-name{color:#fff;font-size:18px;}',
    '.k-card.k-primary .k-desc{color:var(--cream);}',
    '.k-card.k-primary .k-go{color:var(--teal);}',
    '.k-card.k-primary:hover{box-shadow:0 3px 14px rgba(33,39,91,.28);}',

    /* a set of siblings you pick ONE of - the tiers, the medication handouts.
       A tight list, because the choice is the content and the chrome is not. */
    '.k-list{background:#fff;border:1px solid var(--rule);border-radius:10px;',
    'overflow:hidden;}',
    '.k-list a{display:flex;align-items:center;gap:12px;padding:14px 16px;',
    'text-decoration:none;color:var(--navy);min-height:44px;',
    'border-top:1px solid var(--rule);}',
    '.k-list a:first-child{border-top:0;}',
    '.k-list a:hover{background:var(--panel);}',
    '.k-list .k-name{flex:1 1 auto;font-weight:700;font-size:15.5px;line-height:1.35;}',
    '.k-list .k-desc{display:block;margin-top:2px;font-weight:400;font-size:13.5px;',
    'color:var(--ink2);line-height:1.4;}',
    '.k-list .k-go{flex:0 0 auto;font-size:18px;font-weight:700;color:var(--k-teal-ink);}',

    /* Borrowed from the Start Here Guide, which Don preferred on 2026-09-18: a
       filled button at a fixed readable width with its explanation centred
       underneath, rather than another full-bleed card. Everything being the
       same width was half of why the page read as one undifferentiated block -
       the navy pair, these, and the choice pills below now measure differently. */
    '.k-btnw{margin:0 0 17px;}',
    '.k-btnw:last-child{margin-bottom:0;}',
    '.k-btn{display:block;box-sizing:border-box;width:100%;max-width:420px;',
    'margin:0 auto;padding:14px 20px;text-align:center;background:var(--teal);',
    'color:#0E1236;border:2px solid var(--k-teal-ink);border-radius:7px;',
    'text-decoration:none;font-weight:800;font-size:16px;line-height:1.3;',
    'min-height:44px;}',
    '.k-btn:hover{background:var(--k-teal-ink);color:#fff;}',
    '.k-btn:focus-visible{outline:3px solid var(--navy);outline-offset:2px;}',
    '.k-bnote{display:block;max-width:420px;margin:7px auto 0;text-align:center;',
    'font-size:13.5px;color:var(--ink2);line-height:1.45;}',

    CHOICE_CSS,

    /* phone, email, portal. The VALUE is on the page as text, because a mailto:
       on a machine with no default mail client is a button that does nothing at
       all - which is what Don hit on 2026-09-18 and correctly called broken. */
    '.k-acts{display:flex;flex-direction:column;gap:9px;}',
    '.k-act{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;',
    'background:#fff;border:1px solid var(--rule);border-radius:9px;padding:12px 14px;}',
    '.k-act .k-act-l{flex:0 0 auto;font-size:12px;font-weight:800;color:var(--ink2);',
    'letter-spacing:.06em;text-transform:uppercase;min-width:52px;}',
    /* Both of these are 44px for the same reason the choice pills are: these
       are the controls a patient uses to reach a human, on a page opened from a
       text message. The value was a bare inline <a> at 25px and its Copy button
       was 38px, so the two smallest targets on the page were the phone number
       and the email address. inline-flex rather than a padding bump, because
       padding on an inline element does not grow its hit area. */
    '.k-act .k-act-v{flex:1 1 auto;min-width:0;font-size:16px;font-weight:700;',
    'color:var(--navy);text-decoration:none;overflow-wrap:anywhere;',
    'display:inline-flex;align-items:center;min-height:44px;}',
    '.k-act .k-act-v:hover{color:var(--k-teal-ink);text-decoration:underline;}',
    '.k-act .k-copy{flex:0 0 auto;align-self:auto;font-size:12.5px;padding:7px 12px;',
    'min-height:44px;}',

    /* the patient protein calculator, embedded rather than linked. Lifted from
       the navy card in KORB_Patient_Hub.html, so it is the PATIENT tool - the
       provider twin in Provider_Reference carries "Copy into the chart" and has
       no business on a patient page. Restyled light because the hub card it
       came from sat on navy and this page is cream. */
    '.k-calc{background:#fff;border:1px solid var(--rule);border-radius:10px;',
    'padding:17px 18px;margin:0 0 14px;}',
    '.k-calc .k-calc-h{margin:0 0 3px;font-size:16.5px;font-weight:800;color:var(--navy);}',
    '.k-calc .k-calc-s{margin:0 0 14px;font-size:13.5px;color:var(--ink2);line-height:1.45;}',
    '.k-calc label{display:block;font-size:12px;font-weight:800;color:var(--ink2);',
    'letter-spacing:.05em;text-transform:uppercase;margin:0 0 5px;}',
    '.k-calc .k-f{margin:0 0 12px;}',
    '.k-calc .k-in{display:flex;gap:8px;align-items:center;}',
    '.k-calc input,.k-calc select{font:inherit;font-size:16px;color:var(--navy);',
    'background:#fff;border:1.5px solid var(--rule);border-radius:7px;padding:10px 11px;',
    'min-height:44px;width:100%;min-width:0;}',
    '.k-calc input:focus,.k-calc select:focus{outline:3px solid var(--teal);outline-offset:1px;}',
    '.k-calc .k-u{flex:0 0 auto;width:78px;}',
    '.k-calc .k-unit{flex:0 0 auto;font-size:13px;color:var(--ink2);font-weight:700;}',
    '@media(min-width:560px){.k-calc .k-row{display:grid;grid-template-columns:1fr 1fr;gap:0 14px;}}',
    '.k-calc button{font:inherit;font-size:15px;font-weight:800;width:100%;',
    'background:var(--teal);color:var(--navy);border:2px solid var(--k-teal-ink);',
    'border-radius:24px;padding:12px;cursor:pointer;min-height:48px;margin-top:2px;}',
    '.k-calc button:hover{background:var(--k-teal-ink);color:#fff;}',
    '.k-calc button:focus-visible{outline:3px solid var(--navy);outline-offset:2px;}',
    '.k-calc .k-res{margin-top:14px;}',
    '.k-calc .k-res-in{background:var(--navy);border-radius:10px;padding:15px;text-align:center;}',
    '.k-calc .k-res-l{font-size:11px;color:var(--teal);text-transform:uppercase;',
    'letter-spacing:.08em;font-weight:800;}',
    '.k-calc .k-res-n{font-size:30px;font-weight:800;color:#fff;margin-top:3px;line-height:1.1;}',
    '.k-calc .k-res-m{font-size:13px;color:var(--cream);margin-top:7px;}',
    '.k-calc .k-res-b{font-size:12px;color:var(--cream);opacity:.85;margin-top:9px;line-height:1.55;}',
    '.k-calc .k-err{font-size:13.5px;color:var(--navy);background:var(--panel);',
    'border:1px solid var(--rule);border-radius:8px;padding:11px 13px;}',
    '@media print{.k-calc button{display:none;}}',

    '.hub-note{background:#fff;border:1px solid var(--rule);border-radius:10px;',
    'padding:14px 16px;margin:0 0 22px;color:var(--ink2);font-size:14.5px;}',
    '.hub-note ul{margin:8px 0 0;padding-left:20px;}',
    '.hub-note li{margin:0 0 5px;}',

    '.hub-foot{margin-top:26px;padding-top:14px;border-top:1px solid var(--rule);',
    'text-align:center;color:var(--ink2);font-size:13px;line-height:1.55;}',
    '.hub-foot strong{color:var(--navy);font-size:13.5px;}',

    '.k-note{background:#fff;border:1px solid var(--rule);border-left:5px solid var(--orange);',
    'border-radius:10px;padding:15px 17px;margin:0 0 14px;}',
    /* scoped to the title, not every strong: rich() emits <strong> for **bold**
       inside the body text too, and display:block there split a sentence in half */
    '.k-note .k-note-t{display:block;color:var(--navy);font-size:15px;',
    'font-weight:800;margin-bottom:5px;}',
    '.k-note p strong{color:var(--navy);}',
    '.k-note p{margin:0;color:var(--ink2);font-size:14.5px;}',

    /* Two across from 700px up. In one full-width column the prompt text ran
       out well short of the right edge and the small bottom-left button left a
       dead quarter of every card, which is the left-heavy look Don described.
       Narrower columns fill, and the button stretches rather than floating. */
    '@media(min-width:700px){.hub-grid.k-prompts{grid-template-columns:1fr 1fr;}}',
    '.k-prompt{background:#fff;border:1px solid var(--rule);border-radius:10px;',
    'padding:15px 17px;display:flex;flex-direction:column;gap:9px;}',
    '.k-prompt h3{margin:0;font-size:16px;font-weight:800;color:var(--navy);}',
    '.k-prompt .k-why{margin:0;color:var(--ink2);font-size:13.5px;}',
    '.k-prompt .k-text{margin:0;background:var(--panel);border:1px solid var(--rule);',
    'border-radius:7px;padding:11px 13px;font-size:13.5px;line-height:1.5;color:var(--ink);}',
    '.k-prompt .k-copy{margin-top:auto;align-self:stretch;}',
    '.k-copy{align-self:flex-start;font:inherit;font-size:13.5px;font-weight:700;',
    'background:var(--teal);color:var(--navy);border:2px solid var(--k-teal-ink);',
    'border-radius:7px;padding:9px 16px;cursor:pointer;min-height:44px;}',
    '.k-copy:hover{background:var(--k-teal-ink);color:#fff;}',
    '.k-copy:focus-visible{outline:3px solid var(--navy);outline-offset:2px;}',
    '.k-copy.done{background:var(--navy);color:#fff;border-color:var(--navy);}',

    '.k-tools{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}',
    '.k-tools a{font-size:14px;font-weight:700;color:var(--k-teal-ink);background:#fff;',
    'border:1px solid var(--rule);border-radius:7px;padding:9px 14px;text-decoration:none;}',
    '.k-tools a:hover{border-color:var(--teal);}',

    '@media print{body{background:#fff!important;}.k-card{break-inside:avoid;}',
    '.k-copy{display:none;}}'
  ].join('');

  function hubCard(l, primary) {
    return '<a class="k-card' + (primary ? ' k-primary' : '') + '" href="' + esc(l.href) + '">' +
           '<span class="k-name">' + esc(l.label) + '</span>' +
           (l.note ? '<span class="k-desc">' + esc(l.note) + '</span>' : '') +
           '<span class="k-go">' + esc(l.go || 'Open') + ' \u2192</span></a>';
  }

  /* One of a set you pick a single item from. Same link, a tenth of the noise. */
  function hubRow(l) {
    return '<a href="' + esc(l.href) + '">' +
           '<span class="k-name">' + esc(l.label) +
           (l.note ? '<span class="k-desc">' + esc(l.note) + '</span>' : '') +
           '</span>' +
           '<span class="k-go" aria-hidden="true">\u2192</span></a>';
  }

  function hubBtn(l) {
    return '<div class="k-btnw"><a class="k-btn" href="' + esc(l.href) + '">' +
           esc(l.label) + '</a>' +
           (l.note ? '<span class="k-bnote">' + esc(l.note) + '</span>' : '') +
           '</div>';
  }

  function hubPill(l) {
    return '<a class="k-pill" href="' + esc(l.href) + '">' + esc(l.label) + '</a>';
  }

  /* A way to reach a human. The address or number is TEXT on the page.

     It used to be a card like any other, which meant the email card was an
     <a href="mailto:"> and nothing else. On a machine with no default mail
     client - most desktops in a clinic - clicking it does nothing whatsoever:
     no error, no handoff, no address revealed. Don hit this on 2026-09-18 and
     reasonably read it as a broken button. Showing the value fixes it for every
     patient in that position, and the copy control means they can use it
     without a mail client at all. */
  function actRow(l, i) {
    var m = /^(mailto|tel):(.+)$/i.exec(l.href || '');
    if (!m) {
      return '<div class="k-act"><span class="k-act-l">Open</span>' +
             '<a class="k-act-v" href="' + esc(l.href) + '" target="_blank" rel="noopener">' +
             esc(String(l.label || '').replace(/^open\s+/i, '')) + '</a></div>';
    }
    var scheme = m[1].toLowerCase();
    var id = 'kact' + i;
    /* the data labels these "Call (888) ..." and "Email info@..."; the verb is
       the column header here, so it would otherwise be said twice */
    var shown = String(l.label || '').replace(/^(call|email|text)\s+/i, '');
    return '<div class="k-act">' +
           '<span class="k-act-l">' + (scheme === 'mailto' ? 'Email' : 'Call') + '</span>' +
           '<a class="k-act-v" id="' + id + '" href="' + esc(l.href) + '">' + esc(shown) + '</a>' +
           '<button type="button" class="k-copy" data-for="' + id + '">Copy</button>' +
           '</div>';
  }

  /* The patient protein calculator.

     USDA 2025-2030, 1.2-1.6 g/kg/day for maintenance and 1.6-2.0 for active
     loss, on adjusted body weight once BMI reaches 30 - above that, current
     weight returns a target higher than the body needs and higher than most
     people on a GLP-1 could eat. Devine for ideal body weight.

     Ported verbatim from KORB_Patient_Hub.html rather than rewritten, so the
     two agree by construction. If the numbers change, they change in both. */
  function proteinCalc() {
    return '<div class="k-calc">' +
      '<p class="k-calc-h">Work out your daily protein target</p>' +
      '<p class="k-calc-s">Based on the 2025&ndash;2030 USDA Dietary Guidelines. ' +
      'This is a general reference, not personalized advice &mdash; ask your provider ' +
      'for individual guidance.</p>' +

      '<div class="k-row">' +
        '<div class="k-f"><label for="kpW">Weight</label><div class="k-in">' +
          '<input type="number" id="kpW" inputmode="decimal" placeholder="180">' +
          '<select id="kpU" class="k-u" aria-label="Weight unit">' +
          '<option value="lb">lb</option><option value="kg">kg</option></select>' +
        '</div></div>' +
        '<div class="k-f"><label for="kpFt">Height</label><div class="k-in">' +
          '<input type="number" id="kpFt" inputmode="numeric" placeholder="5" aria-label="Height, feet">' +
          '<span class="k-unit">ft</span>' +
          '<input type="number" id="kpIn" inputmode="numeric" placeholder="10" aria-label="Height, inches">' +
          '<span class="k-unit">in</span>' +
        '</div></div>' +
      '</div>' +

      '<div class="k-row">' +
        '<div class="k-f"><label for="kpS">Sex at birth</label>' +
          '<select id="kpS"><option value="m">Male</option><option value="f">Female</option></select>' +
        '</div>' +
        '<div class="k-f"><label for="kpG">Goal</label>' +
          '<select id="kpG"><option value="maintain">General health / maintenance</option>' +
          '<option value="loss">Active weight loss (preserve muscle)</option></select>' +
        '</div>' +
      '</div>' +

      '<button type="button" id="kpGo">Calculate my target</button>' +
      '<div class="k-res" id="kpOut" role="status" aria-live="polite"></div>' +
      '</div>';
  }

  /* Delegated, for the same reason the copy handler is: this markup is assigned
     with innerHTML, and neither a <script> returned in the string nor an inline
     onclick pointing at a function that was never defined would ever run. */
  function bindCalc() {
    if (typeof document === 'undefined' || document.__korbCalcBound) { return; }
    document.__korbCalcBound = true;
    document.addEventListener('click', function (e) {
      var b = e.target && e.target.closest && e.target.closest('#kpGo');
      if (!b) { return; }
      function v(id) { return parseFloat((document.getElementById(id) || {}).value); }
      function s(id) { return (document.getElementById(id) || {}).value; }
      var out = document.getElementById('kpOut');
      if (!out) { return; }

      var w = v('kpW'), ft = v('kpFt'), inch = v('kpIn') || 0;
      if (!w || w <= 0 || !ft || ft <= 0) {
        out.innerHTML = '<div class="k-err">Enter your weight and height to see a target range.</div>';
        return;
      }
      var kg = s('kpU') === 'lb' ? w / 2.20462 : w;
      var totalIn = ft * 12 + inch;
      var bmi = kg / Math.pow(totalIn * 0.0254, 2);

      var ibw = (s('kpS') === 'm' ? 50 : 45.5) + 2.3 * (totalIn - 60);
      if (ibw < 40) { ibw = 40; }
      var basisKg = kg;
      var basisNote = 'Based on your current weight.';
      if (bmi >= 30) {
        basisKg = ibw + 0.4 * (kg - ibw);
        basisNote = 'Based on adjusted body weight rather than your current weight. ' +
          'Above a BMI of 30, using current weight produces a target that is higher ' +
          'than the body actually needs and higher than most people can eat.';
      }
      var loss = s('kpG') === 'loss';
      var loG = Math.round(basisKg * (loss ? 1.6 : 1.2));
      var hiG = Math.round(basisKg * (loss ? 2.0 : 1.6));

      out.innerHTML = '<div class="k-res-in">' +
        '<div class="k-res-l">Daily target</div>' +
        '<div class="k-res-n">' + loG + '–' + hiG + ' g</div>' +
        '<div class="k-res-m">Spread across 3–4 meals for best results</div>' +
        '<div class="k-res-b">BMI ' + bmi.toFixed(1) + '. ' + basisNote + '</div>' +
        '</div>';
    });
  }

  function renderHubBody(DATA, DOSING, hub) {
    var h = '<style>' + HUB_CSS + '</style>';
    bindCalc();

    h += '<div class="hub-hero"><h1>' + esc(hub.title) + '</h1>' +
         '<p class="k-sub">' + esc(hub.sub || 'Functional Health & Longevity') + '</p>' +
         paras(hub.intro) + '</div>';

    (hub.sections || []).forEach(function (sec) {
      h += '<section class="hub-sec">';
      if (sec.h) { h += '<h2>' + esc(sec.h) + '</h2>'; }
      if (sec.lead) { h += '<p class="k-lead">' + rich(sec.lead) + '</p>'; }
      if (sec.items) {
        h += '<div class="hub-note"><ul>' +
             sec.items.map(function (i) { return '<li>' + rich(i) + '</li>'; }).join('') +
             '</ul></div>';
      }
      if (sec.callout) {
        h += '<div class="k-note"><span class="k-note-t">' + esc(sec.callout.title) + '</span>' +
             '<p>' + rich(sec.callout.text) + '</p></div>';
      }
      if (sec.embed === 'protein') { h += proteinCalc(); }
      if (sec.prompts && sec.prompts.length) {
        h += '<div class="hub-grid k-prompts">' + sec.prompts.map(function (p, i) {
          var pid = 'p' + (sec.h || '').replace(/\W+/g, '') + i;
          return '<div class="k-prompt"><h3>' + esc(p.title) + '</h3>' +
                 (p.why ? '<p class="k-why">' + esc(p.why) + '</p>' : '') +
                 '<p class="k-text" id="' + pid + '">' + esc(p.text) + '</p>' +
                 '<button type="button" class="k-copy" data-for="' + pid + '">Copy this prompt</button>' +
                 '</div>';
        }).join('') + '</div>';
      }
      if (sec.tools && sec.tools.length) {
        /* Same pill and the same panel as a set of tiers: these are a set you
           pick one of too. The arrow is the only difference that earns its
           keep, because these five leave the site and the tiers do not. */
        h += '<div class="k-panel"><div class="k-pills">' + sec.tools.map(function (t) {
          return '<a class="k-pill" href="' + esc(t.href) + '" target="_blank" rel="noopener">' +
                 esc(t.label) + ' \u2197</a>';
        }).join('') + '</div></div>';
      }
      /* THE PHONE NUMBER IS WRITTEN ONCE. Both welcome letters typed their own
         "Call (888) 959-7299 / Email ... / Open Patient Portal" links beside
         shared.contact, which holds the same three facts for the other 24
         pages. A second copy of a phone number is a second thing to update.
         A section with `shared: 'contact'` is filled from the shared block and
         still renders as the .k-act rows, which is the right treatment for a
         hub: a labelled row with the value visible and a Copy button. */
      var secLinks = sec.links;
      if (sec.shared === 'contact') {
        var CC = (DATA.shared && DATA.shared.contact) || {};
        secLinks = (CC.operations.ways || []).concat(CC.portal.ways || [])
          .filter(function (w) { return w.href; })
          .map(function (w) { return { href: w.href, label: w.value }; });
      }
      if (secLinks && secLinks.length) {
        sec = Object.assign({}, sec, { links: secLinks });
      }
      if (sec.links && sec.links.length) {
        /* A section declares its own weight with `as`, and a section holding a
           mailto: or tel: is a contact block whether it says so or not. */
        var isContact = sec.as === 'contact' ||
          sec.links.some(function (l) { return /^(mailto|tel):/i.test(l.href || ''); });

        if (isContact) {
          h += '<div class="k-acts">' +
               sec.links.map(function (l, i) { return actRow(l, i); }).join('') +
               '</div>';
        } else if (sec.primary) {
          /* two across only when there are an even number worth pairing; a lone
             card stretched half-width next to nothing looks like a mistake */
          var two = sec.links.length > 1 && sec.links.length % 2 === 0;
          h += '<div class="hub-grid' + (two ? ' two' : '') + '">' +
               sec.links.map(function (l) { return hubCard(l, true); }).join('') +
               '</div>';
        } else if (sec.as === 'list' ||
                   (sec.links.length >= 3 && !sec.links.some(function (l) { return l.note; }))) {
          /* a set you pick exactly one of: sized to its own label, so a run of
             them is visibly a choice rather than another stack of full-width
             boxes. Three tiers and five handouts were the worst offenders. */
          h += '<div class="k-panel"><div class="k-pills">' +
               sec.links.map(hubPill).join('') + '</div></div>';
        } else {
          h += sec.links.map(hubBtn).join('');
        }
      }
      h += '</section>';
    });

    /* The practice, named. The hero replaced the shell's title band and the
       byline went with it, which quietly took the attribution off the two most
       patient-facing pages in the repo the same week 14 documents were
       corrected for naming the MSO instead. KORB Health Group LLC does not
       practise medicine; KORB Health Medical Texas PA does. */
    h += '<p class="hub-foot"><strong>KORB Health Medical Texas PA</strong>' +
         (hub.disclaimer ? '<br>' + esc(hub.disclaimer) : '') + '</p>';

    /* Copy-to-clipboard for the prompt cards.

       Bound here rather than returned as a <script> in the HTML: the page
       assigns this string with innerHTML, and a script inserted that way never
       executes. The first version did exactly that and shipped buttons that did
       nothing.

       Delegated off the document so it does not matter when the markup lands,
       and guarded so repeated renders bind once. Falls back to selecting the
       text where the clipboard API is missing, which happens on an insecure
       origin and in some in-app browsers. */
    if (typeof document !== 'undefined' && !document.__korbCopyBound) {
      document.__korbCopyBound = true;
      document.addEventListener('click', function (e) {
        var b = e.target && e.target.closest && e.target.closest('.k-copy');
        if (!b) { return; }
        var el = document.getElementById(b.getAttribute('data-for'));
        if (!el) { return; }
        function done() {
          var was = b.textContent;
          b.textContent = 'Copied';
          b.classList.add('done');
          setTimeout(function () { b.textContent = was; b.classList.remove('done'); }, 1600);
        }
        function selectIt() {
          try {
            var r = document.createRange();
            r.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(r);
            done();
          } catch (x) { /* nothing sensible left to try */ }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(el.textContent).then(done, selectIt);
        } else {
          selectIt();
        }
      });
    }

    return h;
  }

  /* The keys renderGuideBody knows how to render. Shared with
     build-patient-ed.js so the authoring rule is stated once. */
  var GUIDE_KEYS = ['h','lead','paras','cards','items','links','shared','after','callout'];

  function renderGuideBody(DATA, DOSING, guide) {
    var h = '';
    if (guide.disclaimer) { h += '<p class="lede">' + esc(guide.disclaimer) + '</p>'; }
    if (guide.intro) { h += paras(guide.intro); }

    /* THIS DOES NOT THROW, AND THAT IS THE POINT.

       A first version of this guard threw on an unrecognised key. These guides
       render in the BROWSER, not at build time, so it threw at the PATIENT: the
       page came back with a body length of ZERO - a white screen, no content,
       no error guard. Caught by planting a bad key and loading the page. A
       dropped section is bad; a blank patient page is worse, and a renderer is
       the wrong place to enforce authoring rules.

       It logs instead, and build-patient-ed.js makes the same check a BUILD
       failure, where it costs a developer and not a patient. */
    (guide.sections || []).forEach(function (sec) {
      Object.keys(sec).forEach(function (k) {
        if (GUIDE_KEYS.indexOf(k) === -1 && window.console) {
          console.error('patient-ed-render: guide section "' + (sec.h || '?') +
            '" has key "' + k + '", which renderGuideBody does not render.');
        }
      });
      if (sec.h) { h += '<h2>' + esc(sec.h) + '</h2>'; }
      if (sec.lead) { h += '<p>' + rich(sec.lead) + '</p>'; }
      if (sec.paras) { h += paras(sec.paras); }
      if (sec.cards) { h += cards(sec.cards); }
      if (sec.items) { h += ul(sec.items); }
      if (sec.links) { h += links(sec.links); }
      if (sec.shared) { h += sharedBlock(DATA, sec.shared); }
      /* After the shared list, so an exception reads as an exception to the
         rules above it rather than as a heading for them. */
      /* .callout, NOT .k-note. `.k-note` is declared inside HUB_CSS, which only
         hub pages emit, so a guide rendered it as unstyled body text - the
         title was a plain sentence and the box was not there at all. Caught by
         screenshotting the rendered page; the DOM and the text content were
         both perfectly correct. `.callout` is the treatment the rest of the
         patient and provider set already uses. */
      if (sec.callout) {
        h += '<div class="callout"><h3>' + esc(sec.callout.title) + '</h3>' +
             '<p>' + rich(sec.callout.text) + '</p></div>';
      }
      if (sec.after) { h += paras(sec.after); }
    });

    if (guide.keyReminders) {
      h += '<h2>Key reminders</h2>' + ul(guide.keyReminders);
    }
    h += contactFooter(DATA.shared, guide);
    return h;
  }

  function renderBody(DATA, DOSING, doc) {
    var S = DATA.shared;
    var F = agentFacts(DOSING, doc);
    var h = '';

    h += '<div class="lede"><p>' + esc(S.disclaimer) + '</p></div>';

    /* Why before what. Kris Mulkey, 2026-09-22: a patient wants to know why a
       treatment is relevant before the technical explanation of what it is. */
    if (doc.mayHelp) {
      /* "Why patients use it", not "What it may support". Don, 2026-09-22: a
       benefit section names the goals patients bring and promises nothing. */
    h += '<h2>Why patients use it</h2><p>' + esc(doc.mayHelp.lead) + '</p>' +
           ul(doc.mayHelp.items) + '<p>' + esc(doc.mayHelp.after) + '</p>';
    }

    h += '<h2>What ' + esc(subjectOf(doc)) + ' is</h2>' + paras(doc.what);

    /* Route, schedule, timing and weeks - every value read from the dosing
       data, so a change there reaches this handout on the next page load. */
    h += '<h2>How to use it</h2>' +
         '<div class="callout"><p>' + esc(doc.authoritySource || S.authoritySource) + '</p></div>' +
         '<table class="kv">' +
         /* Labels are per-handout. Eight of the nine are injections and these
            defaults suit them; Hormone Therapy is patches, creams and capsules
            and "How to inject" was simply wrong on it. */
         '<tr><th>' + esc((doc.factLabels || {}).how || 'How to inject') + '</th><td>' +
           esc(sentence(F.how)) + '</td></tr>' +
         '<tr><th>' + esc((doc.factLabels || {}).timing || 'When to inject') + '</th><td>' +
           esc(sentence(F.timing)) + '</td></tr>' +
         '<tr><th>Schedule</th><td>' + esc(sentence(F.schedule)) + '</td></tr>' +
         (F.windows.length
            ? F.windows.map(function (w) {
                return '<tr><th>' + esc(w[0]) + '</th><td>' + esc(w[1]) + '</td></tr>'; }).join('')
            : (F.activeWeeks ? '<tr><th>Active weeks</th><td>' + esc(F.activeWeeks) + '</td></tr>' : '')) +
         (F.offWeeks ? '<tr><th>Off weeks</th><td>' + esc(F.offWeeks) + '</td></tr>' : '') +
         '</table>' +
         (doc.weeksNote ? '<p class="fine">' + esc(doc.weeksNote) + '</p>' : '');

    /* extraSections are drawn in two places. How-to sections (the injection
       steps, the syringe, the patch) follow How to use it; a section marked
       lifestyle (How much to drink) sits with Nutrition and lifestyle, so
       living with the medication reads as one run. 2026-09-22. */
    function extraSection(sec) {
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
        /* rich(), not esc(). Every other text field in these documents runs through
           rich() so **like this** reads as bold, and this one did not: a callout
           written with the same convention printed its asterisks to the patient.
           Caught on the testosterone handout 2026-09-19, before it shipped, by
           rendering the page rather than trusting the edit. rich() escapes first,
           so this adds no injection surface. */
        if (sec.callout) h += '<div class="callout"><p>' + rich(sec.callout) + '</p></div>';
        if (sec.warn) h += '<div class="callout warn"><p>' + esc(sec.warn) + '</p></div>';
    }
    (doc.extraSections || []).filter(function (sec) { return !sec.lifestyle; }).forEach(extraSection);

    (doc.timingNotes || []).forEach(function (n) {
      h += '<h3>' + esc(n[0]) + '</h3><p>' + rich(n[1]) + '</p>';   /* rich: dose notes can carry a link, 2026-09-22 */
    });

    if (doc.timeline) {
      h += '<h2>What to expect</h2><table class="grid"><thead><tr><th>Timeline</th>' +
           '<th>Phase</th><th>What to expect</th></tr></thead><tbody>' +
           doc.timeline.map(function (r) {
             return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
           }).join('') + '</tbody></table>' +
           (doc.timelineNote ? '<p class="fine">' + esc(doc.timelineNote) + '</p>' : '');
    }

    if (doc.nutrition) {
      h += '<h2>Nutrition and lifestyle</h2><p>' +
           esc(doc.nutrition.lead) + '</p>' + ul(doc.nutrition.items);
    }
    (doc.extraSections || []).filter(function (sec) { return sec.lifestyle; }).forEach(extraSection);



    h += '<h2>Side effects and what to watch for</h2>';
    if (doc.common) h += '<h3>What you may notice</h3>' + twoCol(doc.common, 'What you may notice', 'What to do');
    /* "When to tell your provider", not "at your next visit". Possible
       pancreatitis and gallbladder signs sit under this heading, and a patient
       read literally would wait weeks. Each row now says how soon. 2026-09-22. */
    if (doc.monitorAndTell) h += '<h3>' + esc(doc.monitorHeading || 'When to be seen') + '</h3>' +
      twoCol(doc.monitorAndTell, 'What you may notice', 'What to do');
    if (doc.emergencyLead) h += '<div class="callout warn"><p>' + esc(doc.emergencyLead) + '</p></div>';

    if (doc.source === 'glp1' && doc.contraPhrasing) {
      h += '<h2>Who should not use ' + esc(subjectOf(doc)) + '</h2>' +
           ul(contraindications(DOSING, doc));
    }

    if (doc.labs) {
      /* "Lab monitoring" is the right heading for a handout whose program
         monitors labs, and the wrong one for a program that orders none: it
         promises monitoring above a paragraph saying there is none. Overridable
         per handout since 2026-09-19, default unchanged. */
      h += '<h2>' + esc(doc.labs.heading || 'Lab monitoring') + '</h2><p>' + esc(doc.labs.lead) + '</p>' + ul(doc.labs.items) +
           '<p>' + esc(doc.labs.after) + '</p>';
    }

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
         screening(S);

    /* The shared injection-safety block - fresh needle every time, sharps
       disposal - is appended to every handout. On Hormone Therapy there is
       nothing to inject and it read as though there were. A handout says so with
       noInjectionSafety rather than the block being dropped for everyone. */
    /* The DEVICE sentence is only added for handouts that use an insulin
       syringe. A handout whose device differs says so with ownInjectionDevice
       and supplies its own line in doc.safety - the Testosterone handout
       already did, and was getting the insulin sentence appended underneath
       its own correct one. */
    var injSafety = doc.noInjectionSafety ? []
      : (doc.ownInjectionDevice ? S.injectionSafety
                                : [S.injectionSafetyDevice].concat(S.injectionSafety));
    h += '<h2>Safety reminders</h2>' +
         ul((doc.safety || []).concat(injSafety));

    /* WHICH problem goes to whom, kept - a handout is where a patient is when
       they notice a side effect, and the three-way split is clinical content.
       The DETAILS moved to contactFooter, so the phone number is not printed
       twice on one page. portalItems is per-handout and stays. */
    var C = S.contact;
    h += '<h2>When to contact KORB</h2>' +
         /* contact3 and data-label: on a phone the three columns were about 80px
            each and pushed "Seek emergency care immediately" off the right edge
            of nine handouts (found 2026-09-22). The builder's screen block stacks
            them under 640px and prints each cell's own heading from data-label.
            Desktop and print are unchanged. */
         '<table class="grid contact3"><thead><tr><th>' + esc(C.operations.title) + '</th><th>' +
         esc(C.portal.title) + '</th><th>' + esc(C.emergency.title) + '</th></tr></thead><tbody><tr>' +
         '<td data-label="' + esc(C.operations.title) + '">' + ul(C.operations.items) + '</td>' +
         '<td data-label="' + esc(C.portal.title) + '">' + ul(doc.portalItems || C.portal.items) + '</td>' +
         '<td data-label="' + esc(C.emergency.title) + '">' + ul(C.emergency.items) + '</td>' +
         '</tr></tbody></table>' +
         '<p class="fine">' + esc(C.portalNote) + '</p>';

    if (doc.keyReminders) h += '<h2>Key reminders</h2>' + ul(doc.keyReminders);

    h += contactFooter(S, doc);
    return h;
  }

  var DOCS = ['sermorelin'];

  return { DOCS: DOCS, esc: esc, renderBody: renderBody, renderProgramBody: renderProgramBody, renderGuideBody: renderGuideBody, renderHubBody: renderHubBody, agentFacts: agentFacts,
           contraindications: contraindications,
           CSS: CSS, CHOICE_CSS: CHOICE_CSS, LOGO_URI: LOGO_URI,
           /* Exported so build-patient-ed.js enforces the same list rather than
              keeping its own copy of it. */
           GUIDE_KEYS: GUIDE_KEYS };
}));
