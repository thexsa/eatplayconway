import { createClient } from '@/utils/supabase/server'
import { NormalizedEvent } from '@/lib/scraper/types'
import { slugify } from '@/utils/slugify'
import { enrichEvent } from '@/lib/ai/enrichment'
import { SupabaseClient } from '@supabase/supabase-js'

export async function ingestEvents(events: NormalizedEvent[], sourceId: string, client?: SupabaseClient) {
    const supabase = client || await createClient()

    // fetch business_id from source
    const { data: source } = await supabase.from('scrape_sources').select('business_id').eq('id', sourceId).single()
    const businessId = source?.business_id

    const eventsToInsert = await Promise.all(events.map(async event => {
        // AI Enrichment
        const enriched = await enrichEvent(event);

        return {
            source_id: sourceId,
            business_id: businessId,
            title: enriched.title,
            slug: slugify(enriched.title) + '-' + new Date().getTime().toString().slice(-6),
            start_time: event.start_time,
            end_time: event.end_time,
            description_raw: event.description,
            description_summary: enriched.description_summary,
            categories: enriched.categories,
            is_family_friendly: enriched.is_family_friendly,
            ai_confidence: enriched.confidence_score,
            price_min: enriched.price_min ?? event.price_min,
            price_max: enriched.price_max ?? event.price_max,
            image_url: event.image_url,
            // Status: If high confidence, publish (or Review per plan)
            status: enriched.confidence_score > 0.85 ? 'published' : 'draft',
            // Store raw data for debugging/AI
            // description_summary: JSON.stringify(event.raw_data) // Replaced by AI summary
        }
    }))

    // Upsert based on slug or title+date? 
    // For now, easy insert. Real world needs de-dupe logic.
    const { error } = await supabase.from('events').insert(eventsToInsert)

    if (error) {
        console.error('Ingest Error', error)
        throw new Error('Failed to insert events')
    }
}
