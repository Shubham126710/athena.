import React from 'react';

export default function ThemeToggle({ className = '' }) {
  const [dark, setDark] = React.useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('theme') !== 'light';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark(d => !d)}
      className={`relative inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border border-white/15 bg-white/5 dark:bg-white/5 dark:border-white/15 backdrop-blur hover:bg-white/10 dark:hover:bg-white/10 transition-colors ${className}`}
      aria-label="Toggle color theme"
    >
      <span className="w-4 h-4 grid place-items-center">
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M12 3c.132 0 .263.003.393.01A7.5 7.5 0 0 0 12 21a9 9 0 0 1 0-18Z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 6.07-1.42-1.42M6.35 8.35 4.93 6.93m12.72-2.12-1.42 1.42M6.35 15.66l-1.42 1.42" /></svg>
        )}
      </span>
      {dark ? 'Dark' : 'Light'}
    </button>
  );
}
