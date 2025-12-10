
import { EventCard } from '@/components/events/EventCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getUpcomingEvents } from '@/lib/api/events'

export default async function HomePage() {
    const featuredEvents = await getUpcomingEvents()

    return (
        <div className="flex flex-col gap-16 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519750783826-e2420f4d687f?q=80&w=3388&auto=format&fit=crop"
                        alt="Conway Background"
                        className="h-full w-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>

                <div className="container relative z-10 mx-auto px-4 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        Never Miss Out on <span className="text-orange-500">Conway.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
                        The automated guide to everything happening in the City of Colleges.
                        Events, deals, and weekend guides curated just for you.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            href="/events"
                            className="rounded-full bg-orange-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                        >
                            Browse Events
                        </Link>
                        <Link
                            href="/guides"
                            className="rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                        >
                            See Weekend Guide
                        </Link>
                    </div>
                </div>
            </section>

            {/* Events Grid */}
            <section className="container mx-auto px-4">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Happening Soon</h2>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">Top picks for you in Conway this week.</p>
                    </div>
                    <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-500">
                        View all <ArrowRight className="size-4" />
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredEvents.length > 0 ? (
                        featuredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-zinc-500">
                            No upcoming events found. Check back soon!
                        </div>
                    )}
                </div>

                <div className="mt-8 sm:hidden">
                    <Link href="/events" className="flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold">
                        View all events <ArrowRight className="size-4" />
                    </Link>
                </div>
            </section>

            {/* Featured Deals Teaser */}
            <section className="bg-orange-50 py-16 dark:bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Local Deals & Specials</h2>
                        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                            Save money at your favorite local spots. Happy hours, lunch specials, and exclusive coupons.
                        </p>
                        <div className="mt-8 grid w-full gap-4 sm:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex flex-col items-start rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border dark:border-zinc-800">
                                    <span className="mb-4 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Lunch Special
                                    </span>
                                    <h3 className="text-lg font-bold">Burger & Beer $12</h3>
                                    <p className="text-sm text-zinc-500">JJ&apos;s Grill</p>
                                </div>
                            ))}
                        </div>
                        <Link
                            href="/deals"
                            className="mt-10 font-semibold text-orange-600 hover:text-orange-500 underline decoration-2 underline-offset-4"
                        >
                            See all 42 active deals
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
