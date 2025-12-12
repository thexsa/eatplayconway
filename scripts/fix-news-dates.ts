
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function fixNewsDates() {
    console.log('Fetching News items...');

    // Get all items tagged as News OR from News sources generally
    // (Actually simpler to check all "events" that are in the future but look like news title-wise or category-wise)
    // Or just check strictly categories='News'

    // Note: categories is jsonb array.
    const { data: items, error } = await supabase
        .from('events')
        .select('*')
        .contains('categories', ['News'])
        .gt('start_time', new Date().toISOString()); // Only future ones

    if (!items || items.length === 0) {
        console.log('No future news found.');
        return;
    }

    console.log(`Found ${items.length} future news items.`);

    const updates: any[] = [];

    for (const item of items) {
        // Shift back 1 year
        const oldDate = new Date(item.start_time);
        const newDate = new Date(oldDate);
        newDate.setFullYear(newDate.getFullYear() - 1);

        console.log(`Fixing: "${item.title}"`);
        console.log(`  ${oldDate.toISOString()} -> ${newDate.toISOString()}`);

        // Update immediately
        const { error: updateError } = await supabase
            .from('events')
            .update({
                start_time: newDate.toISOString(),
                end_time: item.end_time ? new Date(new Date(item.end_time).setFullYear(new Date(item.end_time).getFullYear() - 1)).toISOString() : null
            })
            .eq('id', item.id);

        if (updateError) {
            console.error(`Failed to update ${item.title}:`, updateError);
        } else {
            console.log(`Updated ${item.title}`);
        }
    }
}

fixNewsDates();

