// סקיצה 3: עולם של נקודות זהב שמשנה צורה לפי הגלילה (M · אבק · 3 מגדלים · גלובוס · יהלום)
import * as THREE from 'three';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = innerWidth < 760;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* ---------- גלילה חלקה וחשיפות ---------- */
gsap.registerPlugin(ScrollTrigger);
let lenis;
if (!reduce && window.Lenis){ lenis = new Lenis({lerp:.08}); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0); }
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = $(a.getAttribute('href')); if (t){ e.preventDefault(); lenis ? lenis.scrollTo(t, {offset:-40, duration:1.8}) : t.scrollIntoView({behavior:'smooth'}); } }));
$$('.fx').forEach(el => gsap.to(el, {opacity:1, y:0, duration:1.3, ease:'power3.out', scrollTrigger:{trigger:el, start:'top 90%'}}));
gsap.timeline({scrollTrigger:{trigger:'#s-whisper', start:'top 75%', end:'center 45%', scrub:true}})
  .to('#wq span', {opacity:1, filter:'blur(0px)', y:0, stagger:.15, ease:'none'});
gsap.to('#heroVid', {opacity:0, ease:'none', scrollTrigger:{trigger:'#s-hero', start:'top top', end:'bottom top', scrub:true}});
// זרקור על כרטיסי החטיבות, הטיה על כרטיסי המדריכים
$$('.tri a').forEach(a => a.addEventListener('pointermove', e => { const r = a.getBoundingClientRect(); a.style.setProperty('--mx', (e.clientX-r.left)+'px'); a.style.setProperty('--my', (e.clientY-r.top)+'px'); }));
$$('.gc').forEach(c => { c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5; c.style.transform = `rotateY(${x*10}deg) rotateX(${-y*10}deg)`; }); c.addEventListener('pointerleave', () => c.style.transform = ''); });

/* ---------- טעינה ---------- */
const ld = $('#load'), ldp = $('#ldp'), ldt = $('#ldt');
let lp = {v:0};
const loadAnim = gsap.to(lp, {v:100, duration:1.6, ease:'power2.inOut', onUpdate(){ ldp.style.strokeDashoffset = 600 - 6*lp.v; ldt.textContent = Math.round(lp.v) + '%'; }});
const done = () => { loadAnim.then(() => { ld.classList.add('done'); setTimeout(() => ld.remove(), 1100);
  gsap.from('.fx-h', {y:60, opacity:0, duration:1.6, stagger:.15, ease:'power3.out', delay:.3}); }); };

/* ---------- תלת-ממד ---------- */
let renderer;
try { renderer = new THREE.WebGLRenderer({canvas:$('#gl'), antialias:false, alpha:true, powerPreference:'high-performance'}); }
catch (e) { document.documentElement.classList.add('nogl'); done(); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight, false);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, innerWidth/innerHeight, .1, 100);
camera.position.set(0, 0, 7);

const N = reduce ? 5000 : mobile ? 6500 : 14000;
const rnd = (a, b) => a + Math.random()*(b-a);

