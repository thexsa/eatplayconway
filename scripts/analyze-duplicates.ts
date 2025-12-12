
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use anon key if service role missing
)

async function analyze() {
    console.log('Fetching all events...');
    const { data: events, error } = await supabase
        .from('events')
        .select('id, title, start_time, slug, created_at, source_id, categories');

    if (error) {
        console.error(error);
        return;
    }

    console.log(`Total events: ${events.length}`);

    const map = new Map<string, any[]>();

    events.forEach(e => {
        // Create a key based on Title and Time
        // Normalize time to ignore milliseconds differences if strictly parsing strings
        const timeKey = new Date(e.start_time).toISOString();
        const key = `${e.title.trim()}|${timeKey}`;

        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(e);
    });

    events.sort((a, b) => a.title.localeCompare(b.title));
    console.log('--- Dumping all sorted events ---');
    events.forEach(e => {
        console.log(`"${e.title}" | ${e.start_time}`);
    });
}

analyze();
