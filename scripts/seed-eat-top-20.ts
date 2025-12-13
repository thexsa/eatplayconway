
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to construct service specials
const makeServiceSpecial = (title: string, desc: string, days: string[], start: string, end: string) => ({
    title,
    description: desc,
    deal_type: 'food',
    days_active: days,
    start_time: start,
    end_time: end,
    is_active: true
});

const TOP_20_DATA = [
    // 1. Mike's Place
    {
        name: "Mike's Place",
        slug: "mikes-place",
        description: "New Orleans style restaurant with a Deep South atmosphere. Featuring steaks, seafood, and Cajun favorites in an upscale yet inviting setting.",
        address: "808 Front St, Conway, AR 72032",
        website_url: "https://mikesplaceconway.com",
        menu_url: "https://mikesplaceconway.com/dinner-menu/",
        category: "restaurant",
        hours: {
            "Monday": "11:00 AM - 9:00 PM",
            "Tuesday": "11:00 AM - 9:00 PM",
            "Wednesday": "11:00 AM - 9:00 PM",
            "Thursday": "11:00 AM - 9:00 PM",
            "Friday": "11:00 AM - 10:00 PM",
            "Saturday": "11:00 AM - 10:00 PM",
            "Sunday": "11:00 AM - 8:30 PM"
        },
        deals: [
            makeServiceSpecial("Lunch Service", "Daily Lunch Specials | 11AM - 4PM", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "11:00", "16:00"),
            makeServiceSpecial("Dinner Service", "Steaks, Seafood & Cajun | 4PM - Close", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "16:00", "22:00")
        ]
    },
    // 2. Stoby's Restaurant
    {
        name: "Stoby's Restaurant",
        slug: "stobys-restaurant",
        description: "A Conway staple famous for their Cheese Dip, breakfast burritos, and extensive sandwich menu. A local favorite for decades.",
        address: "805 Donaghey Ave, Conway, AR 72034",
        website_url: "https://stobys.com",
        menu_url: null, // "Add your menu" fallback
        category: "restaurant",
        hours: {
            "Monday": "6:00 AM - 9:00 PM",
            "Tuesday": "6:00 AM - 9:00 PM",
            "Wednesday": "6:00 AM - 9:00 PM",
            "Thursday": "6:00 AM - 9:00 PM",
            "Friday": "6:00 AM - 9:00 PM",
            "Saturday": "6:00 AM - 9:00 PM",
            "Sunday": "Closed"
        },
        deals: [
            makeServiceSpecial("Breakfast Served", "Famous Breakfast Burritos & More | 6AM - 11AM", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "06:00", "11:00"),
            makeServiceSpecial("Saturday Breakfast", "Extended Weekend Breakfast | 6AM - Noon", ["Saturday"], "06:00", "12:00"),
            makeServiceSpecial("Lunch & Dinner", "Sandwiches, Burgers & The Cheese Dip", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "11:00", "21:00")
        ]
    },
    // 3. Pasta Grill
    {
        name: "Pasta Grill",
        slug: "pasta-grill",
        description: "Upscale casual Italian dining in downtown Conway. Known for fresh pasta dishes, steaks, and a romantic atmosphere.",
        address: "915 Front St, Conway, AR 72032",
        website_url: "https://pastagrillrestaurant.com",
        menu_url: "https://pastagrillrestaurant.com/dinner-menu/",
        category: "restaurant",
        hours: {
            "Monday": "11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM",
            "Tuesday": "11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM",
            "Wednesday": "11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM",
            "Thursday": "11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM",
            "Friday": "11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM",
            "Saturday": "11:00 AM - 2:00 PM, 5:00 PM - 9:00 PM",
            "Sunday": "Closed"
        },
        deals: [
            makeServiceSpecial("Lunch Specials", "Portioned Pastas & Salad | 11AM - 2PM", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "11:00", "14:00"),
            makeServiceSpecial("Dinner Service", "Full Italian Dinner Menu | 5PM - Close", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "17:00", "21:00")
        ]
    },
    // 4. Taj Mahal
    {
        name: "Taj Mahal Indian Kitchen",
        slug: "taj-mahal-indian-kitchen",
        description: "Authentic Indian cuisine right in Conway. Featuring Tandoori dishes, curries, and freshly baked Naan.",
        address: "2235 Dave Ward Dr, Conway, AR 72034",
        website_url: null,
        menu_url: null,
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:00 PM", "Tuesday": "Closed", "Wednesday": "11:00 AM - 9:00 PM", "Thursday": "11:00 AM - 9:00 PM", "Friday": "11:00 AM - 10:00 PM", "Saturday": "11:00 AM - 10:00 PM", "Sunday": "11:00 AM - 9:00 PM" },
        deals: [makeServiceSpecial("Lunch Buffet", "All You Can Eat | 11AM - 2:30PM", ["Monday", "Wednesday", "Thursday", "Friday", "Sunday"], "11:00", "14:30")]
    },
    // 5. Bulgogi Korean BBQ
    {
        name: "Bulgogi Korean BBQ",
        slug: "bulgogi-korean-bbq",
        description: "Modern Korean BBQ featuring rice bowls, noodle dishes, and traditional Korean sides.",
        address: "3200 Dave Ward Dr, Conway, AR 72034",
        website_url: null,
        menu_url: null,
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:00 PM", "Tuesday": "11:00 AM - 9:00 PM", "Wednesday": "11:00 AM - 9:00 PM", "Thursday": "11:00 AM - 9:00 PM", "Friday": "11:00 AM - 9:00 PM", "Saturday": "11:00 AM - 9:00 PM", "Sunday": "Closed" },
        deals: []
    },
    // 6. Whole Hog Cafe
    {
        name: "Whole Hog Cafe",
        slug: "whole-hog-cafe-conway",
        description: "Award-winning barbecue featuring pulled pork, ribs, and beef brisket with a variety of signature sauces.",
        address: "1016 Dave Ward Dr, Conway, AR 72034",
        website_url: "https://wholehogcafe.com",
        menu_url: "https://wholehogcafe.com/menus/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 8:00 PM", "Tuesday": "11:00 AM - 8:00 PM", "Wednesday": "11:00 AM - 8:00 PM", "Thursday": "11:00 AM - 8:00 PM", "Friday": "11:00 AM - 9:00 PM", "Saturday": "11:00 AM - 9:00 PM", "Sunday": "11:00 AM - 3:00 PM" },
        deals: []
    },
    // 7. Umami Sushi
    {
        name: "Umami Sushi Lounge & Grill",
        slug: "umami-sushi-lounge",
        description: "Fusion sushi, hibachi, and Asian cuisine in a modern lounge atmosphere.",
        address: "500 Amity Rd, Conway, AR 72032",
        website_url: "https://umamiconwayar.com",
        menu_url: "https://umamiconwayar.com/menu/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:30 PM", "Tuesday": "11:00 AM - 9:30 PM", "Wednesday": "11:00 AM - 9:30 PM", "Thursday": "11:00 AM - 9:30 PM", "Friday": "11:00 AM - 10:30 PM", "Saturday": "11:00 AM - 10:30 PM", "Sunday": "11:00 AM - 9:00 PM" },
        deals: [makeServiceSpecial("Lunch Special", "Bento Boxes & Sushi Combos | 11AM - 3PM", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "11:00", "15:00")]
    },
    // 8. Brick and Forge
    {
        name: "Brick & Forge Taproom",
        slug: "brick-and-forge-taproom",
        description: "Craft beer and artisan pizza with a focus on house-forged pub fare.",
        address: "1010 Main St, Conway, AR 72032",
        website_url: "https://brickandforge.com",
        menu_url: "https://brickandforge.com/menu/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 10:00 PM", "Tuesday": "11:00 AM - 10:00 PM", "Wednesday": "11:00 AM - 10:00 PM", "Thursday": "11:00 AM - 10:00 PM", "Friday": "11:00 AM - 11:00 PM", "Saturday": "11:00 AM - 11:00 PM", "Sunday": "11:00 AM - 9:00 PM" },
        deals: []
    },
    // 9. Los 3 Potrillos
    {
        name: "Los 3 Potrillos",
        slug: "los-3-potrillos",
        description: "Authentic Mexican cuisine serving tacos, burritos, and traditional platters in a family-friendly setting.",
        address: "2405 Prince St, Conway, AR 72034",
        website_url: null,
        menu_url: null,
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:00 PM", "Tuesday": "11:00 AM - 9:00 PM", "Wednesday": "11:00 AM - 9:00 PM", "Thursday": "11:00 AM - 9:00 PM", "Friday": "11:00 AM - 10:00 PM", "Saturday": "11:00 AM - 10:00 PM", "Sunday": "11:00 AM - 9:00 PM" },
        deals: []
    },
    // 10. Holly's Country Cookin'
    {
        name: "Holly's Country Cookin'",
        slug: "hollys-country-cookin",
        description: "Classic Southern buffet and home-style cooking featuring fried chicken and daily specials.",
        address: "116 Harkrider St, Conway, AR 72032",
        website_url: "https://www.facebook.com/HollysCountryCookin/",
        menu_url: null,
        category: "restaurant",
        hours: { "Monday": "10:30 AM - 2:00 PM", "Tuesday": "10:30 AM - 2:00 PM", "Wednesday": "10:30 AM - 2:00 PM", "Thursday": "10:30 AM - 2:00 PM", "Friday": "10:30 AM - 2:00 PM", "Saturday": "Closed", "Sunday": "10:30 AM - 2:00 PM" },
        deals: [makeServiceSpecial("Lunch Buffet", "All-You-Can-Eat Home Cooking | 10:30AM - 2PM", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"], "10:30", "14:00")]
    },
    // 11. Cross Creek Sandwich Shop
    {
        name: "Cross Creek Sandwich Shop",
        slug: "cross-creek-sandwich-shop",
        description: "Charming sandwich shop offering soups, salads, and freshly baked desserts in a cozy atmosphere.",
        address: "1003 Oak St, Conway, AR 72032",
        website_url: "https://crosscreeksandwichshop.com",
        menu_url: "https://crosscreeksandwichshop.com/menu/",
        category: "restaurant",
        hours: { "Monday": "10:30 AM - 2:30 PM", "Tuesday": "10:30 AM - 2:30 PM", "Wednesday": "10:30 AM - 2:30 PM", "Thursday": "10:30 AM - 2:30 PM", "Friday": "10:30 AM - 2:30 PM", "Saturday": "10:30 AM - 2:30 PM", "Sunday": "Closed" },
        deals: []
    },
    // 12. Tacos 4 Life
    {
        name: "Tacos 4 Life",
        slug: "tacos-4-life-conway",
        description: "Mission-based taco joint serving unique craft tacos. For every meal sold, a meal is donated to a child in need.",
        address: "716 Oak St, Conway, AR 72032",
        website_url: "https://tacos4life.com",
        menu_url: "https://tacos4life.com/menu/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:00 PM", "Tuesday": "11:00 AM - 9:00 PM", "Wednesday": "11:00 AM - 9:00 PM", "Thursday": "11:00 AM - 9:00 PM", "Friday": "11:00 AM - 10:00 PM", "Saturday": "11:00 AM - 10:00 PM", "Sunday": "Closed" },
        deals: []
    },
    // 13. David's Burgers
    {
        name: "David's Burgers",
        slug: "davids-burgers-conway",
        description: "Classic American butcher shop style burgers and endless fries in a retro atmosphere.",
        address: "107 S Broadview St, Conway, AR 72034",
        website_url: "https://davidsburgers.com",
        menu_url: "https://davidsburgers.com/menu/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:00 PM", "Tuesday": "11:00 AM - 9:00 PM", "Wednesday": "11:00 AM - 9:00 PM", "Thursday": "11:00 AM - 9:00 PM", "Friday": "11:00 AM - 9:00 PM", "Saturday": "11:00 AM - 9:00 PM", "Sunday": "Closed" },
        deals: []
    },
    // 14. Xen Thai and Ramen
    {
        name: "Xen Thai and Ramen",
        slug: "xen-thai-and-ramen",
        description: "Offering a mix of authentic Thai dishes and Japanese Ramen in a modern setting.",
        address: "2235 Dave Ward Dr, Conway, AR 72034",
        website_url: "https://xenthairamen.com",
        menu_url: "https://xenthairamen.com/menu",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:00 PM", "Tuesday": "11:00 AM - 9:00 PM", "Wednesday": "11:00 AM - 9:00 PM", "Thursday": "11:00 AM - 9:00 PM", "Friday": "11:00 AM - 9:30 PM", "Saturday": "11:00 AM - 9:30 PM", "Sunday": "11:00 AM - 9:00 PM" },
        deals: []
    },
    // 15. The Mighty Crab
    {
        name: "The Mighty Crab",
        slug: "the-mighty-crab-conway",
        description: "Hands-on seafood boil experience featuring crab legs, shrimp, and cajun seasonings.",
        address: "2235 Dave Ward Dr, Conway, AR 72034",
        website_url: "https://mightycrabconway.com",
        menu_url: "https://mightycrabconway.com/menu",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 10:00 PM", "Tuesday": "11:00 AM - 10:00 PM", "Wednesday": "11:00 AM - 10:00 PM", "Thursday": "11:00 AM - 10:00 PM", "Friday": "11:00 AM - 11:00 PM", "Saturday": "11:00 AM - 11:00 PM", "Sunday": "11:00 AM - 10:00 PM" },
        deals: []
    },
    // 16. Pia's Ristorante Italiano
    {
        name: "Pia's Ristorante Italiano",
        slug: "pias-ristorante-italiano",
        description: "Intimate family-owned spot for traditional Italian pasta, seafood, and desserts.",
        address: "107 S St, Conway, AR 72034",
        website_url: null,
        menu_url: null,
        category: "restaurant",
        hours: { "Monday": "5:00 PM - 9:00 PM", "Tuesday": "5:00 PM - 9:00 PM", "Wednesday": "5:00 PM - 9:00 PM", "Thursday": "5:00 PM - 9:00 PM", "Friday": "5:00 PM - 10:00 PM", "Saturday": "5:00 PM - 10:00 PM", "Sunday": "Closed" },
        deals: []
    },
    // 17. Verona Italian Restaurant
    {
        name: "Verona Italian Restaurant",
        slug: "verona-italian-restaurant",
        description: "Classic Italian eatery serving hearty portions of pasta, pizza, and specialty dishes.",
        address: "810 Elsinger Blvd, Conway, AR 72032",
        website_url: "https://veronaconway.com",
        menu_url: "https://veronaconway.com/menu/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:30 PM", "Tuesday": "11:00 AM - 9:30 PM", "Wednesday": "11:00 AM - 9:30 PM", "Thursday": "11:00 AM - 9:30 PM", "Friday": "11:00 AM - 10:00 PM", "Saturday": "11:00 AM - 10:00 PM", "Sunday": "11:00 AM - 9:00 PM" },
        deals: []
    },
    // 18. The Magic Food Bus
    {
        name: "The Magic Food Bus",
        slug: "the-magic-food-bus",
        description: "Popular food truck turned stationary eatery, known for creative gourmet sandwiches and wraps.",
        address: "804 Skyline Dr, Conway, AR 72032",
        website_url: "https://magicfoodtruck.com",
        menu_url: null,
        category: "restaurant",
        hours: { "Monday": "10:30 AM - 2:00 PM", "Tuesday": "10:30 AM - 2:00 PM", "Wednesday": "10:30 AM - 2:00 PM", "Thursday": "10:30 AM - 2:00 PM", "Friday": "10:30 AM - 2:00 PM", "Saturday": "Closed", "Sunday": "Closed" },
        deals: []
    },
    // 19. Taziki's Mediterranean Cafe
    {
        name: "Taziki's Mediterranean Cafe",
        slug: "tazikis-mediterranean-cafe",
        description: "Fresh, fast-casual Mediterranean serving gyros, salads, and grilled feasts.",
        address: "1090 Skyline Dr, Conway, AR 72032",
        website_url: "https://tazikis.com",
        menu_url: "https://tazikis.com/menu/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 9:00 PM", "Tuesday": "11:00 AM - 9:00 PM", "Wednesday": "11:00 AM - 9:00 PM", "Thursday": "11:00 AM - 9:00 PM", "Friday": "11:00 AM - 9:00 PM", "Saturday": "11:00 AM - 9:00 PM", "Sunday": "11:00 AM - 9:00 PM" },
        deals: []
    },
    // 20. Walk-On's Sports Bistreaux
    {
        name: "Walk-On's Sports Bistreaux",
        slug: "walk-ons-sports-bistreaux",
        description: "Louisiana-inspired sports bar serving burgers, po-boys, and cajun favorites with plenty of TVs.",
        address: "955 S Amity Rd, Conway, AR 72032",
        website_url: "https://walk-ons.com",
        menu_url: "https://walk-ons.com/menu/",
        category: "restaurant",
        hours: { "Monday": "11:00 AM - 10:00 PM", "Tuesday": "11:00 AM - 10:00 PM", "Wednesday": "11:00 AM - 10:00 PM", "Thursday": "11:00 AM - 10:00 PM", "Friday": "11:00 AM - 11:00 PM", "Saturday": "11:00 AM - 11:00 PM", "Sunday": "11:00 AM - 10:00 PM" },
        deals: []
    }
];

