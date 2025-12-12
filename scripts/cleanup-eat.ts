
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function cleanupEat() {
    console.log('--- CLEANING UP EAT SECTION ---');

    // Delete 'Debug Biz'
    const { count, error } = await supabase
        .from('businesses')
        .delete({ count: 'exact' })
        .ilike('slug', 'debug-biz%');

    if (error) console.error('Error deleting debug biz:', error);
    else console.log(`Deleted ${count} debug entries.`);
}

cleanupEat();
