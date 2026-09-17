/* The date a document was built, in the timezone the person building it is
   actually in.

   Every builder used `new Date().toISOString().slice(0, 10)`, which is UTC.
   Don builds from Texas, so anything generated after 7pm Central - 6pm during
   standard time - was stamped with TOMORROW's date. The Women's Health
   reference built at 21:19 on 2026-09-16 went out reading "on 2026-09-17",
   and the same was true of the four other builders.

   That matters more here than it looks. These documents are clinical reference
   material that a provider reads to decide what to prescribe, and the version
   stamp is how anyone tells which build they are holding. A stamp that runs a
   day ahead makes a document look newer than the data it was built from, and
   two documents built minutes apart on either side of 7pm carry dates a day
   apart while being identical.

   getFullYear/getMonth/getDate are local-time accessors, so this is the local
   calendar date by construction. Written out rather than using toLocaleDateString
   so it cannot be moved by a locale or an ICU build.

   Don, 2026-09-16. */

function pad(n) { return String(n).padStart(2, '0'); }

/* YYYY-MM-DD for the given date in LOCAL time. Defaults to now. */
function buildDate(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

module.exports = buildDate;
module.exports.buildDate = buildDate;
