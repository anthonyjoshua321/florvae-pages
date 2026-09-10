/* =============================================================
   slider.js  —  shared testimonial / content carousel
   -------------------------------------------------------------
   Markup:
     <div data-slider>
       <div data-track>
         <div data-slide>...</div>
         <div data-slide>...</div>
       </div>
       <button data-prev></button>
       <button data-next></button>
       <span data-counter></span>   (optional -> "Slide 1 of 3")
       <div data-dots></div>        (optional pagination dots)
     </div>
   Supports arrows, dot navigation, and touch swipe on mobile.
   ============================================================= */
(function () {
  function initSlider(root) {
    var track = root.querySelector('[data-track]');
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var counter = root.querySelector('[data-counter]');
    var dotsWrap = root.querySelector('[data-dots]');
    if (!track || slides.length === 0) return;
    var index = 0;

    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'slider__dot';
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', function () { go(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function update() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      if (counter) counter.textContent = 'Slide ' + (index + 1) + ' of ' + slides.length;
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
    }
    function go(i) { index = (i + slides.length) % slides.length; update(); }

    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });

    // touch swipe
    var startX = 0, dx = 0, dragging = false;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; dragging = true; dx = 0; }, { passive: true });
    track.addEventListener('touchmove', function (e) { if (dragging) dx = e.touches[0].clientX - startX; }, { passive: true });
    track.addEventListener('touchend', function () {
      if (!dragging) return; dragging = false;
      if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); }
    });

    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-slider]')).forEach(initSlider);
  });
})();
