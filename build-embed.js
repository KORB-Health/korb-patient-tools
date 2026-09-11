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
  {
    html: 'Provider_Reference/KORB_GLP1_Provider_Tool.html',
    varName: 'DATA',
    source: 'korb-glp1-data.js',
    /* The GLP-1 tool embeds a flattened projection, not the raw products object.
       Two shapes collapse into one here, which is the whole point of doing it in
       code rather than by hand:

         - Compounded products carry drugFormulation on the DOSE (one compound,
           many fill lengths). Brand products carry the Tebra string as `drug` on
           each FILL. The tool only ever reads fill.drugFormulation, so both are
           normalised onto the fill.
         - dropdownWarning / dropdownNote are named warn / note in the tool.

       Fill order matters: it is the order the duration control renders. */
    project: function (mod) {
      const out = {};
      Object.keys(mod.products).forEach(function (key) {
        const p = mod.products[key];
        const rec = {
          key: p.key, label: p.label, drug: p.drug, pharmacy: p.pharmacy,
          compounded: !!p.compounded, route: p.route, frequency: p.frequency,
          orderVia: p.orderVia, brandName: !p.compounded,
          warn: p.dropdownWarning || null,
          note: p.dropdownNote || p.presentationNote || null,
          prescribingNotes: p.prescribingNotes || [],
          doses: []
        };
        if (p.status) { rec.status = p.status; }
        if (p.statusNote) { rec.statusNote = p.statusNote; }

        const ph = mod.pharmacies && mod.pharmacies[p.pharmacy];
        if (ph && ph.status && ph.status !== 'active' && ph.statusNote) {
          rec.pharmacyStatusNote = ph.statusNote;
        }

        (p.doses || []).forEach(function (d) {
          const dose = {
            dose: d.dose,
            mg: has(d, 'mg') ? d.mg : null,
            units: has(d, 'units') ? d.units : null,
            conc: has(d, 'conc') ? d.conc : null,
            use: has(d, 'use') ? d.use : null,
            presentation: has(d, 'presentation') ? d.presentation : null,
            chargeCode: has(d, 'chargeCode') ? d.chargeCode : null,
            vials4: has(d, 'vials4') ? d.vials4 : null,
            vials8: has(d, 'vials8') ? d.vials8 : null,
            fills: []
          };
          /* T1A / T2A / T3A. This is the modifier billing needs alongside the
             charge code, and it is a property of the dose, not of the fill. */
          if (d.priceTier) {
            const tier = mod.pricing.tirzepatideTiers[d.priceTier];
            dose.tier = { code: d.priceTier, appliesTo: tier ? tier.appliesTo : null };
          }

          FILL_KEYS.forEach(function (k) {
            const f = d[k];
            if (!f) return;
            /* Billing resolved through billingFor() rather than re-implementing
               its brand / oral / tiered / banded branch inside the page. */
            const bill = mod.billingFor(key, k, d.dose);
            dose.fills.push({
              billing: bill ? { options: bill.options, note: bill.note,
                                programLabel: bill.programLabel } : null,
              key: k,
              /* label is the short duration chip; name is the Tebra favourite
                 string. Brand products store that string as `label` in the data
                 file, compounded ones as `name`. */
              label: labelFor(k),
              /* brand: the Tebra string is on the fill; compounded: on the dose */
              drugFormulation: f.drug || d.drugFormulation || null,
              name: f.name || f.label || null,
              allowSubstitution: has(f, 'allowSubstitution') ? f.allowSubstitution : null,
              quantity: f.quantity,
              unit: has(f, 'unit') ? f.unit : null,
              refill: f.refill,
              days: f.days,
              ptInstructions: f.ptInstructions,
              reasonForCompounding: has(f, 'reasonForCompounding') ? f.reasonForCompounding : null,
              pharmacyNotes: has(f, 'pharmacyNotes') ? f.pharmacyNotes : null
            });
          });
          rec.doses.push(dose);
        });
        out[key] = rec;
      });
      return out;
    }
  },
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

  let html = fs.readFileSync(htmlPath, 'utf8');
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
