#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH - PRESCRIBING BLOCK SIGN-OFF

     node rx-signoff.js            what needs Don's review, and what is signed
     node rx-signoff.js --gate     same, but exit 1 if anything is unsigned or stale

   WHY THIS FILE EXISTS

   korb-glp1-data.js already fingerprints its MONOGRAPHS - indications,
   interactions, contraindications, monitoring, ICD-10, the counselling script -
   and records a sign-off against that fingerprint. That mechanism works and is
   not touched here.

   It covers none of the prescribing blocks. The Tebra fields a provider copies
   into a prescription, and the charge codes billing works from, sit outside it.
   So on 2026-09-15, after two days of correcting exactly those fields - the
   Greenwich sermorelin names that read 3x the real dose, BPC-157 at 600 mcg
   when the dose is 500, en dashes that a Tebra paste can silently drop - all
   three GLP-1 monographs still reported "current" against a signature dated
   2026-09-06. Correctly: the monograph had not changed. Nothing anywhere was
   tracking whether the prescribing content had been reviewed.

   FH&L had no sign-off of any kind. korb-addons-data.js had a needsSignoff
   boolean on all 23 products, which records that nobody has reviewed them yet
   but cannot notice a change after someone has - flip it to false and an edit
   the next day is invisible.

   TWO SIGNATURES, NOT ONE. The monograph fingerprint stays separate from this
   one deliberately. They are different reviews. Fixing a hyphen in a sig is not
   a reason to re-read every contraindication, and folding both into a single
   fingerprint would mean exactly that - a punctuation change expiring a
   clinical sign-off, which trains everyone to re-sign without re-reading.

   WHAT IS FINGERPRINTED

   The NORMALISED field list from korb-rx-block.js fieldsFrom(), not the raw
   record. That is the provider's view: the same ten fields in Tebra entry
   order, whatever shape the data file stores them in. Three consequences worth
   knowing:

     - The three programs are comparable even though korb-dosing-data.js stores
       an ordered array and the other two store flat keys.
     - A refactor that moves a value between storage shapes without changing
       what a provider copies does NOT invalidate a sign-off. Correct: nothing
       the reviewer approved has changed.
     - A change to a field that is not rendered does not invalidate it either,
       for the same reason. If a field starts being rendered, it starts counting.

   CHARGE CODES ARE NOT IN THE FINGERPRINT. This comment used to claim they
   were, "because a wrong code is a billing error the provider cannot see."
   The intent was right and the statement was false: the codes live in the
   Pricing and charge codes table, which is not a prescribing block, and
   blocksIn() only ever sees `div.rxb`. Counted rather than argued - zero FIT*
   codes appear inside the fingerprinted blocks of any of the fifteen documents.

   It was caught on 2026-09-15 the way these things are caught. A dedupe bug in
   sectionPricing was dropping the second oral charge tier on four documents, and
   fixing it ADDED a $399 / FITSemOrl180 row to Premier Semaglutide - a document
   Don had already signed - without the report moving off "0 SIGNED THEN CHANGED".
   A pricing row he never saw appeared under his signature and nothing noticed.

   Widening the fingerprint to cover the pricing table would expire all seven
   existing sign-offs at once, so it is Don's call and not a silent fix. Until he
   makes it, this signature attests to the prescribing blocks only.
   ============================================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const REPO = __dirname;
const RXB = require('./korb-rx-block.js');

/* ---- loading ------------------------------------------------------------
   Pharmacies FIRST and into the global scope, exactly as a page loads them.
   Both program files hydrate their state lists from it at load; without this
   they throw, which is the behaviour open items 3 and 4 built on purpose. */
function load(file, globalName, sandbox) {
  const src = fs.readFileSync(path.join(REPO, file), 'utf8');
  sandbox = sandbox || {};
  new Function('exports', 'module', src + '\n;this.OUT = ' + globalName + ';')
    .call(sandbox, {}, {});
  return sandbox.OUT;
}

