/* Respira V2 — prototipe interaktif */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const M = n => `assets/m/${n}.png`;
const LOGO = 'assets/logo.png';

/* ================= DATA ================= */
const LOCS = {
  sel: { name: 'Bekasi Selatan', sub: 'Rumah · lokasi utama', ispu: 64, icon: 'home', spku: 'SPKU terdekat 0,8 km', pm25: 18, pm10: 32, o3: 46, co: .8, no2: 21, so2: 9, peak: 112, at: '14.00', trend: '+12%', main: 'PM2.5 · 18' },
  tim: { name: 'Bekasi Timur', sub: 'Kantor', ispu: 131, icon: 'building', spku: 'SPKU terdekat 3,2 km', pm25: 52, pm10: 88, o3: 61, co: 1.6, no2: 44, so2: 15, peak: 148, at: '13.00', trend: '+18%', main: 'PM2.5 · 52' },
  sdn: { name: 'SDN Margahayu 7', sub: 'Sekolah Rizky', ispu: 71, icon: 'school', spku: 'SPKU terdekat 1,1 km', pm25: 23, pm10: 38, o3: 49, co: .9, no2: 25, so2: 10, peak: 104, at: '13.00', trend: '+9%', main: 'PM2.5 · 23' },
  bar: { name: 'Bekasi Barat', sub: '2,4 km', ispu: 52, icon: 'pin', near: 1, spku: 'SPKU terdekat 2,4 km', pm25: 14, pm10: 27, o3: 40, co: .6, no2: 18, so2: 7, peak: 78, at: '15.00', trend: '+4%', main: 'PM10 · 27' },
  mus: { name: 'Mustika Jaya', sub: '6,1 km', ispu: 208, icon: 'pin', near: 1, spku: 'SPKU terdekat 6,1 km', pm25: 96, pm10: 140, o3: 70, co: 2.4, no2: 58, so2: 22, peak: 231, at: '12.00', trend: '+21%', main: 'PM2.5 · 96' },
  utara: { name: 'Bekasi Utara', sub: '3,4 km', ispu: 71, icon: 'pin', near: 1, spku: 'SPKU terdekat 3,4 km', pm25: 24, pm10: 41, o3: 47, co: .9, no2: 26, so2: 11, peak: 96, at: '14.00', trend: '+7%', main: 'PM2.5 · 24' },
};
function st(v) {
  if (v <= 55) return { t: 'Baik', c: 'baik', col: '#22C55E', m: 'leaf', msg: 'Udara bersih. Waktu yang pas untuk beraktivitas di luar.' };
  if (v <= 100) return { t: 'Sedang', c: 'sedang', col: '#F5B400', m: 'wink', msg: 'Aman untuk aktivitas ringan.' };
  if (v <= 199) return { t: 'Tidak Sehat', c: 'ts', col: '#F97316', m: 'mask', msg: 'Kurangi aktivitas luar dan pakai masker KF94.' };
  return { t: 'Berbahaya', c: 'bhy', col: '#E11D48', m: 'angry', msg: 'Tetap di dalam ruangan dan tutup jendela.' };
}
const pill = v => { const s = st(v); return `<span class="pill p-${s.c}">${s.t}</span>`; };
const LV = { 1: 'Air Rookie', 2: 'Air Explorer', 3: 'Air Guardian', 4: 'Clean Air Champion' };
const LVMAX = { 1: 200, 2: 500, 3: 1000, 4: 2000 };
const CATS = [
  { id: 'anak', t: 'Anak-anak', d: 'Usia di bawah 12 tahun', tag: 'Sensitif', c: 'sedang', ic: 'baby', bg: '#FFF4D6', fg: '#A16207', th: 50 },
  { id: 'dewasa', t: 'Dewasa / umum', d: 'Tanpa kondisi khusus', tag: 'Normal', c: 'norm', ic: 'adult', bg: '#E3F7EA', fg: '#15803D', th: 100 },
  { id: 'lansia', t: 'Lansia', d: 'Usia 60 tahun ke atas', tag: 'Sensitif', c: 'sedang', ic: 'elder', bg: '#FFF4D6', fg: '#A16207', th: 50 },
  { id: 'ispa', t: 'Riwayat ISPA / asma', d: 'Gangguan pernapasan kronis', tag: 'Rentan', c: 'rentan', ic: 'lungs', bg: '#FFE9E1', fg: '#D9480F', th: 50 },
  { id: 'hamil', t: 'Ibu hamil', d: 'Sedang mengandung', tag: 'Sensitif', c: 'sedang', ic: 'pregnant', bg: '#FFF4D6', fg: '#A16207', th: 50 },
];
const BADGES = [
  { id: 'aware', t: 'Air Aware', ic: 'eye', col: 'blue', d: 'Kamu mengecek kualitas udara untuk pertama kalinya. Langkah kecil untuk napas yang lebih sehat!', how: 'Cek kualitas udara pertama kali' },
  { id: 'eco', t: 'Eco Reporter', ic: 'camera', col: 'green', d: 'Lima laporan Lens-mu sudah tervalidasi dan membantu warga sekitar.', how: '5 laporan tervalidasi' },
  { id: 'streak', t: 'Streak Master', ic: 'flame', col: 'orange', d: 'Kamu membuka Respira beberapa hari berturut-turut. Konsisten itu keren!', how: 'Streak 3 hari' },
  { id: 'route', t: 'Route Hero', ic: 'route', col: 'blue', d: 'Selesaikan 5 rute udara bersih.', how: '5 rute aman' },
  { id: 'guard', t: 'Community Guardian', ic: 'users', col: 'green', d: 'Kirim 10 laporan tervalidasi.', how: '10 laporan tervalidasi' },
  { id: 'champ', t: 'Clean Air Champion', ic: 'award', col: 'orange', d: 'Capai Level 4.', how: 'Level 4' },
];

/* ================= STATE ================= */
const FRESH = () => ({
  user: { name: 'Daffa Pratama', email: 'daffa@gmail.com', uname: 'daffa_pratama', phone: '0812 3456 7890', loc: 'Bekasi Selatan', age: 25, sex: 'L', health: true, note: 'Asma ringan sejak kecil, kambuh saat banyak debu.' },
  xp: 375, level: 2, streak: 4,
  badges: { streak: '9 Nov' },
  m: { check: 0, explore: 0, route: 0, report: 0 },
  explored: [], routes: 3, loc: 'sel',
  saved: [
    { id: 'sel', label: 'Rumah', addr: 'Jl. Mawar, Bekasi Selatan', ispu: 64, icon: 'home', alert: false },
    { id: 'tim', label: 'Kantor', addr: 'Jl. A. Yani, Bekasi Timur', ispu: 131, icon: 'building', alert: false },
    { id: 'sdn', label: 'Sekolah Rizky', addr: 'SDN Margahayu 7', ispu: 71, icon: 'school', alert: false },
  ],
  fam: [
    { n: 'Rizky', age: 7, cat: 'anak' },
    { n: 'Budi', age: 65, cat: 'lansia' },
    { n: 'Rina', age: 30, cat: 'ispa' },
  ],
  reports: [
    { t: 'Asap kendaraan pekat', p: 'Jl. Juanda · Hari ini 11.20', s: 'wait', pos: '20% 60%' },
    { t: 'Pembakaran lahan kosong', p: 'Mustika Jaya · 12 Nov', s: 'ok', pos: '70% 40%' },
    { t: 'Asap tidak terdeteksi', p: 'Bekasi Utara · 10 Nov', s: 'no', pos: '90% 20%' },
    { t: 'Asap industri', p: 'Bantar Gebang · 8 Nov', s: 'ok', pos: '40% 30%' },
    { t: 'Asap knalpot bus', p: 'Jl. A. Yani · 6 Nov', s: 'ok', pos: '10% 80%' },
    { t: 'Pembakaran ban', p: 'Bekasi Barat · 2 Nov', s: 'ok', pos: '60% 70%' },
  ],
  notifs: [], unread: 2, rentan: true, reminder: false,
  set: { vib: false, nAir: true, nRec: true, lang: 'Bahasa Indonesia' },
  weekXp: [30, 20, 60, 45, 20, 70, 0],
  lensTry: 0, newReport: 0, onboarded: 0,
});
let S;
try { S = Object.assign(FRESH(), JSON.parse(localStorage.getItem('respira2') || 'null') || {}); } catch (e) { S = FRESH(); }
const save = () => { try { localStorage.setItem('respira2', JSON.stringify(S)); } catch (e) { } };
const T = { dest: 'Summarecon Mall Bekasi' }; // data sementara (tidak disimpan)

function lvMax() { return LVMAX[S.level]; }
function gain(n, why) {
  S.xp += n; S.weekXp[6] += n;
  while (S.xp >= LVMAX[S.level] && S.level < 4) { S.level++; T.levelUp = S.level; }
  save();
}
function award(id) { if (!S.badges[id]) { S.badges[id] = 'Hari ini'; save(); return true; } return false; }
const nBadges = () => Object.keys(S.badges).length;
const validated = () => S.reports.filter(r => r.s === 'ok').length;
const missionsDone = () => Object.values(S.m).filter(v => v === 2 || v === 1 && false).length;
function mState(k) { // 0 belum, 1 bisa diklaim, 2 selesai
  return S.m[k];
}
const doneCount = () => ['check', 'explore', 'route', 'report'].filter(k => S.m[k] === 2).length;
const initial = n => (n || 'D').trim()[0].toUpperCase();
const firstName = () => S.user.name.split(' ')[0];

/* ================= ROUTER ================= */
let cur = null, timers = [];
const later = (f, ms) => timers.push(setTimeout(f, ms));
function clearTimers() { timers.forEach(clearTimeout); timers.forEach(clearInterval); timers = []; }

function render(name, dir = 'fwd', silent = false) {
  const fn = R[name] || R.home;
  if (!silent) clearTimers();
  cur = name;
  const o = fn();
  const v = $('#view');
  const keepScroll = silent && $('.scr', v) ? $('.scr', v).scrollTop : 0;
  v.innerHTML = o.html + (o.tab ? tabbar(o.tab) : '');
  const sc = $('.scr', v);
  $$('.scr > .cta', v).forEach(c => { if (!c.style.position) { v.appendChild(c); if (sc) sc.style.paddingBottom = (c.offsetHeight + 46) + 'px'; } });
  if (sc) { if (silent) { sc.style.animation = 'none'; sc.scrollTop = keepScroll; } else if (dir === 'back') sc.classList.add('back'); }
  if (o.after && !silent) o.after();
  if (o.live) o.live();
}
function go(name, replace) {
  if (replace) history.replaceState({ n: name }, '', '#' + name); else history.pushState({ n: name }, '', '#' + name);
  render(name);
}
function back() { history.length > 1 ? history.back() : go('home'); }
const refresh = () => render(cur, 'fwd', true);
addEventListener('popstate', e => render((e.state && e.state.n) || 'splash', 'back'));

function tabbar(on) {
  const t = [['home', 'home', 'Home'], ['map', 'map', 'Map'], ['lens', 'camera', 'Lens'], ['profile', 'user', 'Profile']];
  return `<nav class="tabbar">${t.map(([k, i, l]) => `<button data-go="${k}" class="${on === k ? 'on' : ''}" aria-label="${l}">${ic(i, 20)}<span class="lbl2">${l}</span></button>`).join('')}</nav>`;
}

/* ---------- UI helpers ---------- */
const clouds = () => `<div class="clouds"><i style="width:120px;height:40px;left:220px;top:90px"></i><i style="width:90px;height:30px;left:-30px;top:200px"></i><i style="width:70px;height:24px;left:140px;top:40px;opacity:.5"></i></div>`;
function hdr(title, sub = '', right = '', backAct = 'data-back') {
  return `<div class="top"><button class="cbtn" ${backAct} aria-label="Kembali">${ic('back')}</button><div class="grow">${sub ? `<div class="sub">${sub}</div>` : ''}<h2>${title}</h2></div>${right}</div>`;
}
const scr = (inner, cls = '') => `<div class="scr ${cls}">${clouds()}${inner}</div>`;
const field = (label, icon, val, attrs = '', type = 'text', extra = '') => `<div class="lbl">${label}</div><div class="inp">${ic(icon)}<input type="${type}" value="${val}" ${attrs}>${extra}</div>`;
const pwField = (label, id, val = 'respira26', extra) => `<div class="lbl">${label}</div><div class="inp">${ic('lock')}<input id="${id}" type="password" value="${val}">${extra || `<button data-act="peek" data-t="${id}" aria-label="Lihat sandi">${ic('eye')}</button>`}</div>`;
function gauge(v, size = 142, dark = true, sw = 9) {
  const r = size / 2 - sw, c = size / 2, C = 2 * Math.PI * r;
  const seg = (a, b, col) => { const L = C * (b - a) / 360; return `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${L} ${C}" transform="rotate(${a - 90} ${c} ${c})"/>`; };
  const ticks = Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, r1 = r - sw - 3, r2 = r - sw - (i % 5 ? 6 : 9); return `<line x1="${c + r1 * Math.sin(a)}" y1="${c - r1 * Math.cos(a)}" x2="${c + r2 * Math.sin(a)}" y2="${c - r2 * Math.cos(a)}" stroke="${dark ? 'rgba(255,255,255,.25)' : '#cfd8e6'}" stroke-width="1"/>`; }).join('');
  const frac = Math.min(v / 300, 1) * 360;
  const id = 'gg' + size;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#14B8A6"/></linearGradient></defs>
  <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${dark ? 'rgba(255,255,255,.1)' : '#EEF2F7'}" stroke-width="${sw}"/>${ticks}
  ${seg(-25, 25, 'url(#' + id + ')')}${seg(65, 115, 'url(#' + id + ')')}${seg(155, 205, '#14B8A6')}${seg(245, 295, 'url(#' + id + ')')}
  <circle cx="${c + r * Math.sin(frac * Math.PI / 180)}" cy="${c - r * Math.cos(frac * Math.PI / 180)}" r="${sw / 2 + 2}" fill="#fff" stroke="${st(v).col}" stroke-width="3"/></svg>`;
}
function ring(p, size = 54, sw = 5, track = '#E8EEF6') {
  const r = size / 2 - sw / 2 - 1, C = 2 * Math.PI * r, c = size / 2;
  return `<svg width="${size}" height="${size}"><defs><linearGradient id="rg${size}"><stop offset="0" stop-color="#3366FF"/><stop offset="1" stop-color="#14B8A6"/></linearGradient></defs><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}"/><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#rg${size})" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C * p} ${C}" transform="rotate(-90 ${c} ${c})"/></svg>`;
}
const stage = (m, extra = '') => `<div class="stage"><span class="sparkle" style="left:24px;top:34px">${ic('spark', 22)}</span><img src="${M(m)}" alt=""><span class="ok">${ic('check', 22, 3)}</span>${extra}</div>`;

