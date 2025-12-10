import Link from 'next/link'
import { Calendar, MapPin, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import { EventWithVenue } from '@/lib/api/events'

export function EventCard({ event }: { event: EventWithVenue }) {
    const startDate = new Date(event.start_time)
    const venueName = event.businesses?.name || 'Unknown Venue'
    const category = (event.categories && event.categories[0]) || 'Event'
    const minPrice = event.price_min
    const maxPrice = event.price_max

    return (
        <Link
            href={`/events/${event.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-zinc-900 dark:border-zinc-800"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {event.image_url ? (
                    <img
                        src={event.image_url} // eslint-disable-line @next/next/no-img-element
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-zinc-400">
                        <Calendar className="size-10 opacity-20" />
                    </div>
                )}
                <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold uppercase text-zinc-900 backdrop-blur-sm dark:bg-zinc-950/90 dark:text-zinc-50">
                    {category}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 text-xs font-medium text-orange-600 dark:text-orange-500">
                    {format(startDate, 'EEE, MMM d • h:mm a')}
                </div>

                <h3 className="mb-2 text-lg font-bold leading-tight text-zinc-900 group-hover:text-orange-600 dark:text-zinc-50 dark:group-hover:text-orange-500">
                    {event.title}
                </h3>

                <div className="mt-auto flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        <span className="line-clamp-1">{venueName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Ticket className="size-4" />
                        <span>
                            {minPrice === 0
                                ? 'Free'
                                : minPrice
                                    ? `$${minPrice}` + (maxPrice ? ` - $${maxPrice}` : '')
                                    : 'See Details'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
