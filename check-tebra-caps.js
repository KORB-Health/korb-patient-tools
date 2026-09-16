#!/usr/bin/env node
/* ============================================================================
   TEBRA CHARACTER CAPS - every value a provider copies, measured

     node check-tebra-caps.js          report
     node check-tebra-caps.js --gate   same, exit 1 if anything is over

   WHY

   Tebra truncates a field that is too long SILENTLY in some views. A sig that
   loses its tail still looks like a sig. So the caps are not a style rule, they
   are the difference between "discard after 4 doses or 28 days" reaching the
   patient and stopping at "discard after 4 do".

   Don asked for this on 2026-09-15, reviewing the Premier glycine reference:
   the compounded sections looked like they had extra wording in them.

   WHAT IS MEASURED

   The RENDERED value - the data-copy attribute, entity-decoded - not the raw
   source string. That is what reaches the clipboard: "&amp;" in the attribute
   is one character, not five. Measuring the source would have over-counted
   every Reason for Compounding on the site, all of which contain an ampersand.

   Caps come from korb-glp1-data.js tebraLimits and are not repeated here:
   reasonForCompounding 30, patientInstructions 140, pharmacyInstructions 170.
   One source, and if a cap changes this follows.

   IT HAS BEEN SEEN TO FAIL. On 2026-09-15 a planted overrun on the Belmar
   0.25 mg sig was reported as 178/140, and removing it returned the run to
   zero. A cap check that has only ever printed zero proves nothing - see
   Verification discipline in CLAUDE.md.

   HEADROOM IS THIN AND THAT IS THE REAL FINDING. Nothing is over, but the
   longest patient instruction is 139 of 140 characters. One more word anywhere
   in that sig truncates it in Tebra. Treat "near" lines as the warning they are.
   ============================================================================ */
const RX = require('./rx-signoff.js');
const fs = require('fs');
function load(f,g,ctx){new Function('exports','module',fs.readFileSync(f,'utf8')+'\n;this.OUT='+g+';').call(ctx,{},{});return ctx.OUT;}
const PH = load('./korb-pharmacies.js','KORB_PHARMACIES',{});
global.KORB_PHARMACIES = PH;
const K = load('./korb-glp1-data.js','KORB_GLP1',{});
if (K.hydrate) K.hydrate(PH);

const LIMITS = K.tebraLimits;
const MAP = {
  'Patient Instructions': 'patientInstructions',
  'Pt Instructions':      'patientInstructions',
  'Pharmacy Instructions':'pharmacyInstructions',
  'Pharmacy Notes':       'pharmacyInstructions',
  'Reason for Compounding':'reasonForCompounding',
  'Reason':               'reasonForCompounding'
};
function decode(s){
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&nbsp;/g,' ')
          .replace(/&middot;/g,'\u00b7').replace(/&mdash;/g,'\u2014').replace(/&ndash;/g,'\u2013');
}

const inv = RX.inventory();
let checked = 0, over = 0, near = 0;
const worst = {};
inv.docs.forEach(d => {
  d.blocks.forEach(b => {
    const rows = b.match(/<tr>[\s\S]*?<\/tr>/g) || [];
    rows.forEach(r => {
      const th = (r.match(/<th>([^<]*)<\/th>/) || [])[1];
      const cp = (r.match(/data-copy="([^"]*)"/) || [])[1];
      if (!th || cp === undefined) return;
      const key = MAP[th.trim()];
      if (!key || !LIMITS[key]) return;
      const val = decode(cp);
      const cap = LIMITS[key];
      checked++;
      const pct = val.length / cap;
      if (!worst[key] || val.length > worst[key].len) worst[key] = {len: val.length, cap, doc: d.label, val};
      if (val.length > cap) { over++;
        console.log('  OVER  ' + d.key.padEnd(22) + th.padEnd(24) + val.length + '/' + cap + '  "' + val.slice(0,70) + '"');
      } else if (pct >= 0.9) { near++;
        console.log('  near  ' + d.key.padEnd(22) + th.padEnd(24) + val.length + '/' + cap);
      }
    });
  });
});
console.log('');
console.log('longest seen per field:');
Object.keys(worst).forEach(k => {
  const w = worst[k];
  console.log('  ' + k.padEnd(22) + w.len + '/' + w.cap + '  (' + Math.round(w.len/w.cap*100) + '% of cap)  ' + w.doc);
});
console.log('');
console.log(checked + ' capped values checked across ' + inv.docs.length + ' documents');
console.log(over + ' over the cap, ' + near + ' at 90% or more');
const GATE = process.argv.indexOf('--gate') !== -1;
process.exit(over && GATE ? 1 : 0);
