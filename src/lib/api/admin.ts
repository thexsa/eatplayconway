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
        .eq('status', 'enriched') // Ready for review
        .order('ai_confidence', { ascending: false })

    if (error) {
        console.error('Error fetching pending events:', error)
        return []
    }

    return data
}
