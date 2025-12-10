import dotenv from 'dotenv';
// Load environment variables BEFORE importing other modules
const result = dotenv.config({ path: '.env.local' });
if (result.error) {
    dotenv.config({ path: '.env' });
}

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Environment Variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // Dynamic imports to ensure process.env is populated before these modules init
    const { ScraperFactory } = await import('../src/lib/scraper/factory');
    const { ingestEvents } = await import('../src/lib/ingest');

    console.log('🧪 Starting Scraper Verification...');

    // 1. Create a Test Source
    const testSource = {
        name: 'Test - Google News Conway',
        source_url: 'https://news.google.com/rss/search?q=Conway+AR+events+when:7d&hl=en-US&gl=US&ceid=US:en',
        source_type: 'website_rss', // Matches DB column
        is_active: true,
        business_id: null // System source
    };

    console.log(`1. Seeding Test Source: ${testSource.name}`);

    // Check if exists
    let { data: existing } = await supabase
        .from('scrape_sources')
        .select('*')
        .eq('source_url', testSource.source_url)
        .single();

    let sourceId = existing?.id;

    if (!existing) {
        const { data, error } = await supabase
            .from('scrape_sources')
            .insert(testSource)
            .select()
            .single();

        if (error) {
            console.error('Failed to insert source:', error);
            return;
        }
        sourceId = data.id;
        console.log('   ✅ Created Source ID:', sourceId);
    } else {
        console.log('   ℹ️ Source already exists:', sourceId);
    }

    // 2. Run Scraper
    console.log('2. Running RSS Scraper...');
    const runner = ScraperFactory.getRunner('website_rss');
    const job = {
        sourceId: sourceId,
        url: testSource.source_url,
        type: 'website_rss' as const,
        config: {}
    };

    try {
        const events = await runner.run(job);
        console.log(`   ✅ Scraped ${events.length} raw events`);

        if (events.length === 0) {
            console.warn('   ⚠️ No events found. The RSS feed might be empty or blocked.');
        } else {
            console.log('   Sample Event:', events[0].title);
        }

        // 3. Ingest Events
        console.log('3. Ingesting & Enriching events...');
        await ingestEvents(events, sourceId, supabase);
        console.log('   ✅ Ingestion Complete!');

    } catch (error) {
        console.error('❌ Scraper Failed:', error);
    }
}

main();