/* toast & modal */
function toast(title, sub, onTap, icon = 'spark', ms = 3200) {
  $$('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="ti">${ic(icon, 18)}</span><div class="sp"><div class="b" style="font-size:14px">${title}</div>${sub ? `<div class="xs" style="color:#6b5a2c">${sub}</div>` : ''}</div>${onTap ? ic('chevR', 18) : ''}`;
  $('#phone').appendChild(t);
  const kill = () => { t.classList.add('out'); setTimeout(() => t.remove(), 300); };
  t.onclick = () => { kill(); onTap && onTap(); };
  setTimeout(kill, ms);
}
function modal(html) {
  closeModal();
  const o = document.createElement('div'); o.className = 'ovl'; o.innerHTML = `<div class="modal">${html}</div>`;
  o.addEventListener('click', e => { if (e.target === o) closeModal(); });
  $('#phone').appendChild(o);
}
function closeModal() { $$('.ovl').forEach(o => o.remove()); }
function badgeModal(id, fresh = true) {
  const b = BADGES.find(x => x.id === id), got = S.badges[id];
  modal(`<div class="xs bb" style="color:var(--blue);letter-spacing:1.4px">${fresh ? 'LENCANA BARU TERBUKA' : got ? 'LENCANA TERBUKA' : 'LENCANA TERKUNCI'}</div>
  <div style="margin:18px auto 6px;width:140px" class="float">${badgeSVG(b.ic, b.col, 140, !got)}</div>
  <h2 style="font-size:25px">${b.t}</h2><p class="muted" style="line-height:1.6;margin:8px 6px 14px">${got ? b.d : 'Cara membuka: ' + b.how + '.'}</p>
  ${got ? `<div class="row" style="justify-content:center;gap:8px;margin-bottom:18px">${fresh && id === 'aware' ? '<span class="pill p-baik">+20 XP bonus</span>' : ''}<span class="pill nod p-blue">${nBadges()} / 6 lencana</span></div>` : '<div style="height:8px"></div>'}
  <button class="btn" data-act="toProg">Lihat koleksi ${ic('award', 18)}</button><button class="btn ghost" style="margin-top:10px" data-act="closeModal">Nanti saja</button>`);
}

/* ================= SCREENS ================= */
const R = {};

/* ---------- Onboarding ---------- */
R.splash = () => ({
  html: `<div class="scr splash nopad" style="padding:24px">
  <div class="brand"><img src="${LOGO}" alt="">respira</div>
  <div class="orb">${[330, 250, 170].map(d => `<div class="ring" style="width:${d}px;height:${d}px"></div>`).join('')}
    <div class="glass" style="position:absolute;left:0;top:90px"><div class="xs" style="color:#b8c6dd">PM2.5</div><div class="mf bb" style="font-size:18px">18 µg/m³</div></div>
    <img class="hero" src="${M('hero')}" alt="Maskot awan Respira">
    <div class="glass" style="position:absolute;right:0;top:282px;display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600"><span class="live" style="color:#fff"></span>Sensor aktif · 24 SPKU</div>
  </div>
  <h1>Udara yang kamu hirup, kini terbaca jelas.</h1>
  <p>Data kualitas udara real-time, rekomendasi kesehatan personal, dan rute paling bersih di Bekasi.</p>
  <div class="cta"><button class="btn white" data-go="onb1">Mulai sekarang ${ic('next', 18)}</button><div class="note" style="color:#b8c6dd">Sudah punya akun? <b data-go="login" style="color:#fff;cursor:pointer">Masuk</b></div></div></div>`
});

function onb(i, art, h, p) {
  return {
    html: `<div class="scr onb" style="background:#fff" data-swipe="${i}">
    <div class="onb-top"><div class="brand"><img src="${LOGO}" alt="">respira</div><button class="muted b" data-go="reg1">Lewati</button></div>
    <div class="onb-art">${art}</div>
    <div class="dots">${[1, 2, 3].map(k => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
    <h1>${h}</h1><p>${p}</p>
    <div class="cta"><button class="btn" data-go="${i < 3 ? 'onb' + (i + 1) : 'reg1'}">Lanjut ${ic('next', 18)}</button></div></div>`,
    after() { swipe(i); }
  };
}
function swipe(i) {
  const el = $('.scr'); let x0 = null;
  el.addEventListener('pointerdown', e => x0 = e.clientX);
  el.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0; x0 = null; if (dx < -50) go(i < 3 ? 'onb' + (i + 1) : 'reg1'); else if (dx > 50 && i > 1) back(); });
}
R.onb1 = () => onb(1, `
  <div class="card" style="padding:16px 18px;position:relative">
    <div class="xs bb muted" style="letter-spacing:1.2px">BEKASI SELATAN · LIVE</div>
    <div class="mf" style="font-size:40px;font-weight:800;margin-top:4px">64</div>
    <span class="pill p-blue" style="padding:4px 40px 4px 10px">Sedang</span>
    <img src="${M('wink')}" class="float" style="position:absolute;right:14px;top:16px;width:84px" alt="">
    <svg viewBox="0 0 260 70" style="width:100%;margin-top:8px"><defs><linearGradient id="o1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b8cff" stop-opacity=".25"/><stop offset="1" stop-color="#5b8cff" stop-opacity="0"/></linearGradient></defs><path d="M10 45 L80 40 Q120 28 150 18 Q180 22 250 42 L250 70 L10 70Z" fill="url(#o1)"/><path d="M10 45 L80 40 Q120 28 150 18 Q180 22 250 42" fill="none" stroke="#2F6BFF" stroke-width="2"/><circle cx="80" cy="40" r="4" fill="#fff" stroke="#2F6BFF" stroke-width="2"/></svg>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px">${[['PM2.5', 18, '#F5B400'], ['PM10', 32, '#22C55E'], ['O₃', 46, '#F5B400']].map(([a, b, c]) => `<div class="card" style="padding:12px"><div class="xs muted b">${a}</div><div class="mf bb" style="font-size:20px">${b}</div><div style="height:3px;border-radius:3px;background:${c};margin-top:4px"></div></div>`).join('')}</div>
  <div class="card row" style="margin-top:12px;padding:12px 14px;width:85%"><span class="ico" style="width:30px;height:30px;color:#F97316;background:#FFF1E8;box-shadow:none">${ic('bell', 15)}</span><span class="small">ISPU naik ke <b>112</b> pukul 14.00</span></div>`,
  'Udara di sekitarmu, terbaca real-time', 'Data dari SPKU terdekat diubah jadi bahasa sehari-hari: apa artinya, dan apa yang perlu kamu lakukan.');
R.onb2 = () => onb(2, `<div style="position:absolute;inset:0">${mapSVG({ vb: '20 80 360 440', routes: [{ d: 'M60 520 C 90 400, 200 380, 230 300 C 250 240, 260 170, 340 140', c: '#16B4CF', w: 5 }, { d: 'M180 520 C 260 470, 330 380, 320 300 S 330 170, 340 140', c: '#F97316', w: 3, dash: '1 7' }] })}</div>
  <div class="card" style="position:absolute;left:14px;right:14px;bottom:14px;padding:14px">
   <div class="row"><span class="ico" style="width:34px;height:34px;color:var(--teal);background:var(--mint);box-shadow:none">${ic('leaf', 16)}</span><div class="sp"><div class="b">Rute udara bersih</div><div class="xs muted">via Jl. Pramuka · 24 mnt</div></div><b class="mf" style="font-size:22px">42</b></div>
   <div class="xs b" style="color:#0F766E;margin-top:10px;display:flex;gap:6px">${ic('trendDn', 14)} Paparan polusi 35% lebih rendah</div></div>`,
  'Rute dengan udara paling bersih', 'Bandingkan rute tercepat, terpendek, dan paling bersih. Pilih yang terbaik untuk paru-parumu.');
R.onb3 = () => onb(3, `<img src="${M('angry')}" class="float" style="display:block;width:120px;margin:6px auto 14px" alt="">
  ${[['alert', 'Kualitas udara memburuk', 'ISPU Bekasi Timur naik ke 131', 'sekarang', '#FFF1E8', '#E4572E'], ['heart', 'Rizky sebaiknya di dalam', 'Ambang rentan terlampaui', '5 mnt', '#F3EEFF', '#8B5CF6'], ['camera', 'Laporanmu terverifikasi', 'Pembakaran sampah · di peta', '1 jam', '#EAF0FF', '#2F6BFF']].map(([i, a, b, c, bg, fg], k) => `<div class="card row" style="padding:12px 14px;margin:0 ${k * 8}px 10px;opacity:${1 - k * .1}"><span class="ico" style="width:34px;height:34px;background:${bg};color:${fg};box-shadow:none">${ic(i, 16)}</span><div class="sp"><div class="b small">${a}</div><div class="xs muted">${b}</div></div><span class="xs muted">${c}</span></div>`).join('')}`,
  'Peringatan lebih awal, laporan lebih mudah', 'Notifikasi personal untuk keluargamu, dan lapor sumber asap cukup dengan satu foto lewat Lens.');

const regFoot = `<div class="note">Sudah punya akun? <b class="link" data-go="login" style="cursor:pointer">Masuk</b></div>`;
const steps = n => `<div class="steps">${[1, 2, 3].map(k => `<i class="${k <= n ? 'on' : ''}"></i>`).join('')}</div>`;
R.reg1 = () => ({
  html: scr(`${hdr('Langkah 1 dari 3')}${steps(1)}
  <h1 style="font-size:25px">Mulai bersama Respira</h1><p class="muted" style="margin-top:4px;line-height:1.5">Buat akun untuk menyimpan lokasi, keluarga, dan laporanmu.</p>
  ${field('Nama lengkap', 'user', S.user.name, 'id="rName" autocomplete="name"')}
  ${field('Email', 'mail', S.user.email, 'id="rMail"', 'email')}
  ${field('Nomor HP', 'phone', S.user.phone, 'id="rPhone"', 'tel')}
  ${pwField('Kata sandi', 'pw1')}
  ${pwField('Konfirmasi kata sandi', 'pw2', 'respira26', `<span id="pwOk" style="color:var(--baik)">${ic('check')}</span>`)}
  <div class="chk on" data-act="agree"><i>${ic('check', 14, 3)}</i>Saya setuju dengan syarat dan ketentuan Respira</div>
  <div style="height:80px"></div>
  <div class="cta"><button class="btn" data-act="reg1">Lanjutkan ${ic('next', 18)}</button>${regFoot}</div>`),
  after() { ['pw1', 'pw2'].forEach(i => $('#' + i).addEventListener('input', () => { const ok = $('#pw1').value && $('#pw1').value === $('#pw2').value; $('#pwOk').style.opacity = ok ? 1 : 0; })); }
});
R.reg2 = () => ({
  html: scr(`${hdr('Langkah 2 dari 3')}${steps(2)}
  <h1 style="font-size:25px">Informasi diri</h1><p class="muted" style="margin-top:4px">Bantu kami memberi rekomendasi yang sesuai denganmu.</p>
  <div class="lbl">Usia</div><div class="inp">${ic('cal')}<select id="rAge">${Array.from({ length: 70 }, (_, i) => i + 12).map(a => `<option ${a === S.user.age ? 'selected' : ''} value="${a}">${a} tahun</option>`).join('')}</select>${ic('chevD')}</div>
  <div class="lbl">Jenis kelamin</div><div class="seg" data-seg="sex"><button class="${S.user.sex === 'L' ? 'on' : ''}" data-v="L">Laki-laki</button><button class="${S.user.sex === 'P' ? 'on' : ''}" data-v="P">Perempuan</button></div>
  <div class="lbl">Lokasi domisili</div><div class="inp">${ic('pin')}<select id="rLoc">${['Bekasi Selatan', 'Bekasi Timur', 'Bekasi Barat', 'Bekasi Utara', 'Mustika Jaya', 'Rawalumbu', 'Jatiasih'].map(l => `<option ${l === S.user.loc ? 'selected' : ''}>${l}, Kota Bekasi</option>`).join('')}</select>${ic('chevD')}</div>
  <div class="tip" style="margin-top:16px"><img src="${M('confused')}" alt="">Lokasi domisili dipakai sebagai patokan peringatan, meski kamu sedang di tempat lain.</div>
  <div class="cta"><button class="btn" data-act="reg2">Lanjutkan ${ic('next', 18)}</button>${regFoot}</div>`)
});
R.reg3 = () => ({
  html: scr(`${hdr('Langkah 3 dari 3')}${steps(3)}
  <h1 style="font-size:25px">Catatan kesehatan</h1><p class="muted" style="margin-top:4px;line-height:1.5">Informasi ini membantu Respira memberi peringatan lebih awal bila kamu termasuk kelompok rentan.</p>
  <div class="b" style="margin:18px 0 10px">Apakah kamu memiliki kondisi kesehatan tertentu?</div>
  <div class="opt ${S.user.health ? 'on' : ''}" data-act="health" data-v="1"><span class="radio"></span><div><div class="b">Ya, saya punya kondisi kesehatan</div><div class="xs muted">Contoh: asma, ISPA, alergi, PPOK</div></div></div>
  <div class="opt ${!S.user.health ? 'on' : ''}" data-act="health" data-v="0"><span class="radio"></span><div class="b">Tidak ada</div></div>
  <div id="noteWrap" style="${S.user.health ? '' : 'display:none'}"><div class="lbl">Catatan penyakit (opsional)</div><textarea class="ta" id="rNote">${S.user.note}</textarea>
  <div class="note-box nb-mint" style="margin-top:14px">${ic('lock', 16)}<span>Data kesehatan disimpan aman dan hanya dipakai untuk menyesuaikan rekomendasi.</span></div></div>
  <div class="cta"><button class="btn" data-act="reg3">Buat akun ${ic('next', 18)}</button>${regFoot}</div>`)
});
R.login = () => ({
  html: scr(`<div style="position:relative;margin-top:24px"><h1 style="font-size:31px;letter-spacing:-.6px">Selamat datang!</h1><p class="muted">Masuk untuk melanjutkan</p><img src="${M('laptop')}" class="float" style="position:absolute;right:-10px;top:-30px;width:118px" alt=""></div>
  ${field('Email', 'mail', S.user.email, 'id="lMail"', 'email')}
  ${pwField('Kata sandi', 'lpw')}
  <div style="text-align:right;margin:12px 0 14px"><b class="lnk" data-go="forgot" style="cursor:pointer">Lupa kata sandi?</b></div>
  <button class="btn" data-act="login">Masuk</button>
  <div class="center muted small" style="margin:14px 0">atau</div>
  ${[['G', 'Masuk dengan Google', '#EAF0FF', '#2F6BFF'], ['A', 'Masuk dengan Apple', '#0B1F3A', '#fff'], [ic('phone', 14), 'Masuk dengan nomor HP', '#E3F7EA', '#15803D']].map(([a, b, bg, fg]) => `<button class="btn ghost" data-act="login" style="margin-bottom:10px;font-weight:600"><span style="width:26px;height:26px;border-radius:50%;background:${bg};color:${fg};display:grid;place-items:center;font-size:13px;font-weight:800">${a}</span>${b}</button>`).join('')}
  <div class="cta"><div class="note">Belum punya akun? <b class="link" data-go="reg1" style="cursor:pointer">Daftar sekarang</b></div></div>`)
});
R.forgot = () => ({
  html: scr(`${hdr('Lupa kata sandi')}
  <div style="width:150px;height:150px;border-radius:50%;background:#dfe9fb;margin:10px auto 14px;display:grid;place-items:center"><img src="${M('question')}" style="width:120px" class="float" alt=""></div>
  <h2 class="center" style="font-size:23px">Tenang, kita atur ulang</h2><p class="center muted" style="margin-top:6px;line-height:1.55">Masukkan email akunmu. Kami kirim tautan untuk membuat kata sandi baru.</p>
  ${field('Email', 'mail', S.user.email, 'id="fMail"', 'email')}
  <div class="note-box nb-blue" style="margin-top:14px" id="fNote">${ic('info', 16)}<span>Tautan berlaku 30 menit. Cek juga folder spam.</span></div>
  <div class="cta"><button class="btn" data-act="forgot" id="fBtn">Kirim tautan reset ${ic('next', 18)}</button><button class="btn ghost" data-go="login">Kembali ke Masuk</button></div>`)
});
R.created = () => ({
  html: scr(`${stage('love', '<span class="sparkle" style="right:30px;top:10px;color:#F5B400">' + ic('spark', 16) + '</span>')}<div class="succ center"><h1>Akun berhasil dibuat</h1><p>Selamat bergabung di Respira! Tahu lebih awal, jaga lebih cepat.</p></div>
  <div class="cta"><button class="btn" data-act="start">Mulai sekarang</button></div>`, 'fade')
});

