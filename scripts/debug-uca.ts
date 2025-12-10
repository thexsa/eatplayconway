
import dotenv from 'dotenv';
const result = dotenv.config({ path: '.env.local' });
if (result.error) dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🔍 Debugging UCA Scraper...');

    // 1. Find the UCA source
    const { data: sources, error } = await supabase
        .from('scrape_sources')
        .select('*')
        .ilike('source_url', '%uca%');

    if (error || !sources || sources.length === 0) {
        console.error('❌ Could not find any UCA source in DB.', error);
        return;
    }

    const source = sources[0];
    console.log(`FOUND SOURCE: ${source.id}`);
    console.log(`URL: ${source.source_url}`);
    console.log(`TYPE: ${source.source_type}`);

    // 2. Run Scraper
    const { ScraperFactory } = await import('../src/lib/scraper/factory');
    const runner = ScraperFactory.getRunner(source.source_type);

    try {
        console.log('🚀 Launching Runner...');
        const events = await runner.run({
            sourceId: source.id,
            url: source.source_url,
            type: source.source_type as any,
            config: source.config_json as any
        });
        console.log(`✅ SUCCESS! Scraped ${events.length} events.`);
        if (events.length > 0) console.log(events[0]);
    } catch (e) {
        console.error('❌ SCRAPER ERROR:', e);
    }
}

main();
