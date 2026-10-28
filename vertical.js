(() => {
  'use strict';
  const section = document.querySelector('.vertical-tools');
  if (!section) return;
  const landscape = section.querySelector('.vertical-landscape');
  const sequence = section.querySelector('.vertical-sequence');
  const track = section.querySelector('.vertical-track');
  const axis = section.querySelector('.vertical-axis');
  const units = [...track.querySelectorAll('.vertical-unit')];
  const cards = units.map(unit => unit.querySelector('.tool-card')).filter(Boolean);
  const backbone = section.querySelector('.vertical-backbone');
  const strand = section.querySelector('.vertical-strand');
  const sugars = section.querySelector('.vertical-sugars');
  const ribosome = section.querySelector('.vertical-ribosome');
  const ribosomeStage = section.querySelector('.vertical-ribosome-stage');
  const schematic = section.querySelector('#vertical-ribosome-schematic');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  let queued = false, geometryQueued = false, measuring = false;
  let nodes = [], phosphates = [], axisX = 0, height = 0, firstY = 0, lastY = 0;
  let phase = 0, channelY = 0, scale = 1, mobile = false, previousWidth = 0;

  function element(tag, attributes) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }
  function request() {
    if (!queued) { queued = true; requestAnimationFrame(frame); }
  }
  function layout() {
    axisX = axis.offsetLeft;
    height = track.offsetHeight;
    mobile = landscape.clientWidth <= 700;
    const drawing = document.createDocumentFragment();
    nodes = units.map(unit => {
      const node = { unit, y: unit.offsetTop + unit.offsetHeight / 2, headX: unit.offsetLeft, isTool: unit.classList.contains('vertical-tool') };
      node.sugar = element('g', {});
      node.stem = element('path', { class: 'vertical-stem' });
      node.sugar.append(element('path', { d: 'M-8 -6L3 -10L11 -1L6 10L-7 8Z' }));
      drawing.append(node.stem, node.sugar);
      return node;
    });
    phosphates = nodes.slice(0, -1).map((node, index) => {
      const phosphate = { y: (node.y + nodes[index + 1].y) / 2, element: element('circle', { r: 3.5 }) };
      drawing.append(phosphate.element);
      return phosphate;
    });
    sugars.replaceChildren(drawing);
    firstY = 0;
    lastY = height;
    backbone.setAttribute('viewBox', `0 0 ${track.clientWidth} ${height}`);
    const bounds = ribosomeStage.getBoundingClientRect();
    ribosome.setAttribute('viewBox', `0 0 ${landscape.clientWidth} ${bounds.height}`);
    scale = Math.min(mobile ? 1.05 : 1.8, landscape.clientWidth * .92 / 363, bounds.height * .8 / 420);
    // Rotate the molecular schematic, keeping every label and panel upright.
    schematic.setAttribute('transform', `translate(${axisX} ${bounds.height * .52}) rotate(90) scale(${scale})`);
    request();
  }
  function scheduleGeometry() {
    if (geometryQueued) return;
    geometryQueued = true;
    requestAnimationFrame(() => { geometryQueued = false; layout(); });
  }
  function measureCards() {
    if (measuring) return;
    measuring = true;
    landscape.style.removeProperty('--vertical-card-height');
    const cardHeight = Math.ceil(Math.max(...cards.map(card => card.getBoundingClientRect().height)));
    landscape.style.setProperty('--vertical-card-height', `${cardHeight}px`);
    previousWidth = landscape.clientWidth;
    measuring = false;
    scheduleGeometry();
  }
  function xAt(y) {
    if (motionPreference.matches) return axisX;
    const flexibility = clamp((Math.abs(y - channelY) - 60 * scale) / (160 * scale), 0, 1);
    return axisX + flexibility * (Math.sin(y / 230 + phase) * (mobile ? 3 : 6) + Math.sin(y / 510 - phase * .6) * 2);
  }
  function frame(time) {
    queued = false;
    if (!nodes.length) return;
    phase = time / 1900;
    const bounds = track.getBoundingClientRect();
    const stageBounds = ribosomeStage.getBoundingClientRect();
    channelY = stageBounds.top + stageBounds.height * .52 - bounds.top;
    const visible = bounds.bottom > 0 && bounds.top < window.innerHeight && !document.hidden;
    const pieces = [];
    for (let y = firstY; y < lastY; y += 16) pieces.push(`${pieces.length ? 'L' : 'M'}${xAt(y).toFixed(2)} ${y}`);
    pieces.push(`L${xAt(lastY).toFixed(2)} ${lastY}`);
    strand.setAttribute('d', pieces.join(' '));
    nodes.forEach((node, index) => {
      const x = xAt(node.y);
      const drift = motionPreference.matches ? 0 : Math.sin(node.y / 330 + phase + index * .2) * (node.isTool ? 1.5 : 3);
      node.unit.style.transform = `translate3d(${drift.toFixed(2)}px,0,0)`;
      node.sugar.setAttribute('transform', `translate(${x.toFixed(2)} ${node.y})`);
      node.stem.setAttribute('d', `M${(x + 9).toFixed(2)} ${node.y}H${(node.headX + drift).toFixed(2)}`);
    });
    phosphates.forEach(node => {
      node.element.setAttribute('cx', xAt(node.y).toFixed(2));
      node.element.setAttribute('cy', node.y);
    });
    const centre = window.innerHeight * .5;
    let nearest = null, distance = Infinity;
    nodes.filter(node => node.isTool).forEach(node => {
      const delta = Math.abs(bounds.top + node.y - centre);
      if (delta < distance) { nearest = node.unit; distance = delta; }
    });
    cards.forEach(card => card.classList.toggle('is-current', card.parentElement === nearest));
    if (visible && !motionPreference.matches) request();
  }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => {
    if (Math.abs(landscape.clientWidth - previousWidth) > 1) measureCards();
    else request();
  }, { passive: true });
  document.addEventListener('visibilitychange', request);
  motionPreference.addEventListener('change', request);
  if (window.ResizeObserver) {
    new ResizeObserver(() => {
      if (Math.abs(landscape.clientWidth - previousWidth) > 1) measureCards();
      else scheduleGeometry();
    }).observe(track);
    new ResizeObserver(scheduleGeometry).observe(ribosomeStage);
  }
  cards.forEach(card => card.querySelectorAll('img').forEach(image => {
    if (!image.complete) image.addEventListener('load', measureCards, { once: true });
  }));
  if (document.fonts) document.fonts.ready.then(measureCards);
  measureCards();
})();
