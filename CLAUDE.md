# korb-patient-tools — working instructions

Repo: `KORB-Health/korb-patient-tools`. Public. GitHub Pages serves from `main`, root.
Owner: Don Stevenson, PA-C, Director of Clinical Operations.

This file is the contract for anyone — person or agent — working in this repo.
Read it before changing anything. Last revised 2026-09-13.

---

## What this repo is

Provider- and patient-facing clinical tools for KORB Health, published as static
pages on GitHub Pages. No build server, no bundler, no framework. Plain HTML that
loads a plain-JS data file at page load.

The whole design rests on one idea: **a clinical fact is written once, in a data
file, and every page that shows it reads it from there.** When that holds, a
pharmacy change propagates everywhere on the next page load. When it breaks, two
tools quietly disagree and nothing errors.

It has already broken once. See "Known failure" below.

---

## RELEASE STATUS — read before sending anyone a link

**Nothing in this repo distinguishes a document that is live from one that is
written, linked, and deliberately not released.** Every file is committed, every
file is served by Pages, and every file looks equally finished. A document being
complete is not the same as it being released, and the repo cannot tell you which
is which. This list can. Keep it current — it is the only record.

This matters most for the Men's and Women's Health work coming next: those
documents will exist, and render, and look exactly as published as the live ones,
while not being released to anybody.

**LIVE to patients** — the Functional Health & Longevity patient set, and nothing
else:

| | |
|---|---|
| Start Here | `Patient_Education/KORB_Start_Here_Guide.pdf` |
| Welcome Letter | `KORB_Welcome_Letter.pdf` (repo root) |
| Schedule Your Lab Appointment | `KORB_Schedule_Your_Lab_Appointment.pdf` (repo root) |
| Injection & Storage Safety | `Patient_Education/KORB_Injection_Storage_Safety_Guide.pdf` |
| When to Contact KORB or the ER | `Patient_Education/KORB_When_to_Contact_KORB_or_ER.pdf` |
| Four program overviews | Foundation, Gateway, Longevity, Peak |
| Five peptide handouts | BPC-157, CJC-1295/Ipamorelin, GHK-Cu, Sermorelin, Tesamorelin |

**NOT released to patients.** All GLP-1 and weight loss, all add-ons, Men's Health,
Women's Health, and `KORB_Patient_Hub.html`. In `Patient_Education/` that covers the
Semaglutide, Tirzepatide, Testosterone, Hormone Therapy, Anti-Aging, Hair Loss,
Sexual Health and Skin Care handouts, and the Weight Loss, Men's Health and Women's
Health program overviews. They sit in the same folder as the live set, under the
same naming convention, and look identical.

**Published to the provider team.** The Functional Health tools and the GLP-1 tools.

**NOT published to the team.** Men's Health, Women's Health, and everything
patient-facing.

**Out for provider feedback** — not yet either way.
`Provider_Reference/KORB_BMI_Protein_Calculator.html` and its `_standalone` twin.

**Retired and deleted.** `KORB_Injection_Tracker.html` was deleted from the repo
root on 2026-09-13. Never released, superseded, and it had sat in the tree looking
exactly as finished as the live set. Do not put it back.

Two live patient documents, the Welcome Letter and Schedule Your Lab Appointment,
sit in the repo root rather than in `Patient_Education/` with the rest of the live
set. Worth reconciling, but not by moving them casually — they are live, so their
URLs are in circulation.

---

## Layout, and the one rule about it

```
/                                  data files + build scripts + root tools
  korb-glp1-data.js                GLP-1 clinical data          (SOURCE OF TRUTH)
  korb-dosing-data.js              FH&L peptide clinical data   (SOURCE OF TRUTH)
  korb-addons-data.js              add-on formulations          (SOURCE OF TRUTH)
  korb-pharmacies.js               shared pharmacy/state layer, footprint + programs
  check-pharmacies.js              cross-file pharmacy check (node check-pharmacies.js)
  korb-rx-block.js                 THE Tebra prescribing block, shared by all four
  provider-doc-render.js           render module, GLP-1 monographs
  fhl-doc-render.js                render module, FH&L references
  dose-audit.js                    cross-pharmacy dose gate, run by both builders
  test-scheduler.js                scheduler flow + validation test (node test-scheduler.js)
  build-*.js                       generators (see below)
  KORB_*.html                      root tools
  Provider_Reference/              provider tool HTML only
    GLP1/                          generated GLP-1 monographs (html + pdf)
  Patient_Education/               patient PDFs only
```

**Data files and build scripts live at the repo root, once.** `build-embed.js`
prints this layout itself when it cannot find its targets. Subfolders hold HTML
and PDFs, nothing else.

Five duplicate `.js` files were removed from `Provider_Reference/` on 2026-09-13
(`korb-glp1-data.js`, `korb-addons-data.js`, `korb-pharmacies.js`,
`build-addon-signoff.js`, `build-embed.js`). Do not put them back.

**Two** of the five had diverged by the time they were deleted, not one. This
paragraph said "four were byte-identical, the fifth had diverged", which was true
when it was written and had stopped being true by the deletion. `build-embed.js` was
the known-broken copy. `korb-addons-data.js` drifted during the patch series: the
root file went to v1.1 and the copy stayed at v1.0, so a folder of duplicates
acquired a second stale file in the two days it was left in place. Nothing was lost
in the deletion — the root file is a superset of the copy, and the only lines unique
to the copy were its own version stamp.

---

## How each page gets its data

Three patterns. Know which one you are touching.

**1. Live** — loads the data file in the browser. Updates on its own.

**Every page below loads `korb-pharmacies.js` FIRST.** Since open items 3 and 4
neither program data file types a pharmacy footprint; both fill theirs from the
shared layer at load. A page that loads the data file without it gets an empty
footprint, which reads as "this pharmacy ships nowhere". Both files throw by name
instead of answering, and `node check-pages.js` fails the build. Order is not
cosmetic — these are plain scripts assigning globals.

