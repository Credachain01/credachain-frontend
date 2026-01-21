'use client';

import Image from 'next/image';
import { ArrowRight, ChevronRight, Zap, RefreshCw, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [exchangeRate, setExchangeRate] = useState(1421.50);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        setExchangeRate(data.rates.NGN || 1421.50);
      } catch (error) {
        console.error('Failed to fetch exchange rate', error);
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden bg-[#0A0F2D]">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[120px]" />
         <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] bg-primary-dark/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start items-center px-6 md:px-12">
        {/* Left Content */}
        <div className="space-y-8 lg:max-w-none">
          
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
            Revolutionizing <br/>
            Payments with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Blockchain Technology</span>.
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-muted leading-relaxed max-w-2xl">
            Creda Chain eliminates failed payments, double transactions, and slow refunds with our secure blockchain infrastructure. Support for Naira and USDT payments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white bg-primary hover:bg-primary-dark rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(65,105,225,0.3)] hover:shadow-[0_0_30px_rgba(65,105,225,0.5)]">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-all backdrop-blur-sm">
              Learn More
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Right Visual */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px] aspect-[4/5] animate-float"> 
            {/* Floating Notification 1 - Transfer Success (Top Left) */}
            <div className="absolute -left-6 top-16 lg:-left-24 lg:top-32 animate-float-delayed z-20 scale-[0.6] lg:scale-100 origin-bottom-right">
              <div className="backdrop-blur-xl bg-[#1A1F3E]/90 border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Transfer Success</p>
                    <p className="text-white font-bold">+ ₦50,000.00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Notification 2 - Exchange Rate (Bottom Right) */}
            <div className="absolute -right-6 bottom-24 lg:-right-20 lg:bottom-40 animate-float z-20 scale-[0.6] lg:scale-100 origin-top-left">
              <div className="backdrop-blur-xl bg-[#1A1F3E]/90 border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Exchange Rate</p>
                    <p className="text-white font-bold">1 USDT = ₦{exchangeRate.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Notification 3 - Data Recharge (Top Right) */}
            <div className="absolute -right-2 top-8 lg:-right-12 lg:top-16 animate-float-slow z-20 scale-[0.6] lg:scale-100 origin-bottom-left">
              <div className="backdrop-blur-xl bg-[#1A1F3E]/90 border border-white/20 rounded-2xl p-4 shadow-2xl min-w-[200px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">MTN Data</p>
                    <p className="text-white font-bold">25GB Successful</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <Image 
              src="/mockups/hero-phone-updated.png" 
              alt="Creda Chain App Interface" 
              width={600} 
              height={800}
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

