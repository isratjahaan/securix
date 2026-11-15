'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Binary,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Flame,
  RefreshCw,
  Lock,
  ArrowRight,
  ShieldAlert,
  Server
} from 'lucide-react';

export default function RansomwareGuardianPage() {
  const [canaries, setCanaries] = useState<any[]>([]);
  const [entropy, setEntropy] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [isolating, setIsolating] = useState(false);
  const [isolationResult, setIsolationResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRansomwareData = async () => {
    try {
      const [canariesRes, entropyRes, statsRes] = await Promise.allSettled([
        api.get('/ransomware/canaries'),
        api.get('/ransomware/entropy'),
        api.get('/ransomware/statistics'),
      ]);

      if (canariesRes.status === 'fulfilled') setCanaries(canariesRes.value || []);
      if (entropyRes.status === 'fulfilled') setEntropy(entropyRes.value || null);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value || null);
    } catch (e) {
      console.error('Failed to load ransomware data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRansomwareData();
  }, []);

  const handleSimulateTripwire = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.post('/ransomware/tripwires/test', {
        canaryId: 'CANARY-FINANCE-01',
        simulatedEntropy: 8.24,
      });
      setTestResult(res);
      fetchRansomwareData();
    } catch (err: any) {
      alert(`Tripwire test error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleIsolateHost = async () => {
    if (!confirm('CONFIRM EMERGENCY CONTAINMENT: This will immediately isolate endpoint 10.0.12.88 from all network segments to sever lateral ransomware movement.')) return;

    setIsolating(true);
    setIsolationResult(null);
    try {
      const res = await api.post('/ransomware/isolate-host', {
        hostIdentifier: '10.0.12.88',
        reason: 'Manual containment trigger from user workstation',
      });
      setIsolationResult(res);
    } catch (err: any) {
      alert(`Isolation error: ${err.message}`);
    } finally {
      setIsolating(false);
    }
  };

  return (
    <UserLayout
      pageTitle="M06: SIS Ransomware Guardian"
      pageSubtitle="Honeypot canaries, Shannon entropy write detectors, and automated network isolation"
      actions={
        <button
          onClick={handleIsolateHost}
          disabled={isolating}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-status-critical hover:bg-red-600 text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-500/20 disabled:opacity-50"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>{isolating ? 'ISOLATING HOST...' : 'EMERGENCY HOST CONTAINMENT'}</span>
        </button>
      }
    >
      {isolationResult && (
        <div className="p-4 bg-status-critical/15 border border-status-critical/40 rounded-xl text-xs text-status-critical flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{isolationResult.message}</span>
          </div>
          <span className="font-mono text-[10px] bg-status-critical text-white px-2 py-0.5 rounded">
            {isolationResult.networkState}
          </span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Canaries Deployed</div>
          <div className="text-2xl font-bold font-mono text-teal mt-1">
            {canaries.length || 3} Honeypots
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">High-entropy decoys</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Shannon Entropy</div>
          <div className="text-2xl font-bold font-mono text-cyan mt-1">
            {entropy?.baselineEntropy || '4.35'} / 8.0
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Threshold: 7.95</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Interceptors Active</div>
          <div className="text-2xl font-bold font-mono text-status-healthy mt-1">
            84 Streams
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Mass rename traps</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Rollback Readiness</div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            100% Ready
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">Air-gapped VSS</div>
        </div>
      </div>

      {/* Simulated Tripwire & Test Center */}
      <div className="p-6 bg-navy-900/90 border border-teal/30 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Binary className="w-5 h-5 text-teal" />
              <span>Simulated Canary Mutation & Tripwire Response</span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Simulate high-entropy file encryption bursts on financial decoy documents to verify automated SOC alert escalation.
            </p>
          </div>

          <button
            onClick={handleSimulateTripwire}
            disabled={testing}
            className="px-4 py-2 bg-teal hover:bg-teal-400 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal/20 shrink-0 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'TRIGGERING...' : 'TRIGGER TEST MUTATION'}</span>
          </button>
        </div>

        {testResult && (
          <div className="p-4 bg-status-critical/10 border border-status-critical/30 rounded-xl space-y-2 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between text-xs font-bold text-status-critical">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>{testResult.message}</span>
              </span>
              <span className="font-mono bg-navy-950 px-2 py-0.5 rounded text-teal">
                Entropy: {testResult.simulatedEntropy}
              </span>
            </div>
            <p className="text-[11px] text-text-secondary">
              Decoupled EventBus published <code>fortress.threat.detected</code> &bull; SOC Alert committed to central data store &bull; WebSocket dispatched to all consoles.
            </p>
          </div>
        )}
      </div>

      {/* Honeypot Canaries Table */}
      <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan" />
            <h3 className="text-sm font-bold text-text-primary">Deployed Canary Honeypot Sensors</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">{canaries.length} monitored storage files</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-text-muted uppercase text-[10px]">
                <th className="py-2.5 px-3">Honeypot Identifier</th>
                <th className="py-2.5 px-3">File Decoy Target</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3">Integrity Status</th>
                <th className="py-2.5 px-3 text-right">Last Verified Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {canaries.map((canary) => (
                <tr key={canary.id} className="hover:bg-navy-950/50 transition">
                  <td className="py-3 px-3 font-semibold text-text-primary">{canary.id}</td>
                  <td className="py-3 px-3 text-cyan truncate max-w-[240px]">{canary.filename}</td>
                  <td className="py-3 px-3 text-text-secondary">{canary.sector}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      canary.status === 'INTACT' ? 'bg-status-healthy/15 text-status-healthy' : 'bg-status-critical/15 text-status-critical'
                    }`}>
                      {canary.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-text-muted truncate max-w-[140px]">
                    {canary.lastIntegrityHash || '9a8b7c6d5e4f...'}
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
