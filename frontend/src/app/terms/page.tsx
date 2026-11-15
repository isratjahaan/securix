'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-text-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-surface-border">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-teal hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cyber Fortress</span>
          </Link>
          <span className="text-[10px] font-mono text-text-muted">Revision: 2026.4</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan/10 border border-cyan/30 rounded-full text-xs font-mono text-cyan">
            <FileText className="w-4 h-4" />
            <span>Enterprise Master Terms of Service</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            SIS Cyber Fortress Terms of Service
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            These terms govern your access to the SIS Cyber Fortress Web Application, Android APK, and automated defense services.
          </p>
        </div>

        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-6 text-sm text-text-secondary leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">1. Permitted Defensive Usage</h2>
            <p>
              SIS Cyber Fortress is licensed solely for enterprise cyber defense, authorized internal vulnerability assessment, threat intelligence correlation, and mobile endpoint protection. Use of any module to conduct unauthorized probing, denial-of-service, or lateral intrusions on third-party infrastructure is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Cryptographic Passphrase Responsibility</h2>
            <p>
              Because the Vault Guardian operates on Zero-Knowledge encryption principles, users retain sole custody of their master passwords and secret keys. If master passphrases are lost, encrypted records cannot be reconstructed by our support personnel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. Service Level Agreement & Autonomous Containment</h2>
            <p>
              The 12-in-1 modular ecosystem maintains a 99.99% availability commitment. In the event of an active ransomware outbreak or critical hardware integrity violation, the system is authorized to enact automated host network isolation to prevent lateral movement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
