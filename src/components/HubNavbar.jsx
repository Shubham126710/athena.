import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SGPACalculator from './SGPACalculator';

export default function HubNavbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, updateProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  
  const handleLogout = async () => {
    await signOut();
    nav('/');
  };

  const avatarOptions = [
    { id: 'Felix', label: 'Felix' },
    { id: 'Lola', label: 'Lola' },
    { id: 'Jack', label: 'Jack' },
    { id: 'Bella', label: 'Bella' },
    { id: 'Ryan', label: 'Ryan' }
  ];

  const handleAvatarChange = async (avatarId) => {
    try {
        await updateProfile({ avatar_seed: avatarId });
    } catch (error) {
        console.error("Failed to update avatar", error);
    }
  };
  
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
      { id: 1, title: "Welcome to Athena", message: "Your centralized academic hub is ready. Manage your timetable, track attendance, and access resources seamlessly.", time: "Just now", type: "info" },
      { id: 2, title: "Domain Camp: Dec 10 - 16", message: "Prepare for an immersive week of domain-specific training. Check your updated timetable for details.", time: "1 hour ago", type: "alert" },
      { id: 3, title: "Winning Camp: Dec 17 - 24", message: "The final sprint begins soon. Join the Winning Camp sessions to maximize your performance before the break.", time: "1 hour ago", type: "alert" },
      { id: 4, title: "Exam Schedule Released", message: "The schedule for EST exams has been updated.", time: "2 hrs ago", type: "alert" }
  ];

  const isActive = (path) => location.pathname === path;
  const activeClass = "px-4 py-1.5 bg-neutral-800 shadow-sm rounded-md text-sm font-medium text-white transition-all";
  const inactiveClass = "px-4 py-1.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => nav('/')}> 
                <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm" />
                <span className="font-serif font-bold tracking-tight text-xl">athena.</span>
            </div>
            
            {/* Dashboard Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                <button onClick={() => nav('/hub')} className={isActive('/hub') ? activeClass : inactiveClass}>Hub</button>
                <button onClick={() => nav('/calendar')} className={isActive('/calendar') ? activeClass : inactiveClass}>Calendar</button>
                <button onClick={() => nav('/syllabus')} className={isActive('/syllabus') ? activeClass : inactiveClass}>Syllabus</button>
                <button onClick={() => nav('/notes')} className={isActive('/notes') ? activeClass : inactiveClass}>Notes</button>
                <button onClick={() => setIsCalculatorOpen(true)} className={inactiveClass}>SGPA</button>
            </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-neutral-900 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-neutral-950"></span>
            </button>

            {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right">
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">Notifications</h3>
                        <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">{notifications.length} new</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notif => (
                            <div key={notif.id} className="p-4 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer last:border-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                                    <span className="text-[10px] text-neutral-500">{notif.time}</span>
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed">{notif.message}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 bg-neutral-900 border-t border-neutral-800 text-center">
                        <button className="text-xs text-neutral-500 hover:text-white transition-colors">Mark all as read</button>
                    </div>
                </div>
            )}
          </div>
          <div className="h-8 w-px bg-neutral-800"></div>
          
          <div className="flex items-center gap-4">
            {/* Section Badge - Visible for Students & Admins */}
            {(profile?.section || profile?.role === 'admin') && (
                <div className="hidden md:block px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-medium text-neutral-400">
                    {profile?.section || 'Admin View'}
                </div>
            )}

            <div className="relative group">
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold">{profile?.first_name || 'Student'}</div>
                        <div className="text-xs text-neutral-500 capitalize">{profile?.role || 'Student'}</div>
                    </div>
                    <div className="w-10 h-10 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
                        <img 
                            key={profile?.avatar_seed || 'default'}
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.avatar_seed || user?.email || 'user'}`} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Profile Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <div className="p-4 border-b border-neutral-800">
                        <p className="text-sm font-bold text-white">{profile?.first_name} {profile?.last_name}</p>
                        <p className="text-xs text-neutral-400 mt-1">{user?.email}</p>
                        {profile?.uid && (
                            <div className="mt-3 inline-block px-2 py-1 bg-neutral-800 rounded text-xs font-mono text-neutral-300">
                                UID: {profile.uid}
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 border-b border-neutral-800">
                        <p className="text-xs font-medium text-neutral-500 mb-3">Change Avatar</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {avatarOptions.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    onClick={() => handleAvatarChange(avatar.id)}
                                    className={`flex-shrink-0 rounded-full p-0.5 border-2 transition-all ${profile?.avatar_seed === avatar.id ? 'border-white' : 'border-transparent hover:border-neutral-700'}`}
                                >
                                    <img 
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatar.id}`} 
                                        alt={avatar.label} 
                                        className="w-8 h-8 rounded-full bg-neutral-800"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-neutral-800 rounded-md transition-colors">
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-neutral-950 border-b border-neutral-800 p-4 md:hidden animate-in slide-in-from-top-5 fade-in duration-200 shadow-2xl">
                <div className="flex flex-col gap-2">
                    <button onClick={() => { nav('/hub'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg text-left font-medium ${isActive('/hub') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}>Hub</button>
                    <button onClick={() => { nav('/calendar'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg text-left font-medium ${isActive('/calendar') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}>Calendar</button>
                    <button onClick={() => { nav('/syllabus'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg text-left font-medium ${isActive('/syllabus') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}>Syllabus</button>
                    <button onClick={() => { nav('/notes'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg text-left font-medium ${isActive('/notes') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}>Notes</button>
                    <button onClick={() => { setIsCalculatorOpen(true); setIsMobileMenuOpen(false); }} className="p-3 rounded-lg text-left font-medium text-neutral-400 hover:bg-neutral-900 hover:text-white">SGPA</button>
                </div>
            </div>
        )}
      </nav>
      <SGPACalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </>
  );
}
