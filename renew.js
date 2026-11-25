/* הנפשת החזון של ההתחדשות העירונית: מהבניין הישן ועד הדירה החדשה, מתקדמת עם הגלילה.
   משתמשים: <section class="renew" data-renew></section> + gsap + ScrollTrigger. הצבעים מגיעים מהמשתנים --ra-* של כל סקיצה */
(() => {
  const host = document.querySelector('[data-renew]');
  if (!host || !window.gsap) return;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const CAP = [
    ['01', 'פגישת היכרות עם דיירי הבניין', 'בודקים יחד את הנכונות ומסבירים את התהליך'],
    ['02', 'הדיירים מתאחדים', 'מקימים נציגות דיירים ובודקים את זכויות הבנייה'],
    ['03', 'מכרז יזמים', 'הכוח עובר אליכם, בעלי הנכסים<br>אתם בוחרים את ההצעה הטובה ביותר'],
    ['04', 'פיקוח עד המפתח', 'אנחנו מלווים את התכנון, הבנייה ומסירת הדירות'],
    ['05', 'הדירה החדשה', 'אנחנו רצים עבורכם<br>ומקרבים אתכם אל עבר הדירה החדשה']
  ];
  host.innerHTML = `<div class="ra-stage"><div class="ra-head"><span class="ra-cap">THE VISION</span><h3>מהבניין הישן<br><b>אל הדירה החדשה</b></h3></div>
    <div class="ra-svg"></div><div class="ra-caps">${CAP.map((c,i) => `<div class="ra-c" data-i="${i}"><span>${c[0]}</span><b>${c[1]}</b><p>${c[2]}</p></div>`).join('')}</div>
    <div class="ra-dots">${CAP.map(() => '<i></i>').join('')}</div></div>`;
  const svg = el('svg', {viewBox:'90 80 1020 590', preserveAspectRatio:'xMidYMid meet', role:'img', 'aria-label':'הנפשה: בניין ישן הופך לבניין חדש בליווי קבוצת מצדה'}, host.querySelector('.ra-svg'));
  const defs = el('defs', {}, svg);
  const lg = el('linearGradient', {id:'raG', x1:0, y1:0, x2:1, y2:1}, defs);
  [['0','#B98A4E'],['.5','#F0D9A8'],['1','#9C7038']].forEach(([o,c]) => el('stop', {offset:o, 'stop-color':c}, lg));
  const glow = el('filter', {id:'raGlow', x:'-50%', y:'-50%', width:'200%', height:'200%'}, defs);
  el('feGaussianBlur', {stdDeviation:6, result:'b'}, glow); const fm = el('feMerge', {}, glow); el('feMergeNode', {in:'b'}, fm); el('feMergeNode', {in:'SourceGraphic'}, fm);

  const G = cls => el('g', {class:cls}, svg);
  // קרקע
  el('line', {x1:80, y1:640, x2:1120, y2:640, class:'ra-ground'}, svg);

  // הבניין הישן: 4 קומות, 4 דירות בכל קומה
  const old = G('ra-old');
  const ox = 440, ow = 320, fh = 66, oy = 640 - fh*4;
  el('rect', {x:ox, y:oy, width:ow, height:fh*4, class:'ra-line'}, old);
  for (let f = 1; f < 4; f++) el('line', {x1:ox, y1:oy+fh*f, x2:ox+ow, y2:oy+fh*f, class:'ra-thin'}, old);
  el('line', {x1:ox-10, y1:oy, x2:ox+ow+10, y2:oy, class:'ra-line'}, old);
  const winOld = [];
  for (let f = 0; f < 4; f++) for (let c = 0; c < 4; c++) {
    const x = ox + 22 + c*76, y = oy + 18 + f*fh;
    el('rect', {x, y, width:44, height:32, class:'ra-thin'}, old);
    winOld.push(el('rect', {x:x+2, y:y+2, width:40, height:28, class:'ra-lit', opacity:0}, old));
  }
  // סדקים
  [['M500 420 l14 22 l-8 16 l12 20'], ['M700 520 l-10 18 l8 14'], ['M620 300 l6 18 l-10 12']].forEach(([d]) => el('path', {d, class:'ra-crack'}, old));

  // נציגות: 16 נקודות במעגל מעל הבניין
  const council = G('ra-council');
  const cx = 600, cy = 170, cr = 70, dots = [];
  winOld.forEach((w, i) => { const a = i/16*Math.PI*2 - Math.PI/2;
    const d = el('circle', {cx:+w.getAttribute('x')+20, cy:+w.getAttribute('y')+14, r:6, class:'ra-dot', opacity:0}, council);
    d.dataset.tx = cx + Math.cos(a)*cr; d.dataset.ty = cy + Math.sin(a)*cr; dots.push(d); });
  const ring = el('circle', {cx, cy, r:cr, class:'ra-ring', opacity:0}, council);
  const dm = el('rect', {x:cx-14, y:cy-14, width:28, height:28, rx:3, transform:`rotate(45 ${cx} ${cy})`, fill:'url(#raG)', opacity:0, filter:'url(#raGlow)'}, council);

  // מכרז: 3 הצעות של יזמים
  const tender = G('ra-tender'), cards = [];
  [[150,'יזם א׳',.55],[475,'יזם ב׳',.92],[800,'יזם ג׳',.68]].forEach(([x, name, score], i) => {
    const g = el('g', {class:'ra-card', opacity:0}, tender);
    el('rect', {x, y:200, width:250, height:190, rx:14, class:'ra-cardbox'}, g);
    const t = el('text', {x:x+225, y:240, class:'ra-t'}, g); t.textContent = name;
    ['תמורה','מפרט','ערבויות'].forEach((k, j) => { const lt = el('text', {x:x+225, y:282+j*36, class:'ra-ts'}, g); lt.textContent = k;
      el('rect', {x:x+22, y:270+j*36, width:130, height:8, rx:4, class:'ra-bar0'}, g);
      el('rect', {x:x+22, y:270+j*36, width:130*Math.min(1, score + (j-1)*.06), height:8, rx:4, class:i === 1 ? 'ra-barG' : 'ra-bar'}, g); });
    cards.push(g); });
  const pick = el('rect', {x:465, y:190, width:270, height:210, rx:18, class:'ra-pick', opacity:0}, tender);

  // המגדל החדש: 12 קומות עם מרפסות
  const neu = G('ra-new');
  const nx = 470, nw = 260, nfh = 38, nf = 12, ny = 640 - nfh*nf;
  const clip = el('clipPath', {id:'raRise'}, defs); const clipR = el('rect', {x:0, y:640, width:1200, height:0}, clip);
  const tower = el('g', {'clip-path':'url(#raRise)'}, neu);
  el('rect', {x:nx, y:ny, width:nw, height:nfh*nf, class:'ra-gold'}, tower);
  const winNew = [];
  for (let f = 0; f < nf; f++) {
    const y = ny + f*nfh;
    el('path', {d:`M${nx-16} ${y+nfh} q ${nw/2+16} ${f%2 ? 10 : -10} ${nw+32} 0`, class:'ra-balc'}, tower);
    for (let c = 0; c < 5; c++) winNew.push(el('rect', {x:nx+14+c*49, y:y+8, width:36, height:22, class:'ra-lit2', opacity:0}, tower));
  }
  el('line', {x1:nx+nw/2, y1:ny-40, x2:nx+nw/2, y2:ny, class:'ra-gold'}, tower);
  // מנוף
  const crane = el('g', {class:'ra-crane', opacity:0}, neu);
  el('path', {d:'M880 640 V170 M880 190 H600 M880 190 H960 M880 170 L960 190 M880 170 L620 190', class:'ra-thin'}, crane);
  const hook = el('line', {x1:700, y1:190, x2:700, y2:260, class:'ra-thin'}, crane);
  // מפתח
  const keyWrap = el('g', {transform:'translate(570 112) scale(1.2)'}, neu), key = el('g', {class:'ra-key', opacity:0}, keyWrap);
  el('circle', {cx:0, cy:0, r:18, class:'ra-goldfill'}, key); el('circle', {cx:0, cy:0, r:7, fill:'var(--ra-bg)'}, key);
  el('path', {d:'M18 0 H70 V14 M56 0 V10', class:'ra-keyline'}, key);

  // מסלולי ציור
  svg.querySelectorAll('.ra-old .ra-line,.ra-old .ra-thin').forEach(p => { const L = p.getTotalLength ? p.getTotalLength() : 600; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });

  const caps = [...host.querySelectorAll('.ra-c')], pips = [...host.querySelectorAll('.ra-dots i')];
  const showCap = i => { caps.forEach((c, k) => c.classList.toggle('on', k === i)); pips.forEach((p, k) => p.classList.toggle('on', k <= i)); };
  showCap(0);

  const tl = gsap.timeline({defaults:{ease:'power2.inOut'}, scrollTrigger:{trigger:host, start:'top top', end:'bottom bottom', scrub:.8,
    onUpdate(s){ showCap(Math.min(4, Math.floor(s.progress*5.2))); }}});
  // 1 · הבניין הישן מצטייר והחלונות נדלקים
  tl.to('.ra-old .ra-line,.ra-old .ra-thin', {strokeDashoffset:0, duration:1.4, stagger:.01}, 0)
    .to(winOld, {opacity:1, duration:.3, stagger:{each:.04, from:'random'}}, .9)
    .from('.ra-crack', {opacity:0, duration:.4}, 1.2);
  // 2 · נקודות אור עוזבות את הדירות ומתאחדות לנציגות
  tl.to(dots, {opacity:1, duration:.2}, 2)
    .to(dots, {attr:{cx:(i, d) => d.dataset.tx, cy:(i, d) => d.dataset.ty}, duration:1.1, stagger:.03}, 2.1)
    .to(winOld, {opacity:.15, duration:.6}, 2.2)
    .to(ring, {opacity:1, duration:.5}, 3)
    .to(dm, {opacity:1, duration:.5}, 3.2);
  // 3 · מכרז: ההצעות נכנסות, אחת נבחרת
  tl.to('.ra-council', {y:-40, opacity:0, duration:.6}, 4)
    .to('.ra-old', {opacity:.18, duration:.6}, 4)
    .fromTo(cards, {opacity:0, y:40}, {opacity:1, y:0, duration:.7, stagger:.15}, 4.2)
    .to(pick, {opacity:1, duration:.5}, 5.2)
    .to([cards[0], cards[2]], {opacity:.25, duration:.5}, 5.2)
    .to(cards[1], {scale:1.06, transformOrigin:'600px 295px', duration:.5}, 5.2);
  // 4 · הבניין הישן יורד, המגדל עולה
  tl.to('.ra-tender', {opacity:0, duration:.5}, 6.2)
    .to('.ra-old', {y:60, opacity:0, duration:.8}, 6.3)
    .to(crane, {opacity:1, duration:.4}, 6.6)
    .to(clipR, {attr:{y:ny-50, height:640-ny+50}, duration:2, ease:'none'}, 6.8)
    .to(hook, {attr:{y2:330}, duration:1, yoyo:true, repeat:1, ease:'sine.inOut'}, 6.9);
  // 5 · הדירות נדלקות, המנוף יורד, המפתח מופיע
  tl.to(crane, {opacity:0, duration:.4}, 8.9)
    .to(winNew, {opacity:1, duration:.25, stagger:{each:.012, from:'end'}}, 8.9)
    .fromTo(key, {opacity:0, y:20}, {opacity:1, y:0, duration:.6}, 9.6)
    .to({}, {duration:.6});
})();
