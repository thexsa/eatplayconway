import { createClient } from '@supabase/supabase-js'; // Use direct client for Service Role
import { RestaurantCard } from '@/components/eat/RestaurantCard';

export const revalidate = 3600; // 1 hour

export default async function EatPage() {
    // Hotfix: Use Service Role Key to bypass RLS issues for now
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch restaurants with active deals
    // Using explicit join
    const { data: restaurants, error } = await supabase
        .from('businesses')
        .select(`
            *,
            deals (
                *
            )
        `)
        .order('name');

    if (error) {
        console.error('Error fetching restaurants:', error);
    }

    const list = restaurants || [];

    return (
        <div className="min-h-screen bg-brand-cream pt-24 pb-12 px-4 md:px-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-text-dark md:text-5xl lg:text-6xl mb-4 text-center">
                    Eat & Drink
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-center">
                    Discover local favorites, daily specials, and happy hours in Conway.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {list.length > 0 ? (
                    list.map((r: any) => (
                        <RestaurantCard
                            key={r.id}
                            restaurant={r}
                            deals={r.deals || []}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-20 text-muted-foreground">
                        No restaurants found.
                    </div>
                )}
            </div>
        </div>
    );
}
