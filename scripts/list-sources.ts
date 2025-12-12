
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function listSources() {
    const { data: sources, error } = await supabase
        .from('scrape_sources')
        .select('id, source_url, source_type, is_active')

    if (error) {
        console.error(error)
        return
    }

    console.log('Active Sources:')
    sources.forEach(s => {
        console.log(`[${s.id}] (${s.is_active ? 'ACTIVE' : 'INACTIVE'}) ${s.source_url} (${s.source_type})`)
    })
}

listSources()
