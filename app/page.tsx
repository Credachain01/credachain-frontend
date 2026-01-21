import Hero from '@/components/Hero';
import ExchangeRateTicker from '@/components/ExchangeRateTicker';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <ExchangeRateTicker />
      <Services />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </>
  );
}
