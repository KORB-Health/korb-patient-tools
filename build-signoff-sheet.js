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
      risk: 'High',
      title: 'Oral contraceptive windows',
      body: 'Written as: advise a non-oral method, or add a barrier method, for four weeks after ' +
            'initiation AND for four weeks after each dose increase. The second window is the ' +
            'one providers miss, because a dose increase does not feel like a new start.',
      ask: 'Confirm both four-week windows are what KORB wants counselled, and confirm this ' +
           'stays tirzepatide-only rather than being applied across the class.'
    }
  ],
  orforglipron: [
    {
      risk: 'High',
      title: 'Signing the newest agent',
      body: 'This monograph carries its own standing flag telling providers to verify against ' +
            'current prescribing information, and its interaction list ends with the same ' +
            'caveat. The evidence section says the outcome data are limited.',
      ask: 'You can sign this one with an exception recorded rather than signing it flat — the ' +
           'record supports it, and the exception prints on the document. Say which you want.'
    }
  ]
};

const MOLECULES = ['semaglutide', 'tirzepatide', 'orforglipron'];
const NAMES = {
  semaglutide: 'Semaglutide',
  tirzepatide: 'Tirzepatide',
  orforglipron: 'Orforglipron'
};
const DOCCOUNT = { semaglutide: 5, tirzepatide: 4, orforglipron: 1 };
const SCOPE = {
  semaglutide: 'Belmar, Premier, Premier glycine, Farmakeio, Wegovy',
  tirzepatide: 'Belmar, Premier, Farmakeio, Greenwich, Zepbound',
  orforglipron: 'Foundayo'
};

