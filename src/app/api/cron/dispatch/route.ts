/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ScraperFactory } from '@/lib/scraper/factory';
import { ScrapeJob } from '@/lib/scraper/types';
import { ingestEvents } from '@/lib/ingest';

export async function GET(request: Request) {
    // 1. Verify Vercel Cron Signature (Optional for dev, crucial for prod)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { return new Response('Unauthorized', { status: 401 }); }

    const supabase = await createClient();

    // 2. Fetch due sources
    // Logic: Active sources where last_scraped_at is older than frequency_hours
    // For MVP, just fetching all active for simplicity, or hardcoding a check
    const { data: sources, error } = await supabase
        .from('scrape_sources')
        .select('*')
        .eq('is_active', true)

    if (error || !sources) {
        return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
    }

    const results = [];

    // 3. Dispatch Jobs
    for (const source of sources) {
        const job: ScrapeJob = {
            sourceId: source.id,
            url: source.source_url,
            type: source.source_type as any, // Cast to Schema Type
            config: source.config_json as any || {}
        };

        try {
            // Check complexity
            if (source.difficulty === 'hard') {
                // TODO: Trigger External Runner (Apify/ZenRows)
                results.push({ source: source.name, status: 'dispatched_external' });
            } else {
                // Run Internal
                const runner = ScraperFactory.getRunner(job.type);
                const events = await runner.run(job);

                await ingestEvents(events, source.id);

                // For now, just logging count
                results.push({ source: source.id, status: 'scraped_internal', count: events.length });

                // Update Last Scraped
                await supabase.from('scrape_sources').update({
                    last_scraped_at: new Date().toISOString(),
                    last_status: 'success'
                }).eq('id', source.id);
            }
        } catch (e: any) {
            console.error(`Job failed for ${source.id}`, e);
            await supabase.from('scrape_sources').update({
                last_status: 'error',
                error_log: e.message
            }).eq('id', source.id);
            results.push({ source: source.id, status: 'error', error: e.message });
        }
    }

    return NextResponse.json({ processed: results.length, jobs: results });
}
