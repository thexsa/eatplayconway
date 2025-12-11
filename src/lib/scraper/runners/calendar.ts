
import { ScrapeJob, ScraperRunner, NormalizedEvent, ScraperType } from '../types'
import ical from 'node-ical'
import { slugify } from '@/utils/slugify'

export class CalendarScraperRunner implements ScraperRunner {
    supports(type: ScraperType): boolean {
        return type === 'calendar'
    }

    async run(job: ScrapeJob): Promise<NormalizedEvent[]> {
        console.log(`[Calendar] Fetching ICS from ${job.url}`)

        try {
            const data = await ical.async.fromURL(job.url)
            const events: NormalizedEvent[] = []

            for (const k in data) {
                if (data.hasOwnProperty(k)) {
                    const ev = data[k]
                    if (ev.type !== 'VEVENT') continue

                    // Filter: Only Future Events
                    if (!ev.start || new Date(ev.start) < new Date()) continue

                    // Public Filter (Simple keyword check if 'private' or internal indicators exist, 
                    // usually schools put everything in one feed but description might clarify. 
                    // For Conway Schools, the user said "pull out only events that the public can attend".
                    // This is hard to do programmatically without AI. I'll rely on AI enrichment later.

                    const title = ev.summary || 'Untitled Event'
                    const description = ev.description || ''

                    // Simple "School" defaults
                    // If no image, we will handle it in ingest (or here).
                    // User said: "if there is no image for the school events, use the conway public schools logo."
                    // I'll hardcode it here if I can detect it's a school, or just pass null and let ingest handle it via default logic?
                    // User specifically asked for Conway Public Schools logo.
                    const isConwaySchools = job.url.includes('conwayschools') || job.url.includes('thrillshare');
                    let imageUrl = null;
                    if (isConwaySchools) {
                        imageUrl = '/images/wampus-cat-logo.png'; // Local Wampus Cat Logo
                    }

                    events.push({
                        title: title,
                        start_time: new Date(ev.start).toISOString(),
                        end_time: ev.end ? new Date(ev.end).toISOString() : undefined,
                        description: description,
                        location: ev.location || undefined,
                        url: job.url, // ICS doesn't usually have per-event URL, so use feed URL or extracted desc link
                        image_url: imageUrl || undefined,
                        raw_data: ev as any
                    })
                }
            }

            console.log(`[Calendar] Found ${events.length} future events`)
            return events

        } catch (err) {
            console.error('[Calendar] Error parsing ICS:', err)
            return []
        }
    }
}
