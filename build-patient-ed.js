#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — PATIENT EDUCATION BUILDER

   Emits, for each handout:
     <name>.html   a LIVE page that loads korb-dosing-data.js in the browser and
                   renders through patient-ed-render.js. Route, schedule, timing
                   and active weeks update on the next page load.
     <name>.pdf    a fixed snapshot of the same content, from the same module,
                   for printing or handing over in person.

   USAGE
     node build-patient-ed.js               build all
     node build-patient-ed.js sermorelin    build one, by key

   DO NOT EDIT A GENERATED HANDOUT. Edit korb-patient-ed-data.js and rebuild.

   WHY THIS EXISTS

   The 27 patient documents in this repo were finished PDFs with no source. No
   generator, no markdown, nothing to rebuild them from - so a correction meant
   remaking a PDF by hand, and a patient who downloaded one in March keeps the
   March version forever with no way to reach them.

   Two consequences were visible the moment anyone looked. 25 of the 27 named
   only KORB Health Group, the MSO, on documents giving clinical instruction -
   the same fault fixed in the provider references on 2026-09-14 under open item
   1b, which never covered the patient set. And the clinical facts in them, the
   schedule and the route and the discard rule, were prose: a second copy of
   values that also live in korb-dosing-data.js, free to disagree with the sig
   the patient is actually dispensed.

   Both stop being possible once the document is generated. The entity is in one
   template, and the facts are read rather than retyped.

   Header and footer carry their own @font-face for the same reason the FH&L
   builder does: Chromium renders them in a separate document that does not
   inherit the page stylesheet.
   ============================================================================ */

const fs = require('fs');
const path = require('path');
const R = require('./patient-ed-render.js');
const DATA = require('./korb-patient-ed-data.js');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'Patient_Education');
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/* korb-dosing-data.js is a browser global, not a module. */
function loadDosing() {
  const sandbox = {};
  const ph = fs.readFileSync(path.join(ROOT, 'korb-pharmacies.js'), 'utf8');
  new Function('exports', 'module', ph + '\n;this.KORB_PHARMACIES=KORB_PHARMACIES;').call(sandbox, {}, {});
  global.KORB_PHARMACIES = sandbox.KORB_PHARMACIES;
  const src = fs.readFileSync(path.join(ROOT, 'korb-dosing-data.js'), 'utf8');
  new Function('exports', 'module', src + '\n;this.KORB_DOSING=KORB_DOSING;').call(sandbox, {}, {});
  const D = sandbox.KORB_DOSING;
  if (D.hydrate) D.hydrate(sandbox.KORB_PHARMACIES);
  return D;
}

/* The GLP-1 handouts read a different file. Loaded separately rather than
   merged: one file per program is the repo's rule, and a handout should fail
   loudly if it names the wrong source rather than find a value by accident. */
function loadGlp1() {
  const sandbox = {};
  global.KORB_PHARMACIES = global.KORB_PHARMACIES || null;
  const src = fs.readFileSync(path.join(ROOT, 'korb-glp1-data.js'), 'utf8');
  new Function('exports', 'module', src + '\n;this.KORB_GLP1=KORB_GLP1;').call(sandbox, {}, {});
  const G = sandbox.KORB_GLP1;
  if (G.hydrate) G.hydrate(global.KORB_PHARMACIES);
  return G;
}

/* Which data file a handout reads. */
function sourceFor(doc, DOSING, GLP1) { return doc.source === 'glp1' ? GLP1 : DOSING; }

function loadChromium() {
  for (const t of ['playwright', 'playwright-core', 'puppeteer']) {
    try { return require(t).chromium || require(t); } catch (e) { /* next */ }
  }
  return null;
}

function fontFaceBlock() {
  const faces = R.CSS.match(/@font-face\{[^}]*\}/g) || [];
  if (!faces.length) {
    console.error('WARNING: no @font-face rules in the shared stylesheet; the PDF ' +
                  'header and footer will fall back to a system typeface.');
  }
  return faces.join('\n');
}

const SCREEN = `
@media screen {
  /* Layout only. FONT SIZES LIVE IN ONE PLACE, the @media screen block at the
     end of CSS in provider-doc-render.js. Do not add sizes here. */
  html { background: #ECE9D1; }   /* brand cream, the desk */
  body { max-width: 8.5in; margin: 0 auto; padding: 28px 26px 60px; background: #FBFAF6;
         border: 1px solid #DEDBC4; border-top: 0; border-bottom: 0; min-height: 100vh; }
  .live { font-family: Montserrat, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 10px;
          letter-spacing: .06em; text-transform: uppercase; color: #1E6B4F; background: #E9F3EE;
          border: 1px solid #C3E0D2; padding: 4px 9px; display: inline-block; margin-bottom: 14px; }
  .tools { float: right; font-family: Montserrat, Helvetica, Arial, sans-serif; font-weight: 600; font-size: 12px; }
  .tools a { color: #0F5F69; margin-left: 12px; }
  .mast { border-bottom: 1.5px solid #00B2C3; padding-bottom: 7px; margin-bottom: 16px; }
  .mast img { height: 34px; width: auto; display: block; }
}`;

function masthead(doc, live) {
  return `<div class="mast"><div class="tools">` +
    `<a href="${doc.file}.pdf">PDF version</a><a href="#" onclick="window.print();return false;">Print</a>` +
    `</div><img src="${R.LOGO_URI}" alt="KORB Health"></div>` +
    (live && doc.source !== 'none'
      ? `<div class="live">Live — reflects ${doc.source === 'glp1' ? 'korb-glp1-data.js' : 'korb-dosing-data.js'} as of this page load</div>`
      : '') +
    `<div class="titleband"><h1>${R.esc(doc.title)}</h1>` +
    `<p class="sub">Patient Education · ${R.esc(doc.program)}</p></div>` +
    `<p class="byline">KORB Health Medical Texas PA · Patient education · ` +
    (live ? `live — reflects the data file as of this page load` : `built ${BUILD_DATE}`) + `</p>`;
}

