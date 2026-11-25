/* korb-feedback.js - the "Tell us what you think" footer for HAND-BUILT patient
   pages. Kris Mulkey's hub review, 2026-09-25; house rule since 2026-09-26:
   every patient-facing page ends with it (see CLAUDE.md).

   Generated pages do not use this file. build-patient-ed.js renders their
   footer from shared.feedback in korb-patient-ed-data.js, which is 180KB of
   handout prose - too much for a tool a patient opens on a phone to load for
   one button. So the four values below are a SECOND copy of shared.feedback,
   and check-feedback.js fails if the two ever differ. Change both together.

   Use: one tag, last thing before </body>, naming the page:
     <script src="korb-feedback.js" data-page="My Peptide Tracker"></script>
   The page name pre-fills the form, so responses arrive sorted by page.
   The footer goes at the end of the page's .wrap column, hidden in print. */
(function () {
  var F = {
    heading: 'Help us make KORB better',
    lead: 'Your experience matters to us. If something was especially helpful, confusing, frustrating, or you have an idea that could make your experience better, we want to hear it. Please do not include your name or any health details. For questions about your care, call our Care Team at (888) 959-7299 or email info@korbhealth.com.',
    label: 'Share your feedback →',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSeLCEIpK8ae1Xud7d4UqeATkqb45gW-wO0lFVxToTUROQ8_Qw/viewform',
    pageField: 'entry.1732430176'
  };
  if (typeof window === 'undefined') { module.exports = F; return; }

  var me = document.currentScript;
  var page = (me && me.getAttribute('data-page')) || document.title;

  function render() {
    if (document.querySelector('.k-feedback')) { return; }
    var css = document.createElement('style');
    /* Website look, 2026-11-20: serif heading over a hairline and a navy pill,
       matching SITE in build-patient-ed.js and korb-site.css. Every page that
       loads this file is patient-facing. The fonts come from the page (DM Sans
       and Cormorant via korb-site.css); without them it falls back cleanly. */
    css.textContent =
      '.k-feedback{margin:40px 0 8px;padding-top:18px;border-top:1px solid #E4E6EE;' +
      'font-family:"DM Sans",Arial,sans-serif;}' +
      '.k-feedback h2{margin:0 0 10px;background:none;color:#21275B;font-size:clamp(26px,3.4vw,30px);font-weight:700;' +
      'font-family:Cormorant,Georgia,"Times New Roman",serif;line-height:1.15;' +
      'padding:0 0 7px;border-bottom:1px solid #E4E6EE;}' +
      '.k-feedback p{margin:0 0 14px;font-size:16px;line-height:1.6;color:#5A6080;}' +
      '.k-feedback a{display:block;box-sizing:border-box;width:100%;max-width:420px;margin:0 auto;' +
      'padding:12px 18px;min-height:44px;text-align:center;background:#21275B;color:#fff;' +
      'border:2px solid #21275B;border-radius:999px;text-decoration:none;font-weight:600;font-size:16px;}' +
      '.k-feedback a:focus-visible{outline:3px solid #00B2C3;outline-offset:2px;}' +
      '@media (hover:hover){.k-feedback a:hover{background:#00B2C3;color:#21275B;border-color:#00B2C3;}}' +
      '@media print{.k-feedback{display:none;}}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.className = 'k-feedback';
    var h = document.createElement('h2'); h.textContent = F.heading;
    var p = document.createElement('p'); p.textContent = F.lead;
    var a = document.createElement('a');
    a.target = '_blank'; a.rel = 'noopener';
    a.href = F.url + '?usp=pp_url&' + F.pageField + '=' + encodeURIComponent(page);
    a.textContent = F.label;
    box.appendChild(h); box.appendChild(p); box.appendChild(a);

    /* LegitScript seal, 2026-11-24. OPT-IN: only a page whose tag carries
       data-seal="legitscript" shows it, and it is refused anyway if the page
       names a peptide. Never add the attribute to a Functional Health &
       Longevity page. Same rule and link as patient-ed-render.js. */
    /* The seal goes AFTER the feedback block, not inside it: inside, the
       '.k-feedback a' rule turned it into a big navy pill (Don, 2026-11-25). */
    var seal = null;
    if (me && me.getAttribute('data-seal') === 'legitscript' &&
        !/peptide|sermorelin|tesamorelin|ipamorelin|bpc-?157|ghk-?cu|longevity/i.test(document.body.innerText || '')) {
      css.textContent += '.k-seal{display:block;width:max-content;margin:18px auto 8px;line-height:0;background:none;border:0;padding:0;}' +
        '@media print{.k-seal{display:none;}}' +
        '.k-seal img{width:73px;height:auto;}';
      var s = document.createElement('a');
      s.className = 'k-seal'; s.target = '_blank'; s.rel = 'noopener';
      s.href = 'https://www.legitscript.com/websites/?checker_keywords=korbhealth.com';
      s.title = 'Verify LegitScript certification for korbhealth.com';
      s.setAttribute('data-korb-count', 'legitscript');
      var im = document.createElement('img');
      im.src = 'https://korb-health.github.io/korb-patient-tools/img/legitscript-certified.png';
      im.alt = 'LegitScript Certified. Verify certification for korbhealth.com';
      im.width = 73; im.height = 79; im.loading = 'lazy';
      s.appendChild(im); seal = s;
    }

    var cols = document.querySelectorAll('body > .wrap');
    var col = cols.length ? cols[cols.length - 1] : document.body;
    col.appendChild(box);
    if (seal) { col.appendChild(seal); }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', render); }
  else { render(); }
})();
