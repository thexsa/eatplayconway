
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkColumns() {
    console.log('--- CHECKING BUSINESSES COLUMNS ---');
    // We can't query information_schema easily via supabase-js client unless we use rpc or just try to select * limit 1 and see keys.

    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting:', error);
    } else if (data && data.length > 0) {
        console.log('Found columns:', Object.keys(data[0]));
    } else {
        console.log('No data found, cannot infer columns from result.');
        // Try inserting dummy to check error? No.
    }
}

checkColumns();
