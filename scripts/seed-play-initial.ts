
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const makeActivity = (title: string, desc: string, days: string[], start: string, end: string) => ({
    title,
    description: desc,
    deal_type: 'special', // Using special logic
    days_active: days,
    start_time: start,
    end_time: end,
    is_active: true
});

const PLAY_DATA = [
    {
        name: "Conway Family Bowl",
        slug: "conway-family-bowl",
        description: "Classic bowling alley offering family fun, league play, and an arcade. Great for birthday parties and casual outings.",
        address: "1010 E Oak St, Conway, AR 72032",
        website_url: "https://www.conwayfamilybowl.com",
        menu_url: null,
        category: "arts_entertainment",
        hours: { "Monday": "12:00 PM - 10:00 PM", "Tuesday": "9:00 AM - 10:00 PM", "Wednesday": "12:00 PM - 10:00 PM", "Thursday": "12:00 PM - 10:00 PM", "Friday": "12:00 PM - 12:00 AM", "Saturday": "9:00 AM - 12:00 AM", "Sunday": "1:00 PM - 9:00 PM" },
        deals: [
            makeActivity("Cosmic Bowling", "Glow in the dark bowling fun | Fri & Sat Nights", ["Friday", "Saturday"], "20:00", "23:59")
        ]
    },
    {
        name: "Action Jacks",
        slug: "action-jacks-conway",
        description: "Premier entertainment center with axe throwing, laser tag, and expansive arcade games.",
        address: "1655 E Oak St, Conway, AR 72032",
        website_url: "https://www.actionjacksconway.com",
        menu_url: null,
        category: "arts_entertainment",
        hours: { "Monday": "Closed", "Tuesday": "Closed", "Wednesday": "4:00 PM - 9:00 PM", "Thursday": "4:00 PM - 9:00 PM", "Friday": "4:00 PM - 11:00 PM", "Saturday": "12:00 PM - 11:00 PM", "Sunday": "1:00 PM - 8:00 PM" },
        deals: []
    },
    {
        name: "Urban Air Adventure Park",
        slug: "urban-air-conway",
        description: "Large indoor trampoline park with obstacle courses, dodgeball, and climbing walls.",
        address: "201 S Amity Rd, Conway, AR 72032",
        website_url: "https://www.urbanair.com/arkansas-conway/",
        menu_url: null,
        category: "arts_entertainment",
        hours: { "Monday": "4:00 PM - 8:00 PM", "Tuesday": "4:00 PM - 8:00 PM", "Wednesday": "4:00 PM - 8:00 PM", "Thursday": "4:00 PM - 8:00 PM", "Friday": "4:00 PM - 9:00 PM", "Saturday": "10:00 AM - 9:00 PM", "Sunday": "12:00 PM - 8:00 PM" },
        deals: []
    },
    {
        name: "Jack's Ultra Sports",
        slug: "jacks-ultra-sports",
        description: "Indoor paintball, laser tag, escape rooms, and archery tag facility.",
        address: "655 Equity Ave, Conway, AR 72032",
        website_url: "https://www.jacksultrasports.com",
        menu_url: null,
        category: "arts_entertainment",
        hours: { "Monday": "Closed", "Tuesday": "Closed", "Wednesday": "Closed", "Thursday": "4:00 PM - 8:00 PM", "Friday": "4:00 PM - 9:00 PM", "Saturday": "11:00 AM - 9:00 PM", "Sunday": "1:00 PM - 6:00 PM" },
        deals: []
    },
    {
        name: "Home Depot Classes",
        slug: "home-depot-conway-classes",
        description: "Weekly workshops for DIYers and kids. Learn to build, paint, and create.",
        address: "500 Elsinger Blvd, Conway, AR 72032",
        website_url: "https://www.homedepot.com/l/Conway-AR/AR/Conway/72032/1402",
        menu_url: null,
        category: "retail", // Special classification
        hours: { "Monday": "6:00 AM - 10:00 PM", "Tuesday": "6:00 AM - 10:00 PM", "Wednesday": "6:00 AM - 10:00 PM", "Thursday": "6:00 AM - 10:00 PM", "Friday": "6:00 AM - 10:00 PM", "Saturday": "6:00 AM - 10:00 PM", "Sunday": "8:00 AM - 8:00 PM" },
        deals: [
            makeActivity("Kids Workshop", "Free building workshop for kids (First Sat of Month)", ["Saturday"], "09:00", "12:00")
        ]
    },
    {
        name: "Painting with a Twist",
        slug: "painting-with-a-twist-conway",
        description: "Sip, paint, and relax. Guided painting classes for adults and families.",
        address: "411 Oak St, Conway, AR 72032",
        website_url: "https://www.paintingwithatwist.com/studio/conway/",
        menu_url: null,
        category: "arts_entertainment",
        hours: { "Monday": "12:00 PM - 5:00 PM", "Tuesday": "12:00 PM - 5:00 PM", "Wednesday": "12:00 PM - 5:00 PM", "Thursday": "12:00 PM - 5:00 PM", "Friday": "12:00 PM - 5:00 PM", "Saturday": "12:00 PM - 5:00 PM", "Sunday": "Closed" }, // Office hours, classes vary
        deals: []
    }
];

async function seedPlay() {
    console.log('--- SEEDING PLAY SECTION ---');

    for (const data of PLAY_DATA) {
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
                category: data.category as any,
                social_links: { hours: data.hours }
            }, { onConflict: 'slug' })
            .select()
            .single();

        if (bizError) {
            console.error(`Error upserting ${data.slug}:`, bizError);
            continue;
        }

        if (!business) continue;

        // 2. Insert Activities (as Deals)
        if (data.deals && data.deals.length > 0) {
            const titles = data.deals.map(d => d.title);
            await supabase.from('deals').delete().eq('business_id', business.id).in('title', titles);

            const dealsToInsert = data.deals.map(d => ({
                business_id: business.id,
                ...d
            }));

            const { error: dealsError } = await supabase.from('deals').insert(dealsToInsert);
            if (dealsError) console.error(`Error inserting activities for ${data.slug}:`, dealsError);
        }
    }
}

seedPlay();
