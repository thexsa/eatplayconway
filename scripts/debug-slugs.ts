
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function debugSlugs() {
    console.log('--- DEBUGGING SLUGS ---');

    const { data, error } = await supabase
        .from('businesses')
        .select('name, slug');

    if (error) {
        console.error('Error selecting:', error);
    } else {
        console.log('Found businesses:', data);
    }
}

debugSlugs();
