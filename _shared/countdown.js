/* =============================================================
   countdown.js  —  shared evergreen countdown timer
   -------------------------------------------------------------
   Any element with [data-countdown] is turned into a live timer.
   All timers on a page share ONE end-time, persisted per visitor
   in localStorage so the clock keeps counting down between page
   views (and resets once it hits zero).

   Markup expected inside the [data-countdown] element:
     <span data-cd="h"></span> : <span data-cd="m"></span> : <span data-cd="s"></span>

   Options (attributes on the [data-countdown] element or <body>):
     data-minutes="10"  -> length of the offer window (default 10)
   ============================================================= */
(function () {
  var KEY = 'everlove_offer_deadline';
  var DEFAULT_MIN = 10;

  function getDeadline() {
    var mins = parseInt(document.body.getAttribute('data-countdown-minutes') || DEFAULT_MIN, 10);
    var now = Date.now();
    var stored = 0;
    try { stored = parseInt(localStorage.getItem(KEY) || '0', 10); } catch (e) {}
    // (Re)start the window if none stored or it has already elapsed.
    if (!stored || stored <= now) {
      stored = now + mins * 60 * 1000;
      try { localStorage.setItem(KEY, String(stored)); } catch (e) {}
    }
    return stored;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function render(deadline, nodes) {
    var diff = Math.max(0, deadline - Date.now());
    var total = Math.floor(diff / 1000);
    var h = Math.floor(total / 3600);
    var m = Math.floor((total % 3600) / 60);
    var s = total % 60;
    nodes.forEach(function (el) {
      var h1 = el.querySelector('[data-cd="h"]');
      var m1 = el.querySelector('[data-cd="m"]');
      var s1 = el.querySelector('[data-cd="s"]');
      if (h1) h1.textContent = h;
      if (m1) m1.textContent = pad(m);
      if (s1) s1.textContent = pad(s);
    });
    return diff;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-countdown]'));
    if (!nodes.length) return;
    var deadline = getDeadline();
    render(deadline, nodes);
    setInterval(function () {
      var diff = render(deadline, nodes);
      if (diff <= 0) { deadline = getDeadline(); } // roll the window over so it never sticks at 0
    }, 1000);
  });
})();
