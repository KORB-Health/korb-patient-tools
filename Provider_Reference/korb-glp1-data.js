/* ============================================================================
   KORB HEALTH — SHARED GLP-1 DOSING, PHARMACY & PRESCRIBING DATA
   Single source of truth for GLP-1 (semaglutide / tirzepatide) dosing,
   pharmacy routing, state coverage, Tebra prescribing fields, and charge
   codes across KORB tools and documents.

   VERSION: 1.0   CREATED: 2026-08-06

   WHY THIS FILE EXISTS
     The same facts — Premier's ship-to state list, dose ladders, Tebra
     Compounded Drug Favorite fields, charge codes — were duplicated across
     eight pharmacy documents plus the provider and patient tools. A single
     typo in one copy (UT rendered as UV in a Premier state list) survived
     because there was no canonical copy to check against. Every downstream
     document and tool should now derive from this file.

   HOW TO USE
     <script src="korb-glp1-data.js"></script>
   Then reference KORB_GLP1 instead of any local copy.

   VISIBILITY MODEL — READ THIS BEFORE BUILDING ANY TOOL
     Every product carries a `visibility` value. The data lives here in full;
     what surfaces is a rendering decision, not a data decision.
       'patient'   safe to render in patient-facing tools and documents
       'provider'  provider tools only — never render patient-side

     CONFIRMED POLICY (2026-08-06): patients never see dose ladders, mg values,
     unit counts, pharmacy names or pricing. Every product in this file is
     therefore 'provider'. `patientSafeProducts()` returning an empty array is
     correct behaviour, not a bug — do not "fix" it by relabelling products.

     Patient-facing tools render from `patientView()`, which strips the ladder
     and returns only route, frequency, and the counseling and safety language.
     Brand-name products (Zepbound, Oral Wegovy) are additionally never named
     patient-side: KORB prescribes them for existing patients but does not
     advertise them.

   CONVENTIONS
     - `supply4` / `supply8` = 4-week and 8-week program variants.
     - `rx` blocks are the exact Tebra Compounded Drug Favorite field values.
       Copy them literally. Do not paraphrase into a prescription.
     - `derived: true` marks a value this file computed rather than copied
       from a source document. Verify before it reaches a patient.
     - Anything in KORB_GLP1.needsConfirmation is NOT cleared for use.
   ============================================================================ */

