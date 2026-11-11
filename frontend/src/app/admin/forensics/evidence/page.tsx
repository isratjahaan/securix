'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Fingerprint, ArrowLeft, Plus, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';

export default function ForensicEvidencePage() {
  const [evidence, setEvidence] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [caseNumber, setCaseNumber] = useState('DFC-2026-0012');
  const [name, setName] = useState('');
  const [evidenceType, setEvidenceType] = useState('Memory Dump');
  const [sha256Hash, setSha256Hash] = useState('');

  const loadEvidence = async () => {
    try {
      const data = await api.get('/forensics/evidence');
      setEvidence(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvidence();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/forensics/evidence', {
        caseNumber,
        name,
        evidenceType,
        sha256Hash: sha256Hash.trim(),
      });
      setCreateOpen(false);
      setName('');
      setSha256Hash('');
      alert('Digital evidence cataloged with verified SHA-256 hash.');
      loadEvidence();
    } catch (err: any) {
      alert(err?.message || 'Evidence cataloging failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/forensics" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Forensics
            </Link>
            <span>/</span>
            <span>EVIDENCE REPOSITORY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Forensic Evidence & Hashes</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable artifact catalog with verifiable SHA-256 digest proving zero tampering during custodial transfer.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
        >
          <Plus className="w-4 h-4" />
          <span>Catalog Digital Evidence</span>
        </button>
      </div>

      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Evidence Tag</th>
                <th className="p-3.5">Artifact Name & Type</th>
                <th className="p-3.5">Case Reference</th>
                <th className="p-3.5">SHA-256 Cryptographic Hash</th>
                <th className="p-3.5">Collector</th>
                <th className="p-3.5">Collected Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
              {evidence.map((ev) => (
                <tr key={ev.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 text-teal font-bold">{ev.evidenceNumber}</td>
                  <td className="p-3.5 font-sans">
                    <span className="font-semibold text-white block">{ev.name}</span>
                    <span className="text-[10px] font-mono text-cyan">{ev.evidenceType}</span>
                  </td>
                  <td className="p-3.5 text-slate-300">{ev.caseNumber}</td>
                  <td className="p-3.5 text-[11px] text-teal truncate max-w-[220px]" title={ev.sha256Hash}>
                    {ev.sha256Hash}
                  </td>
                  <td className="p-3.5 font-sans text-slate-300">{ev.collectorName}</td>
                  <td className="p-3.5 text-slate-400 text-[10px]">
                    {new Date(ev.collectedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Catalog Digital Evidence Artifact</h3>
            <p className="text-xs text-slate-400 mb-4">
              Register memory capture, disk image or APK with exact cryptographic checksum.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Case Number</label>
                <input
                  type="text"
                  required
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Artifact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory Dump LiME Raw EP-7804"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Evidence Type</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                >
                  <option value="Memory Dump">Memory Dump (RAM / LiME)</option>
                  <option value="Disk Image">Physical Disk Image (RAW/E01)</option>
                  <option value="Packet Capture">Packet Capture (PCAP/PCAPNG)</option>
                  <option value="Application Binary">Application Binary (APK/ELF)</option>
                  <option value="Access Log">Immutable Access Logs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">SHA-256 Digest Hash</label>
                <input
                  type="text"
                  required
                  placeholder="64-character hex hash"
                  value={sha256Hash}
                  onChange={(e) => setSha256Hash(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-teal hover:bg-teal-400 text-navy-950"
                >
                  Catalog Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
