/* ============================================================================
   KORB HEALTH — THE PATIENT VIDEOS, IN ONE PLACE

   SOURCE OF TRUTH for every patient-facing video: which video, where it is
   hosted, and the still frame shown before a patient presses play.

   WHY ONE FILE. These were nine Google Drive iframes scattered through
   KORB_Patient_Hub.html, and the injection walkthrough appeared in three of
   them. Moving host meant finding nine embeds by hand. Vimeo is a bridge -
   Don's account, paid on a Systems Lab Studio card, expected to move to KORB's
   own platform once the website is built - so the NEXT move is a certainty, not
   a possibility. It should be one file and seven lines.

   WHY NOT DRIVE, recorded so nobody puts it back. On 2026-09-18 all seven Drive
   embeds returned "the limit has been hit for viewers who aren't signed in" to
   any signed-out viewer, which is every patient. They also took the hub from
   132ms to 7,696ms to load. Drive is not a video host and throttles embedded
   playback regardless of how a file is shared.

   WHY NOT YOUTUBE. YouTube serves pre-roll ads to viewers who are not signed
   in, and no embed parameter turns that off. That is why Don moved these off
   YouTube in the first place. Vimeo does not serve ads on any tier.

   THE FACADE, and it is the point of this file. A patient page loads the
   THUMBNAIL only - one image, lazily - and the Vimeo player is created on click.
   Nine players on arrival is what made the Drive version unusable; nine images
   costs nothing. The video still plays inline, so nobody is thrown off the page.

   THUMBNAILS ARE VIMEO'S OWN, read from its oEmbed API on 2026-09-19 rather
   than made by hand. `thumb` holds the BASE url and the width is appended, so
   the page asks for the size it actually renders: the frames are about 504px
   wide, and nine 1280px stills cost 410KB and took the page to 3,426ms. At
   640px it is 166KB, and lazy loading means the offscreen ones cost nothing at
   all. If a video is replaced, refresh the base from
   https://vimeo.com/api/oembed.json?url=https://vimeo.com/<id> and strip the
   trailing _<width>?region=... 

   REPLACING A VIDEO: upload over the existing Vimeo video rather than creating
   a new one, and the id here stays valid. Create a new one and this file needs
   the new id, which is the whole reason it exists.
   ============================================================================ */
