import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import AdminNav from '@/components/admin/AdminNav';
import { Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  if (!session) {
    redirect('/login?redirect=/admin');
  }

  if (session.role !== 'ADMIN') {
    redirect('/account');
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col md:flex-row text-[#1A1A1A]">
      
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E8E4DC] flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Brand */}
          <div className="p-6 border-b border-[#E8E4DC]">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5 text-[#8B7EC8]" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-bold tracking-tight text-[#1A1A1A]">
                  Mandala Studio
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7EC8] bg-[#F3F0FA] px-1.5 py-0.5 rounded">
                  Admin CMS
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="p-4">
            <AdminNav />
          </div>
        </div>

        {/* Bottom Live Website Shortcut */}
        <div className="p-4 border-t border-[#E8E4DC] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0E6] text-xs font-semibold text-[#1A1A1A] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-[#8B7EC8]" />
              <span>View Public Store</span>
            </div>
            <span className="text-[10px] text-gray-400">Live</span>
          </Link>

          <div className="px-2 py-1 text-[11px] text-gray-400">
            Signed in as <strong className="text-gray-700">{session.email}</strong>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
