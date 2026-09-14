#!/usr/bin/env python3
"""
KORB HEALTH - SCHEDULER INTAKE LOGIC SPECIFICATION BUILDER

  python build-intake-spec.py                  # from the repo root
  python build-intake-spec.py --src KORB_Scheduler_Intake_AllPrograms.html

Reads a scheduler intake page and writes KORB_Scheduler_Intake_Logic_Spec.xlsx:
every question, the exact condition that reveals each dependent block, and the
exact condition that makes a field required.

WHY THIS FILE EXISTS
  Lindsay needed to hand the intake logic to an outside vendor (Cloud Nerd) so
  they could rebuild it. The page itself is a poor answer - 127 KB with the
  rules spread through ~1,800 lines of inline JavaScript - and a vendor
  reverse-engineering that gets it subtly wrong in exactly the way the diabetes
  gate was subtly wrong. A spec spells the rules out.

  Committed rather than left in a scratchpad because this repo has been bitten
  three times by a generator that was never committed: build-provider-docs.js,
  build-fhl-docs.js and build-clinical-docs.js all exist because a document set
  was orphaned that way. The first spec was built on 2026-09-14 and shared with
  the vendor the same day; without this file nobody could rebuild it after the
  prototype changed.

WHAT IT DOES NOT DO
  It does not interpret. Every rule is carried through verbatim in a "Condition
  in build" column alongside the plain-language reading, so a mistranslation is
  visible rather than silent. Where no plain-language mapping exists the cell
  says so instead of guessing.

  The plain-language map below is the only hand-written part. When a condition
  changes in the page, the literal column follows automatically and the English
  one falls back to "(see Condition in build)" - which is the signal to add a
  new entry here, not to trust a stale sentence.

VERIFY AFTER GENERATING
  A generated spec nobody exercised is just a prettier copy of the source. Open
  the page in a browser and drive a handful of the rules - the 2026-09-14 build
  was checked against eight of them - before sending it anywhere.
"""

import argparse
import io
import json
import re
import sys

try:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
except ImportError:
    sys.exit('openpyxl is required:  pip install openpyxl')

NAVY = '21275B'
FONT = 'Arial'
WARN_FILL = 'FDF3E0'

# The only hand-written part. See the header.
PLAIN = {
    "!(val('prior')==='now'||val('prior')==='past')": "Patient has taken a GLP-1 now or in the past",
    "male": "Shown to female patients only",
    "!isMinor()": "Patient is under 18",
    "!dmAsk()": "Patient takes insulin OR a sulfonylurea (glipizide, glyburide, glimepiride)",
    "val('hasmeds')!=='yes'": "Patient answered Yes to other prescription medications",
    "val('hasallergy')!=='yes'": "Patient answered Yes to medication allergies",
    "val('prior')!=='now'": "Patient is currently taking a GLP-1",
    "!$('ad1').checked": "Add-on 1 selected (sexual health)",
    "!$('ad2').checked": "Add-on 2 selected (hair)",
    "!$('ad3').checked": "Add-on 3 selected (skin)",
    "!$('ad4').checked": "Add-on 4 selected (anti-ageing)",
    "val('ao-nitrate')!=='stop'": "Nitrate answer is the blocking answer",
    "!$('ab-mtc').checked": "Medullary thyroid carcinoma history ticked",
    "!$('ab-men2').checked": "MEN2 history ticked",
    "!$('ab-allergy').checked": "Prior allergic reaction ticked",
    "!$('g-other').checked": "Goal 'something else' selected",
    "val('expect')!=='review'": "Expectation answer is one that needs provider review",
    "val('consent')!=='yes'": "Consent given",
    "!p": "A program has been selected",
    "!(box && box.checked)": "Generic handler - the matching checkbox is ticked",
}

