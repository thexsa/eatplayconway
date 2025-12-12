
import { load } from 'cheerio';

async function debugChamber() {
    const url = 'https://conwayarkansas.org/events/';
    console.log(`Fetching ${url}...`);

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });
        const html = await res.text();
        const $ = load(html);

        console.log(`Status: ${res.status}`);

        // Match the logic in HtmlScraper (generic or specific)
        // Since we don't have a specific scraper, it likely falls back to generic logic or user-defined selectors?
        // Wait, HtmlScraper uses AI usually, but let's see what the DOM looks like.
        // It might be finding dates without years and defaulting to current year (2024 or 2025?)

        // Print all potential event blocks
        // Assuming common classes like 'event', 'calendar', etc.
        const pageText = $('body').text().substring(0, 1000);
        console.log('Preview Body Text:', pageText.replace(/\s+/g, ' '));

        // Dump potential event containers
        console.log('\n--- Event Structure ---');
        // Look for common event classes
        const selectors = ['.event', '.card', 'article', 'li.event', '.calendar-event', '.vevent'];
        let found = false;

        selectors.forEach(sel => {
            if ($(sel).length > 0) {
                console.log(`Found selector: ${sel}`);
                console.log($(sel).first().html()?.substring(0, 500));
                found = true;
            }
        });

        if (!found) {
            // Fallback: Dump text of first 5 divs with class containing 'event'
            console.log('No standard selectors found. Searching for *event* class...');
            $('[class*="event"]').slice(0, 3).each((i, el) => {
                console.log(`\nClass: ${$(el).attr('class')}`);
                console.log($(el).html()?.substring(0, 200));
            });
        }

        // Dump specific elements that look like dates
        console.log('\n--- Date Candidates ---');
        $('*').each((i, el) => {
            const text = $(el).text().trim();
            // Simple regex for Month Day
            if (text.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}/i) && text.length < 20) {
                console.log(`Found Date-like text: "${text}" in <${el.tagName}>`);
            }
        });

    } catch (e) {
        console.error('Failed:', e);
    }
}

debugChamber();
