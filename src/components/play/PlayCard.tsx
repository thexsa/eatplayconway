
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ExternalLink, MapPin } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useState } from 'react';

interface Deal {
    id: string;
    title: string;
    description?: string;
    deal_type?: string;
    days_active?: string[];
    start_time?: string;
    end_time?: string;
}

interface Venue {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    website_url: string | null;
    menu_url?: string | null;
    description: string | null;
    social_links: any;
}

interface PlayCardProps {
    venue: Venue;
    deals: Deal[];
}

import { getPlayImage } from '@/lib/data/play-images';


export function PlayCard({ venue, deals }: PlayCardProps) {
    const router = useRouter();
    const initialImageUrl = getPlayImage(venue.slug);
    // DEBUG: Log to verify what image is being selected
    console.log(`[PlayCard] Slug: ${venue.slug}, Image: ${initialImageUrl}`);

    const [imgSrc, setImgSrc] = useState(initialImageUrl);
    const [hasError, setHasError] = useState(false);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Filter deals for today
    const todaysDeals = deals?.filter(d =>
        !d.days_active || d.days_active.includes(today)
    ) || [];

    const handleImageError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc('/images/play/conway-family-bowl.jpg'); // Safe local fallback
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
            return;
        }
        router.push(`/play/${venue.slug}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border-hover min-h-[400px] cursor-pointer"
        >
            {/* Image Section */}
            <div className="relative h-56 w-full overflow-hidden bg-secondary/30">
                <img
                    src={imgSrc}
                    alt={venue.name}
                    onError={handleImageError}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                <h3 className="absolute bottom-3 left-4 right-4 line-clamp-2 text-2xl font-bold tracking-tight text-white shadow-sm">
                    {venue.name}
                </h3>
            </div>

            <div className="flex flex-1 flex-col p-5">
                {/* Info Header */}
                <div className="mb-3">
                    {venue.address && (
                        <div className="flex items-center gap-1.5 text-sm text-text-dark/70 mb-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                            <span className="line-clamp-1">{venue.address}</span>
                        </div>
                    )}

                    {venue.description && (
                        <p className="text-sm text-text-dark/80 line-clamp-3 leading-relaxed">
                            {venue.description}
                        </p>
                    )}
                </div>

                {/* Activities Section */}
                <div className="mt-auto px-5 -mx-5 pb-2 pt-4 border-t border-border/50 bg-secondary/5 space-y-3">
                    {todaysDeals.length > 0 ? (
                        <div>
                            <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-1 flex items-center gap-1">
                                <span className="bg-brand-orange/10 px-1 py-0.5 rounded">🎉 Today's Fun</span>
                            </p>
                            <ul className="space-y-1">
                                {todaysDeals.map(deal => (
                                    <li key={deal.id} className="text-xs text-text-dark leading-tight">
                                        <span className="font-medium">{deal.title}</span>
                                        {deal.start_time && <span className="text-muted-foreground ml-1 text-[10px]">({deal.start_time} - {deal.end_time || 'Close'})</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic py-2 px-5">
                            Open for fun today!
                        </p>
                    )}
                </div>

                <div className="mt-4 flex gap-3 flex-wrap pt-2">
                    <Link
                        href={`/play/${venue.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange hover:underline decoration-brand-orange/50"
                    >
                        View Activities
                    </Link>

                    {venue.website_url && (
                        <a
                            href={venue.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-brand-orange transition-colors"
                        >
                            Website <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
