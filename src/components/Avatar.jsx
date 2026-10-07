import React from 'react';

const Avatar = ({ seed, className = "" }) => {
    const seedString = String(seed || 'User');
    const parts = seedString.split('&');
    const baseSeed = parts[0];
    const params = parts.slice(1).join('&');

    // Append params if they exist, making sure to handle unencoded & 
    const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(baseSeed)}&backgroundColor=transparent${params ? '&' + params : ''}`;

    return (
        <img 
            src={url} 
            alt="User avatar" 
            className={`object-cover bg-neutral-800 grayscale contrast-125 opacity-90 ${className}`}
        />
    );
}

export default Avatar;
