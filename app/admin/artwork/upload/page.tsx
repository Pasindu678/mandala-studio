'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Trash2, 
  Check, 
  Sparkles, 
  AlertCircle, 
  ArrowLeft, 
  FolderTree, 
  DollarSign,
  FileImage,
  Layers
} from 'lucide-react';

interface QueuedItem {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  slug: string;
  categoryId: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isFree: boolean;
  price: number;
  license: 'PERSONAL' | 'COMMERCIAL';
  selected: boolean;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

export default function BulkArtworkUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [queue, setQueue] = useState<QueuedItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Batch action states
  const [batchCategory, setBatchCategory] = useState('');
  const [batchPrice, setBatchPrice] = useState('3.99');
  const [batchFree, setBatchFree] = useState(false);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setGlobalError(null);

    const defaultCat = categories[0]?.id || '';
    const newItems: QueuedItem[] = [];

    Array.from(files).forEach((file) => {
      // Validate type
      if (!file.type.startsWith('image/')) {
        setGlobalError(`File "${file.name}" is not an image.`);
        return;
      }

      // Generate clean title from filename
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const cleanTitle = baseName
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const slug = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const previewUrl = URL.createObjectURL(file);

      newItems.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl,
        title: cleanTitle,
        slug,
        categoryId: defaultCat,
        difficulty: 'INTERMEDIATE',
        isFree: false,
        price: 3.99,
        license: 'PERSONAL',
        selected: true,
        uploading: false,
        uploaded: false,
      });
    });

    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  // Batch apply category
  const applyBatchCategory = () => {
    if (!batchCategory) return;
    setQueue((prev) =>
      prev.map((item) => (item.selected ? { ...item, categoryId: batchCategory } : item))
    );
  };

  // Batch apply price
  const applyBatchPrice = () => {
    const p = parseFloat(batchPrice) || 0;
    setQueue((prev) =>
      prev.map((item) => (item.selected ? { ...item, price: p, isFree: p === 0 } : item))
    );
  };

  // Batch mark free
  const applyBatchFree = (free: boolean) => {
    setQueue((prev) =>
      prev.map((item) => (item.selected ? { ...item, isFree: free, price: free ? 0 : 3.99 } : item))
    );
  };

  // Select all toggle
  const toggleSelectAll = (checked: boolean) => {
    setQueue((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const handlePublishAll = async (isPublished: boolean) => {
    if (queue.length === 0) return;
    setSaving(true);
    setGlobalError(null);

    const uploadedPayload = [];

    // Upload each image file to /api/admin/media first
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      try {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('subfolder', 'artworks');

        const uploadRes = await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.file) {
          throw new Error(uploadData.error || `Failed to upload image for ${item.title}`);
        }

        const storedPath = uploadData.file.path;

        uploadedPayload.push({
          title: item.title,
          slug: item.slug,
          categoryId: item.categoryId || categories[0]?.id,
          difficulty: item.difficulty,
          previewImage: storedPath,
          originalFile: storedPath,
          isFree: item.isFree,
          price: item.isFree ? 0 : item.price,
          license: item.license,
          isPublished,
        });
      } catch (err: any) {
        setGlobalError(`Error uploading "${item.title}": ${err.message}`);
        setSaving(false);
        return;
      }
    }

    // Now send bulk payload to /api/admin/artwork/bulk
    try {
      const bulkRes = await fetch('/api/admin/artwork/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: uploadedPayload }),
      });

      const bulkData = await bulkRes.json();

      if (!bulkRes.ok) {
        setGlobalError(bulkData.error || 'Failed to save artworks in database');
        setSaving(false);
        return;
      }

      router.push('/admin/artwork');
    } catch (err: any) {
      setGlobalError(err.message || 'Bulk creation failed');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
            <Upload className="w-3.5 h-3.5" />
            <span>Single &amp; Bulk Artwork Uploader</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Upload Mandala Artworks
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload one or dozens of mandala images at once. Review titles, categories, and prices before publishing.
          </p>
        </div>

        <Link
          href="/admin/artwork"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-600 hover:text-[#1A1A1A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {globalError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#8B7EC8] bg-[#F3F0FA]'
            : 'border-[#D8D2C4] bg-white hover:border-[#8B7EC8] hover:bg-[#FAF7F2]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/svg+xml,image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#FAF0E6] text-[#D08C51] flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
            Drag &amp; drop mandala images here
          </h3>
          <p className="text-xs text-gray-500">
            Supports SVG, High-Res PNG, JPG, and WebP. Select multiple files to bulk upload.
          </p>
          <button
            type="button"
            className="px-5 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold shadow-xs hover:bg-[#8B7EC8] transition-colors"
          >
            Browse Files from Computer
          </button>
        </div>
      </div>

      {/* Upload Queue Review Screen */}
      {queue.length > 0 && (
        <div className="space-y-6">
          
          {/* Batch Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={queue.every((i) => i.selected)}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="rounded text-[#8B7EC8]"
                />
                <span>Select All ({queue.length})</span>
              </label>
            </div>

            {/* Batch controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <select
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={applyBatchCategory}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                >
                  Assign to Selected
                </button>
              </div>

              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="0.01"
                  value={batchPrice}
                  onChange={(e) => setBatchPrice(e.target.value)}
                  className="w-20 px-2 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs text-right"
                  placeholder="3.99"
                />
                <button
                  type="button"
                  onClick={applyBatchPrice}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold"
                >
                  Set Price
                </button>
              </div>

              <button
                type="button"
                onClick={() => applyBatchFree(true)}
                className="px-3 py-1.5 rounded-xl bg-[#EBF2EC] text-[#588157] font-semibold hover:bg-green-100"
              >
                Mark Selected as Free
              </button>
            </div>
          </div>

          {/* Cards Grid for Review */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {queue.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-[#E8E4DC] p-5 shadow-xs flex gap-5 items-start relative"
              >
                {/* Select checkbox */}
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setQueue((prev) =>
                      prev.map((i) => (i.id === item.id ? { ...i, selected: checked } : i))
                    );
                  }}
                  className="absolute top-4 left-4 z-10 rounded text-[#8B7EC8]"
                />

                {/* Preview Image */}
                <div className="w-28 h-28 rounded-2xl bg-[#FAF7F2] p-2 border border-[#E8E4DC] flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={item.previewUrl} alt={item.title} className="w-full h-full object-contain" />
                </div>

                {/* Editable Fields */}
                <div className="flex-1 space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-gray-400">Artwork Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQueue((prev) =>
                          prev.map((i) => (i.id === item.id ? { ...i, title: val } : i))
                        );
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs font-semibold text-gray-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-gray-400">Category</label>
                      <select
                        value={item.categoryId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQueue((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, categoryId: val } : i))
                          );
                        }}
                        className="w-full px-2 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold uppercase text-gray-400">Difficulty</label>
                      <select
                        value={item.difficulty}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setQueue((prev) =>
                            prev.map((i) => (i.id === item.id ? { ...i, difficulty: val } : i))
                          );
                        }}
                        className="w-full px-2 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isFree}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setQueue((prev) =>
                            prev.map((i) =>
                              i.id === item.id ? { ...i, isFree: checked, price: checked ? 0 : 3.99 } : i
                            )
                          );
                        }}
                        className="rounded text-[#588157]"
                      />
                      <span className="font-semibold text-[#588157]">Free Design</span>
                    </label>

                    {!item.isFree && (
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setQueue((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, price: val } : i))
                            );
                          }}
                          className="w-16 px-2 py-1 rounded-lg border border-[#E8E4DC] text-xs text-right font-semibold"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg"
                  title="Remove from queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="sticky bottom-6 bg-white p-5 rounded-3xl border border-[#E8E4DC] shadow-xl flex items-center justify-between z-30">
            <div className="text-xs text-gray-500">
              Ready to process <strong>{queue.length} artworks</strong>.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => handlePublishAll(false)}
                className="px-5 py-2.5 rounded-full border border-[#E8E4DC] text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {saving ? 'Processing...' : 'Save All as Drafts'}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => handlePublishAll(true)}
                className="px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <span>Processing Uploads...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publish Reviewed Artworks</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
