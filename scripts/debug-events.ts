
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugEvents() {
    console.log('\n--- Inspecting Events ---');
    const now = new Date().toISOString();
    console.log(`Current Time (ISO): ${now}`);

    const { data: events, error } = await supabase
        .from('events')
        .select('title, start_time, status, categories')
        .limit(10);

    if (error) {
        console.error('Error fetching events:', error);
        return;
    }

    console.log(`Total events inspected: ${events.length}`);
    events.forEach(e => {
        const isFuture = e.start_time >= now;
        console.log(`[${e.status}] ${e.title} | Start: ${e.start_time} | Future: ${isFuture} | Categories: ${e.categories}`);
    });

    // Check how many future published events exist
    const { count } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .gte('start_time', now);

    console.log(`\nTotal Future Published Events: ${count}`);
}

debugEvents();
