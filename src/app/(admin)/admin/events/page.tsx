import { Check, X, Eye } from 'lucide-react'
import { getAdminEvents } from '@/lib/api/admin'
import { approveEvent, rejectEvent } from './actions'
import Link from 'next/link'
import { EventActionButtons } from '@/components/admin/EventActionButtons'
import { BulkApproveButton } from '@/components/admin/BulkApproveButton'
import { cn } from '@/utils/cn'

export default async function EventsQueuePage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const { tab: tabParam } = await searchParams
    const tab = (tabParam as 'pending' | 'active' | 'past') || 'pending'
    const events = await getAdminEvents(tab)

    const isPending = tab === 'pending'
    const isPublished = tab === 'active' || tab === 'past'

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-text-dark">Events Management</h1>
                    <p className="text-gray-500">Manage your events queue and lifecycle.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                        { name: 'Needs Approval', id: 'pending' },
                        { name: 'Active', id: 'active' },
                        { name: 'Past', id: 'past' },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={`/admin/events?tab=${item.id}`}
                            className={cn(
                                item.id === tab
                                    ? 'border-brand-orange text-brand-orange'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
                            )}
                            aria-current={item.id === tab ? 'page' : undefined}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Quick Actions (Bulk Approve) - Only for Pending */}
            {isPending && events && events.length > 0 && (
                <div className="flex justify-end">
                    <BulkApproveButton />
                </div>
            )}

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
                                        <a
                                            href={(event as any).scrape_sources?.source_url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline text-brand-orange font-semibold"
                                        >
                                            {event.title}
                                        </a>
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
                                    <Link href={`/events/${event.slug}`} target="_blank" className="p-1 text-gray-400 hover:text-brand-orange transition-colors" title="View Public Page">
                                        <Eye className="size-4" />
                                    </Link>
                                    <Link href={`/admin/events/${event.id}/edit`} className="p-1 text-gray-400 hover:text-text-dark transition-colors" title="Edit">
                                        <div className="sr-only">Edit</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil size-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </Link>
                                    <EventActionButtons
                                        eventId={event.id}
                                        isPublished={isPublished}
                                    />
                                </td>
                            </tr>
                        ))}
                        {(!events || events.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No events found in this tab.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    )
}
