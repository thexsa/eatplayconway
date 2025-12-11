
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

// Dynamic import
const getEnrichment = async () => import('../src/lib/ai/enrichment');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function backfillImages() {
    const { enrichEvent } = await getEnrichment();
    if (!supabaseUrl || !supabaseKey) { return; }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch events without images or with low confidence (drafts that we forced published)
    // Actually, force-published drafts have missing images.
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .is('image_url', null)
        .order('created_at', { ascending: false })
        .limit(20); // Do 20 for now

    if (!events || events.length === 0) {
        console.log('No events found needing backfill.');
        return;
    }

    console.log(`Found ${events.length} events to backfill images...`);

    for (const event of events) {
        console.log(`Processing: ${event.title}`);
        try {
            // Re-enrich
            const enriched = await enrichEvent({
                title: event.title,
                start_time: event.start_time,
                description: event.description_raw,
                url: event.url, // Need to make sure this column exists in DB or is inferred
                source_id: event.source_id,
                // NormalizedEvent structure requires these:
                end_time: event.end_time,
                price_min: event.price_min,
                price_max: event.price_max,
                image_url: null, // We are trying to find it
                raw_data: {}
            });

            if (enriched.image_url) {
                console.log(`  -> Found Image: ${enriched.image_url}`);
                await supabase
                    .from('events')
                    .update({
                        image_url: enriched.image_url,
                        description_summary: enriched.description_summary,
                        categories: enriched.categories,
                        price_min: enriched.price_min,
                        price_max: enriched.price_max,
                        ai_confidence: enriched.confidence_score
                    })
                    .eq('id', event.id);
            } else {
                console.log('  -> No image found by AI.');
            }

            // Wait 15s
            console.log('  Sleeping 15s to respect quota...');
            await new Promise(resolve => setTimeout(resolve, 15000));

        } catch (e: any) {
            console.error(`  Error backfilling ${event.title}:`, e.message);
            // Wait 15s anyway if it was a rate limit
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }
}

backfillImages();
