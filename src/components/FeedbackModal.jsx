import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle2, Trash2, Bug, Lightbulb, Heart } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

export default function FeedbackModal({ isOpen, onClose }) {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  
  // Guest state
  const [type, setType] = useState('bug'); // bug, suggestion, praise
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Admin state
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
      if (isOpen) {
          gsap.fromTo(modalRef.current, 
              { opacity: 0, scale: 0.95, y: 10 }, 
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
          );
          
          if (isAdmin) {
              fetchReports();
          }
      }
  }, [isOpen, isAdmin]);

  const fetchReports = async () => {
      setIsLoadingReports(true);
      try {
          const q = query(collection(db, 'feedback'), orderBy('created_at', 'desc'));
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setReports(data);
      } catch (err) {
          console.error("Error fetching reports", err);
      } finally {
          setIsLoadingReports(false);
      }
  };

  const handleDeleteReport = async (id) => {
      try {
          await deleteDoc(doc(db, 'feedback', id));
          setReports(prev => prev.filter(r => r.id !== id));
      } catch (err) {
          console.error("Error deleting report", err);
      }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        type,
        message,
        user_id: profile?.id || 'guest_id',
        user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'Guest User',
        user_role: profile?.role || 'guest',
        status: 'new',
        created_at: serverTimestamp()
      });
      
      setIsSuccess(true);
      setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setMessage('');
          setType('bug');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (t) => {
      if (t === 'bug') return <Bug size={14} className="text-red-400" />;
      if (t === 'suggestion') return <Lightbulb size={14} className="text-amber-400" />;
      return <Heart size={14} className="text-pink-400" />;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" data-lenis-prevent="true">
      <div ref={modalRef} className={`bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl w-full ${isAdmin ? 'max-w-2xl' : 'max-w-md'} overflow-hidden relative flex flex-col max-h-[85vh]`}>
        <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50 shrink-0">
          <div className="flex items-center gap-2 text-white">
            <MessageSquare size={18} className="text-neutral-400" />
            <h3 className="font-serif italic text-xl">{isAdmin ? 'Incoming Diagnostics' : 'Feedback & Diagnostics'}</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white shrink-0 p-1.5 rounded-full hover:bg-neutral-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isAdmin ? (
            <div className="flex flex-col gap-4">
                {isLoadingReports ? (
                    <div className="text-center py-8 text-neutral-500 animate-pulse font-mono text-sm">Intercepting reports...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 font-light">
                        No incoming reports at this time.
                    </div>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 group flex flex-col relative">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 px-2.5 py-1 rounded-md text-xs font-medium capitalize text-neutral-300">
                                        {getIcon(report.type)}
                                        {report.type}
                                    </span>
                                    <span className="text-xs text-neutral-500">{report.user_name} ({report.user_role})</span>
                                </div>
                                <button 
                                    onClick={() => handleDeleteReport(report.id)}
                                    className="text-neutral-600 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                    title="Dismiss report"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{report.message}</p>
                            {report.created_at && (
                                <span className="text-[10px] text-neutral-600 mt-3 uppercase tracking-wider font-bold">
                                    {report.created_at?.toDate ? report.created_at.toDate().toLocaleString() : 'Just now'}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>
          ) : (
            isSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={48} className="text-green-500 mb-4" />
                <h4 className="text-xl font-bold text-white mb-2 tracking-tight">Transmission Received</h4>
                <p className="text-neutral-400 text-sm font-light">
                    Thank you for your feedback! The admin team will review it shortly.
                </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <p className="text-sm text-neutral-400 font-light leading-relaxed mb-1">
                    Encountered a glitch? Have an idea? Send a direct diagnostic report to the admin.
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                    {['bug', 'suggestion', 'praise'].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all border ${
                                type === t 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div>
                    <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or suggestion..."
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 resize-none h-32 text-sm transition-all custom-scrollbar"
                    required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="w-full bg-white text-black font-bold text-sm tracking-wide uppercase py-3.5 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                    ) : (
                    <>
                        <Send size={16} />
                        Submit Report
                    </>
                    )}
                </button>
                </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}
