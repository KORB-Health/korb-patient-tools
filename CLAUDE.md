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
`build-addon-signoff.js`, `build-embed.js`). Do not put them back. Four were
byte-identical copies; the fifth had diverged and was silently broken — see below.

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
| `KORB_Injection_Tracker.html` | `korb-dosing-data.js` |
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

Both failures are the same shape: **something reported fine because it never
looked.** Assume that shape is present until a negative test proves otherwise.

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

0. **Apply `KORB_clinical-generators_source_2026-09-13.zip` FIRST.** See above,
   including both traps.
1. **Then** delete the five duplicate `.js` from `Provider_Reference/`.

   **Order is not optional.** Two of the patch's twelve files are
   `Provider_Reference/korb-glp1-data.js` and `Provider_Reference/korb-pharmacies.js`
   — duplicates on the deletion list. Delete them first and `git am` fails trying to
   patch files that no longer exist. Patch, then delete, in that order.
1b. **Switch the clinical references to the medical PA.** Headers currently read
   "KORB Health Group" (the MSO). KORB Health Group LLC is the management services
   organization and is NOT a clinical provider; KORB Health Medical Texas PA holds
   licensure and prescribing authority. Clinical documents must carry the PA. Carried
   over from the other session's task list.
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
