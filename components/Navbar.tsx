import Link from 'next/link';
import Image from 'next/image';
import WalletConnectButton from '@/components/wallet/WalletConnectButton';

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

      <WalletConnectButton />
    </nav>
  );
}
