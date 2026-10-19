'use client';

import React, { useState } from 'react';
import { ShoppingBag, Download, Check, Heart, Shield, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

interface ArtworkActionsProps {
  artwork: {
    id: string;
    title: string;
    slug: string;
    previewImage: string;
    isFree: boolean;
    price: number;
    license: string;
    difficulty: string;
  };
}

export default function ArtworkActions({ artwork }: ArtworkActionsProps) {
  const { addItem, isInCart } = useCart();
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const inCart = isInCart(artwork.id);

  const handleAddToCart = () => {
    addItem({
      id: artwork.id,
      type: 'artwork',
      title: artwork.title,
      price: artwork.isFree ? 0 : artwork.price,
      image: artwork.previewImage,
      license: artwork.license,
      isFree: artwork.isFree,
    });
  };

  const handleDownloadFree = async () => {
    setDownloading(true);
    try {
      // Direct download of free vector SVG
      const link = document.createElement('a');
      link.href = artwork.previewImage;
      link.download = `${artwork.slug}-vector.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      //
    } finally {
      setDownloading(false);
    }
  };

  const toggleFavorite = async () => {
    const next = !favorited;
    setFavorited(next);
    try {
      await fetch('/api/favorites', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: artwork.id }),
      });
    } catch {
      //
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Price & Status Display */}
      <div className="flex items-baseline space-x-3">
        {artwork.isFree ? (
          <div>
            <span className="font-serif text-3xl font-bold text-[#1C4E2D]">Free Heritage Gift</span>
            <span className="ml-2 text-xs text-gray-500 font-medium">Complimentary personal license</span>
          </div>
        ) : (
          <div>
            <span className="font-serif text-3xl font-bold text-[#181512]">${artwork.price.toFixed(2)}</span>
            <span className="ml-2 text-xs text-[#8B6B1B] uppercase tracking-wider font-bold">USD</span>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {artwork.isFree ? (
          <button
            onClick={handleDownloadFree}
            disabled={downloading}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-4 px-6 rounded-full bg-[#1C4E2D] hover:bg-[#143820] text-white font-semibold text-sm shadow-md border border-[#D4AF37]/40 transition-all"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Downloaded Successfully!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Download Free Vector</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`flex-1 inline-flex items-center justify-center space-x-2 py-4 px-6 rounded-full font-semibold text-sm shadow-md border border-[#D4AF37]/50 transition-all ${
              inCart
                ? 'bg-[#EBF5EE] text-[#1C4E2D] border-[#1C4E2D]/40'
                : 'bg-[#72121E] hover:bg-[#851624] text-white'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4 text-[#1C4E2D]" />
                <span>Added to Shopping Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>Add Design to Cart</span>
              </>
            )}
          </button>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`px-4 py-4 rounded-full border border-[#E8E1D5] transition-colors flex items-center justify-center ${
            favorited ? 'bg-[#FDF1F3] text-[#72121E] border-[#72121E]/30' : 'bg-white text-gray-600 hover:text-[#72121E]'
          }`}
          title="Save to favorites"
        >
          <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* What's Included Box */}
      <div className="bg-[#FAF6EF] p-5 rounded-2xl border border-[#E8E1D5] space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#181512]">
          Included In Your Digital Package:
        </h4>
        <ul className="space-y-2 text-xs text-gray-600">
          <li className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span><strong>Scalable Vector SVG:</strong> Infinite zoom, ideal for batiks, lasers & screens</span>
          </li>
          <li className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span><strong>High-Resolution PNG:</strong> 4000x4000 px, 300 DPI transparent layer</span>
          </li>
          <li className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span><strong>Print-Ready PDF:</strong> Formatted for clean 8.5x11&quot; &amp; A4 printing</span>
          </li>
          <li className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-[#1C4E2D]" />
            <span>
              <strong>License:</strong> {artwork.license === 'COMMERCIAL' ? 'Full Commercial Redistribution & Merchandise Rights' : 'Personal Relaxation & Coloring Rights'}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
