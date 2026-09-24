// Paints a garment (silhouette, seams, rib, print) onto a canvas.
// Everything is drawn in a 1024×1024 design space; the transparent area
// outside the silhouette is cut away on the 3D plane with alphaTest.

const D = 1024;

const FONT_SANS = '"Montserrat Variable", "Montserrat", system-ui, sans-serif';
const FONT_SERIF = '"Cormorant", "Cormorant Garamond", Georgia, serif';

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

// f > 0 mixes toward white, f < 0 toward black.
function shade(hex, f, a = 1) {
  const target = f < 0 ? 0 : 255;
  const p = Math.abs(f);
  const [r, g, b] = rgb(hex).map((c) => Math.round(c + (target - c) * p));
  return `rgba(${r},${g},${b},${a})`;
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const mirrorX = (pts) => pts.map(([x, y]) => [D - x, y]);

function polygon(pts) {
  const p = new Path2D();
  pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
  p.closePath();
  return p;
}

// ---------------------------------------------------------------- silhouettes

function teeShape() {
  const p = new Path2D();
  p.moveTo(440, 70);
  p.quadraticCurveTo(512, 58, 584, 70);
  p.lineTo(792, 143);
  p.lineTo(932, 330);
  p.lineTo(846, 392);
  p.lineTo(800, 322);
  p.lineTo(806, 880);
  p.quadraticCurveTo(512, 900, 218, 880);
  p.lineTo(224, 322);
  p.lineTo(178, 392);
  p.lineTo(92, 330);
  p.lineTo(232, 143);
  p.closePath();
  return p;
}

function longBodyShape() {
  const p = new Path2D();
  p.moveTo(452, 78);
  p.quadraticCurveTo(512, 66, 572, 78);
  p.lineTo(790, 152);
  p.quadraticCurveTo(826, 172, 828, 236);
  p.lineTo(824, 884);
  p.quadraticCurveTo(512, 902, 200, 884);
  p.lineTo(196, 236);
  p.quadraticCurveTo(198, 172, 234, 152);
  p.closePath();
  return p;
}

function sleevePath(side) {
  const pts = [
    [234, 152],
    [176, 176],
    [154, 250],
    [96, 800],
    [100, 866],
    [218, 868],
    [220, 804],
    [252, 344],
    [258, 250],
  ];
  const p = polygon(side === 'right' ? mirrorX(pts) : pts);
  return p;
}

// Soft shadow stroke that also works where ctx.filter is unsupported (Safari):
// the path is drawn far off-canvas and only its blurred shadow lands on it.
// Shadow offset and blur ignore the transform, so they are scaled by hand.
function softStroke(ctx, path, width, color, blur) {
  const s = ctx.getTransform().a;
  ctx.save();
  ctx.translate(-4000, 0);
  ctx.shadowOffsetX = 4000 * s;
  ctx.shadowColor = color;
  ctx.shadowBlur = blur * s;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';
  ctx.stroke(path);
  ctx.restore();
}

function line(pts) {
  const p = new Path2D();
  pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
  return p;
}

function curve(x0, y0, cx, cy, x1, y1) {
  const p = new Path2D();
  p.moveTo(x0, y0);
  p.quadraticCurveTo(cx, cy, x1, y1);
  return p;
}

function stitch(ctx, path, color) {
  ctx.save();
  ctx.setLineDash([7, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke(path);
  ctx.restore();
}

function rib(ctx, clip, y0, y1, base) {
  ctx.save();
  ctx.clip(clip);
  ctx.fillStyle = shade(base, -0.12);
  ctx.fillRect(0, y0, D, y1 - y0);
  ctx.lineWidth = 2;
  for (let x = 0; x < D; x += 7) {
    ctx.strokeStyle = shade(base, -0.28, 0.55);
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x, y1);
    ctx.stroke();
  }
  ctx.strokeStyle = shade(base, -0.4, 0.8);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, y0);
  ctx.lineTo(D, y0);
  ctx.stroke();
  ctx.restore();
}

function spacedText(ctx, text, x, y, spacing) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
  let cx = x - total / 2;
  ctx.textAlign = 'left';
  [...text].forEach((ch, i) => {
    ctx.fillText(ch, cx, y);
    cx += widths[i] + spacing;
  });
  return total;
}

// Print with a darker offset copy underneath so it reads as raised ink.
function printText(ctx, g, text, x, y, font, spacing) {
  ctx.font = font;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = shade(g.base, -0.55, 0.9);
  spacedText(ctx, text, x, y + 2.5, spacing);
  ctx.fillStyle = g.print;
  return spacedText(ctx, text, x, y, spacing);
}

function fabricGrain(ctx, base) {
  const n = document.createElement('canvas');
  n.width = n.height = 128;
  const nc = n.getContext('2d');
  const img = nc.createImageData(128, 128);
  const light = luminance(base) > 0.3;
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = light ? 16 : 11;
  }
  nc.putImageData(img, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = ctx.createPattern(n, 'repeat');
  ctx.fillRect(0, 0, D, D);
  ctx.restore();
}

