/* תוספות לשלוש הסקיצות: תפריט בטלפון ואפקטי "וואו" בגלילה (בהשראת האתר של מאיה)
   נטען אחרי common.js ולפני הסקריפט של כל סקיצה. כל אפקט מופעל לפי data-wow */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const add = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return document.body.appendChild(t.content.firstChild); };
  const WA = window.ROEI_WA || '#';
  const waIco = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>';

  /* ---------- תפריט בטלפון: כפתור מימין, נפתח לכל הסעיפים ---------- */
  const links = $$('nav[aria-label="ניווט ראשי"] a').filter(a => !a.hasAttribute('data-wa') && !a.classList.contains('btn'));
  if (links.length){
    const mb = add('<button class="mnav-btn" aria-label="תפריט" aria-expanded="false" aria-controls="mnav"><i></i></button>');
    const mn = add(`<nav class="mnav" id="mnav" aria-label="תפריט לטלפון"><div class="who">רועי יהודה · תיווך נדל״ן</div>${links.map((a, i) =>
      `<a class="it" href="${a.getAttribute('href')}" style="transition-delay:${(.18 + i*.06).toFixed(2)}s"${a.target ? ' target="_blank" rel="noopener"' : ''}>${a.textContent}<span>0${i+1}</span></a>`).join('')}<a class="wa" href="${WA}" target="_blank" rel="noopener">${waIco} פנייה אישית לרועי</a></nav>`);
    const tog = on => { mn.classList.toggle('on', on); mb.setAttribute('aria-expanded', on); window.__lenis && (on ? __lenis.stop() : __lenis.start()); };
    mb.onclick = () => tog(!mn.classList.contains('on'));
    mn.addEventListener('click', e => { const a = e.target.closest('a.it'); if (!a) return; const h = a.getAttribute('href'); tog(false);
      if (h.startsWith('#')){ e.preventDefault(); const t = $(h); setTimeout(() => t && (window.__lenis ? __lenis.scrollTo(t, {offset:-30, duration:1.4}) : t.scrollIntoView({behavior:'smooth'})), 380); } });
    addEventListener('keydown', e => { if (e.key === 'Escape') tog(false); });
  }

  /* ---------- כפתור סאונד לסרטונים ---------- */
  // סרגל שליטה: אחורה 10 שניות, עצירה/המשך, קדימה 10 שניות, סאונד
  // כשגוללים הלאה מהסרטון והסאונד פועל – הוא מושתק, וחוזר רק בלחיצה על הכפתור
  $$('[data-snd]').forEach(b => {
    const v = b.parentElement.querySelector('video'); if (!v) return;
    const bar = document.createElement('div'); bar.className = 'vctl'; b.parentElement.appendChild(bar);
    const mk = (label, txt) => { const x = document.createElement('button'); x.type = 'button'; x.className = 'vc'; x.setAttribute('aria-label', label); x.textContent = txt; bar.appendChild(x); return x; };
    const back = mk('10 שניות אחורה', '⟲ 10'), pp = mk('עצירה', '❚❚'), fwd = mk('10 שניות קדימה', '10 ⟳');
    bar.appendChild(b);
    const sync = () => { b.textContent = v.muted ? '🔈 להפעלה עם סאונד' : '🔊 להשתקה'; const p = v.paused; pp.textContent = p ? '▶' : '❚❚'; pp.setAttribute('aria-label', p ? 'המשך' : 'עצירה'); };
    const seek = d => { if (isFinite(v.duration)) v.currentTime = Math.max(0, Math.min(v.duration - .1, v.currentTime + d)); };
    back.onclick = () => seek(-10); fwd.onclick = () => seek(10);
    pp.onclick = () => { if (v.paused){ v.dataset.userPaused = ''; v.play().catch(() => {}); } else { v.dataset.userPaused = '1'; v.pause(); } sync(); };
    b.addEventListener('click', () => { v.muted = !v.muted; if (!v.muted){ if (!v.dataset.heard){ v.dataset.heard = 1; v.currentTime = 0; } v.dataset.userPaused = ''; v.play().catch(() => {}); window.__ffoAudio && __ffoAudio.pause(); } sync(); });
    v.addEventListener('play', sync); v.addEventListener('pause', sync); v.addEventListener('volumechange', sync);
    v.__muteAway = () => { if (!v.muted){ v.muted = true; sync(); } };
    new IntersectionObserver(es => es.forEach(e => { if (e.intersectionRatio < .3) v.__muteAway(); }), {threshold:[0,.3]}).observe(v);
    sync();
  });

  /* ---------- טופס פנייה (בסקיצה הפנייה נפתחת בוואטסאפ של רועי; בהקמה גם למייל ולגיליון) ---------- */
  $$('[data-form]').forEach(box => {
    box.classList.add('cform');
    box.innerHTML = `<div class="cf-head"><span class="cf-k">CONTACT</span><h2>השאירו פרטים<br><b>ורועי יחזור אליכם אישית</b></h2><p>בדיסקרטיות מלאה</p></div>
      <form novalidate>
        <div class="cf-topics" role="radiogroup" aria-label="במה אפשר לעזור">
          ${['קנייה או מכירה של נכס','התחדשות עירונית לבניין שלי','הצטרפות ל־M26','משהו אחר'].map((t, i) => `<label><input type="radio" name="topic" value="${t}"${i ? '' : ' checked'}><span>${t}</span></label>`).join('')}
        </div>
        <label>שם מלא<input name="name" autocomplete="name" required></label>
        <label>טלפון<input name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required></label>
        <label class="full">מייל (לא חובה)<input name="email" type="email" autocomplete="email" dir="ltr"></label>
        <label class="full">כמה מילים (לא חובה)<textarea name="msg" rows="3"></textarea></label>
        <label class="full cf-ok"><input type="checkbox" name="ok" required><span>אני מאשר/ת שרועי יחזור אליי בנוגע לפנייה</span></label>
        <button class="cf-send" type="submit">שליחה לרועי</button>
        <p class="cf-err full" role="alert" hidden>נא למלא שם, טלפון ולאשר</p>
      </form>`;
    const f = $('form', box), err = $('.cf-err', box);
    f.addEventListener('submit', e => { e.preventDefault(); const d = new FormData(f);
      if (!d.get('name') || !d.get('phone') || !d.get('ok')) { err.hidden = false; return; } err.hidden = true;
      const msg = `שלום רועי, הגעתי דרך האתר שלך\nשם: ${d.get('name')}\nטלפון: ${d.get('phone')}${d.get('email') ? '\nמייל: ' + d.get('email') : ''}\nנושא: ${d.get('topic')}${d.get('msg') ? '\n' + d.get('msg') : ''}`;
      window.open('https://wa.me/972544413413?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      box.classList.add('sent'); });
  });

  if (!window.gsap || !window.ScrollTrigger || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  // האפקטים כאן מחליפים את ההופעה הרגילה של האלמנטים
  const own = (els) => els.forEach(el => { el.classList.remove('fx', 'rv'); });

  /* ---------- נעים להכיר: המסך ננעל, התמונה נחשפת והשורות נכנסות אחת אחת ---------- */
  $$('[data-wow=meet]').forEach(sec => {
    const ph = $('[data-wp]', sec), img = ph && $('img', ph), lines = $$('[data-wl]', sec);
    own([ph, ...lines].filter(Boolean));
    mm.add('(min-width: 901px)', () => {
      gsap.timeline({scrollTrigger:{trigger:sec, start:'top top', end:'+=170%', scrub:1, pin:true}})
        .fromTo(ph, {clipPath:'inset(0% 0% 0% 100%)'}, {clipPath:'inset(0% 0% 0% 0%)', duration:.5, ease:'power2.inOut'}, 0)
        .fromTo(img, {scale:1.35}, {scale:1, duration:1}, 0)
        .fromTo(lines, {opacity:0, x:-70}, {opacity:1, x:0, stagger:.12, duration:.3}, .15)
        .to({}, {duration:.3});
    });
    mm.add('(max-width: 900px)', () => {
      gsap.fromTo(ph, {clipPath:'inset(0% 0% 0% 100%)'}, {clipPath:'inset(0% 0% 0% 0%)', ease:'power2.inOut', scrollTrigger:{trigger:ph, start:'top 85%', end:'top 35%', scrub:1}});
      lines.forEach(l => gsap.fromTo(l, {opacity:0, x:-50}, {opacity:1, x:0, ease:'power2.out', scrollTrigger:{trigger:l, start:'top 92%', end:'top 70%', scrub:1}}));
    });
  });

  /* ---------- כותרת ענקית שמתכווצת למקום, והתמונה מאחור מתקרבת ---------- */
  $$('[data-wow=shrink]').forEach(sec => {
    const t = $('.wt', sec), bg = $('.wbg img', sec), sh = $('.wsh', sec);
    own($$('.fx', sec));
    gsap.timeline({scrollTrigger:{trigger:sec, start:'top top', end:'+=130%', scrub:1, pin:true}})
      .fromTo(t, {scale:2.8, opacity:0}, {scale:1, opacity:1, duration:.6, ease:'power2.out'})
      .fromTo(bg, {scale:1.35, filter:'brightness(.45)'}, {scale:1, filter:'brightness(.85)', duration:1}, 0)
      .fromTo(sh, {opacity:.4}, {opacity:1, duration:1}, 0);
  });

  /* ---------- חשיפה בעיגול שנפתח ---------- */
  $$('[data-wow=circle]').forEach(sec => {
    gsap.timeline({scrollTrigger:{trigger:sec, start:'top top', end:'+=150%', scrub:1, pin:true}})
      .fromTo($('.wc', sec), {clipPath:'circle(12% at 50% 50%)'}, {clipPath:'circle(80% at 50% 50%)', duration:.6})
      .fromTo($('.wc img, .wc .slot', sec), {scale:1.4}, {scale:1, duration:1}, 0)
      .to($('.wcs', sec), {opacity:1, duration:.3}, .4)
      .fromTo($('.wct', sec), {opacity:0, y:40}, {opacity:1, y:0, duration:.3}, .55);
  });

  /* ---------- מספרים: המסך ננעל והמספרים עולים אחד אחרי השני ---------- */
  $$('[data-wow=stats]').forEach(sec => {
    const items = $$('[data-wi]', sec); own(items);
    mm.add('(min-width: 901px)', () => {
      gsap.timeline({scrollTrigger:{trigger:sec, start:'top top', end:'+=110%', scrub:1, pin:true}})
        .fromTo(items, {opacity:0, y:90, scale:.9}, {opacity:1, y:0, scale:1, stagger:.18, duration:.4})
        .to({}, {duration:.3});
    });
    mm.add('(max-width: 900px)', () => items.forEach(it => gsap.fromTo(it, {opacity:0, y:60}, {opacity:1, y:0, scrollTrigger:{trigger:it, start:'top 92%', end:'top 65%', scrub:1}})));
  });

  /* ---------- פאנלים שנכנסים בהטיה תלת-ממדית ---------- */
  $$('[data-wow=tilt]').forEach(el => {
    own([el]);
    gsap.set(el.parentElement, {perspective:1400});
    gsap.fromTo(el, {rotateX:18, y:140, scale:.9, opacity:0, transformOrigin:'50% 0%'}, {rotateX:0, y:0, scale:1, opacity:1, ease:'power2.out',
      scrollTrigger:{trigger:el, start:'top 98%', end:'top 30%', scrub:1}});
  });

  /* ---------- תמונות שנחשפות כמו וילון עם תנועה פנימית ---------- */
  $$('[data-wow=curtain]').forEach(el => {
    const img = $('img', el); own([el]);
    gsap.timeline({scrollTrigger:{trigger:el, start:'top 85%', end:'top 25%', scrub:1}})
      .fromTo(el, {clipPath:'inset(100% 0% 0% 0%)'}, {clipPath:'inset(0% 0% 0% 0%)', ease:'power2.inOut'})
      .fromTo(img, {scale:1.3, yPercent:-6}, {scale:1, yPercent:0, ease:'none'}, 0);
  });

  addEventListener('load', () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
})();
