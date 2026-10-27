const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const toolCards = [...document.querySelectorAll('.tool-card')];

if (toolCards.length) {
  const reduceCardMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  toolCards.forEach((card, index) => {
    card.style.setProperty('--reveal-order', index);
    card.classList.add('reveal-ready');
  });

  if (reduceCardMotion || !('IntersectionObserver' in window)) {
    toolCards.forEach(card => card.classList.add('is-visible'));
  } else {
    const cardRevealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        cardRevealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    toolCards.forEach(card => cardRevealObserver.observe(card));
  }
}

const phraseLink = document.getElementById('phrase-link');
const phraseText = document.getElementById('phrase-text');
const phraseHint = document.getElementById('phrase-hint-text');

if (phraseLink && phraseText) {
  const phrases = [
    { text: 'Visualize variants with advanced prediction scoring.', cardId: 'tool-argus', name: 'aRgus' },
    { text: 'Calculate protein-level consequences of single-exon gene variants.', cardId: 'tool-mfap', name: 'MfAP' },
    { text: 'Explore multi-omics data from neurons modeling Prader-Willi and Schaaf-Yang syndrome.', cardId: 'tool-mammoth', name: 'MAMMOTH' },
    { text: 'Score the clinical severity of Schaaf-Yang syndrome.', cardId: 'tool-sys', name: 'SYS Calculator' }
  ];
  const reducePhraseMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let phraseIndex = 0;

  function setTargetCard() {
    phraseLink.href = `#${phrases[phraseIndex].cardId}`;
    if (phraseHint) phraseHint.textContent = `Jump to ${phrases[phraseIndex].name}`;
  }

  function jumpToCurrentCard() {
    const card = document.getElementById(phrases[phraseIndex].cardId);
    if (!card) return;
    card.classList.add('is-highlighted');
    card.scrollIntoView({ behavior: reducePhraseMotion ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => card.classList.remove('is-highlighted'), 1800);
  }

  phraseLink.addEventListener('click', event => {
    event.preventDefault();
    jumpToCurrentCard();
  });

  function terminalMostlyInView() {
    const rect = phraseLink.getBoundingClientRect();
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return visible >= rect.height * 0.5;
  }

  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.defaultPrevented || event.repeat) return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
    if (!terminalMostlyInView()) return;
    event.preventDefault();
    jumpToCurrentCard();
  });

  setTargetCard();

  if (reducePhraseMotion) {
    phraseText.textContent = phrases[phraseIndex].text;
    setInterval(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTargetCard();
      phraseText.textContent = phrases[phraseIndex].text;
    }, 3400);
  } else {
    const TYPE_MS = 38;
    const DELETE_MS = 16;
    const HOLD_MS = 2000;
    const GAP_MS = 350;

    function typeNext(charIndex) {
      const phrase = phrases[phraseIndex].text;
      phraseText.textContent = phrase.slice(0, charIndex);
      if (charIndex < phrase.length) {
        setTimeout(() => typeNext(charIndex + 1), TYPE_MS);
      } else {
        setTimeout(() => deleteNext(phrase.length), HOLD_MS);
      }
    }

    function deleteNext(charIndex) {
      phraseText.textContent = phrases[phraseIndex].text.slice(0, charIndex);
      if (charIndex > 0) {
        setTimeout(() => deleteNext(charIndex - 1), DELETE_MS);
      } else {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTargetCard();
        setTimeout(() => typeNext(0), GAP_MS);
      }
    }

    typeNext(0);
  }
}
