'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import type { WalletName } from '@solana/wallet-adapter-base';
import { ChevronDown, Wallet } from 'lucide-react';
import { shortenAddress } from '@/lib/solana';

interface WalletConnectButtonProps {
  className?: string;
}

export default function WalletConnectButton({ className = '' }: WalletConnectButtonProps) {
  const router = useRouter();
  const { wallets, wallet, select, connect, disconnect, connected, connecting, publicKey } = useWallet();
  const [open, setOpen] = useState(false);
  const [pendingWalletName, setPendingWalletName] = useState<WalletName | null>(null);

  const availableWallets = useMemo(
    () => wallets.filter((item) => ['Phantom', 'Solflare'].includes(item.adapter.name)),
    [wallets]
  );

  useEffect(() => {
    if (!pendingWalletName) return;
    if (wallet?.adapter.name !== pendingWalletName) return;

    const run = async () => {
      try {
        await connect();
        router.push('/dashboard');
      } catch {
        // Ignore connection cancellation and keep the selector available.
      } finally {
        setPendingWalletName(null);
      }
    };

    run();
  }, [connect, pendingWalletName, router, wallet]);

  const buttonLabel = connected && publicKey
    ? shortenAddress(publicKey.toBase58(), 4, 4)
    : connecting
      ? 'Connecting...'
      : 'Connect Wallet';

  async function handlePrimaryAction() {
    if (connected) {
      router.push('/dashboard');
      return;
    }

    setOpen((current) => !current);
  }

  async function handleDisconnect() {
    await disconnect().catch(() => undefined);
    setOpen(false);
  }

  function handleSelectWallet(walletName: WalletName) {
    setOpen(false);
    setPendingWalletName(walletName);
    select(walletName);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handlePrimaryAction}
        className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white shadow-none transition-all hover:bg-white/10 ${className}`}
      >
        <Wallet size={16} />
        <span>{buttonLabel}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-2xl border border-white/10 bg-[#0D1B2A] p-3 shadow-2xl shadow-black/30">
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Select Wallet
          </p>
          <div className="space-y-2">
            {availableWallets.map((item) => (
              <button
                key={item.adapter.name}
                type="button"
                onClick={() => handleSelectWallet(item.adapter.name)}
                className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:bg-white/10"
              >
                <span className="font-semibold">{item.adapter.name}</span>
                <span className="text-xs text-slate-400">{item.readyState}</span>
              </button>
            ))}
          </div>

          {connected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="mt-3 w-full rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              Disconnect
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
