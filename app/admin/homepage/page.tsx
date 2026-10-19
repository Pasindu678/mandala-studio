'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Save, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Plus, 
  Trash2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function AdminHomepageContentPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'banner' | 'about' | 'faq'>('hero');
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hero state
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  const [heroCtaLink, setHeroCtaLink] = useState('');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('');
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroBadgeText, setHeroBadgeText] = useState('');

  // Banner state
  const [bannerActive, setBannerActive] = useState(true);
  const [bannerBadge, setBannerBadge] = useState('');
  const [bannerMessage, setBannerMessage] = useState('');
  const [bannerDiscountCode, setBannerDiscountCode] = useState('');
  const [bannerLinkText, setBannerLinkText] = useState('');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('');

  // About state
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutSubtitle, setAboutSubtitle] = useState('');
  const [aboutBody, setAboutBody] = useState('');
  const [pillar1Title, setPillar1Title] = useState('');
  const [pillar1Text, setPillar1Text] = useState('');
  const [pillar2Title, setPillar2Title] = useState('');
  const [pillar2Text, setPillar2Text] = useState('');
  const [pillar3Title, setPillar3Title] = useState('');
  const [pillar3Text, setPillar3Text] = useState('');

  // FAQ state
  const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then((res) => res.json())
      .then((data) => {
        if (data.homepage_hero) {
          const h = data.homepage_hero;
          setHeroHeadline(h.headline || '');
          setHeroSubheadline(h.subheadline || '');
          setHeroCtaText(h.ctaText || '');
          setHeroCtaLink(h.ctaLink || '');
          setHeroSecondaryCtaText(h.secondaryCtaText || '');
          setHeroSecondaryCtaLink(h.secondaryCtaLink || '');
          setHeroImage(h.heroImage || '');
          setHeroBadgeText(h.badgeText || '');
        }

        if (data.homepage_banner) {
          const b = data.homepage_banner;
          setBannerActive(b.isActive ?? true);
          setBannerBadge(b.badge || '');
          setBannerMessage(b.message || '');
          setBannerDiscountCode(b.discountCode || '');
          setBannerLinkText(b.linkText || '');
          setBannerLinkUrl(b.linkUrl || '');
        }

        if (data.homepage_about) {
          const a = data.homepage_about;
          setAboutTitle(a.title || '');
          setAboutSubtitle(a.subtitle || '');
          setAboutBody(a.body || '');
          setPillar1Title(a.pillar1Title || '');
          setPillar1Text(a.pillar1Text || '');
          setPillar2Title(a.pillar2Title || '');
          setPillar2Text(a.pillar2Text || '');
          setPillar3Title(a.pillar3Title || '');
          setPillar3Text(a.pillar3Text || '');
        }

        if (data.homepage_faq && Array.isArray(data.homepage_faq.items)) {
          setFaqItems(data.homepage_faq.items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSection = async (key: string, section: string, content: any) => {
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, section, content }),
      });

      if (!res.ok) {
        throw new Error('Failed to save content');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Save error');
    }
  };

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    saveSection('homepage_hero', 'hero', {
      headline: heroHeadline,
      subheadline: heroSubheadline,
      ctaText: heroCtaText,
      ctaLink: heroCtaLink,
      secondaryCtaText: heroSecondaryCtaText,
      secondaryCtaLink: heroSecondaryCtaLink,
      heroImage,
      badgeText: heroBadgeText,
    });
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    saveSection('homepage_banner', 'banner', {
      isActive: bannerActive,
      badge: bannerBadge,
      message: bannerMessage,
      discountCode: bannerDiscountCode,
      linkText: bannerLinkText,
      linkUrl: bannerLinkUrl,
    });
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    saveSection('homepage_about', 'about', {
      title: aboutTitle,
      subtitle: aboutSubtitle,
      body: aboutBody,
      pillar1Title,
      pillar1Text,
      pillar2Title,
      pillar2Text,
      pillar3Title,
      pillar3Text,
    });
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    saveSection('homepage_faq', 'faq', {
      items: faqItems,
    });
  };

  const addFaqItem = () => {
    setFaqItems((prev) => [...prev, { question: '', answer: '' }]);
  };

  const removeFaqItem = (index: number) => {
    setFaqItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', val: string) => {
    setFaqItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8B7EC8] uppercase tracking-wider mb-1">
            <FileEdit className="w-3.5 h-3.5" />
            <span>No-Code CMS Content Editor</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Homepage Content Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Update headlines, promo banners, about text, and FAQs. Changes go live immediately without redeploying.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E4DC] hover:bg-[#FAF7F2] text-xs font-semibold text-gray-700 shadow-2xs transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#8B7EC8]" />
          <span>Preview Live Website</span>
        </a>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#EBF2EC] border border-[#A4C3B2] text-xs text-[#588157] font-semibold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Homepage changes successfully saved and published! Cache has been refreshed.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-[#E8E4DC] pb-2 text-xs font-semibold">
        {[
          { key: 'hero', label: '1. Hero Section' },
          { key: 'banner', label: '2. Promotional Banner' },
          { key: 'about', label: '3. About & Philosophy' },
          { key: 'faq', label: '4. FAQ Accordion' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === tab.key
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-gray-600 hover:bg-[#FAF7F2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Hero Section */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-6">
          <div className="border-b border-[#E8E4DC] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Hero Header &amp; Call to Action</h2>
            <p className="text-xs text-gray-500">The first visual section every visitor sees on the store.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Badge Text</label>
              <input
                type="text"
                value={heroBadgeText}
                onChange={(e) => setHeroBadgeText(e.target.value)}
                placeholder="Handcrafted Radial Art & Digital Printables"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Main Headline *</label>
              <input
                type="text"
                required
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] font-serif text-base font-bold text-gray-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Subheadline / Artwork Description</label>
              <textarea
                rows={3}
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Primary Button Text</label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Primary Button Destination</label>
                <input
                  type="text"
                  value={heroCtaLink}
                  onChange={(e) => setHeroCtaLink(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Hero Featured Image Path</label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs font-mono"
                />
              </div>
              <div className="pt-6">
                <span className="text-[10px] text-gray-400">Current image preview available on public homepage.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E4DC] flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Hero Section</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Promotional Banner */}
      {activeTab === 'banner' && (
        <form onSubmit={handleSaveBanner} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-6">
          <div className="border-b border-[#E8E4DC] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Top Announcement Banner</h2>
            <p className="text-xs text-gray-500">Highlight discount coupons, seasonal sales, or special news.</p>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bannerActive}
                onChange={(e) => setBannerActive(e.target.checked)}
                className="rounded text-[#8B7EC8]"
              />
              <span className="font-semibold text-gray-900">Show Banner on Store Header</span>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Badge Label</label>
                <input
                  type="text"
                  value={bannerBadge}
                  onChange={(e) => setBannerBadge(e.target.value)}
                  placeholder="e.g. Spring Sale"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700">Promo Discount Code</label>
                <input
                  type="text"
                  value={bannerDiscountCode}
                  onChange={(e) => setBannerDiscountCode(e.target.value)}
                  placeholder="e.g. ZEN20"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Banner Announcement Message</label>
              <input
                type="text"
                value={bannerMessage}
                onChange={(e) => setBannerMessage(e.target.value)}
                placeholder="Take 20% off all digital collections with code"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E4DC] flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Banner</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: About & Pillars */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-6">
          <div className="border-b border-[#E8E4DC] pb-4">
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">About Us &amp; Sacred Geometry Pillars</h2>
            <p className="text-xs text-gray-500">Communicate the meditative philosophy, vector quality, and license benefits.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Section Title</label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs font-serif font-bold text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Narrative Body</label>
              <textarea
                rows={4}
                value={aboutBody}
                onChange={(e) => setAboutBody(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E4DC] space-y-2">
                <input
                  type="text"
                  value={pillar1Title}
                  onChange={(e) => setPillar1Title(e.target.value)}
                  className="w-full font-bold text-gray-900 bg-transparent border-b border-[#E8E4DC] pb-1 text-xs"
                />
                <textarea
                  rows={3}
                  value={pillar1Text}
                  onChange={(e) => setPillar1Text(e.target.value)}
                  className="w-full text-xs text-gray-600 bg-transparent resize-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E4DC] space-y-2">
                <input
                  type="text"
                  value={pillar2Title}
                  onChange={(e) => setPillar2Title(e.target.value)}
                  className="w-full font-bold text-gray-900 bg-transparent border-b border-[#E8E4DC] pb-1 text-xs"
                />
                <textarea
                  rows={3}
                  value={pillar2Text}
                  onChange={(e) => setPillar2Text(e.target.value)}
                  className="w-full text-xs text-gray-600 bg-transparent resize-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E4DC] space-y-2">
                <input
                  type="text"
                  value={pillar3Title}
                  onChange={(e) => setPillar3Title(e.target.value)}
                  className="w-full font-bold text-gray-900 bg-transparent border-b border-[#E8E4DC] pb-1 text-xs"
                />
                <textarea
                  rows={3}
                  value={pillar3Text}
                  onChange={(e) => setPillar3Text(e.target.value)}
                  className="w-full text-xs text-gray-600 bg-transparent resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8E4DC] flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save About Section</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: FAQ Accordion Editor */}
      {activeTab === 'faq' && (
        <form onSubmit={handleSaveFaq} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-500">Help customers understand file formats, downloads, and licensing.</p>
            </div>
            <button
              type="button"
              onClick={addFaqItem}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E4DC] text-xs font-semibold text-gray-700 hover:bg-[#FAF0E6]"
            >
              <Plus className="w-3.5 h-3.5 text-[#588157]" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E4DC] space-y-2 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaqItem(idx)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                  placeholder="e.g. Can I use these for commercial products?"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-white font-semibold text-xs"
                />

                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                  placeholder="Answer text..."
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E8E4DC] bg-white text-xs"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E8E4DC] flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save FAQ List</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
