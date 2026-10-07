import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import ConstellationBackground from '../components/ConstellationBackground.jsx';

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ConstellationBackground />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      
      {/* Radial Gradient overlay to focus the center */}
      <div className="absolute inset-0 bg-neutral-950/40 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, #0a0a0a 70%)' }}></div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="w-20 h-20 mb-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-2xl relative">
          <div className="absolute inset-0 bg-white/5 rounded-2xl animate-pulse"></div>
          <Compass size={32} className="text-neutral-400" />
        </div>
        
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 text-white">
          404<span className="text-neutral-600">.</span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-white">
          Lost in the <span className="font-serif italic font-normal text-neutral-300">void.</span>
        </h2>
        
        <p className="text-neutral-400 md:text-lg mb-10 max-w-md leading-relaxed">
          The academic coordinates you are looking for do not exist. Let's guide you back to familiar territory.
        </p>

        <button 
          onClick={() => nav('/')}
          className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold text-sm hover:bg-neutral-200 transition-all shadow-lg shadow-white/10"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return Home
        </button>
      </div>
    </div>
  );
}
