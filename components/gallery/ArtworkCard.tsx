'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Download, Check } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

export interface ArtworkCardProps {
  id: string;
  title: string;
  slug: string;
  previewImage: string;
  categoryName: string;
  categorySlug?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
  isFree: boolean;
  price: number;
  license: string;
  salesCount?: number;
  initialFavorited?: boolean;
}

export default function ArtworkCard({
  id,
  title,
  slug,
  previewImage,
  categoryName,
  difficulty,
  isFree,
  price,
  license,
  initialFavorited = false,
}: ArtworkCardProps) {
  const { addItem, isInCart } = useCart();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [justAdded, setJustAdded] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !favorited;
    setFavorited(nextState);

    try {
      await fetch('/api/favorites', {
        method: nextState ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: id }),
      });
    } catch {
      // Ignore
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      type: 'artwork',
      title,
      price: isFree ? 0 : price,
      image: previewImage,
      license,
      isFree,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const difficultyColors = {
    BEGINNER: 'bg-[#EBF5EE] text-[#1C4E2D] border-[#A3D9B5]',
    INTERMEDIATE: 'bg-[#FDF6E2] text-[#8B6B1B] border-[#D4AF37]/60',
    ADVANCED: 'bg-[#FDF1F3] text-[#72121E] border-[#F0B2BA]',
  }[difficulty] || 'bg-gray-100 text-gray-700 border-gray-200';

  const inCart = isInCart(id);

  return (
    <div className="group bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Artwork Image Container */}
      <div className="relative aspect-square w-full bg-[#FAF6EF] p-6 flex items-center justify-center overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute inset-4 rounded-full border border-dashed border-[#D4AF37]/40 group-hover:scale-105 transition-transform duration-500" />
        
        <img
          src={previewImage}
          alt={title}
          className="relative z-10 w-full h-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5">
          {isFree ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C4E2D] text-white shadow-xs">
              Free Gift
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#72121E] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs">
              ${price.toFixed(2)}
            </span>
          )}

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${difficultyColors}`}>
            {difficulty.toLowerCase()}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-200 ${
            favorited
              ? 'bg-[#FDF1F3] text-[#72121E] shadow-sm'
              : 'bg-white/90 text-gray-400 hover:text-[#72121E] hover:bg-white shadow-xs'
          }`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 z-15 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <Link
            href={`/artwork/${slug}`}
            className="pointer-events-auto px-4 py-2 rounded-full bg-white/95 text-[#181512] text-xs font-semibold shadow-md hover:bg-[#72121E] hover:text-white transition-colors flex items-center space-x-1.5 border border-[#D4AF37]/40"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white border-t border-[#E8E1D5]">
        <div>
          <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[#8B6B1B] mb-1">
            {categoryName}
          </div>
          <Link href={`/artwork/${slug}`}>
            <h3 className="font-serif text-base font-bold text-[#181512] group-hover:text-[#72121E] transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">License</span>
            <span className="text-xs font-semibold text-[#181512]">
              {license === 'COMMERCIAL' ? 'Commercial Rights' : 'Personal Use'}
            </span>
          </div>

          <div>
            {isFree ? (
              <Link
                href={`/artwork/${slug}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#EBF5EE] text-[#1C4E2D] hover:bg-[#1C4E2D] hover:text-white transition-colors border border-[#1C4E2D]/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Claim Free</span>
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={inCart && !justAdded}
                className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  inCart
                    ? 'bg-[#EBF5EE] text-[#1C4E2D] border border-[#1C4E2D]/30'
                    : 'bg-[#72121E] text-white hover:bg-[#851624] border border-[#D4AF37]/50 shadow-xs'
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
