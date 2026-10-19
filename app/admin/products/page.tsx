'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string;
  price: number;
  currency: string;
  productType: string;
  license: string;
  fileUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  _count?: { orderItems: number };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [price, setPrice] = useState(9.99);
  const [productType, setProductType] = useState('COLORING_BOOK_PDF');
  const [license, setLicense] = useState('PERSONAL');
  const [fileUrl, setFileUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setCoverImage('/uploads/products/serenity-mandala-coloring-book.svg');
    setPrice(9.99);
    setProductType('COLORING_BOOK_PDF');
    setLicense('PERSONAL');
    setFileUrl('/storage/private/products/serenity-mandala-coloring-book.pdf');
    setIsPublished(true);
    setIsFeatured(false);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (prod: ProductItem) => {
    setEditingId(prod.id);
    setTitle(prod.title);
    setSlug(prod.slug);
    setDescription(prod.description || '');
    setCoverImage(prod.coverImage);
    setPrice(prod.price);
    setProductType(prod.productType);
    setLicense(prod.license);
    setFileUrl(prod.fileUrl || '');
    setIsPublished(prod.isPublished);
    setIsFeatured(prod.isFeatured);
    setError(null);
    setModalOpen(true);
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
      price: Number(price),
      currency: 'USD',
      productType,
      license,
      fileUrl: fileUrl.trim() || undefined,
      isPublished,
      isFeatured,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save product');
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (prod: ProductItem) => {
    if (!confirm(`Are you sure you want to delete product "${prod.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${prod.id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Cannot delete product');
        return;
      }

      fetchProducts();
    } catch {
      alert('Error deleting product');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Commercial Store Catalog</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Products &amp; Pricing Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure coloring book PDFs, bundled vectors, licenses, and product prices without modifying code.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Commercial Product</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8E4DC] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E4DC] text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">License</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Orders</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] p-1 border border-[#E8E4DC] flex items-center justify-center overflow-hidden">
                        <img src={prod.coverImage} alt={prod.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate max-w-xs">{prod.title}</h4>
                        <span className="font-mono text-[10px] text-gray-400">/{prod.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] border border-[#E8E4DC] text-gray-700">
                      {prod.productType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-600">
                    {prod.license}
                  </td>
                  <td className="py-4 px-4 font-serif font-bold text-sm text-[#1A1A1A]">
                    ${prod.price.toFixed(2)} USD
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#588157]">
                    {prod._count?.orderItems || 0} purchases
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-0.5">
                      <span className={`text-[10px] font-bold uppercase ${
                        prod.isPublished ? 'text-[#588157]' : 'text-gray-400'
                      }`}>
                        {prod.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {prod.isFeatured && (
                        <span className="text-[10px] text-[#D08C51] font-semibold">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <a
                      href="/shop"
                      target="_blank"
                      className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg inline-block"
                      title="View on Shop"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 text-gray-400 hover:text-[#8B7EC8] rounded-lg"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                      title="Delete Product"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8E4DC] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                {editingId ? 'Edit Product' : 'Add New Commercial Product'}
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
                  <label className="font-semibold text-gray-700">Product Title *</label>
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
                    placeholder="e.g. Zen Meditation Coloring Book"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Product Type</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  >
                    <option value="COLORING_BOOK_PDF">Coloring Book PDF</option>
                    <option value="THEMED_BUNDLE">Themed Bundle</option>
                    <option value="PREMIUM_COLLECTION">Collector Edition</option>
                    <option value="INDIVIDUAL_ARTWORK">Individual Design</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs font-semibold"
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
                  <label className="font-semibold text-gray-700">Cover Image URL</label>
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-700">Private Download File URL</label>
                  <input
                    type="text"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="/storage/private/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">License Terms</label>
                <select
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                >
                  <option value="PERSONAL">Personal License (Print &amp; Color)</option>
                  <option value="COMMERCIAL">Commercial Rights (Publish &amp; Merchandise)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center space-x-6 border-t border-gray-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-[#8B7EC8]"
                  />
                  <span className="font-semibold text-gray-700">Published in Store</span>
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
                  {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
