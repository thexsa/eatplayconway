
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface SeedDeal {
    slug: string;
    title: string;
    description: string;
    deal_type: string;
    days_active: string[] | null;
    start_time: string | null;
    end_time: string | null;
}

const DEALS_DATA: SeedDeal[] = [
    // --- Rogue Roundabout ---
    {
        slug: 'the-rogue-roundabout',
        title: 'Lunch Combos',
        description: 'Pick two: Soup, Salad, or Sandbox Sandwich for $12.',
        deal_type: 'food',
        days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '11:00',
        end_time: '16:00'
    },
    {
        slug: 'the-rogue-roundabout',
        title: 'Happy Hour',
        description: '$1 Off All Pints & $5 House Wines.',
        deal_type: 'happy_hour',
        days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '16:00',
        end_time: '18:00'
    },

    // --- Big Bad Breakfast ---
    {
        slug: 'big-bad-breakfast-conway',
        title: 'Bad A** Bloody Marys',
        description: 'House-made mix with choice of vodka. A meal in a glass!',
        deal_type: 'drink',
        days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        start_time: '07:00',
        end_time: '14:30'
    },
    {
        slug: 'big-bad-breakfast-conway',
        title: 'Daily Lunch Duo',
        description: 'Soup & Sandwich special rotating daily.',
        deal_type: 'food',
        days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '11:00',
        end_time: '14:30'
    },

    // --- Seven Oaks ---
    {
        slug: 'seven-oaks-steak-and-seafood',
        title: 'Chef\'s Weekly Features',
        description: 'Rotating steak and seafood creations by the Chef.',
        deal_type: 'food',
        days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        start_time: '17:00',
        end_time: '21:00'
    },
    {
        slug: 'seven-oaks-steak-and-seafood',
        title: 'Wine Down',
        description: 'Select bottles and glasses on special.',
        deal_type: 'happy_hour',
        days_active: ['Tuesday', 'Wednesday', 'Thursday'],
        start_time: '16:00',
        end_time: '18:00'
    },

    // --- Portofino Italian ---
    {
        slug: 'portofino-italian-restaurant',
        title: 'Pasta Specials',
        description: 'Select pasta dishes like Picatta and Marsala for $15.99.',
        deal_type: 'food',
        days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        start_time: '11:00',
        end_time: '21:00'
    },
    {
        slug: 'portofino-italian-restaurant',
        title: 'Lunch Portion Classics',
        description: 'Smaller portions of your favorites available until 3pm.',
        deal_type: 'food',
        days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '11:00',
        end_time: '15:00'
    },

    // --- MarketPlace Grill --- (Overwriting previous generic ones if needed, or keeping)
    {
        slug: 'marketplace-grill',
        title: 'Happy Hour',
        description: 'Half-price appetizers and drink specials in the bar.',
        deal_type: 'happy_hour',
        days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        start_time: '15:00',
        end_time: '18:00'
    },
    // Note: Existing Kids Eat Free (Tue) and Double Points (Mon) are good, I'll leave them or upsert them if I knew IDs.
    // Simpler to clear and re-seed for these 5 to ensure clean state? 
    // I'll delete existing deals for these 5 slugs first.
];

async function seedComprehensiveDeals() {
    console.log('--- SEEDING COMPREHENSIVE DEALS ---');

    for (const item of DEALS_DATA) {
        // Get Biz ID
        const { data: biz } = await supabase.from('businesses').select('id').eq('slug', item.slug).single();
        if (!biz) {
            console.error(`Biz not found: ${item.slug}`);
            continue;
        }

        // Clean existing deals for this biz (to avoid duplicates from previous runs)
        // Only deleting deals that match description/title roughly? 
        // Or just wipe all for these 5 to be safe and clean?
        // Let's wipe all for this business to ensure we have exactly what we want.
        await supabase.from('deals').delete().eq('business_id', biz.id);

        // Insert
        const { error } = await supabase.from('deals').insert({
            business_id: biz.id,
            title: item.title,
            description: item.description,
            deal_type: item.deal_type,
            days_active: item.days_active,
            start_time: item.start_time,
            end_time: item.end_time,
            is_active: true
        });

        if (error) console.error(`Error inserting for ${item.slug}:`, error);
        else console.log(`Inserted ${item.title} for ${item.slug}`);
    }

    // Re-insert the known MarketPlace ones if they were deleted?
    // The loop above deletes ALL for the slug.
    // I should add the known ones to the array.
}

// Add the known ones back to the array before running
DEALS_DATA.push(
    {
        slug: 'marketplace-grill',
        title: 'Double Rewards Points',
        description: 'Earn double rewards points on purchases.',
        deal_type: 'discount', // Generic
        days_active: ['Monday'],
        start_time: null,
        end_time: null
    },
    {
        slug: 'marketplace-grill',
        title: 'Kids Eat Free',
        description: 'Kids 12 and under eat free with adult entree.',
        deal_type: 'discount',
        days_active: ['Tuesday'],
        start_time: '16:00', // Usually dinner
        end_time: null
    }
);

seedComprehensiveDeals();
