/* ============================================================================
   korb-plan-block.js — THE plan note, shared by every tool.

   A provider finishes in a tool and needs one thing to paste into the chart.
   This renders it, and it is the only place that decides what a KORB plan note
   looks like.

   WHY IT IS SHARED, AND WHY IT WAS BUILT ALL AT ONCE.

   Until 2026-09-17 exactly one tool had a plan block: the GLP-1 Provider Tool,
   with its note assembled as hand-written prose inside that one HTML file. That
   tool was retired the same day for duplicating the monographs, which left the
   set with none at all.

   The obvious move was to copy its text into the Add-On tool. That is how the
   prescribing block came to exist four times in four shapes before
   korb-rx-block.js, and how a provider ended up seeing a different thing
   depending on which document they opened. Don deferred it deliberately so it
   could be done once. Open item 16.

   So: the SHAPE of a plan note lives here. The CONTENT comes from the data
   files, which already carry counselling, follow-up cadence, monitoring and
   side effects, and which are already signed. A tool assembles a spec from its
   own data and this file turns it into text and a card.

   WHAT THIS FILE OWNS
     - the section order and the section headings
     - ASCII enforcement on everything that reaches the clipboard
     - the card, the Copy button and the clipboard handler
     - the rule that an empty section is omitted rather than printed empty

   WHAT IT DOES NOT OWN
     - any clinical sentence. If a line of counselling is written here rather
       than read from a data file, it is unsigned content on a chart note and it
       can disagree with the reference beside it. Callers pass content.

   ASCII ONLY, AND NOT FOR TIDINESS. This text goes into an EMR note. The same
   reason Tebra copy values are plain ASCII applies: an en dash or a curly quote
   can be dropped or mangled on the way into a field, and a clinical note is the
   last place to discover that. Everything reaching the clipboard is folded to
   ASCII here, so no caller has to remember.
   ============================================================================ */

