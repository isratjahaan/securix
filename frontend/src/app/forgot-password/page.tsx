'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal/10 border border-teal/30 flex items-center justify-center text-teal">
              <Shield className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Account Recovery
          </h1>
          <p className="text-sm text-text-secondary">
            Reset credentials through corporate security challenge
          </p>
        </div>

        <div className="bg-navy-900/90 border border-surface-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-status-healthy/10 border border-status-healthy/30 flex items-center justify-center text-status-healthy mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-semibold text-text-primary">Recovery Dispatch Sent</h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                If <strong className="text-text-primary">{email}</strong> corresponds to an active enterprise profile, an encrypted reset challenge has been transmitted.
              </p>
              <div className="pt-2">
                <Link
                  href="/reset-password?token=demo-recovery-token"
                  className="inline-flex items-center gap-2 text-xs text-teal hover:underline font-mono"
                >
                  Proceed to Reset Demo &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="user@sis.corp"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-teal to-teal-600 hover:from-teal-400 hover:to-teal rounded-xl text-navy-950 font-bold text-sm tracking-wide shadow-lg shadow-teal/20 transition-all mt-2"
              >
                <span>TRANSMIT RECOVERY CHALLENGE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-surface-border">
            <Link href="/login" className="text-xs text-text-muted hover:text-text-primary transition">
              &larr; Back to Secure Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
