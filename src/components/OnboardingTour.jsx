import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { safeGetStorage, safeSetStorage, safeRemoveStorage } from '../utils/storage.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, ChevronRight, Check } from 'lucide-react';

const steps = [
    {
        id: 'welcome',
        target: 'body',
        title: 'Welcome to Athena.',
        description: 'Let us take you on a quick tour of your new academic workspace.',
        align: 'center'
    },
    {
        id: 'hub',
        target: '.nav-hub-link',
        title: 'The Hub',
        description: 'Your dashboard for upcoming exams, events, and quick actions.',
        align: 'bottom'
    },
    {
        id: 'calendar',
        target: '.nav-calendar-link',
        title: 'Academic Calendar',
        description: 'Track MSTs, ESTs, and holidays seamlessly.',
        align: 'bottom'
    },
    {
        id: 'sgpa',
        target: '.nav-sgpa-btn',
        title: 'SGPA Calculator',
        description: 'Predict your SGPA instantly using this handy tool.',
        align: 'bottom'
    },
    {
        id: 'notes-link',
        target: '.nav-notes-link',
        title: 'Notes Repository',
        description: 'Access the vault of academic notes. Let\'s head there now!',
        align: 'bottom',
        action: (navigate, setCurrentStepIndex) => {
            safeSetStorage('athena_tour_in_progress', 'true');
            navigate('/notes?tour=true');
            setCurrentStepIndex(5);
        }
    },
    {
        id: 'notes-grid',
        target: '.notes-grid',
        title: 'Note Repository',
        description: 'All your course notes are beautifully organized here by semester and unit.',
        align: 'top'
    },
    {
        id: 'pdf-rotate',
        target: '.pdf-rotate-btn',
        title: 'Sleek PDF Viewer',
        description: 'Read and easily rotate scanned pages or PDFs that are sideways.',
        align: 'bottom'
    },
    {
        id: 'pdf-download',
        target: '.pdf-download-btn',
        title: 'Download & Save',
        description: 'Need notes offline? Download any PDF directly to your device with one click.',
        align: 'bottom'
    },
    {
        id: 'done',
        target: 'body',
        title: 'Tour Complete',
        description: 'You\'re all set to conquer your curriculum. Enjoy exploring Athena!',
        align: 'center',
        action: (navigate, setCurrentStepIndex) => {
            safeSetStorage('athena_tour_completed', 'true');
            safeRemoveStorage('athena_tour_in_progress');
            navigate('/notes', { replace: true });
            setCurrentStepIndex(-1);
        }
    }
];

