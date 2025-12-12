
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkNewsImages() {
    const { data: news, error } = await supabase
        .from('events')
        .select('title, description_raw, created_at, categories')
        .contains('categories', ['News']) // Only show news
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) console.error('Query Error:', error);

    console.log(`Found ${news?.length} recent events`)
    news?.forEach(n => {
        console.log(`Title: ${n.title}`)
        // Extract link from description if possible
        const linkMatch = n.description_raw?.match(/Source: (https?:\/\/[^\s]+)/);
        console.log(`Source: ${linkMatch ? linkMatch[1] : 'N/A'}`)
        console.log('---')
    })
}

checkNewsImages()


