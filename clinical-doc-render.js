/* ============================================================================
   KORB HEALTH — CLINICAL REFERENCE RENDERER

   Renders the program clinical references — Add-Ons, and Men's and Women's
   Health as their data files land — from the same data the provider tools
   read. One module, used by both the live HTML shell in the browser and the
   PDF build, so the printed page and the live page cannot drift apart.

   WHY THIS FILE EXISTS
     The three clinical references in Provider_Reference/ were built on
     2026-09-10 by a ReportLab script that was never committed. It no longer
     exists anywhere: not in this repo, not on GitHub, not in the Drive. The
     documents could not be rebuilt, so every correction to them was a
     hand-edit with nothing to reproduce it from.

     That is the third time this has happened here. The eleven GLP-1 documents
     were orphaned the same way and `build-provider-docs.js` exists because of
     it; the four FH&L documents were orphaned again and `build-fhl-docs.js`
     exists because of that. A generator that lives outside the repo is a
     generator that stops existing. This one is in the repo.

   WHERE THE CONTENT COMES FROM, AND WHY IT MATTERS
     The 2026-09-10 provider reference review closed with a finding worth
     repeating here, because it governs every extraction into this renderer:

       "For this set the tools are frequently ahead of the PDFs, so a
        disagreement between them is a question, not a defect."

     Three findings in that review were wrong precisely because a documented
     rule was treated as authoritative over live behaviour. So: numbers,
     prices, codes, sigs and routing come from the data files. Only clinical
     narrative comes from the PDFs, and only where it exists nowhere else.

   NO STATE OR PHARMACY FACT IS TYPED INTO THIS FILE
     Every pharmacy name, ship-to list and excluded-state list is read from
     korb-pharmacies.js at render time. The 2026-09-10 review found the Add-On
     reference publishing FarmaKeio's PREFERRED list as its SHIP-TO list,
     wrongly excluding AZ, FL, NV and TX. Reading the pharmacy layer instead of
     restating it makes that class of error structurally impossible.

   HOUSE STYLE
     CSS, the embedded Montserrat faces and the logo come from
     provider-doc-render.js rather than being restated, which is what keeps the
     provider library reading as one set and means a brand change lands
     everywhere at once.

   ENTITY ATTRIBUTION
     These documents carry KORB Health Medical Texas PA, not KORB Health Group.
     The MSO does not practise medicine, and candidate criteria, dose ladders
     and prescriber restrictions are clinical protocol. Review finding ST-3.

   DO NOT EDIT A GENERATED DOCUMENT. Edit the data file, or edit this renderer,
   and rebuild. A hand-edit is overwritten by the next build.
   ============================================================================ */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./provider-doc-render.js'));
  } else {
    root.KORB_CLINICAL_DOCS = factory(root.KORB_DOCS);
  }
}(typeof self !== 'undefined' ? self : this, function (GLP1DOCS) {

var esc = GLP1DOCS.esc;
var CSS = GLP1DOCS.CSS;
var LOGO_URI = GLP1DOCS.LOGO_URI;

/* The shared Tebra prescribing block, reached through the GLP-1 module which
   already carries it. */
var RXB = GLP1DOCS.RXB;

/* Bound by renderBody()/mount() before any section runs. `D` is the program
   data file (KORB_ADDONS and, later, the Men's and Women's equivalents) and
   `PH` is the shared pharmacy layer. */
var D = null;
var PH = null;

/* ── THE DOCUMENTS ────────────────────────────────────────────────────────
   Deliberately thin. A document is its data file's `document` block plus the
   global that carries it, so adding Men's or Women's Health is one row here
   and one `document` block there, with no renderer change. */
var DOCS = [
  { id: 'addons', global: 'KORB_ADDONS', file: 'KORB_AddOn_Clinical_Reference', title: 'Add-On Clinical Reference' },
  { id: 'trt', global: 'KORB_TRT', file: 'KORB_TRT_Clinical_Reference', title: 'Testosterone Replacement Clinical Reference' }
];

/* ── SMALL HELPERS ────────────────────────────────────────────────────────── */
function esc2(v) { return esc(v == null ? '' : String(v)); }

function paras(list) {
  return (list || []).map(function (t) { return '<p>' + esc2(t) + '</p>'; }).join('');
}

function bullets(list) {
  return '<ul>' + (list || []).map(function (b) { return '<li>' + esc2(b) + '</li>'; }).join('') + '</ul>';
}

function kvTable(pairs) {
  var rows = (pairs || []).filter(Boolean).map(function (p) {
    return '<tr><th>' + esc2(p[0]) + '</th><td>' + p[1] + '</td></tr>';
  }).join('');
  return '<table class="kv">' + rows + '</table>';
}

/* Callout tones map onto the shared stylesheet's existing classes so these
   documents look like the FH&L set rather than like a second system. */
function callout(c) {
  /* The shared stylesheet has no .callout.stop. Its red-bordered block is
     .gate, and a hard contraindication rendered as an ordinary teal callout
     reads as a tip, which is the opposite of the intent. */
  var cls = c.tone === 'stop' ? 'gate' : (c.tone === 'warn' ? 'callout warn' : 'callout');
  return '<div class="' + cls + '">' +
    (c.heading ? '<h3>' + esc2(c.heading) + '</h3>' : '') +
    '<p>' + esc2(c.body) + '</p></div>';
}

/* The Style Standard forbids an Open Items section: an unresolved question
   either names a decider inline or stays out of the document. This is what
   "inline" looks like. */
function decider(d) {
  /* Provider-facing documents carry no open questions. An unresolved item is
     internal working state: it belongs in the data file and in Don's queue, not
     in front of a prescriber who needs a clean instruction. Retained as a
     no-op so `decider` data can stay in korb-addons-data.js unrendered. */
  return '';
  /* eslint-disable no-unreachable */
  if (!d) return '';
  return '<div class="callout"><h3>Open, and who decides</h3>' +
    '<p>' + esc2(d.question) + '</p>' +
    '<p class="fine">Decision sits with ' + esc2(d.owner) +
    (d.inherited ? '. Carried forward from the prior protocols, so it is an inherited decision rather than one the current clinical director has reviewed.' : '.') +
    '</p></div>';
}

/* ── PHARMACY, READ FROM THE SHARED LAYER ─────────────────────────────────
   Never typed. `footprintNote` is the pharmacy's own sentence about its
   licensed footprint, so a pharmacy change reaches this document with no edit
   here.

   Field names track korb-pharmacies.js. They were shipsToNote/shipsTo until the
   footprint + programs reshape on 2026-09-15; this line was missed in that
   commit and the document printed "0 states" for every pharmacy until it was
   caught the next day. If the shared layer renames a field again, this is the
   only place outside that file that reads one. */
function pharmacyRows(keys) {
  return (keys || []).map(function (k) {
    var p = PH && PH.pharmacies ? PH.pharmacies[k] : null;
    if (!p) return '';
    var sources = (D.document.pharmacySources || {})[k] || '';
    var footprint = p.footprintNote || ((p.footprint || []).length + ' states');
    return '<tr><td><strong>' + esc2(p.name) + '</strong></td><td>' + esc2(footprint) +
           '</td><td>' + esc2(sources) + '</td></tr>';
  }).join('');
}

function sectionPharmacyTable(sec) {
  /* Which pharmacies appear is derived from the products themselves, in the
     order the document declares, so a pharmacy that stops sourcing add-ons
     drops out of the table without an edit. */
  var used = {};
  (D.products || []).forEach(function (p) { used[p.pharmacy] = true; });
  var order = (D.document.pharmacyOrder || Object.keys(used)).filter(function (k) { return used[k]; });

  var h = '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body);
  h += '<table class="grid"><thead><tr><th>Pharmacy</th><th>Footprint</th><th>Sources</th></tr></thead><tbody>' +
       pharmacyRows(order) + '</tbody></table>';
  h += '<div class="callout"><h3>Routing rule</h3><p>' + esc2(D.rules.routing) + '</p>' +
       '<p>' + esc2(D.rules.skinCareNote) + '</p></div>';
  return h + decider(sec.decider);
}

/* ── THE AT-A-GLANCE MATRIX ───────────────────────────────────────────────
   Built from products[] and groups[], never typed, so a product added to the
   data file appears here automatically. */
function sectionMatrix(sec) {
  var rows = (D.groups || []).map(function (g) {
    var inGroup = (D.products || []).filter(function (p) { return p.group === g.key; });
    function namesFor(sex) {
      var seen = {}, out = [];
      inGroup.forEach(function (p) {
        if (p.sex !== 'any' && p.sex !== sex) return;
        if (!seen[p.name]) { seen[p.name] = 1; out.push(p.name); }
      });
      return out.length ? out.join(', ') : '—';
    }
    return '<tr><td><strong>' + esc2(g.label) + '</strong></td><td>' + esc2(namesFor('m')) +
           '</td><td>' + esc2(namesFor('f')) + '</td><td>' + esc2(g.followUp) + '</td></tr>';
  }).join('');

  return '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body) +
    '<table class="grid"><thead><tr><th>Add-on</th><th>Men</th><th>Women</th><th>Follow-up</th></tr></thead><tbody>' +
    rows + '</tbody></table>' +
    '<p class="fine">Not every formulation is available to every patient. Availability ' +
    'depends on the state the patient is in, the pharmacy, and what that pharmacy currently ' +
    'compounds. Confirm in the Add-On provider tool before quoting a product to a patient.</p>' +
    '<div class="callout"><p>' + esc2(D.rules.ageNote) + '</p></div>' +
    decider(sec.decider);
}

/* ── PRODUCT DETAIL ───────────────────────────────────────────────────────
   One block per product, with the Tebra fields printed literally because a
   provider copies them character for character. */
/* A value a provider retypes is a value they can mistype, and these are the
   fields that go into Tebra character for character. Every one is wrapped so
   the live HTML can offer a copy button; print hides the buttons. */
function copyCell(v) {
  var s = String(v == null ? '' : v);
  return '<span class="cp" data-copy="' + esc2(s) + '">' + esc2(s) +
         '<button class="copybtn" type="button" aria-label="Copy">copy</button></span>';
}

function tebraRows(p) {
  var t = p.tebra;
  if (!t) return '';

  /* Rendered through korb-rx-block.js, the same module the FH&L references and
     the GLP-1 monographs use. This document used to draw its own table with its
     own label set - "Tebra drug - custom compound", "Favorite name", "Sig",
     "Days supply", "Pharmacy notes" - and its own copy-button markup, so a
     provider moving between documents met the same Tebra fields under different
     names in a different layout.

     Two defects went with that, and both are now gone by construction rather
     than by patching: quantity and unit shared one cell, so the page read
     "1 [copy] bottle" with the button wedged between the number and the unit,
     and the buttons sat inline instead of aligned right.

     SURESCRIPTS NOTE, kept from the old implementation. Tebra used to need a
     commercial drop-down entry to hang a prescription off, so these records
     carried things like "Viagra 50 mg tablet (from drop-down)". Tebra now takes
     a genuine custom compounded drug and drugFormulation is that string. It
     lives on the PRODUCT, not on the tebra record, so it is handed to the block
     as `extra` to become Drug Formulation.

     STANDING RULE: the retired drop-down entry is never rendered. These blocks
     are copied into a prescription and a superseded entry beside the live custom
     compound invites the wrong pick. The field stays in the data as history. */
  /* A product prescribed at several strengths gets ONE COMPLETE BLOCK EACH.
     Tretinoin cream is 0.025%, 0.05% and 0.1%, and a provider copies one of
     them, so printing only the first left two strengths with nothing to paste.
     `tebraAlso` carries the extra records; each is stored in full in the data
     rather than built here by substituting a percentage, because these strings
     go onto a prescription. Same rule as the dose blocks in the GLP-1
     monographs: never factor, never generate, one whole entry per thing a
     provider might prescribe. */
  var entries = [t].concat(p.tebraAlso || []);
  return entries.map(function (e) {
    return RXB.block({
      pharmacy: pharmName(p.pharmacy),
      label: e.name || p.name,
      fields: RXB.fieldsFrom(e, { drugFormulation: e.drugFormulation || p.drugFormulation }),
      accent: RXB.accentFor(p.pharmacy)
    });
  }).join('');
}

function pharmName(key) {
  return PH && PH.pharmacies && PH.pharmacies[key] ? PH.pharmacies[key].name : key;
}

function sexLabel(s) {
  return s === 'm' ? 'Men' : (s === 'f' ? 'Women' : 'Men and women');
}

/* The scan table. A provider deciding WHETHER to prescribe reads this and
   nothing else; the prescribing blocks below are for once they have decided.
   Keeping those two jobs apart is what kept the original document to eight
   pages, and rendering every product as a full detail block instead ran it to
   twenty-eight. */
function productSummary(list) {
  var rows = list.map(function (p) {
    return '<tr><td><strong>' + esc2(p.name) + '</strong></td>' +
      '<td>' + esc2(pharmName(p.pharmacy)) + '</td>' +
      '<td>' + esc2(sexLabel(p.sex)) + '</td>' +
      '<td>' + esc2(p.dosing) + '</td>' +
      '<td>' + esc2(p.supply) + '</td></tr>';
  }).join('');
  /* STANDING RULE: no price and no charge code in this document. It is a
     clinical reference for prescribing, and billing changes on a different
     clock than clinical content. A price rendered into a PDF is stale the day
     Nick changes it, and a stale price in a provider document is the failure
     this architecture exists to prevent. price and chargeCode stay in
     korb-addons-data.js because build-embed.js feeds the provider tool from
     them. Do not re-add these columns. */
  return '<table class="grid"><thead><tr><th>Product</th><th>Pharmacy</th><th>Who</th><th>Dosing</th>' +
         '<th>Supply</th></tr></thead><tbody>' + rows + '</tbody></table>' +
         '<p class="fine">Pricing and charge codes are deliberately not in this document. ' +
         'They are maintained in the Add-On provider tool, which is the single place they are kept current.</p>';
}

/* The prescribing block. Formulation, the Tebra fields and anything that
   changes the decision. Deliberately does NOT repeat dosing, supply, price or
   code — those are one table up, and a fact printed twice is a fact that can
   disagree with itself. */
/* Same product from two pharmacies is two records but ONE clinical entity.
   Rendering each record whole printed the contraindication, the counselling
   and the monitoring twice, word for word, which reads as an error and buries
   the one thing that actually differs: the Tebra fields. Clinical content is
   printed once per product; only the fields repeat per pharmacy. */
function clinicalSignature(p) {
  return JSON.stringify([p.warn || '', p.warnAmber || '', p.note || '', p.monitor || []]);
}

function productBlock(group) {
  var lead = group[0];
  /* .prodhead, the shared product rank. Plain h3 put this at the same size as
     the "Prescribing detail" label above it, so a product name had nothing
     marking it as the start of a new product. */
  var h = '<div class="rxblock"><h3 class="prodhead">' + esc2(lead.name) + '</h3>';

  /* Formulations can differ by pharmacy even when the clinical picture does
     not — the two KORB Electric compounds are a different set of actives. */
  var forms = {};
  group.forEach(function (p) { (forms[p.formulation] = forms[p.formulation] || []).push(pharmName(p.pharmacy)); });
  Object.keys(forms).forEach(function (f) {
    h += '<p class="fine">' + esc2(f) +
         (Object.keys(forms).length > 1 ? ' — ' + esc2(forms[f].join(', ')) : '') + '</p>';
  });

  var shared = group.every(function (p) { return clinicalSignature(p) === clinicalSignature(lead); });

  if (shared) {
    if (lead.warn) h += '<div class="gate"><p>' + esc2(lead.warn) + '</p></div>';
    if (lead.warnAmber) h += '<div class="callout warn"><p>' + esc2(lead.warnAmber) + '</p></div>';
    if (lead.note) h += '<p>' + esc2(lead.note) + '</p>';
    if (lead.monitor && lead.monitor.length) h += '<h4>Monitoring</h4>' + bullets(lead.monitor);
  }

  group.forEach(function (p) {
    /* Pharmacy name is the block header now, so no separate h4. */
    h += tebraRows(p);
    if (!shared) {
      if (p.warn) h += '<div class="gate"><p>' + esc2(p.warn) + '</p></div>';
      if (p.warnAmber) h += '<div class="callout warn"><p>' + esc2(p.warnAmber) + '</p></div>';
      if (p.note) h += '<p>' + esc2(p.note) + '</p>';
      if (p.monitor && p.monitor.length) h += '<h4>Monitoring</h4>' + bullets(p.monitor);
    }
  });

  h += '</div>';
  return h;
}

function sectionProducts(sec) {
  var inGroup = (D.products || []).filter(function (p) { return p.group === sec.group; });

  inGroup.sort(function (a, b) {
    if (a.name === b.name) return a.pharmacy < b.pharmacy ? -1 : 1;
    return a.name < b.name ? -1 : 1;
  });

  /* Collapse to one block per clinical entity, keeping the order above. */
  var order = [], byName = {};
  inGroup.forEach(function (p) {
    if (!byName[p.name]) { byName[p.name] = []; order.push(p.name); }
    byName[p.name].push(p);
  });

  var h = '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body);
  h += productSummary(inGroup);
  (sec.callouts || []).forEach(function (c) { h += callout(c); });
  /* No "Prescribing detail" lead-in. It was an h3 at 15px sitting above product
     headings at 19px - a parent outranked by its own children, the same shape as
     the h4-above-h3 inversion fixed earlier the same day. Removed rather than
     promoted because it said nothing: a product name followed by a navy
     "Compounded Drug Favorite Entry" header already tells a provider exactly
     what they are looking at. Don, 2026-09-15: if something is redundant, get
     rid of it. Deleting a rung beats renaming one. */
  h += order.map(function (n) { return productBlock(byName[n]); }).join('');

  var pending = inGroup.filter(function (p) { return p.needsSignoff; }).length;
  if (pending) {
    h += '<p class="fine">' + pending + ' of ' + inGroup.length +
         ' formulation strings in this section were carried forward from the prior documentation and were approved when those programs launched. They will be reviewed as each program is re-evaluated.</p>';
  }
  return h + decider(sec.decider);
}

/* Callouts, optionally as warnings. `.callout.warn` is already in the shared
   stylesheet - orange border and ground - and it is what a provider's eye stops
   on. Used sparingly: on a page where everything is highlighted, nothing is.
   Fertility is the first TRT section to claim it, at Don's direction on
   2026-09-16: testosterone suppresses spermatogenesis, and the patients most
   likely to be harmed by missing that are the young ones who came in for energy
   and have not thought about children yet. */
function calloutsFor(sec) {
  var cls = sec.warn ? 'callout warn' : 'callout';
  return (sec.callouts || []).map(function (c) {
    return '<div class="' + cls + '"><p>' + esc2(c) + '</p></div>';
  }).join('');
}

function sectionBullets(sec) {
  /* Callouts here too. Three of the TRT safety sections carry one and they were
     silently dropped - a bullets section rendered its list and threw the
     callout away, which on "Stopping therapy" would have lost the documented
     refusal rule. Caught by counting callouts in the rendered page against
     callouts in the data. */
  return '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body) +
    bullets(sec.bullets) +
    calloutsFor(sec) +
    decider(sec.decider);
}

/* A plain table from the data: column headings, rows, and an optional column
   whose cells get a Copy button. Written once because four TRT sections need it
   - pricing, the dose ladder, the lab panel and the titration thresholds - and
   Women's Health will need the same. A `render: "table"` section with no rows
   throws rather than printing an empty frame; a heading over nothing reads as
   "there is nothing to say here", which is the opposite of the truth when the
   real cause is a data path that moved. */
function sectionTable(sec) {
  if (!sec.rows || !sec.rows.length) {
    throw new Error('clinical-doc-render: section "' + sec.id + '" is render:table with no rows.');
  }
  var copyCol = sec.copyColumn === undefined ? -1 : sec.copyColumn;
  var head = '<tr>' + (sec.columns || []).map(function (c) {
    return '<th>' + esc2(c) + '</th>';
  }).join('') + '</tr>';
  var body = sec.rows.map(function (r) {
    return '<tr>' + r.map(function (cell, i) {
      var v = esc2(cell);
      if (i === copyCol && cell) {
        v = '<span class="cp" data-copy="' + esc2(cell) + '">' + esc2(cell) +
            '<button class="copybtn" type="button" aria-label="Copy">Copy</button></span>';
      }
      return '<td>' + v + '</td>';
    }).join('') + '</tr>';
  }).join('');
  return '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body) +
    '<table class="datatbl"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>' +
    calloutsFor(sec);
}

/* TRT prescribing blocks, grouped by pharmacy. Every dose and route pair is a
   separate Tebra favorite because the Name encodes both, so each gets its own
   complete block - Don's rule for the compounded programs, and it holds here
   for the same reason: a provider copies a whole block into Tebra, and a
   factored one cannot be copied.

   entryKind:'standard' and select:true on the Drug row are the whole point.
   Testosterone cypionate is COMMERCIAL, dispensed by a compounding pharmacy,
   and the block must not call itself a Compounded Drug Favorite or offer a copy
   button on a value that has to be chosen from Tebra's own list. */
function sectionTrtPrescribing(sec) {
  var T = D, out = '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body);
  var phKey = sec.pharmacy;
  var ph = PH.pharmacies[phKey];
  var states = PH.statesFor(phKey, 'trt');
  if (!states.length) {
    throw new Error('clinical-doc-render: ' + phKey + ' fills TRT in no state, so section "' +
      sec.id + '" would print prescriptions nobody can send.');
  }

  if (sec.warnBefore) {
    out += '<div class="callout warn"><p>' + esc2(sec.warnBefore) + '</p></div>';
  }
  out += '<div class="callout"><p><strong>' + esc2(ph.name) + '</strong> &middot; ' +
    states.map(function (st) { return esc2(PH.stateName(st) + ' (' + st + ')'); }).join(', ') +
    '. ' + esc2(T.prescribers.warning) + ' In ' +
    states.map(function (st) { return esc2(PH.stateName(st)) + ': <strong>' +
      esc2(T.prescribers[st]) + '</strong>'; }).join('; ') + '.</p></div>';

  T.weeklyDosesMg.forEach(function (w) {
    Object.keys(T.routes).forEach(function (rk) {
      var c = T.calc(w, rk);
      var fields = [
        { field: 'Drug', val: T.product.drug, copy: false, select: true },
        { field: 'Name', val: T.favoriteName(w, rk, phKey), copy: true },
        { field: 'Allow Substitution', val: 'Yes - select Allow Substitution', copy: false },
        { field: 'Quantity', val: T.tebra.quantity, copy: true },
        { field: 'Unit', val: T.tebra.unit, copy: true },
        { field: 'Refill', val: T.tebra.refill, copy: true },
        { field: 'Days Supply', val: String(c.rxDays), copy: true },
        { field: 'Patient Instructions', val: T.ptInstructions(w, rk), copy: true },
        { field: 'Pharmacy Instructions', val: T.pharmacyNotes(w, rk, phKey, PH), copy: true }
      ];
      out += '<div class="rxblock">' + RXB.block({
        pharmacy: ph.name,
        entryKind: 'standard',
        label: w + ' mg/week - ' + T.routes[rk].label,
        tag: c.rxDays + '-day supply',
        fields: fields,
        accent: RXB.accentFor(phKey)
      }) + '</div>';
    });
  });
  return out;
}

function renderSection(sec) {
  if (sec.render === 'table') return sectionTable(sec);
  if (sec.render === 'trtPrescribing') return sectionTrtPrescribing(sec);
  if (sec.render === 'matrix') return sectionMatrix(sec);
  if (sec.render === 'pharmacyTable') return sectionPharmacyTable(sec);
  if (sec.render === 'productDetail') return sectionProducts(sec);
  if (sec.render === 'bullets') return sectionBullets(sec);
  return '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body) + decider(sec.decider);
}

/* ── PAGE ─────────────────────────────────────────────────────────────────── */
function renderBody(data, pharmacies, doc) {
  D = data;
  PH = pharmacies;
  var dd = D.document;

  var h = '';
  /* The shared stylesheet keeps a whole .rxblock on one page, which is right
     for the FH&L documents where a block is short. Here a section can hold
     twelve of them and the rule strands half a page of whitespace before each
     one that will not fit. Rows still stay whole, and the heading still stays
     with what follows it, so nothing lands orphaned. */
  h += '<style>.rxblock{break-inside:auto;}' +
       /* Generic data table. Same surface treatment as a prescribing block -
          white cell ground against the cream page, full-row zebra, a divider
          after the first column - so the two read as one system. */
       '.datatbl{width:100%;border-collapse:collapse;font-size:12px;margin:10px 0 4px;' +
       'background:#fff;border:1px solid #D7DCE8;}' +
       '.datatbl th{background:#21275B;color:#fff;text-align:left;font-weight:700;' +
       'font-size:11px;letter-spacing:.02em;padding:7px 12px;}' +
       '.datatbl td{padding:6px 12px;vertical-align:top;border-top:1px solid #E7EBF3;}' +
       '.datatbl tbody tr:nth-child(even){background:#EDF1F8;}' +
       '.datatbl th+th,.datatbl td+td{border-left:1px solid #D7DCE8;}' +
       '.datatbl td:first-child{font-weight:600;color:#21275B;}' +
       '@media print{.datatbl{break-inside:auto;} .datatbl tr{break-inside:avoid;}}' +
       /* Copy buttons are a screen affordance. They must not appear in the
          PDF, where they would print as stray words inside a table cell. */
       /* No .copybtn rules here. korb-rx-block.js owns them, and this file's
          copy redeclared the button WITHOUT float:right while loading after it,
          so every button on this document sat inline against the text instead of
          on the right margin. One button style, one owner. */
       '.rxblock h3{break-after:avoid;}' +
       '.rxblock h3+.fine{break-after:avoid;}' +
       '</style>';
  h += '<div class="titleband"><h1>' + esc2(dd.title) + '</h1>' +
       '<p class="sub">' + esc2(dd.subtitle) + ' · ' + esc2(dd.kicker) + '</p></div>';

  /* ST-1: the standard requires a version and an effective date in the header.
     None of the three references carried either, and all three explicitly
     supersede prior documents, which cannot be relied on without a version to
     cite. */
  h += '<p class="byline">' + esc2(dd.entity) + ' · ' + esc2(dd.title) + ' v' + esc2(dd.version) +
       ' · effective ' + esc2(dd.effective) +
       ' · ' + esc2(doc.stamp || 'live — reflects the data files as of this page load') + '</p>';

  h += '<div class="lede">' + esc2(dd.intro) + '</div>';

  if (dd.supersedes) {
    h += '<p class="fine"><strong>Supersedes.</strong> ' + esc2(dd.supersedes) + '</p>';
  }

  (dd.sections || []).forEach(function (sec) { h += renderSection(sec); });

  h += '<div class="foot">' +
    '<div><h4>Questions and escalation</h4><ul>' +
    '<li>Pharmacy or shipping issues — Operations</li>' +
    '<li>Charge codes and billing — Clinical Operations</li>' +
    '<li>Clinical protocol questions — Clinical Operations</li>' +
    '<li>Corrections to this document — Clinical Operations</li></ul>' +
    '<p class="fine">Route everything through Clinical Operations. Do not contact the ' +
    'clinical sign-off physician directly; Clinical Operations escalates when it needs to.</p></div>' +
    '<div><h4>Do not improvise</h4><ul>' +
    '<li>Do not alter quantity, refill or days supply</li>' +
    '<li>Do not paraphrase patient instructions</li>' +
    '<li>Do not cross a gender-specific product</li>' +
    '<li>Do not quote pricing to a patient without confirming with Operations</li></ul></div>' +
    '</div>';

  /* ST-4: one required line, rendered one way. The set previously carried
     three variants of it across the PDFs and the tools. */
  h += '<p class="meta">For KORB internal and provider use only. Do not distribute to patients. ' +
       'Clinical care is delivered by ' + esc2(dd.entity) + ' and its licensed providers. ' +
       'KORB Health Group LLC is a management services organisation and does not practise medicine.</p>';

  return h;
}

/* Browser entry point. The shell calls this once the scripts have loaded. */
function mount(docId, data, pharmacies) {
  var doc = DOCS.filter(function (d) { return d.id === docId; })[0];
  if (!doc) { document.body.innerHTML = '<p>Unknown document: ' + esc2(docId) + '</p>'; return; }
  document.title = data.document.title + ' — KORB Provider Reference';
  document.body.innerHTML = renderBody(data, pharmacies, doc);
}

return {
  DOCS: DOCS,
  esc: esc,
  renderBody: renderBody,
  mount: mount,
  CSS: CSS,
  LOGO_URI: LOGO_URI
};
}));
