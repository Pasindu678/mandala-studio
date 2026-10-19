import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      artworks: {
        where: { isPublished: true, isArchived: false },
        orderBy: { displayOrder: 'asc' },
        include: { category: true },
      },
    },
  });

  if (!category || !category.isPublished) {
    notFound();
  }

  // Other categories for exploration
  const otherCategories = await prisma.category.findMany({
    where: { isPublished: true, id: { not: category.id } },
    orderBy: { displayOrder: 'asc' },
    take: 5,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#72121E]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/gallery" className="hover:text-[#72121E]">Gallery</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-[#181512]">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37]/50 p-8 md:p-12 shadow-xs flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-[#FAF6EF] p-4 border border-[#E8E1D5] shrink-0 flex items-center justify-center">
          {category.coverImage && (
            <img
              src={category.coverImage}
              alt={category.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FDF6E2] text-[#8B6B1B] border border-[#D4AF37]/60 text-xs font-bold">
            <span>🇱🇰 Sri Lankan Heritage Theme</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181512]">
            {category.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
            {category.description || 'Discover handpicked designs in this sacred geometry collection.'}
          </p>
          <div className="pt-2 text-xs text-[#1C4E2D] font-bold">
            {category.artworks.length} Designs available in high-res vector &amp; printable formats
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#181512]">
            Artworks in {category.name}
          </h2>
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#72121E] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse all themes</span>
          </Link>
        </div>

        {category.artworks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E1D5] p-12 text-center text-gray-500">
            No artworks currently published in this category. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.artworks.map((art) => (
              <ArtworkCard
                key={art.id}
                id={art.id}
                title={art.title}
                slug={art.slug}
                previewImage={art.previewImage}
                categoryName={category.name}
                categorySlug={category.slug}
                difficulty={art.difficulty}
                isFree={art.isFree}
                price={art.price}
                license={art.license}
                salesCount={art.salesCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* Explore More Categories */}
      <div className="pt-8 border-t border-[#E8E1D5]">
        <h3 className="font-serif text-lg font-bold text-[#181512] mb-4">
          Explore Other Themes
        </h3>
        <div className="flex flex-wrap gap-3">
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="px-4 py-2 rounded-full bg-white border border-[#E8E1D5] hover:border-[#D4AF37] text-xs font-semibold text-[#181512] hover:text-[#72121E] transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
