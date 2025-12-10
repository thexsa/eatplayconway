import { Tag, Clock, MapPin } from 'lucide-react'

// Mock Deals
const deals = [
    {
        id: '1',
        title: 'Burger & Beer $12',
        business: 'JJ\'s Grill',
        type: 'Lunch Special',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        time: '11:00 AM - 3:00 PM',
        description: 'Get our classic cheeseburger and a domestic draft for just $12 during lunch hours.'
    },
    {
        id: '2',
        title: 'Happy Hour: 1/2 Price Apps',
        business: 'TGI Fridays',
        type: 'Happy Hour',
        days: ['Daily'],
        time: '3:00 PM - 6:00 PM',
        description: 'Half price on all appetizers and $4 draft beers.'
    },
    {
        id: '3',
        title: 'Kids Eat Free',
        business: 'MarketPlace Grill',
        type: 'Family Deal',
        days: ['Tue'],
        time: '5:00 PM - Close',
        description: 'One free kids meal per adult entree purchase.'
    }
]

export default function DealsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-10 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Local Deals & Specials</h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                    Discover happy hours, lunch specials, and exclusive coupons from Conway businesses.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {deals.map(deal => (
                    <div key={deal.id} className="flex flex-col rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {deal.type}
                            </div>
                            {deal.days.includes('Daily') && (
                                <span className="text-xs font-medium text-orange-600">Every Day</span>
                            )}
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">{deal.title}</h3>
                        <div className="mt-1 flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            <MapPin className="size-3.5" />
                            {deal.business}
                        </div>

                        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 flex-1">
                            {deal.description}
                        </p>

                        <div className="mt-6 flex items-center justify-between border-t pt-4 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <Clock className="size-3.5" />
                                {deal.time}
                            </div>
                            <button className="text-sm font-semibold text-orange-600 hover:text-orange-500">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
