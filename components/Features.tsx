'use client';

import { Shield, Zap, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Features() {
  const [barHeights, setBarHeights] = useState([35, 55, 40, 70, 45, 60, 50, 80, 75, 55, 40, 90, 65, 45, 25]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBarHeights(prev => prev.map(() => Math.random() * 60 + 30));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-24 bg-[#0A0F2D] relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Text Content */}
            <div className="space-y-10">
                <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Why Choose <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Creda Chain?</span>
                    </h2>
                    <p className="text-muted text-lg max-w-lg leading-relaxed">
                        Built on blockchain technology for unparalleled security and reliability. Experience the future of payments today.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Feature 1 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-green-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Blockchain Security</h3>
                            <p className="text-muted leading-relaxed">Immutable transaction records prevent fraud and double spending.</p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                             <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
                            <p className="text-muted leading-relaxed">Process thousands of transactions per second with optimized architecture.</p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                             <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Dual Currency Support</h3>
                            <p className="text-muted leading-relaxed">Accept payments in Nigerian Naira and USDT with auto conversion.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Network Stats Card */}
            <div className="relative">
                <div className="w-full bg-[#1A1F3E]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
                    
                    {/* Status Row */}
                    <div className="bg-[#05081A]/50 rounded-xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
                            <span className="text-gray-400 font-mono text-sm">Network Status</span>
                        </div>
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 uppercase tracking-wider">Operational</span>
                    </div>

                    {/* TPS Row */}
                    <div className="bg-[#05081A]/50 rounded-xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-slow" />
                            <span className="text-gray-400 font-mono text-sm">Current TPS</span>
                        </div>
                        <span className="text-white font-mono font-bold">1,866</span>
                    </div>

                    {/* Block Time Row */}
                    <div className="bg-[#05081A]/50 rounded-xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-slow" />
                            <span className="text-gray-400 font-mono text-sm">Block Time</span>
                        </div>
                        <span className="text-white font-mono font-bold">~2.4s</span>
                    </div>

                    {/* Animated Bar Chart Visualization */}
                    <div className="pt-8 h-40 flex items-end justify-between gap-2 opacity-80">
                        {barHeights.map((h, i) => (
                             <div 
                                key={i} 
                                className="w-full rounded-t-sm bg-gradient-to-t from-purple-900/50 to-purple-500/50 transition-all duration-[2000ms] ease-in-out"
                                style={{ height: `${h}%`}}
                             />
                        ))}
                    </div>

                </div>
            </div>

        </div>
      </div>
    </section>
  );
}

