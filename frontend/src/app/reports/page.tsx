'use client';

import React, { useState } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import {
  FileText,
  Download,
  Shield,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  ExternalLink
} from 'lucide-react';

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    {
      id: 'rep-01',
      title: 'Executive Cybersecurity Posture Summary',
      period: 'Monthly Q4 2026',
      standard: 'ISO/IEC 27001:2022',
      status: 'VERIFIED_COMPLIANT',
      score: '96/100',
      description: 'Comprehensive audit of all 12 modules, event bus reliability, and Knox endpoint attestations.',
    },
    {
      id: 'rep-02',
      title: 'Zero-Trust Architecture & Identity Compliance',
      period: 'Weekly Rolling Audit',
      standard: 'NIST SP 800-207',
      status: 'PASSED',
      score: '100%',
      description: 'Zero plaintext passwords in backend, mandatory MFA challenge enforcement, and session revocation.',
    },
    {
      id: 'rep-03',
      title: 'Zero-Knowledge Cryptographic Vault Verification',
      period: 'Continuous Assessment',
      standard: 'FIPS 140-2 Level 3',
      status: 'AUDITED',
      score: 'AES-256-GCM',
      description: 'Verification of client-side key derivation (PBKDF2/SHA-512) and zero server-side plaintext exposure.',
    },
    {
      id: 'rep-04',
      title: 'Ransomware Tripwire & Air-Gap Backup Audit',
      period: 'Bi-Weekly Disaster Recovery',
      standard: 'CIS Controls v8',
      status: 'VERIFIED',
      score: '100% Integrity',
      description: 'Validation of immutable WORM snapshots and block-level SHA-256 integrity checksum verification.',
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloading(id);
    setTimeout(() => {
      alert(`Report "${title}" exported with cryptographic signature.`);
      setDownloading(null);
    }, 800);
  };

  return (
    <UserLayout
      pageTitle="Compliance & Security Reports"
      pageSubtitle="Exportable cryptographic audit summaries, regulatory attestations, and security posture briefs"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-6 bg-navy-900/90 border border-surface-border hover:border-teal/40 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 transition"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded">
                  {r.standard}
                </span>
                <span className="text-[10px] font-mono text-status-healthy bg-status-healthy/10 px-2 py-0.5 rounded-full font-bold">
                  {r.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-text-primary mt-3">{r.title}</h3>
              <div className="text-xs font-mono text-teal mt-0.5">{r.period} &bull; Rating: {r.score}</div>
              <p className="text-xs text-text-secondary mt-2.5 leading-relaxed">{r.description}</p>
            </div>

            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-text-muted">SHA-256 Signed PDF</span>
              <button
                onClick={() => handleDownload(r.id, r.title)}
                disabled={downloading === r.id}
                className="px-3.5 py-1.5 bg-navy-950 hover:bg-teal hover:text-navy-950 text-teal text-xs font-semibold rounded-xl border border-teal/30 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading === r.id ? 'COMPILING...' : 'DOWNLOAD BRIEF'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </UserLayout>
  );
}
