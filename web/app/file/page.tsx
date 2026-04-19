'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, MapPin, Send, ShieldAlert, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [location, setLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);
  const [status, setStatus] = useState<null | 'Verifying...' | 'Hashing...' | 'Storing...' | 'Anchoring...' | 'Done'>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Web Speech API if supported
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setText(prev => (prev + ' ' + finalTranscript).trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (!recognitionRef.current) return alert("Speech recognition not supported in this browser. Please try Chrome or Edge.");
      
      // Update language before starting
      recognitionRef.current.lang = voiceLang;
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, () => alert("Could not fetch location"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.length < 20) {
      alert("Please enter at least 20 characters describing the issue.");
      return;
    }
    
    try {
      setStatus('Verifying...');
      
      const res = await fetch('/api/complaints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, location })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Submission failed");
      }
      
      const data = await res.json();
      setStatus('Done');
      
      // Redirect to receipt
      router.push(`/receipt/${data.complaintId}`);

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to submit complaint. Please try again.");
      setStatus(null);
    }
  };

  return (
    <div className="flex flex-col max-w-[1440px] mx-auto px-6 md:px-8 py-12 lg:py-24">
      {/* Hero Section (Asymmetric Grid 7:5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
        <div className="lg:col-span-7">
          <h1 className="text-6xl md:text-8xl lg:text-[8rem] leading-[0.9] font-black uppercase mb-8">
            {t('fileSpeak')} <br/>
            <span className="text-swiss-accent swiss-grid-pattern inline-block pt-2">{t('fileFreely')}</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium border-l-4 border-swiss-black pl-6 max-w-2xl">
            {t('fileDesc')}
          </p>
        </div>
        
        <div className="lg:col-span-5 flex flex-col justify-start swiss-dots border-4 border-swiss-black p-8 bg-swiss-muted/30">
          <ShieldAlert className="w-16 h-16 mb-6 text-swiss-accent" strokeWidth={1.5} />
          <h2 className="text-3xl mb-4">{t('fileImmutableRec')}</h2>
          <p className="font-medium text-swiss-black/70 mb-8 border-b-4 border-swiss-black pb-8">
            {t('fileImmutableDesc')}
          </p>
          <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
            <span className="w-3 h-3 bg-swiss-accent rounded-none"></span>
            {t('fileZeroLogin')}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section className="bg-swiss-white border-4 border-swiss-black relative">
        <div className="absolute -top-6 -left-6 bg-swiss-accent text-swiss-white px-4 py-2 font-bold tracking-widest text-xs uppercase z-10 border-4 border-swiss-black">
          {t('fileNewCase')}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12">
          
          <div className="md:col-span-8 p-8 md:p-12 border-b-4 md:border-b-0 md:border-r-4 border-swiss-black flex flex-col gap-6">
            <div className="flex justify-between items-end mb-2">
              <label className="text-2xl font-black uppercase tracking-tighter">{t('fileGrievance')}</label>
              <span className={`text-sm font-bold tracking-widest ${Math.max(2000 - text.length, 0) < 50 ? 'text-swiss-accent' : 'text-swiss-black/50'}`}>
                {Math.max(2000 - text.length, 0)} {t('fileCharsLeft')}
              </span>
            </div>
            
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value.substring(0, 2000))}
              placeholder={t('filePlaceholder')}
              className="flex-grow min-h-[250px] resize-none outline-none text-xl lg:text-2xl font-medium bg-transparent placeholder-swiss-black/20 focus:ring-0 w-full"
              disabled={!!status}
            />

            <div className="flex flex-wrap gap-4 pt-6 border-t-4 border-swiss-black items-center">
              <div className="flex bg-swiss-muted border-2 border-swiss-black">
                <select 
                  value={voiceLang}
                  onChange={(e) => {
                    setVoiceLang(e.target.value);
                    if (isRecording) {
                      // Restart recording with new language
                      recognitionRef.current?.stop();
                      setTimeout(() => {
                        recognitionRef.current.lang = e.target.value;
                        recognitionRef.current?.start();
                      }, 300);
                    }
                  }}
                  disabled={!!status}
                  className="bg-transparent font-bold uppercase tracking-widest text-sm px-4 py-3 outline-none cursor-pointer border-r-2 border-swiss-black"
                >
                  <option value="en-IN">English (IN)</option>
                  <option value="hi-IN">Hindi (हिन्दी)</option>
                  <option value="mr-IN">Marathi (मराठी)</option>
                  <option value="bn-IN">Bengali (বাংলা)</option>
                  <option value="ta-IN">Tamil (தமிழ்)</option>
                  <option value="te-IN">Telugu (తెలుగు)</option>
                  <option value="gu-IN">Gujarati (ગુજરાતી)</option>
                  <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
                </select>

                <button 
                  type="button" 
                  onClick={toggleRecording}
                  disabled={!!status}
                  className={`flex items-center gap-3 px-6 py-3 font-bold uppercase tracking-widest transition-colors duration-150 ${isRecording ? 'bg-swiss-accent text-swiss-white' : 'hover:bg-swiss-black hover:text-swiss-white'}`}
                >
                  {isRecording ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
                  {isRecording ? t('fileListening') : t('fileDictate')}
                </button>
              </div>
              
              <button 
                type="button" 
                onClick={captureLocation}
                disabled={!!status}
                className={`flex items-center gap-3 px-6 py-3 font-bold uppercase tracking-widest border-2 transition-colors duration-150 ${location ? 'border-green-600 bg-green-600 text-white' : 'border-swiss-black hover:bg-swiss-black hover:text-swiss-white'}`}
              >
                <MapPin className="w-5 h-5" />
                {location ? t('fileLocAttached') : t('fileAttachLoc')}
              </button>
            </div>
          </div>

          <div className="md:col-span-4 p-8 md:p-12 bg-swiss-muted swiss-diagonal flex flex-col justify-between">
            <div>
              <div className="bg-swiss-black text-swiss-white p-6 mb-8 border-4 border-swiss-black group hover:bg-swiss-accent transition-colors duration-150 cursor-default">
                <h3 className="text-xl mb-2">{t('fileAnonShield')}</h3>
                <p className="text-sm font-medium text-swiss-white/80 group-hover:text-swiss-white">
                  {t('fileAnonDesc')}
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold tracking-widest uppercase mb-4">{t('fileCategoryAuto')}</label>
                <div className="p-4 border-2 border-swiss-black/20 bg-swiss-white/50 text-swiss-black/50 text-sm font-semibold mb-4">
                  {t('fileClaudeAI')}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={text.length < 20 || !!status}
              className="btn-swiss-primary w-full flex items-center justify-center gap-4 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {status ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="flex flex-col items-center">
                    <span className="font-black uppercase tracking-widest">{status}</span>
                    <span className="text-xs uppercase tracking-tight opacity-75 animate-pulse mt-1">Please wait... up to 30-45 seconds to anchor to blockchain</span>
                  </span>
                </>
              ) : text.length < 20 ? (
                <span>Enter at least 20 characters</span>
              ) : (
                <>
                  <span>{t('fileSubmit')}</span>
                  <Send className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-150" />
                </>
              )}
            </button>
          </div>
          
        </form>
      </section>
    </div>
  );
}
