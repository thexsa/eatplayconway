
import dotenv from 'dotenv';
const result = dotenv.config({ path: '.env.local' });
if (result.error) dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🔍 checking Event Statuses...');

    // 1. Count Events by Status
    const { data: stats, error } = await supabase
        .from('events')
        .select('status, count');

    // Group manually since we can't use .groupBy() easy with the JS client sometimes without rpc
    const { data: allEvents } = await supabase.from('events').select('status');
    const counts: Record<string, number> = {};
    allEvents?.forEach(e => {
        counts[e.status] = (counts[e.status] || 0) + 1;
    });

    console.log('📊 Event Counts by Status:');
    console.table(counts);

    // 2. Debug UCA Source
    console.log('\n🔍 Debugging UCA Scraper...');
    const { data: sources } = await supabase
        .from('scrape_sources')
        .select('*')
        .ilike('source_url', '%uca%');

    if (sources && sources.length > 0) {
        const source = sources[0];
        console.log(`FOUND UCA SOURCE: ${source.source_url} (${source.source_type})`);

        const { ScraperFactory } = await import('../src/lib/scraper/factory');
        const runner = ScraperFactory.getRunner(source.source_type);
        try {
            console.log('🚀 Attempting to scrape...');
            const events = await runner.run({
                sourceId: source.id,
                url: source.source_url,
                type: source.source_type as any,
                config: source.config_json as any
            });
            console.log(`✅ Scrape SUCCESS: Found ${events.length} events`);
        } catch (e: any) {
            console.log(`❌ Scrape FAILED: ${e.message}`);
        }
    } else {
        console.log('❌ No UCA source found in DB to test.');
    }
}

main();
