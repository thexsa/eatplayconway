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
                        </div >

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
                    </div >
                ))
}
            </div >
        </div >
    )
}
