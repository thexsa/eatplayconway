
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkSources() {
    console.log('--- CHECKING SOURCES STATUS ---');
    const { data: sources, error } = await supabase
        .from('scrape_sources')
        .select('id, name, last_scraped_at, last_status, error_log, is_active');

    if (error) {
        console.error('Error fetching sources:', error);
        return;
    }

    if (!sources || sources.length === 0) {
        console.log('No sources found.');
        return;
    }

    sources.forEach(s => {
        console.log(`\nSource: ${s.name}`);
        console.log(`ID: ${s.id}`);
        console.log(`Active: ${s.is_active}`);
        console.log(`Last Scraped At: ${s.last_scraped_at}`);
        console.log(`Last Status: ${s.last_status}`);
        if (s.error_log) {
            console.log(`Error Log: ${s.error_log}`);
        }
    });

    // Check count of events and news
    const { count: eventCount } = await supabase.from('events').select('*', { count: 'exact', head: true });

    // News is categorized as 'News' in categories array
    const { count: newsCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).contains('categories', ['News']);

    console.log(`\nTotal Events: ${eventCount}`);
    console.log(`Total News Items: ${newsCount}`);
}

checkSources();
