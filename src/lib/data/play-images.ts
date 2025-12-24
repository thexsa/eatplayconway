
export const PLAY_IMAGES: Record<string, string> = {
    // Local / Generated Images
    'conway-family-bowl': '/images/play/conway-family-bowl.jpg',
    'action-jacks-conway': '/images/play/action-jacks-conway.png',
    'urban-air-conway': '/images/play/urban-air-conway.png',
    'home-depot-conway-classes': '/images/play/home-depot-conway-classes.jpg',
    'painting-with-a-twist-conway': '/images/play/painting-with-a-twist-conway.jpg',

    // New Attractions (Specific Local/Generated)
    'cadron-settlement-park': '/images/play/cadron_settlement_park.png',
    'beaverfork-park-lake': '/images/play/beaverfork_lake_park.png',
    'laurel-park': '/images/play/laurel_park.png',
    'baum-gallery': '/images/play/baum_gallery.png',
    'hendrix-creek-preserve': '/images/play/hendrix_creek_preserve.png',

    // Specific Unsplash Fallbacks (Authentic Feel)
    'share-the-love-kidsclub': '/images/play/share_the_love_kidsclub.png',
    'gatling-park': '/images/play/gatling_park.png',
};

export function getPlayImage(slug: string): string {
    if (PLAY_IMAGES[slug]) {
        return PLAY_IMAGES[slug];
    }

    // Fallbacks based on keywords if exact match missing
    if (slug.includes('park')) return 'https://images.unsplash.com/photo-1496034663057-6245f11be593?auto=format&fit=crop&w=800&q=80'; // Generic Park
    if (slug.includes('gallery') || slug.includes('museum')) return 'https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&w=800&q=80'; // Art
    if (slug.includes('bowl')) return '/images/play/conway-family-bowl.jpg';

    return '/images/play/conway-family-bowl.jpg'; // Ultimate Fallback
}
