'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { lang, changeLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b-4 border-swiss-black bg-swiss-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto flex flex-row items-center justify-between p-4 md:p-6 gap-4">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-150">
          <img src="/logo.png" alt="VeriVoice Logo" className="h-[32px] md:h-[48px] w-auto mix-blend-multiply" />
        </Link>
        <div className="flex items-center gap-2 md:gap-6">
          <nav className="hidden md:flex gap-6 group">
            <Link href="/" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">Home</Link>
            <Link href="/file" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">{t('navFile')}</Link>
            <Link href="/verify" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">{t('navVerify')}</Link>
            <Link href="/dashboard" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">{t('navDashboard')}</Link>
          </nav>
          
          <select 
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            className="border-2 border-swiss-black bg-swiss-white font-bold uppercase text-[10px] md:text-xs px-2 py-1 md:py-2 outline-none cursor-pointer hover:bg-swiss-black hover:text-swiss-white transition-colors"
          >
            <option value="en">EN</option>
            <option value="hi">HIN</option>
            <option value="mr">MAR</option>
            <option value="bn">BEN</option>
            <option value="ta">TAM</option>
            <option value="te">TEL</option>
          </select>

          <button 
            className="md:hidden flex items-center justify-center p-2 border-2 border-swiss-black hover:bg-swiss-black hover:text-swiss-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col border-t-4 border-swiss-black bg-swiss-white">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-bold tracking-widest text-sm uppercase px-6 py-4 border-b-2 border-swiss-black hover:bg-swiss-accent hover:text-swiss-white transition-colors flex justify-between items-center">
            Home <span className="text-swiss-accent/50 text-xl font-black">›</span>
          </Link>
          <Link href="/file" onClick={() => setMobileMenuOpen(false)} className="font-bold tracking-widest text-sm uppercase px-6 py-4 border-b-2 border-swiss-black hover:bg-swiss-accent hover:text-swiss-white transition-colors flex justify-between items-center">
            File <span className="text-swiss-accent/50 text-xl font-black">›</span>
          </Link>
          <Link href="/verify" onClick={() => setMobileMenuOpen(false)} className="font-bold tracking-widest text-sm uppercase px-6 py-4 border-b-2 border-swiss-black hover:bg-swiss-accent hover:text-swiss-white transition-colors flex justify-between items-center">
            Verify <span className="text-swiss-accent/50 text-xl font-black">›</span>
          </Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-bold tracking-widest text-sm uppercase px-6 py-4 hover:bg-swiss-accent hover:text-swiss-white transition-colors flex justify-between items-center">
            Dashboard <span className="text-swiss-accent/50 text-xl font-black">›</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
