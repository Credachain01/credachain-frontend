// lib/mock-data.ts

export type TxStatus = 'Completed' | 'Pending' | 'Failed';
export type TxType = 'Airtime' | 'Data' | 'Electricity' | 'Cable TV' | 'Water' | 'Transfer' | 'USDC Buy' | 'USDC Sell' | 'Deposit';

export interface Transaction {
  id: string;
  type: TxType;
  description: string;
  amount: number;
  currency: 'NGN' | 'USDT';
  date: string;
  hash: string;
  status: TxStatus;
}

export interface DataBundle {
  id: string;
  network: string;
  size: string;
  validity: string;
  price: number;
}

export interface BillProvider {
  id: string;
  name: string;
  category: 'electricity' | 'cable' | 'water';
}

// ── Transactions ────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  { id: '1',  type: 'Airtime',     description: 'MTN Airtime',       amount: 500,    currency: 'NGN',  date: '2026-02-20', hash: '4XW7K9MPQR2T', status: 'Completed' },
  { id: '2',  type: 'USDC Buy',    description: 'USDC Purchase',     amount: 50000,  currency: 'NGN',  date: '2026-02-19', hash: '7RT2B4NQZX1L', status: 'Completed' },
  { id: '3',  type: 'Electricity', description: 'EKEDC Bill',        amount: 15000,  currency: 'NGN',  date: '2026-02-19', hash: '9KZ5A1VLMN3Y', status: 'Pending'   },
  { id: '4',  type: 'Transfer',    description: 'To Emeka Okonkwo',  amount: 25000,  currency: 'NGN',  date: '2026-02-18', hash: '2PR8C6WSTQ4F', status: 'Completed' },
  { id: '5',  type: 'Data',        description: 'Airtel 5GB Data',   amount: 1500,   currency: 'NGN',  date: '2026-02-18', hash: '6MX3E9JYBH7U', status: 'Completed' },
  { id: '6',  type: 'Cable TV',    description: 'DSTV Compact',      amount: 9000,   currency: 'NGN',  date: '2026-02-17', hash: '8NV6F2HDRS5C', status: 'Completed' },
  { id: '7',  type: 'USDC Sell',   description: 'USDC → Naira',      amount: 36.5,   currency: 'USDT', date: '2026-02-17', hash: '1QU4G7MFDK8A', status: 'Failed'    },
  { id: '8',  type: 'Airtime',     description: 'Glo Airtime',       amount: 200,    currency: 'NGN',  date: '2026-02-16', hash: '3YP1H8NEKW2B', status: 'Completed' },
  { id: '9',  type: 'Transfer',    description: 'To Amaka Nwosu',    amount: 10000,  currency: 'NGN',  date: '2026-02-16', hash: '5ZQ9I3OFVL6D', status: 'Completed' },
  { id: '10', type: 'Deposit',     description: 'Naira Top-up',      amount: 100000, currency: 'NGN',  date: '2026-02-15', hash: 'AJ2K7NPCQX0R', status: 'Completed' },
  { id: '11', type: 'Water',       description: 'Lagos Water Bill',  amount: 3500,   currency: 'NGN',  date: '2026-02-15', hash: 'BL3M8OQDRY1S', status: 'Pending'   },
  { id: '12', type: 'Data',        description: 'MTN 10GB Data',     amount: 3000,   currency: 'NGN',  date: '2026-02-14', hash: 'CM4N9PRESZ2T', status: 'Completed' },
];

// ── Spending chart ──────────────────────────────────────────
export const monthlySpendingData = [
  { month: 'Sep', income: 85000,  expenses: 52000 },
  { month: 'Oct', income: 120000, expenses: 78000 },
  { month: 'Nov', income: 95000,  expenses: 61000 },
  { month: 'Dec', income: 150000, expenses: 110000 },
  { month: 'Jan', income: 105000, expenses: 68000 },
  { month: 'Feb', income: 193000, expenses: 95000 },
];

// ── USDC rate chart ─────────────────────────────────────────
export const usdtRateHistory = [
  { day: 'Feb 14', rate: 1540 },
  { day: 'Feb 15', rate: 1555 },
  { day: 'Feb 16', rate: 1548 },
  { day: 'Feb 17', rate: 1562 },
  { day: 'Feb 18', rate: 1571 },
  { day: 'Feb 19', rate: 1580 },
  { day: 'Feb 20', rate: 1590 },
];

// ── Data bundles ────────────────────────────────────────────
export const dataBundles: DataBundle[] = [
  { id: '1', network: 'MTN',     size: '500MB', validity: '1 day',   price: 100  },
  { id: '2', network: 'MTN',     size: '1GB',   validity: '7 days',  price: 300  },
  { id: '3', network: 'MTN',     size: '2GB',   validity: '30 days', price: 500  },
  { id: '4', network: 'MTN',     size: '5GB',   validity: '30 days', price: 1500 },
  { id: '5', network: 'MTN',     size: '10GB',  validity: '30 days', price: 3000 },
  { id: '6', network: 'Glo',     size: '1GB',   validity: '7 days',  price: 250  },
  { id: '7', network: 'Glo',     size: '2.9GB', validity: '30 days', price: 500  },
  { id: '8', network: 'Glo',     size: '7.7GB', validity: '30 days', price: 1500 },
  { id: '9', network: 'Airtel',  size: '1GB',   validity: '7 days',  price: 300  },
  { id: '10', network: 'Airtel', size: '3GB',   validity: '30 days', price: 1000 },
  { id: '11', network: 'Airtel', size: '5GB',   validity: '30 days', price: 1500 },
  { id: '12', network: '9mobile', size: '1GB',  validity: '30 days', price: 200  },
  { id: '13', network: '9mobile', size: '2.5GB',validity: '30 days', price: 500  },
];

// ── Bill providers ──────────────────────────────────────────
export const billProviders: BillProvider[] = [
  { id: 'ekedc',     name: 'EKEDC (Eko Electric)',  category: 'electricity' },
  { id: 'ikedc',     name: 'IKEDC (Ikeja Electric)', category: 'electricity' },
  { id: 'aedc',      name: 'AEDC (Abuja Electric)', category: 'electricity' },
  { id: 'phedc',     name: 'PHEDC (Port Harcourt)', category: 'electricity' },
  { id: 'dstv',      name: 'DSTV',                  category: 'cable'       },
  { id: 'gotv',      name: 'GOtv',                  category: 'cable'       },
  { id: 'startimes', name: 'Startimes',             category: 'cable'       },
  { id: 'lwsc',      name: 'Lagos Water Corp',      category: 'water'       },
  { id: 'fwsc',      name: 'FCT Water Board',       category: 'water'       },
];

// ── Network stats ───────────────────────────────────────────
export const networkStats = {
  tps: 1866,
  blockTime: 2.4,
  successRate: 99.7,
  usdtRate: 1590,
};

// ── Login history ───────────────────────────────────────────
export const loginHistory = [
  { id: '1', device: 'Chrome · Windows', location: 'Lagos, Nigeria',    time: '2026-02-20 09:03', current: true  },
  { id: '2', device: 'Safari · iPhone',  location: 'Lagos, Nigeria',    time: '2026-02-19 14:22', current: false },
  { id: '3', device: 'Firefox · Windows',location: 'Abuja, Nigeria',    time: '2026-02-18 10:11', current: false },
  { id: '4', device: 'Chrome · Android', location: 'Port Harcourt, NG', time: '2026-02-15 08:45', current: false },
];
