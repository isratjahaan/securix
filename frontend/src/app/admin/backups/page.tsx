'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Cloud, RotateCcw, ShieldCheck, CheckCircle2, Database, ArrowRight, HardDrive, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function BackupsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      const data = await api.get('/backups/jobs');
      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRetry = async (id: string) => {
    try {
      const res = await api.post(`/backups/jobs/${id}/retry`);
      alert(res.message || 'Backup job initiated.');
      loadJobs();
    } catch (err: any) {
      alert(err?.message || 'Retry failed');
    }
  };

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await api.post(`/backups/jobs/${id}/verify`);
      alert(`Integrity Confirmed: ${res.message}\nDigest: ${res.checksum}`);
      loadJobs();
    } catch (err: any) {
      alert(err?.message || 'Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <Cloud className="w-3.5 h-3.5" />
            <span>SIS CLOUD BACKUP GUARDIAN & RESILIENCE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Immutable Cloud Backup Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Encrypted snapshots with block-level cryptographic verification (Never claims success without backend confirmation).
          </p>
        </div>

        <Link
          href="/admin/recovery"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan" />
          <span>Disaster Recovery Logs</span>
        </Link>
      </div>

      {/* Backup Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{job.name}</span>
                <StatusBadge status={job.lastRunStatus} size="sm" />
                {job.isIntegrityVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-teal bg-teal/10 px-2 py-0.5 rounded border border-teal/20">
                    <ShieldCheck className="w-3 h-3" /> SHA-256 VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Target: {job.targetModule} • Provider: {job.storageProvider} • Retention: {job.retentionDays} Days
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                Schedule: {job.scheduleCron} • Last Size: {job.lastBackupSizeMb} MB
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate max-w-lg" title={job.sha256Checksum}>
                Checksum: {job.sha256Checksum}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleVerify(job.id)}
                disabled={verifyingId === job.id}
                className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-700 border border-slate-700 text-cyan text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{verifyingId === job.id ? 'Checking Hash...' : 'Verify SHA-256'}</span>
              </button>
              <button
                onClick={() => handleRetry(job.id)}
                className="px-3 py-1.5 rounded-lg bg-teal/20 hover:bg-teal/30 border border-teal/40 text-teal text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Snapshot</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
