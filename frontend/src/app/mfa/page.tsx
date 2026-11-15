'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/lib/user-auth';
import { Shield, KeyRound, ArrowRight, AlertTriangle, Smartphone, RefreshCw } from 'lucide-react';

export default function MfaPage() {
  const router = useRouter();
  const { verifyMfa } = useUserAuth();

  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('sis_mfa_temp_token');
    const email = sessionStorage.getItem('sis_mfa_user_email');
    if (!token) {
      router.replace('/login');
    } else {
      setTempToken(token);
      setUserEmail(email);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempToken) return;
    if (code.length !== 6) {
      setError('Please enter your complete 6-digit TOTP verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await verifyMfa(tempToken, code);
      sessionStorage.removeItem('sis_mfa_temp_token');
      sessionStorage.removeItem('sis_mfa_user_email');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'MFA validation failed. Check your authenticator and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal/10 via-navy-950 to-navy-950 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-teal/10 border border-teal/30 items-center justify-center text-teal mb-1">
            <KeyRound className="w-6 h-6 text-teal" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Multi-Factor Authentication
          </h1>
          <p className="text-sm text-text-secondary">
            Mandatory Zero-Trust security challenge for {userEmail || 'elevated session'}
          </p>
        </div>

        <div className="bg-navy-900/90 border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 p-3 bg-navy-950 border border-teal/20 rounded-xl text-xs text-text-secondary">
            <Smartphone className="w-5 h-5 text-teal shrink-0" />
            <span>Open your hardware authenticator app (Google Authenticator, Knox, or YubiKey) and enter the 6-digit security code.</span>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-status-critical/10 border border-status-critical/30 rounded-xl text-xs text-status-critical">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-muted uppercase tracking-wider block text-center">
                6-Digit TOTP Passcode
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-teal outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal to-teal-600 hover:from-teal-400 hover:to-teal rounded-xl text-navy-950 font-bold text-sm tracking-wide shadow-lg shadow-teal/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>VERIFYING CRYPTOGRAPHIC TOKEN...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM & UNLOCK SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Test Key Helper */}
          <div className="pt-2 border-t border-surface-border text-center">
            <button
              type="button"
              onClick={() => setCode('123456')}
              className="text-xs font-mono text-cyan hover:underline"
            >
              Use Test Passcode: 123456
            </button>
          </div>

          <div className="text-center pt-1">
            <Link href="/login" className="text-xs text-text-muted hover:text-text-primary transition">
              &larr; Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
