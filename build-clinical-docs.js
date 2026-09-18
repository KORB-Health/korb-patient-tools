#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — CLINICAL REFERENCE BUILDER

   Emits, for each program clinical reference:
     <name>.html   a LIVE shell that loads the program data file and
                   korb-pharmacies.js in the browser and renders through
                   clinical-doc-render.js. Never goes stale.
     <name>.pdf    a fixed snapshot of the same content, for printing or for
                   pinning a version to an audit.

   Both render through the SAME module, so the printed page and the live page
   cannot drift apart.

   USAGE
     node build-clinical-docs.js            build everything
     node build-clinical-docs.js addons     build one, by doc id

   DO NOT EDIT A GENERATED DOCUMENT. Edit the data file and rebuild, or edit
   clinical-doc-render.js. A hand-edit is overwritten by the next build.

   WHY THIS FILE EXISTS
     The Men's Health, Women's Health and Add-On Clinical References were built
     on 2026-09-10 by a ReportLab script that was never committed and no longer
     exists anywhere — not in this repo, not on GitHub, not in the Drive. The
     documents could not be rebuilt, so every correction was a hand-edit with
     nothing to reproduce it from.

     Third time. build-provider-docs.js exists because the eleven GLP-1
     documents were orphaned the same way, and build-fhl-docs.js exists because
     the four FH&L documents were orphaned after that.

   TYPEFACE, AND WHY THE HEADER CARRIES ITS OWN @font-face
     Chromium renders headerTemplate and footerTemplate in a separate document
     that does NOT inherit the page stylesheet. Naming Montserrat there is not
     enough: on a machine with Montserrat installed the header quietly uses the
     system copy, and on one without it falls back to the system sans. The four
     faces are inlined into the templates here so the output is identical
     everywhere.
   ============================================================================ */

const fs = require('fs');
const path = require('path');
const R = require('./clinical-doc-render.js');
const buildDate = require('./build-date.js');

const REPO = __dirname;
const OUT = path.join(REPO, 'Provider_Reference');
/* provider-doc-render.js requires the shared Tebra block as a global in the
   browser, so korb-rx-block.js has to be in the page BEFORE it. Omitting it
   here on 2026-09-14 left this document dead on Pages: provider-doc-render
   threw on RXB.CSS, KORB_DOCS never defined, and the page showed its
   "could not load" guard. The two other builders got the tag; this one did
   not. Add the tag to EVERY builder when a shared module gains a consumer. */
const RXB_REL = '../korb-rx-block.js';
const GLP1_REND_REL = '../provider-doc-render.js';
const REND_REL = '../clinical-doc-render.js';
const PHARM_REL = '../korb-pharmacies.js';

/* Data files are plain browser scripts declaring a global, so they are read
   and evaluated in a sandbox rather than required. Same approach as
   build-fhl-docs.js. */
function loadGlobal(file, globalName) {
  const src = fs.readFileSync(path.join(REPO, file), 'utf8');
  const sandbox = {};
  new Function('exports', 'module', src + '\n;this.OUT = ' + globalName + ';').call(sandbox, {}, {});
  return sandbox.OUT;
}

const PHARMACIES = loadGlobal('korb-pharmacies.js', 'KORB_PHARMACIES');

/* Into the GLOBAL scope, and before any program file, exactly as a page loads
   them. Program data files hydrate their state lists from KORB_PHARMACIES at
   load and build anything derived from it afterwards.

   This line was missing until 2026-09-16 and it produced the silent failure
   this repo keeps re-learning. korb-mens-data.js builds its document sections
   only once hydrated; unhydrated it hydrates nothing, builds nothing, and
   selfCheck skips the routing assertions and prints OK. So the build reported
   success, the typeface check passed, and it wrote a ONE-PAGE PDF of a document
   that is twenty pages long - a title band and nothing under it. The live HTML
   was fine, because a browser loads both scripts, which is exactly what makes
   this shape hard to notice: the thing you click works and the thing you print
   is empty. */
global.KORB_PHARMACIES = PHARMACIES;

