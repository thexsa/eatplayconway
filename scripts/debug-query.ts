
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugQuery() {
    // Test OR logic for Restaurants (restaurant OR null)
    console.log('\n--- Testing Filter: category eq restaurant OR null ---');
    const { data: filtered } = await supabase
        .from('businesses')
        .select('name, category')
        .or('category.eq.restaurant,category.is.null')
        .order('name');

    console.log(`Found ${filtered?.length} records.`);
    filtered?.forEach(b => console.log(`${b.name} (${b.category})`));
}


debugQuery();
