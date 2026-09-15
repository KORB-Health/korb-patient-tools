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

/* The shared Tebra Compounded Drug Favorite block. Reached through the GLP-1
   module, which already carries it, so the live shell needs one script tag for
   korb-rx-block.js rather than wiring it here separately. */
var RXB = GLP1DOCS.RXB;
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

  return '<h2>The 16-week cycle</h2><table class="grid"><thead><tr><th>Agent</th><th>Role</th><th>Active weeks</th><th>Timing</th></tr></thead><tbody>' +
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
           '<table class="grid"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>' +
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
         '<table class="grid"><thead><tr><th>Agent</th><th>Pharmacy</th><th>Direction</th></tr></thead><tbody>' +
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
  return '<h2>Syringes</h2><table class="grid"><thead><tr><th>Pharmacy</th><th>Standard syringe</th><th>When a 100-unit syringe is required instead</th></tr></thead><tbody>' +
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

  /* ONE COMPLETE BLOCK PER STRENGTH. Deliberately not grouped, and not to be
     "tidied" later: a provider works from this block to enter a real
     prescription, so every strength has to show its own whole entry with every
     field present. Factoring the shared fields out was tried on 2026-09-14 and
     reverted the same day - it saved pages and made the block unusable for the
     thing it exists for, because the entry a provider is transcribing was then
     split across a shared table and a per-strength table.

     The repetition a reader notices in this document is real, but it is in
     counselling and monitoring at the foot of the page, not here. That is where
     it has been collapsed. See sectionClinical(). */
  /* Storage is stated ONCE for the document, above. All twelve agents carry a
     byte-identical storage string, and repeating it under every block cost a
     page break each time - a one-line trailer is what was pushing each strength
     onto its own page. */
  const storages = {};
  agentKeys(doc).forEach(function (r) {
    const rec = K.prescribing[r.key];
    if (rec && rec.storage) storages[rec.storage] = true;
  });
  const storageList = Object.keys(storages);
  if (storageList.length === 1) {
    h += '<div class="callout"><p><strong>Storage — all agents in this document:</strong> ' +
         esc(storageList[0]) + '</p></div>';
  } else if (storageList.length > 1) {
    /* Not the case today, but if two agents ever disagree the document must not
       quietly print one of them as if it covered both. */
    h += '<div class="gate"><p><strong>Storage differs between agents in this document — read each:</strong></p><ul>' +
         storageList.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>';
  }

  agentKeys(doc).forEach(function (r) {
    const rec = K.prescribing[r.key];
    if (!rec) return;
    const a = K.agents[r.key] || {};
    /* The heading appends the dose ONLY when the name does not already carry one.
       Appending unconditionally produced "Sermorelin 300mcg - 300 mcg" and, worse,
       "CJC-1295 / Ipamorelin 100mcg/100mcg - 100 mcg CJC-1295 / 100 mcg
       Ipamorelin" - a combination product reading as though it had four strengths.

       The test is a strength TOKEN, digits followed by mcg or mg, not merely a
       digit: "BPC-157" contains 157 and carries no strength, so it still gets its
       500 mcg appended, while "Tesamorelin 1mg" does not. Don, 2026-09-15. */
    const carriesStrength = /\d+\s*(mcg|mg)(?![a-z])/i.test(String(rec.name || ''));
    const headingText = carriesStrength
      ? (rec.name || a.label)
      : ((rec.name || a.label) + (a.dose ? ' - ' + a.dose : ''));
    h += '<div class="rxblock"><h3 class="prodhead">' + esc(headingText) + '</h3>';
    /* Both pharmacies for ONE strength, side by side and kept on one page. They
       are the same prescription routed two ways, so a provider comparing them
       should not be turning a page to do it. The pair is the unit that must not
       break; each block inside it stays whole. */
    const pair = keys.map(function (pk) {
      const e = rec[pk];
      if (!e || !e.fields) return '';
      return RXB.block({
        pharmacy: pharmName(pk),
        label: e.label,
        fields: RXB.fieldsFrom(e),
        accent: RXB.accentFor(pk)
      });
    }).filter(Boolean);
    h += '<div class="rxb-pair">' + pair.join('') + '</div>';
    h += '</div>';
  });
  return h;
}

/* Counseling and monitoring for the agents this document actually covers.
   Keyed off the agent family so a document never carries another program's
   counseling points. */