// ... (Rest of Top 20 placeholders for brevity in this turn, I will fill them in the file write)

async function seedTop20() {
    console.log('--- SEEDING TOP 20 RESTAURANTS ---');

    for (const data of TOP_20_DATA) {
        console.log(`Processing ${data.name}...`);

        // 1. Upsert Business
        const { data: business, error: bizError } = await supabase
            .from('businesses')
            .upsert({
                slug: data.slug,
                name: data.name,
                description: data.description,
                address: data.address,
                website_url: data.website_url,
                menu_url: data.menu_url,
                category: 'restaurant',
                // is_verified: true, // Column missing in DB
                social_links: { hours: data.hours } // Store hours here
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (bizError) {
            console.error(`Error upserting ${data.slug}:`, bizError);
            continue;
        }

        if (!business) continue;

        // 2. Insert Deals
        if (data.deals && data.deals.length > 0) {
            // Clear existing service specials for idempotency
            const titles = data.deals.map(d => d.title);
            await supabase.from('deals').delete().eq('business_id', business.id).in('title', titles);

            const dealsToInsert = data.deals.map(d => ({
                business_id: business.id,
                ...d
            }));

            const { error: dealsError } = await supabase.from('deals').insert(dealsToInsert);
            if (dealsError) console.error(`Error inserting deals for ${data.slug}:`, dealsError);
        }
    }
}

seedTop20();
