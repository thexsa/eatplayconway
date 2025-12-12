'use client';

import Link from 'next/link';
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

interface Restaurant {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    website_url: string | null;
    description: string | null;
    social_links: any;
    // deals joined?
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    deals: Deal[];
}

function getRestaurantImage(slug: string): string {
    // Static mapping for the "Top 5" to ensure they look good immediately
    // Using Unsplash source with specific keywords/IDs
    if (slug.includes('rogue')) return 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'; // Cocktail/Bar
    if (slug.includes('breakfast')) return 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80'; // Breakfast (New Pancake/Egg Image)
    if (slug.includes('steak')) return 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=800&q=80'; // Steak
    if (slug.includes('italian') || slug.includes('portofino')) return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'; // Italian
    if (slug.includes('grill') || slug.includes('marketplace')) return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'; // Grill/BBQ

    // Fallback
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
}

export function RestaurantCard({ restaurant, deals }: RestaurantCardProps) {
    const initialImageUrl = getRestaurantImage(restaurant.slug);
    const [imgSrc, setImgSrc] = useState(initialImageUrl);
    const [hasError, setHasError] = useState(false);

    const handleImageError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'); // Fallback Generic
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border-hover min-h-[400px]">

            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden bg-secondary/30">
                <img
                    src={imgSrc}
                    alt={restaurant.name}
                    onError={handleImageError}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <h3 className="absolute bottom-3 left-4 right-4 line-clamp-2 text-xl font-bold tracking-tight text-white shadow-sm">
                    {restaurant.name}
                </h3>
            </div>

            <div className="flex flex-1 flex-col p-5">
                {/* Info Header */}
                <div className="mb-3">
                    {restaurant.address && (
                        <div className="flex items-center gap-1.5 text-sm text-text-dark/70 mb-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                            <span className="line-clamp-1">{restaurant.address}</span>
                        </div>
                    )}

                    {restaurant.description && (
                        <p className="text-sm text-text-dark/80 line-clamp-3 leading-relaxed">
                            {restaurant.description}
                        </p>
                    )}
                </div>

                {/* Deals Section */}
                <div className="mt-auto pt-4 border-t border-border/50">
                    <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-2">Current Specials</p>

                    {deals && deals.length > 0 ? (
                        <ul className="space-y-2">
                            {deals.map(deal => (
                                <li key={deal.id} className="text-sm">
                                    <span className="font-medium text-text-dark">{deal.title}</span>
                                    {deal.description && <span className="text-muted-foreground text-xs block mt-0.5"> {deal.description}</span>}
                                    {deal.start_time && (
                                        <span className="text-[10px] text-muted-foreground ml-1 inline-block bg-secondary/50 px-1.5 py-0.5 rounded">
                                            {deal.start_time} - {deal.end_time || 'Close'}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">
                            No deals listed today. Check website for updates.
                        </p>
                    )}
                </div>

                <div className="mt-4 flex gap-3">
                    {restaurant.website_url && (
                        <a
                            href={restaurant.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange hover:underline decoration-brand-orange/50"
                        >
                            Visit Website <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
