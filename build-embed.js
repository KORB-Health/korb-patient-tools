#!/usr/bin/env node
/*
   KORB — EMBEDDED DATA BUILD

   The provider tools are standalone HTML. They are opened from GitHub Pages,
   embedded in Google Sites through an Apps Script web app, and sometimes just
   double-clicked from a folder. A <script src="../korb-glp1-data.js"> works in
   the first case and fails in the other two, so each tool carries an embedded
   copy of the data it needs.

   That copy is the drift risk this script exists to remove. The data files are
   the source of truth; the embedded blobs are generated. Never hand-edit a blob.

   USAGE
     node build-embed.js            regenerate every embedded blob
     node build-embed.js --check    verify only, exit 1 if anything has drifted

   --check is the one to run before committing, and is what a CI step would call.

   HOW IT WORKS
     Each target names a data file, a variable to embed, and a marker pair in the
     HTML. The generated block carries a fingerprint of the data it came from, so
     drift is detectable without re-deriving anything.
*/

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* The repo root is wherever korb-glp1-data.js lives. Resolving it rather than
   assuming __dirname means this script still works if it is dropped into
   Provider_Reference/ instead of the root, which is an easy upload to get
   wrong and an unhelpful thing to fail on. */
const ROOT = (function findRoot() {
  let dir = __dirname;
  for (let i = 0; i < 4; i++) {
    if (fs.existsSync(path.join(dir, 'korb-glp1-data.js'))
        && fs.existsSync(path.join(dir, 'Provider_Reference'))) return dir;
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return __dirname;
})();

const CHECK_ONLY = process.argv.indexOf('--check') > -1;

/* ---- what gets embedded where ---------------------------------------- */

const TARGETS = [
  /* The GLP-1 Provider Tool was a target until 2026-09-17, when it was retired
     to a redirect: it produced the same 150 Tebra entries as the ten signed
     monographs, zero unique to either. Removed from TARGETS rather than left
     pointing at a redirect, which would have had every build rewrite a page
     with no data in it. The orphan scan below still covers that file, so an
     embedded block reappearing there fails the build. */
  {
    html: 'Provider_Reference/KORB_Optimization_Products.html',
    varName: 'ADDONS',
    source: 'korb-addons-data.js',
    /* The selector used to build its catalogue procedurally inside the page,
       which is how it drifted from every other tool in the first place. It now
       filters this array by pharmacy and sex. Field names are the selector's,
       not the data file's, so the render layer is untouched. */
    project: function (mod) {
      /* Within a category the selector renders in array order, so the order is
         fixed here rather than left to however the data file happens to be
         sorted. Primary product first, secondary presentations after it. */
      const RANK = {
        'KORB Rise': 1, 'PERFORM': 1, 'KORB Electric': 1,
        'PT-141 injection': 2, 'PT-141 nasal spray': 2,
        'Finasteride 1 mg': 1, 'Spironolactone 50 mg': 1,
        'Topical foam': 1, 'Topical spray': 1,
        'Tretinoin cream': 1, 'Estriol cream 0.3%': 2, 'Combo cream': 3,
        'NAD+': 1, 'NAD+ nasal spray': 2, 'NAD+ FastSL sublingual': 3,
        'Metformin ER 500 mg': 4
      };
      const ordered = mod.products.slice().sort(function (a, b) {
        const ra = RANK[a.name], rb = RANK[b.name];
        if (ra === undefined || rb === undefined) {
          throw new Error('build-embed: no display rank for "' + (RANK[a.name] === undefined ? a.name : b.name)
                        + '". Add it to RANK in build-embed.js.');
        }
        return ra - rb;
      });
      return ordered.map(function (p) {
        const rec = {
          key: p.key,
          pharmacy: p.pharmacy,
          sex: p.sex,
          cat: p.category,
          name: p.name,
          price: p.price,
          code: p.chargeCode,
          form: p.formulation,
          dose: p.dosing,
          supply: p.supply,
          /* Four products (PT-141 both routes, the two Belmar NAD+ forms) have a
             confirmed name, formulation and days but no sig or quantity yet.
             Those stay null so the field table can say so, rather than printing
             the string "null" into a field a provider would paste into Tebra. */
          t: {
            form: p.drugFormulation || null,
            label: p.tebra.name || null,
            sig: p.tebra.sig || null,
            qty: p.tebra.quantity === null || p.tebra.quantity === undefined
                 ? null : String(p.tebra.quantity),
            unit: p.tebra.unit || null,
            days: p.tebra.days === null || p.tebra.days === undefined
                  ? null : String(p.tebra.days),
            reason: p.tebra.reasonForCompounding || '',
            notes: p.tebra.pharmacyNotes || ''
          }
        };
        /* COMMERCIAL products are picked from the Tebra drop-down, so the tool
           needs to know which they are and what the drop-down entry is called.
           Without this the selector would keep offering a copy button on a name
           that will not transmit. Same rule as the clinical reference. */
        if (p.commercial) {
          rec.commercial = true;
          rec.dd = p.dropdownEntry || p.drugFormulation;
        }
        /* EXTRA STRENGTHS. Tretinoin is prescribed at three, and the selector
           previously showed only the first, so a provider wanting 0.05% had no
           entry to copy and had to edit one by hand. Each is carried whole, the
           same rule the reference follows: never factor, never generate. The
           label is the strength, read off the formulation it belongs to. */
        function strengthOf(text) {
          var m = /(\d+(?:\.\d+)?\s*%)/.exec(String(text || ''));
          return m ? m[1].replace(/\s+/g, '') : null;
        }
        var alts = (p.tebraAlso || []).map(function (a) {
          return {
            s: strengthOf(a.drugFormulation) || a.name,
            /* The drop-down name at THIS strength, for a commercial product. */
            dd: a.dropdownEntry || null,
            form: a.drugFormulation || null,
            label: a.name || null,
            sig: a.sig || null,
            qty: a.quantity === null || a.quantity === undefined ? null : String(a.quantity),
            unit: a.unit || null,
            days: a.days === null || a.days === undefined ? null : String(a.days),
            reason: a.reasonForCompounding || '',
            notes: a.pharmacyNotes || ''
          };
        });
        if (alts.length) {
          rec.t.s = strengthOf(p.drugFormulation) || 'Standard';
          rec.alt = alts;
        }
        if (p.nitrateContraindicated) { rec.nitrate = true; }
        if (p.warn) { rec.warn = p.warn; }
        if (p.warnAmber) { rec.warnAmber = p.warnAmber; }
        if (p.note) { rec.note = p.note; }
        if (p.monitor) { rec.monitor = p.monitor; }
        return rec;
      });
    }
  }
];

/* Order here is the order the duration control renders. `rx` is the single
   fill length the oral products come in. */
const FILL_KEYS = ['supply4', 'supply8', 'rx', 'rx4', 'rx8', 'rx12', 'rx30', 'rx60', 'rx90'];

function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

function labelFor(k) {
  return { supply4: '4-Week Supply', supply8: '8-Week Supply', rx: 'Standard Supply',
           rx4: '4-Week', rx8: '8-Week', rx12: '12-Week',
           rx30: '30-Day', rx60: '60-Day', rx90: '90-Day' }[k] || k;
}

/* ---- markers ---------------------------------------------------------- */

function beginMarker(v) { return '/* BEGIN GENERATED ' + v + ' — build-embed.js, do not edit by hand */'; }
function endMarker(v) { return '/* END GENERATED ' + v + ' */'; }

function fingerprint(obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 12);
}

