
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'
import { slugify } from '../src/utils/slugify'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const RESTAURANTS = [
    {
        name: 'The Rogue Roundabout',
        address: '804 Chestnut St, Conway, AR 72032',
        website: 'https://www.therogueroundabout.com/',
        category: 'restaurant'
    },
    {
        name: 'Big Bad Breakfast - Conway',
        address: '1004 Oak St, Conway, AR 72032',
        website: 'https://bigbadbreakfast.com/bbb-locations/conway-ar/',
        category: 'restaurant'
    },
    {
        name: 'Seven Oaks Steak and Seafood',
        address: '912 Front St, Conway, AR 72032',
        website: 'http://sevenoakssteakandseafood.com/',
        category: 'restaurant'
    },
    {
        name: 'Portofino Italian Restaurant',
        address: '815 Hogan Ln #1, Conway, AR 72034',
        website: 'https://www.portofinoconway.com/',
        category: 'restaurant'
    },
    {
        name: 'MarketPlace Grill',
        address: '600 Skyline Dr, Conway, AR 72032',
        website: 'https://www.marketplacegrill.com/',
        category: 'restaurant'
    }
];

async function ingestEatInitial() {
    console.log('--- INGESTING EAT SECTION (INITIAL 5) ---');
    const { extractDealsFromText } = await import('@/lib/ai/extractor');

    for (const r of RESTAURANTS) {
        console.log(`\nProcessing: ${r.name}...`);
        const slug = slugify(r.name);

        // 1. Upsert Business
        const { data: business, error: bizError } = await supabase
            .from('businesses')
            .upsert({
                name: r.name,
                slug: slug,
                address: r.address,
                website_url: r.website,
                owner_id: null // System owned
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (bizError) {
            console.error('Failed to upsert business:', bizError);
            continue;
        }

        console.log(`Business upserted: ${business.id}`);

        // 2. Scrape Website
        try {
            console.log(`Fetching ${r.website}...`);
            const response = await fetch(r.website, {
                headers: { 'User-Agent': 'EatPlayConwayBot/1.0' }
            });

            if (!response.ok) {
                console.error(`Failed to fetch ${r.website}: ${response.status}`);
                continue;
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            // Simplify HTML (Text extraction)
            $('script').remove();
            $('style').remove();
            $('nav').remove();
            $('footer').remove();
            const text = $('body').text().replace(/\s+/g, ' ').trim();

            console.log(`Extracted ${text.length} chars. Sending to AI...`);

            // 3. Extract Deals
            const deals = await extractDealsFromText(text, r.website);
            console.log(`Found ${deals.length} deals.`);

            if (deals.length > 0) {
                // 4. Upsert Deals
                // Transform to DB schema
                /*
                deals schema:
                    id, business_id, source_id, title, description, promo_code, deal_type,
                    valid_from, valid_until, active_days, is_active
                */

                const dealsToInsert = deals.map(d => ({
                    business_id: business.id,
                    title: d.title,
                    description: d.description,
                    deal_type: d.deal_type,
                    days_active: d.active_days, // Correct column
                    start_time: d.valid_from,   // Correct column
                    end_time: d.valid_until,    // Correct column
                    is_active: true
                }));

                // We don't have a unique constraint on Deals to upsert easily without ID.
                // Strategy: Delete existing deals for this business and insert new ones?
                // Yes, safer to avoid duplicates if re-running.
                await supabase.from('deals').delete().eq('business_id', business.id);

                const { error: dealsError } = await supabase.from('deals').insert(dealsToInsert);
                if (dealsError) console.error('Failed to insert deals:', dealsError);
                else console.log('Deals inserted.');
            }

        } catch (e: any) {
            console.error(`Scrape failed for ${r.name}:`, e.message);
        }
    }
    console.log('\nDone.');
}

ingestEatInitial();
