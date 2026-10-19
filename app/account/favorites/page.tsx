import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import { Heart, ArrowLeft } from 'lucide-react';


export default async function CustomerFavoritesPage() {
  const session = await getCurrentUser();
  if (!session) redirect('/login');

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      artwork: {
        include: { category: true },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#D08C51] uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Saved Inspiration</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            My Favorite Mandalas ({favorites.length})
          </h1>
        </div>
        <Link
          href="/account"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-16 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#D08C51] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">No Favorites Saved Yet</h2>
          <p className="text-xs text-gray-500">
            Click the heart icon on any artwork in the gallery to save it to your personal collection.
          </p>
          <Link
            href="/gallery"
            className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold transition-colors"
          >
            Explore Gallery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <ArtworkCard
              key={fav.artwork.id}
              id={fav.artwork.id}
              title={fav.artwork.title}
              slug={fav.artwork.slug}
              previewImage={fav.artwork.previewImage}
              categoryName={fav.artwork.category.name}
              difficulty={fav.artwork.difficulty}
              isFree={fav.artwork.isFree}
              price={fav.artwork.price}
              license={fav.artwork.license}
              salesCount={fav.artwork.salesCount}
              initialFavorited={true}
            />
          ))}
        </div>
      )}

    </div>
  );
}
