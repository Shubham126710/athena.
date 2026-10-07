import React, { useState, useEffect } from 'react';
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

export default function LoadingScreen() {
  const [quote, setQuote] = useState("");
  
  // Random quote selection
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-neutral-950 text-white font-sans cursor-wait">
      
      {/* Animated Light Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-grid opacity-20" style={{
          backgroundImage: 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
       }}></div>
      
      {/* Subtle Glow Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-white opacity-[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Accordion Loader */}
        <div className="text-4xl text-neutral-300 drop-shadow-2xl mb-4">
          <AccordionLoader />
        </div>
        
        {/* Dynamic Subtitle / Quote */}
        <p className="text-sm md:text-base font-light italic text-neutral-400 max-w-sm text-center line-clamp-2 px-6 drop-shadow-md">
            "{quote}"
        </p>
      </div>
    </div>
  );
}