const COUNSEL_KEY = { sermorelin: 'serm', cjcipam: 'cjc', tesamorelin: 'tesa' };

/* A heading for a set of strengths that share one piece of clinical advice.
   Identical labels collapse to themselves. Labels that differ only by dose -
   "Tesamorelin 1 mg", "Tesamorelin 1.5 mg", "Tesamorelin 2 mg" - collapse to
   their common prefix, "Tesamorelin". Anything with no useful common prefix
   falls back to listing them, which is ugly but never wrong: a heading is the
   one thing here that can safely be verbose. */
function commonLabel(labels) {
  const uniq = labels.filter(function (v, i) { return labels.indexOf(v) === i; });
  if (uniq.length === 1) return uniq[0];

  let pre = uniq[0];
  uniq.forEach(function (s) {
    let i = 0;
    while (i < pre.length && i < s.length && pre[i] === s[i]) i++;
    pre = pre.slice(0, i);
  });
  pre = pre.replace(/[\s–—\-/,]+$/, '').trim();
  return pre.length >= 3 ? pre : uniq.join(' / ');
}

function sectionClinical(doc) {
  const prog = K.programs[doc.program];
  const fams = doc.program === 'foundation' ? (prog.agentChoices || []) : [prog.primaryFamily];
  let h = '<h2>Counseling and monitoring</h2>';

  /* Counselling and monitoring are properties of the MEDICATION, not of the
     strength, and not of which of the two sources happened to supply them.

     Two things used to make this section repeat itself. Per strength, so
     "Sermorelin 300mcg — monitoring" landed on one page and "Sermorelin 400mcg
     — monitoring" on the next carrying the same twelve bullets, reading as
     though the doses are monitored differently. And per source, because the
     family text in K.counselingText and the copy on the prescribing record were
     both emitted, so a medication could appear twice over.

     Both sources are collected here and then collapsed on the CONTENT of the
     two lists. Content, not a name and not a label: Tesamorelin's labels differ
     per strength while its counselling is identical, so label-grouping would
     have missed it, and conversely an agent whose advice genuinely differs by
     strength keeps its own heading automatically, because its content differs.
     Nothing is merged that is not byte-identical.

     Verified before writing this: for sermorelin, CJC and tesamorelin the
     family text and the record copy are identical wherever both exist. The one
     asymmetry is CJC monitoring, which is empty at family level and twelve
     bullets on the record - so taking the longer of the two loses nothing and
     the earlier code simply printed nothing there. */
  const clinical = [];

  function same(a, b) { return JSON.stringify(a || null) === JSON.stringify(b || null); }
  function has(x) { return !!(x && x.length); }

  /* Merged per medication, then per content. A medication gets one entry; a
     source contributes whichever of the two lists it actually has. CJC-1295 /
     Ipamorelin is the case that forces this: the family text carries counselling
     and no monitoring, the prescribing record carries both, and keying on the
     pair alone produced two entries and printed the counselling twice.

     A second source offering DIFFERENT non-empty content for a list does not
     overwrite and does not merge - it becomes its own entry, so a real clinical
     difference can never be swallowed by this tidy-up. */
  function offer(labelIn, counseling, monitor) {
    if (!has(counseling) && !has(monitor)) return;

    for (let i = 0; i < clinical.length; i++) {
      const e = clinical[i];
      /* Two ways to be the same medication. Same label catches CJC, whose two
         sources agree on the label and differ in which list they carry. Same
         content catches Tesamorelin, whose label carries the dose - "Tesamorelin
         1 mg" against "Tesamorelin 1.5 mg" - while the advice is byte-identical.
         Neither test alone is enough; the earlier passes each used one and each
         left the other medication printing itself several times over. */
      const sameLabel = e.labels.indexOf(labelIn) !== -1;
      const sameBody = (has(counseling) && same(e.counseling, counseling)) ||
                       (has(monitor) && same(e.monitor, monitor));
      if (!sameLabel && !sameBody) continue;
      const cOk = !has(counseling) || !has(e.counseling) || same(e.counseling, counseling);
      const mOk = !has(monitor) || !has(e.monitor) || same(e.monitor, monitor);
      if (!cOk || !mOk) continue;
      if (has(counseling) && !has(e.counseling)) e.counseling = counseling;
      if (has(monitor) && !has(e.monitor)) e.monitor = monitor;
      if (e.labels.indexOf(labelIn) === -1) e.labels.push(labelIn);
      return;
    }
    clinical.push({ counseling: counseling, monitor: monitor, labels: [labelIn] });
  }

  fams.forEach(function (fam) {
    const ck = COUNSEL_KEY[fam];
    if (!ck) return;
    /* foundationAgents has no entry for every family, and falling through to
       the raw key printed a lowercase "tesamorelin" as a heading. */
    const label = (K.foundationAgents[fam] || {}).label ||
                  fam.charAt(0).toUpperCase() + fam.slice(1);
    offer(label, K.counselingText[ck], K.monitoringText[ck]);
  });

  /* Agents carrying their own counseling on the prescribing record — GHK-Cu is
     one, and it is copper-containing, so its points are not optional. */
  agentKeys(doc).forEach(function (r) {
    const rec = K.prescribing[r.key];
    if (!rec) return;
    const a = K.agents[r.key] || {};
    offer(a.label || rec.name, rec.counseling, rec.monitor);
  });

  clinical.forEach(function (g) {
    const label = commonLabel(g.labels);
    if (has(g.counseling)) h += '<h3>' + esc(label) + ' — counseling points</h3>' + bullets(g.counseling);
    if (has(g.monitor)) h += '<h3>' + esc(label) + ' — monitoring</h3>' + bullets(g.monitor);
  });

  h += sectionLabs();
  return h;
}

