'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

export default function CartDrawer() {
  const { 
    items, 
    removeItem, 
    clearCart, 
    estimatedSubtotal, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen 
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6EF] shadow-2xl border-l border-[#E8E1D5] flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8E1D5] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-lg font-serif font-bold text-[#181512]">
                Your Art Cart ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-[#72121E] rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FDF6E2] text-[#8B6B1B] border border-[#D4AF37]/50 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-80" />
                </div>
                <h3 className="text-base font-bold text-[#181512]">Your cart is empty</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Discover stunning Sri Lankan Moonstones, Sacred Lotus blossoms, and coloring books in our gallery.
                </p>
                <Link
                  href="/gallery"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#72121E] hover:bg-[#851624] text-white text-xs font-semibold tracking-wide border border-[#D4AF37]/50 shadow-xs transition-colors"
                >
                  Explore Gallery
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center space-x-4 p-3.5 bg-white rounded-xl border border-[#E8E1D5] shadow-xs"
                >
                  <div className="w-16 h-16 rounded-lg bg-[#FAF6EF] p-1 border border-gray-100 shrink-0 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#181512] truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                      <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-[#FAF6EF] text-[#8B6B1B] font-bold border border-[#E8E1D5]">
                        {item.license}
                      </span>
                      <span>•</span>
                      <span>Digital Vector</span>
                    </div>
                    <div className="text-sm font-bold text-[#181512] mt-1">
                      {item.isFree ? (
                        <span className="text-[#1C4E2D]">Free Gift</span>
                      ) : (
                        `$${item.price.toFixed(2)}`
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8E1D5] bg-white space-y-4">
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-600 font-medium">Estimated Subtotal</span>
                <span className="text-xl font-bold font-serif text-[#181512]">
                  ${estimatedSubtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Taxes & discounts applied in checkout. Instant lossless vector download upon purchase.
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-[#72121E] hover:bg-[#851624] text-white font-semibold text-sm shadow-md border border-[#D4AF37]/50 transition-all group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="text-xs font-bold text-[#72121E] hover:underline"
                  >
                    View Full Cart &amp; Apply Promo Codes
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
