import React, { useEffect, useRef, memo } from 'react';

const SUBJECTS = [
    "Full Stack-I",
    "Computer Networks",
    "Foundation of Machine Learning",
    "Formal Languages & Automata Theory",
    "Competitive Coding-I",
    "Predictive Analytics",
    "Aptitude-III",
    "Soft Skills-III",
    "ADBMS",
    "Industrial Internship-I"
];

const MarqueeStrip = memo(() => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    
    useEffect(() => {
        const speed = 100; // pixels per second
        const startTime = Date.now();
        let animationFrameId;

        const animate = () => {
            if (!containerRef.current || !contentRef.current) return;

            const currentTime = Date.now();
            const elapsed = (currentTime - startTime) / 1000; // seconds
            const distance = elapsed * speed;
            
            // Calculate width of one set of items
            // We have 2 sets rendered. The contentRef wraps both? 
            // No, let's wrap the inner content.
            // Actually, simpler: render enough copies to fill screen + buffer.
            // For now, let's assume the 2 copies logic from before.
            
            const totalWidth = contentRef.current.scrollWidth;
            const singleSetWidth = totalWidth / 2;
            
            const position = -(distance % singleSetWidth);
            
            containerRef.current.style.transform = `translateX(${position}px)`;
            
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <section className="bg-neutral-950 py-12 border-y border-neutral-800 overflow-hidden">
            <div ref={containerRef} className="flex whitespace-nowrap will-change-transform">
                <div ref={contentRef} className="flex">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-16 mx-8 items-center">
                            {SUBJECTS.map((subject, idx) => (
                                <span key={idx} className="text-sm font-bold tracking-widest uppercase text-neutral-500 hover:text-white transition-colors cursor-default">
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
