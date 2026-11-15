'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserNavbar } from './UserNavbar';
import { UserSidebar } from './UserSidebar';
import { useUserAuth } from '@/lib/user-auth';

interface UserLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  actions?: React.ReactNode;
}

export function UserLayout({ children, pageTitle, pageSubtitle, actions }: UserLayoutProps) {
  const router = useRouter();
  const { user, token, loading } = useUserAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/login');
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-navy-950 text-text-secondary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-teal border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-teal tracking-widest uppercase">
            Verifying Zero-Trust Session...
          </span>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col text-text-primary">
      <UserNavbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1">
        <UserSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:pl-64 flex flex-col min-w-0 transition-all">
          {(pageTitle || actions) && (
            <div className="border-b border-surface-border bg-navy-900/40 px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
                    {pageTitle}
                  </h1>
                  {pageSubtitle && (
                    <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                      {pageSubtitle}
                    </p>
                  )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          )}

          <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
