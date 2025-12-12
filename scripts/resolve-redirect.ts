
const GOOGLE_URL = 'https://news.google.com/rss/articles/CBMikwFBVV95cUxpRDk1TVQtVEt0OThxYm45eU0wdzF1eUVsLXlqRzNsTkxFYzZ0Z0lzbFcwX1d4ZzdFV2k5c05tZkZJcDBjR0VpQ21oT1BIV2tzZDVwYW1jR1J6aTBDbE5qVEh3b01lZThxYlY3SVRnS2R4N1dZbWpJbW5lZWN5M3BtNmRyMHh6cDhvLUFCS05QZw?oc=5';

async function resolve() {
    console.log('Attempting to resolve via fetch...');
    try {
        const res = await fetch(GOOGLE_URL, {
            headers: {
                'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)',
            },
            redirect: 'follow'
        });

        console.log('Status:', res.status);
        console.log('Final URL:', res.url);

        if (res.status === 200) {
            const text = await res.text();
            if (text.includes("You've reached the end of the line")) {
                console.log('Blocked by Google consent/bot check.');
            }
        }

    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

resolve();
