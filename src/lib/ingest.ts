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

    // Safety Filter for Non-Conway Locations (Hard block for obvious external cities)
    const LOCATION_BLOCKLIST_REGEX = /little rock|north little rock|maumelle|benton|bryant|sherwood|cabot|vilonia|mayflower|stone mountain|hot springs|saline|magnolia|seacoast|conway daily sun/i;

    // RETENTION POLICY
    const NEWS_CUTOFF_DATE = new Date();
    NEWS_CUTOFF_DATE.setDate(NEWS_CUTOFF_DATE.getDate() - 30); // Last 30 days for News

    const EVENT_CUTOFF_DATE = new Date();
    EVENT_CUTOFF_DATE.setMonth(EVENT_CUTOFF_DATE.getMonth() - 6); // Last 6 months for events

    let rejectedCount = 0;

    for (const event of events) {
        if (BLOCKLIST_REGEX.test(event.title) || BLOCKLIST_REGEX.test(event.description || '')) {
            console.warn(`[Ingest] Blocking blocked content: ${event.title}`);
            rejectedCount++;
            continue;
        }

        if (LOCATION_BLOCKLIST_REGEX.test(event.title) || LOCATION_BLOCKLIST_REGEX.test(event.description || '')) {
            console.warn(`[Ingest] Blocking Non-Conway Location: ${event.title}`);
            rejectedCount++;
            continue;
        }

        try {
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));

            // AI Enrichment
            let enriched: any;
            try {
                enriched = await enrichEvent(event);
            } catch (aiError) {
                console.warn(`[Ingest] AI Enrichment failed for ${event.title}, using raw data.`, aiError);
                enriched = {
                    title: event.title,
                    description_summary: event.description,
                    categories: ['Event'],
                    is_family_friendly: true,
                    confidence_score: 0.5,
                    price_min: null,
                    price_max: null,
                    image_url: null,
                    is_news: false,
                    is_conway: true // Assume true if unsure
                };
            }

            // --- CATEGORY & DATE FILTERING ---
            const eventDate = new Date(event.start_time);

            if (enriched.is_news) {
                if (!enriched.categories) enriched.categories = [];
                if (!enriched.categories.includes('News')) enriched.categories.push('News');

                // News Retention: 30 days
                if (eventDate < NEWS_CUTOFF_DATE) {
                    console.log(`[Ingest] Skipping Old News (${eventDate.toISOString()}): ${event.title}`);
                    continue;
                }
            } else {
                // Event Retention: 6 months
                // Keep future events + past 6 months
                if (eventDate < EVENT_CUTOFF_DATE) {
                    console.log(`[Ingest] Skipping Old Event (${eventDate.toISOString()}): ${event.title}`);
                    continue;
                }
            }

            if (enriched.is_conway === false) {
                console.log(`[Ingest] Skipping Non-Conway Event: ${event.title}`);
                continue;
            }

            // === VENUE LOGIC (No DB Creation - RLS Limitation) ===
            // We append Venue to description_raw so we can display it without a Business record
            let venueAppendix = '';
            if (event.location && event.location.length > 2 && event.location !== 'Conway, AR') {
                venueAppendix = `\n\nVenue: ${event.location}`;
            }

            // IMAGE BLOCKLIST (Second Layer)
            const BANNED_IMAGES = [
                'https://conwaychamber.org/wp-content/uploads/2023/11/DSCF5203-1024x683.jpg',
                'https://conwayarkansas.org/wp-content/uploads/2023/04/Conway-Community-July-Facebook-228-1024x762.jpeg'
            ];

            let currentImage = enriched.image_url || event.image_url;
            if (currentImage && BANNED_IMAGES.includes(currentImage)) {
                console.log(`[Ingest] Dropping banned image: ${currentImage}`);
                currentImage = null; // Will trigger defaults
            }



            // Smart Default Images based on context
            const DEFAULT_IMAGES = {
                music: [
                    'https://images.unsplash.com/photo-1470229722913-7ea051c24d80?auto=format&fit=crop&q=80', // Concert crowd
                    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80', // Live band
                    'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80', // Guitar close up
                ],
                food: [
                    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80', // Plated food
                    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80', // BBQ/Grill
                    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80', // Pizza
                ],
                art: [
                    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80', // Gallery
                    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80', // Paint
                ],
                family: [
                    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80', // Talking/Community
                    'https://images.unsplash.com/photo-1596464716127-f9a085960789?auto=format&fit=crop&q=80', // Park
                ],
                holiday: [
                    'https://images.unsplash.com/photo-1512389142860-9c449ded37aa?auto=format&fit=crop&q=80', // Lights
                    'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80', // Ornament
                ],
                generic: [
                    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80', // Crowd generic
                    'https://images.unsplash.com/photo-1561489413-985b06da5bee?auto=format&fit=crop&q=80', // Abstract
                    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80', // Party
                ]
            };

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
            let finalImage = currentImage; // Use the filtered image from above
            if (!finalImage) {
                const text = (event.title + ' ' + event.description).toLowerCase();
                let pool = DEFAULT_IMAGES.generic;

                if (text.includes('music') || text.includes('concert') || text.includes('band') || text.includes('live')) pool = DEFAULT_IMAGES.music;
                else if (text.includes('food') || text.includes('drink') || text.includes('truck') || text.includes('pizza') || text.includes('bbq')) pool = DEFAULT_IMAGES.food;
                else if (text.includes('art') || text.includes('gallery') || text.includes('paint') || text.includes('museum')) pool = DEFAULT_IMAGES.art;
                else if (text.includes('christmas') || text.includes('holiday') || text.includes('santa') || text.includes('lights')) pool = DEFAULT_IMAGES.holiday;
                else if (text.includes('family') || text.includes('kid') || text.includes('park')) pool = DEFAULT_IMAGES.family;

                // Deterministic selection from pool
                const index = (event.title?.length || 0) % pool.length;
                finalImage = pool[index];
            }

            eventsToInsert.push({
                source_id: sourceId,
                business_id: businessId, // Use Source Business ID since we can't create venues
                title: enriched.title || event.title,
                slug: slugify(enriched.title || event.title) + '-' + suffix,
                start_time: event.start_time,
                end_time: event.end_time,
                description_raw: event.description + (event.url ? `\n\nSource: ${event.url}` : '') + venueAppendix,
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
