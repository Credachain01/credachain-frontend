'use client';

import { useState } from 'react';
import { Shield, Smartphone, Monitor, Trash2, LogOut, Lock, CheckCircle } from 'lucide-react';
import { loginHistory } from '@/lib/mock-data';
import { useAppStore } from '@/lib/store';

export default function SecurityPage() {
  const { addToast } = useAppStore();
  const [twoFA, setTwoFA]   = useState(false);
  const [sessions] = useState(loginHistory);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Security</h2>

      {/* 2FA */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4169E1]/10 flex items-center justify-center">
              <Smartphone size={18} className="text-[#4169E1]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Two-Factor Authentication</p>
              <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button
            onClick={() => {
              setTwoFA((v) => !v);
              addToast(`2FA ${!twoFA ? 'enabled' : 'disabled'}`, !twoFA ? 'success' : 'warning');
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${twoFA ? 'bg-[#22C55E]' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${twoFA ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
        {twoFA && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
            <CheckCircle size={12} className="inline mr-1" />
            2FA is active. You&apos;ll be prompted on each login.
          </div>
        )}
      </div>

      {/* Login History */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor size={16} className="text-[#4169E1]" />
          <p className="text-sm font-semibold text-slate-700">Login History</p>
        </div>
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${s.current ? 'bg-green-100' : 'bg-slate-100'}`}>
                <Monitor size={15} className={s.current ? 'text-[#22C55E]' : 'text-slate-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-700 truncate">{s.device}</p>
                  {s.current && <span className="flex-shrink-0 text-[9px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full font-bold">Current</span>}
                </div>
                <p className="text-[10px] text-slate-400">{s.location} · {s.time}</p>
              </div>
              {!s.current && (
                <button
                  onClick={() => addToast('Session revoked', 'warning')}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition"
                >
                  <LogOut size={12} className="text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#4169E1]" />
            <p className="text-sm font-semibold text-slate-700">Active Sessions</p>
          </div>
          <button
            onClick={() => addToast('All other sessions terminated', 'warning')}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            Revoke All
          </button>
        </div>
        <div className="space-y-2">
          {sessions.filter((s) => !s.current).map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Monitor size={14} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{s.device}</p>
                <p className="text-[10px] text-slate-400">{s.location}</p>
              </div>
              <button
                onClick={() => addToast('Session revoked', 'warning')}
                className="flex-shrink-0"
              >
                <Trash2 size={13} className="text-red-400 hover:text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PIN Change shortcut */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4169E1]/10 flex items-center justify-center flex-shrink-0">
            <Lock size={18} className="text-[#4169E1]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">Transaction PIN</p>
            <p className="text-xs text-slate-400">Change your 4-digit transaction PIN</p>
          </div>
          <a href="/dashboard/settings" className="text-xs font-bold text-[#4169E1] hover:underline flex-shrink-0">Change →</a>
        </div>
      </div>
    </div>
  );
}
