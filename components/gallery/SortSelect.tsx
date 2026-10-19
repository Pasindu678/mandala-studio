'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextVal = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('sort', nextVal);
    router.push(`/gallery?${current.toString()}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="py-2 px-3 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#8B7EC8]"
    >
      <option value="popular">Most Popular</option>
      <option value="newest">Newest First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="title">Title (A-Z)</option>
    </select>
  );
}
