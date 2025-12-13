
'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

const IMAGES = [
    '/images/hero/hero_bridge_walking.jpg',
    '/images/hero/hero_shop_agave.jpg',
    '/images/hero/hero_downtown_street.jpg',
    '/images/hero/hero_bridge_side.jpg',
    '/images/hero/hero_vendor.jpg',
    '/images/hero/downtown.png',
    '/images/hero/park.png',
    '/images/hero/university.png'
];

export function HomeCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden">
            {IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    )}
                >
                    <img
                        src={src}
                        alt="Conway Scenery"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}
        </div>
    );
}
