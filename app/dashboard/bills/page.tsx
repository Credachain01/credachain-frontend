'use client';

import { useState } from 'react';
import { Zap, Tv, Droplets, CheckCircle, Loader2 } from 'lucide-react';
import { formatNaira, generateHash } from '@/lib/formatters';
import { billProviders } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';

type BillTab = 'electricity' | 'cable' | 'water';
type Step = 'form' | 'processing' | 'done';

const tabs: { id: BillTab; label: string; icon: React.ReactNode }[] = [
  { id: 'electricity', label: 'Electricity', icon: <Zap size={14} />  },
  { id: 'cable',       label: 'Cable TV',    icon: <Tv size={14} />   },
  { id: 'water',       label: 'Water',       icon: <Droplets size={14} /> },
];

export default function BillsPage() {
  const { addToast } = useAppStore();
  const [tab, setTab]           = useState<BillTab>('electricity');
  const [provider, setProvider] = useState('');
  const [meterNo, setMeterNo]   = useState('');
  const [amount, setAmount]     = useState('');
  const [step, setStep]         = useState<Step>('form');
  const [txHash, setTxHash]     = useState('');

  const providers = billProviders.filter((p) => p.category === tab);
  const numAmount = parseFloat(amount) || 0;

  const handlePay = () => {
    if (!provider || !meterNo || !numAmount) return addToast('Fill all fields', 'warning');
    setStep('processing');
    setTxHash(generateHash());
    setTimeout(() => { setStep('done'); addToast('Bill payment confirmed! ✓', 'success'); }, 3000);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Pay Bills</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-100 rounded-2xl p-1">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setProvider(''); setMeterNo(''); setAmount(''); setStep('form'); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
              tab === id ? 'bg-[#4169E1] text-white shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {step === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          {/* Provider */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Select Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 text-left transition ${
                    provider === p.id
                      ? 'bg-[#4169E1]/5 border-[#4169E1] text-[#4169E1]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#4169E1]/30'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Meter / Smartcard */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              {tab === 'electricity' ? 'Meter Number' : tab === 'cable' ? 'Smartcard Number' : 'Account Number'}
            </label>
            <input
              value={meterNo}
              onChange={(e) => setMeterNo(e.target.value)}
              placeholder="Enter number…"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Amount (₦)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
              />
            </div>
          </div>

          {numAmount > 0 && provider && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
              You will pay <span className="font-bold">{formatNaira(numAmount)}</span> to{' '}
              <span className="font-bold">{providers.find((p) => p.id === provider)?.name}</span>.
            </div>
          )}

          <button onClick={handlePay} className="w-full py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl transition">
            Pay Bill
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-[#4169E1] animate-spin" />
          <p className="text-sm font-bold text-slate-700">Processing payment…</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={36} className="text-[#22C55E]" />
          </div>
          <p className="text-lg font-bold text-slate-800">Payment Successful!</p>
          <p className="text-sm text-slate-500 text-center">{formatNaira(numAmount)} paid to {providers.find((p) => p.id === provider)?.name}.</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
          <button onClick={() => { setStep('form'); setMeterNo(''); setAmount(''); setProvider(''); }}
            className="px-8 py-2.5 bg-[#4169E1] text-white font-bold rounded-xl hover:bg-[#2A4FCF] text-sm transition">
            Pay Another
          </button>
        </div>
      )}
    </div>
  );
}
