'use client';

import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  _count?: { artworks: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate suggested slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(autoSlug);
      if (!coverImage) {
        setCoverImage(`/uploads/categories/${autoSlug}.svg`);
      }
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setCoverImage('');
    setDisplayOrder(categories.length + 1);
    setIsFeatured(false);
    setIsPublished(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setCoverImage(cat.coverImage || '');
    setDisplayOrder(cat.displayOrder);
    setIsFeatured(cat.isFeatured);
    setIsPublished(cat.isPublished);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      coverImage: coverImage.trim(),
      displayOrder: Number(displayOrder),
      isFeatured,
      isPublished,
    };

    try {
      const res = await fetch('/api/admin/categories', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save category');
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setFormError(err.message || 'Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete the category "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories?id=${cat.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to delete category');
        return;
      }

      fetchCategories();
    } catch {
      alert('Error deleting category');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Content Architecture</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Manage Categories
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create and organize mandala themes. Categories automatically update in the gallery navigation and filters without writing code.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table Card */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E4DC] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Cover</th>
                <th className="py-3.5 px-4">Name &amp; Slug</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Artworks</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-4 font-mono font-semibold text-gray-600">
                    {cat.displayOrder}
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] p-1 border border-[#E8E4DC] flex items-center justify-center overflow-hidden">
                      {cat.coverImage ? (
                        <img src={cat.coverImage} alt={cat.name} className="w-full h-full object-contain" />
                      ) : (
                        <FolderTree className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900 text-sm">{cat.name}</div>
                    <div className="font-mono text-[11px] text-gray-400 mt-0.5">/{cat.slug}</div>
                  </td>
                  <td className="py-4 px-4 max-w-xs truncate text-gray-500">
                    {cat.description || '—'}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold px-2 py-0.5 rounded-full bg-[#EBF2EC] text-[#588157]">
                      {cat._count?.artworks ?? 0} designs
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider ${
                        cat.isPublished ? 'text-[#588157]' : 'text-gray-400'
                      }`}>
                        {cat.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {cat.isFeatured && (
                        <span className="text-[10px] text-[#D08C51] font-semibold">Featured on Home</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <a
                      href={`/categories/${cat.slug}`}
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg inline-block transition-colors"
                      title="View public category page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-gray-400 hover:text-[#8B7EC8] rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Delete Category"
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E4DC] space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                {editingId ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Celestial Mandalas"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#8B7EC8] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">
                  URL Slug * (Suggested automatically)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="celestial-mandalas"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] font-mono text-xs focus:outline-none focus:border-[#8B7EC8] focus:bg-white"
                />
                <span className="text-[10px] text-gray-400">Public URL: /categories/{slug || 'your-slug'}</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for public category header..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#8B7EC8] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Cover Image URL</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="/uploads/categories/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-[#8B7EC8] focus:ring-[#8B7EC8]"
                  />
                  <span className="font-semibold text-gray-700">Published (Visible in Store)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#8B7EC8] focus:ring-[#8B7EC8]"
                  />
                  <span className="font-semibold text-gray-700">Featured on Home</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8E4DC] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E4DC] text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