/* ---------- Home ---------- */
function curLoc() { return LOCS[S.loc] || LOCS.sel; }
R.home = () => {
  const L = curLoc(), s = st(L.ispu), p = S.xp / lvMax();
  return {
    tab: 'home',
    html: scr(`<div class="hhead"><div class="sp"><div class="date">Sabtu, 14 Nov · 10.01</div><button class="loc" data-go="pickloc">${ic('pin', 18)}${L.name}${ic('chevD', 18)}</button></div>
    <button class="cbtn bell" data-go="notif" aria-label="Notifikasi">${ic('bell')}${S.unread ? '<span class="dot"></span>' : ''}</button><button class="avatar" data-go="profile">${initial(S.user.name)}</button></div>
    <div class="aqi" data-go="aqi">
      <div class="row"><span class="lab sp">INDEKS KUALITAS UDARA</span><span class="live">Live</span></div>
      <div class="row" style="margin-top:8px;align-items:center"><div class="gauge">${gauge(L.ispu)}<div class="v"><b>${L.ispu}</b><span>ISPU</span></div></div>
      <div class="sp" style="padding-right:4px"><span class="status">${s.t}</span><div class="msg">${s.msg}${L.peak > L.ispu ? ` Naik ke <b>${L.peak}</b> pukul ${L.at}.` : ''}</div></div></div>
      <img class="masc float" src="${M(s.m)}" alt="" style="top:46px">
      <div class="pols">${[['PM2.5', L.pm25], ['PM10', L.pm10], ['O₃', L.o3]].map(([a, b]) => `<div><small>${a}</small><b>${b}<i>µg/m³</i></b></div>`).join('')}</div>
    </div>
    <div class="well" data-go="reko"><span class="ico">${ic('heart')}</span><div><div class="t">WELLNESS HARI INI</div><p><b style="color:var(--ink)">Waktu terbaik bergerak: 06.00–09.00</b> · Manfaatkan udara yang lebih baik untuk berjalan santai atau berolahraga ringan.</p></div></div>
    <div class="qhead"><span class="qi">${ic('spark', 15)}</span><h3 class="h3 sp">Respira Air Quest</h3><b class="lnk" data-go="quest" style="cursor:pointer">Lihat semua</b></div>
    <div class="card" data-go="quest" style="cursor:pointer"><div class="row"><div class="lvring">${ring(p)}<b>${S.level}</b></div><div class="sp"><div class="mf bb" style="font-size:17px">${LV[S.level]}</div><div class="small"><b>${S.xp}</b> / ${lvMax()} XP · ${Math.max(lvMax() - S.xp, 0)} XP lagi ke <b>${LV[S.level + 1] || '-'}</b></div><div class="bar" style="margin-top:7px"><i style="width:${p * 100}%"></i></div></div></div>
      <div class="stat2"><div style="background:#FFF4EA;border:1px solid #FFE1C7"><span style="color:#F97316">${ic('flame')}</span><div><b>${S.streak} hari</b><small>Streak aktif</small></div></div><div style="background:#E8F8F5;border:1px solid #CDEFE8"><span style="color:#0F766E">${ic('award')}</span><div><b>${nBadges()} / 6</b><small>Lencana</small></div></div></div></div>
    <div class="card"><div class="row"><b class="mf sp" style="font-size:16px">Misi hari ini</b><span class="xs muted">${doneCount()} / 4 selesai · reset 23.59</span></div><div style="margin-top:6px">${missionList()}</div></div>
    <div class="card" data-go="forecast" style="cursor:pointer"><div class="row"><b class="mf sp" style="font-size:16px">Prakiraan 8 jam</b><span class="lnk">Besok ${ic('chevR', 14)}</span></div>${hourly()}</div>`),
    after() {
      if (!S.m.check) later(() => {
        S.m.check = 2; gain(10); award('aware'); gain(20);
        S.notifs.unshift({ i: 'award', t: 'Lencana baru: Air Aware', d: 'Kamu mengecek kualitas udara untuk pertama kalinya.', x: '+20 XP', at: 'baru saja' }); S.unread++; save(); refresh();
        toast('Misi selesai · +10 XP', 'Lencana baru terbuka: Air Aware', () => badgeModal('aware'));
        later(() => { if (!$('.ovl') && cur === 'home') badgeModal('aware'); }, 3300);
      }, 900);
    }
  };
};
function hourly(vals = [[10, 64], [12, 88], [14, 112], [16, 96], [18, 78], [20, 66], [22, 58], [24, 52]]) {
  return `<div style="display:flex;gap:6px;margin-top:12px">${vals.map(([h, v]) => { const s = st(v); return `<div style="flex:1;text-align:center;border-radius:12px;padding:8px 0;background:${s.c === 'baik' ? '#E3F7EA' : s.c === 'sedang' ? '#EAF0FF' : '#FFEDE0'}"><div class="xs muted">${String(h % 24).padStart(2, '0')}</div><b class="mf" style="font-size:15px;color:${s.c === 'baik' ? '#15803D' : s.c === 'sedang' ? '#1E40AF' : '#C2410C'}">${v}</b></div>`; }).join('')}</div>`;
}
const MIS = [
  { k: 'check', t: 'Cek kualitas udara hari ini', xp: 10, ic: 'eye', to: 'aqi' },
  { k: 'explore', t: 'Jelajahi udara di sekitarmu', xp: 15, ic: 'map', to: 'map' },
  { k: 'route', t: 'Selesaikan rute aman', xp: 30, ic: 'route', to: 'dest' },
  { k: 'report', t: 'Kirim laporan tervalidasi', xp: 50, ic: 'camera', to: 'lens' },
];
function missionList() {
  return MIS.map(m => {
    const s = S.m[m.k], prog = m.k === 'explore' && s === 0 ? Math.min(S.explored.length, 5) / 5 : s ? 1 : 0;
    const cnt = m.k === 'explore' ? `${s ? 5 : Math.min(S.explored.length, 5)}/5` : `${s ? 1 : 0}/1`;
    const btn = s === 2 ? `<span class="claim ok">${ic('check', 13, 3)} +${m.xp} XP</span>` : s === 1 ? `<button class="claim go" data-act="claim" data-k="${m.k}">Klaim +${m.xp}</button>` : `<button class="claim todo" data-go="${m.to}">+${m.xp} XP ${ic('chevR', 13)}</button>`;
    return `<div class="mis ${s === 2 ? 'done' : ''}"><span class="mi" style="${m.k === 'route' ? 'background:#E4F7F1;color:#0F766E' : m.k === 'report' ? 'background:#FFF4DE;color:#B7791F' : ''}">${ic(m.ic, 18)}</span><div class="sp"><div class="row" style="gap:0"><span class="nm sp">${m.t}</span><span class="cnt">${cnt}</span></div><div class="bar"><i style="width:${prog * 100}%;${s === 2 ? 'background:#22C55E' : ''}"></i></div></div>${btn}</div>`;
  }).join('');
}

R.aqi = () => {
  const L = curLoc(), s = st(L.ispu);
  const params = [['PM2.5', 'Partikel halus', L.pm25, 'µg/m³', 75], ['PM10', 'Partikel kasar', L.pm10, 'µg/m³', 150], ['CO', 'Karbon monoksida', L.co, 'mg/m³', 10], ['O₃', 'Ozon', L.o3, 'µg/m³', 150], ['NO₂', 'Nitrogen dioksida', L.no2, 'µg/m³', 200], ['SO₂', 'Sulfur dioksida', L.so2, 'µg/m³', 150]];
  return {
    html: scr(`${hdr('Kualitas Udara', `${L.name} · ${L.spku}`, `<button class="cbtn" data-go="pickloc" aria-label="Pilih lokasi">${ic('pin')}</button>`)}
    <div class="card" style="padding:20px 16px 16px"><div class="gauge" style="width:220px;height:220px;margin:0 auto">${gauge(L.ispu, 220, false, 12)}<div class="v"><span style="color:var(--mut);font-size:13px;font-weight:600">ISPU</span><b style="font-size:62px;color:var(--ink)">${L.ispu}</b><span class="pill p-${s.c}" style="margin:4px auto 0">${s.t}</span></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px"><div style="background:#F3F7FC;border-radius:14px;padding:12px"><div class="xs bb muted" style="letter-spacing:1px">POLUTAN UTAMA</div><b class="mf" style="font-size:17px">${L.main}</b></div><div style="background:#F3F7FC;border-radius:14px;padding:12px"><div class="xs bb muted" style="letter-spacing:1px">TREN 3 JAM</div><b class="mf" style="font-size:17px;color:#E4572E;display:flex;gap:4px;align-items:center">${ic('trendUp', 16)}${L.trend}</b></div></div></div>
    <div class="well" style="cursor:default"><img src="${M('laugh')}" style="width:62px" alt=""><div><div class="t">UNTUK KESEHATANMU</div><p style="font-size:14px;color:var(--ink)">${s.msg} ${s.c === 'sedang' ? 'Kelompok sensitif batasi olahraga berat di luar.' : s.c === 'baik' ? 'Buka jendela agar sirkulasi rumah lebih segar.' : 'Kelompok sensitif sebaiknya tetap di dalam ruangan.'}</p></div></div>
    <div class="card mt"><div class="row"><b class="mf sp" style="font-size:17px">Parameter udara</b><span class="xs muted">µg/m³ · rata-rata 1 jam</span></div>
    ${params.map(([a, b, v, u, mx]) => { const f = Math.min(v / mx, 1); return `<div class="lrow"><div style="width:96px"><div class="b">${a}</div><div class="xs muted">${b}</div></div><div class="bar sp" style="height:6px"><i style="width:${Math.max(f * 100, 6)}%;background:${f > .6 ? 'linear-gradient(90deg,#14B8A6,#F5B400,#F97316)' : f > .3 ? 'linear-gradient(90deg,#14B8A6,#F5B400)' : '#14B8A6'}"></i></div><div style="width:76px;text-align:right"><b class="mf" style="font-size:16px">${String(v).replace('.', ',')}</b> <span class="xs muted">${u}</span></div></div>`; }).join('')}</div>
    <div class="card"><div class="row"><b class="mf sp" style="font-size:16px">Prakiraan 8 jam</b></div>${hourly()}</div>
    <div class="cta" style="position:static;margin-top:16px"><button class="btn" data-go="forecast">Lihat prakiraan besok ${ic('next', 18)}</button></div>`)
  };
};

const REKO = {
  me: { score: 78, h: 'Cukup baik untuk aktivitas ringan', d: '+6 dari kemarin', best: '06.00 – 09.00', ok: [['walk', 'Jalan santai', '30 mnt'], ['bike', 'Bersepeda ringan', 'Pagi'], ['window', 'Buka jendela', 's.d. 11.00']], no: [['run', 'Lari / olahraga berat', 'Tunda'], ['mask', 'Masker di jalan raya', 'KF94'], ['window', 'Jendela terbuka siang', 'Tutup 12–15']] },
  anak: { score: 62, h: 'Batasi bermain di luar siang hari', d: 'Ambang sensitif · ISPU > 50', best: '06.00 – 08.00', ok: [['walk', 'Main di teras', '20 mnt'], ['window', 'Ventilasi pagi', 's.d. 09.00']], no: [['run', 'Olahraga di lapangan', 'Tunda'], ['mask', 'Masker anak saat keluar', 'Wajib'], ['school', 'Upacara/olahraga sekolah', 'Pindah ke dalam']] },
  lansia: { score: 58, h: 'Sebaiknya di dalam saat ISPU naik', d: 'Ambang sensitif · ISPU > 50', best: '06.00 – 08.00', ok: [['walk', 'Jalan pagi di sekitar rumah', '15 mnt'], ['heart', 'Peregangan di dalam', 'Kapan saja']], no: [['run', 'Aktivitas berat di luar', 'Hindari'], ['mask', 'Masker saat ke pasar', 'KF94'], ['window', 'Jendela terbuka siang', 'Tutup']] },
  ispa: { score: 49, h: 'Siapkan inhaler, kurangi paparan', d: 'Rentan · ISPU > 50', best: '06.00 – 07.30', ok: [['heart', 'Latihan napas di dalam', '10 mnt'], ['window', 'Air purifier menyala', 'Siang']], no: [['run', 'Olahraga di luar', 'Hindari'], ['mask', 'Masker setiap keluar', 'KF94'], ['alert', 'Area pembakaran sampah', 'Jauhi']] },
};
REKO.dewasa = REKO.me; REKO.hamil = REKO.lansia;
R.reko = () => {
  T.rk = T.rk ?? -1;
  const who = T.rk < 0 ? null : S.fam[T.rk], d = who ? REKO[who.cat] : REKO.me;
  const chip = (k, n, on) => `<button class="chip ${on ? 'on' : ''}" data-act="rk" data-k="${k}" style="padding-left:5px"><span style="width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;background:${on ? '#fff' : '#FEF3C7'};color:${on ? 'var(--ink)' : '#92400E'}">${initial(n)}</span>${n}</button>`;
  const seg = [['#22C55E', 1], ['#93B4F5', 1], ['#F5D25B', 1], ['#93B4F5', 1], ['#93B4F5', 1]];
  return {
    html: scr(`${hdr('Rekomendasi', 'Dipersonalisasi untuk keluargamu')}
    <div class="row" style="gap:8px;overflow-x:auto;margin:-4px -20px 14px;padding:4px 20px;scrollbar-width:none">${chip(-1, 'Saya', T.rk < 0)}${S.fam.map((f, i) => chip(i, f.n, T.rk === i)).join('')}</div>
    <div class="aqi" style="cursor:default;display:flex;gap:16px;align-items:center;padding:18px"><div class="gauge" style="width:120px;height:120px">${ring(d.score / 100, 120, 8, 'rgba(255,255,255,.12)')}<div class="v"><b style="font-size:38px">${d.score}</b><span>dari 100</span></div></div><div class="sp"><div class="xs bb" style="letter-spacing:1px;color:#c3d1ea">SKOR UDARA HARI INI${who ? ' · ' + who.n.toUpperCase() : ''}</div><div class="mf bb" style="font-size:19px;line-height:1.25;margin-top:4px">${d.h}</div><div class="xs" style="color:#c3d1ea;margin-top:6px">${d.d}</div></div><img src="${M('sleepy')}" style="position:absolute;right:6px;bottom:-6px;width:60px" alt=""></div>
    <div class="card mt"><div class="row"><b class="mf sp" style="font-size:16px">Jendela aktivitas</b><span class="xs muted">06.00 – 21.00</span></div>
      <div style="display:flex;gap:3px;margin-top:12px">${seg.map(([c]) => `<i style="flex:1;height:9px;border-radius:3px;background:${c}"></i>`).join('')}</div>
      <div class="row xs muted" style="justify-content:space-between;margin-top:6px">${['06', '09', '13', '16', '19', '21'].map(x => `<span>${x}</span>`).join('')}</div>
      <div class="note-box nb-mint" style="margin-top:10px;font-weight:600;font-size:13.5px">${ic('sun', 16)}Terbaik untuk olahraga: ${d.best}</div></div>
    <div class="card"><div class="row"><span class="ico" style="width:34px;height:34px;color:var(--baik)">${ic('check', 17)}</span><b class="mf" style="font-size:17px">Aman dilakukan</b></div>${d.ok.map(([i, a, b]) => `<div class="lrow">${ic(i, 18)}<span class="sp">${a}</span><b class="small" style="color:#0F766E">${b}</b></div>`).join('')}</div>
    <div class="card"><div class="row"><span class="ico" style="width:34px;height:34px;color:#E9A100">${ic('alert', 17)}</span><b class="mf" style="font-size:17px">Perlu Dibatasi</b></div>${d.no.map(([i, a, b]) => `<div class="lrow">${ic(i, 18)}<span class="sp">${a}</span><b class="small" style="color:#B7791F">${b}</b></div>`).join('')}</div>`)
  };
};

R.forecast = () => {
  const v = [52, 58, 78, 96, 74, 56], hs = ['06.00', '09.00', '12.00', '15.00', '18.00', '21.00'];
  const X = i => 28 + i * 58, Y = n => 150 - (n - 30) * 1.3;
  const line = v.map((n, i) => `${i ? 'L' : 'M'}${X(i)} ${Y(n)}`).join(' ');
  return {
    html: scr(`${hdr('Prakiraan Besok', 'Minggu, 15 November')}
    <div class="card"><div class="small muted">Prakiraan ISPU tertinggi</div><div class="mf" style="font-size:38px;font-weight:800">96</div><span class="pill p-blue" style="padding-right:40px">Sedang</span><img src="${M('sleepy')}" class="float" style="position:absolute;right:16px;top:18px;width:110px" alt="">
    <svg viewBox="0 0 350 175" style="width:100%;margin-top:10px"><defs><linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc6ff" stop-opacity=".65"/><stop offset="1" stop-color="#bff0f5" stop-opacity=".5"/></linearGradient></defs>
    <path d="${line} L ${X(5)} 165 L ${X(0)} 165 Z" fill="url(#fc)"/><path d="${line}" fill="none" stroke="#2F6BFF" stroke-width="2.5"/>
    ${v.map((n, i) => `<circle cx="${X(i)}" cy="${Y(n)}" r="6" fill="#fff" stroke="#F5B400" stroke-width="3"/><text x="${X(i)}" y="${Y(n) - 12}" text-anchor="middle" font-size="11" font-weight="700" fill="#0B1F3A">${n}</text>`).join('')}</svg>
    <div class="row xs muted" style="justify-content:space-between;padding:0 6px">${hs.map(h => `<span>${h}</span>`).join('')}</div></div>
    <div class="card"><b class="mf" style="font-size:17px">Per jam</b><div style="display:flex;gap:6px;margin-top:12px">${[[6, 48], [8, 50], [10, 62], [12, 78], [14, 94], [16, 88], [18, 70]].map(([h, n]) => `<div style="flex:1;text-align:center;border-radius:12px;padding:8px 0;background:${n <= 50 ? '#E3F7EA' : '#E6EEFF'}"><div class="xs muted">${String(h).padStart(2, '0')}</div><b class="mf" style="font-size:16px;color:${n <= 50 ? '#15803D' : '#1E40AF'}">${n}</b></div>`).join('')}</div></div>
    <div class="card"><b class="mf" style="font-size:17px">Rekomendasi</b>${[['06.00 – 09.00', 'Ideal untuk olahraga', 'p-baik'], ['11.00 – 16.00', 'Kurangi aktivitas luar', 'p-blue'], ['18.00 – 21.00', 'Cukup untuk jalan santai', 'p-blue']].map(([a, b, c]) => `<div class="row" style="padding:10px 0"><b class="mf sp" style="font-size:15px">${a}</b><span class="pill ${c}">${b}</span></div>`).join('')}</div>
    <div style="height:110px"></div>
    <div class="cta"><button class="btn ${S.reminder ? 'blue' : ''}" data-act="remind">${S.reminder ? 'Pengingat aktif jam 06.00 ' + ic('check', 18) : 'Ingatkan saya jam 06.00 ' + ic('bell', 18)}</button><button class="btn ghost" data-go="home">Kembali ke Home</button></div>`)
  };
};

