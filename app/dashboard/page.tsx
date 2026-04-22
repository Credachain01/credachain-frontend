'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MoreHorizontal, TrendingUp, TrendingDown, Zap, ArrowUpRight,
  Smartphone, Database, Zap as ZapIcon, Droplets,
  Tv, Send, DollarSign, RefreshCcw, Sparkles, Shield, Activity,
  CalendarDays,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie,
} from 'recharts';
import { monthlySpendingData, networkStats, mockTransactions } from '@/lib/mock-data';
import { formatNaira, formatUSDT, formatHash, formatDate } from '@/lib/formatters';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/lib/auth/AuthContext';
import { shortenAddress } from '@/lib/solana';

/* ── helpers ─────────────────────────────────────────────── */
const statusStyle: Record<string, string> = {
  Completed: 'bg-green-50 text-green-600 border border-green-200',
  Pending:   'bg-amber-50 text-amber-600 border border-amber-200',
  Failed:    'bg-red-50   text-red-600   border border-red-200',
};

const typeIcons: Record<string, React.ReactNode> = {
  Airtime:    <Smartphone size={14} />,
  Data:       <Database size={14} />,
  Electricity:<ZapIcon size={14} />,
  'Cable TV': <Tv size={14} />,
  Water:      <Droplets size={14} />,
  Transfer:   <Send size={14} />,
  'USDC Buy': <DollarSign size={14} />,
  'USDC Sell':<RefreshCcw size={14} />,
  Deposit:    <ArrowUpRight size={14} />,
};

const typeLabels: Record<string, string> = {
  Airtime: 'Airtime',
  Data: 'Data',
  Electricity: 'Electricity',
  'Cable TV': 'Cable TV',
  Water: 'Water',
  Transfer: 'Transfer',
  'USDC Buy': 'USDC Buy',
  'USDC Sell': 'USDC Sell',
  Deposit: 'Wallet Fund',
};

const quickServices = [
  { label: 'Airtime',    icon: Smartphone,  color: 'bg-blue-50   text-[#4169E1]', href: '/dashboard/airtime' },
  { label: 'Data',       icon: Database,    color: 'bg-purple-50 text-purple-600', href: '/dashboard/data'    },
  { label: 'Electricity',icon: ZapIcon,     color: 'bg-amber-50  text-amber-600',  href: '/dashboard/bills'   },
  { label: 'Water',      icon: Droplets,    color: 'bg-cyan-50   text-cyan-600',   href: '/dashboard/bills'   },
  { label: 'Cable TV',   icon: Tv,          color: 'bg-rose-50   text-rose-600',   href: '/dashboard/bills'   },
  { label: 'Transfer',   icon: Send,        color: 'bg-indigo-50 text-indigo-600', href: '/dashboard/transfer'},
  { label: 'Buy USDC',   icon: DollarSign,  color: 'bg-green-50  text-green-600',  href: '/dashboard/usdt'    },
  { label: 'Sell USDC',  icon: RefreshCcw,  color: 'bg-slate-50  text-slate-600',  href: '/dashboard/usdt'    },
];

const spendReport = [
  { label: 'Airtime',   amount: 12500, max: 100000 },
  { label: 'Data',      amount: 8500,  max: 100000 },
  { label: 'Utilities', amount: 27500, max: 100000 },
  { label: 'Transfers', amount: 45000, max: 100000 },
];

const donutData = [
  { name: '₦ Naira',  value: 68, fill: '#4169E1' },
  { name: 'USDC',     value: 16, fill: '#22C55E'  },
  { name: 'Savings',  value: 16, fill: '#F97316'  },
];