function lightingPass(ctx, base) {
  const light = luminance(base) > 0.3;
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  const v = ctx.createLinearGradient(0, 60, 0, 900);
  v.addColorStop(0, 'rgba(255,255,255,0.05)');
  v.addColorStop(0.55, 'rgba(0,0,0,0)');
  v.addColorStop(1, `rgba(0,0,0,${light ? 0.16 : 0.28})`);
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, D, D);
  const h = ctx.createLinearGradient(80, 0, 944, 0);
  h.addColorStop(0, 'rgba(0,0,0,0.22)');
  h.addColorStop(0.25, 'rgba(0,0,0,0)');
  h.addColorStop(0.75, 'rgba(0,0,0,0)');
  h.addColorStop(1, 'rgba(0,0,0,0.26)');
  ctx.fillStyle = h;
  ctx.fillRect(0, 0, D, D);
  // Drape folds falling from the shoulders.
  const fold = light ? 'rgba(60,45,30,0.16)' : 'rgba(0,0,0,0.38)';
  softStroke(ctx, curve(300, 330, 330, 620, 300, 880), 26, fold, 30);
  softStroke(ctx, curve(724, 330, 694, 620, 726, 880), 26, fold, 30);
  softStroke(ctx, curve(420, 520, 440, 720, 410, 890), 18, fold, 26);
  softStroke(ctx, curve(610, 560, 600, 730, 626, 890), 16, fold, 26);
  const hi = light ? 'rgba(255,255,255,0.35)' : 'rgba(255,240,220,0.07)';
  softStroke(ctx, curve(360, 400, 380, 640, 350, 880), 14, hi, 24);
  softStroke(ctx, curve(668, 420, 650, 650, 676, 880), 12, hi, 24);
  ctx.restore();
}

// ------------------------------------------------------------------ garments

