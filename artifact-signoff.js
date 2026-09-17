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
/* EVERY TOOL AND EVERY HANDOUT, DERIVED FROM THE TREE - NOT TYPED.

   The first version of this file typed four tools and its own comment claimed
   it listed every one. It listed four of seventeen. Twelve provider tools were
   simply absent, and the report showed a short clean page that read as good
   news - which is the exact failure this repo keeps writing checks against.
   Don caught it 2026-09-17 by asking whether the programmes were finished.

   So the list is now derived from git, and a new tool joins the denominator by
   existing. Classification is by rule, and every exclusion is named below so a
   missing file is explicable rather than invisible.

   The rule that made the old list wrong is worth stating plainly: A REGISTER
   THAT CANNOT SEE SOMETHING REPORTS IT AS FINE. */
const TOOL_META = {
  /* file (relative, forward slashes) -> probe + where its record lives.
     A tool with no probe is reported as UNDRIVABLE with the reason, which is a
     loud state. A tool missing from this map still appears, still counts, and
     says it has no probe - the map narrows what can be FINGERPRINTED, never
     what is LISTED. */
  'Provider_Reference/KORB_Womens_Health_Provider_Tool.html':
    { key: 'womens', probe: 'womens', label: "Women's Health Provider Tool",
      records: { file: 'korb-womens-data.js', global: 'KORB_WOMENS' } },
  'Provider_Reference/KORB_Mens_Health_Provider_Tool.html':
    { key: 'mens', probe: 'mens', label: "Men's Health Provider Tool",
      records: { file: 'korb-mens-data.js', global: 'KORB_MENS' } },
  'Provider_Reference/KORB_Optimization_Products.html':
    { key: 'addons', probe: 'addons', label: 'Add-On Optimization Products',
      records: { file: 'korb-addons-data.js', global: 'KORB_ADDONS' } },

  'KORB_GLP1_Pharmacy_Routing.html':
    { key: 'glp1routing', probe: 'routing', label: 'GLP-1 Pharmacy Routing',
      records: { file: 'korb-glp1-data.js', global: 'KORB_GLP1' } },

  /* No probe yet. Each names what a probe would have to drive, so whoever
     writes one is not starting from the file. */
  'KORB_GLP1_Provider_Reference.html':
    { probe: null, why: 'product, pharmacy and dose selectors feeding a monograph view' },
  'KORB_GLP1_Dose_Guide.html':
    { probe: null, why: 'medication, pharmacy and dose selectors over the dose ladder' },
  'KORB_GLP1_Patient_Message_Builder.html':
    { probe: null, why: 'builds portal message text against a 1000-character cap' },
  'KORB_Provider_Clinical_Reference.html':
    { probe: null, why: 'FH&L state selector and per-programme routing' },
  'KORB_Functional_Health_Tracker.html':
    { probe: null, why: 'FH&L agent and week tracking' },
  'KORB_Patient_Treatment_Schedule.html':
    { probe: null, why: 'FH&L schedule generation from a start date' },
  'KORB_Lab_Interpretation_Tool.html':
    { probe: null, why: 'hand-built, no data file - see open item 5' },
  'KORB_Testosterone_Tracker.html':
    { probe: null, why: 'hand-built, no data file - see open item 5' },
  'KORB_Scheduler_Intake_Prototype.html':
    { probe: null, why: 'vendor spec prototype, not a clinical tool' },
  'KORB_Scheduler_Intake_AllPrograms.html':
    { probe: null, why: 'vendor spec prototype, not a clinical tool' },
  'Provider_Reference/KORB_BMI_Protein_Calculator.html':
    { probe: null, why: 'out for provider feedback, not released' },
  'Provider_Reference/KORB_BMI_Protein_Calculator_standalone.html':
    { probe: null, why: 'out for provider feedback, not released' }
};

/* Named exclusions. Anything here is deliberately not an artifact of this
   register, and says which register it belongs to instead. */
