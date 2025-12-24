import Parser from 'rss-parser';
import { ScraperRunner, ScrapeJob, NormalizedEvent, ScraperType } from '../types';
import { load } from 'cheerio';

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
            // 1. Fetch RAW XML manually to control Headers (fixes 404s like KATV)
            const res = await fetch(job.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            if (!res.ok) throw new Error(`RSS Fetch Failed: ${res.status} ${res.statusText}`);

            let xml = await res.text();

            // 2. Sanitation (fixes XML errors like THV11 unescaped &)
            // Replace standalone '&' with '&amp;' if not part of an entity
            // This regex finds '&' not followed by (word char or #) + ';'
            // Simplified: Just fix specific known issues or use a robust strategy.
            // THV11 Error was "Invalid character in entity name" -> often "&id=..."
            xml = xml.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#x?\d+;)/g, '&amp;');

            const feed = await this.parser.parseString(xml);
            const events: NormalizedEvent[] = [];

            // Process items in batches to avoid overwhelming network but simpler to just map for now (usually <50 items)
            // But let's be safe and do sequential or small batches if needed.
            // For now, Promise.all is likely fine for low volume. 
            // Actually, let's filter first.

            const items = feed.items;

            for (const item of items) {
                // Extract image from enclosure or media:content
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

                // DEEP FETCH Fallback: 
                // 1. If no image found.
                // 2. OR if image is a low-res Google thumbnail (lh3.googleusercontent), try to get better OG image.
                const isGoogleThumbnail = image && image.includes('googleusercontent.com');

                if ((!image || isGoogleThumbnail) && item.link) {
                    try {
                        // Rate limiting: small delay before deep fetch
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        const ogImage = await this.fetchOgImage(item.link);
                        if (ogImage) {
                            // If we got a valid OG image, use it!
                            // (If we had a thumbnail, this replaces it with likely higher res)
                            image = ogImage;
                        }
                    } catch (err) {
                        console.warn(`[RSS] Failed deep image fetch for ${item.link}:`, err);
                    }
                }

                events.push({
                    title: item.title || 'Untitled Event',
                    start_time: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
                    description: item.contentSnippet || item.content || '',
                    url: item.link || '',
                    image_url: image,
                    raw_data: item
                });
            }

            return events;

        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error(`RSS Scrape failed for ${job.url}`, error);
            throw new Error(`RSS Parse Error: ${error.message}`);
        }
    }

    private async fetchOgImage(url: string): Promise<string | undefined> {
        // Fetch HTML
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                },
                redirect: 'follow',
                signal: AbortSignal.timeout(5000) // 5s timeout
            });

            if (!res.ok) return undefined;

            const html = await res.text();
            const $ = load(html);

            // Try standard OG tags
            let img = $('meta[property="og:image"]').attr('content') ||
                $('meta[name="twitter:image"]').attr('content') ||
                $('link[rel="image_src"]').attr('href');

            // Sanity check URL
            if (img && !img.startsWith('http')) {
                // If relative, try to resolve (simplified)
                try {
                    img = new URL(img, url).toString();
                } catch {
                    return undefined;
                }
            }

            return img || undefined;
        } catch (e) {
            return undefined;
        }
    }
}
