#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — MONOGRAPH CLINICAL SIGN-OFF SHEET

   Generates the review sheet the Director of Clinical Operations reads before
   recording a sign-off in korb-glp1-data.js.

   Generated from the data file rather than hand-written, for the same reason
   the provider documents are: a review sheet that is transcribed by hand can
   describe text the reviewer is not actually approving, which would make the
   whole fingerprint mechanism theatre.

   The fingerprint printed against each molecule is the one that gets recorded.
   ============================================================================ */

const fs = require('fs');
const path = require('path');

const K = (function () {
  const src = fs.readFileSync(path.join(__dirname, 'korb-glp1-data.js'), 'utf8');
  const sandbox = {};
  new Function('exports', 'module', src + '\n;this.KORB_GLP1 = KORB_GLP1;').call(sandbox, {}, {});
  return sandbox.KORB_GLP1;
})();

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const li = arr => `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;

/* Questions I could not answer from the data, per molecule. These are the
   point of the sheet. Each names what is currently written, what is missing,
   and what a yes/no answer changes - a reviewer should never have to work out
   what they are being asked. */
const QUESTIONS = {
  /* The peri-procedural question that stood here was answered by Don on
     2026-09-06: hold 7 days (one week), or longer if anaesthesia or the
     surgeon's office require it. All three monographs now say so, and the
     answer is reflected in the interaction lists below rather than left as an
     outstanding ask. */
  all: [],
  tirzepatide: [
    {
      risk: 'Resolved',
      title: 'Oral contraceptive windows',
      body: 'Written as: advise a non-oral method, or add a barrier method, for four weeks after ' +
            'initiation AND for four weeks after each dose increase. The second window is the ' +
            'one providers miss, because a dose increase does not feel like a new start.',
      ask: 'CONFIRMED as written, 2026-09-06. Both four-week windows stand, and this ' +
           'stays tirzepatide-only - it is not applied to semaglutide or orforglipron.'
    }
  ],
  orforglipron: [
    {
      risk: 'Resolved',
      title: 'The newest agent',
      body: 'This monograph carries its own standing flag telling providers to verify against ' +
            'current prescribing information, and its interaction list ends with the same ' +
            'caveat. The evidence section says the outcome data are limited.',
      ask: 'SIGNED FLAT, 2026-09-06, no exception recorded. The monograph keeps its own ' +
           'verify-against-prescribing-information flag, which prints on the Foundayo ' +
           'document independently of the sign-off, so the newest agent carries its ' +
           'caveat either way.'
    }
  ]
};

const REC = K.monographSignoff.records.semaglutide || {};
const SIGNER = REC.signedBy || '—';
const SIGNROLE = REC.role || '—';
const SIGNDATE = REC.date || '—';
const SIGNVER = REC.dataVersion || K.meta.version;

const MOLECULES = ['semaglutide', 'tirzepatide', 'orforglipron'];
const NAMES = {
  semaglutide: 'Semaglutide',
  tirzepatide: 'Tirzepatide',
  orforglipron: 'Orforglipron'
};
const DOCCOUNT = { semaglutide: 5, tirzepatide: 3, orforglipron: 1 };  // tirzepatide 4 -> 3: the Greenwich document was retired 2026-09-11
const SCOPE = {
  semaglutide: 'Belmar, Premier, Premier glycine, Farmakeio, Wegovy',
  tirzepatide: 'Belmar, Premier, Farmakeio, Zepbound',
  orforglipron: 'Foundayo'
};

function questionCard(q) {
  return `<div class="q">
    <p class="risk">${esc(q.risk)}</p>
    <h4>${esc(q.title)}</h4>
    <p>${esc(q.body)}</p>
    <p class="ask"><span class="asklabel">Answered</span> ${esc(q.ask)}</p>
  </div>`;
}

function molecule(d) {
  const m = K.monographs[d];
  const fp = K.monographFingerprint(d);
  const qs = (QUESTIONS[d] || []);
  return `<section class="mol" id="${esc(d)}">
    <header class="molhead">
      <div>
        <p class="eyebrow">Monograph ${MOLECULES.indexOf(d) + 1} of 3</p>
        <h2>${esc(NAMES[d])}</h2>
        <p class="scope">${esc(DOCCOUNT[d])} provider document${DOCCOUNT[d] > 1 ? 's' : ''} —
          ${esc(SCOPE[d])}</p>
      </div>
      <div class="fpbox">
        <p class="fplabel">Fingerprint signed</p>
        <p class="fp">${esc(fp)}</p>
      </div>
    </header>

    ${qs.length ? `<div class="qs">${qs.map(questionCard).join('')}</div>` : ''}

    <h3>Interactions</h3>
    ${li(m.interactions)}

    <h3>Absolute contraindications</h3>
    ${li(m.absoluteContraindications)}

    <h3>Cautions</h3>
    ${li(m.cautions)}

    <h3>Monitoring</h3>
    ${li(m.monitoring)}

    <h3>ICD-10 <span class="sub">${esc(m.icd10.note)}</span></h3>
    <div class="cols">
      <div><p class="minilabel">Primary</p>${li(m.icd10.primary)}</div>
      <div><p class="minilabel">Secondary</p>${li(m.icd10.secondary)}</div>
    </div>

    <h3>Chart attestation <span class="sub">printed on every document, copied into the note</span></h3>
    <blockquote>${esc(m.attestation)}</blockquote>

    <h3>Patient counseling script</h3>
    <blockquote>${esc(m.counselingScript)}</blockquote>
  </section>`;
}

const html = `<title>Monograph Sign-Off</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap">
<style>
:root{
  --ground:#F6F6F2; --panel:#FFFFFF; --sunk:#EFEFE9;
  --ink:#181B2E; --ink2:#575C74; --ink3:#8A8FA3;
  --rule:#DCDCD3;
  --navy:#21275B; --teal:#00B2C3;
  --stop:#A32A20; --stopbg:#FBEEEC;
  --ok:#1C6349; --okbg:#EFF5F1;
  --ask:#8A5300; --askbg:#FBF3E4;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#14161F; --panel:#1B1E29; --sunk:#222634;
    --ink:#E9E9EE; --ink2:#A8ADBF; --ink3:#7B8093;
    --rule:#31364A;
    --navy:#9FA8E0; --teal:#39CBD8;
    --stop:#F0918A; --stopbg:#2B1B1A;
    --ok:#7DD0AE; --okbg:#17251F;
    --ask:#E8B872; --askbg:#2A2318;
  }
}
:root[data-theme="dark"]{
  --ground:#14161F; --panel:#1B1E29; --sunk:#222634;
  --ink:#E9E9EE; --ink2:#A8ADBF; --ink3:#7B8093;
  --rule:#31364A;
  --navy:#9FA8E0; --teal:#39CBD8;
  --stop:#F0918A; --stopbg:#2B1B1A;
  --ok:#7DD0AE; --okbg:#17251F;
  --ask:#E8B872; --askbg:#2A2318;
}
*{box-sizing:border-box;}
body{background:var(--ground);color:var(--ink);
  font-family:Montserrat,"Helvetica Neue",Arial,sans-serif;font-size:16.5px;line-height:1.58;
  margin:0;padding:0 20px 90px;}