/* One row per document: the data file, the global it declares, and the
   renderer id. Adding Men's or Women's Health is one row here plus a
   `document` block in that data file. */
const SOURCES = {
  addons: { dataFile: 'korb-addons-data.js', global: 'KORB_ADDONS' },
  mens: { dataFile: 'korb-mens-data.js', global: 'KORB_MENS' },
  womens: { dataFile: 'korb-womens-data.js', global: 'KORB_WOMENS' }
};

const BUILD_DATE = buildDate();   // LOCAL date - see build-date.js

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

/* The @font-face rules, lifted out of the shared stylesheet so the PDF header
   and footer can carry them too. Read from the CSS rather than copied, so a
   font change in provider-doc-render.js reaches the header as well. */
function fontFaceBlock() {
  const faces = R.CSS.match(/@font-face\{[^}]*\}/g) || [];
  if (!faces.length) {
    console.error('WARNING: no @font-face rules found in the shared stylesheet. ' +
                  'The PDF header and footer will fall back to a system typeface.');
  }
  return faces.join('\n');
}

/* The live shell. Deliberately tiny: everything that could go stale lives in
   the scripts it loads, not in this file. */
function shell(doc, data) {
  const src = SOURCES[doc.id];
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${R.esc(data.document.title)} — KORB Provider Reference</title>
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
<script src="${PHARM_REL}"></script>
<script src="${RXB_REL}"></script>
<script src="../${src.dataFile}"></script>
<script src="${GLP1_REND_REL}"></script>
<script src="${REND_REL}"></script>
<script>
  /* Renders from the data files at page load, so this document is never stale.
     If a script fails to load, say so plainly rather than rendering a
     half-empty page that looks authoritative. */
  (function () {
    if (typeof ${src.global} === 'undefined' || typeof KORB_PHARMACIES === 'undefined' ||
        typeof KORB_CLINICAL_DOCS === 'undefined') {
      document.body.innerHTML = '<p style="font-family:sans-serif;color:#B3261E">' +
        'Could not load ${src.dataFile}, korb-pharmacies.js, provider-doc-render.js or clinical-doc-render.js. ' +
        'This document renders from those files and cannot display without them.</p>';
      return;
    }
    KORB_CLINICAL_DOCS.mount(${JSON.stringify(doc.id)}, ${src.global}, KORB_PHARMACIES);
    var mast = document.createElement('div');
    mast.className = 'mast';
    mast.innerHTML = '<img src="' + KORB_CLINICAL_DOCS.LOGO_URI + '" alt="KORB Health">';
    document.body.insertBefore(mast, document.body.firstChild);
    var bar = document.createElement('div');
    bar.innerHTML = '<span class="live">Live — reflects ${src.dataFile} v' +
      KORB_CLINICAL_DOCS.esc(${src.global}.meta.version) + ' and korb-pharmacies.js v' +
      KORB_CLINICAL_DOCS.esc(KORB_PHARMACIES.meta.version) + ' as of this page load</span>' +
      /* No 'PDF version' link. The provider PDFs were retired 2026-09-17:
         every one had an HTML twin that reads the data files on load, so the
         PDF was a second copy that went stale and made every correction a
         two-place job. The intranet was moved to the HTML links first. Print
         produces a PDF from current data at the moment it is pressed. */
      '<span class="tools">' +
      '<a href="#" onclick="window.print();return false;">Print</a></span>';
    document.body.insertBefore(bar, document.body.firstChild);

    /* Copy to clipboard for the Tebra fields. Delegated rather than bound per
       button, so a rebuild that adds products needs no change here. The
       fallback matters: clipboard.writeText is unavailable on a page served
       over plain http or opened from file://, which is how a provider opening
       this from a shared drive will see it. */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.copybtn') : null;
      if (!btn) return;
      var host = btn.parentNode;
      var text = host.getAttribute('data-copy') || '';
      function done() {
        var prev = btn.textContent;
        btn.textContent = 'copied';
        btn.className = 'copybtn ok';
        setTimeout(function () { btn.textContent = prev; btn.className = 'copybtn'; }, 1400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { legacy(); });
      } else { legacy(); }
      function legacy() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:absolute;left:-9999px;';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* leave the button alone */ }
        document.body.removeChild(ta);
      }
    });
  })();
