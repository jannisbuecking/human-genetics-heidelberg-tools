const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const chromosomeCanvas = document.getElementById('chromosome-canvas');

if (chromosomeCanvas) {
  const context = chromosomeCanvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = {
    blue: '#00536f',
    deep: '#003a52',
    aqua: '#80cdd2',
    coral: '#ee674d'
  };
  let dimensions = { width: 1, height: 1, dpr: 1 };
  let isVisible = true;

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function rgba(hex, alpha) {
    const color = hexToRgb(hex);
    return `rgba(${color.r},${color.g},${color.b},${alpha})`;
  }

  function resizeCanvas() {
    const bounds = chromosomeCanvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(bounds.width * dpr);
    const height = Math.round(bounds.height * dpr);

    if (chromosomeCanvas.width !== width || chromosomeCanvas.height !== height) {
      chromosomeCanvas.width = width;
      chromosomeCanvas.height = height;
    }

    dimensions = { width: bounds.width, height: bounds.height, dpr };
  }

  function circle(x, y, radius, color, alpha = 1) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = rgba(color, alpha);
    context.fill();
  }

  function drawChromosome(centerX, centerY, scale, rotation, phase) {
    context.save();
    context.translate(centerX, centerY);
    context.rotate(rotation + Math.sin(phase * 0.7) * 0.025);
    context.scale(scale, scale);
    context.lineCap = 'round';
    context.lineJoin = 'round';

    const chromatids = [
      [[-42, -130], [-22, -64], [0, 0], [28, 68], [48, 132]],
      [[42, -130], [22, -64], [0, 0], [-28, 68], [-48, 132]]
    ];

    chromatids.forEach((points, index) => {
      const gradient = context.createLinearGradient(-60, -120, 60, 130);
      gradient.addColorStop(0, rgba(colors.aqua, 0.76));
      gradient.addColorStop(0.52, rgba(colors.blue, 0.96));
      gradient.addColorStop(1, rgba(index ? colors.coral : colors.deep, 0.9));

      context.beginPath();
      context.moveTo(points[0][0], points[0][1]);
      context.bezierCurveTo(points[1][0], points[1][1], points[1][0], points[1][1], points[2][0], points[2][1]);
      context.bezierCurveTo(points[3][0], points[3][1], points[3][0], points[3][1], points[4][0], points[4][1]);
      context.strokeStyle = gradient;
      context.lineWidth = 31;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.shadowColor = rgba(colors.blue, 0.13);
      context.shadowBlur = 14;
      context.stroke();

      // Explicitly cap both ends so the chromosome tips stay fully rounded
      // across browsers and at every animation angle.
      [points[0], points[points.length - 1]].forEach(([x, y]) => {
        context.beginPath();
        context.arc(x, y, 15.5, 0, Math.PI * 2);
        context.fillStyle = gradient;
        context.fill();
      });

      context.beginPath();
      context.moveTo(points[0][0] - 4, points[0][1]);
      context.bezierCurveTo(points[1][0] - 3, points[1][1], points[1][0] - 3, points[1][1], points[2][0] - 2, points[2][1]);
      context.bezierCurveTo(points[3][0] - 3, points[3][1], points[3][0] - 3, points[3][1], points[4][0] - 4, points[4][1]);
      context.strokeStyle = rgba('#ffffff', 0.34);
      context.lineWidth = 4;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.shadowBlur = 0;
      context.stroke();
    });

    circle(0, 0, 18, colors.coral, 0.96);
    context.restore();
  }

  function drawFrame(timestamp) {
    if (isVisible) {
      const { width, height, dpr } = dimensions;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const time = reducedMotion ? 0.8 : timestamp * 0.00042;
      const orbit = time * 0.24;
      const baseScale = Math.min(width / 520, height / 420, 1);
      const firstX = width * 0.42 + Math.cos(orbit) * 20;
      const firstY = height * 0.5 + Math.sin(orbit * 0.73) * 22;
      const secondX = width * 0.69 + Math.cos(orbit + Math.PI) * 23;
      const secondY = height * 0.5 + Math.sin(orbit * 0.81 + 2.1) * 19;
      const firstRock = -0.2 + Math.sin(time * 0.45) * 0.08 + Math.sin(time * 0.17) * 0.03;
      const secondRock = 0.18 + Math.sin(time * 0.38 + 2) * 0.07 + Math.sin(time * 0.13 + 1) * 0.025;

      drawChromosome(
        firstX,
        firstY,
        baseScale * (1 + Math.sin(orbit * 0.59) * 0.045),
        firstRock,
        time
      );
      drawChromosome(
        secondX,
        secondY,
        baseScale * 0.94 * (1 + Math.cos(orbit * 0.67) * 0.04),
        secondRock,
        time + 2
      );
    }

    window.requestAnimationFrame(drawFrame);
  }

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(chromosomeCanvas);

  const visibilityObserver = new IntersectionObserver(entries => {
    isVisible = entries[0].isIntersecting;
  });
  visibilityObserver.observe(chromosomeCanvas);

  resizeCanvas();
  window.requestAnimationFrame(drawFrame);
}
