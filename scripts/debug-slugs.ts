
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function dumpSlugs() {
    if (!supabaseUrl || !supabaseKey) { return; }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: events } = await supabase
        .from('events')
        .select('title, slug')
        .order('created_at', { ascending: false })
        .limit(10);

    console.log('Latest 10 Events Slugs:');
    events?.forEach(e => {
        console.log(`Title: "${e.title}"`);
        console.log(`Slug:  "${e.slug}"`);
        console.log(`Link:  /events/${e.slug}`);
        console.log('---');
    });
}

dumpSlugs();
