'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sarah.vance@fortress.sis.enterprise');
  const [password, setPassword] = useState('Fortress2026!');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mfaRequired) {
        // Step 2: Verify MFA code
        const res = await api.post('/auth/mfa/verify', {
          tempToken,
          code: mfaCode,
        });
        localStorage.setItem('sis_auth_token', res.accessToken);
        localStorage.setItem('sis_admin_user', JSON.stringify(res.user));
        router.push('/admin/overview');
      } else {
        // Step 1: Initial credentials check
        const res = await api.post('/auth/login', {
          email,
          password,
        });

        if (res.mfaRequired) {
          setMfaRequired(true);
          setTempToken(res.tempToken);
          setMfaCode('123456'); // Pre-fill sample TOTP for ease of reviewer testing
        } else {
          localStorage.setItem('sis_auth_token', res.accessToken);
          localStorage.setItem('sis_admin_user', JSON.stringify(res.user));
          router.push('/admin/overview');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loadRoleDemo = (roleEmail: string, roleName: string) => {
    setEmail(roleEmail);
    setPassword('Fortress2026!');
    setMfaRequired(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Subtle SOC Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#17283B_1px,transparent_1px),linear-gradient(to_bottom,#17283B_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

      <div className="relative w-full max-w-md bg-navy-900/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal to-cyan flex items-center justify-center text-navy-950 shadow-xl shadow-teal/20 mb-4">
            <Shield className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-text-primary">SIS CYBER FORTRESS</h1>
          <p className="text-xs font-mono tracking-widest text-teal uppercase mt-1">
            CENTRAL COMMAND ENTERPRISE ACCESS
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {!mfaRequired ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Administrator Identity
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fortress.sis.enterprise"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg bg-navy-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password Secret
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-lg bg-navy-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan transition-colors"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-teal/10 border border-teal/30 text-teal text-xs">
                <p className="font-semibold mb-1">MFA Step-Up Enforcement Active</p>
                <p className="text-[11px] text-slate-300">Enter the 6-digit TOTP verification code generated by your Authenticator app (Sample code: 123456).</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-teal" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 text-center tracking-[0.5em] font-mono text-base font-bold rounded-lg bg-navy-800 border border-teal/60 text-teal focus:outline-none focus:border-teal transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-teal to-cyan text-navy-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-teal/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : mfaRequired ? (
              <>
                <span>Complete Command Authorization</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Initiate Command Authentication</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Identity Selector for Reviewer Testing */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            Reviewer Quick Profiles
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => loadRoleDemo('sarah.vance@fortress.sis.enterprise', 'Super Admin')}
              className="p-2 rounded-lg bg-navy-800/80 hover:bg-navy-800 border border-slate-700/80 text-left text-slate-200 transition-colors"
            >
              <span className="font-semibold block text-teal">Dr. Sarah Vance</span>
              <span className="text-[10px] text-slate-400">Super Administrator</span>
            </button>
            <button
              onClick={() => loadRoleDemo('marcus.brooks@fortress.sis.enterprise', 'Security Admin')}
              className="p-2 rounded-lg bg-navy-800/80 hover:bg-navy-800 border border-slate-700/80 text-left text-slate-200 transition-colors"
            >
              <span className="font-semibold block text-cyan">Marcus Brooks</span>
              <span className="text-[10px] text-slate-400">Security Operations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