NOTES = {
    'dmAsk': 'Gates the diabetes co-ordination block AND its required fields. Deliberately narrow.',
    'diabetic': 'WIDER than dmAsk, on purpose. Drives the provider review flag only, never a required field.',
    'isWL': 'Weight Loss selected. Controls whether steps 4 to 7 appear at all.',
    'healthPage': 'Steps 4 to 7. Combined with isWL to skip the health screen for other programs.',
    'isMinor': 'Under 18. KORB treats adults only, so this blocks step 0.',
    'anyAddon': 'At least one add-on ticked.',
    'comorbs': 'Count of comorbidity boxes ticked.',
    'bmi': 'Computed from height and weight. Returns null outside plausible bounds.',
}


def strip_tags(t):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()


def parse(src):
    """Pull the page structure and the rules out of the source."""
    lines = src.split('\n')

    pages = [m.group(1) for m in re.finditer(r'<fieldset class="page(?: hidden)?" id="(p\d+)"', src)]
    recs = []
    for i, pg in enumerate(pages):
        start = src.index('id="%s"' % pg)
        if i + 1 < len(pages):
            end = src.index('id="%s"' % pages[i + 1])
        else:
            end = src.index('id="panel"') if 'id="panel"' in src else len(src)
        chunk = src[start:end]
        comments = re.findall(r'<!--\s*(\d+)\s*·\s*([A-Z0-9 &/\-]+)\s*-->', src[:start])
        step_name = comments[-1][1].strip().title() if comments else ''
        title = re.search(r'<h3 class="pagetitle">(.*?)</h3>', chunk, re.S)
        sub = re.search(r'<p class="pagesub">(.*?)</p>', chunk, re.S)
        recs.append({
            'page': pg, 'step': i, 'stepName': step_name,
            'title': strip_tags(title.group(1)) if title else '',
            'sub': strip_tags(sub.group(1))[:200] if sub else '',
            'questions': [strip_tags(x) for x in re.findall(r'<legend[^>]*>(.*?)</legend>', chunk, re.S)],
            'fields': [strip_tags(x) for x in
                       re.findall(r'<label class="fieldlab"[^>]*>(.*?)</label>', chunk, re.S)],
        })

    visibility, validation, predicates = [], [], []
    step = None
    for n, ln in enumerate(lines, 1):
        # The hyphen in the character class is load-bearing. Without it every
        # hyphenated id - ao-sex, q-preg, ao-hair-preg and five others - fails to
        # match and is dropped from the spec without a word. That happened on the
        # first consolidation of this script: 30 display rules became 22 and the
        # only reason it was caught was diffing against the previous run.
        m = re.search(r"^\s*([a-zA-Z$][\w.$()'\[\]\-]*)\.classList\.toggle\('hidden',\s*(.+?)\);\s*$", ln)
        if m:
            target = m.group(1)
            m2 = re.match(r"\$\('([^']+)'\)$", target)
            visibility.append({'line': n, 'target': m2.group(1) if m2 else target,
                               'hiddenWhen': m.group(2).strip()})
        ms = re.search(r'if\(i===(\d+)\)', ln)
        if ms:
            step = int(ms.group(1))
        mn = re.search(r"need\((.+?),\s*'([^']*)'", ln)
        if mn and step is not None:
            validation.append({'line': n, 'step': step,
                               'condition': mn.group(1).strip(), 'message': mn.group(2)})
        mp = re.match(r'^  function ([a-zA-Z]\w*)\(([^)]*)\)\s*\{(.*)$', ln)
        if mp:
            body = mp.group(3).strip() or (lines[n].strip() if n < len(lines) else '')
            predicates.append({'line': n, 'name': mp.group(1), 'body': body[:200]})

    return recs, visibility, validation, predicates


