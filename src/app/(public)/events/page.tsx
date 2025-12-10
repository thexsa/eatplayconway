import { EventCard } from '@/components/events/EventCard'
import { Calendar, Filter } from 'lucide-react'
import { getUpcomingEvents } from '@/lib/api/events'

export default async function EventsPage() {
    const events = await getUpcomingEvents()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">All Events</h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Browse upcoming concerts, festivals, and community gatherings in Conway.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800">
                        <Calendar className="size-4" /> Date Range
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800">
                        <Filter className="size-4" /> Filters
                    </button>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    )
}
