import React from 'react';

const Avatar = ({ seed, className = "" }) => {
    return (
        <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=transparent`} 
            alt={seed || 'User'} 
            className={`w-full h-full object-cover bg-neutral-800 grayscale contrast-125 opacity-90 ${className}`}
        />
    );
}

export default Avatar;
