# korb-patient-tools

KORB Health patient education pages, patient tools and provider references, published as static pages on GitHub Pages from `main`. **Public.** The site is https://korb-health.github.io/korb-patient-tools/, and the bare address opens the Patient Hub.

## Data boundary

- **Public and unauthenticated.** Anyone with a URL can open any file here, and anything that crawls it can read it.
- **Nothing patient-specific, ever.** No PHI, no names, no identifiers, no chart content, no individual dosing, no pricing. General patient education only.
- **No credentials.** No token, API key or password in any file or chat.
- Pricing, contract terms, internal analysis and drafts live in the private `korb-clinical-docs`, never here.
- KORB Health Group LLC is the MSO and does not practice medicine. Clinical care is delivered by KORB Health Medical Texas PA.

## Pushing publishes

**A push to `main` goes live to patients within minutes.** Patient links go out by text message and email, and a sent URL cannot be recalled, so do not rename or move a patient-facing file. Retire it to a redirect instead.

Which pages are released to patients is recorded by hand in the RELEASE STATUS table in [CLAUDE.md](CLAUDE.md). A file being in this repo does not mean it is released.

## What's where

| Path | Holds |
| --- | --- |
| `index.html` | Redirect from the bare site address to the Patient Hub |
| `KORB_Patient_Hub.html` | Where patients are sent |
| `Patient_Education/` | Patient handouts, guides and program overviews |
| `Provider_Reference/` | Provider references and tools, linked from the intranet |
| `korb-*-data.js`, `korb-pharmacies.js` | Clinical data. Each fact is written once here, and pages read it at load |
| `build-*.js` | Generators. Run from the repo root |
| `check-*.js`, `rx-signoff.js`, `artifact-signoff.js` | Checks and sign-off registers |
| [CLAUDE.md](CLAUDE.md) | The rules for working here, release status, and the history of why |

Never hand-edit a generated page. Edit the data file and rebuild.

## Setting up a new machine (Windows)

One time, on each machine:

1. Clone as a sibling of the other KORB repos, never inside one:
   ```
   git clone https://github.com/KORB-Health/korb-patient-tools.git C:\korb-patient-tools
   ```
2. Check Node is v18 or later with `node --version`, then:
   ```
   npm install
   npx playwright install chromium
   ```
   The second command is needed for the sign-off checks, which drive a browser.
3. Open `C:\korb-patient-tools` in Claude Code, so `CLAUDE.md` loads.

## Daily habit

- **Sitting down:** `git pull`
- **Getting up:** commit, and push once Don has agreed to what will go live
