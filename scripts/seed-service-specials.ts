
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SERVICE_SPECIALS = [
    // --- Rogue Roundabout ---
    {
        slug: 'the-rogue-roundabout',
        deals: [
            {
                title: 'Weekend Brunch',
                description: 'Saturday & Sunday | 9AM - 3PM',
                deal_type: 'food',
                days_active: ['Saturday', 'Sunday'],
                start_time: '09:00',
                end_time: '15:00',
                is_active: true
            },
            {
                title: 'Lunch Service',
                description: 'Tuesday - Saturday | 11AM - 4PM',
                deal_type: 'food',
                days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                start_time: '11:00',
                end_time: '16:00',
                is_active: true
            },
            {
                title: 'Dinner Service',
                description: 'Tuesday - Saturday | 4PM - Close',
                deal_type: 'food',
                days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                start_time: '16:00',
                end_time: '22:00',
                is_active: true
            }
        ]
    },
    // --- Big Bad Breakfast ---
    {
        slug: 'big-bad-breakfast-conway',
        deals: [
            {
                title: 'Daily Breakfast & Lunch',
                description: 'Open Daily | 7AM - 2:30PM',
                deal_type: 'food',
                days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                start_time: '07:00',
                end_time: '14:30',
                is_active: true
            },
            {
                title: 'Weekend Brunch',
                description: 'Saturday & Sunday | Specially curated brunch items',
                deal_type: 'food',
                days_active: ['Saturday', 'Sunday'],
                start_time: '07:00',
                end_time: '14:30',
                is_active: true
            }
        ]
    },
    // --- Seven Oaks ---
    {
        slug: 'seven-oaks-steak-and-seafood',
        deals: [
            {
                title: 'Lunch Service',
                description: 'Tuesday - Friday & Sunday | 11AM - 2PM',
                deal_type: 'food',
                days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
                start_time: '11:00',
                end_time: '14:00',
                is_active: true
            },
            {
                title: 'Dinner Service',
                description: 'Tuesday - Saturday | 5PM - Close',
                deal_type: 'food',
                days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                start_time: '17:00',
                end_time: '22:00',
                is_active: true
            }
        ]
    },
    // --- Portofino ---
    {
        slug: 'portofino-italian-restaurant',
        deals: [
            {
                title: 'Lunch Specials',
                description: 'Daily Lunch portions & pricing | 11AM - 3PM',
                deal_type: 'food',
                days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                start_time: '11:00',
                end_time: '15:00',
                is_active: true
            },
            {
                title: 'Dinner Service',
                description: 'Authentic Italian Dinner | 3PM - Close',
                deal_type: 'food',
                days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                start_time: '15:00',
                end_time: '21:00',
                is_active: true
            }
        ]
    },
    // --- Marketplace Grill ---
    {
        slug: 'marketplace-grill',
        deals: [
            {
                title: 'Lunch Menu',
                description: 'Combos, Tacos, Burgers & More | 11AM - 4PM',
                deal_type: 'food',
                days_active: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                start_time: '11:00',
                end_time: '16:00',
                is_active: true
            },
            {
                title: 'Kids Eat Free',
                description: 'Tuesdays | With purchase of adult entree',
                deal_type: 'discount',
                days_active: ['Tuesday'],
                start_time: '11:00',
                end_time: '21:00',
                is_active: true
            }
        ]
    }
];

async function seedServiceSpecials() {
    console.log('--- SEEDING SERVICE SPECIALS ---');

    for (const item of SERVICE_SPECIALS) {
        // Get Business ID
        const { data: biz } = await supabase.from('businesses').select('id').eq('slug', item.slug).single();

        if (!biz) {
            console.error(`Business not found: ${item.slug}`);
            continue;
        }

        console.log(`Updating ${item.slug}...`);

        // We want to add these, not necessarily delete EVERYTHING. 
        // But to avoid duplicates if run multiple times, maybe we should delete "Service" type deals? 
        // Or strictly delete matching titles?
        // Let's delete matching titles to be safe.

        const titles = item.deals.map(d => d.title);
        await supabase.from('deals').delete().eq('business_id', biz.id).in('title', titles);

        // Insert new
        const dealsToInsert = item.deals.map(d => ({
            business_id: biz.id,
            ...d
        }));

        const { error } = await supabase.from('deals').insert(dealsToInsert);

        if (error) {
            console.error(`Error inserting for ${item.slug}:`, error);
        } else {
            console.log(`Success: Added ${item.deals.length} specials.`);
        }
    }
}

seedServiceSpecials();
