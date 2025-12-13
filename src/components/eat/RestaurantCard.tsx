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

interface Restaurant {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    website_url: string | null;
    menu_url?: string | null;
    description: string | null;
    social_links: any;
    // deals joined?
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    deals: Deal[];
}

import { getRestaurantImage } from '@/lib/data/restaurant-images';

// Removed local getRestaurantImage function


export function RestaurantCard({ restaurant, deals }: RestaurantCardProps) {
    const router = useRouter();
    const initialImageUrl = getRestaurantImage(restaurant.slug);
    const [imgSrc, setImgSrc] = useState(initialImageUrl);
    const [hasError, setHasError] = useState(false);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Filter deals for today
    const todaysDeals = deals?.filter(d =>
        !d.days_active || d.days_active.includes(today)
    ) || [];

    const foodSpecials = todaysDeals.filter(d => d.deal_type === 'food' || d.deal_type === 'discount' || !d.deal_type);
    const drinkSpecials = todaysDeals.filter(d => d.deal_type === 'drink');
    const happyHours = todaysDeals.filter(d => d.deal_type === 'happy_hour');

    const hasSpecials = foodSpecials.length > 0 || drinkSpecials.length > 0 || happyHours.length > 0;

    const handleImageError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'); // Generic Restaurant Fallback
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent navigation if clicking on an interactive element (like a link)
        if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
            return;
        }
        router.push(`/eat/${restaurant.slug}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border-hover min-h-[450px] cursor-pointer"
        >

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

                {/* Specials Section */}
                <div className="mt-auto px-5 -mx-5 pb-2 pt-4 border-t border-border/50 bg-secondary/5 space-y-3">

                    {/* 1. Food Specials */}
                    {foodSpecials.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-1 flex items-center gap-1">
                                <span className="bg-brand-orange/10 px-1 py-0.5 rounded">🍽️ Food</span>
                            </p>
                            <ul className="space-y-1">
                                {foodSpecials.map(deal => (
                                    <li key={deal.id} className="text-xs text-text-dark leading-tight">
                                        <span className="font-medium">{deal.title}</span>
                                        {deal.start_time && <span className="text-muted-foreground ml-1 text-[10px]">({deal.start_time} - {deal.end_time || 'Close'})</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 2. Drink Specials */}
                    {drinkSpecials.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-1 flex items-center gap-1">
                                <span className="bg-brand-orange/10 px-1 py-0.5 rounded">🍹 Drinks</span>
                            </p>
                            <ul className="space-y-1">
                                {drinkSpecials.map(deal => (
                                    <li key={deal.id} className="text-xs text-text-dark leading-tight">
                                        <span className="font-medium">{deal.title}</span>
                                        {deal.start_time && <span className="text-muted-foreground ml-1 text-[10px]">({deal.start_time} - {deal.end_time || 'Close'})</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 3. Happy Hour */}
                    {happyHours.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-brand-orange uppercase tracking-wider mb-1 flex items-center gap-1">
                                <span className="bg-brand-orange/10 px-1 py-0.5 rounded">⏰ Happy Hour</span>
                            </p>
                            <ul className="space-y-1">
                                {happyHours.map(deal => (
                                    <li key={deal.id} className="text-xs text-text-dark leading-tight">
                                        <span className="font-medium">{deal.title}</span>
                                        {deal.start_time && <span className="text-muted-foreground ml-1 text-[10px]">({deal.start_time} - {deal.end_time})</span>}
                                        <div className="text-[10px] text-muted-foreground truncate">{deal.description}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!hasSpecials && (
                        <p className="text-xs text-muted-foreground italic py-2 px-5">
                            No specials listed for {today}.
                        </p>
                    )}
                </div>

                <div className="mt-4 flex gap-3 flex-wrap pt-2">
                    {restaurant.menu_url ? (
                        <a
                            href={restaurant.menu_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-orange hover:underline decoration-brand-orange/50"
                        >
                            Peep the Menu <ExternalLink className="h-3 w-3" />
                        </a>
                    ) : (
                        <Link
                            href="/submit"
                            className="inline-flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-brand-orange transition-colors"
                        >
                            <span className="border-b border-dashed border-gray-400 hover:border-brand-orange">Add your menu</span>
                            <span className="bg-gray-100 text-[10px] px-1 rounded text-gray-500">Owner?</span>
                        </Link>
                    )}

                    {restaurant.website_url && (
                        <a
                            href={restaurant.website_url}
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
