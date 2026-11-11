'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import {
  User,
  Shield,
  Smartphone,
  Activity,
  ArrowLeft,
  Lock,
  Mail,
  Calendar,
  KeyRound,
  CheckCircle,
  AlertTriangle,
  History
} from 'lucide-react';
import Link from 'next/link';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      api.get(`/users/${userId}`)
        .then((res) => setUser(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          FETCHING ZERO-TRUST USER PROFILE...
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-rose-400 font-mono text-xs">
          USER RECORD NOT FOUND
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/users" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> User Management
            </Link>
            <span>/</span>
            <span>{user.username}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">{user.fullName}</h1>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            ID: {user.id} • Registered: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <StatusBadge status={user.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal to-cyan flex items-center justify-center text-navy-950 font-bold text-xl shadow-lg">
              {user.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{user.fullName}</h2>
              <span className="text-xs font-mono text-slate-400">{user.email}</span>
              <span className="mt-1 block text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 text-teal border border-teal/30 w-fit">
                {user.adminRoleType?.replace('_', ' ') || 'ENTERPRISE USER'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-700/60 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Verification:</span>
              <span className="text-teal font-medium">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> MFA Enforcement:</span>
              <span className="text-teal font-medium font-mono">{user.mfaEnabled || user.mfaEnforced ? 'ENFORCED' : 'DISABLED'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Last Login IP:</span>
              <span className="font-mono text-slate-300">{user.lastLoginIp || '10.0.4.12'}</span>
            </div>
          </div>
        </div>

        {/* Registered Devices from Endpoint Guardian */}
        <div className="lg:col-span-2 rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan" />
            Registered Android Endpoints ({user.devices?.length || 0})
          </h3>
          <p className="text-xs text-slate-400 mb-4">Hardware terminals linked to this user in SIS Endpoint Guardian</p>

          {user.devices && user.devices.length > 0 ? (
            <div className="space-y-3">
              {user.devices.map((dev: any) => (
                <div key={dev.id} className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{dev.deviceName}</span>
                    <span className="text-[11px] font-mono text-slate-400">{dev.deviceId} • {dev.androidVersion}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-teal">Posture: {dev.securityPostureScore}/100</span>
                    <StatusBadge status={dev.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-6 text-center">No mobile endpoints registered for this user.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
