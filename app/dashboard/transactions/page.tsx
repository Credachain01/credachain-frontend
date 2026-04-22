'use client';

import { useState, useMemo } from 'react';
import { Search, Download, ArrowUpRight, Smartphone, Database, Zap as ZapIcon, Tv, Droplets, Send, DollarSign, RefreshCcw } from 'lucide-react';
import { mockTransactions, TxType } from '@/lib/mock-data';
import { formatNaira, formatUSDT, formatHash, formatDate } from '@/lib/formatters';
import { useAppStore } from '@/lib/store';

const statusStyle: Record<string, string> = {
  Completed: 'bg-green-50 text-green-600 border border-green-200',
  Pending:   'bg-amber-50 text-amber-600 border border-amber-200',
  Failed:    'bg-red-50   text-red-600   border border-red-200',
};

const typeIcons: Record<string, React.ReactNode> = {
  Airtime:     <Smartphone size={13} />,
  Data:        <Database size={13} />,
  Electricity: <ZapIcon size={13} />,
  'Cable TV':  <Tv size={13} />,
  Water:       <Droplets size={13} />,
  Transfer:    <Send size={13} />,
  'USDC Buy':  <DollarSign size={13} />,
  'USDC Sell': <RefreshCcw size={13} />,
  Deposit:     <ArrowUpRight size={13} />,
};

const ALL_TYPES: TxType[] = ['Airtime','Data','Electricity','Cable TV','Water','Transfer','USDC Buy','USDC Sell','Deposit'];

export default function TransactionsPage() {
  const { addToast } = useAppStore();
  const [search, setSearch]     = useState('');
  const [typeFilter, setType]   = useState('');
  const [statusFilter, setStatus] = useState('');

  const filtered = useMemo(() =>
    mockTransactions.filter((tx) => {
      const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase()) ||
                          tx.hash.toLowerCase().includes(search.toLowerCase());
      const matchType   = !typeFilter   || tx.type   === typeFilter;
      const matchStatus = !statusFilter || tx.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    }),
  [search, typeFilter, statusFilter]);

  const exportCSV = () => {
    const header = 'Description,Date,Hash,Amount,Currency,Status\n';
    const rows = filtered.map((tx) =>
      `"${tx.description}","${formatDate(tx.date)}","${tx.hash}","${tx.amount}","${tx.currency}","${tx.status}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'credachain-transactions.csv'; a.click();
    addToast('Transactions exported!', 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Transactions</h2>
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#4169E1] hover:bg-[#2A4FCF] rounded-full transition">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions…"
            className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-600"
        >
          <option value="">All Types</option>
          {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-600"
        >
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-50 text-xs font-bold text-slate-500 grid grid-cols-12 gap-2">
          <span className="col-span-1">#</span>
          <span className="col-span-3">Description</span>
          <span className="col-span-2">Date</span>
          <span className="col-span-3">Hash</span>
          <span className="col-span-2 text-right">Amount</span>
          <span className="col-span-1 text-center">Status</span>
        </div>
        <div className="divide-y divide-slate-50">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">No transactions found.</div>
          )}
          {filtered.map((tx) => (
            <div key={tx.id} className="px-5 py-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50 transition text-sm">
              <div className="col-span-1 flex items-center">
                <div className="w-7 h-7 rounded-full bg-[#4169E1]/10 flex items-center justify-center text-[#4169E1]">
                  {typeIcons[tx.type] ?? <ArrowUpRight size={13} />}
                </div>
              </div>
              <div className="col-span-3">
                <p className="text-xs font-semibold text-slate-700 truncate">{tx.description}</p>
                <p className="text-[10px] text-slate-400">{tx.type}</p>
              </div>
              <div className="col-span-2 text-xs text-slate-500">{formatDate(tx.date)}</div>
              <div className="col-span-3 text-[11px] text-slate-400 font-mono">{formatHash(tx.hash)}</div>
              <div className="col-span-2 text-xs font-bold text-slate-800 text-right">
                {tx.currency === 'NGN' ? formatNaira(tx.amount) : formatUSDT(tx.amount)}
              </div>
              <div className="col-span-1 flex justify-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[tx.status]}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 text-right">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
