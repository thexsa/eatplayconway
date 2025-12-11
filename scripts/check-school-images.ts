
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkSchoolImages() {
    const { data: events } = await supabase
        .from('events')
        .select('title, image_url, source_id')
        .ilike('description_raw', '%thrillshare%') // or some other identifier for schools
        // Actually, let's just look at the last 10 inserted events
        .order('created_at', { ascending: false })
        .limit(20)

    console.log('Recent Events Images:')
    events?.forEach(e => {
        console.log(`[${e.title.substring(0, 30)}...] IMG: ${e.image_url}`)
    })
}

checkSchoolImages()
