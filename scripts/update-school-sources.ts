
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CHS_ICS = 'https://thrillshare-cmsv2.services.thrillshare.com/api/v4/o/17714/cms/events/generate_ical?filter_ids&section_ids'
const CJHS_ICS = 'https://thrillshare-cmsv2.services.thrillshare.com/api/v4/o/17712/cms/events/generate_ical?filter_ids&section_ids'

async function updateSources() {
    // Update CHS
    // We search by original URL substring
    const { data: chs } = await supabase.from('scrape_sources').select('id').ilike('source_url', '%chs/events%').single()
    if (chs) {
        console.log(`Updating CHS Source (${chs.id})...`)
        await supabase.from('scrape_sources').update({
            source_url: CHS_ICS,
            source_type: 'calendar',
            is_active: true
        }).eq('id', chs.id)
    } else {
        console.log('CHS Source not found via ilike')
    }

    // Update CJHS
    const { data: cjhs } = await supabase.from('scrape_sources').select('id').ilike('source_url', '%cjhs/events%').single()
    if (cjhs) {
        console.log(`Updating CJHS Source (${cjhs.id})...`)
        await supabase.from('scrape_sources').update({
            source_url: CJHS_ICS,
            source_type: 'calendar',
            is_active: true
        }).eq('id', cjhs.id)
    } else {
        console.log('CJHS Source not found via ilike')
    }

    // Ensure Conway Chamber is active
    const { data: chamber } = await supabase.from('scrape_sources').select('id').ilike('source_url', '%conwayarkansas.org%').single()
    if (chamber) {
        console.log(`Ensuring Chamber Source (${chamber.id}) is active...`)
        await supabase.from('scrape_sources').update({ is_active: true }).eq('id', chamber.id)
    }
}

updateSources()