| Page | Loads, in this order |
|---|---|
| `KORB_GLP1_Provider_Reference.html` | `korb-pharmacies.js`, `korb-glp1-data.js` |
| `KORB_GLP1_Patient_Message_Builder.html` | `korb-pharmacies.js`, `korb-glp1-data.js` |
| `KORB_GLP1_Pharmacy_Routing.html` | `korb-pharmacies.js`, `korb-glp1-data.js` |
| `KORB_GLP1_Dose_Guide.html` | `korb-pharmacies.js`, `korb-glp1-data.js` |
| `Provider_Reference/GLP1/*.html` (10) | `../../korb-pharmacies.js`, `../../korb-glp1-data.js` |
| `KORB_Provider_Clinical_Reference.html` | `korb-pharmacies.js`, `korb-dosing-data.js` |
| `KORB_Functional_Health_Tracker.html` | `korb-pharmacies.js`, `korb-dosing-data.js` |
| `KORB_Patient_Treatment_Schedule.html` | `korb-pharmacies.js`, `korb-dosing-data.js` |
| `Provider_Reference/KORB_FHL_*.html` (4) | `../korb-pharmacies.js`, `../korb-dosing-data.js` |

**2. Generated-frozen** — data baked in at build time, stamped with a fingerprint.
Does NOT update on its own.

| Page | Regenerate with |
|---|---|
| `Provider_Reference/KORB_GLP1_Provider_Tool.html` | `node build-embed.js` (from repo root) |
| `Provider_Reference/KORB_Optimization_Products.html` | `node build-embed.js` (from repo root) |

**3. Hand-built** — no data file, no generator. Every change is a manual edit.
These are the liability.

`KORB_GLP1_Dose_Guide.html`, `KORB_Lab_Interpretation_Tool.html`,
`KORB_Patient_Hub.html`, `KORB_Testosterone_Tracker.html`,
`KORB_Scheduler_Intake_Prototype.html`,
`Provider_Reference/KORB_TRT_Provider_Tool.html`,
`Provider_Reference/KORB_Womens_Health_Provider_Tool.html`,
`Provider_Reference/KORB_BMI_Protein_Calculator*.html`

**4. Redirect** — no content at all, and must never gain any.

`Provider_Reference/KORB_AddOn_Selector.html` sends the browser to
`KORB_Optimization_Products.html`. It was a second hand-uploaded copy of that tool
until 2026-09-15. See open item 7.

---

## Per-agent or per-program: which document you are allowed to build

**A document about ONE agent is patient-facing. A document for a provider is
per PROGRAM.** Confirmed by Don 2026-09-14. This is a rule about who a document
is for, not a filing convention, so it decides what may be built at all.

What that means today, and the repo already matches it:

| | |
|---|---|
| Per agent, patient-facing | `Patient_Education/KORB_Patient_Ed_{Sermorelin, BPC157, CJC_Ipamorelin, GHK_Cu, Tesamorelin}.pdf` |
| Per program, provider-facing | `Provider_Reference/KORB_FHL_{Foundation, Gateway, Peak_Pathway_A, Peak_Pathway_B}_Provider_Reference.html` |
| Per agent, provider-facing | **none, and none may be added** |

So a provider reference covers every agent its program offers, and an agent
appears in every program that offers it. BPC-157 is in all four documents,
GHK-Cu in three, Sermorelin and CJC in two, Tesamorelin only in Peak B. That
repetition is correct and is not a defect to clean up: a provider prescribing
Gateway needs Gateway complete on its own page, not a cross-reference to
Foundation.

**Do not build a per-agent provider reference.** It is tempting - the data is
keyed by agent, so `DOCS` in `fhl-doc-render.js` would take the rows without
complaint - and it would put a provider on a page that does not correspond to
anything they can prescribe. Prescribing happens by program.

The counselling and monitoring collapse in `sectionClinical()` is the sanctioned
way to deal with the repetition: identical advice prints once per medication
inside a program document. The prescribing blocks stay one per strength. See
the comment in `sectionRx()`.

---

## THE HOUSE STANDARD for a prescribing block and a document's headings

Settled with Don across 2026-09-14 and 2026-09-15, by building it wrong several
times first. It is the standard for every provider document, existing and new -
GLP-1 monographs, FH&L references, the Add-On reference, and Men's and Women's
Health when they are built. Do not re-decide any of it per document.

**The block.** `korb-rx-block.js` renders it and owns every rule below.

- Ten fields in **Tebra entry order**, never alphabetical, never re-ordered to
  suit a layout.
- **One complete block per thing a provider prescribes** - per dose, per
  strength, per pharmacy. Never factor shared fields into a "same for every
  dose" table. Tried twice, rejected twice: a provider transcribing one entry
  must read it in one place.
- **No per-field colour.** Providers know the fields. `FIELD_LEGEND` still
  records the Canva template's colour per field but paints nothing.
- **Zebra across the WHOLE row**, both cells one colour. A tint on the label
  column alone makes every row two-tone and the block reads as two columns.
- **A vertical rule** separates label from value. That is the column divider -
  not a fill.
- **White cell background, explicitly.** The page behind is cream `#FBFAF6`; a
  block that inherits it dissolves into it.
- **Copy buttons float right**, screen only, hidden in print. One `.copybtn`
  rule, in `korb-rx-block.js`. A renderer must never declare its own.
- **Pharmacy accent** on the block header, from `PHARMACY_ACCENT`. See
  Conventions.

**Headings.** One ladder, every document:

| rank | what | size |
|---|---|---|
| `h2` | section, navy filled bar | 19px |
| `.prodhead` | product or agent, teal rule under | 19px |
| `h3` | note, callout, sub-point | 12-13px |
| `h4` | below a product | 13px |

Sized in the SHARED stylesheet in `provider-doc-render.js`, never in a
builder's own `@media screen` block - each builder having its own copy is how
`h4` silently drifted above `h3`.

**A heading must never be outranked by its own contents.** That inversion
happened twice in one day: `h4` above `h3.prod` in the monographs, and
"Prescribing detail" at 15px above product headings at 19px on the Add-On
reference. The second was deleted rather than promoted, because a product name
followed by a navy "Compounded Drug Favorite Entry" header already says what
the section said. **If a rung is redundant, remove it rather than resize it.**

**Copy values are plain ASCII.** No en dash, em dash, curly quote or fraction
glyph in anything a provider pastes into Tebra. `1/2`, not the glyph. Prose
keeps its typography; only copyable values are constrained.

**Verify by reading the rendered page, not the source.** Every defect in this
standard was found by reading computed styles and measuring - font sizes,
background colours, luminance against the page - after the source looked right.

---

## Second machine setup