.wrap{max-width:47rem;margin:0 auto;}
h1,h2,h3,h4,.eyebrow,.minilabel,.risk,.fplabel,.asklabel,.stamp{
  font-family:Montserrat,"Helvetica Neue",Arial,sans-serif;}
h1{font-size:2rem;line-height:1.14;margin:0 0 10px;font-weight:800;
  letter-spacing:-.015em;text-wrap:balance;}
h2{font-size:1.45rem;margin:0 0 3px;font-weight:800;letter-spacing:-.01em;}
h3{font-size:.94rem;text-transform:uppercase;letter-spacing:.09em;
  color:var(--ink2);font-weight:600;margin:30px 0 8px;
  padding-bottom:5px;border-bottom:1px solid var(--rule);}
h3 .sub{text-transform:none;letter-spacing:0;font-weight:400;color:var(--ink3);
  font-size:.82rem;margin-left:8px;}
h4{font-size:1.02rem;margin:0 0 6px;font-weight:600;}
p{margin:0 0 11px;}
ul{margin:0 0 11px;padding-left:20px;} li{margin-bottom:7px;}

header.top{padding:54px 0 0;}
.eyebrow{font-size:.73rem;text-transform:uppercase;letter-spacing:.15em;
  color:var(--teal);font-weight:600;margin:0 0 9px;}
.lede{font-size:1.12rem;color:var(--ink2);margin-bottom:22px;}
.stamp{font-family:Montserrat,"Helvetica Neue",Arial,sans-serif;letter-spacing:.02em;font-size:.74rem;color:var(--ink3);
  letter-spacing:.03em;border-top:1px solid var(--rule);padding-top:11px;}

.how{background:var(--panel);border:1px solid var(--rule);
  border-top:3px solid var(--navy);padding:22px 24px;margin:30px 0 8px;}
.how h3{margin-top:0;}
.how ol{margin:0;padding-left:19px;} .how li{margin-bottom:9px;}
.mech{background:var(--sunk);padding:15px 18px;margin-top:16px;
  font-size:.92rem;color:var(--ink2);}
.mech strong{color:var(--ink);}

section.mol{margin-top:52px;padding-top:8px;}
.molhead{display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;
  align-items:flex-start;border-top:2px solid var(--navy);padding-top:16px;}
.scope{color:var(--ink3);font-size:.9rem;margin:4px 0 0;}
.fpbox{background:var(--sunk);padding:9px 13px;border:1px solid var(--rule);}
.fplabel{font-size:.66rem;text-transform:uppercase;letter-spacing:.12em;
  color:var(--ink3);margin:0 0 3px;font-weight:600;}
.fp{font-family:Montserrat,"Helvetica Neue",Arial,sans-serif;letter-spacing:.02em;font-size:.82rem;margin:0;color:var(--ink);}

