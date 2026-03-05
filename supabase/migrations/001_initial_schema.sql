-- ============================================================
-- CredaChain Database Schema
-- ============================================================

-- ── Clean up (safe to re-run) ───────────────────────────────
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS kyc_status CASCADE;
DROP TYPE IF EXISTS wallet_currency CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;

CREATE TYPE kyc_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE wallet_currency AS ENUM ('NGN', 'USDT');
CREATE TYPE transaction_type AS ENUM (
  'airtime', 'data', 'electricity', 'cable',
  'transfer', 'usdt_buy', 'usdt_sell', 'wallet_fund'
);
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- ── Enable UUID generation ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ────────────────────────────────────────────────
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT UNIQUE NOT NULL,
  pin_hash   TEXT NOT NULL,
  kyc_status kyc_status NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Wallets ─────────────────────────────────────────────────
CREATE TABLE wallets (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  currency       wallet_currency NOT NULL,
  balance        NUMERIC(18, 2) NOT NULL DEFAULT 0,
  wallet_address TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, currency)
);

-- ── Transactions ────────────────────────────────────────────
CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        transaction_type NOT NULL,
  amount      NUMERIC(18, 2) NOT NULL,
  currency    wallet_currency NOT NULL,
  status      transaction_status NOT NULL DEFAULT 'pending',
  reference   TEXT UNIQUE NOT NULL,
  description TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Bank Accounts ───────────────────────────────────────────
CREATE TABLE bank_accounts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bank_name      TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name   TEXT NOT NULL,
  is_default     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_wallets_user_id       ON wallets(user_id);
CREATE INDEX idx_transactions_user_id  ON transactions(user_id);
CREATE INDEX idx_transactions_created  ON transactions(created_at DESC);
CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts  ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own row
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Wallets: users can read/update their own wallets
CREATE POLICY "Users can view own wallets"
  ON wallets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets"
  ON wallets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets"
  ON wallets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Transactions: users can read/insert their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Bank Accounts: full CRUD on own rows
CREATE POLICY "Users can view own bank accounts"
  ON bank_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank accounts"
  ON bank_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bank accounts"
  ON bank_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank accounts"
  ON bank_accounts FOR DELETE
  USING (auth.uid() = user_id);
