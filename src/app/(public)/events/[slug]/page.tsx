
import { MapPin, Calendar, Ticket, Share2, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { getEventBySlug } from '@/lib/api/events'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

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

    // Venue Logic: Check description first (appended by ingest), then business, then fallback
    const venueMatch = event.description_raw?.match(/Venue: (.*?)(\n|$)/);
    const venueName = event.businesses?.name || (venueMatch ? venueMatch[1] : 'Conway, AR')
    const venueAddress = event.businesses?.address || ''

    // Source URL Logic
    const sourceUrlMatch = event.description_raw?.match(/Source: (https?:\/\/[^\s]+)/);
    const sourceUrl = sourceUrlMatch ? sourceUrlMatch[1] : event.ticket_url;

    const isNews = event.categories?.includes('News')

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <Link href={isNews ? "/news" : "/events"} className="inline-flex items-center gap-2 text-sm font-medium text-text-dark hover:text-brand-orange transition-colors">
                    <ArrowLeft className="size-4" /> Back to {isNews ? 'News' : 'Events'}
                </Link>
            </div>

            <div className="container mx-auto grid gap-12 px-4 pb-20 md:grid-cols-3">
                {/* Main Content */}
                <div className={isNews ? "md:col-span-3 max-w-4xl mx-auto" : "md:col-span-2"}>
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

                    {/* Metadata for News */}
                    {isNews && (
                        <div className="flex items-center gap-4 text-gray-500 text-sm mb-8 font-sans">
                            <span className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                {format(startDate, 'MMMM d, yyyy')}
                            </span>
                            {sourceUrl && (
                                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-brand-orange hover:underline">
                                    Read Source <Share2 className="size-3" />
                                </a>
                            )}
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none text-gray-600 font-sans leading-relaxed">
                        {!isNews && <h3 className="font-serif text-2xl font-medium text-text-dark mb-4">About this event</h3>}
                        <p className="whitespace-pre-line">{event.description_summary || event.description_raw}</p>
                        {!event.description_summary && !event.description_raw && (
                            <p className="italic text-gray-400">No description available for this event.</p>
                        )}

                        {/* News Button */}
                        {isNews && sourceUrl && (
                            <div className="mt-8">
                                <a
                                    href={sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-red transition-colors duration-300"
                                >
                                    Read Original Article <Share2 className="size-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Events Only) */}
                {!isNews && (
                    <div className="md:sticky md:top-24 h-fit">
                        <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                            <div className="space-y-8">
                                {/* Date */}
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

                                {/* Location */}
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

                                {/* Price */}
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
                                {(event.price_min && event.price_min > 0 && sourceUrl) ? (
                                    <a
                                        href={sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-red transition-colors duration-300"
                                    >
                                        <Ticket className="size-4" /> Get Tickets
                                    </a>
                                ) : null}

                                {sourceUrl && (!event.price_min || event.price_min === 0) && (
                                    <a
                                        href={sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-brand-orange hover:bg-orange-50 transition-colors"
                                    >
                                        View Source Info <ArrowLeft className="size-4 rotate-180" />
                                    </a>
                                )}

                                <button className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-transparent px-8 py-3.5 text-sm font-semibold text-text-dark hover:bg-gray-50 transition-colors">
                                    <Share2 className="size-4" /> Share Event
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