R.notif = () => {
  if (S.unread) { S.unread = 0; save(); }
  const base = [
    { i: 'check', bg: '#E3F7EA', fg: '#16A34A', t: 'Laporanmu tervalidasi', d: 'Pembakaran sampah di Bekasi Timur kini tampil di peta.', x: '+50 XP', at: '10.43', dot: 1 },
    { i: 'flame', bg: '#FFF1E8', fg: '#F97316', t: 'Streak 5 hari tercapai!', d: 'Kamu aktif 5 hari berturut-turut. Waktunya naik level.', x: '+100 XP', at: '09.00', dot: 1 },
    { i: 'clock', bg: '#FFF7E0', fg: '#D69E00', t: 'Waktu terbaik beraktivitas', d: 'Udara lebih baik pukul 17.00–19.00. Cocok untuk jalan sore.', at: '08.30' },
    { i: 'heart', bg: '#F3EEFF', fg: '#8B5CF6', t: 'Rekomendasi untuk Rizky', d: 'Kurangi aktivitas luar pukul 12.00–15.00.', at: '07.10' },
  ];
  const item = n => `<div class="lrow" style="align-items:flex-start"><span class="ico" style="background:${n.bg || '#EAF0FF'};color:${n.fg || '#2F6BFF'};box-shadow:none">${ic(n.i, 18)}</span><div class="sp"><div class="row"><b class="sp" style="font-size:14.5px">${n.t}</b><span class="xs muted">${n.at}</span>${n.dot ? '<span style="width:7px;height:7px;border-radius:50%;background:var(--blue)"></span>' : ''}</div><div class="small muted" style="margin-top:3px;line-height:1.5">${n.d}</div>${n.x ? `<span class="xp" style="margin-top:6px">${n.x}</span>` : ''}</div></div>`;
  return {
    html: scr(`${hdr('Notifikasi')}
    <div class="aqi" data-act="alertTim" style="padding:16px 18px 18px"><div class="row"><span class="pill" style="background:#FFF1E6;color:#C2410C">Peringatan aktif</span><span class="xs" style="color:#a9badb">12 menit lalu</span></div>
    <div class="mf bb" style="font-size:20px;line-height:1.3;margin-top:10px;width:75%">Kualitas udara Bekasi Timur memburuk</div><div class="mf" style="font-size:30px;font-weight:800;margin-top:6px"><span style="color:#a9badb">98</span> <span style="font-size:18px;color:#a9badb">→</span> 131</div><img src="${M('mask')}" style="position:absolute;right:8px;bottom:-4px;width:96px" alt=""></div>
    ${S.notifs.length ? `<div class="card mt"><div class="sect" style="margin-top:0">BARU</div>${S.notifs.map(item).join('')}</div>` : ''}
    <div class="card mt"><div class="sect" style="margin-top:0">HARI INI</div>${base.map(item).join('')}</div>
    <div class="card"><div class="sect" style="margin-top:0">KEMARIN</div>${item({ i: 'award', t: 'Pengingat streak', d: 'Buka Respira besok untuk menjaga streak harianmu.', at: '19.20' })}${item({ i: 'alert', bg: '#FFEDE5', fg: '#E4572E', t: 'Mustika Jaya berbahaya', d: 'ISPU 208. Hindari area ini bila tidak mendesak.', at: '15.05' })}</div>`)
  };
};

function locRow(id, on) {
  const L = LOCS[id];
  return `<div class="locc ${on ? 'on' : ''}" data-act="setloc" data-id="${id}"><span class="sq ${on ? 'blue' : ''}">${ic(L.icon, 18)}</span><div class="sp"><div class="nm">${L.name}</div><div class="ds">${L.sub}</div></div><div style="text-align:right"><div class="num">${L.ispu}</div>${pill(L.ispu)}</div></div>`;
}
R.pickloc = () => ({
  html: scr(`${hdr('Pilih lokasi')}
  <div class="lbl" style="margin-top:0">Cari kecamatan atau tempat</div><div class="inp">${ic('search')}<input id="qLoc" placeholder="Cari lokasi…" autocomplete="off"></div>
  <button class="row lnk" style="margin:16px 0 4px;font-size:15px" data-act="setloc" data-id="sel">${ic('nav', 18)}Gunakan lokasi saat ini</button>
  <div id="locList">${locLists('')}</div>
  <div class="center" style="margin-top:20px"><b class="lnk" data-go="saved" style="cursor:pointer;font-size:15px">Kelola lokasi tersimpan</b></div>`),
  after() { $('#qLoc').addEventListener('input', e => $('#locList').innerHTML = locLists(e.target.value)); }
});
function locLists(q) {
  q = q.toLowerCase();
  const f = id => LOCS[id].name.toLowerCase().includes(q) || LOCS[id].sub.toLowerCase().includes(q);
  const sv = Object.keys(LOCS).filter(k => !LOCS[k].near && f(k)), nr = Object.keys(LOCS).filter(k => LOCS[k].near && f(k));
  if (!sv.length && !nr.length) return `<div class="empty">Lokasi tidak ditemukan</div>`;
  return (sv.length ? `<div class="sect">TERSIMPAN</div>${sv.map(k => locRow(k, k === S.loc)).join('')}` : '') + (nr.length ? `<div class="sect">SEKITARMU</div>${nr.map(k => locRow(k, k === S.loc)).join('')}` : '');
}
R.saved = () => ({
  html: scr(`${hdr('Lokasi tersimpan', '', `<button class="cbtn dark" data-go="addloc" aria-label="Tambah">${ic('plus')}</button>`)}
  ${S.saved.map((l, i) => { const s = st(l.ispu); return `<div class="card" style="margin-bottom:12px"><div class="row"><span class="sq" style="background:${['#EAF0FF', '#F1F5FA', '#FFF4D6', '#EAF0FF'][i % 4]};color:${['#2F6BFF', '#0B1F3A', '#B7791F', '#2F6BFF'][i % 4]}">${ic(l.icon, 18)}</span><div class="sp"><div class="nm">${l.label}</div><div class="ds">${l.addr}</div></div><span class="pill p-${s.c === 'sedang' ? 'blue' : s.c}">ISPU ${l.ispu}</span></div><div class="hr"></div><div class="row"><span class="sp small" style="color:var(--ink2)">Peringatan untuk lokasi ini</span><span class="tgl ${l.alert ? 'on' : ''}" data-act="tglSaved" data-i="${i}"></span></div></div>`; }).join('')}
  <div class="note-box nb-mint">${ic('bell', 16)}<span>Respira memberi peringatan saat ISPU di lokasi tersimpan naik, meski kamu sedang di tempat lain.</span></div>
  <div class="cta"><button class="btn" data-go="addloc">Tambah lokasi ${ic('plus', 18)}</button></div>`)
});
R.addloc = () => {
  T.al = T.al || { type: 'Rumah', name: 'Rumah Nenek', alert: true, th: 50, addr: 'Jl. Kaliabang, Bekasi Utara', ispu: 88, dx: 0, dy: 0 };
  const a = T.al;
  return {
    html: scr(`${hdr('Tambah lokasi')}
    <div class="lbl" style="margin-top:0">Cari alamat atau tempat</div><div class="inp">${ic('search')}<input id="alQ" value="${a.addr}"><button data-act="alClear">${ic('x', 18)}</button></div>
    <div class="card" style="padding:0;height:210px;overflow:hidden;margin-top:14px;position:relative;touch-action:none" id="alMap">
      <div id="alMapIn" style="position:absolute;left:-60px;top:-140px;width:520px;transform:translate(${a.dx}px,${a.dy}px)">${mapSVG({ vb: '0 0 390 520', H: 900, heat: [{ x: 195, y: 260, r: 70, c: '#5b8cff', o: .35 }] })}</div>
      <div class="glass" style="position:absolute;left:12px;top:12px;background:#fff;color:var(--ink);font-size:12.5px;font-weight:600;display:flex;gap:6px;align-items:center">${ic('nav', 14)}Geser peta untuk atur titik</div>
      <svg style="position:absolute;left:50%;top:44%;transform:translate(-50%,-100%)" width="40" height="50" viewBox="0 0 40 50"><path d="M20 49C20 49 38 30 38 18A18 18 0 0 0 2 18c0 12 18 31 18 31Z" fill="#2F6BFF" stroke="#fff" stroke-width="3"/><g transform="translate(11 9) scale(.75)" stroke="#fff" fill="none" stroke-width="2.4">${P.home}</g></svg>
      <div class="card row" style="position:absolute;left:12px;right:12px;bottom:12px;padding:10px 12px"><b class="mf" style="font-size:22px" id="alIspu">${a.ispu}</b><div class="sp"><div class="small b">ISPU saat ini di titik ini</div><div class="xs muted">SPKU terdekat · 1,2 km</div></div><span id="alPill">${pill(a.ispu).replace('p-sedang', 'p-blue')}</span></div>
    </div>
    <div class="lbl">Jenis lokasi</div><div class="row" style="gap:8px;flex-wrap:wrap">${['Rumah', 'Kantor', 'Sekolah', 'Keluarga'].map(t => `<button class="chip ${a.type === t ? 'on' : ''}" data-act="alType" data-v="${t}">${t}</button>`).join('')}</div>
    <div class="lbl">Nama lokasi</div><div class="inp">${ic('pencil')}<input id="alName" value="${a.name}"></div>
    <div class="card mt"><div class="row"><span class="ico" style="box-shadow:none;background:#E4F7F1;color:#0F766E">${ic('bell', 18)}</span><div class="sp"><div class="b">Peringatan untuk lokasi ini</div><div class="xs muted">Kabari saat ISPU di sini naik</div></div><span class="tgl ${a.alert ? 'on' : ''}" data-act="alAlert"></span></div>
    <div style="${a.alert ? '' : 'display:none'}"><div class="hr"></div><div class="small" style="color:var(--ink2);margin-bottom:8px">Kirim peringatan saat ISPU di atas</div><div class="seg"><button class="${a.th === 100 ? 'on' : ''}" data-act="alTh" data-v="100">100 · Standar</button><button class="${a.th === 50 ? 'on' : ''}" data-act="alTh" data-v="50">50 · Sensitif</button></div>
    <div class="xs" style="color:#8B5CF6;margin-top:10px;display:flex;gap:6px">${ic('heart', 14)}Disarankan karena Budi (lansia) sering ke sini</div></div></div>
    <div style="height:90px"></div><div class="cta"><button class="btn" data-act="alSave">Simpan lokasi ${ic('check', 18)}</button></div>`),
    after() {
      const m = $('#alMap'), inn = $('#alMapIn'); let p0 = null;
      m.addEventListener('pointerdown', e => { if (e.target.closest('.card,.glass')) return; p0 = [e.clientX - a.dx, e.clientY - a.dy]; m.setPointerCapture(e.pointerId); });
      m.addEventListener('pointermove', e => { if (!p0) return; a.dx = Math.max(-60, Math.min(60, e.clientX - p0[0])); a.dy = Math.max(-80, Math.min(80, e.clientY - p0[1])); inn.style.transform = `translate(${a.dx}px,${a.dy}px)`; a.ispu = Math.round(88 + a.dx * .25 - a.dy * .2); $('#alIspu').textContent = a.ispu; $('#alPill').innerHTML = pill(a.ispu); });
      m.addEventListener('pointerup', () => p0 = null);
      $('#alName').addEventListener('input', e => a.name = e.target.value);
      $('#alQ').addEventListener('input', e => a.addr = e.target.value);
    }
  };
};
R.locsaved = () => {
  const l = S.saved[S.saved.length - 1];
  return {
    html: scr(`<div style="text-align:right"><button class="cbtn" data-go="home" style="display:inline-grid" aria-label="Tutup">${ic('x')}</button></div>
    <div class="stage" style="margin-top:0;width:220px;height:220px"><img src="${M('love')}" alt=""></div>
    <div class="succ center"><h1>Lokasi berhasil disimpan!</h1><p>Respira akan memantau udara di ${l.label} dan mengabarimu lebih awal.</p></div>
    <div class="card mt"><div class="row"><span class="sq blue">${ic(l.icon, 18)}</span><div class="sp"><div class="nm">${l.label}</div><div class="ds">${l.addr}</div></div><span class="pill p-blue">ISPU ${l.ispu}</span></div><div class="hr"></div><div class="small muted row" style="gap:8px">${ic('bell', 16)}${l.alert ? `Peringatan aktif saat ISPU di atas ${l.th}` : 'Peringatan nonaktif'}</div></div>
    <div class="note-box nb-mint" style="margin-top:14px">${ic('info', 16)}<span>Kamu sekarang memantau ${S.saved.length} lokasi. Ganti lokasi kapan saja dari Home.</span></div>
    <div class="cta"><button class="btn" data-go="saved">Lihat lokasi tersimpan ${ic('next', 18)}</button><button class="btn ghost" data-go="home">Kembali ke Home</button></div>`, 'fade')
  };
};

