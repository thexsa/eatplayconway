import { ScraperRunner, ScraperType } from './types';
import { RssScraper } from './runners/rss';
import { HtmlScraper } from './runners/html'; // Import the new runner

export class ScraperFactory {
    private static runners: ScraperRunner[] = [
        new RssScraper(),
        new HtmlScraper(), // Register it here
    ];

    static getRunner(type: ScraperType): ScraperRunner {
        const runner = this.runners.find(r => r.supports(type));

        if (!runner) {
            // Fallback or specific error handling for 'Hard' types that use external runners
            if (['facebook_page', 'instagram', 'gmb'].includes(type)) {
                throw new Error(`Scraper type '${type}' requires external runner execution.`);
            }
            throw new Error(`No runner found for type: ${type}`);
        }

        return runner;
    }
}

export const getScraper = (type: ScraperType) => ScraperFactory.getRunner(type);
