'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { shortenAddress } from '@/lib/solana';
import {
  LayoutDashboard, Wallet, ArrowLeftRight, Send,
  Smartphone, Database, FileText, RefreshCcw,
  Settings, Lock, LogOut, X,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',      href: '/dashboard',           exact: true  },
  { icon: Wallet,          label: 'Wallet',         href: '/dashboard/wallet'                  },
  { icon: ArrowLeftRight,  label: 'Transactions',   href: '/dashboard/transactions'            },
  { icon: Send,            label: 'Transfer',       href: '/dashboard/transfer'                },
  { icon: Smartphone,      label: 'Buy Airtime',    href: '/dashboard/airtime'                 },
  { icon: Database,        label: 'Buy Data',       href: '/dashboard/data'                    },
  { icon: FileText,        label: 'Pay Bills',      href: '/dashboard/bills'                   },
  { icon: RefreshCcw,      label: 'USDC Exchange',  href: '/dashboard/usdt'                    },
];

const generalItems = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: Lock,     label: 'Security', href: '/dashboard/security' },
];

export default function DashboardSidebar() {
  const pathname    = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebar  = useAppStore((s) => s.setSidebarOpen);
  const { user, profile, signOut } = useAuth();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const displayName = profile?.full_name || 'Wallet User';
  const displayEmail = user ? shortenAddress(user.walletAddress, 6, 6) : '';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40 md:z-auto
          h-full flex-shrink-0 bg-[#0D1B2A]
          flex flex-col transition-transform duration-300
          w-60
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo + close btn */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
          <Link href="/">
            <Image src="/logo-large.png" alt="CredaChain" width={140} height={36}
              className="object-contain h-8 w-auto" />
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebar(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2 px-2">Menu</p>
            <ul className="space-y-0.5">
              {navItems.map(({ icon: Icon, label, href, exact }) => {
                const active = isActive(href, exact);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setSidebar(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                        ${active
                          ? 'bg-[#4169E1] text-white shadow-md shadow-[#4169E1]/30'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                        }`}
                    >
                      <Icon size={17} className={active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-2 px-2">General</p>
            <ul className="space-y-0.5">
              {generalItems.map(({ icon: Icon, label, href }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setSidebar(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                        ${active
                          ? 'bg-[#4169E1] text-white shadow-md shadow-[#4169E1]/30'
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                        }`}
                    >
                      <Icon size={17} className={active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* User profile + Logout */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initials || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="text-slate-500 hover:text-red-400 transition flex-shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