def build(recs, visibility, validation, predicates, src_name, out_name, url):
    wb = Workbook()
    hdr_fill = PatternFill('solid', fgColor=NAVY)
    warn = PatternFill('solid', fgColor=WARN_FILL)
    thin = Side(style='thin', color='C9CEDB')
    box = Border(left=thin, right=thin, top=thin, bottom=thin)

    def sheet(name, headers, widths):
        ws = wb.create_sheet(name)
        for c, (h, w) in enumerate(zip(headers, widths), 1):
            cell = ws.cell(row=1, column=c, value=h)
            cell.font = Font(name=FONT, bold=True, color='FFFFFF', size=10)
            cell.fill = hdr_fill
            cell.alignment = Alignment(vertical='center', wrap_text=True)
            ws.column_dimensions[get_column_letter(c)].width = w
        ws.row_dimensions[1].height = 28
        ws.freeze_panes = 'A2'
        return ws

    def put(ws, r, vals, fill=None):
        for c, v in enumerate(vals, 1):
            cell = ws.cell(row=r, column=c, value=v)
            cell.font = Font(name=FONT, size=10)
            cell.alignment = Alignment(vertical='top', wrap_text=True)
            cell.border = box
            if fill:
                cell.fill = fill

    ws = wb.active
    ws.title = 'Read me'
    ws.column_dimensions['A'].width = 22
    ws.column_dimensions['B'].width = 108
    rows = [
        ('KORB Appointment Scheduler', 'Intake logic specification for implementation'),
        ('', ''),
        ('What this is', 'Every question in the intake form, the exact condition that reveals each '
                         'dependent block, and the exact condition that makes a field required. '
                         'Generated directly from the working prototype, so it cannot drift from what '
                         'the prototype does.'),
        ('Reference build', url),
        ('', 'Open it alongside this workbook. It is a working end-to-end flow. It is NOT connected to '
             'the website, the scheduler or Tebra, and nothing it collects is stored or sent.'),
        ('Source of truth', 'KORB-Health/korb-patient-tools on GitHub, file ' + src_name +
                            '. If this workbook and the page ever disagree, the page is right.'),
        ('Regenerate with', 'python build-intake-spec.py   (from the repo root)'),
        ('', ''),
        ('How to read it', ''),
        ('Steps', 'The page flow. Steps 4 to 7 are skipped entirely unless the patient selects Weight '
                  'Loss, so a non-Weight-Loss patient sees a much shorter form.'),
        ('Questions', 'One row per question or labelled field, with the step it sits on.'),
        ('Conditional display', 'What reveals each dependent block. "Shown when" is the plain-language '
                                'rule. "Condition in build" is the literal expression, kept so nothing '
                                'is lost in translation.'),
        ('Required fields', 'What the form refuses to continue without, by step.'),
        ('Named conditions', 'Rules referenced by name in the two sheets above, spelled out.'),
        ('', ''),
        ('One rule that matters', 'A block that is hidden must also not be required. The prototype had '
                                  'this wrong once: the diabetes co-ordination block was revealed by a '
                                  'wider condition than intended, so a patient who answered "None of '
                                  'these apply" was blocked until they named a diabetes provider they '
                                  'did not have. Fixed 2026-09-14. Keep display and requirement on the '
                                  'same condition.'),
        ('Not in this workbook', 'Visual design, copy approval, scheduling integration and Tebra field '
                                 'mapping. The consent text in the all-programs build is still marked '
                                 'DRAFT and is not approved for use.'),
    ]
    for r, (a, b) in enumerate(rows, 1):
        ca = ws.cell(row=r, column=1, value=a)
        ca.font = Font(name=FONT, bold=True, size=12 if r == 1 else 10,
                       color=NAVY if r == 1 else '000000')
        ca.alignment = Alignment(vertical='top', wrap_text=True)
        cb = ws.cell(row=r, column=2, value=b)
        cb.font = Font(name=FONT, size=12 if r == 1 else 10)
        cb.alignment = Alignment(vertical='top', wrap_text=True)
        if a == 'One rule that matters':
            ca.fill = warn
            cb.fill = warn

    ws = sheet('Steps', ['Step', 'Page id', 'Name', 'Title shown to patient', 'Sub-heading', 'Items',
                         'Shown when'], [7, 9, 16, 40, 52, 8, 40])
    for r, p in enumerate(recs, 2):
        shown = 'Weight Loss only - skipped for every other program' if 4 <= p['step'] <= 7 else 'Always'
        put(ws, r, [p['step'], p['page'], p['stepName'], p['title'], p['sub'],
                    len(p['questions']) + len(p['fields']), shown],
            fill=warn if shown != 'Always' else None)

    ws = sheet('Questions', ['Step', 'Page id', 'Question or field', 'Kind'], [7, 9, 86, 12])
    r = 2
    for p in recs:
        for q in p['questions']:
            put(ws, r, [p['step'], p['page'], q, 'question'])
            r += 1
        for f in p['fields']:
            put(ws, r, [p['step'], p['page'], f, 'field'])
            r += 1

    ws = sheet('Conditional display',
               ['Element shown', 'Shown when (plain language)', 'Condition in build', 'Line'],
               [26, 62, 58, 7])
    r = 2
    unmapped = 0
    for v in visibility:
        if v['target'] in ('p', 'back') or v['target'].startswith("'p'+"):
            continue
        plain = PLAIN.get(v['hiddenWhen'])
        if plain is None:
            plain = '(see Condition in build)'
            unmapped += 1
        put(ws, r, [v['target'], plain, v['hiddenWhen'], v['line']],
            fill=warn if v['target'] == 'dmBlock' else None)
        r += 1

    ws = sheet('Required fields',
               ['Step', 'What the patient must supply', 'Required when (condition in build)', 'Line'],
               [7, 58, 62, 7])
    for r, v in enumerate(validation, 2):
        put(ws, r, [v['step'], v['message'] or '(unnamed - see build)', v['condition'], v['line']],
            fill=warn if 'dmProv' in v['condition'] else None)

    ws = sheet('Named conditions', ['Name', 'Definition in build', 'What it is for'], [16, 80, 62])
    r = 2
    for p in predicates:
        if p['name'] not in NOTES:
            continue
        put(ws, r, [p['name'] + '()', re.sub(r'\s+', ' ', p['body']).rstrip('}').strip(),
                    NOTES[p['name']]],
            fill=warn if p['name'] in ('dmAsk', 'diabetic') else None)
        r += 1

    wb.save(out_name)
    return unmapped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', default='KORB_Scheduler_Intake_Prototype.html')
    ap.add_argument('--out', default='KORB_Scheduler_Intake_Logic_Spec.xlsx')
    a = ap.parse_args()

    src = io.open(a.src, encoding='utf-8').read()
    recs, vis, val, pred = parse(src)

    # Floors, not a zero check. A zero check would have passed the run that
    # silently lost eight hyphenated ids, because 22 rules is not zero. These
    # numbers are what the 2026-09-14 prototype actually contains; a parser that
    # comes back under them has stopped understanding the page, and a spec that
    # quietly loses rules is worse than no spec. Raise them if the form grows.
    FLOOR = {'pages': 10, 'visibility': 28, 'validation': 45}
    short = []
    if len(recs) < FLOOR['pages']:
        short.append('pages %d < %d' % (len(recs), FLOOR['pages']))
    if len(vis) < FLOOR['visibility']:
        short.append('visibility rules %d < %d' % (len(vis), FLOOR['visibility']))
    if len(val) < FLOOR['validation']:
        short.append('required rules %d < %d' % (len(val), FLOOR['validation']))
    if short:
        sys.exit('REFUSING TO WRITE - ' + '; '.join(short) + '.\n'
                 'Either the page changed shape or this parser stopped matching part of it. '
                 'Check before lowering the floor.')

    url = 'https://korb-health.github.io/korb-patient-tools/' + a.src
    unmapped = build(recs, vis, val, pred, a.src, a.out, url)

    print('  %-34s %d' % ('steps', len(recs)))
    print('  %-34s %d' % ('questions and fields', sum(len(p['questions']) + len(p['fields']) for p in recs)))
    print('  %-34s %d' % ('conditional display rules', len(vis)))
    print('  %-34s %d' % ('required-field rules', len(val)))
    print('\n  wrote ' + a.out + ' from ' + a.src)
    if unmapped:
        print('\n  %d display rule(s) have no plain-language mapping and read '
              '"(see Condition in build)".' % unmapped)
        print('  Add them to PLAIN at the top of this script so the vendor gets English, not JavaScript.')
    print('\n  Now open the page and drive a few of the rules before sending this anywhere.')


if __name__ == '__main__':
    main()
