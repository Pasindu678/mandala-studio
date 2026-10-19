'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  Upload, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Archive, 
  Check, 
  X, 
  Eye, 
  AlertCircle,
  EyeOff
} from 'lucide-react';

interface ArtworkAdminItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  difficulty: string;
  previewImage: string;
  originalFile: string;
  isFree: boolean;
  price: number;
  license: string;
  isPublished: boolean;
  isArchived: boolean;
  salesCount: number;
  viewsCount: number;
  tags: string;
  _count?: { orderItems: number };
}

interface CategoryOption {
  id: string;
  name: string;
}

export default function AdminArtworkPage() {
  const [artworks, setArtworks] = useState<ArtworkAdminItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Edit Modal State
  const [editingArtwork, setEditingArtwork] = useState<ArtworkAdminItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('INTERMEDIATE');
  const [editPrice, setEditPrice] = useState(0);
  const [editIsFree, setEditIsFree] = useState(false);
  const [editLicense, setEditLicense] = useState('PERSONAL');
  const [editIsPublished, setEditIsPublished] = useState(true);
  const [editIsArchived, setEditIsArchived] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchArtworks = async () => {
    try {
      const res = await fetch('/api/admin/artwork');
      const data = await res.json();
      if (Array.isArray(data)) setArtworks(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch {
      //
    }
  };

  useEffect(() => {
    fetchArtworks();
    fetchCategories();
  }, []);

  const openEditModal = (art: ArtworkAdminItem) => {
    setEditingArtwork(art);
    setEditTitle(art.title);
    setEditSlug(art.slug);
    setEditDescription(art.description || '');
    setEditCategoryId(art.categoryId);
    setEditDifficulty(art.difficulty);
    setEditPrice(art.price);
    setEditIsFree(art.isFree);
    setEditLicense(art.license);
    setEditIsPublished(art.isPublished);
    setEditIsArchived(art.isArchived);
    setModalError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtwork) return;

    setModalError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/artwork', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingArtwork.id,
          title: editTitle.trim(),
          slug: editSlug.trim(),
          description: editDescription.trim(),
          categoryId: editCategoryId,
          difficulty: editDifficulty,
          price: editIsFree ? 0 : Number(editPrice),
          isFree: editIsFree,
          license: editLicense,
          isPublished: editIsPublished,
          isArchived: editIsArchived,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.error || 'Failed to update artwork');
        setSubmitting(false);
        return;
      }

      setEditingArtwork(null);
      fetchArtworks();
    } catch (err: any) {
      setModalError(err.message || 'Error updating artwork');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (art: ArtworkAdminItem) => {
    try {
      await fetch('/api/admin/artwork', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: art.id,
          isPublished: !art.isPublished,
        }),
      });
      fetchArtworks();
    } catch {
      //
    }
  };

  const handleToggleArchive = async (art: ArtworkAdminItem) => {
    try {
      await fetch('/api/admin/artwork', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: art.id,
          isArchived: !art.isArchived,
        }),
      });
      fetchArtworks();
    } catch {
      //
    }
  };

  const handleDelete = async (art: ArtworkAdminItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${art.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/artwork?id=${art.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Cannot delete artwork');
        return;
      }

      fetchArtworks();
    } catch {
      alert('Error deleting artwork');
    }
  };

  // Filter artworks
  const filtered = artworks.filter((art) => {
    if (search && !art.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && art.categoryId !== categoryFilter) return false;
    if (statusFilter === 'published' && (!art.isPublished || art.isArchived)) return false;
    if (statusFilter === 'draft' && (art.isPublished || art.isArchived)) return false;
    if (statusFilter === 'archived' && !art.isArchived) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Catalog Management</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Mandala Artworks ({artworks.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Publish, edit pricing, change categories, replace images, and archive artwork without writing code.
          </p>
        </div>

        <Link
          href="/admin/artwork/upload"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#8B7EC8] hover:bg-[#6D5FA8] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Artwork</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E4DC] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by artwork title..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#8B7EC8]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#8B7EC8]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#8B7EC8]"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Artwork Table Card */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E4DC] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Artwork</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Performance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] p-1 border border-[#E8E4DC] flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={art.previewImage} alt={art.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate max-w-xs">{art.title}</h4>
                        <span className="font-mono text-[10px] text-gray-400">/{art.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E4DC] font-medium text-gray-700">
                      {art.category.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-gray-600">
                      {art.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {art.isFree ? (
                      <span className="font-bold text-[#588157]">Free</span>
                    ) : (
                      <div>
                        <span className="font-serif font-bold text-gray-900">${art.price.toFixed(2)}</span>
                        <span className="block text-[10px] text-gray-400">{art.license}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-gray-700 font-semibold">{art.salesCount} sales</div>
                    <div className="text-[10px] text-gray-400">{art.viewsCount} views</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {art.isArchived ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">
                        Archived
                      </span>
                    ) : art.isPublished ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF2EC] text-[#588157] uppercase">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <a
                      href={`/artwork/${art.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg inline-block"
                      title="View public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleTogglePublish(art)}
                      className={`p-1.5 rounded-lg ${
                        art.isPublished ? 'text-[#588157] hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={art.isPublished ? 'Unpublish Artwork' : 'Publish Artwork'}
                    >
                      {art.isPublished ? <Check className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(art)}
                      className="p-1.5 text-gray-400 hover:text-[#8B7EC8] rounded-lg"
                      title="Edit Artwork"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleArchive(art)}
                      className="p-1.5 text-gray-400 hover:text-amber-600 rounded-lg"
                      title={art.isArchived ? 'Unarchive' : 'Archive Artwork'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(art)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                      title="Delete Artwork"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Artwork Modal */}
      {editingArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E4DC] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Edit Artwork: {editingArtwork.title}
              </h2>
              <button onClick={() => setEditingArtwork(null)} className="p-1.5 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Artwork Title *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Category *</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Difficulty Level</label>
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={editIsFree}
                    value={editPrice}
                    onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs disabled:opacity-50"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsFree}
                      onChange={(e) => {
                        setEditIsFree(e.target.checked);
                        if (e.target.checked) setEditPrice(0);
                      }}
                      className="rounded text-[#588157]"
                    />
                    <span className="font-semibold text-[#588157]">Mark as Free</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">License</label>
                  <select
                    value={editLicense}
                    onChange={(e) => setEditLicense(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  >
                    <option value="PERSONAL">Personal Use</option>
                    <option value="COMMERCIAL">Commercial Rights</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-6 border-t border-gray-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsPublished}
                    onChange={(e) => setEditIsPublished(e.target.checked)}
                    className="rounded text-[#8B7EC8]"
                  />
                  <span className="font-semibold text-gray-700">Published</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsArchived}
                    onChange={(e) => setEditIsArchived(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span className="font-semibold text-gray-700">Archived</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E4DC] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingArtwork(null)}
                  className="px-4 py-2 rounded-xl border border-[#E8E4DC] text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Update Artwork'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
