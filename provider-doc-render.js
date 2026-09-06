/* ============================================================================
   KORB HEALTH — PROVIDER REFERENCE RENDERER

   ONE renderer, TWO consumers:
     build-provider-docs.js  requires this and renders to PDF (a fixed snapshot)
     each *.html shell       loads this in the browser and renders live

   Live means the page reads korb-glp1-data.js at request time. Change the data
   file and all eleven documents change on the next load - no rebuild, no
   re-upload, and no way for the documents to disagree with the provider tool.
   That disagreement is what this whole rebuild existed to fix, so the fix
   should not depend on somebody remembering to run a build.

   DO NOT EDIT A GENERATED DOCUMENT. Edit korb-glp1-data.js, or edit this
   renderer. A hand-edit to a generated file is overwritten by the next build
   and silently reintroduces the drift.
   ============================================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.KORB_DOCS = factory();
}(typeof self !== 'undefined' ? self : this, function () {

/* The data file, bound by renderBody()/mount() before any section runs.
   Section functions read it as K, which is how they were written when this
   renderer lived inside the builder. */
var K = null;

const CSS = `  @page { size: Letter; margin: 0.95in 0.6in 0.75in; }
  /* --------------------------------------------------------------------
     KORB house style, matched to the Functional Health & Longevity provider
     references so the whole provider library reads as one set: navy filled
     section bars, a cream stamp bar under the title, navy table headers with
     zebra rows, and callouts that are colour-coded by what they are telling
     you rather than all looking the same.

     Colours are the brand values - navy #21275B, teal #00B2C3, cream #ECE9D1,
     orange #FBB040 - not the near-miss shades (#1E2D5B / #00B4C8) that some of
     the older HTML tools drifted onto.

     Print-first. Screen rules live in the document shell, not here.
     -------------------------------------------------------------------- */
  :root{--navy:#21275B;--teal:#00B2C3;--cream:#ECE9D1;--orange:#FBB040;
        --ink:#1A1D33;--ink2:#4A4F6B;--ink3:#767B94;
        --rule:#D5D5CC;--panel:#F5F5F1;--zebra:#F7F7F4;
        --info:#E8F6F8;--warnbg:#FDF4E3;--okbg:#EEF5F1;--ok:#1B6349;
        --stop:#A32A20;--stopbg:#FBEDEC;}
  *{box-sizing:border-box;}
  body{margin:0;font-family:"Source Serif 4",Georgia,serif;font-size:10.2pt;
       line-height:1.5;color:var(--ink);}

  /* Title band. Navy fill, white title, teal subtitle - the FH&L opener. */
  .titleband{background:var(--navy);padding:16pt 18pt 15pt;break-inside:avoid;}
  h1{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:23pt;margin:0;
     color:#fff;letter-spacing:-.01em;line-height:1.1;}
  .titleband .sub{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:11pt;
     color:var(--teal);margin:4pt 0 0;font-weight:600;}

  /* Stamp bar. Cream, centred, monospace - what built this and when. */
  .byline{font-family:"IBM Plex Mono",monospace;font-size:8pt;color:var(--ink2);
          background:var(--cream);margin:0;padding:6pt 10pt;text-align:center;}

  /* Opening note, teal-framed. */
  .lede{background:var(--info);border:1pt solid var(--teal);color:var(--ink);
        padding:9pt 12pt;margin:12pt 0 4pt;font-style:italic;break-inside:avoid;}

  /* Section bars. */
  h2{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:12.5pt;color:#fff;
     background:var(--navy);margin:18pt 0 8pt;padding:7pt 12pt;
     break-after:avoid;break-inside:avoid;font-weight:600;}
  h3{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:10.5pt;
     margin:13pt 0 5pt;color:var(--navy);break-after:avoid;font-weight:700;}
  h3.prod{background:var(--navy);color:#fff;padding:6pt 10pt;margin-top:16pt;font-size:10.5pt;}
  h3.prod .via{float:right;font-weight:400;font-size:8.4pt;opacity:.8;}
  h4{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:9.8pt;
     margin:11pt 0 4pt;color:var(--navy);break-after:avoid;font-weight:700;}

  /* Tables. Navy header rows, zebra body, hairline rules. */
  /* Tables may break across pages; individual ROWS may not. Keeping whole
     tables intact left a third of several pages blank whenever the next table
     did not fit, which on an 11-page document is pages of nothing. A split row
     is the thing that actually misleads a reader, so that is what is forbidden. */
  table{border-collapse:collapse;width:100%;margin:5pt 0 9pt;}
  tr{break-inside:avoid;}
  /* A dose heading and its Tebra fields are one unit. */
  .rxblock{break-inside:avoid;}
  thead{display:table-header-group;}
  .kv th{width:31%;text-align:left;background:#fff;color:var(--navy);font-weight:700;
         font-family:Archivo,Helvetica,Arial,sans-serif;font-size:8.6pt;vertical-align:top;}
  .kv th,.kv td{border:0.6pt solid var(--rule);padding:5pt 8pt;vertical-align:top;}
  .kv tr:nth-child(even) th{background:var(--zebra);}
  .kv tr:nth-child(even) td{background:var(--zebra);}
  .rx td{font-family:"IBM Plex Mono",monospace;font-size:8.4pt;}
  .grid th{background:var(--navy);color:#fff;font-family:Archivo,Helvetica,Arial,sans-serif;
           font-size:8.2pt;text-align:left;padding:5pt 8pt;font-weight:600;
           border:0.6pt solid var(--navy);}
  .grid td{border:0.6pt solid var(--rule);padding:5pt 8pt;font-size:9pt;}
  .grid tr:nth-child(even) td{background:var(--zebra);}

  ul{margin:4pt 0 9pt;padding-left:14pt;} li{margin-bottom:3pt;}

  /* Callouts carry meaning in their colour: teal informs, amber warns,
     green confirms, red stops. Previously they were all the same panel with a
     different edge, which made a warning look like a footnote. */
  .callout{border:1pt solid var(--teal);border-left:3.5pt solid var(--teal);
           background:var(--info);padding:8pt 11pt;margin:9pt 0;break-inside:avoid;}
  .callout.warn{border-color:var(--orange);border-left-color:var(--orange);background:var(--warnbg);}
  .callout.ok{border-color:var(--ok);border-left-color:var(--ok);background:var(--okbg);}
  .callout.ok h3{color:var(--ok);}
  .callout h3{margin:0 0 3pt;font-size:9.8pt;color:var(--navy);}
  .callout p{margin:0 0 4pt;font-size:9.2pt;} .callout p:last-child{margin-bottom:0;}

  .gate{border:1.5pt solid var(--stop);border-left:4pt solid var(--stop);
        background:var(--stopbg);padding:10pt 13pt;margin:12pt 0;break-inside:avoid;}
  .gate h3{margin:0 0 5pt;color:var(--stop);font-size:10.5pt;}
  .gate p{margin:0 0 5pt;font-size:9.2pt;} .gate-q{color:var(--ink2);}

  .meta{font-family:"IBM Plex Mono",monospace;font-size:7.6pt;color:var(--ink3);}
  .fine{font-size:8.6pt;color:var(--ink2);margin:4pt 0;}
  .sublabel{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:8.6pt;color:var(--ink3);
            text-transform:uppercase;letter-spacing:.06em;margin:7pt 0 2pt;}
  .attest{background:var(--panel);border-left:3.5pt solid var(--navy);padding:8pt 11pt;font-style:italic;}
  code{font-family:"IBM Plex Mono",monospace;font-size:8.6pt;background:var(--panel);
       padding:1pt 3pt;border:0.5pt solid var(--rule);}
  .foot{margin-top:22pt;border-top:2pt solid var(--teal);padding-top:9pt;
        font-size:8.4pt;color:var(--ink2);display:flex;gap:26pt;break-inside:avoid;}
  .foot h4{margin:0 0 3pt;}
  .foot ul{margin:0;padding-left:12pt;}`;

