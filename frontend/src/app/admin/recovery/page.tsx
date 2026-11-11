'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';
import { RotateCcw, ArrowLeft, CheckCircle2, Shield, HardDrive, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RecoveryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api.get('/backups/recovery-history').then((res) => setHistory(res));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/backups" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Backups
            </Link>
            <span>/</span>
            <span>DISASTER RECOVERY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Disaster Recovery & Sandbox Restore</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit history of authorized cryptographic restore drills and isolated staging sandbox recoveries.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Historical Recovery Executions</h3>
        <div className="space-y-3 font-mono text-xs">
          {history.map((rec) => (
            <div key={rec.id} className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-white font-bold block">{rec.jobName}</span>
                <span className="text-slate-400 text-[11px]">
                  Target: {rec.restoredTo} • Volume: {rec.sizeMb} MB
                </span>
                <span className="text-[10px] text-teal block mt-0.5">Authorized by: {rec.requestedBy}</span>
              </div>
              <div className="text-right">
                <span className="text-teal font-bold">{rec.status}</span>
                <span className="text-slate-500 text-[10px] block mt-0.5">
                  {new Date(rec.restoredAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
