/* ============================================================================
   KORB HEALTH — QUEST DIAGNOSTICS, THE SHARED LAB-SCHEDULING LAYER

   SOURCE OF TRUTH for where a patient books a lab draw and how they get the
   MyQuest app. Four URLs and the words on the buttons, and nothing else.

   WHY ITS OWN FILE, and not korb-patient-ed-data.js.

   Two pages need these facts: KORB_Schedule_Your_Lab_Appointment.html, and
   KORB_Patient_Treatment_Schedule.html, which is the page the Functional Health
   and Longevity welcome letter actually links to and which Don confirmed on
   2026-09-18 is the one to keep. The second is a tool a patient opens every
   week on a phone, and it already loads korb-pharmacies.js and
   korb-dosing-data.js. Putting these four URLs in korb-patient-ed-data.js would
   have made that tool download 184KB of handout prose to render one info box.

   That is the repo's own rule applied rather than dodged: the problem is never
   too many files, it is the same fact in more than one file. This is the
   smallest file that makes the fact appear once.

   WHERE THEY CAME FROM. These are the link annotations of
   KORB_Schedule_Your_Lab_Appointment.pdf, retired on 2026-09-17 with the other
   42 and recovered from git on 2026-09-18. They were read out of the PDF rather
   than retyped. Do NOT take the rest of that document as a model - its running
   header says KORB Health Group, the MSO, which is the fault open item 1b fixed
   across the clinical set.
   ============================================================================ */
(function (root) {
  'use strict';

  var KORB_QUEST = {
    meta: {
      version: '1.0',
      vendor: 'Quest Diagnostics',
      note: 'Recovered from the retired lab-scheduling PDF, 2026-09-18.'
    },

    /* A patient GOES to each of these, so each is a button wherever it renders.
       label is what the button says; a URL is not a button label. */
    book: {
      label: 'Schedule my appointment',
      href: 'https://appointment.questdiagnostics.com/',
      note: 'Book your lab draw at Quest Diagnostics. It takes about a minute.'
    },
    findLocation: {
      label: 'Find a Quest location near me',
      href: 'https://appointment.questdiagnostics.com/find-location/as-location-finder',
      note: 'Search by address or ZIP code for the sites nearest you.'
    },

    /* One set, two choices - the same shape as picking a tier or a handout, so
       it renders through the shared panel rather than as two loose buttons. */
    app: {
      label: 'Download the MyQuest app',
      note: 'free, from your phone’s app store',
      choices: [
        { label: 'iPhone (iOS)',
          href: 'https://apps.apple.com/us/app/myquest-for-patients/id748920931' },
        { label: 'Android',
          href: 'https://play.google.com/store/apps/details?id=com.myquest' }
      ]
    },

    /* The MyQuest web portal, for a patient who would rather not install the
       app. This one came from KORB_Patient_Treatment_Schedule.html, which had
       it and which the retired PDF did not - so neither source was complete and
       merging them was the point of this file. */
    results: {
      label: 'View my results online',
      href: 'https://myquest.questdiagnostics.com/web/home',
      note: 'The MyQuest web portal, if you would rather not install the app.'
    },

    walkIn: 'Most Quest locations also accept walk-ins, though we recommend ' +
            'calling your nearest location first to confirm availability and hours.',

    /* TWO BOOKING URLS EXISTED and this file holds one. The retired PDF linked
       the root, the Treatment Schedule linked /as-home. Both are Quest's own
       domain and both return 403 to a scripted request, which is bot blocking
       rather than a broken link, so neither could be told apart from the
       outside on 2026-09-18. The root is kept because a root URL outlives a
       deep path. If the deep link turns out to land somewhere better, change it
       HERE and both pages follow. */
    bookAlternate: 'https://appointment.questdiagnostics.com/as-home',

    /* Every assertion here has been seen to fail. A file whose whole job is to
       hold four URLs is exactly the kind that rots quietly: a typo in a scheme,
       a label that is really a URL, an app store entry with one arm missing. */
    selfCheck: function () {
      var problems = [];
      var self = this;
      ['book', 'findLocation'].forEach(function (k) {
        var d = self[k];
        if (!d || !d.href) { problems.push(k + ': no href'); return; }
        if (!/^https:\/\//.test(d.href)) { problems.push(k + ': not https'); }
        if (!d.label) { problems.push(k + ': no label'); }
        if (/^https?:/i.test(d.label || '')) {
          problems.push(k + ': the label is a URL, not a label');
        }
      });
      if (!self.app || !self.app.choices || self.app.choices.length !== 2) {
        problems.push('app: expected exactly two store links, iOS and Android');
      } else {
        var hosts = self.app.choices.map(function (c) { return c.href; }).join(' ');
        if (hosts.indexOf('apps.apple.com') < 0) { problems.push('app: no App Store link'); }
        if (hosts.indexOf('play.google.com') < 0) { problems.push('app: no Play Store link'); }
      }
      return { ok: problems.length === 0, problems: problems };
    }
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_QUEST; }
  else { root.KORB_QUEST = KORB_QUEST; }
}(typeof self !== 'undefined' ? self : this));
