import Link from 'next/link'
import { Calendar, MapPin, Info } from 'lucide-react'
import { format } from 'date-fns'
import { EventWithVenue } from '@/lib/api/events'

export function EventCard({ event }: { event: { title: string, start_time: string, slug: string, businesses?: { name: string } | null, image_url?: string | null, price_min?: number | null, price_max?: number | null, categories?: string[] | null, description_raw?: string } }) {
    const startDate = new Date(event.start_time)
    // Parse Venue from description if business is generic
    const venueMatch = (event as any).description_raw?.match(/Venue: (.*?)(\n|$)/);
    const venueName = event.businesses?.name || (venueMatch ? venueMatch[1] : 'Conway, AR')
    const minPrice = event.price_min
    const maxPrice = event.price_max

    return (
        <Link
            href={`/events/${event.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-md hover:border-brand-orange/20"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-brand-cream overflow-hidden">
                {event.image_url ? (
                    <img
                        src={event.image_url} // eslint-disable-line @next/next/no-img-element
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-brand-cream text-brand-orange/20 group-hover:text-brand-orange/30 transition-colors">
                        <Calendar className="size-16" />
                    </div>
                )}
                {/* Badge Removed */}
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
                        <Info className="size-4 text-brand-orange" />
                        <span>
                            {minPrice === 0
                                ? 'Free Entry'
                                : minPrice
                                    ? `$${minPrice}` + (maxPrice ? ` - $${maxPrice}` : '+')
                                    : 'See Details'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
