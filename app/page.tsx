import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Palette, 
  Layers, 
  Compass, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default async function HomePage() {
  // Fetch CMS Dynamic Content
  const heroContentRecord = await prisma.websiteContent.findUnique({
    where: { key: 'homepage_hero' },
  });
  const bannerContentRecord = await prisma.websiteContent.findUnique({
    where: { key: 'homepage_banner' },
  });
  const aboutContentRecord = await prisma.websiteContent.findUnique({
    where: { key: 'homepage_about' },
  });
  const faqContentRecord = await prisma.websiteContent.findUnique({
    where: { key: 'homepage_faq' },
  });

  const heroData = heroContentRecord ? JSON.parse(heroContentRecord.content) : {
    headline: 'Discover the Sacred Mandalas of Ceylon',
    subheadline: 'Immerse yourself in authentic Moonstone (Sandakada Pahana) geometry, sacred Lotus rosettes, Kandyan liya wela filigree, and printable coloring books.',
    ctaText: 'Explore Heritage Gallery',
    ctaLink: '/gallery',
    secondaryCtaText: 'Coloring Books & Bundles',
    secondaryCtaLink: '/shop',
    heroImage: '/uploads/artworks/sandakada-pahana-moonstone.svg',
    badgeText: '🇱🇰 Ceylon Heritage & Sacred Geometry • ශ්‍රී ලාංකීය උරුමය'
  };

  const bannerData = bannerContentRecord ? JSON.parse(bannerContentRecord.content) : null;
  const aboutData = aboutContentRecord ? JSON.parse(aboutContentRecord.content) : null;
  const faqData = faqContentRecord ? JSON.parse(faqContentRecord.content) : { items: [] };

  // Fetch Categories
  const categories = await prisma.category.findMany({
    where: { isPublished: true },
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: {
        select: { artworks: { where: { isPublished: true, isArchived: false } } },
      },
    },
    take: 8,
  });

  // Fetch Featured Artwork
  const featuredArtworks = await prisma.artwork.findMany({
    where: { isPublished: true, isArchived: false },
    orderBy: { displayOrder: 'asc' },
    include: { category: true },
    take: 8,
  });

  // Fetch Best-Selling / Popular Artwork (real data from database)
  const bestSellers = await prisma.artwork.findMany({
    where: { isPublished: true, isArchived: false },
    orderBy: { salesCount: 'desc' },
    include: { category: true },
    take: 4,
  });

  // Fetch Featured Collections
  const collections = await prisma.collection.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { displayOrder: 'asc' },
    include: {
      artworks: {
        include: { artwork: true },
        take: 3,
      },
    },
    take: 3,
  });

  // Fetch Featured Products (Coloring books & bundles)
  const products = await prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return (
    <div className="space-y-20 pb-20">
      
      {/* Promotional Sri Lankan Heritage Banner */}
      {bannerData && bannerData.isActive && (
        <aside aria-label="Promotional Announcement" className="bg-[#72121E] text-white py-2.5 px-4 text-xs font-medium text-center border-b border-[#D4AF37]/50 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#181512] text-[10.5px] font-bold uppercase tracking-wider shadow-2xs">
              {bannerData.badge || 'CEYLON ARTISAN'}
            </span>
            <span className="text-[#FAF6EF]">{bannerData.message}</span>
            {bannerData.discountCode && (
              <span className="font-mono bg-[#FFFDF9] text-[#72121E] border border-[#D4AF37] px-2 py-0.5 rounded font-bold shadow-2xs">
                {bannerData.discountCode}
              </span>
            )}
            {bannerData.linkUrl && (
              <Link
                href={bannerData.linkUrl}
                className="underline hover:text-[#D4AF37] transition-colors ml-2 font-semibold"
              >
                {bannerData.linkText || 'Learn More'} →
              </Link>
            )}
          </div>
        </aside>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-[#D4AF37]/70 shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#72121E]">
                  {heroData.badgeText || '🇱🇰 Ceylon Heritage & Sacred Geometry • ශ්‍රී ලාංකීය උරුමය'}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#181512] leading-[1.14]">
                {heroData.headline}
              </h1>

              <p className="text-base sm:text-lg text-[#4A443E] max-w-2xl leading-relaxed">
                {heroData.subheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href={heroData.ctaLink || '/gallery'}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-[#72121E] hover:bg-[#851624] text-white font-semibold text-sm shadow-md border border-[#D4AF37]/60 transition-all group"
                >
                  <span>{heroData.ctaText || 'Explore Heritage Gallery'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={heroData.secondaryCtaLink || '/shop'}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-full bg-white hover:bg-[#FDF6E2] text-[#72121E] font-semibold text-sm border border-[#D4AF37]/70 shadow-xs transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#1C4E2D]" />
                  <span>{heroData.secondaryCtaText || 'Coloring Books & Bundles'}</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E8E1D5] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#6B645C]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1C4E2D]" />
                  <span>Authentic Moonstone & Lotus Carvings</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1C4E2D]" />
                  <span>Infinite 4K Vector SVG & PDFs</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1C4E2D]" />
                  <span>Free Samples Included</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Artwork Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px]">
                {/* Ambient glow & decorative rings */}
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl animate-pulse" />
                <div className="absolute -inset-4 rounded-full border border-dashed border-[#D4AF37]/60 animate-spin" style={{ animationDuration: '70s' }} />
                
                {/* Central Mandala Display */}
                <div className="relative w-full h-full rounded-3xl bg-white p-6 shadow-xl border-2 border-[#D4AF37]/70 flex items-center justify-center overflow-hidden">
                  <img
                    src={heroData.heroImage || '/uploads/artworks/sandakada-pahana-moonstone.svg'}
                    alt="Featured Sri Lankan Mandala"
                    className="w-full h-full object-contain filter drop-shadow-md hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs py-2 px-3.5 rounded-xl border border-[#D4AF37]/60 flex items-center justify-between text-xs shadow-xs">
                    <span className="font-semibold text-[#181512]">Sandakada Pahana Masterpiece</span>
                    <span className="text-[#72121E] font-bold">Vector SVG + 300 DPI</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B1B]">
              Heritage & Contemporary Themes • පාරම්පරික මෝස්තර
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#181512] mt-1">
              Explore Popular Categories
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-[#72121E] hover:text-[#851624] mt-3 md:mt-0 transition-colors"
          >
            <span>View all categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group p-5 bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FAF6EF] p-2 border border-[#E8E1D5] mb-4 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                {cat.coverImage ? (
                  <img
                    src={cat.coverImage}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Palette className="w-8 h-8 text-[#D4AF37]" />
                )}
              </div>
              <h3 className="font-serif text-base font-bold text-[#181512] group-hover:text-[#72121E] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {cat.description}
              </p>
              <span className="mt-3 text-[11px] font-semibold text-[#1C4E2D] bg-[#EBF5EE] border border-[#1C4E2D]/20 px-2.5 py-0.5 rounded-full">
                {cat._count.artworks} Artworks
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Artwork Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B1B]">
              Curated Heritage Selection • විශිෂ්ට නිර්මාණ
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#181512] mt-1">
              Featured Mandala Artworks
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-[#72121E] hover:text-[#851624] mt-3 md:mt-0 transition-colors"
          >
            <span>Explore full gallery</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtworks.map((art) => (
            <ArtworkCard
              key={art.id}
              id={art.id}
              title={art.title}
              slug={art.slug}
              previewImage={art.previewImage}
              categoryName={art.category.name}
              difficulty={art.difficulty}
              isFree={art.isFree}
              price={art.price}
              license={art.license}
              salesCount={art.salesCount}
            />
          ))}
        </div>
      </section>

      {/* Best-Sellers & Popular Products */}
      <section className="bg-white py-16 border-y border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C4E2D]">
                Proven Favorites • වැඩිපුරම ඇණවුම් කළ නිර්මාණ
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#181512] mt-1">
                Best-Selling Designs
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Cherished by meditation lovers, batik artisans, and commercial designers worldwide
              </p>
            </div>
            <Link
              href="/gallery?sort=popular"
              className="inline-flex items-center space-x-1 text-sm font-semibold text-[#72121E] hover:text-[#851624] mt-3 md:mt-0 transition-colors"
            >
              <span>See most popular</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((art) => (
              <ArtworkCard
                key={art.id}
                id={art.id}
                title={art.title}
                slug={art.slug}
                previewImage={art.previewImage}
                categoryName={art.category.name}
                difficulty={art.difficulty}
                isFree={art.isFree}
                price={art.price}
                license={art.license}
                salesCount={art.salesCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Commercial Products & Coloring Book Bundles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B1B]">
              Printable Coloring Books & Commercial Suites • පොත් සහ මිටි
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#181512] mt-1">
              Coloring Books & Design Bundles
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-[#72121E] hover:text-[#851624] mt-3 md:mt-0 transition-colors"
          >
            <span>Visit complete shop</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-4 bg-[#FAF6EF] aspect-4/3 flex items-center justify-center overflow-hidden relative">
                <img
                  src={prod.coverImage}
                  alt={prod.title}
                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-[#72121E] text-[#D4AF37] border border-[#D4AF37]/50 uppercase tracking-wider">
                  {prod.productType.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#181512] line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-lg font-bold font-serif text-[#181512]">
                    ${prod.price.toFixed(2)}
                  </span>
                  <Link
                    href={`/shop`}
                    className="px-4 py-1.5 rounded-full bg-[#72121E] hover:bg-[#851624] text-white text-xs font-semibold border border-[#D4AF37]/50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Themed Collections */}
      {collections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B1B]">
              Curated Ceylon Suites • පාරම්පරික කට්ටල
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#181512] mt-1">
              Featured Artwork Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-[#72121E] uppercase tracking-wider bg-[#FDF1F3] border border-[#72121E]/20 px-2.5 py-0.5 rounded-full">
                      Heritage Suite
                    </span>
                    {col.price && (
                      <span className="text-sm font-bold text-[#181512]">
                        ${col.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#181512]">
                    {col.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {col.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center space-x-2">
                  {col.artworks.map((item) => (
                    <div
                      key={item.artwork.id}
                      className="w-14 h-14 rounded-xl bg-[#FAF6EF] p-1 border border-[#E8E1D5] overflow-hidden"
                    >
                      <img
                        src={item.artwork.previewImage}
                        alt={item.artwork.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>

                <Link
                  href="/gallery"
                  className="mt-6 inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl border border-[#D4AF37] hover:bg-[#72121E] hover:text-white text-xs font-semibold text-[#72121E] transition-colors"
                >
                  <span>Explore Artworks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About Section */}
      {aboutData && (
        <section id="about" className="bg-[#FDF6E2]/50 py-20 border-y border-[#E8E1D5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B1B]">
                Our Living Heritage • අපේ උරුමය
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181512]">
                {aboutData.title}
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                {aboutData.body}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#8B6B1B] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[#8B6B1B]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181512]">
                  {aboutData.pillar1Title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {aboutData.pillar1Text}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#1C4E2D]/20 text-[#1C4E2D] flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#1C4E2D]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181512]">
                  {aboutData.pillar2Title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {aboutData.pillar2Text}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#72121E]/20 text-[#72121E] flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#72121E]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#181512]">
                  {aboutData.pillar3Title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {aboutData.pillar3Text}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion Section */}
      {faqData.items && faqData.items.length > 0 && (
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B1B]">
              Help & Information • විමසීම් සහ සහය
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#181512]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.items.map((faq: { question: string; answer: string }, idx: number) => (
              <details
                key={idx}
                className="group bg-white rounded-xl border border-[#E8E1D5] p-5 shadow-2xs transition-all open:border-[#D4AF37]"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-sm text-[#181512] group-open:text-[#72121E]">
                  <span>{faq.question}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
