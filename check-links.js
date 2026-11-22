#!/usr/bin/env node
/* ============================================================================
   EVERY LINK ON EVERY PAGE, CHECKED.   node check-links.js   (from repo root)

   WHY (Don, 2026-11-21). The Patient Hub's Daily Servings and Protein guidance
   buttons pointed at cdn.realfood.gov, which stopped resolving. Nothing in
   this repo looked at outside links, so they sat dead until Don clicked them.
   The same day a hand sweep found the When to Contact page out of step, which
   is the other reason for one command that looks at every page.

   WHAT IT DOES
   - Opens every tracked .html page in Chromium, because the generated pages
     build their links in the browser from the data files. Reading the source
     would miss them. A redirect page (meta refresh) is read as source and not
     followed, so its links are judged against its own folder.
   - The My GLP-1 medication pages show most of their content only for a dose,
     so they are opened a second time at their first dose.
   - A link to another page here (relative, or a korb-health.github.io
     address) must name a file that exists. Checked offline.
   - A link to anywhere else must answer 2xx or 3xx to a plain GET. Each
     address is fetched once however many pages carry it.

   EXIT 1 on any missing file or dead outside link. A site that refuses
   scripts but loads in a person's browser (Quest today) is listed under
   BLOCKS SCRIPTS, not passed silently: open those by hand. A host that
   starts refusing scripts tomorrow shows up as dead, which is the safe way
   round.

   OPTIONS
     --local-only   skip outside links (no network)
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const LOCAL_ONLY = process.argv.includes('--local-only');
const SELF = /^https?:\/\/korb-health\.github\.io\/korb-patient-tools\/?/i;
/* Hosts that answer 403 to any script and load fine in a browser. Checked
   by hand in a real browser on 2026-11-21. */
const BLOCKS_SCRIPTS = ['appointment.questdiagnostics.com'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
  console.error('check-links: playwright is not installed. Run npm install and\n' +
                '             npx playwright install chromium. A link check that\n' +
                '             cannot open the pages has not looked at them.');
  process.exit(1);
}

const pages = execSync('git ls-files "*.html"', { cwd: ROOT, encoding: 'utf8' })
  .trim().split('\n').filter(Boolean);

const local = new Map();     // file path -> Set of pages linking to it
const outside = new Map();   // url -> Set of pages
function note(map, key, page) { if (!map.has(key)) map.set(key, new Set()); map.get(key).add(page); }

function classify(href, page) {
  if (!href) return;
  href = href.trim();
  if (!href || href[0] === '#' || /^(mailto|tel|javascript|data|sms):/i.test(href)) return;
  if (SELF.test(href)) {
    const rest = decodeURIComponent(href.replace(SELF, '').split('#')[0].split('?')[0]);
    note(local, rest || 'index.html', page);
    return;
  }
  if (/^https?:/i.test(href)) { note(outside, href.split('#')[0], page); return; }
  if (/^\/\//.test(href)) { note(outside, 'https:' + href.split('#')[0], page); return; }
  const rel = decodeURIComponent(href.split('#')[0].split('?')[0]);
  if (!rel) return;
  let target = path.posix.normalize(path.posix.join(path.posix.dirname(page), rel));
  if (target.endsWith('/')) target += 'index.html';
  note(local, target, page);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const pg = await ctx.newPage();
  const url = f => require('url').pathToFileURL(path.join(ROOT, f)).href;

  for (const f of pages) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (/<meta[^>]+http-equiv=["']?refresh/i.test(src)) {
      for (const m of src.matchAll(/href=["']([^"']+)["']/gi)) classify(m[1], f);
      const r = src.match(/content=["'][^"']*url=([^"']+)["']/i);
      if (r) classify(r[1].trim(), f);
      continue;
    }
    const grab = async () => {
      const hrefs = await pg.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
      hrefs.forEach(h => classify(h, f));
    };
    try { await pg.goto(url(f), { waitUntil: 'load', timeout: 30000 }); }
    catch (e) { console.error('check-links: could not open ' + f + ': ' + e.message); continue; }
    await pg.waitForTimeout(400);
    await grab();
    const dose = await pg.evaluate(() => {
      if (!/My_GLP1_/.test(location.pathname)) return null;
      const s = document.querySelector('select');
      return s ? ([...s.options].map(o => o.value).find(v => v) || null) : null;
    });
    if (dose) {
      await pg.goto(url(f) + '?dose=' + encodeURIComponent(dose));
      await pg.waitForTimeout(400);
      await grab();
    }
  }
  await browser.close();

  const missing = [...local.entries()].filter(([t]) => !fs.existsSync(path.join(ROOT, t)));

  const dead = [], blocked = [];
  if (!LOCAL_ONLY) {
    const list = [...outside.keys()];
    const check = async u => {
      const host = (() => { try { return new URL(u).host; } catch (e) { return ''; } })();
      try {
        const res = await fetch(u, { method: 'GET', redirect: 'follow',
          headers: { 'User-Agent': UA, 'Accept': '*/*' }, signal: AbortSignal.timeout(25000) });
        if (res.body) { try { await res.body.cancel(); } catch (e) {} }
        if (res.status < 400) return;
        if (BLOCKS_SCRIPTS.includes(host) && res.status === 403) { blocked.push(u); return; }
        dead.push([u, String(res.status)]);
      } catch (e) {
        dead.push([u, (e.cause && e.cause.code) || e.name || 'error']);
      }
    };
    for (let i = 0; i < list.length; i += 8) await Promise.all(list.slice(i, i + 8).map(check));
  }

  const where = s => [...s].slice(0, 3).join(', ') + (s.size > 3 ? ' and ' + (s.size - 3) + ' more' : '');
  if (missing.length) {
    console.log('\nMISSING FILES');
    missing.forEach(([t, s]) => console.log('  ' + t + '\n      linked from ' + where(s)));
  }
  if (dead.length) {
    console.log('\nDEAD OUTSIDE LINKS');
    dead.forEach(([u, why]) => console.log('  ' + why.padEnd(10) + u + '\n      linked from ' + where(outside.get(u))));
  }
  if (blocked.length) {
    console.log('\nBLOCKS SCRIPTS - open these in a browser by hand');
    blocked.forEach(u => console.log('  ' + u));
  }
  const n = pages.length;
  console.log('\nLink check: ' + n + ' pages, ' + local.size + ' links to pages here (' +
    missing.length + ' missing), ' +
    (LOCAL_ONLY ? 'outside links skipped' :
      outside.size + ' outside links (' + dead.length + ' dead, ' + blocked.length + ' blocks scripts)') + '.');
  process.exit(missing.length || dead.length ? 1 : 0);
})();
