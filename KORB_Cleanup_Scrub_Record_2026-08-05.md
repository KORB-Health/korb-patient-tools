# KORB Cleanup Scrub Record
**Date:** 2026-08-05
**Scope:** Claude project file version scrub + `korb-health/korb-patient-tools` content consistency scrub
**Method:** Every project file that also exists in the live repo was compared by MD5 checksum, not by filename.

---

## Part A. Changes applied to live tool files

Four files were edited. JS syntax validated with `node --check` after editing. Byte deltas confirm no unintended changes.

| File | Change | Delta |
|---|---|---|
| `KORB_Patient_Treatment_Schedule.html` | Foundation BPC-157 `onWeeks:[1,6]` to `[1,8]`; patient copy "typically 6 weeks" made duration-neutral | +94 B |
| `KORB_Provider_Clinical_Reference.html` | Foundation BPC-157 `onWeeks:[1,6]` to `[1,8]`; schedule string "Active Weeks 1-6, off Weeks 7-16" to "Active Weeks 1-8, off Weeks 9-16"; monitoring item "(per GHK-Cu lab panel)" to "(baseline Standard panel)"; dead `PHARM` quick-reference sub-objects deleted | -1,247 B |
| `KORB_Patient_Hub.html` | Broken link fixed: `Patient_Education/KORB_Schedule_Your_Lab_Appointment.pdf` to root path | -18 B |

**Patient copy wording used** (replaces "BPC-157 is a short-course therapy, typically 6 weeks."):

> BPC-157 is a short-course therapy. It runs for part of your 16-week cycle rather than all of it; your schedule above shows your exact active weeks.

Rationale: the original sentence was shared by Foundation and Gateway/Peak, and is only true for Gateway/Peak now that Foundation is 8 weeks. Neutral wording is accurate for both without asserting a duration.

---

## Part B. Held for a decision, not changed

### B1. RESOLVED. BPC-157 prescription supply conflict
Two blocks inside `KORB_Provider_Clinical_Reference.html` disagree:

- `RX.bpc157` (the actual Tebra Compounded Drug Favorite fields): **Days Supply 56** for both pharmacies. Premier Qty 12 ml / Refill 0. Greenwich Qty 10 ml / Refill 0.
- `PHARM.greenwich.bpc` / `PHARM.premier.bpc` (quick-reference used by the Rx snapshot cards and the note generator): **Greenwich "6 weeks + 0 refills"**, **Premier "4 weeks + 1 refill"**.

**Resolution (Don, 2026-08-05):** Tebra Days Supply stays at 56 for both pharmacies, because 56 days is what must ship even though not all of it will be used. Greenwich quick-reference stays at 6 weeks, 0 refills. Premier moved to a 90-day BUD consolidated fill, so its quick-reference was corrected from "4 weeks + 1 refill" to "56 days + 0 refills". The refill count was a leftover from the pre-BUD split-fill model.

**Root cause of why this survived:** the `PHARM.greenwich.serm/.bpc` and `PHARM.premier.serm/.bpc` sub-objects are dead data. `PHARM` is only read for `ph.name` and `ph.color`. The `conc`, `vial`, `rx`, and `instr` fields render nowhere, confirmed by zero consumption of `.vial`, `.rx`, `ph.serm`, and `ph.bpc` anywhere in the file. Nobody caught the stale refill values because they never appeared on screen.

**Still open, same defect:** `PHARM.premier.serm` still reads `4 weeks + 2 refills`. Its own Tebra field says Days Supply 84, Refill 0. Correcting it to "84 days + 0 refills" was not explicitly authorized, so it was left alone.

**Action taken (2026-08-05):** the `serm` and `bpc` sub-objects were deleted from `PHARM`. `PHARM` now holds only `name` and `color`, and `RX` is the single source for all quantity, refill, and days-supply values. The stale comment describing `PHARM` as a "quick-reference dosing summary used in Rx snapshot cards + Tebra note generator" was replaced with an accurate one.

**Premier 90-day BUD verification:** the full `RX` object was parsed in Node and every entry checked. All 24 agent/pharmacy combinations already carry **Refill 0**. Premier Sermorelin is **Days Supply 84, Refill 0**, which is already correct for a consolidated fill under the 90-day BUD. No Sermorelin correction was needed; the only stale refill values lived in the dead `PHARM` block that has now been removed.

| Agent | Premier Days Supply | Greenwich Days Supply | Refills |
|---|---|---|---|
| Sermorelin 200/300/400/500 | 84 | 84 | 0 |
| BPC-157 | 56 | 56 | 0 |
| CJC-1295/Ipamorelin 100/150/200 | 84 | 84 | 0 |
| GHK-Cu | 28 | 28 | 0 |
| Tesamorelin 1 / 1.5 / 2 mg | 84 | 84 | 0 |

### B2. RESOLVED. Patient Hub Circle card
Decision: keep for now. No change made.

### B3. CORRECTED AND CLOSED. Hub tool links
The original audit finding was wrong. The first link scan only checked absolute URLs and missed relative ones. `KORB_Functional_Health_Tracker.html` was already embedded in the hub as an iframe with an Expand link, so it was reachable all along.

`KORB_Injection_Tracker.html` is Luis's build and is not the tool going forward; the Functional Health Tracker is. Per Don, no links to it anywhere, and the file itself stays in the repo untouched because Luis has no GitHub access and reaches it by URL. A search of the repo PDFs and the project DOCX files found **zero** existing references to it, so nothing had to be removed. The tracker file was reverted to its exact live bytes and is excluded from the upload set.

