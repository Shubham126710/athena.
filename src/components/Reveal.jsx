import React from 'react';

export default function Reveal({ as: Tag = 'div', className = '', children, threshold = 0.25, delay = 0 }) {
  const ref = React.useRef(null);
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setShow(true), delay);
        io.disconnect();
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, delay]);
  return (
    <Tag ref={ref} className={`transition-all duration-700 ease-out will-change-transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      {children}
    </Tag>
  );
}
