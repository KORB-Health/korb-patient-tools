/* ============================================================================
   KORB HEALTH: PAGE AND CLICK COUNTER (GoatCounter, cookieless)

   WHY. Don, 20 Nov 2026: nobody could say whether patients use the Patient Hub,
   which guides and videos they open, or whether providers send the hub link or
   the older email. GitHub Pages keeps no visitor statistics, so the hub counts
   for itself.

   WHAT IS SENT, and nothing else:
     - the page path, and for clicks a short label: the guide, tool or video
       name, or "call" / "email" / "portal" for contact links
     - where the visit came from (referrer), and a campaign tag if the link
       carried one, such as ?utm_source=provider
     - screen size, browser and country, which GoatCounter derives itself
   NOT sent: names, anything typed into a calculator or form, phone numbers or
   addresses. GoatCounter sets no cookies and does not store IP addresses.
   Approved by Don as Privacy Officer, 20 Nov 2026. If any of this list
   changes, the privacy line in the hub footer has to change with it.

   OPT OUT. A browser with Do Not Track or Global Privacy Control turned on is
   never counted. Neither is localhost, so testing does not pollute the numbers.

   ON SINCE 21 NOV 2026. Don created korbhub.goatcounter.com; the dashboard is
   there. Set SITE back to '' to switch counting off; with no SITE this file
   does nothing at all.
   ========================================================================== */
(function () {
  'use strict';

  var SITE = 'korbhub';   // korbhub.goatcounter.com, account created by Don 21 Nov 2026

  var nav = window.navigator || {};
  var optedOut = nav.doNotTrack === '1' || window.doNotTrack === '1' ||
                 nav.globalPrivacyControl === true;
  var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ||
              location.protocol === 'file:';
  if (!SITE || optedOut || local) return;

  window.goatcounter = { no_onload: false };
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + SITE + '.goatcounter.com/count');
  document.head.appendChild(s);

  /* A short, non-personal label for whatever was clicked. Links to our own
     pages are named by file; contact links by type only, never the number. */
  function label(el) {
    if (el.dataset && el.dataset.korbCount) return el.dataset.korbCount;
    var href = el.getAttribute && el.getAttribute('href');
    if (href) {
      if (/^tel:/i.test(href)) return 'call';
      if (/^mailto:/i.test(href)) return 'email';
      if (/kareo\.com/i.test(href)) return 'portal';
      if (/docs\.google\.com\/forms/i.test(href)) return 'feedback';
      if (href.charAt(0) === '#') return 'section ' + href.slice(1);
      var file = href.split(/[?#]/)[0].split('/').pop();
      if (file) return 'open ' + file.replace(/\.html$/i, '');
      try { return 'open ' + new URL(href, location.href).hostname; } catch (e) {}
    }
    /* Video play buttons carry aria-label "Play: <video name>" (korb-video.js). */
    var aria = el.getAttribute && el.getAttribute('aria-label');
    if (aria) return 'tap ' + aria.slice(0, 60);
    var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    return t ? 'tap ' + t.slice(0, 60) : '';
  }

  /* WINDOW, capture phase. The hub's own in-page link handler sits on document
     in capture and calls stopImmediatePropagation, so a listener on document
     never heard the programme and Guides taps. Window capture runs first. */
  window.addEventListener('click', function (ev) {
    var el = ev.target.closest && ev.target.closest('a[href], button, [data-korb-count]');
    if (!el) return;
    var name = label(el);
    if (!name || !window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count({ path: 'click: ' + name, title: document.title, event: true });
  }, true);
}());
