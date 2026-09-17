#!/usr/bin/env node
/* ============================================================================
   artifact-signoff.js - the THIRD sign-off register.

     node artifact-signoff.js              report
     node artifact-signoff.js --sign <key> print a record to paste

   WHAT THIS COVERS, AND WHY IT IS NOT rx-signoff.js.

   rx-signoff.js enumerates generated DOCUMENTS, from the DOCS lists in the
   render modules. Two kinds of thing a provider or a patient actually opens
   are invisible to it:

     - the interactive TOOLS, which are HTML that renders from a data file at
       load and is driven by a provider making selections;
     - the patient EDUCATION handouts, which carry clinical content and no
       Tebra fields at all.

   Neither had anywhere to record a review. `korb-patient-ed-data.js` had no
   sign-off block of any kind. Don asked on 2026-09-17 for the Women's Health
   tool and handout to be signed and there was nothing to sign them in.

   Kept separate from the prescribing register for the same reason the
   prescribing register is kept separate from the monograph one: merging them
   means a change to a patient handout expires a prescribing attestation, and
   every such expiry teaches people to re-sign without re-reading.

   WHAT A FINGERPRINT COVERS, PER KIND. This is the part that decides whether
   a signature means anything.

     kind 'tool'     - the ROUTING BEHAVIOUR plus the prescribing blocks.
                       The blocks alone would duplicate a signature already
                       given on the corresponding clinical reference, since
                       both render the same entries from the same data file.
                       What is unique to a tool, and what has actually been
                       wrong, is the layer that decides WHICH entries a
                       provider is offered for a given state and destination.
                       All three defects found in the Women's Health tool on
                       2026-09-16 were in that layer, not in the blocks.
                       Don chose this scope on 2026-09-17.

     kind 'handout'  - the rendered body text. A patient handout has no
                       prescribing blocks, so there is nothing else to take.

   WHY IT DRIVES A REAL BROWSER. A tool's routing is only observable by
   operating it. Reading the source would be reading the thing the signature
   is supposed to be independent of, and this repo has been bitten twice by a
   check that carried its own copy of the logic it was checking.

   SO: NO CHROMIUM MEANS EXIT 1, NOT A CLEAN REPORT. The builders in this repo
   deliberately skip their PDF phase when Chromium is missing, because the HTML
   is still correct without it. A CHECK has the opposite obligation. A checker
   that finds nothing and reports success is a green light earned by not
   looking, and this file refuses to give one.
   ============================================================================ */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const FILE_URL = 'file:///' + ROOT.replace(/\\/g, '/') + '/';

/* ---- the artifacts ------------------------------------------------------
   EVERY tool and EVERY patient handout is listed, not just the ones that have
   been signed. A register that lists only what somebody has already looked at
   shows a short clean page and reads as good news. The denominator is the
   point.

   `probe` names the driver that operates a tool. A tool with no probe is
   reported as UNDRIVABLE and cannot be signed. That is a loud, visible state
   rather than a quiet omission: the tool is in the list, it is counted, and
   the report says why it has no fingerprint. */
const ARTIFACTS = [
  { key: 'tool:womens', kind: 'tool', probe: 'womens',
    label: "Women's Health Provider Tool",
    file: 'Provider_Reference/KORB_Womens_Health_Provider_Tool.html',
    records: { file: 'korb-womens-data.js', global: 'KORB_WOMENS' } },

  { key: 'tool:trt', kind: 'tool', probe: null,
    label: 'TRT Provider Tool',
    file: 'Provider_Reference/KORB_TRT_Provider_Tool.html',
    records: { file: 'korb-trt-data.js', global: 'KORB_TRT' } },

  { key: 'tool:glp1', kind: 'tool', probe: null,
    label: 'GLP-1 Provider Tool',
    file: 'Provider_Reference/KORB_GLP1_Provider_Tool.html',
    records: { file: 'korb-glp1-data.js', global: 'KORB_GLP1' } },

  { key: 'tool:addons', kind: 'tool', probe: null,
    label: 'Add-On Optimization Products',
    file: 'Provider_Reference/KORB_Optimization_Products.html',
    records: { file: 'korb-addons-data.js', global: 'KORB_ADDONS' } }
];

/* The handouts are uniform - static renders with no controls - so they are
   generated from the directory rather than typed. A typed list is the thing
   this repo has been bitten by twice. */
