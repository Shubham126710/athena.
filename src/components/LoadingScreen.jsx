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
  
  // Random quote selection
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

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
      <div className="absolute inset-0 z-0 pointer-events-none animate-grid opacity-30" style={{
          backgroundImage: 'linear-gradient(to right, #404040 1px, transparent 1px), linear-gradient(to bottom, #404040 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
       }}></div>
      
      {/* Subtle Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-white opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] opacity-20 drop-shadow-md"></div>

      {/* Main Content */}
      <div className="w-full max-w-md px-8 flex flex-col items-center text-center relative z-10 backdrop-blur-sm bg-neutral-950/30 p-10 rounded-2xl border border-white/5 shadow-2xl">
        
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center gap-4">
           <div className="relative">
             <div className="absolute -inset-2 bg-white/20 blur-xl rounded-full"></div>
             <img src="/logo.png" alt="Athena Logo" className="relative w-20 h-20 rounded-xl shadow-2xl border border-white/10" />
           </div>
           <span className="font-serif font-extrabold tracking-tight text-3xl">athena.</span>
        </div>

        {/* Quote */}
        <div className="h-28 flex items-center justify-center mb-8 w-full">
            <p className="text-lg md:text-xl font-light italic text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-white to-neutral-400 leading-relaxed drop-shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
            "{quote}"
            </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden mb-4 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <div className="flex justify-between w-full text-xs font-mono text-neutral-500 uppercase tracking-widest">
            <span>Loading Assets...</span>
            <span>{Math.floor(progress)}%</span>
        </div>

      </div>

      {/* Footer / Version */}
      <div className="absolute bottom-8 text-[10px] text-neutral-600 font-mono">
        ATHENA SYSTEM v1.0.4
      </div>
    </div>
  );
}
