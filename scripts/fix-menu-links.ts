
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MENU_UPDATES = [
    {
        slug: 'seven-oaks-steak-and-seafood',
        menu_url: 'https://www.sevenoakssteakandseafood.com/menus-3'
    },
    {
        slug: 'the-rogue-roundabout',
        menu_url: 'https://www.therogueroundabout.com/menus-updated'
    },
    {
        slug: 'big-bad-breakfast-conway',
        menu_url: 'https://bigbadbreakfast.com/locations/conway/'
    },
    {
        slug: 'portofino-italian-restaurant',
        menu_url: 'http://www.portofinoconway.com/menu'
    },
    {
        slug: 'marketplace-grill',
        menu_url: 'https://marketplacegrill.com/menu/'
    }
]

async function fixMenuLinks() {
    console.log('--- FIXING MENU LINKS ---')

    for (const update of MENU_UPDATES) {
        console.log(`Updating ${update.slug}...`)
        const { error } = await supabase
            .from('businesses')
            .update({ menu_url: update.menu_url })
            .eq('slug', update.slug)

        if (error) {
            console.error(`Error updating ${update.slug}:`, error)
        } else {
            console.log(`Success: ${update.menu_url}`)
        }
    }
}

fixMenuLinks()
