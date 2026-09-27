import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, MapPin, X, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HubNavbar from '../components/HubNavbar.jsx';

export default function CalendarPage() {
  const nav = useNavigate();
  const [date, setDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(null);
  
  // Events state
  const [events, setEvents] = React.useState([
    // Academic Calendar: ODD SEMESTER JUL-DEC 2026
    { id: 1, title: 'Registration 2nd Year onwards', date: new Date(2026, 6, 1), type: 'academic', time: 'All Day', location: 'Online' },
    { id: 2, title: 'Start of Sem (2nd & 4th Yr)', date: new Date(2026, 6, 14), type: 'academic', time: '09:30', location: 'Campus' },
    { id: 3, title: 'Start of Sem (3rd & 5th Yr)', date: new Date(2026, 6, 15), type: 'academic', time: '09:30', location: 'Campus' },
    { id: 4, title: 'Orientation 1st Year Batch I', date: new Date(2026, 6, 20), type: 'event', time: '09:00', location: 'Campus' },
    { id: 5, title: 'Start of Sem (1st Yr Batch I)', date: new Date(2026, 6, 21), type: 'academic', time: '09:30', location: 'Campus' },
    { id: 61, title: 'MST-1: Principles of Human Comm.', date: new Date(2026, 7, 24), type: 'mst', time: '12:30', location: 'C1 (Online-CBT)' },
    { id: 62, title: 'MST-1: Computer Vision', date: new Date(2026, 7, 25), type: 'mst', time: '15:00', location: 'D7 (Offline)' },
    { id: 7, title: 'Start of Sem (1st Yr Batch II)', date: new Date(2026, 7, 25), type: 'academic', time: '09:30', location: 'Campus' },
    { id: 63, title: 'MST-1: Research Methodology', date: new Date(2026, 7, 28), type: 'mst', time: '12:30', location: 'B3 (Online-CBT)' },
    { id: 64, title: 'MST-1: Natural Language Proc.', date: new Date(2026, 7, 28), type: 'mst', time: '15:00', location: 'D7 (Offline)' },
    { id: 8, title: 'Fresher\'s Party 2026', date: new Date(2026, 8, 18), type: 'event', time: '17:00', location: 'Campus' },
    { id: 9, title: 'Practical IST', date: new Date(2026, 8, 28), type: 'mst', time: '09:30', location: 'Labs' },
    { id: 10, title: 'In-Semester Test 2 (IST-2)', date: new Date(2026, 9, 12), type: 'mst', time: '09:30', location: 'Offline' },
    { id: 11, title: 'Diwali Break Starts', date: new Date(2026, 10, 9), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 12, title: 'Last Teaching Day', date: new Date(2026, 10, 13), type: 'academic', time: '17:00', location: 'Campus' },
    { id: 13, title: 'End Sem Practical Exams', date: new Date(2026, 10, 16), type: 'est', time: '09:30', location: 'Labs' },
    { id: 14, title: 'End Sem Theory Exams', date: new Date(2026, 10, 23), type: 'est', time: '09:30', location: 'Offline' },
    { id: 15, title: 'Winter Term Starts', date: new Date(2026, 11, 15), type: 'academic', time: '09:00', location: 'Campus' },
    { id: 16, title: 'End of Semester', date: new Date(2026, 11, 19), type: 'academic', time: '17:00', location: 'Campus' },

    // Major Indian Festivals & Holidays 2026 (Aug - Dec)
    { id: 208, title: 'Independence Day', date: new Date(2026, 7, 15), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 209, title: 'Raksha Bandhan', date: new Date(2026, 7, 28), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 210, title: 'Janmashtami', date: new Date(2026, 8, 3), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 211, title: 'Gandhi Jayanti', date: new Date(2026, 9, 2), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 212, title: 'Dussehra', date: new Date(2026, 9, 18), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 213, title: 'Diwali', date: new Date(2026, 10, 8), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 214, title: 'Guru Nanak Jayanti', date: new Date(2026, 10, 24), type: 'holiday', time: 'All Day', location: 'India' },
    { id: 215, title: 'Christmas Day', date: new Date(2026, 11, 25), type: 'holiday', time: 'All Day', location: 'India' }
  ]);

  React.useEffect(() => {
     // Fetch Public Holidays for India for 2026 and merge them
     const currentYear = new Date().getFullYear();
     Promise.all([
       fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/IN`).then(r => r.json()).catch(() => []),
       fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear + 1}/IN`).then(r => r.json()).catch(() => [])
     ])
     .then(([data1, data2]) => {
        const allHolidays = [...data1, ...data2];
        const apiEvents = allHolidays.map((h, i) => {
            // Some dates from Nager arrive as strings like "2026-01-26". Parse safely:
            const [y, m, d] = h.date.split('-');
            return {
                id: 100 + i,
                title: h.name,
                date: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)),
                type: 'holiday',
                time: 'All Day',
                location: 'India'
            };
        });
        
        setEvents(prev => [...prev, ...apiEvents]);
     })
     .catch(console.error);
  }, []);

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  const nextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));

  const getDayEvents = (day) => {
    return events.filter(e => 
      e.date.getDate() === day && 
      e.date.getMonth() === date.getMonth() && 
      e.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventStyle = (type) => {
    switch(type) {
        case 'mst': return 'bg-indigo-900/30 border-indigo-800 text-indigo-300';
        case 'est': return 'bg-rose-900/30 border-rose-800 text-rose-300';
        case 'exam': return 'bg-amber-900/30 border-amber-800 text-amber-300';
        case 'event': return 'bg-emerald-900/30 border-emerald-800 text-emerald-300';
        case 'academic': 
        default: return 'bg-blue-900/30 border-blue-800 text-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <HubNavbar />

      <main className="pt-24 pb-8 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="mb-12">
            <div className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-4 font-mono">
                Athena / Calendar
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white uppercase max-w-xl leading-[1.1] mb-2 flex items-center gap-4">
                {monthNames[date.getMonth()]}
                <span className="font-serif italic font-normal text-neutral-300 normal-case">{date.getFullYear()}</span>
            </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Calendar Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-900 pb-4">
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="px-4 py-2 border border-neutral-800 text-[10px] font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-colors">Prev</button>
                        <button onClick={nextMonth} className="px-4 py-2 border border-neutral-800 text-[10px] font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-colors">Next</button>
                    </div>
                    
                    {/* Legends */}
                    <div className="flex flex-wrap gap-4 text-[9px] font-mono tracking-widest uppercase">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <div className="w-1 h-1 bg-indigo-500 rounded-sm"></div> MST
                        </div>
                        <div className="flex items-center gap-2 text-rose-400">
                            <div className="w-1 h-1 bg-rose-500 rounded-sm"></div> EST
                        </div>
                        <div className="flex items-center gap-2 text-amber-400">
                            <div className="w-1 h-1 bg-amber-500 rounded-sm"></div> OTHER EXAMS
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400">
                            <div className="w-1 h-1 bg-emerald-500 rounded-sm"></div> EVENTS
                        </div>
                        <div className="flex items-center gap-2 text-blue-400">
                            <div className="w-1 h-1 bg-blue-500 rounded-sm"></div> ACADEMIC
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-black">
                    <div className="grid grid-cols-7 gap-y-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="bg-black p-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest text-center">
                                {d}
                            </div>
                        ))}
                        
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-neutral-950/50 h-32"></div>
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const currentDayDate = new Date(date.getFullYear(), date.getMonth(), day);
                            const dayEvents = getDayEvents(day);
                            const isToday = new Date().getDate() === day && new Date().getMonth() === date.getMonth() && new Date().getFullYear() === date.getFullYear();
                            const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === date.getMonth();

                            return (
                                <div 
                                    key={day} 
                                    onClick={() => setSelectedDate(currentDayDate)}
                                    className={`h-32 p-2 transition-all duration-200 relative group cursor-pointer border-t border-neutral-900/50 hover:bg-neutral-900/20
                                        ${isToday ? 'bg-neutral-900/30' : 'bg-black'}
                                        ${isSelected ? 'ring-1 ring-inset ring-white/50 bg-neutral-900/40' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-mono tracking-widest transition-all duration-300 ${isToday ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`}>
                                            {day}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="text-[10px] font-bold text-neutral-600 bg-neutral-900/50 px-1.5 rounded md:hidden">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-2 flex flex-col gap-1.5">
                                        {dayEvents.slice(0, 2).map(ev => (
                                            <div key={ev.id} className={`group/event relative text-[10px] px-2 py-1 rounded-sm border-none truncate font-medium transition-transform hover:scale-[1.02] ${getEventStyle(ev.type)}`}>
                                                {ev.title}
                                                
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-neutral-950 border border-neutral-800 rounded-lg p-3 shadow-xl z-20 opacity-0 group-hover/event:opacity-100 transition-opacity pointer-events-none hidden md:block">
                                                    <div className="font-bold text-sm mb-1 text-white">{ev.title}</div>
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-neutral-400 flex items-center gap-2">
                                                            <Clock size={12} /> {ev.time}
                                                        </div>
                                                        {ev.location && (
                                                            <div className="text-xs text-neutral-400 flex items-center gap-2">
                                                                <MapPin size={12} /> {ev.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Arrow */}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-950"></div>
                                                </div>
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-[10px] text-neutral-500 pl-1">
                                                +{dayEvents.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Sidebar: Upcoming */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="flex-1 p-6 sticky top-24 bg-neutral-900/5 rounded-sm">
                    <h2 className="text-2xl font-bold tracking-tight mb-8 text-white">
                        Upcoming Events
                    </h2>
                    <div className="space-y-6 relative">
                        {/* Timeline line */}
                        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-neutral-900"></div>

                        {events.filter(e => e.date >= new Date()).sort((a,b) => a.date - b.date).slice(0, 5).map((ev, idx) => (
                            <div key={ev.id} className="relative flex gap-6 items-start group cursor-pointer">
                                <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-black border border-neutral-800 flex items-center justify-center z-10 group-hover:border-white transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-white transition-colors"></div>
                                </div>
                                <div className="flex-1 pb-6 border-b border-neutral-900/50 group-last:border-0 group-last:pb-0">
                                    <div className="text-xs font-medium text-neutral-500 mb-1">
                                        {ev.date.getDate()} {monthNames[ev.date.getMonth()].substring(0,3)}
                                    </div>
                                    <div className="font-bold text-sm text-neutral-200 group-hover:text-white transition-colors">{ev.title}</div>
                                    <div className="text-[10px] font-mono text-neutral-600 mt-2 flex flex-col gap-1">
                                        <span className="uppercase tracking-widest">T: {ev.time}</span>
                                        {ev.location && (
                                            <span className="uppercase tracking-widest">L: {ev.location}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {events.filter(e => e.date >= new Date()).length === 0 && (
                            <p className="text-sm font-mono text-neutral-500">No upcoming events.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Day Details Modal */}
        {selectedDate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedDate(null)}>
                <div 
                    className="bg-neutral-950 border border-neutral-800 rounded-xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" 
                    onClick={e => e.stopPropagation()}
                >
                    <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
                            </h3>
                            <p className="text-neutral-500 text-xs font-medium uppercase tracking-wider">{selectedDate.getFullYear()}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedDate(null)}
                            className="p-1.5 hover:bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="p-5 max-h-[60vh] overflow-y-auto">
                        {getDayEvents(selectedDate.getDate()).length > 0 ? (
                            <div className="space-y-3">
                                {getDayEvents(selectedDate.getDate()).map(ev => (
                                    <div key={ev.id} className={`p-3 rounded-lg border ${getEventStyle(ev.type)} bg-opacity-5 border-opacity-30`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm text-white">{ev.title}</h4>
                                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                                                {ev.type}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-xs opacity-80">
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} />
                                                <span>{ev.time}</span>
                                            </div>
                                            {ev.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} />
                                                    <span>{ev.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-neutral-600">
                                <div className="bg-neutral-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 border border-neutral-800">
                                    <CalIcon size={20} className="opacity-50" />
                                </div>
                                <p className="text-sm">No events scheduled.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
                        <button 
                            className="px-3 py-1.5 bg-white text-black font-bold rounded-md hover:bg-neutral-200 transition-colors text-xs"
                            onClick={() => setSelectedDate(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
