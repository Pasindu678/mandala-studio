'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart/cart-context';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  AlertCircle,
  ShoppingBag
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, discountCode } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill logged-in user email if available
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCustomerEmail(data.user.email);
          if (data.user.name) setCustomerName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  // Server-side recalculation of cart
  useEffect(() => {
    if (items.length === 0) return;

    fetch('/api/cart/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ type: i.type, id: i.id })),
        discountCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.total !== undefined) {
          setSubtotal(data.subtotal);
          setDiscountAmount(data.discountAmount);
          setTotal(data.total);
        }
      })
      .catch(() => {});
  }, [items, discountCode]);

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Please provide your name and email address for order delivery.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          items: items.map((i) => ({ type: i.type, id: i.id })),
          discountCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Checkout initialization failed');
        setLoading(false);
        return;
      }

      // If free order or instant fulfillment
      if (data.isFreeOrder && data.redirectUrl) {
        clearCart();
        router.push(data.redirectUrl);
        return;
      }

      // If live Stripe checkout URL
      if (data.mode === 'stripe' && data.url) {
        clearCart();
        window.location.href = data.url;
        return;
      }

      // Sandbox Mock Mode: Simulate verified test payment
      if (data.mode === 'mock' && data.orderNumber) {
        const completeRes = await fetch('/api/checkout/mock-complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber: data.orderNumber }),
        });

        const completeData = await completeRes.json();
        if (completeRes.ok && completeData.success) {
          clearCart();
          router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
        } else {
          setError('Failed to finalize test order');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FDF6E2] text-[#8B6B1B] border border-[#D4AF37]/50 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 opacity-70" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#181512]">Your Cart is Empty</h1>
        <p className="text-sm text-gray-600">Add artwork or coloring books to your cart before checking out.</p>
        <Link
          href="/gallery"
          className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#72121E] hover:bg-[#851624] text-white text-xs font-semibold border border-[#D4AF37]/50"
        >
          Explore Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-[#72121E] uppercase tracking-wider mb-1">
          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Secure Encrypted Checkout • ශ්‍රී ලංකා පාරිභෝගික ගෙවීම්</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181512]">
          Finalize Your Art Order
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Customer Information & Payment */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer Details Card */}
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#181512] border-b border-[#E8E1D5] pb-3">
              1. Customer Delivery Details
            </h2>
            <p className="text-xs text-gray-600">
              Your high-resolution vector downloads and license certificate will be delivered to this email address.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kasun Perera"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FAF6EF] text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. kasun@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FAF6EF] text-sm focus:outline-none focus:border-[#D4AF37] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Selection Card */}
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#181512] border-b border-[#E8E1D5] pb-3">
              2. Payment &amp; Verification
            </h2>

            <div className="p-4 rounded-2xl border-2 border-[#D4AF37] bg-[#FDF6E2]/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-[#72121E]" />
                  <span className="font-semibold text-sm text-[#181512]">
                    {process.env.NEXT_PUBLIC_PAYMENT_MODE === 'stripe' 
                      ? 'Secure Card Checkout (Stripe)' 
                      : 'Verified Sandbox Test Checkout'}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#72121E] text-[#D4AF37] border border-[#D4AF37]/50 uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {process.env.NEXT_PUBLIC_PAYMENT_MODE === 'stripe'
                  ? 'Processed securely via Stripe 256-bit SSL encrypted payment gateway.'
                  : 'Operating in Sandbox Test Mode. Allows you to test complete order fulfillment, order receipts, and instant digital vector downloads without needing real merchant bank credentials.'}
              </p>
            </div>

            <div className="pt-2 flex items-center space-x-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#1C4E2D]" />
              <span>Entitlement verified upon server receipt. Instant download access unlocked.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-[#72121E] hover:bg-[#851624] text-white font-semibold text-sm shadow-md border border-[#D4AF37]/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying &amp; Processing Order...</span>
            ) : (
              <>
                <span>Complete Order (${total.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </>
            )}
          </button>

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#181512] border-b border-[#E8E1D5] pb-3">
              Order Breakdown ({items.length} items)
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 text-xs">
                  <div className="w-12 h-12 rounded-lg bg-[#FAF6EF] p-1 border border-[#E8E1D5] shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                    <span className="text-[10px] text-[#8B6B1B] uppercase font-bold tracking-wider">{item.license} License</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {item.isFree ? 'Free' : `$${item.price.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 text-xs border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#1C4E2D] font-semibold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Instant Digital Delivery</span>
                <span className="text-[#1C4E2D] font-semibold">Included</span>
              </div>

              <div className="border-t border-[#E8E1D5] pt-3 flex justify-between text-base font-bold text-[#181512]">
                <span>Total Due</span>
                <span className="font-serif text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF6EF] border border-[#E8E1D5] text-[11px] text-gray-600 space-y-1">
              <div className="font-bold text-[#181512]">Digital Fulfillment Guarantee:</div>
              <p>Your purchases are permanently accessible in your customer account with unlimited re-download access.</p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
