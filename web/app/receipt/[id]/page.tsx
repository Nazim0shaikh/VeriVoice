import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebaseAdmin';
import { getEtherscanLink } from '@/lib/blockchain';
import { QRCodeSVG } from 'qrcode.react';

// Assuming you're fetching the complaint directly via server component
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Receipt ${params.id} | VeriVoice`,
  };
}

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const doc = await adminDb.collection('COMPLAINTS').doc(params.id).get();
  
  if (!doc.exists) {
    notFound();
  }

  const data = doc.data();
  // Using an environment variable or hardcoded origin for absolute URL in QR
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://verivoice.vercel.app'}/verify?id=${params.id}`;

  return (
    <div className="flex flex-col max-w-[1440px] mx-auto px-6 md:px-8 py-12 lg:py-24">
      <div className="mb-12 border-b-4 border-swiss-black pb-8">
        <h1 className="text-6xl md:text-8xl font-black uppercase text-green-600 mb-4 tracking-tighter">
          Secured.
        </h1>
        <p className="text-2xl font-bold tracking-widest uppercase">
          Case <span className="text-swiss-accent">{params.id}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          <div className="border-4 border-swiss-black p-8 md:p-12 relative overflow-hidden bg-swiss-muted swiss-grid-pattern">
            <div className="absolute -top-4 -right-4 w-48 h-48 bg-swiss-black rounded-full opacity-5 pointer-events-none"></div>
            
            <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-swiss-black pb-4 inline-block">
              Cryptographic Proof
            </h2>
            
            <div className="bg-swiss-white border-2 border-swiss-black p-6 mb-8 overflow-x-auto">
              <label className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 block mb-2">SHA-256 HASH</label>
              <code className="text-sm md:text-base font-mono text-swiss-accent break-all">{data?.hash}</code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-swiss-white border-2 border-swiss-black p-6">
               <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-swiss-black/50 block mb-2">BLOCKCHAIN TRANSACTION</label>
                  {data?.blockchainTx ? (
                    <a href={getEtherscanLink(data.blockchainTx)} target="_blank" rel="noreferrer" className="text-sm font-bold truncate text-blue-600 hover:text-swiss-accent underline transition-colors">
                      {data.blockchainTx.substring(0, 16)}...{data.blockchainTx.substring(50)}
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

          <div className="border-4 border-swiss-black p-8 md:p-12">
             <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-swiss-black">
               <h3 className="text-2xl font-black uppercase tracking-tighter">AI Analysis</h3>
               <span className={`px-4 py-2 font-bold uppercase tracking-widest text-xs border-2 border-swiss-black ${data?.severity === 5 ? 'bg-red-600 text-white' : 'bg-swiss-muted'}`}>
                 Level {data?.severity}
               </span>
             </div>
             
             <div className="text-xl font-medium border-l-4 border-swiss-accent pl-6 mb-8 text-swiss-black/80">
               {data?.summary}
             </div>

             <div className="flex gap-4">
                <span className="bg-swiss-black text-swiss-white font-bold uppercase text-xs tracking-widest px-4 py-2">
                  {data?.category}
                </span>
                <span className="bg-swiss-muted border-2 border-swiss-black text-swiss-black font-bold uppercase text-xs tracking-widest px-4 py-2">
                  {data?.department}
                </span>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="border-4 border-swiss-black p-8 bg-swiss-white sticky top-32 flex flex-col items-center text-center">
             <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b-4 border-swiss-black w-full pb-4">Verification Tag</h3>
             
             <div className="border-4 border-swiss-black p-4 mb-8 bg-white max-w-fit">
                <QRCodeSVG value={verifyUrl} size={180} level="H" fgColor="#000000" />
             </div>
             
             <div className="flex flex-col gap-4 w-full">
               <button className="btn-swiss-primary w-full text-sm">Download PDF Document</button>
               <button className="btn-swiss w-full text-sm">Share Link</button>
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
