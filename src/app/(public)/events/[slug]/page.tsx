import { MapPin, Calendar, Clock, Ticket, Share2, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/api/events'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic' // Disable caching to fix 404s on fresh database

export default async function EventDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    console.log(`[EventDetails] Visiting slug: '${slug}'`)

    const event = await getEventBySlug(slug)
    console.log(`[EventDetails] Lookup result for '${slug}':`, event ? `Found (ID: ${event.id})` : 'NULL')

    if (!event) {
        console.error(`[EventDetails] 404 triggered for slug: ${slug}`)
        notFound()
    }

    const startDate = new Date(event.start_time)
    const venueName = event.businesses?.name || 'Unknown Venue'
    const venueAddress = event.businesses?.address || ''

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Minimal Header */}
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-dark hover:text-brand-orange transition-colors">
                    <ArrowLeft className="size-4" /> Back to Events
                </Link>
            </div>

            <div className="container mx-auto grid gap-12 px-4 pb-20 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2">
                    {/* Hero Image */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg mb-8 bg-zinc-100">
                        {event.image_url ? (
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-brand-yellow/10">
                                <Calendar className="size-20 text-brand-yellow opacity-50" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-orange shadow-sm">
                            {(event.categories && event.categories[0]) || 'Event'}
                        </div>
                    </div>

                    <h1 className="font-serif text-4xl md:text-6xl font-medium text-text-dark mb-6 leading-tight">
                        {event.title}
                    </h1>

                    <div className="prose prose-lg max-w-none text-gray-600 font-sans leading-relaxed">
                        <h3 className="font-serif text-2xl font-medium text-text-dark mb-4">About this event</h3>
                        <p>{event.description_summary || event.description_raw}</p>
                        {!event.description_summary && !event.description_raw && (
                            <p className="italic text-gray-400">No description available for this event.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Sticky */}
                <div className="md:sticky md:top-24 h-fit">
                    <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                        <div className="space-y-8">
                            {/* Date Group */}
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-brand-red/10 p-3 text-brand-red">
                                    <Calendar className="size-6" />
                                </div>
                                <div>
                                    <div className="font-serif text-lg font-medium text-text-dark">Date & Time</div>
                                    <div className="mt-1 font-sans text-gray-600">
                                        {format(startDate, 'EEEE, MMMM d, yyyy')}
                                    </div>
                                    <div className="text-gray-500">
                                        {format(startDate, 'h:mm a')}
                                        {event.end_time && ` - ${format(new Date(event.end_time), 'h:mm a')}`}
                                    </div>
                                </div>
                            </div>

                            {/* Location Group */}
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-brand-yellow/10 p-3 text-brand-yellow">
                                    <MapPin className="size-6" />
                                </div>
                                <div>
                                    <div className="font-serif text-lg font-medium text-text-dark">Location</div>
                                    <div className="mt-1 font-sans text-gray-600">{venueName}</div>
                                    <div className="text-sm text-gray-400">{venueAddress}</div>
                                </div>
                            </div>

                            {/* Price Group */}
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-brand-orange/10 p-3 text-brand-orange">
                                    <Ticket className="size-6" />
                                </div>
                                <div>
                                    <div className="font-serif text-lg font-medium text-text-dark">Price</div>
                                    <div className="mt-1 font-sans text-gray-600">
                                        {event.price_min === 0
                                            ? 'Free Entry'
                                            : event.price_min
                                                ? `$${event.price_min}+`
                                                : 'See Details'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-3">
                            {/* 
                            <a 
                                href={event.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full rounded-full bg-brand-orange px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-red transition-colors duration-300"
                            >
                                Read Original Article
                            </a>
                            */}

                            {(event.price_min && event.price_min > 0) ? (
                                <button className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-transparent px-8 py-3.5 text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors">
                                    <Ticket className="size-4" /> Get Tickets
                                </button>
                            ) : null}

                            <button className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-transparent px-8 py-3.5 text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors">
                                <Share2 className="size-4" /> Share Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
