'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-text-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between pb-6 border-b border-surface-border">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-teal hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cyber Fortress</span>
          </Link>
          <span className="text-[10px] font-mono text-text-muted">Effective Date: November 2026</span>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/10 border border-teal/30 rounded-full text-xs font-mono text-teal">
            <Shield className="w-4 h-4" />
            <span>Zero-Knowledge Architectural Invariant</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            SIS Cyber Fortress Privacy Policy
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Our privacy architecture is built upon a mathematical principle: <em>we cannot compromise or disclose what we cannot access.</em>
          </p>
        </div>

        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-6 text-sm text-text-secondary leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal" />
              <span>1. Zero-Knowledge Cryptographic Vault Policy</span>
            </h2>
            <p>
              All secrets, passwords, encryption tokens, and sensitive notes committed to the SIS Vault Guardian are encrypted exclusively on your client device using <strong>AES-256-GCM</strong>. Encryption keys are derived client-side via <strong>PBKDF2 with HMAC-SHA512</strong> utilizing 600,000 hashing rounds.
            </p>
            <p>
              The SIS Cyber Fortress central servers, database clusters, administrators, and automated indexing services receive only high-entropy ciphertext. We maintain zero recovery master keys, zero secret escrow, and zero backdoors.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">2. Endpoint Telemetry & Knox Attestation Data</h2>
            <p>
              When an Android device is enrolled into the Endpoint Guardian, the application transmits hardware integrity measurements, Play Integrity verdicts, and OS security patch levels. We never access personal photos, contacts, private SMS communications, or unmonitored storage files.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">3. Phishing Shield Inspection Scope</h2>
            <p>
              URLs and content submitted to the SIS Phishing Shield are processed in memory through heuristic lexical scoring and threat signature correlation. Quarantined threats are retained strictly for forensic isolation and can be purged upon request.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-text-primary">4. Data Retention & Deletion Rights</h2>
            <p>
              In accordance with GDPR, CCPA, and enterprise SOC 2 standards, users possess an absolute right to account deletion, cryptographic session revocation, and data sanitization. Disabling a module pauses its active telemetry while preserving historical logs in compliance with regulatory archiving.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
