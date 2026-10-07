import React from 'react';

const Avatar = ({ seed, className = "" }) => {
    const avatarSeed = String(seed || 'User').split('&')[0];

    return (
        <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=transparent`} 
            alt="User avatar" 
            className={`object-cover bg-neutral-800 grayscale contrast-125 opacity-90 ${className}`}
        />
    );
}

export default Avatar;
