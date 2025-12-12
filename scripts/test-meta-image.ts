
import { load } from 'cheerio'

const URLS = [
    'https://news.google.com/rss/articles/CBMikwFBVV95cUxpRDk1TVQtVEt0OThxYm45eU0wdzF1eUVsLXlqRzNsTkxFYzZ0Z0lzbFcwX1d4ZzdFV2k5c05tZkZJcDBjR0VpQ21oT1BIV2tzZDVwYW1jR1J6aTBDbE5qVEh3b01lZThxYlY3SVRnS2R4N1dZbWpJbW5lZWN5M3BtNmRyMHh6cDhvLUFCS05QZw?oc=5', // A sample Google News link (likely one of the user's)
    'https://www.arkansasonline.com/news/2025/dec/05/uca-officials-tout-impact-of-potential-new/', // Direct link provided
    'https://501lifemag.com/uca-shares-vision-for-multipurpose-arena-at-december-board-meeting/' // Direct link provided
]

async function testExtraction() {
    for (const link of URLS) {
        console.log(`\nFetching ${link}...`)
        try {
            // Decoding Google News links is complex (Protobuf), but usually simple fetch works if headers are right.
            // 400 often means it dislikes the client.
            const res = await fetch(link, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Upgrade-Insecure-Requests': '1'
                },
                redirect: 'follow'
            })
            console.log(`Status: ${res.status}`)
            console.log(`Final URL: ${res.url}`) // Redirects followed?

            const html = await res.text()
            const $ = load(html)

            const ogImage = $('meta[property="og:image"]').attr('content')
            const twitterImage = $('meta[name="twitter:image"]').attr('content')

            console.log(`OG Image: ${ogImage}`)
            console.log(`Twitter Image: ${twitterImage}`)

        } catch (e) {
            console.error(`Error: ${e}`)
        }
    }
}

testExtraction()
