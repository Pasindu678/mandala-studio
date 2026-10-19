'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      window.location.href = '/account';
    } catch {
      setError('An error occurred during registration');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-6 h-6 text-[#8B7EC8]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Create an Account</h1>
        <p className="text-xs text-gray-500">
          Save your favorite mandalas, track purchase receipts, and access unlimited downloads.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-xs space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>Full Name</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Maya Lin"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#8B7EC8] focus:bg-white"
          />
        </div>

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
            <span>Password (min. 6 characters)</span>
          </label>
          <input
            type="password"
            required
            minLength={6}
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
            <span>Creating account...</span>
          ) : (
            <>
              <span>Register Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-3 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#8B7EC8] hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