Work happens on a desktop and a laptop. Clone as a **sibling** of the licensing
repo, never inside it: `korb-licensing` lives at `C:\korb` and is itself a git
repo, so a clone nested in it confuses both. This repo goes at
`C:\korb-patient-tools`.

    node --version                     # check FIRST. v24.19.0 on the desktop as of
                                       # 2026-09-13. Node 18 is the floor.
    git clone https://github.com/KORB-Health/korb-patient-tools.git
    cd korb-patient-tools
    npm install                        # playwright, pinned to 1.63.0
    npx playwright install chromium    # ~310 MB, into AppData, NOT the repo

`npm install` alone is **not enough.** It fetches the Playwright package; the
browser is a separate download, and `npx playwright install chromium` is what gets
it. Skip that second command and `require('playwright')` succeeds while
`chromium.launch()` fails at build time.

**Without Chromium the generators skip the PDFs and carry on.** That is deliberate:
the HTML renders live from the data file and never needed a browser, so gating it on
Playwright meant a machine without Chromium produced nothing at all, not even the
HTML that was already correct. The cost is that a build can look successful, exit 0,
and leave every PDF untouched. Both builders print a WARNING naming the directory
whose PDFs are now stale. Read it. **Exit 0 from these scripts means "the HTML is
current", not "the documents are current".**

The Chromium version is part of the output. Text shaping changes move page breaks in
a printed clinical document, so `playwright` is pinned to an exact version in
`package.json` with no caret and `package-lock.json` is committed. Bump it as a
reviewed decision, and rebuild all 14 documents in the same commit.

---

## The Tebra prescribing block lives in ONE file

`korb-rx-block.js`, added 2026-09-14. It owns the field order, the field tints,
the pharmacy accent colours, the copy button and the clipboard handler. Before
it, the same block existed four times in four shapes and a provider saw a
different thing depending on which document they opened.

Only the four FH&L references are wired to it so far. The GLP-1 monographs, the
Add-On reference and `KORB_Provider_Clinical_Reference.html` still render their
own. Finishing that is open work.

Three rules in it that were each learned by getting them wrong:

- **The field order is Tebra's entry order.** Not alphabetical, not a layout
  choice. A provider reads down the page and fills down the form.
- **One complete block per strength.** Factoring the shared fields out of
  Sermorelin 200/300/400 was tried on 2026-09-14 and reverted the same day: it
  saved pages and broke the block for the one thing it exists for. The
  repetition to collapse is counselling and monitoring, not prescribing.
- **Screen and print lay out differently.** Stacked full width on screen, where
  copying is the job; side by side in print, where a page turn is the expensive
  move. `body` is capped at 8.5in on screen, so a 3440px monitor renders the
  same width as a 1366px laptop - screen real estate never solves this.

`white-space: pre-wrap` on the value cell is not cosmetic. Greenwich stores
formulations with runs of spaces (`KBH   Sermorelin 3mg/mL`) and HTML collapses
them, so the page showed a string that did not match what Greenwich requires.

---

## Generators

Run all of them **from the repo root**.

| Script | Reads | Writes |
|---|---|---|
| `build-provider-docs.js` | `korb-glp1-data.js` | `Provider_Reference/GLP1/*.html` + `.pdf` (10 docs) |
| `build-fhl-docs.js` | `korb-dosing-data.js` | `Provider_Reference/KORB_FHL_*.html` + `.pdf` (4 docs) |
| `build-embed.js` | `korb-glp1-data.js`, `korb-addons-data.js` | embedded blocks in the two frozen tools |
| `build-signoff-sheet.js` | `korb-glp1-data.js` | monograph clinical sign-off sheet |
| `build-addon-signoff.js` | `korb-addons-data.js` | add-on sign-off sheet |
| `build-intake-spec.py` | `KORB_Scheduler_Intake_Prototype.html` | `KORB_Scheduler_Intake_Logic_Spec.xlsx` (vendor spec) |
| `check-pages.js` | every tracked `.html` | nothing - exits 1 if a generated page cannot run |

The list of GLP-1 documents is **not** in `build-provider-docs.js`. It is `DOCS` in
`provider-doc-render.js` (~line 164). Same for FH&L in `fhl-doc-render.js`. Looking
for a document name in the build script will find nothing.

**Never hand-edit a generated document.** Edit the data file and rebuild. A
hand-edit is overwritten by the next build.

**A leftover PDF is not absent, it is wrong — and it is the copy a provider
prints.** A missing document is obvious to whoever goes looking for it. A stale one
is not: it carries a build date, it looks authoritative, and it answers confidently
with last month's data. Whenever a build skips the PDF half, every PDF in that
folder now disagrees with the HTML beside it, and the PDF is the half that gets
printed, emailed and pinned to an audit. Treat a skipped PDF phase as an open defect
until the rebuild runs, not as a tidy-up that can wait.

There is no generator for Men's Health or Women's Health. Those tools are hand-built
and have no data file at all.

---

## Known failure — read this before trusting anything

**`KORB_GLP1_Dose_Guide.html` went stale in production.** Its dose table is
hand-maintained rather than read from `korb-glp1-data.js`. When Greenwich GLP-1 was
retired on 2026-09-11, the data file was updated and the Dose Guide kept offering a
full Greenwich dose ladder. Someone caught it by hand. The warning comment is still
in the file around line 123.

That is the failure this architecture exists to prevent, and it happened anyway,
because that one page opted out.

**`Provider_Reference/build-embed.js` reported success without checking anything.**
Its targets are repo-root-relative but it hardcoded its own directory as the root,
so it found neither file, skipped both, and printed "All embedded data matches its
source" with exit 0. Deleted 2026-09-13. The root copy treats a skip as a failure
and exits 1. Its own comment says why: *"A checker that finds nothing and reports
success is worse than no checker: it is a green light earned by not looking."*

**`build-embed.js --check` reported drift without checking anything.** It read its
target with `fs.readFileSync(path, 'utf8')`, which keeps the CRLFs every Windows
checkout has under `core.autocrlf=true`, then compared that against a freshly built
block assembled with `
` only. The two could never be equal, so `--check` reported
DRIFT on both targets no matter what the data said, and running the writer "fixed"
it by rewriting the file with LF rather than by changing any data. Found and fixed
2026-09-13 by normalising the target to LF before the comparison.

All three are the same shape. The first two **reported fine without looking**; the
third **reported broken without looking**. Which answer fell out is not the point,
and it is not the useful lesson: in all three the check's output did not depend on
the thing it claimed to check. A checker that cries wolf gets ignored exactly as
fast as one that never barks, and either way you are left with no check at all.

