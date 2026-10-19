'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';

interface CollectionItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  price: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  artworks: { artwork: { id: string; title: string; previewImage: string } }[];
}

interface ArtworkOption {
  id: string;
  title: string;
  previewImage: string;
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [availableArtworks, setAvailableArtworks] = useState<ArtworkOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/admin/collections');
      const data = await res.json();
      if (Array.isArray(data)) setCollections(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const fetchArtworks = async () => {
    try {
      const res = await fetch('/api/admin/artwork');
      const data = await res.json();
      if (Array.isArray(data)) setAvailableArtworks(data);
    } catch {
      //
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchArtworks();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCoverImage('/uploads/categories/floral-mandalas.svg');
    setPrice(9.99);
    setDisplayOrder(collections.length + 1);
    setIsPublished(true);
    setIsFeatured(true);
    setSelectedArtworkIds([]);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (col: CollectionItem) => {
    setEditingId(col.id);
    setTitle(col.title);
    setSlug(col.slug);
    setDescription(col.description || '');
    setCoverImage(col.coverImage || '');
    setPrice(col.price !== null ? col.price : '');
    setDisplayOrder(col.displayOrder);
    setIsPublished(col.isPublished);
    setIsFeatured(col.isFeatured);
    setSelectedArtworkIds(col.artworks.map((a) => a.artwork.id));
    setError(null);
    setModalOpen(true);
  };

  const toggleArtworkSelection = (id: string) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      coverImage: coverImage.trim(),
      price: price === '' ? undefined : Number(price),
      displayOrder: Number(displayOrder),
      isPublished,
      isFeatured,
      artworkIds: selectedArtworkIds,
    };

    try {
      const res = await fetch('/api/admin/collections', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save collection');
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      fetchCollections();
    } catch (err: any) {
      setError(err.message || 'Error saving collection');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (col: CollectionItem) => {
    if (!confirm(`Are you sure you want to delete collection "${col.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/collections?id=${col.id}`, { method: 'DELETE' });
      if (res.ok) fetchCollections();
    } catch {
      //
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#D08C51] uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Suites</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Artwork Collections
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Group thematic artworks into highlighted suites for front-page showcase or commercial bundle sales.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-3xl border border-[#E8E4DC] p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D08C51] bg-[#FAF0E6] px-2 py-0.5 rounded-full">
                  Collection #{col.displayOrder}
                </span>
                <span className={`text-[10px] font-bold uppercase ${col.isPublished ? 'text-[#588157]' : 'text-gray-400'}`}>
                  {col.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {col.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {col.description}
              </p>

              {col.price !== null && (
                <div className="text-sm font-bold font-serif text-gray-900 mt-2">
                  Bundle Price: ${col.price.toFixed(2)} USD
                </div>
              )}

              {/* Artwork thumbnails preview */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center space-x-2">
                {col.artworks.slice(0, 4).map((item) => (
                  <div key={item.artwork.id} className="w-10 h-10 rounded-lg bg-[#FAF7F2] p-1 border border-[#E8E4DC]">
                    <img src={item.artwork.previewImage} alt={item.artwork.title} className="w-full h-full object-contain" />
                  </div>
                ))}
                {col.artworks.length > 4 && (
                  <span className="text-[10px] text-gray-400 font-bold">+{col.artworks.length - 4}</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => openEditModal(col)}
                className="p-2 text-gray-400 hover:text-[#8B7EC8] rounded-lg transition-colors"
                title="Edit Collection"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(col)}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Delete Collection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E4DC] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                {editingId ? 'Edit Collection' : 'Create Themed Collection'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Collection Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingId) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Price (if purchasable)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 14.99"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  />
                </div>
              </div>

              {/* Artwork multi-select picker */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="font-semibold text-gray-700 block">
                  Select Artworks in this Collection ({selectedArtworkIds.length} chosen)
                </label>
                <div className="max-h-48 overflow-y-auto border border-[#E8E4DC] rounded-2xl p-2 bg-[#FAF7F2] space-y-1">
                  {availableArtworks.map((art) => {
                    const isSelected = selectedArtworkIds.includes(art.id);
                    return (
                      <div
                        key={art.id}
                        onClick={() => toggleArtworkSelection(art.id)}
                        className={`p-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-white shadow-xs border border-[#8B7EC8]' : 'hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded bg-white p-0.5 border border-gray-100">
                            <img src={art.previewImage} alt={art.title} className="w-full h-full object-contain" />
                          </div>
                          <span className="font-medium text-gray-800 truncate max-w-xs">{art.title}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#8B7EC8]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-6 border-t border-gray-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-[#8B7EC8]"
                  />
                  <span className="font-semibold text-gray-700">Published</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#8B7EC8]"
                  />
                  <span className="font-semibold text-gray-700">Featured on Home</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E4DC] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E4DC] text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