/* The KORB lockup, embedded so the PDF header needs no network and no file
   beside it. Downsampled to 300px wide and colour-reduced: 4 KB, which is
   nothing against a 200 KB document, and it prints crisply at 0.55in. */
const LOGO_URI = 'data:image/png;base64,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';

/* ── THE ELEVEN DOCUMENTS ────────────────────────────────────────────────
   Each names the products it covers. A document may bundle an injectable and
   its oral counterpart for the same pharmacy and drug - that is why the
   Premier tirzepatide document contains the oral dots, and why an exclusivity
   flag on those dots must not be read as a statement about the document. */
const DOCS = [
  { id: 'belmar_sema',      file: 'KORB_GLP1_Belmar_Semaglutide_Reference',        title: 'Belmar — Semaglutide',                products: ['belmar_sema', 'belmar_oral_sema'] },
  { id: 'belmar_tirz',      file: 'KORB_GLP1_Belmar_Tirzepatide_Reference',        title: 'Belmar — Tirzepatide',                products: ['belmar_tirz'] },
  { id: 'premier_sema',     file: 'KORB_GLP1_Premier_Semaglutide_Reference',       title: 'Premier — Semaglutide',               products: ['premier_sema', 'premier_oral_sema'] },
  { id: 'premier_glycine',  file: 'KORB_GLP1_Premier_Semaglutide_Glycine_Reference', title: 'Premier — Semaglutide with Glycine', products: ['premier_sema_glycine'] },
  { id: 'premier_tirz',     file: 'KORB_GLP1_Premier_Tirzepatide_Reference',       title: 'Premier — Tirzepatide',               products: ['premier_tirz', 'premier_oral_tirz'] },
  { id: 'farmakeio_sema',   file: 'KORB_GLP1_Farmakeio_Semaglutide_Reference',     title: 'Farmakeio — Semaglutide',             products: ['farmakeio_sema', 'farmakeio_oral_sema'] },
  { id: 'farmakeio_tirz',   file: 'KORB_GLP1_Farmakeio_Tirzepatide_Reference',     title: 'Farmakeio — Tirzepatide',             products: ['farmakeio_tirz'] },
  { id: 'greenwich_tirz',   file: 'KORB_GLP1_Greenwich_Tirzepatide_Reference',     title: 'Greenwich — Tirzepatide',             products: ['greenwich_tirz'] },
  { id: 'zepbound',         file: 'KORB_GLP1_Brand_Zepbound_Reference',            title: 'Zepbound — brand tirzepatide',        products: ['zepbound'],  brand: true },
  { id: 'wegovy',           file: 'KORB_GLP1_Brand_Wegovy_Reference',              title: 'Wegovy — brand semaglutide',          products: ['wegovy_pen', 'wegovy_pill'], brand: true },
  { id: 'foundayo',         file: 'KORB_GLP1_Brand_Foundayo_Reference',            title: 'Foundayo — brand orforglipron',       products: ['foundayo'],  brand: true }
];

