'use client';

import { useEffect, useRef, useState, ReactNode, ElementType } from 'react';
import { twMerge } from 'tailwind-merge';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms, applied via inline style so any number works. */
  delay?: number;
  as?: ElementType;
}

/**
 * Wraps children in a fade+slide-up reveal that plays once, the first time
 * the element scrolls into view. Falls back to always-visible if
 * IntersectionObserver isn't available, and is a no-op under
 * prefers-reduced-motion (handled in globals.css).
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Comp = as as any;
  return (
    <Comp
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={twMerge('reveal', visible && 'reveal-visible', className)}
    >
      {children}
    </Comp>
  );
}
