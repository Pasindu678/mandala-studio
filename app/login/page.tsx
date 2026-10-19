'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // If user is admin, route to /admin, else /account
      if (data.user?.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/account';
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const fillQuickCredentials = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-6 h-6 text-[#8B7EC8]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Welcome Back</h1>
        <p className="text-xs text-gray-500">
          Sign in to access your purchased downloads, favorites, and studio account.
        </p>
      </div>

      {/* Quick Test Demo Fillers */}
      <div className="bg-[#F3F0FA] p-4 rounded-2xl border border-[#D1C9EC] space-y-2.5 text-xs">
        <span className="font-bold text-[#6D5FA8] block uppercase tracking-wider text-[10px]">
          Demo Quick Credentials:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillQuickCredentials('admin@mandalastudio.art', 'admin123456')}
            className="flex-1 py-1.5 px-2 bg-white rounded-lg border border-[#D1C9EC] text-[#6D5FA8] font-semibold hover:bg-[#8B7EC8] hover:text-white transition-colors"
          >
            Fill Admin Credentials
          </button>
          <button
            type="button"
            onClick={() => fillQuickCredentials('customer@example.com', 'customer123456')}
            className="flex-1 py-1.5 px-2 bg-white rounded-lg border border-[#D1C9EC] text-[#4A4A4A] font-semibold hover:bg-gray-100 transition-colors"
          >
            Fill Customer
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center space-x-1.5">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#8B7EC8] focus:bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>Password</span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#8B7EC8] focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-full bg-[#1A1A1A] hover:bg-[#8B7EC8] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-3 text-center text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-[#8B7EC8] hover:underline">
            Register here
          </Link>
        </div>
      </form>

    </div>
  );
}
