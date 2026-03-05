// lib/store.ts
import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppState {
  // Wallet (dynamic from Supabase)
  nairaBalance: number;
  usdtBalance: number;
  usdtRate: number;

  // User profile
  userFullName: string;
  userEmail: string;

  // UI
  sidebarOpen: boolean;
  darkMode: boolean;
  toasts: Toast[];

  // Actions
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  setUsdtRate: (rate: number) => void;
  setNairaBalance: (balance: number) => void;
  setUsdtBalance: (balance: number) => void;
  setUserProfile: (name: string, email: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  nairaBalance: 0,
  usdtBalance: 0,
  usdtRate: 1590,

  userFullName: '',
  userEmail: '',

  sidebarOpen: true,
  darkMode: false,
  toasts: [],

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  addToast: (message, type) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id: Date.now().toString(), message, type },
      ],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setUsdtRate: (rate) => set({ usdtRate: rate }),
  setNairaBalance: (balance) => set({ nairaBalance: balance }),
  setUsdtBalance: (balance) => set({ usdtBalance: balance }),
  setUserProfile: (name, email) => set({ userFullName: name, userEmail: email }),
}));
