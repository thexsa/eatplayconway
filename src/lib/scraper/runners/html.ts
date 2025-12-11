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

            console.log(`[HtmlScraper] Sending ${textContent.length} chars to AI...`);

            const events = await extractEventsFromText(textContent, job.url);

            console.log(`[HtmlScraper] Extracted ${events.length} events.`);
            return events;

        } catch (error: any) {
            console.error(`HTML Scrape failed for ${job.url}`, error);
            throw new Error(`HTML Scrape Error: ${error.message}`);
        }
    }
}
