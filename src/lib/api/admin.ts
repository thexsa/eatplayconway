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

export async function getPendingEvents() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('events')
        .select(`
            *,
             businesses (
                name
            )
        `)
        .in('status', ['enriched', 'raw', 'draft']) // Ready for review
        .order('ai_confidence', { ascending: false })

    if (error) {
        console.error('Error fetching pending events:', error)
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
