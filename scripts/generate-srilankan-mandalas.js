/**
 * Sri Lankan Heritage Mandala SVG Generator
 * Generates high-resolution mathematical vector SVG mandalas infused with traditional
 * Sri Lankan motifs: Sandakada Pahana (Moonstone), Nelum Mal (Lotus), Nil Manel (Water Lily),
 * Liya Wela (creepers), Kandyan filigree, and Sun & Moon (Ira-Handa).
 */

const fs = require('fs');
const path = require('path');

const publicArtworksDir = path.join(__dirname, '..', 'public', 'uploads', 'artworks');
const publicCategoriesDir = path.join(__dirname, '..', 'public', 'uploads', 'categories');
const publicProductsDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
const privateArtworksDir = path.join(__dirname, '..', 'storage', 'private', 'artworks');
const privateProductsDir = path.join(__dirname, '..', 'storage', 'private', 'products');

[publicArtworksDir, publicCategoriesDir, publicProductsDir, privateArtworksDir, privateProductsDir].forEach((d) => {
  fs.mkdirSync(d, { recursive: true });
});

// Helper for polar to Cartesian
function polarToCart(cx, cy, r, angleRad) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

// 1. Sandakada Pahana (Sri Lankan Moonstone Mandala)
function generateMoonstoneMandala() {
  const size = 800;
  const cx = 400;
  const cy = 400;
  const maxR = 360;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <defs>
    <radialGradient id="slGoldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFDF7" />
      <stop offset="70%" stop-color="#FAF4E6" />
      <stop offset="100%" stop-color="#F3E9D2" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#slGoldGlow)" />
  <!-- Outer concentric rings of Moonstone -->
  <circle cx="${cx}" cy="${cy}" r="${maxR}" fill="none" stroke="#72121E" stroke-width="4" />
  <circle cx="${cx}" cy="${cy}" r="${maxR - 8}" fill="none" stroke="#D4AF37" stroke-width="2" />
  <circle cx="${cx}" cy="${cy}" r="${maxR - 20}" fill="none" stroke="#72121E" stroke-width="2" stroke-dasharray="4,4" />
`;

  // Ring 1: Gini Dela (Flames of the Moonstone) - 36 flames
  const flameCount = 36;
  const flameR1 = maxR - 22;
  const flameR2 = maxR - 48;
  for (let i = 0; i < flameCount; i++) {
    const a1 = (i * 2 * Math.PI) / flameCount;
    const a2 = ((i + 1) * 2 * Math.PI) / flameCount;
    const aMid = a1 + (a2 - a1) / 2;
    const p1 = polarToCart(cx, cy, flameR1, a1);
    const pTip = polarToCart(cx, cy, flameR2, aMid);
    const p2 = polarToCart(cx, cy, flameR1, a2);
    const ctrl1 = polarToCart(cx, cy, flameR1 - 10, a1 + 0.02);
    const ctrl2 = polarToCart(cx, cy, flameR1 - 10, a2 - 0.02);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${ctrl1.x.toFixed(1)} ${ctrl1.y.toFixed(1)} ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} Q ${ctrl2.x.toFixed(1)} ${ctrl2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#D4AF37" fill-opacity="0.25" stroke="#72121E" stroke-width="1.5" />\n`;
  }

  // Intermediate ring
  svg += `  <circle cx="${cx}" cy="${cy}" r="${flameR2 - 6}" fill="none" stroke="#72121E" stroke-width="2.5" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="${flameR2 - 14}" fill="none" stroke="#D4AF37" stroke-width="1.5" />\n`;

  // Ring 2: Hansa Wandana (Sacred Swans / Sacred Geese with foliage in beaks) - 16 swans
  const swanCount = 16;
  const swanR = flameR2 - 40;
  for (let i = 0; i < swanCount; i++) {
    const a = (i * 2 * Math.PI) / swanCount;
    const pt = polarToCart(cx, cy, swanR, a);
    const rot = (a * 180) / Math.PI + 90;
    // Swan motif glyph
    svg += `  <g transform="translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${rot.toFixed(1)})">
      <!-- Body & Neck -->
      <path d="M -12,0 C -12,-8 -4,-12 4,-10 C 10,-8 14,-2 18,-6 C 20,-8 22,-8 24,-6 C 24,-2 20,2 14,4 C 6,7 -4,8 -12,0 Z" fill="#FAF6EF" stroke="#72121E" stroke-width="1.5" />
      <!-- Wing feathers -->
      <path d="M -8,-2 Q 0,-8 6,-3 Q 0,0 -8,-2" fill="none" stroke="#D4AF37" stroke-width="1.2" />
      <!-- Beak with lotus leaf bud -->
      <path d="M 24,-6 L 28,-7 L 24,-5 Z" fill="#D4AF37" stroke="#72121E" stroke-width="0.8" />
      <circle cx="27" cy="-7" r="1.5" fill="#72121E" />
    </g>\n`;
  }

  // Intermediate ring
  svg += `  <circle cx="${cx}" cy="${cy}" r="${swanR - 26}" fill="none" stroke="#72121E" stroke-width="2" />\n`;

  // Ring 3: Liya Wela (Traditional Floral Foliage Vine)
  const vineCount = 24;
  const vineR1 = swanR - 32;
  const vineR2 = vineR1 - 45;
  for (let i = 0; i < vineCount; i++) {
    const a1 = (i * 2 * Math.PI) / vineCount;
    const a2 = ((i + 1) * 2 * Math.PI) / vineCount;
    const aMid = a1 + (a2 - a1) / 2;
    const p1 = polarToCart(cx, cy, vineR1, a1);
    const p2 = polarToCart(cx, cy, vineR2, aMid);
    const p3 = polarToCart(cx, cy, vineR1, a2);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C ${p1.x.toFixed(1)} ${p2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p1.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} C ${p3.x.toFixed(1)} ${p2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p3.y.toFixed(1)}, ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}" fill="none" stroke="#D4AF37" stroke-width="2" />\n`;
    svg += `  <circle cx="${p2.x.toFixed(1)}" cy="${p2.y.toFixed(1)}" r="4.5" fill="#72121E" stroke="#D4AF37" stroke-width="1" />\n`;
  }

  // Intermediate ring
  svg += `  <circle cx="${cx}" cy="${cy}" r="${vineR2 - 12}" fill="none" stroke="#72121E" stroke-width="2.5" />\n`;

  // Ring 4: Central Sacred Nelum Mal (Lotus Rosette)
  const lotusR = vineR2 - 18;
  const lotusPetals = 16;
  for (let i = 0; i < lotusPetals; i++) {
    const a1 = (i * 2 * Math.PI) / lotusPetals;
    const a2 = ((i + 1) * 2 * Math.PI) / lotusPetals;
    const aMid = a1 + (a2 - a1) / 2;
    const pBase1 = polarToCart(cx, cy, 35, a1);
    const pBase2 = polarToCart(cx, cy, 35, a2);
    const pTip = polarToCart(cx, cy, lotusR, aMid);
    const ctrl1 = polarToCart(cx, cy, lotusR * 0.7, a1 + 0.08);
    const ctrl2 = polarToCart(cx, cy, lotusR * 0.7, a2 - 0.08);
    svg += `  <path d="M ${pBase1.x.toFixed(1)} ${pBase1.y.toFixed(1)} Q ${ctrl1.x.toFixed(1)} ${ctrl1.y.toFixed(1)} ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} Q ${ctrl2.x.toFixed(1)} ${ctrl2.y.toFixed(1)} ${pBase2.x.toFixed(1)} ${pBase2.y.toFixed(1)} Z" fill="#FAF4E6" stroke="#72121E" stroke-width="2" />\n`;
    // Central vein
    const pMidVein = polarToCart(cx, cy, 35, aMid);
    svg += `  <line x1="${pMidVein.x.toFixed(1)}" y1="${pMidVein.y.toFixed(1)}" x2="${pTip.x.toFixed(1)}" y2="${pTip.y.toFixed(1)}" stroke="#D4AF37" stroke-width="1.2" />\n`;
  }

  // Inner lotus ring (layer 2)
  const innerPetals = 8;
  for (let i = 0; i < innerPetals; i++) {
    const a1 = (i * 2 * Math.PI) / innerPetals + Math.PI / innerPetals;
    const a2 = ((i + 1) * 2 * Math.PI) / innerPetals + Math.PI / innerPetals;
    const aMid = a1 + (a2 - a1) / 2;
    const pBase1 = polarToCart(cx, cy, 25, a1);
    const pBase2 = polarToCart(cx, cy, 25, a2);
    const pTip = polarToCart(cx, cy, lotusR * 0.55, aMid);
    svg += `  <path d="M ${pBase1.x.toFixed(1)} ${pBase1.y.toFixed(1)} Q ${cx} ${cy} ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} Q ${cx} ${cy} ${pBase2.x.toFixed(1)} ${pBase2.y.toFixed(1)} Z" fill="#D4AF37" fill-opacity="0.3" stroke="#72121E" stroke-width="1.5" />\n`;
  }

  // Center seed pod (Karnikava)
  svg += `  <circle cx="${cx}" cy="${cy}" r="32" fill="#FAF6EF" stroke="#72121E" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="26" fill="#D4AF37" stroke="#72121E" stroke-width="1.5" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="12" fill="#72121E" />\n`;
  // Seed dots
  for (let s = 0; s < 8; s++) {
    const sPt = polarToCart(cx, cy, 19, (s * 2 * Math.PI) / 8);
    svg += `  <circle cx="${sPt.x.toFixed(1)}" cy="${sPt.y.toFixed(1)}" r="2.2" fill="#FAF6EF" />\n`;
  }

  svg += `</svg>`;
  return svg;
}

