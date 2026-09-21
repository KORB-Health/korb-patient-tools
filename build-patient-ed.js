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
const buildDate = require('./build-date.js');
const DATA = require('./korb-patient-ed-data.js');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'Patient_Education');
const BUILD_DATE = buildDate();   // LOCAL date - see build-date.js

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

/* The Men's Health handout reads korb-mens-data.js. Loaded the same way and
   for the same reason as the GLP-1 one: one file per program, and a handout
   that names the wrong source should fail loudly rather than find a value by
   accident. */
function loadMens() {
  const sandbox = {};
  global.KORB_PHARMACIES = global.KORB_PHARMACIES || null;
  const src = fs.readFileSync(path.join(ROOT, 'korb-mens-data.js'), 'utf8');
  new Function('exports', 'module', src + '\n;this.KORB_MENS=KORB_MENS;').call(sandbox, {}, {});
  const M = sandbox.KORB_MENS;
  if (M.hydrate) M.hydrate(global.KORB_PHARMACIES);
  return M;
}

/* Which data file a handout reads. */
function sourceFor(doc, S) { return S[doc.source] || S.dosing; }

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

/* One map, three uses: the script tag, the global, and the name in the live
   badge. They were three separate ternaries and adding a fourth source meant
   editing all three and hoping. A handout whose badge names the wrong data file
   is a small lie on a patient-facing page. */
const SOURCE_FILE   = { glp1: 'korb-glp1-data.js', mens: 'korb-mens-data.js',
                        dosing: 'korb-dosing-data.js' };
const SOURCE_GLOBAL = { glp1: 'KORB_GLP1', mens: 'KORB_MENS', dosing: 'KORB_DOSING' };
function sourceKey(doc) { return doc.source === 'none' ? null : (SOURCE_FILE[doc.source] ? doc.source : 'dosing'); }

function masthead(doc, live) {
  return `<div class="mast"><div class="tools">` +
    /* No 'PDF version' link. The stored patient PDFs were retired on
       2026-09-17: they drifted from the page, and 14 of the 16 still named
       KORB Health Group on clinical instruction after the HTML was fixed.
       Print produces a PDF from current data at the moment it is pressed,
       which is what the stored file was pretending to be. */
    `<a href="#" onclick="window.print();return false;">Print</a>` +
    `</div><img src="${R.LOGO_URI}" alt="KORB Health"></div>` +
    (live && doc.source !== 'none'
      /* No data-file banner on a patient page. It named korb-dosing-data.js to
         someone who was texted a link, which is build plumbing, not patient
         information. Provider references keep theirs. */
      ? '' : '') +
    `<div class="titleband"><h1>${R.esc(doc.title)}</h1>` +
    `<p class="sub">Patient Education · ${R.esc(doc.program)}</p></div>` +
    `<p class="byline">KORB Health Medical Texas PA · Patient education</p>`;
}

/* A hub carries its own hero, so it gets the logo bar and nothing else - no
   titleband, no byline. renderHubBody draws the rest. */
function hubMasthead() {
  return `<div class="mast hub-mast"><div class="tools">` +
    `<a href="#" onclick="window.print();return false;">Print</a>` +
    `</div><img src="${R.LOGO_URI}" alt="KORB Health"></div>`;
}

/* EVERY PATIENT PAGE IS BUILT HERE, not just the nine handouts.

   Until 2026-09-18 this builder emitted DATA.docs and nothing else. The
   thirteen guides and four program overviews - which include every document
   the release record lists as LIVE to patients, both welcome letters and the
   lab page - were written to disk by something that is not in this repo. They
   had no generator at all.

   That is not a filing complaint. Each of those pages inlines the shared
   stylesheet at BUILD time, so a fix to provider-doc-render.js reaches the
   nine handouts on the next build and reaches the other seventeen never. The
   Storage table on the patient safety guide was the case that exposed it: the
   rule was corrected, the handouts rebuilt, and the page Don was looking at
   did not move, because nothing could rebuild it.

   THE COLLECTION DECIDES THE RENDERER, and the doc decides the rest:
     docs      renderBody         a single agent
     programs  renderProgramBody  a tier
     guides    renderGuideBody    everything else, or renderHubBody if hub
   `root: true` publishes to the repo root rather than Patient_Education/,
   which changes the depth of every script tag. */
