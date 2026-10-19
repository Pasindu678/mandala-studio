const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Clear in reverse order
  await prisma.auditLog.deleteMany();
  await prisma.downloadRecord.deleteMany();
  await prisma.purchaseEntitlement.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productArtwork.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collectionArtwork.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.category.deleteMany();
  await prisma.websiteContent.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const adminPassword = await bcrypt.hash('admin123456', 10);
  const customerPassword = await bcrypt.hash('customer123456', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@mandalastudio.art',
      name: 'Studio Director',
      passwordHash: adminPassword,
      role: 'ADMIN',
      avatarUrl: '/images/avatar-admin.png'
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Maya Lin',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
      avatarUrl: '/images/avatar-customer.png'
    }
  });

  console.log('Seeding categories...');
  const categoryDefs = [
    {
      name: 'Floral Mandalas',
      slug: 'floral-mandalas',
      description: 'Organic petal motifs, blooming rosettes, and nature-inspired botanical radial designs.',
      coverImage: '/uploads/categories/floral-mandalas.svg',
      displayOrder: 1,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Geometric Mandalas',
      slug: 'geometric-mandalas',
      description: 'Sacred triangles, hexagonal matrices, and precision architectural geometry.',
      coverImage: '/uploads/categories/geometric-mandalas.svg',
      displayOrder: 2,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Nature-Inspired Mandalas',
      slug: 'nature-inspired-mandalas',
      description: 'Elemental designs capturing ocean waves, forest vines, sun, and celestial moon phases.',
      coverImage: '/uploads/categories/nature-inspired-mandalas.svg',
      displayOrder: 3,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Simple Mandalas',
      slug: 'simple-mandalas',
      description: 'Minimalist lines, spacious shapes, and gentle rings designed for beginner meditation.',
      coverImage: '/uploads/categories/simple-mandalas.svg',
      displayOrder: 4,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Intricate Mandalas',
      slug: 'intricate-mandalas',
      description: 'High-density filigree, cosmic labyrinths, and masterwork detailing for advanced coloring.',
      coverImage: '/uploads/categories/intricate-mandalas.svg',
      displayOrder: 5,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Symmetrical Patterns',
      slug: 'symmetrical-patterns',
      description: 'Balanced radial reflections, quad-mirror harmony, and kaleidoscopic visual perfection.',
      coverImage: '/uploads/categories/symmetrical-patterns.svg',
      displayOrder: 6,
      isFeatured: false,
      isPublished: true,
    },
    {
      name: 'Abstract Mandalas',
      slug: 'abstract-mandalas',
      description: 'Avant-garde fractal spirals, modern kinetic flow, and visionary dimensional illusions.',
      coverImage: '/uploads/categories/abstract-mandalas.svg',
      displayOrder: 7,
      isFeatured: false,
      isPublished: true,
    },
    {
      name: "Kids' Coloring Designs",
      slug: 'kids-coloring-designs',
      description: 'Bold outlines, playful friendly shapes, and joyful patterns tailored for young artists.',
      coverImage: '/uploads/categories/kids-coloring-designs.svg',
      displayOrder: 8,
      isFeatured: true,
      isPublished: true,
    },
  ];

  const catMap = {};
  for (const c of categoryDefs) {
    const created = await prisma.category.create({ data: c });
    catMap[c.slug] = created.id;
  }

  console.log('Seeding 24 artworks...');
  const artworkDefs = [
    // Floral
    {
      title: 'Lotus Blossom Harmony',
      slug: 'lotus-blossom-harmony',
      description: 'A serene twelve-petal lotus mandala symbolizing spiritual awakening and inner clarity.',
      categorySlug: 'floral-mandalas',
      tags: JSON.stringify(['lotus', 'zen', 'floral', 'beginner', 'peace']),
      difficulty: 'BEGINNER',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 1,
      viewsCount: 1420,
      favoritesCount: 384,
      salesCount: 215,
    },
    {
      title: 'Royal Rosette Bloom',
      slug: 'royal-rosette-bloom',
      description: 'Regal layered rosette featuring sixteen radiating florets and exquisite filigree stems.',
      categorySlug: 'floral-mandalas',
      tags: JSON.stringify(['rosette', 'blooming', 'flower', 'ornate', 'commercial']),
      difficulty: 'INTERMEDIATE',
      isFree: false,
      price: 4.99,
      license: 'COMMERCIAL',
      displayOrder: 2,
      viewsCount: 980,
      favoritesCount: 195,
      salesCount: 88,
    },
    {
      title: 'Sunflower Solstice',
      slug: 'sunflower-solstice',
      description: 'Warm summer sunburst inspired by the natural Fibonacci spirals of flowering sunflowers.',
      categorySlug: 'floral-mandalas',
      tags: JSON.stringify(['sunflower', 'summer', 'solstice', 'warmth']),
      difficulty: 'INTERMEDIATE',
      isFree: false,
      price: 3.99,
      license: 'PERSONAL',
      displayOrder: 3,
      viewsCount: 750,
      favoritesCount: 142,
      salesCount: 64,
    },

    // Geometric
    {
      title: 'Sacred Sri Yantra Echo',
      slug: 'sacred-sri-yantra-echo',
      description: 'Interlocking divine triangles representing cosmic creation and sacred feminine/masculine balance.',
      categorySlug: 'geometric-mandalas',
      tags: JSON.stringify(['sacred geometry', 'yantra', 'mystic', 'triangles']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 5.99,
      license: 'COMMERCIAL',
      displayOrder: 4,
      viewsCount: 1650,
      favoritesCount: 420,
      salesCount: 182,
    },
    {
      title: 'Hexagonal Matrix',
      slug: 'hexagonal-matrix',
      description: 'Clean honeycomb symmetry and isometric facets evoking crystalline resonance.',
      categorySlug: 'geometric-mandalas',
      tags: JSON.stringify(['hexagon', 'matrix', 'crystal', 'clean', 'free']),
      difficulty: 'INTERMEDIATE',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 5,
      viewsCount: 1120,
      favoritesCount: 260,
      salesCount: 145,
    },
    {
      title: 'Octagram Celestial Star',
      slug: 'octagram-celestial-star',
      description: 'An eight-pointed star geometry symbolizing celestial navigation, equilibrium, and light.',
      categorySlug: 'geometric-mandalas',
      tags: JSON.stringify(['star', 'octagram', 'celestial', 'geometry']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 4.99,
      license: 'COMMERCIAL',
      displayOrder: 6,
      viewsCount: 890,
      favoritesCount: 178,
      salesCount: 79,
    },

    // Nature
    {
      title: 'Forest Vine & Tendrils',
      slug: 'forest-vine-tendrils',
      description: 'Woven ivy tendrils and wild woodland leaves radiating in natural harmony.',
      categorySlug: 'nature-inspired-mandalas',
      tags: JSON.stringify(['vine', 'forest', 'botanical', 'green', 'nature']),
      difficulty: 'INTERMEDIATE',
      isFree: false,
      price: 3.99,
      license: 'PERSONAL',
      displayOrder: 7,
      viewsCount: 820,
      favoritesCount: 165,
      salesCount: 71,
    },
    {
      title: 'Ocean Wave Vortex',
      slug: 'ocean-wave-vortex',
      description: 'Dynamic tidal crests and rhythmic spiral swells reminiscent of the deep ocean.',
      categorySlug: 'nature-inspired-mandalas',
      tags: JSON.stringify(['ocean', 'wave', 'water', 'spiral', 'free']),
      difficulty: 'BEGINNER',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 8,
      viewsCount: 1340,
      favoritesCount: 310,
      salesCount: 198,
    },
    {
      title: 'Celestial Sun & Crescent',
      slug: 'celestial-sun-crescent',
      description: 'Solar flares entwined with lunar crescents, capturing day and night in one timeless medallion.',
      categorySlug: 'nature-inspired-mandalas',
      tags: JSON.stringify(['sun', 'moon', 'celestial', 'astrology', 'night']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 5.99,
      license: 'COMMERCIAL',
      displayOrder: 9,
      viewsCount: 1890,
      favoritesCount: 512,
      salesCount: 230,
    },

    // Simple
    {
      title: 'Zen Circle of Calm',
      slug: 'zen-circle-of-calm',
      description: 'Effortless minimalism centered on the soothing Ensō circular brush rhythm.',
      categorySlug: 'simple-mandalas',
      tags: JSON.stringify(['zen', 'enso', 'simple', 'minimalist', 'free']),
      difficulty: 'BEGINNER',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 10,
      viewsCount: 1560,
      favoritesCount: 425,
      salesCount: 310,
    },
    {
      title: 'Minimalist Water Ripple',
      slug: 'minimalist-water-ripple',
      description: 'Concentric wavelets forming gentle ripples, ideal for mindful relaxing color studies.',
      categorySlug: 'simple-mandalas',
      tags: JSON.stringify(['ripple', 'minimal', 'easy', 'soothing']),
      difficulty: 'BEGINNER',
      isFree: false,
      price: 2.99,
      license: 'PERSONAL',
      displayOrder: 11,
      viewsCount: 680,
      favoritesCount: 120,
      salesCount: 52,
    },
    {
      title: 'Novice Meditative Ring',
      slug: 'novice-meditative-ring',
      description: 'Spacious concentric rings with friendly spacing for first-time coloring enthusiasts.',
      categorySlug: 'simple-mandalas',
      tags: JSON.stringify(['rings', 'novice', 'beginner', 'easy', 'free']),
      difficulty: 'BEGINNER',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 12,
      viewsCount: 1280,
      favoritesCount: 290,
      salesCount: 175,
    },

    // Intricate
    {
      title: 'Cosmic Kaleidoscope Infinite',
      slug: 'cosmic-kaleidoscope-infinite',
      description: 'Masterwork twenty-four fold filigree weaving infinite radial horizons and starry constellations.',
      categorySlug: 'intricate-mandalas',
      tags: JSON.stringify(['cosmic', 'kaleidoscope', 'filigree', 'intricate', 'masterpiece']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 6.99,
      license: 'COMMERCIAL',
      displayOrder: 13,
      viewsCount: 2450,
      favoritesCount: 680,
      salesCount: 340,
    },
    {
      title: 'Royal Filigree Tapestry',
      slug: 'royal-filigree-tapestry',
      description: 'Luxurious baroque-inspired lace and delicate jewel embellishments.',
      categorySlug: 'intricate-mandalas',
      tags: JSON.stringify(['royal', 'tapestry', 'lace', 'baroque', 'luxury']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 6.99,
      license: 'COMMERCIAL',
      displayOrder: 14,
      viewsCount: 1720,
      favoritesCount: 410,
      salesCount: 165,
    },
    {
      title: 'Eternal Labyrinth of Light',
      slug: 'eternal-labyrinth-light',
      description: 'A meditative labyrinth guiding the eye through hypnotic sacred pathways.',
      categorySlug: 'intricate-mandalas',
      tags: JSON.stringify(['labyrinth', 'maze', 'eternal', 'meditation']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 5.99,
      license: 'PERSONAL',
      displayOrder: 15,
      viewsCount: 1190,
      favoritesCount: 285,
      salesCount: 110,
    },

    // Symmetrical
    {
      title: 'Kaleidoscopic Radial Balance',
      slug: 'kaleidoscopic-radial-balance',
      description: 'Flawless optical balance with crystalline hexagonal facets and radiating star beams.',
      categorySlug: 'symmetrical-patterns',
      tags: JSON.stringify(['balance', 'optical', 'symmetry', 'radial']),
      difficulty: 'INTERMEDIATE',
      isFree: false,
      price: 4.49,
      license: 'PERSONAL',
      displayOrder: 16,
      viewsCount: 940,
      favoritesCount: 210,
      salesCount: 94,
    },
    {
      title: 'Quad-Mirror Symmetry',
      slug: 'quad-mirror-symmetry',
      description: 'Four-quadrant cardinal reflection embodying the four seasons and universal directions.',
      categorySlug: 'symmetrical-patterns',
      tags: JSON.stringify(['quad', 'mirror', 'seasons', 'symmetry', 'free']),
      difficulty: 'BEGINNER',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 17,
      viewsCount: 1040,
      favoritesCount: 240,
      salesCount: 130,
    },
    {
      title: 'Golden Ratio Geometry',
      slug: 'golden-ratio-geometry',
      description: 'Proportional spiral geometry calibrated precisely to the divine phi ratio (1.618).',
      categorySlug: 'symmetrical-patterns',
      tags: JSON.stringify(['golden ratio', 'phi', 'divine', 'geometry']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 5.49,
      license: 'COMMERCIAL',
      displayOrder: 18,
      viewsCount: 1350,
      favoritesCount: 340,
      salesCount: 142,
    },

    // Abstract
    {
      title: 'Fractal Spiral Portal',
      slug: 'fractal-spiral-portal',
      description: 'Self-similar recursive spirals drawing the colorist into an infinite quantum horizon.',
      categorySlug: 'abstract-mandalas',
      tags: JSON.stringify(['fractal', 'portal', 'spiral', 'abstract']),
      difficulty: 'ADVANCED',
      isFree: false,
      price: 5.99,
      license: 'COMMERCIAL',
      displayOrder: 19,
      viewsCount: 1220,
      favoritesCount: 305,
      salesCount: 118,
    },
    {
      title: 'Nebula Fusion Ring',
      slug: 'nebula-fusion-ring',
      description: 'Intergalactic cloud arcs swirling in harmony around an interstellar gravitational core.',
      categorySlug: 'abstract-mandalas',
      tags: JSON.stringify(['nebula', 'space', 'fusion', 'galaxy']),
      difficulty: 'INTERMEDIATE',
      isFree: false,
      price: 3.99,
      license: 'PERSONAL',
      displayOrder: 20,
      viewsCount: 890,
      favoritesCount: 195,
      salesCount: 76,
    },
    {
      title: 'Prismatic Flow Wave',
      slug: 'prismatic-flow-wave',
      description: 'Liquid fluid dynamics translated into vector linework for colorful gradient shading.',
      categorySlug: 'abstract-mandalas',
      tags: JSON.stringify(['flow', 'liquid', 'wave', 'abstract', 'free']),
      difficulty: 'INTERMEDIATE',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 21,
      viewsCount: 1150,
      favoritesCount: 270,
      salesCount: 160,
    },

    // Kids
    {
      title: 'Happy Sunshine Mandala',
      slug: 'happy-sunshine-mandala',
      description: 'Friendly smiling sun with bold ray petals and playful circles designed for little hands.',
      categorySlug: 'kids-coloring-designs',
      tags: JSON.stringify(['kids', 'sunshine', 'happy', 'simple', 'free']),
      difficulty: 'BEGINNER',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 22,
      viewsCount: 1840,
      favoritesCount: 460,
      salesCount: 390,
    },
    {
      title: 'Friendly Daisy Petals',
      slug: 'friendly-daisy-petals',
      description: 'Chunky flower petals with dotted centers that make crayon and marker coloring a breeze.',
      categorySlug: 'kids-coloring-designs',
      tags: JSON.stringify(['daisy', 'flower', 'kids', 'crayons']),
      difficulty: 'BEGINNER',
      isFree: false,
      price: 1.99,
      license: 'PERSONAL',
      displayOrder: 23,
      viewsCount: 920,
      favoritesCount: 210,
      salesCount: 85,
    },
    {
      title: 'Playful Whirl Stars',
      slug: 'playful-whirl-stars',
      description: 'Six cheerful stars orbiting in a joyful carousel ring of pure childhood fun.',
      categorySlug: 'kids-coloring-designs',
      tags: JSON.stringify(['stars', 'whirl', 'fun', 'kids', 'free']),
      difficulty: 'BEGINNER',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      displayOrder: 24,
      viewsCount: 1410,
      favoritesCount: 350,
      salesCount: 220,
    },
  ];

  const artworkMap = {};
  for (const art of artworkDefs) {
    const created = await prisma.artwork.create({
      data: {
        title: art.title,
        slug: art.slug,
        description: art.description,
        categoryId: catMap[art.categorySlug],
        tags: art.tags,
        difficulty: art.difficulty,
        previewImage: `/uploads/artworks/${art.slug}.svg`,
        originalFile: `/storage/private/artworks/${art.slug}-original.svg`,
        isFree: art.isFree,
        price: art.price,
        license: art.license,
        isPublished: true,
        displayOrder: art.displayOrder,
        viewsCount: art.viewsCount,
        favoritesCount: art.favoritesCount,
        salesCount: art.salesCount,
      }
    });
    artworkMap[art.slug] = created.id;
  }

  console.log('Seeding collections...');
  const col1 = await prisma.collection.create({
    data: {
      title: 'Floral Mandala Collection',
      slug: 'floral-mandala-collection',
      description: 'A breathtaking curated suite of botanicals, blossoming rosettes, and blooming lotuses.',
      coverImage: '/uploads/categories/floral-mandalas.svg',
      price: 9.99,
      isPublished: true,
      isFeatured: true,
      displayOrder: 1,
      artworks: {
        create: [
          { artworkId: artworkMap['lotus-blossom-harmony'], displayOrder: 1 },
          { artworkId: artworkMap['royal-rosette-bloom'], displayOrder: 2 },
          { artworkId: artworkMap['sunflower-solstice'], displayOrder: 3 },
        ]
      }
    }
  });

  const col2 = await prisma.collection.create({
    data: {
      title: 'Beginner Coloring Collection',
      slug: 'beginner-coloring-collection',
      description: 'Soothing, uncluttered mandala linework crafted for gentle meditative coloring and peace.',
      coverImage: '/uploads/categories/simple-mandalas.svg',
      price: 7.99,
      isPublished: true,
      isFeatured: true,
      displayOrder: 2,
      artworks: {
        create: [
          { artworkId: artworkMap['zen-circle-of-calm'], displayOrder: 1 },
          { artworkId: artworkMap['minimalist-water-ripple'], displayOrder: 2 },
          { artworkId: artworkMap['novice-meditative-ring'], displayOrder: 3 },
        ]
      }
    }
  });

  const col3 = await prisma.collection.create({
    data: {
      title: 'Advanced Masterwork Collection',
      slug: 'advanced-masterwork-collection',
      description: 'Intense cosmic labyrinths and fine filigree designed for experienced colorists and artists.',
      coverImage: '/uploads/categories/intricate-mandalas.svg',
      price: 14.99,
      isPublished: true,
      isFeatured: true,
      displayOrder: 3,
      artworks: {
        create: [
          { artworkId: artworkMap['cosmic-kaleidoscope-infinite'], displayOrder: 1 },
          { artworkId: artworkMap['royal-filigree-tapestry'], displayOrder: 2 },
          { artworkId: artworkMap['eternal-labyrinth-light'], displayOrder: 3 },
          { artworkId: artworkMap['golden-ratio-geometry'], displayOrder: 4 },
        ]
      }
    }
  });

  console.log('Seeding commercial products...');
  const prod1 = await prisma.product.create({
    data: {
      title: 'The Serenity Mandala Coloring Book',
      slug: 'serenity-mandala-coloring-book',
      description: 'Instant download print-ready PDF containing 20 high-resolution A4 meditative coloring pages, coloring guide, and test palette page.',
      coverImage: '/uploads/products/serenity-mandala-coloring-book.svg',
      price: 12.99,
      currency: 'USD',
      productType: 'COLORING_BOOK_PDF',
      license: 'PERSONAL',
      fileUrl: '/storage/private/products/serenity-mandala-coloring-book.pdf',
      isPublished: true,
      isFeatured: true,
      artworks: {
        create: [
          { artworkId: artworkMap['lotus-blossom-harmony'] },
          { artworkId: artworkMap['sacred-sri-yantra-echo'] },
          { artworkId: artworkMap['cosmic-kaleidoscope-infinite'] },
        ]
      }
    }
  });

  const prod2 = await prisma.product.create({
    data: {
      title: 'Sacred Geometry Digital Bundle',
      slug: 'sacred-geometry-bundle',
      description: 'Complete commercial package including 6 infinite-scale SVG vector files, transparent 4K PNGs, and full commercial redistribution license.',
      coverImage: '/uploads/products/sacred-geometry-bundle.svg',
      price: 19.99,
      currency: 'USD',
      productType: 'THEMED_BUNDLE',
      license: 'COMMERCIAL',
      fileUrl: '/storage/private/products/serenity-mandala-coloring-book.pdf',
      isPublished: true,
      isFeatured: true,
      artworks: {
        create: [
          { artworkId: artworkMap['sacred-sri-yantra-echo'] },
          { artworkId: artworkMap['hexagonal-matrix'] },
          { artworkId: artworkMap['octagram-celestial-star'] },
          { artworkId: artworkMap['golden-ratio-geometry'] },
        ]
      }
    }
  });

  const prod3 = await prisma.product.create({
    data: {
      title: 'Beginner Zen Meditation Coloring Pack',
      slug: 'beginner-zen-pack',
      description: 'Accessible, clean linework mandalas tailored for quick stress relief and calm evening unwinding.',
      coverImage: '/uploads/products/beginner-zen-pack.svg',
      price: 7.99,
      currency: 'USD',
      productType: 'COLORING_BOOK_PDF',
      license: 'PERSONAL',
      fileUrl: '/storage/private/products/serenity-mandala-coloring-book.pdf',
      isPublished: true,
      isFeatured: false,
      artworks: {
        create: [
          { artworkId: artworkMap['zen-circle-of-calm'] },
          { artworkId: artworkMap['minimalist-water-ripple'] },
          { artworkId: artworkMap['novice-meditative-ring'] },
        ]
      }
    }
  });

  const prod4 = await prisma.product.create({
    data: {
      title: 'Master Artist Intricate Mandala Collection',
      slug: 'master-artist-collection',
      description: 'The ultimate collector edition: all 8 high-density filigree vector artworks with unlimited commercial licensing rights.',
      coverImage: '/uploads/products/master-artist-collection.svg',
      price: 29.99,
      currency: 'USD',
      productType: 'PREMIUM_COLLECTION',
      license: 'COMMERCIAL',
      fileUrl: '/storage/private/products/serenity-mandala-coloring-book.pdf',
      isPublished: true,
      isFeatured: true,
      artworks: {
        create: [
          { artworkId: artworkMap['cosmic-kaleidoscope-infinite'] },
          { artworkId: artworkMap['royal-filigree-tapestry'] },
          { artworkId: artworkMap['eternal-labyrinth-light'] },
        ]
      }
    }
  });

  console.log('Seeding discount codes...');
  await prisma.discountCode.createMany({
    data: [
      {
        code: 'ZEN20',
        percentage: 20.0,
        minOrderAmount: 10.0,
        isActive: true,
        maxUses: 500,
      },
      {
        code: 'MANDALA10',
        percentage: 10.0,
        minOrderAmount: 0.0,
        isActive: true,
        maxUses: 1000,
      },
      {
        code: 'WELCOME5',
        fixedAmount: 5.0,
        minOrderAmount: 15.0,
        isActive: true,
        maxUses: 200,
      }
    ]
  });

  console.log('Seeding dynamic website content...');
  await prisma.websiteContent.createMany({
    data: [
      {
        key: 'homepage_hero',
        section: 'hero',
        content: JSON.stringify({
          headline: 'Discover Your Perfect Mandala',
          subheadline: 'Immerse yourself in authentic sacred geometry, mindful floral art, and printable coloring books designed for meditation, stress relief, and creative joy.',
          ctaText: 'Explore Gallery',
          ctaLink: '/gallery',
          secondaryCtaText: 'Browse Shop',
          secondaryCtaLink: '/shop',
          heroImage: '/uploads/artworks/lotus-blossom-harmony.svg',
          badgeText: 'Handcrafted Radial Art & Digital Printables'
        })
      },
      {
        key: 'homepage_banner',
        section: 'banner',
        content: JSON.stringify({
          isActive: true,
          badge: 'Limited Offer',
          message: 'Celebrate mindfulness: Take 20% off all digital collections and printables with code',
          discountCode: 'ZEN20',
          linkText: 'Claim Discount',
          linkUrl: '/shop'
        })
      },
      {
        key: 'homepage_about',
        section: 'about',
        content: JSON.stringify({
          title: 'The Art of Mindful Geometry',
          subtitle: 'Ancient harmony reimagined for contemporary relaxation',
          body: 'At Mandala Studio, we believe the meditative symmetry of mandalas provides a sanctuary from the relentless pace of daily life. Every design is architected with pure radial mathematical symmetry, intentional balance, and gentle aesthetic poise. Whether you are coloring to unwind or licensing designs for your creative brand, we deliver vectors of unmatched clarity.',
          pillar1Title: 'Sacred Proportions',
          pillar1Text: 'Each stroke respects traditional radial geometry and Fibonacci ratios to promote natural cognitive calm.',
          pillar2Title: 'Lossless Vector Files',
          pillar2Text: 'Scalable SVG originals and 300 DPI print-ready PDFs guarantee razor-sharp linework at any size.',
          pillar3Title: 'Clear Licensing',
          pillar3Text: 'Hassle-free personal coloring downloads and transparent commercial rights for modern creators.'
        })
      },
      {
        key: 'homepage_faq',
        section: 'faq',
        content: JSON.stringify({
          items: [
            {
              question: 'What file formats do I receive when I purchase?',
              answer: 'All individual artworks and bundles include scalable vector SVG files, ultra high-resolution 4K PNGs (300 DPI) with transparent backgrounds, and print-ready PDFs.'
            },
            {
              question: 'Are there free mandala designs available?',
              answer: 'Yes! We offer a generous selection of completely free designs in every category. Simply click "Download Free" to download the high-resolution files instantly.'
            },
            {
              question: 'Can I use these mandalas for commercial products?',
              answer: 'Designs and bundles purchased with a Commercial License permit unlimited print-on-demand, book publishing, website branding, and merchandise usage.'
            },
            {
              question: 'How do I download my purchased products?',
              answer: 'Immediately upon checkout completion, your files become available in your account under "My Downloads" with secure, authentic access tokens.'
            },
            {
              question: 'Can I print these on home printers?',
              answer: 'Absolutely. All our coloring pages and book PDFs are standardized to standard Letter / A4 sizes, optimized for crisp black-and-white output on any standard printer.'
            }
          ]
        })
      },
      {
        key: 'site_settings',
        section: 'settings',
        content: JSON.stringify({
          siteName: 'Mandala Studio',
          tagline: 'Discover Your Art. Choose Your Mandala.',
          contactEmail: 'hello@mandalastudio.art',
          supportEmail: 'support@mandalastudio.art',
          currency: 'USD',
          currencySymbol: '$',
          announcementActive: true,
          instagramUrl: 'https://instagram.com',
          pinterestUrl: 'https://pinterest.com'
        })
      }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