**Residual risk to note:** the live `KORB_Injection_Tracker.html` still carries Foundation BPC-157 at Weeks 1 to 6, and it is publicly reachable at its URL. Not fixed, per instruction. Worth revisiting when Luis's build is formally retired.

### B4. Weight Loss, Men's Health, Women's Health hub sections have no guides
`KORB_GLP1_Dose_Guide.html`, `KORB_WeightLoss_Program_Overview.pdf`, `KORB_Patient_Ed_Semaglutide.pdf`, and `KORB_Patient_Ed_Tirzepatide.pdf` were built previously but are not in the repo.

### B5. "No STAT designation needed" appears 15 times
The instruction is correct but still puts the word STAT in front of providers.

### B6. `korb-dosing-data.js` is still not wired into three tools
Only `KORB_Functional_Health_Tracker.html` reads it. This is the root cause of the BPC-157 drift: any dosing change currently requires four separate edits. Wiring the other three is a real refactor and should be scheduled deliberately.

---

## Part C2. Repo PDF content audit (14 files)

Text extracted from all 14 PDFs with `pdftotext -layout` and scanned. **All clean, and already ahead of the HTML tools.**

- `KORB_Foundation_Program_Overview.pdf` correctly states BPC-157 is active for the first 8 weeks of the 16-week cycle followed by an 8-week washout
- `KORB_Patient_Ed_BPC157.pdf` correctly contrasts the Foundation 8-week course against the Gateway/Peak 6-week course beginning two weeks after start
- No Injury Add-On, hs-CRP, retired agents, FarmaKeio, FKO, Belmar, or `pacstevenson` URLs in any PDF
- No Injection Tracker references in any PDF
- All 13 internal hyperlinks in `KORB_Welcome_Letter.pdf` resolve to real repo paths, verified by extracting PDF link annotations with pypdf

This confirms the PDFs were updated to the 8-week Foundation course and the HTML tools were the ones that had drifted.

## Part C. Verified clean

- IGF-1 targets match across the Provider Clinical Reference and Lab Interpretation Tool: 120 to 160 goal band, reduce-dose ceiling >190 male / >170 female
- CJC-1295/Ipamorelin is 1:1 (100/150/200) everywhere. No 105/175 remnants.
- No retired agents (TB-500, AOD-9604, Epithalon, Thymosin Alpha-1) anywhere live
- No FarmaKeio, FKO, or Belmar in FH&L tools
- No hs-CRP anywhere live
- No `pacstevenson.github.io` URLs anywhere live
- GHK-Cu correctly gated out of Foundation in all tools
- Foundation correctly offers exactly three agents
- All Patient Hub links resolve to real repo paths, absolute and relative, rechecked after the fix
- Every `RX` Tebra field across all agents and both pharmacies carries Refill 0
- Lab panel names match confirmed Quest naming

---

## Part D. Manual actions required

### D1. Push to GitHub
The three corrected files must be uploaded through the GitHub web UI. They are too large to pass through the GitHub connector in a single call.

Repo: `korb-health/korb-patient-tools`, branch `main`, root directory. Add file > Upload files > drag all three > Commit.

Upload exactly these three. Do **not** upload `KORB_Injection_Tracker.html`; it is deliberately left at its current live version.

1. `KORB_Provider_Clinical_Reference.html`
2. `KORB_Patient_Treatment_Schedule.html`
3. `KORB_Patient_Hub.html`

Suggested commit message:

```
Fix Foundation BPC-157 course length (6 to 8 weeks), remove dead PHARM dosing block, fix broken hub lab PDF link, correct stale GHK-Cu panel reference
```

### D2. Claude project Files tab: delete these 14 files

Superseded versions:
- [ ] KORB_Patient_Treatment_Schedule__20_.html
- [ ] KORB_Patient_Treatment_Schedule_v7.html
- [ ] KORB_Patient_Treatment_Schedule_v29.html
- [ ] KORB_Patient_Treatment_Schedule_v34.html
- [ ] KORB_Patient_Treatment_Schedule.html
- [ ] KORB_Provider_Clinical_Reference_v13_Complete.html
- [ ] KORB_Provider_Clinical_Reference.html
- [ ] KORB_Provider_Clinical_Reference__16_.html
- [ ] KORB_Patient_Hub_v2.html
- [ ] KORB_Peak_Clinician_Reference.html
- [ ] KORB_Provider_Formulary_Lab_Reference__7_.html
- [ ] KORB_Sermorelin_Patient_Ed_v2.pdf

Byte-identical duplicates:
- [ ] KORB_GLP1_PricingFlyer_1.webp
- [ ] KORB_Longevity_PricingFlyer_1.webp

### D3. Claude project Files tab: upload these 6 files
- [ ] KORB_Patient_Treatment_Schedule.html (corrected)
- [ ] KORB_Provider_Clinical_Reference.html (corrected)
- [ ] KORB_Patient_Hub.html (corrected)
- [ ] KORB_Functional_Health_Tracker.html
- [ ] KORB_Lab_Interpretation_Tool.html
- [ ] korb-dosing-data.js

Do D1 before D3 so the repo and the project hold identical bytes.

### D4. Leave alone, verified in sync with live
All 12 Patient_Education PDFs, `KORB_Welcome_Letter.pdf`, `KORB_Schedule_Your_Lab_Appointment.pdf`.

### D5. Open question
`KORB_PreVisit_Brief_Generator__2_.html` has no stale content but is not in the live repo. Shelved or in progress? The `__2_` suffix is a browser download artifact and should be stripped from any file that stays.