function drawTee(ctx, g) {
  const body = teeShape();
  ctx.fillStyle = g.base;
  ctx.fill(body);

  // Inside of the back neck, seen through the collar opening.
  const inside = new Path2D();
  inside.moveTo(440, 70);
  inside.quadraticCurveTo(512, 58, 584, 70);
  inside.quadraticCurveTo(512, 150, 440, 70);
  ctx.fillStyle = shade(g.base, -0.55);
  ctx.fill(inside);
  // Woven neck label.
  ctx.fillStyle = shade(g.print, -0.1);
  ctx.fillRect(494, 76, 36, 20);
  ctx.fillStyle = shade(g.base, -0.4);
  ctx.font = `700 11px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  ctx.fillText('T', 512, 91);

  // Collar rib.
  const neck = curve(440, 70, 512, 150, 584, 70);
  ctx.lineCap = 'round';
  ctx.lineWidth = 16;
  ctx.strokeStyle = shade(g.base, -0.1);
  ctx.stroke(neck);
  ctx.lineWidth = 2;
  ctx.strokeStyle = shade(g.base, -0.45, 0.8);
  ctx.stroke(curve(446, 76, 512, 164, 578, 76));

  // Armhole seams and sleeve/hem stitching.
  ctx.lineWidth = 3;
  ctx.strokeStyle = shade(g.base, -0.4, 0.7);
  ctx.stroke(curve(232, 143, 262, 238, 224, 322));
  ctx.stroke(curve(792, 143, 762, 238, 800, 322));
  const st = shade(g.base, luminance(g.base) > 0.3 ? -0.3 : 0.18, 0.55);
  stitch(ctx, line([[103, 315], [189, 377]]), st);
  stitch(ctx, line([[921, 315], [835, 377]]), st);
  stitch(ctx, curve(222, 858, 512, 878, 802, 858), st);

  if (g.printStyle !== 'blank') {
    const w = printText(ctx, g, 'TEOCORS', 512, 316, `600 60px ${FONT_SANS}`, 15);
    ctx.fillStyle = g.print;
    ctx.fillRect(512 - w / 2, 340, w, 2);
    ctx.font = `500 15px ${FONT_SANS}`;
    ctx.fillStyle = g.print;
    spacedText(ctx, 'COLECCIÓN 01 — MMXXVI', 512, 372, 5);
  }
  return body;
}

function drawLong(ctx, g) {
  const body = longBodyShape();
  const left = sleevePath('left');
  const right = sleevePath('right');

  if (g.type === 'hoodie') {
    // Hood resting behind the neck.
    const hood = new Path2D();
    hood.moveTo(318, 160);
    hood.quadraticCurveTo(318, 14, 512, 8);
    hood.quadraticCurveTo(706, 14, 706, 160);
    hood.closePath();
    ctx.fillStyle = shade(g.base, -0.14);
    ctx.fill(hood);
  }

  ctx.fillStyle = g.base;
  ctx.fill(body);
  rib(ctx, body, 820, 900, g.base);

  if (g.type === 'hoodie') {
    // Kangaroo pocket.
    const pocket = polygon([[340, 600], [684, 600], [730, 818], [294, 818]]);
    ctx.fillStyle = shade(g.base, 0.03);
    ctx.fill(pocket);
    softStroke(ctx, pocket, 4, 'rgba(0,0,0,0.45)', 10);
    ctx.lineWidth = 7;
    ctx.strokeStyle = shade(g.base, -0.5, 0.9);
    ctx.stroke(line([[340, 600], [300, 790]]));
    ctx.stroke(line([[684, 600], [724, 790]]));
    stitch(ctx, line([[352, 612], [672, 612]]), shade(g.base, 0.2, 0.4));

    // Hood opening with lining.
    const opening = new Path2D();
    opening.moveTo(452, 78);
    opening.quadraticCurveTo(436, 184, 512, 252);
    opening.quadraticCurveTo(588, 184, 572, 78);
    opening.quadraticCurveTo(512, 66, 452, 78);
    ctx.fillStyle = shade(g.base, -0.6);
    ctx.fill(opening);
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.strokeStyle = shade(g.base, 0.05);
    ctx.stroke(curve(446, 84, 430, 190, 512, 262));
    ctx.stroke(curve(578, 84, 594, 190, 512, 262));
    ctx.lineWidth = 2;
    ctx.strokeStyle = shade(g.base, -0.45, 0.8);
    ctx.stroke(curve(440, 90, 420, 196, 500, 272));
    ctx.stroke(curve(584, 90, 604, 196, 524, 272));

    // Drawstrings with metal tips.
    ctx.lineCap = 'round';
    const cords = [curve(480, 214, 470, 330, 476, 438), curve(544, 214, 556, 330, 548, 438)];
    cords.forEach((c) => softStroke(ctx, c, 9, 'rgba(0,0,0,0.5)', 8));
    ctx.lineWidth = 9;
    ctx.strokeStyle = g.trim;
    cords.forEach((c) => ctx.stroke(c));
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#c9a45c';
    ctx.stroke(line([[476, 436], [477, 470]]));
    ctx.stroke(line([[548, 436], [547, 470]]));
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,240,200,0.55)';
    ctx.stroke(line([[473, 440], [474, 466]]));
    ctx.stroke(line([[545, 440], [544, 466]]));
  } else {
    // Crew neck: inside of the back neck plus a ribbed collar.
    const inside = new Path2D();
    inside.moveTo(452, 78);
    inside.quadraticCurveTo(512, 66, 572, 78);
    inside.quadraticCurveTo(512, 152, 452, 78);
    ctx.fillStyle = shade(g.base, -0.55);
    ctx.fill(inside);
    const neck = curve(452, 78, 512, 156, 572, 78);
    ctx.lineCap = 'round';
    ctx.lineWidth = 26;
    ctx.strokeStyle = shade(g.base, -0.1);
    ctx.stroke(neck);
    ctx.lineWidth = 2;
    ctx.strokeStyle = shade(g.base, -0.4, 0.8);
    ctx.stroke(curve(458, 90, 512, 176, 566, 90));
    ctx.stroke(curve(446, 70, 512, 140, 578, 70));
  }

  // Print.
  if (g.type === 'hoodie') {
    printText(ctx, g, 'TEOCORS', 512, 540, `600 46px ${FONT_SANS}`, 12);
    ctx.font = `500 13px ${FONT_SANS}`;
    ctx.fillStyle = g.print;
    spacedText(ctx, 'EST. MMXXVI', 512, 568, 5);
  } else {
    printText(ctx, g, 'TEOCORS', 512, 350, `600 94px ${FONT_SERIF}`, 6);
    ctx.font = `500 16px ${FONT_SANS}`;
    ctx.fillStyle = g.print;
    spacedText(ctx, '—  COLECCIÓN 01  —', 512, 394, 6);
  }

  // Sleeves hang over the body.
  [left, right].forEach((s) => {
    softStroke(ctx, s, 6, 'rgba(0,0,0,0.55)', 16);
    ctx.fillStyle = shade(g.base, -0.03);
    ctx.fill(s);
    rib(ctx, s, 806, 880, g.base);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = shade(g.base, -0.45, 0.7);
    ctx.stroke(s);
  });

  const union = new Path2D();
  union.addPath(body);
  union.addPath(left);
  union.addPath(right);
  return union;
}

/**
 * @param {object} g garment config: { type: 'tee'|'hoodie'|'crew', base, print, trim, printStyle }
 * @param {number} size canvas size in px (square)
 */
export function drawGarment(g, size = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.scale(size / D, size / D);
  g = { trim: '#e9e2d6', ...g };
  if (g.type === 'tee') drawTee(ctx, g);
  else drawLong(ctx, g);
  lightingPass(ctx, g.base);
  fabricGrain(ctx, g.base);
  return canvas;
}

export const DESIGN_SIZE = D;
