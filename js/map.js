// Peta vektor sederhana kota (gaya peta desain Respira)
const MAP_V = [40, 128, 262, 350];          // jalan vertikal
const MAP_H = [140, 300, 440, 600, 760];    // jalan horizontal
const GREEN = new Set(['1-1', '2-3', '0-2', '3-4', '1-4']);

function mapBase(W = 390, H = 900, opt = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#eef1f5"/>`;
  const xs = [-20, ...MAP_V, W + 20], ys = [-20, ...MAP_H, H + 20];
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const x0 = xs[i] + 12, x1 = xs[i + 1] - 12, y0 = ys[j] + 12, y1 = ys[j + 1] - 12;
    if (x1 - x0 < 10 || y1 - y0 < 10) continue;
    const g = GREEN.has(i + '-' + j);
    // bagi blok jadi 2 agar terlihat seperti kavling
    if (!g && (x1 - x0) > 90) {
      const m = (x0 + x1) / 2;
      s += `<rect x="${x0}" y="${y0}" width="${m - x0 - 5}" height="${y1 - y0}" rx="5" fill="#e0e5ec"/>`;
      s += `<rect x="${m + 5}" y="${y0}" width="${x1 - m - 5}" height="${(y1 - y0) * .55}" rx="5" fill="#e0e5ec"/>`;
      s += `<rect x="${m + 5}" y="${y0 + (y1 - y0) * .55 + 8}" width="${x1 - m - 5}" height="${(y1 - y0) * .45 - 8}" rx="5" fill="#e3e8ee"/>`;
    } else s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="6" fill="${g ? '#d6ecdc' : '#e0e5ec'}"/>`;
  }
  // sungai
  s += `<path d="M-10 545 C 80 520, 150 470, 230 470 S 340 420, 410 395" stroke="#d3e6f6" stroke-width="18" fill="none"/>`;
  MAP_V.forEach(x => s += `<rect x="${x - 7}" y="0" width="14" height="${H}" fill="#fff"/>`);
  MAP_H.forEach(y => s += `<rect x="0" y="${y - 8}" width="${W}" height="16" fill="#fff"/>`);
  const t = 'font-family="Inter,sans-serif" font-size="7.5" fill="#9aa6b5" letter-spacing=".6"';
  s += `<text x="300" y="${MAP_H[0] - 12}" ${t}>JL. A. YANI</text>`;
  s += `<text ${t} transform="translate(${MAP_V[1] + 3} 60) rotate(90)">JL. JUANDA</text>`;
  s += `<text ${t} transform="translate(${MAP_V[2] + 3} 470) rotate(90)">JL. PRAMUKA</text>`;
  s += `<text x="300" y="418" ${t}>KALI BEKASI</text>`;
  s += `<text x="10" y="${MAP_H[3] - 12}" ${t}>JL. CUT MUTIAH</text>`;
  if (opt.heat) {
    s += `<defs>${opt.heat.map((h, k) => `<radialGradient id="hg${k}"><stop offset="0" stop-color="${h.c}" stop-opacity="${h.o || .45}"/><stop offset="1" stop-color="${h.c}" stop-opacity="0"/></radialGradient>`).join('')}</defs>`;
    s += opt.heat.map((h, k) => `<circle cx="${h.x}" cy="${h.y}" r="${h.r}" fill="url(#hg${k})"/>`).join('');
  }
  return s;
}

function mapSVG(opt = {}) {
  const W = 390, H = opt.H || 900, vb = opt.vb || `0 0 ${W} ${H}`;
  let s = mapBase(W, H, opt);
  (opt.routes || []).forEach(r => {
    s += `<path ${r.id ? `id="${r.id}"` : ''} d="${r.d}" fill="none" stroke="${r.c}" stroke-width="${r.w || 6}" stroke-linecap="round" stroke-linejoin="round" ${r.dash ? `stroke-dasharray="${r.dash}"` : ''} opacity="${r.o || 1}"/>`;
  });
  s += opt.extra || '';
  return `<svg class="mapsvg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

// Jalur rute (koordinat peta 390x900)
const ROUTE_PATHS = {
  bersih: 'M170 860 C 175 760, 150 700, 158 640 C 170 560, 240 520, 262 470 C 285 410, 262 330, 262 300 C 262 230, 300 180, 340 140 L 360 100',
  cepat: 'M170 860 L 170 760 C 170 700, 200 640, 262 600 C 300 575, 350 520, 350 440 L 350 140 L 360 100',
  pendek: 'M170 860 C 190 780, 230 720, 262 680 C 300 630, 320 560, 330 470 C 340 380, 345 250, 360 100',
};
// Rute navigasi (layar penuh)
const NAV_PATH = 'M195 590 C 180 545, 128 525, 128 470 C 128 420, 175 400, 200 385 C 250 355, 262 320, 262 270 C 262 210, 205 190, 175 140 L 175 -20';
