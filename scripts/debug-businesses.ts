
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function debugBusinesses() {
    console.log('Inspecting businesses table...');
    const { data, error } = await supabase.from('businesses').select('*').limit(1);
    if (error) console.error(error);
    else if (data && data.length > 0) {
        console.log('Keys found:', Object.keys(data[0]));
        console.log('Sample:', data[0]);
    } else {
        console.log('No businesses found to inspect.');
    }

    console.log('Inspecting deals table...');
    // Minimal Insert to discover DEALS schema
    const { data: newDeal, error: insertError } = await supabase.from('deals').insert({
        title: 'Debug Deal',
        // business_id?
        description: 'Debug Description',
    }).select().single();

    if (insertError) console.error('Insert Error:', insertError);
    else console.log('Inserted debug deal:', newDeal);
}
debugBusinesses();
