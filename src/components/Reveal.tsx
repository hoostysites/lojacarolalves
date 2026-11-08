'use client';
import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { rootMargin: '0px 0px -60px 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] ${vis ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}>
      {children}
    </div>
  );
}
