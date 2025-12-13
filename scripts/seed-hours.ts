
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const HOURS_DATA = [
    {
        slug: 'the-rogue-roundabout',
        hours: {
            "Monday": "Closed",
            "Tuesday": "4:00 PM - 9:00 PM",
            "Wednesday": "4:00 PM - 9:00 PM",
            "Thursday": "4:00 PM - 9:00 PM",
            "Friday": "4:00 PM - 10:00 PM",
            "Saturday": "11:00 AM - 10:00 PM",
            "Sunday": "10:00 AM - 2:00 PM"
        }
    },
    {
        slug: 'big-bad-breakfast-conway',
        hours: {
            "Monday": "7:00 AM - 2:30 PM",
            "Tuesday": "7:00 AM - 2:30 PM",
            "Wednesday": "7:00 AM - 2:30 PM",
            "Thursday": "7:00 AM - 2:30 PM",
            "Friday": "7:00 AM - 2:30 PM",
            "Saturday": "7:00 AM - 2:30 PM",
            "Sunday": "7:00 AM - 2:30 PM"
        }
    },
    {
        slug: 'seven-oaks-steak-and-seafood',
        hours: {
            "Monday": "Closed",
            "Tuesday": "4:00 PM - 9:00 PM",
            "Wednesday": "4:00 PM - 9:00 PM",
            "Thursday": "4:00 PM - 9:00 PM",
            "Friday": "4:00 PM - 10:00 PM",
            "Saturday": "4:00 PM - 10:00 PM",
            "Sunday": "Closed"
        }
    },
    {
        slug: 'portofino-italian-restaurant',
        hours: {
            "Monday": "11:00 AM - 9:00 PM",
            "Tuesday": "11:00 AM - 9:00 PM",
            "Wednesday": "11:00 AM - 9:00 PM",
            "Thursday": "11:00 AM - 9:00 PM",
            "Friday": "11:00 AM - 10:00 PM",
            "Saturday": "11:00 AM - 10:00 PM",
            "Sunday": "11:00 AM - 9:00 PM"
        }
    },
    {
        slug: 'marketplace-grill',
        hours: {
            "Monday": "11:00 AM - 9:00 PM",
            "Tuesday": "11:00 AM - 9:00 PM",
            "Wednesday": "11:00 AM - 9:00 PM",
            "Thursday": "11:00 AM - 9:00 PM",
            "Friday": "11:00 AM - 10:00 PM",
            "Saturday": "11:00 AM - 10:00 PM",
            "Sunday": "11:00 AM - 9:00 PM"
        }
    }
]

async function seedHours() {
    console.log('--- SEEDING HOURS ---')

    for (const item of HOURS_DATA) {
        console.log(`Updating hours for ${item.slug}...`)

        // Find business and current social_links
        const { data: businesses, error: fetchError } = await supabase
            .from('businesses')
            .select('id, social_links')
            .eq('slug', item.slug)
            .single();

        if (fetchError || !businesses) {
            console.error(`Business ${item.slug} not found or error`, fetchError)
            continue;
        }

        const currentLinks = (businesses.social_links as Record<string, any>) || {};
        const updatedLinks = {
            ...currentLinks,
            hours: item.hours
        };

        const { error } = await supabase
            .from('businesses')
            .update({ social_links: updatedLinks })
            .eq('id', businesses.id)

        if (error) {
            console.error(`Error updating ${item.slug}:`, error)
        } else {
            console.log(`Success ${item.slug}`)
        }
    }
}

seedHours()
