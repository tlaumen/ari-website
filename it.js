/* ARI.engineer – it.html: zwarte vulling die meebeweegt met muis en scroll */
(function () {
  'use strict';

  var grid = document.getElementById('svc-grid');
  if (!grid) return;
  var fill = grid.querySelector('.svc-fill');
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.svc'));
  if (!fill || !cards.length) return;

  var active = -1;
  var hovering = false;
  var pointer = { x: 0, y: 0 };

  function show(i, instant) {
    if (i === active) return;
    active = i;
    var c = cards[i];
    if (instant) fill.style.transition = 'none';
    fill.style.width = c.offsetWidth + 'px';
    fill.style.height = c.offsetHeight + 'px';
    fill.style.transform = 'translate(' + c.offsetLeft + 'px,' + c.offsetTop + 'px)';
    if (instant) { fill.offsetWidth; fill.style.transition = ''; }
    cards.forEach(function (el, j) { el.classList.toggle('is-active', j === i); });
  }

  /* Zonder muis over het raster volgt de vulling de scrollpositie. */
  function byScroll(instant) {
    var r = grid.getBoundingClientRect();
    var p = (window.innerHeight * 0.5 - r.top) / r.height;
    p = Math.min(Math.max(p, 0), 0.999);
    show(Math.floor(p * cards.length), instant);
  }

  function byPointer() {
    var el = document.elementFromPoint(pointer.x, pointer.y);
    var c = el && el.closest ? el.closest('.svc') : null;
    var i = c ? cards.indexOf(c) : -1;
    if (i !== -1) show(i);
  }

  cards.forEach(function (c, i) {
    c.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch') return;
      hovering = true;
      show(i);
    });
  });
  grid.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    pointer.x = e.clientX; pointer.y = e.clientY;
  });
  grid.addEventListener('pointerleave', function () { hovering = false; byScroll(); });

  window.addEventListener('scroll', function () { if (hovering) byPointer(); else byScroll(); }, { passive: true });
  window.addEventListener('resize', function () { var a = active; active = -1; show(a < 0 ? 0 : a, true); });

  byScroll(true);
})();
