'use strict';

// Use the existing catalog and locally saved product photography.
(() => {
  const hero = document.querySelector('.hero-main');
  const card = document.querySelector('#hero-product');
  if (!hero || !card || !products.length) return;
  const photo = document.querySelector('#hero-product-photo');
  const name = document.querySelector('#hero-product-name');
  const price = document.querySelector('#hero-product-price');
  const collection = document.querySelector('#hero-product-category');
  const previous = document.querySelector('#hero-prev');
  const dots = document.querySelector('#hero-dots');
  const next = document.querySelector('#hero-next');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map();
  let index = 0, timer, busy = false, hovered = false;
  let visible = true;
  const dotButtons = Array.from({ length: Math.min(5, products.length) }, () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hero-carousel-dot';
    button.addEventListener('click', () => select(Number(button.dataset.index)));
    dots.appendChild(button);
    return button;
  });

  function load(product) {
    if (cache.has(product.id)) return cache.get(product.id);
    const promise = new Promise(resolve => {
      const image = new Image();
      const timeout = setTimeout(() => finish(false), 5000);
      function finish(ready) {
        clearTimeout(timeout);
        image.onload = image.onerror = null;
        resolve(ready && image.naturalWidth > 0);
      }
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = 'assets/' + product.photo + '.jpg';
      if (image.complete) finish(image.naturalWidth > 0);
    });
    cache.set(product.id, promise);
    return promise;
  }

  function show(product, animate = true) {
    photo.src = 'assets/' + product.photo + '.jpg';
    photo.alt = product.name + ' reference photo';
    photo.style.objectPosition = product.position || '50% 50%';
    card.dataset.product = product.id;
    card.setAttribute('aria-label', 'View ' + product.name + ', ' + peso(product.price));
    name.textContent = product.name;
    price.textContent = peso(product.price);
    collection.textContent = product.category + ' / ' + product.tag;
    // Five compact dots show the current consecutive group of products.
    const groupStart = Math.floor(index / dotButtons.length) * dotButtons.length;
    dotButtons.forEach((button, offset) => {
      const itemIndex = (groupStart + offset) % products.length;
      button.dataset.index = String(itemIndex);
      button.setAttribute('aria-label', 'Show ' + products[itemIndex].name);
      button.setAttribute('aria-current', itemIndex === index ? 'true' : 'false');
    });
    card.classList.remove('is-entering');
    if (animate && !motion.matches) {
      void card.offsetWidth;
      card.classList.add('is-entering');
    }
    // Prepare the next two photos without changing the visible image.
    load(products[(index + 1) % products.length]);
    load(products[(index + 2) % products.length]);
  }

  function canPlay() {
    return !motion.matches && !hovered && !hero.contains(document.activeElement) && visible && !document.hidden &&
      !document.querySelector('dialog[open]');
  }

  async function select(candidate, automatic = false) {
    if (busy || (automatic && !canPlay())) return;
    busy = true;
    const ready = await load(products[candidate]);
    // Interaction may have changed while the image loaded.
    if (ready && (!automatic || canPlay())) {
      index = candidate;
      show(products[index]);
    } else if (!ready) {
      // Retain the last good photo; skip an unavailable asset next time.
      index = candidate;
    }
    busy = false;
  }

  function sync() {
    clearInterval(timer);
    timer = undefined;
    hero.classList.toggle('spotlight-playing', canPlay());
    if (canPlay()) timer = setInterval(() => select((index + 1) % products.length, true), 1000);
  }

  previous.addEventListener('click', () => select((index - 1 + products.length) % products.length));
  next.addEventListener('click', () => select((index + 1) % products.length));
  hero.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; sync(); }
  });
  hero.addEventListener('pointerleave', () => { hovered = false; sync(); });
  hero.addEventListener('focusin', sync);
  hero.addEventListener('focusout', () => {
    queueMicrotask(sync);
  });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  const dialogs = new MutationObserver(sync);
  document.querySelectorAll('dialog').forEach(dialog => {
    dialogs.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(hero);
  }
  show(products[0], false);
  sync();
})();