var KORB_PLAN = (function () {
  'use strict';

  /* Fold the typography a data file legitimately uses in prose down to what an
     EMR field will accept without surprises. Applied to the TEXT only - the
     rendered card keeps whatever the data says, because a screen is not a
     paste. */
  var FOLD = [
    [/[‐-―−]/g, '-'],   /* dashes, including the minus sign */
    [/[‘’‛]/g, "'"],
    [/[“”]/g, '"'],
    [/…/g, '...'],
    [/ /g, ' '],                  /* non-breaking space */
    [/[½]/g, '1/2'],
    [/[¼]/g, '1/4'],
    [/[¾]/g, '3/4'],
    [/°/g, ' degrees'],
    [/µ/g, 'mcg'],                /* micro sign, never the letter u */
    [/•/g, '-']
  ];

  function ascii(s) {
    var out = String(s === null || s === undefined ? '' : s);
    FOLD.forEach(function (pair) { out = out.replace(pair[0], pair[1]); });
    /* Anything still outside printable ASCII is dropped rather than guessed at.
       A character this file has not been taught is a character an EMR field may
       not take, and silently inventing a replacement is worse than losing it. */
    return out.replace(/[^\x20-\x7E\n]/g, '');
  }

  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clean(list) {
    return (list || []).map(function (x) { return String(x || '').trim(); })
                       .filter(Boolean);
  }

  /* ---- the note -----------------------------------------------------------
     Sections in the order a provider writes one: what was prescribed, what was
     said, when they come back, what gets checked. An empty section is left out
     entirely - a heading with nothing under it reads as an omission rather than
     as "not applicable", and in a chart note that distinction matters. */
  function text(spec) {
    spec = spec || {};
    var out = [];

    out.push(ascii(spec.title || 'KORB - PLAN').toUpperCase());

    clean(spec.lines && spec.lines.map(function (l) {
      if (Object.prototype.toString.call(l) === '[object Array]') {
        return l[1] ? ascii(l[0]) + ': ' + ascii(l[1]) : '';
      }
      return ascii(l);
    })).forEach(function (l) { out.push(l); });

    function section(heading, items) {
      var rows = clean((items || []).map(ascii));
      if (!rows.length) { return; }
      out.push('');
      out.push(heading);
      rows.forEach(function (r) { out.push(r); });
    }

    section('COUNSELLING', spec.counselling);
    section('FOLLOW-UP', spec.followUp
      ? (Object.prototype.toString.call(spec.followUp) === '[object Array]'
          ? spec.followUp : [spec.followUp])
      : []);
    section('MONITORING', spec.monitoring);
    section('NOTES', spec.notes);

    return out.join('\n');
  }

  /* ---- the card -----------------------------------------------------------
     Deliberately the same furniture as a prescribing block: a header with the
     action on the right, then the content. A provider should not have to learn
     two layouts in one page. */
  function card(spec, id) {
    var body = text(spec);
    return '<div class="korb-plan">' +
      '<div class="korb-plan-hdr"><strong>' + esc(spec.cardTitle || 'Plan - copy into the note') + '</strong>' +
      '<button type="button" class="korb-plan-copy" data-plan="' + esc(id) + '">Copy plan</button></div>' +
      '<pre class="korb-plan-body" id="' + esc(id) + '">' + esc(body) + '</pre>' +
      '</div>';
  }

  /* ---- styles and the copy handler, injected once -------------------------
     Self-contained on purpose. The tools do not all load korb-rx-block.js, so
     this cannot borrow its .copybtn rule or its clipboard handler, and a second
     copy of either inside each tool is the thing this file exists to prevent. */
  var wired = false;
  function wire() {
    if (wired || typeof document === 'undefined') { return; }
    wired = true;

    var css = document.createElement('style');
    css.textContent =
      '.korb-plan{border:1.5px solid #D6E0E3;border-radius:9px;overflow:hidden;' +
        'background:#fff;margin:18px 0 0;}' +
      '.korb-plan-hdr{display:flex;align-items:center;justify-content:space-between;' +
        'gap:10px;padding:11px 13px;background:#21275B;color:#fff;font-size:13px;' +
        'font-weight:700;flex-wrap:wrap;}' +
      '.korb-plan-copy{border:0;border-radius:999px;padding:7px 15px;cursor:pointer;' +
        'background:#00B2C3;color:#fff;font:inherit;font-size:12px;font-weight:700;}' +
      '.korb-plan-copy.done{background:#0F7B5A;}' +
      '.korb-plan-body{margin:0;padding:13px;font-family:Consolas,"Courier New",monospace;' +
        'font-size:12.5px;line-height:1.55;color:#1A1A2E;white-space:pre-wrap;' +
        'word-break:break-word;background:#FBFAF6;}' +
      '@media print{.korb-plan-copy{display:none;}}';
    document.head.appendChild(css);

    /* Delegated, because every tool rebuilds its output on every change and a
       handler bound to the button would be thrown away with it. */
    document.addEventListener('click', function (e) {
      var btn = e.target && e.target.closest ? e.target.closest('.korb-plan-copy') : null;
      if (!btn) { return; }
      var pre = document.getElementById(btn.getAttribute('data-plan'));
      if (!pre) { return; }
      var body = pre.innerText;
      function done() {
        var prev = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = prev; btn.classList.remove('done'); }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(body).then(done, function () { legacy(body, done); });
      } else { legacy(body, done); }
    });

    function legacy(body, done) {
      var ta = document.createElement('textarea');
      ta.value = body;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (err) { /* leave it alone */ }
      document.body.removeChild(ta);
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', wire);
    } else { wire(); }
  }

  /* ---- self check ---------------------------------------------------------
     Asserts the two rules that would be invisible if they broke: that an empty
     section is omitted, and that nothing non-ASCII reaches the clipboard. */
  function selfCheck() {
    var problems = [];

    var t = text({ title: 'x', lines: [['A', 'b']], counselling: [], followUp: '' });
    if (/COUNSELLING|FOLLOW-UP/.test(t)) {
      problems.push('an empty section rendered its heading');
    }

    var dirty = text({
      title: 'x',
      lines: [['Dose', '½ troche — 50 µg']],
      counselling: ['He said “fine” …']
    });
    if (/[^\x20-\x7E\n]/.test(dirty)) {
      problems.push('non-ASCII reached the note text: ' +
        JSON.stringify(dirty.match(/[^\x20-\x7E\n]/g)));
    }
    if (dirty.indexOf('1/2 troche - 50 mcg') === -1) {
      problems.push('fold did not produce the expected ASCII: ' + dirty);
    }

    if (typeof console !== 'undefined' && console.log) {
      console.log(problems.length
        ? 'KORB_PLAN selfCheck FAILED: ' + problems.join('; ')
        : 'KORB_PLAN selfCheck: OK');
    }
    return problems;
  }

  return { text: text, card: card, ascii: ascii, selfCheck: selfCheck };
})();

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PLAN; }
