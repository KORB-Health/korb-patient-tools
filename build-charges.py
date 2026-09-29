# -*- coding: utf-8 -*-
"""build-charges.py - generate korb-charges.js from Nick's KORB x TEBRA workbook.

    python build-charges.py <workbook.xlsx>            write korb-charges.js
    python build-charges.py <workbook.xlsx> --check    exit 1 on any drift

WHAT THIS PULLS, AND WHAT IT REFUSES TO.

Codes and prices only. Nothing else in that workbook comes near this repo,
because this repo is PUBLIC and the workbook is not. Two gates, both deliberate:

  1. GROUPING allow-list. Keeps the clinical cash-pay groups. Drops TPA (the
     New Edge copay tiers), Employee, Employer Paid, and the whole Corporate
     Partner Pricing tab, which names 133 organisations and their negotiated
     rates. Those are contracts. They do not belong on GitHub Pages.

  2. NAMED-ORGANISATION block-list. Four rows sit INSIDE an allowed grouping
     and still name a partner in their description - three school districts
     and a gym chain. Listed by code, never matched by regex, so every
     exclusion is visible in the diff and can be argued with.

  3. INTERNAL-RATE block-list. One row, KORBURGENTE, is a staff rate filed
     under Urgent rather than Employee, so the grouping gate misses it.
     Separate from the list above because the reason is different.

WHAT THE SHEET OWNS AND WHAT THIS REPO OWNS. The sheet owns the code, the price
and the Tebra description. This repo keeps owning which pharmacy, which states,
when something retired and why, and every clinical fact. That split is the
point: it is what stops a spreadsheet cell overwriting a decision.

KORBWegovy is the worked example. It is a real row in that workbook at $599, it
is University Pharmacy pricing from before LillyDirect and NovoCare existed, no
prescription has gone there in months, and the grouping gate lets it through
because it is filed under Semaglutide like everything else. It is excluded by
the CONSUMER choosing not to read it, in the repo, where the reasoning lives -
korb-glp1-data.js has carried the settled policy since 2026-08-09. A status
column in the sheet would not have carried that reasoning either.

TWO BLOCKS, AND WE READ THE MASTER. Charge Codes_Master carries Nick's list in
columns A-F and a pasted Tebra extract in I-N. We read A-F, because that is the
list Nick maintains. Where the two disagree this REPORTS it rather than picking
one - on 2026-09-28 they were $50 apart on three live tirzepatide codes, and
the sheet's own XLOOKUP in columns I and J checks that each code exists but
never compares the fee. A check that looks at everything except the thing that
matters is this repo's oldest lesson, found in somebody else's file.

A VANISHED CODE IS AN EVENT. Nick deletes a retired row rather than striking it
through, which is the right call - strikethrough survives no export, so a
struck row arrives looking live. A code present in the existing korb-charges.js
and absent from the workbook is therefore reported loudly and fails --check.
Do not let it pass: something was retired and nobody told you.

Not wired to any page yet. Generating it is step one.
"""
import sys, io, os, re, datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

try:
    from openpyxl import load_workbook
except ImportError:
    sys.exit('openpyxl is required: pip install openpyxl')

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'korb-charges.js')

ALLOW = ['Semaglutide', 'Tirzepatide', 'Peptide', 'Womans Health', 'Sermorelin',
         'Sexual Health', 'Testosterone', 'Urgent', 'Ageless', 'Hairloss',
         'Mental Health', 'Lab', 'Skincare', 'MISC']

NAMED_ORG = {
    'FITSemaASD': 'description names AISD',
    'FITSemaHS9': 'description names HISD',
    'FITSemaNS9': 'description names NISD',
    'KORBURGENT30': 'description names InShape / Fitness19',
}

# A SECOND, DIFFERENT REASON. These are not named-partner rows; they are internal
# staff rates that happen to sit OUTSIDE the Employee grouping, so the grouping
# gate above lets them through. Kept separate from NAMED_ORG because the reason
# is different and a future reader should not have to guess which rule applied.
#
# KORBURGENTE is "KORB Urgent care Employee/Spouse, $29", filed under Urgent.
# Don, 2026-09-28: out of the repo and out of the published tab. It is one
# internal perk price and nobody is harmed by it, but it is the same KIND of
# thing the Employee grouping is excluded for, and inheriting it by accident is
# not the same as deciding to publish it.
INTERNAL_RATE = {
    'KORBURGENTE': 'staff rate filed under Urgent rather than Employee',
}

CODE_RE = re.compile(r'^[A-Za-z][A-Za-z0-9]{2,}$')


