import Parser from 'rss-parser';
import { ScraperRunner, ScrapeJob, NormalizedEvent, ScraperType } from '../types';

export class RssScraper implements ScraperRunner {
    private parser: Parser;

    constructor() {
        this.parser = new Parser();
    }

    supports(type: ScraperType): boolean {
        return type === 'website_rss';
    }

    async run(job: ScrapeJob): Promise<NormalizedEvent[]> {
        try {
            const feed = await this.parser.parseURL(job.url);

            return feed.items.map((item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                // Extract image from enclosure or media:content
                // rss-parser puts media:content in item['media:content'] or item.enclosure
                let image = item.enclosure?.url || item['media:content']?.['$']?.url || item['media:group']?.['media:content']?.[0]?.['$']?.url;

                // Fallback: Try to find distinct image in content HTML
                if (!image && (item.content || item['content:encoded'])) {
                    const html = item['content:encoded'] || item.content;
                    const srcMatch = html.match(/src="([^"]+)"/);
                    if (srcMatch && srcMatch[1]) {
                        // Filter out common trackers/pixel bugs
                        if (!srcMatch[1].includes('pixel') && !srcMatch[1].includes('analytics')) {
                            image = srcMatch[1];
                        }
                    }
                }

                return {
                    title: item.title || 'Untitled Event',
                    start_time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    description: item.contentSnippet || item.content || '',
                    url: item.link || '',
                    image_url: image, // Pass generic image if found
                    // RSS feeds vary wildly, simplistic mapping for now
                    raw_data: item
                }
            });
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error(`RSS Scrape failed for ${job.url}`, error);
            throw new Error(`RSS Parse Error: ${error.message}`);
        }
    }
}
