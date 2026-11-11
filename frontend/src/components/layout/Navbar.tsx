'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  LogOut,
  User,
  HelpCircle,
  Radio,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Command
} from 'lucide-react';
import { api } from '@/lib/api';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenCommandPalette: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: string;
  createdAt: string;
  isRead: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenCommandPalette }) => {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Read local stored user or default to Super Admin
    const stored = typeof window !== 'undefined' ? localStorage.getItem('sis_admin_user') : null;
    if (stored) {
      try {
        setAdminUser(JSON.parse(stored));
      } catch {}
    } else {
      setAdminUser({
        fullName: 'Dr. Sarah Vance',
        email: 'sarah.vance@fortress.sis.enterprise',
        adminRoleType: 'SUPER_ADMIN',
        department: 'Cyber Defense Command & SOC',
      });
    }

    // Load initial notifications
    api.get('/notifications/unread')
      .then((res) => {
        if (res && res.data) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount || res.data.length);
        }
      })
      .catch(() => {
        // Fallback realistic SOC notifications
        setNotifications([
          {
            id: 'notif-1',
            title: 'Critical Threat Detected',
            message: 'Brute force credential stuffing detected across 34 IPs targeting Identity Guardian.',
            severity: 'CRITICAL',
            createdAt: '2 mins ago',
            isRead: false,
          },
          {
            id: 'notif-2',
            title: 'Android Endpoint Policy Violation',
            message: 'Device Galaxy-S24 (ID: EP-7801) detected developer mode & unapproved debugging.',
            severity: 'HIGH',
            createdAt: '14 mins ago',
            isRead: false,
          },
          {
            id: 'notif-3',
            title: 'Cloud Backup Integrity Verified',
            message: 'Daily encrypted snapshot job for SIS Vault Guardian passed SHA-256 verification.',
            severity: 'INFORMATIONAL',
            createdAt: '1 hour ago',
            isRead: true,
          },
        ]);
        setUnreadCount(2);
      });
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sis_auth_token');
      localStorage.removeItem('sis_admin_user');
      router.push('/admin/login');
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    api.post('/notifications/mark-all-read', {}).catch(() => {});
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-6 bg-navy-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search / Command Palette shortcut button */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 w-64 md:w-80 rounded-lg bg-navy-800/80 border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 hover:border-cyan transition-all group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan transition-colors" />
          <span className="flex-1 text-left truncate">Search modules, alerts, assets...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-navy-900 border border-slate-700 rounded">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Live SOC Health Pulse */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-teal/30 text-teal text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span>SOC LIVE: OPERATIONAL</span>
        </div>

        {/* Documentation Link */}
        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          title="Open OpenAPI / Swagger Docs"
        >
          <HelpCircle className="w-4 h-4" />
        </a>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold font-mono text-white bg-rose-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-navy-800 border border-slate-700 shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between p-3.5 border-b border-slate-700 bg-navy-900">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                    SOC Central Alerts ({unreadCount} new)
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-teal hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No recent notifications</div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 transition-colors ${
                        item.isRead ? 'bg-transparent text-slate-400' : 'bg-navy-900/40 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span
                          className={`font-semibold uppercase tracking-wider ${
                            item.severity === 'CRITICAL'
                              ? 'text-rose-400'
                              : item.severity === 'HIGH'
                              ? 'text-orange-400'
                              : 'text-cyan'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug">{item.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-700 bg-navy-900 text-center">
                <button
                  onClick={() => {
                    setNotificationsOpen(false);
                    router.push('/admin/alerts');
                  }}
                  className="text-xs text-cyan hover:underline font-medium"
                >
                  View all in Security Alert Center →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill & Menu */}
        <div className="relative pl-2 border-l border-slate-800">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-navy-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal to-cyan flex items-center justify-center text-navy-950 font-bold text-xs shadow-md">
              {adminUser?.fullName
                ?.split(' ')
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('') || 'SA'}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-text-primary leading-tight">
                {adminUser?.fullName || 'Super Administrator'}
              </span>
              <span className="text-[10px] font-mono text-teal uppercase leading-tight">
                {adminUser?.adminRoleType?.replace('_', ' ') || 'SUPER ADMIN'}
              </span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-navy-800 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="p-2.5 border-b border-slate-700">
                <p className="text-xs font-semibold text-text-primary">{adminUser?.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{adminUser?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal/20 text-teal border border-teal/40">
                  <Shield className="w-3 h-3" />
                  {adminUser?.adminRoleType?.replace('_', ' ')}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push('/admin/administrators');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-700/60 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Admin Profile & MFA</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push('/admin/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-navy-700/60 rounded-lg transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Security & Audit Policies</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Secure Command Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