const COLLECTIONS = ['docs', 'programs', 'guides'];

/* AUTHORING RULES ARE ENFORCED HERE, NOT IN THE RENDERER.

   A guide section key that renderGuideBody does not know renders nothing at
   all. `callout` was written into the Injection, Storage and Safety Guide on
   2026-09-21 and simply did not appear: no error, no empty box, the page built
   and would have shipped without it.

   The first attempt at a guard threw inside renderGuideBody. These pages render
   in the BROWSER, so it threw at the PATIENT - the page came back with a body
   length of zero, a white screen. Proven by planting a bad key and loading the
   page, not reasoned about. The renderer logs now, and the failure lives here,
   where it costs a build and not a reader. */
function checkGuideKeys() {
  const known = R.GUIDE_KEYS;
  if (!known) { throw new Error('patient-ed-render.js does not export GUIDE_KEYS'); }
  const bad = [];
  Object.keys(DATA.guides || {}).forEach(key => {
    const g = DATA.guides[key];
    if (g.hub) { return; }   // renderHubBody has its own shape
    (g.sections || []).forEach(sec => {
      Object.keys(sec).forEach(k => {
        if (known.indexOf(k) === -1) {
          bad.push('guides.' + key + ' section "' + (sec.h || '?') + '" has key "' + k +
                   '", which renderGuideBody does not render. It would disappear silently.');
        }
      });
    });
  });
  if (bad.length) {
    bad.forEach(b => console.error('build-patient-ed: ' + b));
    process.exit(1);
  }
}
checkGuideKeys();

function targets(want) {
  const out = [];
  COLLECTIONS.forEach(coll => {
    Object.keys(DATA[coll]).forEach(key => {
      const doc = Object.assign({}, DATA[coll][key], { key: key });
      if (!doc.file) {
        throw new Error(coll + '.' + key + ' has no published file name. Add `file:` ' +
          'to korb-patient-ed-data.js. Do NOT derive it from the title - ' +
          'KORB_MensHealth_Program_Overview is not what a deriver would produce.');
      }
      if (want && key !== want) { return; }
      const renderer = coll === 'docs' ? 'renderBody'
                     : coll === 'programs' ? 'renderProgramBody'
                     : doc.hub ? 'renderHubBody' : 'renderGuideBody';
      out.push({ coll, key, doc, renderer,
                 /* docs carry a bare stem, guides and programs a repo-relative
                    path. Neither is derived: both are what is already published. */
                 rel: (doc.file.indexOf('/') >= 0 || doc.root
                        ? doc.file : 'Patient_Education/' + doc.file) + '.html',
                 up: doc.root ? '' : '../' });
    });
  });
  return out;
}

/* The live page. Deliberately small: everything that could go stale is in the
   scripts it loads. */
