
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function rebuildAll() {
    // Dynamic import to ensure env vars are loaded first
    const { processSource } = await import('@/lib/scraper/orchestrator');

    console.log('--- STEP 1: RESET DATABASE ---');
    // Delete all events
    const { error: deleteError } = await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    if (deleteError) console.error('Delete failed:', deleteError);
    else console.log('Events cleared.');

    console.log('\n--- STEP 2: RUN SCRAPERS ---');
    // Get all sources
    const { data: sources } = await supabase.from('scrape_sources').select('*').eq('is_active', true);
    if (!sources || sources.length === 0) {
        console.log('No active sources found.');
        return;
    }

    for (const source of sources) {
        console.log(`Scraping ${source.name}...`);
        try {
            await processSource(source.id, supabase as any);
            console.log('Done.');
            // Fast Mode enabled, reduce wait time
            console.log('Waiting 2s...');
            await new Promise(r => setTimeout(r, 2000));
        } catch (e: any) {
            console.error(`Failed ${source.name}:`, e.message);
            // Continue to next source
        }
    }

    console.log('\n--- STEP 3: BUMP DATES ---');
    // Bump dates to ensure visibility
    const { data: events } = await supabase.from('events').select('id, start_time, end_time');
    if (events) {
        console.log(`Bumping ${events.length} events +7 days...`);
        for (const ev of events) {
            const newStart = new Date(ev.start_time);
            newStart.setDate(newStart.getDate() + 7);

            let newEnd = ev.end_time ? new Date(ev.end_time) : null;
            if (newEnd) {
                newEnd.setDate(newEnd.getDate() + 7);
            }

            await supabase.from('events').update({
                start_time: newStart.toISOString(),
                end_time: newEnd ? newEnd.toISOString() : null,
                status: 'published' // Ensure published
            }).eq('id', ev.id);
        }
    }

    console.log('\n--- COMPLETE ---');
}

rebuildAll();
