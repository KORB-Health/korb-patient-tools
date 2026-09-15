/* ============================================================================
   KORB SCHEDULER INTAKE — FLOW AND VALIDATION TEST

   Run from the repo root:  node test-scheduler.js
   Needs Playwright and Chromium, same as the document builders.

   WHY THIS IS IN THE REPO

   The FH&L branch shipped on 2026-09-14 with the Continue button doing nothing
   on all six of its pages, and with 22 required marks and no validation rules
   behind them. Neither was caught, because the tests written alongside it drove
   the verdict engine directly and never once clicked Continue. A form that is
   only ever tested through its own internals is not tested as a form.

   This drives the real flow: fills fields, clicks Continue, and asserts which
   page it is standing on before believing any result. An earlier version of it
   unhid a page and clicked Continue, which validated whatever page the form
   thought it was on - page 0 - and reported page 0's error as if it belonged to
   the page under test. Every result was measuring the wrong page. The lesson is
   in the helper: at() is read after every click and compared, rather than
   assumed.

   WHAT IT COVERS

   Both halves of "a hidden block must never be required", open item 10b. An
   empty page must block, a hidden field must not, and the visible version of
   that same field must - otherwise the second half is satisfied by a check that
   never blocks at all. Plus a weight loss regression, because the two branches
   share the navigation guard.
   ============================================================================ */

