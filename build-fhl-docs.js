#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — FUNCTIONAL HEALTH & LONGEVITY PROVIDER REFERENCE BUILDER

   Emits, for each of the four programs:
     <name>.html   a LIVE shell that loads korb-dosing-data.js in the browser
                   and renders through fhl-doc-render.js. Never goes stale.
     <name>.pdf    a fixed snapshot of the same content, for printing or for
                   pinning a version to an audit.

   Both render through the SAME module, so the printed page and the live page
   cannot drift apart.

   USAGE
     node build-fhl-docs.js              build all four
     node build-fhl-docs.js gateway      build one, by doc id
                                         (foundation | gateway | peakA | peakB)

   DO NOT EDIT A GENERATED DOCUMENT. Edit korb-dosing-data.js and rebuild, or
   edit fhl-doc-render.js. A hand-edit is overwritten by the next build.

   WHY THIS FILE EXISTS
     The four documents in the repo were stamped "korb-dosing-data.js v2.5,
     generated 2026-08-12" by a generator that was never committed. They could
     not be rebuilt, so they sat telling providers that Greenwich ships to all
     50 states plus DC and listing twelve closed states when the real number
     had reached eighteen. Same failure mode as the GLP-1 documents before
     build-provider-docs.js existed, and the same fix.

   TYPEFACE, AND WHY THE HEADER CARRIES ITS OWN @font-face
     Chromium renders headerTemplate and footerTemplate in a separate document
     that does NOT inherit the page stylesheet. Naming Montserrat there is not
     enough: on a machine with Montserrat installed the header quietly uses the
     system copy, and on one without it falls back to whatever the system sans
     is. That is why the GLP-1 build's typeface guard passes on some machines
     and fails on others with LiberationSans, which is a property of the build
     machine rather than of the document. The four faces are inlined into the
     header and footer templates here so the output is the same everywhere.
   ============================================================================ */

const fs = require('fs');
const path = require('path');
const R = require('./fhl-doc-render.js');
const buildDate = require('./build-date.js');
const RXB = require('./korb-rx-block.js');
const AUDIT = require('./dose-audit.js');

const REPO = __dirname;
const OUT = path.join(REPO, 'Provider_Reference');
const PH_REL   = '../korb-pharmacies.js';   // MUST load before the data file
const DATA_REL = '../korb-dosing-data.js';
const GLP1_REND_REL = '../provider-doc-render.js';
const RXB_REL = '../korb-rx-block.js';
const REND_REL = '../fhl-doc-render.js';

const K = (function () {
  /* korb-pharmacies.js first, into the same scope. Since open item 4 the FH&L
     file takes premierRouting from it at load. Without this the Premier
     footprint comes back empty, every FH&L patient routes to Greenwich, and
     the build still exits 0 - the silent-success shape CLAUDE.md warns about.
     The hydrated assertion below is what stops that being possible. */
  const sandbox = {};
  const phSrc = fs.readFileSync(path.join(REPO, 'korb-pharmacies.js'), 'utf8');
  new Function('exports', 'module', phSrc + '\n;this.KORB_PHARMACIES = KORB_PHARMACIES;').call(sandbox, {}, {});
  global.KORB_PHARMACIES = sandbox.KORB_PHARMACIES;

  const src = fs.readFileSync(path.join(REPO, 'korb-dosing-data.js'), 'utf8');
  new Function('exports', 'module', src + '\n;this.KORB_DOSING = KORB_DOSING;').call(sandbox, {}, {});
  if (!sandbox.KORB_DOSING.hydrated) throw new Error(
    'korb-dosing-data.js did not hydrate from korb-pharmacies.js. Check the load order above.');
  return sandbox.KORB_DOSING;
})();

const BUILD_DATE = buildDate();   // LOCAL date - see build-date.js