export default function OnboardingTour() {
    const { profile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [hasSeenTour] = useState(() => safeGetStorage('athena_tour_completed'));
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [targetRect, setTargetRect] = useState(null);

    // Initial trigger
    useEffect(() => {
        const forceStart = location.search.includes('tour=start');
        const canShowTour = (profile?.role === 'guest' || profile?.role === 'student' || forceStart);
        
        if (canShowTour && (!hasSeenTour || forceStart)) {
            if (location.pathname === '/hub' && currentStepIndex === -1 && (!safeGetStorage('athena_tour_in_progress') || forceStart)) {
                setCurrentStepIndex(0);
            }
            if (location.pathname === '/notes' && location.search.includes('tour=true') && currentStepIndex === -1) {
                setCurrentStepIndex(5);
            }
        }
    }, [profile, hasSeenTour, location.pathname, currentStepIndex, location.search]);

    // Position tracking
    useEffect(() => {
        if (currentStepIndex === -1) return;
        
        const step = steps[currentStepIndex];
        let isCancelled = false;
        
        const updatePosition = () => {
            if (isCancelled) return;
            
            if (step.target === 'body') {
                setTargetRect({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0, isBody: true });
                return;
            }

            const el = document.querySelector(step.target);
            if (el && el.offsetHeight > 0) {
                const rect = el.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    isBody: false
                });
            } else {
                // Element not found yet, try again in a bit
                setTimeout(updatePosition, 500);
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true); // true for capture to catch nested scrolls
        return () => {
            isCancelled = true;
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [currentStepIndex, location.pathname]);

    

    const step = currentStepIndex !== -1 ? steps[currentStepIndex] : null;

    const handleNext = React.useCallback(() => {
        if (!step) return;
        if (step.action) {
            step.action(navigate, setCurrentStepIndex);
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [step, navigate]);

    useEffect(() => {
        if (currentStepIndex === -1 || !targetRect) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStepIndex, targetRect, handleNext]);



    const handleSkip = () => {
        safeSetStorage('athena_tour_completed', 'true');
        safeRemoveStorage('athena_tour_in_progress');
        setCurrentStepIndex(-1);
        if (location.search.includes('tour=true') || location.search.includes('tour=start')) {
            navigate(location.pathname, { replace: true });
        }
    };

    const isMobile = window.innerWidth < 768;


    if (currentStepIndex === -1 || (!targetRect && !isMobile) || !step) return null;

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="w-full max-w-sm bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-6 shadow-2xl relative">
                    <h3 className="font-serif italic text-2xl text-white font-bold mb-3">Welcome to Athena.</h3>
                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                        We're thrilled to have you here. Athena is fully responsive, but our interactive guided tour is optimized for Desktop screens. 
                        <br/><br/>
                        Feel free to explore the menus to discover your dashboard, syllabus, notes, and SGPA calculator!
                    </p>
                    <button 
                        onClick={handleSkip}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                        Start Exploring <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        );
    }





    const spotlightRef = useRef();
    const popoverRef = useRef();

    useGSAP(() => {
        if (!targetRect || !step) return;

        // Animate Spotlight
        if (spotlightRef.current && !targetRect.isBody) {
            const tTop = targetRect.top - 8;
            const tLeft = targetRect.left - 8;
            const tWidth = targetRect.width + 16;
            const tHeight = targetRect.height + 16;
            
            if (!spotlightRef.current.dataset.initialized) {
                gsap.set(spotlightRef.current, { top: tTop, left: tLeft, width: tWidth, height: tHeight, opacity: 0 });
                gsap.to(spotlightRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
                spotlightRef.current.dataset.initialized = 'true';
            } else {
                gsap.to(spotlightRef.current, {
                    top: tTop,
                    left: tLeft,
                    width: tWidth,
                    height: tHeight,
                    duration: 0.8,
                    ease: "expo.out",
                    overwrite: "auto"
                });
            }
        }

        // Animate Popover
        if (popoverRef.current) {
            let pTop, pLeft, xPercent, yPercent;
            if (step.align === 'center') {
                pTop = '50%'; pLeft = '50%'; xPercent = -50; yPercent = -50;
            } else if (step.align === 'bottom') {
                pTop = targetRect.top + targetRect.height + 20; 
                pTop = Math.max(20, Math.min(window.innerHeight - 200, pTop));
                pLeft = Math.max(160, Math.min(window.innerWidth - 160, targetRect.left + (targetRect.width / 2)));
                xPercent = -50; yPercent = 0;
            } else if (step.align === 'top') {
                pTop = targetRect.top - 20;
                pTop = Math.max(20, Math.min(window.innerHeight - 200, pTop));
                pLeft = Math.max(160, Math.min(window.innerWidth - 160, targetRect.left + (targetRect.width / 2)));
                xPercent = -50; yPercent = -100;
            }

            // If it's the very first render of the popover, just set it, else animate
            if (currentStepIndex === 0 && !popoverRef.current.dataset.initialized) {
                gsap.set(popoverRef.current, { top: pTop, left: pLeft, xPercent, yPercent, opacity: 0, scale: 0.9 });
                gsap.to(popoverRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)", delay: 0.2 });
                popoverRef.current.dataset.initialized = 'true';
            } else {
                gsap.to(popoverRef.current, {
                    top: pTop,
                    left: pLeft,
                    xPercent,
                    yPercent,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "expo.out",
                    overwrite: "auto"
                });
            }
        }
    }, [targetRect, currentStepIndex]);



    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Full Screen Overlay for Body Steps */}
            {targetRect.isBody && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto transition-opacity duration-500" />
            )}

            {/* Spotlight and Ring for Target Steps */}
            {!targetRect.isBody && (
                <div ref={spotlightRef} className="absolute border-2 border-white/40 rounded-xl pointer-events-auto shadow-[0_0_0_9999px_rgba(0,0,0,0.7),0_0_20px_rgba(255,255,255,0.3)] z-0" style={{top: -9999, left: -9999}} />
            )}

            {/* Popover */}
            <div ref={popoverRef} className="absolute w-[320px] bg-[#0a0a0a]/95 backdrop-blur-xl border border-neutral-800 rounded-2xl shadow-2xl p-5 pointer-events-auto" style={{top: -9999, left: -9999}}>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif italic text-xl text-white font-bold">{step.title}</h3>
                    <button onClick={handleSkip} className="text-neutral-500 hover:text-white transition-colors p-1 bg-neutral-900 rounded-full">
                        <X size={14} />
                    </button>
                </div>
                <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                    {step.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-600 tracking-widest uppercase">
                        {currentStepIndex + 1} / {steps.length}
                    </span>
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-neutral-200 transition-colors shadow-sm"
                    >
                        {step.id === 'done' ? (
                            <>Done <Check size={16} /></>
                        ) : (
                            <>Next <ChevronRight size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
