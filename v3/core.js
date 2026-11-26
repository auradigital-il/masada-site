/* מנוע משותף לסקיצות החדשות: שפה (עברית/אנגלית), עמודים שנפתחים מהכפתורים הצפים,
   וואטסאפ צף, נגישות, טפסים, סרגל שליטה לסרטונים */
(() => {
  const T = window.ROEI_T, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const add = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return document.body.appendChild(t.content.firstChild); };
  const root = document.documentElement;
  const waIco = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';
  const a11yIco = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M19 8.5c-2.2.6-4.5.9-7 .9s-4.8-.3-7-.9l-.5 1.9c1.9.5 3.9.9 6 1V14l-2 7h2l2-6 2 6h2l-2-7v-2.6c2.1-.1 4.1-.5 6-1L19 8.5Z"/></svg>';
  const PHONE = '972544413413';

  /* ---------- שפה ---------- */
  let lang = 'he';
  try { lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('roei-lang') || 'he'; } catch (_) {}
  if (!T[lang]) lang = 'he';
  const t = k => T[lang][k] ?? T.he[k] ?? '';
  window.ROEI = { t, get lang(){ return lang; } };

  // וואטסאפ צף
  const waf = add(`<a class="waf" target="_blank" rel="noopener">${waIco}<span data-t="wa"></span></a>`);
  // כפתור שפה
  const lb = $('[data-lang]');
  // נגישות
  const ab = add(`<button class="a11y-btn" aria-expanded="false" aria-controls="a11yP">${a11yIco}</button>`);
  const ap = add(`<div class="a11y-panel" id="a11yP" role="dialog" hidden><b data-t="a_t"></b>
    <button data-a="a-big" aria-pressed="false" data-t="a_big"></button><button data-a="a-contrast" aria-pressed="false" data-t="a_con"></button>
    <button data-a="a-links" aria-pressed="false" data-t="a_links"></button><button data-a="a-still" aria-pressed="false" data-t="a_still"></button>
    <button data-reset data-t="a_reset"></button></div>`);
  add(`<a class="sketch-tag" href="../../" data-t="sketch"></a>`);

  function applyLang(){
    root.lang = lang; root.dir = lang === 'he' ? 'rtl' : 'ltr';
    $$('[data-t]').forEach(el => { el.innerHTML = t(el.dataset.t); });
    $$('[data-t-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.tAria)));
    waf.href = `https://wa.me/${PHONE}?text=${encodeURIComponent(t('wa_msg'))}`;
    $$('[data-wa]').forEach(a => { a.href = waf.href; a.target = '_blank'; a.rel = 'noopener'; });
    if (lb){ lb.textContent = t('lang_btn'); lb.setAttribute('aria-label', t('lang_aria')); }
    ab.setAttribute('aria-label', t('a_btn')); ap.setAttribute('aria-label', t('a_t'));
    $$('[data-flags]').forEach(el => { const C = ['il','gr','it','ae','us','gb','pt','cy'];
      el.innerHTML = C.map((c, i) => `<span><img src="https://flagcdn.com/w40/${c}.png" alt="" loading="lazy">${t('flags')[i]}</span>`).join(''); });
    $$('[data-form]').forEach(renderForm);
    $$('.vctl').forEach(b => b.__sync && b.__sync());
    document.title = (lang === 'he' ? 'רועי יהודה · תיווך נדל״ן' : 'Roei Yehuda · Real Estate') + ' · ' + (document.body.dataset.sketch || '');
    dispatchEvent(new CustomEvent('roei:lang', {detail:lang}));
  }
  if (lb) lb.addEventListener('click', () => { lang = lang === 'he' ? 'en' : 'he'; try { localStorage.setItem('roei-lang', lang); } catch (_) {} applyLang(); });

  /* ---------- עמודים: נפתחים מהכפתורים הצפים ---------- */
  const pages = $$('.page');
  let current = 'home', ox = innerWidth/2, oy = innerHeight;
  addEventListener('pointerdown', e => { const b = e.target.closest('[data-go]'); if (b){ const r = b.getBoundingClientRect(); ox = r.left + r.width/2; oy = r.top + r.height/2; } }, true);
  $$('[data-go]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const g = b.dataset.go;
    if (g === current) return; location.hash = g; }));
  $$('[data-close]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); goHome(); }));
  const goHome = () => { history.pushState(null, '', location.pathname + location.search); route(); };
  function route(){
    const name = location.hash.slice(1), pg = name && $('#p-' + name);
    const next = pg ? name : 'home';
    if (next === current) return;
    pages.forEach(p => { const on = p === pg;
      if (on){ p.style.setProperty('--ox', ox + 'px'); p.style.setProperty('--oy', oy + 'px'); p.scrollTop = 0;
        p.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('on')));
        $$('.rv', p).forEach((el, i) => el.style.setProperty('--d', (.25 + Math.min(i, 8)*.07).toFixed(2) + 's'));
      } else if (p.classList.contains('on')){ p.classList.remove('on'); $$('video', p).forEach(v => { v.pause(); v.__muteAway && v.__muteAway(); });
        setTimeout(() => { if (!p.classList.contains('on')) p.hidden = true; }, 900); } });
    root.classList.toggle('paged', !!pg);
    $$('[data-go]').forEach(b => b.setAttribute('aria-current', b.dataset.go === next ? 'page' : 'false'));
    current = next;
    if (pg){ setTimeout(() => { const h = $('h1,h2', pg); h && h.focus({preventScroll:true}); }, 500);
      $$('video[data-auto]', pg).forEach(v => { if (!v.dataset.userPaused) v.play().catch(() => {}); }); }
    dispatchEvent(new CustomEvent('roei:page', {detail:next}));
  }
  addEventListener('hashchange', route);
  addEventListener('keydown', e => { if (e.key === 'Escape' && current !== 'home') goHome(); });

  /* ---------- סרגל שליטה לסרטון ---------- */
  $$('[data-vctl]').forEach(box => {
    const v = $('video', box); if (!v) return;
    const bar = document.createElement('div'); bar.className = 'vctl'; box.appendChild(bar);
    const mk = (cls, txt) => { const x = document.createElement('button'); x.type = 'button'; x.className = cls; x.textContent = txt; bar.appendChild(x); return x; };
    const back = mk('vc', '⟲ 10'), pp = mk('vc', '❚❚'), fwd = mk('vc', '10 ⟳'), snd = mk('snd', '');
    const sync = bar.__sync = () => { snd.textContent = v.muted ? t('v_on') : t('v_off'); pp.textContent = v.paused ? '▶' : '❚❚';
      pp.setAttribute('aria-label', v.paused ? t('v_play') : t('v_pause')); back.setAttribute('aria-label', t('v_back')); fwd.setAttribute('aria-label', t('v_fwd')); };
    const seek = d => { if (isFinite(v.duration)) v.currentTime = Math.max(0, Math.min(v.duration - .1, v.currentTime + d)); };
    back.onclick = () => seek(-10); fwd.onclick = () => seek(10);
    pp.onclick = () => { if (v.paused){ v.dataset.userPaused = ''; v.play().catch(() => {}); } else { v.dataset.userPaused = '1'; v.pause(); } };
    snd.onclick = () => { v.muted = !v.muted; if (!v.muted){ if (!v.dataset.heard){ v.dataset.heard = 1; v.currentTime = 0; } v.dataset.userPaused = ''; v.play().catch(() => {}); } sync(); };
    ['play','pause','volumechange'].forEach(ev => v.addEventListener(ev, sync));
    v.__muteAway = () => { if (!v.muted){ v.muted = true; sync(); } };
    new IntersectionObserver(es => es.forEach(e => { if (e.intersectionRatio < .3) v.__muteAway(); }), {threshold:[0,.3]}).observe(v);
    sync();
  });

  /* ---------- טפסים: בסקיצה הפנייה נפתחת בוואטסאפ של רועי ---------- */
  function renderForm(box){
    const topic = box.dataset.form, small = topic === 't_m26';
    box.classList.add('cform');
    box.innerHTML = `<form novalidate>
      <label>${t('f_name')}<input name="name" autocomplete="name" required></label>
      <label>${t('f_phone')}<input name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required></label>
      ${small ? '' : `<label class="full">${t('f_city')}<input name="addr" autocomplete="street-address"></label>
      <label class="full">${t('f_msg')}<textarea name="msg" rows="3"></textarea></label>`}
      <label class="full ok"><input type="checkbox" name="ok" required><span>${t('f_ok')}</span></label>
      <button class="send full" type="submit">${t('f_send')}</button>
      <p class="err full" role="alert" hidden>${t('f_err')}</p><p class="done full" role="status" hidden>${t('f_sent')}</p></form>`;
    const f = $('form', box);
    f.addEventListener('submit', e => { e.preventDefault(); const d = new FormData(f), err = $('.err', f);
      if (!d.get('name') || !d.get('phone') || !d.get('ok')) { err.hidden = false; return; } err.hidden = true;
      const msg = `${t('f_hello')}\n${t('f_name')}: ${d.get('name')}\n${t('f_phone')}: ${d.get('phone')}\n${t('f_topic')}: ${t(topic)}${d.get('addr') ? '\n' + d.get('addr') : ''}${d.get('msg') ? '\n' + d.get('msg') : ''}`;
      window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      $('.done', f).hidden = false; });
  }

  /* ---------- נגישות ---------- */
  const applyA = list => { $$('[data-a]', ap).forEach(b => { const on = list.includes(b.dataset.a); b.setAttribute('aria-pressed', on); root.classList.toggle(b.dataset.a, on); });
    try { localStorage.setItem('roei-a11y', JSON.stringify(list)); } catch (_) {} };
  ab.onclick = () => { ap.hidden = !ap.hidden; ab.setAttribute('aria-expanded', !ap.hidden); };
  ap.onclick = e => { const b = e.target.closest('button'); if (!b) return; const cur = $$('[data-a][aria-pressed=true]', ap).map(x => x.dataset.a);
    applyA(b.dataset.reset !== undefined ? [] : cur.includes(b.dataset.a) ? cur.filter(x => x !== b.dataset.a) : [...cur, b.dataset.a]); };
  try { applyA(JSON.parse(localStorage.getItem('roei-a11y') || '[]')); } catch (_) {}

  /* ---------- הופעה בגלילה בעמוד הראשי ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.15});
  $$('.home .rv, .home-rv').forEach(el => io.observe(el));

  /* ---------- תפריט מלא (בעיקר לטלפון) ---------- */
  const mb = add(`<button class="mnav-btn" type="button" aria-expanded="false" aria-controls="mnav"><i></i></button>`);
  const mn = add(`<nav class="mnav" id="mnav" hidden><div class="mn-in">
    <a class="it" href="#" data-mgo="home"><span data-t="m_home"></span></a>
    <a class="it big" href="#broker" data-mgo="broker"><span data-t="dock_broker"></span><small data-t="dock_broker_s"></small></a>
    <a class="it big" href="#renew" data-mgo="renew"><span data-t="dock_renew"></span><small data-t="dock_renew_s"></small></a>
    <a class="it big" href="#m26" data-mgo="m26"><span data-t="dock_m26"></span><small data-t="dock_m26_s"></small></a>
    <a class="it" href="#articles" data-mgo="articles"><span data-t="h_more_art"></span></a>
    <a class="it" href="#press" data-mgo="press"><span data-t="h_more_press"></span></a>
    <a class="it" href="#renew" data-mgo="renew" data-mto="renew-form"><span data-t="m_contact"></span></a>
    <div class="mn-row"><a class="mn-wa" data-wa>${waIco}<span data-t="wa"></span></a><a class="mn-tel" href="tel:+972544413413"><span data-t="m_call"></span> 054-4413413</a></div>
    <div class="mn-foot"><span data-t="m_follow"></span><div class="socials" data-socials></div><button class="mn-lang" type="button" data-t="m_lang"></button></div>
  </div></nav>`);
  const setMenu = on => { if (on){ mn.hidden = false; requestAnimationFrame(() => mn.classList.add('on')); } else { mn.classList.remove('on'); setTimeout(() => { if (!mn.classList.contains('on')) mn.hidden = true; }, 500); }
    mb.setAttribute('aria-expanded', on); mb.setAttribute('aria-label', t(on ? 'menu_close' : 'menu')); root.classList.toggle('menu-on', on); };
  mb.onclick = () => setMenu(!mn.classList.contains('on'));
  mn.addEventListener('click', e => { const a = e.target.closest('[data-mgo]');
    if (e.target.closest('.mn-lang')){ lb && lb.click(); return; }
    if (!a) return; e.preventDefault(); setMenu(false); const g = a.dataset.mgo, to = a.dataset.mto;
    if (g === 'home') goHome(); else if (g !== current) location.hash = g;
    if (to) setTimeout(() => { const el = document.getElementById(to); el && el.scrollIntoView({behavior:'smooth', block:'start'}); }, 950); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && mn.classList.contains('on')) setMenu(false); });
  addEventListener('roei:page', e => $$('[data-mgo]', mn).forEach(a => a.classList.toggle('cur', a.dataset.mgo === e.detail && !a.dataset.mto)));
  addEventListener('roei:lang', () => mb.setAttribute('aria-label', t(mn.classList.contains('on') ? 'menu_close' : 'menu')));

  /* ---------- כפתור שפותח/סוגר חלק (בקשת סיסמה) ---------- */
  $$('[data-toggle]').forEach(b => b.addEventListener('click', () => { const el = document.getElementById(b.dataset.toggle); el.hidden = !el.hidden; b.setAttribute('aria-expanded', !el.hidden); if (!el.hidden) setTimeout(() => { const i = $('input', el); i && i.focus(); }, 50); }));

  /* ---------- רשתות בתחתית ---------- */
  const IG = 'https://www.instagram.com/roei_yehuda/';
  const ico = {
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2-4 4.3V8H8v3.5h2V22h4V11.5h2.7L17 8h-3Z"/></svg>',
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>' };
  const socials = () => $$('[data-socials]').forEach(el => { el.innerHTML =
    `<a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram">${ico.ig}</a>` +
    `<a href="https://www.facebook.com/roy.yehuda" target="_blank" rel="noopener" aria-label="Facebook">${ico.fb}</a>` +
    `<a href="${waf.href}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIco}</a>` +
    `<a href="tel:+972544413413" aria-label="054-4413413">${ico.tel}</a>`; });
  addEventListener('roei:lang', socials);

  applyLang();
  pages.forEach(p => { if (!p.classList.contains('on')) p.hidden = true; });
  route();
})();
