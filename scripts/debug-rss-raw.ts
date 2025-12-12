
import Parser from 'rss-parser';

const FEED_URL = 'https://news.google.com/rss/search?q=Conway+AR&hl=en-US&gl=US&ceid=US:en';

async function debugRaw() {
    const parser = new Parser({
        customFields: {
            item: ['source', 'ht:news_item', 'ht:picture'],
        }
    });
    console.log(`Fetching ${FEED_URL}...`);
    const feed = await parser.parseURL(FEED_URL);

    console.log(`Found ${feed.items.length} items. Dumping first 3...`);

    feed.items.slice(0, 3).forEach((item, i) => {
        console.log(`\n--- Item ${i + 1} ---`);
        console.log('Title:', item.title);
        console.log('Link:', item.link);
        console.log('Source:', item.source);
        console.log('ContentSnippet:', item.contentSnippet);
        console.log('Keys:', Object.keys(item));
        // Check if there is anything looking like a real URL in content
        if (item.content && item.content.includes('http')) {
            console.log('Content likely contains links.');
        }
    });
}

debugRaw();
