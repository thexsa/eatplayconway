import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function publishSampleEvents() {
    console.log('🚀 Publishing 6 sample events...')

    // Get 6 random draft events
    const { data: events, error: fetchError } = await supabase
        .from('events')
        .select('id, title')
        .eq('status', 'draft')
        .limit(6)

    if (fetchError || !events) {
        console.error('❌ Error fetching drafts:', fetchError)
        return
    }

    // Update them to published
    for (const event of events) {
        const { error: updateError } = await supabase
            .from('events')
            .update({ status: 'published' })
            .eq('id', event.id)

        if (updateError) {
            console.error(`❌ Failed to publish ${event.title}`)
        } else {
            console.log(`✅ Published: ${event.title}`)
        }
    }
}

publishSampleEvents()
