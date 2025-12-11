
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkEventStatus() {
    if (!supabaseUrl || !supabaseKey) { return; }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const slug = 'weekend-entertainment-roundup-for-december-4-2025-little-rock-public-radio-224317';

    const { data: event } = await supabase
        .from('events')
        .select('id, title, status, start_time')
        .eq('slug', slug)
        .single();

    console.log('Event Details:', event);
}

checkEventStatus();
