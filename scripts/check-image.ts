
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkImage() {
    if (!supabaseUrl || !supabaseKey) { return; }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Using the known slug from previous context
    const slug = 'weekend-entertainment-roundup-for-december-4-2025-little-rock-public-radio-oxcaz8';
    console.log(`Checking image for slug: ${slug}`);

    const { data, error } = await supabase
        .from('events')
        .select('id, title, image_url')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Event Data:', data);
        if (data?.image_url) {
            console.log('Image URL found. Testing accessibility...');
            try {
                const check = await fetch(data.image_url, { method: 'HEAD' });
                console.log(`URL Status: ${check.status} ${check.statusText}`);
            } catch (e) {
                console.error('URL Check Failed:', e);
            }
        } else {
            console.log('❌ Image URL is NULL or EMPTY.');
        }
    }
}

checkImage();
