# korb-patient-tools — working instructions

Repo: `KORB-Health/korb-patient-tools`. Public. GitHub Pages serves from `main`, root.
Owner: Don Stevenson, PA-C, Director of Clinical Operations.

This file is the contract for anyone — person or agent — working in this repo.
Read it before changing anything. Last revised 2026-09-13.

---

## TRT IS MEN'S HEALTH. ONE PROGRAM, NOT TWO.

Confirmed by Don 2026-09-17, and the repo had it wrong. The provider side said
TRT and the patient side said Men's Health, for the same program, and a stale
hand-made `KORB_Mens_Health_Clinical_Reference.pdf` sat alongside the generated
TRT reference that had already superseded it. Anyone reading the tree would have
concluded Men's Health was an unbuilt fifth program and started building it.

**Men's Health is the PROGRAM. Testosterone replacement is the therapy inside
it**, exactly as hormone therapy sits inside Women's Health. That leaves room for
the sexual health, hair loss and skin care add-ons already sold under Men's
Health.

Renamed 2026-09-17: `korb-trt-data.js` to `korb-mens-data.js`, the global
`KORB_TRT` to `KORB_MENS`, `KORB_TRT_Clinical_Reference` to
`KORB_Mens_Health_Clinical_Reference`, `KORB_TRT_Provider_Tool.html` to
`KORB_Mens_Health_Provider_Tool.html`, and the document id `trt` to `mens`. The
superseded ReportLab PDF of 2026-09-10 was deleted; the generated reference now
carries its name.

**The sign-off survived the rename and was NOT re-attested.** Its key moved from
`trt:trt` to `mens:mens` and the fingerprint is unchanged, because a fingerprint
is taken over the rendered prescribing blocks, which carry drug names and Tebra
fields and no document title. Verified rather than assumed: all 18 blocks were
captured before the rename and compared after, and all 18 are byte-identical
with the section list unchanged. Don's review of 2026-09-16 stands.

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

---

### EVERYTHING PATIENT-FACING IS RELEASED. Don, 2026-09-19.

**This section said the opposite until today, and it was badly out of date.** It
listed all GLP-1 and weight loss, all add-ons, Men's Health, Women's Health and
the Patient Hub as NOT released. Don's ruling of 2026-09-19: **every program is
live and every patient document is out there.** He was explicit that this had
been true for a while and that the record simply never caught up.

That makes it the fourth stale record found in two days, after the bridge-PDF
instruction, the URL inventory count and the consent item. **This one was the most
dangerous of the four**, because it is the record you are told to read before
sending anyone a link, and it was telling you not to send things that were
already sent.

**LIVE TO PATIENTS — all of it.** The four FH&L program overviews and the five
peptide handouts. The GLP-1 and weight loss set: Semaglutide, Tirzepatide and the
Weight Loss Program Overview. Men's Health: the program overview and the
Testosterone handout. Women's Health: the program overview and the Hormone
Therapy handout. The add-on handouts: Anti-Aging, Hair Loss, Sexual Health, Skin
Care. Start Here, Injection & Storage Safety, When to Contact KORB or the ER,
Schedule Your Lab Appointment, and both Welcome Letters.

**Don is re-reading all of them on 2026-09-19** before the provider rollout. If
any single document on that list turns out not to be ready, it is that document
that comes off the list - not the list that goes back to being wrong.

### `KORB_Patient_Hub.html` — approved for direct use, 2026-09-18

**Lindsay approved using it with patients now**, ahead of the website. The web
developer has it and is aware of it, but Lindsay confirmed it is not a priority
against their other projects: **weeks, months, or next year, depending on budget.**
So the hub is not a thing waiting to be published - it is the thing being used,
and the website replaces it whenever the website happens.

The reason it matters enough to push without the website: **what patients
currently find in the Circle community is not accurate.** The hub is.

### Provider rollout — Monday 2026-09-22

Don pushes the hub to providers on Monday, with:

- a text-message template providers can send a patient, after asking, carrying a
  clickable link
- the same links to Operations, for the core emails that go out when a patient
  asks about a programme

**So from Monday the links leave this repo's control**, into text messages and
marketing email. That is the thing to remember before renaming or moving any
patient-facing file: a URL in a sent text cannot be corrected. See the note at
the end of this section about the two root-level documents.

---

**`KORB_Welcome_Letter.pdf` is kept on purpose, for patients who already hold that
URL.** It is the designed PDF with only its link annotations rewritten, by
`tools/retarget-pdf-links.py`, so what a patient sees is byte-for-byte the page that was
designed and every button now opens the live `.html`.

**Do not regenerate it from `korb-patient-ed-data.js`.** That was tried on 2026-09-17,
it produced a different document wearing the same name, and the generator was deleted.
To change where it points, rerun the retarget tool. To change what it says, the design
lives outside this repo.

That tool also fixes any old KORB PDF still sitting in Drive or Dropbox: it swaps the
retired `pacstevenson.github.io` base and rewrites `.pdf` targets in one pass, and it
refuses rather than guesses when no matching `.html` exists.

**Every other PDF is retired.** All 43 were retired on 2026-09-17, patient and
provider. Every document is a shell that reads its data file in the browser, so a
pharmacy, state or dosing change reaches the reader on their next page load. The
stored PDF was a second copy that drifted, and it is how 14 of the 16 patient
documents kept naming KORB Health Group, the MSO, on clinical instruction long after
the HTML byline had been corrected to KORB Health Medical Texas PA.

**If anyone needs a file, press Print.** Every page has the button and it builds a PDF
from current data at that moment, which is what the stored file was only pretending to
be. `KORB_GLP1_Data_Review.pdf` is the one PDF left in the repo; it has no HTML twin.

The "PDF version" link is gone from the pages and from all four builders that write
it. Do not reintroduce it.

**The old LIVE list lived here** and named only the Functional Health &
Longevity set. It is superseded by Don's ruling of 2026-09-19 at the top of this
section: everything patient-facing is released.

**Two warnings that used to sit here are worth keeping, because they were right
about the mechanism even though they were wrong about the status.**

The first: the hub links the Weight Loss, Men's Health and Women's Health program
overviews and the four add-on handouts, the add-ons from all four program
sections, so nineteen links in total. That used to be a reason NOT to publish the
hub. It is now simply a description of what a patient reaches from it, and it is
the reason the hub is worth pushing at all - **what a patient currently finds in
the Circle community is not accurate, and the hub is.**

The second: every patient document sits in the same folder under the same naming
convention and looks identical whether it is released or not. That is still true,
and it is still why this list has to be maintained by hand rather than inferred
from the tree. **A document being complete has never been the same as it being
released.** Today they happen to coincide. They will not next time.

**Published to the provider team.** The Functional Health tools, the GLP-1 tools,
and as of 2026-09-17 the Women's Health Clinical Reference, posted to the intranet
for providers.

**That intranet link must be the GitHub Pages URL**, not an uploaded copy of the
file. Every generated document here is a shell whose entire body is `<p>Loading…</p>`
plus script tags; it builds itself from the data files at page load, which is what
keeps it current. Save one off and upload it as a file and its relative paths break,
and a provider gets the red "Could not load korb-womens-data.js" guard instead of a
document. The guard is deliberate - it refuses rather than rendering a plausible
half-empty page - but it is still a broken link. The URL is
`https://korb-health.github.io/korb-patient-tools/Provider_Reference/KORB_Womens_Health_Clinical_Reference.html`.
`KORB_BMI_Protein_Calculator_standalone.html` is the other pattern, a single file
with zero script tags, and it buys portability by giving up the live update.

**Men's Health (TRT).** The clinical reference and the provider tool are built,
signed and ready to post; as of 2026-09-17 they are NOT yet on the intranet.
URLs are
`.../Provider_Reference/KORB_Mens_Health_Clinical_Reference.html` and
`.../Provider_Reference/KORB_Mens_Health_Provider_Tool.html`.
This program was missing from this section entirely until 2026-09-17, in either
direction, which is how it sat outside the only record of what is live.

**NOT published to the team.** Everything patient-facing
including the Women's Health patient handout.

**Out for provider feedback** — not yet either way.
`Provider_Reference/KORB_BMI_Protein_Calculator.html` and its `_standalone` twin.

**Retired 2026-09-17.** `Provider_Reference/KORB_GLP1_Provider_Tool.html` is now a
redirect to `KORB_GLP1_Provider_Reference.html`. It was NOT deleted, because the URL
was on the intranet that day.

Two reasons, and the first decides it. **It duplicated the monographs exactly**:
every Tebra favorite name it could produce was extracted and compared against the
ten generated GLP-1 monographs - 150 in the tool, 150 in the monographs, **zero
unique to either**. Every prescription it offered already sat in a signed document.