/* ── ESCAPING ────────────────────────────────────────────────────────────
   Every string reaching the page goes through here. The old builder did not
   escape, which is how the Greenwich document came to print "FH&L;". */
function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const rows = pairs => pairs.filter(Boolean)
  .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
const bullets = list => `<ul>${(list || []).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;

/* ── SECTIONS ────────────────────────────────────────────────────────────── */

function sectionGate(doc) {
  /* High-severity open items render on the face of the document, because an item
     that blocks distribution should be visible to whoever picks the document up.

     But only the ones that ACTUALLY apply. An item carrying appliesTo names the
     products or monograph fields it concerns, and renders only on documents that
     match; an item with no appliesTo concerns everything and renders everywhere.

     This filter exists because the first version did not have it. The moment a
     semaglutide-specific open item was added it appeared on the tirzepatide and
     orforglipron documents too - the exact cross-molecule leak this whole rebuild
     was undertaken to fix, reproduced in the gate that was meant to warn about it. */
  const p0 = K.getProduct(doc.products[0]);
  const drug = p0 ? p0.drug : null;

  const relevant = (K.needsConfirmation || []).filter(f => {
    if (f.severity !== 'high') return false;
    const scope = f.appliesTo;
    if (!scope || !scope.length) return true;          // applies to everything
    return scope.some(t =>
      doc.products.indexOf(t) !== -1 ||                 // names a product in this doc
      (drug && t.indexOf('monographs.' + drug) === 0)   // names this molecule
    );
  });
  /* The clinical sign-off is no longer a needsConfirmation row. It is a state
     computed from the monograph itself, so it cannot be cleared by deleting a
     line in a list, and it re-asserts itself automatically if the monograph is
     edited after signing. Three states, three different renders. */
  const so = drug && K.signoffStatus ? K.signoffStatus(drug) : null;
  let signoffHtml = '';
  if (so && so.state !== 'current') {
    signoffHtml = `<p><strong>Clinical sign-off — ${esc(so.headline)}</strong></p>
      <p class="gate-q">${esc(so.detail)}
      <em>Owner: Director of Clinical Operations.</em></p>`;
  }

  if (!relevant.length && !signoffHtml) return '';

  return `<div class="gate">
    <h3>Not cleared for distribution</h3>
    ${signoffHtml}
    ${relevant.map(g => `<p><strong>${esc(g.id)}</strong> — ${esc(g.issue)}</p>
      <p class="gate-q">${esc(g.question)} <em>Owner: ${esc(g.owner)}.</em></p>`).join('')}
  </div>`;
}

/* A signed monograph gets an attribution line instead of a gate. It renders at
   the foot of the clinical section rather than the top of the document, because
   a cleared document should not open with a banner about its own paperwork. */
function signoffLine(doc) {
  const p0 = K.getProduct(doc.products[0]);
  const drug = p0 ? p0.drug : null;
  if (!drug || !K.signoffStatus) return '';
  const so = K.signoffStatus(drug);
  if (so.state !== 'current') return '';
  return `<div class="callout ok"><h3>${esc(so.headline)}</h3>
    <p>${esc(so.detail)}</p>
    <p class="fine">Monograph fingerprint ${esc(so.fingerprint)}. This document
    re-checks the fingerprint every time it is opened: if the monograph is edited
    after sign-off, this line is replaced by a notice that the sign-off no longer
    covers the text.</p></div>`;
}

function sectionGlance(doc, ph) {
  if (doc.brand) {
    const b = K.pricing.brandName;
    return `<h2>At a glance</h2><table class="kv">${rows([
      ['Type', 'Brand product — dispensed by the manufacturer, not compounded by KORB'],
      ['Fulfilment', esc(b.appliesTo)],
      ['Order via', 'Tebra standard prescription'],
      ['Visit fee', '$' + b.prescriptionVisitFee + ' · ' + b.billingCode],
      ['Medication pricing', 'Not held by KORB — see below']
    ])}</table>`;
  }
  return `<h2>${esc(ph.name)} at a glance</h2><table class="kv">${rows([
    ['Status', ph.status === 'active' ? 'Active' : esc(ph.status)],
    ['Preferred states', (ph.preferredStates || []).join(', ') || '—'],
    ['Ships to', (ph.shipsTo || []).join(', ')],
    ['CANNOT ship to', (ph.hardExcludes || []).length ? ph.hardExcludes.join(', ') : 'No hard exclusions'],
    ['Order via', ph.orderVia],
    ['Billing', ph.billing],
    ['Dispensing address', ph.address],
    ph.bud ? ['BUD', ph.bud] : null
  ])}</table>`;
}

function sectionCallouts(doc, ph) {
  if (doc.brand || !ph) return '';
  let h = '';
  if (ph.addressWarning) h += `<div class="callout warn"><h3>Check the address before sending</h3><p>${esc(ph.addressWarning)}</p></div>`;
  if (ph.discouragedOutsidePreferred && ph.discouragedReason) {
    h += `<div class="callout"><h3>Discouraged outside ${esc((ph.preferredStates || []).join(', '))}</h3><p>${esc(ph.discouragedReason)}</p></div>`;
  }
  if (ph.status === 'legacy-continuity') {
    h += `<div class="callout warn"><h3>Legacy continuity only</h3><p>${esc(ph.statusNote || 'No new starts.')}</p></div>`;
  }
  return h;
}

function sectionLimitations(doc) {
  /* Accepted limitations are decided problems that shipped anyway, and the
     mitigation is usually something the provider has to say out loud. They
     belong on the document, not only in the data file. */
  const keys = doc.products;
  const items = (K.acceptedLimitations || []).filter(a =>
    (a.appliesTo || []).some(k => keys.indexOf(k) !== -1));
  if (!items.length) return '';
  return items.map(a => `<div class="callout warn">
    <h3>Known limitation${a.doses ? ' — ' + esc(a.doses.join(', ')) : ''}</h3>
    <p>${esc(a.issue)}</p>
    ${a.mitigation ? `<p><strong>Mitigation.</strong> ${esc(a.mitigation)}</p>` : ''}
    ${a.residualRisk ? `<p><strong>What this still leaves.</strong> ${esc(a.residualRisk)}</p>` : ''}
    ${a.opsNote ? `<p><strong>For Operations.</strong> ${esc(a.opsNote)}</p>` : ''}
    <p class="meta">Accepted by ${esc(a.decidedBy)} on ${esc(a.decidedOn)} · ${esc(a.id)}</p>
  </div>`).join('');
}

function sectionPreparation(doc) {
  /* Heading AND body from the same resolved block. Taking them from different
     places is what put a "Compounded preparation" heading over Foundayo's
     not-compounded text. */
  const prep = K.preparationFor(doc.products[0]);
  if (!prep) return '';
  return `<div class="callout"><h3>${esc(prep.heading)}</h3><p>${esc(prep.note)}</p></div>`;
}

function sectionNotes(ph) {
  if (!ph || !(ph.notes || []).length) return '';
  return `<h2>Before you prescribe</h2>${bullets(ph.notes)}`;
}

function sectionRx(doc) {
  /* The Tebra fields, literally - a provider copies these.

     Field-presence driven rather than a fixed list, because the record shapes
     genuinely differ. A compounded record carries drugFormulation, name, unit,
     reasonForCompounding and pharmacyNotes; a brand record carries drug, label
     and nothing else, because it goes through Tebra Standard rather than Tebra
     Compound and there is no compounding to describe. Assuming one shape
     printed "undefined" across all three brand documents.

     Fields identical on every record of a product are factored into a "same for
     every dose" block; the per-dose tables carry only what changes. Repeating
     the constant fields on twelve records added two pages and nothing a
     provider reads twice. */
  const FIELDS = [
    ['Drug',                    r => r.drug],
    ['Drug Formulation',        (r, d, p) => r.drugFormulation || d.drugFormulation || (r.name ? p.formulation : undefined)],
    ['Name',                    r => r.name || r.label],
    ['Allow Substitution',      r => r.allowSubstitution === undefined ? undefined : (r.allowSubstitution ? 'Yes — select Allow Substitution' : 'No')],
    ['Quantity',                r => r.quantity],
    ['Unit',                    r => r.unit],
    ['Refill',                  r => r.refill],
    ['Days Supply',             r => r.days],
    ['Patient Instructions',    r => r.ptInstructions],
    ['Reason for Compounding',  r => r.reasonForCompounding],
    ['Pharmacy Instructions',   r => r.pharmacyNotes]
  ];
  // Fields that identify a specific dose must never be factored out as constant.
  const NEVER_CONSTANT = ['Name', 'Quantity', 'Refill', 'Days Supply', 'Patient Instructions', 'Drug'];

  /* Brand documents get the program table BEFORE the Tebra fields. Without it a
     provider meets a line labelled "12-week" carrying days supply 28 and two
     refills with nothing on the page explaining why that is right. The dispensing
     list was previously data the renderer never showed at all. */
  let h = '';
  if (doc.brand) {
    const b = K.pricing.brandName;
    let anyInjectable = false, anyOral = false;
    let tbl = '';
    doc.products.forEach(key => {
      const p = K.getProduct(key);
      if (!p || !p.dispensing) return;
      if (p.route === 'oral') anyOral = true; else anyInjectable = true;
      tbl += `<h4>${esc(p.label)}</h4><table class="grid"><tr>
        <th>Program</th><th>Quantity</th><th>Refill</th><th>Days supply</th><th>When to use</th></tr>` +
        p.dispensing.map(x => `<tr><td>${esc(x.label)}</td><td>${esc(x.quantity)}${x.unit ? ' ' + esc(x.unit) : ''}</td>
          <td>${esc(x.refill)}</td><td>${esc(x.days)}</td><td>${esc(x.use)}</td></tr>`).join('') +
        `</table>`;
    });
    if (tbl) {
      h += `<h2>Program options</h2>${tbl}`;
      if (anyInjectable && b.injectableSupplyRule) {
        h += `<div class="callout warn"><h3>Why the longer injectable programs carry refills</h3>
          <p>${esc(b.injectableSupplyRule)}</p></div>`;
      }
      if (anyOral && b.oralSupplyRule) {
        h += `<div class="callout"><h3>Orals dispense as one fill</h3>
          <p>${esc(b.oralSupplyRule)}</p></div>`;
      }
      if (b.controlNote) {
        h += `<div class="callout"><h3>KORB does not control brand fulfilment</h3>
          <p>${esc(b.controlNote)}</p></div>`;
      }
    }
  }

  h += `<h2>Tebra — copy these values literally</h2>
    <p class="lede">Do not paraphrase, and do not adjust quantity, refill or days supply.</p>`;

  doc.products.forEach(key => {
    const p = K.getProduct(key);
    if (!p) return;
    h += `<h3 class="prod">${esc(p.label)} <span class="via">${esc(p.orderVia || '')}</span></h3>`;
    if (p.exclusiveTo && p.exclusiveNote) {
      h += `<div class="callout"><h3>Only from ${esc(K.pharmacies[p.exclusiveTo].name)} — this product</h3><p>${esc(p.exclusiveNote)}</p></div>`;
    }

    /* Supply keys come from the product's own dispensing list, not from a
       hardcoded array. The hardcoded version was a silent-omission bug waiting
       to happen: adding a 12-week brand program meant every rx12 record simply
       did not render, with no error anywhere - the document would just quietly
       be missing a program a provider had been told to use. The compounded
       products use supply4/supply8 and carry no dispensing list, so those stay
       as a fallback. */
    const supplyKeys = (p.dispensing && p.dispensing.length)
      ? p.dispensing.map(x => x.key)
      : ['supply4', 'supply8', 'rx'];
    const recs = [];
    (p.doses || []).forEach(d => {
      supplyKeys.forEach(sk => {
        if (d[sk]) recs.push({ d, r: d[sk], sk });
      });
      /* Anything on the dose that looks like a supply record but is not in the
         dispensing list would otherwise vanish. Surface it rather than drop it. */
      Object.keys(d).forEach(k => {
        if (/^(supply\d+|rx\w*)$/.test(k) && supplyKeys.indexOf(k) === -1 &&
            d[k] && typeof d[k] === 'object' && d[k].label) {
          recs.push({ d, r: d[k], sk: k });
        }
      });
    });
    if (!recs.length) return;

    const val = (label, get, x) => {
      const v = get(x.r, x.d, p);
      return v === undefined || v === null ? undefined : String(v);
    };

    const constant = [];
    FIELDS.forEach(([label, get]) => {
      if (NEVER_CONSTANT.indexOf(label) !== -1) return;
      const vals = recs.map(x => val(label, get, x));
      if (vals.some(v => v === undefined)) return;     // absent on this shape
      const uniq = new Set(vals);
      if (uniq.size === 1) constant.push([label, [...uniq][0]]);
    });
    const constantLabels = constant.map(c => c[0]);
    if (constant.length) {
      h += `<div class="rxblock"><h4>Same for every dose</h4><table class="kv rx">${rows(constant)}</table></div>`;
    }

    /* Short headings. The dispensing list carries the full label ("8-week
       (56-day) - 4 pens + 1 refill") which belongs in the program table, not
       repeated over every dose heading. An unmapped key falls back to itself
       rather than rendering "undefined". */
    const LABEL = { supply4: '4-week', supply8: '8-week', rx: '90-day',
                    rx4: '4-week', rx8: '8-week', rx12: '12-week',
                    rx30: '30-day', rx60: '60-day', rx90: '90-day' };
    recs.forEach(x => {
      const varying = FIELDS
        .filter(([label]) => constantLabels.indexOf(label) === -1)
        .map(([label, get]) => {
          const v = val(label, get, x);
          return v === undefined ? null : [label, v];
        });
      /* Heading and its fields are ONE unit that never splits. Letting tables
         flow freely filled the pages but broke a dose block across two of them,
         so page 4 opened with Quantity and Days Supply and no dose heading -
         Tebra values with nothing saying which dose they belong to, in the one
         document whose entire purpose is copying those values correctly. */
      h += `<div class="rxblock">
        <h4>${esc(x.d.dose)}${x.d.presentation ? ' · ' + esc(x.d.presentation) : ''} — ${esc(LABEL[x.sk] || x.sk)}</h4>
        <table class="kv rx">${rows(varying)}</table></div>`;
    });
  });
  return h;
}

function sectionLadder(doc) {
  const p = K.getProduct(doc.products[0]);
  if (!p || !p.doses || !p.doses[0] || !p.doses[0].supply4) return '';
  return `<h2>Vials dispensed</h2><table class="grid">
    <thead><tr><th>Dose</th><th>Units</th><th>Concentration</th><th>4-week</th><th>8-week</th></tr></thead>
    <tbody>${p.doses.map(d => `<tr>
      <td>${esc(d.dose)}</td><td>${d.units != null ? esc(d.units) + ' units' : '—'}</td>
      <td>${esc(d.conc || p.formulation)}</td>
      <td>${esc(d.vials4 || '—')}</td><td>${esc(d.vials8 || '—')}</td></tr>`).join('')}
    </tbody></table>`;
}

function sectionPricing(doc) {
  let h = `<h2>Pricing and charge codes</h2>`;
  const seen = {};
  doc.products.forEach(key => {
    const p = K.getProduct(key);
    if (!p) return;
    (p.doses || []).forEach(d => {
      K.billingPrograms(key).forEach(prog => {
        const bill = K.billingFor(key, prog, d.dose);
        if (!bill || !bill.options.length) return;
        const sig = key + '|' + prog + '|' + (d.priceTier || '');
        if (seen[sig]) return;
        seen[sig] = 1;
        h += `<h4>${esc(p.label)} — ${esc(bill.programLabel)}${d.priceTier ? ' · tier ' + esc(d.priceTier) : ''}</h4>`;
        h += `<table class="grid"><thead><tr><th>Program</th><th>Price</th><th>Charge code</th></tr></thead><tbody>`;
        bill.options.forEach(o => {
          h += `<tr><td>${esc(o.label)}</td><td>${o.price != null ? '$' + esc(o.price) : 'Varies'}</td>
            <td>${o.code ? '<code>' + esc(o.code) + '</code>' : esc(o.codeNote || 'Operations will provide')}</td></tr>`;
        });
        h += `</tbody></table>`;
        const notes = [...new Set(bill.options.map(o => o.priceNote).filter(Boolean))];
        notes.forEach(n => { h += `<p class="fine">${esc(n)}</p>`; });
      });
    });
  });
  h += `<p class="fine"><strong>Includes:</strong> ${esc(K.pricing.includes)}. Never quote pricing to a patient without confirming with Operations.</p>`;
  return h;
}

/* Fields in this file are string, array-of-string, or an object of named
   sub-lists. Render generically rather than special-casing each, so a shape
   change does not silently drop a section. */
function block(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return `<p>${esc(v)}</p>`;
  if (Array.isArray(v)) return bullets(v);
  if (typeof v === 'object') {
    return Object.keys(v).map(k => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
      const inner = v[k];
      if (Array.isArray(inner)) return `<p class="sublabel">${esc(label)}</p>${bullets(inner)}`;
      return `<p><strong>${esc(label)}.</strong> ${esc(inner)}</p>`;
    }).join('');
  }
  return '';
}

function sectionClinical(doc) {
  const p = K.getProduct(doc.products[0]);
  const m = K.monographs[p.drug];
  if (!m) return '';
  const c = K.clinical || {};
  let h = `<h2>Clinical reference — ${esc(m.title)}</h2>`;

  /* Indications come from the MONOGRAPH, per molecule. clinical.candidateCriteria
     carries an fdaApproved list too, but that object is shared across every drug
     in the file and its list is semaglutide's - rendering it on a tirzepatide
     document reproduces exactly the defect this rebuild exists to fix. It is
     skipped deliberately below. */
  if (m.indications) {
    h += `<h3>Indications</h3>${block(m.indications)}`;
    /* The scope note sits immediately under the list, inside the same section,
       because the list is what the molecule is approved for and NOT what KORB
       treats. Separated, a provider reads the indications as a menu. */
    if (m.korbScope) h += `<div class="callout warn"><h3>What KORB treats</h3><p>${esc(m.korbScope)}</p></div>`;
  }

  if (c.candidateCriteria) {
    /* Strip the retired shared indication list AND its retirement marker. The
       marker is bookkeeping, not content, and block() renders every key it is
       given - it printed "Fda Approved Retired. true" onto the documents. */
    const cc = Object.assign({}, c.candidateCriteria);
    delete cc.fdaApproved;
    delete cc.fdaApprovedRetired;
    h += `<h3>Identifying the appropriate candidate</h3>${block(cc)}`;
  }
  if (m.definition) h += `<h3>Definition</h3>${block(m.definition)}`;
  if (m.mechanism) h += `<h3>Mechanism</h3>${block(m.mechanism)}`;
  if (m.evidence) h += `<h3>Clinical evidence</h3>${block(m.evidence)}`;
  if (m.absoluteContraindications) h += `<h3>Absolute contraindications</h3>${block(m.absoluteContraindications)}`;
  if (m.cautions) h += `<h3>Cautions</h3>${block(m.cautions)}`;
  if (m.interactions) h += `<h3>Medication interactions</h3>${block(m.interactions)}`;
  if (c.sideEffects) h += `<h3>Side effects</h3>${block(c.sideEffects)}`;
  if (m.monitoring) h += `<h3>Monitoring</h3>${block(m.monitoring)}`;
  if (m.counselingScript) h += `<h3>Patient counseling</h3>${block(m.counselingScript)}`;
  if (K.escalation) h += `<h3>Escalation and discontinuation</h3>${block(K.escalation)}`;
  if (m.attestation) h += `<h3>Chart attestation</h3><p class="attest">${esc(m.attestation)}</p>`;
  if (m.icd10) h += `<h3>ICD-10</h3>${block(m.icd10)}`;
  /* Attribution sits at the END of the clinical section - it applies to the
     section above it, and a cleared document should not open with a banner
     about its own paperwork. When NOT signed, the gate at the top carries it
     instead, because then it is a warning rather than a credit. */
  h += signoffLine(doc);
  return h;
}

function renderBody(data, doc) {
  K = data;
  const p0 = K.getProduct(doc.products[0]);
  const ph = doc.brand ? null : K.pharmacies[p0.pharmacy];
  return `
