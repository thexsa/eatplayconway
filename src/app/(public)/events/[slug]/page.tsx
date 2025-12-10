import { MapPin, Calendar, Clock, Ticket, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/api/events'
import { notFound } from 'next/navigation'

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const event = await getEventBySlug(slug)

    if (!event) {
        notFound()
    }

    const startDate = new Date(event.start_time)
    const venueName = event.businesses?.name || 'Unknown Venue'
    const venueAddress = event.businesses?.address || ''

    return (
        <div className="bg-white dark:bg-zinc-950">
            {/* Banner Image */}
            <div className="relative h-[300px] w-full overflow-hidden bg-zinc-100 md:h-[400px] dark:bg-zinc-800">
                {event.image_url && (
                    <img
                        src={event.image_url}
                        alt={event.title}
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="container mx-auto absolute bottom-0 left-0 right-0 p-4 pb-8 md:px-8">
                    <div className="mb-2 rounded-full bg-orange-600 w-fit px-3 py-1 text-xs font-bold uppercase text-white">
                        {(event.categories && event.categories[0]) || 'Event'}
                    </div>
                    <h1 className="text-3xl font-extrabold text-white md:text-5xl">{event.title}</h1>
                </div>
            </div>

            <div className="container mx-auto grid gap-8 px-4 py-8 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2">
                    <div className="prose max-w-none text-zinc-600 dark:prose-invert dark:text-zinc-300">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">About this event</h3>
                        <p>{event.description_summary || event.description_raw}</p>
                        {/* Fallback for now */}
                        {!event.description_summary && !event.description_raw && (
                            <p className="italic text-zinc-400">No description available for this event.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl border p-6 shadow-sm dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-1 size-5 text-orange-500" />
                                <div>
                                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">Date & Time</div>
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {format(startDate, 'EEEE, MMMM d, yyyy')}
                                    </div>
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {format(startDate, 'h:mm a')}
                                        {event.end_time && ` - ${format(new Date(event.end_time), 'h:mm a')}`}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 size-5 text-orange-500" />
                                <div>
                                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">Location</div>
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{venueName}</div>
                                    <div className="text-xs text-zinc-500">{venueAddress}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Ticket className="mt-1 size-5 text-orange-500" />
                                <div>
                                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">Price</div>
                                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {event.price_min === 0 ? 'Free Entry' : `$${event.price_min}`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="mt-6 w-full rounded-lg bg-orange-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500">
                            Get Tickets / RSVP
                        </button>
                        <button className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                            <Share2 className="size-4" /> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