Assume that shape is present until a negative test proves otherwise — and a real
negative test has **both halves**. Break the thing it guards and confirm it fails,
then leave the thing it guards alone and confirm it passes. Normalising both sides
of a comparison, for instance, very easily produces a check that always passes. The
CRLF fix was verified that way, with both targets forced to CRLF on disk: a clean
tree reported all-match and exit 0, and a single FarmaKeio label reverted in
`korb-glp1-data.js` reported DRIFT on exactly the file that changed and left the
other alone.

---

## Verification discipline

This repo has real self-checks. Use them, and prove they have teeth.

- `KORB_ROUTING_SELFCHECK()` in the browser console on
  `KORB_GLP1_Pharmacy_Routing.html` — expect 51 states, `problems: []`, pharmacy
  scope `premier / belmar / farmakeio`.
- `node build-embed.js --check` from the repo root — expect "All 2 embedded blobs
  match their source", exit 0.
- `node check-pages.js` — expect "every dependency present and in order", exit 0.
  Every other check in this repo reads DATA. This one asks whether a generated
  page can run at all. On 2026-09-14 the Add-On Clinical Reference shipped to
  Pages missing one script tag: it passed the dose audit, the embed check and
  every parse, and rendered nothing but its own "could not load" guard for a
  day on a public site. Found by Don clicking the link.
  **When a render module gains a dependency, add the tag to EVERY builder and
  extend NEEDS in check-pages.js.** Two of three builders got it that day.
- `KORB_PHARMACIES.selfCheck()` — currently passes, but only validates itself. It
  cannot see `korb-glp1-data.js`. See Open work.

**Before trusting a new assertion, break the thing it guards and confirm it fails.**
On 2026-09-13 a Belmar-ordering assertion was written with its own private copy of
the sort comparator; breaking the real comparator produced zero reported problems.
Extracting one shared `altOrder` used by both renderer and check made the same
negative test report 48 failures. An assertion that has never been seen to fail is
not evidence.

---

## The current architecture problem

`korb-pharmacies.js` was extracted from `korb-glp1-data.js` on 2026-09-11 to become
the single source of truth for which pharmacy ships where. **It is not loaded by
anything, and it has already drifted.** As of 2026-09-13, on Greenwich:

| | `korb-pharmacies.js` | `korb-glp1-data.js` |
|---|---|---|
| status | `peptides-only` | `glp1-retired` |
| shipsTo | 23 states | 46 states |
| hardExcludes | 28 states | 5 states |

**Neither file is wrong.** Greenwich ships peptides to 23 states and ships GLP-1 to
none. Those are two true facts about one pharmacy, and the shared file has a single
flat `shipsTo`, so it can only hold one. It holds the peptide answer with a
`glp1Retired: true` boolean bolted on.

That boolean covers "retired entirely" and nothing else. It will not survive a
pharmacy that ships GLP-1 to 40 states and testosterone to 12.

**Wiring `korb-pharmacies.js` into the GLP-1 tools in its current shape would break
routing.** Do not do it until it is reshaped.

### The required shape

Pharmacy and state facts must be keyed by **pharmacy × program**, not by pharmacy:

```js
greenwich: {
  key: 'greenwich',
  name: 'Greenwich Pharmacy',
  programs: {
    peptides: { status: 'active',       shipsTo: [...23], hardExcludes: [...] },
    glp1:     { status: 'retired',      shipsTo: [],      retiredOn: '2026-09-11' },
    trt:      { status: 'not-offered' },
    womens:   { status: 'not-offered' }
  }
}
```

### The rule that makes it one source of truth

**A pharmacy fact or a state list appears in exactly one file: `korb-pharmacies.js`.
A program data file may reference a pharmacy by key. It may never contain a state
list.** That is mechanically checkable — write the check.

`korb-pharmacies.js` must also gain a cross-file self-check that loads each program
data file and asserts agreement. Its current `selfCheck()` only validates itself,
which is how the drift went unnoticed for two days.

### Do NOT merge everything into one data file

One file per program, plus the shared layer. Reasons:

- `korb-glp1-data.js` is already 299 KB. Adding peptides, add-ons, TRT and women's
  hormones pushes past half a megabyte, downloaded in full by every page.
- Work happens on two computers. One enormous file means every change collides in
  the same place, and merge conflicts in a large JS data file are miserable.
- The actual problem is never "too many files." It is **the same fact in more than
  one file.** Splitting by program with zero shared facts duplicated achieves one
  source of truth. Merging does not.

---

## In-flight work from another session (2026-09-13)

A parallel Cowork session ("KORB provider documents review") rebuilt the document set
and committed to a local branch `clinical-generators` — four commits that **never
reached GitHub** (push blocked by the sandbox, not by GitHub permissions). That branch
does not exist on the remote. Recover it before trusting `main` to be complete.

The work was recovered as `KORB_clinical-generators_source_2026-09-13.zip`
(382,649 bytes), which contains:

- `patches/` — three `git format-patch` files. **Preferred route.** Apply with `git am`.
  Tested clean against a branch off `main` at **`bda5bd1`**.
- `source/` — the same twelve files as whole-file copies in repo-shaped folders.
  Checksum-identical to the branch. **Equivalent to the patches: apply one or the
  other, never both.**
- `README.txt` — every file, what changed in it, and the three rebuild commands.

Only three patches for four commits: the fourth rebuilt the ten GLP-1 PDFs and carries
no source change. `node build-provider-docs.js` reproduces it exactly.

### The twelve files it touches

```
build-clinical-docs.js                    NEW — clinical reference builder
clinical-doc-render.js                    NEW — clinical reference renderer
build-signoff-sheet.js
fhl-doc-render.js
provider-doc-render.js
korb-glp1-data.js
korb-addons-data.js
korb-pharmacies.js                        modified — re-check the drift after applying
KORB_GLP1_Provider_Reference.html
Provider_Reference/KORB_GLP1_Provider_Tool.html
Provider_Reference/korb-glp1-data.js      a duplicate scheduled for deletion
Provider_Reference/korb-pharmacies.js     a duplicate scheduled for deletion
```

`build-clinical-docs.js` and `clinical-doc-render.js` are new infrastructure: the
generator for the clinical references. Once `korb-mens-data.js` and
`korb-womens-data.js` exist, Men's and Women's Health stop being hand-built. Adding one
row each to `DOCS` and `SOURCES` is the whole wiring job.

### Two traps when applying it

