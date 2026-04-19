'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageContext';

export default function Header() {
  const { lang, changeLang, t } = useLanguage();

  return (
    <header className="border-b-4 border-swiss-black bg-swiss-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-4">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-150">
          <img src="/logo.png" alt="VeriVoice Logo" className="h-[48px] w-auto mix-blend-multiply" />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6 group">
            <Link href="/" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">Home</Link>
            <Link href="/file" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">{t('navFile')}</Link>
            <Link href="/verify" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">{t('navVerify')}</Link>
            <Link href="/dashboard" className="font-bold tracking-widest text-sm uppercase relative overflow-hidden group-hover:text-swiss-muted hover:!text-swiss-accent transition-colors duration-150">{t('navDashboard')}</Link>
          </nav>
          
          <select 
            value={lang}
            onChange={(e) => changeLang(e.target.value)}
            className="border-2 border-swiss-black bg-swiss-white font-bold uppercase text-xs px-2 py-1 outline-none cursor-pointer hover:bg-swiss-black hover:text-swiss-white transition-colors"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>
      </div>
    </header>
  );
}