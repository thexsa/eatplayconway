
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SEVEN_OAKS_SLUG = 'seven-oaks-steak-and-seafood'
const FALLBACK_MENU_URL = 'https://www.menuguide.com/Restaurants/seven-oaks-steak-seafood-conway/Menu/1'

async function fixSevenOaksMenu() {
    console.log(`--- Updating ${SEVEN_OAKS_SLUG} menu URL to fallback ---`)

    const { error } = await supabase
        .from('businesses')
        .update({ menu_url: FALLBACK_MENU_URL })
        .eq('slug', SEVEN_OAKS_SLUG)

    if (error) {
        console.error('Error updating:', error)
    } else {
        console.log(`Success: Updated to ${FALLBACK_MENU_URL}`)
    }
}

fixSevenOaksMenu()
