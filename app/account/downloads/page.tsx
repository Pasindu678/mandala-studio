import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { Download, Sparkles, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';


export default async function CustomerDownloadsPage() {
  const session = await getCurrentUser();
  if (!session) redirect('/login');

  const entitlements = await prisma.purchaseEntitlement.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      artwork: true,
      product: true,
      order: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Digital Vault</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            My Downloadable Artworks &amp; Books
          </h1>
        </div>
        <Link
          href="/account"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
      </div>

      {/* Downloads List */}
      {entitlements.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-16 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#D08C51] flex items-center justify-center mx-auto">
            <Download className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">No Downloads Found</h2>
          <p className="text-xs text-gray-500">
            You haven&apos;t purchased any digital mandalas or coloring books yet. Free designs can also be saved to your vault.
          </p>
          <Link
            href="/gallery"
            className="inline-block mt-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold transition-colors"
          >
            Explore Free &amp; Premium Art
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8E4DC] p-6 sm:p-8 shadow-xs divide-y divide-gray-100">
          {entitlements.map((ent) => {
            const title = ent.artwork?.title || ent.product?.title || 'Mandala File';
            const image = ent.artwork?.previewImage || ent.product?.coverImage || '/uploads/artworks/lotus-blossom-harmony.svg';
            const format = ent.product ? 'Coloring Book PDF' : 'Lossless Vector SVG + 4K PNG';
            const downloadsLeft = ent.maxDownloads - ent.downloadCount;

            return (
              <div key={ent.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#FAF7F2] p-2 border border-[#E8E4DC] flex-shrink-0 flex items-center justify-center">
                    <img src={image} alt={title} className="w-full h-full object-contain" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8E4DC] text-gray-600">
                        {format}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Acquired {new Date(ent.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                      {title}
                    </h3>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="text-[#588157] font-semibold">
                        Order #{ent.order.orderNumber}
                      </span>
                      <span>•</span>
                      <span>
                        {downloadsLeft > 0 ? (
                          `${downloadsLeft} downloads remaining`
                        ) : (
                          <span className="text-red-500 font-semibold">Download limit reached</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <a
                    href={`/api/downloads/${ent.id}`}
                    download
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Files</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* License & Support Guarantee */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8E4DC] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-[#588157] flex-shrink-0" />
          <span>
            All downloads are strictly authenticated. Need to extend your download limits or request custom formats? Contact support@mandalastudio.art.
          </span>
        </div>
      </div>

    </div>
  );
}
