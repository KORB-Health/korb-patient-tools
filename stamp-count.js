#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH: VISIT COUNTER ON EVERY PAGE RELEASED TO PATIENTS

     node stamp-count.js           add the counter tag to any released page missing it
     node stamp-count.js --check   exit 1 naming every released page without it

   WHY. Don, 21 Nov 2026: the counter went live on the Patient Hub that morning,
   and the guides patients reach straight from a provider's text or a Braze
   email were invisible to it. Every page released to patients now loads
   korb-count.js, which counts the visit and adds the privacy line under the
   page's feedback button.

   WHICH PAGES: every row marked **Yes** in the RELEASE STATUS table in
   CLAUDE.md, read the same way check-feedback.js reads it. A page released
   tomorrow joins by being written into that table.

   BUILDERS. build-patient-ed.js and build-med-pages.js put TAG in their own
   head, so a rebuild keeps it. This script covers the hand-built pages and is
   the check that catches a builder that forgot. The tag goes straight after
   the icon tags, where the builders put it.

   ALREADY COUNTED: any page that already loads korb-count.js (the hub loads it
   at the end of its body) is left alone.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const { TAG } = require('./korb-count.js');

function released() {
  const md = fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8');
  const out = [];
  md.split(/\r?\n/).forEach(function (line) {
    const m = line.match(/^\|\s*`([^`]+\.html)`\s*\|\s*\*\*Yes\*\*/);
    if (m) out.push(m[1]);
  });
  if (out.length < 20) {
    console.error('Found only ' + out.length + ' released pages in CLAUDE.md; the RELEASE STATUS table has moved or changed shape.');
    process.exit(1);
  }
  return out;
}

function hasCount(html) { return html.indexOf('korb-count.js') !== -1; }

function addCount(html) {
  const icon = html.match(/<link rel="apple-touch-icon"[^>]*>/i);
  const at = icon || html.match(/<meta charset=[^>]*>/i) || html.match(/<head[^>]*>/i);
  if (!at) return null;
  const i = at.index + at[0].length;
  return html.slice(0, i) + '\n' + TAG + html.slice(i);
}

module.exports = { addCount, hasCount };

if (require.main === module) {
  const check = process.argv.includes('--check');
  const missing = [], changed = [], noHead = [], gone = [];
  const pages = released();
  pages.forEach(function (f) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) { gone.push(f); return; }
    const html = fs.readFileSync(p, 'utf8');
    if (hasCount(html)) return;
    if (check) { missing.push(f); return; }
    const out = addCount(html);
    if (out === null) { noHead.push(f); return; }
    fs.writeFileSync(p, out);
    changed.push(f);
  });
  if (gone.length) console.error('Listed as released but not found:\n  ' + gone.join('\n  '));
  if (check) {
    if (missing.length || gone.length) {
      if (missing.length) {
        console.error('Counter check: ' + missing.length + ' released page(s) do not load korb-count.js:\n  ' +
          missing.join('\n  ') + '\nRun node stamp-count.js, and if a builder wrote the page, add COUNT to that builder.');
      }
      process.exit(1);
    }
    console.log('Counter check: all ' + pages.length + ' released page(s) load korb-count.js.');
  } else {
    console.log('Counter: ' + changed.length + ' page(s) stamped, ' +
      (pages.length - changed.length - noHead.length - gone.length) + ' already had it.');
    if (changed.length) console.log('  ' + changed.join('\n  '));
    if (noHead.length) { console.error('No <head> to stamp in:\n  ' + noHead.join('\n  ')); process.exit(1); }
  }
}
