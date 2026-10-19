'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';

interface UserSession {
  userId: string;
  email: string;
  name?: string | null;
  role: 'ADMIN' | 'CUSTOMER';
}

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    // Fetch current user session
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setSession(data.user);
        else setSession(null);
      })
      .catch(() => setSession(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
    window.location.href = '/';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Categories', href: '/gallery#categories' },
    { label: 'Heritage Shop', href: '/shop' },
    { label: 'About', href: '/#about' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      {/* Top Heritage Gold Bar */}
      <div className="h-1 bg-gradient-to-r from-[#72121E] via-[#D4AF37] to-[#72121E]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Sri Lankan Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full bg-[#72121E] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#181512]">
                  Mandala Studio
                </span>
                <span className="text-xs">🇱🇰</span>
              </div>
              <span className="text-[10.5px] font-semibold text-[#8B6B1B] tracking-wider uppercase">
                Ceylon Heritage & Sacred Art • ශ්‍රී ලාංකීය උරුමය
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all pb-1 ${
                    active
                      ? 'text-[#72121E] font-bold border-b-2 border-[#D4AF37]'
                      : 'text-[#4A443E] hover:text-[#72121E]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & User Account */}
          <div className="flex items-center space-x-4">
            
            {/* Admin Badge Shortcut if logged in as Admin */}
            {session?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all border ${
                  isAdminRoute 
                    ? 'bg-[#72121E] text-[#FFFDF9] border-[#D4AF37]' 
                    : 'bg-[#FDF6E2] text-[#72121E] border-[#D4AF37]/60 hover:bg-[#72121E] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin CMS</span>
              </Link>
            )}

            {/* Favorites Icon */}
            <Link
              href="/account/favorites"
              className="p-2 text-[#4A443E] hover:text-[#72121E] hover:bg-[#FDF1F3] rounded-full transition-colors relative"
              title="Favorite Artworks"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-[#181512] hover:bg-[#FDF6E2] rounded-full transition-colors relative"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#72121E] text-[#D4AF37] border border-[#D4AF37] text-[10.5px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {session ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 py-1.5 px-3 rounded-full border border-[#D4AF37]/60 bg-white hover:bg-[#FAF6EF] text-xs font-medium text-[#181512] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#72121E] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                      {session.name ? session.name[0].toUpperCase() : session.email[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{session.name || session.email}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E8E1D5] py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#E8E1D5]">
                        <p className="font-semibold text-[#181512] truncate">{session.name || 'Art Enthusiast'}</p>
                        <p className="text-xs text-gray-500 truncate">{session.email}</p>
                      </div>

                      {session.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-[#72121E] hover:bg-[#FDF1F3] font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-[#FAF6EF]"
                      >
                        <User className="w-4 h-4" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        href="/account/downloads"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-[#FAF6EF]"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Downloads</span>
                      </Link>

                      <Link
                        href="/account/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-[#FAF6EF]"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Favorites</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-[#E8E1D5] mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#72121E] hover:bg-[#851624] text-white text-xs font-semibold shadow-xs border border-[#D4AF37]/50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#181512] hover:bg-[#E8E1D5] rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6EF] border-b border-[#E8E1D5] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-[#181512] hover:bg-[#E8E1D5]/50"
            >
              {link.label}
            </Link>
          ))}
          {session?.role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-[#72121E] bg-[#FDF1F3]"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
