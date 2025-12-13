
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ROGUE_SLUG = 'the-rogue-roundabout';

async function seedRogueSpecials() {
    console.log(`--- Seeding Rogue Roundabout Service Specials ---`);

    // Get Business ID
    const { data: biz } = await supabase.from('businesses').select('id').eq('slug', ROGUE_SLUG).single();
    if (!biz) {
        console.error('Rogue Roundabout not found');
        return;
    }

    // New "Service" Specials based on user screenshot
    const newDeals = [
        {
            business_id: biz.id,
            title: 'Weekend Brunch',
            description: 'Saturday & Sunday | 9AM - 3PM',
            deal_type: 'food',
            days_active: ['Saturday', 'Sunday'],
            start_time: '09:00',
            end_time: '15:00',
            is_active: true
        },
        {
            business_id: biz.id,
            title: 'Lunch Service',
            description: 'Tuesday - Saturday | 11AM - 4PM',
            deal_type: 'food',
            days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            start_time: '11:00',
            end_time: '16:00',
            is_active: true
        },
        {
            business_id: biz.id,
            title: 'Dinner Service',
            description: 'Tuesday - Saturday | 4PM - Close',
            deal_type: 'food',
            days_active: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            start_time: '16:00',
            end_time: '22:00', // Assuming close is around 10 based on hours
            is_active: true
        }
    ];

    // Delete existing standard "Lunch Combos" if strictly replacing, or just append?
    // User said "missing these", implying add them. 
    // I will add them.

    const { error } = await supabase.from('deals').insert(newDeals);

    if (error) {
        console.error('Error seeding Rogue:', error);
    } else {
        console.log('Success: Added Rogue Brunch/Lunch/Dinner specials.');
    }
}

seedRogueSpecials();