fs.readdirSync(path.join(ROOT, 'Patient_Education'))
  .filter(function (f) { return /^KORB_Patient_Ed_.*\.html$/.test(f); })
  .sort()
  .forEach(function (f) {
    const id = f.replace(/^KORB_Patient_Ed_/, '').replace(/\.html$/, '');
    ARTIFACTS.push({
      key: 'handout:' + id.toLowerCase(), kind: 'handout', probe: 'static',
      label: 'Patient handout - ' + id,
      file: 'Patient_Education/' + f,
      records: { file: 'korb-patient-ed-data.js', global: 'KORB_PATIENT_ED' }
    });
  });

/* ---- fingerprint --------------------------------------------------------
   Same canon/fnv as rx-signoff.js on purpose. Two registers that hash the same
   way can be reasoned about together; two that hash differently invite the
   question of which one is right. */
function canon(v) {
  if (v === null || v === undefined) return 'n';
  if (Array.isArray(v)) return '[' + v.map(canon).join('') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(function (k) { return k + canon(v[k]); }).join('') + '}';
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

function normalise(s) { return String(s).replace(/\s+/g, ' ').trim(); }

/* ---- reading the existing records --------------------------------------- */
const sandboxCache = {};
function loadData(file) {
  if (sandboxCache[file]) return sandboxCache[file];
  const ctx = { console: console };
  vm.createContext(ctx);
  /* korb-pharmacies.js first, always. Both program data files hydrate from it
     and throw by name rather than answering from empty lists. */
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'korb-pharmacies.js'), 'utf8'), ctx, 'korb-pharmacies.js');
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), ctx, file);
  sandboxCache[file] = ctx;
  return ctx;
}

function recordFor(a) {
  let ctx;
  try { ctx = loadData(a.records.file); } catch (e) { return null; }
  const g = ctx[a.records.global];
  if (!g || !g.artifactSignoff || !g.artifactSignoff.records) return null;
  return g.artifactSignoff.records[a.key] || null;
}

/* ---- probes -------------------------------------------------------------
   A probe runs INSIDE the page. It returns the object that gets fingerprinted,
   so what it returns is exactly what the signature covers. */

const PROBES = {};

/* Static render. Everything the reader sees, and nothing else. */
PROBES.static = function () {
  return {
    kind: 'handout',
    title: document.title,
    headings: [].map.call(document.querySelectorAll('h1,h2,h3'), function (h) {
      return h.tagName + ':' + h.innerText.replace(/\s+/g, ' ').trim();
    }),
    body: document.body.innerText.replace(/\s+/g, ' ').trim()
  };
};

/* Women's Health provider tool.

   Walks every state. For each one it records which destinations the tool
   offers, whether testosterone is gated, and - for every destination - the
   exact list of product options each hormone picker is filled with. That
   matrix IS the routing behaviour: it is what changes if a pharmacy footprint
   moves, if a Schedule III state is added, or if an entry's destination is
   edited.

   It then ticks every available hormone and takes the prescribing blocks that
   result, so the blocks are covered too.

   Deliberately NOT recorded: prices and charge codes are already in the
   reference's signature, and pulling them in here would make a pricing edit
   expire a routing attestation. */
