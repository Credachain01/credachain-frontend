'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-200" />
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#4169E1]" />
          </div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading CredaChain…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
