#!/usr/bin/env node
/* check-fhl-codes.js - every FH&L charge code a provider can copy exists in
   Nick's sheet, at the price the provider pages show.

   WHY IT EXISTS. On 2026-10-13 the four FH&L provider references and the
   Provider Clinical Reference were found showing FndnPeptide002,
   GatePeptide001, PeakPeptide001 and PeakPeptide002 - copyable website codes,
   each with a price, none of which had ever been released or existed in the
   sheet. korb-dosing-data.js types its FH&L prices and codes by hand, and
   nothing compared them with korb-charges.js, which the daily job keeps
   current from the sheet. A code that is not in Tebra is a wrong charge that
   looks right.

   It reads korb-charges.js (generated from the sheet) and every code in
   KORB_DOSING.pricing, and fails on a code the sheet does not carry or a price
   that differs. It runs as a gate in check-charges.ps1, so a sheet change
   that would strand a provider page stops the daily job instead.

   Usage: node check-fhl-codes.js        exit 0 clean, 1 on any problem */
'use strict';
const fs = require('fs');
const path = require('path');

const root = __dirname;
const load = (f, g) => new Function(fs.readFileSync(path.join(root, f), 'utf8') + ';return ' + g)();

const CHARGES = require(path.join(root, 'korb-charges.js'));
const D = load('korb-dosing-data.js', 'KORB_DOSING');
const P = D.pricing;

/* Every [code, price, where] a provider page can show. Website figures are
   included where they still exist (baseline labs, the GHK-Cu add-on), because
   those share the one released code. */
const want = [];
const add = (code, price, where) => { if (code) want.push([code, price, where]); };

add(P.baseline.code, P.baseline.partner, 'baseline labs');
add(P.ghkcu.code, P.ghkcu.partner, 'GHK-Cu add-on');
['foundation', 'gateway', 'peakA', 'peakB'].forEach(function (k) {
  const p = P[k];
  if (p.code) {
    Object.keys(p.code).forEach(function (ref) {
      add(p.code[ref], (p[ref] || {}).payment, k + ' ' + ref);
    });
  }
  Object.keys(p.codeByAgent || {}).forEach(function (ag) {
    Object.keys(p.codeByAgent[ag]).forEach(function (ref) {
      add(p.codeByAgent[ag][ref], (p[ref] || {}).payment, k + ' ' + ag + ' ' + ref);
    });
  });
});

const problems = [];
want.forEach(function ([code, price, where]) {
  const e = CHARGES.codes[code];
  if (!e) {
    problems.push(code + ' (' + where + '): NOT IN THE SHEET. A provider can copy a code Tebra does not have.');
  } else if (Number(e.price) !== Number(price)) {
    problems.push(code + ' (' + where + '): pages show $' + price + ', the sheet says $' + e.price + '.');
  }
});

if (problems.length) {
  problems.forEach(function (p) { console.log('FAIL  ' + p); });
  console.log('\n' + problems.length + ' problem(s) across ' + want.length + ' FH&L code(s).');
  process.exit(1);
}
want.forEach(function ([code, price, where]) {
  console.log('ok    ' + code.padEnd(16) + ' $' + String(price).padEnd(5) + ' ' + where + ' - ' + CHARGES.codes[code].description);
});
console.log('\nFH&L codes: all ' + want.length + ' in the sheet at the price the pages show.');