// 2. Sacred Nelum Mal (Anuradhapura 16-Petal Lotus Rosette)
function generateSacredLotusMandala() {
  const size = 800;
  const cx = 400;
  const cy = 400;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#FAF7F2" />
  <circle cx="${cx}" cy="${cy}" r="370" fill="none" stroke="#D4AF37" stroke-width="2" />
  <circle cx="${cx}" cy="${cy}" r="360" fill="none" stroke="#72121E" stroke-width="3" />
  <circle cx="${cx}" cy="${cy}" r="350" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="6,4" />
`;

  // Outer floral border (32 petal tips)
  const outerTips = 32;
  for (let i = 0; i < outerTips; i++) {
    const aMid = (i * 2 * Math.PI) / outerTips;
    const a1 = aMid - Math.PI / outerTips;
    const a2 = aMid + Math.PI / outerTips;
    const p1 = polarToCart(cx, cy, 335, a1);
    const pTip = polarToCart(cx, cy, 358, aMid);
    const p2 = polarToCart(cx, cy, 335, a2);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}" fill="none" stroke="#72121E" stroke-width="1.5" />\n`;
  }

  // Layer 1 Petals (16 large outward petals)
  const petals1 = 16;
  for (let i = 0; i < petals1; i++) {
    const aMid = (i * 2 * Math.PI) / petals1;
    const a1 = aMid - (Math.PI / petals1) * 0.9;
    const a2 = aMid + (Math.PI / petals1) * 0.9;
    const p1 = polarToCart(cx, cy, 140, a1);
    const pTip = polarToCart(cx, cy, 325, aMid);
    const p2 = polarToCart(cx, cy, 140, a2);
    const ctrl1 = polarToCart(cx, cy, 270, aMid - 0.14);
    const ctrl2 = polarToCart(cx, cy, 270, aMid + 0.14);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} C ${ctrl1.x.toFixed(1)} ${ctrl1.y.toFixed(1)} ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} C ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} ${ctrl2.x.toFixed(1)} ${ctrl2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#FFFDF9" stroke="#72121E" stroke-width="2.5" />\n`;
    // Interior petal veins
    const pTipInner = polarToCart(cx, cy, 305, aMid);
    const pBaseInner = polarToCart(cx, cy, 160, aMid);
    svg += `  <line x1="${pBaseInner.x.toFixed(1)}" y1="${pBaseInner.y.toFixed(1)}" x2="${pTipInner.x.toFixed(1)}" y2="${pTipInner.y.toFixed(1)}" stroke="#D4AF37" stroke-width="1.5" />\n`;
    const v1 = polarToCart(cx, cy, 240, aMid - 0.06);
    const v2 = polarToCart(cx, cy, 240, aMid + 0.06);
    svg += `  <path d="M ${pBaseInner.x.toFixed(1)} ${pBaseInner.y.toFixed(1)} Q ${v1.x.toFixed(1)} ${v1.y.toFixed(1)} ${pTipInner.x.toFixed(1)} ${pTipInner.y.toFixed(1)}" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.8" />\n`;
    svg += `  <path d="M ${pBaseInner.x.toFixed(1)} ${pBaseInner.y.toFixed(1)} Q ${v2.x.toFixed(1)} ${v2.y.toFixed(1)} ${pTipInner.x.toFixed(1)} ${pTipInner.y.toFixed(1)}" fill="none" stroke="#D4AF37" stroke-width="1" stroke-opacity="0.8" />\n`;
  }

  // Layer 2 Petals (16 offset intermediate petals)
  for (let i = 0; i < petals1; i++) {
    const aMid = (i * 2 * Math.PI) / petals1 + Math.PI / petals1;
    const a1 = aMid - (Math.PI / petals1) * 0.8;
    const a2 = aMid + (Math.PI / petals1) * 0.8;
    const p1 = polarToCart(cx, cy, 100, a1);
    const pTip = polarToCart(cx, cy, 220, aMid);
    const p2 = polarToCart(cx, cy, 100, a2);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx} ${cy} ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} Q ${cx} ${cy} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#FDF6E2" stroke="#72121E" stroke-width="2" />\n`;
    svg += `  <circle cx="${pTip.x.toFixed(1)}" cy="${pTip.y.toFixed(1)}" r="4" fill="#D4AF37" stroke="#72121E" stroke-width="1" />\n`;
  }

  // Ring around core
  svg += `  <circle cx="${cx}" cy="${cy}" r="95" fill="none" stroke="#72121E" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="88" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="3,3" />\n`;

  // Layer 3 Petals (8 core petals)
  const corePetals = 8;
  for (let i = 0; i < corePetals; i++) {
    const aMid = (i * 2 * Math.PI) / corePetals;
    const pTip = polarToCart(cx, cy, 80, aMid);
    const p1 = polarToCart(cx, cy, 40, aMid - Math.PI / corePetals);
    const p2 = polarToCart(cx, cy, 40, aMid + Math.PI / corePetals);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#FAF0E6" stroke="#72121E" stroke-width="2" />\n`;
  }

  // Golden Central Pod
  svg += `  <circle cx="${cx}" cy="${cy}" r="40" fill="#D4AF37" stroke="#72121E" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="22" fill="#72121E" stroke="#D4AF37" stroke-width="2" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="8" fill="#FFFDF9" />\n`;

  svg += `</svg>`;
  return svg;
}

