import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { Users, Mail, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';


export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          orders: true,
          favorites: true,
          entitlements: true,
        },
      },
      orders: {
        where: { status: 'COMPLETED' },
        select: { totalAmount: true },
      },
    },
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Customer CRM</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
          Customer Accounts ({customers.length})
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          View registered collectors, download entitlements, and customer purchase totals.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] border-b border-[#E8E4DC] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Orders</th>
              <th className="py-3.5 px-4">Downloads</th>
              <th className="py-3.5 px-4">Total Spend</th>
              <th className="py-3.5 px-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((c) => {
              const totalSpent = c.orders.reduce((acc, o) => acc + o.totalAmount, 0);
              return (
                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-[#8B7EC8]/20 text-[#8B7EC8] flex items-center justify-center font-bold">
                        {c.name ? c.name[0].toUpperCase() : c.email[0].toUpperCase()}
                      </div>
                      <span>{c.name || 'Anonymous User'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-mono text-[11px]">
                    {c.email}
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-800">
                    {c._count.orders} orders
                  </td>
                  <td className="py-4 px-4 text-[#588157] font-semibold">
                    {c._count.entitlements} files
                  </td>
                  <td className="py-4 px-4 font-serif font-bold text-gray-900">
                    ${totalSpent.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
