
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MENU_DATA = [
    {
        slug: 'the-rogue-roundabout',
        menu_url: 'https://www.therogueroundabout.com/food-drink'
    },
    {
        slug: 'big-bad-breakfast-conway',
        menu_url: 'https://bigbadbreakfast.com/locations/conway-arkansas/menu/'
    },
    {
        slug: 'seven-oaks-steak-and-seafood',
        menu_url: 'https://sevenoakssteakandseafood.com/dinner-menu/'
    },
    {
        slug: 'portofino-italian-restaurant',
        menu_url: 'https://portofino-conway.com/#menu'
    },
    {
        slug: 'marketplace-grill',
        menu_url: 'https://marketplacegrill.com/menu/'
    }
];

async function seedMenuData() {
    console.log('--- SEEDING MENU URLS INTO SOCIAL_LINKS ---');

    // First fetch existing to merge? Or just overwrite specific key?
    // Postgres JSONB update is tricky via simple update if we want to preserve other keys.
    // But currently social_links is likely null or empty for these since I just created them.
    // I will fetch first to be safe.

    for (const item of MENU_DATA) {
        // Update the new menu_url column directly
        const { error } = await supabase
            .from('businesses')
            .update({ menu_url: item.menu_url })
            .eq('slug', item.slug);

        if (error) console.error(`Error updating ${item.slug}:`, error);
        else console.log(`Updated menu_url for ${item.slug}`);
    }
}

seedMenuData();
