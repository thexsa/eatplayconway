
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function updateActionJacks() {
    console.log('Updating Action Jack\'s details...');

    const hours = {
        "Monday": null,
        "Tuesday": "11:00 AM – 9:00 PM",
        "Wednesday": "11:00 AM – 9:00 PM",
        "Thursday": "11:00 AM – 9:00 PM",
        "Friday": "11:00 AM – 10:00 PM",
        "Saturday": "11:00 AM – 10:00 PM",
        "Sunday": "12:00 PM – 8:00 PM"
    };

    const { error } = await supabase
        .from('businesses')
        .update({
            address: '655 Equity Ave, Conway, AR 72032',
            website_url: 'https://actionjacksarkansas.com/',
            social_links: { hours } // Storing hours where the component expects them
        })
        .eq('slug', 'action-jacks-conway');

    if (error) {
        console.error('Error updating Action Jack\'s:', error);
    } else {
        console.log('Successfully updated Action Jack\'s info.');
    }
}

updateActionJacks();