</script>
</body></html>`;
}

/* The PDF path stamps a real build date, because a printed page is a snapshot
   and should say which one. The live page says "live" instead. */
function printableHtml(doc, data) {
  /* Assert the document is actually there before it becomes a PDF. On
     2026-09-16 the TRT reference built to a ONE-PAGE pdf - a title band over
     nothing - because the builder had not put KORB_PHARMACIES on the global, so
     korb-mens-data.js never hydrated and never built its sections. Every check
     passed: selfCheck skips its routing assertions when unhydrated, the
     typeface check reads a valid PDF, and the live HTML was correct because a
     browser loads both scripts. The printed artefact was the only thing wrong
     and nothing looked at it. */
  const dd = data.document;
  if (!dd || !dd.sections || !dd.sections.length) {
    throw new Error('build-clinical-docs: "' + doc.id + '" has no document sections. ' +
      'If the data file builds them from hydrated state, KORB_PHARMACIES must be on ' +
      'the global BEFORE the data file is loaded.');
  }
  const body = R.renderBody(data, PHARMACIES, { id: doc.id, stamp: 'built ' + BUILD_DATE });
  if (body.length < 4000) {
    throw new Error('build-clinical-docs: "' + doc.id + '" rendered only ' + body.length +
      ' characters. That is a title page, not a document.');
  }
  return `<!doctype html><html><head><meta charset="utf-8">
