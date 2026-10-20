import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import ProductCard from '@/components/shop/ProductCard';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import { Sparkles, ShieldCheck, Search } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{
    type?: string;
    q?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentType = params.type || '';
  const searchQuery = params.q || '';

  // Products filter
  const productWhere: any = { isPublished: true };
  if (currentType && currentType !== 'INDIVIDUAL_ARTWORK') {
    productWhere.productType = currentType;
  }
  if (searchQuery) {
    productWhere.OR = [
      { title: { contains: searchQuery } },
      { description: { contains: searchQuery } },
    ];
  }

  let products: any[] = [];
  let premiumArtworks: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: productWhere,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { artworks: true },
        },
      },
    });

    // If "INDIVIDUAL_ARTWORK" or "All" is selected, also fetch premium individual artworks
    if (!currentType || currentType === 'INDIVIDUAL_ARTWORK') {
      const artWhere: any = {
        isPublished: true,
        isArchived: false,
        isFree: false,
      };
      if (searchQuery) {
        artWhere.OR = [
          { title: { contains: searchQuery } },
          { description: { contains: searchQuery } },
        ];
      }
      premiumArtworks = await prisma.artwork.findMany({
        where: artWhere,
        include: { category: true },
        orderBy: { salesCount: 'desc' },
        take: 8,
      });
    }
  } catch (err) {
    console.error('ShopPage database query error:', err);
  }

  const productTypes = [
    { key: '', label: 'All Products' },
    { key: 'COLORING_BOOK_PDF', label: 'Coloring Book PDFs' },
    { key: 'THEMED_BUNDLE', label: 'Themed Bundles' },
    { key: 'PREMIUM_COLLECTION', label: 'Collector Editions' },
    { key: 'INDIVIDUAL_ARTWORK', label: 'Individual Designs' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#72121E] via-[#540D16] to-[#181512] text-white rounded-3xl p-8 sm:p-14 shadow-lg border-2 border-[#D4AF37]/50 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>🇱🇰 Ceylon Heritage &amp; Commercial Digital Store</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Coloring Books &amp; Digital Bundles
          </h1>
          <p className="text-sm sm:text-base text-[#FAF6EF]/90 leading-relaxed">
            Ready-to-print 20-page PDF coloring books, infinite-resolution vector packages, and complete commercial bundles for creators, publishers, and relaxation enthusiasts.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37]/40 text-center space-y-2 max-w-xs shadow-xs">
          <ShieldCheck className="w-8 h-8 text-[#D4AF37] mx-auto" />
          <h4 className="text-sm font-bold text-white">Commercial Rights Available</h4>
          <p className="text-xs text-[#FAF6EF]/80">
            Publish your own physical books, print-on-demand batiks, textiles, or laser woodwork products.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E1D5]">
        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {productTypes.map((pt) => {
            const isSelected = currentType === pt.key;
            return (
              <Link
                key={pt.key}
                href={`/shop?type=${pt.key}${searchQuery ? `&q=${searchQuery}` : ''}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${
                  isSelected
                    ? 'bg-[#72121E] text-[#D4AF37] border-[#D4AF37] shadow-xs'
                    : 'bg-[#FAF6EF] text-[#4A443E] border-[#E8E1D5] hover:border-[#D4AF37]'
                }`}
              >
                {pt.label}
              </Link>
            );
          })}
        </div>

        {/* Search Input */}
        <form method="GET" action="/shop" className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8B6B1B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search bundles & books..."
            className="w-full pl-9 pr-3 py-1.5 rounded-full border border-[#E8E1D5] text-xs bg-[#FAF6EF] focus:outline-none focus:border-[#D4AF37]"
          />
          {currentType && <input type="hidden" name="type" value={currentType} />}
        </form>
      </div>

      {/* Bundles & PDF Books Section */}
      {products.length > 0 && currentType !== 'INDIVIDUAL_ARTWORK' && (
        <div className="space-y-6">
          <div className="border-b border-[#E8E1D5] pb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#181512]">
              Curated Bundles &amp; Coloring Books ({products.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                title={prod.title}
                slug={prod.slug}
                description={prod.description}
                coverImage={prod.coverImage}
                price={prod.price}
                currency={prod.currency}
                productType={prod.productType}
                license={prod.license}
                includedArtworksCount={prod._count.artworks}
              />
            ))}
          </div>
        </div>
      )}

      {/* Individual Premium Designs Section */}
      {premiumArtworks.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="border-b border-[#E8E1D5] pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#181512]">
                Individual Heritage &amp; Contemporary Designs
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Each design includes infinite vector SVG, 4K transparent PNG, and print-ready PDF.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-bold text-[#72121E] hover:underline"
            >
              Browse entire gallery ({">"}24 designs) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumArtworks.map((art) => (
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
      )}

      {products.length === 0 && premiumArtworks.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E1D5] p-16 text-center text-gray-500">
          No commercial products found matching your search.
        </div>
      )}

    </div>
  );
}