**And it told providers those monographs were unreviewed.** It carried a hardcoded
amber banner reading "Monograph not yet clinically reviewed" and quoting
`signoffStatus.state = "unsigned"` as static text. It never called
`signoffStatus()`. All three molecules have been `current` since 2026-09-06, so the
banner had contradicted the register for eleven days.

That is the Known-failure shape in a third form: not a check that reported fine
without looking, nor one that reported broken without looking, but **a frozen QUOTE
of a check's output, still on screen long after the thing it quoted had changed.**
A cached answer is not an answer. Worth looking for elsewhere: any place a document
states the result of a check rather than running it.

Its data was never stale - `build-embed.js` kept the blob matching
`korb-glp1-data.js`. It was redundant, frozen and wrong about the sign-off.
**Being current is not the same as being worth keeping.**

**Retired and deleted.** `KORB_Injection_Tracker.html` was deleted from the repo
root on 2026-09-13. Never released, superseded, and it had sat in the tree looking
exactly as finished as the live set. Do not put it back.

Two live patient documents, the Welcome Letter and Schedule Your Lab Appointment,
sit in the repo root rather than in `Patient_Education/` with the rest of the live
set. Worth reconciling, but not by moving them casually — they are live, so their
URLs are in circulation.

---
## THE PUBLIC PAGES CARRY NOTHING PATIENT-SPECIFIC

Confirmed by Don 2026-09-19, and it governs everything served from this repo.

**GitHub Pages is public and unauthenticated.** Every file here is reachable by
anyone with the URL and by anything that crawls it. There is no login, there
never will be, and the release record at the top of this file decides what is
SENT - not what is reachable.

So: **general patient education only.** Nothing patient-specific, ever. No PHI,
no names, no identifiers, no chart content, no individual dosing, and **no
pricing**. A page here explains what a programme is and how to take a medicine
safely. It never says anything about one person, and it never quotes a number
somebody pays.

**Provider-facing clinical content is a separate question and is already
handled**: the monographs and references carry Tebra fields and pharmacy detail
because they are linked from the intranet, not sent to patients. That is a
choice about audience, not about secrecy, and it does not license putting
anything patient-specific on any page here.

**This is the rule to check a new block against before writing it**, not after.
From Monday 2026-09-22 these URLs go out by text message and in Operations
email, so anything added to a patient page is a thing that gets sent.

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
| `Provider_Reference/KORB_Optimization_Products.html` | `node build-embed.js` (from repo root) |

**There was a second one until 2026-09-17.**
`Provider_Reference/KORB_GLP1_Provider_Tool.html` was retired to a redirect and
removed from `TARGETS`. One frozen page remains. See Retired below.

**3. Hand-built** — no data file, no generator. Every change is a manual edit.
These are the liability.

`KORB_GLP1_Dose_Guide.html`, `KORB_Lab_Interpretation_Tool.html`,
`KORB_Patient_Hub.html`, `KORB_Testosterone_Tracker.html`,
`KORB_Scheduler_Intake_Prototype.html`,
`Provider_Reference/KORB_Mens_Health_Provider_Tool.html`,
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

~~There is no generator for Men's Health or Women's Health.~~ **Both are
generated now.** Men's Health builds from `korb-mens-data.js` and Women's Health
from `korb-womens-data.js`, both through `build-clinical-docs.js`. This paragraph
was already wrong when Women's Health landed on 2026-09-16 and stayed wrong for a
day, which is how the Men's Health confusion survived.

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

## Prescribing sign-off

**THREE** separate registers, and the separation is the point.

| | Covers | Lives in | Read it with |
|---|---|---|---|
| **Monograph sign-off** | Indications, interactions, contraindications, monitoring, ICD-10, counselling script | `monographSignoff` in `korb-glp1-data.js` | `node build-signoff-sheet.js` |
| **Prescribing sign-off** | Tebra fields and charge codes, per DOCUMENT | `rxSignoff` in all three data files | `node rx-signoff.js` |
| **Artifact sign-off** | The interactive TOOLS and the patient HANDOUTS | `artifactSignoff` in the data file each one reads | `node artifact-signoff.js` |

**The third register, added 2026-09-17.** `rx-signoff.js` enumerates generated
DOCUMENTS from the `DOCS` lists in the render modules, so two kinds of thing were
invisible to it: the interactive tools, and the nine patient handouts.
`korb-patient-ed-data.js` had no sign-off structure of any kind - nine documents of
patient-facing clinical content with nowhere to record that a clinician had read one.

**What a fingerprint covers depends on the kind, and that choice is the whole
value.** A handout is fingerprinted on its rendered body text, because it has no
prescribing blocks and the text is all a patient receives. A TOOL is fingerprinted
on its **routing behaviour** - every state, the destinations it offers, the hormones
it gates, and the exact product list each picker is filled with - **plus** its
prescribing blocks. Blocks alone would have duplicated a signature already given on
the clinical reference, since both render the same entries from the same data file.
What is unique to a tool is the layer deciding WHICH entries a provider is offered,
and all three defects found in the Women's Health tool on 2026-09-16 were in that
layer. Don chose this scope on 2026-09-17.

**It drives a real browser**, because routing is only observable by operating the
tool. Reading the source would be reading the thing the signature is meant to be
independent of. So **no Chromium means exit 1, not a clean report** - the opposite
of the builders, which skip their PDF phase and carry on. A check has no business
reporting "nothing to see" without having looked.

Every tool and every handout is listed whether signed or not. Three tools have no
probe yet and are reported as CANNOT BE FINGERPRINTED, which is a loud state rather
than a quiet omission. The Men's Health probe was written on 2026-09-17. Writing one
for the GLP-1 and Add-On tools is open work.

**Status as of 2026-09-17: 24 artifacts, 6 signed.** The Add-On tool and GLP-1
Pharmacy Routing were signed after review the same day; the GLP-1 Provider Tool left
the register when it was retired to a redirect.

**Status earlier that day: 25 artifacts, 4 signed.** The Men's and Women's Health
provider tools and the Testosterone and Hormone Therapy handouts. Ready to sign and
awaiting review: the GLP-1 provider tool (150 blocks), the Add-On tool (25 blocks,
the same 25 the signed reference renders) and GLP-1 Pharmacy Routing (51 states, no
blocks - it decides a destination and writes no prescription, which it declares).

**THE DENOMINATOR WAS WRONG UNTIL 2026-09-17 AND THE REGISTER SAID IT WAS RIGHT.**
The first version typed four tools and its own comment claimed it listed every one.
It listed four of seventeen; twelve provider tools were absent, and the report
showed a short clean page that read as good news. Don found it by asking whether the
programmes were finished, not by any check failing.

The list is now DERIVED from `git ls-files`, so a new tool joins the denominator by
existing, and every exclusion is named in `excluded()` with the register it belongs
to instead. A tool with no probe is listed, counted, and says what a probe would
have to drive. **A register that cannot see something reports it as fine.**

**Stable keys, not derived ones.** A signature is stored against the key, and
`KORB_TRT_Provider_Tool.html` became `KORB_Mens_Health_Provider_Tool.html` earlier
the same day - a key derived from the filename would have silently orphaned that
signature. Mapped tools name their own key in `TOOL_META`.

**A frozen tool fingerprints its EMBEDDED blob, not its data file.** The GLP-1 and
Add-On tools take their data from `build-embed.js` at build time, so editing the
data file does not move their fingerprint until the build runs. Found by a negative
test that looked like it failed and had not: the tool was still serving last build's
data. A signed frozen tool beside an edited data file is a real state, and
`node build-embed.js --check` is what catches it, not this register. Run both.

**Signing is not releasing.** The RELEASE STATUS section at the top is the record of
what patients and providers can actually see, and a signature here does not move it.

```bash
node rx-signoff.js
```

**Why two and not one.** A hyphen fix in a sig is not a reason to re-read every
contraindication. Merge them and every punctuation change expires a clinical
sign-off, which trains people to re-sign without re-reading.

**Why this exists.** On 2026-09-15, after two days of correcting prescribing
fields — Greenwich sermorelin names reading 3x the real dose, BPC-157 at 600 mcg
when the dose is 500, en dashes a Tebra paste can drop — all three GLP-1
monographs still reported `current` against a 2026-09-06 signature. Correctly:
the monograph had not changed. Nothing anywhere tracked whether the prescribing
content had been reviewed. FH&L had no sign-off at all, and
`korb-addons-data.js` had a `needsSignoff` boolean that records only that nobody
has looked yet — set it false and the next day's edit is invisible.

**A record holds a fingerprint, not a boolean.** Three states: unsigned, stale,
current. STALE means somebody signed it and the content moved afterwards.

**Fingerprinted from the document as RENDERED**, by running the real renderer and
pulling every `div.rxb` out. No hand-written map from document to products — this
repo has been bitten twice by a list kept in step by hand. Only the blocks are
taken, so a rebuild on a different day does not invalidate a signature.

