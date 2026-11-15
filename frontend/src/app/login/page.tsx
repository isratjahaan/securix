'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/lib/user-auth';
import { Shield, Lock, Mail, ArrowRight, AlertTriangle, KeyRound, CheckCircle2, Terminal } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUserAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your corporate email and security password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);
      if (res.mfaRequired && res.tempToken) {
        sessionStorage.setItem('sis_mfa_temp_token', res.tempToken);
        sessionStorage.setItem('sis_mfa_user_email', email);
        router.push('/mfa');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (demoEmail: string, demoPass: string = 'Fortress2026!') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Cyber Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal/10 via-navy-950 to-navy-950 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-teal/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal" />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            SIS <span className="text-teal">CYBER FORTRESS</span>
          </h1>
          <p className="text-sm text-text-secondary">
            Zero-Trust Personal Shield & Endpoint Security
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-navy-900/90 border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal" />
              <span className="text-xs font-mono tracking-wider uppercase text-text-primary">
                Client Access Portal
              </span>
            </div>
            <span className="text-[10px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-full">
              AES-256 TLS
            </span>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-status-critical/10 border border-status-critical/30 rounded-xl text-xs text-status-critical">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="alex.morgan@fintech.sis.corp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-secondary">Security Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-teal hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal to-teal-600 hover:from-teal-400 hover:to-teal rounded-xl text-navy-950 font-bold text-sm tracking-wide shadow-lg shadow-teal/20 transition-all hover:shadow-teal/40 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <span>INITIALIZE SECURE SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-2 border-t border-surface-border space-y-2">
            <span className="text-[11px] font-mono text-text-muted block text-center uppercase tracking-wider">
              Quick Connect Test Identities
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoUser('alex.morgan@fintech.sis.corp')}
                className="px-2.5 py-1.5 bg-navy-950 hover:bg-navy-800 border border-surface-border hover:border-teal/40 rounded-lg text-left text-xs transition"
              >
                <div className="font-semibold text-text-primary truncate">Alex Morgan</div>
                <div className="text-[10px] text-text-secondary truncate">Standard User</div>
              </button>
              <button
                type="button"
                onClick={() => setDemoUser('sarah.vance@fortress.sis.enterprise')}
                className="px-2.5 py-1.5 bg-navy-950 hover:bg-navy-800 border border-surface-border hover:border-cyan/40 rounded-lg text-left text-xs transition"
              >
                <div className="font-semibold text-text-primary truncate">Dr. Sarah Vance</div>
                <div className="text-[10px] text-cyan truncate">Admin (Requires MFA)</div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-text-secondary">
            <span>New to SIS Cyber Fortress?</span>
            <Link href="/register" className="text-teal hover:underline font-semibold">
              Create User Account
            </Link>
          </div>
        </div>

        {/* Super Admin Switcher */}
        <div className="text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan/80 hover:text-cyan transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Switch to Enterprise Super Admin Console &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
