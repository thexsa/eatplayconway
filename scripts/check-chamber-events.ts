
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkChamber() {
    // 1. Get Source ID
    const { data: source } = await supabase
        .from('scrape_sources')
        .select('id, name, source_url')
        .ilike('name', '%Chamber of Commerce%')
        .single();

    if (!source) {
        console.log('Source not found in DB');
        return;
    }

    console.log(`Source: ${source.name} (${source.id})`);

    // 2. Get Events
    const { data: events } = await supabase
        .from('events')
        .select('title, start_time, status, created_at, categories')
        .eq('source_id', source.id)
        .order('start_time', { ascending: false });

    console.log(`\nFound ${events?.length || 0} events in DB:`);
    events?.forEach(e => {
        console.log(`[${e.status}] ${e.start_time}: ${e.title} | Cats: ${e.categories}`);
    });
}

checkChamber();
