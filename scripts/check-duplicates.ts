
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function findDuplicateImages() {
    const { data: events } = await supabase
        .from('events')
        .select('image_url, title')
        .not('image_url', 'is', null)
        .limit(100);

    const counts: Record<string, number> = {};
    const examples: Record<string, string> = {};

    events?.forEach(e => {
        if (!e.image_url) return;
        counts[e.image_url] = (counts[e.image_url] || 0) + 1;
        examples[e.image_url] = e.title;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    console.log('Top Duplicate Images:');
    entries.slice(0, 5).forEach(([url, count]) => {
        console.log(`[${count}x] ${url} (e.g. ${examples[url]})`);
    });
}

findDuplicateImages();
