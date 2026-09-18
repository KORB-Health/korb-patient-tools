/* ============================================================================
   BRIDGE PDFs

   Usage:  node build-bridge-pdf.js [name]

   The stored PDFs were retired on 2026-09-17 because they were second copies
   that drifted from the page. That is still the right call, and this does not
   undo it. It covers one case the retirement did not: documents whose URL is
   already in patients' hands.

   A patient who was emailed
   .../KORB_Welcome_Letter.pdf in August cannot be reached to be given a new
   link. Their link 404s. So that one URL is republished, and this is what makes
   it safe:

     1. Every link inside it is ABSOLUTE. A relative href in a PDF resolves
        against nothing and the button does nothing, so rewriting them is not
        cosmetic - it is the whole point. They point at the live .html pages, so
        the moment the patient taps one they are on a page that reads the data
        files.
     2. It carries a visible line saying it is a printed copy and naming the
        live page, so a patient holding a year-old print knows there is a
        current version and where it is.
     3. It is generated from the same korb-patient-ed-data.js as the page, so
        rebuilding it is one command rather than a hand edit.

   ONLY add a document here if its URL is genuinely already circulating. Every
   entry is a snapshot that can go stale, which is the thing we just spent a day
   removing. A link hub like the Welcome Letter is the safe case: its content is
   almost entirely links, and the links point at pages that stay current.

   DO NOT add clinical handouts. A dosing or safety document in a patient's
   downloads folder is exactly the failure the retirement fixed.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = __dirname;
const BASE = 'https://korb-health.github.io/korb-patient-tools/';

/* name -> the page to render and where the PDF goes, both repo-relative. */
const BRIDGES = {
  welcome: {
    page: 'KORB_Welcome_Letter.html',
    pdf: 'KORB_Welcome_Letter.pdf',
    title: 'Welcome to KORB',
    why: 'Emailed to patients before 2026-09-17; the URL is in their inbox.'
  }
};

function loadChromium() {
  for (const t of ['playwright', 'playwright-core', 'puppeteer']) {
    try { return require(t).chromium || require(t); } catch (e) { /* next */ }
  }
  return null;
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
               '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.pdf': 'application/pdf' };

/* A real server rather than file://, because the pages load their data with
   script tags and some of them behave differently off a file URL. */
function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '');
      const p = path.join(ROOT, rel);
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
        res.writeHead(404); res.end('not found'); return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, port: srv.address().port }));
  });
}

(async function main() {
  const want = process.argv[2];
  const names = Object.keys(BRIDGES).filter(n => !want || n === want);
  if (!names.length) {
    console.error('No bridge "' + want + '". Known: ' + Object.keys(BRIDGES).join(', '));
    process.exit(1);
  }

  const chromium = loadChromium();
  if (!chromium) {
    console.error('Playwright not installed. Run:');
    console.error('  npm install && npx playwright install chromium');
    process.exit(1);
  }

  const { srv, port } = await serve();
  const origin = 'http://127.0.0.1:' + port + '/';
  const browser = await chromium.launch();

  for (const name of names) {
    const b = BRIDGES[name];
    const page = await browser.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));

    await page.goto(origin + b.page, { waitUntil: 'networkidle' });

    const info = await page.evaluate(base => {
      /* 1. every link absolute, or it is dead in a PDF */
      let rewritten = 0, already = 0;
      document.querySelectorAll('a[href]').forEach(a => {
        const raw = a.getAttribute('href');
        if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return;
        if (/^https?:\/\//i.test(raw)) { already++; return; }
        a.setAttribute('href', base + raw.replace(/^\.?\//, ''));
        rewritten++;
      });

      /* 2. the toolbar is meaningless on paper */
      const tools = document.querySelector('.tools');
      if (tools) tools.remove();

      /* 2b. the page says "live - reflects the data file as of this page load",
         which is true of the page and a lie on paper. Both copies of it go, or
         the printed sheet claims to be current forever. */
      const live = document.querySelector('.live');
      if (live) live.remove();
      const byline = document.querySelector('.byline');
      if (byline) {
        byline.textContent = 'KORB Health Medical Texas PA · Patient education · ' +
          'printed copy, not the live version';
      }

      /* 2c. the logo prints far larger than it needs to and sits hard left.
         Quarter it and centre it, so the page opens on the content rather than
         on a banner. */
      const mast = document.querySelector('.mast');
      if (mast) {
        mast.setAttribute('style',
          'text-align:center;border-bottom:1.5px solid #00B2C3;' +
          'padding-bottom:8px;margin:0 0 14px;');
        const img = mast.querySelector('img');
        if (img) {
          img.setAttribute('style',
            'height:30px;width:auto;display:inline-block;margin:0 auto;' +
            'mix-blend-mode:multiply;');
        }
      }
      /* the title band reads better centred above centred buttons */
      const tb = document.querySelector('.titleband');
      if (tb) tb.setAttribute('style', (tb.getAttribute('style') || '') + ';text-align:center;');

      /* 3. say plainly that this is a copy, and where the live one is */
      const note = document.createElement('p');
      note.setAttribute('style',
        'margin:0 0 14px;padding:9px 12px;border:1.5px solid #00B2C3;border-radius:4px;' +
        'background:#F2FBFC;font-size:10pt;line-height:1.45;color:#21275B;');
      note.innerHTML = '<strong>This is a printed copy.</strong> The links below still work ' +
        'and always open the current version of each guide. For the most up-to-date copy of ' +
        'this letter itself, visit<br><span style="word-break:break-all;">' + base +
        'KORB_Welcome_Letter.html</span>';
      const doc = document.getElementById('doc') || document.body;
      const band = doc.querySelector('.titleband');
      if (band && band.parentNode) band.parentNode.insertBefore(note, band.nextSibling);
      else doc.insertBefore(note, doc.firstChild);

      return { rewritten, already, links: document.querySelectorAll('a[href]').length };
    }, BASE);

    await page.pdf({
      path: path.join(ROOT, b.pdf),
      format: 'Letter', printBackground: true,
      margin: { top: '0.7in', bottom: '0.7in', left: '0.6in', right: '0.6in' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate:
        '<div style="width:100%;padding:0 0.6in;font-family:Helvetica,Arial,sans-serif;">' +
        '<div style="border-top:1.5px solid #00B2C3;padding-top:5px;display:flex;' +
        'justify-content:space-between;font-size:7pt;color:#4A4F6B;">' +
        '<span>KORB Health Medical Texas PA &middot; printed copy &middot; the live version is online</span>' +
        '<span>Page <span class="pageNumber"></span></span></div></div>'
    });
    await page.close();

    const size = fs.statSync(path.join(ROOT, b.pdf)).size;
    console.log('  ' + b.pdf + '  ' + size + ' bytes  ' +
      info.rewritten + ' links made absolute, ' + info.already + ' already absolute, ' +
      info.links + ' total' + (errs.length ? '  PAGE ERRORS: ' + errs.join('; ') : ''));
  }

  await browser.close();
  srv.close();
})();
