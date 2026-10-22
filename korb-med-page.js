/*
   KORB HEALTH — "MY GLP-1 MEDICATION" PATIENT PAGE

   One renderer for every per-product patient page. Each page is a small shell
   that names its product:

     <script src="../korb-med-page.js" data-product="premier_sema"></script>

   and the page reads ?dose= (and, for a patient switching from FarmaKeio,
   ?was=) from its own link. A provider sends that link through the patient
   portal, the patient pastes it into a browser, and the page opens at their
   dose with nothing to choose. Built 2026-10-22 for the FarmaKeio conversion
   (Don), to stay useful for any Premier or Belmar patient afterwards.

   EVERY FACT IS READ, NONE IS TYPED HERE. The dose, units, concentration,
   additive and pharmacy come from korb-glp1-data.js; the syringe drawing from
   korb-syringe.js; storage and contact details from korb-patient-ed-data.js.
   The link carries a dose and nothing about the patient: the public pages
   carry nothing patient-specific (CLAUDE.md).

   Load order: korb-pharmacies.js, korb-glp1-data.js, korb-syringe.js,
   korb-quest.js, korb-patient-ed-data.js, then this file.
*/
(function () {
  var me = document.currentScript;
  var KEY = me && me.getAttribute('data-product');
  var host = document.getElementById('page');

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fail(msg) {
    host.innerHTML = '<div class="kmp-box red"><strong>This page could not load.</strong> ' + esc(msg) +
      ' Please contact KORB at (888) 959-7299 before your next dose.</div>';
  }
  if (!host) return;
  if (typeof KORB_GLP1 === 'undefined' || typeof KORB_SYRINGE === 'undefined' ||
      typeof KORB_PATIENT_ED === 'undefined') {
    return fail('A file it needs did not load.');
  }
  var G = KORB_GLP1, P = G.products[KEY];
  if (!P) return fail('Unknown medication "' + KEY + '".');

  var oral = !(P.doses[0] && P.doses[0].units !== undefined);
  var pharmacy = (G.pharmacies[P.pharmacy] || {}).name || P.pharmacy;
  var drug = P.drug.charAt(0).toUpperCase() + P.drug.slice(1);
  var addName = /B-?6|pyridox/i.test(P.additive || '') ? 'vitamin B-6'
              : /B-?12|cobalamin/i.test(P.additive || '') ? 'vitamin B-12'
              : /carn/i.test(P.additive || '') ? 'L-carnitine' : '';
  var num = function (d) { return String(d.dose).replace(/\s*mg\s*$/i, ''); };

  /* window.__KORB_MED_SEARCH is set only by artifact-signoff.js, which renders
     every dose of a page in one browser tab to fingerprint it. A patient's
     link is always read from location.search. */
  var qs = {};
  (window.__KORB_MED_SEARCH || location.search).replace(/^\?/, '').split('&').forEach(function (kv) {
    var i = kv.indexOf('='); if (i > 0) qs[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
  });
  var dose = P.doses.filter(function (d) { return num(d) === qs.dose; })[0] || null;

  /* The FarmaKeio product this one replaces, for the "what changed" box. */
  var conv = G.farmakeioConversion, fromProd = null, was = null;
  if (conv && qs.was) {
    conv.rules.forEach(function (r) {
      var hit = Object.keys(r.to).some(function (k) { return r.to[k] === KEY; }) ||
                Object.keys(r.b6 || {}).some(function (k) { return r.b6[k] === KEY; });
      if (hit) fromProd = G.products[r.from];
    });
    if (fromProd) was = fromProd.doses.filter(function (d) { return num(d) === qs.was; })[0] || null;
  }

  document.title = 'Your ' + drug + (oral ? ' (oral)' : '') + ' from ' + pharmacy + ' | KORB Health';
  var h = '';
  h += '<div class="kmp-title"><h1>Your ' + esc(drug) + (oral ? ' tablets' : '') + '</h1>' +
       '<p>from ' + esc(pharmacy) + (addName ? ', with ' + esc(addName) : '') + '</p></div>';

  if (!dose) {
    h += '<div class="kmp-box teal"><strong>Choose your dose</strong> from your prescription label.' +
         '<select id="kmpDose" class="kmp-select"><option value="">Select your weekly dose...</option>' +
         P.doses.map(function (d) { return '<option value="' + esc(num(d)) + '">' + esc(d.dose) + (oral ? ' daily' : ' once a week') + '</option>'; }).join('') +
         '</select></div>';
    host.innerHTML = h;
    document.getElementById('kmpDose').addEventListener('change', function (e) {
      if (!e.target.value) return;
      var q = '?dose=' + encodeURIComponent(e.target.value) + (qs.was ? '&was=' + encodeURIComponent(qs.was) : '');
      location.search = q;
    });
    return;
  }

  /* 1. THE DOSE. The one thing a patient must get right, so it comes first. */
  if (oral) {
    var sig = String((dose.rx || {}).ptInstructions || '').toLowerCase()
      .replace(/(^|\.\s+)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); })
      .replace(/\b1\/2\b/g, 'half a').replace(/\bmin\b/g, 'minutes');
    h += '<div class="kmp-dose"><div class="kmp-lbl">Your daily dose</div><div class="kmp-big">' + esc(dose.dose) + '</div>' +
         '<p class="kmp-how">' + esc(sig) + '</p></div>';
  } else {
    var mgPerMl = Math.round(dose.mg * 100 / dose.units * 10) / 10;
    h += '<div class="kmp-dose"><div class="kmp-row">' +
         '<div><div class="kmp-lbl">Your weekly dose</div><div class="kmp-big">' + esc(dose.dose) + '</div></div>' +
         '<div><div class="kmp-lbl">Draw to</div><div class="kmp-big teal">' + esc(dose.units) + ' units</div></div></div>' +
         KORB_SYRINGE.svg(dose.units, '#00B2C3') +
         (dose.units > 100 ? '<p class="kmp-how"><strong>This dose takes two syringes.</strong> Fill the first one completely (100 units), then fill the second to ' + esc(dose.units - 100) + ' units.</p>'
                           : '<p class="kmp-how">Draw to the <strong>' + esc(dose.units) + '</strong> line on a standard 100-unit insulin syringe, once a week.</p>') +
         '</div>';
    h += '<div class="kmp-box teal"><strong>Units are not milligrams.</strong> Units are the marks on your syringe. Always draw to the units number on this page and on your label, never to the mg number.</div>';
  }

  /* 2. WHAT CHANGED, only for a patient switching from FarmaKeio. */
  if (was) {
    if (oral) {
      /* Same mg is not the same tablet: Belmar's 0.5 mg is HALF of a 1 mg
         tablet, where FarmaKeio's was one whole tablet. Say so when the
         directions differ, because that is the mistake a patient would make. */
      var oldSig = String((was.rx || {}).ptInstructions || '').toUpperCase();
      var newSig = String((dose.rx || {}).ptInstructions || '').toUpperCase();
      h += '<div class="kmp-box amber"><strong>Switching from FarmaKeio.</strong> Your dose stays ' + esc(dose.dose) + ' a day. ' +
           (oldSig && newSig && oldSig !== newSig
             ? '<p><strong>How you take it has changed.</strong> Follow the directions above and on your new label, not your old FarmaKeio directions.</p>'
             : 'Your new tablets may look different, so follow the directions on your new label.') + '</div>';
    } else {
      var same = was.units === dose.units;
      h += '<div class="kmp-box amber"><strong>Switching from FarmaKeio? Read this first.</strong>' +
           '<table class="kmp-cmp"><tr><th></th><th>Dose</th><th>Draw to</th></tr>' +
           '<tr><td>Before, FarmaKeio</td><td>' + esc(was.dose) + '</td><td>' + esc(was.units) + ' units</td></tr>' +
           '<tr class="now"><td>Now, ' + esc(pharmacy) + '</td><td>' + esc(dose.dose) + '</td><td>' + esc(dose.units) + ' units</td></tr></table>' +
           (same
             ? '<p>The number of units is the same as before, but your new medication is a different strength, so the same units now give you ' + esc(dose.dose) + '. That is expected.</p>'
             : '<p><strong>Your number of units has changed.</strong> Draw to ' + esc(dose.units) + ' units, not your old ' + esc(was.units) + '.</p>') +
           '<p>Do not use these instructions with an old FarmaKeio vial. Use them only with your new ' + esc(pharmacy) + ' medication.</p></div>';
    }
  }

  /* 3. WHAT IS IN IT, and what the label shows. */
  if (oral) {
    h += '<h2>What is in it</h2><p>' + esc(drug) + ', taken by mouth and dissolved under your tongue. ' +
         'Your label from ' + esc(pharmacy) + ' shows your name, the medication and strength, and how to take it.</p>';
  } else {
    h += '<h2>What is in your vial</h2><p>Each mL holds ' + esc(drug.toLowerCase()) + ' ' + esc(mgPerMl) + ' mg' +
         (addName ? ', with ' + esc(addName) + ' added' : '') + '. ' +
         'It is given once a week as an injection just under the skin.</p>' +
         '<h2>Your label</h2><p>Your label from ' + esc(pharmacy) + ' shows your name, the medication and its strength, your dose, and the date it was made. ' +
         '<strong>If your label says something different from this page, follow your label and contact KORB.</strong></p>';
  }

  /* 4. STORAGE, from the shared patient wording. Injectables only. */
  var S = (KORB_PATIENT_ED.shared || {}).storage;
  if (!oral && S) {
    h += '<h2>Storing your medication</h2><div class="kmp-cards">' + S.cards.map(function (c) {
      return '<div><strong>' + esc(c[0]) + '</strong><span>' + esc(c[1]) + '</span></div>'; }).join('') + '</div>' +
      '<ul>' + S.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>';
  }

  h += '<h2>More help</h2><p>' +
       (oral ? '' : '<a class="kmp-btn" href="KORB_Injection_Storage_Safety_Guide.html">Injection and storage guide</a> ') +
       '<a class="kmp-btn" href="KORB_When_to_Contact_KORB_or_ER.html">When to contact KORB or the ER</a></p>';

  /* 5. CONTACT, from shared.contact. */
  var C = (KORB_PATIENT_ED.shared || {}).contact || {};
  var ways = [].concat((C.operations || {}).ways || [], (C.portal || {}).ways || []);
  if (ways.length) {
    h += '<h2>Questions? Contact KORB</h2><ul class="kmp-ways">' + ways.map(function (w) {
      return '<li><span>' + esc(w.label) + '</span>' + (w.href ? '<a href="' + esc(w.href) + '">' + esc(w.value) + '</a>' : esc(w.value)) + '</li>';
    }).join('') + '</ul>';
  }
  h += '<p class="kmp-fine">General information for KORB patients. Your prescription label and your KORB provider are always the final word on your dose.</p>';
  host.innerHTML = h;
}());
