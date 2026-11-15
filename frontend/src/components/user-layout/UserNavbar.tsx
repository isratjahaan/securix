'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/lib/user-auth';
import {
  Shield,
  Bell,
  Search,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Terminal,
  ExternalLink,
  Smartphone
} from 'lucide-react';

interface UserNavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function UserNavbar({ onToggleSidebar, isSidebarOpen }: UserNavbarProps) {
  const router = useRouter();
  const { user, logout } = useUserAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [systemOnline, setSystemOnline] = useState(true);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = () => setProfileDropdownOpen(false);
    window.addEventListener('click', handleOutside);
    return () => window.removeEventListener('click', handleOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-navy-900/90 backdrop-blur-md border-b border-surface-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-navy-800 rounded-lg transition"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-text-primary text-base leading-none">
                SIS <span className="text-teal">CYBER FORTRESS</span>
              </span>
              <span className="text-[10px] text-text-secondary tracking-widest uppercase font-mono mt-0.5">
                Zero Trust Client Shield
              </span>
            </div>
          </Link>

          {/* Telemetry Indicator Badge */}
          <div className="hidden md:flex items-center gap-2 ml-4 px-2.5 py-1 bg-navy-950 border border-teal/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
            </span>
            <span className="text-xs font-mono text-teal tracking-wide">SOC REAL-TIME ACTIVE</span>
          </div>
        </div>

        {/* Center: Search / Quick Actions */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search threat indicators, files, devices, or 12 modules..."
              className="w-full pl-9 pr-4 py-1.5 bg-navy-950/70 border border-surface-border focus:border-teal rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none transition"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/modules/threat-intel?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                }
              }}
            />
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Link to Admin Command Center if User has Admin privileges */}
          {user?.adminRoleType && (
            <Link
              href="/admin/overview"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-navy-800 hover:bg-navy-700 text-cyan border border-cyan/30 rounded-lg transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Admin Console</span>
              <ExternalLink className="w-3 h-3 text-cyan/70" />
            </Link>
          )}

          {/* Notification Center Trigger */}
          <Link
            href="/notifications"
            className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-navy-800 rounded-lg transition"
            title="Security Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-critical rounded-full ring-2 ring-navy-900" />
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-navy-950 hover:bg-navy-800 border border-surface-border rounded-xl transition"
            >
              <div className="w-7 h-7 rounded-lg bg-teal/20 text-teal flex items-center justify-center font-bold text-xs">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-medium text-text-primary leading-none truncate max-w-[120px]">
                  {user?.fullName || 'Cyber Operator'}
                </span>
                <span className="text-[10px] text-teal font-mono mt-0.5">
                  {user?.role || 'PROTECTED'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-navy-900 border border-surface-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-surface-border mb-1">
                  <div className="font-medium text-sm text-text-primary truncate">{user?.fullName || 'User'}</div>
                  <div className="text-xs text-text-muted font-mono truncate">{user?.email || 'user@sis.corp'}</div>
                  {user?.securityBadgeNumber && (
                    <div className="text-[10px] text-teal font-mono mt-1">Badge: {user.securityBadgeNumber}</div>
                  )}
                </div>

                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-navy-800 rounded-lg transition"
                >
                  <User className="w-4 h-4 text-teal" />
                  <span>Security Profile</span>
                </Link>

                <Link
                  href="/devices"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-navy-800 rounded-lg transition"
                >
                  <Smartphone className="w-4 h-4 text-cyan" />
                  <span>Protected Devices</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-navy-800 rounded-lg transition"
                >
                  <Settings className="w-4 h-4 text-text-muted" />
                  <span>Security Settings</span>
                </Link>

                <div className="border-t border-surface-border my-1" />

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-status-critical hover:bg-status-critical/10 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
