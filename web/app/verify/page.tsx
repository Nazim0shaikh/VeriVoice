'use client';

import { useState } from 'react';
import { Search, Hash, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getChainRecord, getEtherscanLink } from '@/lib/blockchain';
import { adminDb } from '@/lib/firebaseAdmin';

export default function VerifyPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'verified' | 'tampered' | 'not_found'>('idle');

  const checkHash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setStatus('loading');
    setResult(null);

    try {
      const isIdQuery = query.startsWith('VV-');
      
      const res = await fetch(`/api/verify?q=${query}&type=${isIdQuery ? 'id' : 'hash'}`);
      if (!res.ok) {
        if (res.status === 404) setStatus('not_found');
        else throw new Error("Verification failed");
        return;
      }
      
      const data = await res.json();
      setResult(data);
      setStatus(data.isVerified ? 'verified' : 'tampered');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col max-w-[1440px] mx-auto px-6 md:px-8 py-12 lg:py-24">
      <div className="mb-12 border-b-4 border-swiss-black pb-8">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
          Verify.
        </h1>
        <p className="text-xl font-medium tracking-widest uppercase">
          Compare database records against the immutable ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-1 border-4 border-swiss-black p-8 bg-swiss-muted swiss-grid-pattern h-fit md:col-span-4 lg:col-span-3">
           <h3 className="text-xl mb-4 font-black tracking-widest text-swiss-accent uppercase">Mechanics</h3>
           <p className="text-sm font-medium border-l-4 border-swiss-black pl-4">
             Cryptographic certainty ensures no official can edit the text of a complaint. Entering an ID hashes the stored text and compares it to the hash anchored at creation.
           </p>
        </div>

        <div className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col gap-12">
          
          <form onSubmit={checkHash} className="flex flex-col md:flex-row gap-4 border-4 border-swiss-black bg-white p-4">
             <input 
               type="text" 
               placeholder="Enter Complaint ID (VV-...) or SHA-256 Hash" 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className="flex-grow px-4 py-4 text-lg md:text-xl font-bold uppercase tracking-widest bg-transparent border-b-4 border-transparent focus:border-swiss-accent outline-none transition-colors"
             />
             <button type="submit" disabled={status === 'loading'} className="btn-swiss-primary flex-shrink-0 flex items-center justify-center gap-4">
               {status === 'loading' ? 'Checking...' : <><Search className="w-5 h-5"/> Analyze</>}
             </button>
          </form>

          {status === 'not_found' && (
             <div className="border-4 border-swiss-black bg-swiss-white p-8 md:p-12 text-center">
                 <Hash className="w-16 h-16 mx-auto mb-6 text-swiss-black/20" />
                 <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">Record Not Found</h2>
                 <p className="font-medium text-xl uppercase tracking-widest text-swiss-black/50">Either tracking ID is invalid or the hash was never anchored.</p>
             </div>
          )}

          {(status === 'verified' || status === 'tampered') && result && (
            <div className={`border-4 border-swiss-black p-8 md:p-12 relative overflow-hidden ${status === 'verified' ? 'bg-green-50' : 'bg-red-50'}`}>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-swiss-black pb-8 mb-8 gap-4">
                   <div className="flex items-center gap-6">
                      {status === 'verified' ? (
                        <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-green-600" />
                      ) : (
                        <ShieldAlert className="w-12 h-12 md:w-16 md:h-16 text-red-600" />
                      )}
                      <div>
                        <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter ${status === 'verified' ? 'text-green-600' : 'text-red-600'}`}>
                          {status === 'verified' ? 'Authentic' : 'Tampered'}
                        </h2>
                        <span className="text-sm font-bold uppercase tracking-widest text-swiss-black/50">Cryptographic status</span>
                      </div>
                   </div>
                   
                   <span className="px-6 py-2 bg-swiss-black text-swiss-white font-bold tracking-widest uppercase text-sm border-2 border-swiss-black">
                     {result.id || 'Hash Match Only'}
                   </span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  <div className="flex flex-col border-l-4 border-swiss-black pl-6">
                     <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 mb-2">Stored DB Hash</span>
                     <code className="text-sm font-mono break-all text-swiss-black/70 mb-8">{result.dbHash || 'N/A'}</code>

                     <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 mb-2">Blockchain Ledged Hash</span>
                     <code className="text-sm font-mono break-all text-swiss-black mb-8">{result.chainHash || 'N/A'}</code>

                     {result.complaint && (
                        <div className="mt-4 pt-6 border-t-4 border-swiss-black/10">
                           <span className="text-xs uppercase font-black tracking-widest text-swiss-black/90 mb-2 block">Original Complaint</span>
                           <p className="text-sm font-medium text-swiss-black mb-4 p-4 bg-swiss-white border-2 border-swiss-black/10">
                             {result.complaint.text}
                           </p>
                           
                           <div className="flex flex-wrap gap-4 mt-4">
                             <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black uppercase text-swiss-black/50 tracking-widest">Status</span>
                               <span className={`text-xs font-bold uppercase px-3 py-1 ${
                                 result.complaint.status === 'pending' ? 'bg-amber-200 text-amber-800' :
                                 result.complaint.status === 'in_review' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                               }`}>
                                 {result.complaint.status}
                               </span>
                             </div>
                             
                             <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black uppercase text-swiss-black/50 tracking-widest">Category</span>
                               <span className="text-xs font-bold uppercase px-3 py-1 border-2 border-swiss-black bg-swiss-white">
                                 {result.complaint.category}
                               </span>
                             </div>
                           </div>

                           {result.complaint.officialResponse && (
                             <div className="mt-6 border-l-4 border-swiss-accent pl-4">
                               <span className="text-xs uppercase font-black tracking-widest text-swiss-accent block mb-1">Official Response</span>
                               <p className="text-sm font-bold text-swiss-black/80">{result.complaint.officialResponse}</p>
                             </div>
                           )}
                        </div>
                     )}
                  </div>
                  
                  <div className="flex flex-col">
                      <div className="bg-swiss-white border-2 border-swiss-black p-6 h-full flex flex-col justify-center">
                          {status === 'verified' ? (
                             <p className="text-lg font-bold tracking-widest uppercase">The database text matches the encrypted signature resting on the blockchain.</p>
                          ) : (
                             <p className="text-lg font-bold tracking-widest uppercase text-red-600">WARNING: The text in the database does not compute to the hash signed on the blockchain. Data has been altered.</p>
                          )}
                          
                          {result.txHash && (
                             <a href={getEtherscanLink(result.txHash)} target="_blank" rel="noreferrer" className="btn-swiss mt-8 text-center text-sm border-2">
                               VIEW ON ETHERSCAN
                             </a>
                          )}
                      </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
