'use client';

import React, { useState } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { useUserAuth } from '@/lib/user-auth';
import {
  User,
  Shield,
  Mail,
  Building,
  KeyRound,
  CheckCircle2,
  Smartphone,
  Save
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile } = useUserAuth();
  const [fullName, setFullName] = useState(user?.fullName || 'Cyber Operator');
  const [department, setDepartment] = useState(user?.department || 'Security Operations');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, department });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <UserLayout
      pageTitle="Personal Security Profile"
      pageSubtitle="Zero-Trust enterprise identity, assigned role credentials, and hardware badge verification"
    >
      {saved && (
        <div className="p-3.5 bg-status-healthy/10 border border-status-healthy/30 rounded-xl text-xs text-status-healthy flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile parameters updated and synchronized with central identity store.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-teal/15 border-2 border-teal text-teal flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-teal/20">
            {fullName.charAt(0) || 'U'}
          </div>

          <div>
            <h2 className="text-lg font-bold text-text-primary">{fullName}</h2>
            <div className="text-xs font-mono text-teal mt-0.5">{user?.email || 'user@sis.corp'}</div>
            <div className="text-xs text-text-secondary mt-1">{department}</div>
          </div>

          <div className="p-3 bg-navy-950 border border-surface-border rounded-xl text-xs font-mono space-y-1">
            <div className="text-[10px] text-text-muted uppercase">Security Badge #</div>
            <div className="text-cyan font-bold">{user?.securityBadgeNumber || 'SIS-EP-9941'}</div>
          </div>

          <div className="space-y-2 pt-2 border-t border-surface-border text-xs text-left">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Clearance Tier:</span>
              <span className="font-mono text-teal font-semibold">Tier-3 Operator</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">MFA Status:</span>
              <span className="font-mono text-status-healthy">Active (TOTP)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Account Status:</span>
              <span className="font-mono text-status-healthy">APPROVED & ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2 p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-text-primary">Update Profile Information</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Corporate Email (Immutable)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  disabled
                  value={user?.email || 'user@sis.corp'}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950/50 border border-surface-border rounded-xl text-sm font-mono text-text-muted outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Enterprise Department</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-sm text-text-primary outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-teal hover:bg-teal-400 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal/20"
            >
              <Save className="w-4 h-4" />
              <span>SAVE PROFILE UPDATES</span>
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
