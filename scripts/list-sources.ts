
import dotenv from 'dotenv';
const result = dotenv.config({ path: '.env.local' });
if (result.error) dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🔍 Listing Scrape Sources...');

    // 1. List All Sources
    const { data, error } = await supabase
        .from('scrape_sources')
        .select('*');

    if (error) {
        console.error("Error:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No sources found.");
        return;
    }

    console.table(data.map(s => ({
        id: s.id.slice(0, 8) + '...',
        type: s.source_type,
        url: s.source_url.slice(0, 50),
        status: s.last_status,
        active: s.is_active
    })));
}

main();