function shell(t) {
  const doc = t.doc;
  const head = t.renderer === 'renderHubBody' ? hubMasthead() : masthead(doc, true);
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${R.esc(doc.title)} — KORB Patient Education</title>
<style>
${R.CSS}
${SCREEN}
/* The pill and panel rules, on EVERY patient page rather than emitted by
   whichever renderer happens to need them. ways() and screening() render
   buttons and neither sits near a links() call. */
${R.CHOICE_CSS}
</style>
</head><body>
<div id="doc"></div>
<!-- provider-doc-render.js is NOT loaded here. Its CSS and logo are inlined
     into this page at build time, so nothing needs it at runtime - and it
     expects korb-glp1-data.js, which a peptide handout has no reason to load.
     Loading it threw "Cannot read properties of undefined (reading CSS)" in
     the console of every generated handout. Harmless, because the styling was
     already inlined, and still a broken script on a patient-facing page. -->
<script src="${t.up}korb-pharmacies.js"></script>
${sourceKey(doc) ? `<script src="${t.up}${SOURCE_FILE[sourceKey(doc)]}"></script>` : ''}
${/* A page may read a SECOND program's data. The GLP-1 welcome letter loads
      korb-glp1-data.js beside korb-dosing-data.js, and the first version of
      this generator dropped it: the page still rendered identically, so only
      check-pages noticed - 75 module loads became 74. A script tag that is not
      needed TODAY is still the difference between a page that keeps working
      when a section starts reading that file and one that fails on a patient's
      phone. Declared in the data file, never inferred. */''}
${(doc.alsoLoad || []).map(k => `<script src="${t.up}${SOURCE_FILE[k]}"></script>`).join('\n')}
<script src="${t.up}korb-quest.js"></script>
<script src="${t.up}korb-patient-ed-data.js"></script>
<script src="${t.up}patient-ed-render.js"></script>
<script>
  (function () {
    var D = ${sourceKey(doc) ? SOURCE_GLOBAL[sourceKey(doc)] : 'null'};
    if (D && D.hydrate && !D.hydrated) { D.hydrate(KORB_PHARMACIES); }
    KORB_PATIENT_ED.hydrate(KORB_QUEST);
    var doc = KORB_PATIENT_ED.${t.coll}[${JSON.stringify(t.key)}];
    var R = KORB_PATIENT_ED_DOCS;
    document.getElementById('doc').innerHTML =
      ${JSON.stringify(head)} + R.${t.renderer}(KORB_PATIENT_ED, D, doc);
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
  const S = { dosing: DOSING, glp1: loadGlp1(), mens: loadMens() };
  const want = process.argv[2];
  const list = targets(want);
  if (!list.length) {
    const all = COLLECTIONS.reduce((a, c) => a.concat(Object.keys(DATA[c])), []);
    console.error('No patient page "' + want + '". Known: ' + all.join(', '));
    process.exit(1);
  }

  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

  /* Fail the build if a handout names an agent the dosing data does not have.
     Better a stopped build than a handout with a blank schedule. Only the
     handouts pull agent facts; a guide or a tier has no single agent. */
  list.filter(t => t.coll === 'docs')
      .forEach(t => R.agentFacts(sourceFor(t.doc, S), t.doc));

  for (const t of list) {
    /* A page that is not `root: true` belongs in Patient_Education/. An early
       version of this loop joined a bare stem onto ROOT and wrote nine handouts
       to the repo root, beside the real ones, where they looked exactly as
       published as the originals - the same shape as the injection tracker the
       repo deleted for sitting in the tree looking finished. Cheap to assert,
       invisible without it. */
    if (!t.doc.root && t.rel.indexOf('Patient_Education/') !== 0) {
      throw new Error(t.coll + '.' + t.key + ' is not root: true but would publish to "' +
        t.rel + '". Patient pages go in Patient_Education/ unless they are root.');
    }
    const p = path.join(ROOT, t.rel);
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(p, shell(t));
    console.log(`  ${t.coll.padEnd(8)} ${t.rel.padEnd(56)} ${String(fs.statSync(p).size).padStart(6)}`);
  }

  /* NO PDF PHASE. All 43 stored PDFs were retired on 2026-09-17 because a
     stored file is a second copy that drifts - it is how 14 of the 16 patient
     documents kept naming KORB Health Group, the MSO, on clinical instruction
     long after the HTML byline had been corrected to the PA.

     This builder went on writing all nine of them anyway. The retirement
     removed the "PDF version" LINK from the pages and from the builders, and
     nobody removed the pdf() call, so any run of this script quietly recreated
     the exact files the repo had decided to delete. Found on 2026-09-18 by
     running it. If anyone needs a file they press Print, which builds one from
     current data at that moment.

     Do not reintroduce this. */

  const by = c => list.filter(t => t.coll === c).length;
  console.log(`\nBuilt ${list.length} patient page(s) - ${by('docs')} handout(s), ` +
              `${by('programs')} program overview(s), ${by('guides')} guide(s) - from ` +
              `korb-patient-ed-data.js v${DATA.meta.version} and ` +
              `korb-dosing-data.js v${DOSING.meta.version} on ${BUILD_DATE}`);
  console.log('Every page renders live from the data files. No PDFs: retired 2026-09-17.');
}());