<title>${R.esc(data.document.title)}</title><style>${R.CSS}</style></head>
<body>${body}</body></html>`;
}

async function main() {
  const only = process.argv[2];
  const list = only ? R.DOCS.filter(d => d.id === only) : R.DOCS;
  if (!list.length) {
    console.error('No document matches "' + only + '". Known ids: ' + R.DOCS.map(d => d.id).join(', '));
    process.exit(1);
  }

  const loaded = {};
  for (const doc of list) {
    const src = SOURCES[doc.id];
    if (!src) { console.error('No data source registered for "' + doc.id + '".'); process.exit(1); }
    loaded[doc.id] = loadGlobal(src.dataFile, src.global);
  }

  /* ---- GATES ------------------------------------------------------------
     A document that states a pharmacy fact of its own, or prices a product it
     has no code for, is the defect this rebuild exists to end. Assert before
     writing anything. */
  const gate = [];

  for (const doc of list) {
    const D = loaded[doc.id];
    const dd = D.document;
    const label = doc.id + ': ';

    if (typeof D.selfCheck === 'function') {
      (D.selfCheck() || []).forEach(p => gate.push(label + 'selfCheck — ' + p));
    }

    /* ST-1. A document that supersedes another cannot be cited without a
       version and an effective date. All three references shipped without
       either. */
    if (!dd.version) gate.push(label + 'document has no version');
    if (!dd.effective) gate.push(label + 'document has no effective date');

    /* ST-3. Clinical protocol carries the entity that holds licensure, not the
       management services organisation. */
    if (!/Medical/.test(dd.entity || '')) {
      gate.push(label + 'entity is "' + dd.entity + '" — clinical protocol must carry the medical PA, not the MSO');
    }

    /* ST-2. The Style Standard forbids an Open Items section outright. */
    (dd.sections || []).forEach(sec => {
      if (/^open items?$/i.test(sec.heading || '')) {
        gate.push(label + 'section "' + sec.heading + '" — the Style Standard forbids an Open Items section; name a decider inline instead');
      }
      if (sec.decider && !sec.decider.owner) {
        gate.push(label + 'section "' + sec.heading + '" raises an open question with no named decider');
      }
    });

    /* PA-1. The review found this document publishing a pharmacy's PREFERRED
       list as its SHIP-TO list. No document may carry a state list at all. */
    const STATE_RE = /\b(?:AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b(?:\s*,\s*\b(?:[A-Z]{2})\b){2,}/;
    const narrative = JSON.stringify(dd.sections || []) + JSON.stringify(dd.intro || '');
    const hit = narrative.match(STATE_RE);
    if (hit) {
      gate.push(label + 'document narrative contains a hardcoded state list ("' + hit[0].slice(0, 40) +
                '…"). State and ship-to facts are read from korb-pharmacies.js and must not be restated.');
    }

    /* Every pharmacy the products use must resolve in the shared layer, or the
       document silently prints a bare key where a pharmacy name belongs. */
    (D.products || []).forEach(p => {
      if (!PHARMACIES.pharmacies[p.pharmacy]) {
        gate.push(label + 'product "' + p.key + '" names pharmacy "' + p.pharmacy + '", which is not in korb-pharmacies.js');
      }
    });

    /* Every group referenced by a section must exist, or the section renders
       empty and reads as though the program has no products. */
    (dd.sections || []).forEach(sec => {
      if (!sec.group) return;
      if (!(D.groups || []).some(g => g.key === sec.group)) {
        gate.push(label + 'section "' + sec.heading + '" renders group "' + sec.group + '", which is not in groups[]');
      }
      if (!(D.products || []).some(p => p.group === sec.group)) {
        gate.push(label + 'section "' + sec.heading + '" renders group "' + sec.group + '", which has no products');
      }
    });

    /* Every product must reach the page. A product in the data file that no
       section renders is invisible to the provider reading the document. */
    const rendered = {};
    (dd.sections || []).forEach(sec => { if (sec.group) rendered[sec.group] = true; });
    (D.products || []).forEach(p => {
      if (!rendered[p.group]) gate.push(label + 'product "' + p.key + '" is in group "' + p.group + '", which no section renders');
    });
  }

  if (gate.length) {
    console.error('REFUSING TO BUILD — ' + gate.length + ' problem(s):');
    gate.forEach(g => console.error('  - ' + g));
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });
  const chromium = loadChromium();
  const browser = await chromium.launch();
  const FONTS = fontFaceBlock();

  for (const doc of list) {
    const D = loaded[doc.id];
    fs.writeFileSync(path.join(OUT, doc.file + '.html'), shell(doc, D));

    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.setContent(printableHtml(doc, D), { waitUntil: 'load' });
    await page.pdf({
      path: path.join(OUT, doc.file + '.pdf'),
      format: 'Letter', printBackground: true,
      margin: { top: '0.85in', bottom: '0.7in', left: '0.6in', right: '0.6in' },
      displayHeaderFooter: true,
      headerTemplate: `<style>${FONTS}</style><div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:5px;border-bottom:1.5px solid #00B2C3;">
          <img src="${R.LOGO_URI}" style="height:26px;width:auto;">
          <div style="text-align:right;font-size:7.5pt;color:#21275B;line-height:1.3;">
            <div style="font-weight:bold;">${R.esc(D.document.title)}</div>
            <div style="font-weight:bold;">${R.esc(D.document.entity)}</div>
          </div>
        </div></div>`,
      footerTemplate: `<style>${FONTS}</style><div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="border-top:1.5px solid #00B2C3;padding-top:5px;display:flex;justify-content:space-between;font-size:7pt;color:#4A4F6B;">
          <span>For KORB internal and provider use only. Do not distribute to patients.</span>
          <span>v${R.esc(D.document.version)} · Page <span class="pageNumber"></span></span>
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
     the kind of defect that ships. The 2026-09-10 review found a non-embedded
     Helvetica resource in all three ReportLab references. */
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
    process.exit(1);
  }
  console.log('Typeface check: all ' + list.length + ' PDFs embed Montserrat only.');

  console.log('');
  list.forEach(doc => {
    const D = loaded[doc.id];
    console.log(`Built ${D.document.title} v${D.document.version} from ${SOURCES[doc.id].dataFile} v${D.meta.version} ` +
                `and korb-pharmacies.js v${PHARMACIES.meta.version} on ${BUILD_DATE}`);
  });
  console.log('HTML renders live from the data files. PDF is a snapshot of this build.');
}

main().catch(e => { console.error(e); process.exit(1); });