// 3. Royal Nil Manel (Sri Lanka National Water Lily)
function generateNilManelMandala() {
  const size = 800;
  const cx = 400;
  const cy = 400;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#F8FAFC" />
  <circle cx="${cx}" cy="${cy}" r="370" fill="none" stroke="#1E3A8A" stroke-width="3" />
  <circle cx="${cx}" cy="${cy}" r="360" fill="none" stroke="#D4AF37" stroke-width="2" />
  <circle cx="${cx}" cy="${cy}" r="348" fill="none" stroke="#1E3A8A" stroke-width="1.5" stroke-dasharray="4,6" />
`;

  // Concentric ripple water rings
  for (let r = 320; r >= 160; r -= 40) {
    svg += `  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#93C5FD" stroke-width="1.2" stroke-opacity="0.6" stroke-dasharray="10,8" />\n`;
  }

  // 12 Sharp Lanceolate Nil Manel Petals (Outer Tier)
  const folds = 12;
  for (let i = 0; i < folds; i++) {
    const aMid = (i * 2 * Math.PI) / folds;
    const a1 = aMid - (Math.PI / folds) * 0.7;
    const a2 = aMid + (Math.PI / folds) * 0.7;
    const p1 = polarToCart(cx, cy, 140, a1);
    const pTip = polarToCart(cx, cy, 340, aMid);
    const p2 = polarToCart(cx, cy, 140, a2);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#EFF6FF" stroke="#1E3A8A" stroke-width="2.5" />\n`;
    // Center spine
    const pSpine = polarToCart(cx, cy, 150, aMid);
    svg += `  <line x1="${pSpine.x.toFixed(1)}" y1="${pSpine.y.toFixed(1)}" x2="${pTip.x.toFixed(1)}" y2="${pTip.y.toFixed(1)}" stroke="#D4AF37" stroke-width="2" />\n`;
  }

  // 12 Staggered Intermediate Blue Petals
  for (let i = 0; i < folds; i++) {
    const aMid = (i * 2 * Math.PI) / folds + Math.PI / folds;
    const a1 = aMid - (Math.PI / folds) * 0.6;
    const a2 = aMid + (Math.PI / folds) * 0.6;
    const p1 = polarToCart(cx, cy, 100, a1);
    const pTip = polarToCart(cx, cy, 260, aMid);
    const p2 = polarToCart(cx, cy, 100, a2);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#DBEAFE" stroke="#1E3A8A" stroke-width="2" />\n`;
  }

  // Center Golden Stamens (Radiant Sunburst of Nil Manel)
  const stamenCount = 24;
  for (let i = 0; i < stamenCount; i++) {
    const a = (i * 2 * Math.PI) / stamenCount;
    const pBase = polarToCart(cx, cy, 45, a);
    const pTip = polarToCart(cx, cy, 95, a);
    svg += `  <line x1="${pBase.x.toFixed(1)}" y1="${pBase.y.toFixed(1)}" x2="${pTip.x.toFixed(1)}" y2="${pTip.y.toFixed(1)}" stroke="#D4AF37" stroke-width="3" />\n`;
    svg += `  <circle cx="${pTip.x.toFixed(1)}" cy="${pTip.y.toFixed(1)}" r="3" fill="#D4AF37" stroke="#B45309" stroke-width="1" />\n`;
  }

  // Core Pistil
  svg += `  <circle cx="${cx}" cy="${cy}" r="45" fill="#FEF3C7" stroke="#D4AF37" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="22" fill="#D4AF37" stroke="#1E3A8A" stroke-width="2" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="8" fill="#1E3A8A" />\n`;

  svg += `</svg>`;
  return svg;
}

