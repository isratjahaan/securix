'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { GitFork, ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';

export default function ModuleDependenciesPage() {
  const [graph, setGraph] = useState<any>({ nodes: [], links: [] });
  const [selectedModule, setSelectedModule] = useState<string | null>('sis-identity');
  const [impactAnalysis, setImpactAnalysis] = useState<any>(null);

  useEffect(() => {
    api.get('/modules/dependencies').then((res) => setGraph(res));
  }, []);

  useEffect(() => {
    if (selectedModule) {
      api.get(`/modules/${selectedModule}/disable-impact`).then((res) => setImpactAnalysis(res));
    }
  }, [selectedModule]);

  const activeNode = graph.nodes.find((n: any) => n.id === selectedModule);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/modules" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Module Control
            </Link>
            <span>/</span>
            <span>DEPENDENCY ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Module Dependency Graph & Invariants</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Directed topological verification ensuring core services and dependent pipelines are never silently broken.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Module Nodes List */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-teal" />
            12-in-1 Ecosystem Graph Nodes
          </h3>
          <p className="text-xs text-slate-400 mb-4">Select any module to inspect inbound/outbound links</p>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {graph.nodes.map((node: any) => {
              const isSelected = selectedModule === node.id;
              const depCount = graph.links.filter((l: any) => l.target === node.id).length;
              const dependentCount = graph.links.filter((l: any) => l.source === node.id).length;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedModule(node.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-navy-950 border-teal shadow-md text-white'
                      : 'bg-navy-900/60 border-slate-800 text-slate-300 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{node.name}</span>
                      {node.isCore && (
                        <span className="text-[9px] font-mono px-1 rounded bg-teal/10 text-teal border border-teal/20">
                          CORE
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Req: {depCount} | Downstream: {dependentCount}
                    </span>
                  </div>
                  <StatusBadge status={node.status} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Dependency Topology & Impact Inspection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Node Card */}
          <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-cyan uppercase">Selected Inspection Node</span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeNode?.name || 'Select a module'}</h2>
                <span className="text-xs font-mono text-slate-400">ID: {activeNode?.id} • Version: {activeNode?.version}</span>
              </div>
              <StatusBadge status={activeNode?.status || 'ACTIVE'} />
            </div>

            {/* Inbound & Outbound Dependency Tree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Upstream Dependencies */}
              <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Upstream Dependencies Required
                </span>
                {graph.links.filter((l: any) => l.target === selectedModule).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No upstream dependencies. Self-contained service.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {graph.links
                      .filter((l: any) => l.target === selectedModule)
                      .map((l: any, idx: number) => {
                        const targetNode = graph.nodes.find((n: any) => n.id === l.source);
                        return (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                            <span>{targetNode?.name || l.source}</span>
                            <span className="text-[10px] text-teal">REQUIRED</span>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>

              {/* Downstream Dependents */}
              <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Downstream Dependent Services
                </span>
                {graph.links.filter((l: any) => l.source === selectedModule).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No downstream services depend on this module.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                    {graph.links
                      .filter((l: any) => l.source === selectedModule)
                      .map((l: any, idx: number) => {
                        const depNode = graph.nodes.find((n: any) => n.id === l.target);
                        return (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{depNode?.name || l.target}</span>
                            <span className="text-[10px] text-amber-300">DEPENDENT</span>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            </div>

            {/* Impact Safety Analysis Engine */}
            <div className="mt-6 p-4 rounded-xl bg-navy-900 border border-slate-700/80">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Automated Lifecycle Impact Simulator</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {impactAnalysis?.consequences}
              </p>

              {impactAnalysis?.activeDependents?.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300">
                  <strong className="block mb-1 font-semibold">Downstream Invariant Breach Prevention:</strong>
                  The engine will prevent silent disconnection. Disabling requires administrative force override and logs a P1 audit event.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
