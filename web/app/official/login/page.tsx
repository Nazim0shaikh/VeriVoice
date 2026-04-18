'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Shield, KeyRound, Loader2 } from 'lucide-react';

export default function OfficialLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/official/portal');
    } catch (err: any) {
      setError('Invalid credentials or unauthorized access.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 max-w-4xl mx-auto">
      <div className="w-full border-4 border-swiss-black bg-swiss-white p-8 md:p-16 relative">
        <div className="absolute -top-6 -left-6 bg-swiss-accent text-swiss-white px-4 py-2 font-bold tracking-widest text-xs uppercase z-10 border-4 border-swiss-black flex items-center gap-2">
          <Shield className="w-4 h-4" /> Restricted Access
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-center">
          Official <br/> Portal.
        </h1>
        <p className="text-center text-sm font-bold uppercase tracking-widest text-swiss-black/50 mb-12">
          Authorized Government Personnel Only
        </p>

        {error && (
          <div className="bg-red-100 border-2 border-red-600 text-red-600 p-4 mb-8 font-bold uppercase tracking-widest text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6 max-w-sm mx-auto">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-swiss-black/70 mb-2 block">
              Official Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg font-bold uppercase border-b-4 border-swiss-black/20 focus:border-swiss-black outline-none bg-transparent transition-colors shadow-none"
              placeholder="official@gov.in"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-swiss-black/70 mb-2 block">
              Security Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-lg font-bold border-b-4 border-swiss-black/20 focus:border-swiss-black outline-none bg-transparent transition-colors shadow-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-swiss-primary w-full mt-4 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <><KeyRound className="w-5 h-5" /> Authenticate</>}
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t-2 border-swiss-black/10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-swiss-black/40">
            All actions are permanently logged on the blockchain audit trail.
          </p>
        </div>
      </div>
    </div>
  );
}
