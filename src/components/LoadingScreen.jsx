import React, { useState, useEffect, useMemo } from 'react';

const QUOTES = [
  "Knowledge is power.",
  "The roots of education are bitter, but the fruit is sweet.",
  "Education is the passport to the future.",
  "An investment in knowledge pays the best interest.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "Education is not the filling of a pail, but the lighting of a fire.",
  "Change is the end result of all true learning.",
  "The mind is not a vessel to be filled, but a fire to be kindled.",
  "Learning never exhausts the mind."
];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [quote, setQuote] = useState("");
  const [hexPhrase, setHexPhrase] = useState("0x00000000");
  
  // Random quote selection
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // Sync tech loading hashes
  useEffect(() => {
    if (progress >= 100) {
      setHexPhrase("SYS_INIT_SUCCESS");
      return;
    }
    const interval = setInterval(() => {
      setHexPhrase(`0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0')}...`);
    }, 80);
    return () => clearInterval(interval);
  }, [progress]);

  // Progress simulation
  useEffect(() => {
    if (progress >= 100) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const remaining = 100 - prev;
        const jump = Math.random() * (remaining * 0.1) + 0.5;
        const next = prev + jump;
        return next >= 99.5 ? 100 : next;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [progress]);

  // Handle exit
  useEffect(() => {
    if (progress >= 100) {
      // Wait a bit before starting exit animation
      const t1 = setTimeout(() => {
        setIsExiting(true);
      }, 800);

      // Wait for animation to finish before unmounting
      const t2 = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1600); // 800ms delay + 800ms transition

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [progress, onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950 text-white font-sans cursor-wait transition-opacity duration-700 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Animated Light Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-pulse duration-1000 opacity-30" style={{
          backgroundImage: 'linear-gradient(to right, #404040 1px, transparent 1px), linear-gradient(to bottom, #404040 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
       }}></div>
      
      {/* Subtle Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white opacity-[0.03] blur-[120px] rounded-full pointer-events-none animate-pulse pulse-slow"></div>

      {/* Floating Binary background rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-t-[1px] border-l-[1px] border-white/5 rounded-full pointer-events-none animate-[spin_40s_linear_infinite] opacity-50 blur-[1px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border-b-[1px] border-r-[1px] border-white/5 rounded-full pointer-events-none animate-[spin_30s_linear_infinite_reverse] opacity-50 blur-[2px]"></div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-20 drop-shadow-md"></div>

      {/* Main Content */}
      <div className="w-full max-w-[28rem] px-8 flex flex-col items-center text-center relative z-10 p-10 rounded-3xl">
        
        {/* Logo with Spin Rings */}
        <div className="mb-14 flex flex-col items-center gap-6 saturate-150 relative">
           <div className="absolute -inset-10 border-[1px] border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
           <div className="absolute -inset-14 border-[1px] border-dotted border-neutral-600 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
           
           <div className="relative z-10 w-24 h-24 bg-neutral-950 rounded-2xl flex items-center justify-center p-2 border border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
             <div className="absolute inset-0 bg-white/10 blur-xl rounded-full mix-blend-overlay"></div>
             <img src="/logo.png" alt="Athena Logo" className="relative w-full h-full rounded-xl object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-pulse pulse-slow" />
           </div>
           
           <span className="font-serif font-extrabold tracking-widest text-4xl text-white drop-shadow-lg">athena</span>
        </div>

        {/* Quote */}
        <div className="h-24 flex items-center justify-center mb-10 w-full px-2">
            <p className="text-lg font-light italic text-transparent bg-clip-text bg-gradient-to-br from-neutral-200 to-neutral-500 leading-relaxed drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-1000">
            "{quote}"
            </p>
        </div>

        {/* Loading Progress Frame */}
        <div className="relative w-full bg-neutral-950/80 p-6 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
            {/* Progress Bar */}
            <div className="w-full h-[3px] bg-neutral-900 rounded-full overflow-hidden mb-5 relative box-border">
              <div 
                className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,255,255,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status Texts */}
            <div className="flex justify-between items-end w-full font-mono">
                <div className="flex flex-col text-left gap-1">
                    <span className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-bold">System Status</span>
                    <span className="text-xs text-neutral-300 tracking-wider flex items-center gap-2">
                        {progress >= 100 ? ( <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse blur-[0.5px]"></span> ) : ( <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse blur-[0.5px]"></span> )}
                        {progress >= 100 ? "READY" : "LOADING ASSETS"}
                    </span>
                </div>

                <div className="flex flex-col text-right gap-1">
                    <span className="text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-bold">Memory Check</span>
                    <span className="text-xs text-neutral-300 tracking-wider">
                        [{Math.floor(progress).toString().padStart(3, '0')}%] - {hexPhrase}
                    </span>
                </div>
            </div>
        </div>

      </div>

      {/* Footer / Version */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-[10px] text-neutral-600 font-mono pointer-events-none">
        <div className="flex flex-col gap-1 tracking-widest uppercase">
            <span>Core Diagnostics</span>
            <span className="text-neutral-500 font-bold opacity-60">Initializing...</span>
        </div>
        <div className="tracking-widest opacity-80">
            ATHENA SYSTEM v1.0.4
        </div>
      </div>
    </div>
  );
}
