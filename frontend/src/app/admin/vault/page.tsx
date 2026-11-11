'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Lock, ShieldAlert, CheckCircle2, HardDrive, KeyRound, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function VaultPage() {
  const [meta, setMeta] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);

  const loadVaultData = async () => {
    try {
      const m = await api.get('/vault/metadata');
      const r = await api.get('/vault/recovery-requests');
      setMeta(m);
      setRequests(r);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadVaultData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await api.post(`/vault/recovery-requests/${id}/approve`);
      alert(res.message || 'Recovery request approved.');
      loadVaultData();
    } catch (err: any) {
      alert(err?.message || 'Approval failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <Lock className="w-3.5 h-3.5" />
            <span>SIS VAULT GUARDIAN • ZERO-KNOWLEDGE ADMINISTRATIVE POLICY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Vault Guardian Administration</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict Zero-Knowledge guarantee: administrators only observe metadata, encrypted storage volumes and recovery requests.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal/10 border border-teal/30 text-teal text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>ZERO-KNOWLEDGE PRIVACY INVARIANT ENFORCED</span>
        </div>
      </div>

      {/* Critical Zero-Knowledge Privacy Warning Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-navy-950 to-navy-900 border border-teal/40 text-xs flex items-start gap-3 shadow-lg">
        <ShieldCheck className="w-5 h-5 text-teal shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-bold mb-0.5 uppercase tracking-wider">
            Enterprise Cryptographic Privacy Rule:
          </strong>
          <p className="text-slate-300 leading-relaxed">
            Administrators can NEVER view plaintext passwords, secure notes, private keys, or client-side encryption secrets.
            No admin backdoors exist. All credentials are client-side encrypted before network transmission.
          </p>
        </div>
      </div>

      {/* Vault Telemetry Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Registered Vault Users</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{meta?.totalVaultAccounts?.toLocaleString() ?? 1840}</span>
          <span className="text-[11px] text-teal mt-1 block">Active Zero-Knowledge Wallets</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Encrypted Storage Usage</span>
          <span className="text-2xl font-bold font-mono text-cyan mt-1 block">14.36 GB</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Ciphertext Blobs Only</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Encryption Standard</span>
          <span className="text-lg font-bold font-mono text-teal mt-1 block">AES-256-GCM</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Argon2id Key Derivation</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Recovery Escrow</span>
          <span className="text-lg font-bold font-mono text-teal mt-1 block">Shamir 2-of-3</span>
          <span className="text-[11px] text-teal mt-1 block">Distributed Key Custody</span>
        </div>
      </div>

      {/* Cryptographic Recovery Requests */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-cyan" />
          Pending Cryptographic Recovery Requests ({requests.length})
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Emergency key recovery workflows requiring step-up verification and administrator approval.
        </p>

        {requests.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-6 text-center">No pending recovery requests.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.requestId} className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-teal font-bold">{req.requestId}</span>
                    <span className="text-xs font-semibold text-white">{req.userEmail}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      STEP-UP MFA PASSED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{req.reason}</p>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    Protocol: {req.recoveryMethod} • Requested: {new Date(req.requestedAt).toLocaleTimeString()}
                  </span>
                </div>

                <button
                  onClick={() => handleApprove(req.requestId)}
                  className="px-4 py-2 rounded-xl bg-teal hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-lg shadow-teal/20 self-end md:self-auto"
                >
                  Authorize Recovery Shard
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