/* The live shell. Deliberately tiny: everything that could go stale lives in
   the scripts it loads, not in this file. Screen styling only - the print
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
<title>${R.esc(doc.title)} — FH&amp;L Provider Reference</title>
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
<script src="${GLP1_REND_REL}"></script>
<script src="${REND_REL}"></script>
<script>
  /* Renders from the data file at page load, so this document is never stale.
     If a script fails to load, say so plainly rather than rendering a
     half-empty page that looks authoritative. */
  (function () {
    if (typeof KORB_DOSING === 'undefined' || typeof KORB_FHL_DOCS === 'undefined') {
      document.body.innerHTML = '<p style="font-family:sans-serif;color:#B3261E">' +
        'Could not load korb-pharmacies.js, korb-dosing-data.js, provider-doc-render.js ' +
        'or fhl-doc-render.js. This document renders from those files and cannot ' +
        'display without them.</p>';
      return;
    }
    /* Loaded but not hydrated means korb-pharmacies.js is missing or came
       second. Say so rather than print a routing table built from nothing. */
    if (!KORB_DOSING.hydrated) {
      document.body.innerHTML = '<p style="font-family:sans-serif;color:#B3261E">' +
        'korb-pharmacies.js did not load before korb-dosing-data.js, so pharmacy ' +
        'routing is unknown. This document will not display incomplete routing.</p>';
      return;
    }
    KORB_FHL_DOCS.mount(${JSON.stringify(doc.id)}, KORB_DOSING);
    var mast = document.createElement('div');
    mast.className = 'mast';
    mast.innerHTML = '<img src="' + KORB_FHL_DOCS.LOGO_URI + '" alt="KORB Health">';
    document.body.insertBefore(mast, document.body.firstChild);
    var bar = document.createElement('div');
    bar.innerHTML = '<span class="live">Live — reflects korb-dosing-data.js v' +
      KORB_FHL_DOCS.esc(KORB_DOSING.meta.version) + ' as of this page load</span>' +
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
  if (!list.length) {
    console.error('No document matches "' + only + '". Known ids: ' + R.DOCS.map(d => d.id).join(', '));
    process.exit(1);
  }

  const problems = K.selfCheck();
  if (problems.length) {
    console.error('REFUSING TO BUILD — korb-dosing-data.js has ' + problems.length + ' selfCheck problem(s).');
    problems.forEach(p => console.error('  - ' + p));
    process.exit(1);
  }

  /* Cross-pharmacy dose audit. Open item 9b: this found two real errors on
     2026-09-14 in the string that becomes the Tebra favorite, and existed only
     as shell history, so the next one would have waited for someone to read a
     finished document again. A dose does not change with the pharmacy, so
     every place an entry states its dose must state the same one. */
  if (AUDIT.report('korb-dosing-data.js', AUDIT.auditDosing(K))) process.exit(1);
  console.log('Dose audit: every peptide dose is stated consistently across pharmacies.');

  /* A document that names a state it should not, or omits one it must, is the
     defect this rebuild exists to fix. Assert it before writing anything. */
  const S = K.states;
  const gate = [];
  (S.unavailableNoPharmacy || []).forEach(s => {
    if ((S.unavailable || []).indexOf(s) === -1) gate.push(s + ' is flagged no-pharmacy but is not in states.unavailable');
  });
  (S.unavailableNoShip || []).forEach(s => {
    if ((S.unavailable || []).indexOf(s) === -1) gate.push(s + ' is flagged no-ship but is not in states.unavailable');
  });
  (S.premierRouting || []).forEach(s => {
    if ((S.unavailable || []).indexOf(s) !== -1 && (S.unavailableNoPharmacy || []).indexOf(s) !== -1) {
      gate.push(s + ' is in premierRouting and also flagged no-pharmacy, which cannot both be true');
    }
  });
  /* A paused state must also be a blocked state, or the document tells a
     provider to wait while the tool lets them prescribe. And a single-source
     state is open by definition, so it must not appear in a blocking list. */
  ((S.pausedPharmacy && S.pausedPharmacy.states) || []).forEach(s => {
    if ((S.unavailableNoPharmacy || []).indexOf(s) === -1) gate.push(s + ' is flagged paused but is not in states.unavailableNoPharmacy');
  });
  ((S.pausedPharmacy && S.pausedPharmacy.alsoLostGreenwichButAlreadyExcluded) || []).forEach(s => {
    if ((S.unavailable || []).indexOf(s) === -1) gate.push(s + ' is recorded as already-excluded but is not in states.unavailable');
    if ((S.unavailableNoPharmacy || []).indexOf(s) !== -1) gate.push(s + ' is recorded as already-excluded but is also flagged no-pharmacy, which puts it on the restore clock');
  });
  ((S.singleSourceGreenwich && S.singleSourceGreenwich.liveStates) || []).forEach(s => {
    if ((S.unavailable || []).indexOf(s) !== -1) gate.push(s + ' is listed as a live single-source state but is also in states.unavailable');
  });

  if (gate.length) {
    console.error('REFUSING TO BUILD — the state lists disagree with each other:');
    gate.forEach(g => console.error('  - ' + g));
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });

  /* HTML first, and unconditionally. It renders live from the data file and
     needs no browser, so it must not be held hostage to one. */
  for (const doc of list) {
    const htmlPath = path.join(OUT, doc.file + '.html');
    fs.writeFileSync(htmlPath, shell(doc));
    console.log(`  ${doc.file}  html ${String(fs.statSync(htmlPath).size).padStart(6)}`);
  }

  /* No PDF phase. The provider PDFs were retired on 2026-09-17, and until
     2026-09-25 this builder still wrote them on every run, recreating the files
     the repo had decided to delete. Retiring an output means removing what
     writes it. Print from the browser gives a PDF from current data. */
  console.log(`\nBuilt ${list.length} document(s) from korb-dosing-data.js v${K.meta.version} on ${BUILD_DATE}`);
  console.log('FH&L is closed in ' + (K.states.unavailable || []).length + ' states: ' + (K.states.unavailable || []).join(', '));
  console.log('HTML renders live from the data file. No PDFs: retired 2026-09-17.');
}

main().catch(e => { console.error(e); process.exit(1); });
