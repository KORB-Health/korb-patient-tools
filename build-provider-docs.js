#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — GLP-1 PROVIDER REFERENCE BUILDER

   Emits, for each of the eleven documents:
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
     The eleven documents originally in the repo were generated on 2026-08-09 by
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

const REPO = __dirname;
const OUT = path.join(REPO, 'Provider_Reference', 'GLP1');
const DATA_REL = '../../korb-glp1-data.js';
const REND_REL = '../../provider-doc-render.js';

const K = (function () {
  const src = fs.readFileSync(path.join(REPO, 'korb-glp1-data.js'), 'utf8');
  const sandbox = {};
  new Function('exports', 'module', src + '\n;this.KORB_GLP1 = KORB_GLP1;').call(sandbox, {}, {});
  return sandbox.KORB_GLP1;
})();

const BUILD_DATE = new Date().toISOString().slice(0, 10);

/* The live shell. Deliberately tiny: everything that could go stale lives in
   the two scripts it loads, not in this file. Screen styling only - the print
   stylesheet is the same CSS the PDF uses, so Ctrl+P from the browser gives
   the same document. */
function shell(doc) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${R.esc(doc.title)} — GLP-1 Provider Reference</title>
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
    mast.innerHTML = '<img src="' + KORB_DOCS.LOGO_URI + '" alt="KORB Health Group">';
    document.body.insertBefore(mast, document.body.firstChild);
    var bar = document.createElement('div');
    bar.innerHTML = '<span class="live">Live — reflects korb-glp1-data.js v' +
      KORB_DOCS.esc(KORB_GLP1.meta.version) + ' as of this page load</span>' +
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
  if (!list.length) { console.error('No document matches "' + only + '"'); process.exit(1); }

  const problems = K.selfCheck();
  if (problems.length) {
    console.error('REFUSING TO BUILD — korb-glp1-data.js has ' + problems.length + ' selfCheck problem(s).');
    problems.forEach(p => console.error('  - ' + p));
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
  const browser = await chromium.launch();

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
      /* Running header: KORB lockup left, document identity right, teal rule
         beneath - the same masthead the FH&L provider references carry, so a
         page torn out of either set is recognisably from the same library.
         The logo is a data URI because Chromium's header template has no
         document base URL and silently drops a file:// or relative image. */
      headerTemplate: `<div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:5px;border-bottom:1.5px solid #00B2C3;">
          <img src="${R.LOGO_URI}" style="height:26px;width:auto;">
          <div style="text-align:right;font-size:7.5pt;color:#21275B;line-height:1.3;">
            <div style="font-weight:bold;">${R.esc('GLP-1 Provider Reference · ' + doc.title)}</div>
            <div style="font-weight:bold;">KORB Health Group</div>
          </div>
        </div></div>`,
      footerTemplate: `<div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="border-top:1.5px solid #00B2C3;padding-top:5px;display:flex;justify-content:space-between;font-size:7pt;color:#4A4F6B;">
          <span>For KORB provider use only. Not for patient distribution.</span>
          <span>Page <span class="pageNumber"></span></span>
        </div></div>`
    });
    await page.close();
    const pdfBytes = fs.statSync(path.join(OUT, doc.file + '.pdf')).size;
    const htmlBytes = fs.statSync(path.join(OUT, doc.file + '.html')).size;
    console.log(`  ${doc.file}  html ${String(htmlBytes).padStart(5)}  pdf ${String(pdfBytes).padStart(7)}${errs.length ? '  ERRORS: ' + errs.join('|') : ''}`);
  }
  await browser.close();

  /* Every produced PDF must carry ONLY the brand typeface. A dropped @font-face
     falls back to Helvetica silently and the page still looks plausible, which
     is exactly the kind of defect that ships. Regression-tested by renaming the
     family in the CSS: the build fails. */
  const offBrand = [];
  for (const doc of list) {
    const buf = fs.readFileSync(path.join(OUT, doc.file + '.pdf'));
    const faces = new Set();
    const re = /\/BaseFont\s*\/([A-Za-z0-9+\-,]+)/g;
    let m; const str = buf.toString('latin1');
    while ((m = re.exec(str)) !== null) faces.add(m[1].split('+').pop());
    [...faces].filter(f => !/^Montserrat/.test(f))
              .forEach(f => offBrand.push(doc.file + ': ' + f));
  }
  if (offBrand.length) {
    console.error('BUILD FAILED — non-brand typeface embedded in the PDF output:');
    offBrand.forEach(x => console.error('  - ' + x));
    console.error('The KORB guidelines specify Montserrat. Check the @font-face data URIs in provider-doc-render.js.');
    process.exit(1);
  }
  console.log('Typeface check: all ' + list.length + ' PDFs embed Montserrat only.');

  console.log(`\nBuilt ${list.length} document(s) from korb-glp1-data.js v${K.meta.version} on ${BUILD_DATE}`);
  console.log('HTML renders live from the data file. PDF is a snapshot of this build.');
}

main().catch(e => { console.error(e); process.exit(1); });