function block(varName, data, sourceFile) {
  const fp = fingerprint(data);
  return beginMarker(varName) + '\n'
       + '/* source: ' + sourceFile + '  fingerprint: ' + fp + ' */\n'
       + 'var ' + varName + ' = ' + JSON.stringify(data) + ';\n'
       + endMarker(varName);
}

/* ---- run -------------------------------------------------------------- */

/* Exported so a test can call the projection and diff it against what is
   currently embedded, without this script writing anything. */
module.exports = { TARGETS: TARGETS, block: block, fingerprint: fingerprint,
                   beginMarker: beginMarker, endMarker: endMarker };

if (require.main !== module) { return; }

let changed = 0, drifted = 0, skipped = 0;

TARGETS.forEach(function (t) {
  const htmlPath = path.join(ROOT, t.html);
  const srcPath = path.join(ROOT, t.source);

  if (!fs.existsSync(htmlPath)) { console.log('  skip   ' + t.html + ' (not found)'); skipped++; return; }
  if (!fs.existsSync(srcPath))  { console.log('  skip   ' + t.source + ' (not found)'); skipped++; return; }

  delete require.cache[require.resolve(srcPath)];
  const mod = require(srcPath);
  const data = t.project(mod);
  const fresh = block(t.varName, data, t.source);

  /* Normalised to LF before anything compares it. The generated block below is
     assembled with '\n' only, so on a CRLF checkout - which is what
     core.autocrlf=true gives every Windows clone of this repo - `current ===
     fresh` could never match, and --check reported DRIFT on both targets no
     matter what the data actually said. A checker that cries wolf erodes trust
     in itself as fast as one that never looks, and this repo has now produced
     both kinds. Git stores these files with LF regardless, so writing LF back
     is what the repository already holds. */
  let html = fs.readFileSync(htmlPath, 'utf8').replace(/\r\n/g, '\n');
  const begin = beginMarker(t.varName);
  const end = endMarker(t.varName);
  const i = html.indexOf(begin);
  const j = html.indexOf(end);

  if (i > -1 && j > i) {
    const current = html.slice(i, j + end.length);
    if (current === fresh) { console.log('  ok     ' + t.html + ' (' + t.varName + ' current)'); return; }
    drifted++;
    if (CHECK_ONLY) { console.log('  DRIFT  ' + t.html + ' (' + t.varName + ' differs from ' + t.source + ')'); return; }
    html = html.slice(0, i) + fresh + html.slice(j + end.length);
    fs.writeFileSync(htmlPath, html);
    console.log('  update ' + t.html + ' (' + t.varName + ')');
    changed++;
    return;
  }

  /* No markers yet. Wrap an existing `var NAME = {...};` if one is there. */
  const plain = new RegExp('var\\s+' + t.varName + '\\s*=\\s*\\{[\\s\\S]*?\\};');
  if (plain.test(html)) {
    drifted++;
    if (CHECK_ONLY) { console.log('  DRIFT  ' + t.html + ' (' + t.varName + ' not yet marked as generated)'); return; }
    html = html.replace(plain, fresh);
    fs.writeFileSync(htmlPath, html);
    console.log('  wrap   ' + t.html + ' (' + t.varName + ' now generated)');
    changed++;
    return;
  }

  console.log('  MISS   ' + t.html + ' (no ' + t.varName + ' block found — wire it up by hand once)');
  skipped++;
});

