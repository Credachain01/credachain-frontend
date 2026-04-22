'use client';

import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { shortenAddress } from '@/lib/solana';

interface WalletSession {
  id: string;
  walletAddress: string;
  walletProvider: string;
}

interface WalletProfile {
  full_name: string;
  email: string;
  wallet_address: string;
  wallet_provider: string;
}

interface AuthContextType {
  user: WalletSession | null;
  session: WalletSession | null;
  profile: WalletProfile | null;
  loading: boolean;
  connectWallet: () => Promise<{ error: string | null }>;
  signUp: () => Promise<{ error: string | null }>;
  signIn: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildProfile(session: WalletSession | null): WalletProfile | null {
  if (!session) return null;

  return {
    full_name: `${session.walletProvider} Wallet`,
    email: shortenAddress(session.walletAddress, 6, 6),
    wallet_address: session.walletAddress,
    wallet_provider: session.walletProvider,
  };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { publicKey, connected, connecting, disconnect, wallet, wallets, select } = useWallet();

  const session = useMemo<WalletSession | null>(() => {
    if (!connected || !publicKey) return null;

    const walletAddress = publicKey.toBase58();

    return {
      id: walletAddress,
      walletAddress,
      walletProvider: wallet?.adapter.name ?? 'Solana Wallet',
    };
  }, [connected, publicKey, wallet]);

  const user = session;
  const profile = useMemo(() => buildProfile(session), [session]);
  const loading = connecting;

  const refreshProfile = useCallback(async () => undefined, []);

  const connectWallet = useCallback(async (): Promise<{ error: string | null }> => {
    const preferredWallet = wallets.find((item) => item.adapter.name === 'Phantom') ?? wallets[0];

    if (!preferredWallet) {
      return { error: 'No Solana wallet adapters are available.' };
    }

    select(preferredWallet.adapter.name);
    return { error: null };
  }, [select, wallets]);

  const signUp = useCallback(async () => connectWallet(), [connectWallet]);
  const signIn = useCallback(async () => connectWallet(), [connectWallet]);

  const signOut = useCallback(async () => {
    try {
      await disconnect();
    } catch {
      // Ignore disconnect errors during demo flow.
    }

    router.push('/');
  }, [disconnect, router]);

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, connectWallet, signUp, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