To record one: `node rx-signoff.js --sign <key>` prints the record to paste into
the data file. It does not write it. A sign-off is a clinical attestation and it
should land as a reviewed diff, not a side effect. There is no `--all`.

**Status as of 2026-09-17: 17 documents, 285 prescribing blocks, ALL 17 signed.**
Nothing unsigned and nothing stale for the first time. Women's Health was re-signed
at 46 blocks on 2026-09-17, superseding the 41-block signature of 2026-09-16; the
superseded record is kept in `rxSignoff.superseded` in `korb-womens-data.js` rather
than overwritten, so the register shows what was approved and when. The status
paragraph below is the 2026-09-15 snapshot and is kept for the history.

**Status as of 2026-09-15: 15 documents, 221 prescribing blocks, 6 signed.**

Signed: Premier Semaglutide, Belmar Tirzepatide, Zepbound, Wegovy, FH&L Foundation,
Add-On Clinical Reference. Each was reviewed on screen and approved in the session
of 2026-09-15; the records were reconstructed from the transcript, not from memory,
and every fingerprint was verified against the document as it stood at `7f993ba`,
the commit that was HEAD when the last approval was given. All six were
byte-identical then and now.

Unsigned: Belmar Semaglutide, Premier Semaglutide with Glycine, Premier Tirzepatide,
both FarmaKeio documents, Foundayo, Gateway, Peak Pathway A, Peak Pathway B.

**PICK UP HERE — start with Foundayo.** It took the same LillyDirect dispensing
address and brand-header treatment as Zepbound in the same pass on 2026-09-15,
but Don reviewed Zepbound and not Foundayo, so it is the one most likely to hold
an unreviewed change rather than merely an unreviewed document. Then work the
rest of the list. `node rx-signoff.js` is the running total.

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
- `node check-tebra-caps.js --gate` from the repo root — every value a provider
  copies, measured against `tebraLimits`, across all 15 documents. Expect
  "0 over the cap", exit 0. Measures the RENDERED value, not the source, because
  `&amp;` is one character on the clipboard. Negative-tested 2026-09-15: a
  planted overrun reports 178/140.
  **Headroom is thin.** The longest patient instruction is 139 of 140. Adding a
  word to a sig is not a free edit; run this after any sig change.
- `node artifact-signoff.js` — the tools and handouts. Expect 0 stale; it exits 1
  if anything signed has moved. Negative-tested both halves on 2026-09-17, and the
  first attempt at the handout half was a FALSE PASS worth knowing about: the
  phrase being changed was replaced in a **code comment** rather than in rendered
  content, so nothing moved and the check looked blind when it was fine. **When a
  negative test on this repo's data files fails to fire, confirm the string you
  broke actually reaches the page before concluding the check is broken.** Redone
  against a rendered sentence, the handout went stale correctly. The tool half is
  the more interesting one: dropping CA from the Schedule III states reported STALE
  while still showing 46 blocks, which is the proof that the routing half has teeth
  and not merely the blocks.
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

~~There are no `korb-mens-data.js` or `korb-womens-data.js` files in progress.~~
**Both exist now.** `korb-womens-data.js` was built 2026-09-16.
`korb-mens-data.js` is the same file as the former `korb-trt-data.js`, built
2026-09-16 and renamed 2026-09-17 once Don confirmed TRT and Men's Health are one
program. Open item 6 is closed.

### Push does not work from Cowork

The `clinical-generators` push failed because the sandbox proxy will not issue a
credential for this repo. It is not a GitHub permissions problem and retrying will not
help. **Push from Claude Code on the desktop, where real git credentials exist.**

**Re-hit 2026-09-18, and the paragraph above was only half the story.** Both write
routes out of a cloud session are closed, so knowing about the first one and
reaching for the second wastes a session:

- `git push` is refused by the egress proxy with *"korb-patient-tools is not in
  this session's authorized repository set"*. This is a **repo allowlist, not a
  credential problem** — supplying a token in the push URL by hand gets the same
  403. `git clone` still works, because reading a public repo needs no credential,
  which makes the block look narrower than it is. The proxy error names the fix:
  add the repository to the session's sources.
- **The GitHub connector cannot substitute.** It authenticates as the repo owner
  and reads fine, which is exactly why it looks like the way round. Every write
  returns `403 Resource not accessible by integration` — it holds read scope only.
  Check this BEFORE preparing a payload for it: pushing three changed files that
  way means emitting 334KB, a 175KB clinical data file included, through a tool
  call, and the permission error arrives after all of it.

So from a cloud session, produce the commits and hand them over rather than
pushing: `git bundle create <file> main..<branch>` carries the branch exactly, and
`git format-patch main..HEAD` gives the same thing as readable diffs. Verify the
handover instead of trusting it — replay the patches onto a scratch branch off
`main` with `git am` and compare `git rev-parse <branch>^{tree}`; identical tree
hashes prove the carrier is faithful.

~~Two documents in that set — Men's Health and Women's Health — are still the
10 September ReportLab originals.~~ **Both are generated now and both ReportLab
originals are gone.** The Men's Health one was deleted 2026-09-17; its defects
were confirmed by extracting its text first, not taken on trust: `KORB Health
Group` eight times including the running header and `KORB Health Medical Texas
PA` zero times, an Open Items section reading "Flagged and not yet resolved", and
no version or effective date. **One claim in the old list was wrong**: the word
Belmar does not appear in that document at all, so the "stale line about women's
testosterone" was either already gone or never in it.

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
16. ~~ONE SHARED PLAN BLOCK ACROSS ALL FOUR TOOLS.~~ **DONE 2026-09-17.**
   `korb-plan-block.js` owns the shape of a KORB plan note - section order,
   headings, the card, the Copy button, and the rule that an empty section is
   omitted rather than printed empty. The Men's, Women's and Add-On tools each
   assemble a spec from their own data file and this renders it.

   **It owns no clinical sentence.** Counselling, follow-up cadence and
   monitoring are read from the signed data files. A sentence composed in a tool
   would be unsigned text on a chart note, free to disagree with the reference
   beside it.

   **ASCII is enforced on the note, not on the card.** It goes into an EMR
   field, so the same reasoning as Tebra copy values applies: an en dash or a
   curly quote can be dropped on the way in, and a chart note is the last place
   to find out. Anything the fold has not been taught is DROPPED rather than
   guessed at. `selfCheck()` asserts both that and the empty-section rule, and
   both halves were negative-tested.

   **THE FIRST VERSION OF THE PROBES DID NOT COVER THE NOTE.** All three tools
   gained a plan block and not one fingerprint moved - the register reported
   nothing changed on the day every tool changed. A plan note is clinical text a
   provider pastes into a chart and it must be inside the signature. Fixed, and
   the three tools correctly went stale. **When a tool gains a new kind of
   output, ask what the probe captures before trusting that it still passes.**

   Three bugs it turned up, all found by reading the rendered note:
   an `id="st"` element is also `window.st`, so `stName(st)` inside a helper
   stringified the `<select>` and the note read "State: [object
   HTMLSelectElement]"; a `var T` added at the end of the Men's `render()`
   hoisted to the top and shadowed the tool's own `T`, so every selection threw;
   and `labs` is an array in `korb-mens-data.js` and an object in
   `korb-womens-data.js`, so assuming symmetry threw ".map is not a function".
   **Two programmes, two shapes. Read each file rather than expecting symmetry.**

17. **The Women's tool still has a dead `cp()` helper** labelled "Copy plan"
   that nothing calls, from before the shared block. Delete it.

   **Only the GLP-1 provider tool has one today.** It renders a full note -
   assessment and plan, dose and how to draw it, supply, dispensing pharmacy, a
   COUNSELING section and a FOLLOW-UP line - into a `.copybox` with one Copy
   plan button. Men's Health and the Add-On tool have nothing.

   **The Women's Health tool LOOKS like it has one and does not.** `cp(btn,id)`
   at line 755 has the button label "Copy plan" and nothing calls it. A grep for
   "Copy plan" finds it and a provider never can. Delete it or wire it, but do
   not read it as evidence the feature exists.

   **Why it was deferred rather than added to the Add-On tool on the day.** The
   GLP-1 plan text is prose hand-written inside that one HTML file. Adding a
   second copy to the Add-On tool, then a third and fourth, is the exact shape
   the prescribing block was in before `korb-rx-block.js`: the same thing four
   times in four forms, a provider seeing something different depending on which
   tool they opened, and nothing checking any of them against the reference.

   So: ONE renderer, fed by the data files, which already carry the counselling,
   follow-up cadence and monitoring that a plan note needs and which are already
   signed. Then a plan block cannot drift from the reference beside it.

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
   `KORB_Scheduler_Intake_Prototype.html`, `Provider_Reference/KORB_Mens_Health_Provider_Tool.html`,
   `Provider_Reference/KORB_Womens_Health_Provider_Tool.html`,
   `Provider_Reference/KORB_BMI_Protein_Calculator*.html`. The TRT and Women's
   tools need item 6's data files before they can be wired at all.
   ~~`L-Carnatine` is misspelled 7 times and was not fixed.~~ **Corrected
   2026-09-14**, `7ce82af`, data file v2.19. **The exact-match constraint on a
   `drugFormulation` string is GREENWICH ONLY** — Greenwich matches on the
   compounded name and will flag a difference, Belmar does not. Worth knowing
   before the next spelling or formatting question: check which pharmacy before
   assuming a string is load-bearing.