/* The live page. Deliberately small: everything that could go stale is in the
   scripts it loads. */
function shell(doc) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${R.esc(doc.title)} — KORB Patient Education</title>
<style>
${R.CSS}
${SCREEN}
</style>
</head><body>
<div id="doc"></div>
<!-- provider-doc-render.js is NOT loaded here. Its CSS and logo are inlined
     into this page at build time, so nothing needs it at runtime - and it
     expects korb-glp1-data.js, which a peptide handout has no reason to load.
     Loading it threw "Cannot read properties of undefined (reading CSS)" in
     the console of every generated handout. Harmless, because the styling was
     already inlined, and still a broken script on a patient-facing page. -->
<script src="../korb-pharmacies.js"></script>
${doc.source === 'none' ? '' : doc.source === 'glp1' ? '<script src="../korb-glp1-data.js"></script>' : '<script src="../korb-dosing-data.js"></script>'}
<script src="../korb-patient-ed-data.js"></script>
<script src="../patient-ed-render.js"></script>
<script>
  (function () {
    var D = ${doc.source === 'none' ? 'null' : doc.source === 'glp1' ? 'KORB_GLP1' : 'KORB_DOSING'};
    if (D && D.hydrate && !D.hydrated) { D.hydrate(KORB_PHARMACIES); }
    var doc = KORB_PATIENT_ED.docs[${JSON.stringify(doc.key)}];
    var R = KORB_PATIENT_ED_DOCS;
    document.getElementById('doc').innerHTML =
      ${JSON.stringify(masthead(doc, true))} + R.renderBody(KORB_PATIENT_ED, D, doc);
  }());
</script>
</body></html>`;
}

function printableHtml(DOSING, doc) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${R.esc(doc.title)}</title>
<style>${R.CSS}</style></head><body>
${R.renderBody(DATA, DOSING, doc)}
</body></html>`;
}

(async function main() {
  const DOSING = loadDosing();
  const GLP1 = loadGlp1();
  const want = process.argv[2];
  const keys = Object.keys(DATA.docs).filter(k => !want || k === want);
  if (!keys.length) {
    console.error('No handout "' + want + '". Known: ' + Object.keys(DATA.docs).join(', '));
    process.exit(1);
  }

  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  /* Fail the build if a handout names an agent the dosing data does not have.
     Better a stopped build than a handout with a blank schedule. */
  keys.forEach(k => R.agentFacts(sourceFor(DATA.docs[k], DOSING, GLP1), DATA.docs[k]));

  for (const k of keys) {
    const doc = DATA.docs[k];
    /* The PUBLISHED name, never derived from the title. Deriving it produced
       KORB_Patient_Ed_CJC_1295_Ipamorelin, which would have sat beside the
       published KORB_Patient_Ed_CJC_Ipamorelin rather than replacing it - two
       handouts for one drug, which is the drift this whole exercise removes. */
    if (!doc.file) throw new Error('handout "' + k + '" has no published file name.');
    const p = path.join(OUT, doc.file + '.html');
    fs.writeFileSync(p, shell(Object.assign({}, doc, { key: k })));
    console.log(`  ${path.basename(p)}  html ${String(fs.statSync(p).size).padStart(6)}`);
  }

  const chromium = loadChromium();
  if (!chromium) {
    console.log('\n  PDFs were NOT refreshed: no Chromium available.');
    console.log('  npm install && npx playwright install chromium');
    return;
  }

  const browser = await chromium.launch();
  const FONTS = fontFaceBlock();
  for (const k of keys) {
    const doc = DATA.docs[k];
    const base = doc.file;
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    await page.setContent(printableHtml(sourceFor(doc, DOSING, GLP1), doc), { waitUntil: 'load' });
    await page.pdf({
      path: path.join(OUT, base + '.pdf'),
      format: 'Letter', printBackground: true,
      margin: { top: '0.85in', bottom: '0.7in', left: '0.6in', right: '0.6in' },
      displayHeaderFooter: true,
      headerTemplate: `<style>${FONTS}</style><div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:5px;border-bottom:1.5px solid #00B2C3;">
          <img src="${R.LOGO_URI}" style="height:26px;width:auto;">
          <div style="text-align:right;font-size:7.5pt;color:#21275B;line-height:1.3;">
            <div style="font-weight:bold;">${R.esc('Patient Education · ' + doc.title)}</div>
            <div style="font-weight:bold;">KORB Health Medical Texas PA</div>
          </div>
        </div></div>`,
      footerTemplate: `<style>${FONTS}</style><div style="width:100%;padding:0 0.6in;font-family:Montserrat,Helvetica,Arial,sans-serif;">
        <div style="border-top:1.5px solid #00B2C3;padding-top:5px;display:flex;justify-content:space-between;font-size:7pt;color:#4A4F6B;">
          <span>Educational reference only. Follow your prescription label and your KORB provider's guidance.</span>
          <span>Page <span class="pageNumber"></span></span>
        </div></div>`
    });
    await page.close();
    console.log(`  ${base}  pdf ${String(fs.statSync(path.join(OUT, base + '.pdf')).size).padStart(7)}` +
                (errs.length ? '  ERRORS: ' + errs.join('|') : ''));
  }
  await browser.close();

  console.log(`\nBuilt ${keys.length} handout(s) from korb-patient-ed-data.js v${DATA.meta.version} ` +
              `and korb-dosing-data.js v${DOSING.meta.version} on ${BUILD_DATE}`);
  console.log('HTML renders live from the data files. PDF is a snapshot of this build.');
}());
