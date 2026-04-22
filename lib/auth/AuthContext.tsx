// 'use client';

// import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
// import { useRouter } from 'next/navigation';
// import type { User, Session } from '@supabase/supabase-js';
// import { supabase } from '@/lib/supabase';
// import type { Profile } from '@/lib/types/database';

// interface AuthContextType {
//   user: User | null;
//   session: Session | null;
//   profile: Profile | null;
//   loading: boolean;
//   signUp: (data: SignUpData) => Promise<{ error: string | null }>;
//   signIn: (email: string, password: string) => Promise<{ error: string | null }>;
//   signOut: () => Promise<void>;
//   refreshProfile: () => Promise<void>;
// }

// interface SignUpData {
//   fullName: string;
//   email: string;
//   phone: string;
//   password: string;
//   pin: string;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
//   return ctx;
// }

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   /* ── Fetch profile from Supabase ─────────────────────────── */
//   const fetchProfile = useCallback(async (userId: string) => {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', userId)
//       .single();

//     if (!error && data) {
//       setProfile(data as Profile);
//     }
//   }, []);

//   const refreshProfile = useCallback(async () => {
//     if (user) {
//       await fetchProfile(user.id);
//     }
//   }, [user, fetchProfile]);

//   /* ── Listen for auth state changes ───────────────────────── */
//   useEffect(() => {
//     // Get initial session
//     supabase.auth.getSession().then(({ data: { session: s } }) => {
//       setSession(s);
//       setUser(s?.user ?? null);
//       if (s?.user) {
//         fetchProfile(s.user.id);
//       }
//       setLoading(false);
//     });

//     // Subscribe to auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (_event, s) => {
//         setSession(s);
//         setUser(s?.user ?? null);
//         if (s?.user) {
//           await fetchProfile(s.user.id);
//         } else {
//           setProfile(null);
//         }
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, [fetchProfile]);

//   /* ── Sign Up ─────────────────────────────────────────────── */
//   const signUp = async (data: SignUpData): Promise<{ error: string | null }> => {
//     try {
//       // 1. Hash PIN server-side
//       const pinRes = await fetch('/api/auth/hash-pin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ pin: data.pin }),
//       });

//       if (!pinRes.ok) {
//         return { error: 'Failed to process PIN. Please try again.' };
//       }

//       const { hash: pinHash } = await pinRes.json();

//       // 2. Create auth user
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//         options: {
//           data: {
//             full_name: data.fullName,
//             phone: data.phone,
//           },
//         },
//       });

//       if (authError) return { error: authError.message };
//       if (!authData.user) return { error: 'Signup succeeded but no user returned.' };

//       const userId = authData.user.id;

//       // 3. Create profile
//       const { error: profileError } = await supabase.from('profiles').insert({
//         id: userId,
//         full_name: data.fullName,
//         email: data.email,
//         phone: data.phone,
//         pin_hash: pinHash,
//       });

//       if (profileError) return { error: profileError.message };

//       // 4. Create NGN + USDT wallets
//       const walletAddress = () =>
//         '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

//       const { error: walletError } = await supabase.from('wallets').insert([
//         { user_id: userId, currency: 'NGN', balance: 0, wallet_address: walletAddress() },
//         { user_id: userId, currency: 'USDT', balance: 0, wallet_address: walletAddress() },
//       ]);

//       if (walletError) return { error: walletError.message };

//       return { error: null };
//     } catch {
//       return { error: 'An unexpected error occurred during signup.' };
//     }
//   };

//   /* ── Sign In ─────────────────────────────────────────────── */
//   const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) return { error: error.message };
//     return { error: null };
//   };

//   /* ── Sign Out ────────────────────────────────────────────── */
//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setSession(null);
//     setProfile(null);
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


