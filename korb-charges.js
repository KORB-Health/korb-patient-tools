/* ==========================================================================
   KORB HEALTH — CHARGE CODES AND PRICING

   GENERATED. Do not hand-edit - the next build overwrites it.
   Source: 'korb_charges_live.xlsx', tab 'Charge Codes_Master', columns A-F.
   Regenerate:  python build-charges.py <workbook.xlsx>
   Check drift: python build-charges.py <workbook.xlsx> --check

   THE SHEET OWNS code, price and Tebra description. NOTHING ELSE.
   Which pharmacy, which states, what retired and why, and every clinical
   fact stay in this repo. A price is a number somebody in Finance changes;
   the rest is a decision with reasoning attached, and a spreadsheet cell
   cannot carry reasoning.

   A CODE BEING HERE DOES NOT MEAN KORB OFFERS IT. KORBWegovy and
   KORBMounjaro are in this file and are obsolete - University Pharmacy
   pricing from before LillyDirect and NovoCare, retired on the clinical
   side and still live in the workbook. Brand is one $79 visit fee,
   FITGLP1001, and korb-glp1-data.js records why. A consumer chooses which
   codes it reads. This file only carries what Finance publishes.
   ========================================================================== */
(function (root) {
  'use strict';

  var KORB_CHARGES = {
    meta: {
      version: '1.0',
      generated: '2026-09-28',
      source: 'korb_charges_live.xlsx',
      sourceTab: 'Charge Codes_Master, columns A-F',
      owner: 'Nick Ellison, VP Finance - the codes and prices are his',
      count: 98,
      excludes: 'TPA, Employee, Employer Paid, the whole Corporate Partner tab, ' +
                'and four rows naming AISD, HISD, NISD or InShape/Fitness19. ' +
                'This repo is public; those are contracts.'
    },

    codes: {
      /* --- Semaglutide --- */
      'FITGLP1001': { price: 79, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now GLP1 RX submission Novo/Lily' },
      'FITSemOrl180': { price: 399, grouping: 'Semaglutide',
        description: 'KORB Get Fit Oral Semaglutide 180' },
      'FITSemOrl90': { price: 299, grouping: 'Semaglutide',
        description: 'KORB Get Fit Oral Semagultide 90' },
      'FITSema001': { price: 269, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Standard' },
      'FITSema001MAX': { price: 319, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Max Dose (4.5mg & 6mg) Standard' },
      'FITSema110': { price: 169, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide F&F1' },
      'FITSema115': { price: 199, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide F&F2' },
      'FITSema12WKH': { price: 449, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now  Semaglutide HIgh (1.0mg-2.7mg) 12 wk Maintenance (Preimier Only)' },
      'FITSema12WKL': { price: 399, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Low (0.1-0.6mg) 12 wk Maintenance (Premier Only)' },
      'FITSema12wkMAX': { price: 569, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Max Dose (4.5mg&6mg) 12 wk Maintenace (Premier Only)' },
      'FITSemaCP2': { price: 269, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Corp Partner 269' },
      'FITSemaCP9': { price: 199, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Corp Partner 199' },
      'FITSemaCP9MAX': { price: 249, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Corp Partner Max Dose (4.5mg&6mg) 249' },
      'FITSemaMBL': { price: 349, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Standard 8-wk Maintenance-Belmar' },
      'FITSemaMNT': { price: 349, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Standard-8 wk Maintenance' },
      'FITSemaMNTMAX': { price: 449, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Standard-8 wk Maintenance Max Dose (4.5mg&6mg)' },
      'FITSemaMSD': { price: 300, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Standard-8 wk Maintenance ONLY $150 patients' },
      'FITSemaSer': { price: 499, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Maintenance Semaglutide/Sermorelin Troche bundle' },
      'FITSemaVET': { price: 199, grouping: 'Semaglutide',
        description: 'KORB Get Fit Now Semaglutide Veteran Discount' },
      'KORBWegovy': { price: 599, grouping: 'Semaglutide',
        description: 'KORB Wegovy Pen All doses' },

      /* --- Tirzepatide --- */
      'FITTirOrl180': { price: 599, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Oral Tirzepatide Oral 180' },
      'FITTirOrl90': { price: 499, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Oral Tirzepatide Oral 90' },
      'FITTirz002': { price: 349, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide StandardT2' },
      'FITTirz003': { price: 399, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide StandardT3' },
      'FITTirz004': { price: 449, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide StandardT4' },
      'FITTirz12WkT1': { price: 699, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 12 Wk-Maintenance T1 (Premier Only)' },
      'FITTirz12WkT2': { price: 799, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 12 Wk-Maintenance T2 (Premier Only)' },
      'FITTirz12WkT3': { price: 949, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 12 Wk-Maintenance T3 (Premier Only)' },
      'FITTirzCP2': { price: 349, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide Corp Partner and F&F T2' },
      'FITTirzCP3': { price: 399, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide Corp Partner and F&F T3' },
      'FITTirzCP4': { price: 449, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide Corp Partner and F&F T4' },
      'FITTirzMT1': { price: 599, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 8 Week-Maintenance T1' },
      'FITTirzMT2': { price: 649, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 8 Week-Maintenance T2' },
      'FITTirzMT3': { price: 799, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 8 Week-Maintenance T3' },
      'FITTirzMTB1': { price: 599, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 8 Week-Maintenance T1-Belmar' },
      'FITTirzMTB2': { price: 649, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 8 Week-Maintenance T2-Belmar' },
      'FITTirzMTB3': { price: 799, grouping: 'Tirzepatide',
        description: 'KORB Get Fit Now Tirzepatide 8 Week-Maintenance T3-Belmar' },
      'KORBMounjaro': { price: 1150, grouping: 'Tirzepatide',
        description: 'KORB Mounjaro Pen All Doses' },

      /* --- Peptide --- */
      'BASEPeptideLab': { price: 99, grouping: 'Peptide',
        description: 'KORB Peptide Baseline Lab' },
      'FndnPeptideP01': { price: 199, grouping: 'Peptide',
        description: 'KORB Peptide Foundation Program-Partner- BPC' },
      'FndnPeptideP02': { price: 199, grouping: 'Peptide',
        description: 'KORB Peptide Foundation Program-Partner-Sermorelin' },
      'FndnPeptideP03': { price: 199, grouping: 'Peptide',
        description: 'KORB Peptide Foundation Program-Partner-CJC' },
      'FndnPeptideP11': { price: 199, grouping: 'Peptide',
        description: 'KORB Peptide Foundation Program-Partner- BPC-Recurring' },
      'FndnPeptideP22': { price: 199, grouping: 'Peptide',
        description: 'KORB Peptide Foundation Program-Partner-Sermorelin Recurring' },
      'FndnPeptideP33': { price: 199, grouping: 'Peptide',
        description: 'KORB Peptide Foundation Program-Partner-CJC Recurring' },
      'GHKCUPeptide01': { price: 199, grouping: 'Peptide',
        description: 'KORB Peptide GHK-CU Add on' },
      'GatePeptideP01': { price: 299, grouping: 'Peptide',
        description: 'KORB Peptide Gateway Program-Partner-Sermorelin + BPC' },
      'GatePeptideP11': { price: 299, grouping: 'Peptide',
        description: 'KORB Peptide Gateway Program-Partner-Sermorelin + BPC Recurring' },
      'PeakPeptideP01': { price: 399, grouping: 'Peptide',
        description: 'KORB Peptide Peak Program-Partner- Path 1 CJC+BPC' },
      'PeakPeptideP02': { price: 399, grouping: 'Peptide',
        description: 'KORB Peptide Peak Program-Partner-Path 2 Tesa + BPC' },
      'PeakPeptideP11': { price: 399, grouping: 'Peptide',
        description: 'KORB Peptide Peak Program-Partner- Path 1 CJC+BPC Recurring' },
      'PeakPeptideP22': { price: 399, grouping: 'Peptide',
        description: 'KORB Peptide Peak Program-Partner-Path 2 Tesa + BPC Recurring' },

      /* --- Womans Health --- */
      'WMN141add': { price: 119, grouping: 'Womans Health',
        description: 'KORB Health PT-141 Add-on' },
      'WMN141reg': { price: 149, grouping: 'Womans Health',
        description: 'KORB PT-141 Regular' },
      'WMNHlth1': { price: 220, grouping: 'Womans Health',
        description: 'KORB Womans Health 1 drug no testing' },
      'WMNHlth1Bsc': { price: 339, grouping: 'Womans Health',
        description: 'KORB Womans Health 1 drug Basic testing' },
      'WMNHlth1Cmp': { price: 469, grouping: 'Womans Health',
        description: 'KORB Womans Health 1 drug Complete testing' },
      'WMNHlth2': { price: 250, grouping: 'Womans Health',
        description: 'KORB Womans Health 2 drug no testing' },
      'WMNHlth2Bsc': { price: 369, grouping: 'Womans Health',
        description: 'KORB Womans Health 2 drug Basic testing' },
      'WMNHlth2Cmp': { price: 499, grouping: 'Womans Health',
        description: 'KORB Womans Health 2 drug Complete testing' },
      'WMNHlth3': { price: 299, grouping: 'Womans Health',
        description: 'KORB Womans Health 3 drug no testing' },
      'WMNHlth3Bsc': { price: 418, grouping: 'Womans Health',
        description: 'KORB Womans Health 3 drug Basic testing' },
      'WMNHlth3Cmp': { price: 548, grouping: 'Womans Health',
        description: 'KORB Womans Health 3 drug Complete testing' },
      'WMNHlthINS': { price: 79, grouping: 'Womans Health',
        description: 'KORB Womans Health Insurance local RX' },

      /* --- Sermorelin --- */
      'FITSerT006': { price: 179, grouping: 'Sermorelin',
        description: 'KORB Get Fit Now Sermorelin-Troche Standard 60 Days' },
      'FITSerT009': { price: 299, grouping: 'Sermorelin',
        description: 'KORB Get Fit Now Sermorelin-Troche Standard 90 Days' },
      'FITSerT099': { price: 149, grouping: 'Sermorelin',
        description: 'KORB Get Fit Now Sermorelin-Troche 30 Days' },
      'FITSerTAD6': { price: 149, grouping: 'Sermorelin',
        description: 'KORB Get Fit Now Sermorelin-Troche 60 Days ADD-ON' },
      'FITSerTAD9': { price: 199, grouping: 'Sermorelin',
        description: 'KORB Get Fit Now Sermorelin-Troche 90 Days ADD-ON' },
      'FITSerTADD': { price: 99, grouping: 'Sermorelin',
        description: 'KORB Get Fit Now Sermorelin-Troche 30 Days ADD-ON' },
      'FITSerm001': { price: 149, grouping: 'Sermorelin',
        description: 'KORB Get Fit Now Sermorelin Standard-Injection 30 Days' },

      /* --- Sexual Health --- */
      'INTELEC001': { price: 99, grouping: 'Sexual Health',
        description: 'KORB Get Intimate Now KORB Electric Standard' },
      'INTRISE001': { price: 99, grouping: 'Sexual Health',
        description: 'KORB Get Intimate Now KORB RISE Standard' },

      /* --- Testosterone --- */
      'FITTRTQ001': { price: 399, grouping: 'Testosterone',
        description: 'KORB Get Fit Now Testosterone Standard' },
      'FITTRTQ100': { price: 99, grouping: 'Testosterone',
        description: 'KORB Get Fit Now Testosterone-Lab' },

      /* --- Urgent --- */
      'KORBURGENT49': { price: 49, grouping: 'Urgent',
        description: 'KORB Urgent care, existing patient $49' },
      'KORBURGENTE': { price: 29, grouping: 'Urgent',
        description: 'KORB Urgent care Employee/Spouse' },

      /* --- Ageless --- */
      'AGEMETF009': { price: 99, grouping: 'Ageless',
        description: 'KORB Ageless Metformin Standard Quarter' },
      'AGENAV2001': { price: 179, grouping: 'Ageless',
        description: 'KORB Ageless NAD+ Vial2 Standard' },

      /* --- Hairloss --- */
      'AGEHairFOreg': { price: 149, grouping: 'Hairloss',
        description: 'KORB Hairloss Foam regular' },
      'AGEHairFOsub': { price: 119, grouping: 'Hairloss',
        description: 'KORB Hairloss Foam subscription' },
      'AGEHairPLreg': { price: 99, grouping: 'Hairloss',
        description: 'KORB Hairloss pill regular' },
      'AGEHairPLsub': { price: 79, grouping: 'Hairloss',
        description: 'KORB Hairloss pill subscription' },

      /* --- Mental Health --- */
      'MNT120PILLS': { price: 50, grouping: 'Mental Health',
        description: 'KORB Mental Health 120 Pill RX' },
      'MNT180PILLS': { price: 60, grouping: 'Mental Health',
        description: 'KORB Mental Health 180 Pill RX' },
      'MNT270PILLS': { price: 100, grouping: 'Mental Health',
        description: 'KORB Mental Health 270 Pill RX' },
      'MNT30PILLS': { price: 20, grouping: 'Mental Health',
        description: 'KORB Mental Health 30 Pill RX' },
      'MNT60PILLS': { price: 30, grouping: 'Mental Health',
        description: 'KORB Mental Health 60 Pill RX' },
      'MNT90PILLS': { price: 40, grouping: 'Mental Health',
        description: 'KORB Mental Health 90 Pill RX' },
      'MNTADDLCRX': { price: 20, grouping: 'Mental Health',
        description: 'KORB Mental Health Program add on Send RX to Local Pharmacy' },
      'MNTALL1001': { price: 49, grouping: 'Mental Health',
        description: 'KORB Mental Health Standard Visit $49' },
      'SLPHTZA001': { price: 49, grouping: 'Mental Health',
        description: 'KORB Sleep Hydroxyzine/Trazadone/Amitriptyline Standard' },
      'SLPHTZA002': { price: 30, grouping: 'Mental Health',
        description: 'KORB Sleep Hydroxyzine/Trazadone/Amitriptyline Multi' },

      /* --- Lab --- */
      'LABHlthBsc': { price: 119, grouping: 'Lab',
        description: 'KORB Basic Lab' },
      'LABHlthCmp': { price: 249, grouping: 'Lab',
        description: 'KORB Complete Lab' },

      /* --- Skincare --- */
      'AGESkinCRCmb': { price: 99, grouping: 'Skincare',
        description: 'KORB Skincare Combo Cream 30gm' },
      'AGESkinCRToE': { price: 49, grouping: 'Skincare',
        description: 'KORB Skincare Trentinoin 20gm or Estriol 30gm' },

      /* --- MISC --- */
      'KORBMISC': { price: 0, grouping: 'MISC',
        description: 'KORB Misc Payment' }
    },

    /* Throws rather than returning undefined. A missing charge code is a
       billing failure, and a silent undefined on a provider's screen is how
       it reaches a claim. */
    priceFor: function (code) {
      var e = this.codes[code];
      if (!e) { throw new Error('korb-charges.js: unknown charge code ' + code); }
      return e.price;
    },

    has: function (code) {
      return Object.prototype.hasOwnProperty.call(this.codes, code);
    },

    selfCheck: function () {
      var problems = [], self = this, n = 0;
      Object.keys(this.codes).forEach(function (k) {
        n++;
        var e = self.codes[k];
        if (e.price === null) { problems.push(k + ': no price'); }
        if (typeof e.price === 'number' && e.price < 0) {
          problems.push(k + ': negative price');
        }
        if (!e.description) { problems.push(k + ': no description'); }
      });
      if (n !== this.meta.count) {
        problems.push('count says ' + this.meta.count + ' but there are ' + n);
      }
      return { ok: problems.length === 0, count: n, problems: problems };
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KORB_CHARGES;
  } else {
    root.KORB_CHARGES = KORB_CHARGES;
  }
}(typeof self !== 'undefined' ? self : this));
