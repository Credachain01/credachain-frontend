'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ArrowRightLeft, CheckCircle, Loader2, RefreshCcw } from 'lucide-react';
import {
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatNaira, formatUSDT, generateHash } from '@/lib/formatters';
import { usdtRateHistory } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';

type Mode = 'buy' | 'sell';
type Step = 'form' | 'processing' | 'done';

export default function USDTPage() {
  const { nairaBalance, usdtBalance, usdtRate, addToast } = useAppStore();
  const [mode, setMode]   = useState<Mode>('buy');
  const [amount, setAmount] = useState('');
  const [step, setStep]   = useState<Step>('form');
  const [txHash, setTxHash] = useState('');
  const [liveRate, setLiveRate] = useState(usdtRate);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveRate((r) => r + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const numAmount = parseFloat(amount) || 0;
  const converted = mode === 'buy'
    ? numAmount / liveRate
    : numAmount * liveRate;
  const slippage  = 0.5; // %
  const fee       = numAmount * 0.005;

  const handleExchange = () => {
    if (!numAmount) return addToast('Enter an amount', 'warning');
    setStep('processing');
    setTxHash(generateHash());
    setTimeout(() => { setStep('done'); addToast(`USDC ${mode === 'buy' ? 'purchase' : 'sale'} confirmed!`, 'success'); }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h2 className="text-xl font-bold text-slate-800">USDC Exchange</h2>

      {/* Rate card */}
      <div className="bg-[#0D1B2A] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">Live USDC / NGN Rate</p>
          <p className="text-3xl font-bold text-white">₦{liveRate.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <TrendingUp size={14} className="text-[#22C55E]" />
            <span className="text-xs text-[#22C55E] font-bold">+0.32%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Updated just now</p>
          <button
            onClick={() => setLiveRate((r) => r + (Math.random() > 0.5 ? 1 : -1) * 3)}
            className="mt-2 flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
          >
            <RefreshCcw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* Rate chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <p className="text-sm font-semibold text-slate-700 mb-3">7-Day Rate History</p>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={usdtRateHistory}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={((v: any) => [`₦${Number(v).toLocaleString()}`, 'Rate']) as any}
            />
            <Line type="monotone" dataKey="rate" stroke="#4169E1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Buy / Sell form */}
      {step === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
            {(['buy', 'sell'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setAmount(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                  mode === m ? 'bg-[#4169E1] text-white shadow' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'buy' ? '₦ → USDC Buy' : 'USDC → ₦ Sell'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              {mode === 'buy' ? 'Amount (₦)' : 'Amount (USDC)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                {mode === 'buy' ? '₦' : '$'}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Balance: {mode === 'buy' ? formatNaira(nairaBalance) : formatUSDT(usdtBalance)}
            </p>
          </div>

          {numAmount > 0 && (
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>You {mode === 'buy' ? 'pay' : 'sell'}</span>
                <span className="font-bold">{mode === 'buy' ? formatNaira(numAmount) : formatUSDT(numAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>You receive</span>
                <span className="font-bold text-[#22C55E]">{mode === 'buy' ? formatUSDT(converted) : formatNaira(converted)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Network fee</span>
                <span>{mode === 'buy' ? formatNaira(fee) : formatUSDT(fee / liveRate)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Max slippage</span>
                <span>{slippage}%</span>
              </div>
            </div>
          )}

          <button onClick={handleExchange} className="w-full py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl transition flex items-center justify-center gap-2">
            <ArrowRightLeft size={15} />
            {mode === 'buy' ? 'Buy USDC' : 'Sell USDC'}
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-[#4169E1] animate-spin" />
          <p className="text-sm font-bold text-slate-700">Executing exchange…</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={36} className="text-[#22C55E]" />
          </div>
          <p className="text-lg font-bold text-slate-800">Exchange Complete!</p>
          <p className="text-sm text-slate-500">
            {mode === 'buy'
              ? `You received ${formatUSDT(converted)} USDC for ${formatNaira(numAmount)}.`
              : `You received ${formatNaira(converted)} for ${formatUSDT(numAmount)} USDC.`}
          </p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
          <button onClick={() => { setStep('form'); setAmount(''); }}
            className="px-8 py-2.5 bg-[#4169E1] text-white font-bold rounded-xl hover:bg-[#2A4FCF] text-sm transition">
            New Exchange
          </button>
        </div>
      )}
    </div>
  );
}
