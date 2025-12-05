import React from 'react';
import { useNavigate } from 'react-router-dom';
import DitherHero from '../components/DitherHero.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx';
import MarqueeStrip from '../components/MarqueeStrip.jsx';
import { ArrowRight, Box, Database, Layers, Zap, Shield, Cpu, Instagram, Twitter, Linkedin, Mail, Phone, AtSign, Github, Book, Calendar, Search, Users, Lock, Brain, Clock, Menu, X } from 'lucide-react';

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
    <div className="min-h-screen font-sans bg-neutral-950 text-white selection:bg-white selection:text-black relative">
      {showLoader && <LoadingScreen />}
      
      {/* Grid Background */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0 pointer-events-none animate-grid" style={{
          backgroundImage: 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)'
       }}></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        {/* Updated Navbar */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm" />
          <span className="font-serif font-bold tracking-tight text-xl">athena.</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
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

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 md:px-12 min-h-[80vh] grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl relative z-10">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-8 text-white min-h-[240px]">
              Your digital<br />
              academic <span className="text-neutral-500">{text}</span><span className="animate-pulse">_</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-10 leading-relaxed font-light">
              Build, connect, and scale intelligent workflows — all from one place.
            </p>
            <button onClick={() => nav('/hub')} className="group flex items-center gap-2 px-8 py-4 bg-white text-black rounded-sm text-base font-medium hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Dither Graphic */}
          <div className="relative h-[500px] w-full bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
             <DitherHero color="#ffffff" backgroundColor="#0a0a0a" />
             {/* Overlay UI Mockup */}
             <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent pointer-events-none"></div>
          </div>
        </section>

        {/* Logos Strip / Marquee */}
        <MarqueeStrip />

        {/* 1. About / Goal Section */}
        <section id="about" className="py-32 bg-neutral-950">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-white">The Goal</h2>
              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light italic">
                "I named this project Athena after the Greek goddess of wisdom, since I have always been fascinated by Greek mythology ever since I read the Percy Jackson series when I was in my 6th grade. I want Athena to be just that, a personification of wisdom, a companion for your academic needs."
              </p>
            </div>
          </div>
        </section>

        {/* 2. Features Section (Bento Grid) */}
        <section id="features" className="bg-neutral-950 text-white py-32 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-900/30 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="container mx-auto px-6 md:px-12 text-center mb-24 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Forged for Wisdom</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
              A suite of tools designed to elevate your intellect and streamline your academic pursuit.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Card 1: Knowledge Vault (Large) */}
            <SpotlightCard className="md:col-span-2 p-8 md:p-12 min-h-[300px] flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Book size={200} strokeWidth={0.5} />
                </div>
                <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Database className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Digital Library</h3>
                    <p className="text-neutral-400 leading-relaxed max-w-md">
                        Your personal archive. Upload handwritten notes, organize them by subject, and access your study materials from any device.
                    </p>
                </div>
            </SpotlightCard>

            {/* Card 2: Chronos Timeline */}
            <SpotlightCard className="p-8 md:p-12 min-h-[300px] flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Calendar size={150} strokeWidth={0.5} />
                </div>
                <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Academic Planner</h3>
                    <p className="text-neutral-400 leading-relaxed">
                        Stay ahead of deadlines. Track your exams, assignments, and lecture schedules in one view.
                    </p>
                </div>
            </SpotlightCard>

            {/* Card 3: Neural Link */}
            <SpotlightCard className="p-8 md:p-12 min-h-[300px] flex flex-col justify-between group">
                <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Smart Organization</h3>
                    <p className="text-neutral-400 leading-relaxed">
                        Find what you need. Tag your notes by topic or unit to keep your revision efficient.
                    </p>
                </div>
            </SpotlightCard>

            {/* Card 4: Fortified Access (Large) */}
            <SpotlightCard className="md:col-span-2 p-8 md:p-12 min-h-[300px] flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                    <Shield size={200} strokeWidth={0.5} />
                </div>
                <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Lock className="text-white" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Secure & Private</h3>
                    <p className="text-neutral-400 leading-relaxed max-w-md">
                        Your academic records are yours alone. Built with modern authentication to ensure your notes and data stay private.
                    </p>
                </div>
            </SpotlightCard>

          </div>
        </section>

        {/* 3. Contact Section */}
        <section id="contact" className="py-24 bg-neutral-900 border-t border-neutral-800">
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-8 text-white">Contact</h2>
              
              <SpotlightCard className="p-8 md:p-12 text-left relative overflow-hidden group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <AtSign size={200} strokeWidth={0.5} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-24 h-24 bg-neutral-800 rounded-full overflow-hidden border-2 border-neutral-700 flex-shrink-0">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Shubham" alt="Shubham" className="w-full h-full object-cover" />
                    </div>
                    
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
        <footer className="relative bg-neutral-950 text-neutral-400 pt-32 pb-20">
            {/* Wave Top */}
            <div className="absolute top-0 left-0 right-0 w-full -mt-1 overflow-hidden leading-none">
                 <svg viewBox="0 0 1440 54" className="w-full fill-neutral-900 block" preserveAspectRatio="none">
                    <path d="M0,54 C280,0 400,0 720,54 C1040,0 1160,0 1440,54 V0 H0 V54 Z" />
                 </svg>
            </div>

            <div className="container mx-auto px-6 md:px-12">
                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand Column (2 cols wide) */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6 text-white">
                            <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm" />
                            <span className="font-serif font-bold tracking-tight text-xl">athena.</span>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <a href="https://www.instagram.com/iamshubham_15" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.threads.net/@iamshubham_15" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <AtSign size={20} />
                            </a>
                            <a href="https://twitter.com/iamshubham_15" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/shubham-upadhyay-a12a9428b/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://github.com/Shubham126710" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                                <Github size={20} />
                            </a>
                        </div>
                        <a href="mailto:shubham360upadhyay@gmail.com" className="text-sm hover:text-white transition-colors">
                            shubham360upadhyay@gmail.com
                        </a>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm">
                            <li><button onClick={() => nav('/hub')} className="hover:text-white transition-colors">Hub</button></li>
                            <li><button onClick={() => nav('/notes')} className="hover:text-white transition-colors">Notes</button></li>
                            <li><button onClick={() => nav('/syllabus')} className="hover:text-white transition-colors">Syllabus</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
                    <p>© 2025 Athena. All rights reserved.</p>
                    <p>Designed & Built by Shubham Upadhyay</p>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}
