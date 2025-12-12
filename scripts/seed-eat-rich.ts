
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const RICH_DATA = [
    {
        name: 'The Rogue Roundabout',
        description: 'Conway’s premier craft food and beverage destination. Offering a unique dining experience with a focus on fresh, local ingredients and creative cocktails.',
        slug: 'the-rogue-roundabout'
    },
    {
        name: 'Big Bad Breakfast - Conway',
        description: 'James Beard award-winning chef John Currence brings his specialized breakfast menu to Conway. Featuring custom-created meats, fresh biscuits, and locally roasted coffee.',
        slug: 'big-bad-breakfast-conway'
    },
    {
        name: 'Seven Oaks Steak and Seafood',
        description: 'An elegant dining experience offering the finest steaks and fresh seafood. Perfect for romantic dinners and special occasions.',
        slug: 'seven-oaks-steak-and-seafood'
    },
    {
        name: 'Portofino Italian Restaurant',
        description: 'Authentic Italian cuisine in the heart of Conway. Serving classic pasta dishes, pizza, and seafood in a warm, family-friendly atmosphere.',
        slug: 'portofino-italian-restaurant'
    },
    {
        name: 'MarketPlace Grill',
        description: 'A local favorite for American grill classics. Famous for chocolate mess, grilled chicken patterns, and a vibrant atmosphere.',
        slug: 'marketplace-grill'
    }
];

async function seedRichData() {
    console.log('--- SEEDING RICH DESC DATA ---');

    for (const r of RICH_DATA) {
        const { error } = await supabase
            .from('businesses')
            .update({ description: r.description })
            .eq('slug', r.slug);

        if (error) console.error(`Error updating ${r.name}:`, error);
        else console.log(`Updated description for ${r.name}`);
    }
}

seedRichData();
