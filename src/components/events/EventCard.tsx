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
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-orange/20"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {event.image_url ? (
                    <img
                        src={event.image_url} // eslint-disable-line @next/next/no-img-element
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-brand-orange/40 bg-brand-cream">
                        <Calendar className="size-12" />
                    </div>
                )}
                <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-dark backdrop-blur-sm shadow-sm">
                    {category}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-red">
                    {format(startDate, 'EEE, MMM d • h:mm a')}
                </div>

                <h3 className="mb-3 font-serif text-xl font-medium leading-tight text-text-dark transition-colors group-hover:text-brand-orange line-clamp-2">
                    {event.title}
                </h3>

                <div className="mt-auto flex flex-col gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-brand-yellow" />
                        <span className="line-clamp-1">{venueName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Ticket className="size-4 text-brand-orange" />
                        <span>
                            {minPrice === 0
                                ? 'Free Entry'
                                : minPrice
                                    ? `$${minPrice}` + (maxPrice ? ` - $${maxPrice}` : '+')
                                    : 'Ticketed'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
