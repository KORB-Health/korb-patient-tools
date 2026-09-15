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

   WHAT IT REPORTS TODAY

   One item, and it is a stale copy rather than a disagreement. The reshape of
   2026-09-15 resolved the three-way Greenwich split: this file now holds a
   licensure footprint (46 states, 5 permanent exclusions) with GLP-1 marked
   retired and peptides narrowed by a 23-state commercial pause. Those three
   facts used to fight over one flat shipsTo.

   What remains is that korb-glp1-data.js still carries its own 46-state GLP-1
   footprint for Greenwich, for a program that is retired. Nothing reads it, and
   it goes when GLP-1 is wired onto this file — open item 3. Until then it is
   listed below as expected.

   Anything OTHER than that line is real drift.
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
  /^greenwich: GLP-1 is retired here, but korb-glp1-data\.js still lists/
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
  console.log('Only the known stale GLP-1 footprint in korb-glp1-data.js remains.');
  console.log('No other drift. It goes with open item 3.');
} else {
  /* Fewer than expected is not automatically good news: it may mean the reshape
     landed, or it may mean a field stopped being compared. Say so rather than
     print a green light. */
  console.log('The known stale GLP-1 footprint is no longer reported.');
  console.log('If open item 3 has landed, remove it from EXPECTED in this file. If it has');
  console.log('not, something stopped being compared and that is worse than the drift.');
}
process.exit(0);
