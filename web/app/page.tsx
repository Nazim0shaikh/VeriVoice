'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Volume2, Database, TrendingUp, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/components/LanguageContext';

const AnimatedIndianMap = dynamic(() => import('@/components/AnimatedIndianMap'), { ssr: false });

export default function LandingPage() {
  const { t } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      setProgress(100);
    }
  }, [mapLoaded]);

  return (
    <>
      {/* Full Page Loader */}
      <div 
        className={`fixed inset-0 z-50 bg-swiss-white flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
          progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-swiss-black mb-8 animate-pulse">
          Initializing Nodes...
        </h2>
        <div className="w-64 md:w-96 h-6 border-4 border-swiss-black p-1 bg-swiss-muted overflow-hidden relative">
           <div 
             className="h-full bg-swiss-accent transition-all duration-300 ease-out" 
             style={{ width: `${progress}%` }}
           ></div>
        </div>
        <p className="mt-4 font-bold uppercase tracking-widest text-swiss-black/50 text-sm">
          {progress}% LOADED
        </p>
      </div>

      <div className={`flex flex-col transition-opacity duration-700 delay-300 ease-in ${progress === 100 ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        {/* Hero Section */}
        <section className="bg-swiss-white border-b-8 border-swiss-black min-h-[90vh] flex items-center relative overflow-hidden">
          {/* Animated Background Map */}
          <AnimatedIndianMap onLoaded={() => setMapLoaded(true)} />
          
          {/* Background Dot Pattern (Overlay above Map) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(#000 2px, transparent 2px)", backgroundSize: "32px 32px" }}></div>
        
        {/* Foreground Content */}
        <div className="max-w-[1440px] w-full px-6 mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-center pointer-events-none">
          <div className="flex-1 max-w-3xl pointer-events-auto">
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-8 text-swiss-black">
              {t('heroVoice')} <br />
              <span className="text-swiss-accent shadow-[8px_8px_0px_#050505] bg-swiss-black px-4 inline-block transform -rotate-2">{t('heroImmutable')}</span>
            </h1>
            <p className="text-2xl md:text-3xl font-medium tracking-tight mb-12 border-l-8 border-swiss-black pl-6 text-swiss-black">
              {t('heroDesc')}
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/file" className="btn-swiss-primary text-xl px-12 py-6 flex items-center justify-center gap-4 group">
                {t('btnFile')} 
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/dashboard" className="px-12 py-6 border-4 border-swiss-black font-black uppercase tracking-widest text-xl hover:bg-swiss-black hover:text-swiss-white transition-colors duration-150 bg-swiss-white shadow-[4px_4px_0px_#050505]">
                {t('btnDashboard')}
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:block"></div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section className="bg-swiss-white py-24 px-6 border-b-8 border-swiss-black">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-16 text-swiss-black border-l-8 border-swiss-accent pl-8">
            The Problems <br/> We Fix.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-4">1. Literacy Barriers</h3>
              <p className="font-medium text-lg">Millions cannot write formal complaints. Our multilingual AI voice engine allows anyone to simply speak their grievance in their native tongue.</p>
            </div>
            
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-4">2. Zero Transparency</h3>
              <p className="font-medium text-lg">Citizens never know if the government is actually working on their issue. The public ledger makes all civic delays visible to everyone.</p>
            </div>
            
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-3xl font-black uppercase tracking-widest mb-4">3. Corrupt Officials</h3>
              <p className="font-medium text-lg">Local politicians can easily delete database records to hide their failures. Blockchain immutability means a complaint can NEVER be erased.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="bg-swiss-black text-swiss-white py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-center mb-24">
            {t('worksTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-4 border-swiss-white/20 p-8 hover:border-swiss-accent transition-colors bg-swiss-white/5">
              <Volume2 className="w-16 h-16 mb-8 text-swiss-accent" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">1. Dictate or Type</h3>
              <p className="text-swiss-white/70 font-medium">Citizens report issues via text or voice. Multilingual support powered by AI ensures no one is silenced by language barriers.</p>
            </div>
            
            <div className="border-4 border-swiss-white/20 p-8 hover:border-swiss-accent transition-colors bg-swiss-white/5">
              <Database className="w-16 h-16 mb-8 text-swiss-accent" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">2. Hash & Store</h3>
              <p className="text-swiss-white/70 font-medium">The complaint text is instantly converted to a SHA-256 hash. The raw data goes to a write-only database. No deletions.</p>
            </div>

            <div className="border-4 border-swiss-white/20 p-8 hover:border-swiss-accent transition-colors bg-swiss-white/5">
              <Shield className="w-16 h-16 mb-8 text-swiss-accent" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">3. Ledger Anchor</h3>
              <p className="text-swiss-white/70 font-medium">The hash is sent to a custom Sepolia Smart Contract. It acts as an eternal digital notary verifying the exact text submitted at that time.</p>
            </div>

            <div className="border-4 border-swiss-white/20 p-8 hover:border-swiss-accent transition-colors bg-swiss-white/5">
              <TrendingUp className="w-16 h-16 mb-8 text-swiss-accent" />
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">4. AI Sorting</h3>
              <p className="text-swiss-white/70 font-medium">An integrated Open-Source Z-AI Engine instantly reads the complaint, detects the severity, predicts duplicates, and routes it to the proper department.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planned Advancements Section */}
      <section className="bg-swiss-white py-24 px-6 border-b-8 border-swiss-black">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-16 text-swiss-black border-l-8 border-swiss-accent pl-8">
            The Future <br/> Roadmap.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted/30 hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Multi-Chain Nodes</h3>
              <p className="font-medium">Spreading complaint hashes across independent blockchain networks (Ethereum + Polygon) so no single entity controls the public record.</p>
            </div>
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted/30 hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Zero-Knowledge Identity</h3>
              <p className="font-medium">Allowing citizens to cryptographically prove they filed a specific grievance without ever revealing their personal identity using zk-SNARKs.</p>
            </div>
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted/30 hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">SMS / WhatsApp Filing</h3>
              <p className="font-medium">Integrating Twilio API so citizens without smartphones or internet access can file blockchain complaints entirely via offline SMS.</p>
            </div>
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted/30 hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Automated NGO Backups</h3>
              <p className="font-medium">Daily encrypted synchronization of civic data directly to partner NGO servers as a secondary layer of democratic data resilience.</p>
            </div>
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted/30 hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Government SLAs</h3>
              <p className="font-medium">Automated blockchain escalations and transparent penalty tracking when departments breach their committed response times.</p>
            </div>
            <div className="p-8 border-4 border-swiss-black bg-swiss-muted/30 hover:bg-swiss-accent hover:text-swiss-white transition-colors group">
              <h3 className="text-2xl font-black uppercase tracking-widest mb-4">Hyperledger Scale</h3>
              <p className="font-medium">Deploying on enterprise-grade Hyperledger Fabric for strict deployments where local regulations mandate managed private blockchains.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verify Section */}
      <section className="py-24 px-6 bg-swiss-muted swiss-diagonal border-t-8 border-swiss-black">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 bg-swiss-black text-swiss-white inline-block px-8 py-4 -rotate-1 border-4 border-swiss-black">
            {t('verifyTitle')}
          </h2>
          <p className="text-2xl font-medium max-w-3xl mx-auto mb-12 uppercase tracking-widest">
            {t('verifyDesc')}
          </p>
          <Link href="/verify" className="btn-swiss-primary text-2xl px-16 py-8 inline-flex">
            {t('btnVerify')}
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}


