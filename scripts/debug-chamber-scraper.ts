// Load env for AI keys FIRST
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { createClient as createJsClient } from '@supabase/supabase-js'

const supabase = createJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugChamber() {
    // Dynamic imports to prevent hoisting before dotenv
    const { HtmlScraper } = await import('@/lib/scraper/runners/html');
    const { ingestEvents } = await import('@/lib/ingest');

    const scraper = new HtmlScraper();

    // Config for Chamber
    const job = {
        id: 'debug-job-1', // Mock ID
        source_id: '2fb57999-8873-499a-99bf-bf1d496b9e86', // Chamber ID
        url: 'https://www.conwaychamber.org/events',
        business_id: null,
        prompt: undefined
    };

    console.log('Starting Scrape...');
    const events = await scraper.run(job as any);
    console.log(`Scraped ${events.length} events. Attempting Ingest...`);

    try {
        await ingestEvents(events, job.source_id, supabase);
        console.log('Ingest Complete.');
    } catch (e) {
        console.error('Ingest Failed:', e);
    }
}

debugChamber();
