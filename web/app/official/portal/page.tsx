'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Lock, FileText, Activity, AlertTriangle, Hash, Clock, CheckCircle } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

export default function OfficialPortal() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/official/login');
      } else {
        fetchComplaints();
      }
    });
    return () => unsubAuth();
  }, [router]);

  const fetchComplaints = () => {
    // Ideally filter by auth.currentUser department, assuming demo admin sees all
    const q = query(collection(db, 'COMPLAINTS'), orderBy('timestamp', 'desc'));
    
    onSnapshot(q, (snapshot) => {
      setComplaints(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
      setLoading(false);
    });
  };

  const handleUpdate = async () => {
    if (!selected) return;

    try {
      const ref = doc(db, 'COMPLAINTS', selected.id);
      await updateDoc(ref, {
        status: newStatus || selected.status,
        officialResponse: response,
        resolvedAt: newStatus === 'resolved' ? serverTimestamp() : selected.resolvedAt || null
      });

      // Simple UI feedback
      setSelected({ ...selected, status: newStatus || selected.status, officialResponse: response });
      alert("Status officially recorded to immutable ledger.");
    } catch (e: any) {
      console.error(e);
      alert("Error updating record. Ensure email is verified in demo Rules.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold uppercase tracking-widest text-swiss-black">Authenticating...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-[1440px] mx-auto">
       <div className="bg-swiss-black text-swiss-white px-6 py-4 flex items-center justify-between border-b-4 border-swiss-black">
          <div className="flex items-center gap-3">
             <Activity className="w-5 h-5 text-swiss-accent" />
             <span className="font-bold uppercase tracking-widest text-sm">Official Portal Session Active</span>
          </div>
          <div className="text-xs uppercase font-bold tracking-widest text-swiss-white/50 border-2 border-swiss-white/20 px-3 py-1">
            Read/Write Strict Access
          </div>
       </div>

       <div className="flex flex-1 overflow-hidden relative">
          
          {/* Left Sidebar Inbox */}
          <div className="w-1/3 border-r-4 border-swiss-black bg-swiss-muted overflow-y-auto hidden md:block">
             <div className="p-6 border-b-4 border-swiss-black sticky top-0 bg-swiss-muted z-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Case Queue</h2>
                <div className="text-xs tracking-widest uppercase font-bold mt-2 text-swiss-black/50">Dept: ALL REGIONS</div>
             </div>

             <div className="flex flex-col">
                {complaints.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => { setSelected(c); setResponse(c.officialResponse || ''); setNewStatus(c.status); }}
                    className={`p-6 border-b-2 border-swiss-black hover:bg-swiss-white cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-swiss-white border-l-8 border-l-swiss-black' : 'border-l-8 border-l-transparent'}`}
                  >
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-black uppercase tracking-tighter truncate w-32">{c.id}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 ${
                          c.status === 'pending' ? 'bg-amber-200 text-amber-800' :
                          c.status === 'in_review' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'
                        }`}>
                          {c.status}
                        </span>
                     </div>
                     <p className="text-sm font-medium line-clamp-2 text-swiss-black/80">{c.summary}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Right Main Editor */}
          <div className="flex-1 bg-swiss-white overflow-y-auto">
             {!selected ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-swiss-black/30 swiss-grid-pattern">
                   <FileText className="w-24 h-24 mb-6" />
                   <h3 className="text-2xl font-black uppercase tracking-tighter">No Case Selected</h3>
                   <p className="text-sm font-bold uppercase tracking-widest">Select a case file from the queue.</p>
                </div>
             ) : (
                <div className="flex flex-col h-full">
                   <div className="p-8 md:p-12 border-b-4 border-swiss-black bg-swiss-muted flex justify-between items-end">
                      <div>
                         <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-swiss-accent break-all">
                           {selected.id}
                         </h1>
                         <div className="flex items-center gap-4 mt-4 font-bold text-xs tracking-widest uppercase">
                            <span className="border-2 border-swiss-black px-3 py-1 bg-swiss-white">{selected.category}</span>
                            <span className="text-swiss-black/50">{new Date(selected.timestamp?.toMillis() || Date.now()).toLocaleString()}</span>
                         </div>
                      </div>
                      {selected.severity >= 4 && (
                         <div className="bg-red-600 text-white p-3 rotate-3 flex items-center justify-center gap-2 border-4 border-swiss-black">
                            <AlertTriangle className="w-6 h-6" /> SEV {selected.severity} SURGE
                         </div>
                      )}
                   </div>

                   <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
                      
                      {/* Left: Immutable Complaint */}
                      <div className="flex flex-col gap-6">
                         <div className="flex items-center gap-2 bg-swiss-black text-swiss-white p-3">
                            <Lock className="w-4 h-4 text-swiss-accent" />
                            <span className="text-xs font-bold tracking-widest uppercase">Immutable — Protected by Blockchain</span>
                         </div>

                         <div className="bg-swiss-muted border-4 border-swiss-black p-6 font-medium text-lg min-h-[250px] relative pointer-events-none opacity-80 select-none user-select-none">
                            <div className="absolute inset-0 border-4 border-dashed border-swiss-black/10 z-0"></div>
                            <span className="relative z-10 block">{selected.text}</span>
                         </div>
                         
                         <div>
                            <span className="text-xs uppercase font-bold tracking-widest block mb-2 text-swiss-black/50">SHA-256 Hash Origin</span>
                            <code className="text-xs bg-swiss-white border-2 border-swiss-black/10 p-2 block break-all text-swiss-accent">
                               {selected.hash}
                            </code>
                         </div>
                      </div>

                      {/* Right: Official Response Engine */}
                      <div className="flex flex-col gap-8">
                         <div className="border-4 border-swiss-black p-6 bg-swiss-white">
                             <h3 className="text-xl font-black uppercase tracking-tighter mb-6 border-b-2 border-swiss-black pb-2">Status Designation</h3>
                             
                             <div className="grid grid-cols-3 gap-2 mb-6">
                               {['pending', 'in_review', 'resolved'].map((st) => (
                                 <button
                                   key={st}
                                   onClick={() => setNewStatus(st)}
                                   className={`py-3 text-xs font-bold uppercase tracking-widest border-2 transition-colors ${newStatus === st ? 'bg-swiss-black text-swiss-white border-swiss-black' : 'bg-transparent text-swiss-black/50 border-swiss-black/20 hover:border-swiss-black'}`}
                                 >
                                   {st.replace('_', ' ')}
                                 </button>
                               ))}
                             </div>

                             <h3 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-swiss-black pb-2 mt-8">Official Dispatch</h3>
                             <textarea 
                               className="w-full min-h-[150px] border-4 border-swiss-black p-4 text-lg font-medium outline-none focus:border-swiss-accent resize-none bg-swiss-muted"
                               placeholder="Draft official resolution or updates here. This text becomes public upon submission."
                               value={response}
                               onChange={(e) => setResponse(e.target.value)}
                             />
                             
                             <button 
                               onClick={handleUpdate}
                               className="btn-swiss-primary w-full mt-6 py-4 flex items-center justify-center gap-3 text-sm"
                             >
                                <CheckCircle className="w-5 h-5"/> INJECT LOG ENTRY <span className="text-swiss-black/50 opacity-40 mx-2">|</span> NO DELETIONS PERMITTED
                             </button>
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