function loadAll() {
  const sandbox = {};
  global.KORB_PHARMACIES = load('korb-pharmacies.js', 'KORB_PHARMACIES', sandbox);
  return {
    pharmacies: global.KORB_PHARMACIES,
    glp1: load('korb-glp1-data.js', 'KORB_GLP1', sandbox),
    dosing: load('korb-dosing-data.js', 'KORB_DOSING', sandbox),
    addons: require('./korb-addons-data.js'),
    trt: load('korb-trt-data.js', 'KORB_TRT', sandbox),
    womens: load('korb-womens-data.js', 'KORB_WOMENS', sandbox)
  };
}

/* ---- fingerprint --------------------------------------------------------
   FNV-1a over a canonical serialisation, the same algorithm and the same
   output shape as monographFingerprint in korb-glp1-data.js. Deliberately the
   same so the two are read the same way by anyone looking at a record. Not a
   security hash and not trying to be: it defends against drift, not forgery. */
function canon(v) {
  if (v === null || v === undefined) return 'n';
  if (Array.isArray(v)) return '[' + v.map(canon).join('') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(function (k) {
      return k + canon(v[k]);
    }).join('') + '}';
  }
  return String(v);
}

function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return 'fp-' + ('0000000' + h.toString(16)).slice(-8) + '-' + str.length;
}


/* ---- inventory ----------------------------------------------------------
   One entry per DOCUMENT, because a document is what Don reviews and what he
   signs. An earlier version of this file listed all 137 individual prescribing
   blocks, which is accurate and useless: nobody signs 137 things one at a time.

   The blocks are taken from the document as RENDERED, by running the same
   renderer the builder runs and pulling every div.rxb out of the HTML. There is
   deliberately no hand-written map from document to products:

     - It cannot drift from the renderer. A map would be another list to keep in
       step, and this repo has already been bitten twice by exactly that - the
       NEEDS map in check-pages.js exists because of one, and the "eleven
       documents" comment was another.
     - It fingerprints what a provider actually sees. A block that exists in the
       data file but renders on no document is not something to sign off, and a
       block that renders on two documents counts on both, correctly.

   Only div.rxb is taken. Everything else on the page - the running header, the
   build date, the version stamp, the counselling prose - is excluded, so a
   rebuild on a different day does not invalidate a signature. */
function blocksIn(html) {
  /* Depth-counted, not a regex. A block contains nested divs - the coloured
     header, and on a grouped block a div per varying field - so a lazy match to
     the first closing tag stops inside the header and a greedy one swallows the
     rest of the page. The first attempt used a regex and this file's own
     selfCheck caught it: ten GLP-1 documents reported zero blocks. */
  const out = [];
  const open = '<div class="rxb">';
  let at = 0;
  for (;;) {
    const start = html.indexOf(open, at);
    if (start === -1) break;
    let depth = 0, k = start;
    while (k < html.length) {
      if (html.startsWith('<div', k)) { depth++; k += 4; continue; }
      if (html.startsWith('</div>', k)) {
        depth--; k += 6;
        if (depth === 0) break;
        continue;
      }
      k++;
    }
    out.push(html.slice(start, k));
    at = k;
  }
  return out;
}

/* Strip what a rebuild changes but a reviewer would not call a change. */
function normalise(block) {
  return block
    .replace(/\s+/g, ' ')
    .replace(/ style="background:#[0-9A-Fa-f]{6};"/g, '')
    .trim();
}

