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
  var PHARMACY_ACCENT = {
    premier:   '#1565C0',
    greenwich: '#2E7D32',
    belmar:    '#6A1B9A',
    farmakeio: '#00838F'
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

  /* The tint goes on the VALUE cell, which is the cell a provider reads and
     copies. Print keeps the tints - they are how the page maps to the Canva
     template - and drops the buttons, which mean nothing on paper. */
  var CSS = (function () {
    var s =
      '.rxb{margin:0 0 18px;border:1px solid #C9CEDB;border-radius:7px;overflow:hidden;' +
        'break-inside:avoid;page-break-inside:avoid;}' +
      '.rxb-hdr{color:#fff;font-weight:700;font-size:12px;letter-spacing:.02em;padding:7px 12px;}' +
      '.rxb-tbl{width:100%;border-collapse:collapse;font-size:12px;}' +
      '.rxb-tbl th{width:33%;text-align:left;font-weight:700;color:#21275B;background:#F7F8FB;' +
        'border-top:1px solid #E3E6EF;padding:6px 12px;vertical-align:top;}' +
      '.rxb-tbl td{border-top:1px solid #E3E6EF;padding:6px 12px;vertical-align:top;}' +
      '.rxb-tbl tr:first-child th,.rxb-tbl tr:first-child td{border-top:0;}' +
      '.cp{display:block;}';
    Object.keys(FIELD_LEGEND).forEach(function (k) {
      var f = FIELD_LEGEND[k];
      s += '.rxb-tbl td.' + f.cls + '{background:' + f.bg + ';box-shadow:inset 3px 0 0 ' + f.hex + ';}';
    });
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
    block: block,
    esc: esc,
    CSS: CSS,
    COPY_JS: COPY_JS,
    selfCheck: selfCheck
  };
}));
