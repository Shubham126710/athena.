import React from 'react';

// Animated blurred gradient orbs background. Respects reduced motion.
export default function BloomField(){
  const containerRef = React.useRef(null);
  const prefersReduced = React.useMemo(()=> typeof window!== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  React.useEffect(()=> {
    const host = containerRef.current; if(!host) return;
    const COUNT = prefersReduced ? 4 : 12;
    const palettes = [
      { base:38, variance:25 }, // warm amber
      { base:205, variance:30 }, // azure
      { base:285, variance:25 }, // violet
      { base:165, variance:25 }, // teal
      { base:345, variance:20 }  // rose
    ];
    const nodes = [];
    for (let i=0;i<COUNT;i++) {
      const span = document.createElement('span');
      span.className = 'absolute rounded-full mix-blend-screen pointer-events-none will-change-transform';
      const size = 180 + Math.random()*340;
      const palette = palettes[i % palettes.length];
      const hue = palette.base + (Math.random()*palette.variance - palette.variance/2);
      const hueShiftSpeed = (Math.random()*0.08 + 0.02) * (Math.random()<0.5?-1:1);
      span.style.width = span.style.height = size+'px';
      const x = Math.random()*100, y = Math.random()*100;
      span.style.left = x+'%'; span.style.top = y+'%';
      span.style.filter = 'blur(70px)';
      span.style.opacity = (prefersReduced?0.22:0.18) + Math.random()*0.25;
      span.style.background = `radial-gradient(circle at 28% 30%, hsla(${hue},95%,70%,0.85), hsla(${hue+15},85%,55%,0.35) 45%, transparent 70%)`;
      host.appendChild(span);
      nodes.push({ el:span, vx:(Math.random()*0.05-0.025), vy:(Math.random()*0.05-0.025), x, y, hue, hueShiftSpeed });
    }
    let frame = 0; let raf;
    const animate = () => {
      frame++;
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if(n.x < -8 || n.x > 108) n.vx *= -1;
        if(n.y < -8 || n.y > 108) n.vy *= -1;
        if(!prefersReduced){
          n.hue += n.hueShiftSpeed;
          if(frame % 5 === 0) {
            const h1 = (n.hue)%360; const h2 = (n.hue+18)%360;
            n.el.style.background = `radial-gradient(circle at 30% 30%, hsla(${h1},95%,70%,0.82), hsla(${h2},80%,55%,0.32) 45%, transparent 70%)`;
          }
          n.el.style.transform = `translate(-50%, -50%) translate(${n.x}%, ${n.y}%)`;
        } else {
          n.el.style.transform = `translate(-50%, -50%) translate(${n.x}%, ${n.y}%)`;
        }
      });
      raf = requestAnimationFrame(animate);
    };
    if(!prefersReduced) animate();
    return ()=> { cancelAnimationFrame(raf); nodes.forEach(n=> n.el.remove()); };
  }, [prefersReduced]);
  return <div ref={containerRef} aria-hidden className="absolute inset-0 overflow-hidden" />;
}
