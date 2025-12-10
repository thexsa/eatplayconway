import { Check, X, Eye } from 'lucide-react'
import { getPendingEvents } from '@/lib/api/admin'
import { approveEvent, rejectEvent } from './actions'
import Link from 'next/link'

export default async function EventsQueuePage() {
    const events = await getPendingEvents()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Events Queue</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Review {events?.length || 0} pending events.</p>
                </div>
            </div>

            <div className="rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Event Title</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Venue</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Date</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Confidence</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-800">
                        {events?.map((event) => (
                            <tr key={event.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                                    <div className="flex flex-col">
                                        <span>{event.title}</span>
                                        <span className="text-xs text-zinc-400">{event.id.slice(0, 8)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {event.businesses?.name || 'Unknown Venue'}
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {new Date(event.start_time).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(event.ai_confidence || 0) > 0.8
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {((event.ai_confidence || 0) * 100).toFixed(0)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10 dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/20">
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Link href={`/events/${event.slug}`} target="_blank" className="p-1 text-zinc-400 hover:text-blue-500">
                                        <Eye className="size-4" />
                                    </Link>

                                    <form action={approveEvent.bind(null, event.id)}>
                                        <button type="submit" className="p-1 text-zinc-400 hover:text-green-500" title="Approve & Publish">
                                            <Check className="size-4" />
                                        </button>
                                    </form>

                                    <form action={rejectEvent.bind(null, event.id)}>
                                        <button type="submit" className="p-1 text-zinc-400 hover:text-red-500" title="Reject">
                                            <X className="size-4" />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {(!events || events.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                    No pending events found. Good job!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
