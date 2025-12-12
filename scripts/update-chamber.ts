
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function updateChamberSource() {
    // Correct URL found via browser/search
    const NEW_URL = "https://www.conwaychamber.org/events";

    const { data: source } = await supabase
        .from('scrape_sources')
        .select('*')
        .ilike('name', '%Chamber of Commerce%')
        .single();

    if (!source) {
        console.error('Source not found!');
        return;
    }

    console.log(`Updating ${source.name} from "${source.source_url}" to "${NEW_URL}"`);

    // Update
    const { error } = await supabase
        .from('scrape_sources')
        .update({ source_url: NEW_URL })
        .eq('id', source.id);

    if (error) console.error('Error updating:', error);
    else console.log('Update success.');
}

updateChamberSource();
