
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function refreshNews() {
    console.log('--- REFRESHING NEWS SOURCS ---');
    const { processSource } = await import('@/lib/scraper/orchestrator');

    // Get RSS + News HTML sources
    const { data: sources } = await supabase
        .from('scrape_sources')
        .select('*')
        .eq('is_active', true)
        .in('source_type', ['website_rss', 'website_html']);

    if (!sources || sources.length === 0) {
        console.log('No news sources found.');
        return;
    }

    // Filter out Chamber events (not news)
    const newsSources = sources.filter(s => s.name !== 'Conway Area Chamber of Commerce' && s.name !== 'Conway Downtown Partnership');

    // Add back Conwya Downtown Partnership if it has news? Usually events.
    // Keep it simple: Just RSS for now.
    // And 'Conway Arkansas News' (html)

    // Actually, filter logic:
    // If URL contains 'news' or type is rss.

    const targetSources = sources.filter(s => s.source_type === 'website_rss' || (s.url && s.url.includes('news')));

    console.log(`Found ${targetSources.length} News Sources.`);

    for (const source of targetSources) {
        console.log(`\nProcessing: ${source.name}...`);
        try {
            await processSource(source.id, supabase as any);
            console.log('Success.');
        } catch (e: any) {
            console.error(`Failed ${source.name}:`, e.message);
        }
    }
    console.log('\nDone.');
}

refreshNews();