**1. The patches were tested against `bda5bd1`, not against current `main`.** Since then
`korb-glp1-data.js` on `main` moved to **v2.17** (the L-carnitine "added vitamin" →
"added agent" fix). The branch carries the **FarmaKeio spelling fix** to the same file.
Both edits are real and both must survive. Expect `git am` to conflict on that file —
that is normal, not a failure. Resolve it by keeping both changes.

**2. Do NOT drag the `source/` copies in over current files.** They are whole-file
snapshots taken before v2.17, so copying `korb-glp1-data.js` from `source/` would
silently revert the L-carnitine fix and roll `meta.version` back to 2.16. If the patch
route fails and `source/` has to be used, every file may be copied wholesale **except**
`korb-glp1-data.js`, which must be merged by hand.

Generated outputs — 17 PDFs and 10 GLP-1 HTML files — were deliberately **not**
included. They rebuild from the data files. Recover source, then rebuild.

### Correction to an earlier assumption

There are **no** `korb-mens-data.js` or `korb-womens-data.js` files in progress. That
session intended to build them and did not start. Nothing was lost; nothing exists.
They are still open item 6.

### Push does not work from Cowork

The `clinical-generators` push failed because the sandbox proxy will not issue a
credential for this repo. It is not a GitHub permissions problem and retrying will not
help. **Push from Claude Code on the desktop, where real git credentials exist.**

Two documents in that set — Men's Health and Women's Health — are still the
10 September ReportLab originals, not generated. Known defects in them: Open Items
sections the style standard forbids, no version or effective date, "KORB Health Group"
in the header instead of the medical PA, and a stale line saying Belmar is not used for
women's testosterone. Do not re-report those; they are already on the list.

---

## Open work, in order

0. ~~Apply `KORB_clinical-generators_source_2026-09-13.zip`.~~ **DONE 2026-09-13.**
   Applied with `git am --3way` as `cc63aad`, `21936c0`, `f59052b`, pushed to `main`.
   The predicted `korb-glp1-data.js` conflict **did not happen.** The patch touches
   only FarmaKeio spellings in that file — 29 of them — and never `meta.version` or
   `pharmacySelection.overrideReasons`, so there was no real overlap with v2.17 to
   resolve. Both edits survive: `meta.version` reads `'2.17'` and `overrideReasons`
   says "added agent". All 14 documents rebuilt, HTML and PDF. The `source/` folder
   was not used.
1. ~~Delete the five duplicate `.js` from `Provider_Reference/`.~~ **DONE
   2026-09-13.** The ordering constraint was satisfied: patches first, then the
   deletion. `Provider_Reference/` now holds HTML and PDFs only, which is what the
   Layout rule says it should. Verified after deleting, not assumed — all ten GLP-1
   monographs were loaded in Chromium and still render from `../../korb-glp1-data.js`
   with 15 to 37 tables each and no JS errors, and `build-embed.js --check` still
   exits 0. The render check was itself negative-tested by hiding the root data file:
   10 FAILED, then 10 ok once restored.

1b. ~~Switch the clinical references to the medical PA.~~ **DONE 2026-09-14.** All
   15 clinical documents now carry KORB Health Medical Texas PA in the byline and in
   the PDF running header. The Add-On Clinical Reference was corrected in `a56f812`;
   the other 14 followed.

   **It was four lines, not the two this item used to claim.** The two bylines were
   `provider-doc-render.js:598` and `fhl-doc-render.js:490`, but the PDF running
   header is a SEPARATE string living in the builders, at
   `build-provider-docs.js:224` and `build-fhl-docs.js:253`. Fixing only the
   documented two would have left every printed page of all 14 PDFs headed by the
   MSO while the HTML said the PA — the same HTML/PDF split as the FarmaKeio
   spelling, in a place where it is a compliance statement rather than a typo.
   **When an entity or attribution string changes, grep the builders as well as the
   render modules.** The live page and the print header do not share it.

   The disclaimer paragraphs at `provider-doc-render.js:625` and
   `fhl-doc-render.js:516` still say KORB Health Group LLC, correctly — that
   sentence is the MSO making a statement about itself.

   Verified in the rendered output, not in the source. All 14 PDFs were re-extracted
   with pdftotext: every one carries the PA, and every remaining "KORB Health Group"
   is either "Bill to KORB Health Group and ship to the patient" or the LLC
   disclaimer. Negative-tested against the committed pre-fix PDF, which reports 0
   PA occurrences and a Group running header, versus 19 and a PA header after.

   The warning below still stands and is why this was done as four lines rather than
   a find-and-replace: do NOT mass-replace "KORB Health Group" across the data files.
   All 100 occurrences in `korb-glp1-data.js` are pharmacy instruction text where the
   MSO genuinely is the contracting entity. Replacing those would send the wrong
   entity to three pharmacies.

   Left alone deliberately: `build-provider-docs.js:104` and `build-fhl-docs.js:143`
   carry `alt="KORB Health Group"` on the logo image in the on-screen masthead. That
   is alt text describing the brand lockup, not an attribution line, and it is hidden
   in print. Change it only if the brand mark itself changes.

2. ~~Reshape `korb-pharmacies.js` to program-keyed, add the cross-file self-check.~~
   **DONE 2026-09-15**, `946a331` and `a9f61fd`.
   A pharmacy carries a **licensure footprint**, one fact that does not vary by
   program, plus a `programs` block:
   `footprint` / `footprintExcludes` / `programs.<x>.status` (active, retired,
   not-offered) / `programs.<x>.excludes` for a real per-program narrowing.
   **Effective coverage is computed, never stored** — `statesFor(pharmacy,
   program)`. Nothing can drift from the footprint because nothing is copied
   from it.
   This is NOT the shape the section above specifies. A full state list per
   program would write Belmar's 51 states four times inside the one file whose
   purpose is that a fact appears once. Don chose the footprint model 2026-09-15.
   All 12 active pharmacy × program lists were verified to reproduce the old flat
   data exactly before the file was written.
   **Greenwich's 23 states are a licensure change, not a pause.** It ended its
   central-fill arrangements with affiliated pharmacies and now dispenses only
   where it is itself licensed. A first attempt modelled the 23 as a pause
   narrowing a 46-state footprint, which would have implied the coverage returns
   on its own when what is pending is a set of licence applications. The 46 was
   reach through affiliates and was never Greenwich's licence.
   `crossCheck()` compares this file against the program files that still carry
   their own copy, which `selfCheck()` structurally cannot do. Run it with
   `node check-pharmacies.js`; it exits 1 on anything unexpected.
