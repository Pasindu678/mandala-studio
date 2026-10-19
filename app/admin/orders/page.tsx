'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Receipt, Search, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface OrderItemAdmin {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  items: { id: string; title: string; price: number; licenseType: string }[];
  entitlements: { id: string; downloadCount: number; maxDownloads: number }[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItemAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#588157] uppercase tracking-wider mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Financial Records</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Customer Orders ({orders.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Audit customer payments, entitlements, and digital download activity.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, email..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#8B7EC8]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E4DC] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-gray-900">
                    #{ord.orderNumber}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{ord.customerName}</div>
                    <div className="text-gray-400 text-[11px]">{ord.customerEmail}</div>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="truncate font-medium text-gray-700">
                      {ord.items.map((i) => i.title).join(', ')}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {ord.items.length} items • {ord.entitlements.length} entitlements
                    </span>
                  </td>
                  <td className="py-4 px-4 font-serif font-bold text-sm text-[#1A1A1A]">
                    ${ord.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ord.status === 'COMPLETED' ? 'bg-[#EBF2EC] text-[#588157]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href={`/checkout/success?orderNumber=${ord.orderNumber}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-[#8B7EC8] rounded-lg inline-block"
                      title="View Customer Receipt"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
