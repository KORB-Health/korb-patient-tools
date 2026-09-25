#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — GLP-1 PROVIDER REFERENCE BUILDER

   Emits, for each document in DOCS (provider-doc-render.js, around line 205):
     <name>.html   a LIVE shell that loads korb-glp1-data.js in the browser and
                   renders through provider-doc-render.js. Never goes stale.
     <name>.pdf    a fixed snapshot of the same content, for printing or for
                   pinning a version to an audit.

   Both render through the SAME module, so the printed page and the live page
   cannot drift apart.

   USAGE
     node build-provider-docs.js              build everything
     node build-provider-docs.js belmar_tirz  build one, by doc id

   DO NOT EDIT A GENERATED DOCUMENT. Edit korb-glp1-data.js and rebuild, or edit
   provider-doc-render.js. A hand-edit is overwritten by the next build.

   WHY THIS FILE EXISTS
     The eleven documents originally in the repo - ten now, Greenwich tirzepatide
     was retired 2026-09-11 - were generated on 2026-08-09 by
     something never committed. When the data changed underneath them they could
     not be rebuilt, so they sat describing a Belmar split fill that no longer
     exists and telling providers to counsel Zepbound patients about a compounded
     preparation they were not receiving. A generator outside the repo is a
     generator that stops existing.

   DEFECTS FIXED BY CONSTRUCTION
     - Real build date on the PDF; the live HTML states it is live instead.
     - High-severity open items render as a visible gate on page one.
     - Product-level flags stay product-level (the Premier exclusivity bug).
     - Everything escapes through esc() (the "FH&L;" bug).
     - Preparation text resolves per product, never per molecule.
   ============================================================================ */

const fs = require('fs');
const path = require('path');
const R = require('./provider-doc-render.js');
const buildDate = require('./build-date.js');
const RXB = require('./korb-rx-block.js');
const AUDIT = require('./dose-audit.js');

const REPO = __dirname;
const OUT = path.join(REPO, 'Provider_Reference', 'GLP1');
const PH_REL   = '../../korb-pharmacies.js';   // MUST load before the data file
const DATA_REL = '../../korb-glp1-data.js';
const RXB_REL = '../../korb-rx-block.js';
const REND_REL = '../../provider-doc-render.js';

const K = (function () {
  /* korb-pharmacies.js first, into the same scope. Since open item 3 the GLP-1
     file takes its pharmacy footprints from it at load. Without this every
     footprint comes back empty, and a document would state that a pharmacy
     ships nowhere while the build still exits 0 — the exact silent-success
     shape the Known failure section warns about. */
  const sandbox = {};
  const phSrc = fs.readFileSync(path.join(REPO, 'korb-pharmacies.js'), 'utf8');
  new Function('exports', 'module', phSrc + '\n;this.KORB_PHARMACIES = KORB_PHARMACIES;').call(sandbox, {}, {});
  global.KORB_PHARMACIES = sandbox.KORB_PHARMACIES;

  const src = fs.readFileSync(path.join(REPO, 'korb-glp1-data.js'), 'utf8');
  new Function('exports', 'module', src + '\n;this.KORB_GLP1 = KORB_GLP1;').call(sandbox, {}, {});
  if (!sandbox.KORB_GLP1.hydrated) throw new Error(
    'korb-glp1-data.js did not hydrate from korb-pharmacies.js. Check the load order above.');
  return sandbox.KORB_GLP1;
})();

const BUILD_DATE = buildDate();   // LOCAL date - see build-date.js

/* The live shell. Deliberately tiny: everything that could go stale lives in
   the two scripts it loads, not in this file. Screen styling only - the print
   stylesheet is the same CSS the PDF uses, so Ctrl+P from the browser gives
   the same document. */