/* ---------- Map ---------- */
const PINS = [
  { id: 'utara', x: 46, y: 19.5, n: 'Bekasi Utara' }, { id: 'bar', x: 9, y: 27, n: 'Bekasi Barat' },
  { id: 'tim', x: 59, y: 35, n: 'Bekasi Timur' }, { id: 'sel', x: 19.5, y: 43, n: 'Bekasi Selatan' }, { id: 'mus', x: 62, y: 50.5, n: 'Mustika Jaya' },
];
const REPORT_PINS = [{ x: 70, y: 30, t: 'Pembakaran sampah' }, { x: 30, y: 22, t: 'Asap kendaraan pekat' }, { x: 78, y: 52, t: 'Pembakaran lahan kosong' }, { x: 40, y: 40, t: 'Asap industri' }];
R.map = () => {
  T.mf = T.mf || 'ISPU';
  const ex = S.explored.length, claimable = S.m.explore === 1, done = S.m.explore === 2;
  const heat = [{ x: 180, y: 160, r: 120, c: '#5b8cff' }, { x: 290, y: 330, r: 110, c: '#F5B400', o: .55 }, { x: 330, y: 500, r: 100, c: '#F97316', o: .5 }, { x: 60, y: 230, r: 90, c: '#22C55E', o: .35 }, { x: 160, y: 420, r: 80, c: '#5b8cff', o: .3 }];
  const pinH = PINS.map(p => { const L = LOCS[p.id], v = T.mf === 'PM2.5' ? L.pm25 : L.ispu, s = st(T.mf === 'PM2.5' ? L.pm25 * 2 : v); return `<button class="mpin ${S.explored.includes(p.id) && !done ? 'seen' : ''}" style="left:${p.x}%;top:${p.y}%" data-act="pin" data-id="${p.id}"><b style="background:${s.col}">${v}</b>${p.n}</button>`; }).join('');
  const repH = REPORT_PINS.map(r => `<button class="mpin" style="left:${r.x}%;top:${r.y}%;padding:4px" data-act="repPin" data-t="${r.t}"><b style="background:#F97316;width:28px;padding:0">${ic('flame', 14)}</b></button>`).join('');
  return {
    tab: 'map',
    html: `<div class="scr nopad" style="background:#eef1f5;overflow:hidden">
    <div class="mapwrap"><div class="mapin">${mapSVG({ heat: T.mf === 'Laporan warga' ? [] : heat })}${T.mf === 'Laporan warga' ? repH : pinH}<span class="me" style="left:46%;top:47.5%"></span></div></div>
    <div class="msearch"><div class="row"><div class="inp sp" data-go="dest" style="cursor:pointer;border-radius:26px">${ic('search')}<span class="muted" style="font-size:15px">Cari lokasi atau tujuan</span></div><button class="cbtn" data-act="mapLoc" aria-label="Lokasi saya" style="width:52px;height:52px">${ic('pin')}</button></div>
    <div class="chips">${['ISPU', 'PM2.5', 'Laporan warga'].map(c => `<button class="chip ${T.mf === c ? 'on' : ''}" data-act="mf" data-v="${c}">${c}</button>`).join('')}</div></div>
    ${claimable ? `<button class="qchip" style="bottom:268px" data-act="claim" data-k="explore">${ic('spark', 16)}Misi jelajah selesai · Klaim +15 XP</button>` : !done && T.mf !== 'Laporan warga' ? `<div class="qchip" style="bottom:268px;background:#fff;color:var(--ink);box-shadow:var(--sh2);animation:none;right:auto">${ic('map', 16)}Misi jelajah: cek ${ex}/5 titik</div>` : ''}
    <button class="fab" style="bottom:266px" data-act="mapLoc" aria-label="Arahkan">${ic('navUp', 20)}</button>
    <div class="sheet" style="height:250px;padding-bottom:0"><div class="grab"></div><div class="row"><h3 class="h3 sp">${T.mf === 'Laporan warga' ? 'Laporan warga terbaru' : 'SPKU terdekat'}</h3><button class="chip on" style="background:var(--blue);height:36px" data-go="dest">${ic('swap', 16)}Rute aman</button></div>
    <div style="height:180px;overflow:auto;padding-bottom:90px;margin-top:4px">${T.mf === 'Laporan warga' ? S.reports.filter(r => r.s !== 'no').slice(0, 3).map(r => `<div class="lrow"><span class="thumb" style="width:40px;height:40px;background-position:${r.pos || 'center'}"></span><div class="sp"><div class="nm" style="font-size:14px">${r.t}</div><div class="ds">${r.p}</div></div>${r.s === 'ok' ? '<span class="pill p-baik">Tervalidasi</span>' : '<span class="pill p-sedang">Menunggu</span>'}</div>`).join('') :
        [['sel', '0,8 km · diperbarui 10.42', '▲ 4'], ['tim', '3,2 km · diperbarui 10.39', '▲ 18'], ['bar', '2,4 km · diperbarui 10.40', '▼ 3']].map(([id, d, tr]) => `<div class="lrow" data-act="pin" data-id="${id}" style="cursor:pointer"><span class="sq" style="background:#FFF4DE;color:#D97706">${ic('radio', 18)}</span><div class="sp"><div class="nm" style="font-size:14.5px">SPKU ${LOCS[id].name}</div><div class="ds">${d}</div></div><div style="text-align:right"><b class="mf" style="font-size:19px">${LOCS[id].ispu}</b><div class="xs b" style="color:${tr[0] === '▲' ? '#E4572E' : '#16A34A'}">${tr}</div></div></div>`).join('')}</div></div></div>`
  };
};
function pinTip(id) {
  $$('.ptip').forEach(e => e.remove());
  const L = LOCS[id], p = PINS.find(x => x.id === id), s = st(L.ispu);
  const el = document.createElement('div'); el.className = 'ptip';
  const box = $('.mapin').getBoundingClientRect(), ph = $('#phone').getBoundingClientRect();
  let x = box.left - ph.left + box.width * p.x / 100 - 20, y = box.top - ph.top + box.height * p.y / 100 + 22;
  x = Math.max(12, Math.min(x, ph.width - 232));
  el.style.left = x + 'px'; el.style.top = y + 'px';
  el.innerHTML = `<div class="row"><div class="sp"><div class="b">${L.name}</div><div class="xs muted">${L.spku}</div></div><b class="mf" style="font-size:22px;color:${s.col}">${L.ispu}</b></div><div class="xs" style="margin-top:6px;color:var(--ink2)">${s.msg}</div><div class="row" style="margin-top:8px">${pill(L.ispu)}<b class="lnk sp" style="text-align:right;cursor:pointer" data-act="pinDetail" data-id="${id}">Detail ›</b></div>`;
  $('#phone').appendChild(el);
  later(() => el.remove(), 4000);
}

R.dest = () => {
  T.dq = T.dq ?? 'Summarecon';
  if (T.dq && !T.dest) T.dest = null;
  return {
    html: scr(`${hdr('Pilih Tujuan')}
    <div class="lbl" style="margin-top:0">Lokasi awal</div><div class="inp">${ic('target')}<span style="font-size:15.5px">Lokasi saya · Bekasi Selatan</span></div>
    <div class="lbl">Tujuan</div><div class="inp">${ic('search')}<input id="dq" value="${T.dq}" placeholder="Cari tempat tujuan" autocomplete="off"><button data-act="dqClear">${ic('x', 18)}</button></div>
    <div class="lbl" style="font-weight:600">Hasil pencarian</div><div id="dres">${destRes(T.dq)}</div>
    <div class="tip" style="margin-top:6px"><img src="${M('confused')}" alt="">Cek kualitas udara di sekitar tujuan sebelum berangkat. Kondisi udara sepanjang perjalanan dapat berbeda.</div>
    <div style="height:90px"></div><div class="cta"><button class="btn" data-act="findRoute" ${T.dest ? '' : 'disabled'} id="dBtn">Cari rute ${ic('search', 18)}</button></div>`),
    after() { $('#dq').addEventListener('input', e => { T.dq = e.target.value; $('#dres').innerHTML = destRes(T.dq); }); }
  };
};
const DESTS = [['Summarecon Mall Bekasi', 'Jl. Boulevard Ahmad Yani, Marga Mulya, Bekasi Utara', 71], ['Summarecon Bekasi · Bulevar', 'Marga Mulya, Bekasi Utara', 68], ['Stasiun Bekasi', 'Jl. Ir. H. Juanda, Bekasi Timur', 131], ['Grand Metropolitan Mall', 'Jl. Pulo Ribung, Bekasi Selatan', 66], ['Kampus BINUS @Bekasi', 'Summarecon Bekasi, Bekasi Utara', 70], ['Stadion Patriot Candrabhaga', 'Jl. Ahmad Yani, Bekasi Selatan', 62], ['RSUD Kota Bekasi', 'Jl. Pramuka, Bekasi Selatan', 74]];
function destRes(q) {
  q = (q || '').toLowerCase();
  const r = DESTS.filter(d => !q || (d[0] + d[1]).toLowerCase().includes(q)).slice(0, 4);
  if (!r.length) return `<div class="empty">Tidak ada hasil untuk "${q}"</div>`;
  return r.map(([a, b, v]) => `<div class="locc ${T.dest === a ? 'on' : ''}" data-act="pickDest" data-v="${a}"><span class="sq blue" style="background:#fff;box-shadow:var(--sh)">${ic('pin', 18)}</span><div class="sp"><div class="nm">${a}</div><div class="ds">${b}</div></div><span class="pill ${st(v).c === 'sedang' ? 'p-blue' : 'p-' + st(v).c}">${v}</span></div>`).join('');
}
const MODES = [['motor', 'Motor', 1], ['car', 'Mobil', 1.25], ['bike', 'Sepeda', 2.6], ['walk', 'Jalan kaki', 7]];
const PREF = [['bersih', 'Polusi terendah', 'Melewati area dengan kualitas udara terbaik', 'leaf', '#E4F7F1', '#0F766E'], ['cepat', 'Tercepat', 'Waktu tempuh paling singkat', 'zap', '#FFF7E0', '#D69E00'], ['pendek', 'Terpendek', 'Jarak tempuh paling dekat', 'ruler', '#F3EEFF', '#8B5CF6']];
R.route = () => {
  T.mode = T.mode ?? 0; T.pref = T.pref || 'bersih';
  return {
    html: scr(`${hdr('Rute Aman')}
    <div class="card row" style="padding:16px"><div class="sp"><div class="row" style="gap:10px"><span style="color:var(--blue)">${ic('target', 18)}</span><div><div class="xs muted">Lokasi awal</div><div class="b">${T.swap ? T.dest : 'Lokasi saya'}</div></div></div><div style="border-left:2px dashed #d6dfec;height:14px;margin:4px 8px"></div><div class="row" style="gap:10px"><span style="color:#F97316">${ic('pin', 18)}</span><div><div class="xs muted">Tujuan</div><div class="b">${T.swap ? 'Lokasi saya' : T.dest}</div></div></div></div><button class="cbtn" style="border-radius:14px;box-shadow:none;border:1px solid var(--line)" data-act="swap" aria-label="Tukar">${ic('updown', 18)}</button></div>
    <h3 class="h3" style="margin:20px 0 12px">Mode transportasi</h3>
    <div class="tmode">${MODES.map(([i, l], k) => `<button class="${T.mode === k ? 'on' : ''}" data-act="mode" data-k="${k}">${ic(i, 20)}${l}</button>`).join('')}</div>
    <h3 class="h3" style="margin:20px 0 6px">Preferensi rute</h3><p class="small muted" style="line-height:1.5;margin-bottom:12px">Pilih prioritas perjalananmu. Respira akan membandingkan estimasi kualitas udara, waktu, dan jarak setiap rute.</p>
    ${PREF.map(([k, a, b, i, bg, fg]) => `<div class="opt ${T.pref === k ? 'on' : ''}" data-act="pref" data-k="${k}"><span class="radio"></span><div class="sp"><div class="b">${a}</div><div class="xs muted">${b}</div></div><span class="ico" style="width:34px;height:34px;box-shadow:none;background:${bg};color:${fg}">${ic(i, 16)}</span></div>`).join('')}
    <div style="height:90px"></div><div class="cta"><button class="btn" data-go="compare">Cari rute aman ${ic('swap', 18)}</button></div>`)
  };
};
function routeData() {
  const f = MODES[T.mode || 0][2];
  const mm = n => Math.round(n * f);
  return [
    { k: 'bersih', t: 'Rute udara bersih', tag: 'Disarankan', tc: 'p-baik', dot: '#16B4CF', ispu: 42, w: mm(24), d: '13,6', km: 13.6, exp: 28, note: [ic('trendDn', 14), 'Polusi 35% lebih rendah dari rute tercepat'], nc: '#0F766E', grad: 'linear-gradient(90deg,#14B8A6,#22C55E)' },
    { k: 'cepat', t: 'Rute tercepat', tag: 'Tercepat', tc: 'p-sedang', dot: '#2F6BFF', ispu: 64, w: mm(16), d: '10,6', km: 10.6, exp: 58, note: [ic('zap', 14), `${mm(8)} mnt lebih cepat, lewat Jl. A. Yani`], nc: 'var(--ink2)', grad: 'linear-gradient(90deg,#14B8A6,#F5B400)' },
    { k: 'pendek', t: 'Rute terpendek', tag: 'Terpendek', tc: 'p-purple', dot: '#F97316', ispu: 70, w: mm(20), d: '9,5', km: 9.5, exp: 58, note: [ic('ruler', 14), '4,1 km lebih dekat, 2 titik macet'], nc: 'var(--ink2)', grad: 'linear-gradient(90deg,#14B8A6,#F5B400)' },
  ];
}
const PREV_PATHS = {
  bersih: 'M60 340 C 80 270, 120 240, 128 200 C 140 140, 220 120, 262 100 C 300 80, 330 40, 350 10',
  cepat: 'M60 340 C 130 300, 200 280, 262 240 C 320 200, 350 120, 350 10',
  pendek: 'M60 340 C 140 280, 230 200, 290 120 C 320 80, 340 40, 350 10',
};
R.compare = () => {
  T.sel = T.sel || T.pref || 'bersih';
  const rd = routeData(), col = { bersih: '#16B4CF', cepat: '#7C9CFF', pendek: '#F5A262' };
  const routes = ['pendek', 'cepat', 'bersih'].filter(k => k !== T.sel).concat(T.sel).map(k => ({ d: PREV_PATHS[k], c: col[k], w: k === T.sel ? 7 : 4, o: k === T.sel ? 1 : .75 }));
  const r = rd.find(x => x.k === T.sel);
  return {
    html: `<div class="scr nopad">
    <div style="position:relative;height:330px;overflow:hidden">${mapSVG({ vb: '0 0 390 330', routes })}
      <div class="row" style="position:absolute;left:16px;right:16px;top:16px"><button class="cbtn" data-back aria-label="Kembali">${ic('back')}</button><div class="inp sp" style="height:44px;border-radius:24px;font-weight:600;font-size:14px">${ic(MODES[T.mode || 0][0], 18)}<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Lokasi saya → ${T.dest.replace(' Bekasi', '')}</span></div></div>
      <span class="pill nod" style="position:absolute;left:46%;top:44%;background:var(--mid);color:#fff;padding:7px 12px">${ic('leaf', 13)} ISPU ${r.ispu} · ${r.k === 'bersih' ? 'Paling bersih' : r.tag}</span></div>
    <div style="margin-top:-24px;position:relative;padding:0 16px 120px">
    ${rd.map(x => `<div class="rcard ${T.sel === x.k ? 'on' : ''}" data-act="selRoute" data-k="${x.k}"><div class="row"><span style="width:10px;height:10px;border-radius:50%;background:${x.dot}"></span><b class="sp" style="font-size:15px">${x.t}</b><span class="pill ${x.tc}">${x.tag}</span></div>
      <div class="row" style="margin-top:8px;align-items:flex-end"><div class="sp"><div class="k">ISPU RATA-RATA</div><div class="bign">${x.ispu}</div></div><div style="text-align:right"><div class="k">WAKTU</div><div class="mv">${x.w} mnt</div></div><div style="text-align:right;margin-left:14px"><div class="k">JARAK</div><div class="mv">${x.d} km</div></div></div>
      <div class="row" style="margin-top:6px"><span class="xs muted" style="width:52px">Paparan</span><div class="bar sp"><i style="width:${x.exp}%;background:${x.grad}"></i></div></div>
      <div class="small" style="display:flex;gap:6px;align-items:center;margin-top:10px;color:${x.nc}">${x.note.join('')}</div></div>`).join('')}
    <div class="center xs muted">Diperbarui 14 Nov 2026 · 10.10 WIB</div></div>
    <div class="cta"><button class="btn" data-go="nav">Mulai navigasi ${ic('navUp', 18)}</button></div></div>`
  };
};
R.nav = () => {
  const r = routeData().find(x => x.k === (T.sel || 'bersih'));
  T.nr = r;
  return {
    html: `<div class="scr nopad" style="overflow:hidden;background:#eef1f5">
    <div class="mapwrap"><div class="mapin" id="navMap">${mapSVG({ routes: [{ d: NAV_PATH, c: '#16B4CF', w: 9, id: 'navp' }, { d: 'M175 140 L175 -20', c: '#F97316', w: 9 }], extra: '<circle id="navDot" r="10" fill="#2F6BFF" stroke="#fff" stroke-width="4"/>' })}</div></div>
    <div class="navtop"><span class="tb" id="navIc">${ic('turnL', 26, 2.4)}</span><div class="sp"><div class="mf" style="font-size:30px;font-weight:800;line-height:1" id="navDist">250 m</div><div style="color:#c3d1ea;margin-top:2px" id="navTxt">Belok kiri ke Jl. A. Yani</div></div><button class="cbtn glass" data-act="mute" id="muteBtn" aria-label="Suara">${ic('vol', 18)}</button></div>
    <div class="speed" style="bottom:262px"><b id="spd">40</b><small>km/j</small></div>
    <div class="warn" id="navWarn" style="bottom:252px;display:none"><span class="wi">${ic('alert', 16)}</span><div><b style="color:var(--ink);font-size:13px">Udara tidak sehat di depan</b><br>Sekitar 270 m lagi, kamu akan melewati area dengan estimasi ISPU 112. Tetap ikuti navigasi dan pertimbangkan jalur alternatif jika tersedia.</div></div>
    <div class="sheet" style="padding-bottom:26px"><div class="grab"></div><div class="row"><img src="${M('leaf')}" style="width:50px" alt=""><div class="sp"><div class="xs bb muted" style="letter-spacing:1px">UDARA SEPANJANG RUTE</div><div class="mf bb" style="font-size:20px">${r.ispu} · <span style="color:${st(r.ispu).col === '#F5B400' ? '#B7791F' : '#16A34A'}">${st(r.ispu).t}</span></div></div><div style="text-align:right"><div class="xs bb muted" style="letter-spacing:1px">TIBA</div><div class="mf bb" style="font-size:20px" id="eta">10.${String(10 + r.w).padStart(2, '0')}</div></div></div>
    <div style="display:flex;gap:4px;margin:12px 0"><i style="flex:5;height:5px;border-radius:4px;background:#16B4CF"></i><i style="flex:1;height:5px;border-radius:4px;background:#F5B400"></i><i style="flex:1;height:5px;border-radius:4px;background:#F97316"></i><i style="flex:3;height:5px;border-radius:4px;background:#16B4CF"></i></div>
    <div class="row"><div class="sp"><div class="mf bb" style="font-size:24px" id="remT">${r.w} mnt</div><div class="small muted" id="remD">${r.d} km tersisa</div></div><button class="btn red" style="width:auto;padding:0 26px;height:48px" data-act="endNav">Akhiri</button></div></div></div>`,
    after() {
      const p = $('#navp'), dot = $('#navDot'), L = p.getTotalLength(), dur = 14000, t0 = performance.now();
      const steps = [[0, 'turnL', 'Belok kiri ke Jl. A. Yani', 250], [.3, 'navUp', 'Lurus di Jl. Juanda', 900], [.55, 'turnL', 'Belok kiri ke Jl. Pramuka', 400], [.8, 'navUp', 'Tujuan di depan, sisi kanan', 150]];
      let raf;
      const tick = now => {
        if (cur !== 'nav') return;
        const f = Math.min((now - t0) / dur, 1), pt = p.getPointAtLength(L * f);
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
        const stp = steps.filter(s => s[0] <= f).pop(), nxt = steps.find(s => s[0] > f), seg = (nxt ? nxt[0] : 1) - stp[0];
        $('#navDist').textContent = Math.max(10, Math.round(stp[3] * (1 - (f - stp[0]) / seg) / 10) * 10) + ' m';
        $('#navTxt').textContent = stp[2]; $('#navIc').innerHTML = ic(stp[1], 26, 2.4);
        $('#remT').textContent = Math.max(1, Math.round(T.nr.w * (1 - f))) + ' mnt';
        $('#remD').textContent = (T.nr.km * (1 - f)).toFixed(1).replace('.', ',') + ' km tersisa';
        $('#spd').textContent = 32 + Math.round(10 * Math.sin(f * 20));
        $('#navWarn').style.display = f > .35 && f < .62 ? 'flex' : 'none';
        if (f < 1) raf = requestAnimationFrame(tick); else later(finishTrip, 600);
      };
      raf = requestAnimationFrame(tick);
    }
  };
};
function finishTrip() {
  if (cur !== 'nav') return;
  const r = T.nr || routeData()[0];
  S.routes++; let first = false;
  if (S.m.route !== 2) { S.m.route = 2; first = true; gain(30); }
  if (S.routes >= 5) award('route');
  save();
  T.rw = {
    xp: first ? 30 : 0, m: 'leaf', title: 'Perjalanan bersih selesai!', desc: `Kamu menghindari 35% paparan polusi dalam perjalanan ke ${T.dest.replace(' Bekasi', '')}.`,
    rows: [['route', r.t, r.d + ' km'], ['leaf', 'ISPU rata-rata', `${r.ispu} · ${st(r.ispu).t}`], ['award', 'Route Hero', `${Math.min(S.routes, 5)} / 5 rute`]],
    cta: ['Kembali ke peta', 'map'], link: ['Lihat progres Air Quest', 'quest'],
  };
  go('reward', true);
}