PROBES.womens = function () {
  var st = document.getElementById('st');
  var dest = document.getElementById('dest');
  var ut = document.getElementById('ut');
  var fire = function (el) { el.dispatchEvent(new Event('change', { bubbles: true })); };
  var optsOf = function (el) {
    return [].map.call(el.options, function (o) { return o.value; }).filter(Boolean);
  };
  var states = optsOf(st);

  /* PASS 1 - routing. Every state, because that is the axis a licensure or a
     Schedule III change moves along. */
  var routing = {};
  states.forEach(function (code) {
    st.value = code; fire(st);
    var dests = optsOf(dest);
    var tbox = document.getElementById('h_test');
    var row = { destinations: dests, testosteroneGated: !!(tbox && tbox.disabled), byDest: {} };
    dests.forEach(function (dk) {
      dest.value = dk; fire(dest);
      var offers = {};
      HORMONES.forEach(function (h) {
        var box = document.getElementById('h_' + h.id);
        if (!box || box.disabled) { offers[h.id] = null; return; }
        var was = box.checked;
        if (!was) { box.checked = true; fire(box); }
        var sel = document.getElementById('sel_' + h.id);
        offers[h.id] = sel ? optsOf(sel) : [];
        if (!was) { box.checked = false; fire(box); }
      });
      row.byDest[dk] = offers;
    });
    routing[code] = row;
  });

  /* PASS 2 - the prescribing blocks.

     A block depends on the destination and the entry chosen, NOT on the state,
     so this walks destinations rather than repeating itself 51 times. It picks,
     for each destination, a state that actually offers it, and for testosterone
     a state where it is not gated - otherwise the Schedule III blocks would be
     unreachable and would silently sit outside the signature. */
  var blocks = {};
  var allDests = {};
  states.forEach(function (c) {
    routing[c].destinations.forEach(function (d) {
      if (!allDests[d]) allDests[d] = [];
      allDests[d].push(c);
    });
  });

  ut.value = 'yes'; fire(ut);

  Object.keys(allDests).forEach(function (dk) {
    HORMONES.forEach(function (h) {
      /* a state that offers this destination AND does not gate this hormone */
      var code = allDests[dk].filter(function (c) {
        return h.id !== 'test' || !routing[c].testosteroneGated;
      })[0];
      if (!code) return;
      st.value = code; fire(st);
      dest.value = dk; fire(dest);

      HORMONES.forEach(function (o) {
        var b = document.getElementById('h_' + o.id);
        if (b && !b.disabled && b.checked !== (o.id === h.id)) { b.checked = (o.id === h.id); fire(b); }
      });
      var box = document.getElementById('h_' + h.id);
      if (!box || box.disabled || !box.checked) return;
      var sel = document.getElementById('sel_' + h.id);
      if (!sel) return;

      optsOf(sel).forEach(function (label) {
        sel.value = label;
        if (typeof sel.onchange === 'function') sel.onchange();
        [].forEach.call(document.querySelectorAll('#out .card'), function (c) {
          var tbl = c.querySelector('table.fld');
          var hd = c.querySelector('.card-hdr');
          if (!tbl || !hd) return;
          var name = dk + ' / ' + hd.innerText.replace(/Copy all fields/g, '').replace(/\s+/g, ' ').trim();
          blocks[name] = [].map.call(tbl.querySelectorAll('tr'), function (tr) {
            var k = tr.querySelector('td.k'), v = tr.querySelector('.fv');
            return k && v ? k.innerText.trim() + '=' + v.innerText.replace(/\s+/g, ' ').trim() : '';
          }).filter(Boolean).join('|');
        });
      });
    });
  });

  return { kind: 'tool', states: states.length, routing: routing, blocks: blocks };
};

/* ---- rendering ---------------------------------------------------------- */
function chromium() {
  try { return require('playwright').chromium; }
  catch (e) {
    console.error('artifact-signoff.js needs Playwright and its Chromium.\n' +
      '  npm install\n  npx playwright install chromium\n\n' +
      'This is a CHECK, so a missing browser is a failure and not a skip. ' +
      'A tool\'s routing is only observable by operating it, and reporting ' +
      '"nothing to see" without having looked is how this repo shipped a page ' +
      'that rendered nothing for a day on a public site.');
    process.exit(1);
  }
}

async function measure() {
  const browser = await chromium().launch();
  const out = [];
  for (const a of ARTIFACTS) {
    const entry = Object.assign({}, a, { record: recordFor(a) });
    if (!a.probe) {
      entry.undrivable = 'no probe: this tool has no driver yet, so its routing cannot be fingerprinted';
      out.push(entry);
      continue;
    }
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', function (e) { errs.push(e.message); });
    await page.goto(FILE_URL + a.file, { waitUntil: 'load' });
    let shot;
    try {
      shot = await page.evaluate(PROBES[a.probe]);
    } catch (e) {
      entry.error = 'probe threw: ' + e.message;
      out.push(entry); await page.close(); continue;
    }
    if (errs.length) entry.error = 'page error: ' + errs[0];
    entry.shot = shot;
    entry.fingerprint = fnv(canon(shot));
    entry.size = (a.kind === 'handout')
      ? (shot.body || '').length
      : Object.keys(shot.blocks || {}).length;
    out.push(entry);
    await page.close();
  }
  await browser.close();
  return out;
}

/* ---- self check ---------------------------------------------------------
   Assert the measurement is real before printing anything about it. An empty
   render fingerprints perfectly happily and would sit in the report looking
   like a signed, stable artifact. The clinical-docs builder shipped a one-page
   PDF past every check for exactly this reason. */
