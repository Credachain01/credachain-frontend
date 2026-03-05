'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0D1B2A]">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#22C55E]" />
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A] px-4 py-12">
      {children}
    </div>
  );
}