// 4. Kandyan Liya Wela (Floral Creeper / Vine Filigree Mandala)
function generateKandyanLiyaWelaMandala() {
  const size = 800;
  const cx = 400;
  const cy = 400;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#FAF7F2" />
  <circle cx="${cx}" cy="${cy}" r="370" fill="none" stroke="#72121E" stroke-width="3.5" />
  <circle cx="${cx}" cy="${cy}" r="355" fill="none" stroke="#D4AF37" stroke-width="2" />
  <circle cx="${cx}" cy="${cy}" r="342" fill="none" stroke="#72121E" stroke-width="1.5" stroke-dasharray="4,4" />
`;

  // 12 Symmetrical Spiraling Liya Wela Tendrils
  const arms = 12;
  for (let i = 0; i < arms; i++) {
    const a = (i * 2 * Math.PI) / arms;
    const aNext = ((i + 1) * 2 * Math.PI) / arms;

    const p0 = polarToCart(cx, cy, 60, a);
    const p1 = polarToCart(cx, cy, 180, a + 0.25);
    const p2 = polarToCart(cx, cy, 280, a - 0.1);
    const pTip = polarToCart(cx, cy, 335, a + 0.15);

    svg += `  <path d="M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} C ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}, ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)}" fill="none" stroke="#72121E" stroke-width="3" />\n`;

    // Bud & Leaf curls along vine
    const leafPt1 = polarToCart(cx, cy, 210, a + 0.18);
    const leafPt2 = polarToCart(cx, cy, 290, a + 0.05);
    svg += `  <circle cx="${leafPt1.x.toFixed(1)}" cy="${leafPt1.y.toFixed(1)}" r="7" fill="#D4AF37" stroke="#72121E" stroke-width="1.5" />\n`;
    svg += `  <circle cx="${leafPt2.x.toFixed(1)}" cy="${leafPt2.y.toFixed(1)}" r="9" fill="#FAF0E6" stroke="#72121E" stroke-width="2" />\n`;
    svg += `  <circle cx="${leafPt2.x.toFixed(1)}" cy="${leafPt2.y.toFixed(1)}" r="4" fill="#D4AF37" />\n`;

    // Rosette blossom at vine tip
    svg += `  <circle cx="${pTip.x.toFixed(1)}" cy="${pTip.y.toFixed(1)}" r="12" fill="#FAF4E6" stroke="#72121E" stroke-width="2" />\n`;
    svg += `  <circle cx="${pTip.x.toFixed(1)}" cy="${pTip.y.toFixed(1)}" r="6" fill="#D4AF37" />\n`;
  }

  // Inner Kandyan Brass Plate Rosette (12 petals)
  for (let i = 0; i < arms; i++) {
    const aMid = (i * 2 * Math.PI) / arms;
    const pTip = polarToCart(cx, cy, 110, aMid);
    const p1 = polarToCart(cx, cy, 40, aMid - Math.PI / arms);
    const p2 = polarToCart(cx, cy, 40, aMid + Math.PI / arms);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#D4AF37" fill-opacity="0.3" stroke="#72121E" stroke-width="2" />\n`;
  }

  // Central Brass Boss
  svg += `  <circle cx="${cx}" cy="${cy}" r="45" fill="#FAF6EF" stroke="#72121E" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="32" fill="#D4AF37" stroke="#72121E" stroke-width="2" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="14" fill="#72121E" />\n`;

  svg += `</svg>`;
  return svg;
}

