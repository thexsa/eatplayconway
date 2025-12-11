import { Check, X, Eye } from 'lucide-react'
import { getPendingEvents } from '@/lib/api/admin'
import { approveEvent, rejectEvent } from './actions'
import Link from 'next/link'
import { EventActionButtons } from '@/components/admin/EventActionButtons'

export default async function EventsQueuePage() {
    const events = await getPendingEvents()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-text-dark">Events Queue</h1>
                    <p className="text-gray-500">Review {events?.length || 0} pending events.</p>
                </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-brand-cream border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Event Title</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Venue</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Date</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Confidence</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events?.map((event) => (
                            <tr key={event.id} className="hover:bg-brand-cream/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-text-dark">
                                    <div className="flex flex-col">
                                        <span>{event.title}</span>
                                        <span className="text-xs text-gray-400">{event.id.slice(0, 8)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {event.businesses?.name || 'Unknown Venue'}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(event.start_time).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${(event.ai_confidence || 0) > 0.8
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {((event.ai_confidence || 0) * 100).toFixed(0)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <Link href={`/events/${event.slug}`} target="_blank" className="p-1 text-gray-400 hover:text-brand-orange transition-colors">
                                        <Eye className="size-4" />
                                    </Link>
                                    <Link href={`/admin/events/${event.id}/edit`} className="p-1 text-gray-400 hover:text-text-dark transition-colors">
                                        <div className="sr-only">Edit</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil size-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </Link>
                                    <EventActionButtons eventId={event.id} />
                                </td>
                            </tr>
                        ))}
                        {(!events || events.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
