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
    lead: 'Your experience matters to us. If something was especially helpful, confusing, frustrating, or you have an idea that could make your experience better, we want to hear it. Please do not include your name or any health details. For questions about your care, call our Care Team at 888-959-7299 or email info@korbhealth.com.',
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
      '.k-feedback h2{margin:0 0 10px;background:none;color:#21275B;font-size:28px;font-weight:700;' +
      'font-family:Cormorant,Georgia,"Times New Roman",serif;line-height:1.15;' +
      'padding:0 0 7px;border-bottom:1px solid #E4E6EE;}' +
      '.k-feedback p{margin:0 0 14px;font-size:14px;line-height:1.6;color:#5A6080;}' +
      '.k-feedback a{display:block;box-sizing:border-box;width:100%;max-width:420px;margin:0 auto;' +
      'padding:12px 18px;min-height:44px;text-align:center;background:#21275B;color:#fff;' +
      'border:2px solid #21275B;border-radius:999px;text-decoration:none;font-weight:600;font-size:15px;}' +
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

    var cols = document.querySelectorAll('body > .wrap');
    (cols.length ? cols[cols.length - 1] : document.body).appendChild(box);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', render); }
  else { render(); }
})();
