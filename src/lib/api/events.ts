import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

export type EventRow = Database['public']['Tables']['events']['Row']
export type EventWithVenue = EventRow & {
    businesses: Database['public']['Tables']['businesses']['Row'] | null
}

export async function getUpcomingEvents(limit: number = 20) {
    const supabase = await createClient()

    // Fetch upcoming events, sorted by date
    // We also join with 'businesses' to get venue name
    const { data: events, error } = await supabase
        .from('events')
        .select(`
            *,
            businesses (
                name,
                slug
            )
        `)
        .eq('status', 'published')
        .not('categories', 'cs', '{"News"}') // Exclude News from main event feed
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(limit)

    if (error) {
        console.error('Error fetching upcoming events:', error)
        return []
    }

    return events as EventWithVenue[]
}

export async function getLatestNews(limit: number = 20) {
    const supabase = await createClient()

    const { data: news, error } = await supabase
        .from('events')
        .select(`
            *,
            businesses (
                name,
                slug
            )
        `)
        .eq('status', 'published')
        .contains('categories', ['News']) // Only News
        .order('created_at', { ascending: false }) // News by ingestion time (freshness) or start_time? usually start_time for events, but news is " recent". Let's stick to start_time as "published date" proxy for now, or created_at. Let's use start_time as it maps to "article date" often.
        .limit(limit)

    if (error) {
        console.error('Error fetching news:', error)
        return []
    }

    return news as EventWithVenue[]
}

export async function getEventBySlug(slug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select(`
            *,
            businesses (
                name,
                address,
                slug
            )
        `)
        .eq('slug', slug)
        .single()

    if (error) {
        console.error(`[getEventBySlug] Error fetching slug '${slug}':`, error)
        // Also log if data was null despite no error (shouldn't happen with .single())
        return null
    }

    return data as EventWithVenue
}

export async function getEventsByDateRange(start: Date, end: Date) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select(`
             *,
            businesses (
                name,
                address
            )
        `)
        .eq('status', 'published')
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString())
        .order('start_time', { ascending: true })

    if (error) {
        console.error('Error fetching range:', error)
        return []
    }

    return data as EventWithVenue[]
}
