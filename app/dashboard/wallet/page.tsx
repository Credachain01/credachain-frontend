'use client';

import { useEffect, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  Wallet, Copy, QrCode, Plus, ArrowDownToLine,
  ArrowUpFromLine, Building2, CheckCircle,
} from 'lucide-react';
import { formatNaira, formatUSDT } from '@/lib/formatters';
import { useAppStore } from '@/lib/store';

const MOCK_WALLET_ADDRESS = '7YgP8QfR2wJmX4nLk3Vc8sTz6HdB1rNp5uAeC9xM4sQ';
const MOCK_ACCOUNT = { bank: 'Access Bank', name: 'John Doe', number: '0123456789' };
const MAINNET_USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const DEVNET_USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

export default function WalletPage() {
  const { connection } = useConnection();
  const { connected, publicKey } = useWallet();
  const { nairaBalance, usdtBalance, usdtRate, addToast, setUsdtBalance } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const walletAddress = useMemo(
    () => publicKey?.toBase58() ?? MOCK_WALLET_ADDRESS,
    [publicKey]
  );

  const usdcMintAddress = useMemo(() => {
    if (process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS) {
      return process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;
    }

    return connection.rpcEndpoint.includes('devnet') ? DEVNET_USDC_MINT : MAINNET_USDC_MINT;
  }, [connection.rpcEndpoint]);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;
    let inFlight = false;

    const loadUsdcBalance = async () => {
      if (!connected || !publicKey) {
        setUsdtBalance(0);
        setBalanceError(null);
        return;
      }
      if (inFlight) return;

      inFlight = true;
      try {
        const mint = new PublicKey(usdcMintAddress);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint },
          'confirmed'
        );

        const nextBalance = tokenAccounts.value.reduce((sum, accountInfo) => {
          const tokenAmount = accountInfo.account.data.parsed.info.tokenAmount;
          const uiAmount =
            typeof tokenAmount.uiAmount === 'number'
              ? tokenAmount.uiAmount
              : Number(tokenAmount.uiAmountString ?? '0');

          return Number.isFinite(uiAmount) ? sum + uiAmount : sum;
        }, 0);

        if (!cancelled) {
          setUsdtBalance(nextBalance);
          setBalanceError(null);
        }
      } catch {
        if (!cancelled) {
          setBalanceError('Unable to refresh USDC balance right now.');
        }
      } finally {
        inFlight = false;
      }
    };

    void loadUsdcBalance();
    if (connected && publicKey) {
      // Keep RPC usage low while still refreshing periodically.
      intervalId = window.setInterval(() => {
        void loadUsdcBalance();
      }, 60000);
    }

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [connected, connection, publicKey, setUsdtBalance, usdcMintAddress]);

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Wallet address copied!', 'success');
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800">My Wallet</h2>

      {/* Wallet cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Naira Wallet */}
        <div className="bg-gradient-to-br from-[#0D1B2A] to-[#162840] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-[#22C55E]" />
              <span className="text-sm font-semibold text-slate-300">Naira Wallet</span>
            </div>
            <span className="text-[10px] bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full font-bold border border-[#22C55E]/30">Active</span>
          </div>
          <p className="text-sm text-slate-400 mb-1">Available Balance</p>
          <p className="text-4xl font-bold mb-6">{formatNaira(nairaBalance)}</p>
          <div className="flex gap-3">
            <button
              onClick={() => addToast('Redirecting to fund wallet…', 'info')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] rounded-xl text-sm font-bold transition"
            >
              <Plus size={15} /> Fund
            </button>
            <button
              onClick={() => addToast('Withdrawal initiated!', 'success')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition border border-white/10"
            >
              <ArrowUpFromLine size={15} /> Withdraw
            </button>
          </div>
        </div>

        {/* USDC Wallet */}
        <div className="bg-gradient-to-br from-[#14532D] to-[#166534] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-[#4ade80]" />
              <span className="text-sm font-semibold text-green-200">USDC Wallet</span>
            </div>
            <span className="text-[10px] bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full font-bold border border-green-400/30">Active</span>
          </div>
          <p className="text-sm text-green-300 mb-1">Available Balance</p>
          <p className="text-4xl font-bold mb-1">{formatUSDT(usdtBalance)}</p>
          <p className="text-xs text-green-300 mb-6">≈ {formatNaira(usdtBalance * usdtRate)}</p>
          {balanceError ? <p className="text-[11px] text-amber-200 mb-4">{balanceError}</p> : null}
          <div className="flex gap-3">
            <button
              onClick={() => addToast('Deposit USDC via your Solana address below', 'info')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-400 hover:bg-green-300 text-green-900 rounded-xl text-sm font-bold transition"
            >
              <ArrowDownToLine size={15} /> Deposit
            </button>
            <button
              onClick={() => addToast('USDC withdrawal initiated!', 'success')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition border border-white/10"
            >
              <ArrowUpFromLine size={15} /> Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Naira Top-up Details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-[#4169E1]" />
            <p className="text-sm font-semibold text-slate-700">Naira Top-up Details</p>
          </div>
          <p className="text-xs text-slate-500 mb-4">Transfer to the bank account below to fund your Naira wallet.</p>
          {[
            { label: 'Bank Name',     value: MOCK_ACCOUNT.bank     },
            { label: 'Account Name',  value: MOCK_ACCOUNT.name     },
            { label: 'Account Number',value: MOCK_ACCOUNT.number   },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-500">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{value}</span>
                <button onClick={() => { addToast(`${label} copied!`, 'success'); }}>
                  <Copy size={13} className="text-slate-400 hover:text-[#4169E1]" />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            ⚠ Transfer only from accounts linked to your profile. Minimum top-up: ₦1,000.
          </div>
        </div>

        {/* USDC Deposit Address */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <QrCode size={16} className="text-[#22C55E]" />
            <p className="text-sm font-semibold text-slate-700">USDC Deposit (Solana)</p>
          </div>
          <p className="text-xs text-slate-500 mb-4">Send only Solana USDC to this address. SPL tokens on other networks will not arrive.</p>
          {/* QR code placeholder */}
          <div className="w-36 h-36 mx-auto rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 mb-4">
            <QrCode size={56} />
            <p className="text-[10px] mt-2">QR Code</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <code className="text-xs text-slate-700 flex-1 truncate font-mono">
              {walletAddress}
            </code>
            <button
              onClick={copyAddress}
              className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[#4169E1] font-semibold"
            >
              {copied ? <CheckCircle size={13} className="text-[#22C55E]" /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
            Minimum deposit: 1 USDC. Typical confirmation time on Solana: under 1 minute.
          </div>
        </div>
      </div>
    </div>
  );
}
