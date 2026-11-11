'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { FileSearch, Plus, Briefcase, Fingerprint, Archive, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForensicsPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [custody, setCustody] = useState<any[]>([]);

  useEffect(() => {
    api.get('/forensics/cases').then((res) => setCases(res));
    api.get('/forensics/evidence').then((res) => setEvidence(res));
    api.get('/forensics/custody').then((res) => setCustody(res));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <FileSearch className="w-3.5 h-3.5" />
            <span>SIS DIGITAL FORENSICS & INCIDENT INVESTIGATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Digital Forensics Workspace</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic evidence preservation, SHA-256 integrity verification, and immutable chain-of-custody tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/forensics/cases"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white"
          >
            <span>All Forensic Cases</span>
          </Link>
          <Link
            href="/admin/forensics/evidence"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
          >
            <span>Evidence Repository</span>
          </Link>
        </div>
      </div>

      {/* Forensics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Cases</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{cases.length}</span>
          <span className="text-[11px] text-teal mt-1 block">Lead Investigators Assigned</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cataloged Evidence</span>
          <span className="text-2xl font-bold font-mono text-cyan mt-1 block">{evidence.length} Artifacts</span>
          <span className="text-[11px] text-cyan mt-1 block">100% Cryptographically Hashed (SHA-256)</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chain of Custody Logs</span>
          <span className="text-2xl font-bold font-mono text-teal mt-1 block">{custody.length} Audited Events</span>
          <span className="text-[11px] text-teal mt-1 block">Immutable Transfer Logs</span>
        </div>
      </div>

      {/* Forensic Cases List */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-teal" />
            Active Investigation Cases
          </h3>
          <Link href="/admin/forensics/cases" className="text-xs text-teal hover:underline">
            Manage Cases →
          </Link>
        </div>

        <div className="space-y-3">
          {cases.map((cs) => (
            <div key={cs.id} className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-teal font-bold">{cs.caseNumber}</span>
                  <span className="text-xs font-bold text-white">{cs.title}</span>
                  <StatusBadge status={cs.priority} size="sm" />
                </div>
                <p className="text-xs text-slate-300 leading-snug">{cs.description}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-2">
                  <span>Lead: {cs.leadInvestigatorName}</span>
                  <span>•</span>
                  <span>Incident: {cs.incidentCode || 'Direct Forensic Intake'}</span>
                  <span>•</span>
                  <span className="text-cyan font-bold">{cs.evidenceCount} Evidence Items</span>
                </div>
              </div>
              <StatusBadge status={cs.status} size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Chain of Custody Timeline */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Archive className="w-4 h-4 text-cyan" />
            Chain of Custody Immutable History
          </h3>
          <Link href="/admin/forensics/evidence" className="text-xs text-cyan hover:underline">
            Inspect Evidence Vault →
          </Link>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {custody.map((c, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-navy-950/60 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-teal font-bold">{c.evidenceNumber}</span>
                <span className="text-slate-400">•</span>
                <span className="text-cyan font-semibold">{c.action}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-sans">{c.purpose}</span>
              </div>
              <div className="text-slate-500 text-[10px] shrink-0">
                Actor: {c.actor} • {new Date(c.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