3. ~~Wire GLP-1 onto it.~~ **DONE 2026-09-15**, `c577fa3`.
   `korb-glp1-data.js` no longer TYPES pharmacy footprints. `hydrate()` fills
   `shipsTo`, `hardExcludes` and `preferredStates` from `korb-pharmacies.js` at
   load, so every consumer still reads `ph.shipsTo` unchanged while the fact is
   written once. 245 state entries across 12 lists removed from the GLP-1 file.
   **korb-pharmacies.js must load BEFORE korb-glp1-data.js.** Routing throws
   naming the missing script, and the builder exits 1, rather than answering from
   empty lists — a pharmacy that "ships nowhere and excludes nowhere" would
   misroute silently.
   Verified against a captured baseline, not by reasoning: all 51 jurisdictions
   against all 7 pharmacies, 357 checks comparing status AND the full message
   string, **zero differences**. Tally unchanged at FarmaKeio 40, Premier 10,
   Belmar 1 (CA), California still single-source, Greenwich blocked in all 51.
   Browser-verified too, because script-tag order is what breaks silently:
   5 pages loaded in Chromium, all hydrate, `KORB_ROUTING_SELFCHECK()` returns
   51 states and `problems: []`.
   `crossCheck()` now reports these lists as DERIVED rather than as agreement,
   because after this change comparing the two files compares a value with itself.
4. ~~Wire FH&L onto it~~ **DONE 2026-09-15**. `korb-dosing-data.js` v2.12.
   `states.premierRouting` is `[]` in source and filled by `hydrate()` from
   `korb-pharmacies.js` at load. **korb-pharmacies.js must load BEFORE
   korb-dosing-data.js**; `requireHydrated()` throws naming the missing script,
   the builder exits 1, and the live pages refuse to render rather than show a
   routing table built from an empty footprint.

   **What moved and what did not, because mixing the two is what caused the
   drift.** Only `premierRouting` moved — "where Premier is licensed to ship
   peptides" is a pharmacy fact. `unavailable`, `unavailableNoShip`,
   `unavailableNoPharmacy` and `unavailableLabWorkflow` all STAY in the FH&L
   file. Those are program decisions about where KORB offers the service, and
   only 8 of the 18 closed states are closed for a pharmacy reason at all.

   **Mississippi is the case that made it worth doing.** The typed list held 37
   states, the shared footprint holds 38, and the single difference was MS —
   removed from `premierRouting` on 2026-08-24 when MS left the FH&L offering.
   Premier is licensed to ship peptides to MS and always was: a program decision
   had been written into a pharmacy list. MS is back in the footprint and still
   blocked through `unavailableNoShip`.

   Verified by measuring, not reasoning. `premierRouting` minus `unavailable` is
   the same 31 states before and after. All 51 states were driven through the
   selector on `KORB_Provider_Clinical_Reference.html` against a baseline
   worktree and the rendered text is identical in **all 51**; MS still shows the
   Do Not Ship banner. The four generated FH&L references differ from baseline
   by exactly two words each, both the version stamp. Negative-tested: loading
   the data file alone leaves `hydrated` false and `requireHydrated()` throws.
   `check-pages.js` gained the data-file dependency and **failed on all four
   generated pages** before the rebuild, which is the only reason to believe it.
**NEXT →**
5. **Retire the hand-built tables.** `KORB_GLP1_Dose_Guide.html` ~~first~~ **DONE
   2026-09-14**, `5c1c5e4`. Its table is built from `korb-glp1-data.js` at load;
   `korb-pharmacies.js` and `korb-glp1-data.js` must both load before the inline
   script, and it throws if they do not.
   Proved by the failure it was written for: marking a product retired removes it
   from the page entirely, dropdown included, with no edit. That is what did not
   happen when Greenwich was retired on 2026-09-11.
   Verified against a rendered baseline — all 48 medication/pharmacy/dose
   combinations captured in Chromium before and after, **48 of 48 identical**
   apart from the concentration line, which now comes from `formulation` rather
   than a typed string.
   Two facts moved into `korb-glp1-data.js` v2.18 to make it derivable:
   `additive` on the seven compounded injectables, and per-dose `conc` on
   belmar_sema, which is supplied at two concentrations by dose band.
   **Still hand-built and still a liability:** `KORB_Lab_Interpretation_Tool.html`,
   `KORB_Patient_Hub.html`, `KORB_Testosterone_Tracker.html`,
   `KORB_Scheduler_Intake_Prototype.html`, `Provider_Reference/KORB_TRT_Provider_Tool.html`,
   `Provider_Reference/KORB_Womens_Health_Provider_Tool.html`,
   `Provider_Reference/KORB_BMI_Protein_Calculator*.html`. The TRT and Women's
   tools need item 6's data files before they can be wired at all.
   ~~`L-Carnatine` is misspelled 7 times and was not fixed.~~ **Corrected
   2026-09-14**, `7ce82af`, data file v2.19. **The exact-match constraint on a
   `drugFormulation` string is GREENWICH ONLY** — Greenwich matches on the
   compounded name and will flag a difference, Belmar does not. Worth knowing
   before the next spelling or formatting question: check which pharmacy before
   assuming a string is load-bearing.
6. **Create `korb-trt-data.js` and `korb-womens-data.js`.** New construction, not
   cleanup. Should not block 2–5.
7. ~~Reconcile `KORB_AddOn_Selector.html` / `KORB_Optimization_Products.html`.~~
   **DONE 2026-09-15.** They were not merely "the same file under two names" — they
   had already diverged. `KORB_Optimization_Products.html` is in `build-embed.js`
   TARGETS; `KORB_AddOn_Selector.html` was not, and its whole git history is
   `Add files via upload`, so it arrived through the GitHub web UI and no generator
   ever knew it existed. Every rebuild refreshed one copy and left the other alone.
   It was carrying the **pre-2026-09-14 en dashes** in its Tebra fields, which is
   exactly the character loss the ASCII pass was done to prevent. A provider using
   that URL was copying superseded strings into Tebra.

   `KORB_Optimization_Products.html` is canonical: it is the generated one, it is
   the name `korb-addons-data.js` cites, and both files already carried that title.
   The Selector is now a redirect to it, **kept rather than deleted so an existing
   intranet link or bookmark does not 404**. Browser-verified: it lands on the
   destination, which renders with no errors.

   **`build-embed.js` gained an orphan scan**, because TARGETS is a list of files
   the script maintains and said nothing about files that merely CARRY a generated
   block. It now scans every tracked page for a `BEGIN GENERATED` marker and exits 1
   on any that is not a target. Negative-tested: restoring the old duplicate makes it
   report that exact file and exit 1. Before the scan, `--check` printed "All 2
   embedded blobs match their source" every time — true of the two it looked at, and
   a green light earned by not looking at the third.