function shell(doc) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<!-- iOS DATA DETECTORS OFF. Don, on an iPad Air, 2026-09-21: the Quest codes in
     the lab table carried dotted underlines and tapping one opened Google Maps.
     Nothing in this repo underlined them - Safari on iOS reads a bare number
     like 10231 or 6399 as an address and silently turns it into a Maps link.
     Desktop Safari and Chrome do not, which is why it was invisible here.
     A five-digit Quest code is exactly ZIP-shaped, so a clinical document full
     of them is the worst case for this. An explicit <a href="tel:"> is
     unaffected; this only stops the guessing. -->
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<title>${R.esc(doc.title)} — GLP-1 Provider Reference</title>
<style>
${R.CSS}
/* Screen presentation. The rules above are shared with the PDF build. */
@media screen {
  /* Layout only. FONT SIZES LIVE IN ONE PLACE, the @media screen block at the
     end of CSS in provider-doc-render.js. Three copies of a partial type scale
     is what put 15px bullets above an 11.5px table. Do not add sizes here. */
  /* THREE LEVELS, NOT TWO. Cream is the desk, the document is a page on it,
     and the tables are white cards on the page.

     With only two levels - cream page, white tables - body prose had no
     surface of its own and read as floating, which Don asked about on
     2026-09-15: "it looks like it's just floating around". It is ordinary HTML
     to set prose straight on the page, and it was wrong here, because
     everything AROUND it had a card and it did not.

     Making the document white instead would put the tables back where they
     started: white on white, the exact fault the cream fixed. So the document
     surface is #FBFAF6 - the old page colour, now doing a job it is suited to -
     and the tables stay #fff. Every layer is distinguishable from the ones
     either side of it. Screen only; the PDF is a sheet of paper already. */
  html { background: #ECE9D1; }   /* brand cream, the desk */
  body { max-width: 8.5in; margin: 0 auto; padding: 28px 26px 60px; background: #FBFAF6;
         border: 1px solid #DEDBC4; border-top: 0; border-bottom: 0; min-height: 100vh; }
  .live { font-family: Montserrat, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 10px; letter-spacing: .06em;
          text-transform: uppercase; color: #1E6B4F; background: #E9F3EE;
          border: 1px solid #C3E0D2; padding: 4px 9px; display: inline-block; margin-bottom: 14px; }
  .tools { float: right; font-family: Montserrat, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 12px; }
  .tools a { color: #0F5F69; margin-left: 12px; }
  .mast { border-bottom: 1.5px solid #00B2C3; padding-bottom: 7px; margin-bottom: 16px; }
  .mast img { height: 34px; width: auto; display: block; }
}
@media print { .live, .tools, .mast { display: none; } body { padding: 0; max-width: none; } }
</style>
</head>
<body>
<p>Loading…</p>
<script src="${PH_REL}"></script>
<script src="${DATA_REL}"></script>
<script src="${RXB_REL}"></script>
<script src="${REND_REL}"></script>
<script>
  /* Renders from the data file at page load, so this document is never stale.
     If the data file moves or fails to load, say so plainly rather than
     rendering a half-empty page that looks authoritative. */
  (function () {
    if (typeof KORB_GLP1 === 'undefined' || typeof KORB_DOCS === 'undefined') {
      document.body.innerHTML = '<p style="font-family:sans-serif;color:#B3261E">' +
        'Could not load korb-glp1-data.js or provider-doc-render.js. ' +
        'This document renders from those files and cannot display without them.</p>';
      return;
    }
    KORB_DOCS.mount(${JSON.stringify(doc.id)}, KORB_GLP1);
    /* Masthead, so the on-screen page carries the same lockup as the printed
       one. The PDF gets it from Chromium's running header, which the browser
       view has no equivalent of. */
    var mast = document.createElement('div');
    mast.className = 'mast';
    mast.innerHTML = '<img src="' + KORB_DOCS.LOGO_URI + '" alt="KORB Health">';
    document.body.insertBefore(mast, document.body.firstChild);
    var bar = document.createElement('div');
    bar.innerHTML = '<span class="live">Live — reflects korb-glp1-data.js v' +
      KORB_DOCS.esc(KORB_GLP1.meta.version) + ' as of this page load</span>' +
      /* No 'PDF version' link. The provider PDFs were retired 2026-09-17:
         every one had an HTML twin that reads the data files on load, so the
         PDF was a second copy that went stale and made every correction a
         two-place job. The intranet was moved to the HTML links first. Print
         produces a PDF from current data at the moment it is pressed. */
      '<span class="tools">' +
      '<a href="#" onclick="window.print();return false;">Print</a></span>';
    document.body.insertBefore(bar, document.body.firstChild);

    /* Clipboard for the Tebra fields. One delegated handler, shared with
       every other document, so adding a product needs no change here. */
    ${RXB.COPY_JS}
  })();
</script>
</body></html>`;
}

async function main() {
  const only = process.argv[2];
  const list = only ? R.DOCS.filter(d => d.id === only) : R.DOCS;
  if (!list.length) { console.error('No document matches "' + only + '"'); process.exit(1); }

  const problems = K.selfCheck();
  if (problems.length) {
    console.error('REFUSING TO BUILD — korb-glp1-data.js has ' + problems.length + ' selfCheck problem(s).');
    problems.forEach(p => console.error('  - ' + p));
    process.exit(1);
  }

  /* Cross-pharmacy dose audit. Open item 9b. This file carries a numeric mg on
     every dose, so the check here is stronger than the peptide one: each dose
     stated in the dose string, in the favorite name, and in the patient
     instruction is compared against that number rather than against its
     siblings. 74 doses across 16 products, and before 2026-09-14 none of them
     had ever been audited. */
  if (AUDIT.report('korb-glp1-data.js', AUDIT.auditGlp1(K))) process.exit(1);
  console.log('Dose audit: all GLP-1 doses match their stated mg.');

  fs.mkdirSync(OUT, { recursive: true });

  /* HTML first, and unconditionally. It renders live from the data file and
     needs no browser, so it must not be held hostage to one. */
  for (const doc of list) {
    const htmlPath = path.join(OUT, doc.file + '.html');
    fs.writeFileSync(htmlPath, shell(doc));
    console.log(`  ${doc.file}  html ${String(fs.statSync(htmlPath).size).padStart(5)}`);
  }

  /* No PDF phase. The provider PDFs were retired on 2026-09-17, and until
     2026-09-25 this builder still wrote them on every run, recreating the files
     the repo had decided to delete. Retiring an output means removing what
     writes it. Print from the browser gives a PDF from current data. */
  console.log(`\nBuilt ${list.length} document(s) from korb-glp1-data.js v${K.meta.version} on ${BUILD_DATE}`);
  console.log('HTML renders live from the data file. No PDFs: retired 2026-09-17.');
}

main().catch(e => { console.error(e); process.exit(1); });
