'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { useAppStore } from '@/lib/store';
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  ArrowRight, Loader2, ShieldCheck,
} from 'lucide-react';

export default function SignupPage() {
  const { signUp } = useAuth();
  const addToast = useAppStore((s) => s.addToast);
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── PIN input handling ────────────────────────────────── */
  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[index] = value.slice(-1);
    setPin(next);
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  /* ── Submit ────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pinStr = pin.join('');
    if (pinStr.length !== 4) {
      addToast('Please enter a complete 4-digit PIN.', 'warning');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    setLoading(true);

    const { error } = await signUp({
      fullName,
      email,
      phone,
      password,
      pin: pinStr,
    });

    if (error) {
      addToast(error, 'error');
      setLoading(false);
      return;
    }

    addToast('Account created successfully! Welcome to CredaChain.', 'success');
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Link href="/">
          <Image src="/logo-large.png" alt="CredaChain" width={180} height={46} className="object-contain h-10 w-auto" />
        </Link>
      </div>

      {/* Card */}
      <div className="bg-[#111D2E] rounded-2xl border border-white/5 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-slate-400 mt-1">Join CredaChain and start transacting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Emeka Okonkwo"
                className="w-full pl-10 pr-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 focus:border-[#4169E1]/50 transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 focus:border-[#4169E1]/50 transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                className="w-full pl-10 pr-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 focus:border-[#4169E1]/50 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-12 py-3 bg-[#0D1B2A] border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/50 focus:border-[#4169E1]/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 4-digit PIN */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#22C55E]" />
              Transaction PIN (4 digits)
            </label>
            <div className="flex gap-3 justify-center">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { pinRefs.current[i] = el; }}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  className="w-14 h-14 text-center text-xl font-bold bg-[#0D1B2A] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E]/50 transition"
                />
              ))}
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-1.5">
              This PIN secures your transactions
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-white bg-[#22C55E] hover:bg-[#16A34A] rounded-xl transition-all shadow-lg shadow-[#22C55E]/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4169E1] hover:text-[#5A82F5] font-semibold transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
