import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Star, Zap } from 'lucide-react';
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
        let timeGreeting = 'Welcome back';

        if (hour >= 5 && hour < 12) timeGreeting = 'Good morning';
        else if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
        else if (hour >= 17 && hour < 22) timeGreeting = 'Good evening';
        else timeGreeting = 'Have a great night';

        const options = [
            timeGreeting,
            "How're you doing",
            "Welcome back",
            "Happy learning",
            "Good to be back",
            "Ready to focus",
            "Let's get to work"
        ];

        const randomGreeting = options[Math.floor(Math.random() * options.length)];
        setGreeting(`${randomGreeting}, ${profile.first_name}`);
    }
  }, [profile]);

  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [upcomingExam, setUpcomingExam] = useState({ subject: 'No upcoming exams', date: '--', daysLeft: 0 });
  const subjects = [
    { name: 'Software Engineering', code: '23CSH-374', type: 'Hybrid', credits: 4 },
    { name: 'Artificial Intelligence', code: '23CSH-378', type: 'Hybrid', credits: 4 },
    { name: 'Advanced Machine Learning', code: '23CSH-379', type: 'Hybrid', credits: 4 },
    { name: 'System Design', code: '23CST-390', type: 'Theory', credits: 3 },
    { name: 'Full Stack II', code: '23CSH-382', type: 'Hybrid', credits: 3 }
  ];

  useEffect(() => {
    const updateDashboard = () => {
      const now = new Date();
      
      // --- Upcoming Exam Logic ---
      const events = [
        // Upcoming EST Exams (May 2026)
        { id: 11, title: 'EST: Artificial Intelligence', date: new Date(2026, 4, 2), type: 'exam' },
        { id: 12, title: 'EST: Software Engineering', date: new Date(2026, 4, 5), type: 'exam' },
        { id: 13, title: 'EST: Aptitude-IV', date: new Date(2026, 4, 7), type: 'exam' },
        { id: 14, title: 'EST: Adv Machine Learning', date: new Date(2026, 4, 12), type: 'exam' },
        { id: 15, title: 'EST: System Design', date: new Date(2026, 4, 14), type: 'exam' },
        { id: 16, title: 'EST: LTM', date: new Date(2026, 4, 16), type: 'exam' },
        { id: 17, title: 'EST: Full Stack-II', date: new Date(2026, 4, 19), type: 'exam' },
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

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black relative">
      <ConstellationBackground />
      {/* Navigation */}
      <HubNavbar />

      <main className="pt-32 pb-12 px-6 md:px-12 container mx-auto relative z-10">
        <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">{greeting}.</h1>
            <p className="text-neutral-400">Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Upcoming Exam Card */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-sm relative overflow-hidden group hover:border-neutral-700 transition-colors col-span-1 md:col-span-2">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar size={100} />
                </div>
                <div className="relative z-10">
                    <div className="text-sm font-medium text-neutral-500 mb-1">Upcoming Exam</div>
                    <h2 className="text-2xl font-bold mb-4 text-white">{upcomingExam.subject}</h2>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full font-medium">{upcomingExam.date}</span>
                        <span className="text-neutral-500">{upcomingExam.daysLeft} days left</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats / Quote */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex flex-col justify-center items-center text-center col-span-1 md:col-span-2">
                <p className="font-serif italic text-lg text-neutral-400 mb-4">"{quote.text}"</p>
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">— {quote.author}</span>
            </div>
            
            {/* Course Credits Widget */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl relative overflow-hidden col-span-1 md:col-span-2 lg:col-span-2">
                 <div className="flex items-center gap-2 mb-4 mt-2">
                    <h3 className="font-bold text-lg text-white">Course Credits</h3>
                </div>
                <div className="space-y-3">
                    {subjects.map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-b border-neutral-800 pb-2 last:border-0 last:pb-0">
                            <div>
                                <span className="font-medium text-neutral-200">{sub.name}</span>
                                <span className="ml-2 text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-sm">{sub.code}</span>
                                <span className="ml-2 text-xs text-neutral-500 bg-neutral-800/50 px-2 py-0.5 rounded-sm">{sub.type}</span>
                            </div>
                            <span className="text-neutral-400 font-bold">{sub.credits} <span className="font-normal text-xs uppercase">Cr</span></span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions / Important Links */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 p-6 rounded-xl col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-6 mt-2">
                    <h3 className="font-bold text-lg text-white">Quick Hub Actions</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => nav('/notes')} className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 transition px-4 py-6 rounded-lg group">
                        <BookOpen size={20} className="text-neutral-400 group-hover:text-white transition" />
                        <span className="font-medium text-sm">Study Notes</span>
                    </button>
                    <button onClick={() => nav('/syllabus')} className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 transition px-4 py-6 rounded-lg group">
                        <Calendar size={20} className="text-neutral-400 group-hover:text-white transition" />
                        <span className="font-medium text-sm">Syllabus Prep</span>
                    </button>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