/* ---------- Reward ---------- */
R.reward = () => {
  const w = T.rw || { xp: 0, title: '', desc: '', rows: [], cta: ['Kembali ke Home', 'home'], m: 'joy' };
  const p = Math.min(S.xp / lvMax(), 1), lvShow = T.levelUp ? T.levelUp - 1 : S.level, maxShow = LVMAX[lvShow];
  return {
    html: `<div class="scr reward nopad" style="padding:24px"><div class="rays"></div>
    <button class="cbtn glass x" data-act="rwGo" data-to="${w.cta[1]}" aria-label="Tutup">${ic('x')}</button>
    <div class="masc"><span class="sparkle" style="left:-34px;top:96px;color:#ffe08a">${ic('spark', 18)}</span><span class="sparkle" style="right:-40px;top:70px;color:#9fd0ff">${ic('spark', 14)}</span><img src="${M(w.m)}" alt="">${w.xp ? `<span class="xpb">+${w.xp} XP</span>` : ''}</div>
    ${w.xp ? `<div class="big">+${w.xp} XP</div>` : '<div style="height:16px"></div>'}<h2>${w.title}</h2><p>${w.desc}</p>
    <div class="rbox">${w.rows.map(([i, a, b]) => `<div class="r">${ic(i, 16)}<span>${a}</span><b>${b}</b></div>`).join('')}
      <div class="r" style="margin-top:4px;font-size:12.5px"><span>${LV[lvShow]} · Lv ${lvShow}</span><b><span id="rwXp">${Math.min(S.xp, maxShow)}</span> <span style="color:#9fb6e0;font-weight:500">/ ${maxShow} XP</span></b></div>
      <div class="bar dk" style="margin-top:6px"><i id="rwBar" style="width:${Math.max(0, (S.xp - (w.xp || 0)) / maxShow * 100)}%"></i></div></div>
    ${w.badge ? `<div class="rbox row" style="margin-top:12px;gap:12px">${badgeSVG(w.badge.ic, w.badge.col, 40)}<div style="text-align:left"><div class="xs bb" style="letter-spacing:1.2px;color:#7be0a8">LENCANA TERBUKA</div><div class="b">${w.badge.t}</div></div></div>` : ''}
    <div class="cta"><button class="btn white" data-act="rwGo" data-to="${w.cta[1]}">${w.cta[0]} ${ic('next', 18)}</button>${w.link ? `<b class="lnk2" data-act="rwGo" data-to="${w.link[1]}" style="cursor:pointer">${w.link[0]}</b>` : ''}</div></div>`,
    after() { later(() => { const b = $('#rwBar'); if (b) b.style.width = Math.min(S.xp / maxShow, 1) * 100 + '%'; }, 250); }
  };
};
R.levelup = () => {
  const l = T.levelUp || S.level;
  return {
    html: `<div class="scr lvl nopad" style="padding:24px"><div class="rays" style="top:230px"></div><div class="confetti">${Array.from({ length: 36 }, (_, i) => `<i style="left:${Math.random() * 100}%;background:${['#38bdf8', '#f5b400', '#22c55e', '#f472b6', '#a78bfa', '#fff'][i % 6]};animation-duration:${2.5 + Math.random() * 2.5}s;animation-delay:${Math.random() * 1.2}s"></i>`).join('')}</div>
    <div class="xs bb" style="letter-spacing:2px;color:#8fd3ff;margin-top:40px">NAIK LEVEL!</div>
    <div class="circ"><span class="sparkle" style="left:-46px;top:50px;color:#ffe08a">${ic('spark', 18)}</span><div style="color:#a9badb;font-size:13px">LEVEL</div><div class="mf" style="font-size:84px;font-weight:800;line-height:1">${l}</div><img src="${M('love')}" style="position:absolute;right:-44px;bottom:-20px;width:100px" alt=""></div>
    <h1 style="font-size:32px;margin-top:22px">${LV[l]}</h1><p style="color:#c3d1ea;line-height:1.6;margin-top:8px">Kamu sudah jadi penjaga udara Bekasi. Terus jaga napasmu dan keluargamu!</p>
    <div class="rbox"><div class="xs bb" style="letter-spacing:1px;color:#a9badb;margin-bottom:6px">YANG TERBUKA DI LEVEL INI</div>
    ${[['bell', 'Peringatan prakiraan 24 jam lebih awal'], ['users', 'Tantangan keluarga mingguan'], ['spark', 'Tema kartu "Aurora" di Home']].map(([i, t]) => `<div class="r" style="color:#fff">${ic(i, 17)}<span>${t}</span></div>`).join('')}
    <div class="r" style="margin-top:6px;font-size:12.5px"><span>Menuju ${LV[l + 1] || 'level maksimal'}</span><b>${S.xp} <span style="color:#9fb6e0;font-weight:500">/ ${LVMAX[l]} XP</span></b></div><div class="bar dk"><i style="width:${S.xp / LVMAX[l] * 100}%"></i></div></div>
    <div class="cta"><button class="btn white" data-act="lvDone">Lanjutkan ${ic('next', 18)}</button></div></div>`
  };
};

/* ---------- Lens ---------- */
R.lens = () => ({
  tab: 'lens',
  html: `<div class="scr nopad cam"><div class="photo ${S.lensTry ? 'pix' : ''}"></div>
  <div class="row" style="padding:18px 20px 0;color:#fff;align-items:flex-start"><div class="sp"><h2 style="font-size:23px">Lens</h2><div class="xs" style="color:#d5dff0">Laporkan sumber polusi</div></div><span class="glass row" style="gap:6px;font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:20px;color:#fff">${ic('pin', 14)}Bekasi Timur · GPS</span></div>
  <div class="frame"><i></i><i></i><i></i><i></i><div class="scan"></div></div>
  <div class="hint" style="position:absolute;left:16px;right:16px;bottom:236px" id="lensHint"><img src="${M('wink')}" alt=""><span>Tahan 2 detik. Lokasi &amp; waktu dicatat otomatis untuk verifikasi.</span></div>
  <div class="row" style="position:absolute;left:0;right:0;bottom:106px;justify-content:space-evenly"><button class="camb" data-act="flash" id="flashB" aria-label="Flash">${ic('zap', 20)}</button>
  <button class="shut" id="shut" aria-label="Ambil foto"><svg width="86" height="86" viewBox="0 0 86 86"><circle id="shutP" cx="43" cy="43" r="40" fill="none" stroke="#5ee0f5" stroke-width="4" stroke-dasharray="0 252" stroke-linecap="round"/></svg><i></i></button>
  <button class="camb" data-go="history" aria-label="Riwayat laporan">${ic('file', 20)}</button></div></div>`,
  after() {
    const b = $('#shut'), pr = $('#shutP'); let t0 = 0, raf;
    const HOLD = 1400;
    const step = () => { const f = Math.min((performance.now() - t0) / HOLD, 1); pr.setAttribute('stroke-dasharray', `${252 * f} 252`); if (f >= 1) { cancel(); capture(); } else raf = requestAnimationFrame(step); };
    const cancel = () => { cancelAnimationFrame(raf); b.classList.remove('hold'); };
    b.addEventListener('pointerdown', e => { e.preventDefault(); t0 = performance.now(); b.classList.add('hold'); raf = requestAnimationFrame(step); });
    const up = () => { if (!b.classList.contains('hold')) return; cancel(); if (performance.now() - t0 < HOLD) { pr.setAttribute('stroke-dasharray', '0 252'); $('#lensHint span').innerHTML = '<b>Tahan sedikit lebih lama</b> sampai lingkaran penuh.'; } };
    b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up);
  }
});
function capture() {
  const f = document.createElement('div'); f.style.cssText = 'position:absolute;inset:0;background:#fff;z-index:90;animation:fade .2s reverse forwards'; $('#phone').appendChild(f); setTimeout(() => f.remove(), 250);
  T.good = S.lensTry > 0; S.lensTry++; save();
  setTimeout(() => go('verify'), 220);
}
const CHK_OK = ['Foto diambil langsung dari Lens', 'Lokasi dan waktu cocok', 'Mengenali objek pencemaran', 'Membandingkan dengan sensor terdekat'];
R.verify = () => ({
  html: scr(`${hdr('Verifikasi AI')}
  <div class="ph ${T.good ? '' : 'blur'}" style="${T.good ? 'background-position:center 40%' : 'filter:blur(2.5px)'}"><div class="spin"></div></div>
  <div class="row" style="margin:14px 0 6px"><b class="sp">Menganalisis foto…</b><span class="muted" id="vPct">0%</span></div><div class="bar"><i id="vBar" style="width:0;transition:width .15s linear;background:var(--blue)"></i></div>
  <div class="card mt"><b class="mf" style="font-size:16px">Pemeriksaan AI</b><div id="vList" style="margin-top:6px">${CHK_OK.map((t, i) => `<div class="chkl p" data-i="${i}"><span class="c wait"></span>${t}</div>`).join('')}</div></div>
  <div class="tip mt"><img src="${M('confused')}" alt="">Sebentar ya, lagi dicek supaya laporan yang tampil di peta bisa dipercaya.</div>
  <div class="cta"><button class="btn" id="vBtn" disabled data-go="${T.good ? 'vok' : 'vfail'}">Lihat hasil verifikasi ${ic('next', 18)}</button></div>`),
  after() {
    let p = 0;
    const iv = setInterval(() => {
      if (cur !== 'verify') return clearInterval(iv);
      p = Math.min(100, p + 2); $('#vPct').textContent = p + '%'; $('#vBar').style.width = p + '%';
      $$('#vList .chkl').forEach((el, i) => { const at = (i + 1) * 24; const c = $('.c', el); if (p >= at) { el.classList.remove('p'); c.className = 'c ' + (!T.good && i >= 2 ? 'no' : 'ok'); c.innerHTML = ic(!T.good && i >= 2 ? 'x' : 'check', 13, 3.5); } else if (p >= at - 24) { c.className = 'c run'; } });
      if (p >= 100) { clearInterval(iv); $('#vBtn').disabled = false; $('.spin') && $('.spin').remove(); }
    }, 60);
    timers.push(iv);
  }
});
R.vfail = () => ({
  html: scr(`${hdr('Verifikasi AI')}
  <div class="ph" style="filter:blur(.5px)"><div style="position:absolute;inset:0;backdrop-filter:blur(3px)"></div><span class="tag" style="color:#E4572E">${ic('alert', 14)} Tidak lolos verifikasi</span></div>
  <div class="card mt"><b class="mf" style="font-size:16px">Pemeriksaan AI</b><div style="margin-top:6px">${[['no', 'Foto buram'], ['no', 'Objek sulit dikenali'], ['ok', 'Lokasi GPS cocok']].map(([c, t]) => `<div class="chkl"><span class="c ${c}">${ic(c === 'ok' ? 'check' : 'x', 13, 3.5)}</span>${t}</div>`).join('')}</div></div>
  <div class="tip mt" style="align-items:flex-start"><img src="${M('question')}" alt=""><div><div class="lnk row" style="gap:6px;margin-bottom:4px">${ic('info', 15)}Tips foto lebih jelas</div>Dekatkan kamera ke objek, tahan beberapa detik, dan pastikan cahaya cukup.</div></div>
  <div class="cta"><button class="btn" data-act="retake">Ambil ulang ${ic('camera', 18)}</button></div>`)
});
R.vok = () => ({
  html: scr(`${hdr('Verifikasi AI')}
  <div class="ph" style="background-position:center 40%"><div class="bbox"><span>Asap · 91%</span></div><span class="tag" style="color:#16A34A">${ic('check', 14, 3)} Foto asli</span></div>
  <div class="card mt"><b class="mf" style="font-size:16px">Pemeriksaan AI</b><div style="margin-top:6px">${['Diambil langsung dari kamera Lens', 'Lokasi dan waktu cocok', 'Objek dapat dikenali', 'Sensor terdekat ikut naik (ISPU 131)'].map(t => `<div class="chkl"><span class="c ok">${ic('check', 13, 3.5)}</span>${t}</div>`).join('')}</div></div>
  <div class="row mt" style="background:#FFEDE3;border-radius:16px;padding:14px"><span class="ico" style="color:#F97316">${ic('flame', 18)}</span><div><div class="b" style="color:#E4572E;font-size:15.5px">Pembakaran sampah</div><div class="xs" style="color:var(--ink2)">Asap sedang · Bekasi Timur · 10.43 WIB</div></div></div>
  <div class="cta"><button class="btn" data-act="sendReport">Kirim laporan ${ic('next', 18)}</button></div>`)
});
R.thanks = () => ({
  html: scr(`${stage('heart', '<span class="sparkle" style="right:36px;top:20px;color:#f472b6">' + ic('heart', 18) + '</span>')}
  <div class="succ center"><h1>Terima kasih!</h1><p>Laporanmu berhasil diterima dan membantu warga lain mendapatkan udara yang lebih bersih.</p></div>
  <div class="cta"><div class="row" style="background:#FFF5DB;border:1px solid #F5DD9A;border-radius:16px;padding:12px 14px;cursor:pointer" data-go="history"><span style="color:#B7791F">${ic('clock', 18)}</span><div class="sp"><div class="b" style="font-size:14px">Menunggu validasi</div><div class="xs" style="color:#7A5300">+50 XP masuk otomatis setelah tervalidasi</div></div><b class="small">Status ›</b></div>
  <button class="btn" data-act="viewReports">Lihat di peta</button><button class="btn ghost" data-go="home">Kembali ke Home</button></div>`, 'fade')
});
R.history = () => {
  T.hf = T.hf || 'all';
  const list = S.reports.filter(r => T.hf === 'all' || (T.hf === 'ok' ? r.s === 'ok' : r.s === 'wait'));
  const v = validated();
  return {
    html: scr(`${hdr('Riwayat laporan', '', `<button class="cbtn dark" data-go="lens" aria-label="Lapor">${ic('camera')}</button>`)}
    <div class="stat3" style="margin-top:0">${[[v, 'Tervalidasi'], [S.reports.filter(r => r.s === 'wait').length, 'Menunggu'], ['+' + v * 50, 'XP dari laporan']].map(([a, b]) => `<div><b>${a}</b><small>${b}</small></div>`).join('')}</div>
    <div class="card row mt" style="background:#E9F8F3;border:1px solid #cdeee3;cursor:pointer" data-act="badge" data-id="guard">${badgeSVG('users', 'green', 34, v < 10)}<div class="sp"><div class="b">Community Guardian · ${Math.min(v, 10)} / 10</div><div class="bar" style="margin-top:6px"><i style="width:${v * 10}%"></i></div></div>${ic('chevR', 18)}</div>
    <div class="seg mt">${[['all', 'Semua'], ['ok', 'Tervalidasi'], ['wait', 'Menunggu']].map(([k, l]) => `<button class="${T.hf === k ? 'on' : ''}" data-act="hf" data-k="${k}">${l}</button>`).join('')}</div>
    <div class="mt">${list.length ? list.map(r => `<div class="card row" style="margin-bottom:12px;padding:12px;${r.s === 'wait' && r.mine ? 'cursor:pointer' : ''}" ${r.s === 'wait' && r.mine ? 'data-act="validate"' : ''}><span class="thumb" style="background-position:${r.pos || 'center'}"></span><div class="sp"><div class="nm">${r.t}</div><div class="ds">${r.p}</div><div class="row" style="margin-top:6px;gap:8px">${r.s === 'ok' ? '<span class="pill p-baik">Tervalidasi</span>' : r.s === 'wait' ? '<span class="pill p-sedang">Menunggu validasi</span>' : '<span class="pill p-ts">Tidak lolos</span>'}<span class="sp"></span>${r.s === 'ok' ? '<b style="color:#0F766E;font-size:13px">+50 XP</b>' : r.s === 'wait' ? `<span class="xs muted" style="white-space:nowrap">${r.mine ? 'Cek status ›' : '+50 XP setelah valid'}</span>` : ''}</div></div></div>`).join('') : '<div class="empty">Belum ada laporan</div>'}</div>`)
  };
};
function validateReport() {
  const r = S.reports.find(x => x.mine && x.s === 'wait');
  if (!r) return;
  r.s = 'ok'; S.newReport = 2;
  let fresh = false;
  if (S.m.report !== 2) { S.m.report = 2; gain(50); }
  const v = validated(); if (v >= 5) fresh = award('eco');
  if (v >= 10) award('guard');
  S.notifs.unshift({ i: 'check', bg: '#E3F7EA', fg: '#16A34A', t: 'Laporanmu tervalidasi', d: `${r.t} di Bekasi Timur kini tampil di peta.`, x: '+50 XP', at: 'baru saja' }); S.unread++;
  save();
  T.rw = {
    xp: 50, m: 'angry', title: 'Laporanmu tervalidasi!', desc: `${r.t} di Bekasi Timur kini tampil di peta dan membantu 23 warga sekitar.`,
    rows: [['check', 'Status', 'Tervalidasi'], ['camera', 'Laporan tervalidasi', v + ' total'], ['users', 'Warga terbantu', '23']],
    badge: S.badges.eco ? { ic: 'camera', col: 'green', t: `Eco Reporter · ${Math.min(v, 5)} laporan tervalidasi` } : null,
    cta: ['Lihat di peta', 'mapReports'], link: ['Lihat koleksi lencana', 'progress'],
  };
  go('reward');
}

