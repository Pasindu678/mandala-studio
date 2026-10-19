import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Download, HeartHandshake, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#181512] text-[#FAF6EF] border-t-2 border-[#D4AF37]/40">
      {/* Top Sri Lankan Motif Accent Line */}
      <div className="h-1 bg-gradient-to-r from-[#72121E] via-[#D4AF37] to-[#72121E]" />

      {/* Value Badges Banner */}
      <div className="border-b border-[#2C2621]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3.5">
              <div className="p-2.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Instant Digital Fulfillment</h4>
                <p className="text-xs text-[#C5BBAF]">Vector SVGs, 4K lossless PNGs & print-ready PDFs</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3.5">
              <div className="p-2.5 rounded-full bg-[#72121E]/30 text-[#D4AF37] border border-[#72121E]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Commercial Rights Available</h4>
                <p className="text-xs text-[#C5BBAF]">Batik, textiles, merchandise & coloring book publishing</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start space-x-3.5">
              <div className="p-2.5 rounded-full bg-[#1C4E2D]/30 text-[#D4AF37] border border-[#1C4E2D]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">2,500 Years of Heritage 🇱🇰</h4>
                <p className="text-xs text-[#C5BBAF]">Authentic Moonstone, Lotus & Kandyan Liya Wela art</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#72121E] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Mandala Studio
                </span>
                <span className="text-[10px] text-[#D4AF37] tracking-wider uppercase font-semibold">
                  Ceylon Sacred Art & Geometry
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#C5BBAF] max-w-sm leading-relaxed">
              Discover Your Art. Choose Your Mandala. We celebrate Sri Lanka’s ancient stone carvings, temple ceiling frescoes, and sacred geometry through high-resolution vector artwork and printable coloring products.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#D4AF37] pt-2">
              <Mail className="w-4 h-4 text-[#D4AF37]" />
              <span>ceylon@mandalastudio.art • Colombo & Kandy, Sri Lanka</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Heritage Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-[#C5BBAF]">
              <li>
                <Link href="/categories/ceylon-moonstone-heritage" className="hover:text-[#D4AF37] transition-colors">
                  Moonstone & Heritage
                </Link>
              </li>
              <li>
                <Link href="/categories/sacred-lotus-nil-manel" className="hover:text-[#D4AF37] transition-colors">
                  Sacred Lotus & Nil Manel
                </Link>
              </li>
              <li>
                <Link href="/categories/kandyan-liya-wela-filigree" className="hover:text-[#D4AF37] transition-colors">
                  Kandyan Liya Wela
                </Link>
              </li>
              <li>
                <Link href="/categories/temple-fresco-geometry" className="hover:text-[#D4AF37] transition-colors">
                  Temple Fresco Geometry
                </Link>
              </li>
              <li>
                <Link href="/categories/floral-mandalas" className="hover:text-[#D4AF37] transition-colors">
                  Floral Mandalas
                </Link>
              </li>
              <li>
                <Link href="/categories/kids-coloring-designs" className="hover:text-[#D4AF37] transition-colors">
                  Kids' Heritage Art
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop & Discover */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Art & Products
            </h3>
            <ul className="space-y-2.5 text-sm text-[#C5BBAF]">
              <li>
                <Link href="/gallery" className="hover:text-[#D4AF37] transition-colors">
                  All Sacred Mandalas
                </Link>
              </li>
              <li>
                <Link href="/gallery?free=true" className="hover:text-[#D4AF37] transition-colors">
                  Free Digital Designs
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
                  Printable Coloring Books
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
                  Commercial Bundles
                </Link>
              </li>
              <li>
                <Link href="/account/favorites" className="hover:text-[#D4AF37] transition-colors">
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Account */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-4">
              Studio & Account
            </h3>
            <ul className="space-y-2.5 text-sm text-[#C5BBAF]">
              <li>
                <Link href="/account" className="hover:text-[#D4AF37] transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/account/downloads" className="hover:text-[#D4AF37] transition-colors">
                  Purchased Downloads
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#D4AF37] transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#D4AF37] transition-colors">
                  Commercial License & FAQ
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#D4AF37] transition-colors">
                  Admin CMS Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#2C2621] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9E9385]">
          <p>© {new Date().getFullYear()} Mandala Studio. Preserving 2,500 Years of Ceylon Artistry in Scalable Vector Form. 🇱🇰</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Commercial License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
