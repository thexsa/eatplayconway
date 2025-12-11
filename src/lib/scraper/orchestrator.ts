import { createClient } from '@/utils/supabase/server'
import { getScraper } from './factory'
import { ingestEvents } from '@/lib/ingest'
import { ScraperType } from './types'

export async function processSource(sourceId: string) {
    const supabase = await createClient()

    // 1. Fetch Source
    const { data: source, error } = await supabase
        .from('scrape_sources')
        .select('*')
        .eq('id', sourceId)
        .single()

    if (error || !source) {
        throw new Error(`Source not found: ${sourceId}`)
    }

    // 2. Parse Type
    const scraperType = source.source_type as ScraperType
    // TODO: Validate this against ScraperType enum/union if possible, 
    // but for now relying on DB constraint + casting

    // 3. Get Runner
    const runner = getScraper(scraperType)

    try {
        // 4. Run Scraper
        console.log(`Starting scrape for ${source.name}...`)
        const events = await runner.run({
            url: source.source_url,
            type: scraperType,
            sourceId: source.id,
            config: {} // No specialized config for now
        })

        // 5. Ingest
        console.log(`Found ${events.length} events. Ingesting...`)
        await ingestEvents(events, source.id)

        // 6. Update Status
        await supabase
            .from('scrape_sources')
            .update({
                last_scraped_at: new Date().toISOString(),
                last_status: 'success',
                error_log: null
            })
            .eq('id', sourceId)

        return { success: true, count: events.length }

    } catch (error: any) {
        console.error(`Scrape failed for ${source.name}:`, error)

        // Log error to DB
        await supabase
            .from('scrape_sources')
            .update({
                last_scraped_at: new Date().toISOString(),
                last_status: 'error',
                error_log: error.message || 'Unknown error'
            })
            .eq('id', sourceId)

        throw error
    }
}
