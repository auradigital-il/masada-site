/* רכיבים משותפים: וואטסאפ צף, באנר קופץ, מונים, לשוניות, הופעה בגלילה, דגלים, נגישות */
(() => {
  const WA = 'https://wa.me/972544413413?text=' + encodeURIComponent('שלום רועי, הגעתי דרך האתר שלך ואשמח לשוחח איתך');
  window.ROEI_WA = WA;
  const ico = {
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2-4 4.3V8H8v3.5h2V22h4V11.5h2.7L17 8h-3Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    a11y: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M19 8.5c-2.2.6-4.5.9-7 .9s-4.8-.3-7-.9l-.5 1.9c1.9.5 3.9.9 6 1V14l-2 7h2l2-6 2 6h2l-2-7v-2.6c2.1-.1 4.1-.5 6-1L19 8.5Z"/></svg>'
  };
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const add = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return document.body.appendChild(t.content.firstChild); };

  // קישורי וואטסאפ בעמוד
  $$('[data-wa]').forEach(a => { a.href = WA; a.target = '_blank'; a.rel = 'noopener'; });

  // כפתור וואטסאפ צף
  add(`<a class="wa-float" href="${WA}" target="_blank" rel="noopener">${ico.wa}<span>פנייה אישית לרועי</span></a>`);

  // רשתות
  $$('[data-socials]').forEach(el => el.innerHTML =
    `<a href="https://www.instagram.com/roei_yehuda/" target="_blank" rel="noopener" aria-label="אינסטגרם">${ico.ig}</a><a href="https://www.facebook.com/roy.yehuda" target="_blank" rel="noopener" aria-label="פייסבוק">${ico.fb}</a><a href="mailto:Roeiyehuda1@gmail.com" aria-label="מייל">${ico.mail}</a><a href="${WA}" target="_blank" rel="noopener" aria-label="וואטסאפ">${ico.wa}</a>`);

  // דגלים
  const FL = [['il','ישראל'],['gr','יוון'],['it','איטליה'],['ae','איחוד האמירויות'],['us','ארצות הברית'],['gb','אנגליה'],['pt','פורטוגל'],['cy','קפריסין']];
  const flags = () => `<div class="flags">${FL.map(([c,n]) => `<span><img src="https://flagcdn.com/w80/${c}.png" alt="" loading="lazy">${n}</span>`).join('')}</div>`;
  $$('[data-flags]').forEach(el => el.innerHTML = flags());
  // מונים בתחתית כל חטיבה (לפי האפיון)
  $$('[data-pstats]').forEach(el => { el.classList.add('pstats'); el.innerHTML =
    `<div><b><span data-count="20">0</span>+</b><span>שנות ניסיון · אלפי עסקאות נדל״ן</span></div>
     <div><b><span data-count="16">0</span></b><span>פרויקטים של התחדשות עירונית בליווי</span></div>
     <div><b><span data-count="8">0</span></b><span>מדינות עם הזדמנויות נדל״ן</span></div><div class="fl" data-flags-run></div>`; });
  $$('[data-flags-run]').forEach(el => { el.classList.add('marquee'); el.innerHTML = `<div class="track">${flags()}${flags()}</div>`; el.querySelectorAll('.flags')[1].setAttribute('aria-hidden','true'); });

  // הופעה בגלילה + מונים
  const count = el => {
    const end = +el.dataset.count, dur = 2200, t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e).toLocaleString('he-IL'); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return;
    e.target.classList.add('in'); if (e.target.dataset.count) count(e.target); io.unobserve(e.target); }), { threshold: .2 });
  $$('.rv,[data-count]').forEach(el => io.observe(el));

  // לשוניות (3 החטיבות)
  $$('[data-tabs]').forEach(box => {
    const btns = $$('[role=tab]', box);
    const show = b => { btns.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls')); p.hidden = !on;
        if (on) $$('[data-count]', p).forEach(c => { c.textContent = '0'; io.observe(c); }); }); };
    btns.forEach((b, i) => { b.addEventListener('click', () => show(b));
      b.addEventListener('keydown', e => { const d = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
        if (d) { const n = btns[(i + d + btns.length) % btns.length]; n.focus(); show(n); } }); });
    const pick = location.hash && btns.find(b => '#' + b.dataset.key === location.hash);
    show(pick || btns.find(b => b.getAttribute('aria-selected') === 'true') || btns[0]);
  });

  // באנר קופץ (פעם אחת בביקור)
  const pop = add(`<div class="pop" role="dialog" aria-modal="true" aria-label="הודעה מרועי"><div class="card">
    <button class="x" aria-label="סגירה">✕</button>
    <div class="q">״מי שמכיר את כל השחקנים<br>קובע את כללי המשחק״</div>
    <div class="who">רועי יהודה · קבוצת מצדה</div>
    <a class="go" href="${WA}" target="_blank" rel="noopener">לשיחה אישית עם רועי</a></div></div>`);
  let seen = false; try { seen = sessionStorage.getItem('roei-pop'); } catch (_) {}
  const close = () => { pop.classList.remove('on'); };
  const open = () => { if (seen) return; seen = true; try { sessionStorage.setItem('roei-pop', 1); } catch (_) {} pop.classList.add('on'); $('.x', pop).focus(); };
  pop.addEventListener('click', e => { if (e.target === pop || e.target.closest('.x')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  // הבאנר מופיע כשמגיעים לחלק של התחומים (data-pop), ואם אין – אחרי חצי דקה
  const anchor = document.querySelector('[data-pop]');
  if (anchor) new IntersectionObserver((es, o) => { if (es[0].isIntersecting){ setTimeout(open, 1200); o.disconnect(); } }, { threshold: .35 }).observe(anchor);
  else setTimeout(open, 30000);

  // נגישות
  const btn = add(`<button class="a11y-btn" aria-expanded="false" aria-controls="a11yP" aria-label="תפריט נגישות">${ico.a11y}</button>`);
  const pnl = add(`<div class="a11y-panel" id="a11yP" role="dialog" aria-label="נגישות" hidden><b>נגישות</b>
    <button data-a="a-big" aria-pressed="false">הגדלת טקסט</button><button data-a="a-contrast" aria-pressed="false">ניגודיות גבוהה</button>
    <button data-a="a-links" aria-pressed="false">הדגשת קישורים</button><button data-a="a-still" aria-pressed="false">עצירת אנימציות</button>
    <button data-reset>איפוס</button></div>`);
  const root = document.documentElement;
  const apply = list => { $$('[data-a]', pnl).forEach(b => { const on = list.includes(b.dataset.a); b.setAttribute('aria-pressed', on); root.classList.toggle(b.dataset.a, on); });
    $$('video[autoplay]').forEach(v => list.includes('a-still') ? v.pause() : v.play().catch(()=>{}));
    try { localStorage.setItem('roei-a11y', JSON.stringify(list)); } catch (_) {} };
  btn.onclick = () => { pnl.hidden = !pnl.hidden; btn.setAttribute('aria-expanded', !pnl.hidden); };
  pnl.onclick = e => { const b = e.target.closest('button'); if (!b) return;
    const cur = $$('[data-a][aria-pressed=true]', pnl).map(x => x.dataset.a);
    apply(b.dataset.reset !== undefined ? [] : cur.includes(b.dataset.a) ? cur.filter(x => x !== b.dataset.a) : [...cur, b.dataset.a]); };
  try { apply(JSON.parse(localStorage.getItem('roei-a11y') || '[]')); } catch (_) {}

  // תווית סקיצה
  add(`<a class="sketch-tag" href="${location.pathname.includes('/v2/') ? '../../' : '../'}">← כל הסקיצות</a>`);
})();