// צורה 1: ה-M של הלוגו
function shapeM(){
  const P = [[10,126],[10,12],[76,78],[60,94],[44,78],[110,12],[110,126]];
  const S = (mobile ? 2.0 : innerWidth/innerHeight > 1.7 ? 2.9 : 3.3)/132, f = ([x,y]) => [(60-x)*S, (69-y)*S]; // היפוך אופקי כי המצלמה רואה את הלוגו מאחורה? לא: שומר את הכיוון של הלוגו
  const seg = []; let tot = 0;
  for (let i = 0; i < P.length-1; i++){ const a = f(P[i]), b = f(P[i+1]), l = Math.hypot(b[0]-a[0], b[1]-a[1]); seg.push([a,b,l]); tot += l; }
  const out = new Float32Array(N*3), nd = Math.floor(N*.2);
  for (let i = 0; i < N; i++){
    let x, y, z = rnd(-.06,.06);
    if (i < nd){ // היהלום הזהוב: ריבוע מסובב מלא
      const u = rnd(-1,1), v = rnd(-1,1), h = 15.5*S; x = (u - v)*h*.7071; y = (u + v)*h*.7071 + (69-26)*S; z = rnd(-.12,.12);
    } else { let d = Math.random()*tot, k = 0; while (d > seg[k][2]) { d -= seg[k][2]; k++; }
      const [a,b,l] = seg[k], t = d/l, nx = -(b[1]-a[1])/l, ny = (b[0]-a[0])/l, w = rnd(-.045,.045);
      x = a[0] + (b[0]-a[0])*t + nx*w; y = a[1] + (b[1]-a[1])*t + ny*w; }
    out.set([-x, y, z], i*3); // מימין לשמאל כמו בלוגו
  }
  return out;
}
// צורה 2: אבק
function shapeDust(){ const o = new Float32Array(N*3); for (let i = 0; i < N; i++) o.set([rnd(-8,8), rnd(-4.5,4.5), rnd(-6,2)], i*3); return o; }
// צורה 3: שלושה מגדלים (שלוש החטיבות)
function shapeTowers(){
  const k = mobile ? .42 : 1, o = new Float32Array(N*3), T = [[-2.5*k,2.3],[0,3.3],[2.5*k,2.7]], w = .55*(mobile?.6:1), base = -2.3;
  for (let i = 0; i < N; i++){
    const [cx, h] = T[i%3]; let x, y, z;
    if (Math.random() < .42){ const c = Math.floor(Math.random()*4); x = cx + (c&1 ? w : -w); z = (c&2 ? w : -w); y = base + Math.random()*h; }
    else { const fl = Math.floor(Math.random()*(h/.16)); y = base + fl*.16; const s = Math.floor(Math.random()*4), t = rnd(-w,w);
      if (s===0){x=cx+t;z=w;} else if (s===1){x=cx+t;z=-w;} else if (s===2){x=cx+w;z=t;} else {x=cx-w;z=t;} }
    o.set([x + rnd(-.01,.01), y, z], i*3);
  }
  return o;
}
// צורה 4: גלובוס נקודות
const R = mobile ? 1.2 : 1.75;
function shapeGlobe(){ const o = new Float32Array(N*3), g = Math.PI*(3-Math.sqrt(5));
  for (let i = 0; i < N; i++){ const y = 1 - (i/(N-1))*2, r = Math.sqrt(1-y*y), th = g*i; o.set([Math.cos(th)*r*R, y*R, Math.sin(th)*r*R], i*3); } return o; }
// צורה 5: יהלום (אוקטהדרון)
function shapeDiamond(){ const o = new Float32Array(N*3);
  for (let i = 0; i < N; i++){ let a = Math.random(), b = Math.random(); if (a+b > 1){ a = 1-a; b = 1-b; } const c = 1-a-b;
    const sx = Math.random()<.5?-1:1, sy = Math.random()<.5?-1:1, sz = Math.random()<.5?-1:1;
    const q = mobile ? .7 : 1; o.set([a*sx*1.45*q, b*sy*1.75*q, c*sz*1.45*q], i*3); } return o; }

const SH = {m:shapeM(), dust:shapeDust(), towers:shapeTowers(), globe:shapeGlobe(), diamond:shapeDiamond()};


// צורה 6: טבעת אור סביב התמונה של רועי בפתיחה
const WPP = () => 2*Math.tan(20*Math.PI/180)*7/innerHeight; // יחידות עולם לפיקסל במישור z=0
function faceRing(){ const el = document.getElementById('hface'); const r = el ? el.getBoundingClientRect().width/2 : 200;
  const R0 = (r + (mobile ? 14 : 26))*WPP(), o = new Float32Array(N*3);
  for (let i = 0; i < N; i++){ const a = Math.random()*Math.PI*2, t = Math.random();
    const rr = t < .7 ? R0*(1 + (Math.random()+Math.random()-1)*.035) : R0*(1.04 + Math.pow(Math.random(), 2.2)*.55);
    o.set([Math.cos(a)*rr, Math.sin(a)*rr, rnd(-.12,.12)], i*3); }
  return o; }
function faceOff(){ const el = document.getElementById('hface'); if (!el) return [0,0,0]; const b = el.getBoundingClientRect(), k = WPP();
  facePageY = b.top + b.height/2 + scrollY; return [(b.left + b.width/2 - innerWidth/2)*k, (innerHeight/2 - (facePageY - scrollY))*k, 0]; }