console.log('');

/* ---- orphan scan -------------------------------------------------------
   TARGETS is a list of files this script MAINTAINS. It says nothing about
   files that CARRY a generated block, and that gap is what open item 7 turned
   out to be: Provider_Reference/KORB_AddOn_Selector.html was a second,
   hand-uploaded copy of the Optimization Products tool, complete with an
   embedded ADDONS blob. Every rebuild refreshed the copy in TARGETS and left
   the other one behind. It had already gone stale, still carrying the en
   dashes converted to plain ASCII on 2026-09-14, and this script reported
   "All 2 embedded blobs match their source" every single time - true of the
   two it looked at, and a green light earned by not looking at the third.

   So: scan every tracked HTML for a generated marker and fail on any file
   that is not a target. A duplicate can be created by an upload through the
   GitHub web UI, which is exactly how that one arrived, so this cannot be
   enforced at the point the file is written. It has to be looked for. */
const tracked = require('child_process')
  .execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' })
  .split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
const targetPaths = TARGETS.map(function (t) { return t.html.split('\\').join('/'); });
const orphans = tracked.filter(function (f) {
  if (targetPaths.indexOf(f) !== -1) return false;
  return fs.readFileSync(path.join(ROOT, f), 'utf8').indexOf('/* BEGIN GENERATED ') !== -1;
});
if (orphans.length) {
  console.error('ORPHANED GENERATED BLOCK - ' + orphans.length + ' file(s) carry an embedded');
  console.error('blob that this script does not maintain. They will go stale and nothing');
  console.error('else will say so. Either add the file to TARGETS or stop it holding data.');
  orphans.forEach(function (f) { console.error('  - ' + f); });
  process.exit(1);
}
console.log('Orphan scan: ' + tracked.length + ' tracked page(s), no unmaintained embedded blocks.');

/* A checker that finds nothing and reports success is worse than no checker:
   it is a green light earned by not looking. If a target's file is missing or
   its block cannot be found, that is a failure, not a skip — most likely the
   files are not where this script expects them. */
if (skipped) {
  console.log(skipped + ' of ' + TARGETS.length + ' target(s) could not be checked.');
  console.log('Nothing was verified for those. Expected layout, from the repo root:');
  console.log('  korb-glp1-data.js, korb-addons-data.js, korb-pharmacies.js, build-embed.js');
  console.log('  Provider_Reference/<the tool HTML files>');
  console.log('Resolved repo root as: ' + ROOT);
  process.exit(1);
}

if (CHECK_ONLY) {
  if (drifted) {
    console.log(drifted + ' file(s) have drifted from their data file. Run: node build-embed.js');
    process.exit(1);
  }
  console.log('All ' + TARGETS.length + ' embedded blobs match their source.');
} else {
  console.log(changed + ' file(s) updated, ' + (TARGETS.length - changed) + ' already current.');
}
