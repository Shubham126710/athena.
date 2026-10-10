import { safeGetStorage, safeSetStorage, safeRemoveStorage } from '../utils/storage.js';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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


  const containerRef = useRef();
  
  useGSAP(() => {
      gsap.set('.dashboard-card, .dashboard-greeting', { opacity: 0 });
      
      gsap.fromTo('.dashboard-card', 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2, clearProps: 'all' }
      );
      
      gsap.fromTo('.dashboard-greeting', 
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out', clearProps: 'all' }
      );
  }, { scope: containerRef });

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
      
      const dismissedAnnouncements = JSON.parse(safeGetStorage('dismissed_announcements') || '[]');
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
      const dismissedAnnouncements = JSON.parse(safeGetStorage('dismissed_announcements') || '[]');
      dismissedAnnouncements.push(announcement.id);
      safeSetStorage('dismissed_announcements', JSON.stringify(dismissedAnnouncements));
      setAnnouncement(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black relative">
      <ConstellationBackground />
      {/* Navigation */}
      <HubNavbar />

      <main ref={containerRef} className="pt-[5.5rem] pb-4 px-6 md:px-8 lg:px-12 max-w-7xl mx-auto relative z-10 min-h-screen flex flex-col">
        {announcement && (
          <div className="mb-4 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-4 rounded-xl shadow-sm relative overflow-hidden flex items-start gap-4 animate-in fade-in slide-in-from-top-4 shrink-0">
            <div className="bg-neutral-900 border border-red-900/30 text-red-400 p-2.5 rounded-xl shrink-0 mt-0.5">
              <Bell size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1 pr-8 pt-1">
              <h3 className="font-bold text-base text-white mb-1.5 tracking-tight">{announcement.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl font-light">{announcement.message}</p>
            </div>
            <button 
              onClick={handleDismissAnnouncement}
              className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="mb-4 shrink-0">
            <h1 className="dashboard-greeting text-3xl md:text-4xl font-bold tracking-tight leading-[1] text-white mb-2">
                {greeting}, <br className="hidden" />
                <span className="font-serif italic font-normal tracking-tight text-neutral-300">{profile?.first_name || 'Student'}.</span>
            </h1>
            <p className="text-neutral-400 font-light">Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 flex-grow">
            {/* Upcoming Exam Card */}
            <div className="dashboard-card bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800 p-5 rounded-xl relative overflow-hidden group hover:border-neutral-700 transition-colors duration-300 col-span-1 md:col-span-2">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar size={100} strokeWidth={0.5} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="mb-4">
                        <h3 className="font-serif italic text-xl text-neutral-400">Upcoming Exam</h3>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold mb-3 text-white tracking-tight">{upcomingExam.subject}</h2>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="bg-neutral-900 border border-neutral-700 text-neutral-200 px-3 py-1 rounded-full">{upcomingExam.date}</span>
                            <span className="text-neutral-500">{upcomingExam.daysLeft} days left</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Quote */}
            <div className="dashboard-card bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800 p-5 rounded-xl flex flex-col justify-center items-center text-center col-span-1 md:col-span-2 group hover:border-neutral-700 transition-colors duration-300">
                <p className="font-serif italic font-normal tracking-tight text-xl text-neutral-300 mb-4 leading-relaxed max-w-sm group-hover:text-white transition-colors duration-300">"{quote.text}"</p>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">— {quote.author}</span>
            </div>
            
            {/* Course Credits Widget */}
            <div className="dashboard-card bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800 p-5 rounded-xl relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-2 hover:border-neutral-700 transition-colors duration-300">
                 <div className="mb-4">
                    <h3 className="font-serif italic text-xl text-neutral-400">Course Credits</h3>
                </div>
                <div className="space-y-3">
                    {subjects.map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-neutral-900 pb-2 last:border-0 last:pb-0 group/row">
                            <div className="flex items-center gap-3">
                                <span className="font-medium text-neutral-300 group-hover/row:text-white transition-colors">{sub.name}</span>
                                <span className="text-[10px] text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-md border border-neutral-800">{sub.code}</span>
                            </div>
                            <span className="text-neutral-400 font-bold">{sub.credits} <span className="text-[10px] uppercase font-normal text-neutral-600">CR</span></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions / Important Links */}
            <div className="dashboard-card bg-[#0a0a0a]/80 backdrop-blur-xl border border-neutral-800 p-5 rounded-xl col-span-1 md:col-span-2 lg:col-span-2 flex flex-col hover:border-neutral-700 transition-colors duration-300">
                 <div className="mb-4">
                    <h3 className="font-serif italic text-xl text-neutral-400">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1">
                    <button onClick={() => nav('/notes')} className="flex flex-col items-start justify-between bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 transition-all duration-300 p-5 rounded-xl group">
                        <BookOpen size={20} strokeWidth={1.5} className="text-neutral-500 group-hover:text-white transition-colors mb-2" />
                        <span className="font-medium text-sm text-neutral-400 group-hover:text-white transition-colors">Study Notes</span>
                    </button>
                    <button onClick={() => nav('/syllabus')} className="flex flex-col items-start justify-between bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 transition-all duration-300 p-5 rounded-xl group">
                        <Calendar size={20} strokeWidth={1.5} className="text-neutral-500 group-hover:text-white transition-colors mb-2" />
                        <span className="font-medium text-sm text-neutral-400 group-hover:text-white transition-colors">Syllabus Prep</span>
                    </button>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
