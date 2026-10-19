const fs = require('fs');
const path = require('path');

const publicUploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'artworks');
const publicCategoriesDir = path.join(__dirname, '..', 'public', 'uploads', 'categories');
const publicProductsDir = path.join(__dirname, '..', 'public', 'uploads', 'products');
const privateStorageDir = path.join(__dirname, '..', 'storage', 'private', 'artworks');
const privatePdfDir = path.join(__dirname, '..', 'storage', 'private', 'products');

[publicUploadsDir, publicCategoriesDir, publicProductsDir, privateStorageDir, privatePdfDir].forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// Mathematical SVG Mandala Generator
function generateMandalaSvg({ folds = 12, complexity = 4, style = 'geometric', seed = 1 }) {
  const size = 800;
  const center = size / 2;
  const radius = size * 0.44;

  let elements = [];

  // Background circle
  elements.push(`<circle cx="${center}" cy="${center}" r="${radius}" fill="#FAF7F2" stroke="#2B2D42" stroke-width="3" stroke-dasharray="6,4" opacity="0.6"/>`);
  elements.push(`<circle cx="${center}" cy="${center}" r="${radius * 0.95}" fill="none" stroke="#2B2D42" stroke-width="2"/>`);

  const angleStep = (2 * Math.PI) / folds;

  // Concentric decorative rings
  for (let ring = 1; ring <= complexity; ring++) {
    const ringRadius = (radius / (complexity + 1)) * ring;
    elements.push(`<circle cx="${center}" cy="${center}" r="${ringRadius}" fill="none" stroke="#2B2D42" stroke-width="${ring % 2 === 0 ? 2 : 1.5}"/>`);
  }

  // Radial symmetrical petals & geometry
  for (let i = 0; i < folds; i++) {
    const angle = i * angleStep;
    const nextAngle = (i + 1) * angleStep;
    const midAngle = angle + angleStep / 2;

    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const cosNext = Math.cos(nextAngle);
    const sinNext = Math.sin(nextAngle);
    const cosMid = Math.cos(midAngle);
    const sinMid = Math.sin(midAngle);

    if (style === 'floral') {
      // Petal paths
      const p1x = center + (radius * 0.3) * cosA;
      const p1y = center + (radius * 0.3) * sinA;
      const p2x = center + (radius * 0.85) * cosMid;
      const p2y = center + (radius * 0.85) * sinMid;
      const p3x = center + (radius * 0.3) * cosNext;
      const p3y = center + (radius * 0.3) * sinNext;

      const ctrl1x = center + (radius * 0.6) * Math.cos(angle + angleStep * 0.2);
      const ctrl1y = center + (radius * 0.6) * Math.sin(angle + angleStep * 0.2);
      const ctrl2x = center + (radius * 0.6) * Math.cos(nextAngle - angleStep * 0.2);
      const ctrl2y = center + (radius * 0.6) * Math.sin(nextAngle - angleStep * 0.2);

      elements.push(`<path d="M ${p1x} ${p1y} Q ${ctrl1x} ${ctrl1y} ${p2x} ${p2y} Q ${ctrl2x} ${ctrl2y} ${p3x} ${p3y} Z" fill="none" stroke="#2B2D42" stroke-width="2"/>`);

      // Inner petal vein
      elements.push(`<line x1="${center + radius * 0.3 * cosMid}" y1="${center + radius * 0.3 * sinMid}" x2="${p2x}" y2="${p2y}" stroke="#2B2D42" stroke-width="1.2" stroke-dasharray="3,3"/>`);

      // Teardrops / circles
      const dotX = center + (radius * 0.65) * cosMid;
      const dotY = center + (radius * 0.65) * sinMid;
      elements.push(`<circle cx="${dotX}" cy="${dotY}" r="4" fill="#6B9080"/>`);

    } else if (style === 'geometric') {
      // Intersecting diamond & star facets
      const rInner = radius * 0.35;
      const rOuter = radius * 0.88;
      const rMid = radius * 0.6;

      const xInner = center + rInner * cosA;
      const yInner = center + rInner * sinA;
      const xOuter = center + rOuter * cosMid;
      const yOuter = center + rOuter * sinMid;
      const xNextInner = center + rInner * cosNext;
      const yNextInner = center + rInner * sinNext;
      const xMid = center + rMid * cosA;
      const yMid = center + rMid * sinA;

      elements.push(`<polygon points="${center},${center} ${xInner},${yInner} ${xOuter},${yOuter} ${xNextInner},${yNextInner}" fill="none" stroke="#2B2D42" stroke-width="1.8"/>`);
      elements.push(`<line x1="${xInner}" y1="${yInner}" x2="${center + rOuter * cosA}" y2="${center + rOuter * sinA}" stroke="#8A84E2" stroke-width="1.2"/>`);
      elements.push(`<circle cx="${xMid}" cy="${yMid}" r="3.5" fill="#D47A60"/>`);

    } else if (style === 'kids') {
      // Friendly, chunky, easy-to-color shapes
      const tipX = center + (radius * 0.75) * cosMid;
      const tipY = center + (radius * 0.75) * sinMid;
      const base1X = center + (radius * 0.25) * cosA;
      const base1Y = center + (radius * 0.25) * sinA;
      const base2X = center + (radius * 0.25) * cosNext;
      const base2Y = center + (radius * 0.25) * sinNext;

      elements.push(`<path d="M ${base1X} ${base1Y} A 40 40 0 0 1 ${tipX} ${tipY} A 40 40 0 0 1 ${base2X} ${base2Y} Z" fill="none" stroke="#2B2D42" stroke-width="3"/>`);
      elements.push(`<circle cx="${tipX}" cy="${tipY}" r="6" fill="#D4AF37" stroke="#2B2D42" stroke-width="2"/>`);

    } else if (style === 'intricate') {
      // Dense cosmic filigree
      const r1 = radius * 0.25;
      const r2 = radius * 0.5;
      const r3 = radius * 0.72;
      const r4 = radius * 0.92;

      const pA = { x: center + r1 * cosA, y: center + r1 * sinA };
      const pB = { x: center + r2 * cosMid, y: center + r2 * sinMid };
      const pC = { x: center + r3 * cosA, y: center + r3 * sinA };
      const pD = { x: center + r4 * cosMid, y: center + r4 * sinMid };

      elements.push(`<path d="M ${pA.x} ${pA.y} C ${pB.x} ${pB.y}, ${pC.x} ${pC.y}, ${pD.x} ${pD.y}" fill="none" stroke="#2B2D42" stroke-width="1.5"/>`);
      elements.push(`<path d="M ${pA.x} ${pA.y} Q ${pC.x} ${pC.y} ${pD.x} ${pD.y}" fill="none" stroke="#8A84E2" stroke-width="1"/>`);
      elements.push(`<circle cx="${pB.x}" cy="${pB.y}" r="2.5" fill="#2B2D42"/>`);
      elements.push(`<circle cx="${pD.x}" cy="${pD.y}" r="3" fill="#D4AF37"/>`);

    } else {
      // Abstract / nature spirals
      const p1 = { x: center + radius * 0.2 * cosA, y: center + radius * 0.2 * sinA };
      const p2 = { x: center + radius * 0.55 * Math.cos(angle + angleStep * 0.7), y: center + radius * 0.55 * Math.sin(angle + angleStep * 0.7) };
      const p3 = { x: center + radius * 0.85 * cosMid, y: center + radius * 0.85 * sinMid };

      elements.push(`<path d="M ${p1.x} ${p1.y} S ${p2.x} ${p2.y} ${p3.x} ${p3.y}" fill="none" stroke="#2B2D42" stroke-width="2"/>`);
      elements.push(`<circle cx="${p3.x}" cy="${p3.y}" r="4" fill="#6B9080" stroke="#2B2D42" stroke-width="1.5"/>`);
    }
  }

  // Central rosette / sacred center
  elements.push(`<circle cx="${center}" cy="${center}" r="${radius * 0.18}" fill="#FAF7F2" stroke="#2B2D42" stroke-width="2.5"/>`);
  elements.push(`<circle cx="${center}" cy="${center}" r="${radius * 0.1}" fill="#D47A60" opacity="0.3"/>`);
  elements.push(`<circle cx="${center}" cy="${center}" r="${radius * 0.05}" fill="#2B2D42"/>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
  <rect width="${size}" height="${size}" fill="#FAF7F2"/>
  <g id="mandala-body">
    ${elements.join('\n    ')}
  </g>
</svg>`;
}

// 24 artworks metadata
const artworks = [
  // Floral
  { slug: 'lotus-blossom-harmony', folds: 12, complexity: 5, style: 'floral', cat: 'floral-mandalas' },
  { slug: 'royal-rosette-bloom', folds: 16, complexity: 6, style: 'floral', cat: 'floral-mandalas' },
  { slug: 'sunflower-solstice', folds: 18, complexity: 5, style: 'floral', cat: 'floral-mandalas' },

  // Geometric
  { slug: 'sacred-sri-yantra-echo', folds: 12, complexity: 6, style: 'geometric', cat: 'geometric-mandalas' },
  { slug: 'hexagonal-matrix', folds: 6, complexity: 5, style: 'geometric', cat: 'geometric-mandalas' },
  { slug: 'octagram-celestial-star', folds: 8, complexity: 6, style: 'geometric', cat: 'geometric-mandalas' },

  // Nature
  { slug: 'forest-vine-tendrils', folds: 10, complexity: 5, style: 'nature', cat: 'nature-inspired-mandalas' },
  { slug: 'ocean-wave-vortex', folds: 12, complexity: 4, style: 'nature', cat: 'nature-inspired-mandalas' },
  { slug: 'celestial-sun-crescent', folds: 16, complexity: 6, style: 'nature', cat: 'nature-inspired-mandalas' },

  // Simple
  { slug: 'zen-circle-of-calm', folds: 8, complexity: 3, style: 'simple', cat: 'simple-mandalas' },
  { slug: 'minimalist-water-ripple', folds: 6, complexity: 3, style: 'simple', cat: 'simple-mandalas' },
  { slug: 'novice-meditative-ring', folds: 8, complexity: 2, style: 'simple', cat: 'simple-mandalas' },

  // Intricate
  { slug: 'cosmic-kaleidoscope-infinite', folds: 24, complexity: 8, style: 'intricate', cat: 'intricate-mandalas' },
  { slug: 'royal-filigree-tapestry', folds: 20, complexity: 8, style: 'intricate', cat: 'intricate-mandalas' },
  { slug: 'eternal-labyrinth-light', folds: 16, complexity: 7, style: 'intricate', cat: 'intricate-mandalas' },

  // Symmetrical
  { slug: 'kaleidoscopic-radial-balance', folds: 16, complexity: 6, style: 'geometric', cat: 'symmetrical-patterns' },
  { slug: 'quad-mirror-symmetry', folds: 8, complexity: 4, style: 'geometric', cat: 'symmetrical-patterns' },
  { slug: 'golden-ratio-geometry', folds: 12, complexity: 6, style: 'geometric', cat: 'symmetrical-patterns' },

  // Abstract
  { slug: 'fractal-spiral-portal', folds: 14, complexity: 6, style: 'nature', cat: 'abstract-mandalas' },
  { slug: 'nebula-fusion-ring', folds: 12, complexity: 5, style: 'nature', cat: 'abstract-mandalas' },
  { slug: 'prismatic-flow-wave', folds: 10, complexity: 5, style: 'nature', cat: 'abstract-mandalas' },

  // Kids
  { slug: 'happy-sunshine-mandala', folds: 8, complexity: 3, style: 'kids', cat: 'kids-coloring-designs' },
  { slug: 'friendly-daisy-petals', folds: 8, complexity: 3, style: 'kids', cat: 'kids-coloring-designs' },
  { slug: 'playful-whirl-stars', folds: 6, complexity: 3, style: 'kids', cat: 'kids-coloring-designs' },
];

console.log(`Generating ${artworks.length} mandala artwork files...`);

artworks.forEach((art, index) => {
  const svg = generateMandalaSvg({
    folds: art.folds,
    complexity: art.complexity,
    style: art.style,
    seed: index + 1
  });

  const previewPath = path.join(publicUploadsDir, `${art.slug}.svg`);
  const privatePath = path.join(privateStorageDir, `${art.slug}-original.svg`);

  fs.writeFileSync(previewPath, svg);
  fs.writeFileSync(privatePath, svg);
});

// Category covers
const categories = [
  'floral-mandalas',
  'geometric-mandalas',
  'nature-inspired-mandalas',
  'simple-mandalas',
  'intricate-mandalas',
  'symmetrical-patterns',
  'abstract-mandalas',
  'kids-coloring-designs'
];

categories.forEach((cat, idx) => {
  const catSvg = generateMandalaSvg({
    folds: 8 + (idx % 6) * 2,
    complexity: 4 + (idx % 3),
    style: idx === 7 ? 'kids' : (idx % 2 === 0 ? 'floral' : 'geometric'),
    seed: 100 + idx
  });
  fs.writeFileSync(path.join(publicCategoriesDir, `${cat}.svg`), catSvg);
});

// Products & Bundles covers
const products = [
  'serenity-mandala-coloring-book',
  'sacred-geometry-bundle',
  'beginner-zen-pack',
  'master-artist-collection'
];

products.forEach((prod, idx) => {
  const prodSvg = generateMandalaSvg({
    folds: 16,
    complexity: 6,
    style: 'intricate',
    seed: 200 + idx
  });
  fs.writeFileSync(path.join(publicProductsDir, `${prod}.svg`), prodSvg);
});

console.log('Artwork SVGs and category/product covers generated successfully!');
