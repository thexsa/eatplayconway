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
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(limit)

    if (error) {
        console.error('Error fetching upcoming events:', error)
        return []
    }

    return events as EventWithVenue[]
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
                slug,
                geo_lat,
                geo_lng
            )
        `)
        .eq('slug', slug)
        .single()

    if (error) {
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
