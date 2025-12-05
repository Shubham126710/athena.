import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, BookOpen, Calendar, ArrowRight, Clock, LayoutGrid, Calculator } from 'lucide-react';
import Timetable, { regularSchedule, domainCampSchedule, sectionSchedules } from '../components/Timetable.jsx';
import HubNavbar from '../components/HubNavbar.jsx';
import ConstellationBackground from '../components/ConstellationBackground.jsx';
import SGPACalculator from '../components/SGPACalculator.jsx';
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
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [activeScheduleType, setActiveScheduleType] = useState('domain');
  
  // Determine the correct schedule based on profile section
  const getSchedule = () => {
    if (!profile?.section) return domainCampSchedule;
    
    // If section is 23AML-5, use the toggle logic (regular vs domain)
    if (profile.section === '23AML-5') {
        return activeScheduleType === 'regular' ? regularSchedule : domainCampSchedule;
    }
    
    // For other sections, return their specific schedule if it exists
    if (sectionSchedules[profile.section]) {
        return sectionSchedules[profile.section];
    }
    
    // Fallback
    return domainCampSchedule;
  };

  const currentSchedule = getSchedule();
  
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
  const [nextClass, setNextClass] = useState({ subject: 'No classes', time: '--', room: '--' });
  const [upcomingExam, setUpcomingExam] = useState({ subject: 'No upcoming exams', date: '--', daysLeft: 0 });

  useEffect(() => {
    const updateDashboard = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDay = days[now.getDay()];
      
      // --- Next Class Logic ---
      // Helper to parse time string "09:30 - 10:20 AM" to Date object for today
      const parseTime = (timeStr) => {
        const [start, endPart] = timeStr.split(' - ');
        const [endTime, period] = endPart.split(' ');
        let [hours, minutes] = endTime.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      };

      let todaysClasses = currentSchedule[currentDay] || [];
      let upcoming = todaysClasses.find(cls => parseTime(cls.time) > now);

      if (!upcoming) {
        // Check next day(s)
        let nextDayIndex = (now.getDay() + 1) % 7;
        let nextDay = days[nextDayIndex];
        let count = 0;
        
        while (count < 7) {
            if (currentSchedule[nextDay] && currentSchedule[nextDay].length > 0) {
                upcoming = currentSchedule[nextDay][0];
                // Add day label if it's not today
                upcoming = { ...upcoming, time: `${nextDay}, ${upcoming.time.split(' - ')[0]}` };
                break;
            }
            nextDayIndex = (nextDayIndex + 1) % 7;
            nextDay = days[nextDayIndex];
            count++;
        }
      } else {
          // Format time for display (just start time)
          upcoming = { ...upcoming, time: upcoming.time.split(' - ')[0] + ' ' + upcoming.time.split(' ')[3] };
      }

      if (upcoming) {
        setNextClass(upcoming);
      }

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
  }, [currentSchedule]);

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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Next Class Card */}
            <div className="bg-neutral-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden group border border-neutral-800">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock size={100} />
                </div>
                <div className="relative z-10">
                    <div className="text-sm font-medium text-neutral-400 mb-1">Next Class</div>
                    <h2 className="text-2xl font-bold mb-4">{nextClass.subject}</h2>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="bg-white/10 px-3 py-1 rounded-full">{nextClass.time}</span>
                        <span className="text-neutral-400">{nextClass.room}</span>
                    </div>
                </div>
            </div>

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
                <p className="font-serif italic text-xl text-neutral-400 mb-4">"{quote.text}"</p>
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">— {quote.author}</span>
            </div>
        </div>

        {/* Timetable Section */}
        <div className="mb-12">
            <Timetable 
              scheduleData={currentSchedule} 
              activeType={activeScheduleType} 
              onToggle={setActiveScheduleType}
              userSection={profile?.section}
              isAdmin={profile?.role === 'admin'}
            />
        </div>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Quick Access
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button onClick={() => nav('/notes')} className="group bg-neutral-900 border border-neutral-800 p-6 rounded-lg hover:shadow-md transition-all text-left flex flex-col h-48 justify-between hover:border-neutral-700">
                <div className="p-3 bg-neutral-800 w-fit rounded-lg group-hover:bg-white group-hover:text-black transition-colors text-white">
                    <FileText size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:translate-x-1 transition-transform text-white">My Notes</h3>
                    <p className="text-sm text-neutral-500">Upload and manage your handwritten notes.</p>
                </div>
            </button>

            <button onClick={() => nav('/syllabus')} className="group bg-neutral-900 border border-neutral-800 p-6 rounded-lg hover:shadow-md transition-all text-left flex flex-col h-48 justify-between hover:border-neutral-700">
                <div className="p-3 bg-neutral-800 w-fit rounded-lg group-hover:bg-white group-hover:text-black transition-colors text-white">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:translate-x-1 transition-transform text-white">Syllabus</h3>
                    <p className="text-sm text-neutral-500">Track your curriculum progress.</p>
                </div>
            </button>

            <button onClick={() => nav('/calendar')} className="group bg-neutral-900 border border-neutral-800 p-6 rounded-lg hover:shadow-md transition-all text-left flex flex-col h-48 justify-between hover:border-neutral-700">
                <div className="p-3 bg-neutral-800 w-fit rounded-lg group-hover:bg-white group-hover:text-black transition-colors text-white">
                    <Calendar size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:translate-x-1 transition-transform text-white">Calendar</h3>
                    <p className="text-sm text-neutral-500">View schedule, exams, and holidays.</p>
                </div>
            </button>

            <button onClick={() => setIsCalculatorOpen(true)} className="group bg-neutral-900 border border-neutral-800 p-6 rounded-lg hover:shadow-md transition-all text-left flex flex-col h-48 justify-between hover:border-neutral-700">
                <div className="p-3 bg-neutral-800 w-fit rounded-lg group-hover:bg-white group-hover:text-black transition-colors text-white">
                    <Calculator size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:translate-x-1 transition-transform text-white">SGPA</h3>
                    <p className="text-sm text-neutral-500">Calculate and track your semester GPA.</p>
                </div>
            </button>
        </div>
      </main>

      <SGPACalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </div>
  );
}