def read(path):
    """-> (rows, disagreements, duplicates, conflicts) from columns A-F.

    A CODE MAY LEGITIMATELY APPEAR TWICE. FITGLP1001, the $79 brand visit fee,
    is filed under both Semaglutide and Tirzepatide because one fee covers both
    drugs - korb-glp1-data.js says the same thing: "One fee, one code, no
    variation by product or channel." So we key by code and keep the first.

    The first version of this emitted one entry per ROW into an object that can
    only hold one entry per KEY, so the second FITGLP1001 silently overwrote the
    first and meta.count said 99 where there were 98. Caught by selfCheck, which
    is the only reason that assertion is in the generated file. A duplicate with
    a DIFFERENT price is a real conflict and fails the build.
    """
    ws = load_workbook(path)['Charge Codes_Master']
    rows, seen, tebra = [], {}, {}
    disagree, dup, conflict = [], [], []
    for r in range(2, ws.max_row + 1):
        k = ws.cell(row=r, column=11).value
        if k:
            tebra[str(k).strip()] = ws.cell(row=r, column=13).value
    for r in range(2, ws.max_row + 1):
        grouping = str(ws.cell(row=r, column=2).value or '').strip()
        code = str(ws.cell(row=r, column=3).value or '').strip()
        fee = ws.cell(row=r, column=5).value
        desc = str(ws.cell(row=r, column=6).value or '').strip()
        if not code or grouping not in ALLOW:
            continue
        if code in NAMED_ORG or code in INTERNAL_RATE:
            continue
        if not CODE_RE.match(code):
            continue
        price = int(fee) if isinstance(fee, (int, float)) else None
        if code in seen:
            first = seen[code]
            if first['price'] != price:
                conflict.append((code, first['grouping'], first['price'], grouping, price))
            else:
                dup.append((code, first['grouping'], grouping, price))
            continue
        t = tebra.get(code)
        if isinstance(fee, (int, float)) and isinstance(t, (int, float)):
            if int(fee) != int(t):
                disagree.append((code, int(fee), int(t)))
        entry = {'code': code, 'grouping': grouping, 'description': desc, 'price': price}
        seen[code] = entry
        rows.append(entry)
    rows.sort(key=lambda x: (ALLOW.index(x['grouping']), x['code']))
    return rows, disagree, dup, conflict


def prior_codes():
    """Codes in the korb-charges.js already on disk, or None if there is none."""
    if not os.path.exists(OUT):
        return None
    txt = io.open(OUT, encoding='utf-8').read()
    return set(re.findall(r"^ {6}'([A-Za-z][A-Za-z0-9]*)':", txt, re.M))


def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