function excluded(f) {
  if (/^Provider_Reference\/GLP1\//.test(f)) return 'generated document - rx-signoff.js';
  if (/_Clinical_Reference\.html$/.test(f)) return 'generated document - rx-signoff.js';
  if (/^Provider_Reference\/KORB_FHL_.*_Provider_Reference\.html$/.test(f))
    return 'generated document - rx-signoff.js';
  if (f === 'KORB_Patient_Hub.html') return 'patient-facing, not a provider tool';
  if (f === 'Provider_Reference/KORB_AddOn_Selector.html')
    return 'redirect to KORB_Optimization_Products.html, no content of its own';
  if (f === 'Provider_Reference/KORB_GLP1_Provider_Tool.html')
    return 'retired 2026-09-17 - redirect to KORB_GLP1_Provider_Reference.html';
  if (/^Patient_Education\//.test(f)) return 'handout - listed separately below';
  return null;
}

const ARTIFACTS = [];
const EXCLUDED = [];

require('child_process')
  .execSync('git ls-files "*.html"', { encoding: 'utf8', cwd: ROOT })
  .split('\n').map(function (x) { return x.trim(); })
  .filter(Boolean)
  .forEach(function (f) {
    const why = excluded(f);
    if (why) { EXCLUDED.push({ file: f, why: why }); return; }
    const meta = TOOL_META[f] || {};
    const base = f.split('/').pop().replace(/\.html$/, '');
    ARTIFACTS.push({
      /* STABLE KEY. A signature is stored against it, so it must not be
         derived from a filename: KORB_TRT_Provider_Tool.html became
         KORB_Mens_Health_Provider_Tool.html earlier today and a derived key
         would have silently orphaned Don's signature. Mapped tools name their
         own; unmapped ones derive one, and carry no signature yet anyway. */
      key: 'tool:' + (meta.key || base.replace(/^KORB_/, '').toLowerCase()),
      kind: 'tool',
      probe: meta.probe || null,
      noProbeWhy: meta.probe ? null
        : (meta.why || 'not yet classified - add it to TOOL_META in artifact-signoff.js'),
      label: meta.label || base.replace(/^KORB_/, '').split('_').join(' '),
      file: f,
      records: meta.records || null
    });
  });

/* The handouts are uniform - static renders with no controls - so they are
   generated from the directory rather than typed, for the same reason. */
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

/* Column padding for the report. Written out rather than relying on padEnd so
   a long derived key pushes its label right instead of running into it. */
function pad(v, n) {
  v = String(v);
  return v.length >= n ? v + '  ' : v + new Array(n - v.length + 1).join(' ');
}

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

/* THE PLAN NOTE IS CLINICAL TEXT AND IT IS COVERED.

   Added 2026-09-17 with korb-plan-block.js. A plan note is pasted into a chart,
   so it is exactly the kind of content a signature has to reach - and the first
   version of these probes did not touch it. All three tools gained one without
   a single fingerprint moving: the register reported nothing changed on the day
   every tool changed. Caught by looking at the report after the wiring, not by
   any check.

   Each tool probe now returns the rendered text of the plan note it produces
   for the selection it ends on. */

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

  return { kind: 'tool', states: states.length, routing: routing, blocks: blocks,
           plan: (function () {
             var pre = document.querySelector('.korb-plan-body');
             return pre ? pre.innerText.replace(/\s+$/, '') : '';
           })() };
};

/* Men's Health provider tool.

   Same two passes as the Women's probe, over this tool's own axes. Routing here
   is state -> pharmacy rather than state -> destination list, because
   testosterone cypionate is Schedule III and only two states have a pharmacy at
   all. A state that resolves to no pharmacy is recorded as such: that is the
   fact a DEA registration or a state licence would move, and it is the whole
   reason this tool has a state selector.

   Blocks depend on dose, route and the pharmacy the state resolves to, not on
   the state itself, so pass 2 walks doses and routes per distinct pharmacy
   rather than repeating 51 times.

   Deliberately NOT recorded: the date fields. Visit, refill and lab scheduling
   are computed from an exam date and a PMP date, so including them would make
   the fingerprint depend on what day it was probed and every signature would
   expire overnight. */
PROBES.mens = function () {
  var stEl = document.getElementById('state');
  var doseEl = document.getElementById('dose');
  var routeEl = document.getElementById('route');
  var fire = function (el) { el.dispatchEvent(new Event('change', { bubbles: true })); };
  var optsOf = function (el) {
    return [].map.call(el.options, function (o) { return o.value; }).filter(Boolean);
  };

  var states = optsOf(stEl);
  var doses = optsOf(doseEl);
  var routes = optsOf(routeEl);

  /* PASS 1 - which pharmacy each state resolves to, and whether it has one. */
  var routing = {};
  var byPharmacy = {};
  states.forEach(function (code) {
    var P = (typeof pharmFor === 'function') ? pharmFor(code) : null;
    var name = P && (P.name || P.label || P.key) ? (P.name || P.label || P.key) : null;
    routing[code] = { pharmacy: name, prescribable: !!name };
    if (name && !byPharmacy[name]) byPharmacy[name] = code;
  });

  /* PASS 2 - the prescribing blocks, per pharmacy x dose x route. */
  var blocks = {};
  Object.keys(byPharmacy).forEach(function (pharm) {
    stEl.value = byPharmacy[pharm]; fire(stEl);
    doses.forEach(function (d) {
      routes.forEach(function (r) {
        doseEl.value = d; fire(doseEl);
        routeEl.value = r; fire(routeEl);
        [].forEach.call(document.querySelectorAll('#output table.fld'), function (tbl) {
          var card = tbl.closest ? tbl.closest('.card') : null;
          var hd = card ? card.querySelector('.card-hdr') : null;
          var name = pharm + ' / ' + d + ' / ' + r + ' / ' +
            (hd ? hd.innerText.replace(/Copy all fields/g, '').replace(/\s+/g, ' ').trim() : 'rx');
          blocks[name] = [].map.call(tbl.querySelectorAll('tr'), function (tr) {
            var k = tr.querySelector('td.k'), v = tr.querySelector('.fv');
            return k && v ? k.innerText.trim() + '=' + v.innerText.replace(/\s+/g, ' ').trim() : '';
          }).filter(Boolean).join('|');
        });
      });
    });
  });

  return { kind: 'tool', states: states.length, routing: routing, blocks: blocks,
           plan: (function () {
             var pre = document.querySelector('.korb-plan-body');
             return pre ? pre.innerText.replace(/\s+$/, '') : '';
           })() };
};

/* Add-On optimization tool.

   Three axes that decide what a provider is offered: the state (which picks the
   pharmacy), the gender (which filters products AND gates the programme), and
   the category. The probe walks every state for both genders and records which
   products each combination offers, then opens every category and takes the
   prescribing blocks for every product and every strength.

   The gender/programme gate is recorded too - which programmes are disabled for
   each gender - because that is a rule about who may be prescribed what, and it
   would otherwise be invisible to any check. */
PROBES.addons = function () {
  var fire = function (el) { el.dispatchEvent(new Event('change', { bubbles: true })); };
  var set = function (id, v) { var el = document.getElementById(id); el.value = v; fire(el); };
  var opts = function (el) {
    return [].map.call(el.options, function (o) { return o.value; }).filter(Boolean);
  };
  var st = document.getElementById('st');
  var prog = document.getElementById('prog');
  var states = opts(st);
  var routing = {}, blocks = {};

  ['m', 'f'].forEach(function (g) {
    states.forEach(function (code) {
      set('st', code); set('sex', g);
      var barred = [].filter.call(prog.options, function (o) { return o.disabled; })
                     .map(function (o) { return o.text; });
      /* Any programme still open, so the category rows exist at all. */
      var open = opts(prog).filter(function (v) { return !barred.length || barred.indexOf(v) === -1; })[0];
      if (!open) { routing[code + '/' + g] = { barred: barred, products: [] }; return; }
      set('prog', open);

      var offered = [];
      /* RE-QUERY EVERY TIME. Ticking a category calls render(), which repaints
         the whole row set, so a NodeList captured before the first tick is a
         list of detached nodes and every later click goes nowhere. The first
         version of this probe did exactly that and reported 4 blocks out of 25
         while looking like it had walked everything. Drive by key, never by a
         held reference. */
      var catKeys = [].map.call(document.querySelectorAll('.crow input[data-g]'),
                                function (c) { return c.dataset.g; });
      catKeys.forEach(function (g) {
        var cb = document.querySelector('.crow input[data-g="' + g + '"]');
        if (!cb || cb.disabled) return;
        if (!cb.checked) { cb.checked = true; fire(cb); }
        var names = opts(document.getElementById('sel_' + g) || { options: [] });
        names.forEach(function (name) {
          offered.push(g + ':' + name);
          var sel = document.getElementById('sel_' + g);
          if (!sel) return;
          sel.value = name; fire(sel);
          var n = (document.querySelectorAll('.strengthsel option').length) || 1;
          for (var i = 0; i < n; i++) {
            var ss = document.querySelector('.strengthsel');
            if (ss) { ss.value = String(i); fire(ss); }
            [].forEach.call(document.querySelectorAll('#out table.fld'), function (tbl) {
              var rows = [].map.call(tbl.querySelectorAll('tr'), function (tr) {
                var k = tr.querySelector('td.k'), v = tr.querySelector('.fv');
                return k && v ? k.innerText.trim() + '=' + v.innerText.replace(/\s+/g, ' ').trim() : '';
              }).filter(Boolean);
              /* KEYED BY THE TEBRA FAVORITE NAME, which already carries the
                 pharmacy and the strength. Keying by the product name collapsed
                 FarmaKeio and Premier into one entry, so an edit to one of the
                 two could hide behind whichever was captured last. */
              var nm = rows.filter(function (r) { return r.indexOf('Name=') === 0; })[0];
              var lbl = nm ? nm.slice(5) : (name + (n > 1 ? ' @' + i : ''));
              blocks[lbl] = rows.join('|');
            });
          }
        });
        var back = document.querySelector('.crow input[data-g="' + g + '"]');
        if (back && back.checked) { back.checked = false; fire(back); }
      });
      routing[code + '/' + g] = { barred: barred, products: offered.sort() };
    });
  });

  return { kind: 'tool', states: states.length, routing: routing, blocks: blocks,
           plan: (function () {
             var pre = document.querySelector('.korb-plan-body');
             return pre ? pre.innerText.replace(/\s+$/, '') : '';
           })() };
};

/* The GLP-1 provider tool's probe lived here until 2026-09-17. The tool was
   retired to a redirect - it produced the same 150 Tebra entries as the ten
   signed monographs - so the probe went with it rather than being kept against
   a page that no longer renders anything.

   Its one durable lesson is kept, because it cost a failed-looking negative
   test to learn: A FROZEN TOOL FINGERPRINTS ITS EMBEDDED BLOB, NOT ITS DATA
   FILE. Editing korb-addons-data.js does not move the Add-On tool's fingerprint
   until build-embed.js runs. A signed frozen tool beside an edited data file is
   a real state, and `node build-embed.js --check` is what catches it, not this
   register. Run both. */

/* GLP-1 pharmacy routing.

   One state selector and a routing answer per state. This page already has a
   self check - KORB_ROUTING_SELFCHECK() - and the two do different jobs: that
   one asserts the routing is internally consistent, this one records WHAT it
   decided so a change to any of it shows up as a stale signature rather than
   as a passing check.

   The full message string is taken, not just the pharmacy name. A state moving
   from "Premier ships here" to "Premier ships here, confirm supply" is a change
   a provider reads and acts on. */
PROBES.routing = function () {
  var st = document.getElementById('st');
  var fire = function (el) { el.dispatchEvent(new Event('change', { bubbles: true })); };
  var out = {};
  [].map.call(st.options, function (o) { return o.value; }).filter(Boolean).forEach(function (code) {
    st.value = code; fire(st);
    var box = document.getElementById('out') || document.body;
    out[code] = box.innerText.replace(/\s+/g, ' ').trim();
  });
  /* This page decides WHERE a prescription goes, it does not write one, so it
     has no prescribing blocks and says so. Declaring it is a different act
     from silently rendering none - the same distinction rx-signoff.js draws
     with noPrescribingBlocks. */
  return { kind: 'tool', states: Object.keys(out).length, routing: out, blocks: {},
           noBlocksReason: 'a routing page decides the destination and writes no prescription' };
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
      entry.undrivable = a.noProbeWhy
        ? 'no probe yet - ' + a.noProbeWhy
        : 'no probe: this tool has no driver yet, so its routing cannot be fingerprinted';
      out.push(entry);
      continue;
    }
    /* A probe NAMED but not implemented is a different fault from one that was
       never written, and it used to crash here with "cannot read blocks of
       undefined" - which reads like a broken tool rather than a broken
       register. Say which it is. */
    if (!PROBES[a.probe]) {
      entry.undrivable = 'TOOL_META names probe "' + a.probe + '" and PROBES has no such function';
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
        /* Zero blocks is almost always a broken probe, so it stays an error
           unless the probe SAYS the tool has none and why. */
        if (!(r.shot && r.shot.noBlocksReason)) {
          problems.push(r.key + ' produced zero prescribing blocks across every state ' +
            'and destination. Either the tool is broken or the probe no longer matches ' +
            'its markup. Check the second before believing the first.');
        }
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
      : 'Reviewed this tool as rendered - the states it covers, the pharmacies ' +
        'and products it offers for each of them, what it blocks and where, and ' +
        'the Tebra prescribing blocks it produces - and approve it for use by ' +
        'the provider team.';
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
      console.log('  ' + pad(r.key, 34) + pad(r.label, 34) + note);
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
