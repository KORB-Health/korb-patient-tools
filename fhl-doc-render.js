/* ============================================================================
   KORB HEALTH — FUNCTIONAL HEALTH & LONGEVITY PROVIDER REFERENCE RENDERER

   Renders the four FH&L provider references — Foundation, Gateway, Peak
   Pathway A, Peak Pathway B — from korb-dosing-data.js. One module, used by
   both the live HTML shell in the browser and the PDF build, so the printed
   page and the live page cannot drift apart.

   WHY THIS FILE EXISTS
     The four documents in the repo were stamped "korb-dosing-data.js v2.5,
     generated 2026-08-12" by a generator that was never committed. When the
     data changed underneath them they could not be rebuilt, and by 2026-09-11
     they had drifted badly:

       - They stated "Greenwich Pharmacy, which ships to all 50 states plus
         DC." Greenwich stopped shipping to AR, CA, IN, NH and WA.
       - Their closed-state list was the twelve-state version. Mississippi was
         added on 2026-08-24 and never reached them, and the five states above
         came later. A provider reading the printed document would have seen
         six states as open that are not.
       - Their Premier routing list still carried MS, removed the same day.
       - Foundation gained a titration ladder in data v2.6/v2.7 that the
         document never showed, so the printed Foundation reference described
         a single fixed dose per agent.

     A generator that lives outside the repo is a generator that stops
     existing. This one is in the repo.

   DO NOT EDIT A GENERATED DOCUMENT. Edit korb-dosing-data.js, or edit this
   renderer, and rebuild. A hand-edit is overwritten by the next build.

   HOUSE STYLE
     CSS, the embedded Montserrat faces and the logo come from
     provider-doc-render.js rather than being restated here. The GLP-1
     renderer's stylesheet was itself written to match these FH&L documents,
     so sharing it is what keeps the provider library reading as one set —
     and it means a brand change lands in both families at once.

   STATE FACTS COME FROM THE DATA FILE, ALWAYS
     Every state list on the page is read from KORB_DOSING.states at render
     time. There is no state name typed into this file. That is the whole
     point of the rebuild: the next pharmacy change edits one array and every
     document follows.
   ============================================================================ */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./provider-doc-render.js'));
  else root.KORB_FHL_DOCS = factory(root.KORB_DOCS);
}(typeof self !== 'undefined' ? self : this, function (GLP1DOCS) {

/* The data file, bound by renderBody()/mount() before any section runs. */
var K = null;

var esc = GLP1DOCS.esc;
var CSS = GLP1DOCS.CSS;
var LOGO_URI = GLP1DOCS.LOGO_URI;

/* ── THE DOCUMENTS ────────────────────────────────────────────────────────
   One per program in KORB_DOSING.programs. `program` is the key into that
   object; everything else about the document is derived from it. */
const DOCS = [
  { id: 'foundation', program: 'foundation', file: 'KORB_FHL_Foundation_Provider_Reference',      title: 'Foundation' },
  { id: 'gateway',    program: 'gateway',    file: 'KORB_FHL_Gateway_Provider_Reference',         title: 'Gateway' },
  { id: 'peakA',      program: 'peakA',      file: 'KORB_FHL_Peak_Pathway_A_Provider_Reference',  title: 'Peak Performance — Pathway A' },
  { id: 'peakB',      program: 'peakB',      file: 'KORB_FHL_Peak_Pathway_B_Provider_Reference',  title: 'Peak Performance — Pathway B' }
];

/* Pharmacies that actually fill FH&L peptides, in document order. Read from
   the data file rather than typed, so a pharmacy added there appears here. */
function pharmKeys() { return Object.keys(K.pharmacies); }
function pharmName(k) { return (K.pharmacies[k] || {}).name || k; }

/* ── AGENT RESOLUTION ─────────────────────────────────────────────────────
   Which agent keys a document covers, and in what role. Foundation is the odd
   one: three standalone choices, each with its own ladder, no stagger and no
   add-on. The other three are primary family + BPC-157 base + GHK-Cu add-on. */
function agentRows(doc) {
  const prog = K.programs[doc.program];
  const out = [];

  if (doc.program === 'foundation') {
    (prog.agentChoices || []).forEach(function (fam) {
      const opts = (prog.primaryDoseOptions || {})[fam];
      if (opts && opts.length) {
        opts.forEach(function (dv) {
          out.push({ key: K.resolvePrimaryKey(fam, dv), family: fam, role: 'Standalone course', context: 'foundation' });
        });
      } else {
        out.push({ key: fam, family: fam, role: 'Standalone course', context: 'foundation' });
      }
    });
    return out;
  }

  const fam = prog.primaryFamily;
  (prog.primaryDoseOptions || []).forEach(function (dv) {
    out.push({ key: K.resolvePrimaryKey(fam, dv), family: fam, role: 'Primary agent', context: 'foundation' });
  });
  (prog.baseProtocol || []).forEach(function (k) {
    if (k === fam) return;
    out.push({
      key: k, family: k, context: 'gatewayPeakBase',
      role: 'Base protocol — not optional. Starts 2 weeks after the primary agent.'
    });
  });
  if (prog.optionalAddon) {
    out.push({
      key: prog.optionalAddon, family: prog.optionalAddon, context: 'optionalAddon',
      role: 'Optional add-on — the only one in the program structure'
    });
  }
  return out;
}

/* Unique agent keys, preserving order — the Rx section wants one block per
   agent regardless of how many doses share it. */
function agentKeys(doc) {
  const seen = {}, out = [];
  agentRows(doc).forEach(function (r) { if (!seen[r.key]) { seen[r.key] = 1; out.push(r); } });
  return out;
}

function agentTitle(key) {
  const a = K.agents[key];
  if (!a) return key;
  return a.label + ' ' + a.dose;
}

function weeksLabel(key, context) {
  const w = K.getActiveWeeks(key, context);
  return w ? ('Weeks ' + w[0] + '–' + w[1]) : '—';
}

/* ── SMALL HELPERS ────────────────────────────────────────────────────────── */
function kvRows(pairs) {
  return pairs.filter(Boolean).map(function (p) {
    return '<tr><th>' + esc(p[0]) + '</th><td>' + p[1] + '</td></tr>';
  }).join('');
}
function bullets(list) {
  return '<ul>' + list.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
}
function stateList(arr) { return (arr || []).slice().join(', '); }

/* ── SECTIONS ─────────────────────────────────────────────────────────────── */

function sectionGlance(doc) {
  const prog = K.programs[doc.program];
  const names = agentKeys(doc).map(function (r) { return agentTitle(r.key); });
  const uniqueNames = names.filter(function (n, i) { return names.indexOf(n) === i; });

  let structure;
  if (doc.program === 'foundation') {
    structure = 'Single agent, provider selects one. No stagger, no optional add-on.';
  } else {
    const famLabel = (K.agents[K.resolvePrimaryKey(prog.primaryFamily, (prog.primaryDoseOptions || [])[0])] || {}).label || prog.primaryFamily;
    structure = famLabel + ' as the primary agent, plus BPC-157 as part of the base protocol, plus GHK-Cu as an optional add-on.';
  }

  return '<h2>At a glance</h2><table class="kv">' + kvRows([
    ['Program', esc(prog.label)],
    ['Structure', esc(structure)],
    ['Cycle length', '16 weeks'],
    ['Agents in this document', esc(uniqueNames.join(' · '))],
    ['Pharmacies', esc(pharmKeys().map(pharmName).join(' and ')) + ' — routed by patient state']
  ]) + '</table>';
}

function sectionCycle(doc) {
  const rows = agentRows(doc).map(function (r) {
    const a = K.agents[r.key] || {};
    return '<tr><td>' + esc(agentTitle(r.key)) + '</td><td>' + esc(r.role) +
           '</td><td>' + esc(weeksLabel(r.key, r.context)) + '</td><td>' + esc(a.timing || '') + '</td></tr>';
  }).join('');

  let notes = '';
  if (doc.program === 'foundation') {
    notes = '<div class="callout"><p>Foundation is a single agent. The provider selects one of the three; there is no stagger and GHK-Cu is never a Foundation option.</p></div>';
  } else {
    notes = '<div class="callout"><p>The primary agent runs Weeks 1–12, then Weeks 13–16 are off. BPC-157 is staggered to start Week 3. GHK-Cu, if selected, runs Weeks 5–8.</p>' +
            '<p>GHK-Cu is billed once, separately from the program.</p></div>';
  }

  return '<h2>The 16-week cycle</h2><table><thead><tr><th>Agent</th><th>Role</th><th>Active weeks</th><th>Timing</th></tr></thead><tbody>' +
         rows + '</tbody></table>' + notes;
}

/* The dose ladder. Rendered wherever a family has more than one dose, which
   as of data v2.7 includes Foundation — the ladder existed in the data and
   the old printed document never showed it. */
function sectionLadder(doc) {
  const prog = K.programs[doc.program];
  const keys = pharmKeys();
  let families = [];

  if (doc.program === 'foundation') {
    (prog.agentChoices || []).forEach(function (fam) {
      const opts = (prog.primaryDoseOptions || {})[fam];
      if (opts && opts.length > 1) families.push({ fam: fam, opts: opts });
    });
  } else if ((prog.primaryDoseOptions || []).length > 1) {
    families.push({ fam: prog.primaryFamily, opts: prog.primaryDoseOptions });
  }
  if (!families.length) return '';

  return families.map(function (f) {
    const famLabel = (K.agents[K.resolvePrimaryKey(f.fam, f.opts[0])] || {}).label || f.fam;
    const head = '<tr><th>Dose</th>' + keys.map(function (k) {
      return '<th>' + esc(pharmName(k).replace(' Pharmacy', '')) + ' — units</th>';
    }).join('') + '<th>Active weeks</th><th>Schedule</th></tr>';

    const body = f.opts.map(function (dv) {
      const key = K.resolvePrimaryKey(f.fam, dv);
      const a = K.agents[key] || {};
      const cells = keys.map(function (pk) {
        const t = K.getInstruction(key, pk) || '';
        const m = t.match(/([0-9.]+)\s*units/i);
        return '<td>' + (m ? esc(m[1] + ' units') : '—') + '</td>';
      }).join('');
      return '<tr><td>' + esc(a.dose || dv) + '</td>' + cells +
             '<td>' + esc(weeksLabel(key, 'foundation')) + '</td><td>' + esc(a.schedule || '') + '</td></tr>';
    }).join('');

    /* The titration note is clinical and belongs to the agent, so it is read
       from foundationAgents rather than restated here. Foundation's sermorelin
       ladder stops at 400 mcg for a commercial reason the note explains. */
    const fa = K.foundationAgents[f.fam];
    let note = '<p class="fine">Escalation is lab-based. Increase to the next step only if IGF-1 remains below target at the 16-week recheck.</p>';
    if (fa && fa.titrationNote) note += '<div class="callout"><p>' + esc(fa.titrationNote) + '</p></div>';
    if (doc.program === 'foundation' && f.fam === 'sermorelin' && K.programs.foundation.sermorelin500Excluded) {
      note += '<div class="callout warn"><h3>500 mcg is not a Foundation dose</h3><p>' +
              esc(K.programs.foundation.sermorelin500ExclusionReason) + '</p></div>';
    }

    return '<h2>Dose ladder — ' + esc(famLabel) + '</h2>' + note +
           '<table><thead>' + head + '</thead><tbody>' + body + '</tbody></table>' +
           '<div class="callout"><p>The milligram dose is what is prescribed. The unit count is what the patient draws, and it differs by pharmacy.</p></div>';
  }).join('');
}

function sectionDirections(doc) {
  const keys = pharmKeys();
  const rows = [];
  agentKeys(doc).forEach(function (r) {
    keys.forEach(function (pk) {
      const t = K.getInstruction(r.key, pk);
      if (!t) return;
      rows.push('<tr><td>' + esc(agentTitle(r.key)) + '</td><td>' + esc(pharmName(pk)) + '</td><td>' + esc(t) + '</td></tr>');
    });
  });
  return '<h2>Directions given to the patient</h2>' +
         '<table><thead><tr><th>Agent</th><th>Pharmacy</th><th>Direction</th></tr></thead><tbody>' +
         rows.join('') + '</tbody></table>' +
         '<div class="callout"><h3>The rest day is not a fixed weekday</h3>' +
         '<p>The protocol is 6 days on, 1 day off. The specific weekday is a recommendation for ease of patient recall, not a clinical requirement. ' +
         'The patient’s tracker derives their rest day from their own start date, so a patient starting on a Wednesday rests Tuesday. ' +
         'Do not tell a patient their rest day is Sunday.</p></div>';
}

/* Which agents actually trip a pharmacy's 100-unit callout, worked out from
   the sigs rather than typed. The old document named Tesamorelin 2 mg at 67
   units, which was correct when it was written and is the kind of fact that
   goes stale the moment a dose is added. Derived, it cannot. */
function calloutAgents(pharmKey) {
  const cfg = K.syringes[pharmKey] || {};
  if (cfg.calloutAtOrAbove == null) return [];
  const out = [];
  Object.keys(K.instructions).forEach(function (k) {
    const t = K.getInstruction(k, pharmKey);
    const m = t && t.match(/([0-9.]+)\s*units/i);
    if (!m) return;
    if (parseFloat(m[1]) >= cfg.calloutAtOrAbove) {
      const a = K.agents[k];
      /* Some agent labels already carry their dose (Tesamorelin 1.5 mg), others
         do not (BPC-157). Do not print the dose twice. */
      if (a) {
        const name = a.label.indexOf(a.dose) === -1 ? (a.label + ' ' + a.dose) : a.label;
        out.push(name + ', dosed at ' + m[1] + ' units');
      }
    }
  });
  return out;
}

function sectionSyringes() {
  const rows = pharmKeys().map(function (k) {
    const cfg = K.syringes[k] || {};
    const hits = calloutAgents(k);
    const when = cfg.calloutAtOrAbove == null
      ? 'Not applicable — ' + pharmName(k).replace(' Pharmacy', '') + ' ships ' + cfg.standardUnits + '-unit syringes across the board.'
      : 'Any dose at or above ' + cfg.calloutAtOrAbove + ' units.' +
        (hits.length ? ' Currently ' + hits.join('; ') + '.' : '');
    return '<tr><td>' + esc(pharmName(k)) + '</td><td>' + esc(cfg.standardUnits + '-unit (' + (cfg.standardUnits / 100) + ' mL)') +
           '</td><td>' + esc(when) + '</td></tr>';
  }).join('');
  return '<h2>Syringes</h2><table><thead><tr><th>Pharmacy</th><th>Standard syringe</th><th>When a 100-unit syringe is required instead</th></tr></thead><tbody>' +
         rows + '</tbody></table>';
}

/* ── THE STATE SECTION ────────────────────────────────────────────────────
   Every list here is read from KORB_DOSING.states at render time. The four
   reasons a state can be closed are rendered as four separate blocks, because
   "not yet" and "cannot be filled at all" are different facts and a provider
   answers a patient differently depending on which one applies. */
function sectionStates() {
  const S = K.states;
  const unavailable = S.unavailable || [];
  const noShip = S.unavailableNoShip || [];
  const noPharm = S.unavailableNoPharmacy || [];
  const labFlow = S.unavailableLabWorkflow || [];

  /* Premier routing minus anything FH&L is closed in. A provider scanning this
     list reads a state as "you can send it there", so a closed state must not
     appear even if Premier could physically ship to it. */
  const premierOpen = (S.premierRouting || []).filter(function (s) { return unavailable.indexOf(s) === -1; });

  /* What Greenwich covers is now stated as a rule rather than a state list:
     everything not defaulting to Premier, except what it cannot ship to and
     except what FH&L is closed in. */
  const gw = K.pharmacies.greenwich ? 'Greenwich Pharmacy' : 'the non-Premier pharmacy';

  let h = '<h2>Which pharmacy, and where you can prescribe</h2>';
  h += '<table class="kv">' + kvRows([
    ['Defaults to Premier', esc(stateList(premierOpen))],
    ['Everywhere else', esc(gw) + ', for every state not listed as closed'],
    ['Functional Health & Longevity is not offered in these states', '<strong>' + esc(stateList(unavailable)) + '</strong>']
  ]) + '</table>';

  if (noPharm.length) {
    const paused = S.pausedPharmacy || null;
    h += '<div class="callout warn"><h3>Paused — no pharmacy can fill — ' + esc(stateList(noPharm)) + '</h3>' +
         '<p>Greenwich stopped relying on central-fill arrangements on 11 September 2026 and now dispenses only into ' +
         'the 23 states where it is directly licensed. Premier is not licensed in any of these, ' +
         'so there is no peptide source while the restriction holds. No visit, no prescription, no shipment.</p>';
    if (paused && paused.expectedRestore) {
      h += '<p><strong>This is a pause, not a withdrawal.</strong> Greenwich expects to restore coverage in ' +
           esc(paused.expectedRestore) + '. Tell a patient the program is temporarily unavailable in their state and that ' +
           'coverage is expected back. Do not tell them it has been discontinued. Operations reviews this by ' +
           esc(paused.reviewBy || 'the restore date') + '.</p>';
    }
    if (paused && (paused.alsoLostGreenwichButAlreadyExcluded || []).length) {
      h += '<p>' + esc(stateList(paused.alsoLostGreenwichButAlreadyExcluded)) + ' also lost Greenwich, but each was already ' +
           'out of the peptide program before this change and stays closed regardless of the restore. They are not listed ' +
           'here.</p>';
    }
    h += '</div>';
  }

  /* Open states with no second pharmacy. Not a block — a caution. A provider
     reading this is allowed to prescribe; they just cannot promise a date. */
  const single = S.singleSourceGreenwich || null;
  const singleLive = single ? (single.liveStates || []).filter(function (s) { return unavailable.indexOf(s) === -1; }) : [];
  if (singleLive.length) {
    h += '<div class="callout"><h3>Single-source states — ' + esc(stateList(singleLive)) + '</h3>' +
         '<p>These states are open and taking patients. Greenwich is the only pharmacy licensed to fill a peptide there and ' +
         'Premier cannot cover them, so there is no fallback if Greenwich restricts again. ' +
         esc(single.providerLine || '') + '</p></div>';
  }
  if (noShip.length) {
    h += '<div class="callout warn"><h3>Excluded from the offering — ' + esc(stateList(noShip)) + '</h3>' +
         '<p>No peptide or other Functional Health &amp; Longevity product may be shipped to these states. They are excluded ' +
         'from the offering, not pending launch. Confirm with Operations before any exception.</p></div>';
  }
  if (labFlow.length) {
    h += '<div class="callout"><h3>Held for lab workflow — ' + esc(stateList(labFlow)) + '</h3>' +
         '<p>These are held for a distinct reason: a different lab workflow required by state-specific legislation, not provider ' +
         'coverage. Do not proceed until Operations confirms.</p></div>';
  }

  h += '<div class="callout"><p>Unit counts differ between the pharmacies for the same milligram dose. Always read the units off ' +
       'the row for the patient’s pharmacy, never from the other column.</p></div>';
  return h;
}

function sectionRx(doc) {
  const keys = pharmKeys();
  let h = '<h2>Tebra Compounded Drug Favorite — exact fields</h2>' +
          '<p class="fine">Copy these values literally. Do not paraphrase, and do not adjust quantity, refill or days supply. ' +
          'Greenwich requires “as directed by provider” in Patient Instructions because KORB does not follow their ' +
          'protocols — the full direction still goes to the patient through their treatment schedule.</p>';

  agentKeys(doc).forEach(function (r) {
    const rec = K.prescribing[r.key];
    if (!rec) return;
    const a = K.agents[r.key] || {};
    h += '<div class="rxblock"><h3>' + esc((rec.name || a.label) + ' — ' + (a.dose || '')) + '</h3>';
    keys.forEach(function (pk) {
      const e = rec[pk];
      if (!e || !e.fields) return;
      h += '<h4>' + esc(pharmName(pk)) + '</h4><table class="rx"><thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>' +
           e.fields.map(function (f) {
             return '<tr><th>' + esc(f.field) + '</th><td>' + esc(f.val) + '</td></tr>';
           }).join('') + '</tbody></table>';
    });
    if (rec.storage) h += '<p class="fine"><strong>Storage:</strong> ' + esc(rec.storage) + '</p>';
    h += '</div>';
  });
  return h;
}

/* Counseling and monitoring for the agents this document actually covers.
   Keyed off the agent family so a document never carries another program's
   counseling points. */
const COUNSEL_KEY = { sermorelin: 'serm', cjcipam: 'cjc', tesamorelin: 'tesa' };

function sectionClinical(doc) {
  const prog = K.programs[doc.program];
  const fams = doc.program === 'foundation' ? (prog.agentChoices || []) : [prog.primaryFamily];
  let h = '<h2>Counseling and monitoring</h2>';

  fams.forEach(function (fam) {
    const ck = COUNSEL_KEY[fam];
    const label = (K.foundationAgents[fam] || {}).label || fam;
    if (ck && K.counselingText[ck]) h += '<h3>' + esc(label) + ' — counseling points</h3>' + bullets(K.counselingText[ck]);
    if (ck && K.monitoringText[ck]) h += '<h3>' + esc(label) + ' — monitoring</h3>' + bullets(K.monitoringText[ck]);
  });

  /* Agents carrying their own counseling on the prescribing record — GHK-Cu is
     the one, and it is copper-containing, so its points are not optional. */
  agentKeys(doc).forEach(function (r) {
    const rec = K.prescribing[r.key];
    if (!rec || (!rec.counseling && !rec.monitor)) return;
    if (rec.counseling) h += '<h3>' + esc(rec.name) + ' — counseling points</h3>' + bullets(rec.counseling);
    if (rec.monitor) h += '<h3>' + esc(rec.name) + ' — monitoring</h3>' + bullets(rec.monitor);
  });

  h += sectionLabs();
  return h;
}

function sectionLabs() {
  const base = K.labs.base, half = Math.ceil(base.length / 2);
  const left = base.slice(0, half), right = base.slice(half);
  let rows = '';
  for (let i = 0; i < half; i++) {
    const l = left[i], r = right[i];
    rows += '<tr><td>' + esc(l.name) + '</td><td>' + esc(l.code) + '</td>' +
            '<td>' + (r ? esc(r.name) : '') + '</td><td>' + (r ? esc(r.code) : '') + '</td></tr>';
  }
  return '<h3>Lab protocol</h3>' +
    '<p class="fine">Baseline before medication start, then every 16 weeks. Order in Tebra via the Quest integration with a ' +
    'future collection date set 12 weeks out. No STAT designation is used.</p>' +
    '<table><thead><tr><th>Test</th><th>Code</th><th>Test</th><th>Code</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<p class="fine"><strong>Add for men aged 45 and over:</strong> ' + esc(K.labs.men45Plus.name) +
    ' — code ' + esc(K.labs.men45Plus.code) + '. ' + esc(K.labs.men45Plus.note) + '</p>' +
    '<div class="callout"><p>Copper RBC, Zinc RBC and Ceruloplasmin are part of the standard panel for every patient, ' +
    'regardless of which agent is prescribed.</p></div>';
}

function sectionPricing(doc) {
  const p = K.pricing[doc.program], base = K.pricing.baseline, ghk = K.pricing.ghkcu;
  const prog = K.programs[doc.program];
  const money = function (n) { return '$' + Number(n).toFixed(2); };
  let rows = '<tr><td>' + esc(base.label) + '</td><td>' + money(base.website) + '</td><td>' + money(base.partner) +
             '</td><td>' + esc(base.code) + '</td></tr>';

  if (p.codeByAgent) {
    /* Foundation prices one way and codes three ways, by agent. Printing one
       code here would be wrong for two of the three agents. */
    Object.keys(p.codeByAgent).forEach(function (fam) {
      const label = (K.foundationAgents[fam] || {}).label || fam;
      rows += '<tr><td>' + esc(p.label + ' — ' + label) + '</td><td>' + money(p.website.payment) + ' / mo</td><td>' +
              money(p.partner.payment) + ' / mo</td><td>' + esc(p.codeByAgent[fam].website + ' | ' + p.codeByAgent[fam].partner) +
              '</td></tr>';
    });
  } else {
    rows += '<tr><td>' + esc(p.label) + '</td><td>' + money(p.website.payment) + ' / mo</td><td>' +
            money(p.partner.payment) + ' / mo</td><td>' + esc(p.code.website + ' | ' + p.code.partner) + '</td></tr>';
  }
  if (prog.optionalAddon === 'ghkcu') {
    rows += '<tr><td>' + esc(ghk.label) + '</td><td>' + money(ghk.website) + '</td><td>' + money(ghk.partner) +
            '</td><td>' + esc(ghk.code) + '</td></tr>';
  }

  return '<h2>Pricing and charge codes</h2>' +
    '<p class="fine">Provider and internal only. Never quote a price to a patient from this document without confirming with Operations.</p>' +
    '<table><thead><tr><th>Item</th><th>Website</th><th>Partner</th><th>Charge code</th></tr></thead><tbody>' + rows + '</tbody></table>' +
    '<div class="callout"><p>Monthly figures are the recurring payment. Full 16-week cycle: ' + money(p.website.total) +
    ' website, ' + money(p.partner.total) + ' partner. Charge codes are shown website first, partner second.</p></div>';
}

/* ── PAGE ─────────────────────────────────────────────────────────────────── */
function renderBody(data, doc) {
  K = data;
  return `
<div class="titleband">
  <h1>${esc(doc.title)}</h1>
  <p class="sub">Functional Health &amp; Longevity · Provider Reference</p>
</div>
<p class="byline">KORB Health Group · korb-dosing-data.js v${esc(K.meta.version)} · ${esc(doc.stamp || 'live — reflects the data file as of this page load')}</p>

<div class="lede">Everything needed to prescribe the ${esc(K.programs[doc.program].label)}, complete on its own. The provider tool covers the same ground; this document exists so it is not required. Values are copied literally into the Tebra Compound section.</div>

${sectionGlance(doc)}
${sectionCycle(doc)}
${sectionLadder(doc)}
${sectionDirections(doc)}
${sectionSyringes()}
${sectionStates()}
${sectionRx(doc)}
${sectionClinical(doc)}
${sectionPricing(doc)}

<div class="foot">
  <div><h4>Questions and escalation</h4><ul>
    <li>Pharmacy or shipping issues — Operations</li>
    <li>Charge codes and billing — Operations</li>
    <li>Clinical protocol questions — Clinical Director</li>
    <li>Corrections to this document — Clinical Operations</li></ul></div>
  <div><h4>Do not improvise</h4><ul>
    <li>Do not alter quantity, refill or days supply</li>
    <li>Do not paraphrase patient instructions</li>
    <li>Do not prescribe into a state listed as closed</li>
    <li>Do not quote pricing to a patient without confirming with Operations</li></ul></div>
</div>
<p class="meta">For KORB provider use only. Not for patient distribution. KORB Health Group LLC is a management services organisation. Clinical care is delivered by the affiliated medical practice and its licensed providers.</p>`;
}

/* Browser entry point. The shell calls this after the scripts have loaded. */
function mount(docId, data) {
  K = data;
  const doc = DOCS.filter(d => d.id === docId)[0];
  if (!doc) { document.body.innerHTML = '<p>Unknown document: ' + esc(docId) + '</p>'; return; }
  document.title = doc.title + ' — FH&L Provider Reference';
  document.body.innerHTML = renderBody(K, doc);
}

return { DOCS: DOCS, esc: esc, renderBody: renderBody, mount: mount, CSS: CSS, LOGO_URI: LOGO_URI };
}));
