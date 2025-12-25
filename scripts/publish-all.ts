
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function publishAll() {
    console.log('--- Publishing All Content ---');

    // 1. Publish all Events
    const { data: eventResult, error: eventError } = await supabase
        .from('events')
        .update({ status: 'published' })
        .neq('status', 'rejected');

    if (eventError) console.error('Error publishing events:', eventError);
    else console.log('Successfully published all non-rejected events.');

    // 2. Publish all News (also in events table)
    // (Already handled by above update since both are in 'events')

    // 3. Ensure all businesses are public (if we added a status field later)
    // In current schema they don't have a status, but let's check counts.
    const { count: bCount } = await supabase.from('businesses').select('*', { count: 'exact', head: true });
    console.log(`Total businesses in DB: ${bCount}`);

    const { count: eCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
    console.log(`Total events in DB: ${eCount}`);

    const { count: pCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published');
    console.log(`Published events in DB: ${pCount}`);

    // Let's also verify attractions categories for the play page
    const { data: playVenues } = await supabase
        .from('businesses')
        .select('name, category')
        .in('category', ['arts_entertainment', 'retail', 'park']);

    console.log(`Venues matching Play categories: ${playVenues?.length || 0}`);
    playVenues?.forEach(v => console.log(` - ${v.name} (${v.category})`));
}

publishAll();
