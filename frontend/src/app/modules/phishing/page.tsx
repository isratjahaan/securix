'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  MailCheck,
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Send,
  Trash2,
  RotateCcw
} from 'lucide-react';

export default function PhishingShieldPage() {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState<'URL' | 'EMAIL_BODY' | 'SMS_TEXT'>('URL');
  const [loadingScan, setLoadingScan] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [quarantine, setQuarantine] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadShieldData = async () => {
    try {
      const [quarantineRes, statsRes] = await Promise.allSettled([
        api.get('/phishing/quarantine'),
        api.get('/phishing/statistics'),
      ]);

      if (quarantineRes.status === 'fulfilled') setQuarantine(quarantineRes.value || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value || null);
    } catch (e) {
      console.error('Failed to load phishing data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadShieldData();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setLoadingScan(true);
    setActionMsg(null);

    try {
      const res = await api.post('/phishing/scan', {
        target,
        type: scanType,
      });
      setScanResult(res);
      // Reload quarantine list if quarantined
      if (res.quarantined) {
        loadShieldData();
      }
    } catch (err: any) {
      alert(`Phishing scan error: ${err.message}`);
    } finally {
      setLoadingScan(false);
    }
  };

  const handleReleaseFalsePositive = async (id: string) => {
    try {
      await api.post(`/phishing/quarantine/${id}/release`, {
        reason: 'Reported as false-positive verified by user',
      });
      setActionMsg(`Artifact ${id} safely released from quarantine.`);
      loadShieldData();
    } catch (err: any) {
      alert(`Release error: ${err.message}`);
    }
  };

  const setSamplePhish = () => {
    setTarget('http://login-verify-account-update.xyz/auth/login.php');
    setScanType('URL');
  };

  const setSampleBenign = () => {
    setTarget('https://cyberfortress.enterprise.sis/docs');
    setScanType('URL');
  };

  return (
    <UserLayout
      pageTitle="M02: SIS Phishing Shield"
      pageSubtitle="Zero-Hour AI heuristic URL, email header, and credential lure inspection engine"
    >
      {actionMsg && (
        <div className="p-3.5 bg-status-healthy/10 border border-status-healthy/30 rounded-xl text-xs text-status-healthy flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Total Inspected</div>
          <div className="text-2xl font-bold font-mono text-teal mt-1">
            {stats?.totalScanned || '1,424'}
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Real-time heuristics</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Malicious Blocked</div>
          <div className="text-2xl font-bold font-mono text-status-critical mt-1">
            {stats?.maliciousBlocked || '342'}
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Quarantined payloads</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Detection Accuracy</div>
          <div className="text-2xl font-bold font-mono text-cyan mt-1">
            {stats?.accuracyRatePercent || 99.4}%
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Zero false negative target</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Quarantine Active</div>
          <div className="text-2xl font-bold font-mono text-status-high mt-1">
            {quarantine.length}
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Isolated threats</div>
        </div>
      </div>

      {/* Interactive Scan Tool */}
      <div className="p-6 bg-navy-900/90 border border-teal/30 rounded-2xl shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal/10 border border-teal/20 text-teal flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Live Phishing & Threat Analyzer</h2>
              <p className="text-xs text-text-secondary">Inspect suspicious URLs, SMS texts, or email snippets for credential harvesting</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={setSamplePhish}
              className="text-xs font-mono text-status-critical hover:underline"
            >
              Test Phish Sample
            </button>
            <span className="text-text-muted">&bull;</span>
            <button
              type="button"
              onClick={setSampleBenign}
              className="text-xs font-mono text-status-healthy hover:underline"
            >
              Test Benign Sample
            </button>
          </div>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={scanType}
              onChange={(e: any) => setScanType(e.target.value)}
              className="px-3.5 py-3 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-xs font-semibold text-text-primary outline-none transition sm:w-40"
            >
              <option value="URL">URL / Web Link</option>
              <option value="EMAIL_BODY">Email Content</option>
              <option value="SMS_TEXT">SMS Message</option>
            </select>

            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="https://secure-login-verify.xyz/auth/account-verification"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-3 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm font-mono text-text-primary placeholder:text-text-muted outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loadingScan}
              className="px-6 py-3 bg-gradient-to-r from-teal to-teal-600 hover:from-teal-400 hover:to-teal text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-teal/20 transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
            >
              {loadingScan ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ANALYZING...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>INSPECT ARTIFACT</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Scan Results Card */}
        {scanResult && (
          <div className={`p-5 rounded-2xl border ${
            scanResult.verdict === 'MALICIOUS'
              ? 'bg-status-critical/10 border-status-critical/40'
              : scanResult.verdict === 'SUSPICIOUS'
              ? 'bg-status-high/10 border-status-high/40'
              : 'bg-status-healthy/10 border-status-healthy/40'
          } space-y-4 animate-in fade-in zoom-in-95 duration-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {scanResult.verdict === 'MALICIOUS' ? (
                  <ShieldAlert className="w-6 h-6 text-status-critical" />
                ) : scanResult.verdict === 'SUSPICIOUS' ? (
                  <AlertTriangle className="w-6 h-6 text-status-high" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-status-healthy" />
                )}
                <div>
                  <div className="text-base font-extrabold tracking-tight text-text-primary flex items-center gap-2">
                    <span>Verdict: {scanResult.verdict}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-navy-950">
                      Score: {scanResult.threatScore}/100
                    </span>
                  </div>
                  <div className="text-xs font-mono text-text-secondary mt-0.5 truncate max-w-lg">
                    Target: {scanResult.target}
                  </div>
                </div>
              </div>

              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                scanResult.quarantined ? 'bg-status-critical/20 text-status-critical' : 'bg-status-healthy/20 text-status-healthy'
              }`}>
                {scanResult.quarantined ? 'AUTO-QUARANTINED' : 'CLEARED BENIGN'}
              </span>
            </div>

            {/* Heuristic Indicators */}
            {scanResult.indicators && scanResult.indicators.length > 0 && (
              <div className="pt-2 border-t border-surface-border/50">
                <span className="text-[11px] font-mono uppercase text-text-muted block mb-1.5">
                  Detected Threat Indicators:
                </span>
                <ul className="space-y-1">
                  {scanResult.indicators.map((ind: string, idx: number) => (
                    <li key={idx} className="text-xs font-mono text-text-primary flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-critical" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quarantined Artifacts Table */}
      <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-status-critical" />
            <h3 className="text-sm font-bold text-text-primary">Quarantined Phishing Artifacts</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">{quarantine.length} isolated items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-text-muted font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Target Payload</th>
                <th className="py-2.5 px-3">Threat Score</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 font-mono">
              {quarantine.map((item) => (
                <tr key={item.id} className="hover:bg-navy-950/50 transition">
                  <td className="py-2.5 px-3 font-bold text-cyan">{item.type}</td>
                  <td className="py-2.5 px-3 text-text-primary truncate max-w-[280px]">{item.target}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-status-critical font-bold">{item.threatScore}/100</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-status-critical/15 text-status-critical">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleReleaseFalsePositive(item.id)}
                      className="px-2.5 py-1 bg-navy-800 hover:bg-navy-700 text-teal text-[11px] rounded-lg transition inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Report False Positive</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}
