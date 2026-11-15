'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/lib/user-auth';
import { Shield, Lock, Mail, User, Building, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useUserAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('Security Operations');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must accept the SIS Cyber Fortress Security & Acceptable Use Policy.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        fullName,
        email,
        username: username || email.split('@')[0],
        department,
        password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal/10 via-navy-950 to-navy-950 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal via-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-teal/20">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-teal" />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Create Protected Account
          </h1>
          <p className="text-sm text-text-secondary">
            Join the SIS Cyber Fortress Zero-Trust Ecosystem
          </p>
        </div>

        <div className="bg-navy-900/90 border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-status-critical/10 border border-status-critical/30 rounded-xl text-xs text-status-critical">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Jordan Lee"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Username</label>
                <input
                  type="text"
                  placeholder="jordan.lee"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  placeholder="jordan.lee@cyber.sis.corp"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Enterprise Department</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary outline-none transition"
                >
                  <option value="Security Operations">Security Operations (SOC)</option>
                  <option value="Engineering & Infrastructure">Engineering & Infrastructure</option>
                  <option value="Finance & Payments">Finance & Payments</option>
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Executive Command">Executive Command</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-surface-border bg-navy-950 text-teal focus:ring-teal"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" className="text-teal hover:underline" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-teal hover:underline" target="_blank">
                  Zero-Knowledge Privacy Policy
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal to-teal-600 hover:from-teal-400 hover:to-teal rounded-xl text-navy-950 font-bold text-sm tracking-wide shadow-lg shadow-teal/20 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>INITIALIZING ACCOUNT...</span>
                </>
              ) : (
                <>
                  <span>CREATE PROTECTED IDENTITY</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between pt-2 border-t border-surface-border text-xs text-text-secondary">
            <span>Already have credentials?</span>
            <Link href="/login" className="text-teal hover:underline font-semibold">
              Sign In Session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
