import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { CheckCircle2, Download, ShieldCheck, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string;
    session_id?: string;
  }>;
}


export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderNumber } = await searchParams;

  if (!orderNumber) {
    notFound();
  }

  // Fetch Order with Entitlements
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      entitlements: {
        include: {
          artwork: true,
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const isCompleted = order.status === 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      
      {/* Status Hero Card */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] p-8 sm:p-12 text-center space-y-4 shadow-sm">
        {isCompleted ? (
          <>
            <div className="w-16 h-16 rounded-full bg-[#EBF2EC] text-[#588157] flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#588157]">
                Payment Verified &amp; Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
                Thank You For Your Art Order!
              </h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto pt-1">
                Order <strong className="text-gray-900 font-mono">#{order.orderNumber}</strong> has been successfully processed. Your digital vector files are ready for immediate download below.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-9 h-9" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
              Order Processing
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Your payment is currently being confirmed by the payment gateway. Please refresh this page in a few moments.
            </p>
          </>
        )}
      </div>

      {/* Purchased Downloads List */}
      {isCompleted && (
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#8B7EC8]" />
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Your Instant Downloads ({order.entitlements.length})
              </h2>
            </div>
            <span className="text-xs text-[#588157] font-semibold bg-[#EBF2EC] px-3 py-1 rounded-full">
              Full Vector Access Granted
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {order.entitlements.map((ent) => {
              const title = ent.artwork?.title || ent.product?.title || 'Mandala Design';
              const image = ent.artwork?.previewImage || ent.product?.coverImage || '/uploads/artworks/lotus-blossom-harmony.svg';
              const format = ent.product ? 'Printable PDF Book / Bundle' : 'Lossless Vector SVG + 4K PNG';

              return (
                <div key={ent.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-[#FAF7F2] p-1.5 border border-[#E8E4DC] flex-shrink-0 flex items-center justify-center">
                      <img src={image} alt={title} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#1A1A1A]">{title}</h3>
                      <p className="text-xs text-gray-500">{format}</p>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        Downloads used: {ent.downloadCount} of {ent.maxDownloads}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/api/downloads/${ent.id}`}
                    download
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Files</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Details & Summary Card */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8E4DC] p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Order Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block">Customer</span>
            <span className="font-semibold text-gray-900">{order.customerName}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Email Delivery</span>
            <span className="font-semibold text-gray-900 truncate block">{order.customerEmail}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Date</span>
            <span className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Total Amount</span>
            <span className="font-bold text-gray-900 font-serif text-sm">${order.totalAmount.toFixed(2)} USD</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8E4DC] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-[#588157]" />
            <span>Commercial and Personal rights active per license agreement.</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/account/downloads"
              className="px-4 py-2 rounded-full bg-white border border-[#E8E4DC] text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              View in My Account
            </Link>
            <Link
              href="/gallery"
              className="px-4 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#8B7EC8] transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
