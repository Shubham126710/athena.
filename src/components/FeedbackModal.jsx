import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

export default function FeedbackModal({ isOpen, onClose }) {
  const { profile } = useAuth();
  const [type, setType] = useState('bug'); // bug, suggestion, praise
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
      if (isOpen) {
          gsap.fromTo(modalRef.current, 
              { opacity: 0, scale: 0.95, y: 10 }, 
              { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
          );
      }
  }, [isOpen]);

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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" data-lenis-prevent="true">
      <div ref={modalRef} className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <div className="flex items-center gap-2 text-white">
            <MessageSquare size={18} className="text-neutral-400" />
            <h3 className="font-serif italic text-xl">Feedback & Diagnostics</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white shrink-0 p-1.5 rounded-full hover:bg-neutral-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
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
          )}
        </div>
      </div>
    </div>
  );
}