6. ~~**Create `korb-trt-data.js` and `korb-womens-data.js`.**~~ **CLOSED.**
   **`korb-mens-data.js` (then named `korb-trt-data.js`) DONE 2026-09-16**, renamed
   2026-09-17. Extracted whole from what is now
   `KORB_Mens_Health_Provider_Tool.html`, which had held every TRT fact as its own
   JavaScript. The computed ladder reproduces the tool's printed table exactly and
   the Tebra fields match field for field. The tool now READS the data file, so the
   two cannot drift; `check-pages.js` fails if the scripts load out of order, and
   that was negative-tested by stripping the tag.

   **Testosterone is NOT compounded, and this is the rule.** Testosterone cypionate
   200 mg/mL is a COMMERCIAL product that happens to be dispensed by a compounding
   pharmacy - Premier in TX, Empower in CA. Those are two different facts, and
   conflating them is why the tool carried a Compounded Drug Favorite header and a
   "Reason for Compounding" row on a commercial generic, plus a pricing footnote
   saying compounded medications are not FDA-approved. It is a Tebra **STANDARD**
   prescription: the drug is selected from the drop-down with no copy button, there
   is no Reason for Compounding field at all, and the word compounded appears
   nowhere provider-facing. `selfCheck()` asserts every part of that. Decided by
   Don 2026-09-16, and the same rule the brand GLP-1 documents took on 2026-09-15.

   Routing is **verified**: Premier is live for Texas patients today; Empower has
   accepted and approved test prescriptions for California with no live patient
   prescription sent yet. SHBG and free testosterone are **add-on labs**, left as
   they are pending the formal TRT and Men's Health program review.

   `korb-pharmacies.js` v1.6 gained two things for this. A program can now
   **narrow** a footprint with `only` rather than only subtract with `excludes` -
   Schedule III licensure is far narrower than a pharmacy's general reach, and
   Premier ships peptides to 38 states and testosterone to Texas. And
   `stateNames` / `stateName()`, because the tool was typing its own 51-entry map.

   **A standalone reference now exists too.** TRT was the only program without
   one: GLP-1 has ten monographs, FH&L four references, add-ons one, and TRT had
   only the interactive tool, so a provider who wanted to read the protocol had to
   operate a calculator to see it. `KORB_Mens_Health_Clinical_Reference` is generated by
   `build-clinical-docs.js` from the same data file the tool reads - 15 pages, 18
   prescribing blocks, being three doses x three routes x two pharmacies, each
   written out in full because the Tebra Name encodes dose and route.
   `clinical-doc-render.js` gained two reusable section renderers for it, `table`
   and `trtPrescribing`; Women's Health will want the first one.

   **The builder shipped a one-page PDF and every check passed.** It never put
   `KORB_PHARMACIES` on the global, so `korb-trt-data.js` did not hydrate, did not
   build its document sections, and `selfCheck()` skipped its routing assertions
   and printed OK. The typeface check read a perfectly valid PDF. The live HTML was
   correct, because a browser loads both scripts - which is exactly what makes this
   shape hard to catch: **the thing you click works and the thing you print is
   empty.** Fixed, and `printableHtml` now refuses to build a document with no
   sections or a rendered body under 4000 characters. Negative-tested by putting
   the bug back: it names the document and exits 1.

   **`korb-womens-data.js` DONE 2026-09-16.** Extracted from
   `KORB_Womens_Health_Provider_Tool.html`, which already carried the current
   model. **NOT from the November 2025 programme document** - Don confirmed
   anything in it beyond the tool is out of date, and two things in it are simply
   wrong: it has the pharmacy routing backwards, and it names FarmaKeio as a
   partner pharmacy on all nine pricing tiers. Both recorded in `sourceConflicts`.

   **The routing rule, in Don's words: Premier for all Premier states, Belmar for
   any other.** 38 and 13. Computed at load from the shared footprint, which the
   tool's typed list matched byte for byte. Every one of the 51 resolves, and
   `hydrate()` throws rather than leaving a state unrouted.

   Women's testosterone is Schedule III and is **Texas and California only** -
   the only states where a KORB provider holds the DEA registration.

   `KORB_Womens_Health_Clinical_Reference` is generated, 9 sections. It carried no
   prescribing blocks when first built - the Tebra entries are per-hormone and
   per-strength and were not in the tool - and they were built out over the two
   days after. It now renders **46**, signed 2026-09-17 at v1.1.
15. **The Testosterone handout reads `korb-mens-data.js`.** DONE 2026-09-17.
   It carried `source: 'none'` and its own typed `facts` block, with a comment
   saying to wire it up once the data file landed. The file landed 2026-09-16 and
   the wiring did not happen, so the route sentence a patient reads was typed
   separately from the route table the provider documents read, free to disagree.
   Only `how` is derived, because only `how` is a fact that file holds: timing and
   schedule depend on the individual prescription, and deriving them would dress
   prose up as live. Negative-tested by flipping the one IM route to `sq: true`,
   which changed the sentence to "subcutaneous" alone.
   **`KORB_Patient_Ed_HormoneTherapy` is now the LAST handout on `source: 'none'`**,
   with the same duplication for Women's Health. It has no live badge, which is
   the visible symptom.
   **A refactor in `build-patient-ed.js` broke six handouts on the way**: the live
   badge read "reflects undefined" on every peptide handout, because they carry no
   `source` key at all and the new lookup used `doc.source` rather than the
   fallback. Caught because the rendered character counts dropped by exactly the
   difference between "korb-dosing-data.js" and "undefined". **The handouts that
   declare no source are the ones a source-keyed change will break.**

14. ~~No patient-facing Women's Health HTML.~~ **DONE 2026-09-16.**
   `KORB_Patient_Ed_HormoneTherapy` is generated now - the ninth handout and the
   first for Women's Health, converting the last of the hand-made patient PDFs.

   ONE handout rather than one per hormone. The peptide handouts are one per
   agent because a patient takes one peptide; a woman on hormone therapy is
   usually on two or three at once, so splitting them would hand her three
   documents that each omit two thirds of what she is taking.

   Clinical content follows `korb-womens-data.js`, which Don signed the same day.
   **Storage and travel are overridden**, because the shared blocks say
   refrigerate - right for peptides, wrong for every product here. That is the
   contradiction the Testosterone handout hit in September; all three
   refrigeration mentions on this page were checked and agree.

   **Not yet reviewed by Don.** It is new patient-facing clinical writing.

13. ~~The Women's Health PROVIDER TOOL still has the old model.~~ **DONE
   2026-09-16.** It loads `korb-pharmacies.js` and `korb-womens-data.js` and
   reads every clinical value from them - the state lists, the pharmacy
   offerings, the pricing tiers, the testosterone prescribers and the Tebra
   entries. `check-pages.js` knows the dependency and was negative-tested by
   stripping the tag.

   **It surfaces the Tebra entries for the plan on screen.** That is the point of
   a tool over a reference: pick a state, a uterus answer and two or three
   hormones and get the blocks that apply, filtered by destination, instead of
   scrolling forty-one. Driven through five combinations - Texas partner 17,
   California 5 (Belmar stocks no patch), Alabama 9, Texas local 9 (commercial
   only), Florida 19 with testosterone blocked.

   Three things it had wrong, found by reading it against the data rather than by
   clicking through it: progesterone quantities of 67 and 90 per 90 days against
   the entries' 63 and 84 over 12 weeks; **"Do not use with a peanut allergy"**,
   the same error corrected on the reference that day - the allergy rules out the
   commercial capsule, not the hormone; and local pharmacy described as estradiol
   patch only, when commercial progesterone can go there too.