function questionCard(q) {
  return `<div class="q">
    <p class="risk">${esc(q.risk)} risk</p>
    <h4>${esc(q.title)}</h4>
    <p>${esc(q.body)}</p>
    <p class="ask"><span class="asklabel">Needs your answer</span> ${esc(q.ask)}</p>
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
        <p class="fplabel">Fingerprint being signed</p>
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{
  --ground:#F6F6F2; --panel:#FFFFFF; --sunk:#EFEFE9;
  --ink:#181B2E; --ink2:#575C74; --ink3:#8A8FA3;
  --rule:#DCDCD3;
  --navy:#21275B; --teal:#00B2C3;
  --stop:#A32A20; --stopbg:#FBEEEC;
  --ok:#1C6349;
  --ask:#8A5300; --askbg:#FBF3E4;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --ground:#14161F; --panel:#1B1E29; --sunk:#222634;
    --ink:#E9E9EE; --ink2:#A8ADBF; --ink3:#7B8093;
    --rule:#31364A;
    --navy:#9FA8E0; --teal:#39CBD8;
    --stop:#F0918A; --stopbg:#2B1B1A;
    --ok:#7DD0AE;
    --ask:#E8B872; --askbg:#2A2318;
  }
}
:root[data-theme="dark"]{
  --ground:#14161F; --panel:#1B1E29; --sunk:#222634;
  --ink:#E9E9EE; --ink2:#A8ADBF; --ink3:#7B8093;
  --rule:#31364A;
  --navy:#9FA8E0; --teal:#39CBD8;
  --stop:#F0918A; --stopbg:#2B1B1A;
  --ok:#7DD0AE;
  --ask:#E8B872; --askbg:#2A2318;
}
*{box-sizing:border-box;}
body{background:var(--ground);color:var(--ink);
  font-family:"Source Serif 4",Georgia,serif;font-size:16.5px;line-height:1.58;
  margin:0;padding:0 20px 90px;}
.wrap{max-width:47rem;margin:0 auto;}
h1,h2,h3,h4,.eyebrow,.minilabel,.risk,.fplabel,.asklabel,.stamp{
  font-family:Archivo,"Helvetica Neue",Arial,sans-serif;}
h1{font-size:2.05rem;line-height:1.14;margin:0 0 10px;font-weight:700;
  letter-spacing:-.015em;text-wrap:balance;}
h2{font-size:1.5rem;margin:0 0 3px;font-weight:700;letter-spacing:-.01em;}
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
.stamp{font-family:"IBM Plex Mono",monospace;font-size:.74rem;color:var(--ink3);
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
.fp{font-family:"IBM Plex Mono",monospace;font-size:.82rem;margin:0;color:var(--ink);}

.qs{margin-top:22px;display:flex;flex-direction:column;gap:14px;}
.q{background:var(--askbg);border-left:3px solid var(--ask);padding:16px 19px;}
.risk{font-size:.68rem;text-transform:uppercase;letter-spacing:.13em;
  color:var(--ask);font-weight:700;margin:0 0 5px;}
.q p{font-size:.96rem;}
.ask{margin-bottom:0;}
.asklabel{font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;
  font-weight:700;color:var(--ask);display:block;margin-bottom:2px;}

.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:0 30px;}
.minilabel{font-size:.7rem;text-transform:uppercase;letter-spacing:.11em;
  color:var(--ink3);font-weight:600;margin:0 0 5px;}
blockquote{margin:0 0 11px;padding:13px 17px;background:var(--panel);
  border:1px solid var(--rule);border-left:3px solid var(--teal);
  font-size:.97rem;color:var(--ink2);}

.close{margin-top:56px;border-top:2px solid var(--navy);padding-top:20px;}
.close h3{border:0;margin-top:0;}
table{width:100%;border-collapse:collapse;font-family:Archivo,sans-serif;
  font-size:.9rem;margin-bottom:16px;}
th{text-align:left;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;
  color:var(--ink3);border-bottom:1px solid var(--rule);padding:0 10px 6px 0;font-weight:600;}
td{padding:9px 10px 9px 0;border-bottom:1px solid var(--rule);vertical-align:top;}
td.who{color:var(--ink2);white-space:nowrap;}
a{color:var(--navy);}
</style>

<div class="wrap">
<header class="top">
  <p class="eyebrow">KORB Health · GLP-1 Provider Reference</p>
  <h1>Monograph clinical sign-off</h1>
  <p class="lede">Eleven provider documents are built and correct. All eleven currently
  open with a red notice saying the clinical content has not been reviewed. This is
  what clears it.</p>
  <p class="stamp">korb-glp1-data.js v${esc(K.meta.version)} · three monographs ·
  ${esc(Object.keys(K.products).length)} products · prepared for
  Donald Stevenson, PA-C</p>
</header>

<div class="how">
  <h3>How to sign off</h3>
  <ol>
    <li><strong>Read the three sections below.</strong> Each carries the clinical content
    that a provider would not independently catch if it were wrong — interactions,
    contraindications, cautions, monitoring, ICD-10, and the attestation language that
    goes into the chart. Everything else in the documents is dosing and Tebra fields,
    which you have already been through.</li>
    <li><strong>Answer the two amber questions.</strong> They are things I could not
    decide for you without making a clinical call that is yours. The peri-procedural
    hold you already answered — 7 days, or longer if anaesthesia or the surgeon's
    office require it — is written into all three monographs and appears in the
    interaction lists below.</li>
    <li><strong>Tell me the verdict per molecule</strong> — approve, approve with an
    exception, or changes needed. You can sign one and hold another; they are recorded
    separately, on purpose, so orforglipron does not inherit confidence from
    semaglutide.</li>
  </ol>
  <div class="mech">
    <p><strong>What happens when you approve.</strong> I record your name, role, date and
    the fingerprint printed beside each molecule. The red notice on those documents is
    replaced by a line naming you as the reviewer.</p>
    <p style="margin-bottom:0"><strong>Why the fingerprint.</strong> It is a checksum of
    the monograph exactly as you are reading it. Every document re-checks it on open. If
    anyone edits that monograph afterwards — me included — the checksum stops matching,
    your sign-off is marked as no longer covering the text, the red notice comes back,
    and the build refuses until it is re-reviewed. A sign-off recorded as just a name and
    a date would keep sitting there over content you never saw.</p>
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
