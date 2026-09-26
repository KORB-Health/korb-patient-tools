/* check-feedback.js - every page released to patients ends with the feedback
   button, and the two copies of its wording agree. House rule, 2026-09-26.

     node check-feedback.js        exits 1 on any problem

   WHICH PAGES: read from the RELEASE STATUS table in CLAUDE.md, every row
   marked **Yes**. Not typed here. A list kept in step by hand is how this repo
   has been bitten before, and a page released tomorrow joins the check by being
   written into that table.

   WHAT COUNTS: a generated page carries the footer in its HTML (built by
   build-patient-ed.js from shared.feedback). A hand-built page either loads
   korb-feedback.js with a data-page name, or, like the hub, carries the link
   written out. Either way the form url must be the one in shared.feedback. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

const SHARED = require('./korb-patient-ed-data.js').shared.feedback;
const COPY = require('./korb-feedback.js');
const problems = [];

['heading', 'lead', 'label', 'url', 'pageField'].forEach(function (k) {
  if (SHARED[k] !== COPY[k]) {
    problems.push('korb-feedback.js ' + k + ' differs from shared.feedback in korb-patient-ed-data.js');
  }
});

const md = fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8');
const released = [];
md.split(/\r?\n/).forEach(function (line) {
  const m = line.match(/^\|\s*`([^`]+\.html)`\s*\|\s*\*\*Yes\*\*/);
  if (m) released.push(m[1]);
});
if (released.length < 20) {
  problems.push('found only ' + released.length + ' released pages in CLAUDE.md - the RELEASE STATUS table has moved or changed shape');
}

const esc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
released.forEach(function (f) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { problems.push(f + ': in the release table but not on disk'); return; }
  const html = fs.readFileSync(p, 'utf8');
  const viaScript = /<script[^>]+src="(\.\.\/)*korb-feedback\.js"[^>]*data-page="[^"]+"/.test(html);
  const inline = new RegExp(esc(SHARED.url) + '\\?usp=pp_url&(amp;)?' + esc(SHARED.pageField) + '=').test(html);
  // generated shell: renders the footer in the browser from shared.feedback,
  // so the url is right by construction; it must load the renderer and the data
  const generated = /R\.feedbackFooter\(KORB_PATIENT_ED,\s*doc\)/.test(html) &&
    /src="(\.\.\/)*patient-ed-render\.js"/.test(html) && /src="(\.\.\/)*korb-patient-ed-data\.js"/.test(html);
  if (!viaScript && !inline && !generated) problems.push(f + ': no feedback button');
  if (/korb-feedback\.js/.test(html) && !viaScript) problems.push(f + ': loads korb-feedback.js without a data-page name');
});

if (problems.length) {
  console.error('FEEDBACK CHECK FAILED - ' + problems.length + ' problem(s):');
  problems.forEach(function (x) { console.error('  - ' + x); });
  process.exit(1);
}
console.log('Feedback check: all ' + released.length + ' released patient pages end with the button, and both copies of its wording agree.');
