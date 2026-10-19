import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { ShoppingBag, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';


export default async function CustomerOrdersPage() {
  const session = await getCurrentUser();
  if (!session) redirect('/login');

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
      entitlements: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Order History &amp; Invoices
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Permanent records and receipts of all your mandala purchases.
          </p>
        </div>
        <Link
          href="/account"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-16 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#D08C51] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">No Orders Yet</h2>
          <p className="text-xs text-gray-500">
            You have not completed any purchases.
          </p>
          <Link
            href="/gallery"
            className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold transition-colors"
          >
            Browse Artworks
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-8 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E8E4DC] pb-4 gap-3">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-base text-[#1A1A1A]">
                      #{ord.orderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ord.status === 'COMPLETED' ? 'bg-[#EBF2EC] text-[#588157]' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 block">
                    Placed on {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Paid</span>
                    <span className="font-serif text-xl font-bold text-[#1A1A1A]">
                      ${ord.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href={`/checkout/success?orderNumber=${ord.orderNumber}`}
                    className="px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#E8E4DC] text-xs font-semibold text-[#1A1A1A] hover:bg-[#8B7EC8] hover:text-white transition-colors"
                  >
                    View Receipt
                  </Link>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-50 pt-1">
                {ord.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-800">{it.title}</span>
                      <span className="text-gray-400 text-[11px] ml-2">({it.licenseType} License)</span>
                    </div>
                    <span className="font-medium text-gray-700">
                      ${it.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {ord.discountAmount > 0 && (
                <div className="pt-2 text-right text-xs text-[#588157] font-semibold">
                  Discount applied: -${ord.discountAmount.toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