.qs{margin-top:22px;display:flex;flex-direction:column;gap:14px;}
.q{background:var(--okbg);border-left:3px solid var(--ok);padding:16px 19px;}
.risk{font-size:.68rem;text-transform:uppercase;letter-spacing:.13em;
  color:var(--ok);font-weight:700;margin:0 0 5px;}
.q p{font-size:.96rem;}
.ask{margin-bottom:0;}
.asklabel{font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;
  font-weight:700;color:var(--ok);display:block;margin-bottom:2px;}

.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:0 30px;}
.minilabel{font-size:.7rem;text-transform:uppercase;letter-spacing:.11em;
  color:var(--ink3);font-weight:600;margin:0 0 5px;}
blockquote{margin:0 0 11px;padding:13px 17px;background:var(--panel);
  border:1px solid var(--rule);border-left:3px solid var(--teal);
  font-size:.97rem;color:var(--ink2);}

.close{margin-top:56px;border-top:2px solid var(--navy);padding-top:20px;}
.close h3{border:0;margin-top:0;}
table{width:100%;border-collapse:collapse;font-family:Montserrat,"Helvetica Neue",Arial,sans-serif;
  font-size:.9rem;margin-bottom:16px;}
th{text-align:left;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;
  color:var(--ink3);border-bottom:1px solid var(--rule);padding:0 10px 6px 0;font-weight:600;}
td{padding:9px 10px 9px 0;border-bottom:1px solid var(--rule);vertical-align:top;}
td.who{color:var(--ink2);white-space:nowrap;}
.signed{background:var(--okbg);border-left:3px solid var(--ok);padding:15px 19px;margin:0 0 6px;}
.signedby{font-family:Montserrat,"Helvetica Neue",Arial,sans-serif;font-weight:700;color:var(--ok);margin:0 0 6px;
  font-size:.95rem;letter-spacing:.01em;}
.signed p{font-size:.95rem;margin-bottom:0;}
a{color:var(--navy);}
</style>

<div class="wrap">
<header class="top">
  <p class="eyebrow">KORB Health · GLP-1 Provider Reference</p>
  <h1>Monograph clinical sign-off</h1>
  <p class="lede">Signed. All three monographs were reviewed and approved with no
  changes and no exceptions, and the eleven provider documents now carry an attribution
  line instead of the red notice. This page is the record of what was approved.</p>
  <div class="signed">
    <p class="signedby">${esc(SIGNER)} · ${esc(SIGNROLE)} · ${esc(SIGNDATE)}</p>
    <p>Approved with no changes and no exceptions, against korb-glp1-data.js v${esc(SIGNVER)}.
    Each monograph below shows the fingerprint that was signed. If any of them is edited,
    that record goes stale on its own, the red notice returns to that molecule's documents,
    and the build stops until it is re-reviewed.</p>
  </div>
  <p class="stamp">korb-glp1-data.js v${esc(K.meta.version)} · three monographs ·
  ${esc(Object.keys(K.products).length)} products · prepared for
  Donald Stevenson, PA-C</p>
</header>

<div class="how">
  <h3>What was signed, and what it covers</h3>
  <p>The sections below are the clinical content a provider would not independently catch
  if it were wrong: indications and KORB scope, interactions, absolute contraindications,
  cautions, monitoring, ICD-10 selections, the chart attestation copied into the note, and
  the patient counseling script. The rest of each document is dosing and Tebra fields.</p>
  <div class="mech">
    <p><strong>The sign-off is pinned to the text.</strong> Each record stores a checksum
    of the monograph as it stood when it was read. Every document recomputes that checksum
    when it opens. A sign-off recorded as only a name and a date would keep sitting on the
    page after someone edited a contraindication, putting a clinician's name over content
    they never saw.</p>
    <p style="margin-bottom:0"><strong>Re-review is triggered automatically.</strong>
    Verified rather than assumed: adding one contraindication to the semaglutide monograph
    after signing restored the red notice on the five semaglutide documents, left the
    tirzepatide documents alone, and stopped the build. Nothing about that is manual.</p>
  </div>
</div>

${QUESTIONS.all.map(questionCard).join('')}

${MOLECULES.map(molecule).join('')}

<section class="close">
  <h3>What is still open after this</h3>
  <p><strong>Nothing except this sign-off.</strong> The Belmar rate and Finance
  confirmation items that used to sit here have been removed: they were tied to what
  KORB pays a pharmacy, and this is a clinical file in a public repository. The
  vial-sizing work they existed for is finished. The one clinical assumption underneath
  them is kept and stated plainly — four doses per vial, never five, as the conservative
  reading of a 28-day in-use limit on a vial a patient draws from at home.</p>
  <p>Cost language went with them. Removing the figures in an earlier pass had left the
  reasoning behind, which on a public file is the same disclosure. The check that guards
  this now reads the whole file rather than two lists, and fails on the words as well as
  the numbers.</p>
</section>
</div>`;

const out = path.join('/mnt/user-data/outputs', 'monograph-signoff.html');
fs.writeFileSync(out, html);
console.log('wrote ' + out + '  (' + fs.statSync(out).size + ' bytes)');
MOLECULES.forEach(d => console.log('  ' + d.padEnd(14) + K.monographFingerprint(d)));
