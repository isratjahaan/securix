'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';
import { FileSpreadsheet, Download, FileText, CheckCircle2, RefreshCw, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState('sec-summary');
  const [format, setFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [generating, setGenerating] = useState(false);
  const [generatedArtifact, setGeneratedArtifact] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/templates').then((res) => setTemplates(res));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedArtifact(null);
    try {
      const res = await api.post('/reports/generate', {
        reportType: selectedReport,
        format,
        dateRange,
      });
      setGeneratedArtifact(res);
    } catch (err: any) {
      alert(err?.message || 'Report generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>EXECUTIVE INTELLIGENCE & COMPLIANCE GENERATOR</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Reports & Analytics Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Export verifiable compliance reports and security summaries generated directly from real backend telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1 mb-2">
            12 Cybersecurity Report Templates
          </span>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedReport(tpl.id)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between ${
                  selectedReport === tpl.id
                    ? 'bg-navy-950 border border-teal text-white font-bold shadow-md'
                    : 'bg-navy-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-navy-900'
                }`}
              >
                <span>{tpl.name}</span>
                <span className="text-[10px] font-mono text-cyan">{tpl.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generator Controls & Artifact Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg">
            <h3 className="text-base font-bold text-white mb-4">Export Configuration</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Export Document Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['PDF', 'CSV'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-2 rounded-lg text-xs font-bold font-mono transition-all ${
                        format === fmt
                          ? 'bg-gradient-to-r from-teal to-cyan text-navy-950 shadow-md'
                          : 'bg-navy-900 border border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Date Range Scope</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                >
                  <option value="Today">Today (Live 24h)</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal to-cyan text-navy-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-teal/20 flex items-center justify-center gap-2"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span>{generating ? 'Aggregating Telemetry...' : 'Generate Verified Enterprise Report'}</span>
            </button>
          </div>

          {/* Generated Artifact Card */}
          {generatedArtifact && (
            <div className="rounded-2xl bg-navy-950 border border-teal/40 p-6 shadow-2xl animate-fadeIn space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-teal uppercase font-bold tracking-wider">
                    REPORT ARTIFACT GENERATED
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{generatedArtifact.title}</h4>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {generatedArtifact.reportId} • Range: {generatedArtifact.dateRange}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-teal/20 text-teal text-xs font-mono font-bold border border-teal/40">
                  {generatedArtifact.format} READY
                </span>
              </div>

              {/* Data Invariants Proof */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 px-4 rounded-xl bg-navy-900 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Active Modules</span>
                  <span className="text-white font-bold">{generatedArtifact.metricsSummary?.activeModules}/12</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Open Incidents</span>
                  <span className="text-orange-400 font-bold">{generatedArtifact.metricsSummary?.openIncidents}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Compliant Devices</span>
                  <span className="text-teal font-bold">{generatedArtifact.metricsSummary?.compliantDevices}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Verified Backups</span>
                  <span className="text-cyan font-bold">{generatedArtifact.metricsSummary?.verifiedBackups}</span>
                </div>
              </div>

              <a
                href={generatedArtifact.downloadUrl}
                download
                className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-teal/60 text-teal text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Report Package ({generatedArtifact.format})</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
