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

    const eventsToInsert = [];
    for (const event of events) {
        try {
            // AI Enrichment (Sequential to avoid Rate Limits)
            // Add a small delay if needed, or just sequential is enough for < 15 RPM usually, 
            // but 5 RPM requires 12 seconds delay! 
            // Gemini Flash usually allows more, but the error said "limit: 5, model: gemini-2.5-flash".
            // That is severe. We must wait ~12s between chunks? Or maybe just try/catch and fallback to raw data.

            // Let's try to enrich, if fail, fallback to raw.
            let enriched: any;
            try {
                enriched = await enrichEvent(event);
                // Simple delay to be nice to the API
                // 10 seconds delay to stay under 5 RPM (60/5 = 12s ideally, but let's try 10s as bursts might be allowed)
                console.log(`Enriched ${event.title}. Sleeping 10s...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            } catch (e) {
                console.warn(`Enrichment failed for ${event.title}, using raw data.`);
                enriched = {
                    title: event.title, // Fallback
                    description_summary: event.description,
                    categories: ['Event'], // Default
                    is_family_friendly: true,
                    confidence_score: 0.5, // Low confidence -> Draft
                    price_min: null,
                    price_max: null
                };
            }

            eventsToInsert.push({
                source_id: sourceId,
                business_id: businessId,
                title: enriched.title || event.title,
                slug: slugify(enriched.title || event.title) + '-' + new Date().getTime().toString().slice(-6),
                start_time: event.start_time,
                end_time: event.end_time,
                description_raw: event.description,
                description_summary: enriched.description_summary || event.description,
                categories: enriched.categories,
                is_family_friendly: enriched.is_family_friendly,
                ai_confidence: enriched.confidence_score,
                price_min: enriched.price_min ?? event.price_min,
                price_max: enriched.price_max ?? event.price_max,
                image_url: event.image_url,
                status: enriched.confidence_score > 0.85 ? 'published' : 'draft',
            });
        } catch (err) {
            console.error(`Skipping event ${event.title} due to error:`, err);
        }
    }

    // Deduplication Logic
    const finalEventsToInsert: any[] = []

    for (const event of eventsToInsert) {
        // Check for existing event with same title and start time (fuzzy match logic could vary)
        const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('title', event.title)
            .eq('start_time', event.start_time)
            .single()

        if (!existing) {
            finalEventsToInsert.push(event)
        } else {
            console.log(`Skipping duplicate: ${event.title}`)
        }
    }

    if (finalEventsToInsert.length === 0) {
        console.log('No new events to ingest.')
        return
    }

    const { error } = await supabase.from('events').insert(finalEventsToInsert)

    if (error) {
        console.error('Ingest Error', error)
        throw new Error('Failed to insert events')
    }
}
