import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { AccordionLoader } from './ui/accordion-loader.jsx';

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

  const containerRef = useRef();
  
  useGSAP(() => {
    gsap.set('.loading-logo, .loading-loader, .loading-quote', { opacity: 0 });
    
    gsap.fromTo('.loading-logo',
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 0.9, scale: 1, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo('.loading-loader',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out', delay: 0.3 }
    );
    
    gsap.fromTo('.loading-quote',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, { scope: containerRef });

  const [quote, setQuote] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  
  // Random quote selection
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // Auto-hide logic for standalone usage
  useEffect(() => {
    const t1 = setTimeout(() => {
      setIsExiting(true);
    }, 2000); // Show for 2 seconds

    const t2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800); // 2s + 800ms fade out

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950 text-white font-sans cursor-wait transition-opacity duration-700 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Animated Light Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-grid opacity-20" style={{
          backgroundImage: 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
       }}></div>
      
      {/* Subtle Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white opacity-[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6">
        
        <img src="/logo.png" alt="Athena Logo" className="loading-logo w-16 h-16 opacity-90" />
        
        {/* Accordion Loader */}
        <div className="loading-loader text-4xl text-neutral-300 drop-shadow-2xl">
          <AccordionLoader />
        </div>
        
        {/* Dynamic Subtitle / Quote */}
        <p className="loading-quote text-sm md:text-base font-light italic text-neutral-400 max-w-sm text-center line-clamp-2 px-6 drop-shadow-md mt-4">
            "{quote}"
        </p>
      </div>
    </div>
  );
}
