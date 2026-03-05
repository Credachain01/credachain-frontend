'use client';

import { useState } from 'react';
import { Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { formatNaira, generateHash } from '@/lib/formatters';
import { useAppStore } from '@/lib/store';

const networks = ['MTN', 'Glo', 'Airtel', '9mobile'];
const networkColors: Record<string, string> = {
  MTN: 'bg-yellow-400 text-yellow-900',
  Glo: 'bg-green-500 text-white',
  Airtel: 'bg-red-500 text-white',
  '9mobile': 'bg-emerald-600 text-white',
};
const presets = [50, 100, 200, 500, 1000];

type Step = 'form' | 'processing' | 'done';

export default function AirtimePage() {
  const { addToast } = useAppStore();
  const [network, setNetwork] = useState('MTN');
  const [phone, setPhone]     = useState('');
  const [amount, setAmount]   = useState<number | null>(null);
  const [custom, setCustom]   = useState('');
  const [step, setStep]       = useState<Step>('form');
  const [txHash, setTxHash]   = useState('');

  const finalAmount = amount ?? (parseFloat(custom) || 0);

  const handleBuy = () => {
    if (!phone || !finalAmount) return addToast('Fill all fields', 'warning');
    setStep('processing');
    const hash = generateHash();
    setTxHash(hash);
    setTimeout(() => { setStep('done'); addToast('Airtime delivered! ✓', 'success'); }, 3000);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Buy Airtime</h2>

      {step === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          {/* Network */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Select Network</label>
            <div className="grid grid-cols-4 gap-2">
              {networks.map((n) => (
                <button
                  key={n}
                  onClick={() => setNetwork(n)}
                  className={`py-2.5 rounded-xl text-xs font-bold border-2 transition ${
                    network === n
                      ? `${networkColors[n]} border-transparent`
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone Number</label>
            <div className="flex items-center gap-2">
              <Smartphone size={15} className="text-slate-400 flex-shrink-0 ml-1" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812 345 6789"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
              />
            </div>
          </div>

          {/* Amount presets */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Select Amount</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => { setAmount(p); setCustom(''); }}
                  className={`py-2.5 rounded-xl text-sm font-bold border-2 transition ${
                    amount === p
                      ? 'bg-[#4169E1] text-white border-transparent'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#4169E1]/30'
                  }`}
                >
                  {formatNaira(p)}
                </button>
              ))}
              <button
                onClick={() => setAmount(null)}
                className={`py-2.5 rounded-xl text-sm font-bold border-2 transition col-span-1 ${
                  amount === null && custom
                    ? 'bg-[#4169E1] text-white border-transparent'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#4169E1]/30'
                }`}
              >
                Custom
              </button>
            </div>
            {amount === null && (
              <input
                type="number"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Enter custom amount"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
              />
            )}
          </div>

          {finalAmount > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
              You will be charged <span className="font-bold">{formatNaira(finalAmount)}</span> for {amount ? formatNaira(amount) : formatNaira(parseFloat(custom) || 0)} airtime on <span className="font-bold">{network}</span> to {phone || '—'}.
            </div>
          )}

          <button onClick={handleBuy} className="w-full py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl transition">
            Buy Airtime
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-[#4169E1] animate-spin" />
          <p className="text-sm font-bold text-slate-700">Processing purchase…</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={36} className="text-[#22C55E]" />
          </div>
          <p className="text-lg font-bold text-slate-800">Airtime Delivered!</p>
          <p className="text-sm text-slate-500 text-center">{formatNaira(finalAmount)} {network} airtime sent to {phone}.</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
          <button onClick={() => setStep('form')} className="px-8 py-2.5 bg-[#4169E1] text-white font-bold rounded-xl hover:bg-[#2A4FCF] text-sm transition">Buy Again</button>
        </div>
      )}
    </div>
  );
}
