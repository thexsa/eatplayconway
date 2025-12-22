
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugQuery() {
    // Inspect Events
    console.log('\n--- Inspecting Events Table ---');
    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .limit(1);

    if (error) console.error(error);
    else if (events && events.length > 0) {
        console.log('Available columns:', Object.keys(events[0]));
        console.log('Sample event:', events[0]);
    }
}


debugQuery();
