// lib/types/database.ts

export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type WalletCurrency = 'NGN' | 'USDT';
export type TransactionType =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable'
  | 'transfer'
  | 'usdt_buy'
  | 'usdt_sell'
  | 'wallet_fund';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  pin_hash: string;
  kyc_status: KycStatus;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  currency: WalletCurrency;
  balance: number;
  wallet_address: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  currency: WalletCurrency;
  status: TransactionStatus;
  reference: string;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
  created_at: string;
}
