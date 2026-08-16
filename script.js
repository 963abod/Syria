(() => {
  const wrap = document.querySelector('.map-tilt');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (!wrap || prefersReduced || isCoarsePointer) return;

  // Very subtle parallax tilt that follows the pointer, layered on top of
  // the CSS float/breathe animations. Kept small so it reads as "floating
  // in space", not as a gimmick.
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const maxTilt = 5; // degrees

  window.addEventListener('pointermove', (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetX = nx * maxTilt;
    targetY = ny * maxTilt;
  });

  function tick() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;
    wrap.style.setProperty('--tiltX', `${-currentY.toFixed(2)}deg`);
    wrap.style.setProperty('--tiltY', `${currentX.toFixed(2)}deg`);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
