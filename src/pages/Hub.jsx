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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black relative flex flex-col">
      <ConstellationBackground />
      {/* Navigation */}
      <HubNavbar />

      <main className="flex-1 px-6 md:px-12 max-w-[1400px] mx-auto w-full relative z-10 flex flex-col py-8 pt-24">
        {announcement && (
          <div className="mb-12 relative flex flex-col md:flex-row md:items-center gap-4 animate-in fade-in max-w-4xl p-4 border border-red-900/30 bg-red-950/5 rounded-md shadow-[0_0_15px_rgba(220,38,38,0.03)]">
            <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-red-950/50 border border-red-900/50 text-red-500">
              <Bell size={14} />
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h3 className="text-sm font-bold text-white shrink-0">{announcement.title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed truncate">{announcement.message}</p>
            </div>
            <button 
              onClick={handleDismissAnnouncement}
              className="absolute top-4 right-4 md:static p-1 text-neutral-600 hover:text-white transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-300 leading-tight">
                {greeting.split(',')[0]},<br />
                <span className="font-serif italic text-white">{profile?.first_name || 'Student'}.</span>
            </h1>
            <p className="text-neutral-500 mt-2">Here's what's happening today.</p>
        </div>
        <hr className="border-neutral-900 my-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 flex-1 content-start">
            
            {/* Primary Module: Upcoming Exam */}
            <div className="flex flex-col">
                <div className="flex flex-col justify-between h-full group">
                    <div className="mb-12">
                        <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-500 mb-6">Upcoming Exam</div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">{upcomingExam.subject}</h2>
                                {upcomingExam.subject !== 'No upcoming exams' && (
                                    <div className="text-neutral-500 text-base">
                                        Module — {subjects[0]?.code}
                                    </div>
                                )}
                            </div>
                            {upcomingExam.subject === 'No upcoming exams' && (
                                <Calendar size={48} className="text-neutral-900 shrink-0" strokeWidth={1} />
                            )}
                        </div>
                    </div>
                    {upcomingExam.subject !== 'No upcoming exams' && (
                    <div className="flex items-end justify-between border-t border-neutral-900 pt-6">
                        <div>
                            <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-500 mb-2">Time Remaining</div>
                            <div className="text-2xl md:text-3xl font-serif italic text-white">{upcomingExam.daysLeft} Days</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-500 mb-2">Scheduled</div>
                            <div className="text-base font-medium text-white">{upcomingExam.date}</div>
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* Secondary Module: Academic Quote */}
            <div className="flex flex-col">
                <div className="flex flex-col justify-center h-full pt-8 lg:pt-0 lg:pl-12 border-t lg:border-t-0 lg:border-l border-neutral-900">
                    <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-500 mb-6">Thought</div>
                    <p className="font-serif italic text-xl md:text-2xl text-neutral-300 leading-relaxed mb-6">"{quote.text}"</p>
                    <span className="text-[11px] font-medium tracking-widest uppercase text-neutral-500">— {quote.author}</span>
                </div>
            </div>
        </div>

        <hr className="border-neutral-900 my-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 flex-1 content-start">
            
            {/* Lower Module: Course Credits */}
            <div className="flex flex-col">
                <div className="flex flex-col h-full">
                    <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-500 mb-6">Course Credits</div>
                    <div className="space-y-6 border-t border-neutral-900 pt-6">
                        {subjects.map((sub, idx) => (
                            <div key={idx} className="flex flex-row items-center justify-between border-b border-neutral-900 pb-6 last:border-0 last:pb-0">
                                <div className="flex gap-6 items-start">
                                    <div className="text-lg font-serif italic text-neutral-500 mt-1">{(idx+1).toString().padStart(2, '0')}</div>
                                    <div>
                                        <div className="text-lg font-bold text-neutral-200 mb-1">{sub.name}</div>
                                        <div className="flex gap-2 text-sm text-neutral-500">
                                            <span>{sub.code}</span>
                                            <span>·</span>
                                            <span>{sub.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center">
                                    <span className="text-white text-lg font-medium">{sub.credits} CR</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lower Secondary: Quick Actions */}
            <div className="flex flex-col">
                <div className="flex flex-col h-full lg:pl-12 border-t lg:border-t-0 lg:border-l border-neutral-900">
                    <div className="text-[11px] font-medium tracking-widest uppercase text-neutral-500 mb-6">Quick Actions</div>
                    <div className="flex-1 flex flex-col sm:flex-row gap-4 pt-4">
                        <button onClick={() => nav('/notes')} className="flex-1 flex items-center justify-center gap-3 p-6 bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 transition-colors rounded-sm group">
                            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-300 group-hover:text-white transition-colors">Study Notes</span>
                        </button>
                        <button onClick={() => nav('/syllabus')} className="flex-1 flex items-center justify-center gap-3 p-6 bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 transition-colors rounded-sm group">
                            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-300 group-hover:text-white transition-colors">Syllabus Prep</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