/* ---------- Profile ---------- */
R.profile = () => {
  const p = S.xp / lvMax(), u = S.user;
  return {
    tab: 'profile',
    html: `<div class="scr" style="padding-top:18px">
    <div class="phead"><h1 style="font-size:23px">Profile</h1><div class="row" style="margin-top:16px"><span class="avatar">${initial(u.name)}</span><div class="sp"><div class="mf bb" style="font-size:20px">${u.name}</div><div class="small" style="color:#c3d1ea">${u.email} · ${u.loc}</div></div><button class="cbtn glass" data-go="editprof" aria-label="Edit profil">${ic('pencil', 17)}</button></div></div>
    <div class="card over"><div class="row"><span class="lvtag light"><i style="color:#fff">${S.level}</i>${LV[S.level]}</span><span class="sp"></span><b class="lnk" data-go="progress" style="cursor:pointer;font-size:13px">Progres &amp; lencana ›</b></div>
      <div class="row" style="margin-top:10px;align-items:baseline"><b class="mf" style="font-size:30px;font-weight:800;white-space:nowrap">${S.xp} XP</b><span class="small muted">${Math.max(lvMax() - S.xp, 0)} XP lagi ke ${LV[S.level + 1] || '-'}</span></div><div class="bar" style="margin-top:8px"><i style="width:${p * 100}%"></i></div><div class="hr"></div>
      <div class="row">${BADGES.filter(b => S.badges[b.id]).map(b => `<button data-act="badge" data-id="${b.id}">${badgeSVG(b.ic, b.col, 32)}</button>`).join('')}${BADGES.filter(b => !S.badges[b.id]).slice(0, 1).map(b => `<button data-act="badge" data-id="${b.id}">${badgeSVG(b.ic, b.col, 32, true)}</button>`).join('')}<span class="sp"></span><b class="small" style="color:#F97316;display:flex;gap:4px">${ic('flame', 15)}${S.streak} hari</b></div></div>
    <div class="stat3">${[[S.reports.filter(r => r.s === 'ok').length, 'Laporan Lens'], [S.routes + 9, 'Rute aman'], ['84%', 'Hari sehat']].map(([a, b]) => `<div><b>${a}</b><small>${b}</small></div>`).join('')}</div>
    <div class="card row mt" style="background:#F6F3FF;border:1px solid #E7E0FB"><span class="ico" style="color:#8B5CF6">${ic('heart', 18)}</span><div class="sp"><div class="b">Mode kelompok rentan</div><div class="xs muted">Ambang peringatan disesuaikan per anggota</div></div><span class="tgl ${S.rentan ? 'on' : ''}" data-act="rentan"></span></div>
    <div class="card"><div class="row"><b class="mf sp" style="font-size:17px">Anggota keluarga</b><b class="lnk" data-act="addMember" style="cursor:pointer">+ Tambah</b></div><div style="margin-top:6px">${S.fam.map((f, i) => { const c = CATS.find(x => x.id === f.cat); return `<div class="fam" ${i ? '' : 'style="border:0"'}><span class="av" style="background:${c.bg};color:${c.fg}">${initial(f.n)}</span><div class="sp"><div class="b">${f.n} <span class="muted" style="font-weight:400">· ${f.age} th</span></div><div class="xs muted">${c.t.split(' /')[0]}</div></div><span class="pill p-${c.c}">${c.tag}</span></div>`; }).join('')}</div></div>
    <div class="card menu">${[['map', 'Lokasi tersimpan', 'saved'], ['file', 'Riwayat laporan', 'history'], ['spark', 'Air Quest', 'quest'], ['settings', 'Pengaturan', 'settings'], ['help', 'Bantuan & tentang', 'help']].map(([i, t, g]) => `<div class="lrow" data-go="${g}">${ic(i, 19)}<span class="sp b">${t}</span>${ic('chevR', 18)}</div>`).join('')}</div></div>`
  };
};
R.editprof = () => {
  const u = S.user;
  return {
    html: scr(`${hdr('Edit Profile')}
    <div style="position:relative;width:96px;margin:0 auto"><span class="avatar" style="width:96px;height:96px;font-size:38px">${initial(u.name)}</span><span style="position:absolute;right:-4px;bottom:0;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:var(--sh);display:grid;place-items:center;color:var(--blue)">${ic('camera', 15)}</span></div>
    ${field('Nama lengkap', 'user', u.name, 'id="eName"')}${field('Username', 'user', u.uname, 'id="eUser"')}${field('Email', 'mail', u.email, 'id="eMail"', 'email')}${pwField('Kata sandi', 'epw', 'respira2026')}${field('Lokasi', 'pin', u.loc, 'id="eLoc"')}
    <div style="height:90px"></div><div class="cta"><button class="btn" data-act="saveProf">Simpan perubahan</button></div>`)
  };
};
R.saved2 = () => ({
  html: scr(`${stage('love', '<span class="sparkle" style="right:30px;top:12px;color:#F5B400">' + ic('spark', 16) + '</span>')}<div class="succ center"><h1>Berhasil disimpan!</h1><p>Profilmu sudah diperbarui.</p></div><div class="cta"><button class="btn" data-go="profile">Lanjutkan</button></div>`, 'fade')
});
R.settings = () => ({
  html: scr(`${hdr('Pengaturan')}
  <div class="sect" style="margin-top:0">AKUN</div><div class="card" style="padding:4px 16px">${[['Ubah nama', firstName(), 'editprof'], ['Ubah email', S.user.email, 'editprof'], ['Ubah kata sandi', '', 'forgot']].map(([a, b, g]) => `<div class="lrow" data-go="${g}" style="cursor:pointer"><span class="sp">${a}</span><span class="small muted">${b}</span>${ic('chevR', 16)}</div>`).join('')}</div>
  <div class="sect">PREFERENSI</div><div class="card" style="padding:4px 16px"><div class="lrow" data-act="lang" style="cursor:pointer"><span class="sp">Bahasa</span><span class="small muted">${S.set.lang}</span>${ic('chevR', 16)}</div><div class="lrow"><span class="sp">Satuan pengukuran</span><span class="small muted">µg/m³ (metrik)</span>${ic('chevR', 16)}</div><div class="lrow"><span class="sp">Getaran</span><span class="tgl ${S.set.vib ? 'on' : ''}" data-act="set" data-k="vib"></span></div></div>
  <div class="sect">NOTIFIKASI</div><div class="card" style="padding:4px 16px"><div class="lrow"><span class="sp">Notifikasi kualitas udara</span><span class="tgl ${S.set.nAir ? 'on' : ''}" data-act="set" data-k="nAir"></span></div><div class="lrow"><span class="sp">Notifikasi rekomendasi</span><span class="tgl ${S.set.nRec ? 'on' : ''}" data-act="set" data-k="nRec"></span></div><div class="lrow"><span class="sp">Waktu tenang</span><span class="small muted">22.00 – 06.00</span>${ic('chevR', 16)}</div></div>
  <button class="btn red mt" style="margin-top:22px" data-act="logout">Keluar ${ic('logout', 18)}</button><div class="center xs muted" style="margin-top:12px">Versi 1.0.0 · Keluar akan mengulang demo dari awal</div>`)
});
R.member1 = () => {
  T.cat = T.cat || 'anak';
  return {
    html: scr(`${hdr('Tambah Anggota')}<b style="font-size:15.5px">Pilih kategori anggota keluarga</b>
    <div class="note-box nb-blue mt" style="margin-top:12px;color:var(--ink2)"><span style="color:var(--blue)">${ic('info', 16)}</span><span>Kategori menentukan ambang batas notifikasi ISPU sesuai tingkat kerentanan anggota keluarga.</span></div>
    <div class="mt">${CATS.map(c => `<div class="locc ${T.cat === c.id ? 'on' : ''}" style="${T.cat === c.id ? 'background:#F2F6FF' : ''};padding:12px 14px;margin-bottom:10px" data-act="cat" data-v="${c.id}"><span class="sq" style="background:${c.bg};color:${c.fg}">${ic(c.ic, 20)}</span><div class="sp"><div class="nm">${c.t}</div><div class="ds">${c.d}</div></div><span class="pill p-${c.c}">${c.tag}</span></div>`).join('')}</div>
    <div style="height:80px"></div><div class="cta"><button class="btn" data-go="member2">Lanjutkan ${ic('next', 18)}</button></div>`)
  };
};
R.member2 = () => {
  const c = CATS.find(x => x.id === T.cat) || CATS[0];
  const def = { anak: ['Sari', 9], dewasa: ['Andi', 34], lansia: ['Budi', 65], ispa: ['Rina', 30], hamil: ['Maya', 29] }[c.id];
  return {
    html: scr(`${hdr('Tambah Anggota', 'Kategori: ' + c.t.split(' /')[0])}
    <div style="width:92px;height:92px;border-radius:50%;background:${c.bg};color:${c.fg};display:grid;place-items:center;margin:0 auto">${ic(c.ic, 40, 1.8)}</div>
    ${field('Nama', 'user', def[0], 'id="mName"')}${field('Usia', 'cal', def[1], 'id="mAge" inputmode="numeric"', 'text', '<span class="muted">tahun</span>')}
    <div class="lbl">Catatan tambahan <span class="muted" style="font-weight:400">(opsional)</span></div><textarea class="ta" id="mNote">${c.id === 'lansia' ? 'Pernah sesak kalau banyak debu, kontrol rutin tiap bulan.' : ''}</textarea>
    <div class="tip mt" style="background:${c.th === 50 ? '#FFF5DB' : '#E4F7F1'}"><img src="${M('sleepy')}" alt=""><span id="mInfo">${memInfo(c, def[0])}</span></div>
    <div style="height:90px"></div><div class="cta"><button class="btn" data-act="saveMember">Simpan anggota ${ic('check', 18)}</button></div>`),
    after() { $('#mName').addEventListener('input', e => $('#mInfo').innerHTML = memInfo(c, e.target.value || 'Anggota')); }
  };
};
const memInfo = (c, n) => c.th === 50 ? `Karena kategori <b>${c.tag.toLowerCase()}</b>, ${n} akan dapat peringatan lebih awal: saat ISPU di atas <b style="color:#B7791F">50 (Sedang)</b>, bukan 100 seperti umumnya.` : `${n} akan mendapat peringatan standar saat ISPU di atas <b>100 (Tidak Sehat)</b>.`;
R.memberok = () => {
  const f = S.fam[S.fam.length - 1], c = CATS.find(x => x.id === f.cat);
  return {
    html: scr(`${stage('joy')}<div class="succ center"><h1>Anggota berhasil ditambahkan</h1><p>Informasi anggota keluarga digunakan untuk rekomendasi dan notifikasi.</p></div>
    <div class="card row mt" style="margin:18px 6px 0"><span class="fam av" style="width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-weight:700;background:${c.bg};color:${c.fg}">${initial(f.n)}</span><div class="sp"><div class="b">${f.n}</div><div class="xs muted">${f.age} tahun · ${c.t.split(' /')[0]}</div></div><span class="pill p-${c.c}">${c.tag}</span></div>
    <div class="cta"><button class="btn" data-go="profile">Lanjutkan</button></div>`, 'fade')
  };
};
R.help = () => {
  const faq = [['Apa bedanya ISPU dan AQI?', 'ISPU adalah indeks resmi Indonesia (KLHK). Rentang dan kategorinya mirip AQI, tapi memakai baku mutu nasional.'], ['Bagaimana XP Air Quest dihitung?', 'XP diberikan otomatis sekali per aktivitas: cek udara, jelajah peta, rute aman selesai, dan laporan tervalidasi.'], ['Kenapa laporanku tidak lolos?', 'Biasanya karena foto buram, objek tidak terlihat jelas, atau lokasi tidak cocok dengan GPS. Coba ambil ulang lebih dekat dengan cahaya cukup.'], ['Bagaimana Mode Rentan bekerja?', 'Saat aktif, ambang peringatan tiap anggota keluarga disesuaikan kategorinya, misalnya lansia dan anak diingatkan sejak ISPU 50.']];
  return {
    html: scr(`${hdr('Bantuan & tentang')}
    <div class="aqi row" style="cursor:default;gap:14px;padding:16px"><img src="${M('laptop')}" style="width:86px" alt=""><div><div class="brand" style="font-size:21px"><img src="${LOGO}" alt="">respira</div><div class="small" style="color:#c3d1ea;margin-top:4px">Tahu lebih awal, jaga lebih cepat.<br>Versi 1.0 · 2026</div></div></div>
    <div class="card mt"><b class="mf" style="font-size:16px">Sumber data</b>${[['radio', 'SPKU Kota Bekasi', '24 stasiun · diperbarui tiap jam'], ['db', 'ISPU KLHK', 'Standar indeks pencemar udara'], ['users', 'Laporan warga Lens', 'Tervalidasi AI + sensor terdekat']].map(([i, a, b]) => `<div class="lrow"><span class="sq">${ic(i, 18)}</span><div><div class="b">${a}</div><div class="xs muted">${b}</div></div></div>`).join('')}</div>
    <div class="card"><b class="mf" style="font-size:16px">Pertanyaan umum</b><div style="margin-top:6px">${faq.map(([q, a], i) => `<div class="acc ${i < 2 ? 'open' : ''}"><h4 data-act="acc">${q}${ic('chevD', 18)}</h4><p>${a}</p></div>`).join('')}</div></div>
    <a class="btn ghost mt" style="text-decoration:none;margin-top:14px" href="mailto:halo@respira.id">Hubungi tim Respira ${ic('mail', 18)}</a>`)
  };
};

