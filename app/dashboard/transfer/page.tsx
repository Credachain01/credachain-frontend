'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle, ArrowRightLeft } from 'lucide-react';
import { formatNaira, formatUSDT, generateHash } from '@/lib/formatters';
import { useAppStore } from '@/lib/store';

type Step = 'form' | 'confirm' | 'processing' | 'done';
type Currency = 'NGN' | 'USDT';

export default function TransferPage() {
  const { nairaBalance, usdtBalance, usdtRate, addToast } = useAppStore();
  const [step, setStep]         = useState<Step>('form');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount]     = useState('');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [note, setNote]         = useState('');
  const [pin, setPin]           = useState('');
  const [txHash, setTxHash]     = useState('');
  const [blockCount, setBlockCount] = useState(0);

  const numAmount = parseFloat(amount) || 0;
  const displayAmount = currency === 'NGN' ? formatNaira(numAmount) : formatUSDT(numAmount);

  const handleSubmit = () => {
    if (!recipient || !amount) return addToast('Please fill all required fields', 'warning');
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (pin.length < 4) return addToast('Enter your 4-digit PIN', 'warning');
    setStep('processing');
    setBlockCount(0);
    const hash = generateHash();
    setTxHash(hash);
    // Simulate block confirmations
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBlockCount(count);
      if (count >= 6) {
        clearInterval(interval);
        setStep('done');
        addToast('Transfer confirmed on-chain! ✓', 'success');
      }
    }, 700);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Transfer</h2>

      {/* Balance chips */}
      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-xl border border-slate-100 px-4 py-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Naira Balance</p>
          <p className="text-base font-bold text-slate-800">{formatNaira(nairaBalance)}</p>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-slate-100 px-4 py-3">
          <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">USDT Balance</p>
          <p className="text-base font-bold text-slate-800">{formatUSDT(usdtBalance)}</p>
        </div>
      </div>

      {/* Form card */}
      {step === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Recipient (Bank / CredaChain username)</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0123456789 or @username"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Amount</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                  {currency === 'NGN' ? '₦' : '$'}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
                />
              </div>
              <button
                onClick={() => setCurrency((c) => c === 'NGN' ? 'USDT' : 'NGN')}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                <ArrowRightLeft size={13} />
                {currency}
              </button>
            </div>
            {currency === 'NGN' && numAmount > 0 && (
              <p className="text-[11px] text-slate-400 mt-1">≈ {formatUSDT(numAmount / usdtRate)} USDT</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Rent payment"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-[#4169E1] hover:bg-[#2A4FCF] text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Send size={15} /> Continue
          </button>
        </div>
      )}

      {/* Confirm */}
      {step === 'confirm' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-700">Confirm Transfer</p>
          {[
            { label: 'Recipient', value: recipient },
            { label: 'Amount', value: displayAmount },
            { label: 'Network Fee', value: '₦50.00' },
            { label: 'Note', value: note || '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
              <span className="text-slate-500">{label}</span>
              <span className="font-bold text-slate-800">{value}</span>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Enter 4-digit PIN</label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700 text-center text-lg tracking-widest"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('form')} className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 text-sm transition">Back</button>
            <button onClick={handleConfirm} className="flex-1 py-2.5 bg-[#4169E1] text-white font-bold rounded-xl hover:bg-[#2A4FCF] text-sm transition">Confirm</button>
          </div>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 size={48} className="text-[#4169E1] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-[#4169E1]">{blockCount}</span>
            </div>
          </div>
          <p className="text-sm font-bold text-slate-700">Processing Transaction…</p>
          <p className="text-xs text-slate-500">Block confirmations: {blockCount} / 6</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg">
            TX: {txHash}
          </code>
          <div className="flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`w-4 h-1.5 rounded-full transition-all duration-500 ${i < blockCount ? 'bg-[#22C55E]' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {step === 'done' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={36} className="text-[#22C55E]" />
          </div>
          <p className="text-lg font-bold text-slate-800">Transfer Confirmed!</p>
          <p className="text-sm text-slate-500">Your transfer of {displayAmount} to {recipient} was successful.</p>
          <code className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg text-center">
            TX Hash: {txHash}
          </code>
          <button
            onClick={() => { setStep('form'); setRecipient(''); setAmount(''); setPin(''); setNote(''); }}
            className="px-8 py-2.5 bg-[#4169E1] text-white font-bold rounded-xl hover:bg-[#2A4FCF] text-sm transition"
          >
            New Transfer
          </button>
        </div>
      )}
    </div>
  );
}
