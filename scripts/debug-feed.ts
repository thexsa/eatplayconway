
const URLS = [
    'https://katv.com/rss',
    'https://www.thv11.com/rss'
];

async function testFeeds() {
    for (const url of URLS) {
        console.log(`\nScanning ${url}...`);
        try {
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            });
            const text = await res.text();
            console.log(`Status: ${res.status}`);

            // Find valid RSS links
            const links = text.match(/href="([^"]*rss[^"]*)"/g);
            if (links) {
                console.log('Found Candidates:');
                links.forEach(l => console.log(l));
            } else {
                console.log('No explicit RSS links found via regex.');
            }
        } catch (e) {
            console.error('Failed:', e);
        }
    }
}

testFeeds();
