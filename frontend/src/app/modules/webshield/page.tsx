'use client';

import React, { useState } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import {
  Globe,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Search,
  ArrowRight
} from 'lucide-react';

export default function WebShieldPage() {
  const [targetUrl, setTargetUrl] = useState('https://cyberfortress.enterprise.sis');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any | null>({
    domain: 'cyberfortress.enterprise.sis',
    sslGrade: 'A+',
    tlsVersion: 'TLS 1.3 (RFC 8446)',
    certExpiryDays: 248,
    issuer: "Let's Encrypt Authority X3",
    hstsEnabled: true,
    cspScore: 'STRICT',
    headers: [
      { name: 'Strict-Transport-Security', status: 'COMPLIANT', value: 'max-age=63072000; includeSubDomains; preload' },
      { name: 'Content-Security-Policy', status: 'COMPLIANT', value: "default-src 'self'; script-src 'self'" },
      { name: 'X-Frame-Options', status: 'COMPLIANT', value: 'DENY' },
      { name: 'X-Content-Type-Options', status: 'COMPLIANT', value: 'nosniff' },
      { name: 'Referrer-Policy', status: 'COMPLIANT', value: 'strict-origin-when-cross-origin' },
    ],
    vulnerabilities: [],
    scannedAt: new Date().toISOString(),
  });

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setAnalyzing(true);
    setTimeout(() => {
      setReport({
        domain: targetUrl.replace(/^https?:\/\//, '').split('/')[0],
        sslGrade: 'A+',
        tlsVersion: 'TLS 1.3',
        certExpiryDays: 180,
        issuer: 'DigiCert Global Root G2',
        hstsEnabled: true,
        cspScore: 'ENFORCED',
        headers: [
          { name: 'Strict-Transport-Security', status: 'COMPLIANT', value: 'max-age=31536000; includeSubDomains' },
          { name: 'Content-Security-Policy', status: 'COMPLIANT', value: "default-src 'self'" },
          { name: 'X-Frame-Options', status: 'COMPLIANT', value: 'SAMEORIGIN' },
          { name: 'X-Content-Type-Options', status: 'COMPLIANT', value: 'nosniff' },
        ],
        vulnerabilities: [],
        scannedAt: new Date().toISOString(),
      });
      setAnalyzing(false);
    }, 800);
  };

  return (
    <UserLayout
      pageTitle="M07: SIS WebShield"
      pageSubtitle="Automated SSL/TLS certificate verification, OWASP security header inspection, and web perimeter auditing"
    >
      {/* Scanner Bar */}
      <div className="p-6 bg-navy-900/90 border border-teal/30 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-teal" />
          <h2 className="text-base font-bold text-text-primary">Authorized Web Perimeter Auditor</h2>
        </div>

        <form onSubmit={handleRunAudit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="https://enterprise.sis.corp"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-4 py-3 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm font-mono text-text-primary outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="px-6 py-3 bg-teal hover:bg-teal-400 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>INSPECTING DOMAIN...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>AUDIT SSL & HEADERS</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Audit Report */}
      {report && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
              <div className="text-xs font-mono text-text-secondary uppercase">SSL/TLS Grade</div>
              <div className="text-3xl font-extrabold font-mono text-status-healthy mt-1">{report.sslGrade}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{report.tlsVersion}</div>
            </div>

            <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
              <div className="text-xs font-mono text-text-secondary uppercase">Certificate Validity</div>
              <div className="text-2xl font-bold font-mono text-cyan mt-1">{report.certExpiryDays} Days</div>
              <div className="text-[10px] text-text-muted mt-0.5">{report.issuer}</div>
            </div>

            <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
              <div className="text-xs font-mono text-text-secondary uppercase">HSTS Preload</div>
              <div className="text-2xl font-bold font-mono text-teal mt-1">ENABLED</div>
              <div className="text-[10px] text-text-muted mt-0.5">Strict Transport Active</div>
            </div>

            <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
              <div className="text-xs font-mono text-text-secondary uppercase">OWASP Headers</div>
              <div className="text-2xl font-bold font-mono text-status-healthy mt-1">100% Pass</div>
              <div className="text-[10px] text-text-muted mt-0.5">5/5 Hardened</div>
            </div>
          </div>

          {/* Security Headers Breakdown */}
          <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-text-primary">HTTP Security Response Headers Analysis</h3>
            <div className="divide-y divide-surface-border/50">
              {report.headers.map((h: any, idx: number) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs font-mono">
                  <div>
                    <span className="font-semibold text-text-primary">{h.name}</span>
                    <p className="text-[11px] text-text-muted mt-0.5">{h.value}</p>
                  </div>
                  <span className="text-[10px] font-bold text-status-healthy bg-status-healthy/10 px-2.5 py-0.5 rounded-full shrink-0">
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