8. ~~Fix the stale comment in `build-provider-docs.js`.~~ **DONE 2026-09-15.**
   It said "eleven documents"; the list has held ten since Greenwich tirzepatide was
   retired on 2026-09-11. It was in four places across two files, not one.
   Fixed by **removing the count rather than correcting it** — a number written
   beside a list goes stale the moment the list changes, and this one sent a reader
   hunting for a document that no longer exists. `DOCS` in `provider-doc-render.js`
   is the list; count the array. The one surviving "eleven" is history, about the
   original set generated on 2026-08-09, and now says so.
9b. ~~Wire the cross-pharmacy dose audit into the builders.~~ **DONE 2026-09-15**,
   `b265ee7`. Lives in `dose-audit.js` and runs as a gate in both
   `build-fhl-docs.js` and `build-provider-docs.js`. Both **refuse to build and
   exit 1**, because a warning printed above a successful build is a warning
   nobody reads.
   A dose does not change with the pharmacy, the concentration or the vial size,
   so every place an entry states its dose must state the same one. Concentration
   and formulation strings are excluded on purpose — "Sermorelin 3mg/mL",
   "Semaglutide/B-12 3mg/0.5mg per mL" are properties of the vial and
   legitimately differ. Including them is what makes a check cry wolf until
   somebody turns it off.
   The two files need different checks. `korb-dosing-data.js` has no numeric dose
   field, so entries are checked for internal agreement. `korb-glp1-data.js`
   carries a numeric `mg` on every dose, so each stated dose is checked against
   that number instead — a stronger test, across 74 doses in 16 products that had
   never been audited at all.
   Negative-tested against real history rather than a hypothetical: at v2.7 it
   reports 10 problems and catches both known errors, at v2.8 it reports only the
   BPC-157 one that was still outstanding, at v2.9 it is silent. The gate itself
   was tested by planting the v2.7 label back in — the builder exited 1 and named
   the field.
9. ~~`build-signoff-sheet.js` cannot run on either machine.~~ **DONE 2026-09-15.**
   It wrote to `/mnt/user-data/outputs/monograph-signoff.html`, a Cowork sandbox
   path, and exited ENOENT — the third sandbox path committed as if it were a real
   one, after `loadChromium()` in both document builders. It now writes to
   `build/monograph-signoff.html`, which `.gitignore` excludes: a sign-off sheet is
   a working document a reviewer reads, not a published artefact, and this repo is
   public. Pass a path to send it elsewhere. Verified by running it.
   `grep -rn "/mnt/\|/home/claude" --include=*.js --include=*.py .` now returns
   only the comment explaining this. Run that grep before trusting any script here
   that has not been run on this machine.
