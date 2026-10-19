'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Shield, CreditCard, DollarSign, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('Mandala Studio');
  const [tagline, setTagline] = useState('Discover Your Art. Choose Your Mandala.');
  const [contactEmail, setContactEmail] = useState('hello@mandalastudio.art');
  const [currency, setCurrency] = useState('USD');
  const [paymentMode, setPaymentMode] = useState('mock');
  const [maxDownloads, setMaxDownloads] = useState(10);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then((res) => res.json())
      .then((data) => {
        if (data.site_settings) {
          const s = data.site_settings;
          if (s.siteName) setSiteName(s.siteName);
          if (s.tagline) setTagline(s.tagline);
          if (s.contactEmail) setContactEmail(s.contactEmail);
          if (s.currency) setCurrency(s.currency);
          if (s.maxDownloads) setMaxDownloads(s.maxDownloads);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'site_settings',
          section: 'settings',
          content: {
            siteName,
            tagline,
            contactEmail,
            currency,
            maxDownloads,
          },
        }),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System Configuration</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
          Store Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage general website identity, default currency, and payment gateways.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#EBF2EC] border border-[#A4C3B2] text-xs text-[#588157] font-semibold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Store settings successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-6">
        
        {/* General Store Identity */}
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E8E4DC] pb-3">
            General Store Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Website Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Official Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Customer Support Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Settlement Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2]"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Gateway Status */}
        <div className="space-y-4 pt-4 border-t border-[#E8E4DC]">
          <h2 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E8E4DC] pb-3">
            Payment Processing Status
          </h2>

          <div className="p-4 rounded-2xl bg-[#F3F0FA] border border-[#D1C9EC] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#6D5FA8]">Active Payment Gateway Mode</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B7EC8] text-white uppercase">
                {paymentMode === 'stripe' ? 'Live Stripe Gateway' : 'Instant Sandbox Test Simulator'}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Sandbox mode allows instant complete checkout simulation, entitlement generation, and file downloading without requiring bank merchant accounts or credit cards. To switch to live Stripe, set <code>STRIPE_SECRET_KEY</code> and <code>NEXT_PUBLIC_PAYMENT_MODE=&quot;stripe&quot;</code> in your <code>.env</code> file.
            </p>
          </div>
        </div>

        {/* Download Limits */}
        <div className="space-y-4 pt-4 border-t border-[#E8E4DC]">
          <h2 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#E8E4DC] pb-3">
            Digital Asset Delivery Security
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700">Maximum Allowed Downloads per Purchase</label>
              <input
                type="number"
                min={1}
                max={100}
                value={maxDownloads}
                onChange={(e) => setMaxDownloads(parseInt(e.target.value) || 10)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2]"
              />
              <span className="text-[10px] text-gray-400">Protects vector originals from unauthorized bandwidth abuse.</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8E4DC] flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
