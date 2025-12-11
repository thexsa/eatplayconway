import { EventCard } from '@/components/events/EventCard'
import { Calendar, Filter, ArrowRight } from 'lucide-react'
import { getUpcomingEvents } from '@/lib/api/events'
import Link from 'next/link'

export default async function EventsPage() {
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
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-transparent px-4 py-2 text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors">
                                <Calendar className="size-4" /> Date Range
                            </button>
                            <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-transparent px-4 py-2 text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors">
                                <Filter className="size-4" /> Filters
                            </button>
                        </div>
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
