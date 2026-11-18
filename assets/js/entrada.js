(() => {
  'use strict';
  const canvas = document.querySelector('#particles');
  const ctx = canvas?.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stars = [];
  let frame = 0;
  let width = 0;
  let height = 0;
  function resize() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(58, Math.floor(width * height / 16000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + .35,
      speed: Math.random() * .18 + .04,
      alpha: Math.random() * .5 + .22,
      phase: Math.random() * Math.PI * 2
    }));
    draw(0);
  }
  function draw(time) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const glow = .55 + .45 * Math.sin(time * .001 + star.phase);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229,215,255,${star.alpha * glow})`;
      ctx.shadowColor = '#b99aff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      if (!reduceMotion.matches) {
        star.y -= star.speed;
        if (star.y < -4) { star.y = height + 4; star.x = Math.random() * width; }
      }
    }
  }
  function animate(time) {
    draw(time);
    frame = requestAnimationFrame(animate);
  }
  function start() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (reduceMotion.matches || document.hidden) { draw(0); return; }
    frame = requestAnimationFrame(animate);
  }
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', start);
  if (typeof reduceMotion.addEventListener === 'function') reduceMotion.addEventListener('change', start);
  else reduceMotion.addListener?.(start);
  resize();
  start();

  document.querySelectorAll('a[data-transition]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduceMotion.matches) return;
      event.preventDefault();
      const destination = link.href;
      document.body.classList.add('is-leaving');
      setTimeout(() => { window.location.href = destination; }, 360);
    });
  });
})();
