import Link from 'next/link'
import { getUpcomingEvents } from '@/lib/api/events'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic' // Disable caching to ensure fresh events/slugs

export default async function HomePage() {
    const events = await getUpcomingEvents(9)

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* Geometric Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-orange opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-brand-red opacity-10 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-yellow opacity-10 blur-3xl"></div>

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-5xl font-medium tracking-tight text-text-dark sm:text-7xl mb-6">
                        Discover Conway’s <br />
                        <span className="italic relative inline-block">
                            <span className="relative z-10">Best Moments</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-brand-yellow/50 -rotate-1 z-0"></span>
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 font-sans">
                        Your curated guide to events, local eats, and hidden gems in Conway, Arkansas. Automatically updated daily.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link href="/events" className="rounded-full bg-brand-red px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange transition-colors duration-300">
                            Explore Events
                        </Link>
                        <Link href="/deals" className="text-sm font-semibold leading-6 text-text-dark hover:text-brand-orange transition-colors">
                            Find Deals <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Event Grid */}
            <section className="py-24 bg-white/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="font-serif text-3xl font-medium text-text-dark">Happening This Week</h2>
                        <Link href="/events" className="text-sm font-medium text-brand-red hover:text-brand-orange flex items-center gap-1">
                            View all <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Link key={event.slug} href={`/events/${event.slug}`} className="group block">
                                <article className="flex flex-col h-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 mb-4">
                                        {event.image_url ? (
                                            <img
                                                src={event.image_url}
                                                alt={event.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-brand-cream text-brand-orange">
                                                <Calendar className="h-12 w-12 opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-text-dark shadow-sm">
                                            {event.price_type === 'free' ? 'Free' : 'Ticketed'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-x-4 text-xs font-bold text-brand-red mb-2 font-sans uppercase tracking-wide">
                                            <time dateTime={event.start_time}>
                                                {new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </time>
                                        </div>
                                        <h3 className="font-serif text-xl font-medium text-text-dark group-hover:text-brand-orange transition-colors line-clamp-2 mb-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-auto">
                                            <MapPin className="size-4 text-brand-yellow" />
                                            <span className="truncate">{event.businesses?.name || 'Various Locations'}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
