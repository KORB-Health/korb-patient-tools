#!/usr/bin/env node
/* ============================================================================
   KORB HEALTH — GENERATED PAGE SCRIPT-TAG CHECK

     node check-pages.js          from the repo root. Exit 1 if a page is dead.

   WHY THIS FILE EXISTS

   On 2026-09-14 korb-rx-block.js became a dependency of provider-doc-render.js.
   The script tag was added to build-provider-docs.js and build-fhl-docs.js and
   NOT to build-clinical-docs.js. The Add-On Clinical Reference went to Pages
   loading four of the five scripts it needed, provider-doc-render threw on
   RXB.CSS before defining KORB_DOCS, and the page showed nothing but its own
   "could not load" guard. It stayed that way overnight on a public site and was
   found by Don clicking the link, not by anything here.

   Every other check in this repo reads data. None of them opened a generated
   page and asked whether it could run at all, so a document could be
   syntactically perfect, byte-correct against its data, pass the dose audit and
   the embed check, and still be a blank page in a browser.

   WHAT IT CHECKS

   For every tracked .html that loads a render module, the modules that module
   needs are also in the page, and they come BEFORE it. Order matters: these are
   plain scripts assigning globals, so a dependency loaded afterwards is the same
   as not loaded at all.

   The dependency map is hand-written below because it cannot be derived - the
   UMD wrapper reads root.KORB_RX_BLOCK, which is a string in a file, not an
   import. WHEN A RENDER MODULE GAINS A DEPENDENCY, ADD IT HERE, then run this
   and let it tell you which builders you forgot.
   ============================================================================ */
'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

/* module -> the globals-providing files it must be preceded by */
/* Pages that RENDER a price and therefore must load korb-charges.js before
   korb-glp1-data.js. Found by sweeping every page that loads the data file in
   a real browser and by grepping for the price accessors, not by guessing:
   KORB_GLP1_Provider_Reference.html reads pricing.* directly and would render
   blanks rather than throw, which is the quieter and worse failure. The 10
   generated monographs get the tag from build-provider-docs.js. Add a page
   here the moment it starts showing a price. */
const PRICE_PAGES = [
  'KORB_GLP1_Provider_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Belmar_Semaglutide_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Belmar_Tirzepatide_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Brand_Foundayo_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Brand_Wegovy_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Brand_Zepbound_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Farmakeio_Semaglutide_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Farmakeio_Tirzepatide_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Premier_Semaglutide_Glycine_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Premier_Semaglutide_Reference.html',
  'Provider_Reference/GLP1/KORB_GLP1_Premier_Tirzepatide_Reference.html'
];

const NEEDS = {
  /* Data files. Since open items 3 and 4 both program files take their pharmacy
     footprints from korb-pharmacies.js at load. A page that loads a data file
     without it gets empty footprints, which reads as "this pharmacy ships
     nowhere" and routes every patient to the fallback. */
  /* korb-charges.js is NOT listed here, deliberately, and that is a judgement
     rather than an omission. It carries the PRICES, and a price is only needed
     by a page that shows one. 25 patient-education pages load korb-glp1-data.js
     for clinical prose and must never carry pricing at all, so requiring it
     file-wide would push Finance's charge codes onto every patient page to fix
     a problem those pages do not have. Instead korb-glp1-data.js throws by name
     the first time a price is READ without it - see requireCharges - and the
     pages that show prices are checked by name in PRICE_PAGES below. */
  'korb-glp1-data.js': ['korb-pharmacies.js'],
  'korb-dosing-data.js': ['korb-pharmacies.js'],
  'korb-mens-data.js': ['korb-pharmacies.js'],
  'korb-womens-data.js': ['korb-pharmacies.js'],
  /* Builds its document from KORB_DOSING at load and leaves it null without it. */
  'korb-fhl-counsel-data.js': ['korb-pharmacies.js', 'korb-dosing-data.js'],

  /* korb-patient-ed-data.js takes its Quest lab-scheduling facts from
     korb-quest.js at load, the same way the program files take their pharmacy
     footprints. Without it the lab page tells a patient to book a draw and
     offers nothing to press, so the data file throws by name instead. */
  'korb-patient-ed-data.js': ['korb-quest.js'],

  /* Render modules. */
  'provider-doc-render.js': ['korb-rx-block.js'],
  'fhl-doc-render.js': ['korb-rx-block.js', 'provider-doc-render.js'],
  'clinical-doc-render.js': ['korb-rx-block.js', 'provider-doc-render.js'],
};

function scriptsIn(html) {
  const out = [];
  const re = /<script[^>]+src="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push(m[1].split('/').pop());
  }
  return out;
}

function main() {
  const files = execSync('git ls-files "*.html"', { encoding: 'utf8' })
    .split('\n').map(s => s.trim()).filter(Boolean);

  const problems = [];
  let checked = 0;
  let priceChecked = 0;

  files.forEach(function (f) {
    const html = fs.readFileSync(f, 'utf8');
    const srcs = scriptsIn(html);
    if (!srcs.length) return;

    Object.keys(NEEDS).forEach(function (mod) {
      const at = srcs.indexOf(mod);
      if (at === -1) return;
      checked++;
      NEEDS[mod].forEach(function (dep) {
        const depAt = srcs.indexOf(dep);
        if (depAt === -1) {
          problems.push(f + ': loads ' + mod + ' but never loads ' + dep);
        } else if (depAt > at) {
          problems.push(f + ': loads ' + dep + ' AFTER ' + mod + '; it must come first');
        }
      });
    });

    /* A page that SHOWS a price must load korb-charges.js before the data file.
       Checked by name rather than through NEEDS, so the 25 patient pages that
       load the data file for prose are not dragged into carrying charge codes.
       Both halves matter: the tag must be there, and it must come first. */
    if (PRICE_PAGES.indexOf(f) !== -1) {
      priceChecked++;
      const chAt = srcs.indexOf('korb-charges.js');
      const dataAt = srcs.indexOf('korb-glp1-data.js');
      if (chAt === -1) {
        problems.push(f + ': renders a price but never loads korb-charges.js - ' +
                      'every price would be null');
      } else if (dataAt !== -1 && chAt > dataAt) {
        problems.push(f + ': loads korb-charges.js AFTER korb-glp1-data.js; ' +
                      'it must come first');
      }
    }
  });

  PRICE_PAGES.forEach(function (pp) {
    if (files.map(function (f) { return f; }).indexOf(pp) === -1) {
      problems.push('PRICE_PAGES names ' + pp + ' but no such tracked page exists');
    }
  });

  if (problems.length) {
    console.error('PAGE CHECK FAILED — ' + problems.length + ' generated page(s) cannot run.');
    console.error('A page missing a module renders nothing but its own error guard.');
    console.error('Fix the BUILDER that emits the page, not the page, then rebuild.');
    problems.forEach(function (p) { console.error('  - ' + p); });
    process.exit(1);
  }

  console.log('Page check: ' + checked + ' module load(s) across ' + files.length +
              ' page(s), every dependency present and in order.');
  console.log('Price check: ' + priceChecked + ' of ' + PRICE_PAGES.length +
              ' price-rendering page(s) load korb-charges.js first.');
}

main();
