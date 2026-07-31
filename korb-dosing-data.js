/* ============================================================================
   KORB HEALTH — SHARED DOSING DATA
   Single source of truth for peptide dosing, schedules, and pharmacy
   instructions across all KORB patient-facing and provider tools.

   VERIFIED: 2026-07-31
   Cross-checked line-for-line against:
     - KORB_Patient_Treatment_Schedule.html   (INSTR + AGENTS blocks)
     - KORB_Provider_Clinical_Reference.html  (ACTUAL_DIRECTIONS + FOUNDATION_AGENTS
       + PEAK_SCHEDULE blocks)
   All unit counts, active-week ranges, and stagger timing matched exactly
   between both files at time of verification. See
   KORB_Dosing_Data_Verification.docx for the full comparison record and
   update procedure.

   STATUS: This file is NOT yet loaded by either live tool. Both
   KORB_Patient_Treatment_Schedule.html and KORB_Provider_Clinical_Reference.html
   still carry their own internal copies of this data. Wiring them to load
   this file instead is a separate, deliberate step — do not assume it has
   happened just because this file exists.

   HOW TO USE (once wired in):
     <script src="korb-dosing-data.js"></script>
   Then reference the KORB_DOSING object below instead of any local copy.
   ============================================================================ */

var KORB_DOSING = {

  meta: {
    version: '1.1',
    lastVerified: '2026-07-31',
    verifiedAgainst: [
      'KORB_Patient_Treatment_Schedule.html',
      'KORB_Provider_Clinical_Reference.html'
    ],
    changelog: [
      '2026-07-31 (v1.1): Foundation BPC-157 corrected from [1,6] to [1,8] per confirmation ' +
      'from Don (Director of Clinical Operations & Lead Provider) — the course was updated ' +
      'to 8 weeks on / 8-week washout some weeks prior, to align with the 16-week cycle. ' +
      'Both live tools still show the pre-update 6-week value as of this date and need ' +
      'a matching correction. Gateway/Peak BPC-157 (6-week base-protocol course, Weeks 3-8) ' +
      'is unaffected and unchanged.'
    ]
  },

  // ── PHARMACIES ────────────────────────────────────────────────────────────
  pharmacies: {
    premier:   { name: 'Premier Pharmacy',   color: '#1565C0' },
    greenwich: { name: 'Greenwich Pharmacy', color: '#2E7D32' }
  },

  // ── INJECTION INSTRUCTIONS (per agent/dose key, per pharmacy) ────────────
  // This is the number that matters most. Verified identical between
  // Patient Treatment Schedule's INSTR block and Provider Clinical
  // Reference's ACTUAL_DIRECTIONS block on 2026-07-31.
  instructions: {
    sermorelin: {
      premier:   'Inject 20 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 7 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    sermorelin300: {
      premier:   'Inject 30 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 10 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    sermorelin400: {
      premier:   'Inject 40 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 13 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    sermorelin500: {
      premier:   'Inject 50 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.',
      greenwich: 'Inject 17 units subcutaneously at bedtime, Monday through Saturday (6 days on, Sunday off), on an empty stomach.'
    },
    bpc157: {
      premier:   'Inject 13 units subcutaneously once daily.',
      greenwich: 'Inject 17 units subcutaneously once daily.'
    },
    cjcipam: {
      premier:   'Inject 5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.',
      greenwich: 'Inject 5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.'
    },
    cjcipam150: {
      premier:   'Inject 7.5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.',
      greenwich: 'Inject 7.5 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.'
    },
    cjcipam200: {
      premier:   'Inject 10 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.',
      greenwich: 'Inject 10 units subcutaneously Monday through Saturday, at bedtime, on an empty stomach.'
    },
    ghkcu: {
      premier:   'Inject 20 units subcutaneously three times weekly in the evening.',
      greenwich: 'Inject 20 units subcutaneously three times weekly in the evening.'
    },
    tesamorelin1mg: {
      premier:   'Inject 20 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).',
      greenwich: 'Inject 33 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).'
    },
    tesamorelin15mg: {
      premier:   'Inject 30 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).',
      greenwich: 'Inject 50 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).'
    },
    tesamorelin2mg: {
      premier:   'Inject 40 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).',
      greenwich: 'Inject 67 units subcutaneously every evening, Monday through Saturday (6 days on, Sunday off).'
    }
  },

  // ── AGENT METADATA ────────────────────────────────────────────────────────
  // label / dose / color / schedule / timing / how = display metadata.
  // onWeeksFoundation = active-week range when this agent runs as a Foundation
  //   standalone agent (single-agent program, no stagger).
  // onWeeksAddon = active-week range when this agent runs inside Gateway or
  //   Peak (staggered start behind the primary agent).
  agents: {
    sermorelin: {
      label: 'Sermorelin', dose: '200 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin300: {
      label: 'Sermorelin', dose: '300 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin400: {
      label: 'Sermorelin', dose: '400 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    sermorelin500: {
      label: 'Sermorelin', dose: '500 mcg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    bpc157: {
      label: 'BPC-157', dose: '500 mcg', color: '#1D7A35',
      // CONFIRMED 2026-07-31 by Don (Director of Clinical Operations & Lead Provider):
      // Foundation BPC-157 was updated from a 6-week course to an 8-week course
      // (8 weeks on, 8-week washout) some weeks prior to this file's creation, so it
      // fits the 16-week cycle the same way every other program does. Both live
      // tools (Patient Treatment Schedule, Provider Clinical Reference) still show
      // the pre-update 6-week value [1,6] as of this date and need to be corrected —
      // see korb_doc verification doc, "Where This Data Still Lives."
      onWeeksFoundation: [1, 8],
      // BPC-157 inside Gateway/Peak is part of the BASE PROTOCOL, not an optional
      // add-on — only GHK-Cu is optional. Unchanged by the above: still a 6-week
      // course, starting Week 3 (2 weeks after the primary agent), through Week 8.
      onWeeksGatewayPeakBase: [3, 8],
      schedule: 'Every day (7 days a week)', timing: 'Any consistent time · No food restriction',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: 'daily', pillBg: '#1D7A35'
    },
    cjcipam: {
      label: 'CJC-1295 / Ipamorelin', dose: '100 mcg CJC-1295 / 100 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    cjcipam150: {
      label: 'CJC-1295 / Ipamorelin', dose: '150 mcg CJC-1295 / 150 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    cjcipam200: {
      label: 'CJC-1295 / Ipamorelin', dose: '200 mcg CJC-1295 / 200 mcg Ipamorelin', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Bedtime · Empty stomach (2+ hrs after eating)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    ghkcu: {
      label: 'GHK-Cu', dose: '2 mg', color: '#4A148C',
      onWeeksOptionalAddon: [5, 8],   // Gateway/Peak optional add-on only — never Foundation. This is the ONLY true optional add-on in the program structure.
      schedule: '3 times per week (evenings)', timing: 'Evening · Choose consistent days (e.g. Mon / Wed / Fri)',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '3×/week', pillBg: '#6A1B9A'
    },
    tesamorelin1mg: {
      label: 'Tesamorelin 1 mg', dose: '1 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    tesamorelin15mg: {
      label: 'Tesamorelin 1.5 mg', dose: '1.5 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    },
    tesamorelin2mg: {
      label: 'Tesamorelin 2 mg', dose: '2 mg', color: '#21275B',
      onWeeksFoundation: [1, 12],
      schedule: 'Monday – Saturday · Sunday off', timing: 'Evening',
      how: 'Subcutaneous (SQ) injection — fatty tissue under the skin',
      pillLabel: '6 on / 1 off', pillBg: '#21275B'
    }
  },

  // ── PROGRAM → AGENT MAPPING ──────────────────────────────────────────────
  // How each program tier resolves to a set of agent keys. Dose-selectable
  // programs resolve the primary agent key at runtime from the patient's
  // dose selection (see resolvePrimaryKey below).
  programs: {
    foundation: {
      label: 'Foundation Program',
      agentChoices: ['sermorelin', 'cjcipam', 'bpc157'],   // provider selects ONE
      stagger: false,
      optionalAddon: null   // GHK-Cu is never a Foundation option
    },
    gateway: {
      label: 'Gateway Program',
      primaryFamily: 'sermorelin',
      primaryDoseOptions: ['200', '300', '400', '500'],
      baseProtocol: ['sermorelin', 'bpc157'],   // BPC-157 is part of the base protocol, not optional
      optionalAddon: 'ghkcu',                    // the only optional add-on
      stagger: true   // primary day 1, BPC-157 week 3, GHK-Cu (if on) week 5
    },
    peakA: {
      label: 'Peak Performance — Pathway A',
      primaryFamily: 'cjcipam',
      primaryDoseOptions: ['100', '150', '200'],
      baseProtocol: ['cjcipam', 'bpc157'],
      optionalAddon: 'ghkcu',
      stagger: true
    },
    peakB: {
      label: 'Peak Performance — Pathway B',
      primaryFamily: 'tesamorelin',
      primaryDoseOptions: ['1mg', '15mg', '2mg'],
      baseProtocol: ['tesamorelin', 'bpc157'],
      optionalAddon: 'ghkcu',
      stagger: true
    }
  },

  // ── HELPERS ───────────────────────────────────────────────────────────────
  // Resolve a dose-selector value to its AGENTS/instructions key.
  // e.g. resolvePrimaryKey('sermorelin','200') -> 'sermorelin'
  //      resolvePrimaryKey('sermorelin','400') -> 'sermorelin400'
  //      resolvePrimaryKey('tesamorelin','1mg') -> 'tesamorelin1mg'
  resolvePrimaryKey: function (family, doseVal) {
    if (family === 'sermorelin') return (doseVal === '200') ? 'sermorelin' : 'sermorelin' + doseVal;
    if (family === 'cjcipam')    return (doseVal === '100') ? 'cjcipam'    : 'cjcipam' + doseVal;
    if (family === 'tesamorelin') return 'tesamorelin' + doseVal;
    return family;
  },

  // Get the injection instruction text for a given agent key + pharmacy.
  getInstruction: function (agentKey, pharmacyKey) {
    var entry = this.instructions[agentKey];
    return entry ? entry[pharmacyKey] : 'Follow your prescription label.';
  },

  // Get the active-week range [start, end] for an agent key in a given
  // program context: 'foundation' (standalone course), 'gatewayPeakBase'
  // (BPC-157 as part of the Gateway/Peak base protocol — NOT optional), or
  // 'optionalAddon' (GHK-Cu only — the one true optional add-on).
  getActiveWeeks: function (agentKey, context) {
    var a = this.agents[agentKey];
    if (!a) return null;
    if (context === 'foundation') return a.onWeeksFoundation;
    if (context === 'gatewayPeakBase') return a.onWeeksGatewayPeakBase;
    if (context === 'optionalAddon') return a.onWeeksOptionalAddon;
    return null;
  }
};

/* ============================================================================
   MIGRATION NOTE FOR WHOEVER WIRES THIS IN LATER:

   Patient Treatment Schedule currently reads from its own local `INSTR` and
   `AGENTS` variables. Provider Clinical Reference currently reads from its
   own local `ACTUAL_DIRECTIONS`, `FOUNDATION_AGENTS`, and `PEAK_SCHEDULE`
   variables. Neither file loads this script yet.

   To adopt this file in either tool:
     1. Add <script src="korb-dosing-data.js"></script> before that tool's
        own <script> block.
     2. Replace local lookups (INSTR[key][pk], AGENTS[key].onWeeks, etc.)
        with the equivalent KORB_DOSING call.
     3. Re-render the tool and visually diff against the current live
        version before pushing — a wiring mistake here touches every
        patient's dosing instructions.
     4. Do this one tool at a time, not both at once, so a problem in one
        doesn't take down the other.
   ============================================================================ */