function selfCheck(rows) {
  const problems = [];
  const seen = {};
  rows.forEach(function (r) {
    if (seen[r.key]) problems.push('duplicate artifact key: ' + r.key);
    seen[r.key] = true;
    if (r.undrivable || r.error) return;
    if (r.kind === 'handout' && (!r.shot || (r.shot.body || '').length < 2000)) {
      problems.push(r.key + ' rendered under 2000 characters of body text. A handout ' +
        'that short is a page that failed to load its data file, not a short handout.');
    }
    if (r.kind === 'tool') {
      if (!r.shot || !r.shot.states) problems.push(r.key + ' probed zero states');
      if (!r.shot || !Object.keys(r.shot.blocks || {}).length) {
        problems.push(r.key + ' produced zero prescribing blocks across every state ' +
          'and destination. Either the tool is broken or the probe no longer matches ' +
          'its markup. Check the second before believing the first.');
      }
    }
  });
  return problems;
}

function status(r) {
  if (r.undrivable || r.error) return 'blocked';
  if (!r.record) return 'unsigned';
  return r.record.fingerprint === r.fingerprint ? 'current' : 'stale';
}

/* ---- main --------------------------------------------------------------- */
(async function () {
  const rows = await measure();
  const problems = selfCheck(rows);
  if (problems.length) {
    console.error('artifact-signoff self check FAILED:');
    problems.forEach(function (p) { console.error('  ' + p); });
    process.exit(1);
  }

  const signAt = process.argv.indexOf('--sign');
  if (signAt > -1) {
    const key = process.argv[signAt + 1];
    const r = rows.filter(function (x) { return x.key === key; })[0];
    if (!r) {
      console.error('No artifact with key "' + key + '". Run node artifact-signoff.js for the keys.');
      process.exit(1);
    }
    if (r.undrivable || r.error) {
      console.error('Cannot sign ' + key + ': ' + (r.undrivable || r.error));
      process.exit(1);
    }
    const attests = r.kind === 'handout'
      ? 'Reviewed this patient handout as rendered - the clinical content, the ' +
        'dosing and administration guidance, the storage and travel instructions, ' +
        'the side effect and safety sections and the instructions on when to make ' +
        'contact - and approve it for release to patients.'
      : 'Reviewed this tool as rendered - the states and destinations it offers, ' +
        'the products it puts in front of a provider for each of them, the hormones ' +
        'it gates, and the Tebra prescribing blocks it produces - and approve it ' +
        'for use by the provider team.';
    console.log('\nAdd this to ' + r.records.file + ', inside artifactSignoff.records:\n');
    console.log('  ' + JSON.stringify({
      signedBy: 'Donald Stevenson, PA-C',
      role: 'Director of Clinical Operations and Lead Provider',
      date: new Date().toISOString().slice(0, 10),
      fingerprint: r.fingerprint,
      covers: r.kind === 'tool'
        ? r.shot.states + ' states, ' + Object.keys(r.shot.blocks).length + ' prescribing blocks'
        : (r.shot.body || '').length + ' characters, ' + r.shot.headings.length + ' headings',
      attests: attests
    }, null, 2).split('\n').join('\n  '));
    console.log('\nArtifact : ' + r.label + '\nFile     : ' + r.file);
    console.log('\nNot written automatically. A sign-off is a clinical attestation and it');
    console.log('should land in the data file as a reviewed diff, not as a side effect.\n');
    return;
  }

  const by = { current: [], stale: [], unsigned: [], blocked: [] };
  rows.forEach(function (r) { by[status(r)].push(r); });

  console.log('ARTIFACT SIGN-OFF - the tools and the patient handouts');
  console.log('Prescribing documents are a separate register: node rx-signoff.js\n');
  console.log(' ' + String(by.current.length).padStart(2) + '  signed, unchanged since');
  console.log(' ' + String(by.stale.length).padStart(2) + '  SIGNED THEN CHANGED - need re-reading');
  console.log(' ' + String(by.unsigned.length).padStart(2) + '  never signed');
  console.log(' ' + String(by.blocked.length).padStart(2) + '  cannot be fingerprinted yet');
  console.log(' ' + String(rows.length).padStart(2) + '  artifacts\n');

  function show(title, list) {
    if (!list.length) return;
    console.log(title);
    list.forEach(function (r) {
      const note = r.undrivable || r.error ||
        (r.kind === 'tool' ? r.size + ' blocks' : r.size + ' chars');
      console.log('  ' + r.key.padEnd(24) + r.label.padEnd(42) + note);
    });
    console.log('');
  }
  show('SIGNED THEN CHANGED - re-read these first', by.stale);
  show('NEVER SIGNED', by.unsigned);
  show('CANNOT BE FINGERPRINTED YET', by.blocked);
  show('SIGNED AND UNCHANGED', by.current);

  if (by.stale.length) process.exit(1);
})().catch(function (e) {
  console.error(e);
  process.exit(1);
});
