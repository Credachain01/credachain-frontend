import Link from 'next/link';
import Image from 'next/image';
import { Wallet } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-opacity-80 bg-[#0A0F2D]/80 border-b border-white/5">
      <div className="flex items-center gap-2">
         {/* Logo */}
         <Image 
           src="/logo-large.png" 
           alt="Creda Chain Logo" 
           width={180} 
           height={50} 
           className="object-contain h-12 w-auto"
         />
      </div>

      <div className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</Link>
        <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</Link>
        <Link href="#services" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Services</Link>
        <Link href="#about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</Link>
      </div>

      <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all backdrop-blur-md">
        <svg width="20" height="20" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
           <path opacity="0.994" fillRule="evenodd" clipRule="evenodd" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm262.2-125.6c-2.4 2.4-5.7 3.8-9.2 3.8H0.3c-5.8 0-8.7-7-4.6-11.1l62.7-62.7c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7zM64.6 0.8c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 0.8z" fill="url(#paint0_linear)"/>
           <defs>
              <linearGradient id="paint0_linear" x1="57.8" y1="67.5" x2="340.2" y2="242.5" gradientUnits="userSpaceOnUse">
                 <stop stopColor="#9945FF"/>
                 <stop offset="1" stopColor="#14F195"/>
              </linearGradient>
           </defs>
        </svg>
        Launch App
      </button>
    </nav>
  );
}
