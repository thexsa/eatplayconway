
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugQuery() {
    console.log('\n--- Inspecting Play Slugs ---');
    const { data: venues } = await supabase
        .from('businesses')
        .select('name, slug, category')
        .in('category', ['arts_entertainment', 'retail', 'park'])
        .order('name');

    venues?.forEach(v => console.log(`'${v.slug}': '${v.name}' (${v.category})`));
}


debugQuery();