def js(rows, source):
    L = []
    add = L.append
    bar = '=' * 74
    add('/* ' + bar)
    add('   KORB HEALTH — CHARGE CODES AND PRICING')
    add('')
    add('   GENERATED. Do not hand-edit - the next build overwrites it.')
    add("   Source: '%s', tab 'Charge Codes_Master', columns A-F." % source)
    add('   Regenerate:  python build-charges.py <workbook.xlsx>')
    add('   Check drift: python build-charges.py <workbook.xlsx> --check')
    add('')
    add('   THE SHEET OWNS code, price and Tebra description. NOTHING ELSE.')
    add("   Which pharmacy, which states, what retired and why, and every clinical")
    add('   fact stay in this repo. A price is a number somebody in Finance changes;')
    add('   the rest is a decision with reasoning attached, and a spreadsheet cell')
    add('   cannot carry reasoning.')
    add('')
    add('   A CODE BEING HERE DOES NOT MEAN KORB OFFERS IT. KORBWegovy and')
    add('   KORBMounjaro are in this file and are obsolete - University Pharmacy')
    add('   pricing from before LillyDirect and NovoCare, retired on the clinical')
    add('   side and still live in the workbook. Brand is one $79 visit fee,')
    add('   FITGLP1001, and korb-glp1-data.js records why. A consumer chooses which')
    add('   codes it reads. This file only carries what Finance publishes.')
    add('   ' + bar + ' */')
    add('(function (root) {')
    add("  'use strict';")
    add('')
    add('  var KORB_CHARGES = {')
    add('    meta: {')
    add("      version: '1.0',")
    add("      generated: '%s'," % datetime.date.today().isoformat())
    add("      source: '%s'," % esc(source))
    add("      sourceTab: 'Charge Codes_Master, columns A-F',")
    add("      owner: 'Nick Ellison, VP Finance - the codes and prices are his',")
    add('      count: %d,' % len(rows))
    add("      excludes: 'TPA, Employee, Employer Paid, the whole Corporate Partner " +
        "tab, ' +")
    add("                'four rows naming AISD, HISD, NISD or InShape/Fitness19, and ' +")
    add("                'KORBURGENTE, a staff rate filed outside the Employee group. ' +")
    add("                'This repo is public; those are contracts.'")
    add('    },')
    add('')
    add('    codes: {')
    last = None
    for i, x in enumerate(rows):
        if x['grouping'] != last:
            if last is not None:
                add('')
            add('      /* --- %s --- */' % x['grouping'])
            last = x['grouping']
        price = str(x['price']) if x['price'] is not None else 'null'
        tail = ',' if i < len(rows) - 1 else ''
        add("      '%s': { price: %s, grouping: '%s'," % (x['code'], price, esc(x['grouping'])))
        add("        description: '%s' }%s" % (esc(x['description']), tail))
    add('    },')
    add('')
    add('    /* Throws rather than returning undefined. A missing charge code is a')
    add("       billing failure, and a silent undefined on a provider's screen is how")
    add('       it reaches a claim. */')
    add('    priceFor: function (code) {')
    add('      var e = this.codes[code];')
    add("      if (!e) { throw new Error('korb-charges.js: unknown charge code ' + code); }")
    add('      return e.price;')
    add('    },')
    add('')
    add('    has: function (code) {')
    add('      return Object.prototype.hasOwnProperty.call(this.codes, code);')
    add('    },')
    add('')
    add('    selfCheck: function () {')
    add('      var problems = [], self = this, n = 0;')
    add('      Object.keys(this.codes).forEach(function (k) {')
    add('        n++;')
    add('        var e = self.codes[k];')
    add("        if (e.price === null) { problems.push(k + ': no price'); }")
    add('        if (typeof e.price === \'number\' && e.price < 0) {')
    add("          problems.push(k + ': negative price');")
    add('        }')
    add("        if (!e.description) { problems.push(k + ': no description'); }")
    add('      });')
    add('      if (n !== this.meta.count) {')
    add("        problems.push('count says ' + this.meta.count + ' but there are ' + n);")
    add('      }')
    add('      return { ok: problems.length === 0, count: n, problems: problems };')
    add('    }')
    add('  };')
    add('')
    add("  if (typeof module !== 'undefined' && module.exports) {")
    add('    module.exports = KORB_CHARGES;')
    add('  } else {')
    add('    root.KORB_CHARGES = KORB_CHARGES;')
    add('  }')
    add("}(typeof self !== 'undefined' ? self : this));")
    return '\n'.join(L) + '\n'


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check = '--check' in sys.argv
    if not args:
        sys.exit(__doc__)

    path = args[0]
    rows, disagree, dup, conflict = read(path)
    source = os.path.basename(path)
    fail = False

    print('read %d codes from %s' % (len(rows), source))

    for c, g1, g2, p in dup:
        print('   %s is filed under both %s and %s at $%s - kept once'
              % (c, g1, g2, p))

    if conflict:
        fail = True
        print('')
        print('SAME CODE, TWO DIFFERENT PRICES IN THE WORKBOOK:')
        for c, g1, p1, g2, p2 in conflict:
            print('   %-16s %s $%s  vs  %s $%s' % (c, g1, p1, g2, p2))
        print('   One of them is wrong. Ask Nick before generating.')

    if disagree:
        fail = True
        print('')
        print('WORKBOOK DISAGREES WITH ITSELF - master A-F vs the Tebra extract I-N:')
        for c, m, t in disagree:
            print('   %-16s master %-6s tebra %-6s' % (c, m, t))
        print('   Ask Nick which one Tebra is billing. Reading the master, as always.')
    else:
        print('master and Tebra extract agree on every code')

    before = prior_codes()
    if before is not None:
        now = set(x['code'] for x in rows)
        gone, new = sorted(before - now), sorted(now - before)
        if gone:
            fail = True
            print('')
            print('CODES THAT VANISHED FROM THE WORKBOOK (%d) - something was RETIRED:'
                  % len(gone))
            for c in gone:
                print('   %s' % c)
            print('   Confirm with Nick before regenerating. Do not let this pass quietly.')
        if new:
            print('')
            print('new codes since the last generation (%d): %s' % (len(new), ', '.join(new)))

    built = js(rows, source)

    if check:
        if not os.path.exists(OUT):
            print('')
            print('DRIFT: korb-charges.js does not exist. Generate it.')
            sys.exit(1)
        have = io.open(OUT, encoding='utf-8').read().replace('\r\n', '\n')
        strip = lambda s: re.sub(r"^ *generated: '.*',$", '', s, flags=re.M)
        if strip(have) != strip(built):
            print('')
            print('DRIFT: korb-charges.js does not match the workbook. Regenerate it.')
            sys.exit(1)
        if fail:
            sys.exit(1)
        print('')
        print('korb-charges.js matches the workbook')
        return

    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(built)
    print('')
    print('wrote korb-charges.js  (%d codes)' % len(rows))
    if fail:
        sys.exit(1)


main()
