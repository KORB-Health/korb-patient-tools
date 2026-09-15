/* ============================================================================
   KORB HEALTH — TEBRA COMPOUNDED DRUG FAVORITE BLOCK

   ONE renderer for the prescribing block, used by every document that shows a
   Tebra Compounded Drug Favorite entry:

     KORB_Provider_Clinical_Reference.html   FH&L peptides, live tool
     fhl-doc-render.js                       4 FH&L provider references
     provider-doc-render.js                  10 GLP-1 monographs
     clinical-doc-render.js                  Add-On Clinical Reference

   WHY THIS FILE EXISTS
     The same block existed four times, in four shapes. The Provider Clinical
     Reference had the labelled, colour-coded, copyable table a provider can
     actually work from. The four FH&L references rendered the SAME data -
     already stored in the right shape - as a plain "Field | Value" table with
     no copy buttons. The GLP-1 monographs had the right labels in a different
     layout. The Add-On reference had copy buttons but its own label names
     ("Favorite name", "Sig", "Pharmacy notes").

     A provider copying into Tebra therefore saw a different thing depending on
     which document they happened to open, and a field renamed in one place
     stayed renamed only there. This is the repo's founding rule applied to
     presentation: the block is defined once and every document reads it here.

   THE FIELD ORDER IS THE TEBRA ENTRY ORDER
     It is not alphabetical and it is not negotiable. It is the order the fields
     appear in on the Tebra Compounded Drug Favorite screen, so a provider works
     top to bottom down the page and top to bottom down the form. Do not
     reorder it to suit a layout.

   WHAT THIS FILE DOES NOT DO
     It does not decide values. Quantity is the vial size, days supply follows
     the pack (4-week = 28, 8-week = 56, 12-week = 84; most troches 90, sexual
     health 20), and mL applies to vials only - tablets, troches, pens and tubes
     carry their own unit. Those are clinical and billing facts and they live in
     the data files. This module lays them out and nothing more.
   ============================================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.KORB_RX_BLOCK = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {

  /* Tebra entry order. See the header. */
  var FIELD_ORDER = [
    'Drug Formulation',
    'Name',
    'Allow Substitution',
    'Quantity',
    'Unit',
    'Refill',
    'Days Supply',
    'Patient Instructions',
    'Reason for Compounding',
    'Pharmacy Instructions'
  ];

  /* Kept in sync with the Canva Compound Rx template so the two match field for
     field. Allow Substitution is deliberately absent: it is a fixed instruction
     rather than a value to transcribe, so it is not tinted and not copyable. */
  var FIELD_LEGEND = {
    'Drug Formulation':       { cls: 'fld-drugformulation',      hex: '#5C6BC0', bg: '#E8EAF6' },
    'Name':                   { cls: 'fld-name',                 hex: '#00897B', bg: '#E0F2F1' },
    'Quantity':               { cls: 'fld-quantity',             hex: '#F9A825', bg: '#FFF8E1' },
    'Unit':                   { cls: 'fld-unit',                 hex: '#EF6C00', bg: '#FFF3E0' },
    'Refill':                 { cls: 'fld-refill',               hex: '#8E24AA', bg: '#F3E5F5' },
    'Days Supply':            { cls: 'fld-dayssupply',           hex: '#D81B60', bg: '#FCE4EC' },
    'Patient Instructions':   { cls: 'fld-patientinstructions',  hex: '#1976D2', bg: '#E3F2FD' },
    'Reason for Compounding': { cls: 'fld-reasonforcompounding', hex: '#388E3C', bg: '#E8F5E9' },
    'Pharmacy Instructions':  { cls: 'fld-pharmacyinstructions', hex: '#6D4C41', bg: '#EFEBE9' }
  };

  var NO_COPY = { 'Allow Substitution': true };

  /* Pharmacy accent for the block header, so the same pharmacy is the same
     colour in every document. Taken from the Provider Clinical Reference,
     which is where providers first learned the association. Unknown keys fall
     back to navy rather than throwing - a new pharmacy should render plainly,
     not break the page. */
  /* THE PHARMACY COLOUR RULE. Don, 2026-09-15. These are fixed and they are the
     same in every document, every tool and every HTML page:

         FarmaKeio  GREEN
         Premier    BLUE
         Belmar     PURPLE

     Greenwich moved to teal in the same pass. It used to hold the green, which
     is why FarmaKeio was teal; the two are swapped rather than re-picked, so all
     four stay distinct and only one of them changes meaning.

     A pharmacy is recognised by its colour before its name is read, so do not
     re-theme one to suit a page. Add a new pharmacy here, once. */
  var PHARMACY_ACCENT = {
    farmakeio: '#2E7D32',
    premier:   '#1565C0',
    belmar:    '#6A1B9A',
    greenwich: '#00838F'
  };

  function accentFor(key) {
    return PHARMACY_ACCENT[String(key || '').toLowerCase()] || '#21275B';
  }

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* Accepts either stored shape and returns one ordered array of
     {field, val, copy}.

       A. korb-dosing-data.js      entry.fields = [{field, val, copy}]
       B. korb-glp1-data.js and
          korb-addons-data.js      flat keys on a tebra record

     Shape A is already authored in Tebra order, so it passes through in the
     order the data gives it rather than being re-sorted. The data file is the
     clinical record and it wins. Shape B is assembled into FIELD_ORDER. */
  function fieldsFrom(entry, extra) {
    if (!entry) { return []; }
    extra = extra || {};

    if (Object.prototype.toString.call(entry.fields) === '[object Array]') {
      return entry.fields.map(function (f) {
        return {
          field: f.field,
          val: f.val,
          copy: f.copy !== undefined ? !!f.copy : !NO_COPY[f.field]
        };
      });
    }

    var r = entry;
    var pick = {
      'Drug Formulation': r.drugFormulation || extra.drugFormulation || extra.formulation,
      'Name': r.name || r.label,
      'Allow Substitution': r.allowSubstitution === undefined
        ? undefined
        : (r.allowSubstitution ? 'Yes — select Allow Substitution' : 'No'),
      'Quantity': r.quantity,
      'Unit': r.unit,
      'Refill': r.refill,
      'Days Supply': r.days !== undefined ? r.days : r.daysSupply,
      'Patient Instructions': r.ptInstructions || r.sig,
      'Reason for Compounding': r.reasonForCompounding,
      'Pharmacy Instructions': r.pharmacyNotes
    };

    var out = [];
    FIELD_ORDER.forEach(function (name) {
      var v = pick[name];
      if (v === undefined || v === null || v === '') { return; }
      out.push({ field: name, val: v, copy: !NO_COPY[name] });
    });
    return out;
  }

  /* One block: the pharmacy sub-header a provider uses to know which entry they
     are looking at, then the field table. `accent` is the pharmacy colour. */
  function block(opts) {
    opts = opts || {};
    var fields = opts.fields || [];
    if (!fields.length) { return ''; }

    var accent = opts.accent || '#21275B';
    var head = esc(opts.pharmacy || '');
    if (opts.label) {
      head += ' &nbsp;&middot;&nbsp; Compounded Drug Favorite Entry &nbsp;&middot;&nbsp; ' + esc(opts.label);
    }

    var h = '<div class="rxb">';
    h += '<div class="rxb-hdr" style="background:' + esc(accent) + ';">' + head + '</div>';
    h += '<table class="rxb-tbl"><tbody>';
    fields.forEach(function (f) {
      var fc = FIELD_LEGEND[f.field];
      var cls = fc ? ' class="' + fc.cls + '"' : '';
      h += '<tr><th>' + esc(f.field) + '</th>';
      if (f.copy) {
        h += '<td' + cls + '><span class="cp" data-copy="' + esc(f.val) + '">' + esc(f.val) +
             '<button class="copybtn" type="button" aria-label="Copy">Copy</button></span></td></tr>';
      } else {
        h += '<td' + cls + '>' + esc(f.val) + '</td></tr>';
      }
    });
    h += '</tbody></table></div>';
    return h;
  }

  /* Several strengths of one medication usually share almost every Tebra field.
     All four Greenwich sermorelin entries carry the same formulation, quantity,
     unit, refill, days supply, patient instructions, reason and pharmacy
     instructions; only the favorite Name changes, because that is what the
     provider picks out of their Tebra list. Printed as four full blocks, that
     is the same nine values three extra times.

     groupFields() splits a set of same-medication entries into the fields that
     are constant across all of them and the fields that actually vary.

     It compares VALUES and never assumes. A field is factored out only when
     every strength agrees on it, so Tesamorelin - whose quantity really does go
     30 / 45 / 60 - keeps quantity per strength rather than being flattened onto
     one wrong number. Collapsing a value that differs would put the wrong
     volume on a prescription, so the test is equality and nothing looser. */
  function groupFields(entries) {
    entries = (entries || []).filter(Boolean);
    if (!entries.length) { return { constant: [], varying: [], count: 0 }; }

    var lists = entries.map(function (e) { return e.fields || []; });
    var order = [];
    lists.forEach(function (l) {
      l.forEach(function (f) { if (order.indexOf(f.field) === -1) { order.push(f.field); } });
    });

    var constant = [];
    var varying = [];

    order.forEach(function (name) {
      var vals = lists.map(function (l) {
        var hit = null;
        l.forEach(function (f) { if (f.field === name) { hit = f; } });
        return hit;
      });
      var present = vals.filter(Boolean);
      var allHave = present.length === entries.length;
      var same = allHave && present.every(function (f) {
        return String(f.val) === String(present[0].val);
      });

      if (same) {
        constant.push({ field: name, val: present[0].val, copy: present[0].copy });
        return;
      }
      varying.push({
        field: name,
        rows: entries.map(function (e, i) {
          return {
            dose: e.dose || e.key || '',
            val: vals[i] ? vals[i].val : '',
            copy: vals[i] ? vals[i].copy : false
          };
        })
      });
    });

    return { constant: constant, varying: varying, count: entries.length };
  }

  function row(f) {
    var fc = FIELD_LEGEND[f.field];
    var cls = fc ? ' class="' + fc.cls + '"' : '';
    var h = '<tr><th>' + esc(f.field) + '</th>';
    if (f.copy) {
      h += '<td' + cls + '><span class="cp" data-copy="' + esc(f.val) + '">' + esc(f.val) +
           '<button class="copybtn" type="button" aria-label="Copy">Copy</button></span></td></tr>';
    } else {
      h += '<td' + cls + '>' + esc(f.val) + '</td></tr>';
    }
    return h;
  }

  /* One medication, one pharmacy, every strength. The shared fields print once
     and the fields that genuinely differ print as a short per-strength table
     underneath, which is then the only place a strength-specific value lives. */
  function groupBlock(opts) {
    opts = opts || {};
    var g = groupFields(opts.entries);
    if (!g.constant.length && !g.varying.length) { return ''; }

    var accent = opts.accent || '#21275B';
    var head = esc(opts.pharmacy || '');
    if (opts.label) {
      head += ' &nbsp;&middot;&nbsp; Compounded Drug Favorite Entry &nbsp;&middot;&nbsp; ' + esc(opts.label);
    }
    if (g.count > 1) { head += ' &nbsp;&middot;&nbsp; ' + g.count + ' strengths'; }

    var h = '<div class="rxb">';
    h += '<div class="rxb-hdr" style="background:' + esc(accent) + ';">' + head + '</div>';

    if (g.constant.length) {
      h += '<table class="rxb-tbl"><tbody>';
      g.constant.forEach(function (f) { h += row(f); });
      h += '</tbody></table>';
    }

    g.varying.forEach(function (v) {
      var fc = FIELD_LEGEND[v.field];
      h += '<div class="rxb-vary">';
      h += '<div class="rxb-vary-hd">' + esc(v.field) + ' &mdash; one per strength</div>';
      h += '<table class="rxb-tbl"><tbody>';
      v.rows.forEach(function (r) {
        var cls = fc ? ' class="' + fc.cls + '"' : '';
        h += '<tr><th>' + esc(r.dose) + '</th>';
        if (r.copy) {
          h += '<td' + cls + '><span class="cp" data-copy="' + esc(r.val) + '">' + esc(r.val) +
               '<button class="copybtn" type="button" aria-label="Copy">Copy</button></span></td></tr>';
        } else {
          h += '<td' + cls + '>' + esc(r.val) + '</td></tr>';
        }
      });
      h += '</tbody></table></div>';
    });

    h += '</div>';
    return h;
  }

  /* The tint goes on the VALUE cell, which is the cell a provider reads and
     copies. Print keeps the tints - they are how the page maps to the Canva
     template - and drops the buttons, which mean nothing on paper. */
  var CSS = (function () {
    var s =
      '.rxb{margin:0 0 18px;border:1px solid #C9CEDB;border-radius:7px;overflow:hidden;' +
        'break-inside:avoid;page-break-inside:avoid;}' +
      '.rxb-hdr{color:#fff;font-weight:700;font-size:12px;letter-spacing:.02em;padding:7px 12px;}' +
      '.rxb-tbl{width:100%;border-collapse:collapse;font-size:12px;}' +
      /* The label column carries NO background of its own. It used to be tinted
         #F7F8FB against a white value column, so every row was two different
         colours side by side and the block read as two columns rather than a
         list of rows. The stripe below colours the WHOLE row, both cells, which
         is what makes it scannable left to right. */
      '.rxb-tbl th{width:33%;text-align:left;font-weight:700;color:#21275B;' +
        'padding:6px 12px;vertical-align:top;}' +
      /* white-space:pre-wrap is not cosmetic. Greenwich stores its formulations
         with a run of spaces - "KBH   Sermorelin 3mg/mL" carries three - and
         HTML collapses those to one, so the page showed a provider a string
         that did NOT match what Greenwich requires while the copy button
         carried the right one. Greenwich flags a formulation that does not
         match their own and the prescription may not be filled, so the
         displayed value has to be the stored value, space for space. */
      '.rxb-tbl td{border-top:1px solid #E3E6EF;padding:6px 12px;vertical-align:top;' +
        'white-space:pre-wrap;}' +
      '.rxb-tbl tr:first-child th,.rxb-tbl tr:first-child td{border-top:0;}' +
      '.cp{display:block;}' +
      /* A one-line trailer such as Storage belongs to the block above it. Left
         to itself it was landing alone on a fresh page - 12 of 71 pages across
         the four FH&L references were a single line of storage text and
         nothing else. */
      '.rxb-after{break-before:avoid;page-break-before:avoid;break-inside:avoid;' +
        'page-break-inside:avoid;margin-top:-6px;}' +
      /* The two pharmacies for one strength lay out DIFFERENTLY on screen and in
         print, because the job is different in each.

         ON SCREEN the block is stacked full width. Copying is the task, and the
         value cell is what a provider reads character by character before it
         becomes a prescription. Measured at a 1440px window: two-up gives a
         217px value cell and wraps Patient Instructions to five lines; stacked
         gives 564px and three. Scrolling is free, squinting is not.

         Screen width does NOT solve this on its own - body is capped at 8.5in so
         the page matches print, so a 3440px monitor renders the same 376px
         columns as a 1366px laptop. Nobody was getting the roomy version.

         IN PRINT they sit side by side. There is nothing to click on paper, a
         page turn is the expensive move, and pairing the two pharmacies for one
         strength is what stopped Greenwich landing on one page and Premier on
         the next. It also holds the page count: stacking in print pushes the
         four references from 56 pages back toward 70. */
      '.rxb-pair{margin-bottom:16px;}' +
      '.rxb-pair > .rxb{margin-bottom:14px;}' +
      '@media print{' +
        '.rxb-pair{display:flex;gap:12px;align-items:flex-start;' +
          'break-inside:avoid;page-break-inside:avoid;}' +
        '.rxb-pair > .rxb{flex:1 1 0;min-width:0;margin-bottom:0;}' +
        '.rxb-pair > .rxb .rxb-tbl th{width:42%;}}' +
      /* Lab panel: two complete orders side by side, kept on one page. */
      '.labsec,.pricesec{break-inside:avoid;page-break-inside:avoid;}' +
      /* One table, two column groups. Flex was tried and abandoned: unbreakable
         flex children paginate onto separate pages. A table does not.

         Both group headers are navy. They were navy and teal, which implied the
         two orders differ in kind when they differ by exactly one row. The two
         groups are separated by a rule instead, which says "these are two
         columns" without saying "these are two different things". */
      '.labtbl th.grp-a,.labtbl th.grp-b{background:#21275B;color:#fff;' +
        'text-align:center;letter-spacing:.03em;}' +
      /* The divider between the two orders, carried down every row. */
      '.labtbl th.grp-b,.labtbl thead tr+tr th:nth-child(3),' +
        '.labtbl tbody td:nth-child(3){border-left:1pt solid #9AA3BD;}' +
      /* The extra row. The accent belongs to the two cells that carry the extra
         test and to nothing else - applying it to the whole row put a gold bar
         against the two empty cells on the left, which read as a stray mark on
         a column that has no extra test at all. */
      /* Shading alone marks the extra test. The gold rule that used to sit on
         top of these cells was 2px against 0.6pt everywhere else, so it read as
         a heavier line rather than an accent, and against the empty cells beside
         it it looked like the table had been cut off. */
      '.labtbl tr.addrow td.addcell{background:#FDF3E0;font-weight:700;' +
        'color:#21275B;}' +
      '.labtbl tr.addrow td.na{background:#FBFBFD;}' +
      '.grid td.code{font-variant-numeric:tabular-nums;white-space:nowrap;}' +
      '.pricetbl td.amt{font-weight:700;white-space:nowrap;}' +
      '.pricetbl td.amt .per{font-weight:400;font-size:10px;color:#5A6079;}' +
      '.pricetbl tr.grp td{background:#EEF1F7;font-size:11px;}' +
      
      '.rxb-vary{border-top:2px solid #C9CEDB;}' +
      '.rxb-vary-hd{font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;' +
        'color:#5A6079;background:#F1F3F8;padding:5px 12px;}';
    /* NO PER-FIELD TINTS. Removed 2026-09-15 on Don's instruction: providers know
       which Tebra field is which by now, so the colour coding had stopped being a
       key and become visual clutter - eleven tinted rows and eleven coloured left
       bars in a block a provider is trying to read one line at a time.

       FIELD_LEGEND is kept because it still documents the Canva Compound Rx
       template's colour for each field, which is a real mapping someone will want
       again. It simply no longer paints anything here. Re-enabling it is one
       loop; the decision not to is deliberate.

       Readability now comes from zebra striping and a single border weight. */
    /* ZEBRA ACROSS THE WHOLE ROW. Both cells of a striped row take the same
       tint, so the eye tracks left to right along one value rather than down two
       differently coloured columns.

       An earlier pass removed striping entirely and used a rule between rows
       instead. That was the wrong half of the problem: the striping was never
       what looked odd, the tinted LABEL COLUMN underneath it was, because it
       made every row two-tone whether it was striped or not. Tint removed,
       striping back, one colour per row. */
    s += '.rxb-tbl tbody tr:nth-child(odd) th,' +
         '.rxb-tbl tbody tr:nth-child(odd) td{background:#F4F6FA;}';
    s += '@media print{.copybtn{display:none;}}';
    /* Monospace is a SCREEN-ONLY affordance. It makes a transcribed value easy
       to read character by character, which is what the field is for, but the
       PDF typeface guard permits Montserrat and nothing else - a monospace
       stack here embedded Consolas in all four FH&L PDFs and failed the build,
       correctly. Print therefore inherits the brand face. */
    s += '@media screen{' +
      '.rxb-tbl td{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}' +
      '.copybtn{float:right;margin-left:10px;font-family:inherit;font-size:10px;font-weight:700;' +
        'border:1px solid #9AD9E0;background:#E8F7F9;color:#0F5F69;border-radius:4px;' +
        'padding:1px 7px;cursor:pointer;}' +
      '.copybtn:hover{background:#D3EDF1;}' +
      '.copybtn.ok{background:#1B6349;border-color:#1B6349;color:#fff;}}';
    return s;
  }());

  /* Delegated, so a rebuild that adds products needs no change here. The
     fallback matters: clipboard.writeText is unavailable over plain http and
     from file://, which is how a provider opening this off a shared drive will
     actually see it. Emitted as a string so each builder can inline it. */
  var COPY_JS = [
    'document.addEventListener("click", function (e) {',
    '  var btn = e.target.closest ? e.target.closest(".copybtn") : null;',
    '  if (!btn) { return; }',
    '  var host = btn.parentNode;',
    '  var text = host.getAttribute("data-copy") || "";',
    '  function done() {',
    '    var prev = btn.textContent;',
    '    btn.textContent = "copied";',
    '    btn.className = "copybtn ok";',
    '    setTimeout(function () { btn.textContent = prev; btn.className = "copybtn"; }, 1400);',
    '  }',
    '  function legacy() {',
    '    var ta = document.createElement("textarea");',
    '    ta.value = text;',
    '    ta.setAttribute("readonly", "");',
    '    ta.style.cssText = "position:absolute;left:-9999px;";',
    '    document.body.appendChild(ta);',
    '    ta.select();',
    '    try { document.execCommand("copy"); done(); } catch (err) { /* leave the button */ }',
    '    document.body.removeChild(ta);',
    '  }',
    '  if (navigator.clipboard && navigator.clipboard.writeText) {',
    '    navigator.clipboard.writeText(text).then(done, legacy);',
    '  } else { legacy(); }',
    '});'
  ].join('\n');

  /* Every field a document renders has to be one this module knows about. An
     unknown label means a data file grew a field and no document is placing it
     in the right row. Returns [] when clean, so a caller can treat a non-empty
     result as a build failure. */
  function selfCheck(entries) {
    var problems = [];
    (entries || []).forEach(function (e, i) {
      fieldsFrom(e).forEach(function (f) {
        if (FIELD_ORDER.indexOf(f.field) === -1) {
          problems.push('entry ' + i + ': unknown field "' + f.field + '"');
        }
      });
    });
    return problems;
  }

  return {
    FIELD_ORDER: FIELD_ORDER,
    FIELD_LEGEND: FIELD_LEGEND,
    PHARMACY_ACCENT: PHARMACY_ACCENT,
    accentFor: accentFor,
    fieldsFrom: fieldsFrom,
    groupFields: groupFields,
    groupBlock: groupBlock,
    block: block,
    esc: esc,
    CSS: CSS,
    COPY_JS: COPY_JS,
    selfCheck: selfCheck
  };
}));