18. ~~ONE CHOICE PANEL, NOT TWO.~~ **DONE 2026-09-18.** The panel-and-pills
   treatment shipped twice in one file on the same day: inline styles in
   `links()` for the Start Here Guide, CSS classes in `HUB_CSS` for the two
   welcome letters. Both render a label, a line of guidance and a row of
   choices, and they were **eight measured properties apart** - 420 against
   470px, 8 against 10px radius, `#DEDCC9` against `#D5D5CC`, 14 against 14.5px,
   and the one that mattered, **a 38px choice button against a 44px one**.

   44px is the tap target the rest of this stylesheet holds to deliberately, and
   the 38px ones were the buttons a patient uses to reach the RIGHT tier and the
   RIGHT handout, on pages whose stated purpose is being opened from a text
   message. Eight of them on one page.

   `CHOICE_CSS` is now the single declaration, included by `HUB_CSS` and emitted
   by `links()` once per call that contains a panel. The bodies `links()` renders
   into contribute no stylesheet of their own, which is why it emits rather than
   the caller. Every colour is a brand variable the handout stylesheet already
   defines on every patient page; only `--k-teal-ink` is hub-local so it is set
   there too.

   **The one surviving difference is deliberate and is a modifier, not a second
   copy**: `.linklist .k-panel` caps at 420px so a panel in a reading order lines
   up with the step buttons above it, against 470px on a hub.

   **Negative-tested both halves**, which is the only reason to believe it is one
   source: `min-height` changed to 52px in the single rule moved BOTH pages to
   52, and restoring it moved both back to 44. The Start Here Guide went from
   nine sub-44px tap targets at 375px to one, that one being the Print link in
   the masthead, which every page has.

   **The `.k-act` contact rows followed the same day**, for the same reason:
   the value was a bare inline `<a>` at 25px and its Copy button 38px, so the two
   smallest targets on a welcome letter were the phone number and the email
   address - the controls a patient uses to reach a human. `inline-flex` rather
   than a padding bump, because padding on an inline element does not grow its
   hit area. Both welcome letters went from six sub-44px targets at 375px to one.

   **That one is `Print`, at 15px, and it is on EVERY page** including all nine
   handouts and all four overviews. It is masthead chrome rather than a
   destination, and it is the only sub-44px target left anywhere in the patient
   set. Left alone deliberately; revisit it as a masthead question, not a
   per-page one.

19. **TWO protein calculators, and that is the design.** Don, 2026-09-18. One
   patient-facing, one provider-facing and standalone on the intranet with
   copy-and-paste note sections. They are not a duplicate to be merged.

   `Provider_Reference/KORB_BMI_Protein_Calculator_standalone.html` is the
   provider one and already carries "Copy into the chart" and a note textarea.
   Its twin `KORB_BMI_Protein_Calculator.html` has the textarea and not the
   chart-copy control, and neither file has any script tags, so what actually
   distinguishes the two is currently unclear. Settle that before either goes on
   the intranet.

   **What IS still duplicated is the PATIENT one**, in two files: `proteinCalc()`
   in `patient-ed-render.js` and the hand-coded original in
   `KORB_Patient_Hub.html`. Verified byte-for-byte equivalent in behaviour on
   2026-09-18 - four cases across both unit systems, both goals and both sides of
   the BMI 30 adjusted-body-weight boundary, identical to the gram in all four -
   but the control ids differ (`proteinWeight` against `kpW`), so "ported
   verbatim" is not literally true. The comment in `proteinCalc()` says the quiet
   part: *"If the numbers change, they change in both."* That is one clinical
   formula in two files, which is the one thing this repo exists to prevent.
   The hub is hand-built, so this closes when the hub does.

20. ~~SEVENTEEN PATIENT PAGES HAD NO GENERATOR.~~ **DONE 2026-09-18.**
   `build-patient-ed.js` emitted `DATA.docs` and nothing else - the nine
   handouts. The thirteen guides and four program overviews, which between them
   are every document the release record lists as LIVE to patients plus both
   welcome letters and the lab page, were written to disk by something that is
   not in this repo.

   **This is not a filing complaint.** Each of those pages inlines the shared
   stylesheet at BUILD time and loads only the data files at run time. So a fix
   in `provider-doc-render.js` reaches the nine handouts on the next build and
   reaches the other seventeen NEVER. The Storage table below is what exposed
   it: the rule was corrected, the handouts rebuilt, and the page Don was
   actually looking at did not move, because nothing in the repo could rebuild
   it. Seventeen pages were frozen at whatever a missing tool last produced.

   The builder now walks `docs`, `programs` and `guides`; the collection picks
   the renderer, `hub: true` picks `renderHubBody`, and `root: true` publishes to
   the repo root and shortens every script path. `file` and `program` were added
   to all seventeen entries, **read off the published pages rather than derived**
   - `KORB_MensHealth_Program_Overview` is not what a deriver produces from
   "Men's Health Program Overview", and the same trap is recorded for the
   handouts.

   **Verified by rendering all 26 before and after, not by reading the output.**
   25 of 26 are byte-identical in rendered text and links, with zero JS errors.
   The 26th is the finding: `KORB_Longevity_Program_Overview.html` had the h1
   **"Functional Health & Longevity Program"** and the data file says
   **"and"**. The published page had drifted from the data file and nothing
   could see it, which is the whole argument for the generator in one line.

   **`alsoLoad` exists because the first version silently dropped a script.**
   The GLP-1 welcome letter loads `korb-glp1-data.js` beside
   `korb-dosing-data.js`; the shell emitted one source file, the page still
   rendered identically, and only `check-pages.js` noticed - 75 module loads
   became 74. Declared in the data file, never inferred.

   **The builder was still writing the nine retired PDFs.** All 43 were retired
   on 2026-09-17, which removed the "PDF version" LINK from the pages and the
   builders and left the `page.pdf()` call in place, so any run recreated the
   exact files the repo had decided to delete. Found by running it. The PDF
   phase is gone. **Retiring an output means removing what writes it, not just
   what links to it.**

21. ~~A ROW LABEL WAS PAINTED LIKE A COLUMN HEADER.~~ **DONE 2026-09-18.**
   `.grid th` was written for a `thead` - a real header row across the top of a
   timeline or pricing table, where a navy band is correct. `cards()` then reused
   `.grid` for label/value rows, which puts a `th` in the FIRST COLUMN of every
   body row, so the same rule painted a solid navy stripe down the left of the
   Storage table on the patient safety guide. Don flagged it: hard to read, and
   it looks like two tables.

   It is the **same defect the house standard already names** for a prescribing
   block - a tint on the label column alone makes every row two-tone and the
   block reads as two columns - and `.kv` already had it right. `.grid tbody th`
   now matches `.kv th`: white cell, navy TEXT, zebra carried across the whole
   row. `thead` is untouched, so no timeline or pricing table moved: measured at
   12 navy `thead` cells on the Semaglutide handout before and after, and 4
   navy `tbody` cells on the safety guide before and 0 after.

22. ~~THE TSA WORDING EXISTED AND ONLY TWO HANDOUTS HAD IT.~~ **DONE 2026-09-18.**
   The checkpoint sentence - tell the officer at the start of screening, the
   liquids may be inspected separately, and the link to the current rules - was
   `doc.travelNote` on the Semaglutide and Tirzepatide handouts and nowhere
   else. Neither was believed to be released at the time - the release record
   said so and the record was wrong, see the top of this file. The Injection,
   Storage and Safety
   Guide, which IS live, whose last section is travel, and which a patient is
   sent before their first injection, said only that TSA "recommends keeping the
   original pharmacy label visible" and gave them no link.

   It is now `shared.travelScreening` and every travel section renders it,
   including the handouts that override `travel` with their own text because
   their storage rules differ - a patient carrying testosterone needs the
   checkpoint sentence as much as one carrying semaglutide. **10 pages** carry
   it. The link is a real anchor: `rich()` only does bold, so "the rules are at
   tsa.gov/travel/travel-tips" as flat prose is something a patient retypes on a
   phone at an airport.

23. ~~THE CONTACT BLOCK PRINTED CONTACT DETAILS AND LINKED NONE OF THEM.~~
   **DONE 2026-09-18.** `'Email: info@korbhealth.com'` was a STRING in a
   paragraph. No `mailto:`, no `tel:`, and the Patient Portal had no URL at all
   on any generated page, though the designed Welcome Letter PDF has always
   carried it. The lab page rendered exactly one link in the whole document and
   it was Print. Don could not find the contact information on it, and was
   right: there was nothing to find.

   **Three renderers had a private copy of this block** - `sharedBlock`,
   `renderProgramBody` and the three-column grid in `renderBody` - which is the
   same shape as the prescribing block before `korb-rx-block.js`. Restructuring
   the data to `ways: [{label, value, href}]` broke two of the three silently:
   they read `c.lines`, which no longer existed, so the contact details
   DISAPPEARED from every handout and every program overview and the page still
   rendered. Caught by diffing rendered text against a baseline, not by any
   error. All three now call `ways()`. **17 pages** carry a working phone, email
   and portal link.

   Negative-tested both halves on both facts: one edit to the TSA href moved 10
   pages, one edit to the phone href moved 17, and restoring each put them back.

