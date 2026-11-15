'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 text-text-primary flex flex-col justify-center items-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-status-critical/10 border border-status-critical/30 text-status-critical flex items-center justify-center mx-auto shadow-xl shadow-status-critical/20 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-status-critical uppercase tracking-widest font-bold">
            ERROR 404 &bull; PERIMETER BREACH INTERCEPTED
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Target Sector Not Found
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            The requested resource endpoint is unmapped or has been quarantined by Zero-Trust perimeter guards.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-teal hover:bg-teal-400 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal/20"
          >
            RETURN TO SAFE SECTOR (DASHBOARD)
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-navy-900 hover:bg-navy-800 text-text-primary border border-surface-border text-xs font-semibold rounded-xl transition"
          >
            PLATFORM HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
