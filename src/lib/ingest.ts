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

    // Safety Filter for unwanted content (Obituaries, arrests, etc)
    const BLOCKLIST_REGEX = /obituary|death notice|funeral|memorial service|arrest|police log|jail/i;

    for (const event of events) {
        if (BLOCKLIST_REGEX.test(event.title) || BLOCKLIST_REGEX.test(event.description || '')) {
            console.warn(`[Ingest] Blocking blocked content: ${event.title}`);
            continue;
        }

        try {
            // Let's try to enrich, if fail, fallback to raw.
            let enriched: any;

            try {
                // Rate Limiting: Sleep 2s to be nice to Gemini Free Tier (approx 15-30 RPM)
                await new Promise(resolve => setTimeout(resolve, 2000));

                enriched = await enrichEvent(event);
            } catch (aiError) {
                console.warn(`[Ingest] AI Enrichment failed for ${event.title}, using raw data.`, aiError);
                // Fallback to raw data with minimal defaults
                enriched = {
                    title: event.title,
                    description_summary: event.description,
                    categories: ['Event'], // AI would have given better categories
                    is_family_friendly: true,
                    confidence_score: 0.5, // Lower confidence
                    price_min: null,
                    price_max: null,
                    image_url: null
                };
            }


            // Default Images (Conway/Arkansas aesthetic)
            const DEFAULT_IMAGES = [
                'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80', // Party/people
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80', // Crowd
                'https://images.unsplash.com/photo-1470229722913-7ea051c24d80?auto=format&fit=crop&q=80', // Concert
                'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80', // Conversation
                'https://images.unsplash.com/photo-1561489413-985b06da5bee?auto=format&fit=crop&q=80'  // Abstract lights
            ];

            // Deterministic Slug Suffix (Hash of start_time) to survive rebuilds
            // Simple string hash function
            const dateStr = event.start_time || '';
            let hash = 0;
            for (let i = 0; i < dateStr.length; i++) {
                hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
                hash |= 0;
            }
            const suffix = Math.abs(hash).toString(36).slice(-6);

            // final fallback logic
            let finalImage = enriched.image_url || event.image_url;
            if (!finalImage) {
                // Deterministic random image based on title length
                const index = (event.title?.length || 0) % DEFAULT_IMAGES.length;
                finalImage = DEFAULT_IMAGES[index];
            }

            eventsToInsert.push({
                source_id: sourceId,
                business_id: businessId,
                title: enriched.title || event.title,
                slug: slugify(enriched.title || event.title) + '-' + suffix,
                start_time: event.start_time,
                end_time: event.end_time,
                description_raw: event.description,
                description_summary: enriched.description_summary || event.description,
                categories: enriched.categories,
                is_family_friendly: enriched.is_family_friendly,
                ai_confidence: enriched.confidence_score,
                price_min: enriched.price_min ?? event.price_min,
                price_max: enriched.price_max ?? event.price_max,
                // Prioritize AI image, fallback to scraper image, fallback to default
                image_url: finalImage,
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
