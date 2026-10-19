'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check, BookOpen, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string;
  price: number;
  currency: string;
  productType: string;
  license: string;
  includedArtworksCount?: number;
}

export default function ProductCard({
  id,
  title,
  slug,
  description,
  coverImage,
  price,
  currency,
  productType,
  license,
  includedArtworksCount = 0,
}: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = isInCart(id);

  const handleAddToCart = () => {
    addItem({
      id,
      type: 'product',
      title,
      price,
      image: coverImage,
      license,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const typeLabels: Record<string, { label: string; icon: any; color: string }> = {
    COLORING_BOOK_PDF: { label: 'Coloring Book PDF', icon: BookOpen, color: 'bg-[#1C4E2D] text-white' },
    THEMED_BUNDLE: { label: 'Themed Bundle', icon: Layers, color: 'bg-[#72121E] text-[#D4AF37]' },
    PREMIUM_COLLECTION: { label: 'Collector Edition', icon: Sparkles, color: 'bg-[#8B6B1B] text-white' },
    INDIVIDUAL_ARTWORK: { label: 'Individual Artwork', icon: Sparkles, color: 'bg-[#181512] text-white' },
  };

  const currentType = typeLabels[productType] || { label: productType, icon: Sparkles, color: 'bg-[#181512] text-white' };
  const Icon = currentType.icon;

  return (
    <div className="bg-white rounded-3xl border border-[#E8E1D5] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Product Image Cover */}
      <div className="relative aspect-4/3 w-full bg-[#FAF6EF] p-8 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-4 rounded-full border border-dashed border-[#D4AF37]/40" />
        
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 z-10 flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs bg-white/95 text-[#181512] border border-[#D4AF37]/50">
          <Icon className="w-3 h-3 text-[#D4AF37]" />
          <span>{currentType.label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif text-lg font-bold text-[#181512] hover:text-[#72121E] transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-gray-600">
            <span className="flex items-center space-x-1 bg-[#FAF6EF] px-2 py-0.5 rounded border border-[#E8E1D5]">
              <ShieldCheck className="w-3 h-3 text-[#1C4E2D]" />
              <span>{license === 'COMMERCIAL' ? 'Commercial Rights' : 'Personal License'}</span>
            </span>
            {includedArtworksCount > 0 && (
              <span className="bg-[#FAF6EF] px-2 py-0.5 rounded border border-[#E8E1D5]">
                {includedArtworksCount} Designs Included
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Price</span>
            <span className="font-serif text-xl font-bold text-[#181512]">
              ${price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={inCart && !justAdded}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all ${
              inCart
                ? 'bg-[#EBF5EE] text-[#1C4E2D] border border-[#1C4E2D]/30'
                : 'bg-[#72121E] hover:bg-[#851624] text-white border border-[#D4AF37]/50 shadow-xs'
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
        </div>
      </div>
    </div>
  );
}
