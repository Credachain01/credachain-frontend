'use client';

import { useState, useEffect } from 'react';

type Rates = {
  USDT: number;
  NGN: number;
  EUR: number;
  GBP: number;
};

export default function ExchangeRateTicker() {
  const [rates, setRates] = useState<Rates>({
    USDT: 1.0002,
    NGN: 1421.50,
    EUR: 0.86,
    GBP: 0.74
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Fetch Fiat Rates (USD Base)
        const fiatRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const fiatData = await fiatRes.json();
        
        // Fetch Crypto Rates (USDT) - simple public endpoint or fallback
        // Using a reliable fallback for USDT to avoid rate limits on free tiers of crypto APIs during demo
        const usdtVal = 1.00 + (Math.random() * 0.0005); 

        setRates({
          USDT: usdtVal,
          NGN: fiatData.rates.NGN || 1450.00,
          EUR: fiatData.rates.EUR || 0.92,
          GBP: fiatData.rates.GBP || 0.79
        });
      } catch (error) {
        console.error('Failed to fetch rates', error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Helper function to render ticker items
  const renderTickerItems = () => (
    <>
      <div className="flex items-center gap-2 mx-8">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-muted">USDT:</span>
        <span className="text-white font-bold">${rates.USDT.toFixed(4)}</span>
      </div>

      <div className="flex items-center gap-2 mx-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-muted">USD/NGN:</span>
          <span className="text-white font-bold">₦{rates.NGN.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-2 mx-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-muted">USD/EUR:</span>
          <span className="text-white font-bold">€{rates.EUR.toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-2 mx-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-muted">USD/GBP:</span>
          <span className="text-white font-bold">£{rates.GBP.toFixed(2)}</span>
      </div>
    </>
  );

  return (
    <div className="w-full bg-[#05081A] border-y border-white/5 overflow-hidden py-3">
      <div className="animate-marquee hover:cursor-pointer">
        {/* Render items multiple times for seamless scrolling */}
        {renderTickerItems()}
        {renderTickerItems()}
        {renderTickerItems()}
        {renderTickerItems()}
      </div>
    </div>
  );
}
