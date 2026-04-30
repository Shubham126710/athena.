import React from 'react';

// Generates a deterministic hash from a string
const generateHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

// Generates a cool gradient based on the seed
const generateGradient = (seed) => {
    const hash = generateHash(seed || 'default');
    
    // Create highly legible and beautiful modern colors
    const hue1 = Math.abs(hash % 360);
    const hue2 = Math.abs((hash * 23) % 360);
    
    // Saturation and lightness for vibrant, professional look
    const s = 70 + Math.abs(hash % 20); // 70-90
    const l = 50 + Math.abs(hash % 20); // 50-70
    
    const color1 = `hsl(${hue1}, ${s}%, ${l}%)`;
    const color2 = `hsl(${hue2}, ${s}%, ${l}%)`;
    
    // Decide gradient angle deterministically
    const angle = Math.abs(hash % 360);
    
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

const getInitials = (seed) => {
    if (!seed) return 'UU';
    // If it's an email or name
    let clean = seed.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim();
    if (!clean) return 'UU';
    const words = clean.split(' ');
    if (words.length >= 2) {
         return (words[0][0] + words[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
};

export default function Avatar({ seed, className = "" }) {
    const gradient = generateGradient(seed);
    const initials = getInitials(seed);
    
    return (
        <div 
            className={`flex items-center justify-center font-bold text-white shadow-sm overflow-hidden select-none ${className}`}
            style={{ background: gradient, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
            title={seed || 'User'}
        >
            {initials}
        </div>
    );
}
