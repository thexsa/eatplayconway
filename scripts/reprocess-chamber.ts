
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const SOURCE_ID = '2fb57999-8873-499a-99bf-bf1d496b9e86';
const SOURCE_URL = 'https://www.conwaychamber.org/events';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function reprocess() {
    console.log('--- REPROCESSING CHAMBER OF COMMERCE ---');
    const { HtmlScraper } = await import('@/lib/scraper/runners/html');
    const { ingestEvents } = await import('@/lib/ingest');


    // 1. Delete existing events for this source to allow clean re-ingest (fix images/venues)
    console.log('Deleting existing events...');
    const { error: delError } = await supabase
        .from('events')
        .delete()
        .eq('source_id', SOURCE_ID);

    if (delError) {
        console.error('Delete failed:', delError);
        return;
    }
    console.log('Events cleared.');

    // 2. Scrape
    console.log('Starting Scraper...');
    const scraper = new HtmlScraper();
    const job = {
        id: 'manual-reprocess',
        source_id: SOURCE_ID,
        url: SOURCE_URL,
        business_id: null,
        prompt: undefined
    };

    const events = await scraper.run(job as any);
    console.log(`Scraped ${events.length} events.`);

    // 3. Ingest
    console.log('Ingesting with new logic (Blocklist + Venue Creation)...');
    await ingestEvents(events, SOURCE_ID, supabase);
    console.log('Done.');
}

reprocess();
