import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { NormalizedEvent } from '@/lib/scraper/types';

export async function POST(request: Request) {
    const body = await request.json();

    // Validate Secret
    const secret = request.headers.get('x-scrape-secret');
    if (secret !== process.env.SCRAPER_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sourceId, events, success, error } = body;
    const supabase = await createClient();

    if (!success) {
        await supabase.from('scrape_sources').update({
            last_status: 'error',
            error_log: error || 'Unknown external error'
        }).eq('id', sourceId);
        return NextResponse.json({ received: true });
    }

    import { ingestEvents } from '@/lib/ingest';

    // Process Events
    const validEvents = events as NormalizedEvent[];
    await ingestEvents(validEvents, sourceId);

    // Update Source
    await supabase.from('scrape_sources').update({
        last_scraped_at: new Date().toISOString(),
        last_status: 'success',
        error_log: null
    }).eq('id', sourceId);

    return NextResponse.json({ received: true, count: validEvents.length });
}
