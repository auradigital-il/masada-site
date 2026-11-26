/* מפת עולם מונפשת לתיווך "בארץ ובעולם": יבשות מנקודות זהב, וקווים שיוצאים מישראל ל-7 המדינות האחרות.
   שימוש: <div data-worldmap></div> בתוך מסגרת. נטען אחרי core.js */
(() => {
  const boxes = [...document.querySelectorAll('[data-worldmap]')];
  if (!boxes.length) return;
  const T = window.ROEI_T, lang = () => (window.ROEI && ROEI.lang) || 'he';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // [קוד, קו רוחב, קו אורך] באותו סדר כמו שמות המדינות ב-content.js
  const C = [['il',31.8,35.0],['gr',38.5,23.0],['it',42.5,12.5],['ae',24.5,54.5],['us',40.0,-95.0],['gb',52.5,-1.5],['pt',39.5,-8.2],['cy',35.0,33.2]];
  const LON0 = -100, LON1 = 62, LAT0 = 4, LAT1 = 64;
  const merc = lat => Math.log(Math.tan(Math.PI/4 + lat*Math.PI/360));
  const Y0 = merc(LAT0), Y1 = merc(LAT1);
  let landP = null;
  const loadLand = () => landP || (landP = (async () => {
    const topo = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json').then(r => r.json());
    const tc = await import('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm');
    return tc.feature(topo, topo.objects.land);
  })());

  boxes.forEach(box => {
    box.classList.add('wmap');
    box.innerHTML = '<canvas></canvas><div class="wm-lbl" aria-hidden="true"></div><div class="wm-count"><b>8</b><span></span></div>';
    const cv = box.querySelector('canvas'), ctx = cv.getContext('2d'), lbl = box.querySelector('.wm-lbl'), cnt = box.querySelector('.wm-count span');
    let W = 0, H = 0, dpr = 1, dots = null, land = null, run = false, t0 = 0;
    const css = getComputedStyle(document.documentElement);
    const gold = (css.getPropertyValue('--acc') || '#D9B577').trim(), gold2 = (css.getPropertyValue('--acc2') || '#F6E3B6').trim();
    // מיקום על המסך: ממלא את המסגרת וממרכז את ישראל-אירופה
    let sx, sy, ox, oy;
    const fit = () => {
      const r = box.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1);
      W = Math.max(1, r.width); H = Math.max(1, r.height); cv.width = W*dpr; cv.height = H*dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      const mw = (LON1 - LON0)*Math.PI/180, mh = Y1 - Y0, k = Math.min(W/mw, H/mh)*1.04;
      sx = sy = k; ox = (W - mw*k)/2; oy = (H - mh*k)/2;
      dots = null;
    };
    const P = (lat, lon) => [ox + (lon - LON0)*Math.PI/180*sx, oy + (Y1 - merc(lat))*sy];
    const buildDots = () => {
      if (!land) return;
      const off = document.createElement('canvas'); off.width = Math.ceil(W); off.height = Math.ceil(H); const o = off.getContext('2d');
      o.fillStyle = '#fff';
      land.features.forEach(f => { const g = f.geometry, polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
        polys.forEach(pl => { o.beginPath(); pl.forEach(ring => ring.forEach(([lo, la], j) => { const la2 = Math.max(-80, Math.min(80, la)); const [x, y] = P(la2, lo); j ? o.lineTo(x, y) : o.moveTo(x, y); })); o.fill('evenodd'); }); });
      const d = o.getImageData(0, 0, off.width, off.height).data, step = Math.max(4, Math.round(W/110)); dots = [];
      for (let y = step/2; y < off.height; y += step) for (let x = step/2; x < off.width; x += step) if (d[((y|0)*off.width + (x|0))*4 + 3] > 120) dots.push([x, y]);
      dots.step = step;
    };
    const il = () => P(C[0][1], C[0][2]);
    const SEG = 1.6; // שניות לכל מדינה
    const arc = (a, b, k) => { const mx = (a[0]+b[0])/2, my = (a[1]+b[1])/2 - Math.hypot(b[0]-a[0], b[1]-a[1])*.32;
      const q = (t) => [(1-t)*(1-t)*a[0] + 2*(1-t)*t*mx + t*t*b[0], (1-t)*(1-t)*a[1] + 2*(1-t)*t*my + t*t*b[1]]; return q; };
    let lastIdx = -1;
    const frame = now => {
      if (!run) return;
      if (!dots) buildDots();
      const t = (now - t0)/1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      // נקודות היבשה
      if (dots){ ctx.fillStyle = gold; const r = dots.step*.26;
        for (const [x, y] of dots){ ctx.globalAlpha = .42 + .16*Math.sin(x*.05 + y*.03 + t*.8); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; }
      const a = il(), n = C.length - 1, cyc = t / SEG, idx = Math.floor(cyc) % n, ph = cyc - Math.floor(cyc);
      // קווים שכבר צוירו בסבב הנוכחי
      const round = Math.floor(cyc / n);
      for (let i = 1; i <= n; i++){
        const done = (i - 1) < idx || (i - 1 === idx && ph >= .55);
        const cur = i - 1 === idx; const b = P(C[i][1], C[i][2]), q = arc(a, b);
        const prog = cur ? Math.min(1, ph/.55) : done ? 1 : 0;
        if (prog > 0){ ctx.beginPath(); for (let s = 0; s <= 40; s++){ const p = q(s/40*prog); s ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
          ctx.strokeStyle = gold; ctx.globalAlpha = cur ? .95 : .45; ctx.lineWidth = cur ? 1.8 : 1.1; ctx.stroke(); ctx.globalAlpha = 1;
          if (cur && prog < 1){ const p = q(prog); ctx.fillStyle = gold2; ctx.shadowColor = gold2; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, 7); ctx.fill(); ctx.shadowBlur = 0; } }
        // סיכה
        if (done || (cur && prog >= 1)){ const pulse = cur ? (1 + Math.sin(t*8)*.25) : 1; ctx.fillStyle = gold2; ctx.shadowColor = gold2; ctx.shadowBlur = cur ? 16 : 6;
          ctx.beginPath(); ctx.arc(b[0], b[1], 3.4*pulse, 0, 7); ctx.fill(); ctx.shadowBlur = 0; }
      }
      // ישראל: נקודת המוצא
      const pr = 5 + Math.sin(t*3)*1.2; ctx.fillStyle = gold2; ctx.shadowColor = gold2; ctx.shadowBlur = 20; ctx.beginPath(); ctx.arc(a[0], a[1], pr, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = gold2; ctx.globalAlpha = .5*(1 - (t % 1.6)/1.6); ctx.beginPath(); ctx.arc(a[0], a[1], 6 + (t % 1.6)*14, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
      // תווית המדינה הנוכחית
      if (idx !== lastIdx){ lastIdx = idx; const i = idx + 1, b = P(C[i][1], C[i][2]), names = (T[lang()] || T.he).flags;
        lbl.innerHTML = `<img src="https://flagcdn.com/w40/${C[i][0]}.png" alt="">${names[i]}`;
        lbl.style.left = Math.min(W - 10, Math.max(10, b[0])) + 'px'; lbl.style.top = b[1] + 'px';
        lbl.classList.toggle('below', b[1] < 60); lbl.classList.remove('on'); void lbl.offsetWidth; }
      lbl.classList.toggle('on', ph > .5 && ph < .97);
      requestAnimationFrame(frame);
    };
    const start = async () => {
      if (run) return; run = true; fit();
      try { land = await loadLand(); } catch (e) { box.classList.add('wm-fail'); }
      t0 = performance.now(); requestAnimationFrame(frame);
    };
    const setCount = () => { cnt.innerHTML = lang() === 'he' ? 'מדינות<br>רשת קשרים אחת' : 'countries<br>one network'; };
    setCount(); addEventListener('roei:lang', () => { setCount(); lastIdx = -1; });
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) start(); else run = false; }), {threshold:.1}).observe(box);
    addEventListener('resize', () => { if (run){ fit(); } });
    if (reduce) { /* במצב בלי תנועה: מציג את כל הקווים בלי הנפשה */ t0 = performance.now() - SEG*1000*6.9; }
  });
})();