/* The panel, by who is being ordered for. Two columns, each one a COMPLETE
   list, because the question a provider is answering is "what do I order for
   this patient" and the answer has to be readable straight down one column.

   The previous version failed that twice over. It split the thirteen tests
   across a paired Test|Code|Test|Code grid, which reads as two half-panels
   rather than one panel, and it put PSA in a footnote underneath, so the one
   test that actually depends on the patient was the one not in the table. It
   then carried a callout saying Copper RBC, Zinc RBC and Ceruloplasmin are
   standard for everyone - which they are, and they were already rows 11 to 13,
   so the note only made the table look incomplete. The note is gone; the tests
   were never missing.

   Kept to one page: the section avoids breaking inside. */
function sectionLabs() {
  const base = K.labs.base;
  const psa = K.labs.men45Plus;

  /* ONE table, four columns, rather than two tables side by side in a flex row.
     Flex and pagination do not cooperate in Chromium: making each column
     unbreakable pushed the two columns onto separate pages and orphaned the
     heading on a third, which is worse than the split it was meant to prevent.
     A single table with a colspan group header paginates predictably, keeps the
     two orders row-aligned, and fits one page at fourteen rows. */
  const rows = base.map(function (l) {
    return '<tr><td>' + esc(l.name) + '</td><td class="code">' + esc(l.code) + '</td>' +
           '<td>' + esc(l.name) + '</td><td class="code">' + esc(l.code) + '</td></tr>';
  }).join('') +
    /* The extra row exists only on the right. The two cells on the left are
       left genuinely empty rather than filled with a dash: a dash reads as a
       value, and there is no test there to name. */
    '<tr class="addrow"><td class="na"></td><td class="na"></td>' +
    '<td class="addcell">' + esc(psa.name) + '</td>' +
    '<td class="code addcell">' + esc(psa.code) + '</td></tr>';

  return '<div class="labsec"><h3>Lab protocol</h3>' +
    '<p class="fine">Baseline before medication start, then every 16 weeks. Order in Tebra via the Quest integration with a ' +
    'future collection date set 12 weeks out. No STAT designation is used. Each side is the complete order — ' +
    'the only difference is the last row.</p>' +
    '<table class="grid labtbl"><thead>' +
      '<tr><th class="grp-a" colspan="2">Women, and men under 45</th>' +
          '<th class="grp-b" colspan="2">Men 45 and older</th></tr>' +
      '<tr><th>Test</th><th>Code</th><th>Test</th><th>Code</th></tr>' +
    '</thead><tbody>' + rows + '</tbody></table></div>';
}

/* EVERY PRICE SITS NEXT TO ITS OWN CHARGE CODE, on its own row.

   The old table had a Website column, a Partner column, and one Charge code
   column holding both codes joined by a pipe, with a note underneath saying
   which order they were in. Two prices and two codes in one row, correctly
   paired only if you read the legend - and the codes are what gets typed into
   a charge. Now one row is one price and the code that belongs to it.

   Partner first, because it is the smaller number and that is the order Don
   reads them in. Monthly is said on the row itself rather than only in a note
   under the table. */