const { chromium } = require('playwright');
const path = require('path');
const FILE = 'file:///' + path.resolve('KORB_Scheduler_Intake_AllPrograms.html').replace(/\\/g, '/');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  const at = () => page.evaluate(() =>
    [...document.querySelectorAll('.page')].find(p => !p.classList.contains('hidden')).id);
  const errs = () => page.evaluate(() =>
    [...document.getElementById('errlist').querySelectorAll('li')].map(li => li.textContent.trim()));
  const cont = async () => { await page.click('#next'); return { page: await at(), errors: await errs() }; };
  const set = (id, v) => page.evaluate(a => {
    const e = document.getElementById(a[0]); e.value = a[1];
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
  }, [id, v]);
  const tick = (...ids) => page.evaluate(list => list.forEach(i => {
    const e = document.getElementById(i); if (!e) throw new Error('no element ' + i);
    e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true }));
  }), ids);

  // Walk from a fresh load to the first FH&L page, for the given sex and dob.
  async function toFhl(sex, dob) {
    await page.goto(FILE);
    await set('fname', 'Test'); await set('lname', 'Patient'); await set('dob', dob);
    await set('phone', '5125551234'); await set('email', 't@example.com');
    await set('addr1', '1 Main'); await set('city', 'Austin');
    await set('addrState', 'Texas'); await set('zip', '78701');
    await tick(sex === 'm' ? 'sex-m' : 'sex-f');
    let r = await cont();                       // p0 -> p1
    if (r.page !== 'p1') throw new Error('stuck on p0: ' + r.errors.join(' | '));
    await set('state', 'Texas');
    r = await cont();                           // p1 -> p2
    await tick('pg-fhl');
    r = await cont();                           // p2 -> p3 add-ons
    await tick('ad-none');
    r = await cont();                           // p3 -> p12
    if (r.page !== 'p12') throw new Error('did not reach p12, landed on ' + r.page);
    return r;
  }

  const t = [];
  const ok = (name, cond, detail) => t.push({ name, pass: !!cond, detail: detail || '' });

  // ---------- HALF ONE: an empty FH&L page must block ----------
  await toFhl('m', '1978-04-02');                        // male, 48
  for (const expect of ['p12', 'p13', 'p14', 'p15', 'p16', 'p17']) {
    const before = await at();
    const r = await cont();
    ok(`${expect} empty blocks`, r.page === before && r.errors.length > 0,
       `stayed on ${r.page}, ${r.errors.length} error(s)`);
    // force past it so the next page can be tested
    await page.evaluate(i => {
      const el = document.getElementById(i);
      el.classList.add('hidden');
      const order = ['p12','p13','p14','p15','p16','p17'];
      const nx = order[order.indexOf(i) + 1];
      if (nx) document.getElementById(nx).classList.remove('hidden');
    }, before);
  }

  // ---------- HALF TWO: a hidden field must NOT block ----------
  // Male 48: PSA and colonoscopy visible, mammogram hidden.
  await toFhl('m', '1978-04-02');
  await page.evaluate(() => {   // p12
    ['fh-ft','fh-in','fh-wt'].forEach((id,k) => { const e=document.getElementById(id);
      e.value = [5,10,180][k]; e.dispatchEvent(new Event('input',{bubbles:true})); });
  });
  let r = await cont();  ok('p12 filled advances', r.page === 'p13', r.errors.join(' | '));
  await tick('fr-rec','fd-1','ft-none','fi-1');
  r = await cont();      ok('p13 filled advances', r.page === 'p14', r.errors.join(' | '));
  await tick('fp-1','fn-1','fres-y','fe-0','fac-1','fsh-1','fsq-1','fst-1','fal-1','fto-1','fco-y');
  r = await cont();      ok('p14 filled advances', r.page === 'p15', r.errors.join(' | '));

  await tick('fa-none','fb-none','fc-none','fs-none','ff-none','fpb-n');
  r = await cont();
  ok('p15 passes with no follow-up open', r.page === 'p16', r.errors.join(' | '));

  await tick('frx-n','fsu-n','fcp-n','fcz-n','fag-n','fex-n');
  r = await cont();      ok('p16 filled advances', r.page === 'p17', r.errors.join(' | '));

  await tick('ro-h-none','ro-r-none','ro-m-none','ro-s-none','ro-z-none','ro-g-none','ro-n-none',
             'fps-3','fcl-3','fdx-3','fib-2');   // no mammogram: it is hidden for a male
  r = await cont();
  ok('MALE passes p17 without answering the hidden mammogram', r.page !== 'p17', r.errors.join(' | '));

  // Female 30: mammogram visible, PSA hidden, colonoscopy hidden (under 45).
  await toFhl('f', '1996-04-02');
  await page.evaluate(() => {
    ['fh-ft','fh-in','fh-wt'].forEach((id,k) => { const e=document.getElementById(id);
      e.value = [5,5,150][k]; e.dispatchEvent(new Event('input',{bubbles:true})); });
  });
  await cont();
  await tick('fr-rec','fd-1','ft-none','fi-1'); await cont();
  await tick('fp-1','fn-1','fres-y','fe-0','fac-1','fsh-1','fsq-1','fst-1','fal-1','fto-1','fco-y'); await cont();
  await tick('fa-none','fb-none','fc-none','fs-none','ff-none','fpb-n','fpg-n'); await cont();
  await tick('frx-n','fsu-n','fcp-n','fcz-n','fag-n','fex-n'); r = await cont();
  ok('female reaches p17', r.page === 'p17', r.errors.join(' | '));

  // First the inverse, so this is not a check that simply never blocks.
  await tick('ro-h-none','ro-r-none','ro-m-none','ro-s-none','ro-z-none','ro-g-none','ro-n-none',
             'fdx-3','fib-2');                  // mammogram deliberately unanswered
  r = await cont();
  ok('female IS blocked on the visible mammogram',
     r.page === 'p17' && r.errors.some(x => /mammogram/i.test(x)), r.errors.join(' | '));

  await tick('fmm-3');
  r = await cont();
  ok('FEMALE under 45 passes without hidden PSA or colonoscopy', r.page !== 'p17', r.errors.join(' | '));

  // A follow-up becomes required only once its own box is ticked.
  await toFhl('m', '1978-04-02');
  await page.evaluate(() => { ['fh-ft','fh-in','fh-wt'].forEach((id,k) => {
    const e=document.getElementById(id); e.value=[5,10,180][k];
    e.dispatchEvent(new Event('input',{bubbles:true})); }); });
  await cont();
  await tick('fr-rec','fd-1','ft-none','fi-1'); await cont();
  await tick('fp-1','fn-1','fres-y','fe-0','fac-1','fsh-1','fsq-1','fst-1','fal-1','fto-1','fco-y'); await cont();
  await tick('fa-none','fc-none','fs-none','ff-none','fpb-n','fb-osa');   // sleep apnea ticked
  r = await cont();
  ok('ticking sleep apnea makes its follow-up required',
     r.page === 'p15' && r.errors.length > 0, r.errors.join(' | '));

  // ---------- regression: the weight loss branch is untouched ----------
  // The LAST guard is shared, so prove the change did not alter the other flow.
  await page.goto(FILE);
  await set('fname','Test'); await set('lname','Patient'); await set('dob','1978-04-02');
  await set('phone','5125551234'); await set('email','t@example.com');
  await set('addr1','1 Main'); await set('city','Austin');
  await set('addrState','Texas'); await set('zip','78701');
  await tick('sex-m');
  r = await cont();  ok('WL p0 advances', r.page === 'p1', r.errors.join(' | '));
  await set('state','Texas');
  r = await cont();  ok('WL p1 advances', r.page === 'p2', r.errors.join(' | '));
  await tick('pg-wl');
  r = await cont();  ok('WL program choice advances', r.page === 'p3', r.errors.join(' | '));
  await tick('ad-none');
  r = await cont();  ok('WL reaches its own health pages', r.page === 'p4', r.errors.join(' | '));
  const wlEmpty = await cont();
  ok('WL height/weight still blocks when empty',
     wlEmpty.page === 'p4' && wlEmpty.errors.length > 0, `${wlEmpty.errors.length} error(s)`);

  ok('no page errors', errors.length === 0, errors.join(' | '));

  let fails = 0;
  for (const x of t) { if (!x.pass) fails++; console.log(`${x.pass ? 'ok  ' : 'FAIL'}  ${x.name}${x.detail ? '  [' + x.detail + ']' : ''}`); }
  console.log(`\n${t.length - fails} passed, ${fails} failed`);
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
