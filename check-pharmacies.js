/* ============================================================================
   KORB HEALTH — PHARMACY CROSS-FILE CHECK

   Run from the repo root:  node check-pharmacies.js

   WHY THIS EXISTS

   korb-pharmacies.js was extracted on 2026-09-11 to be the single source of
   truth for which pharmacy ships where. It is not loaded by anything yet, and
   it drifted from korb-glp1-data.js within two days. Its own selfCheck() did
   not notice, and could not: it validates the file against itself, and both
   files were internally consistent while saying different things about
   Greenwich.

   This runs KORB_PHARMACIES.crossCheck() against the program data files, which
   is the direction that catches drift. It exits 1 on any disagreement so it can
   be wired into a builder once open item 2 finishes the reshape.

   WHAT IT WILL REPORT TODAY

   Three problems, all Greenwich, all the same underlying fact. The shared layer
   holds Greenwich's PEPTIDE answer (23 states, 28 hard excludes, status
   peptides-only) and korb-glp1-data.js holds its GLP-1 answer (46 states, 5
   hard excludes, status glp1-retired). Neither is wrong. The shared file has one
   flat shipsTo and can only hold one of them, which is the whole reason open
   item 2 exists. This check is expected to report those three until the
   pharmacy x program reshape lands, and to report NOTHING ELSE — anything new
   appearing here is real drift.
   ============================================================================ */

'use strict';
const fs = require('fs');
const path = require('path');
const REPO = __dirname;

function load(file, globalName) {
  const src = fs.readFileSync(path.join(REPO, file), 'utf8');
  const sandbox = {};
  new Function('exports', 'module', src + '\n;this.OUT = ' + globalName + ';').call(sandbox, {}, {});
  return sandbox.OUT;
}

const PH = load('korb-pharmacies.js', 'KORB_PHARMACIES');
const sources = {
  glp1: load('korb-glp1-data.js', 'KORB_GLP1'),
  dosing: load('korb-dosing-data.js', 'KORB_DOSING')
};

console.log('korb-pharmacies.js v' + PH.meta.version);
PH.selfCheck();
const r = PH.crossCheck(sources);

/* The three Greenwich disagreements are known and expected until the reshape.
   They are listed explicitly rather than counted, so that a DIFFERENT Greenwich
   problem does not hide inside an allowance for "three Greenwich problems". */
const EXPECTED = [
  /^greenwich\.shipsTo:/,
  /^greenwich\.hardExcludes:/,
  /^greenwich\.status:/
];
const unexpected = r.problems.filter(p => !EXPECTED.some(re => re.test(p)));
const expectedSeen = EXPECTED.filter(re => r.problems.some(p => re.test(p)));

console.log('');
if (unexpected.length) {
  console.error('NEW DRIFT — ' + unexpected.length + ' disagreement(s) that are not the known Greenwich split:');
  unexpected.forEach(p => console.error('  - ' + p));
  process.exit(1);
}
if (expectedSeen.length === EXPECTED.length) {
  console.log('Known Greenwich split present, as expected until the pharmacy x program reshape.');
  console.log('No other drift. See open item 2.');
} else {
  /* Fewer than expected is not automatically good news: it may mean the reshape
     landed, or it may mean a field stopped being compared. Say so rather than
     print a green light. */
  console.log('Only ' + expectedSeen.length + ' of the 3 known Greenwich disagreements are still reported.');
  console.log('If the reshape has landed, update EXPECTED in this file. If it has not,');
  console.log('something stopped being compared and that is worse than the drift.');
}
process.exit(0);
