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

const REPO = __dirname;
const OUT = path.join(REPO, 'Provider_Reference');
const DATA_REL = '../korb-dosing-data.js';
const GLP1_REND_REL = '../provider-doc-render.js';
const REND_REL = '../fhl-doc-render.js';

const K = (function () {
  const src = fs.readFileSync(path.join(REPO, 'korb-dosing-data.js'), 'utf8');
  const sandbox = {};
  new Function('exports', 'module', src + '\n;this.KORB_DOSING = KORB_DOSING;').call(sandbox, {}, {});
  return sandbox.KORB_DOSING;
})();

const BUILD_DATE = new Date().toISOString().slice(0, 10);

/* Playwright is resolved rather than hardcoded to one machine's global path.
   build-provider-docs.js hardcodes /home/claude/.npm-global/..., which works
   only on the machine it was written on. */
function loadChromium() {
  const tries = ['playwright', 'playwright-core',
                 '/home/claude/.npm-global/lib/node_modules/playwright'];
  for (const t of tries) {
    try { return require(t).chromium; } catch (e) { /* next */ }
  }
  console.error('Playwright not found. Install it with:  npm i -D playwright');
  console.error('Then:  npx playwright install chromium');
  process.exit(1);
}

/* The four @font-face rules, lifted out of the shared stylesheet so the PDF
   header and footer can carry them too. Read from the CSS rather than copied,
   so a font change in provider-doc-render.js reaches the header as well. */
function fontFaceBlock() {
  const faces = R.CSS.match(/@font-face\{[^}]*\}/g) || [];
  if (!faces.length) {
    console.error('WARNING: no @font-face rules found in the shared stylesheet. ' +
                  'The PDF header and footer will fall back to a system typeface.');
  }
  return faces.join('\n');
}

/* The live shell. Deliberately tiny: everything that could go stale lives in
   the scripts it loads, not in this file. Screen styling only - the print
   stylesheet is the same CSS the PDF uses, so Ctrl+P from the browser gives
   the same document. */
