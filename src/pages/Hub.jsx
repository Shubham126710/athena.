import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
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

  useEffect(() => {
    const updateDashboard = () => {
      const now = new Date();
      
      // --- Upcoming Exam Logic ---
      const events = [
        // MST-2 Exams
        { id: 1, title: 'MST-2: FLAT', date: new Date(2025, 9, 11), type: 'exam', time: '15:00', location: 'B4' },
        { id: 2, title: 'MST-2: FML', date: new Date(2025, 9, 13), type: 'exam', time: '10:00', location: 'B4' },
        { id: 3, title: 'MST-2: CN', date: new Date(2025, 9, 13), type: 'exam', time: '12:30', location: 'B4' },
        { id: 4, title: 'MST-2: PA', date: new Date(2025, 9, 14), type: 'exam', time: '10:00', location: 'B4' },
        
        // EST (Final) Exams
        { id: 5, title: 'EST: PA', date: new Date(2025, 10, 20), type: 'exam', time: '09:30', location: 'B4' },
        { id: 6, title: 'EST: FML', date: new Date(2025, 10, 22), type: 'exam', time: '09:30', location: 'B4' },
        { id: 7, title: 'EST: FLAT', date: new Date(2025, 10, 25), type: 'exam', time: '09:30', location: 'B4' },
        { id: 8, title: 'EST: CN', date: new Date(2025, 10, 27), type: 'exam', time: '09:30', location: 'B4' },

        // Placement / Aptitude Exams
        { id: 9, title: 'CUCAT', date: new Date(2025, 11, 16), type: 'exam', time: '10:00', location: 'B4' },
        { id: 10, title: 'AMCAT', date: new Date(2025, 11, 24), type: 'exam', time: '10:00', location: 'B4' },
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

        <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Upcoming Exam Card */}
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-sm relative overflow-hidden group hover:border-neutral-700 transition-colors">
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
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl flex flex-col justify-center items-center text-center">
                <p className="font-serif italic text-xl text-neutral-400 mb-4">{quote.text}</p>
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">— {quote.author}</span>
            </div>
        </div>

      </main>
    </div>
  );
}
