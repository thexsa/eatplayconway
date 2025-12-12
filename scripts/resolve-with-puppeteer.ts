
import puppeteer from 'puppeteer';

const GOOGLE_URL = 'https://news.google.com/rss/articles/CBMikwFBVV95cUxpRDk1TVQtVEt0OThxYm45eU0wdzF1eUVsLXlqRzNsTkxFYzZ0Z0lzbFcwX1d4ZzdFV2k5c05tZkZJcDBjR0VpQ21oT1BIV2tzZDVwYW1jR1J6aTBDbE5qVEh3b01lZThxYlY3SVRnS2R4N1dZbWpJbW5lZWN5M3BtNmRyMHh6cDhvLUFCS05QZw?oc=5';

async function testPuppeteer() {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // safe for most environments
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // Strip query params
        const cleanUrl = GOOGLE_URL.split('?')[0];
        console.log(`Navigating to ${cleanUrl}...`);

        await page.evaluateOnNewDocument(() => {
            // @ts-ignore
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        });

        await page.goto(cleanUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait a bit more for client side redirects
        await new Promise(r => setTimeout(r, 5000));

        const finalUrl = page.url();
        console.log(`Final URL: ${finalUrl}`);

        const content = await page.content();
        console.log(`Page Title: ${await page.title()}`);
        console.log(`Page Start: ${content.substring(0, 200)}...`);

        // Check if we are still on Google
        if (finalUrl.includes('google.com')) {
            // Maybe try clicking the first link?
            const link = await page.$('a');
            if (link) {
                console.log('Found a link, clicking...');
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'networkidle2' }),
                    link.click()
                ]);
                console.log(`New URL: ${page.url()}`);
            }
        }

        // Extract OG Image
        const ogImage = await page.evaluate(() => {
            const og = document.querySelector('meta[property="og:image"]');
            return og ? og.getAttribute('content') : null;
        });

        console.log(`OG Image: ${ogImage}`);

    } catch (e) {
        console.error('Puppeteer Failed:', e);
    } finally {
        await browser.close();
    }
}

testPuppeteer();