/* ── Skeleton components ─────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
      <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
      <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-24 bg-slate-100 rounded" />
    </div>
  );
}

function SkeletonTransaction() {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 animate-pulse">
      <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-28 bg-slate-200 rounded" />
        <div className="h-2.5 w-16 bg-slate-100 rounded" />
      </div>
      <div className="h-4 w-16 bg-slate-200 rounded-full" />
    </div>
  );
}

/* ── Component ───────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const { nairaBalance, usdtBalance, usdtRate, setNairaBalance, setUsdtBalance } = useAppStore();
  const [liveRate, setLiveRate] = useState(usdtRate);

  const [transactions, setTransactions] = useState(mockTransactions.slice(0, 5));
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);

  // Simulate live rate updating
  useEffect(() => {
    const id = setInterval(() => {
      setLiveRate((r) => r + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user) return;

    const timer = window.setTimeout(() => {
      setNairaBalance(245000);
      setUsdtBalance(128.45);
      setTransactions(mockTransactions.slice(0, 5));
      setWalletsLoading(false);
      setTxLoading(false);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [user, setNairaBalance, setUsdtBalance]);

  return (
    <div className="space-y-5">
      {/* ── Page header ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-sm text-slate-500">
            Monitor balances and activity for {user ? shortenAddress(user.walletAddress, 6, 6) : 'your connected wallet'}.
          </p>
        </div>
        <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition">
          <CalendarDays size={14} className="text-slate-400" /> Feb 2026
        </button>
      </div>

      {/* ── ROW 1: Summary Cards + Donut (right col spanning 2 rows) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">

        {/* Left 3 cols — stacked in 2 rows */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-4">

          {/* Row 1 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Update / Alert card */}
            <div className="bg-[#0D1B2A] rounded-2xl p-5 flex flex-col justify-between min-h-[148px]">
              <div className="flex items-center justify-between">
                <span className="bg-[#22C55E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap size={9} /> Update
                </span>
                <MoreHorizontal size={15} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 mt-1">Feb 20, 2026</p>
                <p className="text-sm text-slate-200 mt-1 leading-snug font-medium">
                  Network TPS hit <span className="text-[#22C55E] font-bold">1,866</span> — fastest this month!
                </p>
                <Link href="/dashboard/transactions" className="mt-3 text-xs text-[#22C55E] font-medium hover:underline inline-block">
                  See Transactions →
                </Link>
              </div>
            </div>

            {/* Total Balance */}
            {walletsLoading ? (
              <SkeletonCard />
            ) : (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Total Balance</span>
                  <MoreHorizontal size={15} className="text-slate-400" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-800">{formatNaira(nairaBalance)}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <TrendingUp size={13} className="text-[#22C55E]" />
                    <span className="text-xs text-[#22C55E] font-semibold">+35%</span>
                    <span className="text-xs text-slate-400">from last month</span>
                  </div>
                </div>
              </div>
            )}

            {/* USDC Balance */}
            {walletsLoading ? (
              <SkeletonCard />
            ) : (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">USDC Balance</span>
                  <MoreHorizontal size={15} className="text-slate-400" />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-slate-800">{formatUSDT(usdtBalance)}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <TrendingDown size={13} className="text-red-400" />
                    <span className="text-xs text-red-400 font-semibold">-24%</span>
                    <span className="text-xs text-slate-400">from last month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    1 USDC = ₦{liveRate.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Row 2: Transactions + Bar chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-700">Recent Transactions</p>
                <Link href="/dashboard/transactions" className="text-xs text-[#4169E1] hover:underline font-medium">View all</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {txLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonTransaction key={i} />)
                ) : transactions.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-slate-400">No transactions yet</p>
                    <p className="text-xs text-slate-300 mt-1">Your recent transactions will appear here</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition">
                      <div className="w-7 h-7 rounded-full bg-[#4169E1]/10 flex items-center justify-center flex-shrink-0 text-[#4169E1]">
                        {typeIcons[tx.type] ?? <ArrowUpRight size={13} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{tx.description || typeLabels[tx.type] || tx.type}</p>
                        <p className="text-[10px] text-slate-400">{formatDate(tx.date)}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                        {formatHash(tx.hash)}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${statusStyle[tx.status] ?? ''}`}>
                        {tx.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Spending bar chart (mock data — kept as-is) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-slate-700">Revenue & Spending</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4169E1] inline-block" />Income</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block" />Expenses</span>
                </div>
              </div>
              <p className="text-xl font-bold text-slate-800 mb-0.5">{formatNaira(nairaBalance || 193000)}</p>
              <p className="text-[11px] text-[#22C55E] font-semibold mb-3">↑ +35% from last month</p>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={monthlySpendingData} barSize={8} barGap={3}>
                  <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((v: any, name: any) => [formatNaira(Number(v)), name]) as any}
                  />
                  <Bar dataKey="income"   fill="#4169E1" radius={[3,3,0,0]} />
                  <Bar dataKey="expenses" fill="#22C55E" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 3: Quick Services + Spending Report (mock data — kept as-is) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Quick Services */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <p className="text-sm font-semibold text-slate-700 mb-4">Quick Services</p>
              <div className="grid grid-cols-4 gap-3">
                {quickServices.map(({ label, icon: Icon, color, href }) => (
                  <Link key={label} href={href}
                    className="flex flex-col items-center gap-1.5 group">
                    <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center transition group-hover:scale-110`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium text-center leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Spending Report */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-700">Spending Report</p>
                <MoreHorizontal size={15} className="text-slate-400" />
              </div>
              <div className="space-y-3">
                {spendReport.map(({ label, amount, max }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{label}</span>
                      <span className="font-semibold text-slate-700">{formatNaira(amount)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4169E1] rounded-full transition-all"
                        style={{ width: `${(amount / max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column (stats — mock data, kept as-is) ───── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">Wallet Split</p>
              <MoreHorizontal size={15} className="text-slate-400" />
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <PieChart width={150} height={150}>
                  <Pie
                    data={donutData}
                    cx={75} cy={75}
                    innerRadius={48} outerRadius={68}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-bold text-slate-800">
                    {formatNaira(nairaBalance + usdtBalance * liveRate).replace('₦', '₦').split('.')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">Total</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-2">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                    {d.name}
                  </div>
                  <span className="font-semibold text-slate-700">{d.value}%</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 transition">
              View Full Report
            </button>
          </div>

          {/* Network Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={15} className="text-[#22C55E]" />
              <p className="text-sm font-semibold text-slate-700">Network Stats</p>
              <span className="ml-auto text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-bold">LIVE</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Current TPS',    value: `${networkStats.tps.toLocaleString()}` },
                { label: 'Block Time',     value: `${networkStats.blockTime}s` },
                { label: 'Success Rate',   value: `${networkStats.successRate}%` },
                { label: 'USDC/NGN Rate',  value: `₦${liveRate.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade to Pro */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1B2A] to-[#1A2F4E] p-5">
            <div className="absolute -top-4 -right-4 opacity-10">
              <Sparkles size={90} className="text-[#22C55E]" />
            </div>
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-[#22C55E]/20 flex items-center justify-center mb-3">
                <Shield size={16} className="text-[#22C55E]" />
              </div>
              <p className="text-white font-bold text-sm leading-snug mb-1">
                Level up your managing to the next level.
              </p>
              <p className="text-slate-400 text-[11px] mb-4">
                Unlock unlimited transfers and priority support.
              </p>
              <button className="w-full py-2.5 text-xs font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-full transition shadow-lg shadow-[#22C55E]/30">
                Upgrade to Pro →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