let facePageY = 0;
// גלובוס עם יבשות: מפת העולם מצוירת על קנבס, ונשארות רק נקודות על היבשה
async function loadLand(){ try {
  const [topo] = await Promise.all([fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json').then(r => r.json())]);
  const tc = await import('https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm');
  const land = tc.feature(topo, topo.objects.land), W = 720, H = 360, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = '#fff';
  const ring = r => { r.forEach(([lon, lat], j) => { const X = (lon+180)/360*W, Y = (90-lat)/180*H; j ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.closePath(); };
  land.features.forEach(f => { const g = f.geometry, polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates; polys.forEach(pl => { x.beginPath(); pl.forEach(ring); x.fill('evenodd'); }); });
  const d = x.getImageData(0, 0, W, H).data, out = new Float32Array(N*3), F = N*5, gr = Math.PI*(3-Math.sqrt(5)); let i = 0;
  for (let k = 0; k < F && i < N; k++){ const y = 1 - (k/(F-1))*2, r = Math.sqrt(1-y*y), th = gr*k, vx = Math.cos(th)*r, vz = Math.sin(th)*r;
    const lat = Math.asin(y)*180/Math.PI, lon = Math.atan2(vx, vz)*180/Math.PI, X = Math.floor((lon+180)/360*W) % W, Y = Math.min(H-1, Math.floor((90-lat)/180*H));
    if (d[(Y*W+X)*4] > 128) { out.set([vx*R, y*R, vz*R], i*3); i++; } }
  // מה שנשאר: אטמוספרה דלילה סביב הכדור
  for (; i < N; i++){ const a = Math.random()*Math.PI*2, b = Math.acos(rnd(-1,1)), rr = R*rnd(1.02,1.12); out.set([Math.sin(b)*Math.sin(a)*rr, Math.cos(b)*rr, Math.sin(b)*Math.cos(a)*rr], i*3); }
  return out; } catch (e) { return null; } }
const OFF = {face:[0,0,0], m:[0,mobile?1.3:.62,0], dust:[0,0,0], towers:[0,-.1,0], globe:[mobile?0:-1.9, mobile?.6:0, 0], diamond:[0,.15,0]};
const ALPHA = {face:1, m:1, dust:.4, towers:.7, globe:.42, diamond:1};

const geo = new THREE.BufferGeometry();
const pos = new Float32Array(SH.dust), from = new Float32Array(N*3), off = new Float32Array(N*3), aR = new Float32Array(N), delay = new Float32Array(N);
for (let i = 0; i < N; i++){ aR[i] = Math.random(); delay[i] = Math.random()*.4; }
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
geo.setAttribute('aR', new THREE.BufferAttribute(aR, 1));
const mat = new THREE.ShaderMaterial({
  transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
  uniforms:{uTime:{value:0}, uSize:{value:mobile?26:22}, uPix:{value:renderer.getPixelRatio()}, uAlpha:{value:1}},
  vertexShader:`uniform float uTime,uSize,uPix; attribute float aR; varying float vR;
    void main(){ vec3 p = position + .018*vec3(sin(uTime*.7+aR*40.), cos(uTime*.6+aR*30.), sin(uTime*.5+aR*20.));
      vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv; gl_PointSize = uSize*(.45+aR*.8)*uPix/(-mv.z); vR = aR; }`,
  fragmentShader:`uniform float uAlpha; varying float vR;
    void main(){ float d = length(gl_PointCoord-.5); if(d>.5) discard; float a = smoothstep(.5,.0,d);
      vec3 c = mix(vec3(.80,.62,.36), vec3(1.,.93,.78), vR); gl_FragColor = vec4(c, a*uAlpha*(.35+.5*vR)); }`
});
const pts = new THREE.Points(geo, mat);
scene.add(pts);

// סיכות ו-קשתות של 8 המדינות (חלק מהגלובוס)
const C = [['il',31.5,34.9],['gr',39,22],['it',42.8,12.5],['ae',24.4,54.4],['us',39.8,-98.6],['gb',53,-1.5],['pt',39.5,-8],['cy',35,33]];
const ll = (lat, lon, r) => { const a = lat*Math.PI/180, b = lon*Math.PI/180; return new THREE.Vector3(Math.cos(a)*Math.sin(b)*r, Math.sin(a)*r, Math.cos(a)*Math.cos(b)*r); };
const pins = new THREE.Group(); pts.add(pins);
const pinGeo = new THREE.BufferGeometry().setFromPoints(C.map(c => ll(c[1], c[2], R*1.01)));
const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), g = x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,240,205,1)'); g.addColorStop(.25,'rgba(255,220,160,.9)'); g.addColorStop(1,'rgba(255,200,120,0)'); x.fillStyle = g; x.fillRect(0,0,64,64); return new THREE.CanvasTexture(c); })();
const pinMat = new THREE.PointsMaterial({map:dotTex, color:0xFFFFFF, size:mobile?.42:.34, transparent:true, opacity:0, depthWrite:false, blending:THREE.AdditiveBlending});
pins.add(new THREE.Points(pinGeo, pinMat));
const arcs = [];
const il = ll(C[0][1], C[0][2], R);
C.slice(1).forEach(c => { const b = ll(c[1], c[2], R), mid = il.clone().add(b).multiplyScalar(.5), lift = 1 + il.distanceTo(b)/R*.38;
  const curve = new THREE.QuadraticBezierCurve3(il, mid.normalize().multiplyScalar(R*lift), b);
  const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)); g.setDrawRange(0, 0);
  const m = new THREE.LineBasicMaterial({color:0xE9C98A, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false});
  const line = new THREE.Line(g, m); pins.add(line); arcs.push(line); });
