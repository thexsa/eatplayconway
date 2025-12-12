
import dotenv from 'dotenv'
import path from 'path'

// Load env BEFORE importing supabase
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function manageSources() {
    console.log('--- Cleaning up Sources ---');

    // List of keywords to identify news sources we want to reset
    const targetKeywords = ['google', 'katv', 'thv11', 'thecabin', 'pulseofconway', 'conwayarkansas.gov'];

    for (const keyword of targetKeywords) {
        // Find sources matching keyword
        const { data: sources } = await supabase.from('scrape_sources').select('id, name, source_url').ilike('source_url', `%${keyword}%`);

        if (sources && sources.length > 0) {
            for (const s of sources) {
                console.log(`Deleting Source: ${s.name} (${s.source_url})`);
                // Delete events first
                await supabase.from('events').delete().eq('source_id', s.id);
                // Delete source
                await supabase.from('scrape_sources').delete().eq('id', s.id);
            }
        }
    }

    console.log('--- Adding Fresh Sources ---');

    const newSources = [
        {
            name: "THV11 News",
            source_url: "https://www.thv11.com/feeds/syndication/rss/news/local",
            source_type: "website_rss",
            is_active: true
        },
        {
            name: "The Log Cabin Democrat",
            source_url: "https://www.thecabin.net/search/?q=&t=article&l=10&d=&d1=&d2=&s=start_time&sd=desc&c[]=news/*&f=rss",
            source_type: "website_rss",
            is_active: true
        },
        {
            name: "Pulse of Conway",
            source_url: "https://pulseofconway.com/feed/",
            source_type: "website_rss",
            is_active: true
        },
        {
            name: "Conway City News",
            source_url: "https://conwayarkansas.gov/news/",
            source_type: "website_html",
            is_active: true
        },
        {
            name: "Conway Downtown Partnership",
            source_url: "https://conwayarkansas.org/events/",
            source_type: "website_html",
            is_active: true
        }
    ];

    for (const s of newSources) {
        const { error } = await supabase.from('scrape_sources').insert(s);
        if (error) console.error('Error adding', s.name, error);
        else console.log('Added', s.name);
    }

    // List Final State
    const { data: finalSources } = await supabase.from('scrape_sources').select('id, name, source_url, is_active');
    console.log('\n--- Final Source List ---');
    finalSources?.forEach(s => {
        console.log(`[${s.id}] ${s.name} - ${s.source_url}`);
    });
}

manageSources()
