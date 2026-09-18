#!/usr/bin/env python3
"""Rewrite the link targets inside an existing PDF, leaving everything visible
about it untouched.

Why this exists rather than regenerating the document:

  The Welcome Letter was designed outside this repo. When the PDFs were retired
  and the links moved to HTML, the rebuilt version did not match it - the
  branded buttons became a list of links and the layout drifted. Rebuilding a
  document to change a URL is the wrong tool. This edits the link annotations
  and nothing else, so the page a patient sees is byte-for-byte the one that was
  designed, with working destinations.

Rules applied, in order:
  1. pacstevenson.github.io  ->  korb-health.github.io   (the July repo migration)
  2. .../korb-patient-tools/....pdf  ->  the same path as .html
     (only for paths this repo actually publishes as .html; anything else is
     reported and left alone rather than guessed at)
  3. external links are never touched

Usage:
  python tools/retarget-pdf-links.py IN.pdf OUT.pdf [--repo DIR]
"""
import argparse
import os
import sys

try:
    import pikepdf
except ImportError:
    sys.exit("pikepdf is required:  pip install pikepdf")

OLD_BASE = "https://pacstevenson.github.io/korb-patient-tools/"
NEW_BASE = "https://korb-health.github.io/korb-patient-tools/"


def retarget(uri, repo, report):
    original = uri

    if uri.startswith(OLD_BASE):
        uri = NEW_BASE + uri[len(OLD_BASE):]

    if uri.startswith(NEW_BASE) and uri.lower().endswith(".pdf"):
        rel = uri[len(NEW_BASE):]
        html_rel = rel[:-4] + ".html"
        if repo and not os.path.exists(os.path.join(repo, html_rel)):
            report.append(("NO HTML IN REPO", original, html_rel))
            return original, False
        uri = NEW_BASE + html_rel

    return uri, uri != original


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--repo", default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                    help="repo root, used to confirm an .html target really exists")
    args = ap.parse_args()

    pdf = pikepdf.open(args.src)
    changed, untouched, report = [], [], []

    for page in pdf.pages:
        if "/Annots" not in page:
            continue
        for annot in page["/Annots"]:
            action = annot.get("/A")
            if action is None or "/URI" not in action:
                continue
            uri = str(action["/URI"])
            new, did = retarget(uri, args.repo, report)
            if did:
                action["/URI"] = pikepdf.String(new)
                changed.append((uri, new))
            else:
                untouched.append(uri)

    pdf.save(args.dst)
    pdf.close()

    print("rewrote %d link(s), left %d alone" % (len(changed), len(untouched)))
    for old, new in changed:
        print("   " + old.replace(NEW_BASE, "").replace(OLD_BASE, ""))
        print("    -> " + new.replace(NEW_BASE, ""))
    if untouched:
        print("  left alone (external or already correct):")
        for u in untouched:
            print("   " + u)
    if report:
        print("\n  NOT REWRITTEN, no .html published for these:")
        for tag, old, want in report:
            print("   %s  %s" % (tag, want))
        sys.exit(2)


if __name__ == "__main__":
    main()
