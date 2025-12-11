
import { load } from 'cheerio'

const SCHOOLS = [
    'https://www.conwayschools.org/o/chs/events',
    'https://www.conwayschools.org/o/cjhs/events'
]

async function findIcs() {
    for (const url of SCHOOLS) {
        console.log(`Checking ${url}...`)
        try {
            const res = await fetch(url)
            const html = await res.text()
            const $ = load(html)

            // Look for links ending in .ics or containing 'ical'
            let ics = ''
            $('a').each((i, el) => {
                const href = $(el).attr('href')
                if (href && (href.endsWith('.ics') || href.includes('ical'))) {
                    ics = href
                }
            })

            // Absolute URL
            if (ics && !ics.startsWith('http')) {
                const base = new URL(url).origin
                ics = base + ics
            }

            console.log(`FOUND ICS: ${ics}`)
        } catch (e) {
            console.error(e)
        }
    }
}

findIcs()