/* A charge code is typed into a charge character for character, the same job
   every Tebra field does, so it carries the same copy button from the same
   module rather than a second mechanism. Consistent across all documents, per
   Don 2026-09-15. Lab CODES are left plain: they are ordered by picking the
   panel in Tebra, not by typing the number. */
function codeCopy(code) {
  return '<span class="cp" data-copy="' + esc(code) + '">' + esc(code) +
         '<button class="copybtn" type="button" aria-label="Copy">Copy</button></span>';
}

function sectionPricing(doc) {
  const p = K.pricing[doc.program], base = K.pricing.baseline, ghk = K.pricing.ghkcu;
  const prog = K.programs[doc.program];
  const money = function (n) { return '$' + Number(n).toFixed(2); };

  function payRow(label, amount, code, cls) {
    return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + esc(label) + '</td>' +
           '<td class="amt">' + money(amount) + '<span class="per"> / month</span></td>' +
           '<td class="code">' + codeCopy(code) + '</td></tr>';
  }
  function oneOffRow(label, amount, code) {
    return '<tr><td>' + esc(label) + '</td><td class="amt">' + money(amount) +
           '<span class="per"> one-time</span></td><td class="code">' + codeCopy(code) + '</td></tr>';
  }

  let rows = oneOffRow(base.label, base.partner, base.code);

  if (p.codeByAgent) {
    /* Foundation is one price with three charge codes, one per agent. The price
       is stated once, above, rather than repeated on three rows saying the same
       two numbers - what actually differs between the agents is the code. */
    rows += '<tr class="grp"><td colspan="3">' + esc(p.label) +
            ' — <strong>' + money(p.partner.payment) + ' / month partner</strong> or <strong>' +
            money(p.website.payment) + ' / month website</strong>. Charge code depends on the agent:</td></tr>';
    Object.keys(p.codeByAgent).forEach(function (fam) {
      const label = (K.foundationAgents[fam] || {}).label || fam;
      rows += payRow(label + ' — partner', p.partner.payment, p.codeByAgent[fam].partner);
      rows += payRow(label + ' — website', p.website.payment, p.codeByAgent[fam].website);
    });
  } else {
    rows += payRow(p.label + ' — partner', p.partner.payment, p.code.partner);
    rows += payRow(p.label + ' — website', p.website.payment, p.code.website);
  }

  if (prog.optionalAddon === 'ghkcu') {
    rows += oneOffRow(ghk.label, ghk.partner, ghk.code);
  }

  return '<div class="pricesec"><h2>Pricing and charge codes</h2>' +
    '<p class="fine">Provider and internal only. Never quote a price to a patient from this document without confirming with ' +
    'Operations. Every amount below is the recurring <strong>monthly</strong> payment unless the row says one-time, and each ' +
    'amount carries the charge code that belongs to it.</p>' +
    '<table class="grid pricetbl"><thead><tr><th>Item</th><th>Amount</th><th>Charge code</th></tr></thead><tbody>' +
    rows + '</tbody></table>' +
    '<div class="callout"><p>Monthly payments run across the full 16-week cycle: ' +
    money(p.partner.total) + ' partner in total, ' + money(p.website.total) + ' website in total.</p></div></div>';
}

/* ── PAGE ─────────────────────────────────────────────────────────────────── */
function renderBody(data, doc) {
  K = data;
  return `
<div class="titleband">
  <h1>${esc(doc.title)}</h1>
  <p class="sub">Functional Health &amp; Longevity · Provider Reference</p>
</div>
<p class="byline">KORB Health Medical Texas PA · korb-dosing-data.js v${esc(K.meta.version)} · ${esc(doc.stamp || 'live — reflects the data file as of this page load')}</p>

<div class="lede">Everything needed to prescribe the ${esc(K.programs[doc.program].label)}, complete on its own. The provider tool covers the same ground; this document exists so it is not required. Values are copied literally into the Tebra Compound section.</div>

${sectionGlance(doc)}
<!-- Pricing sits second, as it does on the GLP-1 monographs. A patient asks what
     it costs in the first minute of a visit; it used to be the LAST section,
     below the whole prescribing block and the clinical reference. Don,
     2026-09-15. -->
${sectionPricing(doc)}
${sectionCycle(doc)}
${sectionLadder(doc)}
${sectionDirections(doc)}
${sectionSyringes()}
${sectionStates()}
${sectionRx(doc)}
${sectionClinical(doc)}

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