24. **The Quest lab page, recovered rather than rewritten.** DONE 2026-09-18.
   `KORB_Schedule_Your_Lab_Appointment.pdf` was retired on 2026-09-17 with the
   other 42. The HTML that replaced it kept the prose and dropped every link in
   it, so the page told a patient to book at Quest, to call their nearest
   location and to use the MyQuest app, and gave them nothing to tap.

   The four URLs were read out of the retired PDF's link annotations rather than
   retyped: the Quest booking page, the location finder, and the MyQuest listings
   on the App Store and Google Play. **Do not take the rest of that PDF as a
   model** - its running header says KORB Health Group, the MSO, which is the
   fault open item 1b fixed.

   **ONE CORRECTION TO THE BRIEF, and it decided what must not move.** The
   Welcome Letter PDF does NOT link to this page. Its links go to
   `KORB_Patient_Treatment_Schedule.html`. Don confirmed on 2026-09-18 that the
   linked one is the one to keep, so that URL does not move.

   **CLOSED 2026-09-18 by `korb-quest.js`.** Both pages read it and the facts
   are written once. See item 29.

25. **Should contact details be at the foot of every patient page?** Asked by
   Don 2026-09-18. Recommendation: yes, and it is not yet built. Today the block
   appears wherever a document happens to declare `shared: 'contact'`, which is
   why it is mid-document on When to Contact and absent from several pages
   entirely. A page a patient opens from a text message should end with how to
   reach a human, in the same place every time, whatever the page was about.
   The mechanism exists now - `ways()` renders it and every value is reachable -
   so this is a decision about placement, not new plumbing.

26. ~~A DESTINATION IS A BUTTON. A VALUE IS A ROW.~~ **DONE 2026-09-18.** Don
   asked for the Patient Portal and the TSA rules to be buttons rather than an
   underlined phrase to hunt for inside a paragraph.

   The line drawn, and it is the reason this is a rule rather than two edits:
   **a phone number and an email address are VALUES** - a patient reads them,
   copies them onto something else, or taps the affordance their phone already
   gives `tel:` and `mailto:`. **A portal sign-in and a set of federal rules are
   PLACES**, and a place gets a button. So `ways()` splits its list: values go in
   the `.kv` row table, `http(s)` destinations render through one `buttons()`
   helper, which `screening()` also calls. One button renderer, not two.

   **The split is not cosmetic.** The first attempt put the button inside the
   table and the Patient Portal came out as a one-row table whose only cell held
   a button, with an empty "Portal" label beside it. Found by screenshotting the
   rendered page, which is the only way that kind of thing shows up.

   **A sentence written to hand off to its own last phrase does not survive
   becoming a button.** `travelScreening.text` ended "...the current rules are
   at", with the address as the final words, and once the address moved into a
   button the paragraph read "The current rules are at." The text now ends, and
   `buttonLabel` says what pressing it does. **A URL is not a button label.**

   `CHOICE_CSS` is inlined by `build-patient-ed.js` into every patient page
   rather than emitted by `links()`, because `ways()` and `screening()` render
   buttons and neither is anywhere near a `links()` call.

   **A dead helper ate the first fix.** `linkOrText()` was left behind by the
   previous iteration of this work, nothing called it, and a targeted edit
   landed in it instead of in the live `valueOf()`. The page was measured rather
   than assumed, the class was absent from the rendered DOM, and the helper was
   deleted. Same shape as the Women's tool's dead `cp()` in item 17: **a helper
   nothing calls is not harmless, it is a decoy.**

   **They are CENTRED.** They first shipped left-aligned, on the argument that a
   button under a heading and a list is not in the middle of a reading order the
   way a set of choices is. Don looked at the rendered page and called it: a lone
   button hard against the left margin reads as left-heavy and unfinished, and it
   disagreed with the choice panels two sections above it, which `.k-pills`
   already centres. **One alignment for every button on the page.**

   **THE FIRST ATTEMPT AT CENTRING MADE IT WORSE, AND THE MEASUREMENT AGREED
   THAT IT WAS FINE.** Removing `justify-content:flex-start` left the inline
   `margin:10px 0 4px`, which overrides `margin:0 auto` on `.k-pills` - so the
   470px flex box sat flush LEFT in a 762px column and only the button inside it
   was centred. It moved a little and looked more off than before, which is
   exactly what Don reported.

   **The check was a false pass because it used the wrong reference.** It
   compared the button's gutters to `document.documentElement.clientWidth`, the
   VIEWPORT, and reported 55px either side. True, and irrelevant: at 375px the
   body fills the viewport, so the wrong reference agreed by coincidence, and at
   900px it would not have. **Measure a centred thing against its PARENT.** Redone
   that way, the offset from column centre is 0px on both pages at 375, 900 and
   1150px, and the planted bug reads 146px.

   Every generated patient page is now down to **one** sub-44px tap target at
   375px, and it is `Print` in the masthead. `.k-val` carries the contact values
   to 44px, screen only - on paper a 44px minimum on a table cell just pads the
   row.

27. ~~THE WELCOME LETTERS HAD NO DOCUMENT SURFACE.~~ **DONE 2026-09-18.** Don:
   the GLP-1 letter read as "one big, huge glob of cream" and looked unfinished
   beside the rest of the set. It was. `HUB_CSS` opened with a block captioned
   *"undo the sheet-of-paper chrome the handout stylesheet imposes"* and flooded
   `body` with brand cream at full width.

   That chrome is not decoration. Page cream behind, a lighter `#FBFAF6` panel
   with a hairline edge in front, is the only thing telling a reader where the
   document starts and the desk ends, and every other patient page has it. The
   two pages without it were **the two a new patient opens first**.

   Only the type scale is overridden now; the surface, the width and the side
   rules are left to the builder's `@media screen` block, where they are set for
   the whole set. `#doc` also stopped capping its own width at 780px - `body`
   already caps at 8.5in, so the letters rendered a narrower column than the
   handout beside them. Verified by measuring: all three of Welcome, GLP-1
   Welcome and Start Here now report the same body background, desk background,
   816px width and 1px rule.

28. ~~CONTACT DETAILS AT THE FOOT OF EVERY PAGE.~~ **DONE 2026-09-18**, Don's
   call to make. They sit at the foot, in the same place, on **25 of 26 pages**.

   Before this the block appeared wherever a document happened to declare
   `shared: 'contact'`: mid-document on one page, a three-column table on the
   handouts, a "Questions" section on the lab page, and absent from several
   entirely. A patient opening a page from a text message should not have to
   read the page to find out how to reach a human.

   **The 26th is `KORB_When_to_Contact_KORB_or_ER`, which suppresses it**, since
   printing the same three details immediately under a document whose entire
   subject is who to contact is worse than not having a footer.

   **What stayed and what moved, because they are different kinds of thing.**
   WHICH problem goes to whom is clinical content and stays in the body - the
   handouts keep their three-column split, and `portalItems` is still
   per-handout. The phone number, the email address and the portal link are
   contact DETAILS and appear once, at the foot. No page now prints the number
   twice.

   **Both welcome letters typed their own copy of all three.** They carried
   `Call (888) 959-7299`, `Email info@korbhealth.com` and the portal URL as
   their own links beside `shared.contact`, which holds the same three facts for
   the other 24 pages. Their Contact us section is filled from the shared block
   now and still renders as `.k-act` rows, which is the right treatment on a hub
   - a labelled row with the value visible and a Copy button.

   **A regex nearly ate the data file doing this.** A greedy `re.S` pattern over
   "Contact us" sections matched across the end of one object and broke
   `korb-patient-ed-data.js` into a syntax error. Restored from git and redone
   by replacing the exact literal block, with an assertion that it appears
   exactly twice. **Match a literal and count it; do not pattern-match across
   object boundaries in a 175KB data file.**

