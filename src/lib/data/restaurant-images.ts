
export const RESTAURANT_IMAGES: Record<string, string> = {
    // Custom Generated Images
    'stobys-restaurant': '/images/eat/stobys_conway_1765604974931.png',
    'mikes-place': '/images/eat/mikes_place_conway_1765604990879.png',
    'pasta-grill': '/images/eat/pasta_grill_conway_1765605005261.png',
    'the-rogue-roundabout': '/images/eat/rogue_roundabout_conway_1765605020629.png',
    'marketplace-grill': '/images/eat/market_place_grill_conway_1765605039181.png',
    'portofino-italian-restaurant': '/images/eat/portofino_italian_conway_1765605073215.png',
    'taj-mahal-indian-kitchen': '/images/eat/taj_mahal_indian_conway_1765605094918.png',
    'seven-oaks-steak-and-seafood': '/images/eat/seven_oaks_steak_conway_1765605112504.png',
    'bulgogi-korean-bbq': '/images/eat/bulgogi_korean_bbq_conway_1765605131163.png',
    'whole-hog-cafe-conway': '/images/eat/whole_hog_cafe_conway_1765605153480.png',
    'umami-sushi-lounge': '/images/eat/umami_sushi_conway_1765605170530.png',
    'big-bad-breakfast-conway': '/images/eat/big_bad_breakfast_conway_retry_1765605207695.png',
    'brick-and-forge-taproom': '/images/eat/brick_and_forge_conway_1765605207293.png',

    // Unsplash Fallbacks (Unique per category/venue)
    'brick-and-forge-taproom-fallback': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', // Pizza/Beer
    'los-3-potrillos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', // Mexican
    'cross-creek-sandwich-shop': 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?auto=format&fit=crop&w=800&q=80', // Sandwich
    'davids-burgers-conway': 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80', // Burger
    'the-mighty-crab-conway': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80', // Seafood Boil
    'verona-italian-restaurant': 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80', // Italian Pasta
    'tazikis-mediterranean-cafe': 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=800&q=80', // Mediterranean
    'hollys-country-cookin': 'https://images.unsplash.com/photo-1504973960431-1c46b8451d67?auto=format&fit=crop&w=800&q=80', // Comfort Food
    'tacos-4-life-conway': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80', // Tacos
    'xen-thai-and-ramen': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', // Ramen/Thai
    'pias-ristorante-italiano': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80', // Italian
    'the-magic-food-bus': 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=800&q=80', // Food Truck/Fun
    'walk-ons-sports-bistreaux': 'https://images.unsplash.com/photo-1615887023516-9b6c50f8c381?auto=format&fit=crop&w=800&q=80', // Sports Bar
};

export function getRestaurantImage(slug: string): string {
    if (RESTAURANT_IMAGES[slug]) {
        return RESTAURANT_IMAGES[slug];
    }
    // Generic fallback if slug not found
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
}
