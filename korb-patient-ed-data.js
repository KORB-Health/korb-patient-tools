/* ============================================================================
   KORB HEALTH - PATIENT EDUCATION CONTENT            SOURCE OF TRUTH

   The patient handouts were 27 hand-made PDFs with no source. A PDF a patient
   downloaded in March is frozen forever and cannot be corrected; the only fix
   is to stop shipping the document as the master. So the content lives here,
   once, and build-patient-ed.js renders BOTH the live HTML and the PDF from it.
   Neither can disagree with the other, because neither is typed by hand.

   WHAT IS LIVE AND WHAT IS NOT. Say this accurately rather than generously:

     LIVE      Facts pulled from korb-dosing-data.js at page load - schedule,
               timing, route, active weeks. Change the data file and every
               handout that shows them changes on the next page load.
     SHARED    Blocks in this file used by every handout - storage, travel,
               contact, sharps. Written once, so a correction lands in all of
               them in one edit rather than eight.
     PROSE     Per-drug explanation. Versioned and diffable, and it changes
               when someone edits it.

   THE ENTITY. Clinical patient instruction carries KORB Health Medical Texas
   PA, the practice. The MSO, KORB Health Group LLC, appears only where it is
   genuinely acting as itself - Operations contact, billing. The 27 PDFs these
   replace had that backwards: 25 of them named only the MSO, including every
   injectable handout. Same fault fixed in the provider references on
   2026-09-14 under open item 1b; the patient set was never in that scope.

   Do not put a dose, a schedule or a route in the prose here. If it exists in
   korb-dosing-data.js, reference it. Two copies of a dose is how a patient
   ends up reading one number and injecting another.
   ============================================================================ */

