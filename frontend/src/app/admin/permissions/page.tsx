'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';
import { Lock, Shield, Search } from 'lucide-react';

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admins/permissions').then((res) => setPermissions(res));
  }, []);

  const filtered = permissions.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Lock className="w-3.5 h-3.5" />
            <span>GRANULAR PERMISSION DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Permission Registry & Capabilities</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit backend-enforced permission gates applied across all REST API controllers and workflows.
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-navy-800/80 border border-slate-700/80 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter permissions by code or category..."
          className="w-full px-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan"
        />
      </div>

      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Permission Code</th>
                <th className="p-3.5">Human-Readable Name</th>
                <th className="p-3.5">Domain Category</th>
                <th className="p-3.5">Backend Enforcement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
              {filtered.map((p) => (
                <tr key={p.code} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 text-teal font-bold">{p.code}</td>
                  <td className="p-3.5 font-sans font-medium text-white">{p.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-navy-950 border border-slate-700 text-cyan">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    @RequirePermissions(&apos;{p.code}&apos;)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