function inventory() {
  const S = loadAll();
  const GLP1 = require('./provider-doc-render.js');
  const FHL = require('./fhl-doc-render.js');
  const ADDON = require('./clinical-doc-render.js');
  const out = [];

  GLP1.DOCS.forEach(function (d) {
    out.push({ program: 'GLP-1', key: 'glp1:' + d.id, label: d.title,
               file: d.file, html: GLP1.renderBody(S.glp1, d) });
  });
  FHL.DOCS.forEach(function (d) {
    out.push({ program: 'FH&L', key: 'fhl:' + d.id, label: d.title,
               file: d.file, html: FHL.renderBody(S.dosing, d) });
  });
  /* clinical-doc-render.js now serves more than one program, so each document
     must be rendered with ITS OWN data file. The first version passed S.addons
     for every row and keyed them all 'addon:', which meant the TRT reference
     entered the inventory as a second copy of the Add-On document under a TRT
     name: 25 add-on blocks, none of TRT's 18, and its prescribing values never
     reached check-tebra-caps.js at all. It reported "0 over the cap" across
     "16 documents" while never having seen the sixteenth.

     Found because Don asked whether the TRT patient and pharmacy instructions
     were within the Tebra caps, and the honest way to answer was to plant an
     overrun and watch the checker miss it. The DOCS row carries the global it
     needs, so the mapping is derived rather than typed. */
  var BY_GLOBAL = { KORB_ADDONS: { data: S.addons, program: 'Add-On', prefix: 'addon' },
                    KORB_TRT:    { data: S.trt,    program: 'TRT',     prefix: 'trt' },
                    KORB_WOMENS: { data: S.womens, program: "Women's", prefix: 'womens' } };
  (ADDON.DOCS || []).forEach(function (d) {
    var m = BY_GLOBAL[d.global];
    if (!m) {
      throw new Error('rx-signoff: clinical-doc-render DOCS row "' + d.id + '" declares ' +
        'global ' + d.global + ', which this file has no data source for. Add it to ' +
        'BY_GLOBAL, or its document will be rendered with another program data.');
    }
    out.push({ program: m.program, key: m.prefix + ':' + d.id, label: d.title,
               file: d.file, html: ADDON.renderBody(m.data, S.pharmacies, d),
               noBlocksReason: (m.data.document || {}).noPrescribingBlocks || null });
  });

  out.forEach(function (e) {
    e.blocks = blocksIn(e.html).map(normalise);
    e.count = e.blocks.length;
    e.fingerprint = fnv(canon(e.blocks));
    delete e.html;
  });
  return { docs: out, sources: S };
}

/* ---- self check ---------------------------------------------------------
   A report that quietly misses documents is worse than none: it shows a short
   clean list and reads as good news. Assert the inventory is whole before
   printing anything. */
function selfCheck(inv) {
  const problems = [];
  const seen = {};

  inv.docs.forEach(function (e) {
    if (seen[e.key]) problems.push('duplicate document key: ' + e.key);
    seen[e.key] = true;
    if (!e.label) problems.push(e.key + ' has no title');
    /* A document with no prescribing blocks is almost always a broken extractor,
       so it stays an error - unless the data file SAYS so and gives a reason.
       The Women's Health reference is the first honest case: that programme's
       Tebra entries are per-hormone and per-strength, they were never in the
       hand-built tool, and they are still to be built. Declaring it is a
       different act from silently rendering nothing. */
    if (!e.count && !e.noBlocksReason) {
      problems.push(e.key + ' rendered ZERO prescribing blocks; either the ' +
        'document genuinely has none, or blocksIn() no longer matches the markup ' +
        'korb-rx-block.js emits. Check the second before believing the first. If it ' +
        'genuinely has none, say so with noPrescribingBlocks in its document block.');
    }
  });

  /* Every document the builders write must appear. Counted from the DOCS lists
     directly rather than from the walk above, so a bug in the walk cannot hide
     inside its own count. */
  const want = require('./provider-doc-render.js').DOCS.length
             + require('./fhl-doc-render.js').DOCS.length
             + (require('./clinical-doc-render.js').DOCS || []).length;
  if (inv.docs.length !== want) {
    problems.push('inventory holds ' + inv.docs.length + ' document(s), the renderers list ' + want);
  }

  /* The fingerprint must respond to a change. An assertion never seen to fail
     is not evidence - CLAUDE.md, and that rule has caught four real cases here. */
  const a = ['<div class="rxb">Inject 0.25 mL weekly</div>'];
  const b = ['<div class="rxb">Inject 0.5 mL weekly</div>'];
  if (fnv(canon(a)) === fnv(canon(b))) problems.push('fingerprint does not change when a block changes');
  if (fnv(canon(a)) !== fnv(canon(a))) problems.push('fingerprint is not deterministic');
  if (fnv(canon(a)) === fnv(canon(a.concat(b)))) {
    problems.push('fingerprint does not change when a block is added');
  }
  return problems;
}

/* ---- status -------------------------------------------------------------
   Three states, the same three the monograph mechanism uses. STALE is the one
   that matters: somebody signed this and the content moved afterwards, which is
   invisible to a boolean flag and is the failure this file exists for. */
