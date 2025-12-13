
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

async function clearSevenOaksMenu() {
    console.log(`--- Clearing ${SEVEN_OAKS_SLUG} menu URL (Official is broken) ---`)

    // Explicitly set to null
    const { error } = await supabase
        .from('businesses')
        .update({ menu_url: null })
        .eq('slug', SEVEN_OAKS_SLUG)

    if (error) {
        console.error('Error updating:', error)
    } else {
        console.log(`Success: Cleared menu_url`)
    }
}

clearSevenOaksMenu()