// 5. Ira-Handa (Sun and Moon Sacred Celestial Mandala)
function generateIraHandaMandala() {
  const size = 800;
  const cx = 400;
  const cy = 400;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#FAF7F2" />
  <circle cx="${cx}" cy="${cy}" r="370" fill="none" stroke="#72121E" stroke-width="3" />
  <circle cx="${cx}" cy="${cy}" r="355" fill="none" stroke="#D4AF37" stroke-width="2" />
`;

  // 24 Solar Rays (Ira)
  const rays = 24;
  for (let i = 0; i < rays; i++) {
    const a = (i * 2 * Math.PI) / rays;
    const aNext = ((i + 1) * 2 * Math.PI) / rays;
    const aMid = a + (aNext - a) / 2;
    const p1 = polarToCart(cx, cy, 270, a);
    const pTip = polarToCart(cx, cy, 345, aMid);
    const p2 = polarToCart(cx, cy, 270, aNext);
    svg += `  <path d="M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${pTip.x.toFixed(1)} ${pTip.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#D4AF37" fill-opacity="0.3" stroke="#72121E" stroke-width="2" />\n`;
  }

  // Intermediate Ring with Star Points
  svg += `  <circle cx="${cx}" cy="${cy}" r="260" fill="none" stroke="#72121E" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="248" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="4,4" />\n`;

  // Inner Celestial Disc: Left Crescent Moon (Handa), Right Solar Face (Ira)
  svg += `  <circle cx="${cx}" cy="${cy}" r="230" fill="#FFFDF9" stroke="#72121E" stroke-width="3" />\n`;

  // Crescent Moon arc
  svg += `  <path d="M 400,190 A 210,210 0 0,0 400,610 A 150,150 0 0,1 400,190 Z" fill="#D4AF37" fill-opacity="0.25" stroke="#72121E" stroke-width="2.5" />\n`;

  // 12-pointed radial star inside
  const starPoints = 12;
  for (let i = 0; i < starPoints; i++) {
    const a = (i * 2 * Math.PI) / starPoints;
    const aMid = a + Math.PI / starPoints;
    const pTip = polarToCart(cx, cy, 140, a);
    const pInner = polarToCart(cx, cy, 60, aMid);
    svg += `  <line x1="${cx}" y1="${cy}" x2="${pTip.x.toFixed(1)}" y2="${pTip.y.toFixed(1)}" stroke="#72121E" stroke-width="2" />\n`;
    svg += `  <circle cx="${pTip.x.toFixed(1)}" cy="${pTip.y.toFixed(1)}" r="6" fill="#D4AF37" stroke="#72121E" stroke-width="1.5" />\n`;
  }

  // Golden Central Sun Core
  svg += `  <circle cx="${cx}" cy="${cy}" r="50" fill="#D4AF37" stroke="#72121E" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="35" fill="#72121E" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="15" fill="#FFFDF9" />\n`;

  svg += `</svg>`;
  return svg;
}

// 6. Kids Elephant (Aliya) Mandala
function generateKidsElephantMandala() {
  const size = 800;
  const cx = 400;
  const cy = 400;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#FAF7F2" />
  <circle cx="${cx}" cy="${cy}" r="370" fill="none" stroke="#2B2D42" stroke-width="4" />
  <circle cx="${cx}" cy="${cy}" r="350" fill="none" stroke="#D4AF37" stroke-width="3" />
`;

  // Bold coloring ring of scalloped petals (16 scallops)
  const scallops = 16;
  for (let i = 0; i < scallops; i++) {
    const aMid = (i * 2 * Math.PI) / scallops;
    const pTip = polarToCart(cx, cy, 345, aMid);
    svg += `  <circle cx="${pTip.x.toFixed(1)}" cy="${pTip.y.toFixed(1)}" r="28" fill="#FFFDF9" stroke="#2B2D42" stroke-width="3" />\n`;
    svg += `  <circle cx="${pTip.x.toFixed(1)}" cy="${pTip.y.toFixed(1)}" r="10" fill="none" stroke="#D4AF37" stroke-width="2" />\n`;
  }

  // Inner ring
  svg += `  <circle cx="${cx}" cy="${cy}" r="290" fill="#FFFDF9" stroke="#2B2D42" stroke-width="3" />\n`;

  // 8 Friendly Elephant heads / tusker motifs around the ring
  const elCount = 8;
  for (let i = 0; i < elCount; i++) {
    const a = (i * 2 * Math.PI) / elCount;
    const pt = polarToCart(cx, cy, 210, a);
    const rot = (a * 180) / Math.PI + 90;

    svg += `  <g transform="translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${rot.toFixed(1)})">
      <!-- Elephant Head -->
      <circle cx="0" cy="0" r="28" fill="#FAF6EF" stroke="#2B2D42" stroke-width="3" />
      <!-- Big friendly ears -->
      <path d="M -24,-10 C -45,-20 -40,15 -20,12 Z" fill="#FFF" stroke="#2B2D42" stroke-width="2.5" />
      <path d="M 24,-10 C 45,-20 40,15 20,12 Z" fill="#FFF" stroke="#2B2D42" stroke-width="2.5" />
      <!-- Curled Trunk -->
      <path d="M -6,16 Q 0,45 16,36 Q 24,30 14,24 Q 4,28 2,16" fill="#FAF6EF" stroke="#2B2D42" stroke-width="2.5" />
      <!-- Decorative Perehara headdress / Netthi Malaya -->
      <path d="M -14,-12 Q 0,-26 14,-12 Z" fill="#D4AF37" stroke="#2B2D42" stroke-width="2" />
      <circle cx="0" cy="-18" r="4" fill="#72121E" />
      <!-- Eyes -->
      <circle cx="-8" cy="-2" r="3" fill="#2B2D42" />
      <circle cx="8" cy="-2" r="3" fill="#2B2D42" />
      <!-- Little Tusks -->
      <path d="M -10,12 Q -18,22 -14,24" stroke="#D4AF37" stroke-width="2.5" fill="none" />
      <path d="M 10,12 Q 18,22 14,24" stroke="#D4AF37" stroke-width="2.5" fill="none" />
    </g>\n`;
  }

  // Central Lotus Rosette for coloring
  svg += `  <circle cx="${cx}" cy="${cy}" r="110" fill="#FFF" stroke="#2B2D42" stroke-width="3.5" />\n`;
  for (let p = 0; p < 8; p++) {
    const aMid = (p * 2 * Math.PI) / 8;
    const pt = polarToCart(cx, cy, 85, aMid);
    svg += `  <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="22" fill="#FAF0E6" stroke="#2B2D42" stroke-width="2.5" />\n`;
  }
  svg += `  <circle cx="${cx}" cy="${cy}" r="45" fill="#D4AF37" stroke="#2B2D42" stroke-width="3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="20" fill="#72121E" />\n`;

  svg += `</svg>`;
  return svg;
}

