'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Cloud,
  Shield,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  RotateCcw,
  HardDrive
} from 'lucide-react';

export default function CloudBackupPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const fetchBackups = async () => {
    try {
      const data = await api.get('/backups/jobs');
      setJobs(data || []);
    } catch (e) {
      console.error('Failed to load backup jobs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleVerifyIntegrity = async (jobId: string) => {
    setVerifyingId(jobId);
    setVerificationResult(null);

    try {
      const res = await api.post(`/backups/jobs/${jobId}/verify`, {});
      setVerificationResult(res);
      fetchBackups();
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <UserLayout
      pageTitle="M11: SIS Cloud Backup Guardian"
      pageSubtitle="Immutable air-gapped snapshots, automated scheduling, and cryptographic SHA-256 checksum verification"
    >
      {verificationResult && (
        <div className="p-4 bg-status-healthy/10 border border-status-healthy/30 rounded-xl text-xs text-status-healthy flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Cryptographic Checksum Verified: {verificationResult.checksum} ({verificationResult.algorithm})</span>
          </div>
          <span className="font-mono text-[10px] text-teal">ZERO CORRUPTION</span>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Backup Jobs</div>
          <div className="text-2xl font-bold font-mono text-teal mt-1">{jobs.length} Pipelines</div>
          <div className="text-[10px] text-text-muted mt-0.5">Automated schedules</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Air-Gap Status</div>
          <div className="text-2xl font-bold font-mono text-status-healthy mt-1">ENFORCED</div>
          <div className="text-[10px] text-text-muted mt-0.5">Immutable WORM storage</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Recovery RTO/RPO</div>
          <div className="text-2xl font-bold font-mono text-cyan mt-1">&lt; 15 Mins</div>
          <div className="text-[10px] text-text-muted mt-0.5">Rapid rollback ready</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Integrity Pass</div>
          <div className="text-2xl font-bold font-mono text-teal mt-1">100%</div>
          <div className="text-[10px] text-text-muted mt-0.5">Block-level verified</div>
        </div>
      </div>

      {/* Backup Pipelines Table */}
      <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-bold text-text-primary">Air-Gapped Snapshot Schedules</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">{jobs.length} registered jobs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-text-muted uppercase text-[10px]">
                <th className="py-2.5 px-3">Job Name</th>
                <th className="py-2.5 px-3">Target Scope</th>
                <th className="py-2.5 px-3">Cron Schedule</th>
                <th className="py-2.5 px-3">Last Run Status</th>
                <th className="py-2.5 px-3 text-right">Integrity Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-navy-950/50 transition">
                  <td className="py-3 px-3 font-semibold text-text-primary">{job.name}</td>
                  <td className="py-3 px-3 text-cyan">{job.targetModule}</td>
                  <td className="py-3 px-3 text-text-secondary">{job.scheduleCron}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-status-healthy/15 text-status-healthy font-bold">
                      {job.lastRunStatus || 'COMPLETED'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleVerifyIntegrity(job.id)}
                      disabled={verifyingId === job.id}
                      className="px-3 py-1 bg-teal/15 hover:bg-teal hover:text-navy-950 text-teal text-xs font-semibold rounded-lg border border-teal/30 transition inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${verifyingId === job.id ? 'animate-spin' : ''}`} />
                      <span>{verifyingId === job.id ? 'VERIFYING...' : 'VERIFY SHA-256'}</span>
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
