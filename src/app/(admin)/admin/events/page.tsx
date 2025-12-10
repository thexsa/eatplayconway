import { Check, X, Edit, Eye } from 'lucide-react'

// Mock Pending Events
const pendingEvents = [
    {
        id: 1,
        title: 'Community Yoga in the Park',
        source: 'Facebook (Conway Parks)',
        date: 'Dec 15, 2025',
        confidence: 0.92,
        status: 'Pending Review'
    },
    {
        id: 2,
        title: 'UCA vs Hendrix Baseball',
        source: 'Website Scrape',
        date: 'Dec 16, 2025',
        confidence: 0.88,
        status: 'Pending Review'
    },
    {
        id: 3,
        title: 'Unknown Event Title',
        source: 'Instagram Post',
        date: 'Dec 16, 2025',
        confidence: 0.45,
        status: 'Low Confidence'
    },
]

export default function EventsQueuePage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Events Queue</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Review AI-enriched events before publishing.</p>
                </div>
                <div className="flex gap-2">
                    <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                        Bulk Approve High Confidence
                    </button>
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Event Title</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Source</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Date</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">AI Confidence</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-800">
                        {pendingEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">{event.title}</td>
                                <td className="px-6 py-4 text-zinc-500">{event.source}</td>
                                <td className="px-6 py-4 text-zinc-500">{event.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${event.confidence > 0.8
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {(event.confidence * 100).toFixed(0)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button className="p-1 text-zinc-400 hover:text-blue-500">
                                        <Eye className="size-4" />
                                    </button>
                                    <button className="p-1 text-zinc-400 hover:text-green-500">
                                        <Check className="size-4" />
                                    </button>
                                    <button className="p-1 text-zinc-400 hover:text-red-500">
                                        <X className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
