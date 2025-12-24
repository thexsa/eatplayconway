
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function cleanup() {
    console.log('Removing duplicate venue: jacks-ultra-sports');
    const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('slug', 'jacks-ultra-sports');

    if (error) {
        console.error('Error deleting jacks-ultra-sports:', error);
    } else {
        console.log('Successfully removed jacks-ultra-sports');
    }
}

cleanup();