/* ---------- Quest ---------- */
R.quest = () => {
  T.qt = T.qt || 'h';
  const p = S.xp / lvMax();
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  const weekly = [['flame', 'Cek udara 5 hari beruntun', S.streak, 5, 100], ['route', 'Selesaikan 3 rute aman', Math.min(S.m.route === 2 ? 2 : 1, 3), 3, 60], ['camera', 'Kirim 3 laporan tervalidasi', S.m.report === 2 ? 2 : 1, 3, 80], ['users', 'Ajak keluarga cek udara', S.fam.length >= 4 ? 1 : 0, 1, 40]];
  return {
    html: scr(`${hdr('Air Quest', 'Misi, level &amp; lencana')}
    <div class="qhero"><span class="lvtag"><i>${S.level}</i>${LV[S.level]}</span><div class="big" style="margin-top:8px">${S.xp} <span style="font-size:16px;color:#a9badb;font-weight:600">XP</span></div><img src="${M('laugh')}" class="float" style="position:absolute;right:12px;top:18px;width:96px" alt="">
    <div class="bar dk" style="margin-top:10px"><i style="width:${p * 100}%"></i></div><div class="row xs" style="margin-top:8px;color:#c3d1ea"><span class="sp">Level ${S.level} · ${lvMax()} XP</span><span>${Math.max(lvMax() - S.xp, 0)} XP lagi → ${LV[S.level + 1] || '-'}</span></div></div>
    <div class="card mt"><div class="row"><b class="mf sp" style="font-size:16px">Streak harian</b><span class="small b" style="color:#E4572E">${S.streak} hari · rekor 9 hari</span></div>
    <div class="flames">${days.map((d, i) => `<div class="${i < S.streak ? 'on' : i === S.streak ? 'nx' : ''}"><span>${ic('flame', 16)}</span>${d}</div>`).join('')}</div>
    <div class="note-box nb-red" style="margin-top:12px"><span>Buka Respira besok untuk mencapai streak ${S.streak + 1} hari dan dapatkan <b>+100 XP</b>.</span></div></div>
    <div class="seg mt">${[['h', 'Harian'], ['m', 'Mingguan']].map(([k, l]) => `<button class="${T.qt === k ? 'on' : ''}" data-act="qt" data-k="${k}">${l}</button>`).join('')}</div>
    <div class="card mt">${T.qt === 'h' ? `<div class="row"><b class="mf sp" style="font-size:16px">Misi harian</b><span class="xs muted">Reset dalam 13 j 58 m</span></div>${missionList()}` :
        `<div class="row"><b class="mf sp" style="font-size:16px">Misi mingguan</b><span class="xs muted">Reset Senin 00.00</span></div>${weekly.map(([i, t, a, b, x]) => `<div class="mis ${a >= b ? 'done' : ''}"><span class="mi">${ic(i, 18)}</span><div class="sp"><div class="row" style="gap:0"><span class="nm sp">${t}</span><span class="cnt">${a}/${b}</span></div><div class="bar"><i style="width:${a / b * 100}%"></i></div></div><span class="claim ${a >= b ? 'ok' : 'todo'}">+${x} XP</span></div>`).join('')}`}</div>
    <div class="card" data-go="progress" style="cursor:pointer"><div class="row"><b class="mf sp" style="font-size:16px">Lencana</b><span class="lnk">${nBadges()} dari 6 ›</span></div><div class="row" style="margin-top:10px;justify-content:space-between">${BADGES.map(b => badgeSVG(b.ic, b.col, 42, !S.badges[b.id])).join('')}</div></div>`)
  };
};
R.progress = () => {
  const u = S.user, max = Math.max(...S.weekXp, 1);
  return {
    html: scr(`${hdr('Progres kamu')}
    <div class="card"><div class="row"><span class="avatar" style="width:56px;height:56px;font-size:22px">${initial(u.name)}</span><div class="sp"><div class="mf bb" style="font-size:18px">${u.name}</div><span class="lvtag light" style="margin-top:4px;width:100%"><i style="color:#fff">${S.level}</i>${LV[S.level]}</span></div></div>
    <div class="stat3" style="margin-top:12px">${[[S.xp, 'Total XP'], [S.streak + ' hari', 'Streak'], [nBadges() + '/6', 'Lencana']].map(([a, b]) => `<div style="background:#F3F7FC;box-shadow:none"><b style="font-size:19px">${a}</b><small>${b}</small></div>`).join('')}</div>
    <div class="row small" style="margin-top:14px"><span class="sp">Level ${S.level} → Level ${S.level + 1}</span><b>${S.xp}</b><span class="muted">/ ${lvMax()} XP</span></div><div class="bar" style="margin-top:6px"><i style="width:${S.xp / lvMax() * 100}%"></i></div></div>
    <div class="card"><div class="row"><b class="mf sp" style="font-size:16px">Koleksi lencana</b><span class="small muted">${nBadges()} dari 6 terbuka</span></div>
    <div class="bgrid" style="margin-top:12px">${BADGES.map(b => { const g = S.badges[b.id]; const sub = g ? g : b.id === 'route' ? `${Math.min(S.routes, 5)} / 5 rute` : b.id === 'guard' ? `${Math.min(validated(), 10)} / 10 laporan` : b.id === 'eco' ? `${validated()} / 5 laporan` : b.id === 'champ' ? 'Level 4' : b.how; return `<div class="bg ${g ? b.col : 'lock'}" data-act="badge" data-id="${b.id}">${badgeSVG(b.ic, b.col, 54, !g)}<b>${b.t}</b><small>${sub}</small></div>`; }).join('')}</div></div>
    <div class="card"><div class="row"><b class="mf sp" style="font-size:16px">XP minggu ini</b><b style="color:#0F766E">+${S.weekXp.reduce((a, b) => a + b, 0)}</b></div>
    <div class="wbars">${S.weekXp.map((x, i) => `<div class="${i === 6 ? 't' : ''}"><i style="height:${Math.max(x / max * 64, 6)}px"></i>${['S', 'S', 'R', 'K', 'J', 'S', 'M'][i]}</div>`).join('')}</div></div>`)
  };
};

/* ================= ACTIONS ================= */
const A = {
  peek(el) { const i = $('#' + el.dataset.t); i.type = i.type === 'password' ? 'text' : 'password'; el.innerHTML = ic(i.type === 'password' ? 'eye' : 'eyeOff'); },
  agree(el) { el.classList.toggle('on'); },
  reg1() {
    if (!$('.chk').classList.contains('on')) return toast('Setujui syarat dan ketentuan dulu', '', null, 'info');
    if ($('#pw1').value !== $('#pw2').value) return toast('Konfirmasi kata sandi belum cocok', '', null, 'lock');
    S.user.name = $('#rName').value.trim() || 'Daffa Pratama'; S.user.email = $('#rMail').value.trim() || 'daffa@gmail.com'; S.user.phone = $('#rPhone').value; save(); go('reg2');
  },
  reg2() { S.user.age = +$('#rAge').value; S.user.loc = $('#rLoc').value.split(',')[0]; S.user.sex = $('[data-seg=sex] .on').dataset.v; save(); go('reg3'); },
  health(el) { S.user.health = el.dataset.v === '1'; $$('[data-act=health]').forEach(o => o.classList.toggle('on', o === el)); $('#noteWrap').style.display = S.user.health ? '' : 'none'; },
  reg3() { if ($('#rNote')) S.user.note = $('#rNote').value; S.onboarded = 1; save(); go('created'); },
  login() { S.onboarded = 1; save(); go('home'); },
  forgot() { $('#fNote').className = 'note-box nb-mint'; $('#fNote').innerHTML = ic('check', 16) + `<span>Tautan reset terkirim ke <b>${$('#fMail').value}</b>. Cek inbox kamu.</span>`; $('#fBtn').innerHTML = 'Kirim ulang tautan'; },
  start() { go('home'); },
  claim(el) {
    const k = el.dataset.k;
    if (k === 'explore' && S.m.explore === 1) {
      S.m.explore = 2; gain(15); save();
      T.rw = { xp: 15, m: 'confused', title: 'Misi jelajah selesai!', desc: 'Kamu mengecek kualitas udara di 5 titik sekitar Bekasi Selatan lewat peta.', rows: [['map', 'Titik dicek', '5 SPKU'], ['leaf', 'Udara terbaik', 'Bekasi Barat · 52'], ['check', 'Misi harian', `${doneCount()} / 4 selesai`]], cta: ['Kembali ke Home', 'home'], link: ['Lihat semua misi', 'quest'] };
      go('reward');
    }
  },
  rk(el) { T.rk = +el.dataset.k; refresh(); },
  remind() { S.reminder = !S.reminder; save(); refresh(); if (S.reminder) toast('Notifikasi berhasil ditetapkan', 'Kami ingatkan besok jam 06.00', null, 'bell'); },
  alertTim() { S.loc = 'tim'; save(); go('home'); },
  setloc(el) { S.loc = el.dataset.id; save(); toast('Lokasi diganti ke ' + LOCS[S.loc].name, '', null, 'pin', 1800); go('home'); },
  tglSaved(el) { const l = S.saved[+el.dataset.i]; l.alert = !l.alert; save(); el.classList.toggle('on', l.alert); if (l.alert) toast('Peringatan aktif untuk ' + l.label, '', null, 'bell', 1800); },
  alClear() { $('#alQ').value = ''; $('#alQ').focus(); },
  alType(el) { T.al.type = el.dataset.v; refresh(); },
  alAlert() { T.al.alert = !T.al.alert; refresh(); },
  alTh(el) { T.al.th = +el.dataset.v; refresh(); },
  alSave() {
    const a = T.al; const ico = { Rumah: 'home', Kantor: 'building', Sekolah: 'school', Keluarga: 'family' }[a.type];
    S.saved.push({ id: 'n' + Date.now(), label: a.name || a.type, addr: a.addr, ispu: a.ispu, icon: ico, alert: a.alert, th: a.th });
    const id = 'n' + S.saved.length; LOCS[id] = { ...LOCS.utara, name: a.name || a.type, sub: a.addr, ispu: a.ispu, icon: ico, near: 0 };
    S.extra = S.extra || []; S.extra.push([id, LOCS[id]]);
    T.al = null; save(); go('locsaved');
  },
  mf(el) { T.mf = el.dataset.v; refresh(); },
  pin(el) {
    const id = el.dataset.id;
    if (S.m.explore === 0 && PINS.some(p => p.id === id) && !S.explored.includes(id)) { S.explored.push(id); if (S.explored.length >= 5) S.m.explore = 1; save(); refresh(); }
    if (cur === 'map' && $('.mapin')) pinTip(id);
  },
  pinDetail(el) { $$('.ptip').forEach(e => e.remove()); S.loc = el.dataset.id; save(); go('aqi'); },
  repPin(el) { toast(el.dataset.t, 'Laporan warga · tervalidasi AI', null, 'flame', 2200); },
  mapLoc() { const m = $('.me'); if (m) { m.animate([{ boxShadow: '0 0 0 0 rgba(47,107,255,.5)' }, { boxShadow: '0 0 0 30px rgba(47,107,255,0)' }], { duration: 900, iterations: 2 }); } },
  dqClear() { T.dq = ''; T.dest = null; $('#dq').value = ''; $('#dres').innerHTML = destRes(''); $('#dBtn').disabled = true; $('#dq').focus(); },
  pickDest(el) { T.dest = el.dataset.v; $$('[data-act=pickDest]').forEach(x => x.classList.toggle('on', x === el)); $('#dBtn').disabled = false; },
  findRoute() { T.sel = null; go('route'); },
  swap() { T.swap = !T.swap; refresh(); },
  mode(el) { T.mode = +el.dataset.k; refresh(); },
  pref(el) { T.pref = el.dataset.k; T.sel = null; refresh(); },
  selRoute(el) { T.sel = el.dataset.k; refresh(); },
  mute(el) { el.classList.toggle('on'); el.innerHTML = ic(el.classList.contains('on') ? 'x' : 'vol', 18); },
  endNav() { finishTrip(); },
  rwGo(el) {
    let to = el.dataset.to;
    if (T.levelUp) { T.after = to; return go('levelup', true); }
    if (to === 'mapReports') { T.mf = 'Laporan warga'; to = 'map'; }
    go(to);
  },
  lvDone() { T.levelUp = null; let to = T.after || 'home'; T.after = null; if (to === 'mapReports') { T.mf = 'Laporan warga'; to = 'map'; } go(to); },
  flash(el) { el.classList.toggle('on'); },
  retake() { go('lens'); },
  sendReport() {
    if (!S.reports.some(r => r.mine)) S.reports.unshift({ t: 'Pembakaran sampah', p: 'Bekasi Timur · Hari ini 10.43', s: 'wait', mine: 1, pos: 'center 40%' });
    S.newReport = 1; save(); go('thanks');
    clearTimeout(window.__vt);
    window.__vt = setTimeout(() => { if (S.reports.some(r => r.mine && r.s === 'wait') && !['verify', 'nav', 'reward', 'levelup'].includes(cur)) toast('Laporanmu tervalidasi! +50 XP', 'Ketuk untuk klaim', validateReport, 'check', 6000); }, 9000);
  },
  viewReports() { T.mf = 'Laporan warga'; go('map'); },
  hf(el) { T.hf = el.dataset.k; refresh(); },
  validate() { validateReport(); },
  badge(el) { badgeModal(el.dataset.id, false); },
  toProg() { closeModal(); go('progress'); },
  closeModal() { closeModal(); },
  rentan() { S.rentan = !S.rentan; save(); refresh(); toast(S.rentan ? 'Mode kelompok rentan aktif' : 'Mode kelompok rentan nonaktif', S.rentan ? 'Ambang peringatan disesuaikan per anggota' : '', null, 'heart', 2000); },
  addMember() { T.cat = 'anak'; go('member1'); },
  cat(el) { T.cat = el.dataset.v; $$('[data-act=cat]').forEach(x => { const on = x === el; x.classList.toggle('on', on); x.style.background = on ? '#F2F6FF' : ''; }); },
  saveMember() { const n = $('#mName').value.trim() || 'Anggota', a = parseInt($('#mAge').value) || 0; S.fam.push({ n, age: a, cat: T.cat }); save(); go('memberok'); },
  saveProf() { S.user.name = $('#eName').value.trim() || S.user.name; S.user.uname = $('#eUser').value; S.user.email = $('#eMail').value; S.user.loc = $('#eLoc').value; save(); go('saved2'); },
  set(el) { const k = el.dataset.k; S.set[k] = !S.set[k]; save(); el.classList.toggle('on', S.set[k]); },
  lang() { S.set.lang = S.set.lang === 'Bahasa Indonesia' ? 'English' : 'Bahasa Indonesia'; save(); refresh(); },
  logout() { try { localStorage.removeItem('respira2'); } catch (e) { } S = FRESH(); Object.keys(T).forEach(k => delete T[k]); go('splash'); },
  acc(el) { el.parentElement.classList.toggle('open'); },
  qt(el) { T.qt = el.dataset.k; refresh(); },
};

document.addEventListener('click', e => {
  const seg = e.target.closest('[data-seg] button');
  if (seg) { $$('button', seg.parentElement).forEach(b => b.classList.toggle('on', b === seg)); return; }
  const a = e.target.closest('[data-act]');
  if (a && A[a.dataset.act]) { e.stopPropagation(); return A[a.dataset.act](a); }
  const g = e.target.closest('[data-go]');
  if (g) { closeModal(); return go(g.dataset.go); }
  if (e.target.closest('[data-back]')) return back();
});

/* lokasi tambahan yang disimpan pengguna */
(S.extra || []).forEach(([id, L]) => LOCS[id] = L);

/* ================= START ================= */
(function init() {
  let start = (location.hash || '').slice(1);
  if (!R[start] || ['reward', 'levelup', 'verify', 'vok', 'vfail', 'nav'].includes(start)) start = S.onboarded ? 'home' : 'splash';
  history.replaceState({ n: start }, '', '#' + start);
  render(start);
})();
