'use client';

import { useState } from 'react';
import { Database, CheckCircle, Loader2 } from 'lucide-react';
import { formatNaira, generateHash } from '@/lib/formatters';
import { dataBundles } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';

const networks = ['MTN', 'Glo', 'Airtel', '9mobile'];
const networkColors: Record<string, string> = {
  MTN: 'bg-yellow-400 text-yellow-900',
  Glo: 'bg-green-500 text-white',
  Airtel: 'bg-red-500 text-white',
  '9mobile': 'bg-emerald-600 text-white',
};

type Step = 'form' | 'processing' | 'done';

export default function DataPage() {
  const { addToast } = useAppStore();
  const [network, setNetwork]   = useState('MTN');
  const [phone, setPhone]       = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep]         = useState<Step>('form');
  const [txHash, setTxHash]     = useState('');

  const filtered = dataBundles.filter((b) => b.network === network);
  const chosenBundle = dataBundles.find((b) => b.id === selected);

  const handleBuy = () => {
    if (!phone || !selected) return addToast('Select a bundle and enter phone number', 'warning');
    setStep('processing');
    setTxHash(generateHash());
    setTimeout(() => { setStep('done'); addToast('Data activated! ✓', 'success'); }, 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Buy Data</h2>

      {step === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          {/* Network */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Select Network</label>
            <div className="grid grid-cols-4 gap-2">
              {networks.map((n) => (
                <button
                  key={n}
                  onClick={() => { setNetwork(n); setSelected(null); }}
                  className={`py-2.5 rounded-xl text-xs font-bold border-2 transition ${
                    network === n ? `${networkColors[n]} border-transparent` : 'bg-slate-50 text-slate-600 border-slate-200'
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
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812 345 6789"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
            />
          </div>

          {/* Bundles */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Choose Bundle</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition text-left ${
                    selected === b.id
                      ? 'bg-[#4169E1]/5 border-[#4169E1] text-[#4169E1]'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#4169E1]/30'
                  }`}
                >
                  <div>
                    <p className="font-bold">{b.size}</p>
                    <p className="text-[10px] text-slate-400">{b.validity}</p>
                  </div>
                  <span className="font-bold text-base">{formatNaira(b.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {chosenBundle && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
              <Database size={12} className="inline mr-1" />
              {chosenBundle.size} for {chosenBundle.validity} on {network} — {formatNaira(chosenBundle.price)}
            </div>
          )}

          <button onClick={handleBuy} className="w-full py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl transition">
            Buy Bundle
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-[#4169E1] animate-spin" />
          <p className="text-sm font-bold text-slate-700">Activating bundle…</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={36} className="text-[#22C55E]" />
          </div>
          <p className="text-lg font-bold text-slate-800">Bundle Activated!</p>
          <p className="text-sm text-slate-500 text-center">{chosenBundle?.size} data activated on {phone}.</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">TX: {txHash}</code>
          <button onClick={() => setStep('form')} className="px-8 py-2.5 bg-[#4169E1] text-white font-bold rounded-xl hover:bg-[#2A4FCF] text-sm transition">Buy Again</button>
        </div>
      )}
    </div>
  );
}
