'use client';

import { useEffect, useState, useRef } from 'react';

const stats = [
  { label: 'Active Users', value: 87000, suffix: 'k+', display: '87' },
  { label: 'Processed', value: 15000000000, suffix: 'B+', prefix: '₦', display: '15' },
  { label: 'TPS Speed', value: 3500, suffix: 'k', display: '3.5' },
];

function Counter({ from, to, duration, prefix = '', suffix = '', decimals = 0 }: { from: number, to: number, duration: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    
    // Easing function for smooth animation
    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Apply easing function
      const easedProgress = easeOutQuart(progress);
      const current = from + (to - from) * easedProgress;
      setCount(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, from, to, duration]);

  return (
    <span ref={nodeRef} className="font-bold text-4xl text-white">
      {prefix}{Number(count).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-[#0A0F2D] border-t border-white/5 relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 lg:divide-x divide-white/10 text-center">
          
          <div className="flex flex-col items-center p-4">
             <Counter from={0} to={87500} duration={2} decimals={0} />
             <p className="text-muted mt-2 text-lg">Active Users</p>
          </div>

          <div className="flex flex-col items-center p-4">
             <Counter from={0} to={2.1} duration={2} suffix="M" decimals={1} />
             <p className="text-muted mt-2 text-lg">Transactions</p>
          </div>

          <div className="flex flex-col items-center p-4">
             <Counter from={0} to={99.8} duration={2} suffix="%" decimals={1} />
             <p className="text-muted mt-2 text-lg">Success Rate</p>
          </div>

          <div className="flex flex-col items-center p-4">
             <Counter from={0} to={15.2} duration={2} prefix="₦" suffix="B" decimals={1} />
             <p className="text-muted mt-2 text-lg">Total Processed</p>
          </div>

        </div>
      </div>
    </section>
  );
}
