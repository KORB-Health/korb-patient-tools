/* ============================================================================
   stamp-cache.js — put a content hash on every local script and stylesheet tag

       node stamp-cache.js            rewrite the tags
       node stamp-cache.js --check    exit 1 if any tag is missing or stale

   WHY THIS EXISTS. Every document in this repo is a shell that loads its data
   file in the browser, which is what keeps it current — a pharmacy change
   reaches the reader on their next page load. That sentence has a hole in it,
   and Don fell through it twice on 2026-09-29: the browser CACHES the data
   file, so "next page load" can serve yesterday's clinical data for as long as
   the cache holds. He hard-refreshed and still saw the old programme lengths.

   GitHub Pages sends Cache-Control: max-age=600 on these files, so it resolves
   itself in ten minutes — but ten minutes is not the point. The point is that a
   provider opening a monograph has no way to know which version they are
   reading, and the page gives them no sign. The 12-week programme was live and
   invisible.

   A content hash in the query makes the URL change exactly when the file
   changes, so the browser fetches it because it has never seen that URL, not
   because anyone remembered to refresh. A file that has not changed keeps its
   hash and stays cached, which is the half worth keeping.

   WHY A CONTENT HASH AND NOT A VERSION OR A DATE. meta.version is bumped by
   hand and a file can change without one. A build date changes on every run and
   would throw caching away entirely, which is worse than the problem. The hash
   changes when, and only when, the bytes change.

   RUN IT AFTER THE BUILDERS. They write their shells with bare tags, so a
   rebuild un-stamps whatever it regenerates. That is fine and is why --check
   exists: it is in the gate list, so a forgotten stamp fails the build rather
   than shipping a page that quietly serves a cached data file.

   IT ONLY TOUCHES LOCAL TAGS. External URLs are left alone, and so is any page
   with no local tags at all — including KORB_Scheduler_Intake_Prototype.html,
   which is FROZEN for Lindsay's review and has none.
   ============================================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const REPO = __dirname;
const CHECK = process.argv.indexOf('--check') !== -1;

/* A tag's src may be relative ('korb-quest.js', '../../korb-glp1-data.js'), but
   every asset it can name lives at the repo root, once — that is the Layout
   rule. So the basename is the key, and the path in the tag is left exactly as
   the builder wrote it. */
function hashOf(file) {
  const p = path.join(REPO, file);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p);
  /* Normalise CRLF before hashing. Windows checkouts have core.autocrlf=true,
     so the same commit hashes differently on the two machines otherwise, and
     every pull would report drift that is not there. This repo has been bitten
     by exactly that once already — see build-embed.js --check in CLAUDE.md. */
  const lf = Buffer.from(raw.toString('utf8').replace(/\r\n/g, '\n'), 'utf8');
  return crypto.createHash('sha256').update(lf).digest('hex').slice(0, 8);
}

const TAG = /(<(?:script|link)\b[^>]*?(?:src|href)=")([^"]+)(")/g;

function stamp(html, onTag) {
  return html.replace(TAG, (whole, pre, url, post) => {
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return whole;
    const bare = url.split('?')[0];
    if (!/\.(js|css)$/i.test(bare)) return whole;
    const h = hashOf(bare.split('/').pop());
    if (!h) { onTag && onTag({ url, state: 'no such file', bare }); return whole; }
    const want = bare + '?v=' + h;
    onTag && onTag({ url, want, state: url === want ? 'current' : 'stale' });
    return pre + want + post;
  });
}

const files = execSync('git ls-files "*.html"', { cwd: REPO, encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean);

let changed = 0, tags = 0, stale = [], missing = [];

files.forEach(f => {
  const p = path.join(REPO, f);
  const html = fs.readFileSync(p, 'utf8');
  const out = stamp(html, t => {
    if (t.state === 'no such file') { missing.push(f + ': ' + t.url); return; }
    tags++;
    if (t.state === 'stale') stale.push(f + ': ' + t.url);
  });
  if (out !== html) {
    changed++;
    if (!CHECK) fs.writeFileSync(p, out);
  }
});

if (missing.length) {
  console.error('TAGS NAMING A FILE THAT IS NOT IN THE REPO (' + missing.length + '):');
  missing.forEach(m => console.error('  - ' + m));
  console.error('A tag pointing at nothing renders nothing, silently. Fix the page or the name.');
  process.exit(1);
}

if (CHECK) {
  if (stale.length) {
    console.error('CACHE STAMP IS STALE — ' + stale.length + ' tag(s) across ' + changed + ' page(s).');
    console.error('A reader can be served a cached data file with no sign that it is old.');
    console.error('Run: node stamp-cache.js');
    stale.slice(0, 12).forEach(s => console.error('  - ' + s));
    if (stale.length > 12) console.error('  ... and ' + (stale.length - 12) + ' more');
    process.exit(1);
  }
  console.log('Cache stamp: all ' + tags + ' local tag(s) across ' + files.length +
              ' page(s) carry the current content hash.');
} else {
  console.log('Cache stamp: ' + tags + ' local tag(s) checked, ' + changed + ' page(s) rewritten.');
}
