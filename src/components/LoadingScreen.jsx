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
      <div className="absolute inset-0 z-0 pointer-events-none animate-grid opacity-20" style={{
          backgroundImage: 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
       }}></div>
      
      {/* Subtle Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white opacity-[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Content (Massive Typography) */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center h-full">
        <div className="relative overflow-hidden w-full text-center">
          {/* Background Outline Text */}
          <h1 className="text-[14vw] md:text-[12vw] font-serif font-extrabold tracking-tighter leading-none text-transparent mix-blend-plus-lighter" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
            athena.
          </h1>
          
          {/* Filled Text that reveals with progress */}
          <div 
            className="absolute top-0 left-0 w-full h-full overflow-hidden transition-all duration-300 ease-out"
            style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
          >
            <h1 className="text-[14vw] md:text-[12vw] font-serif font-extrabold tracking-tighter leading-none text-white drop-shadow-2xl">
              athena.
            </h1>
          </div>
        </div>

        {/* Dynamic Subtitle / Quote */}
        <div className="mt-8 flex items-center justify-between w-full max-w-4xl px-4 md:px-12 border-t border-neutral-900 pt-6">
            <p className="text-sm md:text-base font-light italic text-neutral-400 max-w-md line-clamp-2 pr-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
                "{quote}"
            </p>
            <div className="text-right">
                <span className="block text-[2.5rem] md:text-[4rem] font-bold font-mono tracking-tighter leading-none text-white mix-blend-difference">
                    {Math.floor(progress)}<span className="text-2xl text-neutral-600">%</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1 block">
                    Loading Assets...
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}
