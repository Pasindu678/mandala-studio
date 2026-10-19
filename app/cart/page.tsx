'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart/cart-context';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Check, 
  Tag, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    clearCart, 
    discountCode, 
    setDiscountCode 
  } = useCart();

  const [inputCode, setInputCode] = useState(discountCode || '');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [serverSubtotal, setServerSubtotal] = useState(0);
  const [serverTotal, setServerTotal] = useState(0);
  const [loadingCalculation, setLoadingCalculation] = useState(false);

  // Recalculate on server whenever items or applied code change
  useEffect(() => {
    if (items.length === 0) {
      setServerSubtotal(0);
      setDiscountAmount(0);
      setServerTotal(0);
      return;
    }

    setLoadingCalculation(true);
    fetch('/api/cart/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ type: i.type, id: i.id })),
        discountCode: appliedCode || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.subtotal !== undefined) {
          setServerSubtotal(data.subtotal);
          setDiscountAmount(data.discountAmount);
          setServerTotal(data.total);
          if (data.discountCodeApplied) {
            setAppliedCode(data.discountCodeApplied);
            setDiscountCode(data.discountCodeApplied);
          }
        }
      })
      .catch((err) => {
        console.error('Recalculation error:', err);
      })
      .finally(() => {
        setLoadingCalculation(false);
      });
  }, [items, appliedCode, setDiscountCode]);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError(null);
    if (!inputCode.trim()) return;

    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: inputCode.trim(),
          cartSubtotal: serverSubtotal,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setDiscountError(data.error || 'Invalid or expired discount code');
        setAppliedCode(null);
      } else {
        setAppliedCode(data.code);
        setDiscountCode(data.code);
        setDiscountError(null);
      }
    } catch {
      setDiscountError('Error validating discount code');
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedCode(null);
    setDiscountCode('');
    setInputCode('');
    setDiscountAmount(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181512]">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review your selected Sri Lankan mandala artwork, printable coloring books, and bundles.
          </p>
        </div>
        <Link
          href="/gallery"
          className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-bold text-[#72121E] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Exploring</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E1D5] p-16 text-center space-y-6 max-w-lg mx-auto shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#FDF6E2] text-[#8B6B1B] border border-[#D4AF37]/50 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 opacity-80" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-[#181512]">Your Cart is Empty</h2>
            <p className="text-sm text-gray-600">
              Browse our gallery to discover free Sri Lankan mandala gifts or explore printable coloring book PDFs.
            </p>
          </div>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/gallery"
              className="px-6 py-3 rounded-full bg-[#72121E] hover:bg-[#851624] text-white text-xs font-semibold border border-[#D4AF37]/50 shadow-xs transition-colors"
            >
              Explore Gallery
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 rounded-full bg-white border border-[#D4AF37] text-[#72121E] hover:bg-[#FDF6E2] text-xs font-semibold shadow-xs transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Items List (Left Column) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-xs divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex items-center gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FAF6EF] p-2 border border-[#E8E1D5] shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF6EF] border border-[#E8E1D5] text-[#8B6B1B]">
                        {item.type === 'product' ? 'Bundle / Book' : 'Artwork Design'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500">
                        {item.license === 'COMMERCIAL' ? 'Commercial Rights' : 'Personal License'}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#181512] truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Formats included: Scalable Vector SVG, 4K PNG, Print PDF
                    </p>

                    <div className="text-base font-bold font-serif text-[#181512] pt-1">
                      {item.isFree ? (
                        <span className="text-[#1C4E2D]">Free Heritage Gift</span>
                      ) : (
                        `$${item.price.toFixed(2)}`
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 px-2">
              <Link href="/gallery" className="hover:underline flex items-center space-x-1 text-[#72121E] font-semibold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Add more artworks</span>
              </Link>
              <button
                onClick={clearCart}
                className="hover:text-red-500 transition-colors"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Order Summary & Discounts (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#181512] border-b border-[#E8E1D5] pb-4">
                Order Summary
              </h2>

              {/* Discount Code Form */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Promo Code (e.g. AYUBOWAN15, CEYLON20)</span>
                </label>

                {appliedCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EBF5EE] border border-[#1C4E2D]/40 text-xs">
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-[#1C4E2D]" />
                      <span className="font-bold text-[#1C4E2D]">{appliedCode}</span>
                      <span className="text-gray-500">applied</span>
                    </div>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-red-500 hover:underline text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyDiscount} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Try: AYUBOWAN15 or CEYLON20"
                      className="flex-1 px-3 py-2 text-xs uppercase tracking-wider rounded-xl border border-[#E8E1D5] bg-[#FAF6EF] focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#72121E] hover:bg-[#851624] text-white text-xs font-semibold border border-[#D4AF37]/50 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {discountError && (
                  <p className="text-[11px] text-red-500 font-medium">{discountError}</p>
                )}
              </div>

              {/* Price Calculation Rows */}
              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-[#181512]">${serverSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#1C4E2D] font-semibold">
                    <span>Discount ({appliedCode})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-600">
                  <span>Digital Delivery</span>
                  <span className="text-[#1C4E2D] font-semibold">Free Instant Vector</span>
                </div>

                <div className="border-t border-[#E8E1D5] pt-4 flex items-center justify-between text-base">
                  <span className="font-bold text-[#181512]">Total Due</span>
                  <span className="font-serif text-2xl font-bold text-[#181512]">
                    ${serverTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-full bg-[#72121E] hover:bg-[#851624] text-white font-semibold text-sm shadow-md border border-[#D4AF37]/50 transition-all group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Security Guarantee */}
              <div className="pt-2 text-center flex items-center justify-center space-x-1.5 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-[#1C4E2D]" />
                <span>256-bit Encrypted Checkout • Verified Server Recalculation</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
