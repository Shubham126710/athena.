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
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black relative">
      
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-5%] w-[30%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
      </div>

      <ConstellationBackground />
      {/* Navigation */}
      <HubNavbar />

      <main className="pt-24 pb-8 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {announcement && (
          <div className="mb-6 bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-5 rounded-xl shadow-sm relative overflow-hidden flex items-start gap-5 animate-in fade-in slide-in-from-top-4">
            <div className="bg-neutral-900 border border-red-900/30 text-red-400 p-2.5 rounded-lg shrink-0 mt-0.5">
              <Bell size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1 pr-8 pt-1">
              <h3 className="font-bold text-base text-white mb-1.5 tracking-tight">{announcement.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-3xl">{announcement.message}</p>
            </div>
            <button 
              onClick={handleDismissAnnouncement}
              className="absolute top-4 right-4 p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
                {greeting}, <br className="hidden" />
                <span className="font-serif italic font-normal tracking-tight text-neutral-300">{profile?.first_name || 'Student'}.</span>
            </h1>
            <p className="text-neutral-400 font-light">Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Upcoming Exam Card */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 rounded-xl shadow-sm relative overflow-hidden group hover:border-neutral-700/80 transition-all duration-300 col-span-1 md:col-span-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar size={100} strokeWidth={0.5} />
                </div>
                <div className="relative z-10">
                    <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">Upcoming Exam</div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white tracking-tight">{upcomingExam.subject}</h2>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="bg-red-900/30 text-red-400 px-3 py-1.5 rounded-full font-medium tracking-wide">{upcomingExam.date}</span>
                        <span className="text-neutral-500 font-medium">{upcomingExam.daysLeft} days left</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Quote */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 rounded-xl flex flex-col justify-center items-center text-center col-span-1 md:col-span-2 group hover:border-neutral-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <p className="font-serif italic font-normal tracking-tight text-xl text-neutral-300 mb-4 leading-relaxed max-w-sm group-hover:text-white transition-colors duration-300">"{quote.text}"</p>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">— {quote.author}</span>
            </div>
            
            {/* Course Credits Widget */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 rounded-xl relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-2 hover:border-neutral-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                 <div className="flex items-center gap-2 mb-4 mt-2">
                    <h3 className="font-bold text-lg text-white">Course Credits</h3>
                </div>
                <div className="space-y-3">
                    {subjects.map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-2 last:border-0 last:pb-0 group/row hover:bg-white/[0.02] -mx-2 px-2 py-1 rounded transition-colors">
                            <div>
                                <span className="font-medium text-neutral-200 group-hover/row:text-white transition-colors">{sub.name}</span>
                                <span className="ml-2 text-[10px] text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded-sm">{sub.code}</span>
                                <span className="ml-2 text-xs text-neutral-500 bg-neutral-800/30 px-2 py-0.5 rounded-sm">{sub.type}</span>
                            </div>
                            <span className="text-neutral-400 font-bold">{sub.credits} <span className="font-normal text-xs uppercase">Cr</span></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions / Important Links */}
            <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800/60 p-6 rounded-xl col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-center hover:border-neutral-700/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                 <div className="flex items-center gap-2 mb-4 mt-2">
                    <h3 className="font-bold text-lg text-white">Quick Hub Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => nav('/notes')} className="flex flex-col items-center justify-center gap-3 bg-neutral-900/50 border border-neutral-800/60 hover:border-neutral-600 hover:bg-neutral-800/80 transition-all duration-300 px-4 py-8 rounded-lg group hover:-translate-y-1 shadow-sm hover:shadow-md">
                        <BookOpen size={24} className="text-neutral-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="font-medium text-sm text-neutral-300 group-hover:text-white transition-colors">Study Notes</span>
                    </button>
                    <button onClick={() => nav('/syllabus')} className="flex flex-col items-center justify-center gap-3 bg-neutral-900/50 border border-neutral-800/60 hover:border-neutral-600 hover:bg-neutral-800/80 transition-all duration-300 px-4 py-8 rounded-lg group hover:-translate-y-1 shadow-sm hover:shadow-md">
                        <Calendar size={24} className="text-neutral-400 group-hover:text-red-400 transition-colors" />
                        <span className="font-medium text-sm text-neutral-300 group-hover:text-white transition-colors">Syllabus Prep</span>
                    </button>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