(function (root) {
  'use strict';

  var KORB_VIDEO = {
    meta: {
      version: '1.0',
      host: 'Vimeo',
      account: 'Systems Lab Studio (don@systemslabstudio.com)',
      note: 'Interim host. Expected to move to KORB-owned hosting with the website.'
    },

    /* key -> the video. `label` is what the poster says, not the Vimeo title:
       Vimeo calls one of these "KORB SQ Injection Dec 2025 V2", which is a file
       name and not a thing to show a patient. */
    videos: {
      welcome_korb: {
        id: '1228372722',
        label: 'Welcome to KORB',
        seconds: 42,
        thumb: 'https://i.vimeocdn.com/video/2202803681-1c7113feb1bd1085acccc163fb0c6ca2df4778a4f5294a36837c676e97277ecd-d'
      },
      glp1_consult: {
        id: '1228373202',
        label: 'Your GLP-1 Initial Consultation',
        seconds: 153,
        thumb: 'https://i.vimeocdn.com/video/2202804292-dccf350dbbdac053e5f6bc56cac936ab1461914f214568ae2b8d99b1fc811587-d'
      },
      injection: {
        id: '1228373201',
        label: 'How to Give Your Injection',
        seconds: 390,
        thumb: 'https://i.vimeocdn.com/video/2202804400-bf0a10c2f50b3f1ef62170ad8f95bbf0924562a3835d254217bce04bfd3b5371-d'
      },
      mens: {
        id: '1228372723',
        label: 'Welcome to Men’s Health',
        seconds: 51,
        thumb: 'https://i.vimeocdn.com/video/2202803670-4ef122b54aaa67cc525772ea984d9afacba66cbbede7ee10798a6cf81d50be6c-d'
      },
      womens: {
        id: '1228372731',
        label: 'Welcome to Women’s Health',
        seconds: 51,
        thumb: 'https://i.vimeocdn.com/video/2202803678-eea4b549b69efd1e33ff80ec8273f34ccfdb4bab1edd6c7a9ba35379ffa52ee3-d'
      },
      fhl: {
        id: '1228372725',
        label: 'Welcome to Functional Health & Longevity',
        seconds: 55,
        thumb: 'https://i.vimeocdn.com/video/2202803674-8e7cc982d7c7f291344391ffad6066128b448953eaab23a67077b21ba074fc71-d'
      },
      quest: {
        id: '1228372724',
        label: 'How Quest Labs Work',
        seconds: 45,
        thumb: 'https://i.vimeocdn.com/video/2202803679-2c229e103146ebda9e3c7858123e33b96a87879c7aadcceac14715573b87098f-d'
      }
    },

    CSS: [
      '.kv-facade{position:relative;display:block;width:100%;height:100%;padding:0;',
      'border:0;cursor:pointer;background-color:#21275B;background-size:cover;',
      'background-position:center;font:inherit;color:#fff;text-align:left;}',
      '.kv-still{position:absolute;inset:0;width:100%;height:100%;',
      'object-fit:cover;display:block;}',
      '.kv-facade::after{content:"";position:absolute;inset:0;',
      'background:linear-gradient(180deg,rgba(14,18,54,.10) 0%,rgba(14,18,54,.72) 100%);}',
      '.kv-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);',
      'z-index:1;display:flex;align-items:center;justify-content:center;',
      'width:64px;height:64px;border-radius:50%;background:#00B2C3;color:#0E1236;',
      'font-size:23px;line-height:1;padding-left:5px;box-sizing:border-box;',
      'box-shadow:0 3px 14px rgba(14,18,54,.45);}',
      '.kv-facade:hover .kv-play{background:#fff;}',
      '.kv-facade:focus-visible{outline:3px solid #00B2C3;outline-offset:3px;}',
      '.kv-meta{position:absolute;z-index:1;left:0;right:0;bottom:0;padding:14px 16px;',
      'display:flex;align-items:flex-end;justify-content:space-between;gap:12px;}',
      '.kv-label{font-weight:700;font-size:14.5px;line-height:1.3;',
      'text-shadow:0 1px 3px rgba(14,18,54,.6);}',
      '.kv-dur{flex:0 0 auto;font-size:12px;font-weight:700;padding:3px 7px;',
      'border-radius:4px;background:rgba(14,18,54,.72);}',
      '.kv-frame{width:100%;height:100%;border:0;display:block;}',
      /* Print gets the still, never a dead player box. */
      '@media print{.kv-play,.kv-dur{display:none;}}'
    ].join(''),

    /* The frames render about 504px wide. 640 covers that with a little slack;
       asking for 1280 was 2.5x the bytes for pixels nobody sees. */
    thumbUrl: function (v, w) {
      return v.thumb + '_' + (w || 640) + '?region=us';
    },

    mmss: function (s) {
      var m = Math.floor(s / 60), r = s % 60;
      return m + ':' + (r < 10 ? '0' : '') + r;
    },

    /* Fills every [data-korb-video="<key>"] on the page. Throws by NAME on an
       unknown key rather than leaving a silent empty box - a missing video on a
       patient page should stop a build, not decorate one. */
    mount: function (doc) {
      doc = doc || document;
      var self = this;
      var nodes = doc.querySelectorAll('[data-korb-video]');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var key = el.getAttribute('data-korb-video');
        var v = self.videos[key];
        if (!v) {
          throw new Error('korb-video.js: no video "' + key + '". Known keys: ' +
            Object.keys(self.videos).join(', '));
        }
        el.innerHTML =
          '<button type="button" class="kv-facade" data-vid="' + v.id + '" ' +
          'aria-label="Play: ' + v.label.replace(/"/g, '&quot;') + '">' +
          /* an IMG, not a background-image: only an img can be lazy, and the
             offscreen stills are most of them on a page this long */
          '<img class="kv-still" src="' + self.thumbUrl(v, 640) + '" alt="" ' +
          'loading="lazy" decoding="async" width="640" height="360">' +
          '<span class="kv-play" aria-hidden="true">&#9654;</span>' +
          '<span class="kv-meta"><span class="kv-label">' + v.label + '</span>' +
          '<span class="kv-dur">' + self.mmss(v.seconds) + '</span></span></button>';
      }
      if (!doc.__korbVideoBound) {
        doc.__korbVideoBound = true;
        doc.addEventListener('click', function (e) {
          var b = e.target && e.target.closest && e.target.closest('.kv-facade');
          if (!b) { return; }
          var f = doc.createElement('iframe');
          f.className = 'kv-frame';
          f.src = 'https://player.vimeo.com/video/' + b.getAttribute('data-vid') +
                  '?autoplay=1&byline=0&portrait=0&title=0&dnt=1';
          f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
          f.setAttribute('allowfullscreen', '');
          b.parentNode.replaceChild(f, b);
        });
      }
      return nodes.length;
    },

    selfCheck: function () {
      var problems = [], self = this;
      Object.keys(self.videos).forEach(function (k) {
        var v = self.videos[k];
        if (!/^\d+$/.test(v.id || '')) { problems.push(k + ': id is not a Vimeo numeric id'); }
        if (!/^https:\/\/i\.vimeocdn\.com\/video\/[\w-]+-d$/.test(v.thumb || '')) {
          problems.push(k + ': thumb should be the Vimeo CDN BASE url, no _<width> suffix');
        }
        if (!v.label) { problems.push(k + ': no label'); }
        if (!(v.seconds > 0)) { problems.push(k + ': no duration'); }
      });
      var ids = Object.keys(self.videos).map(function (k) { return self.videos[k].id; });
      if (new Set(ids).size !== ids.length) {
        problems.push('two keys point at the same Vimeo id');
      }
      return { ok: problems.length === 0, problems: problems };
    }
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = KORB_VIDEO; }
  else { root.KORB_VIDEO = KORB_VIDEO; }
}(typeof self !== 'undefined' ? self : this));
