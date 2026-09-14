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
  korb-pharmacies.js               shared pharmacy/state layer  (NOT YET WIRED — see Open work)
  provider-doc-render.js           render module, GLP-1 monographs
  fhl-doc-render.js                render module, FH&L references
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

| Page | Loads |
|---|---|
| `KORB_GLP1_Provider_Reference.html` | `korb-glp1-data.js` |
| `KORB_GLP1_Patient_Message_Builder.html` | `korb-glp1-data.js` |
| `KORB_GLP1_Pharmacy_Routing.html` | `korb-glp1-data.js` |
| `Provider_Reference/GLP1/*.html` (10) | `../../korb-glp1-data.js` |
| `KORB_Provider_Clinical_Reference.html` | `korb-dosing-data.js` |
| `KORB_Functional_Health_Tracker.html` | `korb-dosing-data.js` |
| `KORB_Patient_Treatment_Schedule.html` | `korb-dosing-data.js` |
| `Provider_Reference/KORB_FHL_*.html` (4) | `../korb-dosing-data.js` |

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
`Provider_Reference/KORB_BMI_Protein_Calculator*.html`,
`Provider_Reference/KORB_AddOn_Selector.html`

Note: `KORB_AddOn_Selector.html` and `KORB_Optimization_Products.html` are the same
file under two names. Reconcile or delete one.

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

## Generators

Run all of them **from the repo root**.

| Script | Reads | Writes |
|---|---|---|
| `build-provider-docs.js` | `korb-glp1-data.js` | `Provider_Reference/GLP1/*.html` + `.pdf` (10 docs) |
| `build-fhl-docs.js` | `korb-dosing-data.js` | `Provider_Reference/KORB_FHL_*.html` + `.pdf` (4 docs) |
| `build-embed.js` | `korb-glp1-data.js`, `korb-addons-data.js` | embedded blocks in the two frozen tools |
| `build-signoff-sheet.js` | `korb-glp1-data.js` | monograph clinical sign-off sheet |
| `build-addon-signoff.js` | `korb-addons-data.js` | add-on sign-off sheet |

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

**NEXT →**
1b. **Switch the clinical references to the medical PA.** PARTLY DONE. KORB Health
   Group LLC is the management services organization and is NOT a clinical provider;
   KORB Health Medical Texas PA holds licensure and prescribing authority, so a
   clinical document must carry the PA. The Add-On Clinical Reference was corrected
   in `a56f812` and now carries the PA 22 times and the MSO once, in the disclaimer.
   **Still outstanding for the other 14 documents, and it is two lines:**
   `provider-doc-render.js:598` and `fhl-doc-render.js:490`, both bylines. The
   disclaimer paragraphs at `provider-doc-render.js:625` and `fhl-doc-render.js:516`
   are already correct — leave them.
   Do NOT mass-replace "KORB Health Group" across the data files. 131 occurrences
   look like one find-and-replace and are not. All 100 in `korb-glp1-data.js` are
   inside pharmacy instruction text ("bill KORB Health Group and ship to the
   patient"), where the MSO genuinely is the contracting entity. Replacing those
   would send the wrong entity to three pharmacies.
2. **Reshape `korb-pharmacies.js`** to program-keyed, add the cross-file self-check.
3. **Wire GLP-1 onto it.** Do GLP-1 first: best self-check coverage, and there is a
   verified 51-state routing baseline to diff against, so a mistake shows up
   immediately. Baseline as of v2.17: FarmaKeio 40 states, Premier 10, Belmar 1 (CA).
   California is single-source — Premier and FarmaKeio both hard-blocked.
4. **Wire FH&L onto it** (`korb-dosing-data.js`).
5. **Retire the hand-built tables.** `KORB_GLP1_Dose_Guide.html` first — it is the
   one that already failed.
6. **Create `korb-trt-data.js` and `korb-womens-data.js`.** New construction, not
   cleanup. Should not block 2–5.
7. Reconcile `KORB_AddOn_Selector.html` / `KORB_Optimization_Products.html`.
8. Fix the stale comment in `build-provider-docs.js` — says "eleven documents",
   the list holds ten (Greenwich tirzepatide retired 2026-09-11).
9. **`build-signoff-sheet.js` cannot run on either machine.** Line 306 writes to
   `/mnt/user-data/outputs/monograph-signoff.html`, a Cowork sandbox path, so it
   exits with ENOENT. Third instance of a sandbox path committed as if it were a
   real one, after `loadChromium()` in both document builders. Found 2026-09-13
   while checking the generators after the `Provider_Reference/` deletion; it
   predates that work and is unrelated to it. Should write next to the other
   generated documents. Worth grepping for `/mnt/` and `/home/claude` before
   trusting any script in here that has not been run on this machine.
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
11. **Scheduler intake — Men's Health and Women's Health question sets.**
   `KORB_Scheduler_Intake_AllPrograms.html` now carries Weight Loss and Functional
   Health & Longevity. The other two programs select at step 3 and then bring no
   questions. Build them the way FH&L was built: read the approved Tebra
   questionnaire first, restate it as conditional logic, change nothing clinical.
   **`KORB_Scheduler_Intake_Prototype.html` stays frozen** until Lindsay has
   reviewed it. She has that exact URL. New work goes in AllPrograms.
   Two things in AllPrograms need Don before it goes to anyone: the telemedicine
   and peptide **consent text is draft** and marked as draft in the file, and the
   FH&L decline copy is new wording about the $99.
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
- Tebra caps: portal message 1000 characters, `ptInstructions` 140,
  `pharmacyNotes` 170.
- Vial discard language follows USP <797>: a multi-dose container is 28 days from
  first entry **or** the assigned BUD, whichever is shorter. Never tell a patient to
  disregard a printed date.
- Data file changes bump `meta.version` and `meta.lastUpdated` and add a changelog
  entry saying plainly whether clinical content changed.

## Two-computer workflow

Work happens on a desktop and a laptop.

- `git pull` before starting. Every time, on both machines.
- `git push` before stopping. Every time, on both machines.
- Never leave a machine with uncommitted work; the other machine cannot see it.
- If a pull conflicts in a data file, stop and resolve deliberately. Do not take
  "theirs" or "ours" wholesale — a data file conflict is two real clinical edits.
