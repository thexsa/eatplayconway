import { EventCard } from '@/components/events/EventCard'
import { Calendar, Filter, ArrowRight } from 'lucide-react'
import { getUpcomingEvents } from '@/lib/api/events'
import Link from 'next/link'
import { EventsFilter } from '@/components/events/EventsFilter'

export const dynamic = 'force-dynamic' // Disable caching for debugging

export default async function EventsPage() {
    // Revalidating cache key
    const events = await getUpcomingEvents(50) // Fetch more events for the listing page

    return (
        <div className="min-h-screen bg-brand-cream pb-20">
            {/* Header */}
            <div className="bg-white/50 pt-32 pb-16 px-4 mb-12 border-b border-gray-100">
                <div className="container mx-auto">
                    <h1 className="font-serif text-5xl font-medium text-text-dark mb-4">All Events</h1>
                    <p className="text-xl text-gray-600 font-sans max-w-2xl">
                        Discover what's happening in Conway using our curated calendar of community events.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-8">
                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="font-serif text-lg text-text-dark">
                            Showing {events.length} Upcoming Events
                        </div>
                        <EventsFilter />
                    </div>

                    {/* Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
