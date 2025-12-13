
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, MapPin, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PlayDetailPageProps {
    params: Promise<{
        slug: string;
    }>
}

function getPlayImage(slug: string): string {
    // Local images downloaded to /public/images/play/
    if (slug === 'conway-family-bowl') return '/images/play/conway-family-bowl.jpg';
    if (slug === 'action-jacks-conway') return '/images/play/action-jacks-conway.jpg';
    if (slug === 'urban-air-conway') return '/images/play/urban-air-conway.jpg';
    if (slug === 'jacks-ultra-sports') return '/images/play/jacks-ultra-sports.jpg';
    if (slug === 'home-depot-conway-classes') return '/images/play/home-depot-conway-classes.jpg';
    if (slug === 'painting-with-a-twist-conway') return '/images/play/painting-with-a-twist-conway.jpg';

    // Generic Fallbacks
    if (slug.includes('bowl')) return '/images/play/conway-family-bowl.jpg';
    return '/images/play/conway-family-bowl.jpg';
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default async function PlayDetailPage(props: PlayDetailPageProps) {
    const params = await props.params;
    const { slug } = params;
    const supabase = await createClient();

    const { data: venue, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !venue) {
        return notFound();
    }

    const { data: activities } = await supabase
        .from('deals')
        .select('*')
        .eq('business_id', venue.id)
        .eq('is_active', true);

    const imageUrl = getPlayImage(slug);
    const hours = (venue as any).hours || (venue.social_links as any)?.hours || null;

    return (
        <div className="min-h-screen bg-brand-cream pt-24 pb-20">
            <div className="container px-4 mx-auto max-w-4xl">
                <Link href="/play" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-orange mb-6 transition-colors font-medium">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Play
                </Link>

                {/* Hero */}
                <div className="relative h-[300px] w-full rounded-3xl overflow-hidden shadow-lg mb-8 group">
                    <img
                        src={imageUrl}
                        alt={venue.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight shadow-sm">{venue.name}</h1>
                        {venue.address && (
                            <div className="flex items-center gap-2 text-white/90 text-sm md:text-base font-medium">
                                <MapPin className="h-4 w-4 text-brand-orange" />
                                {venue.address}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        {venue.description && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40">
                                <h2 className="text-xl font-bold text-text-dark mb-4 border-b border-gray-100 pb-2">About</h2>
                                <p className="text-text-dark/80 leading-relaxed">
                                    {venue.description}
                                </p>
                            </div>
                        )}

                        {/* Activities / Schedule */}
                        {activities && activities.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40">
                                <h2 className="text-xl font-bold text-text-dark mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <span>🏹 Activities & Schedules</span>
                                </h2>
                                <div className="space-y-4">
                                    {activities.map(activity => (
                                        <div key={activity.id} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 rounded-lg bg-secondary/5 gap-2">
                                            <div>
                                                <h4 className="font-semibold text-text-dark">{activity.title}</h4>
                                                {activity.description && <p className="text-sm text-text-dark/70">{activity.description}</p>}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {activity.days_active && activity.days_active.map((day: string) => (
                                                        <span key={day} className="text-[10px] bg-white border border-border px-1.5 py-0.5 rounded text-muted-foreground">{day}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            {activity.start_time && (
                                                <div className="text-xs font-mono bg-white px-2 py-1 rounded border border-border whitespace-nowrap">
                                                    {activity.start_time} - {activity.end_time || 'Close'}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 sticky top-24">
                            <h3 className="font-bold text-text-dark mb-4 text-lg">Hours of Operation</h3>
                            {hours ? (
                                <ul className="space-y-2 text-sm">
                                    {DAYS_ORDER.map(day => {
                                        const time = hours[day];
                                        const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                                        return (
                                            <li key={day} className={cn("flex justify-between items-center py-1 border-b border-dashed border-gray-100 last:border-0", isToday && "font-bold text-brand-orange")}>
                                                <span className="text-text-dark/80">{day}</span>
                                                <span className={cn("text-right", !time ? "text-muted-foreground italic" : "text-text-dark")}>
                                                    {time || 'Closed'}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Hours not available.</p>
                            )}

                            {/* Links Actions */}
                            <div className="mt-8 space-y-4 pt-4 border-t border-gray-100">
                                {venue.website_url && (
                                    <a
                                        href={venue.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-text-dark font-medium transition-colors group"
                                    >
                                        <span>Visit Website</span>
                                        <ExternalLink className="h-4 w-4 text-brand-orange group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                <a
                                    href="/submit"
                                    className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-200 text-muted-foreground hover:text-brand-orange transition-colors group"
                                >
                                    <span>Updates?</span>
                                    <span className="text-xs bg-white border px-2 py-0.5 rounded-full group-hover:border-brand-orange/30">Owner?</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
