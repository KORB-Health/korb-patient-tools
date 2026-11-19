#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — BROWSER TAB ICON (favicon) AND HOME-SCREEN ICON (webclip)

     node stamp-icons.js           add the two icon tags to any page missing them
     node stamp-icons.js --check   exit 1 naming every page that is missing them

   WHY. Lindsay and Jon Reese, 2026-11-19: the Patient Hub showed a blank tab
   icon next to the website's KORB mark once the site's header started linking
   to it. They asked for the KORB logo mark on every public page.

   THE IMAGES are the website's own, downloaded from korbhealth.com's Webflow
   head on 2026-11-19 so the hub and the site show the identical mark:
     korb-favicon.png   32 x 32    (the site's favicon.png)
     korb-webclip.png   256 x 256  (the site's webclip.png, used when a patient
                                     saves a page to a phone home screen)
   If the website changes its mark, replace these two files and nothing else.

   ABSOLUTE URLS, on purpose. Pages sit at four depths (root, Patient_Education,
   Provider_Reference, Provider_Reference/GLP1). An absolute URL is the same
   string everywhere, so builders and hand-built pages share one constant.

   BUILDERS. build-patient-ed, build-provider-docs, build-fhl-docs,
   build-clinical-docs and build-med-pages put TAGS in their own head, so a
   rebuild keeps the icon. This script covers the hand-built pages and is the
   check that catches a builder that forgot.

   SKIPPED, and why:
     KORB_Scheduler_Intake_Prototype.html  FROZEN for Lindsay's review
                                           (korb-clinical-docs CLAUDE.md).
     pages with a meta refresh             redirects; nobody sees their tab.
   ========================================================================== */
'use strict';

const BASE = 'https://korb-health.github.io/korb-patient-tools/';
const TAGS =
  '<link rel="icon" type="image/png" href="' + BASE + 'korb-favicon.png">\n' +
  '<link rel="apple-touch-icon" href="' + BASE + 'korb-webclip.png">';

const SKIP = ['KORB_Scheduler_Intake_Prototype.html'];

function hasIcons(html) {
  return html.indexOf('korb-favicon.png') !== -1 && html.indexOf('korb-webclip.png') !== -1;
}
function isRedirect(html) { return /http-equiv=["']?refresh/i.test(html); }

function addIcons(html) {
  if (hasIcons(html)) return html;
  const m = html.match(/<meta charset=[^>]*>/i);
  if (m) {
    const i = m.index + m[0].length;
    return html.slice(0, i) + '\n' + TAGS + html.slice(i);
  }
  const h = html.match(/<head[^>]*>/i);
  if (h) {
    const i = h.index + h[0].length;
    return html.slice(0, i) + '\n' + TAGS + html.slice(i);
  }
  return null;
}

module.exports = { TAGS, addIcons, hasIcons };

if (require.main === module) {
  const fs = require('fs');
  const { execSync } = require('child_process');
  const check = process.argv.includes('--check');
  const files = execSync('git ls-files -z -- "*.html"', { encoding: 'utf8' })
    .split('\0').filter(Boolean);
  const missing = [], changed = [], noHead = [];
  let considered = 0;
  for (const f of files) {
    if (SKIP.includes(f)) continue;
    const html = fs.readFileSync(f, 'utf8');
    if (isRedirect(html)) continue;
    considered++;
    if (hasIcons(html)) continue;
    if (check) { missing.push(f); continue; }
    const out = addIcons(html);
    if (out === null) { noHead.push(f); continue; }
    fs.writeFileSync(f, out);
    changed.push(f);
  }
  if (check) {
    if (missing.length) {
      console.error('Icon check: ' + missing.length + ' page(s) have no KORB tab icon:\n  ' +
        missing.join('\n  ') + '\nRun node stamp-icons.js, and if a builder wrote the page, add TAGS to that builder.');
      process.exit(1);
    }
    console.log('Icon check: all ' + considered + ' page(s) carry the KORB favicon and webclip.');
  } else {
    console.log('Icons: ' + changed.length + ' page(s) stamped, ' +
      (considered - changed.length - noHead.length) + ' already had them.');
    if (noHead.length) {
      console.error('No <head> to stamp in:\n  ' + noHead.join('\n  '));
      process.exit(1);
    }
  }
}
