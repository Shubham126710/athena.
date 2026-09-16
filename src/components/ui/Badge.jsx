import React from 'react';

export function Badge({ className = '', variant = 'default', size = 'default', children, ...props }) {
  return (
    <div className={`inline-flex items-center justify-center font-medium transition-colors ${className}`} {...props}>
      {children}
    </div>
  );
}