// הילה סביב הגלובוס
const halo = new THREE.Mesh(new THREE.SphereGeometry(R*1.02, 48, 48), new THREE.ShaderMaterial({transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, 
  uniforms:{uA:{value:0}}, vertexShader:`varying vec3 n; void main(){ n = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
  fragmentShader:`uniform float uA; varying vec3 n; void main(){ float i = pow(1. - abs(n.z), 3.); gl_FragColor = vec4(.85,.68,.4,1.)*i*uA*.55; }`}));
halo.scale.setScalar(1.06); pins.add(halo);

/* ---------- מעבר בין צורות ---------- */
let shape = 'dust', morph = {t:1.5}, glob = {a:0};
function setShape(s, force){
  if ((s === shape && !force) || !SH[s]) return; shape = s;
  from.set(pos); morph.t = 0;
  gsap.to(morph, {t:1.4, duration:reduce ? .01 : 2.2, ease:'none', overwrite:true});
  gsap.to(pts.position, {x:OFF[s][0], y:OFF[s][1], z:OFF[s][2], duration:2, ease:'power3.inOut', overwrite:true});
  gsap.to(mat.uniforms.uAlpha, {value:ALPHA[s], duration:1.6});
  gsap.to(glob, {a:s === 'globe' ? 1 : 0, duration:s === 'globe' ? 1.6 : .6, delay:s === 'globe' ? 1.2 : 0, overwrite:true});
  if (s === 'globe') arcs.forEach((l, i) => { l.geometry.setDrawRange(0, 0); gsap.to({n:0}, {n:65, duration:1.4, delay:1.6 + i*.18, ease:'power2.out', onUpdate(){ l.geometry.setDrawRange(0, Math.round(this.targets()[0].n)); }}); });
  $('#idx').textContent = {face:'01 — ROEI', m:'M', dust:'02 — WHISPER', towers:'03 — 3 DIVISIONS', globe:'04 — 8 COUNTRIES', diamond:'05 — LET’S TALK'}[s];
}
// איזה פרק במרכז המסך
const secs = $$('[data-shape]');
const pick = () => { const c = innerHeight/2; let best = null, bd = 1e9;
  secs.forEach(s => { const r = s.getBoundingClientRect(); const d = r.top <= c && r.bottom >= c ? 0 : Math.min(Math.abs(r.top-c), Math.abs(r.bottom-c)); if (d < bd){ bd = d; best = s; } });
  if (best) setShape(best.dataset.shape); };
addEventListener('scroll', pick, {passive:true});

// דגלים פעילים לפי הסיבוב
const flagEls = () => $$('#wflags span');

/* ---------- עכבר ---------- */
const mouse = new THREE.Vector2(9, 9), mw = new THREE.Vector3(99, 99, 0), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);
let mx = 0, my = 0;
addEventListener('pointermove', e => { mouse.set(e.clientX/innerWidth*2-1, -(e.clientY/innerHeight)*2+1); mx = mouse.x; my = mouse.y; });
addEventListener('pointerleave', () => mouse.set(9, 9));

/* ---------- לולאה ---------- */
const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const clock = new THREE.Clock();
let rotY = 0, visible = true;
document.addEventListener('visibilitychange', () => visible = !document.hidden);
function frame(){
  requestAnimationFrame(frame);
  if (!visible) return;
  const dt = Math.min(clock.getDelta(), .05), time = clock.elapsedTime;
  mat.uniforms.uTime.value = time;
  const to = SH[shape], T = morph.t, moving = T < 1.4;
  // נקודת העכבר בעולם
  ray.setFromCamera(mouse, camera); ray.ray.intersectPlane(plane, mw); if (mw) mw.sub(pts.position);
  const repel = shape === 'face' && !reduce && !mobile;
  for (let i = 0, j = 0; i < N; i++, j += 3){
    let bx, by, bz;
    if (moving){ let k = (T - delay[i]) / 1; k = k < 0 ? 0 : k > 1 ? 1 : ease(k);
      bx = from[j] + (to[j]-from[j])*k; by = from[j+1] + (to[j+1]-from[j+1])*k; bz = from[j+2] + (to[j+2]-from[j+2])*k; }
    else { bx = to[j]; by = to[j+1]; bz = to[j+2]; }
    if (repel){ const dx = bx + off[j] - mw.x, dy = by + off[j+1] - mw.y, d2 = dx*dx + dy*dy;
      if (d2 < .36){ const d = Math.sqrt(d2) || .001, f = (.6 - d)*.09; off[j] += dx/d*f; off[j+1] += dy/d*f; off[j+2] += f*.5; } }
    off[j] *= .93; off[j+1] *= .93; off[j+2] *= .93;
    pos[j] = bx + off[j]; pos[j+1] = by + off[j+1]; pos[j+2] = bz + off[j+2];
  }
  geo.attributes.position.needsUpdate = true;
  // סיבוב לפי הצורה
  if (shape === 'globe'){ rotY += dt*.12; pts.rotation.y += ((-.61 + Math.sin(rotY)*.5) - pts.rotation.y)*.04; pts.rotation.x += (.18 - pts.rotation.x)*.04; }
  else if (shape === 'diamond'){ pts.rotation.y += dt*.35; pts.rotation.x += (.1 - pts.rotation.x)*.04; }
  else if (shape === 'towers'){ pts.rotation.y += ((mx*.25 + Math.sin(time*.15)*.25) - pts.rotation.y)*.03; pts.rotation.x += ((.12 - my*.06) - pts.rotation.x)*.03; }
  else { pts.rotation.y += (mx*.18 - pts.rotation.y)*.04; pts.rotation.x += (-my*.1 - pts.rotation.x)*.04; }
  if (shape === 'face'){ const fy = (innerHeight/2 - (facePageY - scrollY))*WPP(); if (!gsap.isTweening(pts.position)) pts.position.y += (fy - pts.position.y)*.25; }
  if (shape === 'face') pts.rotation.z += dt*.06; else { pts.rotation.z %= Math.PI*2; pts.rotation.z += ((pts.rotation.z > Math.PI ? Math.PI*2 : 0) - pts.rotation.z)*.04; }
  pinMat.opacity = glob.a; halo.material.uniforms.uA.value = glob.a*.9; arcs.forEach(l => l.material.opacity = glob.a*.85);
  camera.position.x += (mx*.25 - camera.position.x)*.03; camera.position.y += (my*.15 - camera.position.y)*.03; camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); });
frame(); done();
// הטבעת נבנית לפי המקום של התמונה בעמוד
const placeFace = () => { SH.face = faceRing(); OFF.face = faceOff(); };
placeFace(); setTimeout(() => { shape = ''; pick(); }, 700);
addEventListener('resize', () => { placeFace(); if (shape === 'face') setShape('face', true); });
loadLand().then(g => { if (g){ SH.globe = g; if (shape === 'globe') setShape('globe', true); } });
addEventListener('load', () => ScrollTrigger.refresh());