10. ~~Add-On Clinical Reference — generator works, output needs review.~~ **DONE
   2026-09-14**, `a56f812`. Don reviewed the generated document, which was the gate
   this item was waiting on, and the reviewed version replaced the in-use PDF.
   Two standing rules came out of that review and are now comments in
   `clinical-doc-render.js`: strength/quantity/size live in the custom compound name
   and are never repeated in pharmacy notes; and no price or charge code appears in
   a clinical reference (they stay in the data file because `build-embed.js:179`
   feeds the provider tool from them). Both rules apply to every product added from
   here, not just the add-ons.
   Four records — both PT-141 and both Belmar NAD+ — had no sig, quantity, unit or
   pharmacy notes at all and could not be prescribed from. Now filled.
   **One thing left open on purpose:** `reasonForCompounding` is null on both PT-141
   records. The boilerplate used elsewhere ("no FDA-approved or commercially
   available equivalent") would be FALSE, because bremelanotide is FDA-approved as
   Vyleesi. Do not fill it with the boilerplate. Needs the real rationale from Don.
10b. ~~Scheduler intake: a hidden block must never be required.~~ **DONE, and now
   structural.** The diabetes instance was fixed 2026-09-14: the block was gated
   on the wide `diabetic()` and its validation was not, so a patient who ticked
   Type 2 and then answered "None of these apply" was held on a block they could
   not see. `diabetic()` was NOT narrowed — it drives the provider review flag,
   and narrowing it would have silently dropped a Type 2 patient on metformin
   from that flag. A narrow `dmAsk()` was added beside it. **When a predicate has
   several consumers, add a narrow one rather than narrowing the shared one.**
   As of 2026-09-15 the rule is enforced instead of remembered: `need()` asks
   `onScreen()` and drops any requirement whose field is inside a hidden
   container. The sex- and age-gated screening questions depend on this — there
   is no second `isMale()` or `age()` test in the validation, so there is nothing
   for the display logic to disagree with.
   Two defects found while closing it, both from the FH&L build on 2026-09-14:
   **Continue did nothing on all six FH&L pages.** The handler tested
   `cur >= LAST`. LAST is 11, the outcome page's id, and the FH&L pages are 12 to
   17 while sitting in the MIDDLE of the flow. The branch was a dead end.
   **LAST is an id, not a position. Never compare it with >= or <=.**
   **Nothing validated the FH&L pages.** Rules stopped at page 10 while those six
   pages carried 22 required marks, so every asterisk on them was a lie.
   Covered now by `test-scheduler.js`, 22 checks, which drives the real flow
   rather than the verdict engine. The tests written alongside the original FH&L
   build passed 19 of 19 and never clicked Continue once.
11. **Scheduler intake — Men's Health and Women's Health question sets.**
   `KORB_Scheduler_Intake_AllPrograms.html` now carries Weight Loss and Functional
   Health & Longevity. The other two programs select at step 3 and then bring no
   questions.

   **There is NO approved Men's or Women's Health questionnaire to work from.**
   Confirmed by Don 2026-09-15. This item used to say "read the approved Tebra
   questionnaire first", which was true of FH&L and Weight Loss and is not true
   here - nothing exists to read. So this is clinical authoring, not
   transcription: the questions themselves have to be decided before any
   conditional logic can be written, and that decision is Don's. Do not invent a
   men's or women's health screen from the other programs' shape; the
   contraindications are different.
   **`KORB_Scheduler_Intake_Prototype.html` stays frozen** until Lindsay has
   reviewed it. She has that exact URL. New work goes in AllPrograms.
   ~~Two things in AllPrograms need Don: the consent text is draft, and the FH&L
   decline copy is new wording about the $99.~~ **BOTH RESOLVED 2026-09-15.**
   KORB's approved peptide and telehealth consent replaced the drafts
   (`da56c60`, `8015fd3`, `7750590`). The $99 copy was confirmed correct by Don
   on 2026-09-15 and matches the policy recorded under Conventions.
   House idiom, learned the hard way on 2026-09-14: questions are tappable `.opt`
   cards carrying a radio or a checkbox, and a `<select>` appears only as a
   follow-up inside a revealed `.subq`. A first build asked everything as a bare
   dropdown, passed every logic test, and looked nothing like the rest of the form
   because it was never rendered. Open the pages in Chromium and look before
   reporting done.

---

## Sibling repo — the proven pattern

`KORB-Health/korb-licensing` is **private**, ~153 commits, and holds the provider
licensing register (10 providers, 254 credentials, 51 jurisdictions). Provider data
only — no patient data, no DEA numbers.

It is the working template for this repo and the owner already knows it:

```
ARCHITECTURE.md                       what this doc is to korb-patient-tools
00_RESTORE_THE_SYSTEM.md              rebuild-from-scratch instructions
REPO_GUIDE                            orientation
.claude/skills/<name>/                packaged repeatable workflows
.project_docs_synced                  doc sync marker
```

Mirror that structure here. In particular `.claude/skills/` — a working skill already
exists over there (`pharmacy-credentialing-packet`), so the pattern is proven, not
theoretical.

---

## Repo visibility — unresolved, owner: Nick (VP Finance / compliance)

This repo is **public**, and it contains program pricing, charge codes, partner
pharmacy terms, internal changelogs and clinical sign-off records. Anyone can read
`korb-glp1-data.js` in full.

Private repos are **not** the blocker — `korb-licensing` is private today at no extra
cost. The blocker is specific: **GitHub Pages on the Free plan publishes only from
public repositories**, and this repo serves Pages. `korb-licensing` does not, which is
why it can be private for free.

- **GitHub Team** ($4/user/month) allows Pages from a **private** repo. The source
  would be hidden; the published pages stay reachable on the internet by URL.
- **Private Pages sites** — access restricted to org members — require **Enterprise
  Cloud** ($21/user/month).

Team is the cheap fix for source exposure and does not require Enterprise. Raise with
Nick. No PHI is in this repo and none may be added.

---

## Conventions

- No PHI in this repo, ever. No patient names, dates tied to a person, or MRNs.
- Brand: Navy `#21275B`, Teal `#00B2C3`, Cream `#ECE9D1`, Gold `#FBB040`.
  Montserrat, with a real fallback stack.
- **Pharmacy colours are fixed and identical in every document, tool and page.**
  Don, 2026-09-15. A provider recognises a pharmacy by its colour before reading
  the name, so a page must never re-theme one to suit itself.

  | Pharmacy | Colour | Hex |
  |---|---|---|
  | FarmaKeio | green | `#2E7D32` |
  | Premier | blue | `#1565C0` |
  | Belmar | purple | `#6A1B9A` |
  | Greenwich | teal | `#00838F` |

  They live in `PHARMACY_ACCENT` in `korb-rx-block.js` and nowhere else. Add a
  new pharmacy there once. Greenwich and FarmaKeio were swapped in that pass -
  Greenwich used to hold the green - so all four stay distinct and only one
  changed meaning.
- **No per-field colour coding in a prescribing block.** Removed 2026-09-15.
  Providers know which Tebra field is which, so eleven tinted rows were clutter
  rather than a key. `FIELD_LEGEND` still records the Canva template's colour per
  field but paints nothing. Rows are separated by a rule, not by striping.
- Tebra caps: portal message 1000 characters, `ptInstructions` 140,
  `pharmacyNotes` 170.
- Vial discard language follows USP <797>: a multi-dose container is 28 days from
  first entry **or** the assigned BUD, whichever is shorter. Never tell a patient to
  disregard a printed date.
- Data file changes bump `meta.version` and `meta.lastUpdated` and add a changelog
  entry saying plainly whether clinical content changed.
- **Do not commit a PDF rebuild that changed nothing.** Running a document builder
  always rewrites all its PDFs, and with no data change the new file is the same
  byte length and differs only in the embedded `CreationDate`/`ModDate`/`/ID`.
  Committing that is megabytes of churn that reads in `git log` as if documents
  changed. Check before staging:
  `git diff --stat -- "*.pdf"`, and if only PDFs moved, `git checkout -- <path>`.

### The $99 baseline lab fee — the whole policy

Don, 2026-09-15. The patient-facing copy in the scheduler is correct and
deliberately says less than this. Write it down here so ops answers a refund
request the same way twice.

1. **The first FH&L visit is an evaluation.** Nothing is ordered and nothing is
   charged before the provider has been through the answers with the patient.
2. **A patient the provider disqualifies is never charged and never has labs
   ordered.** They do not get the option to pay for labs they cannot use.
3. **A patient who qualifies is charged $99 and the labs are ordered at that
   visit.**
4. **Once the blood has been drawn the $99 is non-refundable.** Not
   discretionary - the laboratory has been paid.
5. **Ordered but NOT yet drawn:** if the order can still be cancelled, a refund
   is acceptable.
6. **Case by case beyond that, and deliberately not advertised.** Refunds happen
   occasionally and must not become routine or appear in patient-facing copy.
7. **KORB's own error is the exception.** Caused by a provider, by ops or by
   KORB, it is refunded, and that is not a case-by-case judgement.

**Point 5 and point 6 must never reach patient copy.** The scheduler says
nothing is charged before the evaluation, then $99 if you go ahead, then
non-refundable once drawn - and stops. Stating a cancellation window invites
the request; that is why it is absent rather than forgotten.

## Two-computer workflow

Work happens on a desktop and a laptop.

- `git pull` before starting. Every time, on both machines.
- `git push` before stopping. Every time, on both machines.
- Never leave a machine with uncommitted work; the other machine cannot see it.
- If a pull conflicts in a data file, stop and resolve deliberately. Do not take
  "theirs" or "ours" wholesale — a data file conflict is two real clinical edits.