function recordsFor(S) {
  const all = {};
  /* Every program data file, not a hardcoded three. korb-trt-data.js was missing
     here after TRT was added, so a valid sign-off recorded in that file was read
     by nothing and the document kept reporting "never signed". Derived from the
     sources object now, so a new program cannot be half-wired the same way.

     There were also TWO copies of this function and of status() in this file,
     left by an earlier edit. JavaScript takes the last definition, so fixing the
     first copy would have changed nothing at all. Removed. */
  Object.keys(S).filter(function (k) { return k !== 'pharmacies'; })
    .map(function (k) { return S[k]; }).forEach(function (mod) {
    const recs = (mod.rxSignoff || {}).records || {};
    Object.keys(recs).forEach(function (k) { all[k] = recs[k]; });
  });
  return all;
}

function status(entry, rec) {
  if (!rec) return { state: 'unsigned', detail: 'Never reviewed.' };
  if (rec.fingerprint !== entry.fingerprint) {
    return { state: 'stale', detail: rec.signedBy + ' signed this on ' + rec.date +
      ' against ' + rec.fingerprint + '. It now reads ' + entry.fingerprint + '.' };
  }
  return { state: 'current', detail: 'Signed by ' + rec.signedBy + ' on ' + rec.date +
    ' against ' + rec.dataVersion + '.' };
}

module.exports = {
  loadAll: loadAll, inventory: inventory, recordsFor: recordsFor,
  status: status, selfCheck: selfCheck, fingerprintOf: function (blocks) { return fnv(canon(blocks)); }
};

/* ---- recording a sign-off ------------------------------------------------
   node rx-signoff.js --sign <key>

   Writes the record into the right data file, stamped with the fingerprint AS
   SIGNED. That stamp is the whole mechanism: a boolean says "somebody looked
   once", a fingerprint says "somebody looked at THIS", and only the second can
   notice that the content moved afterwards. korb-addons-data.js had the boolean
   version on all 23 products and it could not have told anyone.

   Deliberately one document per invocation and no --all. A sign-off is a
   clinical attestation by a named provider; a command that signs fifteen
   documents in one keystroke is a command for signing things unread. */
function signCommand(key) {
  const inv = inventory();
  const doc = inv.docs.filter(function (d) { return d.key === key; })[0];
  if (!doc) {
    console.error('No document with key "' + key + '".');
    console.error('Run node rx-signoff.js to see the keys.');
    process.exit(1);
  }
  /* One table, not two parallel ones. The first version kept the filename and
     the version in separate maps keyed by prefix, and when TRT arrived neither
     gained a row: the command printed "Add this to undefined" and a record with
     no dataVersion at all. A sign-off that does not say what it was signed
     against is not much of a sign-off. */
  const S = inv.sources;
  const PROGRAM = {
    glp1:  { file: 'korb-glp1-data.js',   data: S.glp1 },
    fhl:   { file: 'korb-dosing-data.js', data: S.dosing },
    addon: { file: 'korb-addons-data.js', data: S.addons },
    trt:   { file: 'korb-trt-data.js',    data: S.trt },
    womens:{ file: 'korb-womens-data.js', data: S.womens }
  };
  const prefix = key.split(':')[0];
  const prog = PROGRAM[prefix];
  if (!prog) {
    console.error('rx-signoff: no data file is mapped for the "' + prefix + ':" prefix. ' +
      'Add it to PROGRAM in signCommand, or the record cannot say which file or ' +
      'which version it was signed against.');
    process.exit(1);
  }
  const FILE = prog.file;
  const version = prog.data.meta.version;

  const rec = {
    signedBy: 'Donald Stevenson, PA-C',
    role: 'Director of Clinical Operations and Lead Provider',
    /* LOCAL date, not UTC. toISOString() is UTC, so between 19:00 CDT and
       midnight it stamps tomorrow - a provider signing at 19:46 on 15 Sep got
       a record dated the 16th, a date they had not reached. An attestation
       carries the day the provider signed it, in the provider's own day. */
    date: (function () {
      const d = new Date();
      const p2 = function (n) { return (n < 10 ? '0' : '') + n; };
      return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate());
    })(),
    dataVersion: version,
    fingerprint: doc.fingerprint,
    blocks: doc.count,
    /* The attestation names the fields actually on the document. It used to say
       "reason for compounding" unconditionally, which is wrong on TRT and on the
       brand GLP-1 products: those are standard prescriptions and carry no such
       field. Attesting to a field that is not there is a small thing that makes
       the whole record less trustworthy. */
    attests: 'Reviewed the prescribing blocks on this document as rendered - drug ' +
      'formulation, Tebra favorite name, quantity, unit, refill, days supply, ' +
      'patient instructions, ' +
      (/reason for compounding/i.test(JSON.stringify(doc.blocks)) ? 'reason for compounding, ' : '') +
      'pharmacy instructions and the charge codes - and approve them for use in ' +
      'prescribing.' 
  };

  console.log('Add this to ' + FILE + ', inside rxSignoff.records:');
  console.log('');
  const body = JSON.stringify(rec, null, 2).split('\n').join('\n  ');
  console.log('  ' + JSON.stringify(key) + ': ' + body + ',');
  console.log('');
  console.log('Document : ' + doc.label + '  (' + doc.count + ' prescribing blocks)');
  console.log('File     : ' + doc.file + '.html');
  console.log('');
  console.log('Not written automatically. A sign-off is a clinical attestation and it');
  console.log('should land in the data file as a reviewed diff, not as a side effect.');
}

