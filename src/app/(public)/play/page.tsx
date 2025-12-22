import { createClient } from '@/utils/supabase/server';
import { PlayCard } from '@/components/play/PlayCard';
import { EventCard } from '@/components/events/EventCard';
import { getUpcomingEvents } from '@/lib/api/events';

export const revalidate = 3600; // 1 hour

export default async function PlayPage() {
    const supabase = await createClient();

    // Fetch Attractions (Venues)
    const { data: venues, error } = await supabase
        .from('businesses')
        .select(`
            *,
            deals (
                *
            )
        `)
        .in('category', ['arts_entertainment', 'retail', 'park'])
        .order('name');

    if (error) {
        console.error('Error fetching play venues:', error);
    }

    const attractions = venues || [];

    // Fetch Upcoming Events
    const events = await getUpcomingEvents(9); // Fetch top 9 events

    return (
        <div className="min-h-screen bg-brand-cream pt-24 pb-12 px-4 md:px-8 space-y-20">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold tracking-tight text-text-dark md:text-6xl mb-6 font-serif">
                    Play in Conway
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Discover parks, entertainment, and upcoming events for the whole family.
                </p>
            </div>

            {/* Attractions Section */}
            <section id="attractions">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-bold font-serif text-text-dark">Attractions</h2>
                    <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {attractions.length > 0 ? (
                        attractions.map((r: any) => (
                            <PlayCard
                                key={r.id}
                                venue={r}
                                deals={r.deals || []}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-400 italic">
                            No attractions found.
                        </div>
                    )}
                </div>
            </section>

            {/* Events Section */}
            <section id="events" className="bg-white/50 p-8 -mx-4 md:-mx-8 md:px-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-bold font-serif text-text-dark">Upcoming Events</h2>
                    <div className="h-px flex-1 bg-gray-200"></div>
                    <a href="/events" className="text-sm font-semibold text-brand-orange hover:text-brand-red transition-colors">
                        View All Events &rarr;
                    </a>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-400 italic">
                            No upcoming entertainment events found.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
