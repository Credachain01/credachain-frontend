'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, Moon, Sun, Menu, Plus, LogOut, Wallet } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { shortenAddress } from '@/lib/solana';

const pageTitles: Record<string, string> = {
  '/dashboard':              'Overview',
  '/dashboard/wallet':       'My Wallet',
  '/dashboard/transactions': 'Transactions',
  '/dashboard/transfer':     'Transfer',
  '/dashboard/airtime':      'Buy Airtime',
  '/dashboard/data':         'Buy Data',
  '/dashboard/bills':        'Pay Bills',
  '/dashboard/usdt':         'USDC Exchange',
  '/dashboard/settings':     'Settings',
  '/dashboard/security':     'Security',
};

export default function DashboardTopBar() {
  const pathname        = usePathname();
  const darkMode        = useAppStore((s) => s.darkMode);
  const toggleDarkMode  = useAppStore((s) => s.toggleDarkMode);
  const setSidebarOpen  = useAppStore((s) => s.setSidebarOpen);
  const sidebarOpen     = useAppStore((s) => s.sidebarOpen);
  const addToast        = useAppStore((s) => s.addToast);
  const { signOut, user } = useAuth();

  const title = pageTitles[pathname] ?? 'Dashboard';

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3.5 bg-white border-b border-slate-100 flex-shrink-0 gap-3">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-500 hover:text-slate-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-800 whitespace-nowrap">{title}</h1>
      </div>

      {/* Search */}
      <div className="relative hidden md:block flex-1 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search anything in CredaChain..."
          className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
          <Wallet size={14} className="text-[#14F195]" />
          <span className="text-xs font-semibold">{user ? shortenAddress(user.walletAddress, 4, 4) : 'No wallet'}</span>
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#22C55E] rounded-full" />
        </button>

        {/* Logout */}
        <button
          onClick={signOut}
          title="Sign out"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
        >
          <LogOut size={15} />
        </button>

        {/* Add Money CTA */}
        <button
          onClick={() => addToast('Redirecting to fund wallet…', 'info')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-full transition-all shadow-sm shadow-[#22C55E]/30"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Fund Wallet</span>
        </button>
      </div>
    </header>
  );
}
