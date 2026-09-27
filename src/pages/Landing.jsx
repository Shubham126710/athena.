import React from 'react';
import { useNavigate } from 'react-router-dom';
import DitherHero from '../components/DitherHero.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import MarqueeStrip from '../components/MarqueeStrip.jsx';
import Footer1 from '../components/Footer1.jsx';
import Features from '../components/Features.jsx';
import { db } from '../lib/firebase';
import { collection, query, where, getCountFromServer, addDoc } from 'firebase/firestore';
import { ArrowRight, Box, Database, Layers, Zap, Shield, Cpu, Instagram, Twitter, Linkedin, Mail, Phone, AtSign, Github, Book, Calendar, Search, Users, Lock, Brain, Clock, Menu, X } from 'lucide-react';
import Avatar from '../components/Avatar.jsx';

function SpotlightCard({ children, className = "" }) {
  const divRef = React.useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative h-full z-20">{children}</div>
    </div>
  );
}

export default function Landing() {
  const [showLoader, setShowLoader] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const nav = useNavigate();

  // Typewriter State
  const [text, setText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loopNum, setLoopNum] = React.useState(0);
  const [views, setViews] = React.useState(1080);

  React.useEffect(() => { 
    const updateViews = async () => {
      try {
        let localHits = parseInt(localStorage.getItem('athena_view_count'), 10);
        if (isNaN(localHits)) localHits = 1080;
        
        // Ensure firebase works, update and fetch count
        const coll = collection(db, 'notes');
        await addDoc(coll, { title: 'session_hit', subject: 'site_analytics', unit: 'pageview', file_url: 'none', file_path: 'hit' });

        const q = query(coll, where('subject', '==', 'site_analytics'));
        const snapshot = await getCountFromServer(q);
        
        const trueCount = snapshot.data().count + 1080; // base offset
        
        setViews(trueCount);
        localStorage.setItem('athena_view_count', trueCount.toString());
      } catch (err) {
        console.error("Analytics sync failed", err);
        setViews(prev => prev + 1);
      }
    };
    
    updateViews();
  }, []);
  const [delta, setDelta] = React.useState(150);
  const toRotate = ["archive.", "repository.", "companion.", "buddy.", "classmate."];
  const period = 2000;

  React.useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text, delta]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(50);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(150);
    }
  }

  return (
    <div className="min-h-screen font-sans bg-black text-white selection:bg-white selection:text-black relative">
      {showLoader && <LoadingScreen />}
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between bg-black border-b border-white/5">
        
        {/* LEFT: Logo */}
        <div className="flex min-w-0 items-center gap-5 w-1/4">
            <div className="flex items-center gap-2 z-10">
              <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm" />
              <span className="font-serif font-bold tracking-tight text-xl hidden sm:block text-white">athena.</span>
            </div>
        </div>

        {/* CENTER: Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-10 text-[11px] font-medium tracking-widest uppercase text-neutral-500 w-2/4 relative z-10">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4 relative z-10 w-2/3 md:w-1/3">
          {/* Hit Counter Widget in Navbar - Now visible on mobile */}
          <div className="flex items-center gap-1.5 md:gap-2 bg-neutral-900/80 border border-neutral-800 rounded-full px-2 py-1 md:px-3 md:py-1.5 transform scale-90 md:scale-100 origin-right">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] md:text-[10px] font-mono text-neutral-300 font-medium tracking-widest uppercase"><span className="hidden sm:inline">Views: </span><span className="text-white font-bold">{views}</span></span>
          </div>

          <button onClick={() => nav('/hub')} className="hidden md:block px-5 py-2.5 bg-white text-black text-sm font-medium rounded-sm hover:bg-neutral-200 transition-all shadow-sm">Enter App</button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-neutral-950 border-b border-neutral-800 p-6 md:hidden animate-in slide-in-from-top-5 fade-in duration-200 shadow-2xl flex flex-col gap-4">
                <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-neutral-400 hover:text-white transition-colors">About</a>
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-neutral-400 hover:text-white transition-colors">Features</a>
                <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-neutral-400 hover:text-white transition-colors">Contact</a>
                <div className="h-px bg-neutral-800 my-2"></div>
                <button onClick={() => nav('/hub')} className="w-full px-5 py-3 bg-white text-black text-center font-bold rounded-sm hover:bg-neutral-200 transition-all shadow-sm">Enter App</button>
            </div>
        )}
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative w-full h-[calc(100svh-5rem)] min-h-[600px] flex flex-col justify-center overflow-hidden">
          
          {/* Atmospheric Radial Glow behind the statue */}
          <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none z-0"></div>

          {/* Subtle Architectural Grid */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-10" style={{
              backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
              backgroundSize: '100px 100px',
              maskImage: 'radial-gradient(circle at 30% 50%, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at 30% 50%, black 20%, transparent 80%)'
          }}></div>

          {/* Athena Dither Statue - Desktop */}
          <DitherHero className="hidden md:flex absolute bottom-0 w-[55%] h-[100%] right-[-5%] z-0" />
          
          {/* Text content wrapped in container */}
          <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col justify-center h-full pt-12 pb-24">
            <div className="max-w-xl flex flex-col items-start text-left">
              <div className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase flex gap-4 mb-6 font-mono">
                <span>Athena / System</span>
                <span className="hidden sm:inline">01 — Research</span>
                <span className="hidden sm:inline">02 — Synthesize</span>
              </div>

              <h1 className="text-[clamp(2.5rem,11vw,3.5rem)] md:text-6xl lg:text-[6.5rem] font-bold tracking-tighter leading-[0.95] text-white uppercase m-0 break-words">
                YOUR DIGITAL<br />
                ACADEMIC<br />
                <span className="font-serif italic font-normal tracking-tight text-neutral-300 normal-case lowercase pr-2">{text}_</span>
              </h1>
              
              {/* Athena Dither Statue - Mobile Flow */}
              <div className="w-full max-w-[400px] h-[350px] relative mx-auto md:hidden my-6 self-center">
                  <DitherHero className="absolute inset-0 w-full h-full" />
              </div>
              
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed font-light max-w-sm border-l border-neutral-800 pl-4 mt-2 md:mt-8">
                Build, connect, and scale intelligent workflows — all from one place.
              </p>

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button onClick={() => nav('/hub')} className="w-full sm:w-auto px-6 py-4 sm:py-3.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors shadow-sm text-center">Enter System</button>
                <button className="w-full sm:w-auto px-6 py-4 sm:py-3.5 bg-transparent border border-neutral-800 text-neutral-400 text-[10px] font-bold tracking-widest uppercase hover:text-white transition-colors text-center">View Methodology</button>
              </div>
            </div>
          </div>
          
          {/* Subject Marquee - Placed at the bottom of the hero above the fold */}
          <div className="absolute bottom-0 left-0 w-full z-30 border-t border-neutral-900 bg-neutral-950/50 backdrop-blur-sm">
              <MarqueeStrip />
          </div>
        </section>


        {/* 1. About / Goal Section */}
        <section id="about" className="py-24 bg-neutral-950 border-t border-neutral-900/50">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-white">The Goal</h2>
              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light italic">
                "I named this project Athena after the Greek goddess of wisdom, since I have always been fascinated by Greek mythology ever since I read the Percy Jackson series when I was in my 6th grade. I want Athena to be just that, a personification of wisdom, a companion for your academic needs."
              </p>
            </div>
          </div>
        </section>

        {/* 2. Features Section */}
        <Features />

        {/* 3. Contact Section */}
        <section id="contact" className="py-24 bg-neutral-950 border-t border-neutral-900/50">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-8 text-white">Contact</h2>
              
              <SpotlightCard className="p-8 md:p-12 text-left relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <AtSign size={200} strokeWidth={0.5} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <Avatar seed="Shubham" className="w-24 h-24 rounded-full border-2 border-neutral-700 flex-shrink-0 text-3xl" />
                    
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2 text-white">Shubham Upadhyay</h3>
                        <p className="text-neutral-500 mb-6 font-medium">Tech Enthusiast • F1 & Football Fanatic • Pokémon Fan</p>
                        
                        <p className="text-neutral-400 leading-relaxed mb-8 max-w-xl">
                        Building digital experiences that merge utility with aesthetics. Athena is my latest project to streamline academic resources.
                        Feel free to reach out for collaborations or just to say hi.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium text-neutral-400">
                        <a href="mailto:shubham360upadhyay@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors px-4 py-2 rounded-full bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50">
                            <Mail size={16} />
                            <span>shubham360upadhyay@gmail.com</span>
                        </a>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-800/50 border border-neutral-700/50 cursor-default">
                            <Phone size={16} />
                            <span>+91 8897773251</span>
                        </div>
                        </div>
                    </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer1 />
      </main>
    </div>
  );
}
