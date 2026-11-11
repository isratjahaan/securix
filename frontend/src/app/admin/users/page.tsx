'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { api } from '@/lib/api';
import { Users, Search, Download, ShieldAlert, CheckCircle, Smartphone, ExternalLink, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Status Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<'SUSPEND' | 'ACTIVATE' | 'REVOKE'>('SUSPEND');

  const loadUsers = async () => {
    try {
      const data = await api.get(`/users?search=${encodeURIComponent(search)}&status=${statusFilter}`);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, statusFilter]);

  const triggerAction = (user: any, action: 'SUSPEND' | 'ACTIVATE' | 'REVOKE') => {
    setSelectedUser(user);
    setActionType(action);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedUser) return;
    try {
      if (actionType === 'REVOKE') {
        await api.patch(`/users/${selectedUser.id}/revoke-sessions`);
        alert(`All active sessions revoked for ${selectedUser.fullName}.`);
      } else {
        const newStatus = actionType === 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE';
        await api.patch(`/users/${selectedUser.id}/status`, { status: newStatus });
      }
      setModalOpen(false);
      loadUsers();
    } catch (err: any) {
      alert(err?.message || 'Operation failed');
    }
  };

  const handleExport = () => {
    window.open('/api/users/export', '_blank');
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <Users className="w-3.5 h-3.5" />
            <span>IDENTITY & ACCESS GOVERNANCE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">User Management Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit user identities, enforce security postures, manage sessions, and prevent unauthorized credential usage.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:border-cyan transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan" />
          <span>Export Authorized CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-navy-800/80 border border-slate-700/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or username..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['', 'ACTIVE', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-navy-950 text-teal border border-teal/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st || 'ALL ACCOUNTS'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">User Identity</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Account Status</th>
                <th className="p-3.5">MFA Enforced</th>
                <th className="p-3.5">Last Login IP</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5">
                    <Link href={`/admin/users/${u.id}`} className="font-semibold text-white hover:text-teal">
                      {u.fullName}
                    </Link>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-navy-900 border border-slate-700 text-slate-300">
                      {u.adminRoleType?.replace('_', ' ') || 'ENTERPRISE USER'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={u.status} size="sm" />
                  </td>
                  <td className="p-3.5 font-mono">
                    {u.mfaEnabled || u.mfaEnforced ? (
                      <span className="text-teal font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> ENABLED
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">DISABLED</span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{u.lastLoginIp || '10.0.4.12'}</td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="px-2.5 py-1 rounded bg-navy-900 hover:bg-navy-700 border border-slate-700 text-slate-300 text-[11px] transition-colors"
                      >
                        Profile
                      </Link>

                      {u.status === 'ACTIVE' ? (
                        <button
                          onClick={() => triggerAction(u, 'SUSPEND')}
                          className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-[11px] transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => triggerAction(u, 'ACTIVATE')}
                          className="px-2.5 py-1 rounded bg-teal/20 hover:bg-teal/30 border border-teal/40 text-teal text-[11px] transition-colors"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => triggerAction(u, 'REVOKE')}
                        className="px-2.5 py-1 rounded bg-navy-900 hover:bg-navy-700 border border-slate-700 text-slate-400 hover:text-white text-[11px] transition-colors"
                        title="Revoke active sessions"
                      >
                        Kill Sessions
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        title={`${actionType} User: ${selectedUser?.fullName}`}
        description={`You are requesting to ${actionType.toLowerCase()} access for ${selectedUser?.email}.`}
        confirmLabel={`Confirm ${actionType}`}
        isDestructive={actionType === 'SUSPEND'}
      />
    </AdminLayout>
  );
}
