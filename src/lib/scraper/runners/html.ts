import * as cheerio from 'cheerio';
import { ScraperRunner, ScrapeJob, NormalizedEvent, ScraperType } from '../types';
import { extractEventsFromText } from '../../ai/extractor';

export class HtmlScraper implements ScraperRunner {
    supports(type: ScraperType): boolean {
        return type === 'website_html';
    }

    async run(job: ScrapeJob): Promise<NormalizedEvent[]> {
        try {
            console.log(`[HtmlScraper] Fetching ${job.url}...`);

            const response = await fetch(job.url, {
                headers: {
                    'User-Agent': 'EatPlayConway-Bot/1.0 (+http://eatplayconway.com)'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
            }

            const html = await response.text();

            console.log(`[HtmlScraper] Parsing HTML...`);
            const $ = cheerio.load(html);

            // Clean up the DOM
            $('script').remove();
            $('style').remove();
            $('noscript').remove();
            $('iframe').remove();
            $('header').remove(); // Optional: might remove nav links which are noise
            $('footer').remove(); // Optional: might remove common noise
            $('nav').remove();

            // Get text content
            // We use a custom text extraction to try and preserve some structure nicely?
            // For now, simple text() is usually okay for LLMs if we just join with newlines
            const textContent = $('body').text().replace(/\s+/g, ' ').trim();

            // Extract Images
            const candidateImages: string[] = [];

            // 1. OG Image
            const ogImage = $('meta[property="og:image"]').attr('content');
            if (ogImage) candidateImages.push(ogImage);

            // 2. Main Images in body
            const IMAGE_BLOCKLIST = [
                'https://conwaychamber.org/wp-content/uploads/2023/11/DSCF5203-1024x683.jpg', // Cow/Santa generic
                'https://conwayarkansas.org/wp-content/uploads/2023/04/Conway-Community-July-Facebook-228-1024x762.jpeg', // Downtown generic
            ];

            $('img').each((i, el) => {
                const src = $(el).attr('src');
                if (src && src.startsWith('http') && !src.includes('logo') && !src.includes('icon') && !IMAGE_BLOCKLIST.includes(src)) {
                    if (candidateImages.length < 10) candidateImages.push(src);
                }
            });

            // Also filter OG image if it matches blocklist
            if (ogImage && IMAGE_BLOCKLIST.includes(ogImage)) {
                // Remove it from candidates if pushed
                const idx = candidateImages.indexOf(ogImage);
                if (idx > -1) candidateImages.splice(idx, 1);
            }

            console.log(`[HtmlScraper] Sending ${textContent.length} chars + ${candidateImages.length} images to AI...`);

            const events = await extractEventsFromText(textContent, job.url, { candidate_images: candidateImages });

            console.log(`[HtmlScraper] Extracted ${events.length} events.`);

            // Post-processing: Ensure every event has an image if possible
            // Post-processing: Ensure every event has an image if possible AND fix potential year inference issues
            const now = new Date();
            const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

            return events.map(event => {
                let correctedEvent = { ...event };

                // Fix Year Inference: If date is significantly in the past (e.g., > 3 months ago), assume it's for next year.
                // Common issue with calendars lacking years (e.g. "March 20" parsed as "March 20, 2025" in Dec 2025).
                if (event.start_time) {
                    const date = new Date(event.start_time);
                    if (date < threeMonthsAgo) {
                        // It's old. Assume next year?
                        // Only if the month is "ahead" of current month in a cycle? 
                        // Actually, if it's "March" and we are "Dec", and it says "March 2025", it's old.
                        // It represents "March 2026".
                        // So we just add 1 year.
                        date.setFullYear(date.getFullYear() + 1);
                        correctedEvent.start_time = date.toISOString();

                        // Also fix end_time if present
                        if (correctedEvent.end_time) {
                            const end = new Date(correctedEvent.end_time);
                            end.setFullYear(end.getFullYear() + 1);
                            correctedEvent.end_time = end.toISOString();
                        }
                        console.log(`[HtmlScraper] Corrected stale date for "${event.title}": ${event.start_time} -> ${correctedEvent.start_time}`);
                    }
                }

                if (!correctedEvent.image_url && candidateImages.length > 0) {
                    // Use the first candidate (usually og:image) as fallback
                    correctedEvent.image_url = candidateImages[0];
                }
                return correctedEvent;
            });

        } catch (error: any) {
            console.error(`HTML Scrape failed for ${job.url}`, error);
            throw new Error(`HTML Scrape Error: ${error.message}`);
        }
    }
}
