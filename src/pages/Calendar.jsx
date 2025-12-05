import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, MapPin, X, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HubNavbar from '../components/HubNavbar.jsx';

export default function CalendarPage() {
  const nav = useNavigate();
  const [date, setDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(null);
  
  // Mock events
  const events = [
    // MST-2 Exams
    { id: 1, title: 'MST-2: FLAT', date: new Date(2025, 9, 11), type: 'mst', time: '15:00', location: 'B4' },
    { id: 2, title: 'MST-2: FML', date: new Date(2025, 9, 13), type: 'mst', time: '10:00', location: 'B4' },
    { id: 3, title: 'MST-2: CN', date: new Date(2025, 9, 13), type: 'mst', time: '12:30', location: 'B4' },
    { id: 4, title: 'MST-2: PA', date: new Date(2025, 9, 14), type: 'mst', time: '10:00', location: 'B4' },
    
    // EST (Final) Exams
    { id: 5, title: 'EST: PA', date: new Date(2025, 10, 20), type: 'est', time: '09:30', location: 'B4' },
    { id: 6, title: 'EST: FML', date: new Date(2025, 10, 22), type: 'est', time: '09:30', location: 'B4' },
    { id: 7, title: 'EST: FLAT', date: new Date(2025, 10, 25), type: 'est', time: '09:30', location: 'B4' },
    { id: 8, title: 'EST: CN', date: new Date(2025, 10, 27), type: 'est', time: '09:30', location: 'B4' },

    // Placement / Aptitude Exams
    { id: 9, title: 'CUCAT', date: new Date(2025, 11, 16), type: 'exam', time: '10:00', location: 'B4' },
    { id: 10, title: 'AMCAT', date: new Date(2025, 11, 24), type: 'exam', time: '10:00', location: 'B4' },

    // 2026 Academic Calendar (Jan - Jun)
    { id: 11, title: 'Start of Even Sem', date: new Date(2026, 0, 6), type: 'academic', time: '09:00', location: 'Campus' },
    { id: 12, title: 'Academic Day', date: new Date(2026, 0, 10), type: 'academic', time: '09:00', location: 'Campus' },
    { id: 13, title: 'MST-1 Start', date: new Date(2026, 1, 9), type: 'mst', time: '09:30', location: 'Exam Hall' },
    { id: 14, title: 'Practical MST Start', date: new Date(2026, 2, 9), type: 'mst', time: '09:00', location: 'Labs' },
    { id: 15, title: 'MST-2 Start', date: new Date(2026, 2, 17), type: 'mst', time: '09:30', location: 'Exam Hall' },
    { id: 16, title: 'CU Fest', date: new Date(2026, 2, 27), type: 'event', time: '10:00', location: 'Main Ground' },
    { id: 17, title: 'Last Teaching Day', date: new Date(2026, 3, 24), type: 'academic', time: '16:00', location: 'Campus' },
    { id: 18, title: 'End Sem Practicals', date: new Date(2026, 3, 25), type: 'est', time: '09:00', location: 'Labs' },
    { id: 19, title: 'End Sem Theory', date: new Date(2026, 4, 1), type: 'est', time: '09:30', location: 'Exam Hall' },
    { id: 20, title: 'End of Even Sem', date: new Date(2026, 4, 23), type: 'academic', time: '17:00', location: 'Campus' },
    { id: 21, title: 'Summer Term Start', date: new Date(2026, 5, 1), type: 'academic', time: '09:00', location: 'Campus' },
    { id: 22, title: 'Results', date: new Date(2026, 5, 12), type: 'academic', time: '10:00', location: 'Online' },
  ];

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
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <HubNavbar />

      <main className="pt-24 pb-8 px-6 md:px-12 container mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Calendar Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold tracking-tight">{monthNames[date.getMonth()]} {date.getFullYear()}</h1>
                        <div className="flex gap-1">
                            <button onClick={prevMonth} className="p-2 hover:bg-neutral-800 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                            <button onClick={nextMonth} className="p-2 hover:bg-neutral-800 rounded-full transition-colors"><ChevronRight size={20} /></button>
                        </div>
                    </div>
                    
                    {/* Legends */}
                    <div className="flex flex-wrap gap-3 text-xs font-medium">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-900/30 text-indigo-300 border border-indigo-800">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div> MST
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-900/30 text-rose-300 border border-rose-800">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div> EST
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-900/30 text-amber-300 border border-amber-800">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div> Other Exams
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-900/30 text-emerald-300 border border-emerald-800">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Events
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-900/30 text-blue-300 border border-blue-800">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Academic
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5">
                    <div className="grid grid-cols-7 gap-px bg-black border border-neutral-800">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="bg-neutral-900 p-3 text-xs font-bold text-neutral-500 uppercase tracking-wider text-center">
                                {d}
                            </div>
                        ))}
                        
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="bg-neutral-950 h-24"></div>
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
                                    className={`h-24 p-2 border-t border-transparent transition-all duration-200 relative group cursor-pointer
                                        ${isToday ? 'bg-neutral-900' : 'bg-neutral-950 hover:bg-neutral-900'}
                                        ${isSelected ? 'ring-2 ring-inset ring-indigo-500 bg-neutral-900' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className={`text-sm font-medium transition-all duration-300 ${isToday ? 'bg-indigo-500 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg shadow-indigo-500/20' : 'text-neutral-400 group-hover:text-white'}`}>
                                            {day}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="text-[10px] font-bold text-neutral-600 bg-neutral-900/50 px-1.5 rounded md:hidden">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="mt-1 flex flex-col gap-1">
                                        {dayEvents.slice(0, 2).map(ev => (
                                            <div key={ev.id} className={`group/event relative text-[10px] px-2 py-0.5 rounded border truncate font-medium transition-transform hover:scale-[1.02] ${getEventStyle(ev.type)}`}>
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
            <div className="space-y-8">
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 shadow-sm sticky top-32">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
                        <Clock size={18} className="text-indigo-400" />
                        Upcoming Events
                    </h2>
                    <div className="space-y-1 relative">
                        {/* Timeline line */}
                        <div className="absolute left-[1.65rem] top-2 bottom-2 w-px bg-neutral-800"></div>

                        {events.filter(e => e.date >= new Date()).sort((a,b) => a.date - b.date).slice(0, 5).map((ev, idx) => (
                            <div key={ev.id} className="relative flex gap-4 items-start py-3 group cursor-pointer hover:bg-neutral-800/50 rounded-lg px-2 -mx-2 transition-colors">
                                <div className="flex-shrink-0 w-14 text-center z-10 bg-neutral-900 group-hover:bg-neutral-800 transition-colors rounded-lg border border-neutral-800 py-1">
                                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{monthNames[ev.date.getMonth()].substring(0,3)}</div>
                                    <div className="text-lg font-bold text-white">{ev.date.getDate()}</div>
                                </div>
                                <div className="pt-1">
                                    <div className="font-medium text-sm text-neutral-200 group-hover:text-white transition-colors">{ev.title}</div>
                                    <div className="text-xs text-neutral-500 mt-1.5 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {ev.time}</span>
                                        {ev.location && (
                                            <span className="flex items-center gap-1"><MapPin size={10} /> {ev.location}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {events.filter(e => e.date >= new Date()).length === 0 && (
                            <p className="text-sm text-neutral-500 pl-4">No upcoming events.</p>
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
