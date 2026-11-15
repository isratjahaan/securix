'use client';

import React from 'react';
import { UserAuthProvider } from '@/lib/user-auth';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <UserAuthProvider>{children}</UserAuthProvider>;
}
