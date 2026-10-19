import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { User, Download, ShoppingBag, Heart, ShieldCheck, ChevronRight, Clock } from 'lucide-react';


export default async function AccountPage() {
  const session = await getCurrentUser();

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      _count: {
        select: {
          orders: true,
          entitlements: true,
          favorites: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Recent 3 orders
  const recentOrders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { items: true },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-[#8B7EC8]/20 text-[#8B7EC8] font-bold text-2xl flex items-center justify-center font-serif">
            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                {user.name || 'Art Enthusiast'}
              </h1>
              {user.role === 'ADMIN' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF0E6] text-[#D08C51] border border-[#E8C5A8]">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {user.role === 'ADMIN' && (
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Admin Dashboard</span>
          </Link>
        )}
      </div>

      {/* KPI Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/account/downloads"
          className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-2xs hover:border-[#8B7EC8] transition-colors flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Digital Files</span>
            <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
              {user._count.entitlements} Downloads
            </div>
            <span className="text-xs text-[#8B7EC8] font-semibold group-hover:underline flex items-center">
              Access your files <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F3F0FA] text-[#8B7EC8]">
            <Download className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/account/orders"
          className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-2xs hover:border-[#588157] transition-colors flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order History</span>
            <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
              {user._count.orders} Orders
            </div>
            <span className="text-xs text-[#588157] font-semibold group-hover:underline flex items-center">
              View receipts <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#EBF2EC] text-[#588157]">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/account/favorites"
          className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-2xs hover:border-[#D08C51] transition-colors flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saved Designs</span>
            <div className="font-serif text-2xl font-bold text-[#1A1A1A]">
              {user._count.favorites} Favorites
            </div>
            <span className="text-xs text-[#D08C51] font-semibold group-hover:underline flex items-center">
              Browse saved <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF0E6] text-[#D08C51]">
            <Heart className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
          <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs font-semibold text-[#8B7EC8] hover:underline">
            View all orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            You haven&apos;t placed any orders yet.{' '}
            <Link href="/gallery" className="text-[#8B7EC8] font-semibold hover:underline">
              Start exploring the mandala collection.
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((ord) => (
              <div key={ord.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gray-900">#{ord.orderNumber}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    {ord.items.length} items • {ord.items.map((i) => i.title).join(', ')}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                    ${ord.totalAmount.toFixed(2)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ord.status === 'COMPLETED' ? 'bg-[#EBF2EC] text-[#588157]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {ord.status}
                  </span>
                  <Link
                    href={`/checkout/success?orderNumber=${ord.orderNumber}`}
                    className="text-[#8B7EC8] font-semibold hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