function shell(doc) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${R.esc(doc.title)} — FH&amp;L Provider Reference</title>
<style>
${R.CSS}
/* Screen presentation. The rules above are shared with the PDF build. */
@media screen {
  body { max-width: 8.5in; margin: 0 auto; padding: 28px 26px 60px; font-size: 15px; background: #FBFAF6; }
  h1 { font-size: 30px; } h2 { font-size: 19px; } h3 { font-size: 15px; } h4 { font-size: 14px; }
  table { font-size: 14px; } .rx td { font-size: 13px; }
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
<script src="${DATA_REL}"></script>
<script src="${GLP1_REND_REL}"></script>
<script src="${REND_REL}"></script>
<script>
  /* Renders from the data file at page load, so this document is never stale.
     If a script fails to load, say so plainly rather than rendering a
     half-empty page that looks authoritative. */
  (function () {
    if (typeof KORB_DOSING === 'undefined' || typeof KORB_FHL_DOCS === 'undefined') {
      document.body.innerHTML = '<p style="font-family:sans-serif;color:#B3261E">' +
        'Could not load korb-dosing-data.js, provider-doc-render.js or fhl-doc-render.js. ' +
        'This document renders from those files and cannot display without them.</p>';
      return;
    }
    KORB_FHL_DOCS.mount(${JSON.stringify(doc.id)}, KORB_DOSING);
    var mast = document.createElement('div');
    mast.className = 'mast';
    mast.innerHTML = '<img src="' + KORB_FHL_DOCS.LOGO_URI + '" alt="KORB Health Group">';
    document.body.insertBefore(mast, document.body.firstChild);
    var bar = document.createElement('div');
    bar.innerHTML = '<span class="live">Live — reflects korb-dosing-data.js v' +
      KORB_FHL_DOCS.esc(KORB_DOSING.meta.version) + ' as of this page load</span>' +
      '<span class="tools"><a href="${doc.file}.pdf">PDF version</a>' +
      '<a href="#" onclick="window.print();return false;">Print</a></span>';
    document.body.insertBefore(bar, document.body.firstChild);
  })();
</script>
</body></html>`;
}

/* The PDF path stamps a real build date, because a printed page is a snapshot
   and should say which one. The live page says "live" instead. */
function printableHtml(doc) {
  const d = Object.assign({}, doc, { stamp: 'built ' + BUILD_DATE });
  return `<!doctype html><html><head><meta charset="utf-8">
<title>${R.esc(doc.title)}</title><style>${R.CSS}</style></head>
<body>${R.renderBody(K, d)}</body></html>`;
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
  if (gate.length) {
    console.error('REFUSING TO BUILD — the state lists disagree with each other:');
    gate.forEach(g => console.error('  - ' + g));
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const chromium = loadChromium();
  const browser = await chromium.launch();
  const FONTS = fontFaceBlock();

  for (const doc of list) {
    fs.writeFileSync(path.join(OUT, doc.file + '.html'), shell(doc));

    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.setContent(printableHtml(doc), { waitUntil: 'load' });
    await page.pdf({
      path: path.join(OUT, doc.file + '.pdf'),
      format: 'Letter', printBackground: true,
      margin: { top: '0.85in', bottom: '0.7in', left: '0.6in', right: '0.6in' },
      displayHeaderFooter: true,
      headerTemplate: `<style>${FONTS}</style><div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:5px;border-bottom:1.5px solid #00B2C3;">
          <img src="${R.LOGO_URI}" style="height:26px;width:auto;">
          <div style="text-align:right;font-size:7.5pt;color:#21275B;line-height:1.3;">
            <div style="font-weight:bold;">${R.esc('FH&L Provider Reference · ' + doc.title)}</div>
            <div style="font-weight:bold;">KORB Health Group</div>
          </div>
        </div></div>`,
      footerTemplate: `<style>${FONTS}</style><div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="border-top:1.5px solid #00B2C3;padding-top:5px;display:flex;justify-content:space-between;font-size:7pt;color:#4A4F6B;">
          <span>For KORB provider use only. Not for patient distribution.</span>
          <span>Page <span class="pageNumber"></span></span>
        </div></div>`
    });
    await page.close();
    const pdfBytes = fs.statSync(path.join(OUT, doc.file + '.pdf')).size;
    const htmlBytes = fs.statSync(path.join(OUT, doc.file + '.html')).size;
    console.log(`  ${doc.file}  html ${String(htmlBytes).padStart(6)}  pdf ${String(pdfBytes).padStart(7)}${errs.length ? '  ERRORS: ' + errs.join('|') : ''}`);
  }
  await browser.close();

  /* Every produced PDF must carry ONLY the brand typeface. A dropped @font-face
     falls back silently and the page still looks plausible, which is exactly
     the kind of defect that ships. */
  const offBrand = [];
  for (const doc of list) {
    const buf = fs.readFileSync(path.join(OUT, doc.file + '.pdf'));
    const faces = new Set();
    const re = /\/BaseFont\s*\/([A-Za-z0-9+\-,]+)/g;
    let m; const str = buf.toString('latin1');
    while ((m = re.exec(str)) !== null) faces.add(m[1].split('+').pop());
    [...faces].filter(f => !/^Montserrat/.test(f)).forEach(f => offBrand.push(doc.file + ': ' + f));
  }
  if (offBrand.length) {
    console.error('BUILD FAILED — non-brand typeface embedded in the PDF output:');
    offBrand.forEach(x => console.error('  - ' + x));
    console.error('The KORB guidelines specify Montserrat. Check the @font-face data URIs in provider-doc-render.js,');
    console.error('and that fontFaceBlock() is still finding them for the header and footer.');
    process.exit(1);
  }
  console.log('Typeface check: all ' + list.length + ' PDFs embed Montserrat only.');

  console.log(`\nBuilt ${list.length} document(s) from korb-dosing-data.js v${K.meta.version} on ${BUILD_DATE}`);
  console.log('FH&L is closed in ' + (K.states.unavailable || []).length + ' states: ' + (K.states.unavailable || []).join(', '));
  console.log('HTML renders live from the data file. PDF is a snapshot of this build.');
}

main().catch(e => { console.error(e); process.exit(1); });
