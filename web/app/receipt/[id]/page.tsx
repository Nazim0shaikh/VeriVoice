'use client';

import { useEffect, useState, useRef } from 'react';
import { notFound } from 'next/navigation';
import { getEtherscanLink } from '@/lib/blockchain';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Share2, Check, Printer } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // In a real app we'd fetch securely on the server via Server Component and prop-drill it, 
  // but to immediately enable interactive downloading, we will just fetch it directly from the client.
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, 'COMPLAINTS', params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [params.id]);

  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://verivoice.vercel.app'}/verify?id=${params.id}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'VeriVoice Receipt',
          text: `Check out my cryptographically secured VeriVoice complaint receipt: ${params.id}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.log('Share failed or was cancelled');
    }
  };

  const handleDownloadPdf = () => {
    // Uses the browser's native print engine to allow "Save as PDF".
    // This perfectly preserves text selection, links, layout, and font vectors.
    window.print();
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center font-black uppercase text-2xl tracking-widest text-swiss-black animate-pulse">Loading Record...</div>;
  }

  if (!data) {
    return <div className="min-h-[60vh] flex items-center justify-center font-black uppercase text-4xl text-red-600">404: Record Not Found.</div>;
  }

  return (
    <div className="flex flex-col max-w-[1440px] mx-auto px-6 md:px-8 py-12 lg:py-24 print:py-0 print:bg-white text-swiss-black">
      <div className="mb-12 border-b-4 border-swiss-black pb-8 print:mb-6 print:pb-4">
        <h1 className="text-6xl md:text-8xl font-black uppercase text-green-600 mb-4 tracking-tighter print:text-black">
          Secured.
        </h1>
        <p className="text-2xl font-bold tracking-widest uppercase">
          Case <span className="text-swiss-accent print:text-black">{params.id}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 print:block">
        <div className="lg:col-span-8 flex flex-col gap-8 print:gap-4" ref={receiptRef}>
          
          <div className="border-4 border-swiss-black p-8 md:p-12 relative overflow-hidden bg-swiss-muted swiss-grid-pattern print:bg-white print:p-6 text-black print:color-exact" style={{ WebkitPrintColorAdjust: 'exact' }}>
            <div className="absolute -top-4 -right-4 w-48 h-48 bg-swiss-black rounded-full opacity-5 pointer-events-none print:hidden"></div>
            
            <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-swiss-black pb-4 inline-block print:mb-4">
              Cryptographic Proof
            </h2>
            
            <div className="bg-swiss-white border-2 border-swiss-black p-6 mb-8 overflow-x-auto print:mb-4 print:p-4">
              <label className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 block mb-2">SHA-256 HASH</label>
              <code className="text-sm md:text-base font-mono text-swiss-accent print:text-black break-all select-all">{data?.hash}</code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-swiss-white border-2 border-swiss-black p-6 print:gap-4 print:p-4">
               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 block mb-2">BLOCKCHAIN TRANSACTION</label>
                  {data?.blockchainTx ? (
                    <a href={getEtherscanLink(data.blockchainTx)} target="_blank" rel="noreferrer" className="text-sm font-bold truncate block text-blue-600 hover:text-swiss-accent underline select-all print:text-black">
                      {data.blockchainTx}
                    </a>
                  ) : (
                    <span className="text-sm font-bold text-amber-600">Pending Block Confirmation...</span>
                  )}
               </div>
               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 block mb-2">TIMESTAMP</label>
                  <span className="text-sm font-bold">{data?.timestamp?.toDate().toLocaleString() || 'Just now'}</span>
               </div>
            </div>
          </div>

          <div className="border-4 border-swiss-black p-8 md:p-12 print:p-6 print:mt-8">
             <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-swiss-black">
               <h3 className="text-2xl font-black uppercase tracking-tighter">AI Analysis</h3>
               <span className={`px-4 py-2 font-bold uppercase tracking-widest text-xs border-2 border-swiss-black select-none print:text-black print:border-black ${data?.severity === 5 ? 'bg-red-600 text-white' : 'bg-swiss-muted'}`} style={{ WebkitPrintColorAdjust: 'exact' }}>
                 Level {data?.severity}
               </span>
             </div>
             
             <div className="text-xl font-medium border-l-4 border-swiss-accent pl-6 mb-8 text-swiss-black/80 print:border-black">
               {data?.summary}
             </div>

             <div className="flex gap-4">
                <span className="bg-swiss-black text-swiss-white font-bold uppercase text-xs tracking-widest px-4 py-2 print:text-black print:bg-white print:border-2 print:border-black">
                  {data?.category}
                </span>
                <span className="bg-swiss-muted border-2 border-swiss-black text-swiss-black font-bold uppercase text-xs tracking-widest px-4 py-2 print:bg-white">
                  {data?.department}
                </span>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 print:hidden">
          <div className="border-4 border-swiss-black p-8 bg-swiss-white sticky top-32 flex flex-col items-center text-center">
             <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b-4 border-swiss-black w-full pb-4">Verification Tag</h3>
             
             <div className="border-4 border-swiss-black p-4 mb-8 bg-white max-w-fit">
                <QRCodeSVG value={verifyUrl} size={180} level="H" fgColor="#000000" />
             </div>
             
             <div className="flex flex-col gap-4 w-full">
               <button onClick={handleDownloadPdf} className="btn-swiss-primary w-full text-sm flex items-center justify-center gap-3 py-4 group">
                 <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                 Download PDF Document
               </button>
               <button onClick={handleShare} className="btn-swiss w-full text-sm flex items-center justify-center gap-3 py-4">
                 {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                 {copied ? 'Link Copied!' : 'Share Link'}
               </button>
             </div>
             
             <p className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 mt-8">
               Scan to instantly verify integrity on the Sepolia chain.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
