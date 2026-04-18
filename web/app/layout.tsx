import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { LanguageProvider } from '@/components/LanguageContext';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '700', '900'] });

export const metadata: Metadata = {
  title: 'VeriVoice | Tamper-Proof Civic Grievances',
  description: 'AI-powered, blockchain-anchored platform for civic complaints',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen flex flex-col swiss-noise`}>
        <LanguageProvider>
          <Header />

          <main className="flex-grow z-20">
            {children}
          </main>

          <footer className="border-t-4 border-swiss-black bg-swiss-muted p-12 lg:p-24 mt-auto">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-l-4 border-swiss-black pl-8">
            <div>
               <h3 className="text-2xl mb-4 text-swiss-accent tracking-tighter">01. SYSTEM</h3>
               <p className="text-sm font-medium tracking-wide">Tamper-proof infrastructure. Powered by Ethereum Sepolia Testnet & Firebase.</p>
            </div>
            <div>
               <h3 className="text-2xl mb-4 text-swiss-accent tracking-tighter">02. METHOD</h3>
               <p className="text-sm font-medium tracking-wide">AI-Classified complaints. SHA-256 client-side hashing preventing bureaucratic suppression.</p>
            </div>
            <div>
               <h3 className="text-2xl mb-4 text-swiss-accent tracking-tighter">03. LINKS</h3>
               <ul className="space-y-2 text-sm font-bold uppercase tracking-widest">
                 <li><Link href="/verify" className="hover:text-swiss-accent transition-colors">Verify Hash</Link></li>
                 <li><Link href="/dashboard" className="hover:text-swiss-accent transition-colors">Dashboard</Link></li>
                 <li><Link href="/official/login" className="hover:text-swiss-accent transition-colors">Official Portal</Link></li>
               </ul>
            </div>
            <div className="flex flex-col justify-between items-start">
               <img src="/logo.png" alt="VeriVoice Logo" className="w-[128px] opacity-70 hover:opacity-100 transition-opacity duration-300 mix-blend-multiply" />
               <p className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 mt-4">2026 © VERIVOICE</p>
            </div>
          </div>
        </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
