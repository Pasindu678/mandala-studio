import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { 
  DollarSign, 
  ShoppingBag, 
  Palette, 
  FolderTree, 
  Upload, 
  Plus, 
  FileEdit, 
  ArrowRight,
  TrendingUp,
  Eye
} from 'lucide-react';


export default async function AdminOverviewPage() {
  const [
    totalOrders,
    totalArtworks,
    totalCategories,
    totalProducts,
    ordersAgg,
    recentOrders,
    topArtworks,
  ] = await Promise.all([
    prisma.order.count({ where: { status: 'COMPLETED' } }),
    prisma.artwork.count({ where: { isArchived: false } }),
    prisma.category.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { totalAmount: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
    prisma.artwork.findMany({
      where: { isArchived: false },
      orderBy: { salesCount: 'desc' },
      take: 4,
      include: { category: true },
    }),
  ]);

  const totalRevenue = ordersAgg._sum.totalAmount || 0;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Studio Administration
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your mandala catalog, categories, pricing, and website content in real time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/artwork/upload"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#8B7EC8] hover:bg-[#6D5FA8] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Artwork</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:bg-[#FAF7F2] text-xs font-semibold text-[#1A1A1A] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#588157]" />
            <span>New Category</span>
          </Link>
          <Link
            href="/admin/homepage"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-[#E8E4DC] hover:bg-[#FAF7F2] text-xs font-semibold text-[#1A1A1A] transition-colors"
          >
            <FileEdit className="w-4 h-4 text-[#D08C51]" />
            <span>Edit Homepage</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="font-serif text-2xl font-bold text-[#1A1A1A] mt-0.5">
              ${totalRevenue.toFixed(2)}
            </div>
            <span className="text-[10px] text-[#588157] font-semibold flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              Verified Completed Orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EBF2EC] text-[#588157] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="font-serif text-2xl font-bold text-[#1A1A1A] mt-0.5">
              {totalOrders}
            </div>
            <Link href="/admin/orders" className="text-[10px] text-[#8B7EC8] font-semibold hover:underline mt-1 block">
              Manage order records →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F3F0FA] text-[#8B7EC8] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Artworks</span>
            <div className="font-serif text-2xl font-bold text-[#1A1A1A] mt-0.5">
              {totalArtworks}
            </div>
            <Link href="/admin/artwork" className="text-[10px] text-[#8B7EC8] font-semibold hover:underline mt-1 block">
              View catalog ({totalProducts} products) →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] text-[#D08C51] flex items-center justify-center">
            <Palette className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Categories</span>
            <div className="font-serif text-2xl font-bold text-[#1A1A1A] mt-0.5">
              {totalCategories}
            </div>
            <Link href="/admin/categories" className="text-[10px] text-[#8B7EC8] font-semibold hover:underline mt-1 block">
              Manage themes →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-gray-700 flex items-center justify-center border border-[#E8E4DC]">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders & Top Designs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
              Recent Customer Orders
            </h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-[#8B7EC8] hover:underline">
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500">
              No orders placed yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-gray-900">#{ord.orderNumber}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-medium text-gray-700">{ord.customerName}</span>
                    </div>
                    <span className="text-gray-400 text-[11px]">
                      {ord.items.length} items • {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-900 font-serif">
                      ${ord.totalAmount.toFixed(2)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ord.status === 'COMPLETED' ? 'bg-[#EBF2EC] text-[#588157]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Performing Artwork (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8E4DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
            <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
              Top Performing Designs
            </h2>
            <Link href="/admin/artwork" className="text-xs font-semibold text-[#8B7EC8] hover:underline">
              All artwork
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {topArtworks.map((art) => (
              <div key={art.id} className="py-3 flex items-center space-x-3 text-xs">
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] p-1 border border-[#E8E4DC] flex-shrink-0 flex items-center justify-center">
                  <img src={art.previewImage} alt={art.title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{art.title}</h4>
                  <span className="text-[10px] text-gray-400 block">{art.category.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#588157] block">{art.salesCount} sales</span>
                  <span className="text-[10px] text-gray-400 flex items-center justify-end">
                    <Eye className="w-3 h-3 mr-0.5" /> {art.viewsCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
