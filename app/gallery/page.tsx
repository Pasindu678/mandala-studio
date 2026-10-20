import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import SortSelect from '@/components/gallery/SortSelect';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

interface GalleryPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    type?: string; // 'free' | 'premium'
    sort?: string; // 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'title'
    q?: string;
    page?: string;
  }>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const currentCategorySlug = params.category || '';
  const currentDifficulty = params.difficulty || '';
  const currentType = params.type || '';
  const currentSort = params.sort || 'popular';
  const searchQuery = params.q || '';
  const currentPage = parseInt(params.page || '1', 10);
  const pageSize = 12;

  // Build Prisma where filter
  const where: any = {
    isPublished: true,
    isArchived: false,
  };

  if (currentCategorySlug) {
    where.category = { slug: currentCategorySlug };
  }

  if (currentDifficulty) {
    where.difficulty = currentDifficulty;
  }

  if (currentType === 'free') {
    where.isFree = true;
  } else if (currentType === 'premium') {
    where.isFree = false;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery } },
      { description: { contains: searchQuery } },
      { tags: { contains: searchQuery } },
    ];
  }

  // Build orderBy
  let orderBy: any = { viewsCount: 'desc' };
  if (currentSort === 'newest') {
    orderBy = { createdAt: 'desc' };
  } else if (currentSort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (currentSort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (currentSort === 'title') {
    orderBy = { title: 'asc' };
  } else if (currentSort === 'popular') {
    orderBy = { salesCount: 'desc' };
  }

  // Fetch data safely
  let categories: any[] = [];
  let artworks: any[] = [];
  let totalCount = 0;

  try {
    categories = await prisma.category.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { artworks: { where: { isPublished: true, isArchived: false } } },
        },
      },
    });

    totalCount = await prisma.artwork.count({ where });

    artworks = await prisma.artwork.findMany({
      where,
      orderBy,
      include: { category: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });
  } catch (err) {
    console.error('Gallery database query error:', err);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Active category object if filtered
  const activeCategory = categories.find((c) => c.slug === currentCategorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white border border-[#D4AF37]/60 text-xs font-bold text-[#72121E] shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>🇱🇰 Ceylon Sacred Art & Contemporary Mandalas</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#181512]">
          {activeCategory ? activeCategory.name : 'Sacred Mandala Gallery'}
        </h1>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {activeCategory 
            ? activeCategory.description 
            : 'Explore hundreds of authentic Sri Lankan Moonstone carvings, sacred lotus blooms, Kandyan filigree, and contemporary geometric designs for print and screen.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E1D5] shadow-xs space-y-4">
        
        {/* Search input and Sort select */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form method="GET" action="/gallery" className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#8B6B1B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search by title, lotus, moonstone, liya wela..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#E8E1D5] bg-[#FAF6EF] text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-colors"
            />
            {currentCategorySlug && <input type="hidden" name="category" value={currentCategorySlug} />}
            {currentDifficulty && <input type="hidden" name="difficulty" value={currentDifficulty} />}
            {currentType && <input type="hidden" name="type" value={currentType} />}
            {currentSort && <input type="hidden" name="sort" value={currentSort} />}
          </form>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sort by:</span>
            <SortSelect defaultValue={currentSort} />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-3 border-t border-[#E8E1D5]/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B6B1B] mr-2">
            Themes:
          </span>

          <Link
            href={`/gallery${currentSort ? `?sort=${currentSort}` : ''}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              !currentCategorySlug
                ? 'bg-[#72121E] text-[#D4AF37] border-[#D4AF37] shadow-xs font-bold'
                : 'bg-[#FAF6EF] text-[#4A443E] border-[#E8E1D5] hover:border-[#D4AF37]'
            }`}
          >
            All Themes ({categories.reduce((a, c) => a + c._count.artworks, 0)})
          </Link>

          {categories.map((cat) => {
            const isSelected = currentCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/gallery?category=${cat.slug}${currentSort ? `&sort=${currentSort}` : ''}${currentDifficulty ? `&difficulty=${currentDifficulty}` : ''}${currentType ? `&type=${currentType}` : ''}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                  isSelected
                    ? 'bg-[#72121E] text-[#D4AF37] border-[#D4AF37] shadow-xs font-bold'
                    : 'bg-[#FAF6EF] text-[#4A443E] border-[#E8E1D5] hover:border-[#D4AF37]'
                }`}
              >
                {cat.name} ({cat._count.artworks})
              </Link>
            );
          })}
        </div>

        {/* Secondary Filters: Difficulty & Free/Paid */}
        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-gray-500">Difficulty:</span>
            {['', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((diff) => (
              <Link
                key={diff || 'all'}
                href={`/gallery?${new URLSearchParams({
                  ...(currentCategorySlug && { category: currentCategorySlug }),
                  ...(diff && { difficulty: diff }),
                  ...(currentType && { type: currentType }),
                  ...(currentSort && { sort: currentSort }),
                  ...(searchQuery && { q: searchQuery }),
                }).toString()}`}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                  currentDifficulty === diff
                    ? 'bg-[#1C4E2D] text-white border-[#1C4E2D]'
                    : 'bg-[#FAF6EF] text-gray-600 border-[#E8E1D5] hover:border-[#D4AF37]'
                }`}
              >
                {diff ? diff.toLowerCase() : 'all'}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-gray-500">Pricing:</span>
            {['', 'free', 'premium'].map((t) => (
              <Link
                key={t || 'all'}
                href={`/gallery?${new URLSearchParams({
                  ...(currentCategorySlug && { category: currentCategorySlug }),
                  ...(currentDifficulty && { difficulty: currentDifficulty }),
                  ...(t && { type: t }),
                  ...(currentSort && { sort: currentSort }),
                  ...(searchQuery && { q: searchQuery }),
                }).toString()}`}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                  currentType === t
                    ? 'bg-[#72121E] text-white border-[#D4AF37]/50'
                    : 'bg-[#FAF6EF] text-gray-600 border-[#E8E1D5] hover:border-[#D4AF37]'
                }`}
              >
                {t ? (t === 'free' ? 'Free Gifts Only' : 'Premium Suites') : 'all'}
              </Link>
            ))}
          </div>

          {/* Reset Filters */}
          {(currentCategorySlug || currentDifficulty || currentType || searchQuery) && (
            <Link
              href="/gallery"
              className="inline-flex items-center space-x-1 text-[#72121E] hover:underline font-bold ml-auto"
            >
              <X className="w-3.5 h-3.5 text-[#72121E]" />
              <span>Reset filters</span>
            </Link>
          )}
        </div>

      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-600 px-1">
        <span>
          Showing <strong>{artworks.length}</strong> of <strong>{totalCount}</strong> artworks
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Gallery Grid */}
      {artworks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E1D5] p-16 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FDF6E2] text-[#8B6B1B] flex items-center justify-center mx-auto border border-[#D4AF37]/40">
            <SlidersHorizontal className="w-8 h-8 opacity-70" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#181512]">No designs found</h3>
          <p className="text-xs text-gray-600">
            We couldn't find any mandala artwork matching your current filter criteria.
          </p>
          <Link
            href="/gallery"
            className="inline-block mt-2 px-6 py-2 rounded-full bg-[#72121E] text-white text-xs font-semibold hover:bg-[#851624] border border-[#D4AF37]/40 transition-colors"
          >
            Clear All Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <ArtworkCard
              key={art.id}
              id={art.id}
              title={art.title}
              slug={art.slug}
              previewImage={art.previewImage}
              categoryName={art.category.name}
              categorySlug={art.category.slug}
              difficulty={art.difficulty}
              isFree={art.isFree}
              price={art.price}
              license={art.license}
              salesCount={art.salesCount}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-8 flex items-center justify-center space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === currentPage;
            const query = new URLSearchParams({
              ...(currentCategorySlug && { category: currentCategorySlug }),
              ...(currentDifficulty && { difficulty: currentDifficulty }),
              ...(currentType && { type: currentType }),
              ...(currentSort && { sort: currentSort }),
              ...(searchQuery && { q: searchQuery }),
              page: pageNum.toString(),
            }).toString();

            return (
              <Link
                key={pageNum}
                href={`/gallery?${query}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold transition-colors border ${
                  isCurrent
                    ? 'bg-[#72121E] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-white border-[#E8E1D5] text-[#181512] hover:bg-[#FAF6EF]'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
