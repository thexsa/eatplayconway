import { EventCard } from '@/components/events/EventCard'
import { getLatestNews } from '@/lib/api/events'
import { Newspaper } from 'lucide-react'
import { ScrollReveal } from '@/components/layout/ScrollReveal'

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
    const newsItems = await getLatestNews(50)

    return (
        <div className="min-h-screen bg-brand-cream pb-20">
            {/* Header */}
            <div className="bg-white/50 pt-32 pb-16 px-4 mb-12 border-b border-gray-100">
                <div className="container mx-auto">
                    <ScrollReveal>
                        <h1 className="font-serif text-5xl font-medium text-text-dark mb-4 flex items-center gap-3">
                            <Newspaper className="size-10 text-brand-orange" />
                            Local News
                        </h1>
                    </ScrollReveal>
                    <ScrollReveal threshold={0.2}>
                        <p className="text-xl text-gray-600 font-sans max-w-2xl">
                            Stay updated with the latest community announcements, reports, and recaps from around Conway.
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-grid revealed">
                    {newsItems.length > 0 ? (
                        newsItems.map((item) => (
                            <EventCard key={item.id} event={item} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No news items found at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
