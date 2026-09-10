/* =============================================================
   gallery.js  —  shared product image gallery
   -------------------------------------------------------------
   Markup:
     <div data-gallery>
       <div data-main-wrap>
         <img data-main src="..." alt="...">
       </div>
       <div data-thumbs>
         <button data-thumb data-src="img1" aria-label="View image 1"><img src="img1"></button>
         ...
       </div>
     </div>
   Clicking a thumb swaps the main image; swiping the main image
   steps through the thumbs. The active thumb gets .is-active.
   ============================================================= */
(function () {
  function initGallery(root) {
    var main = root.querySelector('[data-main]');
    var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-thumb]'));
    if (!main || !thumbs.length) return;
    var index = 0;

    function select(i) {
      index = (i + thumbs.length) % thumbs.length;
      var t = thumbs[index];
      var src = t.getAttribute('data-src');
      var alt = t.getAttribute('data-alt') || main.alt;
      if (src) { main.src = src; main.alt = alt; }
      thumbs.forEach(function (el, j) { el.classList.toggle('is-active', j === index); });
    }

    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
    });

    // swipe on the main image
    var startX = 0, dx = 0, dragging = false;
    main.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; dragging = true; dx = 0; }, { passive: true });
    main.addEventListener('touchmove', function (e) { if (dragging) dx = e.touches[0].clientX - startX; }, { passive: true });
    main.addEventListener('touchend', function () {
      if (!dragging) return; dragging = false;
      if (Math.abs(dx) > 40) select(index + (dx < 0 ? 1 : -1));
    });

    select(0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-gallery]')).forEach(initGallery);
  });
})();
