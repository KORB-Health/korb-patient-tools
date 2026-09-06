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

const CSS = `  @page { size: Letter; margin: 0.75in 0.6in; }
  :root{--navy:#21275B;--teal:#00B2C3;--cream:#ECE9D1;--orange:#FBB040;
        --ink:#1A1D33;--ink2:#4A4F6B;--ink3:#767B94;--rule:#DFDCCB;--panel:#F7F6EF;}
  *{box-sizing:border-box;}
  body{margin:0;font-family:"Source Serif 4",Georgia,serif;font-size:10.2pt;line-height:1.5;color:var(--ink);}
  h1{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:24pt;margin:0;color:var(--navy);letter-spacing:-.01em;}
  .sub{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:11pt;color:var(--ink2);margin:2pt 0 0;}
  .byline{font-family:"IBM Plex Mono",monospace;font-size:7.6pt;color:var(--ink3);margin:10pt 0 0;
          border-top:1pt solid var(--rule);padding-top:6pt;}
  .lede{color:var(--ink2);margin:10pt 0 14pt;}
  h2{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:13pt;color:var(--navy);
     margin:20pt 0 7pt;padding-bottom:3pt;border-bottom:2pt solid var(--teal);break-after:avoid;}
  h3{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:10.5pt;margin:13pt 0 5pt;color:var(--ink);break-after:avoid;}
  h3.prod{background:var(--navy);color:#fff;padding:5pt 8pt;margin-top:16pt;}
  h3.prod .via{float:right;font-weight:400;font-size:8.4pt;opacity:.75;}
  h4{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:9.6pt;margin:11pt 0 4pt;color:var(--navy);break-after:avoid;}
  table{border-collapse:collapse;width:100%;margin:5pt 0 9pt;break-inside:avoid;}
  .kv th{width:31%;text-align:left;background:var(--panel);color:var(--ink2);font-weight:600;
         font-family:Archivo,Helvetica,Arial,sans-serif;font-size:8.4pt;vertical-align:top;}
  .kv th,.kv td{border:0.6pt solid var(--rule);padding:4pt 7pt;vertical-align:top;}
  .rx td{font-family:"IBM Plex Mono",monospace;font-size:8.4pt;}
  .grid th{background:var(--navy);color:#fff;font-family:Archivo,Helvetica,Arial,sans-serif;
           font-size:8pt;text-align:left;padding:4pt 7pt;}
  .grid td{border:0.6pt solid var(--rule);padding:4pt 7pt;font-size:9pt;}
  ul{margin:4pt 0 9pt;padding-left:14pt;} li{margin-bottom:3pt;}
  .callout{border-left:3pt solid var(--teal);background:var(--panel);padding:7pt 10pt;margin:9pt 0;break-inside:avoid;}
  .callout.warn{border-left-color:var(--orange);}
  .callout.ok{border-left-color:#1E6B4F;background:#F1F7F4;}
  .callout.ok h3{color:#1E6B4F;}
  .callout h3{margin:0 0 3pt;font-size:9.6pt;}
  .callout p{margin:0 0 4pt;font-size:9.2pt;} .callout p:last-child{margin-bottom:0;}
  .gate{border:1.5pt solid #B3261E;background:#FBEDEC;padding:9pt 12pt;margin:12pt 0;break-inside:avoid;}
  .gate h3{margin:0 0 5pt;color:#B3261E;font-size:10.5pt;}
  .gate p{margin:0 0 5pt;font-size:9.2pt;} .gate-q{color:var(--ink2);}
  .meta{font-family:"IBM Plex Mono",monospace;font-size:7.6pt;color:var(--ink3);}
  .fine{font-size:8.6pt;color:var(--ink2);margin:4pt 0;}
  .sublabel{font-family:Archivo,Helvetica,Arial,sans-serif;font-size:8.6pt;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em;margin:7pt 0 2pt;}
  .attest{background:var(--panel);border-left:3pt solid var(--navy);padding:7pt 10pt;font-style:italic;}
  code{font-family:"IBM Plex Mono",monospace;font-size:8.6pt;background:var(--panel);padding:1pt 3pt;border:0.5pt solid var(--rule);}
  .foot{margin-top:22pt;border-top:1pt solid var(--rule);padding-top:8pt;font-size:8.4pt;color:var(--ink2);
        display:flex;gap:26pt;break-inside:avoid;}
  .foot h4{margin:0 0 3pt;}
  .foot ul{margin:0;padding-left:12pt;}`;

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
      h += `<h4>Same for every dose</h4><table class="kv rx">${rows(constant)}</table>`;
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
      h += `<h4>${esc(x.d.dose)}${x.d.presentation ? ' · ' + esc(x.d.presentation) : ''} — ${esc(LABEL[x.sk] || x.sk)}</h4>
        <table class="kv rx">${rows(varying)}</table>`;
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
<h1>${esc(doc.title)}</h1>
<p class="sub">GLP-1 Provider Reference</p>
<p class="byline">Weight Loss Program · KORB Health Group · korb-glp1-data.js v${esc(K.meta.version)} · ${esc(doc.stamp || 'live — reflects the data file as of this page load')}</p>

<p class="lede">Everything needed to prescribe ${esc(doc.title.replace(/ — /, ' '))}, complete on its own. Values are copied literally into Tebra — do not paraphrase, and do not adjust quantity, refill or days supply.</p>

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

return { DOCS: DOCS, esc: esc, renderBody: renderBody, mount: mount, CSS: CSS };
}));
