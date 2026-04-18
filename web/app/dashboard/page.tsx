'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Filter, Layers, AlertTriangle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLanguage } from '@/components/LanguageContext';

// Leaflet map needs to be dynamically loaded to avoid SSR window errors
const ComplaintMap = dynamic(() => import('@/components/ComplaintMap'), { ssr: false });

export default function DashboardPage() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'COMPLAINTS'), 
      orderBy('timestamp', 'desc'), 
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
       const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       setComplaints(docs);
    });

    return () => unsubscribe();
  }, []);

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const resolvedRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="flex flex-col max-w-[1440px] mx-auto px-6 md:px-8 py-12 lg:py-24">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 border-b-4 border-swiss-black pb-8 gap-6">
         <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
              {t('dashPulse')}
            </h1>
            <p className="text-xl font-medium tracking-widest uppercase">{t('dashPulseDesc')}</p>
         </div>
         <div className="text-right">
            <span className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-green-600 border-2 border-green-600 px-4 py-2 bg-green-50">
               <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div> {t('dashLiveFeed')}
            </span>
         </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-swiss-muted border-4 border-swiss-black p-8 mb-12">
          <div className="border-l-4 border-swiss-black pl-4">
             <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 block mb-2">{t('dashTotal')}</span>
             <span className="text-4xl md:text-6xl font-black tracking-tighter">{total}</span>
          </div>
          <div className="border-l-4 border-swiss-black pl-4">
             <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 block mb-2">{t('dashResolved')}</span>
             <span className="text-4xl md:text-6xl font-black tracking-tighter text-green-600">{resolvedRate}%</span>
          </div>
          <div className="border-l-4 border-swiss-black pl-4">
             <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 block mb-2">{t('dashPending')}</span>
             <span className="text-4xl md:text-6xl font-black tracking-tighter text-amber-500">{pending}</span>
          </div>
          <div className="border-l-4 border-swiss-black pl-4">
             <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/50 block mb-2">{t('dashActiveDepts')}</span>
             <span className="text-4xl md:text-6xl font-black tracking-tighter">7</span>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
         {/* Map & Filters */}
         <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="border-4 border-swiss-black bg-swiss-white p-1 h-[400px] flex items-center justify-center relative overflow-hidden">
               <ComplaintMap complaints={complaints} />
            </div>
            
            <div className="border-4 border-swiss-black bg-swiss-white p-8">
               <h3 className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter mb-6 border-b-4 border-swiss-black pb-4">
                 <Filter className="w-5 h-5"/> {t('dashFilters')}
               </h3>
               {/* Stub filters */}
               <div className="flex flex-col gap-4 font-bold uppercase text-xs tracking-widest">
                  <button className="text-left py-3 border-b-2 border-swiss-black/10 hover:border-swiss-black hover:pl-2 transition-all">{t('dashCatAll')}</button>
                  <button className="text-left py-3 border-b-2 border-swiss-black/10 hover:border-swiss-black hover:pl-2 transition-all">{t('dashSevHigh')}</button>
                  <button className="text-left py-3 border-b-2 border-swiss-black/10 hover:border-swiss-black hover:pl-2 transition-all">{t('dashStatusPending')}</button>
               </div>
            </div>
         </div>

         {/* Complaint Feed */}
         <div className="lg:col-span-7 flex flex-col gap-6">
            {complaints.length === 0 ? (
               <div className="border-4 border-swiss-black bg-swiss-muted p-12 text-center">
                 <span className="text-lg font-bold uppercase tracking-widest text-swiss-black/50">{t('dashListening')}</span>
               </div>
            ) : (
               complaints.map(c => (
                 <div key={c.id} className="group border-4 border-swiss-black bg-swiss-white p-6 hover:bg-swiss-black hover:text-swiss-white transition-colors duration-150 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px] group-hover:opacity-20 pointer-events-none">
                      <ShieldCheck className="w-32 h-32 text-swiss-white" />
                    </div>

                    <div className="flex items-start justify-between mb-4 z-10 relative">
                       <div>
                          <span className="text-xs border-2 border-swiss-black px-2 py-1 uppercase font-bold tracking-widest group-hover:border-swiss-white bg-swiss-black text-swiss-white group-hover:bg-swiss-white group-hover:text-swiss-black transition-colors">
                            {c.category}
                          </span>
                       </div>
                       <div className="flex items-center justify-between gap-3 text-xs uppercase font-bold tracking-widest">
                           <span className="text-swiss-black/50 group-hover:text-swiss-white/50">{new Date(c.timestamp?.toMillis() || Date.now()).toLocaleDateString()}</span>
                           {c.severity >= 4 ? (
                              <span className="text-red-500 flex items-center gap-1 group-hover:text-swiss-accent"><AlertTriangle className="w-4 h-4"/> SEV {c.severity}</span>
                           ) : (
                              <span className="text-swiss-black/50 group-hover:text-swiss-white/50">SEV {c.severity}</span>
                           )}
                       </div>
                    </div>

                    <p className="text-lg md:text-xl font-medium tracking-tight mb-6 z-10 relative pr-12 line-clamp-3">
                       {c.summary || c.text}
                    </p>

                    <div className="flex items-center justify-between border-t-2 border-swiss-black/10 group-hover:border-swiss-white/20 pt-4 mt-auto z-10 relative">
                       <span className="text-xs uppercase font-bold tracking-widest text-swiss-black/70 group-hover:text-swiss-white/70 truncate flex items-center gap-2">
                           <Clock className="w-3 h-3" />
                           {c.status}
                       </span>
                       <span className="text-xs uppercase font-mono tracking-widest text-swiss-accent truncate max-w-[200px]">
                           {c.id}
                       </span>
                    </div>
                 </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
}
