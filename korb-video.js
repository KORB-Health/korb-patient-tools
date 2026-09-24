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
        id: '1229753136',
        label: 'Welcome to KORB',
        seconds: 64,
        thumb: 'https://i.vimeocdn.com/video/2204494070-a559b7fdfa79ee961c8affa8e0eaa778f7278770442d6feafc3fd09a4e99404e-d'
      },
      glp1_consult: {
        id: '1229753120',
        label: 'Your GLP-1 Initial Consultation',
        seconds: 143,
        thumb: 'https://i.vimeocdn.com/video/2204493939-05eea52e3dae835e2d12f478e1dddb96a9bbcc882c8aa60d96dc4fcd89e69d54-d'
      },
      injection: {
        id: '1228373201',
        label: 'How to Give Your Injection',
        seconds: 390,
        thumb: 'https://i.vimeocdn.com/video/2204490185-42435ceda4f6e529b4897b1a9438630a1179fbbbba13ce3f71afdfd97d6c093c-d'
      },
      mens: {
        id: '1229753121',
        label: 'Welcome to Men’s Health',
        seconds: 64,
        thumb: 'https://i.vimeocdn.com/video/2204486881-dddde693aaa08467d9062ac6c556289e98025edd6a444d352127a67555330485-d'
      },
      womens: {
        id: '1229753138',
        label: 'Welcome to Women’s Health',
        seconds: 69,
        thumb: 'https://i.vimeocdn.com/video/2204486894-66f4a856a49bdebff635ba73524a53ff413f8cf85d27e73f170353443256c998-d'
      },
      fhl: {
        id: '1229753119',
        label: 'Welcome to Functional Health & Longevity',
        seconds: 79,
        thumb: 'https://i.vimeocdn.com/video/2204486879-ed8eb47868a11ddb7cede10e3c818504e1d7a43495cfeb150aff59f84a273aed-d'
      },
      quest: {
        id: '1229753118',
        label: 'How Quest Labs Work',
        seconds: 80,
        thumb: 'https://i.vimeocdn.com/video/2204486886-05e02d07abd7f26f9f0ee3dc9947c880ea8284811d1869c98809f608aed2cd83-d'
      }
    },

    CSS: [
      '.kv-facade{position:relative;display:block;width:100%;height:100%;padding:0;',
      'border:0;cursor:pointer;background-color:#21275B;background-size:cover;',
      'background-position:center;font:inherit;color:#fff;text-align:left;}',
      '.kv-still{position:absolute;inset:0;width:100%;height:100%;',
      'object-fit:cover;display:block;}',
      '.kv-facade::after{content:"";position:absolute;inset:0;',
      'background:none;border-radius:inherit;box-shadow:inset 0 0 0 3px #00B2C3;}',   /* A teal frame, 2026-09-23: the Welcome thumbnail's navy band ran into the navy panel behind it and the still stopped reading as a video. Drawn on ::after so it sits above the image. */   /* No overlay. It was .10 to .72, then 0 to .18; both dimmed the light custom thumbnails of 2026-09-23. The play button and the duration badge carry their own contrast. */
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
      /* The custom thumbnails of 2026-09-23 carry their own title, so the white label
         over the still repeated it on a light background. Kept for screen readers,
         hidden visually; the duration badge stays, at the right. */
      '.kv-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}',
      '.kv-dur{margin-left:auto;}',
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
