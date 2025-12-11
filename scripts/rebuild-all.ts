
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Dynamic import
const getOrchestrator = async () => import('../src/lib/scraper/orchestrator');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function rebuildAll() {
    if (!supabaseUrl || !supabaseKey) { return; }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { processSource } = await getOrchestrator();

    console.log('--- STEP 1: RESET DATABASE ---');
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Events cleared.');

    console.log('\n--- STEP 2: RUN SCRAPERS ---');
    const { data: sources } = await supabase.from('scrape_sources').select('*').eq('is_active', true);
    if (sources) {
        for (const source of sources) {
            try {
                console.log(`Scraping ${source.name}...`);
                await processSource(source.id, supabase as any);
                console.log('Done.');
                // Wait 15s to be safe on rate limits between sources (even though chunking inside also waits, sources create new chunks)
                console.log('Waiting 15s...');
                await new Promise(r => setTimeout(r, 15000));
            } catch (e: any) {
                console.error(`Failed ${source.name}:`, e.message);
                // Continue to next source
            }
        }
    }

    console.log('\n--- STEP 3: BUMP DATES ---');
    const { data: events } = await supabase.from('events').select('*');
    if (events) {
        console.log(`Bumping ${events.length} events +7 days...`);
        for (const event of events) {
            const newStart = new Date(new Date(event.start_time).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
            await supabase.from('events').update({ start_time: newStart, status: 'published' }).eq('id', event.id);
        }
    }

    console.log('\n--- COMPLETE ---');
}

rebuildAll();
