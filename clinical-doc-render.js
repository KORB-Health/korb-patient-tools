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
  { id: 'addons', global: 'KORB_ADDONS', file: 'KORB_AddOn_Clinical_Reference', title: 'Add-On Clinical Reference' }
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
  if (!d) return '';
  return '<div class="callout"><h3>Open, and who decides</h3>' +
    '<p>' + esc2(d.question) + '</p>' +
    '<p class="fine">Decision sits with ' + esc2(d.owner) +
    (d.inherited ? '. Carried forward from the prior protocols, so it is an inherited decision rather than one the current clinical director has reviewed.' : '.') +
    '</p></div>';
}

/* ── PHARMACY, READ FROM THE SHARED LAYER ─────────────────────────────────
   Never typed. `shipsToNote` is the pharmacy's own sentence about its
   footprint, so a pharmacy change reaches this document with no edit here. */
function pharmacyRows(keys) {
  return (keys || []).map(function (k) {
    var p = PH && PH.pharmacies ? PH.pharmacies[k] : null;
    if (!p) return '';
    var sources = (D.document.pharmacySources || {})[k] || '';
    var footprint = p.shipsToNote || ((p.shipsTo || []).length + ' states');
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
  h += '<p class="fine">Footprints are read from korb-pharmacies.js v' +
       esc2(PH && PH.meta ? PH.meta.version : '?') +
       ' at render time. They are not restated in this document, so a pharmacy change reaches this page without an edit.</p>';
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
  return kvTable([
    /* SURESCRIPTS CHANGE. Tebra used to need a commercial drop-down entry to
       hang a prescription off, so these records carried things like "Viagra
       50 mg tablet (from drop-down)". Tebra now takes a genuine custom
       compounded drug, and drugFormulation is that string. It is the field a
       provider types first and the one the old document never printed. */
    p.drugFormulation ? ['Tebra drug — custom compound', copyCell(p.drugFormulation)] : null,
    t.name ? ['Favorite name', copyCell(t.name)] : null,
    t.sig ? ['Sig', copyCell(t.sig)] : null,
    (t.quantity != null) ? ['Quantity', copyCell(t.quantity) + (t.unit ? ' ' + esc2(t.unit) : '')] : null,
    (t.refill != null) ? ['Refill', esc2(t.refill)] : null,
    (t.days != null) ? ['Days supply', esc2(t.days)] : null,
    t.reasonForCompounding ? ['Reason for compounding', copyCell(t.reasonForCompounding)] : null,
    t.pharmacyNotes ? ['Pharmacy notes', copyCell(t.pharmacyNotes)] : null,
    /* Kept visible but marked, so anyone holding an order placed before the
       change can still reconcile what it was written against. */
    p.retiredDropdownEntry ? ['Retired drop-down entry', '<span class="fine">' + esc2(p.retiredDropdownEntry) +
      ' — no longer used. Superseded by the custom compound above.</span>'] : null
  ]);
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
      '<td>' + esc2(p.supply) + '</td>' +
      '<td>' + esc2(p.price) + (p.chargeCode ? '<br><span class="fine">' + esc2(p.chargeCode) + '</span>'
                                             : '<br><span class="fine">no code on record</span>') + '</td></tr>';
  }).join('');
  return '<table class="grid"><thead><tr><th>Product</th><th>Pharmacy</th><th>Who</th><th>Dosing</th>' +
         '<th>Supply</th><th>Price</th></tr></thead><tbody>' + rows + '</tbody></table>';
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
  var h = '<div class="rxblock"><h3>' + esc2(lead.name) + '</h3>';

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
    h += '<h4>' + esc2(pharmName(p.pharmacy)) + '</h4>';
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
  h += '<h3 class="rxlead">Prescribing detail</h3>';
  h += order.map(function (n) { return productBlock(byName[n]); }).join('');

  var pending = inGroup.filter(function (p) { return p.needsSignoff; }).length;
  if (pending) {
    h += '<p class="fine">' + pending + ' of ' + inGroup.length +
         ' formulation strings in this section were promoted from the prior tool rather than re-derived from Tebra, and are awaiting sign-off from ' +
         esc2(D.meta.signoff.clinical) + '.</p>';
  }
  return h + decider(sec.decider);
}

function sectionBullets(sec) {
  return '<h2>' + esc2(sec.heading) + '</h2>' + paras(sec.body) +
    bullets(sec.bullets) + decider(sec.decider);
}

function renderSection(sec) {
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
       /* Copy buttons are a screen affordance. They must not appear in the
          PDF, where they would print as stray words inside a table cell. */
       '.copybtn{display:none;}' +
       '@media screen{.cp{display:inline-flex;align-items:baseline;gap:6px;}' +
       '.copybtn{display:inline-block;font-family:inherit;font-size:10px;font-weight:700;' +
       'letter-spacing:.04em;text-transform:uppercase;color:#0F5F69;background:#E8F6F8;' +
       'border:1px solid #B9E2E8;border-radius:4px;padding:1px 6px;cursor:pointer;}' +
       '.copybtn:hover{background:#D3EDF1;}' +
       '.copybtn.ok{background:#1B6349;border-color:#1B6349;color:#fff;}}' +
       '.rxblock h3{break-after:avoid;}' +
       '.rxblock h3+.fine{break-after:avoid;}' +
       'h3.rxlead{margin-top:16pt;break-after:avoid;}' +
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
  if (dd.inheritedDecisions) {
    h += '<div class="callout"><h3>Whose decision is whose</h3><p>' + esc2(dd.inheritedDecisions) + '</p></div>';
  }

  (dd.sections || []).forEach(function (sec) { h += renderSection(sec); });

  h += '<div class="foot">' +
    '<div><h4>Questions and escalation</h4><ul>' +
    '<li>Pharmacy or shipping issues — Operations</li>' +
    '<li>Charge codes and billing — Nick, VP Finance</li>' +
    '<li>Clinical protocol questions — ' + esc2(D.meta.signoff.clinical) + '</li>' +
    '<li>Corrections to this document — Clinical Operations</li></ul></div>' +
    '<div><h4>Do not improvise</h4><ul>' +
    '<li>Do not alter quantity, refill or days supply</li>' +
    '<li>Do not paraphrase patient instructions</li>' +
    '<li>Do not cross a sex-specific product</li>' +
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
