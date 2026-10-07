import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, X, Bell } from 'lucide-react';
import HubNavbar from '../components/HubNavbar.jsx';
import { academicEvents } from '../data/events.js';
import ConstellationBackground from '../components/ConstellationBackground.jsx';
import { useAuth } from '../context/AuthContext';

const QUOTES = [
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "Change is the end result of all true learning.", author: "Leo Buscaglia" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" }
];

export default function HubPage() {
  const nav = useNavigate();
  const { user, profile, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      nav('/login');
    }
  }, [user, loading, nav]);

  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    if (profile?.first_name) {
        const hour = new Date().getHours();
        let timeOptions = [];

        if (hour >= 5 && hour < 12) {
            timeOptions = [
                'Good morning',
                'Rise and shine',
                'Ready to tackle the day',
                'A fresh start today',
                'Early bird gets the worm'
            ];
        }
        else if (hour >= 12 && hour < 17) {
            timeOptions = [
                'Good afternoon',
                'Hope your day is going well',
                'Midday check-in',
                'Keep up the momentum'
            ];
        }
        else if (hour >= 17 && hour < 22) {
            timeOptions = [
                'Good evening',
                'Winding down for the day',
                'Evening productivity session',
                'Hope you had a great day'
            ];
        }
        else {
            timeOptions = [
                'Have a great night',
                "It's a late-night jam session",
                'Burning the midnight oil',
                'Late night learning'
            ];
        }

        const generalOptions = [
            "How're you doing",
            "Welcome back",
            "Happy learning",
            "Good to be back",
            "Ready to focus",
            "Let's get to work"
        ];

        const options = [...timeOptions, ...generalOptions];
        const randomGreeting = options[Math.floor(Math.random() * options.length)];
        
        setGreeting(randomGreeting);
    }
  }, [profile]);

  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [upcomingExam, setUpcomingExam] = useState({ subject: 'No upcoming exams', date: '--', daysLeft: 0 });
  const [announcement, setAnnouncement] = useState(null);
  const subjects = [
    { name: 'Computer Vision', code: '23CSH-437', type: 'Hybrid', credits: 4 },
    { name: 'Natural Language Processing', code: '23CSH-438', type: 'Hybrid', credits: 4 },
    { name: 'Research Methodology', code: '23CST-432', type: 'Theory', credits: 3 },
    { name: 'Principles of Human Communication', code: 'JMO-354', type: 'Theory', credits: 1 }
  ];

  useEffect(() => {
    const updateDashboard = () => {
      const now = new Date();
      
      // --- Upcoming Exam Logic ---
      const events = academicEvents.filter(e => e.type === 'mst' || e.type === 'est');

      // Filter for future exams (today or later)
      // Reset time to 00:00:00 for accurate date comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const futureExams = events
        .filter(e => e.date >= today)
        .sort((a, b) => a.date - b.date);

      if (futureExams.length > 0) {
          const next = futureExams[0];
          const diffTime = next.date - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          setUpcomingExam({
              subject: next.title,
              date: next.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              daysLeft: diffDays
          });
      } else {
           setUpcomingExam({ subject: 'No upcoming exams', date: '--', daysLeft: 0 });
      }
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const showWelcomeAnnouncement = () => {
      const cvNotesNotif = {
        id: 'cv-notes-correction',
        title: 'Correction: CV Unit 1 & 2 Notes 📝',
        message: 'By mistake, the Unit 1 notes for Computer Vision included some notes from Unit 2. Please don\'t be confused if you see common pages across both PDFs. I apologize for the inconvenience!',
        type: 'alert'
      };
      
      const dismissedAnnouncements = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
      if (!dismissedAnnouncements.includes(cvNotesNotif.id)) {
        setAnnouncement(cvNotesNotif);
      }
    };

    if (user) {
      showWelcomeAnnouncement();
    }
  }, [user]);

  const handleDismissAnnouncement = () => {
    if (announcement) {
      const dismissedAnnouncements = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
      dismissedAnnouncements.push(announcement.id);
      localStorage.setItem('dismissed_announcements', JSON.stringify(dismissedAnnouncements));
      setAnnouncement(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black relative">
      
      {/* Sleek Grid & Grain Background (Matches Landing Hero) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '100px 100px',
        }}></div>
        <div className="absolute inset-0 opacity-[0.15]" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)'
        }}></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}></div>
      </div>

      {/* Navigation */}
      <HubNavbar />

      <main className="pt-24 pb-8 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {announcement && (
          <div className="mb-8 bg-black border border-neutral-800 p-5 shadow-sm relative overflow-hidden flex items-start gap-5 animate-in fade-in slide-in-from-top-4">
            <div className="bg-neutral-900/50 border border-neutral-800 text-neutral-300 p-2.5 shrink-0 mt-0.5">
              <Bell size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1 pr-8 pt-1">
              <h3 className="font-bold text-sm uppercase tracking-widest text-white mb-2 font-mono">{announcement.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl font-light">{announcement.message}</p>
            </div>
            <button 
              onClick={handleDismissAnnouncement}
              className="absolute top-4 right-4 p-1.5 text-neutral-600 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="mb-12 border-l border-neutral-800 pl-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[1] text-white mb-4">
                {greeting}, <br className="hidden" />
                <span className="font-serif italic font-normal tracking-tight text-neutral-300">{profile?.first_name || 'Student'}.</span>
            </h1>
            <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest">System Overview / Today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mb-8 border border-neutral-800 bg-neutral-800 gap-[1px] p-[1px]">
            {/* Upcoming Exam Card */}
            <div className="bg-black p-8 relative overflow-hidden group col-span-1 md:col-span-2 hover:bg-neutral-950 transition-colors duration-300">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar size={120} strokeWidth={0.5} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 mb-8 flex items-center gap-2">
                        <span className="w-2 h-2 bg-neutral-600 rounded-full animate-pulse"></span>
                        Upcoming Assessment
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tighter">{upcomingExam.subject}</h2>
                        <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest">
                            <span className="border border-neutral-800 text-neutral-300 px-3 py-1.5">{upcomingExam.date}</span>
                            <span className="text-neutral-500">{upcomingExam.daysLeft} days left</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Quote */}
            <div className="bg-black p-8 flex flex-col justify-center items-center text-center col-span-1 md:col-span-2 group hover:bg-neutral-950 transition-colors duration-300">
                <p className="font-serif italic font-normal tracking-tight text-2xl text-neutral-400 mb-6 leading-relaxed max-w-sm group-hover:text-neutral-300 transition-colors duration-300">"{quote.text}"</p>
                <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">— {quote.author}</span>
            </div>
            
            {/* Course Credits Widget */}
            <div className="bg-black p-8 relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-2 hover:bg-neutral-950 transition-colors duration-300">
                 <div className="flex items-center gap-2 mb-8 border-b border-neutral-900 pb-4">
                    <h3 className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">Course Credits</h3>
                </div>
                <div className="space-y-4">
                    {subjects.map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm group/row">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-neutral-300 group-hover/row:text-white transition-colors tracking-tight">{sub.name}</span>
                                <span className="text-[9px] font-mono text-neutral-500 border border-neutral-800 px-1.5 py-0.5">{sub.code}</span>
                            </div>
                            <span className="text-neutral-400 font-mono text-xs">{sub.credits} <span className="text-[10px] text-neutral-600">CR</span></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions / Important Links */}
            <div className="bg-black p-8 col-span-1 md:col-span-2 lg:col-span-2 flex flex-col hover:bg-neutral-950 transition-colors duration-300">
                 <div className="flex items-center gap-2 mb-8 border-b border-neutral-900 pb-4">
                    <h3 className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                    <button onClick={() => nav('/notes')} className="flex flex-col items-start justify-between bg-neutral-950 border border-neutral-900 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 p-6 group">
                        <BookOpen size={20} strokeWidth={1.5} className="text-neutral-500 group-hover:text-white transition-colors mb-4" />
                        <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400 group-hover:text-white transition-colors">Study Notes</span>
                    </button>
                    <button onClick={() => nav('/syllabus')} className="flex flex-col items-start justify-between bg-neutral-950 border border-neutral-900 hover:border-neutral-700 hover:bg-neutral-900 transition-all duration-300 p-6 group">
                        <Calendar size={20} strokeWidth={1.5} className="text-neutral-500 group-hover:text-white transition-colors mb-4" />
                        <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-400 group-hover:text-white transition-colors">Syllabus Prep</span>
                    </button>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
