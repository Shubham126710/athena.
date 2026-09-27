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
          <div className="mb-12 border border-neutral-900 bg-neutral-900/10 p-5 relative overflow-hidden flex flex-col md:flex-row md:items-start gap-4 animate-in fade-in max-w-4xl">
            <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 flex items-center gap-2 mt-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Announcement
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-2">{announcement.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{announcement.message}</p>
            </div>
            <button 
              onClick={handleDismissAnnouncement}
              className="absolute top-4 right-4 p-1.5 text-neutral-600 hover:text-white transition-colors"
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 content-start">
            
            {/* Primary Module: Upcoming Exam */}
            <div className="col-span-1 lg:col-span-8 flex flex-col">
                <div className="border border-neutral-900 p-8 flex flex-col justify-between group hover:border-neutral-800 transition-colors bg-black h-full">
                    <div className="mb-12">
                        <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-6 font-mono">Upcoming Exam</div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">{upcomingExam.subject}</h2>
                        {upcomingExam.subject !== 'No upcoming exams' && (
                            <div className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
                                Module — {subjects[0]?.code}
                            </div>
                        )}
                    </div>
                    {upcomingExam.subject !== 'No upcoming exams' && (
                    <div className="flex items-end justify-between border-t border-neutral-900 pt-6">
                        <div>
                            <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2 font-mono">Time Remaining</div>
                            <div className="text-2xl font-serif italic text-white">{upcomingExam.daysLeft} Days</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-2 font-mono">Scheduled</div>
                            <div className="text-sm font-medium text-white">{upcomingExam.date}</div>
                        </div>
                    </div>
                    )}
                </div>
            </div>

            {/* Secondary Module: Academic Quote */}
            <div className="col-span-1 lg:col-span-4 flex flex-col">
                <div className="p-8 flex flex-col justify-center border border-neutral-900 bg-neutral-900/5 h-full">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-6 font-mono">Thought</div>
                    <p className="font-serif italic text-xl md:text-2xl text-neutral-300 leading-relaxed mb-6">"{quote.text}"</p>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono">— {quote.author}</span>
                </div>
            </div>
            
            {/* Lower Module: Course Credits */}
            <div className="col-span-1 lg:col-span-7 flex flex-col">
                <div className="border border-neutral-900 bg-black p-8 h-full">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-6 font-mono">Course Credits</div>
                    <div className="space-y-4">
                        {subjects.map((sub, idx) => (
                            <div key={idx} className="flex flex-row items-center justify-between border-b border-neutral-900 pb-4 last:border-0 last:pb-0">
                                <div>
                                    <div className="text-sm md:text-base font-bold text-neutral-200 mb-1">{sub.name}</div>
                                    <div className="flex gap-2 text-[10px] font-mono text-neutral-500 tracking-wider">
                                        <span>{sub.code}</span>
                                        <span>·</span>
                                        <span>{sub.type}</span>
                                    </div>
                                </div>
                                <div className="text-right flex items-center">
                                    <span className="text-white text-sm font-mono tracking-widest">{sub.credits} CR</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lower Secondary: Quick Actions */}
            <div className="col-span-1 lg:col-span-5 flex flex-col">
                <div className="border border-neutral-900 bg-black p-8 h-full flex flex-col">
                    <div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-6 font-mono">Quick Hub Actions</div>
                    <div className="flex-1 flex flex-col gap-3">
                        <button onClick={() => nav('/notes')} className="flex items-center justify-between p-5 border border-neutral-900 hover:bg-neutral-900/20 transition-colors group">
                            <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Study Notes</span>
                            <span className="text-neutral-600 group-hover:text-white transition-colors">→</span>
                        </button>
                        <button onClick={() => nav('/syllabus')} className="flex items-center justify-between p-5 border border-neutral-900 hover:bg-neutral-900/20 transition-colors group">
                            <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Syllabus Prep</span>
                            <span className="text-neutral-600 group-hover:text-white transition-colors">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