var KORB_GLP1 = {

  meta: {
    version: '2.16',
    created: '2026-08-06',
    lastUpdated: '2026-09-11',
    owner: 'Director of Clinical Operations',
    signoff: {
      clinical: 'Clinical Director — dosing, titration, contraindications',
      compliance: 'VP Finance/Compliance — pricing, charge codes, program structure'
    },
    derivedFrom: [
      'Premier_Pharmacy_-_Semaglutide_11-26-2025',
      'Glycine_Premier_Pharmacy_-_Semaglutide_11-26-2025',
      'Premier_Pharmacy_-_Tirzepatide_11-26-2025',
      'Belmar_Pharmacy_-_Semaglutide_11-26-2025',
      'Belmar_Pharmacy_-_Tirzepatide_06-01-2026',
      'Farmakeio_Pharmacy_-_Semaglutide_11-26-2025',
      'Farmakeio_Pharmacy_-_Tirzepatide_11-26-2025',
      'Greenwich_Pharmacy_-_Tirzepatide_11-26-2025',
      'Zepbound_and_Oral_Wegovy'
    ],
    changelog: [
      '2026-09-11 (v2.16): GREENWICH GLP-1 RETIRED, EVERY STATE. Greenwich told KORB ' +
      'it can no longer ship to California. California was the trigger, but the ' +
      'decision Don made is wider than California: rather than carve one state out of ' +
      'a pharmacy that was already continuation-only, the whole Greenwich GLP-1 line ' +
      'is retired. greenwich_tirz is status "retired" and is no longer a prescribable ' +
      'option anywhere, for a new start or an established patient. All tirzepatide ' +
      'moves to Belmar, California first. The pharmacy record stays in the file and ' +
      'the product record stays with its sigs and charge codes, because an order ' +
      'placed before today still has to be readable - neither is a live route. ' +
      'Greenwich is removed from the three 8-week standard charge-code pharmacy lists ' +
      'for the same reason: the codes are unchanged, Greenwich simply cannot be on a ' +
      'new order. SEPARATELY, and do not collapse the two: Greenwich also stopped ' +
      'shipping to AR, CA, IN, NH and WA outright. That is a peptide and Functional ' +
      'Health & Longevity question, not a GLP-1 one, and it closes FH&L in all five ' +
      'states because Premier cannot ship to any of them either. The FH&L state lists ' +
      'live in korb-dosing-data.js and were updated in the same pass. Source: Don ' +
      'Stevenson, 2026-09-11.',

      '2026-09-06 (v2.15): BRAND TYPEFACE. The KORB guidelines specify Montserrat ' +
      'ExtraBold for headlines and Montserrat Regular for body copy. The documents ' +
      'were set in Archivo and Source Serif and the provider tool in Arial, so none ' +
      'of them was on brand. All three are now Montserrat throughout. Four weights ' +
      'are EMBEDDED in provider-doc-render.js as subsetted woff2 data URIs rather ' +
      'than pulled from Google Fonts: a document opened from an intranet behind a ' +
      'proxy that blocks external CDNs still renders in the brand face, the PDF ' +
      'build does not depend on Montserrat being installed on whichever machine ' +
      'runs it, and an offline copy keeps its typography. Subsetted to Latin plus ' +
      'the punctuation these documents actually use - 68 KB for all four weights ' +
      'against 350 KB for the full families. The literal Tebra values lost their ' +
      'monospace face, since that face is not in the guidelines; the copy-this- ' +
      'exactly signal is now a tinted panel and open letter-spacing instead. The ' +
      'provider tool also moves off the near-miss shades #1E2D5B and #00B4C8 onto ' +
      'brand navy #21275B and teal #00B2C3. GUARD ADDED, proved by renaming the ' +
      'family and watching the build fail: the builder inspects every PDF it ' +
      'produces and refuses to report success if any non-Montserrat face is ' +
      'embedded. A dropped @font-face falls back to Helvetica silently and the page ' +
      'still looks plausible, which is exactly the kind of defect that ships. ' +
      'Presentation only - no data changed, and the three sign-off records stay ' +
      'current, verified rather than assumed.',

      '2026-09-06 (v2.14): SIGNED OFF. Don Stevenson, PA-C, Director of Clinical ' +
      'Operations and Lead Provider, reviewed all three monographs against v2.13 and ' +
      'approved them with no changes and no exceptions. Records written to ' +
      'monographSignoff.records, each pinning the fingerprint that monograph had ' +
      'when he read it. All eleven provider documents lose the red "Not cleared for ' +
      'distribution" gate and instead carry a line naming him as reviewer, the date ' +
      'and the fingerprint. Orforglipron is signed flat rather than with an ' +
      'exception, at his direction; its own verify-against-prescribing-information ' +
      'flag still renders on the Foundayo document independently of the sign-off, ' +
      'so the newest agent keeps its caveat either way. WHAT THIS DOES NOT DO: the ' +
      'sign-off covers the text as it stood. Editing any monograph turns its record ' +
      'STALE, restores the gate on that molecule\'s documents and fails the build ' +
      'until it is re-reviewed. That is the point of the fingerprint and it is ' +
      'verified by regression, not asserted.',

      '2026-09-06 (v2.13): COST IS OUT OF THIS FILE, IN WORDS AS WELL AS FIGURES, ' +
      'AND THE FINANCE ITEMS ARE GONE. Don, 2026-09-06: this is a clinical project ' +
      'and cost was only ever working data for sizing vials. That work is finished. ' +
      'Removed BELMAR-VIAL-RATE-QUOTES (a procurement task, every word about what ' +
      'KORB pays) and BELMAR-8WK-CODE-RETIRE (a Finance confirmation; the ' +
      'retirement decision itself stays recorded in this changelog and in the ' +
      'pharmacy record). BELMAR-DAY28-USABLE stops being an open question and ' +
      'becomes a stated assumption, BELMAR-DAY28-DOSE-CEILING: four doses per vial, ' +
      'never five, as the conservative reading of a 28-day in-use limit on a vial a ' +
      'patient draws from at home. needsConfirmation is now EMPTY. THE PART THAT ' +
      'MATTERED MORE THAN THE DELETIONS: v2.5 removed the cost FIGURES but left the ' +
      'cost REASONING - text still said one vial option cost materially more and ' +
      'that a Belmar confirmation would make several rows cheaper. That is ' +
      'acquisition cost stated in words rather than numbers, and on a public file ' +
      'it is the same disclosure. Rewritten in the accepted limitation, the Belmar ' +
      'routing note and the vial constraints. GUARD REWRITTEN AND WIDENED: it ' +
      'checked currency symbols in two lists; it now walks the WHOLE file except ' +
      'the patient-pricing block and costPolicy, and fails on cost LANGUAGE as well ' +
      '- acquisition cost, rate card, what KORB pays, negotiated rate, rows getting ' +
      'cheaper. Both leaks found today were outside the two lists the old guard ' +
      'looked at. Verified by regression on four separate injections. SIG: the ' +
      '8-week and 12-week brand injectable records drop "for 4 weeks" - on a ' +
      'prescription carrying refills that reads as an instruction to stop. Fill ' +
      'length is carried by quantity, refill and days supply. The 4-week records ' +
      'keep it, because there the sig and the fill say the same thing.',

      '2026-09-06 (v2.12): PERI-PROCEDURAL HOLD IS NOW A NUMBER, AND THE BRAND ' +
      'PROGRAMS ARE REBUILT. Don, 2026-09-06. All three monographs previously told ' +
      'a provider to hold GLP-1 therapy before an elective procedure and did not ' +
      'say for how long, which in practice meant each provider picked their own ' +
      'answer. They now state: hold 7 days (one week) before an elective procedure ' +
      'requiring sedation, or longer if the anaesthesia team or the surgeon\'s ' +
      'office requires it - their instruction takes precedence. BRAND SUPPLY: brand ' +
      'pharmacies will not ship more than 4 weeks of an INJECTABLE per shipment, so ' +
      'Zepbound and the Wegovy pen now offer 4-week (refill 0), 8-week (refill 1) ' +
      'and 12-week (refill 2) - the same fill repeated, days supply 28 throughout ' +
      'because days supply describes the fill. Orals are not subject to that ' +
      'ceiling and dispense as one fill, so oral Wegovy and Foundayo now offer 30, ' +
      '60 and 90 day supplies, quantity equal to days, no refills. Every new record ' +
      'was CLONED from its 4-week or 30-day sibling rather than retyped, so it ' +
      'cannot disagree on drug string, sig or quantity. RENDERER FIX FOUND WHILE ' +
      'DOING THIS: sectionRx read supply keys from a hardcoded array, so every ' +
      'rx12 and rx90 record would have silently not rendered - the documents would ' +
      'have looked complete while missing a program providers had been told to use. ' +
      'It now reads the keys from the product\'s own dispensing list and surfaces ' +
      'any record the list does not declare. THREE GUARDS ADDED, each proved by ' +
      'deliberate breakage: a program declared with no matching dose records, a ' +
      'dose record no program declares, a dose record whose quantity/refill/days ' +
      'disagree with its program, and a label whose week count does not equal ' +
      '(refill + 1) x days. All four are the copy-a-sibling-and-forget-a-field ' +
      'mistake this change was one slip away from making.',

      '2026-09-06 (v2.11): CLINICAL SIGN-OFF IS NOW A MECHANISM, NOT A TO-DO. ' +
      'MONOGRAPH-CLINICAL-SIGNOFF is removed from needsConfirmation and replaced ' +
      'by monographSignoff plus signoffStatus(), a state computed per molecule at ' +
      'render time. Each record pins a fingerprint of the monograph AS SIGNED ' +
      '(monographFingerprint: FNV-1a over a canonical sorted serialisation, ' +
      'covering every field except the molecule name). Three states: unsigned ' +
      'renders the red gate, current renders an attribution line at the foot of ' +
      'the clinical section, and stale - meaning the monograph was edited after ' +
      'signing - renders the gate again AND fails selfCheck. The reason for the ' +
      'fingerprint is the whole point: a sign-off recorded as a date and a name ' +
      'would sit on top of text the signer never saw the moment anyone edited a ' +
      'contraindication, putting a clinician\'s name over content they did not ' +
      'approve. Verified end to end by signing tirzepatide, confirming the gate ' +
      'cleared, then appending one caution and confirming the gate returned and ' +
      'the build refused. BRAND-DOC-OUTDATED CLOSED: three brand documents now ' +
      'generate from this file, and both defects it named were checked and are ' +
      'absent - Foundayo present, Zepbound/Wegovy quantities not swapped. ' +
      'Remaining open items are all external: two need Belmar in writing, one ' +
      'needs Finance.',

      '2026-09-06 (v2.10): THE TWO OPEN INDICATION QUESTIONS ARE CLOSED. Don ' +
      'confirmed KORB treats adults 18 and older only, so the sixth semaglutide ' +
      'indication held in v2.9 is now permanently absent rather than pending, and ' +
      'SEMA-ADOLESCENT-INDICATION is removed from needsConfirmation. The rule is ' +
      'stated POSITIVELY as clinical.candidateCriteria.age - "adults 18 and older, ' +
      'KORB does not treat patients under 18" - which renders on all eleven ' +
      'documents. An omission is not a policy: semaglutide is approved from age 12, ' +
      'so a provider reading an approval list with no age line has nothing telling ' +
      'them KORB is narrower. Orforglipron indications supplied by Don and stored, ' +
      'with a korbScope note, closing the Foundayo gap where the document rendered ' +
      'with no Indications section at all. GUARDS ADDED, both regression-tested by ' +
      'deliberate breakage: selfCheck now fails if any of the three molecules loses ' +
      'its indications, its korbScope or its indicationsSource, and fails if the age ' +
      'rule is dropped. A missing indications section and a wrong one are the same ' +
      'defect - the provider is not reading this drug\'s indications.',

      '2026-09-05 (v2.9): INDICATIONS ARE NOW PER MOLECULE, WITH A SCOPE NOTE. Don ' +
      'supplied semaglutide\'s. Both monographs now carry their own indications plus a ' +
      'korbScope note stating that KORB treats weight loss ONLY and every other ' +
      'indication stays with the patient\'s PCP or specialist - KORB does not manage ' +
      'type 2 diabetes, cardiovascular risk, chronic kidney disease, MASH or sleep ' +
      'apnea and does not order or monitor labs for them. The renderer places that ' +
      'note immediately beneath the indication list inside the same section, because ' +
      'separated the list reads to a provider as a menu of things KORB does. ' +
      'clinical.candidateCriteria.fdaApproved is RETIRED - that shared list was ' +
      'semaglutide\'s and every drug inherited it, which is how the Belmar tirzepatide ' +
      'document came to carry semaglutide indications. Marked fdaApprovedRetired and ' +
      'skipped by the renderer. FIXED A REGRESSION OF MY OWN: skipping that shared ' +
      'list in v2.8 left the five semaglutide documents and Foundayo with no ' +
      'Indications section at all - a wrong list traded for a missing one. Semaglutide ' +
      'is now correct; orforglipron still has none and needs Don. HELD, NOT GUESSED: ' +
      'the sixth semaglutide indication Don listed reads "adolescents >= 18 years", ' +
      'which is internally inconsistent - adolescent means 12 to 17 and 18-plus is an ' +
      'adult already covered by the first indication. The approved adolescent ' +
      'threshold is 12. It is deliberately absent rather than corrected, because a ' +
      'provider document listing an adolescent indication reads as authorising ' +
      'treatment of a minor, and the prior question is whether KORB treats under-18s ' +
      'at all. See SEMA-ADOLESCENT-INDICATION. ALSO FIXED: sectionGate rendered every ' +
      'high-severity open item on every document, so the moment a semaglutide-specific ' +
      'item existed it appeared on the tirzepatide and orforglipron documents - the ' +
      'same cross-molecule leak this rebuild exists to fix, reproduced inside the gate ' +
      'meant to warn about it. Items carrying appliesTo now render only on matching ' +
      'documents; items without it still render everywhere. Verified: the adolescent ' +
      'item appears on the three semaglutide documents and none of the others.',

      '2026-09-05 (v2.8): BELMAR TRIMMED TO MATCH THE OTHER PHARMACIES. Belmar was ' +
      'carrying ten pharmacy notes where Premier and Farmakeio carry four, plus a ' +
      'rendered vial-plan panel no other pharmacy had. None of the extra weight was ' +
      'clinical - it was accumulated working notes. Don asked for it cleaned up and ' +
      'made consistent, and this is that pass. REMOVED FROM THE SIGS: the ' +
      '"Compound date must be within 41 days of ship date" clause, off all 11 8-week ' +
      'pharmacy-instruction fields. The BUD is the pharmacy\'s to manage and stating ' +
      'it on the order added nothing a prescriber acts on; the figures stay in ' +
      'vialConstraints.bud as reference, marked deliberately not stated. Pharmacy ' +
      'notes drop from 158 characters back to 114. NOTES REMOVED, five of ten: the ' +
      'stale QUANTITY NOT YET CONFIRMED warning, which the v2.2 vial plans closed ' +
      'and which had been contradicting the file ever since; the L-carnitine line, ' +
      'which is tirzepatide-specific and was surfacing on the semaglutide view ' +
      'because pharmacy notes are shared across both drugs; and three notes stating ' +
      'things a provider already knows - that Belmar doses in mg, that the sig ' +
      'describes the fill, and that 1.0 mg draws a full 100-unit syringe. The ' +
      'historical Greenwich note was tightened to its one operational sentence. Five ' +
      'notes remain, all of them things a provider cannot infer: routing, the single ' +
      'fill, the standard charge code, the two concentrations by dose band, and the ' +
      'syringes-go-in-the-directions rule, which is the one that actually bites. ' +
      'PANEL REMOVED from the provider tool: the vial-plan block that rendered ' +
      'doses-per-vial, leftover volume and the compound-to-ship window. The data ' +
      'stays in the file and selfCheck still enforces it - it is simply no longer ' +
      'rendered. NOTE FOR THE RECORD: this also removed the cross-vial draw line for ' +
      'tirzepatide 7.5, 12.5 and 15 mg, which told a provider that some doses finish ' +
      'one vial and draw the remainder from the next. That was the one item in the ' +
      'panel a provider could not work out unaided, and it does not fit the ' +
      '140-character sig. Flagged to Don rather than silently kept.',

      '2026-09-05 (v2.7): DISCARD INSTRUCTION MADE PROGRAM-WIDE, PLUS TIRZEPATIDE ' +
      'INDICATIONS. Three answers from Don landed together. (1) The vial-discard ' +
      'instruction now reads "Discard after 4 doses or 28 days." and sits on all 88 ' +
      'compounded injectable sigs across Premier, Premier glycine, Belmar, Farmakeio ' +
      'and Greenwich, both programs - not just the three oversize semaglutide doses ' +
      'it was added to on the first pass. Don asked for consistency, and the wording ' +
      'is harmless where a vial empties before four doses and protective where it ' +
      'does not. It was sized to the cap before being written: at 139 of 140 ' +
      'characters on the longest record, belmar_sema 0.25 mg 4-week, it fits with one ' +
      'character spare, and "Discard vial after 4 doses or 28 days" does not fit at ' +
      'all. Oral products are excluded - there is no vial to discard. 66 sigs also ' +
      'gained a full stop where the base sentence previously ran straight into the ' +
      'new one. The accepted-limitation requiresSigText was updated to match, so the ' +
      'guard tracks the new wording rather than the old. (2) Tirzepatide indications ' +
      'are now stored on its monograph, supplied by Don. This surfaced because the ' +
      'Belmar tirzepatide source document carried SEMAGLUTIDE\'s indication list - a ' +
      'provider reading the tirzepatide document was reading the wrong drug. Storing ' +
      'them per molecule means no generated document can inherit the wrong set. ' +
      '(3) The two-code oral semaglutide arrangement was confirmed CORRECT, not a ' +
      'defect. Belmar makes one tablet strength at twice the concentration, so a ' +
      '0.5 mg patient takes half a tablet and needs 45 for 90 days; Premier and ' +
      'Farmakeio stock a dot per strength and dispense 90 either way. The 90 and 180 ' +
      'in the code names are price tiers, not tablet counts. Reasoning is now written ' +
      'into the pricing block with an explicit do-not-fix note, because it reads as ' +
      'an inconsistency to anyone auditing it and the quantities are right.',

      '2026-09-05 (v2.6): ONE ACCESSOR FOR BILLING. Confirmed with Don that program ' +
      'pricing and charge codes stay in the provider documents; only KORB cost prices ' +
      'come out. This entry is the consistency pass on top of that. There were SIX ' +
      'different shapes for "the charge code": tirzepatideTiers.<tier>.fourWeek.code, ' +
      'tirzepatideTiers.<tier>.eightWeek.codes.standard.code, ' +
      'semaglutide.fourWeek.bands[].code (absent on two of the three bands), ' +
      'semaglutide.eightWeek.codes.standard.code, oral reached through the dose\'s ' +
      'chargeCode, and brandName.billingCode. Every consumer had to branch on product ' +
      'type to find one, and each could get it wrong differently - which is exactly ' +
      'how the retired Belmar code stayed live in the 8-week table after it was ' +
      'retired. NEW: billingPrograms(productKey) lists the program lengths a product ' +
      'offers, and billingFor(productKey, program, dose) returns the SAME object for ' +
      'all 16 products and all 28 product-program combinations: { productKey, ' +
      'program, programLabel, options[], note }. options is always an array, because ' +
      'semaglutide 4-week genuinely has three price bands; one code is simply one ' +
      'option rather than a special case. A null code paired with a codeNote is a ' +
      'real answer meaning Operations supplies it, and is distinguishable from a ' +
      'missing one. GUARD ADDED and verified by regression: every product must ' +
      'resolve billing for every program it offers, every option must carry a code or ' +
      'a note naming who supplies one, and every option must carry a price or a note ' +
      'explaining why not - a blank where a charge code belongs reads as "none ' +
      'needed" rather than "ask Operations". The provider tool now renders pricing ' +
      'from this accessor and its three-way branch is gone.',

      '2026-09-05 (v2.5): PHARMACY ACQUISITION COST REMOVED FROM THIS FILE. While ' +
      'working out the Belmar vial plans, per-vial acquisition figures were written ' +
      'into two needsConfirmation entries - BELMAR-SEMA-VIAL-OVERSIZE and ' +
      'BELMAR-VIAL-RATE-QUOTES. That is what KORB pays Belmar, not what a patient ' +
      'pays, and no provider needs it. This repository is public and the file is ' +
      'served from GitHub Pages without authentication, so those figures were ' +
      'world-readable. Both entries are rewritten to describe the cost difference in ' +
      'words and point at Operations. Nothing else used them: the vial plans stand on ' +
      'volume and the 28-day puncture limit alone, which is why removing the figures ' +
      'changes no quantity, no vial count and no prescribing field. NEW costPolicy ' +
      'block states the line explicitly - program pricing and charge codes may be ' +
      'stored because a provider needs them and the patient is quoted them anyway; ' +
      'acquisition cost, pharmacy rate cards, negotiated tiers, partner-funded rates ' +
      'and the legacy cohort rate must not be. This was not a new rule; the ' +
      'grandfathered block already applied it and gave the reason, and it was simply ' +
      'broken. GUARD ADDED and verified by regression: selfCheck fails on any ' +
      'currency figure appearing anywhere in needsConfirmation or ' +
      'acceptedLimitations, which is where working notes get pasted. The pricing ' +
      'block is deliberately exempt.',

      '2026-09-05 (v2.4): BILLING SHAPE VERIFIED AND NOW ENFORCED. Audited every ' +
      'injectable compounded dose against its charge code, both programs. Result: ' +
      'all 20 semaglutide doses across Premier, Premier glycine, Belmar and Farmakeio ' +
      'resolve to the single 8-week code FITSemaMNT at $349, and all 24 tirzepatide ' +
      'doses across Premier, Belmar, Farmakeio and Greenwich resolve to their tier ' +
      'code - FITTirzMT1 $599, FITTirzMT2 $649, FITTirzMT3 $799. Pharmacy no longer ' +
      'affects code selection anywhere on the program; that ended when the ' +
      'Belmar-specific codes were retired in v2.0. All eight injectable products ' +
      'carry both supply4 and supply8 on every dose. No defects found - this entry ' +
      'records the check, and the guards that keep it true. THREE GUARDS ADDED, each ' +
      'verified by deliberate regression: every pharmacy dispensing a drug must be ' +
      'listed on that drug\'s 8-week code, since that list stopped being a selection ' +
      'mechanism and became a roster that can silently go stale when a pharmacy is ' +
      'added; every injectable compounded dose must offer both program lengths; and ' +
      'every tirzepatide dose must carry a priceTier, because without one no charge ' +
      'code resolves for either program. NOT IN SCOPE, by design rather than ' +
      'omission: compounded orals are 90-day only and brand products use their own ' +
      'record shape, so neither has a 4-week/8-week pair to check.',

      '2026-09-05 (v2.3): SEMAGLUTIDE VIAL OVERSIZE ACCEPTED AND SHIPPED. Don decided ' +
      '2026-09-05 to ship 1.0, 1.7 and 2.4 mg on the existing 5 ml vials. Belmar ' +
      'stocks 1 ml and 5 ml at 1 mg/ml and 5 ml at 2.5 mg/ml, no new sizes will be ' +
      'requested, and none of those divides into four doses for these three weekly ' +
      'volumes - so this is the best configuration that exists, not a compromise ' +
      'waiting on something better. The BELMAR-SEMA-VIAL-OVERSIZE item therefore ' +
      'moves out of needsConfirmation into a new acceptedLimitations array. That ' +
      'array exists so a decided problem stays visible: an open item is waiting on an ' +
      'answer, an accepted limitation already has one and the answer was to ship. The ' +
      'risk did not disappear when the decision was made and the file should not read ' +
      'as though it did. MITIGATION, and it is now the only thing holding these rows ' +
      'inside the puncture limit: all six affected records (three doses across both ' +
      'programs) carry "Discard each vial after 4 doses." appended to the sig, at ' +
      '135-137 characters against the 140 cap. selfCheck enforces it - the accepted ' +
      'limitation declares requiresSigText and any flagged record missing that exact ' +
      'string is a problem, so the instruction cannot be lost to a reword or a ' +
      'regeneration. selfCheck now also resolves a record flag against either array. ' +
      'RESIDUAL RISK, recorded rather than solved: counseling does not fully work here ' +
      'because the premise of the original concern is that patients do not discard a ' +
      'vial with drug in it. Expect extra doses at these three tiers and expect the ' +
      'short-supply complaint on stepping up from 1.7 mg, where the spare is 6.7 ' +
      'doses. opsNote records that such a report is expected behaviour, not a ' +
      'dispensing error. Revisit only if Belmar changes stocked sizes or confirms a ' +
      'day-28 dose is usable.',

      '2026-09-05 (v2.2): BELMAR 8-WEEK VIAL PLANS LANDED. Closes the quantity item ' +
      'that had blocked the v2.0 change. All 11 supply8 records now carry a verified ' +
      'dispensed quantity, vial breakdown and vialPlan block. Every figure was ' +
      're-derived from dose, concentration and the 28-day puncture limit rather than ' +
      'transcribed, and the cross-vial timelines for tirzepatide 7.5, 12.5 and 15 mg ' +
      'were simulated dose by dose - no vial is in use beyond 21 days on any ' +
      'tirzepatide row. Tirzepatide is zero-leftover at every dose because 10 mg/ml ' +
      'divides evenly into the stocked vial sizes. Semaglutide 0.25 and 0.5 mg are ' +
      'also zero-leftover. NEW DATA: pharmacies.belmar.vialConstraints stores the ' +
      '28-day in-use limit, the 4-dose ceiling, the sizing principle, and the 90-day ' +
      'BUD measured from COMPOUND date with its 41-day compound-to-ship window, which ' +
      'is now stated in the 8-week Pharmacy Instructions (158 chars, cap 170). The ' +
      '41-day figure is 8-week only - a 4-week fill\'s last dose is day 21, so its ' +
      'window is 69 days, and the 4-week records were deliberately left unchanged. ' +
      'vialPlan blocks were added to the 4-week records too, so both programs are ' +
      'checkable. NEW GUARDS in selfCheck, each verified by deliberate regression: ' +
      'vialPlan.totalMl must equal the dispensed quantity; withinPunctureLimit must ' +
      'agree with dosesPerVial against the pharmacy limit; any record exceeding the ' +
      'limit must carry a needsConfirmation flag; and both Tebra character caps are ' +
      'now enforced rather than merely documented. STILL OPEN AND BLOCKING FOR THREE ' +
      'ROWS: semaglutide 1.0, 1.7 and 2.4 mg ship 5 ml vials yielding 5.00, 7.35 and ' +
      '5.21 doses against a limit of 4, so the first vial stays in use to day 28, 49 ' +
      'and 35 under ordinary use. That is a sterility and potency exposure rather than ' +
      'a cost question. It is NOT introduced by this change - the same three doses ' +
      'already breach the limit on the live 4-week program. See ' +
      'BELMAR-SEMA-VIAL-OVERSIZE. Two further items opened: BELMAR-VIAL-RATE-QUOTES ' +
      'for the vial counts Belmar\'s tiers do not price, and BELMAR-DAY28-USABLE, ' +
      'since every plan here assumes a day-28 dose is not permitted.',

      '2026-09-05 (v2.1): PREPARATION IS NOW A PROPERTY OF THE PRODUCT, NOT THE ' +
      'MOLECULE. Fixes a live defect with patient-facing and medico-legal ' +
      'consequences. The compounded-preparation disclosure was stored as ' +
      'monographs.<drug>.compoundedNote, so it was keyed to the molecule. Zepbound ' +
      'is tirzepatide and the Wegovy pen and tablet are semaglutide, so all three ' +
      'brand products inherited "KORB dispenses a COMPOUNDED preparation" even ' +
      'though they are FDA-approved brand products fulfilled by LillyDirect and ' +
      'NovoCare. The generated provider documents printed it as a callout, put it ' +
      'in the counseling script the provider reads aloud, and put it in the chart ' +
      'attestation - so a provider was instructed to tell a Zepbound patient they ' +
      'were receiving a compounded product and to sign that into the record. It was ' +
      'false. Foundayo escaped only because orforglipron has exactly one product and ' +
      'someone wrote a brand-shaped note into its monograph; it still rendered under ' +
      'a "Compounded preparation" heading because the heading came from elsewhere. ' +
      'WHAT CHANGED: a new top-level `preparation` block holds the compounded and ' +
      'brand variants, each carrying heading, note, counselingLine and ' +
      'attestationClause together so a renderer cannot mix them; every one of the 16 ' +
      'products declares `compounded: true|false` (12 true, 4 false); ' +
      'preparationFor(productKey) is the only supported accessor and returns null ' +
      'rather than defaulting when the flag is absent; the three ' +
      'monographs.<drug>.compoundedNote entries are REMOVED, not deprecated, so no ' +
      'consumer can keep reading them. GUARDS ADDED to selfCheck, each verified by ' +
      'deliberate regression: every product must declare the flag; brandName true ' +
      'must mean compounded false and vice versa, so the two can never disagree; and ' +
      'no monograph may carry compoundedNote again. That last one is what makes the ' +
      'original mistake structurally impossible rather than merely corrected. ' +
      'BREAKING for consumers: monographs.<drug>.compoundedNote is gone - call ' +
      'preparationFor(productKey) and take the heading and body from the same block. ' +
      'DOCUMENTS AFFECTED: the Zepbound and both Wegovy references are wrong until ' +
      'rebuilt; the Foundayo reference has the right body under the wrong heading. ' +
      'The provider tool reads no monograph content and is unaffected.',

      '2026-09-05 (v2.0): BELMAR 8-WEEK IS NOW A SINGLE FILL. Belmar ships the full ' +
      'eight-week supply at one time for both semaglutide and tirzepatide. The split ' +
      'fill - a 4-week fill plus one manually placed Operations refill - is retired. ' +
      'This was the last remaining pharmacy-specific fill structure on the GLP-1 ' +
      'program; no pharmacy splits a fill now. Changed together so nothing can ' +
      'disagree: every belmar_sema and belmar_tirz supply8 record moves to refill 0 ' +
      'and days 56 (11 records), the 8-week sigs move from "AS DIRECTED FOR 4 WEEKS" ' +
      'to "AS DIRECTED FOR 8 WEEKS", vials8 loses its "(each fill)" qualifier, ' +
      'daysConvention drops belmar from injectableWithRefill, opsView.include is ' +
      'rewritten, and pharmacies.belmar.splitFill is replaced by fillStructure plus ' +
      'splitFillRetired. CHARGE CODES RETIRED: the Belmar-specific 8-week codes ' +
      'FITSemaMBL, FITTirzMTB1, FITTirzMTB2 and FITTirzMTB3 existed only to flag an ' +
      'order for Ops to place the second fill, so they are retired and Belmar bills ' +
      'the standard code. Retirement decided by Don 2026-09-05; Finance confirmation ' +
      'is open under BELMAR-8WK-CODE-RETIRE. BREAKING for consumers: codes.belmar no ' +
      'longer exists, read codes.standard for every pharmacy; codes.retired is ' +
      'historical and must never be rendered as a current code. TRANSITION: patients ' +
      'already dispensed under the split fill finish that cycle on the old structure ' +
      'and convert at their next 8-week order - Ops still owes those second fills. ' +
      'See pharmacies.belmar.transition, which Operations closes when the backlog ' +
      'clears. NOT DONE IN THIS CHANGE, AND BLOCKING: the dispensed quantity. Every ' +
      'supply8 quantity and vials8 value still holds the old per-fill figure, which ' +
      'was right for a four-week fill and is almost certainly short for eight. Every ' +
      'other pharmacy doubles its vial count between supply4 and supply8, so double ' +
      'is the expected shape, but this file does not derive a quantity it cannot ' +
      'verify against the pharmacy. See needsConfirmation BELMAR-8WK-QTY. Do not ' +
      'prescribe from the Belmar 8-week quantity fields until that is closed.',

      '2026-08-12 (v1.4): Premier Pharmacy becomes the preferred and default pharmacy ' +
      'for AZ, MO, IL, FL, NJ, MD, OH and NY on the GLP-1 program. AZ and FL were ' +
      'already Premier; the six that moved are MO, IL, NJ, MD, OH and NY, all of which ' +
      'previously fell through to Farmakeio on the catch-all rule. Verified before the ' +
      'change that Premier ships to all six and hard-excludes none of them. Three fields ' +
      'updated together so the tool and the documents cannot disagree: states.routing, ' +
      'premier.preferredStates, and farmakeio.preferredStates. Established patients are ' +
      'not moved - routing sets the default for a NEW start, and the provider can still ' +
      'override. Functional Health already routed all eight to Premier and is unaffected.',

      '2026-08-12 (v1.3): Belmar 8-week tirzepatide charge codes issued by Finance ' +
      'and stored: FITTirzMTB1 (T1), FITTirzMTB2 (T2), FITTirzMTB3 (T3). This closes ' +
      'open item BELMAR-TIRZ-8WK-CODE, which has been removed. The placeholder held ' +
      'one code, but Belmar dispenses tirzepatide across all three tiers, so the ' +
      'shape changed: each tier eightWeek now carries codes.standard and codes.belmar, ' +
      'identical to how semaglutide already worked. FIXES A LIVE DEFECT - the 8-week ' +
      'table rendered tier.eightWeek.code for every pharmacy, so Belmar patients were ' +
      'shown the standard code, which does not trigger Ops to place the second fill. ' +
      'Price is unchanged and deliberately not duplicated per pharmacy: Belmar 8-week ' +
      'is the same tier price as everywhere else, only the code differs. Confirmed by ' +
      'Don 2026-08-12. BREAKING for consumers: tier.eightWeek.code no longer exists, ' +
      'select by pharmacy. The provider tool and both PDF builders were updated in the ' +
      'same change.',

      '2026-08-06 (v1.0): Initial consolidation. Eight pharmacy documents plus ' +
      'the brand-name document merged into one structure. Boilerplate that was ' +
      'identical across all eight (indications, candidate criteria, ' +
      'contraindications, side effects) collapsed into KORB_GLP1.clinical and ' +
      'is now stated once.',

      '2026-08-06: Premier glycine semaglutide BUD extended to 90 days. The ' +
      '8-week program moves from a 1-month supply with 1 refill to the full ' +
      '8-week supply shipped in a single fill. Rx records updated: Refill 0, ' +
      'Days 56, two vials per fill. Vial quantities are derived (2x the 4-week ' +
      'quantity) and need pharmacy confirmation — see needsConfirmation.',

      '2026-08-06: California routing resolved. Belmar now carries tirzepatide in ' +
      'addition to semaglutide and is the single California pharmacy for both drugs. ' +
      'Greenwich moves to legacy-continuity status: no new starts, existing ' +
      'tirzepatide patients stay only if they choose to. The earlier ' +
      'CA-PHARMACY-CONFLICT item is closed.',

      '2026-08-06: Semaglutide pricing captured. 4-week standard $269, 4-week ' +
      'corporate $199, 8-week $349. A closed legacy cohort exists at a different ' +
      '8-week rate; details held by Operations and deliberately not stored here.',

      '2026-08-06: Indiana routed to Premier provisionally. Farmakeio ships ' +
      'everywhere except California and Indiana, which leaves Premier as the only ' +
      'option for an Indiana patient. Premier does not list IN in its documented ' +
      'ship-to. Marked unconfirmed pending verification with Premier.',

      '2026-08-11 (OPS VIEW SPEC): Operations confirmed they work from the same ' +
      'documents as providers but need less depth. Dose, quantity and vials stay in ' +
      'the Ops view because Ops handles patient questions, short-dose complaints and ' +
      'pharmacy follow-up, and cannot resolve those without knowing what should have ' +
      'shipped. Spec recorded in opsView. To be built as a third visibility value and ' +
      'a toggle, not a separate document set.',

      '2026-08-10 (MONOGRAPHS): Deep clinical reference added for semaglutide, ' +
      'tirzepatide and orforglipron \u2014 definition, mechanism, evidence, absolute ' +
      'contraindications separated from cautions, medication interactions, monitoring, ' +
      'counseling script, chart attestation and ICD-10 documentation codes. Also a ' +
      'program-wide escalation block. NEWLY AUTHORED CLINICAL CONTENT \u2014 requires ' +
      'Clinical Director sign-off before distribution. Note the framing differs from the ' +
      'peptide program: these molecules ARE FDA-approved with large RCT evidence; what is ' +
      'off-label is the compounded preparation, not the molecule.',

      '2026-08-10 (ADDRESSES): Dispensing addresses added for all four compounding ' +
      'pharmacies. Belmar carries a warning \u2014 they have several US locations and KORB ' +
      'must use the ARIZONA one; selecting another Belmar location in Tebra sends the ' +
      'prescription to the wrong pharmacy.',

      '2026-08-09 (PUBLIC-SAFE): Legacy cohort rate and the client organisations ' +
      'behind it removed from this file ahead of publishing to GitHub Pages, which ' +
      'serves without authentication. The fact that a closed cohort exists is retained ' +
      'so an unexpected legacy charge is not mistaken for an error; the figure and the ' +
      'organisation names are held by Operations. Do not add them back to this file.',

      '2026-08-09 (FINAL AUDIT): Days supply convention settled and recorded \u2014 the ' +
      'field describes the fill, not the program. Injectable single fills are 28 or 56; ' +
      'fill-plus-refill programs are 28 per fill; brand orals 30 or 60; compounded orals ' +
      '90 only. Audited across all 140 records with no exceptions. Wegovy tablet sig ' +
      'shortened from 191 to 129 characters \u2014 it came in over the 140 cap from the ' +
      'source document and would have truncated in Tebra. Dead MDToolbox rendering ' +
      'removed from the provider tool.',

      '2026-08-09 (TEBRA STRINGS VERIFIED): All 22 brand drug-dropdown strings captured ' +
      'from the Tebra drug search and stored verbatim, including the lowercase ' +
      '\u201ckwikpen\u201d and \u201chd\u201d, and the inconsistent spacing before the bracketed ' +
      'pen content. Zepbound KwikPen entries carry a total-content figure (4 doses x ' +
      '0.6 mL = 2.4 mL) that independently confirms quantity 1. Wegovy pen volume varies ' +
      'by dose: 0.5 mL at 0.25/0.5/1 mg, 0.75 mL at 1.7/2.4/7.2 mg. Wegovy tablet and ' +
      'Foundayo strings already matched. BRAND-KWIKPEN-STRING and WEGOVY-PEN-QUANTITY ' +
      'both closed.',

      '2026-08-09 (BRAND CORRECTIONS): Zepbound corrected to ONE KwikPen per 4-week ' +
      'supply. The pen is a multi-dose device holding 4 fixed weekly doses; the source ' +
      'document quantity of 4 referred to single-dose vials, so prescribing 4 pens ' +
      'would have dispensed sixteen weeks. Foundayo and Wegovy pen prescribing values ' +
      'added, both previously missing entirely. Foundayo and Wegovy tablet long ' +
      'programs are a 60-day supply with no refill; the pens are 4-week plus one ' +
      'refill. Semaglutide 4-week website code FITSema001 added at $269.',

      '2026-08-09 (BRAND PRESCRIBING): Real Tebra Standard prescribing values loaded ' +
      'from the brand prescribing document for Zepbound (6 doses x 2 programs) and the ' +
      'Wegovy oral tablet (4 doses x 2 programs), including pharmacy addresses and ' +
      'phone numbers. Brand pathways restricted to TX, CA, AL and WI \u2014 a program ' +
      'limit the data did not previously capture. Brand visit fee confirmed identical ' +
      'for both program lengths; the short/long choice is clinical, driven by dose ' +
      'stability. Premier glycine 8-week ladder strings corrected \u2014 they had implied ' +
      '2, 3 and 4 mL vial sizes that do not exist, when Premier stocks 1 mL only.',

      '2026-08-09 (BRAND SELECTION): Brand products now carry brandFamily and ' +
      'presentationLabel so they are chosen by brand rather than molecule. A provider ' +
      'picks Wegovy then Pen or Oral tablet, not semaglutide then a formulation. ' +
      'Zepbound and Foundayo have a single presentation each, so the formulation step ' +
      'resolves itself.',

      '2026-08-09 (PROVIDER TOOL PASS): Premier notes made consistent \u2014 all three ' +
      'products offer 4-week and 8-week, all carry a 90-day BUD, and every 8-week ' +
      'program ships complete in one initial shipment. Brand-name billing consolidated ' +
      'to a single $79 prescription visit fee under code FITGLP1001 across LillyDirect, ' +
      'NovoCare and local pharmacy. Oral pricing now resolves from the charge code via ' +
      'priceForCode() rather than being duplicated on each dose.',

      '2026-08-09 (PRESCRIBING REWORK COMPLETE): All 96 compounded records converted ' +
      'to the Functional Health field layout. Premier\u2019s cyanocobalamin dropdown ' +
      'workaround is gone \u2014 every pharmacy now uses a real Tebra Compound drug ' +
      'formulation. QUANTITY IS NOW TOTAL MILLILITRES, not a vial count, matching how ' +
      'Tebra calculates the dose. Oral formulations split by strength: Premier and ' +
      'Farmakeio each have a 0.5 mg and a 1 mg entry that were previously collapsed ' +
      'into one. Naming settled: Premier orals are Dots (KORB marketing term, though ' +
      'Premier compounds them as troches), Farmakeio is RDT, Belmar is FastSL. Seven ' +
      '8-week quantities corrected where the entered figure was the 4-week value; the ' +
      'row notes and the drug math both confirmed the doubled figure.',

      '2026-08-09 (BELMAR): Belmar tirzepatide sig converted from units/mL to mg so it ' +
      'matches Belmar semaglutide, which has been ordered in mg for a couple of years. ' +
      'Semaglutide left byte-identical. Insulin-syringe note stays in the patient ' +
      'directions, not Pharmacy Instructions, because that is the field Belmar reads. ' +
      'Belmar 100-unit no-headroom draw confirmed as intended, no callout.',

      '2026-08-09 (TEBRA FIELDS): Character caps recorded \u2014 Reason for Compounding 30, ' +
      'Patient Instructions 140, Pharmacy Instructions 170. Premier keeps mg-based sig ' +
      'text: that is what Premier wants, has been in place three years, and a previous ' +
      'attempt to standardise it had to be reversed. Greenwich 50-unit dosing into ' +
      '50-unit syringes confirmed deliberate, so the Functional Health syringe callout ' +
      'rule explicitly does not apply to Greenwich GLP-1. Belmar oral semaglutide ' +
      'confirmed as rapid-dissolving tablets. Empty-stomach and 15-minute sublingual ' +
      'instructions extended to all oral products.',

      '2026-08-09 (DECISIONS): Three items settled. Premier\u2019s licensed footprint is ' +
      'final \u2014 routing defaults are overridable, the footprint is not. Manufacturer ' +
      'brand pricing will NOT be stored, by policy: it changes without notice, KORB does ' +
      'not control it, and a stale figure becomes a wrong price quoted to a patient. ' +
      'Oral products follow a 30-day or 60-day provider-set follow-up rather than the ' +
      'injectable 4-week / 8-week cadence, for both compounded and brand orals.',

      '2026-08-09 (STRUCTURAL ROUND): Routing and pharmacy records reworked. Florida ' +
      'added to Premier\u2019s preferred states and routing. KORB active states set to ' +
      'all 50 plus DC. Premier\u2019s shipping list confirmed as a hard licensed ' +
      'footprint \u2014 13 jurisdictions it does not serve are now hard exclusions. ' +
      'Belmar widened to all 50 plus DC but flagged as discouraged outside California ' +
      'on price. Farmakeio set to 49 states plus DC with California the single hard ' +
      'exclusion, and Lifefile removed. Greenwich moved off MDToolbox, preferred states ' +
      'cleared, and restricted to continuing tirzepatide patients only. Every ' +
      'compounding pharmacy now orders via Tebra Compound and bills identically. ' +
      'Brand-name pathways moved to Tebra Standard with a shared brandRules block, ' +
      'and a local-pharmacy channel added. Brand catalogue rebuilt: Zepbound KwikPen ' +
      '(vial presentation dropped), Foundayo added, Wegovy split into pen and tablet ' +
      'with the 7.2 mg pen marked as Wegovy HD. Visit cadence now allows video or ' +
      'asynchronous visits.',

      '2026-08-06 (CONFIRMATION ROUND — supersedes the entry above): Seven open items ' +
      'closed on direct confirmation. Indiana goes to FARMAKEIO, not Premier — the ' +
      'provisional Premier routing has been reversed and removed. Farmakeio ships to ' +
      'all states and DC with California as the only exclusion. Premier glycine 8-week ' +
      'confirmed as a single full-supply fill. Belmar refill trigger confirmed at ' +
      'week 3. Farmakeio top semaglutide dose corrected from 2.4 to 2.5 mg on the ' +
      'label. Greenwich 8-week corrected to Days 56 with two vials. Oral charge codes ' +
      'confirmed for Premier and Belmar only and stripped from Farmakeio oral. ' +
      'Two items remain open, neither blocking.'
    ]
  },

  /* ── NEEDS CONFIRMATION ──────────────────────────────────────────────────
     Open items surfaced by consolidating the documents. Each is a place the
     sources disagreed, were silent, or where this file derived a value.
     Nothing here should reach a patient or a prescription until closed. */
  /* -- ACCEPTED LIMITATIONS ------------------------------------------------
     Known problems that have been DECIDED, not resolved. Separate from
     needsConfirmation on purpose: an open item is waiting on an answer, an
     accepted limitation already has one and the answer was "ship it anyway".

     Both still have to be declared. A record that breaks a stored constraint
     must point at an entry in one array or the other, so selfCheck can tell
     "we know and we chose this" apart from "nobody noticed". What must never
     happen is the constraint quietly disappearing because the decision went
     the other way - the risk did not go away when the decision was made, and
     whoever reads this file in six months needs to see that. */
  acceptedLimitations: [
    {
      id: 'BELMAR-SEMA-VIAL-OVERSIZE',
      severity: 'high',
      status: 'accepted',
      decidedBy: 'Don',
      decidedOn: '2026-09-05',
      appliesTo: ['belmar_sema'],
      doses: ['1.0 mg', '1.7 mg', '2.4 mg'],
      programs: ['4-week', '8-week'],
      issue: 'These three doses use a 5 ml vial that yields 5.00, 7.35 and 5.21 weekly ' +
             'doses against a 4-dose ceiling. A patient who finishes the open vial ' +
             'rather than discarding it draws from it past the 28-day in-use limit, ' +
             'and gets 1.0 to 6.7 doses more than intended.',
      decision: 'Ship as-is. Belmar offers 1 ml and 5 ml at 1 mg/ml and 5 ml at ' +
                '2.5 mg/ml, and no new vial sizes will be requested. These are the ' +
                'sizes available, so this is the best configuration that exists rather ' +
                'than a compromise pending something better.',
      whyNotFixable: 'Semaglutide 1.0 mg needs 1.00 ml a week, 1.7 mg needs 0.68 ml and ' +
                     '2.4 mg needs 0.96 ml. No stocked vial size divides into four doses ' +
                     'for any of them. The only zero-leftover alternative is 8 x 1 ml ' +
                     'for 1.0 mg, which Operations ruled out, and nothing at all for ' +
                     '1.7 and 2.4 mg. Tirzepatide avoids this entirely because 10 mg/ml ' +
                     'divides evenly into the stocked sizes.',
      mitigation: 'Every compounded injectable sig now carries "Discard after 4 doses ' +
                  'or 28 days." On these three doses that instruction is the whole ' +
                  'mitigation rather than a reminder - the vial physically holds a 5th ' +
                  'dose, so if the line is dropped the limitation becomes an ' +
                  'uncontrolled 28-day breach. Applied program-wide on 2026-09-05 at ' +
                  'Don\'s direction, for consistency: harmless where a vial empties ' +
                  'before four doses, protective where it does not.',
      /* Machine-checked. selfCheck asserts every record carrying this flag has this
         exact string in its Patient Instructions, so the mitigation cannot be lost
         to a reword, a regeneration or a well-meant tidy-up. */
      requiresSigText: 'Discard after 4 doses or 28 days.',
      residualRisk: 'Counseling does not fully solve it. The reason this was raised in ' +
                    'the first place is that patients do not discard a vial with drug ' +
                    'left in it. Expect extra doses at these three tiers and expect the ' +
                    'short-supply complaint at the next escalation, particularly moving ' +
                    'off 1.7 mg where the spare is 6.7 doses.',
      opsNote: 'A patient reporting they "ran out early" after stepping up from 1.7 mg ' +
               'is almost certainly comparing against extra doses they should not have ' +
               'had. Treat it as expected rather than as a dispensing error.',
      revisitIf: 'Belmar changes its stocked vial sizes, or confirms a day-28 dose is ' +
                 'usable - see BELMAR-DAY28-USABLE.'
    },

    {
      id: 'BELMAR-DAY28-DOSE-CEILING',
      decidedBy: 'Don',
      decidedOn: '2026-09-06',
      limitation: 'Every vial plan in this file assumes a vial yields at most FOUR ' +
                  'weekly doses. A fifth dose would fall on day 28 itself, and 28 days ' +
                  'is the stated in-use limit rather than a day that sits inside it.',
      decision: 'Four doses per vial, never five. This is the operating assumption and ' +
                'it is not pending anything - it is the conservative reading of the ' +
                'in-use limit, which is the right way to read a limit on a multi-dose ' +
                'vial a patient is drawing from at home.',
      consequence: 'Some vial plans carry leftover volume they would not carry under a ' +
                   'five-dose reading. That leftover is controlled by the sig, which ' +
                   'tells the patient to discard after 4 doses or 28 days - see ' +
                   'BELMAR-SEMA-VIAL-OVERSIZE.',
      revisitIf: 'Belmar states in writing that a dose drawn on day 28 is acceptable. ' +
                 'Then vialConstraints.maxDosesPerVial and every vialPlan derived from ' +
                 'it need revisiting. A verbal answer is not enough to move a patient- ' +
                 'facing in-use limit.'
    }
  ],

  needsConfirmation: [


  ],


  /* ── PROGRAM PROGRESSION ─────────────────────────────────────────────────
     How a patient moves between the 4-week and 8-week programs. Provider-driven
     throughout, and internal only. */
  progression: {
    appliesTo: ['semaglutide', 'tirzepatide'],
    appliesToNote: 'Identical for both drugs. No drug-specific variation.',
    visibility: 'internal',
    doNotPublish: true,
    publishNote: 'Internal and provider-facing only. Do not put this rule in a patient handout, the website, a pricing flyer, or any Circle post. A patient should not arrive expecting to graduate to 8-week.',
    startsAt: '4-week',
    startRule: 'Every patient starts on the 4-week program. No exceptions.',
    eightWeekEligibility: 'A patient may be offered the 8-week program once they are stable at the dose they have landed on after escalation.',
    mandatory: false,
    decisionOwner: 'Provider',
    patientInitiated: false,
    decisionNote: 'The 8-week program is an offer the provider extends, not a milestone the patient reaches or requests. Escalation, holding, reducing and weaning off are all provider discretion.',
    weaning: { decisionOwner: 'Provider', note: 'Dose reduction and weaning off therapy are entirely at provider discretion. No fixed taper schedule is defined at the program level.' },
    reasonsToStayOnFourWeek: [
      'Cost \u2014 the 4-week program is the lower per-visit outlay and carries the discounted rate.',
      'Accountability \u2014 some patients want to see the provider monthly.',
      'Clinical \u2014 the provider judges that side effects are not adequately controlled and the patient needs to be seen more often.'
    ],
    visitCadence: {
      fourWeek: 'Monthly provider visit',
      eightWeek: 'Provider visit every 8 weeks',
      modality: 'Either a video visit or an asynchronous visit. Both are acceptable for 4-week and 8-week follow-ups.'
    },
    /* Oral products do not follow the injectable 4-week / 8-week rhythm. */
    oral: {
      appliesTo: 'All oral products \u2014 compounded (Premier dots, Belmar FastSL, Farmakeio) and brand (Foundayo, Wegovy tablet).',
      followUpOptions: ['30 days', '60 days'],
      decisionOwner: 'Provider',
      rule: 'The provider sets a 30-day or 60-day follow-up to keep the patient on track, rather than using the 4-week / 8-week injectable cadence.',
      supplyIsNotCadence: 'Dispensed quantity and follow-up interval are separate decisions. The compounded orals dispense as a 90-day supply, but the patient is still seen at 30 or 60 days. Do not read a 90-day supply as a 90-day follow-up.',
      modality: 'Video or asynchronous, same as the injectable programs.'
    }
  },

  /* ── OPS VIEW ────────────────────────────────────────────────────────────
     Operations works from the same documents as providers, filtered down.
     Confirmed with Clinical Ops and Operations 2026-08-11.

     WHY OPS NEEDS DOSE AND QUANTITY: they field patient questions directly,
     handle short-dose complaints, and reissue refills when a pharmacy has made
     an error. Ops also follows up with pharmacies when there is a problem. They
     cannot resolve "I did not get enough" without knowing what should have
     shipped. This is the reason the numbers stay in the Ops view even though
     Ops does not prescribe.

     Ops also schedules patients and manages subscriptions for both patients
     and providers. */
  opsView: {
    confirmed: '2026-08-11',
    principle: 'Same documents, less depth. Ops needs enough to answer a patient ' +
               'and chase a pharmacy, not enough to prescribe.',
    include: [
      'Pharmacy routing by state, and which pharmacy a patient belongs to',
      'Order path (Tebra Compound vs Tebra Standard)',
      'Filling and dispensing address',
      'Program length (4-week / 8-week / 30-day / 60-day / 90-day)',
      'Charge codes and pricing, including the discounted bands',
      'Dose, quantity, and vials dispensed \u2014 needed to resolve short-dose reports',
      'Refill and days supply',
      'The Belmar transition \u2014 Ops still owes second fills to patients dispensed ' +
      'under the retired split fill, and must stop placing new ones',
      'If the patient moves state',
      'Escalation contacts'
    ],
    exclude: [
      'Drug Formulation dropdown strings',
      'Patient Instructions / sig text',
      'Reason for Compounding',
      'Pharmacy Instructions',
      'Agent monographs \u2014 mechanism, evidence, contraindications, interactions',
      'Monitoring checklists',
      'Counseling scripts and chart attestation',
      'ICD-10 codes',
      'Clinical escalation and discontinuation',
      'Candidate selection / is-this-the-right-patient'
    ],
    openQuestions: [
      'Patient Instructions are currently excluded. They may actually help Ops ' +
      'reason about a short-dose report \u2014 knowing a patient injects 0.6 mL weekly ' +
      'explains how long a 2.4 mL vial should last. Confirm with Operations before ' +
      'building.'
    ],
    implementation: 'Every product already carries a `visibility` field and the tool ' +
                    'routes rendering through filter functions, so this is a third ' +
                    'visibility value plus a toggle rather than a separate document set. ' +
                    'Do NOT fork the documents \u2014 one source, one build, two views.'
  },

  /* ── TEBRA FIELD LIMITS ─────────────────────────────────────────────────
     Hard character caps in Tebra. Confirmed 2026-08-09. Any tool or document
     that generates prescribing text must respect these. */
  /* ── DAYS SUPPLY CONVENTION ──────────────────────────────────────────────
     Settled 2026-08-09. Days supply describes THE FILL, not the whole program.
       Injectable, single fill      4-week = 28   8-week = 56
       Injectable, fill + refill    28 per fill, refill 1 (Zepbound, Wegovy pen)
       2026-09-05: Belmar moved from fill+refill to single fill and is no longer
       listed on the refill convention. Its 8-week records are now 56 / refill 0.
       Oral, brand                  30 or 60
       Oral, compounded             90 only
     Writing 56 on a refill fill would read as 112 days of medication. Audited
     across all 140 records; every value conforms. */
  daysConvention: {
    injectableSingleFill: { fourWeek: 28, eightWeek: 56 },
    injectableWithRefill: { perFill: 28, refills: 1,
      appliesTo: ['zepbound', 'wegovy_pen'],
      removed: [{ pharmacy: 'belmar', on: '2026-09-05',
                  reason: 'Belmar now ships the full 8-week supply in one fill.' }] },
    oralBrand: [30, 60],
    oralCompounded: [90],
    rule: 'Days supply describes the fill, not the program.'
  },

  tebraLimits: {
    reasonForCompounding: 30,
    patientInstructions: 140,
    pharmacyInstructions: 170,
    note: 'Exceeding a cap truncates silently in some views, so text is written ' +
          'to fit rather than trimmed later.'
  },

  /* -- PREPARATION: COMPOUNDED vs BRAND ------------------------------------
     Added 2026-09-05 to fix a live defect.

     This text used to live on the MOLECULE, as monographs.<drug>.compoundedNote.
     That is the wrong key. Zepbound is tirzepatide and Wegovy is semaglutide, so
     both inherited "KORB dispenses a COMPOUNDED preparation" from their molecule
     even though both are brand products fulfilled by the manufacturer. The
     generated provider documents printed it as a callout, put it in the spoken
     counseling script, and put it in the chart attestation - so a provider was
     told to counsel a Zepbound patient that they were receiving a compounded
     product, and to sign that statement into the record. It was false.

     Foundayo escaped only because orforglipron happens to have exactly one
     product and someone wrote a brand-shaped note into its monograph. That is
     luck, not design - and it still printed under a "Compounded preparation"
     heading, because the heading came from somewhere else.

     Preparation is a property of the PRODUCT, never of the molecule. Every
     product now declares `compounded: true|false` and every consumer resolves
     through preparationFor(). The three monograph-level notes are REMOVED
     rather than deprecated, so nothing can quietly keep reading them.

     RENDERING RULE: take the heading, the note, the counseling line and the
     attestation clause from the SAME resolved block. Mixing sources is the
     specific mistake that produced the Foundayo heading. */
  preparation: {
    compounded: {
      key: 'compounded',
      appliesTo: 'Compounded products from Premier, Belmar, Farmakeio and Greenwich.',
      heading: 'Compounded preparation',
      note: 'KORB dispenses a COMPOUNDED preparation, not the FDA-approved branded ' +
            'product. The molecule is approved; this specific formulation is not, and ' +
            'compounded products are not reviewed by the FDA for safety, efficacy or ' +
            'quality. Counsel accordingly and document that the distinction was ' +
            'explained.',
      counselingLine: 'This is a compounded preparation rather than the brand-name product.',
      attestationClause: 'including that a compounded preparation is being dispensed ' +
                         'rather than the FDA-approved branded product'
    },
    brand: {
      key: 'brand',
      appliesTo: 'Brand products fulfilled by the manufacturer - Zepbound and Foundayo ' +
                 'through LillyDirect, Wegovy pen and Wegovy tablet through NovoCare.',
      heading: 'Brand product',
      note: 'Brand product dispensed through the manufacturer programme. Not ' +
            'compounded. Fulfilment, payment and shipping are handled by the ' +
            'manufacturer, not KORB.',
      counselingLine: 'This is the FDA-approved brand-name product, filled and shipped ' +
                      'by the manufacturer rather than by KORB.',
      attestationClause: 'including that the FDA-approved branded product is dispensed ' +
                         'through the manufacturer programme'
    }
  },

  /* ── STATES ──────────────────────────────────────────────────────────────
     The canonical state data. This is the block that caused the original
     typo. It is now stated exactly once. Every document and tool that shows
     a state list must read from here. */
  states: {

    // KORB's affiliated practice is active in all 50 states and DC.
    korbActive: [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
      'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
      'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
      'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
      'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
      'WY'
    ],

    // Routing rule, evaluated in order. First match wins.
    // Applies to NEW starts. Patients already established with a pharmacy stay
    // where they are unless there is a clinical or supply reason to move them.
    // A default can be overridden; whether a given pharmacy can actually serve
    // the state is a separate question answered by hardExcludes.
    routing: [
      /* 2026-08-12: MO, IL, NJ, MD, OH and NY moved here from the Farmakeio catch-all.
         AZ and FL were already Premier. Premier ships to all six and excludes none. */
      { states: ['TX', 'NV', 'AZ', 'FL', 'IL', 'MD', 'MO', 'NJ', 'NY', 'OH'],
        pharmacy: 'premier', basis: 'preferred pharmacy' },
      { states: ['CA'],                   pharmacy: 'belmar',
        basis: 'sole California pharmacy \u2014 semaglutide and tirzepatide',
        note: 'Belmar is the only California option, and as of 2026-09-11 this applies ' +
              'to established patients too, not just new starts. Farmakeio cannot ship ' +
              'to CA at all, Premier cannot either, and Greenwich stopped shipping to ' +
              'CA and no longer fills GLP-1 in any state. Every California tirzepatide ' +
              'patient still on Greenwich moves to Belmar.' },
      { states: ['*'],                    pharmacy: 'farmakeio', basis: 'all other new patients' }
    ],

    // Resolve a two-letter state code to a pharmacy key.
    routeTo: function (stateCode) {
      var s = String(stateCode || '').toUpperCase();
      for (var i = 0; i < KORB_GLP1.states.routing.length; i++) {
        var r = KORB_GLP1.states.routing[i];
        if (r.states.indexOf('*') !== -1 || r.states.indexOf(s) !== -1) return r;
      }
      return null;
    }
  },

  /* ── PHARMACIES ──────────────────────────────────────────────────────── */
  pharmacies: {

    premier: {
      key: 'premier',
      name: 'Premier Pharmacy',
      color: '#1565C0',
      type: 'compounding',
      visibility: 'provider',
      status: 'active',
      preferredStates: ['TX', 'NV', 'AZ', 'FL', 'IL', 'MD', 'MO', 'NJ', 'NY', 'OH'],
      shipsTo: [
        'AZ', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'IL', 'KS', 'KY',
        'LA', 'MD', 'ME', 'MI', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE',
        'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SD',
        'TN', 'TX', 'UT', 'VA', 'VT', 'WI', 'WV', 'WY'
      ],
      // Premier's list IS its licensed footprint. Anything not on it is a hard
      // exclusion, not a preference. The routing default can be overridden;
      // the shipping footprint cannot.
      hardExcludes: [
        'AK', 'AL', 'AR', 'CA', 'HI', 'IA', 'ID', 'IN', 'MA', 'MN',
        'NH', 'SC', 'WA'
      ],
      shipsToNote: 'Licensed shipping list. Premier cannot ship anywhere outside it, ' +
                   'including California. Confirmed 2026-08-09.',
      footprintIsSettled:
        'SETTLED \u2014 do not soften this back to a preference. Two different things were ' +
        'being confused: the ROUTING DEFAULT for a state is overridable (a provider may ' +
        'choose Premier where Farmakeio is default, or vice versa), but Premier\u2019s ' +
        'LICENSED FOOTPRINT is not. States outside shipsTo are hard exclusions.',
      address: 'Premier Pharmacy, 2425 Babcock Rd, Ste 108A, San Antonio, TX 78229',
      orderVia: 'Tebra Compound',
      billing: 'Bill to KORB Health Group, ship to patient',
      notes: [
        'All Premier programs offer a 4-week and an 8-week option \u2014 semaglutide, ' +
        'semaglutide with glycine, and tirzepatide alike.',
        'All Premier compounds carry a 90-day BUD as of 2026-08. There is no longer a ' +
        'difference between the glycine and non-glycine products on this.',
        '8-week programs ship the full eight weeks of medication and supplies in a ' +
        'single initial shipment. No refill and no second shipment.',
        'Vials remain 28 days from first use regardless of BUD. On lower doses this ' +
        'produces overage. Counsel the patient to discard at 28 days.'
      ]
    },

    belmar: {
      key: 'belmar',
      name: 'Belmar Pharmacy',
      color: '#6A1B9A',
      type: 'compounding',
      visibility: 'provider',
      status: 'active',
      preferredStates: ['CA'],
      shipsTo: [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
        'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI',
        'WY'
      ],
      hardExcludes: [],
      shipsToNote: 'Ships to all 50 states and DC. Preferred for California only.',
      discouragedOutsidePreferred: true,
      discouragedReason:
        'Belmar is the California pharmacy. Patients are routed here for California ' +
        'and kept on the other compounding pharmacies elsewhere. Selecting Belmar ' +
        'outside California is allowed but should be a deliberate exception.',
      address: 'Belmar Pharmacy \u2014 ARIZONA location, 12012 N 111th Ave, Youngtown, AZ 85363-1339',
      addressWarning: 'Belmar has several locations across the US. KORB uses the ARIZONA address. Confirm the Arizona address is the one selected in Tebra before sending \u2014 another Belmar location will be wrong.',
      orderVia: 'Tebra Compound',
      billing: 'Bill to KORB Health Group, ship to patient',
      notes: [
        'Carries both semaglutide and tirzepatide. All new California starts go ' +
        'here regardless of drug.',
        'SINGLE FILL as of 2026-09-05. Belmar now ships the full 8-week supply at ' +
        'one time for both semaglutide and tirzepatide. The split fill is retired. ' +
        'Belmar no longer differs from the other pharmacies on fill structure.',
        'Belmar 8-week now bills on the standard 8-week charge code. The ' +
        'Belmar-specific codes are retired \u2014 they existed only to trigger the ' +
        'second fill, and there is no second fill.',
        'Semaglutide 2.5 mg / 1 mg / ml is used for 1.7 and 2.4 mg doses; ' +
        '1 mg / 1 mg / ml for 0.25, 0.5 and 1.0 mg doses.',
        'SYRINGES GO IN THE DIRECTIONS, NOT PHARMACY INSTRUCTIONS. Belmar reads the ' +
        'patient directions field. If the insulin-syringe note is moved to Pharmacy ' +
        'Instructions they may not see it and will not ship syringes. Keep ' +
        '"(Include one pack of insulin syringes)" at the end of every Belmar sig.',
      ],
      /* splitFill removed 2026-09-05. Belmar 8-week is a single fill. The retired
         structure is preserved in splitFillRetired below so a billing or supply
         question about a patient dispensed before the change can still be answered.
         Consumers must not read splitFillRetired as current behaviour. */
      /* -- VIAL AND PUNCTURE CONSTRAINTS -------------------------------------
         Added 2026-09-05 with the 8-week vial plans. These are the rules the
         plans were sized against, stored so a future change can be checked
         rather than re-reasoned.

         The binding constraint is the 28-day in-use limit, and the number that
         matters is how many doses ONE VIAL yields - not how much is shipped in
         total. Weekly doses land on days 0, 7, 14 and 21. A fifth dose from the
         same vial falls on day 28 itself, which is outside the window.

         Sizing rule, per Don, and it overrides both cost and convenience:
         do not ship a vial with meaningful leftover. Patients are told to
         discard after 4 doses or 28 days and they do not - they use the vial
         until it is empty, get extra doses, and then report the next dose tier
         as short when it behaves correctly. Size the vial so a 5th dose is
         physically impossible rather than merely discouraged. */
      vialConstraints: {
        punctureDays: 28,
        maxDosesPerVial: 4,
        doseDays: [0, 7, 14, 21],
        rule: 'single-vial volume divided by weekly volume must be <= 4',
        whyNotFive: 'A fifth dose from the same vial lands on day 28 itself, which ' +
                    'is the limit rather than inside it.',
        sizingPrinciple: 'Do not ship a vial with meaningful leftover. Make a fifth ' +
                         'dose impossible, not merely discouraged.',
        bud: {
          days: 90,
          from: 'compound date, NOT ship date',
          lastDoseDay: 49,
          maxCompoundToShipDays: 41,
          note: 'Reference only. Deliberately NOT stated on the order or in the sig - ' +
                'removed 2026-09-05, the pharmacy manages its own BUD.'
        },
        dosesPerVial: 'Four doses per vial, never five. A fifth dose would fall on ' +
                      'day 28 itself, and the 28-day in-use limit is read as a limit ' +
                      'rather than a day inside the window. See acceptedLimitations ' +
                      'BELMAR-DAY28-DOSE-CEILING.'
      },

      fillStructure: {
        fourWeek: 'Single fill, 28 days, no refill.',
        eightWeek: 'Single fill, 56 days, no refill.',
        changedOn: '2026-09-05',
        note: 'Belmar previously split the 8-week program into two 4-week fills. ' +
              'It no longer does. No pharmacy on the GLP-1 program splits a fill.'
      },

      splitFillRetired: {
        retired: true,
        retiredOn: '2026-09-05',
        historicalOnly: true,
        doNotApplyToNewOrders: true,
        appliedTo: ['8-week semaglutide', '8-week tirzepatide'],
        structure: '4-week supply with 1 refill, second fill placed manually by Operations',
        trigger: 'A Belmar-specific 8-week charge code flagged the order for Ops.',
        opsTriggeredAt: 'Week 3',
        whyRetained: 'A patient dispensed under this structure is still working through ' +
                     'it. Ops and Finance need the old shape to answer questions about ' +
                     'those orders. It is not a live workflow.'
      },

      /* ── TRANSITION ────────────────────────────────────────────────────────
         Both structures are live at once for a period. This block exists so a
         provider or Ops person can tell which patient is on which. */
      transition: {
        active: true,
        decision: 'Patients already dispensed under the split fill finish that 8-week ' +
                  'cycle on the old structure. They convert to the single fill at their ' +
                  'next 8-week order, not mid-cycle.',
        decidedBy: 'Don',
        decidedOn: '2026-09-05',
        appliesTo: 'California Belmar patients on the 8-week program',
        newStarts: 'Any 8-week order placed on or after 2026-09-05 is a single fill.',
        opsAction: 'Operations still owes a second fill to every patient whose first ' +
                   '4-week Belmar fill went out before 2026-09-05. Do not cancel those ' +
                   'second fills. Stop placing new ones once the backlog clears.',
        providerScript: 'A California patient starting the 8-week program now receives ' +
                        'their full eight weeks in one shipment. A patient who started ' +
                        'before the change still has a second shipment coming and does ' +
                        'not need to request it.',
        endsWhen: 'The last pre-change second fill has shipped. Operations closes this ' +
                  'block and sets active to false.'
      }
    },

    farmakeio: {
      key: 'farmakeio',
      name: 'Farmakeio Pharmacy',
      abbrev: 'FKO',
      color: '#EF6C00',
      type: 'compounding',
      visibility: 'provider',
      status: 'active',
      preferredStates: ['AK', 'AL', 'AR', 'CO', 'CT', 'DC', 'DE', 'GA', 'HI', 'IA', 'ID', 'IN', 'KS', 'KY', 'LA', 'MA', 'ME', 'MI', 'MN', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NM', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'],
      shipsTo: [
        'AK', 'AL', 'AR', 'AZ', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
        'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD',
        'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH',
        'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
      ],
      hardExcludes: ['CA'],
      shipsToNote: 'Ships to 49 states plus DC. California is the single state Farmakeio ' +
                   'will not ship to, and that cannot be overridden. Preferred everywhere ' +
                   'except CA, TX, FL, AZ and NV.',
      address: 'Farmakeio Pharmacy, 1736 N Greenville Ave, Richardson, TX 75081',
      orderVia: 'Tebra Compound',
      billing: 'Bill to KORB Health Group, ship to patient',
      notes: [
        'Products ship as a HOME KIT that includes syringes and supplies.',
        'Compounded with pyridoxine (B-6) for nausea prevention, not B-12.',
        'Semaglutide is a single concentration (2.5 mg/25 mg per mL). Dose is set by ' +
        'volume; the only variable on the Rx is how many mL.',
        'Tirzepatide is a single concentration (18 mg/25 mg per mL).'
      ]
    },

    greenwich: {
      key: 'greenwich',
      name: 'Greenwich Pharmacy',
      abbrev: 'GWP',
      color: '#2E7D32',
      type: 'compounding',
      visibility: 'provider',
      status: 'glp1-retired',
      statusNote: 'NOT A GLP-1 PHARMACY as of 2026-09-11. Greenwich tirzepatide is ' +
                  'retired in every state, not California only, and there is no ' +
                  'continuation route. All tirzepatide moves to Belmar. Greenwich ' +
                  'remains a Functional Health & Longevity peptide pharmacy and nothing ' +
                  'else. Do not route any GLP-1 patient here, new or established, and do ' +
                  'not offer it as a GLP-1 option in any state.',
      glp1Retired: {
        retired: true,
        retiredOn: '2026-09-11',
        movesTo: 'belmar',
        decidedBy: 'Don Stevenson',
        reason: 'Greenwich stopped shipping to California, which removed the last ' +
                'reason to keep a second tirzepatide route open. Rather than carve ' +
                'California out, the whole Greenwich GLP-1 line is retired and every ' +
                'tirzepatide patient moves to Belmar.',
        opsAction: 'Move every established Greenwich tirzepatide patient to Belmar at ' +
                   'their next fill, California first. Place no further Greenwich GLP-1 ' +
                   'orders.'
      },
      preferredStates: [],
      shipsTo: [
        'AL', 'AK', 'AZ', 'CO', 'CT', 'DE', 'DC', 'FL',
        'GA', 'HI', 'ID', 'IL', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
        'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WV', 'WI',
        'WY'
      ],
      hardExcludes: ['AR', 'CA', 'IN', 'NH', 'WA'],
      shipsToNote: 'Ships to 45 states and DC as of 2026-09-11 \u2014 Greenwich stopped ' +
                   'shipping to AR, CA, IN, NH and WA. This list now governs peptides ' +
                   'only. For GLP-1 the ship-to list is irrelevant: Greenwich fills no ' +
                   'GLP-1 anywhere.',
      address: 'Greenwich Rx, 9733 FM 2920 Rd, Suite 100, Tomball, TX 77375',
      orderVia: 'Tebra Compound',
      orderViaNote: 'Moved from MDToolbox to Tebra Compound. MDToolbox is being turned ' +
                    'off at the end of August 2026.',
      billing: 'Bill to KORB Health Group, ship to patient',
      bud: '90 days',
      notes: [
        'Ships FedEx next-day only, Monday through Thursday. Patient should receive ' +
        'within three business days of order.',
        'The patient does not receive a shipping confirmation from the pharmacy.',
        'Ships in disposable coolers with ice packs in summer, Kangaroo Pouch Mailers ' +
        'the rest of the year.',
        'Will NOT accept a do-not-fill date.',
        'B-12 only. No other added formulations.',
        'Patient is automatically shipped a 10-pack of 50-unit insulin syringes.',
        'Ordering 4 mL on the prescription ships two 2 mL vials.',
        'Dose is set by concentration, not volume.',
        'HISTORICAL \u2014 every Greenwich GLP-1 dose was exactly 50 units in a 50-unit ' +
        'syringe, and the 100-UNIT SYRINGE callout used for Functional Health peptides ' +
        'was deliberately kept off those sigs. Greenwich GLP-1 ended 2026-09-11; this ' +
        'is here for anyone reading an order placed before then. It says nothing about ' +
        'peptide sigs, which do follow the FH&L syringe rule.',
        'AR, CA, IN, NH and WA \u2014 send nothing here, peptide or otherwise. Greenwich ' +
        'stopped shipping to these five states on 2026-09-11.'
      ]
    },

    lillydirect: {
      key: 'lillydirect',
      name: 'LillyDirect',
      color: '#C62828',
      type: 'manufacturer-direct',
      visibility: 'provider',
      status: 'active',
      preferredStates: [],
      shipsTo: [],
      hardExcludes: [],
      orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
      billing: 'Patient pays the manufacturer program directly. See brandRules.',
      notes: [
        'Cash-pay, direct-to-patient. Dispensing, payment, shipping and delivery ' +
        'are managed by the manufacturer. KORB does not manage fulfillment.',
        'Carries Zepbound KwikPen and Foundayo (orforglipron) oral tablets.',
        'Not a KORB compounding pharmacy. Provider-side only.'
      ]
    },

    novocare: {
      key: 'novocare',
      name: 'NovoCare',
      color: '#00695C',
      type: 'manufacturer-direct',
      visibility: 'provider',
      status: 'active',
      preferredStates: [],
      shipsTo: [],
      hardExcludes: [],
      orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
      billing: 'Patient pays the manufacturer program directly. See brandRules.',
      notes: [
        'Cash-pay manufacturer program. KORB does not manage fulfillment.',
        'Carries the Wegovy pen and the Wegovy oral tablet.',
        'Not a KORB compounding pharmacy. Provider-side only.'
      ]
    },

    local_pharmacy: {
      key: 'local_pharmacy',
      name: 'Patient\u2019s local pharmacy',
      color: '#455A64',
      type: 'retail',
      visibility: 'provider',
      status: 'active',
      brandOnly: true,
      preferredStates: [],
      shipsTo: [],
      hardExcludes: [],
      orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
      billing: 'Patient pays the pharmacy directly. See brandRules.',
      notes: [
        'BRAND-NAME PRODUCTS ONLY. Compounded products cannot be sent here.',
        'Available on patient request, under the same brand rules.',
        'KORB will not re-send a prescription between pharmacies to find a lower ' +
        'price. The patient compares pricing before asking for the prescription.'
      ]
    }
  },

  /* ── BRAND-NAME RULES ────────────────────────────────────────────────────
     Apply to every brand-name pathway regardless of channel: LillyDirect,
     NovoCare, or the patient's local pharmacy. */
  brandRules: {
    availableStates: ['TX', 'CA', 'AL', 'WI'],
    availableStatesNote:
      'Brand-name GLP-1 through the manufacturer programs is only available in Texas, ' +
      'California, Alabama and Wisconsin. Source: the brand prescribing document. ' +
      'This is a program limit, not a shipping limit \u2014 do not offer a brand pathway ' +
      'to a patient outside these four states.',
    orderVia: 'Tebra Standard prescription (NOT Tebra Compound)',
    billing: 'Patient pays the manufacturer program or the local pharmacy directly.',
    noPriorAuth: true,
    noCoupons: true,
    patientResponsibility:
      'KORB does not complete insurance prior authorizations and does not handle ' +
      'coupons or manufacturer savings cards. The patient is responsible for ' +
      'checking pricing, coverage and every other aspect of the medication.',
    localPharmacyAllowed: true,
    noPharmacyShopping:
      'A brand prescription can be sent to the patient\u2019s local pharmacy on request, ' +
      'under the same rules. KORB will not re-send a prescription between pharmacies ' +
      'to chase a lower price. The patient does that comparison before ordering.'
  },

  /* ── CLINICAL BOILERPLATE ────────────────────────────────────────────────
     Identical in all eight pharmacy documents. Stated once here. */
  clinical: {

    programName: 'Metabolic Health & Weight Loss Program',
    visitCadence: 'Every 4 to 8 weeks',

    indications: [
      'Weight loss',
      'Medically driven weight loss',
      'Increased energy',
      'Better sleep',
      'Improved mental health',
      'Improved cardiovascular health'
    ],

    candidateCriteria: {
      /* Don, 2026-09-06. KORB sees adults only. Stated here rather than left
         implicit, because these molecules carry approved adolescent indications
         (semaglutide from age 12) and a provider reading an approval list with no
         age line has nothing telling them KORB's scope is narrower. */
      age: 'Adults 18 years and older. KORB does not treat patients under 18.',
      bmi: [
        'BMI greater than 25 is overweight',
        'BMI greater than 30 is obese'
      ],
      /* RETIRED 2026-09-05. This list is semaglutide's and it was shared by every
         drug, which is how the Belmar tirzepatide document came to carry semaglutide's
         indications. Each monograph now holds its own. Kept only so an older consumer
         does not throw; the renderer deliberately skips it. DO NOT render this. */
      fdaApprovedRetired: true,
      fdaApproved: [
        'Weight loss',
        'Type 2 diabetes',
        'Prevention of cardiovascular death, myocardial infarction and stroke in ' +
        'adults with established cardiovascular disease who are overweight or obese'
      ],
      diabetesNote:
        'KORB treats weight loss. Patients who are diabetic or pre-diabetic are ' +
        'acceptable. The patient must continue diabetes management with their PCP \u2014 ' +
        'KORB does not manage diabetes and does not order or monitor labs for it.'
    },

    contraindications: [
      'Personal or family history of medullary thyroid carcinoma (MTC)',
      'Multiple endocrine neoplasia syndrome type 2 (MEN2)',
      'Hypersensitivity to the active drug or any component of the formulation',
      'Current pregnancy, breastfeeding, or planning pregnancy',
      'Active gallbladder disease or history of gallbladder-related surgical complications',
      'History of pancreatitis (use with caution)',
      'Severe gastrointestinal disorders such as gastroparesis',
      'Severe renal impairment (eGFR below 30 mL/min/1.73 m²)',
      'Uncontrolled diabetic retinopathy (primarily relevant in type 2 diabetes)'
    ],

    sideEffects: {
      common: [
        'Pain, redness or swelling at the injection site',
        'Nausea and vomiting',
        'Diarrhea',
        'Stomach pain',
        'Constipation',
        'Low appetite',
        'Headaches',
        'Dizziness'
      ],
      lessCommon: [
        'Pancreatitis',
        'Gastroparesis',
        'Bowel obstruction',
        'Gallstone attacks'
      ]
    },

    counseling: [
      'Gastrointestinal side effects are most common during dose escalation.',
      'Slower titration or holding at the current dose may improve tolerability.',
      'Instruct the patient to report persistent, severe or worsening symptoms.',
      'New or severe symptoms may require dose adjustment, temporary hold, or discontinuation.',
      'Vials are good for 28 days from first use regardless of the pharmacy BUD. ' +
      'Counsel the patient to discard at 28 days even if medication remains.'
    ]
  },

// ── DRUG MONOGRAPHS ────────────────────────────────────────────────────────
//  Deep clinical reference, one entry per molecule. Mirrors the structure of the
//  Functional Health clinician reference.
//
//  IMPORTANT DIFFERENCE FROM THE PEPTIDE PROGRAM: semaglutide and tirzepatide are
//  FDA-approved molecules with large randomised trial evidence. The peptides in
//  Functional Health are not. Do not carry the "investigational, preclinical only"
//  framing across. What IS off-label here is the COMPOUNDED preparation, not the
//  molecule, and that distinction should be stated accurately to patients.
  monographs: {

    semaglutide: {
      drug: 'semaglutide',
      /* Supplied by Don 2026-09-05. Five of the six he listed. The sixth - chronic
         weight management in adolescents - is CLOSED, not pending: Don confirmed on
         2026-09-06 that KORB treats adults 18 and older only, so the adolescent
         indication is deliberately absent and stays absent. The adults-only rule is
         stated positively in clinical.candidateCriteria.age rather than left as an
         omission a reader has to notice. */
      indications: [
        'Chronic weight management and long-term maintenance of weight reduction in ' +
        'adults with obesity, or overweight with at least one weight-related comorbid condition',
        'Improvement of glycemic control in adults with type 2 diabetes mellitus',
        'Reduction of cardiovascular risk in adults with type 2 diabetes and ' +
        'established cardiovascular disease',
        'Reduction of kidney disease progression and cardiovascular death in adults ' +
        'with type 2 diabetes and chronic kidney disease',
        'Treatment of noncirrhotic MASH with moderate-to-advanced liver fibrosis ' +
        '(F2-F3) in adults'
      ],
      indicationsSource: 'Don, 2026-09-05',
      /* Don, 2026-09-05: applies to BOTH molecules. The indication list is what the
         molecule is approved for; it is not what KORB treats. Rendered directly
         beneath the indications on every document so the two are never read apart. */
      korbScope:
        'KORB treats weight loss only. Every other indication above stays with the ' +
        'patient\'s PCP or specialist - KORB does not manage type 2 diabetes, ' +
        'cardiovascular risk, chronic kidney disease or MASH, and does not order or ' +
        'monitor labs for them. A patient carrying one of those diagnoses is ' +
        'acceptable on the weight-loss program provided that care continues elsewhere.',
      title: 'Semaglutide \u2014 GLP-1 receptor agonist',
      definition:
        'Long-acting glucagon-like peptide-1 (GLP-1) receptor agonist. A 31-amino-acid ' +
        'analogue with roughly 94% homology to human GLP-1, acylated with a C18 fatty ' +
        'diacid that binds albumin and extends the half-life to about one week, allowing ' +
        'once-weekly dosing. FDA-approved as Ozempic and Rybelsus for type 2 diabetes and ' +
        'as Wegovy for chronic weight management.',
      mechanism: [
        'Agonises the GLP-1 receptor.',
        'Glucose-dependent insulin secretion from pancreatic beta cells.',
        'Suppression of inappropriate glucagon release.',
        'Slowed gastric emptying, which prolongs satiety.',
        'Direct action on hypothalamic appetite centres, principally the arcuate nucleus, ' +
        'reducing hunger and energy intake.',
        'Insulin release is glucose-dependent, so hypoglycaemia risk is low as monotherapy.'
      ],
      evidence: [
        'Strong randomised evidence \u2014 for the BRANDED product.',
        'STEP 1: mean weight loss near 15% of body weight at 68 weeks, against roughly 2.4% on placebo.',
        'SELECT: significant reduction in major adverse cardiovascular events in adults with ' +
        'overweight or obesity and established cardiovascular disease, without diabetes.',
        'Weight regain is common after discontinuation. Raise this at the start rather than ' +
        'letting it become a later surprise.'
      ],
      absoluteContraindications: [
        'Personal or family history of medullary thyroid carcinoma (MTC)',
        'Multiple endocrine neoplasia syndrome type 2 (MEN2)',
        'Known hypersensitivity to semaglutide or any component of the formulation',
        'Pregnancy, breastfeeding, or planning pregnancy'
      ],
      cautions: [
        'History of pancreatitis \u2014 evaluate carefully before initiating',
        'Gastroparesis or other significant gastrointestinal motility disorder',
        'Active gallbladder disease or prior gallbladder-related surgical complications',
        'Severe renal impairment (eGFR below 30 mL/min/1.73 m\u00b2)',
        'Diabetic retinopathy \u2014 rapid glycaemic improvement can transiently worsen it',
        'History of suicidal ideation or active depression \u2014 no causal link has been ' +
        'established in regulatory review, but monitor and ask'
      ],
      interactions: [
        'Delayed gastric emptying can alter absorption of concomitant oral medication. ' +
        'Use caution with narrow-therapeutic-index drugs such as levothyroxine and warfarin.',
        'Insulin and sulfonylureas: additive hypoglycaemia risk. Dose reduction of the ' +
        'concomitant agent is often required. Coordinate with the prescribing PCP.',
        'Alcohol may increase hypoglycaemia risk and worsen gastrointestinal side effects.',
        'ANAESTHESIA AND PROCEDURES: delayed gastric emptying raises aspiration ' +
        'risk under sedation. HOLD for 7 days (one week) before an elective ' +
        'procedure requiring sedation, or for whatever longer period the ' +
        'anaesthesia team or the surgeon\'s office requires - their instruction ' +
        'takes precedence over this one. Tell the patient to disclose GLP-1 use to ' +
        'any surgeon, proceduralist or anaesthetist.',
        'Other GLP-1 receptor agonists: do not combine. Concomitant use is not recommended.'
      ],
      monitoring: [
        'Weight and BMI at each visit',
        'Ask about blood pressure \u2014 monitored by the PCP, not measured by KORB',
        'Ask about recent HbA1c or glucose if diabetic \u2014 ordered by the PCP, not by KORB',
        'Gastrointestinal tolerance, especially through dose escalation',
        'Abdominal pain that is severe or radiates to the back \u2014 assess for pancreatitis',
        'Right-upper-quadrant pain \u2014 assess for gallbladder disease',
        'Mood and mental health',
        'Lean mass preservation \u2014 protein intake and resistance training',
        'Injection site and adherence'
      ],
      counselingScript:
        'Semaglutide works on the same pathway as a hormone your body already makes. It ' +
        'slows how quickly your stomach empties and reduces appetite signalling, so you ' +
        'feel full sooner and stay full longer. Nausea is the most common side effect and ' +
        'is usually worst in the first days after a dose increase. This is a compounded ' +
        'preparation rather than the brand-name product. Weight tends to come back if the ' +
        'medication stops, so we should talk about this as a long-term plan rather than a ' +
        'short course. Tell any surgeon or anaesthetist that you are taking this.',
      attestation:
        'Patient counseled on semaglutide as a GLP-1 receptor agonist for chronic weight ' +
        'management, including that a compounded preparation is being dispensed rather ' +
        'than the FDA-approved branded product. Mechanism, expected time course, ' +
        'gastrointestinal side effects during titration, pancreatitis and gallbladder ' +
        'warning signs, the need to disclose GLP-1 use before any procedure requiring ' +
        'sedation, likelihood of weight regain on discontinuation, and the monitoring and ' +
        'follow-up plan were reviewed. Patient verbalized understanding and consented to ' +
        'proceed.',
      icd10: {
        note: 'DOCUMENTATION ONLY \u2014 NOT BILLING. Select the code matching the documented presentation.',
        primary: ['E66.9 \u2014 Obesity, unspecified',
                  'E66.01 \u2014 Morbid (severe) obesity due to excess calories',
                  'E66.3 \u2014 Overweight'],
        secondary: ['Z68.\u2013 \u2014 Body mass index (add the matching BMI code)',
                    'Z71.3 \u2014 Dietary counseling and surveillance',
                    'Z72.3 \u2014 Lack of physical exercise']
      }
    },

    tirzepatide: {
      drug: 'tirzepatide',
      title: 'Tirzepatide \u2014 dual GIP and GLP-1 receptor agonist',
      /* Supplied by Don 2026-09-05. The Belmar tirzepatide source document carried
         semaglutide's indication list, which is how this surfaced - a provider
         reading the tirzepatide document was reading the wrong drug's indications.
         Stored here so every generated tirzepatide document renders the same four
         and none of them inherits semaglutide's by accident. */
      indications: [
        'Chronic weight management in adults with obesity (BMI >= 30 kg/m2), or ' +
        'overweight (BMI >= 27 kg/m2) with at least one weight-related comorbid condition',
        'Long-term maintenance of weight reduction',
        'Improvement of glycemic control in patients with type 2 diabetes mellitus',
        'Treatment of moderate-to-severe obstructive sleep apnea in adults with obesity'
      ],
      indicationsSource: 'Don, 2026-09-05',
      /* Don, 2026-09-05: same rule as semaglutide. */
      korbScope:
        'KORB treats weight loss only. Every other indication above stays with the ' +
        'patient\'s PCP or specialist - KORB does not manage type 2 diabetes or ' +
        'obstructive sleep apnea, and does not order or monitor labs for them. A ' +
        'patient carrying one of those diagnoses is acceptable on the weight-loss ' +
        'program provided that care continues elsewhere.',
      definition:
        'A 39-amino-acid synthetic peptide based on the native GIP sequence, engineered to ' +
        'agonise both the glucose-dependent insulinotropic polypeptide (GIP) receptor and ' +
        'the GLP-1 receptor. A C20 fatty diacid moiety extends the half-life to roughly ' +
        'five days, allowing once-weekly dosing. FDA-approved as Mounjaro for type 2 ' +
        'diabetes and as Zepbound for chronic weight management and obstructive sleep ' +
        'apnoea in adults with obesity.',
      mechanism: [
        'Dual incretin agonism \u2014 both the GIP and the GLP-1 receptor.',
        'GLP-1 component: glucose-dependent insulin secretion, glucagon suppression, delayed ' +
        'gastric emptying, central appetite reduction.',
        'GIP component: enhanced insulin secretion and improved insulin sensitivity in adipose tissue.',
        'GIP agonism may also blunt the nausea seen with GLP-1 activity alone, one proposed ' +
        'reason tolerability holds up at higher relative efficacy.'
      ],
      evidence: [
        'SURMOUNT-1: mean weight loss around 20% of body weight at 15 mg over 72 weeks \u2014 the ' +
        'largest effect seen with a pharmacological agent in this class.',
        'SURPASS programme: glycaemic efficacy in type 2 diabetes, generally exceeding ' +
        'semaglutide in head-to-head comparison.',
        'SURMOUNT-OSA: supported the obstructive sleep apnoea indication.',
        'As with semaglutide, weight regain after discontinuation is well documented.'
      ],
      absoluteContraindications: [
        'Personal or family history of medullary thyroid carcinoma (MTC)',
        'Multiple endocrine neoplasia syndrome type 2 (MEN2)',
        'Known hypersensitivity to tirzepatide or any component of the formulation',
        'Pregnancy, breastfeeding, or planning pregnancy'
      ],
      cautions: [
        'History of pancreatitis \u2014 evaluate carefully before initiating',
        'Gastroparesis or other significant gastrointestinal motility disorder',
        'Active gallbladder disease or prior gallbladder-related surgical complications',
        'Severe renal impairment (eGFR below 30 mL/min/1.73 m\u00b2)',
        'Diabetic retinopathy \u2014 rapid glycaemic improvement can transiently worsen it',
        'History of suicidal ideation or active depression \u2014 monitor and ask'
      ],
      interactions: [
        'ORAL CONTRACEPTIVES: tirzepatide reduces the effectiveness of oral hormonal ' +
        'contraception. Advise a non-oral method, or add a barrier method, for four weeks ' +
        'after initiation and for four weeks after each dose increase. This is specific to ' +
        'tirzepatide and is easy to miss.',
        'Delayed gastric emptying can alter absorption of concomitant oral medication. ' +
        'Use caution with narrow-therapeutic-index drugs such as levothyroxine and warfarin.',
        'Insulin and sulfonylureas: additive hypoglycaemia risk. Dose reduction of the ' +
        'concomitant agent is often required. Coordinate with the prescribing PCP.',
        'Alcohol may increase hypoglycaemia risk and worsen gastrointestinal side effects.',
        'ANAESTHESIA AND PROCEDURES: delayed gastric emptying raises aspiration ' +
        'risk under sedation. HOLD for 7 days (one week) before an elective ' +
        'procedure requiring sedation, or for whatever longer period the ' +
        'anaesthesia team or the surgeon\'s office requires - their instruction ' +
        'takes precedence over this one. Tell the patient to disclose GLP-1 use to ' +
        'any surgeon, proceduralist or anaesthetist.',
        'Other GLP-1 or dual incretin agonists: do not combine.'
      ],
      monitoring: [
        'Weight and BMI at each visit',
        'Ask about blood pressure \u2014 monitored by the PCP, not measured by KORB',
        'Ask about recent HbA1c or glucose if diabetic \u2014 ordered by the PCP, not by KORB',
        'Gastrointestinal tolerance, especially through dose escalation',
        'Abdominal pain that is severe or radiates to the back \u2014 assess for pancreatitis',
        'Right-upper-quadrant pain \u2014 assess for gallbladder disease',
        'Contraceptive method if the patient uses oral hormonal contraception',
        'Mood and mental health',
        'Lean mass preservation \u2014 protein intake and resistance training',
        'Injection site and adherence'
      ],
      counselingScript:
        'Tirzepatide works on two gut hormone pathways rather than one, which is why it ' +
        'tends to produce more weight loss than semaglutide. It slows stomach emptying and ' +
        'reduces appetite. Nausea is the most common side effect and is usually worst in ' +
        'the days after a dose increase. This is a compounded preparation rather than the ' +
        'brand-name product. If you take a birth control pill, it may not work as reliably ' +
        'for four weeks after we start and after each dose increase, so use a backup ' +
        'method. Weight tends to come back if the medication stops. Tell any surgeon or ' +
        'anaesthetist that you are taking this.',
      attestation:
        'Patient counseled on tirzepatide as a dual GIP/GLP-1 receptor agonist for chronic ' +
        'weight management, including that a compounded preparation is being dispensed ' +
        'rather than the FDA-approved branded product. Mechanism, expected time course, ' +
        'gastrointestinal side effects during titration, pancreatitis and gallbladder ' +
        'warning signs, reduced oral contraceptive effectiveness with the recommended ' +
        'backup precautions, the need to disclose use before any procedure requiring ' +
        'sedation, likelihood of weight regain on discontinuation, and the monitoring and ' +
        'follow-up plan were reviewed. Patient verbalized understanding and consented to ' +
        'proceed.',
      icd10: {
        note: 'DOCUMENTATION ONLY \u2014 NOT BILLING. Select the code matching the documented presentation.',
        primary: ['E66.9 \u2014 Obesity, unspecified',
                  'E66.01 \u2014 Morbid (severe) obesity due to excess calories',
                  'E66.3 \u2014 Overweight'],
        secondary: ['Z68.\u2013 \u2014 Body mass index (add the matching BMI code)',
                    'G47.33 \u2014 Obstructive sleep apnea (if documented and relevant)',
                    'Z71.3 \u2014 Dietary counseling and surveillance',
                    'Z72.3 \u2014 Lack of physical exercise']
      }
    },

    orforglipron: {
      drug: 'orforglipron',
      title: 'Orforglipron \u2014 oral non-peptide GLP-1 receptor agonist',
      /* Supplied by Don 2026-09-06. Before this, Foundayo rendered with no
         Indications section at all. Narrower than semaglutide's and tirzepatide's -
         weight management only, no diabetes or cardiovascular claim - which is
         consistent with the agent being the newest in the program. */
      indications: [
        'Reduction of excess body weight in adults with obesity',
        'Reduction of excess body weight in adults with overweight who have at least ' +
        'one weight-related comorbid condition',
        'Long-term maintenance of weight reduction',
        'Used in combination with a reduced-calorie diet and increased physical activity'
      ],
      indicationsSource: 'Don, 2026-09-06',
      /* Same rule as the other two molecules. Stated even though this list is
         already weight-only, so the three documents read identically and a provider
         is never left inferring scope from which note happens to be present. */
      korbScope:
        'KORB treats weight loss. The indications above are the approved uses of the ' +
        'molecule and are not a list of conditions KORB manages - any other diagnosis ' +
        'the patient carries stays with their PCP or specialist, and KORB does not ' +
        'order or monitor labs for it. Adults 18 and older only.',
      dataFreshnessFlag:
        'NEWEST AGENT IN THE PROGRAM. This monograph is the least certain in this document. ' +
        'Verify against the current FDA prescribing information before relying on any ' +
        'specific claim, particularly dosing intervals, contraindications and interactions.',
      definition:
        'A small-molecule, non-peptide GLP-1 receptor agonist taken orally once daily. ' +
        'Because it is not a peptide, it does not require the absorption enhancer that ' +
        'oral semaglutide depends on, and it is taken without the empty-stomach and ' +
        'water-volume restrictions that apply to oral semaglutide.',
      mechanism: [
        'Binds and activates the GLP-1 receptor as a small molecule rather than a peptide analogue.',
        'Glucose-dependent insulin secretion and glucagon suppression.',
        'Slowed gastric emptying and central appetite reduction, as with the class.',
        'Not a peptide, so it needs no absorption enhancer and carries none of the ' +
        'empty-stomach or water-volume restrictions that apply to oral semaglutide.'
      ],
      evidence: [
        'Supported by the phase 3 programme in obesity and type 2 diabetes.',
        'Evidence base is smaller and shorter than for semaglutide or tirzepatide, simply ' +
        'because the agent is newer.',
        'Long-term outcome data are correspondingly limited.'
      ],
      absoluteContraindications: [
        'Personal or family history of medullary thyroid carcinoma (MTC)',
        'Multiple endocrine neoplasia syndrome type 2 (MEN2)',
        'Known hypersensitivity to orforglipron or any component of the formulation',
        'Pregnancy, breastfeeding, or planning pregnancy'
      ],
      cautions: [
        'History of pancreatitis',
        'Gastroparesis or other significant gastrointestinal motility disorder',
        'Active gallbladder disease',
        'Severe renal impairment',
        'History of suicidal ideation or active depression \u2014 monitor and ask'
      ],
      interactions: [
        'Delayed gastric emptying can alter absorption of concomitant oral medication.',
        'Insulin and sulfonylureas: additive hypoglycaemia risk.',
        'ANAESTHESIA AND PROCEDURES: the same rule as the injectable GLP-1 agents. ' +
        'HOLD for 7 days (one week) before an elective procedure requiring ' +
        'sedation, or for whatever longer period the anaesthesia team or the ' +
        'surgeon\'s office requires - their instruction takes precedence. The ' +
        'patient must disclose use before any procedure requiring sedation.',
        'Other GLP-1 receptor agonists: do not combine.',
        'Verify the current prescribing information \u2014 the interaction profile for this ' +
        'agent is less established than for the older molecules.'
      ],
      monitoring: [
        'Weight and BMI at each visit',
        'Ask about blood pressure \u2014 monitored by the PCP, not measured by KORB',
        'Ask about recent HbA1c or glucose if diabetic \u2014 ordered by the PCP, not by KORB',
        'Gastrointestinal tolerance through titration',
        'Abdominal pain that is severe or radiates to the back \u2014 assess for pancreatitis',
        'Mood and mental health',
        'Lean mass preservation \u2014 protein intake and resistance training',
        'Adherence \u2014 daily dosing is easier to miss than weekly'
      ],
      counselingScript:
        'This is a once-daily tablet that works on the same gut hormone pathway as the ' +
        'injectable medications, but it is a different kind of molecule, so you can take ' +
        'it with or without food and without the water restrictions that apply to some ' +
        'other oral options. Swallow it whole. Nausea is the most common side effect and ' +
        'is usually worst after a dose increase. It is newer than the injectables, so ' +
        'there is less long-term data. Tell any surgeon or anaesthetist that you take it.',
      attestation:
        'Patient counseled on orforglipron as an oral GLP-1 receptor agonist for chronic ' +
        'weight management. Mechanism, once-daily administration, expected time course, ' +
        'gastrointestinal side effects during titration, pancreatitis warning signs, the ' +
        'more limited long-term evidence base relative to the injectable agents, the need ' +
        'to disclose use before any procedure requiring sedation, and the monitoring and ' +
        'follow-up plan were reviewed. Patient verbalized understanding and consented to ' +
        'proceed.',
      icd10: {
        note: 'DOCUMENTATION ONLY \u2014 NOT BILLING. Select the code matching the documented presentation.',
        primary: ['E66.9 \u2014 Obesity, unspecified',
                  'E66.01 \u2014 Morbid (severe) obesity due to excess calories',
                  'E66.3 \u2014 Overweight'],
        secondary: ['Z68.\u2013 \u2014 Body mass index (add the matching BMI code)',
                    'Z71.3 \u2014 Dietary counseling and surveillance',
                    'Z72.3 \u2014 Lack of physical exercise']
      }
    }
  },

  /* Applies across every GLP-1 agent, regardless of molecule or pharmacy. */
  escalation: {
    hardStop: [
      'Suspected pancreatitis \u2014 severe persistent abdominal pain, often radiating to the ' +
      'back, with or without vomiting. Stop the medication and evaluate.',
      'Hypersensitivity or anaphylaxis-type reaction.',
      'Pregnancy identified or confirmed.',
      'Medullary thyroid carcinoma or MEN2 identified at any point.',
      'Persistent severe vomiting with dehydration or acute kidney injury.'
    ],
    flagAndReassess: [
      'Gastrointestinal side effects that do not settle within two weeks of a dose increase ' +
      '\u2014 hold at the current dose or step back rather than pushing forward.',
      'Right-upper-quadrant pain, or gallstone symptoms.',
      'Rapid or excessive weight loss, or loss of lean mass.',
      'New or worsening depression, or any mention of suicidal thoughts.',
      'Worsening retinopathy in a diabetic patient during rapid glycaemic improvement.',
      'Plateau with no further response at the maximum tolerated dose \u2014 reassess the plan ' +
      'rather than continuing indefinitely.',
      'Patient scheduled for surgery or a procedure requiring sedation \u2014 coordinate holding.'
    ]
  },

  /* WADA does not currently prohibit GLP-1 receptor agonists, unlike the growth
     hormone secretagogues in the Functional Health program. The athlete hard stop
     that applies there does NOT transfer here. Verify current status if a
     competitive athlete is being considered. */
  athleteNote:
    'GLP-1 receptor agonists are not currently on the WADA prohibited list, so the athlete ' +
    'hard stop used in the Functional Health peptide program does not apply to this ' +
    'program. Confirm current WADA status before treating a tested competitive athlete.',

  /* ── PRODUCTS ────────────────────────────────────────────────────────────
     One entry per pharmacy + drug + formulation. Prescribing fields follow the
     Functional Health layout exactly, in Tebra Compound order:
       Drug Formulation, Name, Allow Substitution, Quantity, Unit, Refill,
       Days Supply, Patient Instructions, Reason for Compounding,
       Pharmacy Instructions.

     QUANTITY IS TOTAL MILLILITRES, not a vial count. Greenwich 15 mg 8-week is
     quantity 4 = two 2 mL vials. Do not "correct" these to vial counts.

     Reviewed line by line and corrected 2026-08-09. Brand-name products further
     down are Tebra STANDARD prescriptions and deliberately do not use this shape.
     ──────────────────────────────────────────────────────────────────────── */
  products: {

    premier_sema: {
      key: 'premier_sema',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'premier',
      drug: 'semaglutide',
      label: 'Premier \u2014 Semaglutide / B-12',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide 3 mg / B-12 0.5 mg per mL',
      doses: [
        {
          dose: '0.3 mg', mg: 0.3, units: 10,
          vials4: '0.6 ml', vials8: '0.6 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 0.3 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 0.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 0.3 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 1.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '0.6 mg', mg: 0.6, units: 20,
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 0.6 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 0.6 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '1.2 mg', mg: 1.2, units: 40,
          vials4: '0.6 ml x 1 & 1 ml x 1', vials8: '0.6 ml x 2 & 1 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 1.2 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 1.2 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 3.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '1.8 mg', mg: 1.8, units: 60,
          vials4: '2.4 ml', vials8: '2.4 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 1.8 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2.4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 1.8 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4.8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '2.7 mg', mg: 2.7, units: 90,
          vials4: '3.6 ml', vials8: '3.6 ml x 2',
          drugFormulation: 'Semaglutide/B-12 3mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Semaglutide 2.7 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Semaglutide 2.7 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 7.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        }
      ]
    },

    premier_sema_glycine: {
      key: 'premier_sema_glycine',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'premier',
      drug: 'semaglutide',
      label: 'Premier \u2014 Semaglutide / B-12 / Glycine',
      exclusiveTo: 'premier',
      exclusiveNote: 'The glycine formulation is only available from Premier. A patient ' +
        'moving to a state Premier cannot ship to must move to another pharmacy and ' +
        'switch to semaglutide WITHOUT glycine \u2014 there is no glycine equivalent elsewhere.',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide 3 mg / B-12 0.5 mg / Glycine 5 mg per mL',
      doses: [
        {
          dose: '0.3 mg', mg: 0.3, units: 10,
          vials4: '1 ml vial', vials8: '1 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.3 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.3 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 0.3 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '0.6 mg', mg: 0.6, units: 20,
          vials4: '1 ml vial', vials8: '1 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.6 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 0.6 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 0.6 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '1.2 mg', mg: 1.2, units: 40,
          vials4: '1 ml x 2 vials', vials8: '1 ml x 4 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.2 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.2 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 1.2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '1.8 mg', mg: 1.8, units: 60,
          vials4: '1 ml x 3 vials', vials8: '1 ml x 5 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.8 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 1.8 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 1.8 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        },
        {
          dose: '2.7 mg', mg: 2.7, units: 90,
          vials4: '1 ml x 4 vials', vials8: '1 ml x 8 vials',
          drugFormulation: 'Semaglutide/B-12/Glycine 3mg/0.5mg/5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Glycine Semaglutide 2.7 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'GLYCINE \u2013 INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          },
          supply8: {
            name: 'PREMIER \u2013 Glycine Semaglutide 2.7 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'Maintenance \u2013 GLYCINE \u2013 INJECT 2.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12 and glycine.'
          }
        }
      ]
    },

    premier_tirz: {
      key: 'premier_tirz',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'premier',
      drug: 'tirzepatide',
      label: 'Premier \u2014 Tirzepatide / B-12',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Tirzepatide 18 mg / B-12 0.5 mg per mL',
      doses: [
        {
          dose: '2 mg', mg: 2, units: 11, priceTier: 'T1A',
          vials4: '0.6 ml', vials8: '0.6 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 2 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 0.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 2 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 1.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 2 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '4 mg', mg: 4, units: 22, priceTier: 'T1A',
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 4 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 4 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '6.5 mg', mg: 6.5, units: 36, priceTier: 'T2A',
          vials4: '0.6 ml & 1 ml', vials8: '0.6 ml x 2 & 1 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 6.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 6.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 6.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 3.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 6.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '8.5 mg', mg: 8.5, units: 47, priceTier: 'T2A',
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 8.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 8.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 8.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 8.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '13.5 mg', mg: 13.5, units: 75, priceTier: 'T3A',
          vials4: '1 ml & 2 ml', vials8: '2 ml x 3',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 13.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 13.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 13.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 13.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        },
        {
          dose: '16 mg', mg: 16, units: 89, priceTier: 'T3A',
          vials4: '3.6 ml', vials8: '3.6 ml x 2',
          drugFormulation: 'Tirzepatide/B-12 18mg/0.5mg per mL inj',
          supply4: {
            name: 'PREMIER \u2013 Tirzepatide 16 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3.6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 16 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          },
          supply8: {
            name: 'PREMIER \u2013 Tirzepatide 16 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 7.2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 16 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12.'
          }
        }
      ]
    },

    belmar_sema: {
      key: 'belmar_sema',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'belmar',
      drug: 'semaglutide',
      label: 'Belmar \u2014 Semaglutide / B-12',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide / B-12, two concentrations by dose band',
      supplyNote: '8-week program ships as a single fill, 56 days, no refill ' +
                  '(changed 2026-09-05). Dispensed quantity pending confirmation ' +
                  '— see needsConfirmation BELMAR-8WK-QTY.',
      doses: [
        {
          dose: '0.25 mg', mg: 0.25, units: 25,
          conc: '1 mg/1 mg/ml',
          vials4: '1 ml x 1 vial', vials8: '1 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12 1mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 0.25 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.25 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 1 ml @ 1 mg/ml',
              totalMl: 1,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 4,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 0.25 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.25 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '2 x 1 ml @ 1 mg/ml',
              totalMl: 2,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 4,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          }
        },
        {
          dose: '0.5 mg', mg: 0.5, units: 50,
          conc: '1 mg/1 mg/ml',
          vials4: '1 ml x 2 vials', vials8: '1 ml x 4 vials',
          drugFormulation: 'Semaglutide/B-12 1mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 0.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '2 x 1 ml @ 1 mg/ml',
              totalMl: 2,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 2,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 0.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '4 x 1 ml @ 1 mg/ml',
              totalMl: 4,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 2,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          }
        },
        {
          dose: '1.0 mg', mg: 1, units: 100,
          conc: '1 mg/1 mg/ml',
          vials4: '5 ml x 1 vial', vials8: '5 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12 1mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 1.0 mg \u2013 4-Week Supply',
            flag: 'BELMAR-SEMA-VIAL-OVERSIZE',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 5 ml @ 1 mg/ml',
              totalMl: 5,
              leftoverMl: 1,
              leftoverDoses: 1,
              dosesPerVial: 5,
              withinPunctureLimit: false,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 1.0 mg \u2013 8-Week Supply',
            flag: 'BELMAR-SEMA-VIAL-OVERSIZE',
            allowSubstitution: true,
            quantity: 10,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '2 x 5 ml @ 1 mg/ml',
              totalMl: 10,
              leftoverMl: 2,
              leftoverDoses: 2,
              dosesPerVial: 5,
              withinPunctureLimit: false,
              crossVialDoses: []
            },
          }
        },
        {
          dose: '1.7 mg', mg: 1.7, units: 68,
          conc: '2.5 mg/1 mg/ml',
          vials4: '5 ml x 1 vial', vials8: '5 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12 2.5mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 1.7 mg \u2013 4-Week Supply',
            flag: 'BELMAR-SEMA-VIAL-OVERSIZE',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 5 ml @ 2.5 mg/ml',
              totalMl: 5,
              leftoverMl: 2.28,
              leftoverDoses: 3.35,
              dosesPerVial: 7.35,
              withinPunctureLimit: false,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 1.7 mg \u2013 8-Week Supply',
            flag: 'BELMAR-SEMA-VIAL-OVERSIZE',
            allowSubstitution: true,
            quantity: 10,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1.7 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '2 x 5 ml @ 2.5 mg/ml',
              totalMl: 10,
              leftoverMl: 4.56,
              leftoverDoses: 6.71,
              dosesPerVial: 7.35,
              withinPunctureLimit: false,
              crossVialDoses: [8],
              crossVialNote: 'Dose 8 finish one vial and draw the '  +
                             'remainder from the next. Counsel this directly - it '  +
                             'does not fit the 140-character Patient Instructions field.'
            },
          }
        },
        {
          dose: '2.4 mg', mg: 2.4, units: 96,
          conc: '2.5 mg/1 mg/ml',
          vials4: '5 ml x 1 vial', vials8: '5 ml x 2 vials',
          drugFormulation: 'Semaglutide/B-12 2.5mg/1mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Semaglutide 2.4 mg \u2013 4-Week Supply',
            flag: 'BELMAR-SEMA-VIAL-OVERSIZE',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2.4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 5 ml @ 2.5 mg/ml',
              totalMl: 5,
              leftoverMl: 1.16,
              leftoverDoses: 1.21,
              dosesPerVial: 5.21,
              withinPunctureLimit: false,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Semaglutide 2.4 mg \u2013 8-Week Supply',
            flag: 'BELMAR-SEMA-VIAL-OVERSIZE',
            allowSubstitution: true,
            quantity: 10,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 2.4 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '2 x 5 ml @ 2.5 mg/ml',
              totalMl: 10,
              leftoverMl: 2.32,
              leftoverDoses: 2.42,
              dosesPerVial: 5.21,
              withinPunctureLimit: false,
              crossVialDoses: [6],
              crossVialNote: 'Dose 6 finish one vial and draw the '  +
                             'remainder from the next. Counsel this directly - it '  +
                             'does not fit the 140-character Patient Instructions field.'
            },
          }
        }
      ]
    },

    belmar_tirz: {
      key: 'belmar_tirz',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'belmar',
      drug: 'tirzepatide',
      label: 'Belmar \u2014 Tirzepatide / L-Carnitine',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
      supplyNote: '8-week program ships as a single fill, 56 days, no refill ' +
                  '(changed 2026-09-05). Dispensed quantity pending confirmation ' +
                  '— see needsConfirmation BELMAR-8WK-QTY.',
      doses: [
        {
          dose: '2.5 mg', mg: 2.5, units: 25, priceTier: 'T1A',
          vials4: '1 ml x 1 vial', vials8: '1 ml x 2 vials',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 2.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 1 ml',
              totalMl: 1,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 4,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 2.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '2 x 1 ml',
              totalMl: 2,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 4,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          }
        },
        {
          dose: '5 mg', mg: 5, units: 50, priceTier: 'T1A',
          vials4: '1 ml x 2 vials', vials8: '1 ml x 4 vials',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '2 x 1 ml',
              totalMl: 2,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 2,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '4 x 1 ml',
              totalMl: 4,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 2,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          }
        },
        {
          dose: '7.5 mg', mg: 7.5, units: 75, priceTier: 'T2A',
          vials4: '1 ml x 3 vials', vials8: '1 ml x 6 vials',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 7.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 7.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '3 x 1 ml',
              totalMl: 3,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 1.33,
              withinPunctureLimit: true,
              crossVialDoses: [2, 3]
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 7.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 7.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '6 x 1 ml',
              totalMl: 6,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 1.33,
              withinPunctureLimit: true,
              crossVialDoses: [2, 3, 6, 7],
              crossVialNote: 'Dose 2, 3, 6, 7 finish one vial and draw the '  +
                             'remainder from the next. Counsel this directly - it '  +
                             'does not fit the 140-character Patient Instructions field.'
            },
          }
        },
        {
          dose: '10 mg', mg: 10, units: 100, priceTier: 'T2A',
          vials4: '4 ml x 1 vial', vials8: '4 ml x 2 vials',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 10 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 10 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 4 ml',
              totalMl: 4,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 4,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 10 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 10 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '2 x 4 ml',
              totalMl: 8,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 4,
              withinPunctureLimit: true,
              crossVialDoses: []
            },
          }
        },
        {
          dose: '12.5 mg', mg: 12.5, units: 125, priceTier: 'T3A',
          vials4: '1 ml x 1 vial & 4 ml x 1 vial', vials8: '4 ml x 2 vials & 1 ml x 2 vials',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 12.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 5,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 12.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 4 ml + 1 x 1 ml',
              totalMl: 5,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 3.2,
              withinPunctureLimit: true,
              crossVialDoses: [4]
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 12.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 10,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 12.5 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '2 x 4 ml + 2 x 1 ml',
              totalMl: 10,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 3.2,
              withinPunctureLimit: true,
              crossVialDoses: [4, 7, 8],
              crossVialNote: 'Dose 4, 7, 8 finish one vial and draw the '  +
                             'remainder from the next. Counsel this directly - it '  +
                             'does not fit the 140-character Patient Instructions field.'
            },
          }
        },
        {
          dose: '15 mg', mg: 15, units: 150, priceTier: 'T3A',
          vials4: '1 ml x 2 vials & 4 ml x 1 vial', vials8: '4 ml x 3 vials',
          drugFormulation: 'Tirzepatide/L-Carnatine 10mg/50mg/ml',
          supply4: {
            name: 'BELMAR \u2013 Tirzepatide 15 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 15 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 4 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            vialPlan: {
              ship: '1 x 4 ml + 2 x 1 ml',
              totalMl: 6,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 2.67,
              withinPunctureLimit: true,
              crossVialDoses: [3]
            },
          },
          supply8: {
            name: 'BELMAR \u2013 Tirzepatide 15 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 12,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 15 MG SUBCUTANEOUSLY ONCE WEEKLY AS DIRECTED FOR 8 WEEKS, (Include one pack of insulin syringes) Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation and dosing flexibility. Allergies:',
            /* Vial plan verified 2026-09-05 against the 28-day puncture limit.
               dosesPerVial is what ONE full vial yields, which is the number that
               matters - not the total shipped. Above 4 the vial still holds drug
               after day 21, so a patient who does not discard it takes a 5th. */
            vialPlan: {
              ship: '3 x 4 ml',
              totalMl: 12,
              leftoverMl: 0,
              leftoverDoses: 0,
              dosesPerVial: 2.67,
              withinPunctureLimit: true,
              crossVialDoses: [3, 6],
              crossVialNote: 'Dose 3, 6 finish one vial and draw the '  +
                             'remainder from the next. Counsel this directly - it '  +
                             'does not fit the 140-character Patient Instructions field.'
            },
          }
        }
      ]
    },

    farmakeio_sema: {
      key: 'farmakeio_sema',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'farmakeio',
      drug: 'semaglutide',
      label: 'Farmakeio \u2014 Semaglutide / B-6 Home Kit',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Semaglutide 2.5 mg / Pyridoxine (B-6) 25 mg per mL \u2014 HOME KIT',
      formulationNote: 'Single concentration for every dose. Dose is set by volume; the only variable is how many mL (1, 2, 3, 4, 5).',
      doses: [
        {
          dose: '0.25 mg', mg: 0.25, units: 10,
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.25 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.10ML (10 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.25 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.10ML (10 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '0.5 mg', mg: 0.5, units: 20,
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.20ML (20 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 0.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.20ML (20 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '1.0 mg', mg: 1, units: 40,
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.0 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.40ML (40 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.0 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.40ML (40 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '1.7 mg', mg: 1.7, units: 68,
          vials4: '3 ml', vials8: '3 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.7 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.68ML (68 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 1.7 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.68ML (68 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '2.5 mg', mg: 2.5, units: 100,
          vials4: '4 ml', vials8: '4 ml x 2',
          drugFormulation: 'Semaglutide/B-6 2.5mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Semaglutide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 1.00ML (100 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Semaglutide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 1.00ML (100 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        }
      ]
    },

    farmakeio_tirz: {
      key: 'farmakeio_tirz',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'farmakeio',
      drug: 'tirzepatide',
      label: 'Farmakeio \u2014 Tirzepatide / B-6 Home Kit',
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'Tirzepatide 18 mg / Pyridoxine (B-6) 25 mg per mL \u2014 HOME KIT',
      formulationNote: 'Single concentration for every dose. Dose is set by volume.',
      doses: [
        {
          dose: '2.5 mg', mg: 2.5, units: 13, priceTier: 'T1A',
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.13ML (13 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.13ML (13 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard 28 days after first use.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '4.5 mg', mg: 4.5, units: 25, priceTier: 'T1A',
          vials4: '1 ml', vials8: '1 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 4.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 1,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.25ML (25 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 4.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.25ML (25 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '7.5 mg', mg: 7.5, units: 42, priceTier: 'T2A',
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 7.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.42ML (42 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 7.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.42ML (42 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '9 mg', mg: 9, units: 50, priceTier: 'T2A',
          vials4: '2 ml', vials8: '2 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 9 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 9 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '13.5 mg', mg: 13.5, units: 75, priceTier: 'T3A',
          vials4: '3 ml', vials8: '3 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 13.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 3,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.75ML (75 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 13.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 6,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.75ML (75 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        },
        {
          dose: '15 mg', mg: 15, units: 83, priceTier: 'T3A',
          vials4: '4 ml', vials8: '4 ml x 2',
          drugFormulation: 'Tirzepatide/B-6 18mg/25mg per mL Home Kit',
          supply4: {
            name: 'FARMAKEIO \u2013 Tirzepatide 15 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.83ML (83 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          },
          supply8: {
            name: 'FARMAKEIO \u2013 Tirzepatide 15 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 8,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.83ML (83 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Home Kit. Custom Rx for N/V mitigation, dosing flexibility, and added B-6.'
          }
        }
      ]
    },

    greenwich_tirz: {
      key: 'greenwich_tirz',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'greenwich',
      drug: 'tirzepatide',
      label: 'Greenwich \u2014 Tirzepatide / B-12 (RETIRED)',
      visibility: 'provider',
      status: 'retired',
      retired: true,
      retiredOn: '2026-09-11',
      movesTo: 'belmar_tirz',
      statusNote: 'RETIRED 2026-09-11 in every state. Do not prescribe, do not continue, ' +
                  'do not order. All tirzepatide moves to Belmar, California first. This ' +
                  'record is kept so anyone reading an order placed before 2026-09-11 can ' +
                  'still see what was dispensed. It is not a live option.',
      route: 'subcutaneous',
      frequency: 'once weekly',
      orderVia: 'Tebra Compound',
      formulation: 'KBH Tirzepatide + B12 Injection \u2014 concentration varies by dose',
      formulationNote: 'Dose is set by concentration, not volume. Every dose injects 0.50 mL (50 units). 4-week supply is written as 2 ml (one 2 ml vial); 8-week supply is written as 4 ml (two 2 ml vials).',
      doses: [
        {
          dose: '2.5 mg', mg: 2.5, units: 50, priceTier: 'T1A',
          conc: '5 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 5mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 2.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 2.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '5 mg', mg: 5, units: 50, priceTier: 'T1A',
          conc: '10 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 10mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '7.5 mg', mg: 7.5, units: 50, priceTier: 'T2A',
          conc: '15 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 15mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 7.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 7.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '10 mg', mg: 10, units: 50, priceTier: 'T2A',
          conc: '20 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 20mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 10 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 10 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '12.5 mg', mg: 12.5, units: 50, priceTier: 'T3A',
          conc: '25 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 25mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 12.5 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 12.5 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        },
        {
          dose: '15 mg', mg: 15, units: 50, priceTier: 'T3A',
          conc: '30 mg/500 mcg/ml',
          vials4: '2 ml vial', vials8: '2 ml x 2 vials',
          drugFormulation: 'KBH    Tirzepatide + B12 Injection 30mg/0.5mg/mL',
          supply4: {
            name: 'GREENWICH \u2013 Tirzepatide 15 mg \u2013 4-Week Supply',
            allowSubstitution: true,
            quantity: 2,
            unit: 'ml',
            refill: 0,
            days: 28,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          },
          supply8: {
            name: 'GREENWICH \u2013 Tirzepatide 15 mg \u2013 8-Week Supply',
            allowSubstitution: true,
            quantity: 4,
            unit: 'ml',
            refill: 0,
            days: 56,
            ptInstructions: 'INJECT 0.50ML (50 UNITS) SUBCUTANEOUSLY ONCE WEEKLY. Discard after 4 doses or 28 days.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx for N/V mitigation, dosing flexibility, and added B-12'
          }
        }
      ]
    },

    premier_oral_sema: {
      key: 'premier_oral_sema',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'premier',
      drug: 'semaglutide',
      label: 'Premier \u2014 Oral Semaglutide Dots',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      positioning: 'Consider for patients focused on long-term metabolic resilience and longevity optimization, or who cannot tolerate injectables.',
      doses: [
        {
          dose: '0.5 mg', mg: 0.5,
          presentation: 'Oral Dot #90',
          chargeCode: 'FITSemOrl90',
          drugFormulation: 'Semaglutide Oral Dot 0.5mg',
          rx: {
            name: 'PREMIER \u2013 Oral Semaglutide 0.5 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 DOT UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '1 mg', mg: 1,
          presentation: 'Oral Dot #90',
          chargeCode: 'FITSemOrl180',
          drugFormulation: 'Semaglutide Oral Dot 1mg',
          rx: {
            name: 'PREMIER \u2013 Oral Semaglutide 1 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 DOT UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    premier_oral_tirz: {
      key: 'premier_oral_tirz',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'premier',
      drug: 'tirzepatide',
      label: 'Premier \u2014 Oral Tirzepatide Dots',
      exclusiveTo: 'premier',
      exclusiveNote: 'Oral tirzepatide is only available from Premier. No other pharmacy ' +
        'offers an oral tirzepatide product.',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      doses: [
        {
          dose: '3 mg', mg: 3,
          presentation: 'Oral Dot #90',
          chargeCode: 'FITTirOrl90',
          drugFormulation: 'Tirzepatide Oral Dot 3mg',
          rx: {
            name: 'PREMIER \u2013 Oral Tirzepatide 3 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 DOT UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '6 mg', mg: 6,
          presentation: 'Oral Dot #180',
          chargeCode: 'FITTirOrl180',
          drugFormulation: 'Tirzepatide Oral Dot 3mg',
          rx: {
            name: 'PREMIER \u2013 Oral Tirzepatide 6 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 180,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 2 DOTS UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    belmar_oral_sema: {
      key: 'belmar_oral_sema',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'belmar',
      drug: 'semaglutide',
      label: 'Belmar \u2014 Oral Semaglutide FastSL',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      doses: [
        {
          dose: '0.5 mg', mg: 0.5,
          presentation: 'FastSL Tablet #45',
          chargeCode: 'FITSemOrl90',
          drugFormulation: 'Semaglutide FastSL 1mg',
          rx: {
            name: 'BELMAR \u2013 Oral Semaglutide 0.5 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 45,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1/2 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '1 mg', mg: 1,
          presentation: 'FastSL Tablet #90',
          chargeCode: 'FITSemOrl180',
          drugFormulation: 'Semaglutide FastSL 1mg',
          rx: {
            name: 'BELMAR \u2013 Oral Semaglutide 1 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    farmakeio_oral_sema: {
      key: 'farmakeio_oral_sema',
      compounded: true,   // compounded by the pharmacy
      pharmacy: 'farmakeio',
      drug: 'semaglutide',
      label: 'Farmakeio \u2014 Oral Semaglutide',
      visibility: 'provider',
      route: 'sublingual',
      frequency: 'once daily',
      orderVia: 'Tebra Compound',
      presentationNote: 'The Farmakeio pricing section calls these Oral Dots; the Tebra favorites section calls them Oral RDT. Same product, 90-day supply.',
      doses: [
        {
          dose: '0.5 mg', mg: 0.5,
          presentation: 'Oral Dot / RDT #90',
          chargeCode: 'FITSemOrl90', price: 299,
          drugFormulation: 'Semaglutide Oral RDT 0.5mg',
          rx: {
            name: 'FARMAKEIO \u2013 Oral Semaglutide 0.5 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        },
        {
          dose: '1 mg', mg: 1,
          presentation: 'Oral Dot / RDT #90',
          chargeCode: 'FITSemOrl180', price: 399,
          drugFormulation: 'Semaglutide Oral RDT 1mg',
          rx: {
            name: 'FARMAKEIO \u2013 Oral Semaglutide 1 mg \u2013 90 Day Supply',
            allowSubstitution: true,
            quantity: 90,
            unit: 'each',
            refill: 0,
            days: 90,
            ptInstructions: 'DISSOLVE 1 TABLET UNDER TONGUE DAILY ON EMPTY STOMACH. NO FOOD OR DRINK 15 MIN AFTER.',
            reasonForCompounding: 'N/V mitigation & flexibility',
            pharmacyNotes: 'Bill to KORB Health Group and ship to the patient. Custom Rx \u2014 no FDA-approved or commercially available equivalent.'
          }
        }
      ]
    },

    /* ── BRAND NAME — Tebra STANDARD prescriptions, not Compound ─────────── */
    zepbound: {
      key: 'zepbound',
      compounded: false,  // brand product, fulfilled by the manufacturer
      brandFamily: 'Zepbound',
      presentationLabel: 'KwikPen',
      pharmacy: 'lillydirect',
      altChannels: ['local_pharmacy'],
      drug: 'tirzepatide',
      label: 'Zepbound (tirzepatide) \u2014 brand name',
      brandName: true,
      visibility: 'provider',
      route: 'subcutaneous',
      frequency: 'once weekly',
      presentation: 'KwikPen \u2014 disposable multi-dose, single-patient-use prefilled pen',
      presentationNote: 'KwikPen only. Do NOT prescribe the single-dose vial presentation.',
      penContains: 'One KwikPen holds 4 fixed weekly doses. The pen locks out after the ' +
        'fourth dose and is then discarded, including any leftover medicine. Do not ' +
        'transfer from the pen into a syringe.',
      dropdownWarning: 'Tebra lists BOTH presentations. The vial reads "Zepbound X mg/' +
        '0.5 ml subcutaneous solution"; the pen reads "Zepbound kwikpen X mg/0.6 ml ...". ' +
        'Selecting the 0.5 mL vial with quantity 1 dispenses ONE WEEK instead of four. ' +
        'The bracketed figure in the pen entry is total pen content \u2014 4 doses x 0.6 mL ' +
        '= 2.4 mL \u2014 which is Tebra confirming the 4-dose device.',
      dropdownNote: 'Strings verified against the Tebra drug search 2026-08-09. The 12.5 mg ' +
        'entry displays as "...pen inject" in the dropdown; that is the list truncating ' +
        'on width, not the stored text.',
      strengths: '2.5, 5, 7.5, 10, 12.5 and 15 mg \u2014 all 0.6 mL',
      retailOption: 'LillyDirect self-pay with free home delivery, or retail pickup at ' +
                    'Walmart Pharmacy.',
      orderVia: 'Tebra Standard prescription',
      pharmacyAddress: 'LillyDirect Self Pay Pharmacy Solutions, 4343 Equity Dr, Columbus, OH 43228-3842 \u00b7 (833) 432-4322',
      dispensing: [
        { key: 'rx4', label: '4-week (28-day)', quantity: 1, unit: 'pen', refill: 0, days: 28,
          use: 'New prescription or any dose change. Use until the dose is stable.' },
        { key: 'rx8', label: '8-week (56-day) \u2014 1 pen + 1 refill', quantity: 1, unit: 'pen', refill: 1, days: 28,
          use: 'Clinically stable patients only. Each fill is one pen covering 4 weeks.' },
        /* Don, 2026-09-06. Brand pharmacies will not ship more than 4 weeks of an
           injectable at a time, so a 12-week program is the same 4-week fill with two
           refills rather than a bigger shipment. Days supply stays 28 because it
           describes the fill, which is the rule used everywhere in this file. */
        { key: "rx12", label: "12-week (84-day) \u2014 1 pen + 2 refills", quantity: 1, unit: "pen", refill: 2, days: 28,
          use: "Clinically stable patients on a settled dose. Three fills of one pen, four weeks each." }
      ],
      doses: [
        { dose: '2.5 mg', mg: 2.5, use: 'Initiation',
          rx4: { drug: 'Zepbound kwikpen 2.5 mg/0.6 ml(10 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 2.5 mg SQ 4-week',
                 ptInstructions: 'Inject 2.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx12: { drug: 'Zepbound kwikpen 2.5 mg/0.6 ml(10 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 2.5 mg SQ 12-week',
                 ptInstructions: 'Inject 2.5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 2, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 2.5 mg/0.6 ml(10 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 2.5 mg SQ 8-week',
                 ptInstructions: 'Inject 2.5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '5 mg', mg: 5, use: 'Titration',
          rx4: { drug: 'Zepbound kwikpen 5 mg/0.6 ml (20 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 5 mg SQ 4-week',
                 ptInstructions: 'Inject 5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx12: { drug: 'Zepbound kwikpen 5 mg/0.6 ml (20 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 5 mg SQ 12-week',
                 ptInstructions: 'Inject 5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 2, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 5 mg/0.6 ml (20 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 5 mg SQ 8-week',
                 ptInstructions: 'Inject 5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '7.5 mg', mg: 7.5, use: 'Titration',
          rx4: { drug: 'Zepbound kwikpen 7.5 mg/0.6 ml(30 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 7.5 mg SQ 4-week',
                 ptInstructions: 'Inject 7.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx12: { drug: 'Zepbound kwikpen 7.5 mg/0.6 ml(30 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 7.5 mg SQ 12-week',
                 ptInstructions: 'Inject 7.5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 2, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 7.5 mg/0.6 ml(30 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 7.5 mg SQ 8-week',
                 ptInstructions: 'Inject 7.5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '10 mg', mg: 10, use: 'Advanced dose',
          rx4: { drug: 'Zepbound kwikpen 10 mg/0.6 ml (40 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 10 mg SQ 4-week',
                 ptInstructions: 'Inject 10 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx12: { drug: 'Zepbound kwikpen 10 mg/0.6 ml (40 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 10 mg SQ 12-week',
                 ptInstructions: 'Inject 10 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 2, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 10 mg/0.6 ml (40 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 10 mg SQ 8-week',
                 ptInstructions: 'Inject 10 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '12.5 mg', mg: 12.5, use: 'Advanced dose',
          rx4: { drug: 'Zepbound kwikpen 12.5 mg/0.6 ml (50 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 12.5 mg SQ 4-week',
                 ptInstructions: 'Inject 12.5 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx12: { drug: 'Zepbound kwikpen 12.5 mg/0.6 ml (50 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 12.5 mg SQ 12-week',
                 ptInstructions: 'Inject 12.5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 2, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 12.5 mg/0.6 ml (50 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 12.5 mg SQ 8-week',
                 ptInstructions: 'Inject 12.5 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } },
        { dose: '15 mg', mg: 15, use: 'Maintenance / maximum dose',
          rx4: { drug: 'Zepbound kwikpen 15 mg/0.6 ml (60 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 15 mg SQ 4-week',
                 ptInstructions: 'Inject 15 mg subcutaneously once weekly for 4 weeks. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 0, days: 28 },
          rx12: { drug: 'Zepbound kwikpen 15 mg/0.6 ml (60 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 15 mg SQ 12-week',
                 ptInstructions: 'Inject 15 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 2, days: 28 },
          rx8: { drug: 'Zepbound kwikpen 15 mg/0.6 ml (60 mg/2.4 ml) subcutaneous pen injector', label: 'Zepbound 15 mg SQ 8-week',
                 ptInstructions: 'Inject 15 mg subcutaneously once weekly. Multi-dose pen \u2014 discard after 4 doses.',
                 quantity: 1, refill: 1, days: 28 } }
      ],
      prescribingNotes: [
        'Sent electronically through Tebra as a STANDARD prescription. No insurance ' +
        'billing and no prior authorization.',
        'Patient completes enrolment, payment and shipping directly with LillyDirect.',
        'PEN NEEDLES ARE REQUIRED and are not included. The patient purchases them, ' +
        'and they can be added at LillyDirect checkout. Each injection uses a new needle.',
        'Zepbound is sold in three formats. KORB uses the KwikPen only.',
        'Rotate injection sites. Follow standard tirzepatide titration principles.',
        'Early refills or replacement shipments are decided by the pharmacy, not KORB.'
      ]
    },
    foundayo: {
      key: "foundayo",
      compounded: false,  // brand product, fulfilled by the manufacturer
      brandFamily: "Foundayo",
      presentationLabel: "Oral tablet",
      pharmacy: "lillydirect",
      altChannels: [
        "local_pharmacy"
      ],
      drug: "orforglipron",
      label: "Foundayo (orforglipron) — brand name oral",
      brandName: true,
      visibility: "provider",
      route: "oral",
      frequency: "once daily",
      presentation: "Oral tablet",
      orderVia: "Tebra Standard prescription",
      pharmacyAddress: "LillyDirect Self Pay Pharmacy Solutions, 4343 Equity Dr, Columbus, OH 43228-3842 \u00b7 (833) 432-4322",
      titration: "Start 0.8 mg once daily. Increase to 2.5 mg after at least 30 days, then 5.5 mg after at least 30 days. Further increases to 9, 14.5 or 17.2 mg at minimum 30-day intervals based on response and tolerability. Maximum 17.2 mg daily.",
      dispensing: [
        { key: "rx30", label: "30-day supply", quantity: 30, refill: 0, days: 30,
          use: "New prescription or any dose change. Use until the dose is stable." },
        { key: "rx60", label: "60-day supply", quantity: 60, refill: 0, days: 60,
          use: "Clinically stable patients only. Quantity 60, no refill." },
        /* Don, 2026-09-06. Same as oral Wegovy: one fill, larger quantity, no refill. */
        { key: "rx90", label: "90-day supply", quantity: 90, refill: 0, days: 90,
          use: "Clinically stable patients on a settled dose. Quantity 90, no refill." }
      ],
      doses: [
        {
      dose: "0.8 mg",
      mg: 0.8,
      use: "Starting dose",
      rx30: { drug: "Foundayo 0.8 mg tablet", label: "Foundayo 0.8 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx90: { drug: "Foundayo 0.8 mg tablet", label: "Foundayo 0.8 mg tablet 90-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 90, refill: 0, days: 90 },
      rx60: { drug: "Foundayo 0.8 mg tablet", label: "Foundayo 0.8 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "2.5 mg",
      mg: 2.5,
      use: "Titration",
      rx30: { drug: "Foundayo 2.5 mg tablet", label: "Foundayo 2.5 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx90: { drug: "Foundayo 2.5 mg tablet", label: "Foundayo 2.5 mg tablet 90-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 90, refill: 0, days: 90 },
      rx60: { drug: "Foundayo 2.5 mg tablet", label: "Foundayo 2.5 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "5.5 mg",
      mg: 5.5,
      use: "Titration",
      rx30: { drug: "Foundayo 5.5 mg tablet", label: "Foundayo 5.5 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx90: { drug: "Foundayo 5.5 mg tablet", label: "Foundayo 5.5 mg tablet 90-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 90, refill: 0, days: 90 },
      rx60: { drug: "Foundayo 5.5 mg tablet", label: "Foundayo 5.5 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "9 mg",
      mg: 9,
      use: "Advanced dose",
      rx30: { drug: "Foundayo 9 mg tablet", label: "Foundayo 9 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx90: { drug: "Foundayo 9 mg tablet", label: "Foundayo 9 mg tablet 90-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 90, refill: 0, days: 90 },
      rx60: { drug: "Foundayo 9 mg tablet", label: "Foundayo 9 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "14.5 mg",
      mg: 14.5,
      use: "Advanced dose",
      rx30: { drug: "Foundayo 14.5 mg tablet", label: "Foundayo 14.5 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx90: { drug: "Foundayo 14.5 mg tablet", label: "Foundayo 14.5 mg tablet 90-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 90, refill: 0, days: 90 },
      rx60: { drug: "Foundayo 14.5 mg tablet", label: "Foundayo 14.5 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        },
        {
      dose: "17.2 mg",
      mg: 17.2,
      use: "Maintenance / maximum dose",
      rx30: { drug: "Foundayo 17.2 mg tablet", label: "Foundayo 17.2 mg tablet 30-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 30, refill: 0, days: 30 },
      rx90: { drug: "Foundayo 17.2 mg tablet", label: "Foundayo 17.2 mg tablet 90-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 90, refill: 0, days: 90 },
      rx60: { drug: "Foundayo 17.2 mg tablet", label: "Foundayo 17.2 mg tablet 60-day supply",
              ptInstructions: "Take 1 tablet by mouth once daily with or without food. Swallow whole. Do not break, crush, or chew.",
              quantity: 60, refill: 0, days: 60 }
        }
      ],
      prescribingNotes: [
        "Once-daily oral GLP-1. No injection, no pen needles.",
        "Dose selection and titration follow FDA-approved labeling."
      ]
    },
    wegovy_pen: {
      key: "wegovy_pen",
      compounded: false,  // brand product, fulfilled by the manufacturer
      brandFamily: "Wegovy",
      presentationLabel: "Pen",
      pharmacy: "novocare",
      altChannels: [
        "local_pharmacy"
      ],
      drug: "semaglutide",
      label: "Wegovy pen (semaglutide) — brand name",
      brandName: true,
      visibility: "provider",
      route: "subcutaneous",
      frequency: "once weekly",
      presentation: "Single-patient-use pen",
      orderVia: "Tebra Standard prescription",
      pharmacyAddress: "NovoCare Pharmacy, 2400 Sand Lake Road, Suite 200B, Orlando, FL 32809 \u00b7 (833) 949-5527",
      quantityNote: "Wegovy pens are SINGLE-DOSE, so 4 pens covers 4 weeks. This is the " +
        "opposite of the Zepbound KwikPen, where ONE pen holds all four weekly doses. " +
        "The Tebra entries confirm it: each Wegovy line is one strength at one volume, " +
        "with no total-content figure in brackets.",
      volumeNote: "Volume varies by dose. 0.25, 0.5 and 1 mg are 0.5 mL; 1.7, 2.4 and " +
        "7.2 mg are 0.75 mL. The 7.2 mg strength is listed as \"Wegovy hd\".",
      dispensing: [
        { key: "rx4", label: "4-week (28-day)", quantity: 4, refill: 0, days: 28,
          use: "New prescription or any dose change. Use until the dose is stable." },
        { key: "rx8", label: "8-week (56-day) \u2014 4 pens + 1 refill", quantity: 4, refill: 1, days: 28,
          use: "Clinically stable patients only." },
        /* Don, 2026-09-06. Same brand shipping ceiling as Zepbound - 4 weeks per
           shipment - so 12 weeks is three fills of four single-dose pens. */
        { key: "rx12", label: "12-week (84-day) \u2014 4 pens + 2 refills", quantity: 4, refill: 2, days: 28,
          use: "Clinically stable patients on a settled dose. Three fills of four pens, four weeks each." }
      ],
      doses: [
        {
      dose: "0.25 mg",
      mg: 0.25,
      use: "Initiation",
      rx4: { drug: "Wegovy 0.25 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.25 mg SQ 4-week",
             ptInstructions: "Inject 0.25 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx12: { drug: "Wegovy 0.25 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.25 mg SQ 12-week",
             ptInstructions: "Inject 0.25 mg subcutaneously once weekly.", quantity: 4, refill: 2, days: 28 },
      rx8: { drug: "Wegovy 0.25 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.25 mg SQ 8-week",
             ptInstructions: "Inject 0.25 mg subcutaneously once weekly.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "0.5 mg",
      mg: 0.5,
      use: "Titration",
      rx4: { drug: "Wegovy 0.5 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.5 mg SQ 4-week",
             ptInstructions: "Inject 0.5 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx12: { drug: "Wegovy 0.5 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.5 mg SQ 12-week",
             ptInstructions: "Inject 0.5 mg subcutaneously once weekly.", quantity: 4, refill: 2, days: 28 },
      rx8: { drug: "Wegovy 0.5 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 0.5 mg SQ 8-week",
             ptInstructions: "Inject 0.5 mg subcutaneously once weekly.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "1 mg",
      mg: 1,
      use: "Titration",
      rx4: { drug: "Wegovy 1 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 1 mg SQ 4-week",
             ptInstructions: "Inject 1 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx12: { drug: "Wegovy 1 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 1 mg SQ 12-week",
             ptInstructions: "Inject 1 mg subcutaneously once weekly.", quantity: 4, refill: 2, days: 28 },
      rx8: { drug: "Wegovy 1 mg/0.5 ml subcutaneous pen injector", label: "Wegovy 1 mg SQ 8-week",
             ptInstructions: "Inject 1 mg subcutaneously once weekly.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "1.7 mg",
      mg: 1.7,
      use: "Advanced dose",
      rx4: { drug: "Wegovy 1.7 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 1.7 mg SQ 4-week",
             ptInstructions: "Inject 1.7 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx12: { drug: "Wegovy 1.7 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 1.7 mg SQ 12-week",
             ptInstructions: "Inject 1.7 mg subcutaneously once weekly.", quantity: 4, refill: 2, days: 28 },
      rx8: { drug: "Wegovy 1.7 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 1.7 mg SQ 8-week",
             ptInstructions: "Inject 1.7 mg subcutaneously once weekly.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "2.4 mg",
      mg: 2.4,
      use: "Maintenance dose",
      rx4: { drug: "Wegovy 2.4 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 2.4 mg SQ 4-week",
             ptInstructions: "Inject 2.4 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx12: { drug: "Wegovy 2.4 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 2.4 mg SQ 12-week",
             ptInstructions: "Inject 2.4 mg subcutaneously once weekly.", quantity: 4, refill: 2, days: 28 },
      rx8: { drug: "Wegovy 2.4 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 2.4 mg SQ 8-week",
             ptInstructions: "Inject 2.4 mg subcutaneously once weekly.", quantity: 4, refill: 1, days: 28 }
        },
        {
      dose: "7.2 mg",
      mg: 7.2,
      use: "High dose — marketed as Wegovy HD",
      brandVariant: "Wegovy HD",
      rx4: { drug: "Wegovy hd 7.2 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 7.2 mg SQ 4-week",
             ptInstructions: "Inject 7.2 mg subcutaneously once weekly for 4 weeks.", quantity: 4, refill: 0, days: 28 },
      rx12: { drug: "Wegovy hd 7.2 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 7.2 mg SQ 12-week",
             ptInstructions: "Inject 7.2 mg subcutaneously once weekly.", quantity: 4, refill: 2, days: 28 },
      rx8: { drug: "Wegovy hd 7.2 mg/0.75 ml subcutaneous pen injector", label: "Wegovy 7.2 mg SQ 8-week",
             ptInstructions: "Inject 7.2 mg subcutaneously once weekly.", quantity: 4, refill: 1, days: 28 }
        }
      ],
      prescribingNotes: [
        "The 7.2 mg strength is marketed as Wegovy HD. Same molecule, higher strength.",
        "Dose escalation follows FDA-approved labeling and is individualized."
      ]
    },
    wegovy_pill: {
      key: 'wegovy_pill',
      compounded: false,  // brand product, fulfilled by the manufacturer
      brandFamily: 'Wegovy',
      presentationLabel: 'Oral tablet',
      pharmacy: 'novocare',
      altChannels: ['local_pharmacy'],
      drug: 'semaglutide',
      label: 'Wegovy oral tablet (semaglutide) \u2014 brand name',
      brandName: true,
      visibility: 'provider',
      route: 'oral',
      frequency: 'once daily',
      presentation: 'Oral tablet',
      orderVia: 'Tebra Standard prescription',
      pharmacyAddress: 'NovoCare Pharmacy, 2400 Sand Lake Road, Suite 200B, Orlando, FL 32809 \u00b7 (833) 949-5527',
      dispensing: [
        { key: 'rx30', label: '30-day supply', quantity: 30, refill: 0, days: 30,
          use: 'New prescription or any dose change. Use until the dose is stable.' },
        { key: 'rx60', label: '60-day supply', quantity: 60, refill: 0, days: 60,
          use: 'Clinically stable patients only. Quantity 60, no refill \u2014 not 30 with a refill.' },
        /* Don, 2026-09-06. Orals are NOT subject to the 4-week injectable shipping
           ceiling - they dispense as one fill, so the longer oral programs are a larger
           quantity with no refill rather than refills. */
        { key: "rx90", label: "90-day supply", quantity: 90, refill: 0, days: 90,
          use: "Clinically stable patients on a settled dose. Quantity 90, no refill." }
      ],
      doses: [
        { dose: '1.5 mg', mg: 1.5, use: 'Initiation',
          rx30: { drug: 'Wegovy 1.5 mg tablet', label: 'Wegovy 1.5 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx90: { drug: 'Wegovy 1.5 mg tablet', label: 'Wegovy 1.5 mg tablet 90-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 90, refill: 0, days: 90 },
          rx60: { drug: 'Wegovy 1.5 mg tablet', label: 'Wegovy 1.5 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } },
        { dose: '4 mg', mg: 4, use: 'Early titration',
          rx30: { drug: 'Wegovy 4 mg tablet', label: 'Wegovy 4 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx90: { drug: 'Wegovy 4 mg tablet', label: 'Wegovy 4 mg tablet 90-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 90, refill: 0, days: 90 },
          rx60: { drug: 'Wegovy 4 mg tablet', label: 'Wegovy 4 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } },
        { dose: '9 mg', mg: 9, use: 'Intermediate dose',
          rx30: { drug: 'Wegovy 9 mg tablet', label: 'Wegovy 9 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx90: { drug: 'Wegovy 9 mg tablet', label: 'Wegovy 9 mg tablet 90-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 90, refill: 0, days: 90 },
          rx60: { drug: 'Wegovy 9 mg tablet', label: 'Wegovy 9 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } },
        { dose: '25 mg', mg: 25, use: 'Advanced titration',
          rx30: { drug: 'Wegovy 25 mg tablet', label: 'Wegovy 25 mg tablet 30-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 30, refill: 0, days: 30 },
          rx90: { drug: 'Wegovy 25 mg tablet', label: 'Wegovy 25 mg tablet 90-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 90, refill: 0, days: 90 },
          rx60: { drug: 'Wegovy 25 mg tablet', label: 'Wegovy 25 mg tablet 60-day supply',
                  ptInstructions: 'Take 1 tablet by mouth daily on empty stomach with up to 4 oz water. Swallow whole. No food, drink or other oral meds for 30 min.',
                  quantity: 60, refill: 0, days: 60 } }
      ],
      prescribingNotes: [
        'Sent electronically through Tebra as a STANDARD prescription. No insurance ' +
        'billing and no prior authorization.',
        'Patient completes enrolment, payment and shipping directly with NovoCare.',
        'Oral semaglutide has lower and more variable bioavailability than injectable. ' +
        'Adherence to the empty-stomach and 30-minute rules is critical to efficacy.',
        'Weight loss response may be less pronounced than with injectable GLP-1 therapy.'
      ]
    }
  },

  /* ── PRICING & CHARGE CODES — PROVIDER ONLY ──────────────────────────────
     Never render in a patient-facing tool or document. Tirzepatide PRICING is
     uniform across Premier, Belmar, Farmakeio and Greenwich and is keyed by dose
     tier, not by pharmacy. The 8-week CHARGE CODE was pharmacy-dependent until
     2026-09-05, because Belmar split the fill and needed its own code per tier to
     tell Ops to place the second 4-week order. Belmar no longer splits the fill.
     Every pharmacy now bills the standard 8-week code for its tier. The retired
     Belmar codes are kept under codes.retired for historical orders only. */
  /* -- WHAT MAY AND MAY NOT BE STORED HERE -------------------------------
     This file is published to GitHub Pages and served without authentication.
     The repository is public. Anything written here is world-readable, so the
     line is drawn by audience, not by sensitivity in the abstract.

     MAY be stored - a provider needs it to do the job, and it is the price the
     patient is quoted anyway:
       program pricing ($269 / $349 / $599 / $649 / $799 / the $79 visit fee)
       charge codes
       dose ladders, Tebra fields, pharmacy routing

     MUST NOT be stored - commercially sensitive and no provider needs it:
       what KORB pays a pharmacy per vial or per fill (acquisition cost)
       pharmacy rate cards, tier pricing, negotiated discounts
       partner-specific funded rates and the legacy 8-week cohort rate

     This is not a new rule. The grandfathered block below already applies it,
     and states the reason. It is written out here because it was broken on
     2026-09-05: Belmar per-vial acquisition figures were pasted into two
     needsConfirmation entries while working out the vial plans. They were
     removed the same day. The vial sizing work needed those numbers; the file
     did not, and the vial plans stand on volume and the puncture limit alone.

     selfCheck asserts no currency figure appears in needsConfirmation or
     acceptedLimitations, which is where working notes tend to land. */
  costPolicy: {
    fileIsPublic: true,
    servedWithoutAuthentication: true,
    mayStore: ['program pricing quoted to the patient', 'charge codes',
               'dose ladders', 'Tebra prescribing fields', 'pharmacy routing'],
    mustNotStore: ['pharmacy acquisition cost per vial or per fill',
                   'pharmacy rate cards and negotiated tiers',
                   'partner-funded rates', 'the legacy 8-week cohort rate'],
    heldBy: 'Operations and Finance',
    breachedOn: '2026-09-05',
    breachNote: 'Belmar per-vial acquisition figures were written into two open ' +
                'items during the vial-plan work and removed the same day.'
  },

  pricing: {
    visibility: 'provider',
    includes: 'Telehealth visit, medication, shipping and supplies',
    billingSheet: 'PROCEDURE CODE CHEAT SHEET & BILLING ISSUES (Google Sheets)',

    tirzepatideTiers: {
      corporateDiscount: false,
      corporateNote: 'Tirzepatide has no corporate discount. The corp partner code ' +
                     'exists for attribution and tracking, not a lower price — it is ' +
                     'the same figure as the standard 4-week at every tier. Do not ' +
                     'present it to a corporate partner as a saving.',
      T1A: {
        tier: 'T1A',
        appliesTo: 'Low doses — 2 / 2.5 / 4 / 4.5 / 5 mg depending on pharmacy',
        corpPartner: { price: 349, code: 'FITTirzCP2' },
        fourWeek:    { price: 349, code: 'FITTirz002' },
        eightWeek: {
          price: 599,
          /* Price is the same at every pharmacy. Only the code differs, because
             the code is what tells Ops whether a second fill has to be placed. */
          codes: {
            standard: {
              code: 'FITTirzMT1',
              pharmacies: ['premier', 'belmar', 'farmakeio'],
              note: 'Single fill, full 8-week supply shipped at once. Every pharmacy, including Belmar as of 2026-09-05. Greenwich removed 2026-09-11 with the retirement of Greenwich GLP-1 \u2014 the code itself is unchanged and still applies to a Greenwich order placed before that date.'
            },
            retired: [
              {
                code: 'FITTirzMTB1',
                pharmacies: ['belmar'],
                retiredOn: '2026-09-05',
                reason: 'Belmar-specific split-fill code. Existed only to flag the order for Ops to place the second 4-week fill. Belmar now ships 8 weeks in a single fill, so there is nothing to trigger.',
                note: 'HISTORICAL. Do not put this code on a new order. It may still appear on orders placed before 2026-09-05. Finance confirmation of deactivation is open - see needsConfirmation BELMAR-8WK-CODE-RETIRE.'
              }
            ]
          }
        }
      },
      T2A: {
        tier: 'T2A',
        appliesTo: 'Mid doses — 6.5 / 7.5 / 8.5 / 9 / 10 mg depending on pharmacy',
        corpPartner: { price: 399, code: 'FITTirzCP3' },
        fourWeek:    { price: 399, code: 'FITTirz003' },
        eightWeek: {
          price: 649,
          /* Price is the same at every pharmacy. Only the code differs, because
             the code is what tells Ops whether a second fill has to be placed. */
          codes: {
            standard: {
              code: 'FITTirzMT2',
              pharmacies: ['premier', 'belmar', 'farmakeio'],
              note: 'Single fill, full 8-week supply shipped at once. Every pharmacy, including Belmar as of 2026-09-05. Greenwich removed 2026-09-11 with the retirement of Greenwich GLP-1 \u2014 the code itself is unchanged and still applies to a Greenwich order placed before that date.'
            },
            retired: [
              {
                code: 'FITTirzMTB2',
                pharmacies: ['belmar'],
                retiredOn: '2026-09-05',
                reason: 'Belmar-specific split-fill code. Existed only to flag the order for Ops to place the second 4-week fill. Belmar now ships 8 weeks in a single fill, so there is nothing to trigger.',
                note: 'HISTORICAL. Do not put this code on a new order. It may still appear on orders placed before 2026-09-05. Finance confirmation of deactivation is open - see needsConfirmation BELMAR-8WK-CODE-RETIRE.'
              }
            ]
          }
        }
      },
      T3A: {
        tier: 'T3A',
        appliesTo: 'High doses — 12.5 / 13.5 / 15 / 16 mg depending on pharmacy',
        corpPartner: { price: 449, code: 'FITTirzCP4' },
        fourWeek:    { price: 449, code: 'FITTirz004' },
        eightWeek: {
          price: 799,
          /* Price is the same at every pharmacy. Only the code differs, because
             the code is what tells Ops whether a second fill has to be placed. */
          codes: {
            standard: {
              code: 'FITTirzMT3',
              pharmacies: ['premier', 'belmar', 'farmakeio'],
              note: 'Single fill, full 8-week supply shipped at once. Every pharmacy, including Belmar as of 2026-09-05. Greenwich removed 2026-09-11 with the retirement of Greenwich GLP-1 \u2014 the code itself is unchanged and still applies to a Greenwich order placed before that date.'
            },
            retired: [
              {
                code: 'FITTirzMTB3',
                pharmacies: ['belmar'],
                retiredOn: '2026-09-05',
                reason: 'Belmar-specific split-fill code. Existed only to flag the order for Ops to place the second 4-week fill. Belmar now ships 8 weeks in a single fill, so there is nothing to trigger.',
                note: 'HISTORICAL. Do not put this code on a new order. It may still appear on orders placed before 2026-09-05. Finance confirmation of deactivation is open - see needsConfirmation BELMAR-8WK-CODE-RETIRE.'
              }
            ]
          }
        }
      },
    },

    semaglutide: {
      note: 'Flat pricing, not dose-tiered. Unlike tirzepatide, the price does not ' +
            'change as the patient titrates up.',

      /* CHARGE CODES ARE DELIBERATELY NOT STORED FOR THE 4-WEEK PROGRAM.
         Semaglutide has many codes. The price is largely the same across them,
         but each organization gets its own code so volume can be tracked, and
         some partners cover part or all of the cost. That set changes often and
         is not something a provider needs to hold. Operations supplies the
         correct code when the patient is scheduled.

         What a provider needs to know is the price band, and there are three.
         Do not add code fields back to this block. If a tool needs a code, it
         should say "Operations will provide" rather than guess. */
      chargeCodePolicy: {
        storeCodes: false,
        reason: 'Many codes per organization for tracking; partner contributions vary ' +
                'and change often.',
        providedBy: 'Operations, at the time the patient is scheduled',
        renderAs: 'Operations will provide the charge code at scheduling'
      },

      fourWeek: {
        discountAppliesTo: '4-week only. There is no discounted rate on the 8-week program.',
        bands: [
          { key: 'standard',   price: 269, code: 'FITSema001', label: 'Full price — website rate',
            note: 'KORB Get Fit Now Semaglutide Standard' },
          { key: 'discounted', price: 199, label: 'Discounted rate',
            eligibility: ['Corporate partners', 'Friends and family', 'Military'],
            uniform: true,
            note: 'One rate across all three categories. No per-partner variation.' },
          { key: 'other',      price: null, label: 'All others',
            note: 'Partner-funded, partially covered, and other arrangements. Highly ' +
                  'variable and changes often. Operations confirms the figure and the ' +
                  'code at scheduling. Do not quote a price from this tool.' }
        ]
      },

      eightWeek: {
        price: 349,
        label: 'All 8-week semaglutide, every patient, every pharmacy',
        discountedRate: null,
        discountNote: 'No discounted rate on 8-week. Corporate, friends and family, ' +
                      'and military patients all pay $349 for 8-week. The $199 rate ' +
                      'is 4-week only.',
        /* This code IS retained, unlike the 4-week codes, because it is
           operationally load-bearing rather than a tracking label. Until 2026-09-05
           there was a second, Belmar-specific code whose job was to trigger the
           second half of a split fill. Belmar no longer splits the fill, so that
           code is retired and every pharmacy bills on the standard code. */
        codes: {
          standard: { code: 'FITSemaMNT',
                      pharmacies: ['premier', 'belmar', 'farmakeio'],
                      note: 'Single fill, full 8-week supply shipped at once. Every ' +
                            'pharmacy, including Belmar as of 2026-09-05.' },
          retired: [
            { code: 'FITSemaMBL', pharmacies: ['belmar'], retiredOn: '2026-09-05',
              reason: 'Belmar-specific split-fill code. Existed only to flag the ' +
                      'order for Ops to place the second 4-week fill.',
              note: 'HISTORICAL. Do not put this code on a new order. Finance ' +
                    'confirmation of deactivation is open - see needsConfirmation ' +
                    'BELMAR-8WK-CODE-RETIRE.' }
          ]
        }
      },

      /* Closed cohort. Internal reference only so billing questions can be answered.
         Never quote, publish, or offer this price. It is not available to anyone
         not already in it, and there are no new additions. */
      grandfathered: {
        exists: true,
        closedCohort: true,
        visibility: 'internal',
        detailsRedacted: true,
        note: 'A small closed cohort of original patients holds a legacy 8-week rate. ' +
              'It is closed \u2014 no new patients enter it, and it is never quoted or ' +
              'offered. Every other patient is $349 for 8-week. The rate itself and the ' +
              'organisations it came from are deliberately NOT stored in this file, ' +
              'because this file is published to GitHub Pages and served without ' +
              'authentication. Operations and Finance hold the detail. If you are ' +
              'looking at a legacy charge that does not match $349, ask Operations ' +
              'rather than assuming it is an error.'
      }
    },

    /* -- WHY THERE ARE ONLY TWO ORAL SEMAGLUTIDE CODES ---------------------
       Confirmed by Don 2026-09-05, after this looked like a defect on audit.
       It is not. The tablet counts differ per pharmacy and the codes do not
       track them, which is deliberate.

         Premier    0.5 mg -> Oral Dot #90,  qty 90   FITSemOrl90
                    1 mg   -> Oral Dot #90,  qty 90   FITSemOrl180
         Farmakeio  same shape as Premier
         Belmar     0.5 mg -> FastSL #45,    qty 45   FITSemOrl90
                    1 mg   -> FastSL #90,    qty 90   FITSemOrl180

       Premier and Farmakeio stock a dot at each strength, so a patient takes one
       dot daily either way and receives 90 for a 90-day supply. Belmar makes ONE
       strength, the 1 mg tablet, which is twice as strong - so a 0.5 mg patient
       takes half a tablet and needs only 45 for the same 90 days, and a 1 mg
       patient takes a whole tablet and needs 90.

       So the 90 and 180 in the code names are PRICE TIERS, not tablet counts.
       They happen to match Belmar's counts and not Premier's. Nick set it up this
       way on purpose rather than issue a code per pharmacy per strength, which
       would be four more codes to reconcile for no billing benefit.

       DO NOT "fix" Premier or Farmakeio to #180 to make the names line up. The
       quantities are correct as they stand and changing them would under- or
       over-supply the patient. */
    oral: {
      semaglutide90:  { price: 299, code: 'FITSemOrl90'  },
      semaglutide180: { price: 399, code: 'FITSemOrl180' },
      tirzepatide90:  { price: 499, code: 'FITTirOrl90'  },
      tirzepatide180: { price: 599, code: 'FITTirOrl180' }
    },

    brandName: {
      prescriptionVisitFee: 79,
      sameFeeBothPrograms: true,
      programChoiceNote:
        'The visit fee is identical for the short and long program. The choice is ' +
        'clinical, not financial: a new prescription or any dose change goes out as ' +
        'the short program (4-week injectable / 30-day oral) until the dose is stable. ' +
        'Once stable, the long program (8-week injectable / 60-day oral) is appropriate.',
      nonRefundable:
        'The visit fee is non-refundable once the visit has occurred or a prescription ' +
        'has been issued. Medication cost is not included.',
      billingCode: 'FITGLP1001',
      appliesTo: 'Every brand-name pathway \u2014 LillyDirect, NovoCare and the ' +
                 'patient\u2019s local pharmacy. One fee, one code, no variation by ' +
                 'product or channel.',

      /* SETTLED POLICY 2026-08-09 \u2014 DO NOT ADD MANUFACTURER PRICING HERE.
         Brand pricing is set by LillyDirect, NovoCare or the patient's local
         pharmacy, changes without notice, and KORB does not control it. Storing
         it means someone has to chase every change, and a stale figure on a
         provider's screen becomes a wrong price quoted to a patient. Checking
         price and coverage is the patient's responsibility, not KORB's. If a
         provider needs a figure, send the patient to the manufacturer site. */
      /* Don, 2026-09-06. This has to be ON the document. Without it, a provider
         sees a line labelled "12-week" carrying days supply 28 and two refills
         and has no way to tell whether that is correct or a mistake. */
      injectableSupplyRule:
        'Brand pharmacies will not ship more than a 4-week supply of an injectable ' +
        'at a time. The 8-week and 12-week programs are therefore the SAME 4-week ' +
        'fill with refills, not a larger shipment - which is why days supply stays ' +
        '28 on all three. It describes the fill, not the program.',
      oralSupplyRule:
        'Orals are not subject to that ceiling and dispense as a single fill, so ' +
        'the 30, 60 and 90 day supplies are quantity changes with NO refill.',
      controlNote:
        'KORB does not control brand fulfilment. The prescription is sent like any ' +
        'other, and the patient pays the pharmacy directly. Price and coverage are ' +
        'between the patient and the manufacturer programme.',
      doNotStorePricing: true,
      doNotStoreReason:
        'Manufacturer pricing changes without notice and KORB does not control it. ' +
        'Storing it creates a maintenance burden and risks providers quoting ' +
        'incorrect pricing to patients. Price and coverage are the patient\u2019s ' +
        'responsibility.',
      note: 'Cash-pay only. The fee covers the clinical visit, prescription issuance ' +
            'and program administration. Medication cost, pharmacy processing, ' +
            'shipping and supplies are set by the external pharmacy and paid ' +
            'directly by the patient.'
    }
  },

  /* ── HELPERS ─────────────────────────────────────────────────────────── */

  // All products, optionally filtered by visibility, pharmacy or drug.
  listProducts: function (opts) {
    opts = opts || {};
    var out = [];
    for (var k in KORB_GLP1.products) {
      if (!KORB_GLP1.products.hasOwnProperty(k)) continue;
      var p = KORB_GLP1.products[k];
      if (opts.visibility && p.visibility !== opts.visibility) continue;
      if (opts.pharmacy) {
        var chans = [p.pharmacy].concat(p.altChannels || []);
        if (chans.indexOf(opts.pharmacy) === -1) continue;
      }
      if (opts.drug && p.drug !== opts.drug) continue;
      if (opts.excludeBrand && p.brandName) continue;
      out.push(p);
    }
    return out;
  },

  // Intentionally returns an empty array. Patients never see dose ladders, so no
  // product is marked 'patient'. Kept as a guard: if a future edit mislabels a
  // product, this starts returning it and selfCheck will say so.
  patientSafeProducts: function () {
    return KORB_GLP1.listProducts({ visibility: 'patient', excludeBrand: true });
  },

  // The only sanctioned way to render product information patient-side. Strips
  // the dose ladder, mg values, unit counts, pharmacy name, formulation and
  // pricing. Returns route, frequency and safety language only.
  patientView: function (productKey) {
    var p = KORB_GLP1.getProduct(productKey);
    if (!p) return null;
    if (p.brandName) return null; // brand-name products are never surfaced patient-side
    return {
      route: p.route,
      frequency: p.frequency,
      counseling: KORB_GLP1.clinical.counseling,
      sideEffects: KORB_GLP1.clinical.sideEffects,
      contraindications: KORB_GLP1.clinical.contraindications
    };
  },

  // Oral pricing is keyed to the charge code, so look it up rather than storing
  // the figure on every dose. One code, one price, one place to change it.
  priceForCode: function (code) {
    if (!code) return null;
    var o = KORB_GLP1.pricing.oral;
    for (var k in o) {
      if (o.hasOwnProperty(k) && o[k].code === code) return o[k].price;
    }
    return null;
  },

  getProduct: function (key) {
    return KORB_GLP1.products[key] || null;
  },

  /* The ONLY supported way to get preparation text for a product. Returns the
     whole block - heading, note, counselingLine, attestationClause - so a caller
     cannot take the heading from one preparation and the body from another,
     which is exactly how Foundayo ended up under a "Compounded preparation"
     heading while its text said it was not compounded.

     Returns null when the product does not declare `compounded`, deliberately:
     a missing flag must fail loudly at the call site rather than default to
     "compounded" and reintroduce the false chart attestation. selfCheck()
     asserts every product declares it, so null should be unreachable. */
  /* -- CLINICAL SIGN-OFF ---------------------------------------------------
     The monographs were newly authored for this file. They were not transcribed
     from an existing KORB document, so nobody has attested to them clinically.
     Until someone does, every generated document says so on page one.

     WHY THIS IS A DATA STRUCTURE AND NOT A LINE IN A CHANGELOG
     A sign-off that is not pinned to content is a rubber stamp. If the record
     said only "reviewed by Don on 2026-09-06", then editing a contraindication
     next month would leave that attestation sitting on top of text the signer
     never saw, and the document would carry a clinician's name over content they
     did not approve. That is the failure mode worth engineering against.

     So each record stores a fingerprint of the monograph AS SIGNED. signoffStatus
     recomputes it at render time and compares:

       unsigned  no record           -> gate renders, document is not cleared
       current   fingerprint matches -> attribution line renders
       stale     fingerprint differs -> gate renders again, saying so

     A stale sign-off is treated exactly like no sign-off. Re-reviewing is cheap;
     a provider acting on unreviewed contraindications is not.

     TO RECORD A SIGN-OFF: add a record below. Do not edit a fingerprint by hand
     to make a warning go away - that is forging the attestation. Regenerate it
     with monographFingerprint(drug) after the reviewer has seen the current text. */
  monographSignoff: {
    /* Empty until a clinician signs. Keyed by molecule, because they are reviewed
       separately - orforglipron is the newest and least certain and should not
       inherit confidence from semaglutide's review. */
    /* Signed by Don on 2026-09-06. He reviewed the three monographs and
       approved all of them with no changes and no exceptions. Each record
       pins the fingerprint the monograph had at that moment; edit any of
       those monographs and signoffStatus turns that record STALE, the gate
       comes back on its documents, and the build refuses. Do not hand-edit a
       fingerprint to silence that - regenerate it after a reviewer has seen
       the current text. */
    records: {
      semaglutide: {
        signedBy: 'Donald Stevenson, PA-C',
        role: 'Director of Clinical Operations and Lead Provider',
        date: '2026-09-06',
        dataVersion: '2.13',
        fingerprint: 'fp-ff64f4c7-5796',
        attests:
          'Reviewed the monograph as rendered on the provider documents - indications and KORB scope, interactions including the peri-procedural hold and the tirzepatide oral contraceptive windows, absolute contraindications, cautions, monitoring, ICD-10 selections, the chart attestation language and the patient counseling script - and approve it for distribution to KORB providers.',
        exceptions: []
      },

      tirzepatide: {
        signedBy: 'Donald Stevenson, PA-C',
        role: 'Director of Clinical Operations and Lead Provider',
        date: '2026-09-06',
        dataVersion: '2.13',
        fingerprint: 'fp-6cc941b7-6106',
        attests:
          'Reviewed the monograph as rendered on the provider documents - indications and KORB scope, interactions including the peri-procedural hold and the tirzepatide oral contraceptive windows, absolute contraindications, cautions, monitoring, ICD-10 selections, the chart attestation language and the patient counseling script - and approve it for distribution to KORB providers.',
        exceptions: []
      },

      orforglipron: {
        signedBy: 'Donald Stevenson, PA-C',
        role: 'Director of Clinical Operations and Lead Provider',
        date: '2026-09-06',
        dataVersion: '2.13',
        fingerprint: 'fp-2c45be91-4791',
        attests:
          'Reviewed the monograph as rendered on the provider documents - indications and KORB scope, interactions including the peri-procedural hold and the tirzepatide oral contraceptive windows, absolute contraindications, cautions, monitoring, ICD-10 selections, the chart attestation language and the patient counseling script - and approve it for distribution to KORB providers.',
        note: 'Signed flat rather than with an exception, at Don\'s direction. The monograph keeps its own standing flag telling providers to verify against current prescribing information, which renders on the Foundayo document independently of this record.',
        exceptions: []
      }
    },

    /* The areas the reviewer should look at hardest. Not the only things being
       signed - the ones where an error is least likely to be caught downstream by
       a provider's own knowledge. */
    focusAreas: [
      'Tirzepatide and oral contraceptives - the interaction and both four-week windows',
      'Peri-procedural holding guidance across all three molecules',
      'ICD-10 primary and secondary selections',
      'Orforglipron generally - newest agent, thinnest evidence base, and it carries ' +
      'its own verify-against-prescribing-information flag'
    ]
  },

  /* Deterministic fingerprint of a monograph's content. FNV-1a over a canonical
     serialisation with sorted keys, so the same content always yields the same
     value in Node and in the browser, and any edit anywhere in the monograph
     changes it. Not a security hash and not trying to be - it defends against
     drift, not against someone determined to forge a record. */
  monographFingerprint: function (drug) {
    var m = KORB_GLP1.monographs[drug];
    if (!m) return null;
    function canon(v) {
      if (v === null || v === undefined) return 'n';
      if (Array.isArray(v)) return '[' + v.map(canon).join('') + ']';
      if (typeof v === 'object') {
        return '{' + Object.keys(v).sort().map(function (k) {
          return k + canon(v[k]);
        }).join('') + '}';
      }
      return String(v);
    }
    /* Everything except the molecule name is in scope. Deliberately over-broad:
       a cosmetic title edit invalidating a sign-off costs one re-read, whereas a
       narrow field list is how a contraindication edit slips past unnoticed. */
    var scoped = {};
    Object.keys(m).forEach(function (k) { if (k !== 'drug') scoped[k] = m[k]; });
    var str = canon(scoped);
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return 'fp-' + ('0000000' + h.toString(16)).slice(-8) + '-' + str.length;
  },

  /* Rendered by every provider document. Returns a state plus text the renderer
     can print without deciding clinical questions of its own. */
  signoffStatus: function (drug) {
    var rec = (KORB_GLP1.monographSignoff.records || {})[drug];
    var now = KORB_GLP1.monographFingerprint(drug);
    if (!rec) {
      return {
        state: 'unsigned', drug: drug, fingerprint: now,
        headline: 'Not yet clinically reviewed',
        detail: 'This monograph was newly authored for this file rather than ' +
                'transcribed from an existing KORB document, and has not been ' +
                'signed off by a clinician. Verify any specific claim against the ' +
                'current prescribing information before relying on it.'
      };
    }
    if (rec.fingerprint !== now) {
      return {
        state: 'stale', drug: drug, fingerprint: now, record: rec,
        headline: 'Sign-off is out of date - the monograph changed after it was signed',
        detail: rec.signedBy + ' signed this monograph on ' + rec.date + ' against ' +
                'data v' + rec.dataVersion + '. The content has changed since. That ' +
                'sign-off does not cover the current text, and this document is not ' +
                'cleared until it is re-reviewed.'
      };
    }
    return {
      state: 'current', drug: drug, fingerprint: now, record: rec,
      headline: 'Clinically reviewed',
      detail: 'Reviewed and signed off by ' + rec.signedBy + ' (' + rec.role + ') on ' +
              rec.date + ', against korb-glp1-data.js v' + rec.dataVersion + '.' +
              (rec.exceptions && rec.exceptions.length
                 ? ' Signed with exceptions: ' + rec.exceptions.join('; ') : '')
    };
  },

  preparationFor: function (productKey) {
    var p = KORB_GLP1.getProduct(productKey);
    if (!p || typeof p.compounded !== 'boolean') return null;
    return p.compounded ? KORB_GLP1.preparation.compounded
                        : KORB_GLP1.preparation.brand;
  },

  getDose: function (productKey, doseLabel) {
    var p = KORB_GLP1.getProduct(productKey);
    if (!p || !p.doses) return null;
    for (var i = 0; i < p.doses.length; i++) {
      if (p.doses[i].dose === doseLabel) return p.doses[i];
    }
    return null;
  },

  /* ── BILLING: ONE ACCESSOR FOR EVERY PRODUCT ────────────────────────────
     Added 2026-09-05. Program pricing and charge codes stay in the documents;
     what KORB pays a pharmacy does not - see costPolicy. This is about how a
     consumer FINDS the code, which until now depended on what kind of product
     it was. There were six different shapes:

       tirzepatideTiers.<tier>.fourWeek.code
       tirzepatideTiers.<tier>.eightWeek.codes.standard.code
       semaglutide.fourWeek.bands[].code        (absent on two of three bands)
       semaglutide.eightWeek.codes.standard.code
       oral.<key>.code, reached via the dose's chargeCode
       brandName.billingCode

     So the provider tool, the PDF builder and anything else each re-implemented
     the same branching, and each could get it wrong differently. That is what
     made the retired Belmar code a live defect for as long as it was: the 8-week
     table read one shape for every pharmacy.

     billingFor() returns the same object for every product and program:

       { productKey, program, programLabel, options: [ { label, price, code,
         codeNote, priceNote } ], note }

     `options` is always an array because semaglutide's 4-week price genuinely
     has three bands. One code is one option; it is not a special case. A null
     `code` with a `codeNote` is a real answer - it means Operations supplies it -
     and is not the same as a missing one. */
  billingPrograms: function (productKey) {
    var p = KORB_GLP1.getProduct(productKey);
    if (!p || !p.doses || !p.doses.length) return [];
    var d = p.doses[0];
    return ['supply4', 'supply8', 'rx', 'rx4', 'rx8', 'rx30', 'rx60']
      .filter(function (k) { return !!d[k]; });
  },

  billingFor: function (productKey, program, doseLabel) {
    var p = KORB_GLP1.getProduct(productKey);
    if (!p) return null;
    var d = doseLabel ? KORB_GLP1.getDose(productKey, doseLabel) : p.doses[0];
    if (!d) return null;

    var LABEL = { supply4: '4-week', supply8: '8-week', rx: '90-day',
                  rx4: '4-week', rx8: '8-week', rx30: '30-day', rx60: '60-day' };
    var out = { productKey: productKey, program: program,
                programLabel: LABEL[program] || program, options: [], note: null };

    // Brand: one visit fee, one code, both programs, every channel.
    if (p.brandName) {
      var b = KORB_GLP1.pricing.brandName;
      out.options.push({
        label: 'Prescription visit fee',
        price: b.prescriptionVisitFee,
        code: b.billingCode,
        priceNote: b.doNotStorePricing ? b.doNotStoreReason : null
      });
      out.note = b.appliesTo;
      return out;
    }

    // Compounded oral: the code lives on the dose, the price resolves from it.
    if (d.rx) {
      out.options.push({
        label: d.presentation || d.dose,
        price: d.price != null ? d.price : KORB_GLP1.priceForCode(d.chargeCode),
        code: d.chargeCode || null,
        codeNote: d.chargeCode ? null : 'Operations will provide the charge code'
      });
      return out;
    }

    // Injectable compounded, tirzepatide: tiered by dose.
    if (p.drug === 'tirzepatide') {
      var t = KORB_GLP1.pricing.tirzepatideTiers[d.priceTier];
      if (!t) return out;
      if (program === 'supply8') {
        out.options.push({ label: '8-week', price: t.eightWeek.price,
                           code: t.eightWeek.codes.standard.code,
                           codeNote: t.eightWeek.codes.standard.note });
      } else {
        out.options.push({ label: '4-week — corporate partner', price: t.corpPartner.price,
                           code: t.corpPartner.code,
                           priceNote: KORB_GLP1.pricing.tirzepatideTiers.corporateNote });
        out.options.push({ label: '4-week — standard', price: t.fourWeek.price,
                           code: t.fourWeek.code });
      }
      out.note = 'Dose tier ' + t.tier + ' — ' + t.appliesTo;
      return out;
    }

    // Injectable compounded, semaglutide: flat 8-week, banded 4-week.
    var sg = KORB_GLP1.pricing.semaglutide;
    if (program === 'supply8') {
      out.options.push({ label: sg.eightWeek.label, price: sg.eightWeek.price,
                         code: sg.eightWeek.codes.standard.code,
                         priceNote: sg.eightWeek.discountNote });
    } else {
      sg.fourWeek.bands.forEach(function (band) {
        out.options.push({
          label: '4-week — ' + band.label,
          price: band.price,
          code: band.code || null,
          codeNote: band.code ? null : sg.chargeCodePolicy.renderAs,
          priceNote: band.note
        });
      });
      out.note = sg.fourWeek.discountAppliesTo;
    }
    return out;
  },

  // Price lookup for a tirzepatide dose by product + dose label.
  getTirzepatidePrice: function (productKey, doseLabel) {
    var d = KORB_GLP1.getDose(productKey, doseLabel);
    if (!d || !d.priceTier) return null;
    return KORB_GLP1.pricing.tirzepatideTiers[d.priceTier] || null;
  },

  /* ── PHARMACY SELECTION ──────────────────────────────────────────────────
     State routing gives the default. It is a default, not a lock. Providers
     override it routinely and for good reasons: a patient already established
     at another pharmacy, a patient who has moved, a preference for a particular
     added vitamin, or the provider's own preference.

     The tool should therefore pre-select from state and let the provider change
     it, but warn when the combination will not actually work. Call
     checkPharmacyForState() on every change and render the result. */
  pharmacySelection: {
    defaultFrom: 'patient state',
    overrideAllowed: true,
    overrideReasons: [
      'Patient is already established with another pharmacy and does not want to switch',
      'Patient has moved between states',
      'Patient prefers a formulation with a different added vitamin (B-12, B-6, L-carnitine)',
      'Provider preference'
    ],
    brandProgramsNote: 'LillyDirect and NovoCare are manufacturer programs and are not ' +
                       'state-routed. They never appear as a state default and are ' +
                       'selected deliberately or not at all.'
  },

  /* Returns { status, message }. Status is one of:
       'ok'      valid, and it is the default for this state
       'info'    valid, but an override away from the state default
       'warning' allowed, but outside the pharmacy's known list or otherwise
                 needs checking before the prescription goes out
       'error'   will not work; the pharmacy genuinely cannot serve this state

     Only a hard licensing exclusion produces 'error'. A state simply being
     absent from a pharmacy's list is a warning, not a block: the lists are
     preferences and Operations can verify a one-off. Blocking a valid choice
     is worse than asking the provider to confirm. */
  checkPharmacyForState: function (pharmacyKey, stateCode) {
    var ph = KORB_GLP1.pharmacies[pharmacyKey];
    var st = String(stateCode || '').toUpperCase();
    if (!ph) return { status: 'error', message: 'Unknown pharmacy.' };
    if (!st)  return { status: 'error', message: 'Select a state first.' };

    if (ph.brandOnly) {
      return { status: 'info', message: ph.name + ' is for BRAND-NAME products only and ' +
               'is not state-routed. Compounded products cannot be sent here.' };
    }

    if (ph.type === 'manufacturer-direct') {
      return { status: 'info', message: ph.name + ' is a manufacturer program and is ' +
               'not state-routed. Written as a Tebra Standard prescription, not Compound.' };
    }

    /* A pharmacy retired from the GLP-1 line is a block in every state, ahead of
       any state question. This is deliberately an 'error' and not a 'warning':
       there is no continuation route to override into. Greenwich, 2026-09-11. */
    if (ph.status === 'glp1-retired' || (ph.glp1Retired && ph.glp1Retired.retired)) {
      var moveTo = ph.glp1Retired && ph.glp1Retired.movesTo;
      var moveName = (moveTo && KORB_GLP1.pharmacies[moveTo]) ? KORB_GLP1.pharmacies[moveTo].name : null;
      return { status: 'error', message: ph.name + ' no longer fills GLP-1 in any state, ' +
               'including for established patients' +
               (ph.glp1Retired && ph.glp1Retired.retiredOn ? ' (retired ' + ph.glp1Retired.retiredOn + ')' : '') +
               '. ' + (moveName ? 'Move the patient to ' + moveName + '.' : '') };
    }

    // Hard licensing exclusions are the only true blocks.
    var hard = (ph.hardExcludes || []).concat(ph.excludes || []);
    if (hard.indexOf(st) !== -1) {
      return { status: 'error', message: ph.name + ' cannot ship to ' + st + '. This is a ' +
               'licensing limit, not a preference \u2014 it cannot be overridden.' };
    }

    if (ph.status === 'legacy-continuity') {
      return { status: 'warning', message: ph.name + ' is not used for new GLP-1 patients. ' +
               (ph.overrideOnlyFor ? 'Select only for: ' + ph.overrideOnlyFor : '') };
    }

    if ((ph.shipsToUnconfirmed || []).indexOf(st) !== -1) {
      return { status: 'warning', message: ph.name + ' shipping to ' + st + ' is not ' +
               'confirmed. Verify with Operations before sending the prescription.' };
    }

    // Ships there, but the program discourages it outside its preferred states.
    if (ph.discouragedOutsidePreferred && (ph.preferredStates || []).indexOf(st) === -1) {
      return { status: 'warning', message: ph.name + ' can ship to ' + st + ', but is ' +
               'discouraged outside ' + (ph.preferredStates || []).join('/') + '. ' +
               ph.discouragedReason };
    }

    var def = KORB_GLP1.states.routeTo(st);
    if (def && def.pharmacy !== pharmacyKey) {
      var defName = (KORB_GLP1.pharmacies[def.pharmacy] || {}).name || def.pharmacy;
      return { status: 'info', message: ph.name + ' can ship to ' + st + ', but the ' +
               'default for ' + st + ' is ' + defName + '. Continue if this is intentional.' };
    }

    return { status: 'ok', message: ph.name + ' is the default pharmacy for ' + st + '.' };
  },

  // Every pharmacy with its compatibility verdict for a state. Feeds the picker
  // directly so unusable options can be disabled or greyed rather than hidden.
  pharmacyOptionsForState: function (stateCode) {
    var out = [];
    for (var k in KORB_GLP1.pharmacies) {
      if (!KORB_GLP1.pharmacies.hasOwnProperty(k)) continue;
      var check = KORB_GLP1.checkPharmacyForState(k, stateCode);
      out.push({
        key: k,
        name: KORB_GLP1.pharmacies[k].name,
        status: check.status,
        message: check.message,
        selectable: check.status !== 'error'
      });
    }
    return out;
  },

  // Structural integrity check. Run in the console after any edit.
  selfCheck: function () {
    var problems = [];
    /* A record's flag may point at an open item OR an accepted limitation.
       Both are declarations; only the disposition differs. */
    var flagIds = KORB_GLP1.needsConfirmation.map(function (f) { return f.id; })
      .concat((KORB_GLP1.acceptedLimitations || []).map(function (f) { return f.id; }));

    for (var k in KORB_GLP1.products) {
      if (!KORB_GLP1.products.hasOwnProperty(k)) continue;
      var p = KORB_GLP1.products[k];

      if (p.key !== k) problems.push(k + ': key field does not match its object key');
      if (!KORB_GLP1.pharmacies[p.pharmacy]) problems.push(k + ': unknown pharmacy "' + p.pharmacy + '"');
      if (['patient', 'provider'].indexOf(p.visibility) === -1) problems.push(k + ': invalid visibility');
      if (!p.doses || !p.doses.length) problems.push(k + ': no doses');

      /* Preparation guards. These exist because the compounded/brand distinction
         was previously inferred from the molecule, which put a false statement in
         the chart attestation for every brand product. Three assertions, because
         each catches a different way of reintroducing it. */
      if (typeof p.compounded !== 'boolean') {
        problems.push(k + ': must declare compounded: true or false - a product with ' +
                          'no preparation flag cannot be rendered safely');
      } else {
        if (p.brandName === true && p.compounded !== false) {
          problems.push(k + ': brandName is true but compounded is not false - a brand ' +
                            'product would be described as compounded');
        }
        if (p.brandName !== true && p.compounded !== true) {
          problems.push(k + ': compounded is false but brandName is not true - a ' +
                            'compounded product would lose its FDA disclosure');
        }
        if (!KORB_GLP1.preparationFor(k)) {
          problems.push(k + ': preparationFor() does not resolve');
        }
      }

      (p.doses || []).forEach(function (d) {
        if (d.flag && flagIds.indexOf(d.flag) === -1) problems.push(k + ' ' + d.dose + ': flag "' + d.flag + '" not in needsConfirmation');
        if (d.priceTier && !KORB_GLP1.pricing.tirzepatideTiers[d.priceTier]) problems.push(k + ' ' + d.dose + ': unknown price tier');
        ['supply4', 'supply8'].forEach(function (s) {
          if (!d[s]) return;
          if (d[s].flag && flagIds.indexOf(d[s].flag) === -1) problems.push(k + ' ' + d.dose + ' ' + s + ': unknown flag');
          if (typeof d[s].quantity === 'undefined') problems.push(k + ' ' + d.dose + ' ' + s + ': missing quantity');
          if (typeof d[s].refill === 'undefined') problems.push(k + ' ' + d.dose + ' ' + s + ': missing refill');
          if (typeof d[s].days === 'undefined') problems.push(k + ' ' + d.dose + ' ' + s + ': missing days');
        });
      });
    }

    /* Vial plans against the pharmacy's own puncture limit, plus the Tebra
       character caps. Both were previously documented in prose and checked by
       hand, which is how a 20% short supply and a silent truncation each got
       through once. A stored plan that disagrees with its constraint is a
       defect regardless of which side is right. */
    for (var pk in KORB_GLP1.products) {
      if (!KORB_GLP1.products.hasOwnProperty(pk)) continue;
      var prod = KORB_GLP1.products[pk];
      var vc = (KORB_GLP1.pharmacies[prod.pharmacy] || {}).vialConstraints;
      (prod.doses || []).forEach(function (dd) {
        ['supply4', 'supply8'].forEach(function (sup) {
          var rec = dd[sup];
          if (!rec) return;

          if (typeof rec.ptInstructions === 'string' &&
              rec.ptInstructions.length > KORB_GLP1.tebraLimits.patientInstructions) {
            problems.push(pk + ' ' + dd.dose + ' ' + sup + ': Patient Instructions ' +
                          rec.ptInstructions.length + ' chars, cap is ' +
                          KORB_GLP1.tebraLimits.patientInstructions + ' - truncates silently');
          }
          if (typeof rec.pharmacyNotes === 'string' &&
              rec.pharmacyNotes.length > KORB_GLP1.tebraLimits.pharmacyInstructions) {
            problems.push(pk + ' ' + dd.dose + ' ' + sup + ': Pharmacy Instructions ' +
                          rec.pharmacyNotes.length + ' chars, cap is ' +
                          KORB_GLP1.tebraLimits.pharmacyInstructions + ' - truncates silently');
          }

          var vp = rec.vialPlan;
          if (!vp || !vc) return;
          if (vp.totalMl !== rec.quantity) {
            problems.push(pk + ' ' + dd.dose + ' ' + sup + ': vialPlan.totalMl ' +
                          vp.totalMl + ' does not match dispensed quantity ' + rec.quantity);
          }
          var exceeds = vp.dosesPerVial > vc.maxDosesPerVial;
          if (exceeds !== (vp.withinPunctureLimit === false)) {
            problems.push(pk + ' ' + dd.dose + ' ' + sup + ': withinPunctureLimit ' +
                          'disagrees with dosesPerVial ' + vp.dosesPerVial +
                          ' against a limit of ' + vc.maxDosesPerVial);
          }
          /* If the record's flag is an accepted limitation whose mitigation lives
             in the sig, the sig must actually carry it. */
          if (rec.flag) {
            var acc = (KORB_GLP1.acceptedLimitations || []).filter(function (a) {
              return a.id === rec.flag && a.requiresSigText;
            })[0];
            if (acc && String(rec.ptInstructions || '').indexOf(acc.requiresSigText) === -1) {
              problems.push(pk + ' ' + dd.dose + ' ' + sup + ': flagged ' + acc.id +
                            ' but the sig is missing its required mitigation text "' +
                            acc.requiresSigText + '" - that instruction is the only thing ' +
                            'holding this within the puncture limit');
            }
          }

          if (exceeds && !rec.flag) {
            problems.push(pk + ' ' + dd.dose + ' ' + sup + ': one vial yields ' +
                          vp.dosesPerVial + ' doses against a limit of ' + vc.maxDosesPerVial +
                          ' and carries no flag - it must point at a needsConfirmation ' +
                          'item or an acceptedLimitations entry so the choice is visible; ' +
                          'a patient who does not discard it takes a dose past the ' +
                          vc.punctureDays + '-day window');
          }
        });
      });
    }

    /* Every product must produce billing for every program it offers, and every
       option must resolve to a code OR say in words who supplies it. Silence is
       the failure mode that matters: a blank where a charge code should be reads
       as "no code needed" rather than "ask Operations". */
    for (var bk in KORB_GLP1.products) {
      if (!KORB_GLP1.products.hasOwnProperty(bk)) continue;
      var progs = KORB_GLP1.billingPrograms(bk);
      if (!progs.length) { problems.push(bk + ': no billable program'); continue; }
      progs.forEach(function (pr) {
        var bill = KORB_GLP1.billingFor(bk, pr);
        if (!bill || !bill.options.length) {
          problems.push(bk + ' ' + pr + ': billingFor() resolves no options');
          return;
        }
        bill.options.forEach(function (o) {
          if (!o.code && !o.codeNote) {
            problems.push(bk + ' ' + pr + ' "' + o.label + '": no charge code and no ' +
                          'note saying who supplies one - it will render blank');
          }
          if (o.price == null && !o.priceNote) {
            problems.push(bk + ' ' + pr + ' "' + o.label + '": no price and no note ' +
                          'explaining why');
          }
        });
      });
    }

    /* This file is public and it is a CLINICAL file. Two things must not appear
       in it: a currency figure outside the patient-facing pricing block, and the
       language of what KORB pays a pharmacy.

       The currency half caught the 2026-09-05 breach, where Belmar per-vial
       figures were pasted into two open items. The language half was added on
       2026-09-06 because the figures had gone but the reasoning had not - text
       still said one option cost materially more and that a Belmar confirmation
       would make several rows cheaper. That is acquisition cost stated in words
       instead of numbers, and it is the same disclosure.

       Scope is the whole file except the pricing block and costPolicy itself,
       rather than just the two open-item lists, because the leak was found in a
       pharmacy record and in an accepted limitation, neither of which the
       original guard looked at. */
    (function () {
      var money = /(\$|USD\s*)\d/;
      var costWords = [
        /acquisition cost/i,
        /rate card/i,
        /what (we|KORB) pay/i,
        /(rows?|doses?|vials?|options?)\s+(get|would be|are)\s+cheaper/i,
        /negotiated (rate|tier|price)/i,
        /(higher|lower) (acquisition |unit |per-vial )?cost/i,
        /cost per (vial|fill|dose)/i
      ];
      var EXEMPT = { pricing: 1, costPolicy: 1 };

      function walk(node, path, depth) {
        if (depth > 8 || node === null || node === undefined) return;
        if (typeof node === 'string') {
          if (money.test(node)) {
            problems.push(path + ': contains a currency figure outside the pricing ' +
                          'block. This file is public - acquisition cost and rate-card ' +
                          'figures belong with Operations. See costPolicy.');
          }
          costWords.forEach(function (re) {
            if (re.test(node)) {
              problems.push(path + ': describes what KORB pays a pharmacy (' +
                            re.source + '). Cost reasoning is the same disclosure as ' +
                            'a cost figure. See costPolicy.');
            }
          });
          return;
        }
        if (typeof node !== 'object') return;
        if (Array.isArray(node)) {
          node.forEach(function (v, i) { walk(v, path + '[' + i + ']', depth + 1); });
          return;
        }
        Object.keys(node).forEach(function (k) {
          if (typeof node[k] === 'function') return;
          walk(node[k], path + '.' + k, depth + 1);
        });
      }

      Object.keys(KORB_GLP1).forEach(function (k) {
        if (EXEMPT[k] || typeof KORB_GLP1[k] === 'function') return;
        /* meta.changelog records history, including the breach itself and how it
           was closed. Deleting that history to satisfy a guard would remove the
           record of the mistake, which is the opposite of the point. */
        if (k === 'meta') return;
        walk(KORB_GLP1[k], k, 0);
      });
    })();

    /* Every pharmacy that dispenses a drug must appear on that drug's 8-week code.
       Since the Belmar-specific codes were retired the code is uniform, so this
       list is no longer a selection mechanism - it is a roster, and a roster is
       exactly the kind of thing that goes stale when a pharmacy is added.

       Retired products are skipped. A retired product's record stays in the file
       so a pre-retirement order can still be read, but it is not a route anyone
       can order on, so it must not hold a pharmacy on the live code roster.
       Added 2026-09-11 with the Greenwich GLP-1 retirement. */
    (function () {
      function carriers(drug) {
        var out = [];
        for (var ck in KORB_GLP1.products) {
          if (!KORB_GLP1.products.hasOwnProperty(ck)) continue;
          var cp = KORB_GLP1.products[ck];
          if (cp.retired || cp.status === 'retired') continue;
          if (cp.drug === drug && cp.route === 'subcutaneous' && !cp.brandName &&
              cp.doses && cp.doses[0] && cp.doses[0].supply8 &&
              out.indexOf(cp.pharmacy) === -1) { out.push(cp.pharmacy); }
        }
        return out;
      }
      var semaStd = KORB_GLP1.pricing.semaglutide.eightWeek.codes.standard;
      carriers('semaglutide').forEach(function (ph) {
        if (semaStd.pharmacies.indexOf(ph) === -1) {
          problems.push('pricing.semaglutide.eightWeek: ' + ph + ' dispenses 8-week ' +
                        'semaglutide but is not listed on code ' + semaStd.code);
        }
      });
      var tirzPh = carriers('tirzepatide');
      ['T1A', 'T2A', 'T3A'].forEach(function (t) {
        var std = KORB_GLP1.pricing.tirzepatideTiers[t].eightWeek.codes.standard;
        tirzPh.forEach(function (ph) {
          if (std.pharmacies.indexOf(ph) === -1) {
            problems.push('pricing.tirzepatideTiers.' + t + '.eightWeek: ' + ph +
                          ' dispenses 8-week tirzepatide but is not listed on code ' + std.code);
          }
        });
      });
    })();

    /* Every injectable compounded dose must offer BOTH program lengths, and every
       tirzepatide dose must carry a price tier - without one, no charge code
       resolves at all. Both are holes a provider only discovers at the point of
       prescribing. */
    for (var ik in KORB_GLP1.products) {
      if (!KORB_GLP1.products.hasOwnProperty(ik)) continue;
      var ip = KORB_GLP1.products[ik];
      if (ip.route !== 'subcutaneous' || ip.brandName) continue;
      (ip.doses || []).forEach(function (dd) {
        if (dd.rx) return;                       // brand-shaped record, different keys
        if (!dd.supply4) problems.push(ik + ' ' + dd.dose + ': has no 4-week option');
        if (!dd.supply8) problems.push(ik + ' ' + dd.dose + ': has no 8-week option');
        if (ip.drug === 'tirzepatide' && !dd.priceTier) {
          problems.push(ik + ' ' + dd.dose + ': tirzepatide dose with no priceTier - ' +
                        'no charge code resolves for either program');
        }
      });
    }

    /* No monograph may carry preparation text again. This is the assertion that
       makes the original defect structurally impossible rather than merely fixed:
       the text lived on the molecule, so every product sharing that molecule
       inherited it regardless of how it is actually dispensed. */
    for (var mk in (KORB_GLP1.monographs || {})) {
      if (!KORB_GLP1.monographs.hasOwnProperty(mk)) continue;
      if (typeof KORB_GLP1.monographs[mk].compoundedNote !== 'undefined') {
        problems.push('monographs.' + mk + ': carries compoundedNote. Preparation is a ' +
                      'property of the product, not the molecule - move it to the ' +
                      'product compounded flag and read it via preparationFor()');
      }
    }

    // Every KORB active state must resolve to a pharmacy that actually ships there.
    var warnings = [];
    KORB_GLP1.states.korbActive.forEach(function (st) {
      var r = KORB_GLP1.states.routeTo(st);
      if (!r) { problems.push('state ' + st + ': no routing rule'); return; }
      var ph = KORB_GLP1.pharmacies[r.pharmacy];
      if (!ph) { problems.push('state ' + st + ': routes to unknown pharmacy'); return; }
      if (ph.status === 'legacy-continuity') {
        problems.push('state ' + st + ': routes to ' + ph.name + ' which is legacy-continuity and takes no new starts');
      }
      var hardEx = (ph.hardExcludes || []).concat(ph.excludes || []);
      if (hardEx.indexOf(st) !== -1) {
        problems.push('state ' + st + ': routes to ' + ph.name + ' which hard-excludes ' + st);
      } else if (ph.shipsTo.length && ph.shipsTo.indexOf(st) === -1) {
        warnings.push('state ' + st + ': default pharmacy ' + ph.name + ' does not list ' + st + ' (preference list, not a block)');
      }
      if ((ph.shipsToUnconfirmed || []).indexOf(st) !== -1) {
        warnings.push('state ' + st + ': routes to ' + ph.name + ' on an UNCONFIRMED ship-to');
      }
      if (r.provisional) {
        warnings.push('state ' + st + ': routing rule is provisional' + (r.flag ? ' (' + r.flag + ')' : ''));
      }
    });

    // Legacy products should never be reachable from a routing rule.
    KORB_GLP1.states.routing.forEach(function (r) {
      var ph = KORB_GLP1.pharmacies[r.pharmacy];
      if (ph && ph.status === 'legacy-continuity') {
        problems.push('routing rule for ' + r.states.join('/') + ' points at legacy pharmacy ' + ph.name);
      }
    });

    /* Every molecule a provider document can be built for must carry its OWN
       indications and its own scope note. Two defects motivate this. Foundayo
       shipped with no Indications section at all after the shared list was
       retired, and before that the Belmar tirzepatide document carried
       semaglutide's list. A missing section and a wrong section are the same
       failure: the provider is not reading this drug's indications. Regression-
       tested by deleting monographs.orforglipron.indications - selfCheck fails. */
    ['semaglutide', 'tirzepatide', 'orforglipron'].forEach(function (d) {
      var m = KORB_GLP1.monographs[d];
      if (!m) { problems.push('monograph missing for ' + d); return; }
      if (!m.indications || !m.indications.length) {
        problems.push('monographs.' + d + ': no indications - the generated document ' +
                      'would render with no Indications section');
      }
      if (!m.korbScope) {
        problems.push('monographs.' + d + ': indications present but no korbScope - an ' +
                      'approval list with no scope note reads as a menu of what KORB treats');
      }
      if (!m.indicationsSource) {
        problems.push('monographs.' + d + ': indications carry no indicationsSource');
      }
    });

    /* Adults-only is a clinical eligibility rule, not a stylistic note. If it is
       dropped, every document silently reverts to an FDA approval list whose
       adolescent thresholds are wider than KORB's practice. */
    if (!KORB_GLP1.clinical.candidateCriteria.age) {
      problems.push('clinical.candidateCriteria.age missing - documents would carry no ' +
                    'age eligibility statement');
    }

    /* Sign-off guards. The point of the fingerprint is that it cannot be
       satisfied by editing a list, so these check the mechanism itself is intact
       rather than checking whether anyone has signed. Regression-tested by
       deleting monographSignoff and by hand-editing a stored fingerprint. */
    if (!KORB_GLP1.monographSignoff || !KORB_GLP1.monographSignoff.records) {
      problems.push('monographSignoff.records missing - documents would lose the ' +
                    'clinical sign-off gate entirely and read as cleared');
    } else {
      ['semaglutide', 'tirzepatide', 'orforglipron'].forEach(function (d) {
        var st = KORB_GLP1.signoffStatus(d);
        if (st.state === 'stale') {
          /* A problem, not a warning: the document is carrying a clinician's name
             over text they did not review. The gate renders, but a build should
             stop and make someone look. */
          problems.push('monographs.' + d + ': sign-off is STALE - ' +
                        st.record.signedBy + ' signed ' + st.record.fingerprint +
                        ' but the monograph now fingerprints ' + st.fingerprint +
                        '. Re-review and re-record, do not edit the fingerprint.');
        }
        if (st.state === 'unsigned') {
          warnings.push('monographs.' + d + ': not clinically signed off. The ' +
                        'generated documents say so on page one.');
        }
        var rec = KORB_GLP1.monographSignoff.records[d];
        if (rec) {
          ['signedBy', 'role', 'date', 'dataVersion', 'fingerprint', 'attests']
            .forEach(function (k) {
              if (!rec[k]) problems.push('monographSignoff.records.' + d +
                                         ': missing ' + k);
            });
        }
      });
    }

    /* Dispensing programs and dose records must agree in both directions. This
       guard exists because adding the 12-week and 90-day brand programs meant
       touching two places per product - the dispensing list and every dose - and
       either half can be added without the other with no error anywhere. A
       program listed but not built renders an empty section; a record built but
       not listed simply does not render, which is worse because the document
       looks complete. Regression-tested by deleting one rx12 record and by
       deleting one dispensing entry; each is caught. */
    Object.keys(KORB_GLP1.products).forEach(function (k) {
      var p = KORB_GLP1.products[k];
      if (!p.dispensing || !p.dispensing.length) return;
      var declared = p.dispensing.map(function (x) { return x.key; });

      declared.forEach(function (sk) {
        var missing = (p.doses || []).filter(function (d) { return !d[sk]; });
        if (missing.length) {
          problems.push(k + ': dispensing declares "' + sk + '" but ' + missing.length +
                        ' dose(s) have no ' + sk + ' record - the program would render ' +
                        'with gaps: ' + missing.map(function (d) { return d.dose; }).join(', '));
        }
      });

      (p.doses || []).forEach(function (d) {
        Object.keys(d).forEach(function (key) {
          if (!/^rx/.test(key)) return;
          if (!d[key] || typeof d[key] !== 'object') return;
          if (declared.indexOf(key) === -1) {
            problems.push(k + ' dose ' + d.dose + ': has a "' + key + '" record that ' +
                          'dispensing does not declare - it would silently not render');
          }
        });
      });

      /* Each dose record must match the program it belongs to on quantity,
         refill and days. Records are cloned from a sibling when a program is
         added, so the failure mode is a copy where one field was not updated -
         a 90-day supply record still carrying days 30, which a provider would
         copy into Tebra verbatim. Verified as a real check: all four brand
         products currently agree on every field, so any deviation is a defect
         rather than an intentional exception. */
      p.dispensing.forEach(function (x) {
        (p.doses || []).forEach(function (d) {
          var r = d[x.key];
          if (!r) return;
          ['quantity', 'refill', 'days'].forEach(function (f) {
            if (x[f] !== undefined && r[f] !== x[f]) {
              problems.push(k + ' dose ' + d.dose + ' ' + x.key + ': ' + f + ' is ' +
                            r[f] + ' but the program declares ' + x[f]);
            }
          });
        });
      });

      /* Refill/days arithmetic. A brand injectable program is the same fill
         repeated, so total weeks = (refill + 1) x days. Catches the specific
         mistake of copying a record and forgetting to change refill. */
      p.dispensing.forEach(function (x) {
        var m = /^(\d+)-week/.exec(x.label || '');
        if (!m || !x.days || x.refill === undefined) return;
        var claimed = parseInt(m[1], 10) * 7;
        var actual = (x.refill + 1) * x.days;
        if (claimed !== actual) {
          problems.push(k + ' ' + x.key + ': label claims ' + m[1] + ' weeks (' +
                        claimed + ' days) but ' + (x.refill + 1) + ' fill(s) x ' +
                        x.days + ' days = ' + actual);
        }
      });
    });

    if (warnings.length) {
      console.warn('KORB_GLP1.selfCheck warnings (' + warnings.length + '):');
      warnings.forEach(function (w) { console.warn('  ! ' + w); });
    }

    if (problems.length) {
      console.warn('KORB_GLP1.selfCheck found ' + problems.length + ' problem(s):');
      problems.forEach(function (p) { console.warn('  - ' + p); });
    } else {
      console.log('KORB_GLP1.selfCheck passed.');
    }
    console.log('Open items in needsConfirmation: ' + KORB_GLP1.needsConfirmation.length);
    return problems;
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_GLP1; }
