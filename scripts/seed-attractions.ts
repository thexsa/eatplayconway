
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ATTRACTIONS = [
    {
        name: 'Share the Love Kidsclub',
        description: 'An indoor playground and party venue designed for children to play, learn, and grow in a safe and fun environment.',
        address: 'Conway, AR', // Need specific address if known, defaulting to generic
        category: 'arts_entertainment',
        slug: 'share-the-love-kidsclub',
        website_url: 'https://sharethelove.fun'
    },
    {
        name: 'Cadron Settlement Park',
        description: 'Historic park featuring hiking trails, picnic areas, a boat launch, and the Blockhouse reconstruction overlooking the Arkansas River.',
        address: '6200 Hwy 319 W, Conway, AR 72032',
        category: 'park',
        slug: 'cadron-settlement-park',
        website_url: 'https://www.conwayarkansas.org'
    },
    {
        name: 'Beaverfork Park Lake',
        description: 'Popular recreational area offering swimming, boating, fishing, disc golf, and picnic pavilions on the shores of Lake Beaverfork.',
        address: '20 Kinley Dr, Conway, AR 72032',
        category: 'park',
        slug: 'beaverfork-park-lake',
        website_url: 'https://conwayparks.com'
    },
    {
        name: 'Laurel Park',
        description: 'Community park featuring a splash pad, large playground, tennis courts, walking trail, and picnic facilities.',
        address: '2310 Robinson Ave, Conway, AR 72034',
        category: 'park',
        slug: 'laurel-park',
        website_url: 'https://conwayparks.com'
    },
    {
        name: 'Gatling Park',
        description: 'Neighborhood park with playground equipment and open green space for outdoor activities.',
        address: 'Conway, AR',
        category: 'park',
        slug: 'gatling-park',
        website_url: 'https://conwayparks.com'
    },
    {
        name: 'Hendrix Creek Preserve',
        description: 'A 18-acre nature preserve with walking trails, outdoor classroom, and diverse ecosystem located on the Hendrix College campus.',
        address: 'Conway, AR 72032',
        category: 'park',
        slug: 'hendrix-creek-preserve',
        website_url: 'https://www.hendrix.edu'
    },
    {
        name: 'Baum Gallery',
        description: 'An educational art museum at the University of Central Arkansas featuring rotating exhibitions of national and international art.',
        address: '201 Donaghey Ave, Conway, AR 72035',
        category: 'arts_entertainment',
        slug: 'baum-gallery',
        website_url: 'https://uca.edu/art/baum/'
    }
];

async function seedAttractions() {
    console.log(`Seeding ${ATTRACTIONS.length} attractions...`);

    for (const venue of ATTRACTIONS) {
        const { error } = await supabase
            .from('businesses')
            .upsert({
                name: venue.name,
                slug: venue.slug,
                description: venue.description,
                address: venue.address,
                category: venue.category,
                website_url: venue.website_url,
                subscription_tier: 'free'
            }, { onConflict: 'slug' });

        if (error) {
            console.error(`Error seeding ${venue.name}:`, error);
        } else {
            console.log(`Seeded: ${venue.name}`);
        }
    }
    console.log('Done.');
}

seedAttractions();
