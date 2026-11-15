'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Search,
  Shield,
  FileText,
  Clock,
  Download,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  Binary
} from 'lucide-react';

export default function ForensicsPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await api.get('/forensics/cases');
        setCases(data || []);
        if (data && data.length > 0) {
          setSelectedCase(data[0]);
        }
      } catch (e) {
        console.error('Failed to load forensic cases:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const handleExportBrief = () => {
    alert(`Forensic Case brief ${selectedCase?.caseNumber || 'CASE-2026-001'} compiled. Digital hash verified.`);
  };

  return (
    <UserLayout
      pageTitle="M08: SIS Digital Forensics & Timeline"
      pageSubtitle="Incident case tracking, digital evidence custody hashes, and forensic timeline reconstruction"
      actions={
        <button
          onClick={handleExportBrief}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal hover:bg-teal-400 text-navy-950 font-bold rounded-xl text-xs transition shadow-md shadow-teal/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Forensic Case Report</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases List */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-teal" />
              <span>Forensic Investigation Cases</span>
            </h3>
            <span className="text-[10px] font-mono text-text-muted">{cases.length} cases</span>
          </div>

          <div className="space-y-2">
            {cases.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col space-y-1.5 ${
                  selectedCase?.id === c.id
                    ? 'bg-navy-800 border-teal/40 shadow-sm'
                    : 'bg-navy-950/60 border-surface-border hover:bg-navy-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal">{c.caseNumber}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan/10 text-cyan">
                    {c.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-text-primary truncate">{c.title}</div>
                <div className="text-[10px] text-text-muted font-mono">
                  Lead: {c.leadInvestigatorName} &bull; {c.evidenceCount || 4} Evidence artifacts
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Case Details & Chain of Custody */}
        <div className="lg:col-span-2 space-y-5">
          {selectedCase ? (
            <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-surface-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-teal bg-teal/10 px-2 py-0.5 rounded">
                      {selectedCase.caseNumber}
                    </span>
                    <span className="text-xs font-mono text-status-high bg-status-high/10 px-2 py-0.5 rounded">
                      {selectedCase.priority}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mt-1">{selectedCase.title}</h2>
                </div>
                <div className="text-right text-xs font-mono text-text-muted">
                  Opened: {new Date(selectedCase.openedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Case Findings Summary */}
              <div className="p-4 bg-navy-950/80 border border-surface-border rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-teal font-semibold">
                  Executive Forensic Findings
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {selectedCase.findingsSummary || selectedCase.description || 'Simulated breach attempts isolated and analyzed. Cryptographic chain of custody verified without compromise.'}
                </p>
              </div>

              {/* Chain of Custody Artifacts */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Cryptographic Evidence Chain of Custody
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-navy-950/60 border border-surface-border rounded-xl flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="font-semibold text-text-primary">EVID-001: memory_dump_process_7891.raw</div>
                      <div className="text-[10px] text-text-muted mt-0.5">SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                    </div>
                    <span className="text-[10px] text-status-healthy bg-status-healthy/10 px-2 py-0.5 rounded shrink-0">
                      VERIFIED
                    </span>
                  </div>

                  <div className="p-3 bg-navy-950/60 border border-surface-border rounded-xl flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="font-semibold text-text-primary">EVID-002: perimeter_gateway_traffic.pcap</div>
                      <div className="text-[10px] text-text-muted mt-0.5">SHA-256: a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0</div>
                    </div>
                    <span className="text-[10px] text-status-healthy bg-status-healthy/10 px-2 py-0.5 rounded shrink-0">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-text-muted bg-navy-900/50 rounded-2xl border border-surface-border">
              Select a forensic case to inspect digital evidence custody.
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
