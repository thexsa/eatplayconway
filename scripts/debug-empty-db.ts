
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugEvents() {
    // Check total count
    const { count, error: countError } = await supabase.from('events').select('*', { count: 'exact', head: true })
    console.log(`Total Events in DB: ${count} (Error: ${countError?.message})`)

    if (count === 0) return

    // Check sample
    const { data: events } = await supabase.from('events').select('title, status, categories, start_time, ticket_url, image_url').limit(10)

    console.log('\nSample Events:')
    events?.forEach(e => {
        console.log(`- [${e.status}] ${e.title}`)
        console.log(`  Cats: ${e.categories}`)
        console.log(`  Link: ${e.ticket_url}`)
    })

    // Check hidden reasons
    const { count: draftCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'draft')
    console.log(`\nDraft Events: ${draftCount}`)

    const { count: rejectedCount } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'rejected')
    console.log(`Rejected Events: ${rejectedCount}`)
}

debugEvents()
