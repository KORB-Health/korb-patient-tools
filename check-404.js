#!/usr/bin/env node
/* ============================================================================
   404.html carries a SECOND COPY of the contact details, and this is what
   stops it rotting.

   The page is deliberately self-contained: it renders at whatever URL the
   patient missed, so a relative path to a stylesheet or a data file would
   resolve differently at every depth and break exactly where nobody looks.
   The cost of that choice is that the phone number, the email and the portal
   URL are typed into it rather than read from
   shared.contact in korb-patient-ed-data.js.

   This repo's whole argument is that a fact appears once. Where a duplicate is
   genuinely the lesser evil, the duplicate gets a check. Run from the repo
   root:  node check-404.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PAGE = path.join(ROOT, '404.html');
const DATA = path.join(ROOT, 'korb-patient-ed-data.js');

function fail(msg) { problems.push(msg); }
const problems = [];

if (!fs.existsSync(PAGE)) {
  console.error('check-404: 404.html is missing. GitHub Pages will serve its own\n' +
                '           generic error page to patients instead.');
  process.exit(1);
}
const html = fs.readFileSync(PAGE, 'utf8');

/* COMPARE WHAT A PATIENT READS, NOT WHAT THE SOURCE SAYS. The data file holds
   a literal en dash in "Mon-Fri, 9 AM-6 PM CT" and the page writes it as
   &ndash;, which is the same character to a reader and a different string to
   a naive grep. check-tebra-caps.js learned this first: measure the rendered
   value, because &amp; is one character on the clipboard. */
function decode(s) {
  return s
    .replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
const text = decode(html);

/* Load the data file the way a browser would, without a DOM. */
const vm = require('vm');
const sandbox = { console };
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'korb-quest.js'), 'utf8'), sandbox); } catch (e) {}
vm.runInContext(fs.readFileSync(DATA, 'utf8'), sandbox);
const ED = sandbox.KORB_PATIENT_ED;
if (!ED) { console.error('check-404: could not load korb-patient-ed-data.js'); process.exit(1); }

const ways = ((ED.shared.contact.operations || {}).ways) || [];
const portal = (((ED.shared.contact.portal || {}).ways) || [])[0] || {};

/* Every contact fact the page prints must match the data file, value AND href. */
const expected = [];
ways.forEach(function (w) {
  expected.push({ what: 'operations/' + w.label, value: w.value, href: w.href });
});
if (portal.href) expected.push({ what: 'portal', value: null, href: portal.href });

expected.forEach(function (e) {
  if (e.value && text.indexOf(e.value) === -1) {
    fail('404.html does not print ' + e.what + ' value "' + e.value + '" as the data file states it');
  }
  if (e.href && text.indexOf(e.href) === -1) {
    fail('404.html does not link ' + e.what + ' href "' + e.href + '"');
  }
});

/* The page must reach the hub, which is the whole point of it. */
const HUB = 'korb-patient-tools/KORB_Patient_Hub.html';
if (html.indexOf(HUB) === -1) fail('404.html does not link the Patient Hub');

/* RELATIVE URLS ARE THE BUG THIS PAGE IS MOST LIKELY TO ACQUIRE. It is served
   for any missing path, so a relative href resolves against wherever the
   patient was, not against the site root. Every link must be absolute. */
const hrefs = (html.match(/(?:href|src)="([^"]+)"/g) || []).map(function (m) {
  return m.replace(/^(?:href|src)="/, '').replace(/"$/, '');
});
hrefs.forEach(function (h) {
  if (/^(https?:|mailto:|tel:|data:|#)/.test(h)) return;
  fail('404.html has a RELATIVE url "' + h + '". This page renders at whatever ' +
       'path the patient missed, so relative urls break at depth. Make it absolute.');
});

/* It must not depend on anything it would have to fetch. */
if (/<script\b/i.test(html)) fail('404.html loads a script. It must stand alone.');
if (/<link\b[^>]*stylesheet/i.test(html)) fail('404.html links a stylesheet. It must stand alone.');

if (problems.length) {
  problems.forEach(function (p) { console.error('check-404: ' + p); });
  process.exit(1);
}
console.log('check-404: 404.html stands alone, every url is absolute, and its ' +
            expected.length + ' contact facts match korb-patient-ed-data.js.');
