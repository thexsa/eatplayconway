
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkEvent() {
    if (!supabaseUrl || !supabaseKey) { return; }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check specific slug from user screenshot
    const oldSlug = 'weekend-entertainment-roundup-for-december-4-2025-little-rock-public-radio-224317';
    const { data: bySlug } = await supabase.from('events').select('id, slug').eq('slug', oldSlug).single();
    console.log(`Lookup '${oldSlug}':`, bySlug ? 'FOUND' : 'NOT FOUND');

    // 2. Search by title to find the NEW slug
    const { data: byTitle } = await supabase
        .from('events')
        .select('id, title, slug')
        .ilike('title', '%Weekend Entertainment Roundup%')
        .limit(5);

    console.log('Events searching by title:', byTitle);
}

checkEvent();
