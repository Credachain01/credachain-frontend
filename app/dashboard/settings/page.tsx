'use client';

import { useState } from 'react';
import { User, Phone, Mail, Building2, Bell, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const { addToast } = useAppStore();
  const [name, setName]    = useState('John Doe');
  const [email, setEmail]  = useState('john@credachain.com');
  const [phone, setPhone]  = useState('08012345678');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [notifications, setNotifications] = useState({
    transactions: true, promotions: false, security: true,
  });

  const saveProfile = () => addToast('Profile updated successfully!', 'success');
  const changePin   = () => {
    if (oldPin.length < 4 || newPin.length < 4) return addToast('PINs must be 4 digits', 'warning');
    addToast('PIN changed successfully!', 'success');
    setOldPin(''); setNewPin('');
  };

  const kycSteps = [
    { label: 'Email Verified',   done: true  },
    { label: 'Phone Verified',   done: true  },
    { label: 'BVN Linked',       done: true  },
    { label: 'ID Verification',  done: false },
    { label: 'Address Proof',    done: false },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Settings</h2>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-[#4169E1]" />
          <p className="text-sm font-semibold text-slate-700">Profile Information</p>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Full Name', value: name, onChange: setName, icon: User },
            { label: 'Email Address', value: email, onChange: setEmail, icon: Mail },
            { label: 'Phone Number', value: phone, onChange: setPhone, icon: Phone },
          ].map(({ label, value, onChange, icon: Icon }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">{label}</label>
              <div className="relative">
                <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700"
                />
              </div>
            </div>
          ))}
          <button onClick={saveProfile} className="mt-2 w-full py-2.5 bg-[#4169E1] hover:bg-[#2A4FCF] text-white font-bold rounded-xl text-sm transition">
            Save Profile
          </button>
        </div>
      </div>

      {/* Change PIN */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#4169E1]" />
            <p className="text-sm font-semibold text-slate-700">Change Transaction PIN</p>
          </div>
          <button onClick={() => setShowPin(!showPin)} className="text-slate-400 hover:text-slate-600">
            {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Current PIN', val: oldPin, set: setOldPin },
            { label: 'New PIN',     val: newPin, set: setNewPin },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">{label}</label>
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 text-slate-700 text-center text-lg tracking-widest"
              />
            </div>
          ))}
          <button onClick={changePin} className="w-full py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold rounded-xl text-sm transition">
            Update PIN
          </button>
        </div>
      </div>

      {/* Linked Bank Accounts */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#4169E1]" />
            <p className="text-sm font-semibold text-slate-700">Linked Bank Accounts</p>
          </div>
          <button onClick={() => addToast('Bank linking coming soon', 'info')} className="text-xs font-bold text-[#4169E1] hover:underline">+ Add Bank</button>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">A</div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Access Bank</p>
            <p className="text-xs text-slate-500">****6789 · John Doe</p>
          </div>
          <CheckCircle size={15} className="text-[#22C55E] ml-auto" />
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={16} className="text-[#4169E1]" />
          <p className="text-sm font-semibold text-slate-700">Notification Preferences</p>
        </div>
        {Object.entries(notifications).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
            <div>
              <p className="text-sm font-medium text-slate-700 capitalize">{key}</p>
              <p className="text-xs text-slate-400">Receive {key} alerts via email & SMS</p>
            </div>
            <button
              onClick={() => { setNotifications((n) => ({ ...n, [key]: !val })); addToast(`${key} notifications ${!val ? 'enabled' : 'disabled'}`, 'info'); }}
              className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-[#22C55E]' : 'bg-slate-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* KYC Status */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} className="text-[#4169E1]" />
          <p className="text-sm font-semibold text-slate-700">KYC Status</p>
          <span className="ml-auto text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-bold">In Progress</span>
        </div>
        <div className="space-y-2">
          {kycSteps.map(({ label, done }) => (
            <div key={label} className="flex items-center gap-3 py-1.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-[#22C55E]' : 'bg-slate-200'}`}>
                {done && <CheckCircle size={12} className="text-white" />}
              </div>
              <span className={`text-sm ${done ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => addToast('KYC verification coming soon', 'info')} className="mt-4 w-full py-2.5 border border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1]/5 font-bold rounded-xl text-sm transition">
          Complete KYC
        </button>
      </div>
    </div>
  );
}
