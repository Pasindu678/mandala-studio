'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Palette, 
  FolderTree, 
  Layers, 
  ShoppingBag, 
  Image, 
  FileEdit, 
  Receipt, 
  Users, 
  Settings,
  Upload
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Artwork Management', href: '/admin/artwork', icon: Palette },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Collections', href: '/admin/collections', icon: Layers },
    { label: 'Products & Pricing', href: '/admin/products', icon: ShoppingBag },
    { label: 'Media Library', href: '/admin/media', icon: Image },
    { label: 'Homepage Content', href: '/admin/homepage', icon: FileEdit },
    { label: 'Orders', href: '/admin/orders', icon: Receipt },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <nav className="space-y-1">
      {/* Obvious Quick Upload Button */}
      <Link
        href="/admin/artwork/upload"
        className="flex items-center justify-center space-x-2 w-full py-2.5 px-3 mb-4 rounded-xl bg-[#8B7EC8] hover:bg-[#6D5FA8] text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>Upload Artwork</span>
      </Link>

      {links.map((link) => {
        const Icon = link.icon;
        const isActive = link.exact
          ? pathname === link.href
          : pathname?.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-[#1A1A1A] text-white shadow-2xs'
                : 'text-gray-600 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#8B7EC8]' : 'text-gray-400'}`} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
