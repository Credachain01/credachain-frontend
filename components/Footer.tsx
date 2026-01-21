import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Github, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#020410] pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
               <Image 
                 src="/logo-large.png" 
                 alt="Creda Chain Logo" 
                 width={150} 
                 height={40} 
                 className="object-contain h-10 w-auto"
               />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Building trust through blockchain technology for secure digital payments and verifiable transactions. Join thousands of satisfied users today.
            </p>
            <div className="space-y-2 pt-2 flex flex-col items-center md:items-start">
              <a href="mailto:support@credachain.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <Mail className="w-4 h-4" />
                support@credachain.com
              </a>
              <a href="tel:+2348001234567" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <Phone className="w-4 h-4" />
                +234 800 123 4567
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Airtime Recharge</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Data Recharge</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Utilities Payment</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Money Transfer</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">USDT to Naira</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Status</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 Creda Chain. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


