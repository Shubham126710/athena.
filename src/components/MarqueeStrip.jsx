import React, { memo } from 'react';
import { Marquee } from './ui/Marquee';

const BASE_SUBJECTS = [
    "RESEARCH METHODOLOGY",
    "PRINCIPLES OF HUMAN COMMUNICATION",
    "NATURAL LANGUAGE PROCESSING",
    "COMPUTER VISION"
];

const MarqueeStrip = memo(() => {
    return (
        <section className="relative z-10 py-3 sm:py-3.5 overflow-hidden">
            <Marquee className="[--duration:14s] [--gap:4rem] p-0" repeat={8}>
                {BASE_SUBJECTS.map((subject, idx) => (
                    <span 
                        key={idx} 
                        className="text-[10px] font-mono font-medium tracking-[0.2em] uppercase text-neutral-400 hover:text-white transition-colors cursor-default whitespace-nowrap"
                    >
                        {subject}
                    </span>
                ))}
            </Marquee>
        </section>
    );
});

export default MarqueeStrip;
