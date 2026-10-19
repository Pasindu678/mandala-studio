/**
 * Sri Lankan Heritage Database Seeder
 * Enriches Mandala Studio database with authentic Sri Lankan categories,
 * vector artworks, CMS content, and discount codes.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- ENRICHING MANDALA STUDIO WITH SRI LANKAN THEME ---');

  // 1. Update Website Content (CMS)
  console.log('[1/4] Updating Website Content CMS with Sri Lankan Heritage...');

  await prisma.websiteContent.upsert({
    where: { key: 'homepage_hero' },
    update: {
      content: JSON.stringify({
        headline: 'Discover the Sacred Mandalas of Ceylon',
        subheadline: 'Immerse yourself in authentic Moonstone (Sandakada Pahana) geometry, sacred Lotus rosettes, Kandyan liya wela filigree, and printable coloring books.',
        ctaText: 'Explore Heritage Gallery',
        ctaLink: '/gallery',
        secondaryCtaText: 'Coloring Books & Bundles',
        secondaryCtaLink: '/shop',
        heroImage: '/uploads/artworks/sandakada-pahana-moonstone.svg',
        badgeText: '🇱🇰 Ceylon Heritage & Sacred Geometry • ශ්‍රී ලාංකීය උරුමය',
      }),
    },
    create: {
      key: 'homepage_hero',
      section: 'hero',
      content: JSON.stringify({
        headline: 'Discover the Sacred Mandalas of Ceylon',
        subheadline: 'Immerse yourself in authentic Moonstone (Sandakada Pahana) geometry, sacred Lotus rosettes, Kandyan liya wela filigree, and printable coloring books.',
        ctaText: 'Explore Heritage Gallery',
        ctaLink: '/gallery',
        secondaryCtaText: 'Coloring Books & Bundles',
        secondaryCtaLink: '/shop',
        heroImage: '/uploads/artworks/sandakada-pahana-moonstone.svg',
        badgeText: '🇱🇰 Ceylon Heritage & Sacred Geometry • ශ්‍රී ලාංකීය උරුමය',
      }),
    },
  });

  await prisma.websiteContent.upsert({
    where: { key: 'homepage_banner' },
    update: {
      content: JSON.stringify({
        isActive: true,
        badge: 'AYUBOWAN',
        message: 'Celebrate authentic Sri Lankan artistry! Use code AYUBOWAN15 for 15% off all digital mandala downloads.',
        discountCode: 'AYUBOWAN15',
        linkUrl: '/shop',
        linkText: 'Explore Shop',
      }),
    },
    create: {
      key: 'homepage_banner',
      section: 'banner',
      content: JSON.stringify({
        isActive: true,
        badge: 'AYUBOWAN',
        message: 'Celebrate authentic Sri Lankan artistry! Use code AYUBOWAN15 for 15% off all digital mandala downloads.',
        discountCode: 'AYUBOWAN15',
        linkUrl: '/shop',
        linkText: 'Explore Shop',
      }),
    },
  });

  await prisma.websiteContent.upsert({
    where: { key: 'homepage_about' },
    update: {
      content: JSON.stringify({
        title: 'Preserving 2,500 Years of Ceylon Sacred Symmetry',
        body: 'From the stone moonstones of Anuradhapura and Polonnaruwa to the vibrant ceiling frescoes of Dambulla and Kandyan brass lacquer carvings, Sri Lanka holds one of the world’s most refined traditions of radial symmetry. Mandala Studio celebrates this living heritage through scalable vector art for meditation, architectural design, and digital coloring.',
        pillar1Title: 'Sacred Proportions (පූජනීය ජ්‍යාමිතිය)',
        pillar1Text: 'Every concentric ring, petal, and swan motif adheres strictly to ancient stone carving and Buddhist temple aesthetic ratios.',
        pillar2Title: 'Infinite Scalability (දෛශික නිර්මාණ)',
        pillar2Text: 'Exported as clean, lossless 4K SVGs and print-ready PDFs ideal for laser engraving, batiks, textiles, and coloring.',
        pillar3Title: 'Commercial Licensing (වාණිජ අයිතීන්)',
        pillar3Text: 'Empowering textile artisans, stationery creators, and digital designers with transparent commercial reproduction rights.',
      }),
    },
    create: {
      key: 'homepage_about',
      section: 'about',
      content: JSON.stringify({
        title: 'Preserving 2,500 Years of Ceylon Sacred Symmetry',
        body: 'From the stone moonstones of Anuradhapura and Polonnaruwa to the vibrant ceiling frescoes of Dambulla and Kandyan brass lacquer carvings, Sri Lanka holds one of the world’s most refined traditions of radial symmetry. Mandala Studio celebrates this living heritage through scalable vector art for meditation, architectural design, and digital coloring.',
        pillar1Title: 'Sacred Proportions (පූජනීය ජ්‍යාමිතිය)',
        pillar1Text: 'Every concentric ring, petal, and swan motif adheres strictly to ancient stone carving and Buddhist temple aesthetic ratios.',
        pillar2Title: 'Infinite Scalability (දෛශික නිර්මාණ)',
        pillar2Text: 'Exported as clean, lossless 4K SVGs and print-ready PDFs ideal for laser engraving, batiks, textiles, and coloring.',
        pillar3Title: 'Commercial Licensing (වාණිජ අයිතීන්)',
        pillar3Text: 'Empowering textile artisans, stationery creators, and digital designers with transparent commercial reproduction rights.',
      }),
    },
  });

  await prisma.websiteContent.upsert({
    where: { key: 'homepage_faq' },
    update: {
      content: JSON.stringify({
        items: [
          {
            question: 'What traditional Sri Lankan motifs are featured in this collection?',
            answer: 'Our collection includes authentic Sandakada Pahana (Moonstone) concentric rings with sacred swans (hansa), fire flames (gini dela), Nelum Mal (sacred lotus), Nil Manel (national blue water lily), and Kandyan Liya Wela (floral creeper vine filigree).',
          },
          {
            question: 'Can I use these designs for local batiks, laser-cutting, and merchandise?',
            answer: 'Yes! Designs marked with or purchased under Commercial License grant full rights for printing on apparel, traditional batiks, laser-cut woodwork, brass engravings, and greeting cards.',
          },
          {
            question: 'What file formats do I receive upon purchase?',
            answer: 'Every purchase includes infinite-resolution vector SVG (ideal for Illustrator, CorelDraw, and laser cutters), 300 DPI high-resolution PNG, and a ready-to-print vector PDF.',
          },
          {
            question: 'How do I print the Serenity Mandala Coloring Book PDFs?',
            answer: 'The PDFs are pre-formatted for standard A4 and US Letter sizes. You can print them on standard home printers or heavyweight watercolor/cardstock paper for colored pencils, markers, and paint.',
          },
          {
            question: 'Are free sample designs included?',
            answer: 'Yes! We offer authentic free Sri Lankan mandala designs including our Sacred White Lotus Harmony that you can download immediately with zero payment required.',
          },
        ],
      }),
    },
    create: {
      key: 'homepage_faq',
      section: 'faqs',
      content: JSON.stringify({
        items: [
          {
            question: 'What traditional Sri Lankan motifs are featured in this collection?',
            answer: 'Our collection includes authentic Sandakada Pahana (Moonstone) concentric rings with sacred swans (hansa), fire flames (gini dela), Nelum Mal (sacred lotus), Nil Manel (national blue water lily), and Kandyan Liya Wela (floral creeper vine filigree).',
          },
          {
            question: 'Can I use these designs for local batiks, laser-cutting, and merchandise?',
            answer: 'Yes! Designs marked with or purchased under Commercial License grant full rights for printing on apparel, traditional batiks, laser-cut woodwork, brass engravings, and greeting cards.',
          },
          {
            question: 'What file formats do I receive upon purchase?',
            answer: 'Every purchase includes infinite-resolution vector SVG (ideal for Illustrator, CorelDraw, and laser cutters), 300 DPI high-resolution PNG, and a ready-to-print vector PDF.',
          },
          {
            question: 'How do I print the Serenity Mandala Coloring Book PDFs?',
            answer: 'The PDFs are pre-formatted for standard A4 and US Letter sizes. You can print them on standard home printers or heavyweight watercolor/cardstock paper for colored pencils, markers, and paint.',
          },
          {
            question: 'Are free sample designs included?',
            answer: 'Yes! We offer authentic free Sri Lankan mandala designs including our Sacred White Lotus Harmony that you can download immediately with zero payment required.',
          },
        ],
      }),
    },
  });

  // 2. Add Sri Lankan Discount Codes
  console.log('[2/4] Seeding Sri Lankan Discount Codes...');
  const discountCodes = [
    {
      code: 'AYUBOWAN15',
      percentage: 15,
      minOrderAmount: 0,
      isActive: true,
      maxUses: 1000,
    },
    {
      code: 'CEYLON20',
      percentage: 20,
      minOrderAmount: 10,
      isActive: true,
      maxUses: 500,
    },
    {
      code: 'LANKA10',
      percentage: 10,
      minOrderAmount: 0,
      isActive: true,
      maxUses: 2000,
    },
  ];

  for (const disc of discountCodes) {
    await prisma.discountCode.upsert({
      where: { code: disc.code },
      update: disc,
      create: disc,
    });
  }

  // 3. Add or Update Sri Lankan Categories
  console.log('[3/4] Adding Sri Lankan Heritage Categories...');
  const slCategories = [
    {
      name: 'Moonstone & Temple Heritage (සඳකඩපහණ)',
      slug: 'ceylon-moonstone-heritage',
      description: 'Authentic Sandakada Pahana concentric rings, sacred swans (hansa), fire flames (gini dela), and Anuradhapura stone carvings.',
      coverImage: '/uploads/categories/ceylon-moonstone-heritage.svg',
      displayOrder: 1,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Sacred Lotus & Nil Manel (නෙළුම් මල්)',
      slug: 'sacred-lotus-nil-manel',
      description: 'Sacred Nelum Mal stone rosettes and Royal Nil Manel (Ceylon National Water Lily) radial symmetries.',
      coverImage: '/uploads/categories/sacred-lotus-nil-manel.svg',
      displayOrder: 2,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Kandyan Liya Wela & Filigree (ලියවැල)',
      slug: 'kandyan-liya-wela-filigree',
      description: 'Traditional Sinhala floral creeper vines, brass engraving mandalas, and royal palace filigree.',
      coverImage: '/uploads/categories/kandyan-liya-wela-filigree.svg',
      displayOrder: 3,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Temple Fresco Geometry (පුරාණ බිතුසිතුවම්)',
      slug: 'temple-fresco-geometry',
      description: 'Ceiling fresco patterns inspired by Dambulla Golden Rock Cave and Degaldoruwa Temple.',
      coverImage: '/uploads/categories/temple-fresco-geometry.svg',
      displayOrder: 4,
      isFeatured: true,
      isPublished: true,
    },
    {
      name: 'Island Nature & Wild Serendib (ලංකාදීප)',
      slug: 'island-nature-wild-serendib',
      description: 'Royal Peacock (Mayura) feathers, Ceylon tea highland radial ripples, and coastal waves.',
      coverImage: '/uploads/categories/island-nature-wild-serendib.svg',
      displayOrder: 5,
      isFeatured: true,
      isPublished: true,
    },
  ];

  const categoryMap = {};
  for (const cat of slCategories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = record.id;
  }

  // Also ensure original categories keep existing display orders adjusted
  await prisma.category.updateMany({
    where: { slug: 'floral-mandalas' },
    data: { displayOrder: 6 },
  });
  await prisma.category.updateMany({
    where: { slug: 'kids-coloring-designs' },
    data: { displayOrder: 7 },
  });

  // 4. Seed authentic Sri Lankan Artworks
  console.log('[4/4] Adding Sri Lankan Masterpiece Artworks...');
  const slArtworks = [
    {
      title: 'Sandakada Pahana (Sacred Moonstone Mandala)',
      slug: 'sandakada-pahana-sacred-moonstone',
      description: 'Magnificent recreation of the Anuradhapura Moonstone featuring the outer ring of flames (Gini Dela), the procession of sacred swans (Hansa Wandana), traditional Liya Wela floral vine, and the central 16-petal Sacred Lotus (Nelum Mal).',
      categorySlug: 'ceylon-moonstone-heritage',
      tags: JSON.stringify(['moonstone', 'sandakada pahana', 'anuradhapura', 'sri lanka', 'sacred geometry', 'temple']),
      difficulty: 'ADVANCED',
      previewImage: '/uploads/artworks/sandakada-pahana-moonstone.svg',
      originalFile: '/storage/private/artworks/sandakada-pahana-moonstone-original.svg',
      isFree: false,
      price: 6.99,
      license: 'COMMERCIAL',
      isPublished: true,
      isArchived: false,
      displayOrder: 1,
    },
    {
      title: 'Sacred White Lotus (Nelum Mal Rosette)',
      slug: 'sacred-white-lotus-nelum-mal',
      description: 'A 16-petal Sacred Lotus rosette inspired by the ancient stone pillars of Polonnaruwa and Anuradhapura. Symbolizes purity, enlightenment, and divine serenity. Free gift for all visitors.',
      categorySlug: 'sacred-lotus-nil-manel',
      tags: JSON.stringify(['lotus', 'nelum mal', 'sacred lotus', 'free', 'sri lanka', 'buddhist art']),
      difficulty: 'INTERMEDIATE',
      previewImage: '/uploads/artworks/sacred-lotus-nelum-mal.svg',
      originalFile: '/storage/private/artworks/sacred-lotus-nelum-mal-original.svg',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      isPublished: true,
      isArchived: false,
      displayOrder: 2,
    },
    {
      title: 'Royal Nil Manel Blossom (National Water Lily)',
      slug: 'royal-nil-manel-blossom',
      description: 'A 12-fold geometric radial mandala celebrating the Nil Manel (Blue Water Lily), the national flower of Sri Lanka. Features sharp lanceolate petals, concentric water ripple waves, and a golden stamen sunburst.',
      categorySlug: 'sacred-lotus-nil-manel',
      tags: JSON.stringify(['nil manel', 'water lily', 'national flower', 'sri lanka', 'blue lotus', 'serendib']),
      difficulty: 'INTERMEDIATE',
      previewImage: '/uploads/artworks/royal-nil-manel-blossom.svg',
      originalFile: '/storage/private/artworks/royal-nil-manel-blossom-original.svg',
      isFree: false,
      price: 4.99,
      license: 'COMMERCIAL',
      isPublished: true,
      isArchived: false,
      displayOrder: 3,
    },
    {
      title: 'Kandyan Liya Wela Symphony',
      slug: 'kandyan-liya-wela-symphony',
      description: 'Inspired by the royal wood carvings and brass filigree of the Temple of the Tooth (Sri Dalada Maligawa) in Kandy. Twelve interlocking Liya Wela creeper vines adorned with lotus buds.',
      categorySlug: 'kandyan-liya-wela-filigree',
      tags: JSON.stringify(['liya wela', 'kandy', 'filigree', 'creeper vine', 'brass', 'wood carving', 'dalada']),
      difficulty: 'ADVANCED',
      previewImage: '/uploads/artworks/kandyan-liya-wela-bloom.svg',
      originalFile: '/storage/private/artworks/kandyan-liya-wela-bloom-original.svg',
      isFree: false,
      price: 5.49,
      license: 'COMMERCIAL',
      isPublished: true,
      isArchived: false,
      displayOrder: 4,
    },
    {
      title: 'Ira-Handa (Royal Sun & Moon Celestial Mandala)',
      slug: 'ira-handa-royal-celestial-mandala',
      description: 'Ancient royal Sri Lankan emblem of the Sun and Moon (Ira-Handa) signifying eternity, sovereignty, and cosmic harmony. Features a 24-ray solar crown and crescent moon face.',
      categorySlug: 'temple-fresco-geometry',
      tags: JSON.stringify(['ira handa', 'sun and moon', 'celestial', 'royal flag', 'dambulla', 'fresco']),
      difficulty: 'INTERMEDIATE',
      previewImage: '/uploads/artworks/ira-handa-celestial.svg',
      originalFile: '/storage/private/artworks/ira-handa-celestial-original.svg',
      isFree: false,
      price: 3.99,
      license: 'COMMERCIAL',
      isPublished: true,
      isArchived: false,
      displayOrder: 5,
    },
    {
      title: 'Friendly Baby Tusker (Aliya) Mandala',
      slug: 'friendly-baby-tusker-aliya-mandala',
      description: 'Designed especially for kids and coloring lovers: eight friendly Sri Lankan elephants in festive Kandyan Perehara headwear (Netthi Malaya) surrounding a central lotus bloom.',
      categorySlug: 'kids-coloring-designs',
      tags: JSON.stringify(['kids', 'elephant', 'aliya', 'perehara', 'coloring page', 'sri lanka']),
      difficulty: 'BEGINNER',
      previewImage: '/uploads/artworks/kids-elephant-aliya.svg',
      originalFile: '/storage/private/artworks/kids-elephant-aliya-original.svg',
      isFree: true,
      price: 0.0,
      license: 'PERSONAL',
      isPublished: true,
      isArchived: false,
      displayOrder: 6,
    },
  ];

  for (const art of slArtworks) {
    let catId = categoryMap[art.categorySlug];
    if (!catId) {
      const found = await prisma.category.findUnique({ where: { slug: art.categorySlug } });
      catId = found ? found.id : Object.values(categoryMap)[0];
    }

    const { categorySlug, ...artData } = art;
    await prisma.artwork.upsert({
      where: { slug: art.slug },
      update: {
        ...artData,
        categoryId: catId,
      },
      create: {
        ...artData,
        categoryId: catId,
      },
    });
  }

  // Update a sample product title to celebrate the Ceylon theme
  const sampleProd = await prisma.product.findFirst({
    where: { slug: 'serenity-mandala-coloring-book' },
  });
  if (sampleProd) {
    await prisma.product.update({
      where: { id: sampleProd.id },
      data: {
        title: 'The Ceylon Serenity Collection: 20 Printable Mandalas PDF',
        description: 'A 20-page high-resolution printable coloring book featuring authentic Sri Lankan Moonstones, Sacred Lotus blossoms, and mindful radial patterns. Includes 300 DPI vector PDF.',
      },
    });
  }

  console.log('✅ SRI LANKAN THEME ENRICHMENT COMPLETE!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
