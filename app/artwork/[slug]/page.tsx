import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import ArtworkActions from '@/components/artwork/ArtworkActions';
import { ChevronRight, ArrowLeft, Tag, Layers, Compass, Eye } from 'lucide-react';

interface ArtworkDetailPageProps {
  params: Promise<{ slug: string }>;
}


export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { slug } = await params;

  const artwork = await prisma.artwork.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!artwork || !artwork.isPublished || artwork.isArchived) {
    notFound();
  }

  // Increment views count asynchronously
  await prisma.artwork.update({
    where: { id: artwork.id },
    data: { viewsCount: { increment: 1 } },
  }).catch(() => {});

  let tags: string[] = [];
  try {
    tags = JSON.parse(artwork.tags);
  } catch {
    tags = [];
  }

  // Related artworks in the same category
  const relatedArtworks = await prisma.artwork.findMany({
    where: {
      categoryId: artwork.categoryId,
      isPublished: true,
      isArchived: false,
      id: { not: artwork.id },
    },
    include: { category: true },
    orderBy: { viewsCount: 'desc' },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#1A1A1A]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/gallery" className="hover:text-[#1A1A1A]">Gallery</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${artwork.category.slug}`} className="hover:text-[#1A1A1A]">
          {artwork.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#1A1A1A] truncate max-w-xs">{artwork.title}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Large Preview Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E8E4DC] p-8 sm:p-12 shadow-sm flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-8 rounded-full border border-dashed border-[#E8E4DC] pointer-events-none" />
            
            <img
              src={artwork.previewImage}
              alt={artwork.title}
              className="w-full max-h-[520px] object-contain transition-transform duration-500 group-hover:scale-105"
            />

            {/* Quick Preview Badge */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#E8E4DC] text-[11px] font-semibold text-gray-600 flex items-center space-x-1.5 shadow-2xs">
              <Eye className="w-3.5 h-3.5 text-[#8B7EC8]" />
              <span>{artwork.viewsCount + 1} Views</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 px-2">
            <span>High-precision mathematical vector rendering</span>
            <span>Dimensions: Scalable Vector</span>
          </div>
        </div>

        {/* Right Column: Title, Metadata, Pricing, Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Link
                href={`/categories/${artwork.category.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-[#8B7EC8] hover:underline"
              >
                {artwork.category.name}
              </Link>
              <span className="text-gray-300">•</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF0E6] text-[#D08C51] border border-[#E8C5A8]">
                {artwork.difficulty.toLowerCase()} level
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] leading-tight">
              {artwork.title}
            </h1>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {artwork.description || 'A timeless mandala pattern meticulously architected with radial symmetry and meditative sacred proportions.'}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center pt-1">
              <Tag className="w-3.5 h-3.5 text-gray-400 mr-1" />
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E4DC] text-[11px] text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interactive Actions (Add to Cart / Free Download / Favorites) */}
          <ArtworkActions
            artwork={{
              id: artwork.id,
              title: artwork.title,
              slug: artwork.slug,
              previewImage: artwork.previewImage,
              isFree: artwork.isFree,
              price: artwork.price,
              license: artwork.license,
              difficulty: artwork.difficulty,
            }}
          />

        </div>

      </div>

      {/* Related Designs Section */}
      {relatedArtworks.length > 0 && (
        <div className="pt-12 border-t border-[#E8E4DC] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Related Designs in {artwork.category.name}
            </h2>
            <Link
              href={`/categories/${artwork.category.slug}`}
              className="text-xs font-semibold text-[#8B7EC8] hover:underline"
            >
              View all {artwork.category.name} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedArtworks.map((art) => (
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
        </div>
      )}

    </div>
  );
}
