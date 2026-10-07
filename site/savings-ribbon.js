'use strict';

// A single, accessible set of catalog buttons; recycle offscreen items smoothly.
(() => {
  const viewport = document.querySelector('#deal-preview');
  if (!viewport || !products.length) return;
  const track = document.createElement('div');
  track.className = 'ribbon-track';
  track.innerHTML = products.map((product, index) =>
    '<button type="button" class="deal-mini" data-product="' + product.id +
    '" data-ribbon-index="' + index + '" aria-label="View ' + escapeText(product.name) +
    ', ' + peso(product.price) + '">' +
    productPhoto(product, 'width="52" height="52" loading="lazy" decoding="async"') +
    '<span class="ribbon-copy"><span class="ribbon-name">' + escapeText(product.name) +
    '</span><span class="ribbon-prices"><strong>' + peso(product.price) + '</strong>' +
    (product.original > product.price ? '<del>' + peso(product.original) + '</del>' : '') +
    '</span></span></button>'
  ).join('');
  viewport.replaceChildren(track);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const SPEED = 28; // Pixels per second: roughly six seconds per product.
  let offset = 0, step = 1, frameId = 0, lastTime = 0;
  let visible = true, hovered = false;

  function warmImages() {
    // Visible cards plus the next arrivals from the left; others stay lazy.
    const items = Array.from(track.children);
    [...items.slice(0, 7), ...items.slice(-3)].forEach(item => {
      item.querySelector('img').loading = 'eager';
    });
  }

  function measure() {
    const newStep = track.firstElementChild.getBoundingClientRect().width +
      (parseFloat(getComputedStyle(track).columnGap) || 0);
    offset *= newStep / step;
    step = newStep;
    track.style.transform = 'translate3d(' + offset + 'px,0,0)';
  }

  function canMove() {
    return !motion.matches && visible && !hovered && !document.hidden &&
      !viewport.contains(document.activeElement) && viewport.scrollLeft < 1 &&
      !document.querySelector('dialog[open]');
  }

  function frame(time) {
    frameId = 0;
    if (!canMove()) { sync(); return; }
    if (lastTime) offset += Math.min((time - lastTime) / 1000, .1) * SPEED;
    lastTime = time;
    while (offset >= 0) {
      // Move the far-right item just outside the left edge. Existing visible
      // cards retain their positions when the common translation resets.
      track.prepend(track.lastElementChild);
      offset -= step;
      warmImages();
    }
    track.style.transform = 'translate3d(' + offset + 'px,0,0)';
    frameId = requestAnimationFrame(frame);
  }

  function sync() {
    const moving = canMove();
    viewport.classList.toggle('is-gliding', moving);
    if (moving && !frameId) {
      lastTime = 0;
      frameId = requestAnimationFrame(frame);
    } else if (!moving && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
      lastTime = 0;
    }
  }

  function configureMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
    Array.from(track.children).sort((a, b) =>
      Number(a.dataset.ribbonIndex) - Number(b.dataset.ribbonIndex)
    ).forEach(item => track.appendChild(item));
    viewport.scrollLeft = 0;
    step = track.firstElementChild.getBoundingClientRect().width +
      (parseFloat(getComputedStyle(track).columnGap) || 0);
    if (motion.matches) offset = 0;
    else { track.prepend(track.lastElementChild); offset = -step; }
    track.style.transform = 'translate3d(' + offset + 'px,0,0)';
    warmImages();
    sync();
  }

  viewport.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; sync(); }
  });
  viewport.addEventListener('pointerleave', () => { hovered = false; sync(); });
  viewport.addEventListener('focusin', sync);
  viewport.addEventListener('focusout', () => queueMicrotask(sync));
  viewport.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', configureMotion);
  const dialogs = new MutationObserver(sync);
  document.querySelectorAll('dialog').forEach(dialog => {
    dialogs.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) viewport.scrollLeft = 0;
      sync();
    }).observe(viewport);
  }
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(viewport);
  else window.addEventListener('resize', measure);
  configureMotion();
})();
