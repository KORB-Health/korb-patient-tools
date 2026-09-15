/* ============================================================================
   KORB HEALTH — CROSS-PHARMACY DOSE AUDIT

   WHY THIS FILE EXISTS

   On 2026-09-14 this check was run once, by hand, from a shell. It found two
   real errors in the exact string that becomes a Tebra favorite and lands on a
   prescription:

     Greenwich sermorelin named the dose at 3x its real value, in milligrams.
       200 mcg was written "0.6 mg", 300 "0.9 mg", 400 "1.2 mg", 500 "1.5 mg".
       Three is the concentration ratio, Greenwich 3 mg/mL against Premier
       1 mg/mL. Concentration decides the VOLUME injected, not the dose: 300 mcg
       is 300 mcg out of either vial. Fixed in v2.8.

     Greenwich BPC-157 was named "0.6 MG" where the dose is 500 mcg. Fixed in
       v2.9.

   Both were caught by Don reading the finished document. Neither was caught by
   the repository, and the check that found them existed only in shell history,
   so the next one would also have waited for a human. That is what this file
   is for. It is a build gate, not a report.

   WHAT IT CHECKS

   A dose is a dose. It does not change with the pharmacy, the concentration or
   the vial size. So every place a single entry states its dose must state the
   same one.

   Deliberately NOT compared: any concentration or formulation string, such as
   "Sermorelin 3mg/mL" or "Semaglutide/B-12 3mg/0.5mg per mL". Those are
   properties of the vial, they legitimately differ between pharmacies, and
   including them is what makes a check like this cry wolf until somebody turns
   it off.

   TWO DATA SHAPES

   korb-dosing-data.js has no numeric dose field, so entries are checked for
   internal agreement: every dose stated across the entry name, each pharmacy's
   label, and each pharmacy's Name field must agree.

   korb-glp1-data.js carries a numeric `mg` on every dose, which is a stronger
   check: each stated dose is compared against that number rather than against
   its siblings. This has never been run against that file before today.
   ========================================================================== */

'use strict';

/* Matches a mass with its unit. Requires the unit, so "4-Week Supply" and
   "28 days" are not mistaken for doses. */
const DOSE_RE = /(\d+(?:\.\d+)?)\s*(mcg|µg|ug|mg)\b/gi;

function toMcg(value, unit) {
  const n = parseFloat(value);
  if (!isFinite(n)) return null;
  return /^mg$/i.test(unit) ? n * 1000 : n;
}

/* Every dose stated in a string, normalised to mcg, in the order written.
   "CJC/Ipam 100 mcg/100 mcg" yields [100, 100] and stays a pair, because a
   combination product states two real doses and both have to match. */
function parseDoses(str) {
  if (typeof str !== 'string') return [];
  const out = [];
  let m;
  DOSE_RE.lastIndex = 0;
  while ((m = DOSE_RE.exec(str)) !== null) {
    const v = toMcg(m[1], m[2]);
    if (v !== null) out.push(v);
  }
  return out;
}

function fmt(mcg) {
  return mcg >= 1000 ? (mcg / 1000) + ' mg' : mcg + ' mcg';
}

function sameList(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/* ---------------------------------------------------------------------------
   korb-dosing-data.js — peptides, no numeric dose field
   --------------------------------------------------------------------------- */
function auditDosing(K) {
  const problems = [];
  const P = (K && K.prescribing) || {};

  Object.keys(P).forEach(key => {
    const entry = P[key];
    if (!entry || typeof entry !== 'object') return;

    /* Where a dose may legitimately be stated. Drug Formulation is excluded on
       purpose: it is the concentration of the vial, not the dose given. */
    const stated = [];
    const add = (where, str) => {
      const d = parseDoses(str);
      if (d.length) stated.push({ where, str, doses: d });
    };

    add('entry name', entry.name);
    Object.keys(entry).forEach(ph => {
      const p = entry[ph];
      if (!p || typeof p !== 'object' || !p.label) return;
      add(ph + ' label', p.label);
      (p.fields || []).forEach(f => {
        if (f && f.field === 'Name') add(ph + ' Name field', f.val);
      });
    });

    if (stated.length < 2) return;           // nothing to disagree with

    const first = stated[0];
    stated.slice(1).forEach(s => {
      if (!sameList(first.doses, s.doses)) {
        problems.push(
          key + ': dose stated differently. ' +
          first.where + ' says ' + first.doses.map(fmt).join(' + ') +
          ' ("' + first.str + '"), but ' +
          s.where + ' says ' + s.doses.map(fmt).join(' + ') +
          ' ("' + s.str + '")'
        );
      }
    });
  });

  return problems;
}

/* ---------------------------------------------------------------------------
   korb-glp1-data.js — every dose carries a numeric mg, so check against it
   --------------------------------------------------------------------------- */
function auditGlp1(K) {
  const problems = [];
  const P = (K && K.products) || {};

  Object.keys(P).forEach(key => {
    const prod = P[key];
    if (!prod || !Array.isArray(prod.doses)) return;

    prod.doses.forEach((d, i) => {
      if (typeof d.mg !== 'number') {
        problems.push(key + ' dose[' + i + ']: no numeric mg to check against');
        return;
      }
      const truth = d.mg * 1000;
      const at = key + ' ' + fmt(truth);

      /* A combination product names a second active in the same string, so the
         rule is that the drug's own dose must be present, not that it is the
         only number. A name that omits it entirely, or states a different one,
         still fails. */
      const check = (where, str) => {
        const doses = parseDoses(str);
        if (!doses.length) return;                    // no dose claimed, nothing to check
        if (!doses.includes(truth)) {
          problems.push(
            at + ': ' + where + ' states ' + doses.map(fmt).join(' + ') +
            ' but the dose is ' + fmt(truth) + ' ("' + str + '")'
          );
        }
      };

      check('dose string', d.dose);
      ['supply4', 'supply8'].forEach(sup => {
        const s = d[sup];
        if (!s) return;
        check(sup + '.name', s.name);
        check(sup + '.ptInstructions', s.ptInstructions);
      });
    });
  });

  return problems;
}

/* Prints and returns a count. The builders use the count to decide whether to
   refuse, so that a skipped audit can never look like a clean one. */
function report(label, problems) {
  if (problems.length) {
    console.error('DOSE AUDIT FAILED — ' + label + ' states a dose inconsistently in ' +
                  problems.length + ' place(s).');
    console.error('This is the field that becomes the prescription. Fix the data, do not');
    console.error('edit the generated document.');
    problems.forEach(p => console.error('  - ' + p));
  }
  return problems.length;
}

module.exports = { auditDosing, auditGlp1, parseDoses, toMcg, report };
