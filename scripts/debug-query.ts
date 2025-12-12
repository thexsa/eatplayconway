
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugQuery() {
    console.log('Testing getUpcomingEvents query logic...');

    // Simulate fix: Use 'is' null OR not contains (Logic is tricky in one builder chain)
    // Or just filter client side? No, pagination.
    // Try raw SQL filter or builder structure.
    // The filter 'not.cs' might indeed drop nulls. 

    // Testing logic: exclude events that have News, but keep nulls.

    // Option A: Raw filter string
    // Option B: .not('categories', 'cs', '{"News"}') -- DOES IT DROP NULLS? Yes usually.

    console.log('\n--- Test Fix (Limit 100) ---');
    const { data: fix, error: fixError } = await supabase
        .from('events')
        .select('title, start_time, categories, business_id')
        .eq('status', 'published')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        // If we remove the 'not' filter, we should see them (as control showed)
        // Wait, CONTROL showed them?
        // Let's look at CONTROL output again in previous step.
        // Control output showed: "School Holiday Break..." etc. 
        // Did Control show Chamber events? 
        // NO! Control had 18 events too. All School.

        // This implies they are not even in the 'published' list sorted by time?
        // Ah, Chamber events start March 20, 2025.
        // School events are sooner (Dec 2025, Jan 2026? Wait. School events were listed as Dec, Jan, Feb etc.)
        // Chamber start March 2025.
        // If query limit is 20, and there are 20+ School events before March, Chamber events are just pushed off the list.

        // Let's increase limit to 50 to see if they appear.
        .limit(100);

    if (fixError) console.error(fixError);
    else {
        console.log(`Found ${fix.length} events.`);
        fix.forEach(e => console.log(`- ${e.start_time}: ${e.title} [${e.categories}] (Biz: ${e.business_id})`));
    }

    // Test Control: Without the NOT filter
    console.log('\n--- Control (No Filter) ---');
    const { data: control } = await supabase
        .from('events')
        .select('title, categories')
        .eq('status', 'published')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(20);

    control?.forEach(e => console.log(`- ${e.title} [${e.categories}]`));
}

debugQuery();
