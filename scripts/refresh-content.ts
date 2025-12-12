
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function refreshContent() {
    console.log('--- REFRESHING ALL CONTENT ---');
    const { processSource } = await import('@/lib/scraper/orchestrator');

    // Get all active sources
    const { data: sources } = await supabase
        .from('scrape_sources')
        .select('*')
        .eq('is_active', true);

    if (!sources || sources.length === 0) {
        console.log('No active sources found.');
        return;
    }

    console.log(`Found ${sources.length} active sources.`);

    for (const source of sources) {
        console.log(`\nProcessing: ${source.name} (${source.source_type})...`);
        try {
            await processSource(source.id, supabase as any);
            console.log('Success.');
        } catch (e: any) {
            console.error(`Failed ${source.name}:`, e.message);
        }
    }
    console.log('\nDone.');
}

refreshContent();