// Write the primary authentic Sri Lankan SVG files
const assetsToGenerate = [
  {
    name: 'sandakada-pahana-moonstone.svg',
    svg: generateMoonstoneMandala(),
  },
  {
    name: 'sacred-lotus-nelum-mal.svg',
    svg: generateSacredLotusMandala(),
  },
  {
    name: 'royal-nil-manel-blossom.svg',
    svg: generateNilManelMandala(),
  },
  {
    name: 'kandyan-liya-wela-bloom.svg',
    svg: generateKandyanLiyaWelaMandala(),
  },
  {
    name: 'ira-handa-celestial.svg',
    svg: generateIraHandaMandala(),
  },
  {
    name: 'kids-elephant-aliya.svg',
    svg: generateKidsElephantMandala(),
  },
];

console.log('Generating authentic Sri Lankan SVGs...');
assetsToGenerate.forEach((asset) => {
  const pubPath = path.join(publicArtworksDir, asset.name);
  const privPath = path.join(privateArtworksDir, asset.name.replace('.svg', '-original.svg'));
  fs.writeFileSync(pubPath, asset.svg, 'utf8');
  fs.writeFileSync(privPath, asset.svg, 'utf8');
  console.log(`Generated: ${asset.name}`);
});

console.log('All Sri Lankan SVG assets created successfully!');
