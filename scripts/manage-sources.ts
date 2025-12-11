
import dotenv from 'dotenv'
import path from 'path'

// Load env BEFORE importing supabase
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function manageSources() {
    // 1. List
    const { data: sources, error } = await supabase
        .from('scrape_sources')
        .select('id, name, source_url, source_type, is_active')

    if (error) {
        console.error('List Error:', error)
        return
    }

    console.log('--- Current Sources ---')
    sources.forEach(s => {
        console.log(`[${s.id}] ${s.name} (${s.is_active ? 'ACTIVE' : 'INACTIVE'}) - ${s.source_url}`)
    })

    // 2. Identify 'The Conway Daily Sun'
    const sun = sources.find(s => s.name?.toLowerCase().includes('daily sun') || s.source_url?.includes('conwaydailysun'))

    if (sun) {
        console.log(`\nFound Invalid Source: ${sun.name} (${sun.id})`)
        console.log('Disabling...')

        const { error: updateError } = await supabase
            .from('scrape_sources')
            .update({ is_active: false })
            .eq('id', sun.id)

        if (updateError) console.error('Update Error:', updateError)
        else console.log('Successfully DISABLED source.')
    } else {
        console.log('\nConway Daily Sun not found in sources.')
    }
}

manageSources()