var KORB_PATIENT_ED = {

  /* See artifact-signoff.js. This file had NO sign-off structure of any kind
     until 2026-09-17: nine patient handouts carrying clinical content, none of
     them with anywhere to record that a clinician had read one. The fingerprint
     is over the RENDERED body text, because a handout has no prescribing blocks
     and the text is the whole of what a patient receives.

     Signing is not releasing. CLAUDE.md's RELEASE STATUS is the record of what
     patients can actually see, and a signature here does not move it. */
  artifactSignoff: {
    records: {
      "page:foundation_program_overview": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-4ca04f0a-7151",
        "covers": "6759 characters, 14 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 after the Kris Mulkey review changes and the optimization link relabelling. Don: \"Foundation program overview is good to sign off on.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-c618be0b-6499",
          "covers": "6140 characters, 13 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:gateway_program_overview": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-afa9061f-6693",
        "covers": "6325 characters, 14 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 after the Kris Mulkey review changes and the optimization link relabelling. Don: \"Gateway program overview is good to sign off on.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-5550a518-6091",
          "covers": "5751 characters, 13 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:injection_storage_safety_guide": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-44d82e65-6184",
        "covers": "5780 characters, 12 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. The shared sharps sentence is no longer printed here. This page has its own fuller Sharps disposal section, so the rule and the locator link were appearing twice; it now takes the sharps-free injection-safety block and keeps its own section.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-21",
          "fingerprint": "fp-865b338b-6138",
          "covers": "5730 characters, 12 headings",
          "attests": "Reviewed this patient page as rendered and approve it for release to patients, including the testosterone callout added the same day.",
          "note": "Signed 2026-09-21 after the testosterone callout was added at Don's request. The page is written for insulin-syringe patients and never said so, so a Men's Health patient was being told to use the wrong device. The callout names the draw-up needle and the injection needle, says never to draw up through the injection needle, and confirms that the rest of the page applies unchanged. Don, 2026-09-21: read it that afternoon and confirmed it was good. This page could not be signed before today because the register could not see it."
        }
      },
      "page:longevity_program_overview": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-355ea93c-6804",
        "covers": "6385 characters, 14 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 after the Kris Mulkey review changes, the optimization link relabelling, and the Peak pathway naming added the same day at Don's request. Don: \"functional health all look good.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-e682b48b-5927",
          "covers": "5518 characters, 13 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:menshealth_program_overview": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-01e4daa1-3634",
        "covers": "3412 characters, 6 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on 2026-09-23 after the Kris Mulkey review changes of 2026-09-22 and the optimization link relabelling of 2026-09-23, in which each button became the guide's own title with its qualifier as a caption beneath. Don approved all three in one pass: \"good to sign off on.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-31acc47a-3420",
          "covers": "3192 characters, 6 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:peak_program_overview": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-6e95c7eb-7000",
        "covers": "6557 characters, 16 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 after the Kris Mulkey review changes, the optimization link relabelling, and the pathway naming added the same day: Pathway A is CJC-1295 / Ipamorelin with BPC-157, Pathway B is Tesamorelin with BPC-157. Don: \"Peak program overview: good to sign off on.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-742b8ef5-6382",
          "covers": "5936 characters, 15 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:start_here_guide": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-b2e7921e-3474",
        "covers": "3223 characters, 7 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. The three programme choices split into a name and a caption - \"Foundation\" with \"One medication\" beneath - matching the treatment the optimization buttons got the same day.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-64bd476d-3380",
          "covers": "3129 characters, 7 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:weightloss_program_overview": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-c5b93f28-5737",
        "covers": "5382 characters, 10 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on 2026-09-23 after the Kris Mulkey review changes of 2026-09-22 and the optimization link relabelling of 2026-09-23, in which each button became the guide's own title with its qualifier as a caption beneath. Don approved all three in one pass: \"good to sign off on.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-60cb3a90-4949",
          "covers": "4635 characters, 10 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:when_to_contact_korb_or_er": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-9778f32a-3365",
        "covers": "2979 characters, 9 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Read and approved unchanged. Don: \"that was all good.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-4f97b920-3341",
          "covers": "2955 characters, 9 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "page:womenshealth_program_overview": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-e7aba570-4491",
        "covers": "4202 characters, 9 headings",
        "attests": "Reviewed this patient page as rendered and approve it for release to patients.",
        "note": "Re-read on 2026-09-23 after the Kris Mulkey review changes of 2026-09-22 and the optimization link relabelling of 2026-09-23, in which each button became the guide's own title with its qualifier as a caption beneath. Don approved all three in one pass: \"good to sign off on.\"",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-42a82329-4415",
          "covers": "4118 characters, 9 headings",
          "attests": "Reviewed this patient page as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the page was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, dated to when the reading happened. This page was ticked complete in the KORB Build Review artifact and that record was invisible to this register, which until 2026-09-21 enumerated only files named KORB_Patient_Ed_*. Verified unchanged since: rendered at commit 65b8a52 and compared against the current build, byte-identical in rendered text."
        }
      },
      "handout:anti_aging": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-76deed28-6019",
        "covers": "5801 characters, 9 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Gains a Storage and travel section and the shared airport screening sentence, because NAD+ injection is an injectable and this guide had neither. It states NO storage temperature, deliberately: korb-addons-data.js records none for any of the four products, so the label governs. Don is getting the beyond-use and storage figures at his next meeting with the pharmacy and they will be added then. Also gains the state-availability disclaimer.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-7d258f21-4431",
          "covers": "4281 characters, 6 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:bpc157": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-cd853b7b-10170",
        "covers": "9761 characters, 16 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Injection site reaction drops \"Common\", baseline labs are stated, and the injection-site infection and rash rows now send the patient to be evaluated rather than to send a message.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-c7ea2b97-9151",
          "covers": "8728 characters, 16 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:cjc_ipamorelin": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-7b2fd004-11132",
        "covers": "10621 characters, 18 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Injection site reaction drops \"Common\", and baseline labs are now stated before the test list.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-db49cab3-10293",
          "covers": "9768 characters, 18 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:ghk_cu": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-0126bdb8-10853",
        "covers": "10367 characters, 18 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Injection site reaction drops \"Common\", baseline labs are stated, and the hives row now sends the patient to be evaluated.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-6853e060-10105",
          "covers": "9605 characters, 18 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:hair_loss": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-15b91bf5-4214",
        "covers": "3938 characters, 9 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. \"How to use it\" became \"How to use the topical\", because that section is entirely about the topical on a page that also covers an oral tablet. Scalp redness drops \"Common\". Gains the state-availability disclaimer.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-ae9ff1f8-3722",
          "covers": "3489 characters, 7 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:semaglutide": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-fc75aa2b-16236",
        "covers": "15593 characters, 24 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-signed after the \"If your dose uses two vials\" row was added with Premier semaglutide 4.5 mg, where the fourth dose of every four weeks is the leftover of both vials. Don reviewed on the live site and approved 2026-09-23: \"they look good. go ahead and sign off on them for me now. Good to go\".",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-23",
          "fingerprint": "fp-7ed57fe2-15798",
          "covers": "15185 characters, 23 headings",
          "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
          "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. On this guide: the fluid target, \"May occur\" in place of \"Common\" on the nausea row, sentence case in the fact table, and the rewritten escalation - pancreatitis, gallbladder and dehydration now send the patient to urgent care or the ER the same day rather than to a message.",
          "superseded": {
            "signedBy": "Donald Stevenson, PA-C",
            "role": "Director of Clinical Operations and Lead Provider",
            "date": "2026-09-20",
            "fingerprint": "fp-45b0129c-14243",
            "covers": "13608 characters, 22 headings",
            "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
            "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
          }
        }
      },
      "handout:sermorelin": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-f1d1b631-11079",
        "covers": "10635 characters, 17 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Injection site reaction drops \"Common\", and the labs section now states plainly that baseline labs are required before starting, with the draw repeated at weeks 12 to 14 of each 16-week cycle.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-ad920930-10553",
          "covers": "10095 characters, 17 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:sexual_health": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-14757c41-6236",
        "covers": "5989 characters, 9 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Stuffy nose and upset stomach drop \"Common\" for \"May occur\". Gains the state-availability disclaimer.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-191275c6-5484",
          "covers": "5264 characters, 8 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:skin_care": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-74b54da9-3820",
        "covers": "3602 characters, 8 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Gains the state-availability disclaimer. Its two \"Common\" cells are KEPT deliberately, against the general rule: retinoid redness at first and the acne purge as pores clear are near-universal, and understating them risks a patient stopping treatment when the expected thing happens.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-332a2641-3381",
          "covers": "3171 characters, 7 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:tesamorelin": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-6d35bac9-11635",
        "covers": "11158 characters, 18 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Injection site reaction drops \"Common\", and baseline labs are now stated before the test list.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-7ab398c0-10894",
          "covers": "10403 characters, 18 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:tirzepatide": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-c52c0fad-15613",
        "covers": "15000 characters, 23 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Same changes as the Semaglutide guide: fluid target, \"May occur\" on the nausea row, sentence case in the fact table, and the rewritten escalation to urgent care or the ER.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-20",
          "fingerprint": "fp-834d23a8-14238",
          "covers": "13603 characters, 22 headings",
          "attests": "Reviewed this patient handout as rendered, document by document, during the Build Review pass of 2026-09-19 and 2026-09-20. Corrections identified during that read were made and re-checked before the document was marked complete, and approve it for release to patients.",
          "note": "RECORDED 2026-09-21 FROM A REVIEW DONE 2026-09-19 AND 2026-09-20, and dated to when the reading happened rather than when the record was written. Don worked through every patient page in the KORB Build Review artifact, raised corrections as he went, verified each one after it was made, and then marked the document complete. His marks saved into that artifact's own state and this register never saw them, which is why it read 'never signed' for two days. THE CONTENT WAS PROVEN UNCHANGED BEFORE THIS WAS WRITTEN, not assumed: every patient page was rendered at commit 65b8a52, the last commit before 2026-09-21, and compared against the current build. 21 of 23 are byte-identical in rendered text. The two that moved are the Testosterone handout and the Injection, Storage and Safety Guide, and neither is covered by this batch. So the fingerprint below is over the same words Don read."
        }
      },
      "handout:testosterone": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-8d215228-13564",
        "covers": "13076 characters, 19 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Injection site reaction and acne both drop \"Common\" for \"May occur\", at Don's instruction - his patients have not had these problems and one had acne that needed treating.",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-21",
          "fingerprint": "fp-54025f00-12865",
          "covers": "12380 characters, 18 headings",
          "attests": "Reviewed this patient handout as rendered - the clinical content, the dosing and administration guidance, the storage and travel instructions, the side effect and safety sections and the instructions on when to make contact - and approve it for release to patients.",
          "note": "Re-read on the live Pages site 2026-09-21 and approved: \"that Testosterone hand out is good now.\" DON FOUND A DEFECT ON THE FIRST READ AND IT IS WHY THIS SIGNATURE EXISTS. Under Safety reminders the handout carried the shared line 'Use a new insulin needle and syringe for every injection', appended directly beneath this handout's own correct sentence, so a patient was told both. Testosterone cypionate is a thick oil drawn with a draw-up needle and given through an injection needle on a Luer lock syringe; an insulin syringe has a fixed needle and is marked in units. The device sentence is now shared.injectionSafetyDevice and this handout declares ownInjectionDevice. Also covered by this reading: the needle renaming to draw-up and injection needle, and the gauge rule.",
          "superseded": {
            "signedBy": "Donald Stevenson, PA-C",
            "role": "Director of Clinical Operations and Lead Provider",
            "date": "2026-09-17",
            "fingerprint": "fp-982b0eb4-11974",
            "covers": "11509 characters, 17 headings",
            "attests": "Reviewed this patient handout as rendered - the clinical content, the dosing and administration guidance, the storage and travel instructions, the side effect and safety sections and the instructions on when to make contact - and approve it for release to patients."
          }
        }
      },
      "handout:hormonetherapy": {
        "signedBy": "Donald Stevenson, PA-C",
        "role": "Director of Clinical Operations and Lead Provider",
        "date": "2026-09-23",
        "fingerprint": "fp-a9fc4104-13578",
        "covers": "13035 characters, 19 headings",
        "attests": "Reviewed this patient guide as rendered and approve it for release to patients.",
        "note": "Re-read on the live Pages site 2026-09-23 and approved in one pass, after the Kris Mulkey review changes of 2026-09-22 and the run of corrections Don called while reading on 2026-09-23. Breast tenderness and bloating drop \"Common\" for \"May occur\".",
        "superseded": {
          "signedBy": "Donald Stevenson, PA-C",
          "role": "Director of Clinical Operations and Lead Provider",
          "date": "2026-09-21",
          "fingerprint": "fp-6b671e2f-12372",
          "covers": "11832 characters, 18 headings",
          "attests": "Reviewed this patient handout as rendered - the clinical content, the dosing and administration guidance, the storage and travel instructions, the side effect and safety sections and the instructions on when to make contact - and approve it for release to patients.",
          "note": "Re-read on the live Pages site 2026-09-21 and approved. What moved since the 2026-09-17 signature: the estradiol patch is now stated as TWO patches that are not interchangeable, one changed once a week and one twice a week, with the label telling the patient which. Don: \"hormone therapy is good.\"",
          "superseded": {
            "signedBy": "Donald Stevenson, PA-C",
            "role": "Director of Clinical Operations and Lead Provider",
            "date": "2026-09-17",
            "fingerprint": "fp-174b6821-11389",
            "covers": "10869 characters, 17 headings",
            "attests": "Reviewed this patient handout as rendered - the clinical content, the dosing and administration guidance, the storage and travel instructions, the side effect and safety sections and the instructions on when to make contact - and approve it for release to patients."
          }
        }
      }
    }
  },


  meta: {
    version: '1.0',
    lastUpdated: '2026-09-15',
    changelog: [
      '2026-09-15 (v1.0): First generated patient handouts. Content transcribed ' +
      'from the existing PDFs, which had no source. Sermorelin first, as the ' +
      'pattern. Clinical facts now read from korb-dosing-data.js rather than ' +
      'being restated, and the byline is the medical PA rather than the MSO.'
    ]
  },

  /* ── SHARED BLOCKS ──────────────────────────────────────────────────────
     Every injectable handout says these same things. They were eight separate
     copies in eight PDFs; a correction to the sharps rule meant eight edits and
     eight chances to miss one. */
  shared: {
    /* ONE sentence, referenced by all four optimization guides. Deliberately
       names NO state. Which products reach which state is pharmacy licensure
       and it changes; a hand-typed state list on a public patient page is the
       failure this repo opens with. The true picture is also not simple -
       metformin has no California route at all, while NAD+ does reach
       California as a nasal spray or sublingual but not as an injection.
       Don asked for a disclaimer, 2026-09-23. */
    availability: 'Not every product on this page is available in every state. Which ones you can be prescribed depends on where you live and which partner pharmacy is licensed to ship there, and for some products the form differs by state as well. Your provider will tell you what is available for you.',


    /* MEAL-IDEA PROMPTS. Moved here 2026-09-21 because the Patient Hub was
       rendering an EMPTY "Use an AI assistant for meal ideas" section on a
       live public page.

       They used to live inside guides.glp1_welcome. That entry was deleted on
       2026-09-19 when both welcome letters were retired, and the hub reads the
       prompts from the data file rather than typing its own copy - which is
       correct, and is why deleting the letter silently emptied the hub. The
       hub's loader did `if (!G) return;`, so it failed without a sound.

       THEY LIVE IN `shared` AND NOT IN `guides` ON PURPOSE. build-patient-ed.js
       walks docs, programs and guides and writes a PAGE for every key it finds.
       A guides entry here would regenerate a welcome letter over the redirect
       that replaced it, which is the exact trap the retirement note describes.
       shared is not walked, so this is data without a page. */
    mealIdeas: {
          "prompts": {
                "h": "Prompts to paste in",
                "lead": "Copy any prompt below and paste it into the assistant you picked. Nothing to sign up for, and you can keep asking follow-up questions in plain language until you get something you would actually eat, for example \"make these dairy free\" or \"I do not like fish\".",
                "callout": {
                      "title": "Before you use these",
                      "text": "The answers come from the AI assistant, not from KORB, and AI tools do sometimes get things wrong. Treat the results as ideas to consider, not instructions. **Do not type your medical conditions, medications or other health details into these tools.** The prompts are written so you do not need to. If you are thinking about a real change to how you eat, bring it to your provider first."
                },
                "prompts": [
                      {
                            "title": "High-protein breakfasts",
                            "why": "Breakfast is the meal most people skip once appetite drops.",
                            "text": "Give me 10 high-protein breakfast ideas using whole, minimally processed foods. Each should have at least 25 g of protein and no more than six ingredients. Keep them low in fat, since heavy or greasy meals can cause nausea. List the protein content per serving. Do not give me medical or nutrition advice, just food ideas."
                      },
                      {
                            "title": "Small meals that still hit protein",
                            "why": "For when you fill up after a few bites but still need the protein.",
                            "text": "I get full very quickly and can only eat small portions. Give me 10 meal ideas that are small in volume but high in protein, at least 25 g each. Prioritize protein density over portion size. Keep them simple to prepare. List protein per serving. Do not give me medical or nutrition advice, just food ideas."
                      },
                      {
                            "title": "Gentle food for a queasy day",
                            "why": "For the day or two after a dose increase.",
                            "text": "Give me 10 bland, low-fat, easy-to-digest meal and snack ideas that still contain protein. Avoid fried, greasy, very sweet, and strongly spiced foods. Each should be quick to prepare and easy to eat in small amounts. List protein per serving. Do not give me medical or nutrition advice, just food ideas."
                      },
                      {
                            "title": "Plant-based and still hitting protein",
                            "why": "Harder without meat or dairy, and harder again on a smaller appetite.",
                            "text": "I eat no meat, fish, dairy or eggs. Give me 10 plant-based meal and snack ideas that each contain at least 20 g of protein, built from whole foods such as beans, lentils, chickpeas, tofu, tempeh, edamame, seitan, nuts and seeds. Keep them small in volume where you can, since I fill up quickly. List the protein per serving, and mark any that combine two foods to make a complete protein. If I ate dairy and eggs as well, tell me which three would change and how. Do not give me medical or nutrition advice, just food ideas."
                      },
                      {
                            "title": "A week of simple dinners",
                            "why": "Removes the daily decision, which is usually the hard part.",
                            "text": "Plan 7 simple dinners for one week. Each should have at least 30 g of protein, use whole or minimally processed ingredients, and take under 30 minutes. Reuse ingredients across meals to reduce waste. Then give me a single consolidated grocery list organized by store section. Do not give me medical or nutrition advice, just recipes and a list."
                      },
                      {
                            "title": "Ordering when you eat out",
                            "why": "Restaurant portions are large and often high in fat.",
                            "text": "I am eating at a [TYPE OF RESTAURANT]. Suggest 8 protein-forward things I could order that are not fried or heavy in cream and oil, and that work as a smaller portion. For each, note roughly how much protein it has and one simple modification to ask for. Do not give me medical or nutrition advice, just ordering suggestions."
                      },
                      {
                            "title": "Look up the protein in what you already eat",
                            "why": "So you are working from numbers rather than guessing at them.",
                            "text": "Build me a reference table of the protein content of common everyday foods. Cover meat, poultry, fish, eggs, dairy, beans and pulses, soy, grains and nuts. For each one give a normal portion size both in grams and as a household measure such as a cup, a slice or a palm, and the grams of protein in that portion. Sort it from most protein per portion to least. Then add a short list of the ten that give the most protein for the smallest amount of food. Do not give me medical or nutrition advice, just the table."
                      },
                      {
                            "title": "A protein checklist for a working week",
                            "why": "For eating at a desk, on a job site, or between appointments.",
                            "text": "Give me a one-page checklist of high-protein foods that need no cooking, or under five minutes of preparation, for someone who works full time and eats at least one meal away from home. Split it into three groups: keep at home, take with you, and buy while you are out. Every item should have at least 15 g of protein in a normal portion, and you should note the portion size and the protein for each one. Keep it short enough to print and stick on a fridge. Do not give me medical or nutrition advice, just the list."
                      },
                      {
                            "title": "Compare tracking apps yourself",
                            "why": "So you pick a tool, rather than being pointed at one.",
                            "text": "Compare the most widely used free food and protein tracking apps available today. For each, tell me: what it costs, whether the free version is genuinely usable, how easy it is to log protein specifically, and what data it collects about me. Present it as a table and tell me which is best for someone focused mainly on hitting a daily protein target. Give me the trade-offs, not a single recommendation."
                      }
                ]
          },
          "tools": {
                "h": "Pick a free AI assistant",
                "lead": "Any of these will handle the prompts below, and all of them have a free version. KORB does not endorse or have any relationship with any of them. Pick whichever you already use or like the look of. Open one in a new tab, then come back for a prompt.",
                "tools": [
                      {
                            "href": "https://chat.openai.com",
                            "label": "ChatGPT"
                      },
                      {
                            "href": "https://claude.ai",
                            "label": "Claude"
                      },
                      {
                            "href": "https://gemini.google.com",
                            "label": "Google Gemini"
                      },
                      {
                            "href": "https://copilot.microsoft.com",
                            "label": "Microsoft Copilot"
                      },
                      {
                            "href": "https://www.perplexity.ai",
                            "label": "Perplexity"
                      }
                ]
          }
    },

    authoritySource:
      'Your prescription label, or the instructions given to you by your KORB ' +
      'clinical provider, is the final word on your dose and ' +
      'directions. Some pharmacies label vials "as directed by provider" rather ' +
      'than printing exact instructions. What follows is a general reference. ' +
      'Do not adjust anything without speaking to your provider first.',

    disclaimer:
      'This guide is for educational reference only. It is not medical advice. ' +
      'Always follow your prescription label, your pharmacy-specific ' +
      'instructions, and your KORB provider’s guidance. If you have ' +
      'questions, contact KORB using the details at the end of this guide.',

    /* USP <797>: a multi-dose container is 28 days from first entry OR the
       assigned BUD, whichever is shorter. Never tell a patient to disregard a
       printed date - see Conventions in CLAUDE.md. */
    storage: {
      cards: [
        ['Refrigerate', '36°F – 46°F (2°C – 8°C)'],
        ['Do not freeze', 'Freezing damages medication'],
        ['Protect from light', 'Keep away from direct sunlight'],
        ['Discard at 28 days', 'Write the open date on the vial']
      ],
      notes: [
        /* NOT "before first use". Don, 2026-09-19: read plainly, it says the
           fridge matters up to the first dose, which is the opposite of the
           point and the reading a patient with a box on the counter will take.
           The cold chain starts when the package does. Paired with "After
           opening" below, the two notes now split on the right event. */
        'From the day it arrives: keep it refrigerated, protect it from light, ' +
        'and do not freeze or shake it. Refrigeration starts when your package ' +
        'does, not when you take your first dose.',
        'After opening: write the open date on your vial and discard 28 days after ' +
        'first use, even if medication remains. If your label shows an earlier ' +
        'beyond-use date (the pharmacy\'s use-by date), follow the earlier one.',
        'Do not use if the solution appears cloudy or discolored, or contains particles.'
      ]
    },

    travel:
      'Traveling does not have to interrupt your program. Keep your medication ' +
      'with you, in your carry-on or personal item rather than checked baggage, ' +
      'in its original labeled vial or packaging. It does not need to be packed ' +
      'in ice during travel; keep it away from excessive heat (above 86°F / ' +
      '30°C) and from freezing, and refrigerate it again when you arrive. ' +
      'Medication and syringes are permitted in carry-on luggage, and TSA ' +
      'recommends keeping the original pharmacy label visible. Crossing time ' +
      'zones can shift your injection time by a few hours without a problem; if ' +
      'you will be off your usual schedule for several days, contact KORB.',

    /* WHAT TO DO AT THE CHECKPOINT, and where the current rules are. One fact,
       so it is written once.

       It lived on the Semaglutide and Tirzepatide handouts as doc.travelNote
       and nowhere else, so the Injection, Storage and Safety Guide - the
       document a patient is actually sent before their first injection, and the
       one whose whole last section is travel - said only that TSA "recommends
       keeping the original pharmacy label visible" and gave them no link and
       nothing to say to the officer. Don asked for the better wording on
       2026-09-18 and it was already in the repo, on two handouts that are not
       released to patients.

       Every travel section renders this: the shared one, and the handouts that
       override travel with their own text because their storage rules differ.
       A patient carrying testosterone needs the checkpoint sentence as much as
       one carrying semaglutide. */
    travelScreening: {
      /* The sentence ENDS. It used to trail off into "the current rules are at"
         with the address as the last words, which reads correctly only while the
         link is inline. Don asked for a button on 2026-09-18, and a sentence
         written to hand off to its own final phrase does not survive that move.
         buttonLabel says what pressing it does; the URL is not a label. */
      text: 'TSA asks that you tell the officer at the start of screening that ' +
            'you are carrying medically necessary liquids, and they may need to ' +
            'be inspected separately. TSA sets these rules and can change them, ' +
            'so check before you fly.',
      buttonLabel: 'Check the current TSA rules',
      href: 'https://www.tsa.gov/travel/travel-tips'
    },

    /* THE DEVICE LINE IS SEPARATE FROM THE UNIVERSAL RULES, split 2026-09-21.

       "Use a new insulin needle and syringe" is correct for the peptides and
       the GLP-1s, which really are supplied with insulin syringes. It is WRONG
       for testosterone: that is a thick oil drawn with a draw-up needle and
       given through an injection needle on a Luer lock syringe, and an insulin
       syringe has a fixed needle and is marked in units. KORB_Mens_Health_
       Provider_Tool.html already tells providers not to use one.

       Don caught it on the Testosterone handout on 2026-09-21, in the Safety
       reminders list, where the shared line was appended UNDER that handout's
       own correct sentence - so the page told a patient both things.

       Not combining medications and disposing of sharps are true of every
       injection and stay shared. Only the device sentence is per handout. */
    injectionSafetyDevice: 'Use a new insulin needle and syringe for every injection. Do not reuse. Insulin syringes are the small, finely marked kind; the name does not mean your medication is insulin.',

    injectionSafety: [
      'Never combine two medications in one syringe. Use a separate needle and ' +
      'syringe for each medication and each injection.',
      'Put used needles and syringes straight into a rigid, puncture-resistant ' +
      'container. Sharps rules are set locally and vary by state and by city, so ' +
      'follow the ones where you live, and do not put needles or syringes loose ' +
      'in household trash unless your local guidance specifically allows it. ' +
      '[Find sharps disposal near you](https://safeneedledisposal.org/) by ZIP code.'
    ],

    contact: {
      operations: {
        title: 'Contact KORB Operations',
        /* STRUCTURED, BECAUSE THESE WERE PRINTED AND NOT REACHABLE.
           'Email: info@korbhealth.com' was a string in a paragraph on every page
           that renders this block. It read as contact information and none of it
           was a link - no mailto:, no tel:, and the Patient Portal had no URL at
           all. The lab page rendered one link in the whole document and it was
           Print. Don, 2026-09-18: the contact information "doesn't stand out",
           and on the lab page he could not find it.
           value is what a patient reads, href is what a phone dials. */
        ways: [
          { label: 'Phone', value: '(888) 959-7299', href: 'tel:+18889597299' },
          { label: 'Email', value: 'info@korbhealth.com', href: 'mailto:info@korbhealth.com' },
          { label: 'Hours', value: 'Mon–Fri, 9 AM–6 PM CT' }
        ],
        items: ['Questions about timing, storage, or how to take or inject your medication',
                'Scheduling, billing and shipping']
      },
      portal: {
        title: 'Patient Portal — message your provider',
        /* The URL the Welcome Letter has always used. It was on the designed PDF
           and on no generated page, so a patient told to "use the Patient Portal"
           was told to find it themselves. */
        ways: [
          { label: 'Portal', value: 'Sign in to the Patient Portal',
            href: 'https://portal.kareo.com/app/new/login' }
        ],
        /* NOT "injection-site". This renders on the When to Contact guide, which
           serves all four programs: Women's Health is patches, creams and
           capsules, and gut health will add more oral products. Naming only
           injections tells every other patient their side effects are not the
           kind KORB wants to hear about. Don, 2026-09-19. */
        items: ['Localized irritation, redness or soreness that does not resolve, ' +
                'wherever you inject or apply your medication',
                'Nausea, digestive upset or appetite changes that are not settling',
                'Mild but persistent side effects of any kind',
                'Questions about whether to continue therapy']
      },
      emergency: {
        title: 'Seek emergency care immediately',
        items: ['Trouble breathing, or swelling of the face, lips, tongue or throat',
                'Severe rash or widespread hives',
                'Chest pain or fainting',
                'Severe or rapidly worsening symptoms',
                'Confusion or severe weakness',
                'Any symptom that feels urgent or unsafe']
      },
      portalNote:
        'The Patient Portal is the only HIPAA-compliant way to message your ' +
        'provider directly. Providers check portal messages at least once per day ' +
        'on their clinic days, so a message sent on a day your provider is not in ' +
        'clinic is not read until the next one. If you are not sure which days ' +
        'those are, ask at your next visit. For anything that does not need your ' +
        'provider’s direct medical judgment, contact KORB Operations by phone or ' +
        'email instead.',
      emergencyNote:
        'Phone and email are not appropriate for emergencies. When in doubt, go to ' +
        'urgent care or the emergency room.'
    }
  },

  /* ── THE HANDOUTS ───────────────────────────────────────────────────────
     agentKey ties a handout to korb-dosing-data.js. Route, schedule, timing and
     active weeks are read from there and are never restated below. */

  /* Program overviews. Rendered by renderProgramBody in patient-ed-render.js,
     not by renderBody: a tier is not a molecule. Narrative lives here; which
     agents a tier offers and when each is active inside the cycle are read
     from korb-dosing-data.js at page load, because that is the part the PDFs
     stated as fixed text and got wrong the moment the data moved. */
  programs: {
    foundation: {
      key: 'foundation',
      file: 'Patient_Education/KORB_Foundation_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Foundation Program Overview',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which medication and dosing schedule are right for you. If you have questions, contact KORB by phone or email.',
      what: [
        'Foundation is the simplest way to start: one medication at a time, chosen by your provider for your goals and your baseline labs (your first blood tests, before any treatment). It suits patients who want to begin with a single treatment and see how they respond before adding anything.',
        'Foundation is the single-medication option in KORB\'s Functional Health & Longevity Program. At any given time one peptide (a small, protein-like molecule that acts as a signal in the body) is active, and your provider selects it based on your goals and health history. You may switch to a different medication at each 16-week follow-up, but Foundation never combines two medications at once.',
        'If you are interested in two medications started at different times, ask your provider about the Gateway or Peak programs.',
        'These peptides are still being studied. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific medication before you begin.'
      ],
      agentsHeading: 'Your Foundation medication options',
      agentsLead: 'Your provider selects one of the following based on your goals. Each has its own active window inside your 16-week cycle. Your Treatment Schedule shows exact dates.',
      agents: [
        {
          key: 'sermorelin',
          context: 'foundation',
          text: 'A growth hormone-releasing peptide. Patients use it for sleep, recovery and body composition goals. Injected most nights, 6 on and 1 off.'
        },
        {
          key: 'cjcipam',
          context: 'foundation',
          text: 'A growth hormone-releasing peptide combination, used for goals similar to Sermorelin\'s. Injected most nights, 6 on and 1 off.'
        },
        {
          key: 'bpc157',
          context: 'foundation',
          text: 'A peptide being studied for recovery of muscles, tendons, ligaments and joints. Injected daily.'
        }
      ],
      note: {
        label: 'One medication at a time.',
        text: 'Foundation never combines two medications simultaneously. At each 16-week follow-up you and your provider may continue your current medication or switch to a different one. See the guide for your specific medication for full dosing, timing and storage instructions.'
      },
      /* THE SAME FOUR PRODUCTS THE HUB SHOWS, on the tier documents too. Don,
         2026-09-19: visibility is the point, a patient who never sees them never
         asks. The lead says "not part of your peptide protocol" on purpose,
         because Gateway and Peak already use the word add-on for GHK-Cu, which
         IS part of the protocol. Two different things, one page. */
      optimization: {
        heading: 'Optimize Your Longevity',
        lead: 'These can be added alongside your program. Ask your provider if any are a fit for you. They are prescribed separately, they are not part of your peptide protocol, and none of them replaces any part of it.',
        links: [
          { href: 'KORB_Patient_Ed_Sexual_Health.html', label: 'Sexual Health Guide', note: 'KORB Rise for men, KORB Electric for women' },
          { href: 'KORB_Patient_Ed_Hair_Loss.html', label: 'Hair Loss Guide', note: 'Oral or topical' },
          { href: 'KORB_Patient_Ed_Skin_Care.html', label: 'Skin Care Guide', note: 'Topical' },
          { href: 'KORB_Patient_Ed_Anti_Aging.html', label: 'Anti-Aging Guide', note: 'NAD+ and metformin' }
        ],
        after: [
          '**Do not take KORB Rise or KORB Electric if you take nitrates for chest pain, such as nitroglycerin or isosorbide, or use recreational "poppers".** Both contain sildenafil, and the combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.',
          '**Hair loss prescriptions are not interchangeable between people.** The men’s oral treatment, finasteride, must never be taken by a woman who is or could become pregnant, because it can cause serious birth defects. Never take, share or borrow someone else’s prescription, including a partner’s.'
        ]
      },
      pricing: 'For current Foundation Program pricing, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your medication\'s active window, before your follow-up, is a break from injections, for your labs and for focusing on sleep, food and activity.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your Foundation medication only as prescribed. Do not change your dose, course length or schedule unless your provider tells you to.',
        'Do not add a second peptide or combine medications on your own. Foundation is single-medication only.',
        'This program is not appropriate if you have cancer now or are being treated for it, or if you are pregnant.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the final word on your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local rules for getting rid of sharps (used needles and syringes). [Find sharps disposal near you](https://safeneedledisposal.org/) by ZIP code.'
      ],
      keyReminders: [
        'Your provider selects your Foundation medication. This guide is a general orientation, not personalized medical advice.',
        'Only one medication is active at a time. You may switch to a different medication at your next follow-up if you and your provider agree.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    },

    gateway: {
      key: 'gateway',
      file: 'Patient_Education/KORB_Gateway_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Gateway Program Overview',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines your exact schedule and add-ons. If you have questions, contact KORB by phone or email.',
      what: [
        'Gateway uses two medications, started at different points in your cycle rather than on the same day. Your provider recommends it when your goals call for more than one treatment, based on your baseline labs (your first blood tests, before any treatment).',
        'Gateway is KORB\'s two-medication option within the Functional Health & Longevity Program. Unlike Foundation\'s single-medication model, Gateway combines Sermorelin with BPC-157 on a fixed schedule, started on different days so the two do not begin together. An optional GHK-Cu add-on is available on Gateway if your provider prescribes it.',
        'These peptides are still being studied. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific medication before you begin.'
      ],
      agentsHeading: 'How your Gateway combination works',
      agentsLead: 'Two medications started at different points in the cycle by design, plus one optional add-on. Your Treatment Schedule shows your exact dates.',
      agents: [
        {
          key: 'sermorelin',
          context: 'foundation',
          text: 'Your main medication, begun on your start date. Injected most nights, 6 on and 1 off.'
        },
        {
          key: 'bpc157',
          context: 'gatewayPeakBase',
          text: 'Added after Sermorelin is already under way, not on your start date. Injected daily.'
        },
        {
          key: 'ghkcu',
          context: 'optionalAddon',
          text: 'An optional add-on, included only if your provider prescribes it.'
        }
      ],
      note: {
        label: 'Started at different times on purpose.',
        text: 'The two medications start at different times on purpose, so that if something does not agree with you it is clearer which one is responsible. Do not start them together to catch up, and do not change the order.'
      },
      /* THE SAME FOUR PRODUCTS THE HUB SHOWS, on the tier documents too. Don,
         2026-09-19: visibility is the point, a patient who never sees them never
         asks. The lead says "not part of your peptide protocol" on purpose,
         because Gateway and Peak already use the word add-on for GHK-Cu, which
         IS part of the protocol. Two different things, one page. */
      optimization: {
        heading: 'Optimize Your Longevity',
        lead: 'These can be added alongside your program. Ask your provider if any are a fit for you. They are prescribed separately, they are not part of your peptide protocol, and none of them replaces any part of it.',
        links: [
          { href: 'KORB_Patient_Ed_Sexual_Health.html', label: 'Sexual Health Guide', note: 'KORB Rise for men, KORB Electric for women' },
          { href: 'KORB_Patient_Ed_Hair_Loss.html', label: 'Hair Loss Guide', note: 'Oral or topical' },
          { href: 'KORB_Patient_Ed_Skin_Care.html', label: 'Skin Care Guide', note: 'Topical' },
          { href: 'KORB_Patient_Ed_Anti_Aging.html', label: 'Anti-Aging Guide', note: 'NAD+ and metformin' }
        ],
        after: [
          '**Do not take KORB Rise or KORB Electric if you take nitrates for chest pain, such as nitroglycerin or isosorbide, or use recreational "poppers".** Both contain sildenafil, and the combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.',
          '**Hair loss prescriptions are not interchangeable between people.** The men’s oral treatment, finasteride, must never be taken by a woman who is or could become pregnant, because it can cause serious birth defects. Never take, share or borrow someone else’s prescription, including a partner’s.'
        ]
      },
      pricing: 'For current Gateway Program pricing, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your medication\'s active window, before your follow-up, is a break from injections, for your labs and for focusing on sleep, food and activity.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your Gateway medications only as prescribed. Do not change your dose, course length or schedule unless your provider tells you to.',
        'Keep the start dates apart. Do not start both medications on the same day.',
        'GHK-Cu is an add-on only if your provider prescribed it. Do not add it yourself.',
        'This program is not appropriate if you have cancer now or are being treated for it, or if you are pregnant.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the final word on your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local rules for getting rid of sharps (used needles and syringes). [Find sharps disposal near you](https://safeneedledisposal.org/) by ZIP code.'
      ],
      keyReminders: [
        'Gateway is two medications started on different days, on a fixed schedule, not two medications started together.',
        'GHK-Cu is optional and only included if prescribed.',
        'Your provider sets your schedule. This guide is a general orientation, not personalized medical advice.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    },

    peak: {
      key: 'peak',
      file: 'Patient_Education/KORB_Peak_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Peak Program Overview',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which pathway and dose are right for you. If you have questions, contact KORB by phone or email.',
      what: [
        'Peak uses two medications, and is built around performance and body composition (your balance of muscle and fat). It comes in two versions, called pathways, and your provider chooses the one that fits your goals and your baseline labs (your first blood tests, before any treatment).',
        'Peak is KORB\'s performance and body-composition focused option within the Functional Health & Longevity Program. It offers two pathways, each pairing a growth hormone-releasing medication with BPC-157 added later in the cycle: Pathway A is CJC-1295 / Ipamorelin, Pathway B is Tesamorelin. Each has an optional GHK-Cu add-on, and your provider chooses the pathway.',
        'Your provider selects your pathway. You do not choose between them on your own, and they are not combined.',
        'These peptides are still being studied. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific medication before you begin.'
      ],
      tiersHeading: 'Choosing your pathway',
      tiersLead: 'Both pathways run on the same 16-week cycle. The difference is the main medication.',
      tiers: [
        {
          name: 'Pathway A, CJC-1295 / Ipamorelin',
          text: 'A growth hormone-releasing peptide combination as your main medication, with BPC-157 added later and an optional GHK-Cu add-on.'
        },
        {
          name: 'Pathway B, Tesamorelin',
          text: 'Tesamorelin as your main medication, with BPC-157 added later and an optional GHK-Cu add-on. Tesamorelin comes in more than one strength, and your provider sets yours.'
        }
      ],
      agentsHeading: 'The medications that run alongside your pathway',
      agentsLead: 'Whichever pathway you are on, these run on the same schedule inside your cycle.',
      agents: [
        {
          key: 'bpc157',
          context: 'gatewayPeakBase',
          text: 'Added after your main medication is already under way, not on your start date. Injected daily.'
        },
        {
          key: 'ghkcu',
          context: 'optionalAddon',
          text: 'An optional add-on, included only if your provider prescribes it.'
        }
      ],
      note: {
        label: 'Started at different times on purpose.',
        text: 'Your medications start at different points in the cycle on purpose, so that if something does not agree with you it is clearer which one is responsible. Do not start them together and do not change the order.'
      },
      /* THE SAME FOUR PRODUCTS THE HUB SHOWS, on the tier documents too. Don,
         2026-09-19: visibility is the point, a patient who never sees them never
         asks. The lead says "not part of your peptide protocol" on purpose,
         because Gateway and Peak already use the word add-on for GHK-Cu, which
         IS part of the protocol. Two different things, one page. */
      optimization: {
        heading: 'Optimize Your Longevity',
        lead: 'These can be added alongside your program. Ask your provider if any are a fit for you. They are prescribed separately, they are not part of your peptide protocol, and none of them replaces any part of it.',
        links: [
          { href: 'KORB_Patient_Ed_Sexual_Health.html', label: 'Sexual Health Guide', note: 'KORB Rise for men, KORB Electric for women' },
          { href: 'KORB_Patient_Ed_Hair_Loss.html', label: 'Hair Loss Guide', note: 'Oral or topical' },
          { href: 'KORB_Patient_Ed_Skin_Care.html', label: 'Skin Care Guide', note: 'Topical' },
          { href: 'KORB_Patient_Ed_Anti_Aging.html', label: 'Anti-Aging Guide', note: 'NAD+ and metformin' }
        ],
        after: [
          '**Do not take KORB Rise or KORB Electric if you take nitrates for chest pain, such as nitroglycerin or isosorbide, or use recreational "poppers".** Both contain sildenafil, and the combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.',
          '**Hair loss prescriptions are not interchangeable between people.** The men’s oral treatment, finasteride, must never be taken by a woman who is or could become pregnant, because it can cause serious birth defects. Never take, share or borrow someone else’s prescription, including a partner’s.'
        ]
      },
      pricing: 'For current Peak Program pricing, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your medication\'s active window, before your follow-up, is a break from injections, for your labs and for focusing on sleep, food and activity.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your Peak medications only as prescribed. Do not change your dose, course length or schedule unless your provider tells you to.',
        'Keep the start dates apart. Do not start your medications on the same day to catch up.',
        'GHK-Cu is an add-on only if your provider prescribed it. Do not add it yourself.',
        'This program is not appropriate if you have cancer now or are being treated for it, or if you are pregnant.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the final word on your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local rules for getting rid of sharps (used needles and syringes). [Find sharps disposal near you](https://safeneedledisposal.org/) by ZIP code.'
      ],
      keyReminders: [
        'Your provider selects your pathway. Pathways A and B are alternatives, not a combination.',
        'GHK-Cu is optional and only included if prescribed.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    },

    longevity: {
      key: 'longevity',
      file: 'Patient_Education/KORB_Longevity_Program_Overview',
      program: 'Functional Health & Longevity',
      title: 'Functional Health & Longevity Program Overview',
      cycleWeeks: 16,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which program and medication(s) are right for you. If you have questions, contact KORB by phone or email.',
      what: [
        /* Rewritten 2026-09-22 (items 2 and 5 of Kris Mulkey's review). It opened
           on "physician-guided, cash-pay telemedicine program": mechanics first,
           and two phrases Don removed from patient education. It now says what the
           program is for, then names the three options before the tiers appear. */
        'KORB\'s Functional Health & Longevity Program is for adults who want to work on how they feel and function as they age. Treatment is peptide therapy (peptides are small, protein-like molecules that act as signals in the body): small injections you give yourself at home, in 16-week cycles, prescribed by a licensed KORB provider and matched to your goals and your baseline labs (your first blood tests, before any treatment).',
        'Most people come to us for energy, sleep, recovery or body composition (your balance of muscle and fat), and want a plan built from their own results rather than guesswork. You do not need to know which peptide you want. There are three program options, Foundation, Gateway and Peak, and your provider recommends one once your labs are back.',
        'This guide is a general orientation to the whole program. Your program option has its own guide with more detail, and your provider gives you individualized guidance.',
        'These peptides are still being studied. Most are not FDA-approved for this specific use, and much of the current evidence comes from earlier-stage research rather than large, completed human studies. Your provider will walk you through what this means for your specific medication before you begin.'
      ],
      tiersHeading: 'Choosing your program',
      tiersLead: 'All three run on the same 16-week cycle. They differ in how many medications you take and when each one starts.',
      tiers: [
        {
          name: 'Foundation',
          text: 'The single-medication option. One peptide is active at a time, chosen by your provider from Sermorelin, CJC-1295 / Ipamorelin or BPC-157. Medications are never combined, though you may switch at a follow-up.'
        },
        {
          /* GHK-Cu on Gateway is not new. korb-dosing-data.js has had Gateway at
             optionalAddon: 'ghkcu' alongside both Peak pathways, and Foundation
             at null with the comment "GHK-Cu is never a Foundation option". Only
             the patient documents left it out. Don, 2026-09-19. */
          name: 'Gateway',
          text: 'The two-medication option. Sermorelin with BPC-157 added later in the cycle rather than on the same day, and an optional GHK-Cu add-on.'
        },
        {
          name: 'Peak',
          text: 'The performance and body-composition option. Two pathways, each pairing a growth hormone-releasing medication with BPC-157 added later in the cycle: Pathway A is CJC-1295 / Ipamorelin, Pathway B is Tesamorelin. Each has an optional GHK-Cu add-on, and your provider chooses the pathway.'
        }
      ],
      /* These were missing from this overview entirely, and from Weight Loss and
         Women's Health. Only Men's Health listed them. Don, 2026-09-19, and his
         word for them is optimization products, not add-ons: GHK-Cu above is an
         add-on INSIDE a tier, and these are separate prescriptions that run
         alongside any program. Two different things that were sharing a name. */
      optimization: {
        /* NAMED AS THE HUB NAMES IT. The hub calls this strip "Optimize Your
           <Program>" in all four sections and the patient meets it there first,
           so the overview uses the same words and the same four buttons in the
           same order. Don, 2026-09-19. */
        heading: 'Optimize Your Longevity',
        lead: 'These can be added alongside your program. Ask your provider if any are a fit for you. They are prescribed separately, and none of them replaces any part of your program.',
        links: [
          { href: 'KORB_Patient_Ed_Sexual_Health.html', label: 'Sexual Health Guide', note: 'KORB Rise for men, KORB Electric for women' },
          { href: 'KORB_Patient_Ed_Hair_Loss.html', label: 'Hair Loss Guide', note: 'Oral or topical' },
          { href: 'KORB_Patient_Ed_Skin_Care.html', label: 'Skin Care Guide', note: 'Topical' },
          { href: 'KORB_Patient_Ed_Anti_Aging.html', label: 'Anti-Aging Guide', note: 'NAD+ and metformin' }
        ],
        after: [
          '**Do not take KORB Rise or KORB Electric if you take nitrates for chest pain, such as nitroglycerin or isosorbide, or use recreational "poppers".** Both contain sildenafil, and the combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.',
          '**Hair loss prescriptions are not interchangeable between people.** The men’s oral treatment, finasteride, must never be taken by a woman who is or could become pregnant, because it can cause serious birth defects. Never take, share or borrow someone else’s prescription, including a partner’s.'
        ]
      },
      pricing: 'For current pricing on any program option, contact KORB Operations or ask your provider at your visit.',
      cycle: [
        'Baseline visit, labs only. No prescription is sent at your first visit.',
        'Once your baseline labs are back, KORB Operations schedules the visit that starts your 16-week cycle.',
        'At that visit your provider reviews your labs and starts your treatment.',
        'A lab order is placed at the beginning of your cycle for a draw at Quest Diagnostics, to be completed between weeks 12 and 14, so results are back before your follow-up visit.',
        'At your 16-week follow-up your provider reviews your labs and your response, then continues or changes your treatment for the next cycle.',
        'Any time after your medication\'s active window, before your follow-up, is a break from injections, for your labs and for focusing on sleep, food and activity.'
      ],
      expect: [
        'Response to peptide therapy varies between patients. These are not guaranteed treatments, and results, if any, typically emerge gradually over the course of a cycle rather than immediately.',
        'Your provider reassesses your treatment and your response at every 16-week follow-up visit.'
      ],
      labs: [
        'Baseline labs are required before you start. A lab order is placed at the beginning of each 16-week cycle for a draw at Quest Diagnostics.',
        'Complete your lab draw between weeks 12 and 14 of your cycle. That gives enough time for results to come back before your 16-week follow-up. Results can take about a week from the day you are drawn, and your visit may need to be rescheduled if they are not in yet.'
      ],
      safety: [
        'Use your medication only as prescribed. Do not change your dose, course length or schedule unless your provider tells you to.',
        'Do not add a medication or switch program options on your own. Your provider decides which option is right for you.',
        'This program is not appropriate if you have cancer now or are being treated for it, or if you are pregnant.',
        'Tell your KORB provider about any new medical condition or medication, or if you become pregnant.',
        'Your prescription label is the final word on your dose and directions.',
        'Use a new syringe for every injection. Do not reuse syringes.',
        'Follow your state or local rules for getting rid of sharps (used needles and syringes). [Find sharps disposal near you](https://safeneedledisposal.org/) by ZIP code.'
      ],
      keyReminders: [
        'Your provider recommends your program option after your intake and labs. This guide is a general orientation, not personalized medical advice.',
        'All three program options run on the same 16-week cycle with a lab draw between weeks 12 and 14.',
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'For current program pricing, contact KORB Operations or ask your provider.'
      ]
    }
  },


  /* Standalone guides, rendered by renderGuideBody. Sections that duplicate a
     handout - storage, injection safety, travel, contact - are declared as
     shared block references rather than retyped, so the guide and the handouts
     cannot disagree. That divergence is exactly what two separate PDFs
     produced. */
  guides: {
    anti_aging: {
      key: 'anti_aging',
      file: 'Patient_Education/KORB_Patient_Ed_Anti_Aging',
      program: 'Program Optimization',
      title: 'Anti-Aging Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        'Two treatments aimed at how you age rather than at a specific symptom. They can be added to any KORB program, and you may be prescribed one or both. Neither requires lab work to start.'
      ],
      sections: [
        {
          h: 'NAD+',
          paras: [
            'NAD+ is a helper molecule your cells use to make energy, and your body already makes it. It is involved in energy production, DNA repair and immune function. Levels fall steadily with age, and supplementing aims to restore some of what has been lost.',
            'Most people take it hoping for better energy, sharper focus, and less of the general worn-down feeling that creeps in with age. Research is promising but still developing, so think of it as supporting how you feel rather than producing a dramatic change.'
          ],
          cards: [
            [
              'Injection under the skin',
              'Twice a week. Most people use the lower abdomen; the arm, thigh or buttock also work. Rotate the site.'
            ],
            [
              'Nasal spray',
              'Once daily, one or two sprays in each nostril as directed.'
            ],
            [
              'Dissolving tablet',
              'Under the tongue each morning, Monday to Friday, with weekends off. Let it dissolve fully; do not chew or swallow it whole.'
            ]
          ],
          after: [
            'Your NAD+ supply lasts 28 days and you refill monthly rather than quarterly. If you use the injection there will still be medication in the vial at 28 days. That is expected. Discard it and start your new vial. Medication made by a compounding pharmacy is not considered safe to use past that point once the vial has been opened with a needle.',
            'Tell your provider if you take isotretinoin, sold as Accutane. NAD+ is not used alongside it.'
          ]
        },
        {
          h: 'Metformin',
          paras: [
            'Metformin has been used for decades for blood sugar and is on the World Health Organization\'s list of essential medicines. It is prescribed here for a different reason, as part of an approach to healthy aging. It is not FDA-approved for that use, and the research on it is still early. Results vary from person to person, and no result is guaranteed.',
            'One slow-release tablet daily. Swallow it whole; do not crush or chew it. Your supply is 90 days, so it follows the usual quarterly rhythm.',
            'You will probably not feel any different, and that is normal. Unlike a medication that treats a symptom you can notice, metformin here is aimed at long-term risk. Not feeling a change does not mean it is not working.',
            'You do not need to be diabetic to take it. At this dose it may nudge your blood sugar slightly lower, but it is unlikely to cause symptoms of low blood sugar.'
          ],
          after: [
            'Before you start, your provider needs to know about kidney problems, liver problems, heart failure or heavy alcohol use. Metformin is not appropriate for everyone and these are the things that matter most. Also tell us if you are scheduled for surgery or an imaging scan that uses contrast dye, since metformin is usually paused around those.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Nausea or upset stomach',
              'The most common effect for both. Usually settles. Taking metformin with food helps.'
            ],
            [
              'Headache, fatigue or indigestion (NAD+)',
              'May occur early on. Tell your provider if it persists.'
            ],
            [
              'Dizziness, sweating and headache together (metformin)',
              'Can indicate blood sugar dipping. Have something to eat and tell your provider.'
            ],
            [
              'Injection site soreness or redness (NAD+)',
              'Rotate sites and use new equipment each time. Metformin is taken by mouth and has no injection site.'
            ]
          ],
          after: [
            'Seek urgent care for unusual muscle pain or weakness, trouble breathing, unusual sleepiness, severe stomach pain with nausea and vomiting, or feeling very cold or lightheaded. These are rare but are the symptoms that matter most while taking metformin. Do not wait to hear back from KORB.'
          ]
        }
      ,
        {
          /* NO shared storage block here. shared.storage says refrigerate, which
             is right for a peptide and wrong for a tablet, and this page carries
             both. The same trap the Women's Health handout hit. korb-addons-data.js
             records NO storage temperature for any of these four products, so
             nothing here states one - the label governs, and the 28-day figure is
             the one fact the data does hold. Don, 2026-09-23. */
          h: 'Storage and travel',
          paras: [
            'These products are not all stored the same way. NAD+ injection is a compounded injectable, while metformin and the sublingual tablet are tablets. **Follow the storage instructions on your own label and the pharmacy packaging** - they govern, and they differ by product.',
            'NAD+ is dispensed as a 28-day supply because of the beyond-use date on a compounded product. Discard it at the end of that window even if some is left, and do not use it past the date on your label.',
            'When you travel, keep these in your carry-on rather than checked baggage, in the original labeled packaging, and away from heat above 86°F (30°C) and from freezing.'
          ]
        },
        {
          h: 'Airport screening',
          shared: 'travelScreening'
        },
        {
          h: 'Availability',
          shared: 'availability'
        }
      ],
      keyReminders: [
        'Neither treatment requires lab work to start.',
        'NAD+ injection: discard the vial 28 days after first puncture even if medication remains.',
        'NAD+ injection: put used needles and syringes straight into a sharps container. [Find sharps disposal near you](https://safeneedledisposal.org/) by ZIP code.',
        'Tell your provider about kidney or liver problems, heart failure or heavy alcohol use before starting metformin.',
        'Metformin is usually paused around surgery and contrast imaging. Tell us if either is scheduled.',
        'Do not take NAD+ alongside isotretinoin (Accutane).'
      ]
    },

    hair_loss: {
      key: 'hair_loss',
      file: 'Patient_Education/KORB_Patient_Ed_Hair_Loss',
      program: 'Program Optimization',
      title: 'Hair Loss Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        'KORB\'s hair loss treatments are prescription medications for thinning hair and hair loss, for men and for women. Treatment comes as a once-daily tablet, a once-daily topical you apply to your scalp, or both together. Your provider chooses based on your pattern of loss, your health history and your preference.'
      ],
      sections: [
        {
          /* ONE ROUTE PER ROW. Don, 2026-09-19: two rows each carrying both an
             oral and a topical read as a run-on, and "Pill:" is not the word.
             It is oral. Oral before topical.
             TWO SECTIONS, 2026-09-22 (Kris Mulkey's review): the men's and
             women's treatments are different drugs, and a patient should find
             theirs under a heading, the way the Sexual Health guide does, rather
             than by reading row labels in one mixed table. */
          h: 'For men: what you may be prescribed',
          cards: [
            ['Oral', 'Finasteride, taken once daily.'],
            ['Topical',
             'Minoxidil with finasteride and tretinoin, applied to the scalp once daily.']
          ]
        },
        {
          h: 'For women: what you may be prescribed',
          cards: [
            ['Oral', 'Spironolactone, taken once daily.'],
            ['Topical',
             'Minoxidil with spironolactone and latanoprost, applied to the scalp once daily.']
          ],
          after: [
            'These are not interchangeable between people. **The men\'s oral treatment, finasteride, must never be taken by a woman who is or could become pregnant, because it can cause serious birth defects.** Never take, share or borrow someone else\'s prescription, including a partner\'s.'
          ]
        },
        {
          h: 'How to use the topical',
          items: [
            'Apply once daily to a dry scalp, not damp or freshly washed hair.',
            'Use one to two applications depending on how much area you are covering. Your provider will tell you which.',
            'Work it into the scalp where you are thinning, not onto the hair itself.',
            'Wash your hands afterwards.',
            'Leave it on for at least four hours, or overnight if that suits your routine better.'
          ],
          after: [
            'How long your bottle lasts depends on how much you use. Two doses a day runs out roughly twice as fast as one. Tell us early if you are running low rather than at the last minute.'
          ]
        },
        {
          h: 'What to expect',
          paras: [
            'Give it three to six months. This is the single most important thing to understand before you start. Hair grows slowly, and these treatments aim to protect the hair you have and support new growth. Most people see no visible change for the first three months. If there is a change, it usually shows between three and six months.',
            'Some people notice increased shedding in the first few weeks. That is usually a normal part of your hair\u2019s growth cycle resetting and not a sign the treatment is failing. Stopping early is the most common reason treatment does not work. If you stop, any gains will gradually reverse.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Scalp redness, itching or dryness (topical)',
              'May occur early on. Tell your provider if it is severe or does not settle.'
            ],
            [
              'Increased shedding in the first few weeks',
              'Usually normal. Contact KORB if it is heavy or lasts beyond about six weeks.'
            ],
            [
              'Reduced sex drive or difficulty with erections (finasteride)',
              'Uncommon but real. Tell your provider rather than stopping on your own.'
            ],
            [
              'Breast tenderness or swelling (either oral treatment)',
              'Tell your provider.'
            ],
            [
              'Dizziness or feeling lightheaded (spironolactone)',
              'Stand up slowly. Tell your provider if it continues.'
            ],
            [
              'Unwanted hair growth where the topical has run',
              'Tell your provider.'
            ]
          ]
        }
      ,
        {
          h: 'Availability',
          shared: 'availability'
        }
      ],
      keyReminders: [
        'Finasteride must never be taken by a woman who is or could become pregnant. It causes serious birth defects.',
        'Never share or borrow a hair loss prescription, including a partner\'s.',
        'Give it three to six months. Stopping early is the most common reason it does not work.',
        'Apply the topical to a dry scalp and leave it at least four hours.'
      ]
    },

    sexual_health: {
      key: 'sexual_health',
      file: 'Patient_Education/KORB_Patient_Ed_Sexual_Health',
      program: 'Program Optimization',
      title: 'Sexual Health Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        '**Do not use these medications if you take nitrates for chest pain. This applies to KORB Rise and PERFORM for men, and to KORB Electric for women**, because all three contain sildenafil. Nitrates include nitroglycerin, isosorbide and similar heart medications, and recreational "poppers", whether you take them daily or only occasionally. Combining nitrates with any of them can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you use rarely.',
        'KORB\'s sexual health treatments are prescription medications for erections, arousal and sexual response: KORB Rise and PERFORM for men, and KORB Electric for women. Your provider chooses based on your health history and what you want help with.'
      ],
      sections: [
        {
          h: 'For men: KORB Rise',
          paras: [
            'KORB Rise is a dissolvable troche you place in your mouth. It contains the same active ingredients found in Viagra and Cialis, combined with L-Arginine and oxytocin. L-Arginine is included specifically to reduce headache, which is the most common side effect.',
            'Oxytocin does something different from the other ingredients. Sildenafil and tadalafil work on blood flow. Oxytocin acts on the brain, where it plays a part in arousal, desire and feeling relaxed and connected with a partner. It was added to address the side of the response that blood flow alone does not reach, particularly where stress or anxiety is part of the picture. This use of oxytocin is newer and less well established than the other ingredients, so tell your provider how it works for you.'
          ],
          cards: [
            [
              'How to take it',
              'Let half to one troche dissolve in your mouth. Do not swallow it whole.'
            ],
            [
              'When',
              'About 30 minutes before sexual activity.'
            ],
            [
              'How long it lasts',
              'Up to 36 hours, so it does not need tight planning.'
            ]
          ],
          after: [
            'Start with half a troche. If that is not enough, your provider may tell you to increase to a full one. Do not take more than one troche in a 24-hour period unless your provider specifically tells you to.',
            'If you live in a state we serve through a different pharmacy you may receive PERFORM instead. It contains sildenafil and tadalafil, the same two active ingredients that do the main work in KORB Rise, in a fast-dissolving tablet taken 30 minutes before sexual activity. It does not contain L-Arginine or oxytocin, so headache may be a little more noticeable. **The nitrate warning at the top of this page applies to PERFORM as well.** Your strength may differ from KORB Rise, so follow your own label rather than anything you were told about the other product.'
          ]
        },
        {
          /* INGREDIENTS AND THE NITRATE WARNING. Don, 2026-09-19, confirming that
             the warning applies to KORB Electric too, and he had not realised the
             actives were never listed. korb-addons-data.js has carried
             nitrate: true on BOTH KORB Electric formulations all along; the
             patient handout named the actives for KORB Rise and not for this.

             Worse than silent: it said Electric works "rather than acting on the
             whole body", which reads as a reason the warning above does not
             apply to her. It contains sildenafil, the Viagra active.

             TWO FORMULATIONS, because the pharmacies compound it differently.
             Both are sildenafil plus arginine; the third active differs. The
             handout names the actives and sends her to her label for the rest.

             NO STRENGTHS ANYWHERE IN THIS FILE, and that is a rule rather than an
             oversight. Don, 2026-09-19: patients should know what is in a product
             and not what the numbers are. Numbers invite comparison between
             products, they go stale when a formulation changes, and this file is
             served from a public no-login URL where a competitor reads it as
             easily as a patient. Strengths live in korb-addons-data.js for
             providers. Do not copy them here. */
          h: 'For women: KORB Electric',
          paras: [
            'KORB Electric is a topical gel applied directly to the clitoris about 30 minutes before sexual activity, where it increases blood flow to the tissue it is applied to.',
            '**It contains sildenafil, the same active ingredient as Viagra**, along with L-arginine. Depending on which pharmacy fills your prescription it also contains either theophylline (a medicine that relaxes blood vessels) or DHEA (a hormone your body turns into estrogen and testosterone). Your label names your exact formulation.',
            '**The nitrate warning at the top of this page applies to KORB Electric.** Applying it to the skin rather than swallowing it does not remove that risk. If you take nitroglycerin, isosorbide or any similar heart medication, even rarely, do not use KORB Electric and tell your provider.',
            'Apply one to two clicks from the applicator. Wash your hands before and after. One bottle covers roughly 20 uses.'
          ]
        },
        {
          h: 'What to expect',
          items: [
            'These medications support your body\'s normal response. They do not create arousal on their own, so interest and stimulation still matter.',
            'The first attempt is not always the best measure. It is common to need a few tries to find your timing and the right amount.',
            'Alcohol and heavy meals both blunt the effect. A large, fatty meal beforehand is the most common reason people feel it did not work.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Headache',
              'The most common effect. Usually mild. Stay hydrated. Tell your provider if it persists.'
            ],
            [
              'Stuffy nose or flushing',
              'May occur, and is temporary.'
            ],
            [
              'Upset stomach or nausea',
              'May occur. Taking it on a lighter stomach may help.'
            ],
            [
              'Changes in vision, such as a blue tinge or blurring',
              'Uncommon. Stop and contact KORB if it happens.'
            ],
            [
              'Local irritation (KORB Electric)',
              'Wash the area. Tell your provider if it does not settle.'
            ]
          ],
          after: [
            '**Seek emergency care right away** for an erection lasting more than 4 hours, chest pain during or after sex, sudden loss of vision or hearing, fainting, or severe dizziness. An erection that will not go down is a medical emergency and can cause permanent damage if untreated.'
          ]
        },
        {
          h: 'Getting refills',
          paras: [
            'There is no lab work and no scheduled follow-up for this treatment. When you need more, send a message through the patient portal and your provider will review it. Do not wait until you are completely out.'
          ]
        }
      ,
        {
          h: 'Availability',
          shared: 'availability'
        }
      ],
      keyReminders: [
        'Never combine with nitrates for chest pain. This can be life-threatening.',
        'Take about 30 minutes before sexual activity. The effect lasts up to 36 hours.',
        'An erection lasting more than 4 hours is a medical emergency. Go to the emergency room.',
        'No lab work and no scheduled follow-up. Request refills through the portal before you run out.'
      ]
    },

    skin_care: {
      key: 'skin_care',
      file: 'Patient_Education/KORB_Patient_Ed_Skin_Care',
      program: 'Program Optimization',
      title: 'Skin Care Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Always follow your prescription label and your KORB provider\'s guidance. If your label differs from anything here, follow your label and contact KORB.',
      intro: [
        'KORB\'s skin care treatments are prescription creams for acne, dark spots, fine lines and dry or aging skin. All three are applied once daily. Your provider selects which one fits your skin and your goals, and may start you at a lower strength.'
      ],
      sections: [
        {
          h: 'What you may be prescribed',
          cards: [
            [
              'Tretinoin',
              'Acne, oily skin, scarring and dark spots. A pea-sized amount once daily.'
            ],
            [
              'Estriol',
              'Dry skin, fine lines, elasticity and spots. One press of the pump once daily.'
            ],
            [
              'Combo cream',
              'A broader approach combining several active ingredients. One press of the pump once daily.'
            ]
          ]
        },
        {
          h: 'How to use it',
          items: [
            'Wash your face and let it dry completely first. Applying to damp skin increases irritation.',
            'Use only the amount described. More does not work faster and will irritate your skin.',
            'Apply at night unless your provider tells you otherwise.',
            'Avoid the corners of your nose, your eyes and your lips.',
            'Wash your hands afterwards.',
            'Follow with a plain moisturizer if your skin feels tight or dry.'
          ],
          after: [
            'These creams make your skin more sensitive to the sun. Use sunscreen daily, even in winter and on overcast days. Without it you are more likely to burn, and sun exposure will work directly against the spots and discoloration you are treating.'
          ]
        },
        {
          h: 'What to expect',
          paras: [
            'Skin often looks slightly worse before it looks better. Dryness, flaking and mild redness in the first few weeks are expected as your skin adjusts. Acne can briefly flare as blocked pores clear.',
            'If irritation is uncomfortable, tell your provider. Often the answer is to use it every other night for a while rather than stopping altogether. If your skin responds, it usually shows over six to twelve weeks.'
          ]
        },
        {
          h: 'Side effects',
          cards: [
            [
              'Dryness, flaking or peeling',
              'Expected early on. Moisturize and tell your provider if severe.'
            ],
            [
              'Redness or mild stinging on application',
              'Common at first. Should settle within a few weeks.'
            ],
            [
              'A short-lived acne flare',
              'Common as pores clear. Give it a few weeks.'
            ],
            [
              'Sunburn more easily than usual',
              'Use sunscreen daily. This is expected with these creams.'
            ],
            [
              'Breast tenderness or unexpected bleeding (estriol)',
              'Estriol contains a hormone. Contact KORB if this happens.'
            ]
          ],
          after: [
            'Tell your provider if you are pregnant, trying to conceive or breastfeeding. Tretinoin is not used in pregnancy. Estriol contains a hormone, so mention it if you already take hormone therapy through another KORB program so your full plan can be reviewed together.'
          ]
        }
      ,
        {
          h: 'Availability',
          shared: 'availability'
        }
      ],
      keyReminders: [
        'Apply once daily to clean, completely dry skin.',
        'A pea-sized amount is enough. More causes irritation without better results.',
        'Wear sunscreen every day.',
        'Expect dryness and a possible flare in the first few weeks.',
        'If irritation is too much, ask about every-other-night use rather than stopping.',
        'Tretinoin is not used in pregnancy. Tell your provider if you are pregnant or trying to conceive.'
      ]
    },

    weight_loss: {
      key: 'weight_loss',
      file: 'Patient_Education/KORB_WeightLoss_Program_Overview',
      program: 'Weight Loss & Metabolic Health',
      title: 'Weight Loss & Metabolic Health Program Overview',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which treatment and dose are right for you. If you have questions, contact KORB.',
      intro: [
        /* Opens the way Women's Health does, the model Kris Mulkey pointed to on
           2026-09-22: what the program treats, then why people come, before any
           medicine is named. The last sentence of the second paragraph is her
           expectations point: medication is a tool, not a substitute for habits. */
        'KORB\'s Weight Loss & Metabolic Health Program is medical care for adults whose weight is affecting their health. Treatment is a GLP-1 medication (one that copies a natural gut hormone that controls appetite and fullness), semaglutide or tirzepatide, prescribed by a licensed KORB provider and dispensed by a licensed US pharmacy.',
        'Most people come to us after diet and exercise alone have not been enough, or because their weight has started to affect their blood pressure, blood sugar, sleep, joints or energy. You do not need to have tried every diet first. Medication works best alongside nutrition and activity changes, not in place of them.',
        'Your provider selects your medication and starting dose based on your goals and health history, and adjusts your plan at regular follow-up visits.',
        'Drink regularly while you are on treatment, because eating less and any stomach upset can leave you low on fluids. Your Semaglutide or Tirzepatide guide shows how much, spread through the day.'
      ],
      sections: [
        {
          h: 'What you may be prescribed',
          cards: [
            [
              'Semaglutide',
              'A GLP-1 medication, which copies a natural gut hormone. Slows digestion and reduces appetite. Injected once weekly, starting low and increasing every 4 weeks as tolerated.'
            ],
            [
              'Tirzepatide',
              'Works like two natural gut hormones, called GIP and GLP-1, rather than one. Injected once weekly, with the same gradual increase.'
            ]
          ],
          after: [
            'Your provider will recommend which to start with, and may also discuss a daily oral option, either a tablet or a dissolvable troche, if injections are not the right fit.'
          ],
          links: [
            {
              href: 'KORB_Patient_Ed_Semaglutide.html',
              label: 'Semaglutide Guide',
              note: 'full dosing, timing and storage'
            },
            {
              href: 'KORB_Patient_Ed_Tirzepatide.html',
              label: 'Tirzepatide Guide',
              note: 'full dosing, timing and storage'
            }
          ]
        },
        {
          h: 'How your program works',
          items: [
            'Your first visit includes a full history and a review of whether GLP-1 therapy is safe and appropriate for you.',
            'Your provider selects your medication and starting dose.',
            'Your dose increases gradually, typically every 4 weeks, based on how you are tolerating it.',
            'You are reviewed at regular follow-up visits, where your plan is adjusted.'
          ]
        },
        {
          h: 'About compounded medication',
          paras: [
            'Your medication is prepared for you by a licensed US compounding pharmacy. Compounding pharmacies are state-licensed and regulated, and they prepare each prescription to your provider\'s specifications rather than mass-producing it. This is what allows your dose to be tailored to you and adjusted over time.',
            'Because the FDA reviews mass-manufactured products rather than individual prescriptions, compounded preparations are not FDA-approved. The active ingredient is the same one used in the brand-name medication. If you would like to discuss a brand-name option, ask your provider whether it is a fit for you.'
          ]
        },
        {
          /* Said on the program document as well as the two handouts. A patient
             reading the overview to find out what the program involves should
             not have to open a molecule handout to learn that no labs are part
             of it. Don, 2026-09-19. */
          h: 'Labs',
          paras: [
            'KORB does not order labs for this program. There is no baseline draw and no scheduled draw at any point in your weight loss treatment with us.',
            'If you want lab work, or another clinician has told you that you need it, that is a conversation to have with your primary care provider. Some other KORB programs do require lab work; this one does not, and that is deliberate.'
          ]
        },
        {
          h: 'If you are also managing diabetes',
          paras: [
            'If you are managing diabetes or pre-diabetes, KORB can continue to provide your GLP-1 medication, but you should continue your diabetes care, including any related lab monitoring, with the clinician who manages it. That may be your primary care provider, an endocrinologist (a hormone and diabetes specialist) or another specialist.'
          ]
        },
        {
          h: 'Optimize Your Weight Loss',
          lead: 'These can be added alongside your program. Ask your provider if any are a fit for you. They are prescribed separately, and none of them replaces any part of your program.',
          links: [
            { href: 'KORB_Patient_Ed_Sexual_Health.html', label: 'Sexual Health Guide', note: 'KORB Rise for men, KORB Electric for women' },
            { href: 'KORB_Patient_Ed_Hair_Loss.html', label: 'Hair Loss Guide', note: 'Oral or topical' },
            { href: 'KORB_Patient_Ed_Skin_Care.html', label: 'Skin Care Guide', note: 'Topical' },
            { href: 'KORB_Patient_Ed_Anti_Aging.html', label: 'Anti-Aging Guide', note: 'NAD+ and metformin' }
          ],
          after: [
            '**Do not take KORB Rise or KORB Electric if you take nitrates for chest pain, such as nitroglycerin or isosorbide, or use recreational "poppers".** Both contain sildenafil, and the combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.',
            '**Hair loss prescriptions are not interchangeable between people.** The men’s oral treatment, finasteride, must never be taken by a woman who is or could become pregnant, because it can cause serious birth defects. Never take, share or borrow someone else’s prescription, including a partner’s.'
          ]
        },
        {
          h: 'Pricing',
          paras: [
            'For current Weight Loss Program pricing, contact KORB Operations or ask your provider at your visit.'
          ]
        }
      ],
      keyReminders: [
        'Compounded medication is not FDA-approved. The active ingredient is the same one used in the brand-name product.',
        'If you have diabetes or pre-diabetes, keep that care with the clinician who manages it.',
        'Your dose increases gradually. Do not change it on your own.',
        'For current pricing, contact KORB Operations or ask your provider.'
      ]
    },

    mens_health: {
      key: 'mens_health',
      file: 'Patient_Education/KORB_MensHealth_Program_Overview',
      program: 'Men\'s Health',
      title: 'Men\'s Health Program Overview',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which treatment and dose are right for you. If you have questions, contact KORB.',
      intro: [
        /* Women's Health opening shape, 2026-09-22. The reasons men come were
           two sections down, in the testosterone section; they open the page now
           and are no longer repeated there. */
        'KORB\'s Men\'s Health Program is care for adult men with low testosterone. Treatment is testosterone replacement therapy (TRT), started only after lab work confirms your levels are low, and prescribed and monitored by a licensed KORB provider.',
        'Most men come to us for ongoing fatigue, reduced strength or muscle, more body fat, low sex drive, low mood or motivation, or slow recovery from exercise. You do not need to have all of them. What matters is how you feel and what your labs show.',
        'Four optional optimization products are available alongside it: KORB Rise, a sexual health treatment for men; hair loss treatment; skin care; and anti-aging.',
        'Men\'s Health also works alongside other KORB programs. Many men combine it with Weight Loss & Metabolic Health, or with Functional Health & Longevity. Your provider will confirm the combination is appropriate and make sure nothing conflicts.'
      ],
      sections: [
        {
          h: 'What you may be prescribed',
          paras: [
            'Testosterone naturally declines with age. When levels fall low enough to cause symptoms, your provider may recommend replacing it.'
          ],
          cards: [
            [
              'What it is',
              'Testosterone cypionate, a long-acting injectable form of testosterone.'
            ],
            [
              'How it is given',
              'A small injection you give yourself at home, either under the skin or into the muscle.'
            ],
            [
              'Labs',
              'Required before starting and at every follow-up.'
            ],
            [
              'Follow-up',
              'Every 12 weeks, or sooner if your provider recommends it.'
            ]
          ],
          after: [
            '**Testosterone is currently available to KORB patients in Texas and California only.** If you live elsewhere, ask your provider about other options that may fit your goals.',
            '**Labs are not optional.** Testosterone affects your red blood cell count, your prostate and your hormone balance, and those changes are not always something you can feel. Regular lab work is how your provider keeps your dose in the right range and catches problems early.'
          ]
        },
        {
          /* "Optimization products", not "add-ons". Don, 2026-09-19: add-on is
             already the name of GHK-Cu inside an FH&L tier, and these are separate
             prescriptions that run alongside any program. Anti-aging was missing
             here although its own handout says it can be added to any KORB
             program, so this overview offered three of the four. */
          h: 'Optimize Your Men’s Health',
          lead: 'These can be added alongside your program. Ask your provider if any are a fit for you. They are prescribed separately, and none of them replaces any part of your program.',
          links: [
            {
              href: 'KORB_Patient_Ed_Sexual_Health.html',
              /* No note. It carried "no lab work required" and its two siblings
                 carried nothing, so one button in three had a caption hanging
                 under it and the set read as cluttered rather than as a set.
                 Don, 2026-09-18. Nothing is lost: the handout this opens says
                 "There is no lab work and no scheduled follow-up for this
                 add-on" in its body and again in its reminders. The button is a
                 way in, not the place to state the fact. */
              label: 'Sexual Health Guide',
              note: 'KORB Rise for men'
            },
            {
              href: 'KORB_Patient_Ed_Hair_Loss.html',
              /* Named for men. The handout carries both columns and they are
                 different drugs: finasteride for men, spironolactone for women. */
              label: 'Hair Loss Guide',
              note: 'For men. Oral or topical.'
            },
            {
              href: 'KORB_Patient_Ed_Skin_Care.html',
              label: 'Skin Care Guide',
              note: 'Topical'
            },
            {
              href: 'KORB_Patient_Ed_Anti_Aging.html',
              label: 'Anti-Aging Guide',
              note: 'NAD+ and metformin'
            }
          ],
          after: [
            '**Do not take KORB Rise if you take nitrates for chest pain, such as nitroglycerin or isosorbide, or use recreational "poppers".** It contains sildenafil, and the combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.'
          ]
        },
        {
          h: 'Pricing',
          paras: [
            'For current Men\'s Health Program pricing, contact KORB Operations or ask your provider at your visit.'
          ]
        }
      ],
      keyReminders: [
        'Testosterone is available to KORB patients in Texas and California only.',
        'Labs are required before starting and at every follow-up. They are not optional.',
        'Follow-up is every 12 weeks, or sooner if your provider recommends it.',
        'Never take KORB Rise with nitrates for chest pain.'
      ]
    },

    womens_health: {
      key: 'womens_health',
      file: 'Patient_Education/KORB_WomensHealth_Program_Overview',
      program: 'Women\'s Health',
      title: 'Women\'s Health Program Overview',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your KORB provider determines which treatment and dose are right for you. If you have questions, contact KORB.',
      intro: [
        'KORB\'s Women\'s Health Program is care for the symptoms of perimenopause, menopause and the years after. Treatment is hormone therapy, matched to your symptoms and your health history, and prescribed by a licensed KORB provider.',
        'Most women come to us for hot flashes, night sweats, disrupted sleep, mood changes, vaginal dryness or painful intercourse, low libido, or the mental fog that often comes with this stage. You do not need to have all of them, and you do not need to wait until they are severe.'
      ],
      sections: [
        {
          h: 'The three stages',
          cards: [
            [
              'Perimenopause',
              'Hormones fluctuate and periods become irregular. Symptoms often start here.'
            ],
            [
              'Menopause',
              'Twelve months without a period.'
            ],
            [
              'Postmenopause',
              'The years afterwards, when lower hormone levels affect bone and heart health.'
            ]
          ]
        },
        {
          h: 'What you may be prescribed',
          lead: 'Your provider chooses from three hormones, alone or in combination.',
          cards: [
            [
              'Estradiol',
              'The main hormone used for hot flashes, night sweats, sleep and vaginal dryness. Comes as a skin patch or cream.'
            ],
            [
              'Progesterone',
              'Protects the uterus when you take estrogen. A capsule taken at night, because it can make you drowsy.'
            ],
            [
              'Testosterone',
              'Used for libido, energy, mood and muscle strength. A cream.'
            ]
          ],
          after: [
            'Testosterone is currently available to KORB patients in Texas and California only. Estradiol and progesterone are available everywhere we operate.',
            '**If you still have your uterus, you will always be prescribed progesterone alongside estrogen. This is not optional and it is not an upsell.** Estrogen on its own thickens the lining of the uterus over time, which raises cancer risk. Progesterone prevents that.'
          ]
        },
        {
          h: 'How your program works',
          paras: [
            'This program is guided by how you feel, not by a lab number. There is no blood test that tells us the right dose for you, so your provider adjusts based on your symptoms and how you are responding.'
          ]
        },
        {
          h: 'Timing matters',
          paras: [
            'Hormone therapy works best and carries the least risk when it is started under age 60 and within about ten years of your last period. That does not mean it is unavailable outside that window, but your provider will weigh it differently and will talk it through with you.'
          ]
        },
        {
          /* Women's Health had no optimization section at all. Every product is
             named for women here: KORB Electric rather than KORB Rise, and the
             women's hair loss treatment, which is spironolactone and not the
             men's finasteride. Getting that one wrong is not a wording problem. */
          h: 'Optimize Your Women’s Health',
          lead: 'These can be added alongside your program. Ask your provider if any are a fit for you. They are prescribed separately, and none of them replaces any part of your program.',
          links: [
            { href: 'KORB_Patient_Ed_Sexual_Health.html', label: 'Sexual Health Guide', note: 'KORB Electric for women' },
            { href: 'KORB_Patient_Ed_Hair_Loss.html', label: 'Hair Loss Guide', note: 'For women. Oral or topical.' },
            { href: 'KORB_Patient_Ed_Skin_Care.html', label: 'Skin Care Guide', note: 'Topical' },
            { href: 'KORB_Patient_Ed_Anti_Aging.html', label: 'Anti-Aging Guide', note: 'NAD+ and metformin' }
          ],
          after: [
            '**Do not use KORB Electric if you take nitrates for chest pain, such as nitroglycerin or isosorbide, or use recreational "poppers".** It contains sildenafil, the same active as Viagra, and applying it to the skin rather than swallowing it does not remove the risk: the combination can cause a sudden, dangerous drop in blood pressure that can be life-threatening. Tell your provider about every medication you take, including ones you take only occasionally.',
            '**Never take a hair loss prescription that was written for a man.** Yours is spironolactone. The men’s oral treatment is finasteride, and finasteride can cause serious birth defects if it is taken by a woman who is or could become pregnant. Never take, share or borrow a partner’s prescription.'
          ]
        },
        {
          h: 'Pricing',
          paras: [
            'For current Women\'s Health Program pricing, contact KORB Operations or ask your provider at your visit.'
          ]
        }
      ],
      keyReminders: [
        'If you still have your uterus, progesterone is always prescribed alongside estrogen. This is not optional.',
        'Testosterone is available in Texas and California only. Estradiol and progesterone are available everywhere we operate.',
        'Hormone therapy works best started under 60 and within about ten years of your last period.',
        'This program is guided by your symptoms, not by a lab number.'
      ]
    },

    start_here: {
      key: 'start_here',
      file: 'Patient_Education/KORB_Start_Here_Guide',
      program: 'Functional Health & Longevity',
      title: 'Start Here Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'Read this after your baseline visit. It tells you what order to read everything else in, what happens in your first cycle, and what to do if something does not feel right.'
      ],
      sections: [
        {
          h: 'Read your materials in this order',
          lead: 'Each one assumes you have read the one before it.',
          links: [
            {
              href: 'KORB_Longevity_Program_Overview.html',
              label: 'Program Overview',
              note: 'what the program is and how a cycle runs'
            },
            {
              label: 'Your Program Overview',
              note: 'open the one your provider confirmed for you',
              choices: [
                { href: 'KORB_Foundation_Program_Overview.html', label: 'Foundation', note: 'One medication' },
                { href: 'KORB_Gateway_Program_Overview.html', label: 'Gateway', note: 'Two medications' },
                { href: 'KORB_Peak_Program_Overview.html', label: 'Peak', note: 'Two medications, performance focus' }
              ]
            },
            {
              label: 'Your Medication Guide',
              note: 'open the guide for the medication you were prescribed',
              choices: [
                { href: 'KORB_Patient_Ed_Sermorelin.html', label: 'Sermorelin' },
                { href: 'KORB_Patient_Ed_CJC_Ipamorelin.html', label: 'CJC-1295 / Ipamorelin' },
                { href: 'KORB_Patient_Ed_BPC157.html', label: 'BPC-157' },
                { href: 'KORB_Patient_Ed_Tesamorelin.html', label: 'Tesamorelin' },
                { href: 'KORB_Patient_Ed_GHK_Cu.html', label: 'GHK-Cu (Add-On)' }
              ]
            },
            {
              href: 'KORB_Injection_Storage_Safety_Guide.html',
              label: 'Injection, Storage & Safety Guide',
              note: 'read before your first injection'
            },
            {
              href: 'KORB_When_to_Contact_KORB_or_ER.html',
              label: 'When to Contact KORB or the ER',
              note: 'keep this one handy'
            }
          ],
          after: [
            'Your pharmacy also sends instructions with your medication. Those are specific to what you were dispensed, and they take priority over anything general written here.'
          ]
        },
        {
          h: 'Your first cycle, in order',
          items: [
            'Baseline visit. Labs only. No prescription is sent at this visit.',
            'Your labs come back, usually within about a week.',
            'KORB Operations schedules the visit that starts your 16-week cycle.',
            'At that visit your provider reviews your labs and confirms your program option and your medication.',
            'Your medication ships from the pharmacy with its own instructions.',
            'A lab order is placed for a draw between weeks 12 and 14, so results are back before your follow-up.',
            'At your 16-week follow-up your provider reviews everything and decides the next cycle with you.'
          ]
        },
        {
          h: 'Lifestyle still matters',
          lead: 'These therapies support nutrition, training and sleep. They do not replace them, and response is noticeably better in people who have the basics in place.',
          items: [
            'Nutrition. Adequate protein, and enough total food to support recovery.',
            'Movement. Strength training, with weights or your own body weight, if you are able, plus regular general activity.',
            'Recovery. Consistent sleep, and honest management of stress and alcohol.'
          ]
        },
        {
          h: 'What to expect after starting',
          paras: [
            'Response varies between patients. These are not guaranteed treatments, and results, if any, usually emerge gradually across a cycle rather than in the first week or two.',
            'Mild injection-site redness or irritation is common early on and usually settles. Anything severe, spreading, or accompanied by trouble breathing or swelling is not expected, and is covered in the contact guide.'
          ]
        }
      ],
      keyReminders: [
        'Baseline visit is labs only. No prescription is sent at your first visit.',
        'Your pharmacy instructions and your prescription label take priority over any general guide.',
        'Read the Injection, Storage & Safety Guide before your first injection.',
        'Nothing here is personalized medical advice. Your provider recommends your program option and your medication.'
      ]
    },

    /* BOTH WELCOME LETTERS WERE RETIRED HERE ON 2026-09-19, by Don.
       `glp1_welcome` (KORB_GLP1_Welcome_Letter) and `welcome`
       (KORB_Welcome_Letter, the Functional Health & Longevity one) stood here.
       Git has them.

       WHY THEY ARE GONE FROM THE DATA AND NOT JUST UNLINKED. build-patient-ed.js
       writes a page for every key in these collections. Leaving the entries and
       putting a redirect at the .html would have worked exactly until the next
       build overwrote the redirect with a regenerated letter. A retired page has
       no entry.

       WHY THEY WERE RETIRED. From Monday 2026-09-22 patients are sent to
       KORB_Patient_Hub.html by a text snippet with a per-program dropdown, not
       to a letter. The hub carries the same information, shows a patient the
       other programs they may want, and is one place to update instead of
       three. The GLP-1 letter was written and, per Don, never actually used.

       THE TWO .html FILES ARE STILL PUBLISHED, as redirects to the hub. They
       are NOT deleted, for the same reason KORB_GLP1_Provider_Tool.html was not:
       those URLs were handed out. Same rule as the bridge PDF. */

    labs: {
      key: 'labs',
      file: 'KORB_Schedule_Your_Lab_Appointment',
      /* NOT a program document. Men's Health uses this same page for its
         baseline and trough draws, and it sits in the hub's cross-program
         reference row beside sharps disposal and the compounding Q&A. It said
         Functional Health & Longevity because that is who it was written for
         first. Don, 2026-09-19. */
      program: 'All Programs',
      title: 'Schedule Your Quest Lab Appointment',
      root: true,
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'Your Quest Diagnostics lab order has been placed. The next step is to book your draw.'
      ],
      sections: [
        {
          h: 'Book your appointment',
          paras: [
            'Booking at Quest Diagnostics takes about a minute.'
          ],
          /* The URLs are in korb-quest.js, because KORB_Patient_Treatment_Schedule
             .html needs the same four and is a weekly tool that has no business
             downloading 184KB of handout prose to render one info box. That page
             is the one the Functional Health and Longevity welcome letter links
             to, and Don confirmed on 2026-09-18 it is the one to keep. */
          shared: 'quest'
        },
        {
          h: 'How to prepare',
          lead: 'Unless your provider has told you otherwise:',
          items: [
            'Fast for 8 to 12 hours.',
            'Drink plenty of water.',
            'Complete your draw before 10:00 AM.',
            'Morning and fasting is preferred wherever possible.',
            /* Added 2026-09-22. The fasting line above never said what to do
               about medication, and a patient on insulin who fasts without
               adjusting is the one who gets hurt by it. */
            'Take your usual medications with water. If you take insulin or another diabetes medication, ask your provider how to handle it before you fast.',
            /* Biotin distorts immunoassays, hormones and thyroid included; the
               FDA has warned about it. It sits in the hair, skin and nail
               supplements that KORB's hair loss patients are likely to take. */
            'Stop biotin at least 72 hours before your draw. It is common in hair, skin and nail supplements and in multivitamins, and it can make hormone and thyroid results read wrong.'
          ]
        },
        {
          /* KORB's own standard, from korb-mens-data.js labs.timing: draw
             testosterone at trough, on an injection day before the dose. Men's
             Health uses this page for those draws, and until 2026-09-22 it
             did not say so. The Testosterone guide does, in its labs section. A draw taken after
             the injection reads high, and a dose set from it is set wrong. */
          h: 'If you inject testosterone',
          paras: [
            'Book your draw for the morning of an injection day, and give that day\'s injection after your blood is drawn, not before. Drawn after an injection, your testosterone reads higher than it really runs, and your provider cannot set your dose from it.'
          ]
        },
        {
          h: 'What to bring',
          paras: [
            'A photo ID. If the Quest site cannot find your lab order, contact KORB Operations.'
          ]
        },
        {
          h: 'What happens next',
          paras: [
            'Results usually take about a week from the day your blood is drawn. The clock starts at your draw, not when your order was placed and not when you booked. Once we have received and reviewed them, our team contacts you to schedule your follow-up appointment and discuss next steps.',
            'If your results are not back in time, your follow-up visit may need to be rescheduled. Completing your draw in the window you were given is what prevents that.'
          ]
        },
      ]
    },

    injection: {
      key: 'injection',
      file: 'Patient_Education/KORB_Injection_Storage_Safety_Guide',
      /* NOT an FH&L document, and NOT an all-programs one either. GLP-1, weight
         loss and Men's Health all use it and the technique is the same
         subcutaneous injection in all three. Women's Health is patches, creams
         and capsules and none of this applies to it, and gut health will add
         oral products. It said All Programs for part of 2026-09-19, which told
         a woman on a patch that a syringe document was written for her.
         A document about injecting says who injects. */
      program: 'All Injectable Programs',
      title: 'Injection, Storage & Safety Guide',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'Read this before your first injection. It covers what to have ready, how to check your medication, how to store it, sharps disposal and travel.'
      ],
      sections: [
        {
          h: 'Before you inject',
          lead: 'Have these ready before you start.',
          items: [
            'Your medication, taken out of the fridge.',
            'Alcohol pads.',
            'A new insulin needle and syringe.',
            'A rigid, puncture-resistant container for the used needle and syringe.',
            'A clean surface and good lighting.'
          ]
        },
        {
          h: 'Check your medication first',
          lead: 'Do not inject, and contact KORB, if any of these are true.',
          items: [
            'The solution is cloudy or discolored, or has particles in it.',
            'The vial is cracked or damaged.',
            'The vial is past 28 days from first use, or past the beyond-use date (the pharmacy\'s use-by date) on your label.',
            'The medication has been frozen, or has been left in heat above 86°F (30°C).'
          ]
        },
        {
          h: 'Storage',
          shared: 'storage'
        },
        {
          h: 'Injection safety',
          /* NOT the full shared block. This page has a dedicated Sharps disposal
             section below, so printing the shared sharps sentence here said the
             rule and rendered the locator link twice on one page. Don, 2026-09-23. */
          shared: 'injectionSafetyNoSharps',
          /* THIS GUIDE IS WRITTEN FOR AN INSULIN SYRINGE, and until 2026-09-21
             it never said so. It goes to every patient before a first
             injection, it names no programme, and it mentions testosterone,
             intramuscular injection and the draw-up needle nowhere - so a Men's
             Health patient reading it was told to use a device that is wrong
             for what he has been sent.

             Don asked for a callout rather than a rewrite, on 2026-09-21, and
             that is the right shape: the peptide and GLP-1 instructions are
             correct for the large majority who receive this, and testosterone
             needs one clear exception plus a pointer to the handout that has
             its full steps. Same reasoning as the Testosterone handout keeping
             its own device sentence.

             NO GAUGE NUMBERS here either - they differ by route, and the
             handout teaches the rule. */
          callout: {
            title: 'If you are on testosterone, your equipment is different',
            text: 'Testosterone is a thick oil and is **not** given with an insulin ' +
                  'syringe. It comes with a Luer lock syringe (one the needle twists onto, so you can change needles) and **two** separate ' +
                  'needles: a **draw-up needle** to pull the medication out of the ' +
                  'vial, and a thinner **injection needle** to inject with. Use both, ' +
                  'every time, and never draw up through the injection needle. ' +
                  'Three things on this page apply to you exactly as written: never ' +
                  'reusing anything, never combining two medications, and how to dispose ' +
                  'of sharps. **Storage is different: testosterone is kept at room ' +
                  'temperature and never refrigerated, so follow your Testosterone guide, ' +
                  'not the storage section here.** Your Testosterone guide has the full ' +
                  'step-by-step, and your KORB provider will go through it with you.'
          }
        },
        {
          /* Don, 2026-09-19: sharps disposal is the patient's responsibility and
             it is set locally, so the job of this document is to say that plainly
             and hand them the lookup - not to imply KORB requires a particular
             product. SafeNeedleDisposal.org is the same source the hub already
             uses for this. */
          h: 'Sharps disposal',
          paras: [
            'Used needles and syringes go straight into something rigid and puncture-resistant. Never loose into household trash, and never into recycling.',
            'What counts as an acceptable container, and how you get rid of it once it is full, is decided where you live and varies by state and by city. Some areas have drop-off sites, some run mail-back programs, some allow a sealed heavy-duty household container. Looking up your own area is the only way to get this right, and it is yours to do.'
          ],
          links: [
            {
              href: 'https://safeneedledisposal.org/',
              label: 'Find sharps disposal near you',
              note: 'search by ZIP code, from SafeNeedleDisposal.org'
            }
          ]
        },
        {
          h: 'Injection technique',
          paras: [
            'Prepare the exact dose you were instructed to use. Your prescription label and your pharmacy instructions are the final word on your dose, not any general guide.',
            'These medications are given subcutaneously, into the fat layer just under the skin, not into muscle or a vein. Rotate your injection sites rather than using the same spot repeatedly.'
          ]
        },
        {
          h: 'Mild injection-site reactions',
          paras: [
            'Some redness, mild swelling or itching at the injection site is common and usually settles on its own within a day or two. Rotating sites helps.',
            'Contact KORB if a reaction does not resolve, keeps getting worse, or spreads well beyond the injection site. Trouble breathing, or swelling of the face, lips, tongue or throat, is an emergency and is not something to message about.'
          ]
        },
        {
          h: 'Traveling with your medication',
          shared: 'travel'
        }
      ],
      keyReminders: [
        'A new needle and syringe every time. Never reuse, and never combine two medications in one syringe.',
        'Write the open date on the vial and discard 28 days after first use, or earlier if your label says so.',
        'Your prescription label is the final word on your dose and directions.',
        'Sharps rules are local and they are yours to look up. Find what your area requires and dispose of needles and syringes that way.'
      ]
    },

    contact: {
      key: 'contact',
      file: 'Patient_Education/KORB_When_to_Contact_KORB_or_ER',
      /* Every program contacts KORB the same way and the emergency list is not
         program-specific. Don, 2026-09-19, same correction as the lab page and
         the injection guide. */
      program: 'All Programs',
      title: 'When to Contact KORB or the ER',
      disclaimer: 'This guide is for educational reference only. It is not medical advice. Your prescription label and your provider\'s instructions come first. If you have questions, contact KORB.',
      intro: [
        'Keep this one handy. It covers who to contact, for what, and what counts as an emergency rather than a message.'
      ],
      sections: [
        {
          h: 'Who to contact, and for what',
          shared: 'contact'
        },
        {
          /* ASK ONLY FOR WHAT KORB DOES NOT ALREADY HAVE. Don, 2026-09-19: a
             message through the portal already carries the patient's name, and
             the prescription and schedule are on file. What is not on file is
             what actually went in and when. The old list asked for the name,
             the prescribed dose and the therapy start date - three things the
             chart already answers - and it did not ask for the one injection
             the patient is calling about. */
          h: 'What to include in your message',
          lead: 'Your name reaches us with the message, and we have your prescription on file. What we do not have is what you actually took and when, so start with these.',
          /* NOT "injected". This document now serves all four programs, and
             Women's Health hormone therapy is patches, creams and capsules -
             nothing in that program is injected. Asking a woman on a patch how
             much she injected reads as a document written for somebody else.
             Same correction as "never mix peptides" on the injection guide. */
          items: [
            'Which product you took.',
            'How much you actually took.',
            'When your last dose was.',
            'What you are experiencing, and when it started.',
            'Anything you have already tried, and anything else you think matters.'
          ]
        },
        {
          h: 'Not an emergency, but worth a message',
          items: [
            'Mild side effects that are not urgent, whatever form your medication takes.',
            'Localized irritation, redness or soreness that does not resolve, wherever you inject or apply your medication.',
            'Nausea, digestive upset or appetite changes that are not settling.',
            'Sleep changes, flushing, or a mild rash or itching.',
            'Questions about whether to continue therapy.',
            'A concern that therapy is not helping.',
            'Dose instructions, timing or storage questions.',
            'Pharmacy, shipping, scheduling or billing questions.'
          ]
        },
        {
          h: 'Go to emergency care instead of messaging',
          lead: 'These are not things to email about. Call 911 or go to your nearest emergency room.',
          items: [
            'Trouble breathing, or swelling of the face, lips, tongue or throat.',
            'Severe rash or widespread hives.',
            'Chest pain, or fainting.',
            'Confusion, or severe weakness.',
            'Severe or rapidly worsening symptoms.',
            'Any symptom that feels urgent or unsafe.'
          ],
          after: [
            'Phone and email are not appropriate for emergencies, and they are not monitored around the clock. When in doubt, go to urgent care or the emergency room. Nobody at KORB will think you overreacted.'
          ]
        }
      ],
      keyReminders: [
        'Phone and email are business hours only and are not for emergencies.',
        'Trouble breathing or swelling of the face, lips, tongue or throat is an emergency. Call 911.',
        'Tell us which product you took, how much, and when, so your provider can answer in one reply.'
      ]
    }
  },

  docs: {
    /* ------------------------------------------------------------------------
       HORMONE THERAPY - the ninth handout, and the first for Women's Health.

       Converted 2026-09-16, the last of the patient PDFs still unconverted. The
       other eight cover peptides, GLP-1 and testosterone; women's health had
       three hand-made PDFs from 9 and 10 September and no HTML.

       ONE handout, not one per hormone. The peptide handouts are one per agent
       because a patient takes one peptide. A woman on hormone therapy is
       usually on two or three at once - estradiol with progesterone, often
       testosterone as well - so splitting them would hand her three documents
       that each omit two thirds of what she is taking.

       Clinical content follows korb-womens-data.js, which Don signed the same
       day, rather than the November 2025 programme document. Where that file
       says something in provider language this says the same thing in hers.

       STORAGE AND TRAVEL ARE OVERRIDDEN. The shared blocks say refrigerate,
       which is right for peptides and wrong for every product here - patches,
       creams and capsules are all room temperature. That is the mistake the
       testosterone handout hit in September and it is the same fix.
       ------------------------------------------------------------------------ */
    hormone_therapy: {
      key: 'hormone_therapy',
      file: 'KORB_Patient_Ed_HormoneTherapy',
      title: 'Hormone Therapy Guide',
      source: 'none',
      program: "Women's Health",

      /* NOTHING IN THIS PROGRAMME IS INJECTED. The shared blocks are written for
         the eight injectable handouts and said so in four places - the facts
         table headed "How to inject", the "as directed" note about vials, the
         injection-safety list with sharps disposal, and injection-site
         irritation in the portal column. All four are overridden here. */
      factLabels: { how: 'How you take it', timing: 'When to take it' },
      noInjectionSafety: true,

      authoritySource: 'Your prescription label, or the instructions given to you ' +
        'by your KORB clinical provider, is the final word on your dose ' +
        'and directions. What follows is a general reference. Do not adjust ' +
        'anything without speaking to your provider first.',

      portalItems: [
        'Skin irritation where you apply a cream or patch',
        'Mild but persistent side effects',
        'Questions about whether to continue therapy',
        'Interest in other KORB programs or treatments, including sexual health'
      ],

      facts: {
        how: 'Patch, cream or capsule, depending on which hormones you are prescribed',
        timing: 'Follow your label. Progesterone capsules are taken at night, ' +
                'creams are applied at the same time each day, and a patch is ' +
                'changed on its scheduled day or days rather than applied daily.',
        schedule: 'As stated on your prescription label'
      },

      what: [
        'Hormone therapy replaces hormones your body has stopped making in the ' +
        'amounts it used to. Around menopause, estrogen and progesterone fall, ' +
        'and testosterone falls too. That decline is what causes hot flashes, ' +
        'night sweats, disturbed sleep, vaginal dryness, low mood and the ' +
        'difficulty concentrating many women describe as brain fog.',

        'The hormones KORB prescribes are bioidentical, meaning they are ' +
        'structurally the same as the ones your body makes. You may be ' +
        'prescribed one, two or three of them, and they are counted that way ' +
        'when your program is priced.',

        'Most of them are absorbed through the skin rather than swallowed. That ' +
        'matters: going through the skin skips the first trip through your ' +
        'liver, which is why a patch or cream carries a lower risk of blood ' +
        'clots than an oral estrogen does.'
      ],

      /* What to expect, added 2026-09-22 so every medication guide has one. Every
         line is a fact KORB already states in korb-womens-data.js or on this page. */
      timeline: [
        ['Before you start', 'Clinical review', 'Your provider reviews your health history to confirm hormone therapy is appropriate for you.'],
        ['First few weeks', 'Settling in', 'Some side effects, such as breast tenderness, are common early and often settle. Tell us if they do not.'],
        ['Every 12 weeks', 'Follow-up', 'Your prescriptions run 12 weeks. At each follow-up your provider reviews how you are doing and adjusts your dose or route if needed.']
      ],
      timelineNote: 'Results vary from person to person, and no result is guaranteed.',
      mayHelp: {
        lead: 'Women use hormone therapy for symptoms such as:',
        items: [
          'Hot flashes and night sweats',
          'Sleep that is broken or unrefreshing',
          'Vaginal dryness, or discomfort with intercourse',
          'Low mood, irritability, or mood that swings more than it used to',
          'Difficulty concentrating - brain fog',
          'Low libido, low energy, loss of muscle tone'
        ],
        after: 'Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      extraSections: [
        {
          h: 'The hormones you may be taking',
          table: {
            head: ['Hormone', 'What it is for', 'How you take it'],
            rows: [
              ['Estradiol',
               'The main estrogen. Used for hot flashes, night sweats, sleep and ' +
               'vaginal dryness, and for bone health.',
               'A patch changed once or twice a week depending on which one you ' +
               'are prescribed, or a cream you apply daily.'],
              ['Progesterone',
               'Protects the lining of the uterus, and helps sleep.',
               'A capsule taken at night.'],
              ['Testosterone',
               'Used for libido, energy, mood and muscle. Women make it too, and ' +
               'it falls at menopause.',
               'A cream you apply daily. Available in Texas and California only.']
            ]
          }
        },
        {
          h: 'Why progesterone matters if you still have a uterus',
          callout: 'If you still have a uterus, you will always be prescribed ' +
            'progesterone alongside estrogen. Estrogen on its own thickens the ' +
            'lining of the uterus, and over time that can lead to cancer. ' +
            'Progesterone prevents it. This is not optional and it is not a ' +
            'preference - if you have been prescribed estrogen without ' +
            'progesterone and you have not had a hysterectomy (surgery to remove your uterus), contact us before ' +
            'you start.',
          p: [
            'If you have had a hysterectomy, meaning your uterus was removed, you do not need progesterone. Having your tubes tied, an ablation, or only your ovaries removed does not count. There ' +
            'is no lining to protect, and adding it would not help you.',
            'If you still have regular periods, your progesterone is taken on a ' +
            'cycle - 21 days on, then 7 days off - rather than every night. Your ' +
            'label will tell you which.'
          ]
        },
        {
          h: 'How to apply a cream',
          callout: 'One click (one press of the pump) is one measured dose. Do not guess at it and do ' +
            'not double up if you miss one.',
          table: {
            head: ['Step', 'What to do'],
            rows: [
              ['1', 'Wash your hands.'],
              ['2', 'Apply to thin, hairless skin - the inner thigh, the inner ' +
                    'forearm, or the back of the upper arm.'],
              ['3', 'Rub it in and let it dry completely before you dress or ' +
                    'touch anyone.'],
              ['4', 'Wash your hands again, thoroughly.'],
              ['5', 'Rotate where you apply it. Using the same patch of skin ' +
                    'every day reduces how well it absorbs.']
            ]
          },
          p: [
            'Hormone cream transfers by skin contact. Until it has dried, it can ' +
            'pass to a partner, a child or a pet. Let it dry, and wash your hands.'
          ]
        },
        {
          h: 'How to use a patch',
          /* Same shape as the cream section above - a lead line, a numbered
             table, then the one rule worth pulling out. It was three loose
             paragraphs and read as an afterthought beside the cream steps. */
          /* TWO PRESENTATIONS, NOT ONE. korb-womens-data.js patchGuidance has
             said so since v1.1 on 2026-09-17, when the twice-weekly estradiol
             patch was added at all five strengths: "supplied in TWO
             presentations, ONCE weekly and TWICE weekly... the two differ in
             quantity and in patient instructions." This handout kept saying
             once a week. Don, 2026-09-19.

             The patient-facing consequence is the change day. A woman on the
             twice-weekly patch reading "change it on the SAME day each week"
             wears each patch twice as long as she should. Sourcing and box
             sizes stay in the clinical data; what she needs is which one she
             has and when to change it. */
          p: [
            'There are two estradiol patches and they are not interchangeable. ' +
            'One is changed once a week and the other twice a week. Your ' +
            'prescription label tells you which you were given, and it is worth ' +
            'checking rather than assuming, because the patches themselves look ' +
            'alike. Either way it is worn continuously in between, including in ' +
            'the shower.'
          ],
          table: {
            head: ['Step', 'What to do'],
            rows: [
              ['1', 'Wash your hands.'],
              ['2', 'Apply to clean, dry skin on the lower abdomen or the upper ' +
                    'buttock. Never the breasts, and never on skin that is broken ' +
                    'or irritated.'],
              ['3', 'Press it flat with your palm for about 10 seconds so the ' +
                    'edges seal.'],
              ['4', 'Leave it on until your change day. It is fine to shower, ' +
                    'bathe and swim with it on.'],
              ['5', 'Change it on your scheduled change day, and put the new one ' +
                    'on a slightly different spot. Keep the same day every week ' +
                    'on the once-weekly patch, or the same two days every week ' +
                    'on the twice-weekly one, for example every Sunday and ' +
                    'Wednesday.']
            ]
          },
          callout: 'If a patch falls off, put a new one on straight away and stay ' +
            'on your usual change schedule. Do not wait for your next change ' +
            'day, and do not double up.'
        }
      ],

      storage: {
        cards: [
          ['Patches and capsules', 'Room temperature, 68°F – 77°F (20°C – 25°C). No refrigeration.'],
          ['Compounded creams', 'Follow the instructions that came with your cream. Some compounding pharmacies ship them cold and ask you to keep them refrigerated; others do not. Your pharmacy label is the answer.'],
          ['Keep the cap on the pump', 'And store creams upright'],
          ['Out of reach', 'Of children, and of anyone else in the house']
        ],
        notes: [
          'Your program runs in 12-week blocks, but the amount dispensed at one ' +
          'time varies by product and by pharmacy - anywhere from about 4 weeks to ' +
          '12. Some creams are sent a month at a time with refills. Go by what your ' +
          'label and your pharmacy tell you rather than by the calendar.',
          'If medication is left over when your next supply arrives, start the new ' +
          'one rather than finishing the old.'
        ]
      },

      travel: 'Hormone therapy travels easily. Keep everything in your carry-on ' +
        'rather than a checked bag, and leave it in its original labeled container. ' +
        'Patches and capsules need no cold storage at all; if your cream came ' +
        'with instructions to keep it refrigerated, take a small insulated bag. ' +
        'If you are crossing time ' +
        'zones, keep your patch change day or days and your nightly capsule on your ' +
        'home ' +
        'schedule until you are settled.',

      common: [
        ['Breast tenderness or swelling',
         'May occur in the first few weeks. Tell us if it does not settle - it often ' +
         'responds to a small change in dose.'],
        ['Headache',
         'Usually early and short-lived. Tell us if it is new for you or persistent.'],
        ['Bloating or fluid retention',
         'May occur early. Reducing salt and keeping hydrated helps.'],
        ['Mood changes',
         'Tell us. Mood is one of the things dose adjustment tends to fix.'],
        ['Nausea',
         'More common with capsules. Taking it with a little food at night helps.'],
        ['Spotting, or a change in your bleeding',
         'Expected in the first months, especially if you are cycling ' +
         'progesterone. Tell us at your visit, and sooner if it is heavy.'],
        ['Acne, or more hair growth on the face or body',
         'Usually testosterone. Tell us - the dose can come down.']
      ],
      monitorAndTell: [
        ['Bleeding that is new, heavy, or after you had stopped altogether',
         'Always tell us. It needs looking at rather than waiting for your visit.'],
        ['A lump in the breast, or breast pain that does not settle',
         'Tell us, and book with your primary care provider or your gynecologist. ' +
         'KORB is a telemedicine practice and cannot examine or image you - a ' +
         'breast lump needs someone in the room.'],
        ['Mood that is getting worse rather than better',
         'Tell us. Do not wait out a low mood on the assumption it will pass.'],
        ['Headaches that are new or unusual for you',
         'Tell us before your next dose.'],
        ['A change in your voice, or hair growth you are unhappy with',
         'Tell us early. Voice changes do not reverse, so we would rather hear ' +
         'about it at the first sign.'],
        ['No improvement at all after 12 weeks',
         'Tell us at your visit. It usually means the dose or the route needs ' +
         'changing, not that hormone therapy will not work for you.']
      ],
      labs: {
        lead: 'KORB uses at-home saliva collection rather than a blood draw for ' +
              'hormone levels.',
        items: [
          'A kit is mailed to you. You collect the sample at home and mail it ' +
          'back in the prepaid envelope provided.',
          'Saliva is used deliberately. It measures the fraction of the hormone ' +
          'that is actually reaching your tissues, which is what matters when ' +
          'the hormone is going through your skin. A blood level barely moves ' +
          'after a cream, so it would tell your provider very little.',
          'The complete version of the kit adds a small finger-prick blood spot for thyroid, ' +
          'because thyroid problems cause many of the same symptoms and are ' +
          'worth ruling out.'
        ]
      },

      safety: [
        'Tell your provider before you start if you have had breast cancer, ' +
        'endometrial cancer (cancer of the lining of the uterus), or any cancer that was sensitive to estrogen.',
        'Tell your provider if you have had a blood clot or a clotting disorder, ' +
        'or if a close relative has.',
        'Tell your provider if you have had a stroke or a heart attack, or if ' +
        'your blood pressure is not controlled.',
        'Tell your provider if you have liver disease.',
        'Tell your provider about any vaginal bleeding that has not been explained.',
        'Tell us if you have a **peanut allergy**. The factory-made, brand-name progesterone ' +
        'capsule is made with peanut oil. A compounded capsule is not, and we ' +
        'will prescribe that one instead - so this does not stop you having ' +
        'progesterone.',
        'If you still have a uterus, never take estrogen without progesterone.',
        'Do not change your own dose, and do not use anyone else\'s hormones.'
      ],
      /* The list this lead introduced never existed, so the page printed "any of
         these:" over nothing. Found 2026-09-22. The standard estrogen warning signs:
         clot, stroke, heart attack, severe allergic reaction. For Don to confirm. */
      emergencyLead: 'Call 911 or go to an emergency room if you have chest pain, sudden shortness of breath, pain or swelling in one leg, a sudden severe headache, sudden changes in your vision, weakness or numbness on one side of your body, trouble speaking, or swelling of your face, lips or throat. These can be signs of a blood clot, a stroke or a severe allergic reaction.',

      keyReminders: [
        'If you have a uterus, never take estrogen without progesterone.',
        'Let creams dry fully before contact with anyone else, and wash your hands.',
        'Progesterone is taken at night, because it can make you drowsy.',
        'Your prescriptions run 12 weeks, and your follow-up is at 12 weeks.',
        'Do not change your own dose. Tell us what you are feeling and we will ' +
        'change it with you.',
        'Patches and capsules need no refrigeration. For creams, follow the ' +
        'instructions that came with them.',
        'KORB also offers sexual health treatment. If low libido or arousal is ' +
        'something you would like addressed, tell your provider - there are ' +
        'options beyond hormone therapy.'
      ]
    },


    sermorelin: {
      key: 'sermorelin',
      file: 'KORB_Patient_Ed_Sermorelin',   /* the PUBLISHED name. Deriving it from the title
                                  invented KORB_Patient_Ed_CJC_1295_Ipamorelin and would
                                  have left the old file beside the new one. */
      title: 'Sermorelin Guide',
      agentKey: 'sermorelin',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      washoutWeeks: 4,

      what: [
        'Sermorelin is a lab-made copy of the natural signal your brain uses to release ' +
        'growth hormone. It acts on the pituitary gland, a small gland at the base of the ' +
        'brain that controls many of your hormones.',
        'Sermorelin does not replace growth hormone. It prompts your own pituitary gland ' +
        'to make and release more of it, working through your body’s own system rather ' +
        'than adding growth hormone from outside.',
        'When your body releases growth hormone, your liver makes IGF-1, a blood marker ' +
        'that shows how much growth hormone your body is making. Your IGF-1 level is one ' +
        'of the main things your provider checks throughout your program.'
      ],

      mayHelp: {
        lead: 'Patients use Sermorelin for goals such as:',
        items: [
          'Sleep quality',
          'Recovery after exercise',
          'Body composition (your balance of muscle and fat), as part of an exercise and nutrition plan',
          'Energy and general wellness'
        ],
        after: 'Sermorelin is not FDA-approved for these uses, and the research for them is still limited. Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      timingNotes: [
        ['Timing matters',
         'Sermorelin should be injected at bedtime, on an empty stomach. Growth hormone is ' +
         'released naturally in pulses during sleep, particularly during the first ' +
         'few hours of deep sleep, and injecting at bedtime aligns with that rhythm. ' +
         'Food, particularly carbohydrates, can blunt growth hormone release. Wait at least two ' +
         'hours after your last meal before injecting.'],
        ['The rest day is intentional',
         'Do not inject on your rest day, and do not make up a missed dose on it. If ' +
         'you miss a dose on a scheduled day, skip it rather than doubling up the ' +
         'next day.']
      ],

      timeline: [
        ['Weeks 1–4', 'Starting out',
         'Some patients notice early changes in sleep quality or morning energy.'],
        ['Weeks 4–8', 'Early response',
         'Many notice nothing yet. This is normal.'],
        ['Weeks 8–12', 'Later in your cycle',
         'Some patients report changes in sleep, recovery or energy by this point, and others do not. Do not adjust your schedule.'],
        ['Weeks 13–16', 'Break — labs and lifestyle',
         'No injections; this is intentional. Your labs, drawn between weeks 12 and 14, ' +
         'are reviewed during this window, and it is a good stretch to focus on ' +
         'nutrition, exercise and sleep before your next cycle. Do not restart early ' +
         'unless your provider tells you to.']
      ],
      timelineNote:
        'Do not compare your response to others. Response is highly individual. Age, ' +
        'baseline growth hormone levels, body composition, sleep quality and lifestyle habits all ' +
        'influence it.',

      common: [
        ['Injection site redness or irritation',
         'May occur, and is usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Flushing or warmth after injection', 'Typically brief, and usually settles within minutes.'],
        ['Headache', 'May occur early in therapy. Usually mild and short-lived.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Water retention or puffiness',
         'Can occur with growth hormone stimulation. Tell your KORB provider if noticeable.'],
        ['Joint discomfort or tingling',
         'May indicate a dose adjustment is needed. Tell your KORB provider.'],
        ['Sleep changes',
         'Some patients report changes in sleep, and occasionally sleep is disrupted early on.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. ' +
              'Baseline labs are required before you start: no prescription is sent ' +
              'until your baseline results are back and your provider has reviewed ' +
              'them. After that the draw is repeated in every 16-week cycle, between ' +
              'weeks 12 and 14, so results are ready for your follow-up visit.',
        items: [
          'IGF-1, the main blood test that shows how you are responding. The goal is the normal healthy range, and higher is not better.',
          'HbA1c and fasting glucose (blood sugar tests), because raising growth hormone can raise blood sugar.',
          'Thyroid tests (TSH, free T4, free T3). Sermorelin needs your thyroid to be working normally.',
          'CBC (blood counts), CMP (kidney, liver and blood salts), lipid panel (cholesterol), copper, zinc and ceruloplasmin (the protein that carries copper in your blood), at baseline and every 16-week follow-up.',
          'PSA (a prostate blood test), added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use Sermorelin only as prescribed. Do not change your dose, schedule, or how you take it, unless your provider tells you to.',
        'Do not use any other growth hormone product at the same time, including HGH injections or peptides from another source, unless KORB specifically tells you to.',
        'Sermorelin is not appropriate if you have cancer now or are being treated for it, if you have thyroid disease that is not under control, or if you are pregnant.',
        'Do not restart after your off weeks early. The break is intentional.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Sermorelin stimulates your own growth hormone. It is not growth hormone replacement.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Your break from injections is intentional. Do not restart early.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Response varies, and more is not better. Do not adjust your dose unless your provider tells you to.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    tesamorelin: {
      key: 'tesamorelin',
      file: 'KORB_Patient_Ed_Tesamorelin',   /* the PUBLISHED name. Deriving it from the title
                                  invented KORB_Patient_Ed_CJC_1295_Ipamorelin and would
                                  have left the old file beside the new one. */
      title: 'Tesamorelin Guide',
      agentKey: 'tesamorelin1mg',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      washoutWeeks: 4,

      what: [
        'Tesamorelin is a lab-made copy of the natural signal your brain uses to release ' +
        'growth hormone. It prompts the pituitary gland, a small gland at the base of the ' +
        'brain that controls many of your hormones, to release more of your own growth ' +
        'hormone. It does not replace growth hormone.',
        'Tesamorelin has been studied in people more than the other peptides in the ' +
        'Functional Health & Longevity Program. The FDA has approved it for one use: ' +
        'reducing extra belly fat in people with HIV. KORB uses it for a purpose the FDA ' +
        'has not approved, which is reducing the fat stored around the organs.',
        'Your provider selects your dose based on your goals, labs and health history. ' +
        'Your IGF-1, a blood marker that shows how much growth hormone your body is making, ' +
        'and your blood sugar are reviewed at every 16-week follow-up visit.'
      ],

      mayHelp: {
        lead: 'Patients use Tesamorelin for goals such as:',
        items: [
          'Belly fat, the fat stored around the organs',
          'Body composition (your balance of muscle and fat), as part of an exercise and nutrition plan'
        ],
        after: 'Tesamorelin is not FDA-approved for these uses, and the research for them is still limited. Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      timingNotes: [
        ['Timing matters',
         'Tesamorelin should be injected at bedtime, on an empty stomach. Growth hormone is released ' +
         'naturally in pulses during sleep, particularly during the first few hours of ' +
         'deep sleep, and injecting at bedtime aligns with that rhythm. Food, ' +
         'particularly carbohydrates, can blunt growth hormone release. Wait at least two hours ' +
         'after your last meal before injecting.'],
        ['Your dose is chosen for you',
         'Your specific dose and strength are decisions your KORB provider makes based ' +
         'on your goals, labs and health history. They are not something to choose or ' +
         'change yourself. Your dose is compounded specifically for you, so always ' +
         'follow the exact units on your prescription label, or your provider\u2019s ' +
         'direction if your label does not list exact units.'],
        ['The rest day is intentional',
         'Do not inject on your rest day, and do not make up a missed dose on it. If ' +
         'you miss a dose on a scheduled day, skip it rather than doubling up the next day.']
      ],

      timeline: [
        ['Weeks 1\u20134', 'Starting out',
         'Most patients notice little at first. Some report changes in energy or sleep.'],
        ['Weeks 4\u20138', 'Active course', 'Changes, if any, begin emerging over time.'],
        ['Weeks 8\u201312', 'Later in your cycle',
         'Your provider will review your IGF-1 and blood sugar at your follow-up visit.'],
        ['Weeks 13\u201316', 'Break \u2014 labs and lifestyle',
         'No injections; this is intentional. Your labs, drawn between weeks 12 and 14, ' +
         'are reviewed during this window, and it is a good stretch to focus on ' +
         'nutrition, exercise and sleep before your next cycle. Do not restart early ' +
         'unless your provider tells you to.']
      ],
      timelineNote:
        'Tesamorelin has been studied in people more than the other peptides in this ' +
        'program, and results still vary. Your dose may be assessed and adjusted ' +
        'at your 16-week follow-up visit based on your IGF-1 response, as tolerated and ' +
        'as directed by your KORB provider.',

      common: [
        ['Injection site redness or irritation',
         'May occur, and is usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Flushing or warmth after injection', 'Typically brief, and usually settles within minutes.'],
        ['Headache', 'May occur early in therapy. Usually mild and short-lived.'],
        ['Nausea', 'Occasionally reported. Usually mild, and usually goes away on its own.']
      ],
      monitorAndTell: [
        ['Water retention or puffiness', 'Can occur with growth hormone stimulation. Tell your KORB provider if noticeable.'],
        ['Joint discomfort or tingling', 'May indicate a dose adjustment is needed. Tell your KORB provider.'],
        ['Glucose or HbA1c changes',
         'Tesamorelin usually does not raise blood sugar, but it is still checked. Tell ' +
         'your KORB provider if you notice changes.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. ' +
              'Baseline labs are required before you start: no prescription is sent ' +
              'until your baseline results are back and your provider has reviewed ' +
              'them. After that the draw is repeated in every 16-week cycle, between ' +
              'weeks 12 and 14, so results are ready for your follow-up visit.',
        items: [
          'IGF-1, the main blood test that shows how you are responding. The goal is the normal healthy range, and higher is not better.',
          'HbA1c and fasting glucose (blood sugar tests). Tesamorelin usually does not raise blood sugar, but it is checked throughout.',
          'CBC (blood counts), CMP (kidney, liver and blood salts), lipid panel (cholesterol), TSH, free T4, free T3 (thyroid tests), copper, zinc and ceruloplasmin (the protein that carries copper in your blood), at baseline and every 16-week follow-up.',
          'PSA (a prostate blood test), added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use Tesamorelin only as prescribed. Do not change your dose, schedule, or how you take it, unless your provider tells you to.',
        'Do not use any other growth hormone product at the same time, including HGH injections or peptides from another source, unless KORB specifically tells you to.',
        'Tesamorelin requires careful provider oversight if you have uncontrolled diabetes.',
        'Do not restart after your off weeks early. The break is intentional.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Tesamorelin stimulates your own growth hormone. It is not growth hormone replacement.',
        'Always follow your prescription label for your exact dose and units.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Your break from injections is intentional. Do not restart early.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    cjc_ipamorelin: {
      key: 'cjc_ipamorelin',
      file: 'KORB_Patient_Ed_CJC_Ipamorelin',   /* the PUBLISHED name. Deriving it from the title
                                  invented KORB_Patient_Ed_CJC_1295_Ipamorelin and would
                                  have left the old file beside the new one. */
      title: 'CJC-1295 / Ipamorelin Guide',
      agentKey: 'cjcipam',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      washoutWeeks: 4,

      what: [
        'CJC-1295 / Ipamorelin is a combination of two lab-made peptides that prompt your ' +
        'body to release growth hormone. CJC-1295 makes the signal last longer, and ' +
        'Ipamorelin triggers the release from the pituitary gland, a small gland at the ' +
        'base of the brain that controls many of your hormones. Together they release ' +
        'growth hormone in natural bursts, for longer.',
        'Like Sermorelin, this combination works through your body\u2019s own system. ' +
        'It does not replace growth hormone.',
        'Your IGF-1 level, a blood marker that shows how much growth hormone your body is ' +
        'making, is one of the main things your provider checks throughout your program.'
      ],

      mayHelp: {
        lead: 'Patients use CJC-1295 / Ipamorelin for goals such as:',
        items: [
          'Body composition (your balance of muscle and fat), as part of an exercise and nutrition plan',
          'Sleep quality',
          'Recovery after exercise',
          'General wellness'
        ],
        after: 'CJC-1295 / Ipamorelin is not FDA-approved for these uses, and the research for them is still limited. Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      timingNotes: [
        ['Timing matters',
         'Inject at bedtime on an empty stomach. Growth hormone is released naturally during sleep, ' +
         'and food, particularly carbohydrates, can blunt that release. Wait at least ' +
         'two hours after your last meal.'],
        ['Your dose is compounded for you',
         'Always follow the units and schedule on your prescription label. Do not ' +
         'estimate a dose or adjust it based on a prior fill.'],
        ['The rest day is intentional',
         'Do not inject on your rest day, and do not make up a missed dose on it. If ' +
         'you miss a dose on a scheduled day, skip it rather than doubling up the next day.']
      ],

      timeline: [
        ['Weeks 1\u20134', 'Starting out',
         'Some patients report changes in sleep or morning energy, and many notice nothing yet.'],
        ['Weeks 4\u20138', 'Early response', 'Many notice nothing yet. This is normal.'],
        ['Weeks 8\u201312', 'Later in your cycle',
         'Sleep, recovery and body composition changes may begin to emerge. Do not adjust your schedule.'],
        ['Weeks 13\u201316', 'Break \u2014 labs and lifestyle',
         'No injections; this is intentional. Your labs, drawn between weeks 12 and 14, ' +
         'are reviewed during this window, and it is a good stretch to focus on ' +
         'nutrition, exercise and sleep before your next cycle. Do not restart early ' +
         'unless your provider tells you to.']
      ],
      timelineNote:
        'Do not compare your response to others. Response is highly individual and ' +
        'influenced by age, baseline growth hormone levels, body composition, sleep quality and ' +
        'lifestyle habits.',

      common: [
        ['Injection site redness or irritation',
         'May occur, and is usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Flushing or warmth after injection', 'Typically brief, and usually settles within minutes.'],
        ['Headache', 'May occur early in therapy. Usually mild and short-lived.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Water retention or puffiness', 'Can occur with growth hormone stimulation. Tell your KORB provider if noticeable.'],
        ['Joint discomfort or tingling', 'May indicate a dose adjustment is needed. Tell your KORB provider.'],
        ['Glucose changes', 'growth hormone stimulation can affect blood sugar. Tell your KORB provider if you notice changes.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. ' +
              'Baseline labs are required before you start: no prescription is sent ' +
              'until your baseline results are back and your provider has reviewed ' +
              'them. After that the draw is repeated in every 16-week cycle, between ' +
              'weeks 12 and 14, so results are ready for your follow-up visit.',
        items: [
          'IGF-1, the main blood test that shows how you are responding. The goal is the normal healthy range, and higher is not better.',
          'HbA1c and fasting glucose (blood sugar tests), because raising growth hormone can raise blood sugar.',
          'Thyroid tests (TSH, free T4, free T3). Your thyroid needs to be working normally for this medication to work as intended.',
          'CBC (blood counts), CMP (kidney, liver and blood salts) and lipid panel (cholesterol), at baseline and every 16-week follow-up.',
          'PSA (a prostate blood test), added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use CJC-1295 / Ipamorelin only as prescribed. Do not change your dose, schedule, or how you take it, unless your provider tells you to.',
        'Do not use any other growth hormone product at the same time, including HGH injections or peptides from another source, unless KORB specifically tells you to.',
        'CJC-1295 / Ipamorelin is not appropriate if you have cancer now or are being treated for it, if you have thyroid disease that is not under control, or if you are pregnant.',
        'Do not restart after your off weeks early. The break is intentional.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'CJC-1295 / Ipamorelin stimulates your own growth hormone. It is not growth hormone replacement.',
        'Always follow your prescription label for your exact dose and units.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Your break from injections is intentional. Do not restart early.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    bpc157: {
      key: 'bpc157',
      file: 'KORB_Patient_Ed_BPC157',
      title: 'BPC-157 Guide',
      agentKey: 'bpc157',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      /* Two windows, each read from its own field on the agent record. One
         "active weeks" row cannot say that Foundation runs 1-8 and Gateway and
         Peak run 3-8, and the PDF this replaces spelled both out in prose. */
      weeksRows: [
        ['Foundation \u2014 active weeks', 'onWeeksFoundation'],
        ['Gateway / Peak \u2014 active weeks', 'onWeeksGatewayPeakBase']
      ],
      weeksNote: 'Foundation, Gateway and Peak are the three Functional Health & Longevity program options, and your provider confirmed which one you are on. On Gateway and Peak the course starts two weeks after your ' +
                 'start date, which is why it begins later and runs shorter.',

      what: [
        'BPC-157 is a synthetic peptide derived from a protein found naturally in the ' +
        'stomach lining. Its full name is Body Protection Compound 157. It is being ' +
        'studied for recovery of soft tissue such as muscles, tendons and ligaments, and for joint ' +
        'and gut health.'
      ],

      mayHelp: {
        lead: 'Patients use BPC-157 for goals such as:',
        items: [
          'Recovery of tendons, ligaments and other soft tissue',
          'Recovery during rehabilitation, and getting back to activity',
          'Gut health, discussed with your provider'
        ],
        after: 'BPC-157 is not FDA-approved for these uses, and the research for them is still limited. Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      timingNotes: [
        ['If you miss a dose',
         'If you miss a dose on a scheduled day, skip it. Do not double up the next day.']
      ],

      timeline: [
        ['Weeks 1\u20132', 'Getting started',
         'Noticing nothing at first is common. Continue your schedule.'],
        ['Active course', 'Foundation 8 weeks; Gateway and Peak 6 weeks',
         'Recovery quality may begin to shift. Individual response varies from patient to patient.'],
        ['Off weeks', 'Break \u2014 labs and lifestyle',
         'No injections during this window; this is intentional. Your labs, drawn between ' +
         'weeks 12 and 14, are reviewed during this time, and it is a good stretch to focus ' +
         'on nutrition, exercise and sleep before your next course.']
      ],
      timelineNote:
        'Your provider will assess whether therapy is appropriate to continue based on ' +
        'your response, any side effects, and your goals.',

      common: [
        ['Injection site redness or irritation',
         'May occur, and is usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Nausea or stomach upset', 'Occasionally reported. Usually mild, and usually goes away on its own. Tell your KORB provider if it persists.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Unusual pain or swelling at the injection site',
         'Could indicate infection. If redness spreads or a fever develops, go to urgent care or the ER the same day - this needs examining. Let KORB know afterwards so it reaches your provider.'],
        ['A rash or hives away from the injection site',
         'Can be an allergic reaction. Go to urgent care or the ER the same day to be evaluated, and seek emergency care immediately if you have any trouble breathing or swelling of the face, lips, tongue or throat. Let KORB know afterwards so it reaches your provider.'],
        ['Any unexplained symptom that affects your whole body, such as fever or feeling generally unwell',
         'Tell your KORB provider, and do not continue without guidance. If you feel very unwell, go to urgent care or the ER rather than waiting for a reply.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. ' +
              'Baseline labs are required before you start: no prescription is sent ' +
              'until your baseline results are back and your provider has reviewed ' +
              'them. After that the draw is repeated in every 16-week cycle, between ' +
              'weeks 12 and 14, so results are ready for your follow-up visit.',
        items: [
          'Standard longevity panel: CBC (blood counts), CMP (kidney, liver and blood salts), lipid panel (cholesterol), HbA1c (3-month blood sugar average), fasting glucose, fasting ' +
          'insulin, IGF-1, TSH, free T4, free T3 (thyroid tests), copper, zinc and ceruloplasmin (the protein that carries copper in your blood), at ' +
          'baseline and every 16-week follow-up.',
          'PSA (a prostate blood test), added for men aged 45 and older at every draw.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use BPC-157 only as prescribed. Do not change your dose, course length or schedule unless your provider tells you to.',
        'BPC-157 is not appropriate if you have cancer now or are being treated for it, or if you are pregnant.',
        'Do not restart the course early after your off weeks unless your provider tells you to.',
        'Tell your KORB provider if you develop a new medical condition or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'BPC-157 is taken every day, including weekends, for the length of your course.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Labs between weeks 12 and 14 are required before your 16-week follow-up visit.',
        'Do not restart your course early after the off weeks.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    ghkcu: {
      key: 'ghkcu',
      file: 'KORB_Patient_Ed_GHK_Cu',
      title: 'GHK-Cu Guide',
      agentKey: 'ghkcu',
      program: 'Functional Health & Longevity',
      cycleWeeks: 16,
      weeksRows: [
        ['Gateway / Peak add-on \u2014 active weeks', 'onWeeksOptionalAddon']
      ],
      weeksNote: 'Gateway and Peak are two of the three Functional Health & Longevity program options, and your provider confirmed which one you are on. GHK-Cu is an optional add-on on both. It begins two weeks after you start ' +
                 'BPC-157 and runs for four weeks.',

      what: [
        'GHK-Cu is a copper-binding peptide that occurs naturally in the human body. It ' +
        'is found in blood plasma, saliva and urine, and its levels decline with age. It ' +
        'is being studied for skin and tissue health.',
        'GHK-Cu contains copper as part of its structure. Copper, zinc and ceruloplasmin (the protein that carries copper in your blood) ' +
        'are part of your standard lab panel, and your provider will pay particular ' +
        'attention to these results while you are on GHK-Cu.'
      ],

      mayHelp: {
        lead: 'Patients use GHK-Cu for goals such as:',
        items: [
          'Skin quality',
          'Recovery'
        ],
        after: 'GHK-Cu is not FDA-approved for these uses, and the research for them is still limited. Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      timingNotes: [
        ['Choosing your three days',
         'Choose three consistent days each week, for example Monday, Wednesday and ' +
         'Friday, and keep the same days each week to build a reliable routine.'],
        ['Copper, zinc and ceruloplasmin are watched closely',
         'These are part of your standard lab panel. While you are on GHK-Cu your ' +
         'provider reviews them closely at baseline and at each follow-up visit, and ' +
         'therapy may be discontinued if copper or ceruloplasmin levels trend upward.'],
        ['If you miss a dose',
         'If you miss a dose on a scheduled day, skip it. Do not double up the next day.']
      ],

      timeline: [
        ['First 2 weeks', 'Active course begins',
         'Most patients notice nothing at first. This is normal.'],
        ['Weeks 3\u20134', 'Active course continues',
         'Skin quality or tissue changes may begin to emerge. Individual response varies.'],
        ['After your course', 'Break \u2014 labs and lifestyle',
         'No GHK-Cu injections. Your copper, zinc and ceruloplasmin results will be ' +
         'reviewed at your 16-week follow-up visit, and this is a good window to focus ' +
         'on nutrition, exercise and sleep before your next course.']
      ],
      timelineNote:
        'Your provider will review copper, zinc and ceruloplasmin closely at baseline and ' +
        'at your follow-up visit while GHK-Cu is active. Therapy may be discontinued if ' +
        'copper or ceruloplasmin levels rise.',

      common: [
        ['Injection site redness or irritation',
         'May occur, and is usually mild. Rotate injection sites. Tell your KORB provider if it persists.'],
        ['Mild skin changes at the injection site',
         'Occasional mild discoloration or sensitivity. Usually goes away on its own.'],
        ['Fatigue', 'Uncommon. Tell your KORB provider if it persists.']
      ],
      monitorAndTell: [
        ['Copper or ceruloplasmin trending up on labs',
         'Your provider will review this at your follow-up visit. Therapy may be discontinued if levels rise.'],
        ['Unusual rash, hives or skin reaction',
         'Copper-containing compounds can occasionally cause an allergic reaction. Go to urgent care or the ER the same day to be evaluated, and seek emergency care immediately if you have any trouble breathing or swelling of the face, lips, tongue or throat. Let KORB know afterwards so it reaches your provider.'],
        ['Any symptom that affects your whole body, such as fever or feeling generally unwell',
         'Tell your KORB provider, and do not continue until your provider says so. If you feel very unwell, go to urgent care or the ER rather than waiting for a reply.']
      ],

      labs: {
        lead: 'Lab monitoring is a required part of your program, not optional. ' +
              'Baseline labs are required before you start: no prescription is sent ' +
              'until your baseline results are back and your provider has reviewed ' +
              'them. After that the draw is repeated in every 16-week cycle, between ' +
              'weeks 12 and 14, so results are ready for your follow-up visit.',
        items: [
          'Standard longevity panel: CBC (blood counts), CMP (kidney, liver and blood salts), lipid panel (cholesterol), HbA1c (3-month blood sugar average), fasting glucose, fasting ' +
          'insulin, IGF-1, TSH, free T4, free T3 (thyroid tests), copper, zinc and ceruloplasmin (the protein that carries copper in your blood), at ' +
          'baseline and every 16-week follow-up.',
          'PSA (a prostate blood test), added for men aged 45 and older at every draw.',
          'Copper, zinc and ceruloplasmin get particular attention while you are on ' +
          'GHK-Cu, and therapy may be discontinued if copper or ceruloplasmin trend upward.'
        ],
        after: 'Your lab draw should be completed between weeks 12 and 14 of your active ' +
               'cycle, so results are back in time for your 16-week follow-up visit. Some ' +
               'results, such as IGF-1, can take about a week. Unless your lab order says ' +
               'otherwise, plan to fast overnight and have blood drawn first thing in the morning.'
      },

      safety: [
        'Use GHK-Cu only as prescribed. Do not change your dose, schedule or course length unless your provider tells you to.',
        'Never use GHK-Cu if you have Wilson\u2019s disease, a condition where the body cannot clear copper.',
        'Copper, zinc and ceruloplasmin are part of your standard labs. Do not skip your scheduled draw between weeks 12 and 14.',
        'Tell your KORB provider if you develop a new medical condition or become pregnant.'
      ],

      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'GHK-Cu is taken three times a week in the evening, on consistent days.',
        'Never use it if you have Wilson\u2019s disease.',
        'Copper, zinc and ceruloplasmin are watched closely and may end therapy if they rise.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    semaglutide: {
      key: 'semaglutide',
      file: 'KORB_Patient_Ed_Semaglutide',
      title: 'Semaglutide Guide',
      source: 'glp1',
      productKey: 'premier_sema',
      program: 'Weight Loss & Metabolic Health',
      howText: 'Subcutaneous (SQ) injection \u2014 fatty tissue under the skin ' +
               '(abdomen, thigh, or back of the arm)',
      timingText: 'Same day each week, with or without food',

      what: [
        'Semaglutide belongs to a group of medications called GLP-1s. It copies a ' +
        'natural gut hormone that slows digestion, reduces appetite and helps you feel ' +
        'fuller longer after eating.',
        'Your semaglutide treatment is prepared by a licensed U.S. compounding pharmacy, ' +
        'which prepares each prescription to your provider\u2019s specifications rather than ' +
        'mass-producing it. Because the FDA reviews mass-manufactured products rather than ' +
        'individual prescriptions, compounded preparations are not FDA-approved. The active ' +
        'ingredient is the same one used in the brand-name medication, which is approved for ' +
        'weight management, for type 2 diabetes, and for reducing the risk of death from heart ' +
        'disease, heart attack and stroke in adults with heart disease who are ' +
        'overweight or obese. At KORB your provider prescribes a compounded formulation that ' +
        'includes a small amount of cyanocobalamin (vitamin B-12) to help your body handle it.'
      ],

      mayHelp: {
        lead: 'Patients use Semaglutide for goals such as:',
        items: [
          'Weight loss',
          'Appetite and portion control',
          'Energy and everyday activity',
          'Sleep'
        ],
        after: 'Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      nutrition: {
        lead: 'While you take Semaglutide, these habits can reduce the chance ' +
              'of digestive side effects. They are general guidance rather than a meal plan. ' +
              'If you want a plan built around your own needs, a registered dietitian is the ' +
              'right person to see, and your provider can talk through whether that would help you.',
        items: [
          'Prioritize protein at each meal. It helps preserve muscle while you lose weight. [Use the Protein Target Calculator](https://korb-health.github.io/korb-patient-tools/KORB_Patient_Hub.html#protein-calculator) on the Patient Hub to find your daily target.',
          'Eat slowly and stop when you feel satisfied rather than full. Semaglutide slows ' +
          'digestion, so it takes longer to feel full and it is easy to overeat before your ' +
          'body catches up.',
          'Eat smaller, more frequent meals if large meals feel uncomfortable.',
          'Avoid greasy, fried or very high-fat foods. These commonly worsen nausea.',
          'Drink regularly through the day. How much is below, under How much to drink.',
          'Limit alcohol, which can worsen nausea and interferes with steady progress.',
          'Stay physically active as you are able. Movement helps you keep muscle.',
          'Prioritize consistent sleep. Poor sleep can make hunger harder to manage.'
        ]
      },
      extraSections: [
        {
          /* Don, 2026-09-22, after Kris Mulkey asked for a reference point. From
             the National Academies adequate intake for total water, about 80% of
             which comes from drinks. A per-sex number, spread through the day. */
          lifestyle: true,
          h: 'How much to drink',
          p: [
            'Aim for about 72 ounces (9 cups) of fluid a day if you are a woman, and about 96 ounces (12 cups) if you are a man. Water, milk, tea and coffee all count. You normally get some water from food as well, and because you are eating less on Semaglutide, drinking enough matters more.',
            'Drink more in hot weather, when you exercise, and if you have vomiting or diarrhea. Pale yellow urine is a good sign you are drinking enough.'
          ],
          table: {
            head: ['When', 'Women', 'Men'],
            rows: [
              ['Waking to lunch', '32 oz (4 cups)', '40 oz (5 cups)'],
              ['Lunch to dinner', '24 oz (3 cups)', '40 oz (5 cups)'],
              ['Dinner to early evening', '16 oz (2 cups)', '16 oz (2 cups)'],
              ['Daily total', 'About 72 oz (9 cups)', 'About 96 oz (12 cups)']
            ]
          },
          callout: '**If you have been told to limit fluids for a heart or kidney condition, follow that advice instead.** Contact your provider if you have dark urine, feel dizzy when you stand, or cannot keep fluids down. On Semaglutide, dehydration can affect your kidneys.'
        }
      ],
      timingNotes: [
        ['Already taking a GLP-1?',
         'If you are transferring to KORB from another provider and want to continue at your ' +
         'current dose rather than start again at the lowest dose, we need documentation ' +
         'of the dose you are on: a pharmacy record, a prescription label, or a note from your ' +
         'prescriber. This is required before we can start you above the usual starting dose, ' +
         'and it is kept in your chart. Without it your provider will start you at the beginning ' +
         'dose and raise it gradually, which protects you from being started higher than your body has ' +
         'actually tolerated.'],
        ['How your dose goes up',
         'Your provider starts you at a low dose and increases it gradually, based on how you ' +
         'are tolerating the current one. The exact milligram steps and injection volume depend ' +
         'on which pharmacy fills your prescription, because KORB works with more than one ' +
         'compounding pharmacy and each uses a slightly different concentration and step ' +
         'schedule. Your prescription label always reflects your correct dose and volume for ' +
         'your pharmacy. For a quick reference showing injection volume and syringe markings by ' +
         'pharmacy and dose, [open My GLP-1 Dose & Injection Guide](https://korb-health.github.io/korb-patient-tools/KORB_GLP1_Dose_Guide.html) on the Patient Hub.'],
        /* TWO-VIAL DOSES. Added 2026-09-23 with Premier 4.5 mg, where Premier fills
           four weeks as a 3.6 ml and a 2.4 ml vial and the fourth dose is what is
           left in both. Don: providers must tell patients to use the leftovers, and
           this is the patient half of that. Kept pharmacy- and dose-agnostic like
           the rest of this handout; the provider counsels which dose and which vial
           first - see acceptedLimitations PREMIER-SEMA-45-CROSS-VIAL. */
        ['If your dose uses two vials',
         'At some higher doses, one of your weekly doses is made from what is left in two ' +
         'vials. Do not throw a vial away while it still has medication in it and it is ' +
         'less than 28 days since you opened it. Draw what is left in each vial into its own ' +
         'syringe, and inject both to make up your full dose. Your provider will tell you if ' +
         'this applies to your dose and which vial to open first.'],
        ['Do not increase your own dose',
         'Even if you feel ready or your symptoms are mild. Increasing too quickly raises the ' +
         'risk of nausea and other side effects. If a dose is not well tolerated, tell your ' +
         'provider; they may extend that step before increasing further.'],
        /* FIVE DAYS, AND IT IS MEANT TO DIFFER FROM THE OTHER MOLECULE. Checked
           against the labels on DailyMed, 2026-09-19, because Don suspected the
           mismatch with tirzepatide's 4 days was an error. It is not.

             Ozempic    semaglutide   within 5 days after the missed dose
             Wegovy     semaglutide   take it if the next dose is more than 2
                                      days away, which on a weekly schedule is
                                      the same 5-day window counted backwards
             Mounjaro   tirzepatide   within 4 days (96 hours)
             Zepbound   tirzepatide   within 4 days (96 hours)

           Both semaglutide labels say 5, both tirzepatide labels say 4. The
           basis is pharmacokinetic: semaglutide's elimination half-life is about
           1 week, tirzepatide's about 5 days, so semaglutide tolerates a later
           catch-up without stacking onto the next dose. Don's ruling 2026-09-19:
           keep the manufacturer numbers. **Do not harmonise these to one number.** */
        ['If you miss a dose',
         'If it has been less than 5 days since your missed dose, inject as soon as you ' +
         'remember, then resume your normal weekly schedule. If it has been 5 days or more, ' +
         'skip it and take your next dose on your regular day. Do not double up.'],
        /* MISSING SEVERAL WEEKS IS A DIFFERENT QUESTION FROM MISSING ONE, and
           until 2026-09-19 neither handout answered it. A patient who missed
           three weeks read the row above, "skip it and take your next dose on
           your regular day", and resumed at full dose. That is the common route
           to severe nausea and vomiting, and it is far likelier to happen than
           anyone agonising over day 4 against day 5.

           SOURCE. The Wegovy label states it: 2 or more consecutive missed
           injections, reinitiate dose escalation at a lower dosage to reduce GI
           adverse reactions. The Mounjaro and Zepbound labels are silent on it,
           and Ozempic does not address it either, so for tirzepatide this is
           KORB's own instruction on the same tolerance logic rather than a
           quotation. Don's ruling, 2026-09-19: same wording on both, and it
           routes to the provider rather than naming a dose, because the restart
           dose is a clinical decision and the step schedule differs by pharmacy. */
        ['If you miss two or more weeks in a row',
         'Contact KORB before your next injection rather than picking up where you left off. ' +
         'Your body loses its adjustment to the medication during a break, and going straight back to the dose you were on is the ' +
         'most common reason patients get severe nausea and vomiting. Your provider may restart ' +
         'you at a lower dose and build back up. Do not resume on your own.']
      ],
      timeline: [
        ['Starting out', 'First few weeks',
         'Some patients notice their appetite change here, and some notice mild nausea while their body adjusts.'],
        ['Raising your dose', 'Finding your dose',
         'Your dose increases as tolerated, only when your provider tells you to. How quickly you respond depends on your dose and your body.'],
        ['Your working dose', 'Staying on your dose',
         'Your provider adjusts your dose until you reach one that works for you.'],
        ['Ongoing', 'Maintenance',
         'Many patients stay on a steady dose long-term.']
      ],
      timelineNote:
        'Response is highly individual and depends on starting weight, metabolism, diet, ' +
        'activity and other factors, so do not compare yours to anyone else\'s. The ' +
        'medication supports weight loss rather than working on its own: it works best ' +
        'alongside healthy eating and activity, not in place of them.',
      common: [
        ['Nausea, vomiting or diarrhea',
         'May occur, most often after a dose increase. Smaller, lower-fat meals usually help. ' +
         'Tell your provider if it is severe or persistent.'],
        ['Constipation or stomach pain',
         'May occur. Drink enough fluid (see How much to drink) and tell your provider if it does not improve.'],
        ['Low appetite',
         'Expected, and part of how the medication works. Tell your provider if you cannot ' +
         'eat or drink adequately.'],
        ['Injection site redness or irritation', 'Some patients notice this. Usually mild. Rotate injection sites.'],
        ['Headache or dizziness',
         'May occur early on, often from not eating or drinking enough. Usually mild and short-lived.']
      ],
      monitorAndTell: [
        ['Severe or persistent abdominal pain, especially spreading to your back',
         'Can be a sign of pancreatitis (inflammation of the pancreas). Go to urgent care or the ER the same day to be evaluated - KORB is telemedicine and cannot examine you. Let KORB know afterwards so it reaches your provider.'],
        ['Pain in the upper right abdomen, fever, or yellowing of the skin or eyes',
         'Possible gallbladder problem, which needs an examination and imaging. Go to urgent care or the ER the same day. Let KORB know afterwards so it reaches your provider.'],
        ['Unable to keep fluids down for more than 24 hours', 'Go to urgent care or the ER the same day. On this medication, dehydration can affect your kidneys. Let KORB know afterwards so it reaches your provider.']
      ],
      contraPhrasing: {
        'Personal or family history of medullary thyroid carcinoma (MTC)':
          'A personal or family history of medullary thyroid carcinoma (MTC), a rare thyroid cancer',
        'Multiple endocrine neoplasia syndrome type 2 (MEN2)':
          'A personal or family history of multiple endocrine neoplasia syndrome type 2 (MEN2), an inherited condition that causes tumors in hormone glands, including the thyroid',
        'Hypersensitivity to the active drug or any component of the formulation':
          'A known allergy to Semaglutide or to anything else in the formulation',
        'Current pregnancy, breastfeeding, or planning pregnancy':
          'Pregnancy, breastfeeding, or planning a pregnancy',
        'Active gallbladder disease or history of gallbladder-related surgical complications':
          'Active gallbladder disease, or a history of complications from gallbladder surgery',
        'History of pancreatitis (use with caution)':
          'A history of pancreatitis. This needs discussing with your provider rather than ruling you out automatically',
        'Severe gastrointestinal disorders such as gastroparesis':
          'A severe digestive condition such as gastroparesis, where the stomach empties too slowly',
        'Severe renal impairment (eGFR below 30 mL/min/1.73 m\u00b2)':
          'Severely reduced kidney function. Your provider will explain where your kidney results sit',
        'Uncontrolled diabetic retinopathy (primarily relevant in type 2 diabetes)':
          'Uncontrolled diabetic eye disease (retinopathy), which mainly applies if you have type 2 diabetes'
      },
      /* KORB ORDERS NO LABS FOR GLP-1. Don, 2026-09-19, and the distinction is
         the whole point: this said "routine labs are not required" and then
         offered "if your KORB provider has an individual clinical reason to
         order labs for you". Read together that is a program with no scheduled
         draw but a door left open, and a patient could reasonably expect KORB
         to order bloodwork on request. KORB does not order labs for this
         program at all. Lab work is a conversation with the patient's primary
         care provider. Heading is "Labs" rather than "Lab monitoring" for the
         same reason: nothing here is monitored. */
      labs: {
        heading: 'Labs',
        lead: 'KORB does not order labs for this program.',
        items: [
          'There is no baseline draw and no scheduled draw at any point in your weight loss ' +
          'treatment with KORB.',
          'If you are also managing diabetes or pre-diabetes, continue that care, including ' +
          'any related labs, with the clinician who manages it, whether that is your primary ' +
          'care provider, an endocrinologist (a hormone and diabetes specialist) or another specialist, alongside your KORB visits.',
          'If you want lab work, or another clinician has told you that you need it, that is a ' +
          'conversation to have with your primary care provider. KORB does not order it for you.'
        ],
        after: 'This is deliberate rather than an omission. Some other KORB programs require ' +
               'lab work before and during treatment. The weight loss program does not.'
      },
      safety: [
        'Use Semaglutide only as prescribed. Do not change your dose, schedule, or how you take it, unless your provider tells you to.',
        'Do not use any other weight-loss medication at the same time, including Ozempic, Wegovy, Mounjaro, Zepbound or Rybelsus, or one from another clinic or online seller.',
        'Semaglutide is not appropriate during pregnancy or breastfeeding, or with a personal or family history of MTC or MEN2.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],
      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Changes in appetite and weight, if they come, build over months, not days.',
        'Dose increases happen only when your provider tells you to. Never increase on your own.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Most patients do well when they follow the nutrition guidance above. Tell your provider if nausea is severe or persistent.',
        'KORB does not order labs for this program. Lab work is a conversation with your primary care provider.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    tirzepatide: {
      key: 'tirzepatide',
      file: 'KORB_Patient_Ed_Tirzepatide',
      title: 'Tirzepatide Guide',
      source: 'glp1',
      productKey: 'premier_tirz',
      program: 'Weight Loss & Metabolic Health',
      howText: 'Subcutaneous (SQ) injection \u2014 fatty tissue under the skin ' +
               '(abdomen, thigh, or back of the arm)',
      timingText: 'Same day each week, with or without food',

      what: [
        'Tirzepatide works like two natural gut hormones, called GIP and GLP-1, rather than ' +
        'one. Together they slow digestion and reduce appetite.',
        'Your tirzepatide treatment is prepared by a licensed U.S. compounding pharmacy, which ' +
        'prepares each prescription to your provider\u2019s specifications rather than ' +
        'mass-producing it. Because the FDA reviews mass-manufactured products rather than ' +
        'individual prescriptions, compounded preparations are not FDA-approved. The active ' +
        'ingredient is the same one used in the brand-name medication, which is approved for ' +
        'weight management and for type 2 diabetes. At KORB your provider prescribes a ' +
        'compounded formulation that includes a small amount of cyanocobalamin (vitamin B-12) ' +
        'to help your body handle it.'
      ],

      mayHelp: {
        lead: 'Patients use Tirzepatide for goals such as:',
        items: [
          'Weight loss',
          'Appetite and portion control',
          'Energy and everyday activity',
          'Sleep'
        ],
        after: 'Results vary from person to person, and no result is guaranteed. Your provider will talk with you about what is realistic for you, and reviews how it is going at each follow-up.'
      },

      nutrition: {
        lead: 'While you take Tirzepatide, these habits can reduce the chance ' +
              'of digestive side effects. They are general guidance rather than a meal plan. ' +
              'If you want a plan built around your own needs, a registered dietitian is the ' +
              'right person to see, and your provider can talk through whether that would help you.',
        items: [
          'Prioritize protein at each meal. It helps preserve muscle while you lose weight. [Use the Protein Target Calculator](https://korb-health.github.io/korb-patient-tools/KORB_Patient_Hub.html#protein-calculator) on the Patient Hub to find your daily target.',
          'Eat slowly and stop when you feel satisfied rather than full. Tirzepatide slows ' +
          'digestion, so it takes longer to feel full and it is easy to overeat before your ' +
          'body catches up.',
          'Eat smaller, more frequent meals if large meals feel uncomfortable.',
          'Avoid greasy, fried or very high-fat foods. These commonly worsen nausea.',
          'Drink regularly through the day. How much is below, under How much to drink.',
          'Limit alcohol, which can worsen nausea and interferes with steady progress.',
          'Stay physically active as you are able. Movement helps you keep muscle.',
          'Prioritize consistent sleep. Poor sleep can make hunger harder to manage.'
        ]
      },
      extraSections: [
        {
          /* Don, 2026-09-22, after Kris Mulkey asked for a reference point. From
             the National Academies adequate intake for total water, about 80% of
             which comes from drinks. A per-sex number, spread through the day. */
          lifestyle: true,
          h: 'How much to drink',
          p: [
            'Aim for about 72 ounces (9 cups) of fluid a day if you are a woman, and about 96 ounces (12 cups) if you are a man. Water, milk, tea and coffee all count. You normally get some water from food as well, and because you are eating less on Tirzepatide, drinking enough matters more.',
            'Drink more in hot weather, when you exercise, and if you have vomiting or diarrhea. Pale yellow urine is a good sign you are drinking enough.'
          ],
          table: {
            head: ['When', 'Women', 'Men'],
            rows: [
              ['Waking to lunch', '32 oz (4 cups)', '40 oz (5 cups)'],
              ['Lunch to dinner', '24 oz (3 cups)', '40 oz (5 cups)'],
              ['Dinner to early evening', '16 oz (2 cups)', '16 oz (2 cups)'],
              ['Daily total', 'About 72 oz (9 cups)', 'About 96 oz (12 cups)']
            ]
          },
          callout: '**If you have been told to limit fluids for a heart or kidney condition, follow that advice instead.** Contact your provider if you have dark urine, feel dizzy when you stand, or cannot keep fluids down. On Tirzepatide, dehydration can affect your kidneys.'
        }
      ],
      timingNotes: [
        ['Already taking a GLP-1?',
         'If you are transferring to KORB from another provider and want to continue at your ' +
         'current dose rather than start again at the lowest dose, we need documentation ' +
         'of the dose you are on: a pharmacy record, a prescription label, or a note from your ' +
         'prescriber. This is required before we can start you above the usual starting dose, ' +
         'and it is kept in your chart. Without it your provider will start you at the beginning ' +
         'dose and raise it gradually, which protects you from being started higher than your body has ' +
         'actually tolerated.'],
        ['How your dose goes up',
         'Your provider starts you at a low dose and increases it gradually, based on how you ' +
         'are tolerating the current one. The exact milligram steps and injection volume depend ' +
         'on which pharmacy fills your prescription, because KORB works with more than one ' +
         'compounding pharmacy and each uses a slightly different concentration and step ' +
         'schedule. Your prescription label always reflects your correct dose and volume for ' +
         'your pharmacy. For a quick reference showing injection volume and syringe markings by ' +
         'pharmacy and dose, [open My GLP-1 Dose & Injection Guide](https://korb-health.github.io/korb-patient-tools/KORB_GLP1_Dose_Guide.html) on the Patient Hub.'],
        ['Do not increase your own dose',
         'Even if you feel ready or your symptoms are mild. Increasing too quickly raises the ' +
         'risk of nausea and other side effects. If a dose is not well tolerated, tell your ' +
         'provider; they may extend that step before increasing further.'],
        /* FOUR DAYS, AND IT IS MEANT TO DIFFER FROM THE OTHER MOLECULE. Checked
           against the labels on DailyMed, 2026-09-19, because Don suspected the
           mismatch with semaglutide's 5 days was an error. It is not.

             Ozempic    semaglutide   within 5 days after the missed dose
             Wegovy     semaglutide   take it if the next dose is more than 2
                                      days away, which on a weekly schedule is
                                      the same 5-day window counted backwards
             Mounjaro   tirzepatide   within 4 days (96 hours)
             Zepbound   tirzepatide   within 4 days (96 hours)

           Both semaglutide labels say 5, both tirzepatide labels say 4. The
           basis is pharmacokinetic: semaglutide's elimination half-life is about
           1 week, tirzepatide's about 5 days, so semaglutide tolerates a later
           catch-up without stacking onto the next dose. Don's ruling 2026-09-19:
           keep the manufacturer numbers. **Do not harmonise these to one number.** */
        ['If you miss a dose',
         'If it has been less than 4 days since your missed dose, inject as soon as you ' +
         'remember, then resume your normal weekly schedule. If it has been 4 days or more, ' +
         'skip it and take your next dose on your regular day. Do not double up.'],
        /* MISSING SEVERAL WEEKS IS A DIFFERENT QUESTION FROM MISSING ONE, and
           until 2026-09-19 neither handout answered it. A patient who missed
           three weeks read the row above, "skip it and take your next dose on
           your regular day", and resumed at full dose. That is the common route
           to severe nausea and vomiting, and it is far likelier to happen than
           anyone agonising over day 4 against day 5.

           SOURCE. The Wegovy label states it: 2 or more consecutive missed
           injections, reinitiate dose escalation at a lower dosage to reduce GI
           adverse reactions. The Mounjaro and Zepbound labels are silent on it,
           and Ozempic does not address it either, so for tirzepatide this is
           KORB's own instruction on the same tolerance logic rather than a
           quotation. Don's ruling, 2026-09-19: same wording on both, and it
           routes to the provider rather than naming a dose, because the restart
           dose is a clinical decision and the step schedule differs by pharmacy. */
        ['If you miss two or more weeks in a row',
         'Contact KORB before your next injection rather than picking up where you left off. ' +
         'Your body loses its adjustment to the medication during a break, and going straight back to the dose you were on is the ' +
         'most common reason patients get severe nausea and vomiting. Your provider may restart ' +
         'you at a lower dose and build back up. Do not resume on your own.']
      ],
      timeline: [
        ['Starting out', 'First few weeks',
         'Some patients notice their appetite change here, and some notice mild nausea while their body adjusts.'],
        ['Raising your dose', 'Finding your dose',
         'Your dose increases as tolerated, only when your provider tells you to. How quickly you respond depends on your dose and your body.'],
        ['Your working dose', 'Staying on your dose',
         'Your provider adjusts your dose until you reach one that works for you.'],
        ['Ongoing', 'Maintenance',
         'Many patients stay on a steady dose long-term.']
      ],
      timelineNote:
        'Response is highly individual and depends on starting weight, metabolism, diet, ' +
        'activity and other factors, so do not compare yours to anyone else\'s. The ' +
        'medication supports weight loss rather than working on its own: it works best ' +
        'alongside healthy eating and activity, not in place of them.',
      common: [
        ['Nausea, vomiting or diarrhea',
         'May occur, most often after a dose increase. Smaller, lower-fat meals usually help. ' +
         'Tell your provider if it is severe or persistent.'],
        ['Constipation or stomach pain',
         'May occur. Drink enough fluid (see How much to drink) and tell your provider if it does not improve.'],
        ['Low appetite',
         'Expected, and part of how the medication works. Tell your provider if you cannot ' +
         'eat or drink adequately.'],
        ['Injection site redness or irritation', 'Some patients notice this. Usually mild. Rotate injection sites.'],
        ['Headache or dizziness',
         'May occur early on, often from not eating or drinking enough. Usually mild and short-lived.']
      ],
      monitorAndTell: [
        ['Severe or persistent abdominal pain, especially spreading to your back',
         'Can be a sign of pancreatitis (inflammation of the pancreas). Go to urgent care or the ER the same day to be evaluated - KORB is telemedicine and cannot examine you. Let KORB know afterwards so it reaches your provider.'],
        ['Pain in the upper right abdomen, fever, or yellowing of the skin or eyes',
         'Possible gallbladder problem, which needs an examination and imaging. Go to urgent care or the ER the same day. Let KORB know afterwards so it reaches your provider.'],
        ['Unable to keep fluids down for more than 24 hours', 'Go to urgent care or the ER the same day. On this medication, dehydration can affect your kidneys. Let KORB know afterwards so it reaches your provider.']
      ],
      contraPhrasing: {
        'Personal or family history of medullary thyroid carcinoma (MTC)':
          'A personal or family history of medullary thyroid carcinoma (MTC), a rare thyroid cancer',
        'Multiple endocrine neoplasia syndrome type 2 (MEN2)':
          'A personal or family history of multiple endocrine neoplasia syndrome type 2 (MEN2), an inherited condition that causes tumors in hormone glands, including the thyroid',
        'Hypersensitivity to the active drug or any component of the formulation':
          'A known allergy to Tirzepatide or to anything else in the formulation',
        'Current pregnancy, breastfeeding, or planning pregnancy':
          'Pregnancy, breastfeeding, or planning a pregnancy',
        'Active gallbladder disease or history of gallbladder-related surgical complications':
          'Active gallbladder disease, or a history of complications from gallbladder surgery',
        'History of pancreatitis (use with caution)':
          'A history of pancreatitis. This needs discussing with your provider rather than ruling you out automatically',
        'Severe gastrointestinal disorders such as gastroparesis':
          'A severe digestive condition such as gastroparesis, where the stomach empties too slowly',
        'Severe renal impairment (eGFR below 30 mL/min/1.73 m\u00b2)':
          'Severely reduced kidney function. Your provider will explain where your kidney results sit',
        'Uncontrolled diabetic retinopathy (primarily relevant in type 2 diabetes)':
          'Uncontrolled diabetic eye disease (retinopathy), which mainly applies if you have type 2 diabetes'
      },
      /* KORB ORDERS NO LABS FOR GLP-1. Don, 2026-09-19, and the distinction is
         the whole point: this said "routine labs are not required" and then
         offered "if your KORB provider has an individual clinical reason to
         order labs for you". Read together that is a program with no scheduled
         draw but a door left open, and a patient could reasonably expect KORB
         to order bloodwork on request. KORB does not order labs for this
         program at all. Lab work is a conversation with the patient's primary
         care provider. Heading is "Labs" rather than "Lab monitoring" for the
         same reason: nothing here is monitored. */
      labs: {
        heading: 'Labs',
        lead: 'KORB does not order labs for this program.',
        items: [
          'There is no baseline draw and no scheduled draw at any point in your weight loss ' +
          'treatment with KORB.',
          'If you are also managing diabetes or pre-diabetes, continue that care, including ' +
          'any related labs, with the clinician who manages it, whether that is your primary ' +
          'care provider, an endocrinologist (a hormone and diabetes specialist) or another specialist, alongside your KORB visits.',
          'If you want lab work, or another clinician has told you that you need it, that is a ' +
          'conversation to have with your primary care provider. KORB does not order it for you.'
        ],
        after: 'This is deliberate rather than an omission. Some other KORB programs require ' +
               'lab work before and during treatment. The weight loss program does not.'
      },
      safety: [
        'Use Tirzepatide only as prescribed. Do not change your dose, schedule, or how you take it, unless your provider tells you to.',
        'Do not use any other weight-loss medication at the same time, including Ozempic, Wegovy, Mounjaro, Zepbound or Rybelsus, or one from another clinic or online seller.',
        'Tirzepatide is not appropriate during pregnancy or breastfeeding, or with a personal or family history of MTC or MEN2.',
        'Tell your KORB provider if you develop a new medical condition, start a new medication, or become pregnant.'
      ],
      emergencyLead:
        'Stop injecting and seek emergency care immediately if you have trouble ' +
        'breathing, swelling of the face, lips, tongue or throat, a severe rash or ' +
        'hives, chest pain, or any symptom that feels severe or unsafe.',

      keyReminders: [
        'Tirzepatide works like two natural gut hormones rather than one.',
        'Dose increases happen only when your provider tells you to. Never increase on your own.',
        'Write the open date on your vial and discard 28 days after first use.',
        'Most patients do well when they follow the nutrition guidance above. Tell your provider if nausea is severe or persistent.',
        'KORB does not order labs for this program. Lab work is a conversation with your primary care provider.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    },

    /* NO DATA FILE. Testosterone is the one handout here that cannot pull, because
       korb-mens-data.js does not exist - open item 6 in CLAUDE.md. Its route,
       schedule and storage are stated below rather than read, and source:'none'
       makes that explicit so the page does not imply it is live when it is not.

       When korb-mens-data.js lands: delete `facts`, set source and a product key,
       and check whether `storage` can move into it too. Testosterone storage is
       NOT the shared peptide block - room temperature, 90 days - and inheriting
       the shared one would tell a patient to refrigerate a medication that must
       not be refrigerated. */
    testosterone: {
      key: 'testosterone',
      file: 'KORB_Patient_Ed_Testosterone',
      title: 'Testosterone Guide',
      source: 'mens',
      program: 'Men\'s Health',
      /* `how` is DERIVED from korb-mens-data.js routes - see mensFacts() in
         patient-ed-render.js. Timing and schedule stay here as prose because
         neither is a fact that file holds: both depend on the individual
         prescription, so deriving them would dress prose up as live. Wired
         2026-09-17, closing the TODO in the comment above, which had been open
         since the data file landed on 2026-09-16. */
      timingText: 'On your scheduled injection day, as stated on your label',
      scheduleText: 'As stated on your prescription label',

      what: [
        'Testosterone cypionate is a long-acting injectable form of testosterone. It ' +
        'replaces what your body is no longer producing in adequate amounts, bringing ' +
        'your levels back into a healthy range.',
        'It is a thick, oil-based medication, which is why it comes with a specific type ' +
        'of syringe and two different needles.'
      ],

      /* What to expect, added 2026-09-22 so every medication guide has one. Every
         line is a fact KORB already states in korb-mens-data.js or on this page. */
      timeline: [
        ['Before you start', 'Baseline labs', 'Lab work confirms your testosterone is low before anything is prescribed.'],
        ['First weeks', 'Starting out', 'Some men report changes in energy or mood, and many notice little at first. Keep to your schedule.'],
        ['6 to 8 weeks after any dose change', 'Recheck labs', 'Your labs are rechecked, drawn on an injection day before your dose, and your provider adjusts if needed.'],
        ['Every 12 weeks', 'Follow-up', 'A follow-up visit with labs, to review how you feel and keep your levels in a safe range.']
      ],
      timelineNote: 'Results vary from person to person, and no result is guaranteed.',
      mayHelp: {
        lead: 'Men with low testosterone use testosterone replacement therapy (TRT) for goals such as:',
        items: [
          'Energy',
          'Muscle, strength and recovery from exercise',
          'Sex drive',
          'Mood and motivation',
          'Body composition (your balance of muscle and fat)'
        ],
        after: 'Results vary from person to person, and no result is guaranteed. Your provider adjusts your dose over time based on your labs and how you feel.'
      },

      extraSections: [
        {
          h: 'How to give your injection',
          /* "Wider" and "finer" are not KORB vocabulary and a patient holding two
             identical-looking packets cannot act on them. Don, 2026-09-19. The
             data file has named these by job since it was written -
             routes.*.drawNeedle and routes.*.injectNeedle in korb-mens-data.js -
             so the handout now uses the same two names.

             NO GAUGE NUMBERS, deliberately. They differ by route (23G draws for
             all three; the injection needle is 25G for IM and 27G for SQ), so a
             printed pair would be wrong for somebody. The gauge RULE is worth
             teaching instead, because it runs backwards and a patient reasonably
             assumes the bigger number is the bigger needle. */
          callout: 'Your medication is a thick oil, and it comes with a Luer lock syringe (one the needle twists onto) and ' +
                   'two separate needles that do different jobs. The **draw-up needle** is the ' +
                   'thicker of the two and is the only one that will pull the oil out of the ' +
                   'vial. The **injection needle** is thinner and is the one that goes into ' +
                   'you. Use both, every time. The oil will barely move through the injection ' +
                   'needle, and drawing through it blunts the tip and makes the injection hurt ' +
                   'more. If you are not sure which is which, check the gauge number on the ' +
                   'packet: the numbering runs backwards, so the **lower** number is your ' +
                   'draw-up needle and the **higher** number is your injection needle.',
          table: {
            head: ['Step', 'What to do'],
            rows: [
              ['1', 'Wash your hands. Set out your syringe, both needles, alcohol pads and your vial.'],
              ['2', 'Wipe the top of the vial with an alcohol pad and let it dry.'],
              ['3', 'Attach the draw-up needle. Draw up the exact amount on your prescription label.'],
              ['4', 'Take the draw-up needle off and attach the injection needle. Never draw up through the injection needle.'],
              ['5', 'Clean your injection site with a fresh alcohol pad and let it dry.'],
              ['6', 'Inject, then dispose of the needles and syringe in a sharps container immediately.']
            ]
          },
          p: [
            'Where to inject. If you inject under the skin, use the abdomen, upper thigh, or ' +
            'the fatty area of the buttock. If you inject into the muscle, use the outer thigh, ' +
            'the buttock muscle, or the shoulder. Your provider will tell you which route you ' +
            'are using and show you the technique.',
            'Rotate every time. Move at least an inch or two from your last injection site. ' +
            'Injecting into the same spot repeatedly causes soreness, lumps and scar tissue ' +
            'that make future injections harder.',
            'Take your time drawing up. The oil moves slowly, and pulling too hard creates air ' +
            'bubbles. Warming the vial briefly in your hand can help it draw more easily.'
          ]
        },
        {
          h: 'Reading your syringe',
          p: [
            'Your prescription label tells you how many mL to draw. Find that number on the ' +
            'barrel and pull the plunger back until the front edge of the black stopper lines ' +
            'up with it, not the middle or the back of it.',
            'The numbered lines are tenths of a mL and the smaller unnumbered lines between ' +
            'them are hundredths, so 0.42 mL is four numbered lines past zero plus two small ' +
            'lines. Subcutaneous doses use a 1 mL syringe and intramuscular doses use a 3 mL ' +
            'syringe; your own dose is on your label.'
          ],
          warn: 'If you have drawn past your number, do not inject the extra. Push the plunger ' +
                'gently back down to the correct line, or push it all the way in and start ' +
                'again. Injecting more than you were prescribed raises your levels too high and ' +
                'shows up on your labs.'
        },
        {
          h: 'Your dose',
          p: ['Your prescription label states your exact dose, your volume and how often to ' +
              'inject. Your provider selects your starting dose based on your labs and symptoms, ' +
              'and may adjust it over time.'],
          warn: 'Never increase your own dose. More testosterone is not better. Levels that run ' +
                'too high raise your risk of thickened blood, elevated estrogen and ' +
                'heart and blood vessel problems, and they do not produce better results. If you feel ' +
                'your dose is not working, tell your provider so it can be adjusted properly ' +
                'and rechecked with labs.'
        },
        {
          h: 'Refills and timing',
          p: ['Testosterone is a controlled medication, which means the law puts extra limits on how it is prescribed, refilled and shared, because it can be misused. Pharmacies are legally limited in how ' +
              'early they can release a refill, and they count from the date of your **last fill**, ' +
              'not from the date you run out or the date of your visit.'],
          ul: [
            'Your provider calculates your refill date and sends your prescription a few days ' +
            'before the pharmacy can release it.',
            'Asking the pharmacy to fill early will not move the date up.',
            'If you are traveling or think you may run short, tell us well in advance rather ' +
            'than at the last minute.'
          ]
        }
      ],

      /* Its own travel text, because the shared one says to refrigerate on
         arrival. Correct for the peptides, wrong here, and the two sat two
         inches apart contradicting each other on the first build. */
      travel:
        'Keep your medication with you, in your carry-on or personal item rather than ' +
        'checked baggage, in its original labeled carton. Keep it at room temperature ' +
        'and out of direct sunlight, and do not let it freeze or get cold enough to ' +
        'form crystals. Do not refrigerate it at any point, including on arrival. ' +
        'Medication and syringes are permitted in carry-on luggage, and TSA recommends ' +
        'keeping the original pharmacy label visible. Because this is a controlled ' +
        'medication, keep it in the labeled carton so it is clearly identifiable.',

      /* NOT the shared peptide storage block. Room temperature, and 90 days. */
      storage: {
        cards: [
          ['Store at room temperature', '68\u00b0F \u2013 77\u00b0F (20\u00b0C \u2013 25\u00b0C)'],
          ['Protect from light', 'Keep in the carton, away from direct sunlight'],
          ['Do not refrigerate or freeze', 'Cold can form crystals in the oil'],
          ['Keep secured', 'A controlled medication. Store out of reach of others.']
        ],
        notes: [
          'Discard your vial 90 days after you first use it, even if medication is left in it. ' +
          'Once a vial has been opened and punctured it is no longer considered safe to use ' +
          'beyond that point. Write the date you first used it on the label.',
          'Depending on your dose there may still be medication in the vial at 90 days. That is ' +
          'expected. Discard it when your new supply arrives rather than stretching it further. ' +
          'Never save leftover medication to use later, and never share it.',
          'If the oil looks cloudy, has particles, or has changed color, do not use it and ' +
          'contact the pharmacy or KORB. Small crystals can form if the vial gets cold, and ' +
          'warming it gently in your hand usually clears them. If they do not clear, do not use it.'
        ]
      },

      common: [
        ['Injection site soreness, redness or a small lump',
         'May occur. Rotate sites and use a fresh needle each time. Tell KORB if it worsens or does not resolve.'],
        ['Acne or oilier skin', 'May occur, especially early on. Tell your provider if it becomes bothersome.'],
        ['Fluid retention or mild swelling', 'Tell your provider. Your dose may need adjusting.'],
        ['Mood changes, irritability or trouble sleeping',
         'Tell your provider. This can indicate your dose is too high.'],
        ['Breast tenderness or swelling',
         'Tell your provider. This may mean estrogen is running high, and it is adjustable.'],
        ['Reduced testicle size, or reduced fertility',
         'Expected with testosterone therapy. If you are planning to father children, tell your provider before continuing.']
      ],
      monitorAndTell: [
        ['Headaches, flushing, or feeling unusually warm', 'Can suggest thickened blood. Tell your provider.'],
        ['New or worsening snoring, or pauses in breathing during sleep', 'Tell your provider.'],
        ['Difficulty urinating or a weak stream', 'Tell your provider.'],
        ['Any new medical diagnosis, new medication, or planned surgery', 'Tell your provider.']
      ],

      labs: {
        lead: 'Timing matters more than most patients expect. Get your blood drawn on a day you ' +
              'are scheduled to inject, before you take that dose, when your level is at its lowest. ' +
              'If you are drawn right after an injection your level reads artificially high, and ' +
              'your provider may lower a dose that was actually correct.',
        items: [
          'Your panel checks your testosterone level, your red blood cell count, your prostate marker and your hormone balance.',
          'Labs are ordered about two weeks before your follow-up visit so results are ready when you meet, and you will get a reminder.'
        ],
        after: 'Results can take up to a week to come back, which leaves roughly a one-week ' +
               'window once your reminder arrives. Going early is fine. Waiting until the last ' +
               'few days risks your results not being ready, which can delay your visit and your refill.'
      },

      /* Testosterone is not given with an insulin syringe. This handout states
         the device itself, two lines down, so the shared insulin sentence is not
         appended. Don, 2026-09-21. */
      ownInjectionDevice: true,
      safety: [
        'Use testosterone only as prescribed. Never change your dose, timing, or how you inject it, unless your provider tells you to.',
        'Use a new syringe and new needles for every injection. Never reuse or share them.',
        'Draw up with the draw-up needle and inject with the injection needle. Never draw up through the injection needle.',
        'Do not share this medication with anyone. It is a controlled substance and sharing it is illegal.',
        'Get your labs drawn on an injection day, before your dose.',
        'Tell your provider if you are planning to father children.'
      ],

      emergencyLead:
        'Seek emergency care immediately for chest pain, trouble breathing, sudden weakness or ' +
        'numbness on one side, trouble speaking, swelling or pain in one leg, or any symptom ' +
        'that feels severe or unsafe. Do not wait to hear back from KORB.',

      keyReminders: [
        'Draw up with the draw-up needle, then switch to the injection needle to inject.',
        'Rotate your injection site every single time.',
        'Get labs drawn on an injection day, before your dose.',
        'Your refill date is set by your last fill date. Early requests will not move it up.',
        'Discard your vial 90 days after first use, even if medication is left.',
        'Never increase your own dose. Higher is not better and carries real risk.',
        'Store at room temperature, not in the refrigerator.',
        'Contact KORB Operations for non-urgent questions, your provider through the ' +
        'Patient Portal for medical questions, and emergency care for severe symptoms.'
      ]
    }

  }
};

/* Quest facts come from korb-quest.js, which must load FIRST. Throwing by name
   beats rendering a lab page with no way to book on it: check-pages.js knows the
   dependency and the build fails rather than shipping a page that tells a patient
   to schedule and gives them nothing to press. */
KORB_PATIENT_ED.hydrate = function (Q) {
  if (!Q || !Q.book) {
    throw new Error('korb-patient-ed-data.js: korb-quest.js must be loaded first.');
  }
  KORB_PATIENT_ED.shared.quest = Q;
  KORB_PATIENT_ED.hydrated = true;
  return KORB_PATIENT_ED;
};
KORB_PATIENT_ED.hydrated = false;

if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_PATIENT_ED; }
