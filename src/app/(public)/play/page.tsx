
import { createClient } from '@/utils/supabase/server';
import { RestaurantCard } from '@/components/eat/RestaurantCard';

export const revalidate = 3600; // 1 hour

export default async function PlayPage() {
    const supabase = await createClient();

    // Fetch entertainment venues
    // Categorizing as 'arts_entertainment' or 'retail' (for workshops like Home Depot)
    const { data: venues, error } = await supabase
        .from('businesses')
        .select(`
            *,
            deals (
                *
            )
        `)
        .in('category', ['arts_entertainment', 'retail'])
        .order('name');

    if (error) {
        console.error('Error fetching play venues:', error);
    }

    const list = venues || [];

    return (
        <div className="min-h-screen bg-brand-cream pt-24 pb-12 px-4 md:px-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-text-dark md:text-5xl lg:text-6xl mb-4 text-center">
                    Play & Do
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-center">
                    Find fun activities, classes, and entertainment for the whole family.
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
                        No activities found yet. Check back soon!
                    </div>
                )}
            </div>
        </div>
    );
}
