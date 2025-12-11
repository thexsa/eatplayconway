import { EditEventForm } from '@/components/admin/EditEventForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: event } = await supabase
        .from('events')
        .select(`
            id,
            title,
            description_raw,
            start_time,
            end_time,
            image_url,
            ticket_url,
            businesses (
                id,
                name
            )
        `)
        .eq('id', id)
        .single()

    if (!event) {
        notFound()
    }

    // Transform arrays to single objects if needed
    const transformedEvent = {
        ...event,
        businesses: Array.isArray(event.businesses) ? event.businesses[0] : event.businesses
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/events" className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <ArrowLeft className="size-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Update event details before publishing.</p>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                {/* @ts-ignore - Supabase types are tricky with arrays/singles */}
                <EditEventForm event={transformedEvent} />
            </div>
        </div>
    )
}
