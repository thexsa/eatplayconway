
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    threshold?: number;
    stagger?: boolean;
}

export function ScrollReveal({ children, className = '', threshold = 0.1, stagger = false }: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const revealClass = stagger ? 'stagger-grid' : 'reveal';

    return (
        <div
            ref={ref}
            className={`${revealClass} ${isVisible ? 'revealed' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
