/*
   KORB HEALTH — "MY GLP-1 MEDICATION" CHOOSER (Patient_Education/KORB_My_GLP1.html)

   Don, 2026-10-25: a patient should not have to know their product to find
   their page. They pick their state, then compounded or name-brand, and see only
   what KORB sends to that state. Each compounded choice opens its own medication
   page, which then asks for the dose from the label.

   Nothing is typed here. The states are KORB_GLP1.states.korbActive, the
   pharmacy is KORB_GLP1.states.routeTo (one per state, no backup), the products
   are those in farmakeioConversion.patientPages made by that pharmacy, and the
   brand list and its states are KORB_GLP1.brandRules. ?state=TX opens with the
   state chosen, so a text snippet can link straight to a state.

   Load order: korb-pharmacies.js, korb-glp1-data.js, then this file.
*/
(function () {
  var host = document.getElementById('page');
  if (!host) return;
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  if (typeof KORB_GLP1 === 'undefined' || typeof KORB_PHARMACIES === 'undefined') {
    host.innerHTML = '<div class="kmp-box red"><strong>This page could not load.</strong> Please contact KORB at (888) 959-7299.</div>';
    return;
  }
  var G = KORB_GLP1, P = KORB_PHARMACIES, PAGES = G.farmakeioConversion.patientPages;
  var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
  var isOral = function (p) { return !(p.doses[0] && p.doses[0].units !== undefined); };

  /* A plain name a patient can match to their label. */
  function plainName(p) {
    var a = p.additive || '', extra = [];
    if (/B-?6|pyridox/i.test(a)) extra.push('vitamin B-6');
    if (/glycine/i.test(a)) extra.push('glycine');
    return cap(p.drug) + (isOral(p) ? ' tablets' : ' injection') + (extra.length ? ' with ' + extra.join(' and ') : '');
  }
  function sub(p) {
    if (isOral(p)) return 'Dissolved under your tongue, once a day';
    var a = /B-?6|pyridox/i.test(p.additive || '') ? 'vitamin B-6'
          : /carn/i.test(p.additive || '') ? 'L-carnitine' : 'vitamin B-12';
    return 'Weekly injection, with ' + a + (/glycine/i.test(p.additive || '') ? ' and glycine' : '');
  }

  var qs = {};
  location.search.replace(/^\?/, '').split('&').forEach(function (kv) {
    var i = kv.indexOf('='); if (i > 0) qs[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
  });
  var states = (G.states.korbActive || []).slice().sort();
  var S = { state: states.indexOf(String(qs.state || '').toUpperCase()) !== -1 ? String(qs.state).toUpperCase() : '', kind: qs.kind === 'brand' ? 'brand' : qs.kind === 'compounded' ? 'compounded' : '' };
  var brandStates = (G.brandRules && G.brandRules.availableStates) || [];

  function render() {
    var h = '<div class="kmp-title"><h1>Your GLP-1 medication</h1><p>Find the instructions for the medication you were prescribed.</p></div>';
    h += '<div class="kmp-step"><label for="kmcState"><strong>1. Your state</strong></label>' +
         '<select id="kmcState" class="kmp-select"><option value="">Select your state...</option>' +
         states.map(function (s) { return '<option value="' + s + '"' + (s === S.state ? ' selected' : '') + '>' + esc(P.stateName(s)) + '</option>'; }).join('') +
         '</select></div>';
    if (S.state) {
      var brandOk = brandStates.indexOf(S.state) !== -1;
      h += '<div class="kmp-step"><strong>2. Your medication type</strong><div class="kmc-two">' +
           '<button type="button" class="kmc-opt' + (S.kind === 'compounded' ? ' on' : '') + '" data-kind="compounded">Compounded<span>Made by a KORB pharmacy and shipped to you</span></button>' +
           '<button type="button" class="kmc-opt' + (S.kind === 'brand' ? ' on' : '') + '" data-kind="brand"' + (brandOk ? '' : ' disabled') + '>Name-brand<span>' +
             (brandOk ? 'Zepbound, Wegovy or Foundayo' : 'Not offered through KORB in ' + esc(P.stateName(S.state))) + '</span></button>' +
           '</div><p class="kmp-fine">Not sure? Your prescription label names the pharmacy. A label from Premier Pharmacy or Belmar Pharmacy is compounded.</p></div>';
    }
    if (S.state && S.kind === 'compounded') {
      var route = G.states.routeTo(S.state);
      var ph = route && (G.pharmacies[route.pharmacy] || {}).name;
      var list = Object.keys(PAGES).filter(function (k) { return G.products[k] && route && G.products[k].pharmacy === route.pharmacy; });
      /* Plain injections first, then glycine, then B-6, then tablets. */
      var rank = function (k) { var p = G.products[k], a = p.additive || '';
        return (isOral(p) ? 30 : /B-?6|pyridox/i.test(a) ? 20 : /glycine/i.test(a) ? 10 : 0) + (p.drug === 'tirzepatide' ? 1 : 0); };
      list.sort(function (x, y) { return rank(x) - rank(y); });
      h += '<div class="kmp-step"><strong>3. Your medication</strong>' +
           '<p>In ' + esc(P.stateName(S.state)) + ', KORB prescriptions are filled by <strong>' + esc(ph) + '</strong>. Pick the one that matches your label.</p>' +
           '<div class="kmc-list">' + list.map(function (k) {
             var p = G.products[k];
             return '<a class="kmc-med" href="' + esc(PAGES[k].replace(/^Patient_Education\//, '')) + '">' + esc(plainName(p)) + '<span>' + esc(sub(p)) + '</span></a>';
           }).join('') + '</div></div>';
    }
    if (S.state && S.kind === 'brand') {
      h += '<div class="kmp-step"><strong>3. Your name-brand medication</strong>' +
           '<p>Name-brand medications come from the maker’s own program or a local pharmacy, with the maker’s instructions in the box. Follow those instructions and your provider’s directions.</p>' +
           '<p>For how GLP-1 medication works, side effects and when to get help:</p>' +
           '<p><a class="kmp-btn" href="KORB_Patient_Ed_Semaglutide.html">Semaglutide guide (Wegovy)</a> ' +
           '<a class="kmp-btn" href="KORB_Patient_Ed_Tirzepatide.html">Tirzepatide guide (Zepbound)</a></p></div>';
    }
    h += '<div class="kmp-box teal"><strong>Still using medication from FarmaKeio?</strong> Keep using your FarmaKeio instructions until that supply is finished. ' +
         '<a href="../KORB_GLP1_Dose_Guide.html">Open the dose guide</a> for FarmaKeio doses.</div>';
    h += '<p class="kmp-fine">General information for KORB patients. Your prescription label and your KORB provider are always the final word on your dose.</p>';
    host.innerHTML = h;

    document.getElementById('kmcState').addEventListener('change', function (e) { S.state = e.target.value; S.kind = ''; render(); });
    [].forEach.call(host.querySelectorAll('[data-kind]'), function (b) {
      b.addEventListener('click', function () { S.kind = b.getAttribute('data-kind'); render(); });
    });
  }
  render();
}());
