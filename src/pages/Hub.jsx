import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Star, Zap, X, Bell } from 'lucide-react';
import HubNavbar from '../components/HubNavbar.jsx';
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
        
        setGreeting(`${randomGreeting}, ${profile.first_name}`);
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
      const events = [
        { id: 11, title: 'MST-1: Principles of Human Communication', date: new Date(2026, 7, 24), type: 'exam' },
        { id: 12, title: 'MST-1: Computer Vision', date: new Date(2026, 7, 25), type: 'exam' },
        { id: 13, title: 'MST-1: Research Methodology', date: new Date(2026, 7, 28), type: 'exam' },
        { id: 14, title: 'MST-1: Natural Language Processing', date: new Date(2026, 7, 28), type: 'exam' }
      ];

      // Filter for future exams (today or later)
      // Reset time to 00:00:00 for accurate date comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const futureExams = events
        .filter(e => e.type === 'exam' && e.date >= today)
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
      const welcomeNotif = {
        id: 'sem7-welcome',
        title: 'Welcome to 7th Semester! 🚀',
        message: 'Good luck for the final year! Make it count and finish strong. Wishing everyone the best!',
        type: 'info'
      };
      
      const dismissedAnnouncements = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
      if (!dismissedAnnouncements.includes(welcomeNotif.id)) {
        setAnnouncement(welcomeNotif);
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
      <ConstellationBackground />
      {/* Navigation */}
      <HubNavbar />

      <main className="pt-32 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10">
        {announcement && (
          <div className="mb-12 border-t border-b border-neutral-900 py-4 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6 animate-in fade-in">
            <div className="text-[10px] font-mono tracking-widest uppercase text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              SYSTEM MESSAGE
            </div>
            <div className="flex-1 pr-8 md:pr-0">
              <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">{announcement.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">{announcement.message}</p>
            </div>
            <button 
              onClick={handleDismissAnnouncement}
              className="absolute top-4 right-0 md:relative md:top-0 p-1.5 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="mb-16">
            <div className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-4 font-mono">
                Athena / Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white uppercase max-w-xl leading-[1.1]">
                {greeting.split(',')[0]},<br />
                <span className="font-serif italic font-normal text-neutral-300 normal-case">{profile?.first_name || 'Student'}_</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
            
            {/* Primary Module: Upcoming Exam */}
            <div className="col-span-1 md:col-span-7 flex flex-col">
                <div className="border-b border-neutral-800 pb-2 mb-6">
                    <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Upcoming Exam</h3>
                </div>
                <div className="flex-1 border border-neutral-900 p-8 md:p-12 flex flex-col justify-between group hover:border-neutral-800 transition-colors bg-black">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter mb-4">{upcomingExam.subject}</h2>
                        <div className="text-neutral-500 font-mono text-[10px] tracking-widest uppercase">
                            MODULE — {upcomingExam.subject !== 'No upcoming exams' ? subjects[0]?.code : '--'}
                        </div>
                    </div>
                    <div className="mt-12 flex items-end justify-between">
                        <div>
                            <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 mb-1">Time Remaining</div>
                            <div className="text-2xl font-serif italic text-white">{upcomingExam.daysLeft} Days</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 mb-1">Scheduled</div>
                            <div className="text-sm font-medium text-white">{upcomingExam.date}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Module: Academic Quote */}
            <div className="col-span-1 md:col-span-5 flex flex-col">
                <div className="border-b border-neutral-800 pb-2 mb-6">
                    <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Archival Record</h3>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center border border-neutral-900 bg-black/50">
                    <p className="font-serif italic text-xl md:text-2xl text-neutral-300 leading-relaxed mb-6">"{quote.text}"</p>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">— {quote.author}</span>
                </div>
            </div>
            
            {/* Lower Module: Course Credits */}
            <div className="col-span-1 md:col-span-8 flex flex-col">
                 <div className="border-b border-neutral-800 pb-2 mb-6">
                    <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">Course Catalogue / Credits</h3>
                </div>
                <div className="border border-neutral-900 bg-black">
                    {subjects.map((sub, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 border-b border-neutral-900 last:border-0 hover:bg-neutral-900/30 transition-colors">
                            <div className="mb-2 sm:mb-0">
                                <div className="text-sm font-bold text-neutral-200 uppercase tracking-wide mb-1">{sub.name}</div>
                                <div className="flex gap-4 text-[10px] font-mono tracking-widest text-neutral-500">
                                    <span>{sub.code}</span>
                                    <span>TYPE: {sub.type}</span>
                                </div>
                            </div>
                            <div className="text-right flex sm:block items-center gap-2">
                                <span className="text-neutral-500 font-mono text-[10px] tracking-widest sm:hidden">CREDITS: </span>
                                <span className="text-white font-serif italic text-xl">{sub.credits}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lower Secondary: Quick Actions */}
            <div className="col-span-1 md:col-span-4 flex flex-col">
                 <div className="border-b border-neutral-800 pb-2 mb-6">
                    <h3 className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">System Actions</h3>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                    <button onClick={() => nav('/notes')} className="flex-1 flex items-center justify-between p-6 border border-neutral-900 bg-black hover:border-neutral-700 transition-colors group">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">Study Archive</span>
                        <BookOpen size={16} className="text-neutral-600 group-hover:text-white transition-colors" />
                    </button>
                    <button onClick={() => nav('/syllabus')} className="flex-1 flex items-center justify-between p-6 border border-neutral-900 bg-black hover:border-neutral-700 transition-colors group">
                        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">Curriculum</span>
                        <Calendar size={16} className="text-neutral-600 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
