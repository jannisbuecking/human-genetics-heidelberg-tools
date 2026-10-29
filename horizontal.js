(() => {
  'use strict';
  const section = document.querySelector('.horizontal-tools');
  if (!section) return;
  const journey = section.querySelector('.horizontal-journey');
  const scene = section.querySelector('.horizontal-scene');
  const stage = section.querySelector('.horizontal-stage');
  const viewport = section.querySelector('.horizontal-viewport');
  const track = section.querySelector('.horizontal-track');
  const units = [...track.querySelectorAll('.horizontal-unit')];
  const tools = units.filter(unit => unit.classList.contains('horizontal-tool'));
  const cards = tools.map(unit => unit.querySelector('.tool-card'));
  const backbone = section.querySelector('.horizontal-backbone');
  const strand = section.querySelector('.horizontal-strand');
  const sugars = section.querySelector('.horizontal-sugars');
  const ribosome = section.querySelector('.horizontal-ribosome');
  const schematic = section.querySelector('#horizontal-ribosome-schematic');
  const primeStart = section.querySelector('.horizontal-start');
  const primeEnd = section.querySelector('.horizontal-end');
  const phraseLink = document.getElementById('phrase-link');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const viewSwitch = document.querySelector('.horizontal-view-switch');
  const viewButtons = [...document.querySelectorAll('.horizontal-view-switch [data-tool-view]')];
  const isRnaView = () => section.dataset.view !== 'panels';
  const sizeReference = document.createElement('div');
  sizeReference.className = 'horizontal-size-reference';
  sizeReference.setAttribute('aria-hidden', 'true');
  scene.append(sizeReference);
  const ns = 'http://www.w3.org/2000/svg';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let enabled = false, queued = false, layingOut = false;
  let width = 0, length = 0, baseline = 0, focusX = 0, ribosomeX = 0;
  let startCamera = 0, travel = 0, distance = 0, camera = 0, markerSize = 116;
  let nodes = [], phosphates = [], firstX = 0, lastX = 0, ribosomeScale = 1;
  let cameraReady = false, lastTime = 0, wavePhase = 0, flow = 0;
  let layoutHeight = 0, layoutQueued = false, forceLayout = false;
  let savedRnaProgress = 0;

  function element(tag, attributes) {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }
  function request() {
    if (!queued) { queued = true; requestAnimationFrame(frame); }
  }
  function progress() {
    return distance ? clamp(-journey.getBoundingClientRect().top / distance, 0, 1) : 0;
  }
  function scheduleLayout(force = false) {
    if (!isRnaView()) return;
    forceLayout = forceLayout || force;
    if (layoutQueued) return;
    layoutQueued = true;
    requestAnimationFrame(() => {
      layoutQueued = false;
      if (!isRnaView()) { forceLayout = false; return; }
      const height = sizeReference.getBoundingClientRect().height;
      const changed = Math.abs(section.clientWidth - width) > 1 || Math.abs(height - layoutHeight) > 1;
      const shouldLayout = forceLayout || changed;
      forceLayout = false;
      if (shouldLayout) layout();
      else request();
    });
  }
  function yAt(x) {
    if (motionPreference.matches) return baseline;
    // Keep the RNA channel nearly straight; the exposed strand gently flexes.
    const channelDistance = Math.abs(x - camera - ribosomeX);
    const flexibility = clamp((channelDistance - 55 * ribosomeScale) / (150 * ribosomeScale), 0, 1);
    return baseline + flexibility * (
      Math.sin(x / 250 - camera / 720 + wavePhase) * (9 + flow * 5) +
      Math.sin(x / 570 + camera / 1250 - wavePhase * .6) * 3
    );
  }
  function layout() {
    if (layingOut || !isRnaView()) return;
    layingOut = true;
    const wasEnabled = enabled;
    const oldProgress = progress();
    const oldTop = journey.getBoundingClientRect().top;
    const wasPinned = wasEnabled && oldTop <= 0 && oldTop >= -distance;
    const wasAfter = wasEnabled && oldTop < -distance;
    const oldBottomOffset = journey.getBoundingClientRect().bottom;
    section.classList.remove('is-enhanced');
    scene.style.removeProperty('--horizontal-card-height');
    units.forEach(unit => unit.removeAttribute('style'));
    cards.forEach(card => card.removeAttribute('style'));
    track.removeAttribute('style');
    journey.style.removeProperty('height');
    width = section.clientWidth;
    layoutHeight = sizeReference.getBoundingClientRect().height;
    const mobile = width <= 700;
    const cardWidth = mobile ? Math.max(230, width - 44) : Math.min(520, Math.max(350, width * .44));
    tools.forEach(unit => { unit.style.width = `${cardWidth}px`; });
    const cardHeight = Math.ceil(Math.max(...cards.map(card => card.getBoundingClientRect().height)));
    scene.style.setProperty('--horizontal-card-height', `${cardHeight}px`);
    const headingHeight = section.querySelector('.section-heading').getBoundingClientRect().height;
    const stageTop = headingHeight + 10;
    scene.style.setProperty('--horizontal-stage-top', `${stageTop}px`);
    // Use the CSS scene's stable viewport, not Safari's toolbar-dependent height.
    // Reserve enough room for the card, its stem, and the lower subunit.
    // Only genuinely short windows use the naturally flowing layout.
    enabled = layoutHeight >= stageTop + cardHeight + 200 && width >= 300;
    if (!enabled) {
      layingOut = false;
      return;
    }
    section.classList.add('is-enhanced');
    const sceneHeight = scene.getBoundingClientRect().height;
    const stageHeight = stage.getBoundingClientRect().height;
    markerSize = parseFloat(getComputedStyle(scene).getPropertyValue('--horizontal-base-size')) || 116;
    const gap = mobile ? 24 : 32;
    const cardBottomGap = 44;
    const lowerRoom = Math.min(mobile ? 220 : 300, stageHeight * .36);
    baseline = Math.max(cardHeight + cardBottomGap + 28, stageHeight - lowerRoom);
    focusX = ribosomeX = width * .5;
    const rowCentre = baseline - cardBottomGap - cardHeight / 2;
    const markerTop = rowCentre - markerSize / 2;
    const cardTop = baseline - cardBottomGap - cardHeight;
    let previousX = focusX, previousWidth = markerSize;
    nodes = units.map(unit => {
      const slot = Number(unit.dataset.slot);
      const isTool = unit.classList.contains('horizontal-tool');
      const unitWidth = isTool ? cardWidth : markerSize;
      // Letter spacing is uniform. A wider tool tile gets its own clear space.
      const x = slot ? previousX + previousWidth / 2 + gap + unitWidth / 2 : focusX;
      previousX = x;
      previousWidth = unitWidth;
      unit.style.width = `${unitWidth}px`;
      unit.style.left = `${x - unitWidth / 2}px`;
      const mark = unit.querySelector('.nucleotide-mark');
      if (mark) mark.style.top = `${markerTop}px`;
      const card = unit.querySelector('.tool-card');
      if (card) card.style.top = `${cardTop}px`;
      const sugar = element('g', {});
      sugar.append(
        element('path', { d: `M0 -10V${-(isTool ? cardBottomGap : baseline - markerTop - markerSize)}`, class: 'horizontal-stem' }),
        element('path', { d: 'M-6 8L-10 -3L-1 -11L10 -6L8 7Z' })
      );
      return { x, unit, sugar, slot };
    });
    length = nodes[nodes.length - 1].x + focusX;
    track.style.width = `${length}px`;
    const drawing = document.createDocumentFragment();
    nodes.forEach(node => drawing.append(node.sugar));
    phosphates = nodes.slice(0, -1).map((node, i) => {
      const phosphate = { x: (node.x + nodes[i + 1].x) / 2, element: element('circle', { r: 3.5 }) };
      drawing.append(phosphate.element);
      return phosphate;
    });
    sugars.replaceChildren(drawing);
    const startSlot = Number(journey.dataset.startSlot);
    const stopSlot = Number(journey.dataset.stopSlot);
    backbone.setAttribute('viewBox', `0 0 ${length} ${stageHeight}`);
    ribosome.setAttribute('viewBox', `0 0 ${width} ${stageHeight}`);
    ribosomeScale = Math.min(mobile ? 1.25 : 1.95, width * (mobile ? 1.04 : .8) / 420, (stageHeight - baseline - 12) / 145, (baseline - 12) / 218);
    schematic.setAttribute('transform', `translate(${ribosomeX} ${baseline}) scale(${ribosomeScale})`);
    firstX = nodes[0].x - markerSize * .65;
    lastX = nodes[nodes.length - 1].x + markerSize * .65;
    primeStart.style.top = primeEnd.style.top = `${baseline + 28}px`;
    startCamera = nodes[startSlot + 1].x - ribosomeX;
    // Successive codons pass through the same channel, from AUG to UAA.
    travel = nodes[stopSlot + 1].x - ribosomeX - startCamera;
    distance = Math.max(travel * .82, sceneHeight * 3);
    journey.style.height = `${sceneHeight + distance}px`;
    if (wasPinned) window.scrollTo({ top: window.scrollY + journey.getBoundingClientRect().top + oldProgress * distance, behavior: 'instant' });
    else if (wasAfter) window.scrollTo({ top: window.scrollY + journey.getBoundingClientRect().bottom - oldBottomOffset, behavior: 'instant' });
    layingOut = false;
    cameraReady = false;
    lastTime = 0;
    request();
  }

  function frame(time) {
    queued = false;
    if (!enabled || !isRnaView()) return;
    const p = progress();
    const bounds = scene.getBoundingClientRect();
    const visible = bounds.bottom > 0 && bounds.top < window.innerHeight && !document.hidden;
    const dt = lastTime ? clamp(time - lastTime, 8, 40) : 16;
    lastTime = time;
    const target = startCamera + p * travel;
    const previousCamera = camera;
    if (!cameraReady || motionPreference.matches || !visible || p === 0 || p === 1) camera = target;
    else camera += (target - camera) * (1 - Math.exp(-dt / 65));
    flow += (clamp(Math.abs(camera - previousCamera) / dt / 2, 0, 1) - flow) * .12;
    cameraReady = true;
    wavePhase = time / 1900;
    track.style.transform = `translate3d(${-camera.toFixed(2)}px,0,0)`;
    const pieces = [];
    for (let x = firstX; x <= lastX; x += 14) pieces.push(`${pieces.length ? 'L' : 'M'}${x.toFixed(2)} ${yAt(x).toFixed(2)}`);
    pieces.push(`L${lastX.toFixed(2)} ${yAt(lastX).toFixed(2)}`);
    strand.setAttribute('d', pieces.join(' '));
    nodes.forEach(node => {
      const y = yAt(node.x);
      node.unit.style.transform = `translate3d(0,${(y - baseline).toFixed(2)}px,0)`;
      node.sugar.setAttribute('transform', `translate(${node.x} ${y.toFixed(2)})`);
    });
    phosphates.forEach(node => {
      node.element.setAttribute('cx', node.x);
      node.element.setAttribute('cy', yAt(node.x).toFixed(2));
    });
    primeStart.style.left = `${firstX - camera}px`;
    primeEnd.style.left = `${lastX - camera - 12}px`;
    const nearest = tools.reduce((best, unit) => Math.abs(nodes[Number(unit.dataset.slot)].x - camera - focusX) < Math.abs(nodes[Number(best.dataset.slot)].x - camera - focusX) ? unit : best, tools[0]);
    cards.forEach((card, index) => card.classList.toggle('is-current', tools[index] === nearest));
    if (visible && !motionPreference.matches) request();
  }
  function goToCard(id, immediate = false) {
    const index = cards.findIndex(card => card.id === id);
    if (index < 0 || !enabled) return false;
    const targetCamera = nodes[Number(tools[index].dataset.slot)].x - focusX;
    const fraction = clamp((targetCamera - startCamera) / travel, 0, 1);
    if (immediate || motionPreference.matches) { camera = startCamera + fraction * travel; cameraReady = true; }
    window.scrollTo({ top: journey.getBoundingClientRect().top + window.scrollY + fraction * distance, behavior: immediate || motionPreference.matches ? 'instant' : 'smooth' });
    cards[index].classList.add('is-highlighted');
    setTimeout(() => cards[index].classList.remove('is-highlighted'), 1800);
    request();
    return true;
  }
  // Adapt the original terminal's destination to the pinned scene, preserving
  // its markup, animation, wording, and shared script byte for byte.
  if (phraseLink) {
    phraseLink.addEventListener('click', event => {
      if (!goToCard(phraseLink.hash.slice(1))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
    document.addEventListener('keydown', event => {
      if (event.key !== 'Enter' || event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (event.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
      const bounds = phraseLink.getBoundingClientRect();
      const visible = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0);
      if (visible < bounds.height * .5 || !goToCard(phraseLink.hash.slice(1))) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }
  viewport.addEventListener('focusin', event => {
    const card = event.target.closest('.tool-card');
    if (card) goToCard(card.id, true);
  });
  viewport.addEventListener('keydown', event => {
    if (!enabled || event.target !== viewport) return;
    const target = camera + focusX;
    const current = tools.reduce((best, unit, i) => Math.abs(nodes[Number(unit.dataset.slot)].x - target) < Math.abs(nodes[Number(tools[best].dataset.slot)].x - target) ? i : best, 0);
    const destinations = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    goToCard(cards[clamp(destinations[event.key], 0, cards.length - 1)].id);
  });
  function routeHash() {
    if (location.hash.startsWith('#tool-')) goToCard(location.hash.slice(1), true);
  }
  function setView(view) {
    if (!['rna', 'panels'].includes(view) || section.dataset.view === view) return;
    const before = section.getBoundingClientRect();
    const readingTools = before.top < window.innerHeight && before.bottom > 0;
    const belowTools = before.bottom <= 0;
    if (isRnaView() && enabled) savedRnaProgress = progress();
    section.dataset.view = view;
    viewButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.toolView === view)));
    enabled = false;
    section.classList.remove('is-enhanced');
    journey.style.removeProperty('height');
    scene.style.removeProperty('--horizontal-card-height');
    track.removeAttribute('style');
    units.forEach(unit => unit.removeAttribute('style'));
    cards.forEach(card => {
      card.removeAttribute('style');
      card.classList.remove('is-current');
      card.classList.add('is-visible');
    });
    if (isRnaView()) layout();
    if (readingTools) {
      const start = section.getBoundingClientRect().top + window.scrollY;
      const offset = isRnaView() && enabled ? savedRnaProgress * distance : 0;
      window.scrollTo({ top: start + offset, behavior: 'instant' });
    } else if (belowTools) {
      window.scrollBy({ top: section.getBoundingClientRect().bottom - before.bottom, behavior: 'instant' });
    }
    cameraReady = false;
    request();
  }
  if (viewSwitch) {
    viewButtons.forEach(button => button.addEventListener('click', () => setView(button.dataset.toolView)));
    viewSwitch.hidden = false;
  }
  window.addEventListener('scroll', request, { passive: true });
  // Ignore visual-height-only toolbar changes. Width and stable-height changes
  // (rotation, split view, or desktop resizing) still rebuild the geometry.
  window.addEventListener('resize', () => scheduleLayout(), { passive: true });
  window.addEventListener('hashchange', routeHash);
  document.addEventListener('visibilitychange', request);
  motionPreference.addEventListener('change', request);
  cards.forEach(card => card.querySelectorAll('img').forEach(image => {
    if (!image.complete) image.addEventListener('load', () => scheduleLayout(true), { once: true });
  }));
  if (window.ResizeObserver) {
    const sizeObserver = new ResizeObserver(() => scheduleLayout());
    sizeObserver.observe(section);
    sizeObserver.observe(sizeReference);
  }
  layout();
  routeHash();
  if (document.fonts) document.fonts.ready.then(() => { scheduleLayout(true); });
})();