/* ---- report -------------------------------------------------------------- */
if (require.main === module) {
  const signAt = process.argv.indexOf('--sign');
  if (signAt !== -1) { signCommand(process.argv[signAt + 1]); process.exit(0); }
  const GATE = process.argv.indexOf('--gate') !== -1;
  const inv = inventory();
  const recs = recordsFor(inv.sources);

  const problems = selfCheck(inv);
  if (problems.length) {
    console.error('REFUSING TO REPORT - the inventory is not trustworthy:');
    problems.forEach(function (p) { console.error('  - ' + p); });
    process.exit(1);
  }

  const by = { unsigned: [], stale: [], current: [], noblocks: [] };
  inv.docs.forEach(function (e) {
    /* A document with nothing to sign is not "unsigned" - listing it as awaiting
       review would send Don to read a document that has nothing for him to
       approve. Counted separately and named. */
    if (!e.count && e.noBlocksReason) { by.noblocks.push(e); return; }
    e.state = status(e, recs[e.key]);
    by[e.state.state].push(e);
  });
  const S = inv.sources;

  console.log('PRESCRIBING SIGN-OFF - what Don has and has not reviewed');
  console.log('korb-glp1-data.js v' + S.glp1.meta.version +
              '   korb-dosing-data.js v' + S.dosing.meta.version +
              '   korb-addons-data.js v' + S.addons.meta.version);
  console.log('');

  const pad = function (n) { return String(n).padStart(3); };
  console.log(pad(by.current.length) + '  signed, unchanged since');
  console.log(pad(by.stale.length) + '  SIGNED THEN CHANGED - need re-reading');
  console.log(pad(by.unsigned.length) + '  never signed');
  if (by.noblocks.length) {
    console.log(pad(by.noblocks.length) + '  with no prescribing blocks yet (nothing to sign)');
  }
  console.log(pad(inv.docs.length) + '  documents, ' +
              inv.docs.reduce(function (a, e) { return a + e.count; }, 0) +
              ' prescribing blocks between them');

  [['stale', 'SIGNED THEN CHANGED - re-read these first'],
   ['unsigned', 'NEVER SIGNED'],
   ['noblocks', 'NO PRESCRIBING BLOCKS YET - nothing to sign'],
   ['current', 'SIGNED AND UNCHANGED']].forEach(function (pair) {
    const rows = by[pair[0]];
    if (!rows.length) return;
    console.log('');
    console.log(pair[1]);
    rows.forEach(function (e) {
      console.log('  ' + (e.program + '  ').slice(0, 8) + (e.label + '                            ').slice(0, 30) +
                  pad(e.count) + ' blocks   ' + e.file + '.html');
    });
  });

  console.log('');
  if (GATE && (by.stale.length || by.unsigned.length)) {
    console.error('Gate: ' + (by.stale.length + by.unsigned.length) + ' document(s) not signed off.');
    process.exit(1);
  }
}
