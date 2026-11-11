'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/overview');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-navy-950 text-slate-300">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-teal border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-mono tracking-wider text-teal">INITIALIZING SIS CYBER FORTRESS...</span>
      </div>
    </div>
  );
}
