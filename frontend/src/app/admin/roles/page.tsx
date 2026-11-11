'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';
import { KeyRound, Shield, Check, Lock } from 'lucide-react';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admins/roles').then((res) => setRoles(res));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <KeyRound className="w-3.5 h-3.5" />
            <span>RBAC PRIVILEGE TIERS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Role-Based Access Control (RBAC)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict least-privilege role boundaries governing permissions across all 12 modules and APIs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r) => (
          <div key={r.id} className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal" />
                  {r.displayName}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 text-cyan border border-cyan/30">
                  {r.name}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-4">{r.description}</p>

              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Assigned Granular Permissions ({r.permissions?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-lg bg-navy-950/70 border border-slate-800">
                {r.permissions?.map((p: string) => (
                  <span key={p} className="px-2 py-0.5 rounded text-[10px] font-mono bg-navy-900 border border-slate-700 text-teal">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
              <span>System Role: {r.isSystemRole ? 'Protected Invariant' : 'Custom'}</span>
              <span className="font-mono text-teal">{r.adminCount} Active Administrators</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