29. ~~QUEST FACTS IN TWO PLACES.~~ **DONE 2026-09-18.** `korb-quest.js` is the
   source of truth for where a patient books a lab draw and how they get the
   MyQuest app. `KORB_Schedule_Your_Lab_Appointment.html` reads it through
   `shared: 'quest'`, and `KORB_Patient_Treatment_Schedule.html` - the page the
   Functional Health and Longevity welcome letter actually links to, and the one
   Don said to keep - builds its lab box from it.

   **A SEPARATE FILE, NOT `korb-patient-ed-data.js`.** The Treatment Schedule is
   a tool a patient opens weekly on a phone and it already loads
   `korb-pharmacies.js` and `korb-dosing-data.js`. Putting four URLs in the
   patient-education file would have made it download **184KB of handout prose
   to render one info box**. The repo's own rule, applied rather than dodged:
   the problem is never too many files, it is the same fact in more than one.

   **NEITHER SOURCE WAS COMPLETE, which is why this was a merge and not a move.**
   The retired PDF had the location finder and both app store links, which the
   tool lacked. The tool had the MyQuest web portal, which the PDF lacked. And
   they **disagreed on the booking URL** - the tool linked `/as-home`, the PDF
   and the page linked the root. Both return 403 to a scripted request, which is
   bot blocking rather than a broken link, so they could not be told apart from
   the outside. The root is kept because a root URL outlives a deep path, and
   `bookAlternate` records the other so the choice is visible rather than lost.

   `KORB_PATIENT_ED.hydrate(KORB_QUEST)` follows the `korb-pharmacies.js`
   pattern: **korb-quest.js must load FIRST**, the data file throws by name if it
   does not, and `check-pages.js` gained the dependency. Negative-tested both
   halves - stripping the tag from one page reported it by name, and it also
   caught `KORB_Patient_Hub.html`, which loads the patient data file and had no
   idea about the new dependency. Module loads went 75 to 102.
   A second negative test on the fact itself: one broken href in `korb-quest.js`
   appeared on BOTH pages, and restoring it cleared both.

   **`KORB_Patient_Treatment_Schedule.html` said KORB Health Group**, the MSO,
   in its byline and running header, on a live patient-facing document giving
   clinical instruction. Open item 1b covered the clinical set on 2026-09-14 and
   never reached the hand-built patient tools. **Fixed 2026-09-18**, and the
   rendered page now carries the PA twice and the MSO zero times.

   **Surveyed rather than assumed, and two of the remaining hits are correct.**
   All six hand-built patient pages were checked. `KORB_Patient_Hub.html` and
   `KORB_Lab_Interpretation_Tool.html` already said the PA. The Testosterone
   Tracker and the GLP-1 Dose Guide name neither. What is deliberately LEFT:
   `alt="KORB Health Group"` on the logo, which is the brand lockup and not an
   attribution, and **`PRODID:-//KORB Health Group//...` in the Functional Health
   Tracker's calendar export**, which is a software product identifier - the MSO
   genuinely is the entity producing the tool. A find-and-replace would have
   changed both. This is the same warning item 1b carries about the 100
   occurrences in `korb-glp1-data.js`: **look at every hit before touching any of
   them.**

30. **THE CREAM DESK IS ON THE GENERATED PAGES ONLY.** Don flagged on 2026-09-18
   that `KORB_Patient_Treatment_Schedule.html` had no cream down the sides like
   the rest of the set. Measured across every patient-facing page, and he was
   pointing at a real split: **all 26 generated pages** carry the treatment -
   `#ECE9D1` desk, `#FBFAF6` panel, 1px side rules - and **every hand-built tool
   is white and full width**, with no document surface at all.

   Fixed on the Treatment Schedule, which is the one the Functional Health and
   Longevity welcome letter links to. The panel goes on `.wrap` rather than
   `body`, because `.wrap` carries this tool's 920px column - wider than the
   8.5in the reading documents use, which the schedule table needs. **Screen
   only**, matching `build-patient-ed.js`: the print sheet stays white, where a
   cream flood wastes ink and prints muddy. Verified by emulating print - the
   desk does not follow. Checked at 375, 640, 920 and 1400px: no overflow, and
   the panel fills the viewport below its own width rather than leaving slivers.

   **ALL TWELVE DONE the same day**, after Don asked for the set. See item 31.

31. ~~EVERY TOOL NOW HAS THE PAGE CHROME.~~ **DONE 2026-09-18.**
   `korb-page-chrome.css` holds it: cream desk, `#FBFAF6` sheet, a hairline down
   each side, screen only. Twelve hand-built pages link it; the thirteenth is a
   deliberate copy, below.

   **MEASURED BEFORE TOUCHING ANYTHING.** All 62 tracked HTML pages were loaded
   and their computed backgrounds read: **50 had the desk, 12 did not, and the 12
   were exactly the hand-built ones.** Don found three of them by eye - the
   Treatment Schedule, then the Testosterone Tracker and the GLP-1 Dose Guide -
   and asked for the rest to be checked. The survey is what made "the rest" a
   list rather than a guess.

   **NO WIDTH IN THE SHARED FILE, deliberately.** Every one of these tools
   already has a constrained `.wrap`, and they are not the same width and should
   not be: 560px on the Functional Health Tracker, 720 on the Testosterone
   Tracker, 920 on the Treatment Schedule, 1180 on the scheduler prototypes,
   which carry a wide table. This file paints the column each tool already has
   rather than imposing one. That was checked first - all eleven `.wrap`
   elements were measured and every one was constrained and transparent, which
   is what made a single rule possible.

   **LINK IT AFTER THE PAGE'S OWN `<style>`.** These rules and a page's own
   `body{background:#fff}` have equal specificity, so the later one wins. Linked
   before, the file does nothing at all and does it silently.

   **THE ONE COPY, AND WHY IT IS ALLOWED.**
   `Provider_Reference/KORB_BMI_Protein_Calculator_standalone.html` has the block
   inlined instead. It is the portable twin - a single document with no local
   dependency, which is what lets it be emailed or dropped on a share and still
   work, a tradeoff CLAUDE.md already records. Linking the stylesheet would take
   the portability away for eight lines of chrome. It is the only copy and it
   says so in the file.

   **IT BROKE THE PATIENT HUB, which is the file the website developer holds.**
   The first version painted `.wrap` directly, on the strength of a survey that
   found every hand-built tool had a constrained, transparent `.wrap`. True of
   eleven of them. On `KORB_Patient_Hub.html`, `.wrap` is a generic width limiter
   used **thirteen times** - the nav, four resource sections, the AI section, the
   safety block - so the rule painted thirteen stacked full-viewport cream boxes.
   The page height went from 14,032px to 18,236px and Don saw an empty panel with
   the nav floating in it. He reported it the next morning.

   **THE CHECK CONFIRMED IT WAS FINE.** `verify2.js` read
   `document.querySelector('.wrap')` - the FIRST one - confirmed its background,
   its 44px targets and no overflow. Every assertion was true. **Not one of them
   asked whether `.wrap` was the document or merely an element on it.** Same
   family as the centring measurement that used the viewport instead of the
   parent, two days earlier: a true measurement of the wrong thing.

   Fixed 2026-09-19. The stylesheet is **opt-in**: `body.korb-sheet` and
   `body.korb-sheet .wrap`. **A shared stylesheet must be asked for, not
   inferred.** Nine tools opt in. The hub does not, because it is a full-width
   landing page rather than a document. Both scheduler pages came back out too -
   neither has a `<body>` tag to hang the class on, `KORB_Scheduler_Intake_
   Prototype.html` is FROZEN for Lindsay's review and was restored byte for byte,
   and its working twin stays structurally comparable to it.

   The new check asks the question the old one did not: how many sheets were
   painted, and does the sheet CONTAIN the page. Negative-tested against the real
   bug - replanting the unconditional rule reports the hub at 13 painted sheets
   and fails; restoring it passes 12 of 12.

   **Negative-tested for single-source too.** A colour changed in
   `korb-page-chrome.css` moved **5 of 6** sampled pages, and the sixth was the
   standalone - which is the tradeoff demonstrated rather than asserted.
   Verified on all twelve at 1400px and 375px: desk present, panel present, no
   horizontal overflow, no JS errors, and **print stays white on every one** -
   confirmed by emulating print media, not by reading the media query.

