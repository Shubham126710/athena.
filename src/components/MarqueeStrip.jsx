import React, { useRef, memo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const BASE_SUBJECTS = [
    "RESEARCH METHODOLOGY",
    "PRINCIPLES OF HUMAN COMMUNICATION",
    "NATURAL LANGUAGE PROCESSING",
    "COMPUTER VISION",
    "RESEARCH METHODS"
];

// Duplicate to ensure the single set is wider than any viewport
const SUBJECTS = [...BASE_SUBJECTS, ...BASE_SUBJECTS, ...BASE_SUBJECTS, ...BASE_SUBJECTS];

const MarqueeStrip = memo(() => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    
    useGSAP(() => {
        // Continuous scrolling loop, no ScrollTrigger to avoid blanking bugs
        gsap.to(containerRef.current, {
            xPercent: -50,
            ease: "none",
            duration: 20,
            repeat: -1
        });
        
        // Remove scrolltrigger fade, just ensure they are visible
        gsap.set('.marquee-item', { opacity: 1, y: 0 });
    }, { scope: containerRef });

    return (
        <section className="relative z-10 bg-black py-4 border-t border-neutral-900 overflow-hidden">
            <div ref={containerRef} className="flex whitespace-nowrap will-change-transform">
                <div ref={contentRef} className="flex">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-20 mx-10 items-center">
                            {SUBJECTS.map((subject, idx) => (
                                <span key={idx} className="marquee-item text-[10px] font-mono font-medium tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors cursor-default">
                                    {subject}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

export default MarqueeStrip;