<div class="titleband">
  <h1>${esc(doc.title)}</h1>
  <p class="sub">Weight Loss &amp; Metabolic Health · Provider Reference</p>
</div>
<p class="byline">KORB Health Group · korb-glp1-data.js v${esc(K.meta.version)} · ${esc(doc.stamp || 'live — reflects the data file as of this page load')}</p>

<div class="lede">Everything needed to prescribe ${esc(doc.title.replace(/ — /, ' '))}, complete on its own. Values are copied literally into Tebra — do not paraphrase, and do not adjust quantity, refill or days supply.</div>

${sectionGate(doc)}
${sectionGlance(doc, ph)}
${sectionCallouts(doc, ph)}
${sectionPreparation(doc)}
${sectionLimitations(doc)}
${sectionNotes(ph)}
${sectionLadder(doc)}
${sectionRx(doc)}
${sectionPricing(doc)}
${sectionClinical(doc)}

<div class="foot">
  <div><h4>Questions and escalation</h4><ul>
    <li>Pharmacy or shipping — Operations</li>
    <li>Charge codes and billing — Operations</li>
    <li>Clinical protocol — Clinical Director</li>
    <li>Corrections to this document — Clinical Operations</li></ul></div>
  <div><h4>Do not improvise</h4><ul>
    <li>Do not substitute an unavailable pharmacy</li>
    <li>Do not alter quantity, refill or days supply</li>
    <li>Do not paraphrase patient instructions</li>
    <li>Do not quote pricing without Operations</li></ul></div>
</div>
<p class="meta">KORB Health Group LLC is a management services organisation. Clinical care is delivered by the affiliated medical practice and its licensed providers.</p>`;
}

/* Browser entry point. The shell calls this after both scripts have loaded. */
function mount(docId, data) {
  K = data;
  const doc = DOCS.filter(d => d.id === docId)[0];
  if (!doc) { document.body.innerHTML = '<p>Unknown document: ' + esc(docId) + '</p>'; return; }
  document.title = doc.title + ' — GLP-1 Provider Reference';
  document.body.innerHTML = renderBody(K, doc);
}

return { DOCS: DOCS, esc: esc, renderBody: renderBody, mount: mount, CSS: CSS, LOGO_URI: LOGO_URI };
}));
