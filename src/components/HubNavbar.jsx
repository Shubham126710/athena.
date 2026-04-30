import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, X, Plus, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import SGPACalculator from './SGPACalculator';
import Avatar from './Avatar';

export default function HubNavbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, updateProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [newNotification, setNewNotification] = useState({ title: '', message: '', type: 'info' });
  const [isPosting, setIsPosting] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
        const clearedIds = JSON.parse(localStorage.getItem('cleared_notifications_v5') || '[]');
        // Format time relative to now
        const formattedData = data
            .filter(n => !clearedIds.includes(n.id))
            .map(n => {
                let updatedNotif = { ...n };
                if (updatedNotif.title.includes('Domain Camp')) {
                    updatedNotif.title = 'Domain Camp: June 8 - 19';
                    updatedNotif.message = 'Prepare for an immersive week of domain-specific training featuring technical subjects for better placement competencies. Check your updated timetable for details.';
                    updatedNotif.type = 'info';
                    updatedNotif.created_at = new Date().toISOString();
                } else if (updatedNotif.title.includes('Winning Camp')) {
                    updatedNotif.title = 'Winning Camp: May 25 - June 6';
                    updatedNotif.message = 'The final sprint begins soon. Join the Winning Camp featuring aptitude and soft skills to help in placement exams and interviews.';
                    updatedNotif.type = 'info';
                    updatedNotif.created_at = new Date().toISOString();
                } else if (updatedNotif.title.includes('Welcome')) {
                    updatedNotif.created_at = new Date(Date.now() - 1000 * 60 * 5).toISOString(); // 5 mins ago
                }
                return {
                    ...updatedNotif,
                    time: getTimeAgo(new Date(updatedNotif.created_at))
                };
            });
        setNotifications(formattedData);
    }
  };

  const handleClearNotifications = () => {
    const clearedIds = JSON.parse(localStorage.getItem('cleared_notifications_v5') || '[]');
    const newClearedIds = [...new Set([...clearedIds, ...notifications.map(n => n.id)])];
    localStorage.setItem('cleared_notifications_v5', JSON.stringify(newClearedIds));
    setNotifications([]);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hrs ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return "Just now";
  };

  const handlePostNotification = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    try {
        const { error } = await supabase
            .from('notifications')
            .insert([newNotification]);
        
        if (error) throw error;
        
        setNewNotification({ title: '', message: '', type: 'info' });
        setShowCompose(false);
        fetchNotifications();
    } catch (error) {
        console.error('Error posting notification:', error);
        alert('Failed to post notification');
    } finally {
        setIsPosting(false);
    }
  };
  
  const handleLogout = async () => {
    setShowProfileMenu(false);
    await signOut();
    nav('/');
  };

  const avatarOptions = [
    { id: 'Felix', label: 'Felix' },
    { id: 'Aneka', label: 'Aneka' },
    { id: 'Christian', label: 'Christian' },
    { id: 'Jocelyn', label: 'Jocelyn' },
    { id: 'Alex', label: 'Alex' },
    { id: 'Aria', label: 'Aria' }
  ];

  const handleAvatarChange = async (avatarId) => {
    try {
        await updateProfile({ avatar_seed: avatarId });
        setShowProfileMenu(false);
    } catch (error) {
        console.error("Failed to update avatar", error);
    }
  };
  
  const isActive = (path) => location.pathname === path;
  const activeClass = "px-3 py-1.5 bg-neutral-800 shadow-sm rounded-md text-sm font-medium text-white transition-all";
  const inactiveClass = "px-3 py-1.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-5">
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

        <div className="flex shrink-0 items-center gap-4">
          <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-neutral-900 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-neutral-950"></span>
            </button>

            {showNotifications && (
                <div className="fixed inset-x-4 top-20 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-80 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right">
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {profile?.role === 'admin' && (
                                <button 
                                    onClick={() => setShowCompose(!showCompose)}
                                    className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                                    title="Compose Notification"
                                >
                                    <Plus size={16} />
                                </button>
                            )}
                            <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded-full">{notifications.length} new</span>
                        </div>
                    </div>

                    {showCompose && (
                        <div className="p-4 bg-neutral-800/50 border-b border-neutral-800 animate-in slide-in-from-top-2">
                            <form onSubmit={handlePostNotification} className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Title" 
                                    required
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white"
                                    value={newNotification.title}
                                    onChange={e => setNewNotification({...newNotification, title: e.target.value})}
                                />
                                <textarea 
                                    placeholder="Message" 
                                    required
                                    rows="2"
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white resize-none"
                                    value={newNotification.message}
                                    onChange={e => setNewNotification({...newNotification, message: e.target.value})}
                                />
                                <div className="flex gap-2">
                                    <select 
                                        className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                        value={newNotification.type}
                                        onChange={e => setNewNotification({...newNotification, type: e.target.value})}
                                    >
                                        <option value="info">Info</option>
                                        <option value="alert">Alert</option>
                                        <option value="warning">Warning</option>
                                    </select>
                                    <button 
                                        type="submit" 
                                        disabled={isPosting}
                                        className="flex-1 bg-white text-black text-xs font-bold rounded py-1 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1"
                                    >
                                        {isPosting ? 'Posting...' : <><Send size={12} /> Post</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-neutral-500 text-sm">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="p-4 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-bold ${notif.type === 'alert' ? 'text-red-400' : notif.type === 'warning' ? 'text-amber-400' : 'text-white'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[10px] text-neutral-500 whitespace-nowrap ml-2">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed">{notif.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 bg-neutral-900 border-t border-neutral-800 text-center">
                        <button onClick={handleClearNotifications} className="text-xs text-neutral-500 hover:text-white transition-colors">Clear all</button>
                    </div>
                </div>
            )}
          </div>
          <div className="h-8 w-px bg-neutral-800"></div>
          
          <div className="flex items-center gap-3">
            {/* Section Badge - Visible for Students & Admins */}
            {(profile?.section || profile?.role === 'admin') && (
                <div className="hidden md:block px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-xs font-medium text-neutral-400">
                    {profile?.section || 'Admin View'}
                </div>
            )}

            <div className="relative" ref={profileMenuRef}>
                <button
                    type="button"
                    onClick={() => {
                        setShowProfileMenu(value => !value);
                        setShowNotifications(false);
                    }}
                    className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-neutral-900 transition-colors"
                    aria-expanded={showProfileMenu}
                    aria-label="Open profile menu"
                >
                    <div className="text-right hidden md:block max-w-28">
                        <div className="truncate text-sm font-bold">{profile?.first_name || 'Student'}</div>
                        <div className="text-xs text-neutral-500 capitalize">{profile?.role || 'Student'}</div>
                    </div>
                    <Avatar seed={profile?.avatar_seed || user?.email || 'user'} className="w-9 h-9 shrink-0 rounded-full border border-neutral-700" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right z-50 overflow-hidden">
                    <div className="p-4 border-b border-neutral-800">
                        <p className="text-sm font-bold text-white">{profile?.first_name || 'Student'} {profile?.last_name}</p>
                        {user?.email && <p className="text-xs text-neutral-400 mt-1 break-all">{user.email}</p>}
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
                                    className={`h-10 w-10 flex-shrink-0 overflow-hidden rounded-full p-0.5 border-2 transition-all ${profile?.avatar_seed === avatar.id ? 'border-white' : 'border-transparent hover:border-neutral-700'}`}
                                >
                                    <Avatar seed={avatar.id} className="h-full w-full rounded-full" />
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
                )}
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
        </div>
      </nav>
      <SGPACalculator isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
    </>
  );
}
