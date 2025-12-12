
import Link from 'next/link';
import { ExternalLink, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';

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
    social_links: any;
    // deals joined?
}

interface RestaurantCardProps {
    restaurant: Restaurant;
    deals: Deal[];
}

export function RestaurantCard({ restaurant, deals }: RestaurantCardProps) {
    // Determine if any deal is active TODAY
    // This logic might be better calculated on server, but for UI:
    // We assume 'deals' passed are already filtered or we show all?
    // Let's show "Today's Specials" if any align with current day.

    // For now, simpler: Just list them.

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border-hover">

            {/* Header / Image Placeholder (Restaurants might not have images yet) */}
            <div className="h-32 bg-secondary/30 flex items-center justify-center">
                <span className="text-4xl text-muted-foreground/50 font-bold select-none">{restaurant.name.charAt(0)}</span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {restaurant.name}
                    </h3>
                </div>

                {restaurant.address && (
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{restaurant.address}</span>
                    </div>
                )}

                {deals && deals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-2">Current Specials</p>
                        <ul className="space-y-2">
                            {deals.map(deal => (
                                <li key={deal.id} className="text-sm">
                                    <span className="font-medium text-foreground">{deal.title}</span>
                                    {deal.description && <span className="text-muted-foreground"> - {deal.description}</span>}
                                    {deal.start_time && (
                                        <span className="text-xs text-muted-foreground ml-1 block">
                                            {deal.start_time} - {deal.end_time || 'Close'}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-auto pt-4 flex gap-3">
                    {restaurant.website_url && (
                        <a
                            href={restaurant.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline hover:text-primary-hover"
                        >
                            Website <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
