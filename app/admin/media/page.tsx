'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText 
} from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  path: string;
  isPrivate: boolean;
  usageCount: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (Array.isArray(data)) setMedia(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('subfolder', 'artworks');

      try {
        await fetch('/api/admin/media', {
          method: 'POST',
          body: formData,
        });
      } catch {
        //
      }
    }

    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete media file "${item.filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${item.id}`, { method: 'DELETE' });
      if (res.ok) fetchMedia();
    } catch {
      //
    }
  };

  const handleCopyPath = (item: MediaItem) => {
    navigator.clipboard.writeText(item.path);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = media.filter((m) =>
    m.originalName.toLowerCase().includes(search.toLowerCase()) ||
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Digital Asset Manager</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Media Library ({media.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Central repository of all vector SVGs, preview graphics, and printable PDF documents.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload New Media'}</span>
          </button>
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
            placeholder="Search filenames..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#8B7EC8]"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => {
          const isSvgOrImg = item.mimeType.startsWith('image/');
          const sizeKb = (item.sizeBytes / 1024).toFixed(1);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div className="aspect-square bg-[#FAF7F2] p-3 flex items-center justify-center relative overflow-hidden">
                {isSvgOrImg ? (
                  <img src={item.path} alt={item.originalName} className="w-full h-full object-contain" />
                ) : (
                  <FileText className="w-12 h-12 text-[#8B7EC8]" />
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button
                    onClick={() => handleCopyPath(item)}
                    className="p-1 rounded bg-white text-gray-700 shadow-xs hover:bg-[#8B7EC8] hover:text-white"
                    title="Copy File URL"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1 rounded bg-white text-red-500 shadow-xs hover:bg-red-500 hover:text-white"
                    title="Delete File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 text-[11px] space-y-1">
                <div className="font-semibold text-gray-900 truncate" title={item.originalName}>
                  {item.originalName}
                </div>
                <div className="flex items-center justify-between text-gray-400 text-[10px]">
                  <span>{sizeKb} KB</span>
                  <span>{item.isPrivate ? 'Private' : 'Public'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
