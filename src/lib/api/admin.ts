import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/database.types'

export type ScrapeSourceRow = Database['public']['Tables']['scrape_sources']['Row']

export async function getAllSources() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('scrape_sources')
        .select(`
            *,
            businesses (
                name
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching sources:', error)
        return []
    }

    return data
}

export async function getAdminEvents(filter: 'pending' | 'active' | 'past' = 'pending') {
    const supabase = await createClient()

    let query = supabase
        .from('events')
        .select(`
            *,
            businesses (
                name
            ),
            scrape_sources (
                source_url
            )
        `)

    if (filter === 'pending') {
        query = query.in('status', ['enriched', 'raw', 'draft'])
        query = query.order('ai_confidence', { ascending: false })
    } else if (filter === 'active') {
        query = query.eq('status', 'published')
        query = query.gte('start_time', new Date().toISOString())
        query = query.order('start_time', { ascending: true })
    } else if (filter === 'past') {
        query = query.eq('status', 'published')
        query = query.lt('start_time', new Date().toISOString())
        query = query.order('start_time', { ascending: false }) // Most recent past first
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching admin events:', error)
        return []
    }

    return data
}

export async function getDashboardStats() {
    const supabase = await createClient()

    const [eventsCount, dealsCount, sourcesCount] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('deals').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('scrape_sources').select('*', { count: 'exact', head: true }).eq('is_active', true)
    ])

    return {
        totalEvents: eventsCount.count || 0,
        activeDeals: dealsCount.count || 0,
        activeSources: sourcesCount.count || 0,
    }
}