32. ~~THE PATIENT HUB'S NINE GOOGLE DRIVE VIDEOS WERE BROKEN FOR EVERY PATIENT.~~
   **DONE 2026-09-19.** Seven distinct files, nine embeds. Opened signed-out in a
   fresh context, **every one** returned *"Sign into your Google Account to
   continue to play this video. The limit has been hit for viewers who aren't
   signed in."* A patient has no KORB Google account, so a patient saw that.

   **I CALLED THIS PROBABLY-FINE THE DAY BEFORE, ON A CURL 200.** curl fetched
   the wrapper page, which returns 200 whether or not the player works. The HTTP
   status of a Drive preview URL says nothing about whether the video plays.
   **Load the thing a person loads.** Don was about to send this hub to every
   patient after every visit.

   **They were also the entire load cost.** Measured with the Drive requests
   blocked and unblocked: **7,696ms to load with them, 132ms without**, and
   `networkidle` never arrived inside 45 seconds. 58x slower to become usable, on
   a desk connection. Drive is not a video host and throttles embedded playback
   regardless of sharing.

   Replaced with `.vposter`: a poster is a LINK, not a frame, so nothing loads
   until a patient asks for it. Three of the nine are the injection video and
   link to YouTube via `bit.ly/KORBSQInjection`, the link the generated patient
   set has always used. The other six are honest dashed placeholders - **linking
   to a video that shows Google's quota error is worse than saying it is coming**.
   Result: 7,696ms to **190ms**, networkidle 703ms, zero console errors.

   **Don's reason for using Drive was ads**, not preference: YouTube shows
   pre-roll to viewers who are not signed in, and he moved two videos off YouTube
   to avoid it. Recorded so it is not undone by someone who thinks Drive was a
   mistake. There is no embed parameter that turns ads off. The ad-free routes
   are a non-monetised channel (likely but not guaranteed by YouTube's terms),
   Vimeo, or **S3 plus CloudFront, which KORB already has under its AWS BAA** -
   no ads, no quota, no third party, and it fixes the load cost too.

33. ~~THE SEVEN PATIENT VIDEOS MOVED TO VIMEO.~~ **DONE 2026-09-19.**
   `korb-video.js` is the source of truth: which video, its Vimeo id, its label
   and its thumbnail. Nine slots in `KORB_Patient_Hub.html` read it through
   `data-korb-video="<key>"`, and the injection walkthrough fills three of them.

   **ONE FILE BECAUSE THE NEXT MOVE IS CERTAIN.** Vimeo is a bridge - Don's
   account on `don@systemslabstudio.com`, a Systems Lab Studio card, expected to
   move to KORB-owned hosting when the website is built. Nine scattered embeds
   is what made the Drive migration a hunt. This one is seven lines.

   **THE FACADE.** The page loads a THUMBNAIL per video, lazily, and creates a
   Vimeo player only on click. Nine players on arrival is what made the Drive
   version unusable. Measured: **7,696ms with Drive, 226ms now**, and only 4 of
   the 9 thumbnails are fetched on arrival - 46KB - because the rest are below
   the fold and `loading="lazy"` means they cost nothing until scrolled to.

   **Thumbnails are Vimeo's own**, read from its oEmbed API rather than made by
   hand, and stored as a BASE url with the width appended. The first attempt
   asked for 1280px stills and took the page to 3,426ms: 410KB of pixels for
   frames that render 504px wide. At 640px it is 166KB.

   **`file://` and localhost both refuse to play here, and that is this sandbox,
   not the work.** Proven by a control test rather than assumed: loading
   `player.vimeo.com/video/<id>` DIRECTLY, embedded in nothing, returns the same
   "We couldn't verify the security of your connection" - so it is Vimeo's
   anti-abuse refusing this environment's egress. The facade mechanism itself is
   verified: 9 facades become 8, the iframe is created at 504x284 with the right
   src. **PLAYBACK ITSELF IS UNVERIFIED FROM HERE and Don must click one on the
   live site.**

   Vimeo privacy is **Public** on all seven, Don's decision 2026-09-19: these go
   out by text message and in Operations email, and Private would put a sign-in
   wall in front of a patient.

   The `.vposter` stopgap from 2026-09-18 is deleted rather than left behind.

34. ~~THE HUB WAS INCONSISTENT DOWN THE PAGE.~~ **DONE 2026-09-19.** Five things
   Don could see reading it, and every one had the same root: **each programme
   section opens with a `.wrap` at 1140px and everything after it sat loose in
   `.psec` at the full 1280.** Weight Loss kept its content inside the wrap; the
   other three did not, which is exactly the "middle programmes go out to the
   page edges" he described.

   **THE ANCHOR CUT THE PROGRAMME ICON IN HALF.** The nav is sticky and 85px
   tall and the sections had `scroll-margin-top: 0`, so arriving at `#menshealth`
   put the section's top edge under the nav. **From Monday every one of these
   links arrives by text message**, so that was the first thing a patient would
   see. `scroll-margin-top: 104px` on `.psec`.

   **One column width.** `.psec > .card-row, .pcard, .addon-strip, .video-block,
   .tool-embed-card` are capped at **1084px**, not 1140 - `.wrap` is 1140 with
   28px of padding, so its CONTENT is 1084, and content is what these line up
   with. Two wrong answers first: 1140 left the injection video 26px wide, and
   adding padding to compensate made it wider still because the block already
   carries 26px of its own. **Measured to 504px on every video frame rather than
   reasoned about.**

   **The programme video was last in Weight Loss and first in Men's Health.**
   Every section now reads heading, programme video, injection video, content.
   The injection blocks also moved INSIDE the wrap, which is what made them
   render wider than every other video. Done by balanced-div surgery on the
   markup rather than a CSS `order` trick, so the reading order matches the
   visual order for a screen reader too.

   **The tools grid had a hole in it.** Three cards are ~212px tall and the
   protein calculator is 555px, so in a three-column grid it wrapped onto its own
   row and left most of a navy band empty. Now two columns: the calculator spans
   the full height on the left, the three tools stack on the right. Grid height
   803px to 608px.

   **A visible end to each programme**: `.psec + .psec` takes a hairline rule and
   56px either side. They flowed into one another with nothing to mark the join.

   Verified after: 9 videos, 9 facades, injection in exactly 3 sections, every
   frame 504px, no horizontal overflow, no JS errors, **176ms**.

35. ~~LABS AND INJECTION SIDE BY SIDE, AND ONE VERTICAL RHYTHM.~~ **DONE
   2026-09-19.**

   **The Quest video moved into Men's Health and Functional Health & Longevity
   and off the page foot.** Don's ordering and it is the right way round: **labs
   on the LEFT, injection on the RIGHT**, because a patient orders labs before
   they ever draw up a dose, so the page reads in the order they will live it.
   Both programmes require labs before starting. Weight Loss keeps the injection
   video alone - he named those two. `.video-pair` stacks the text ABOVE the
   still in each half; the block is a two-column grid at full width and halving
   it leaves the text column nowhere to go.

   **The spacing was an accident, not a rhythm.** Measured before touching it:
   gaps between blocks in a single section ran **0, 8, 16, 20, 24 and 36px**, and
   two blocks were literally touching. Now one value, 28px, everywhere - verified
   as a single distinct gap across all four programmes. It needs `!important`
   because these blocks carry INLINE margins that beat a stylesheet, and it is
   scoped to direct children so nothing nested inside a card is touched.

   **The wide buttons and the scrolling were the same bug.** Every guide link
   rendered **1040px across to carry about thirty characters**, because `.links`
   is a single-column flex stack at section width. Two columns halves the width
   AND halves the height of every list: **page height 13,925px to 13,127px**, and
   a link is now 515px. Single column again under 760px, where full width is
   right. A list with an ODD number of items spans its first item across both
   columns, so the leftover lands at the top as a feature row rather than at the
   bottom as a hole.

   **The Meal Ideas button dominated the nav** because it was the only filled
   navy element up there, outweighing the four programme links beside it - which
   are the actual navigation. Outline now, filling on hover.

   **The Quest copy said "pairs with the guide above" and no longer does.** It
   was written when the video sat under a lab guide at the foot of the page.
   Moving a block and leaving its copy describing the old neighbours is the same
   defect as a stale comment.

36. ~~THE PAIRED VIDEOS DID NOT LINE UP.~~ **DONE 2026-09-19.** The two halves
   carry different amounts of copy, so the stills started at different heights
   and one card ran taller. Don asked for it, and suggested a spacer above the
   shorter one.

   **A spacer would have been wrong, and measuring showed why: the error runs in
   BOTH directions.** Men's Health had the injection blurb one line SHORTER than
   the labs blurb; Functional Health had it one line LONGER. A hand-tuned value
   would need to differ per section and would break the next time anybody edited
   a sentence. So the text block absorbs the difference instead - `align-items:
   stretch` plus `flex:1` on `.txt` - and the still is pushed to the bottom of
   each card. Same-size stills pinned to the bottom line up at the top too, and
   it holds however the copy changes.

   **Three wrong turns on the way, all caught by looking rather than reasoning:**

   - `flex:1` on the text collapsed `.video-frame` to zero height, because it
     derives its height from `aspect-ratio` and a flex item with no basis will
     happily give that up. **Both videos vanished** and the cards shrank to
     176px. The numbers still said the frame TOPS matched, which they did - at
     zero. `flex:0 0 auto` on the frame.
   - `height:100%` then equalised the cards and pushed the mismatch into the
     frames instead. **That was treating the symptom**, and it is worth noticing
     that it looked like progress.
   - The real cause was upstream and invisible from inside: each card carries an
     **INLINE `margin-top`, 24px on one and 20px on the other**, left from when
     they were standalone blocks in the page flow. 24 minus 20 is the 4px. The
     uniform-spacing reset from item 35 did not reach them because it is scoped
     to direct children of `.psec`, and these now sit inside `.video-pair`.

   Verified to the sub-pixel: card tops, card heights, frame tops and frame
   bottoms all identical in both pairs.

   **No Quest video in Weight Loss or Women's Health**, Don 2026-09-19, recorded
   so nobody adds it for symmetry: **weight loss has no labs**, and women's
   health labs are mail-order, arranged by KORB on request - one patient asked in
   the last year. Not worth the clutter.
