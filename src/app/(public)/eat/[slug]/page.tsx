
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, MapPin, ChevronLeft, Menu as MenuIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RestaurantDetailPageProps {
    params: Promise<{
        slug: string;
    }>
}

// Helper to check if a URL allows embedding (HEAD request)
async function isEmbeddable(url: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const res = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store' // Ensure we check live
        });
        clearTimeout(timeoutId);

        const xFrameOptions = res.headers.get('x-frame-options')?.toLowerCase();
        const csp = res.headers.get('content-security-policy')?.toLowerCase();

        if (xFrameOptions === 'deny' || xFrameOptions === 'sameorigin') {
            return false;
        }

        if (csp && csp.includes('frame-ancestors')) {
            // Complex parsing omitted, but if it has frame-ancestors and not us, likely blocked.
            // Simplistic check: if it restricts ancestors, assume blocked for now to be safe.
            return false;
        }

        return true;
    } catch (e) {
        // If fetch fails (e.g. timeout or network), assume not embeddable to avoid broken UI
        return false;
    }
}

// Reusing image logic for consistency until we have DB images
function getRestaurantImage(slug: string): string {
    if (slug.includes('rogue')) return 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80';
    if (slug.includes('breakfast')) return 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80';
    if (slug.includes('steak')) return 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=1200&q=80';
    if (slug.includes('italian') || slug.includes('portofino')) return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80';
    if (slug.includes('grill') || slug.includes('marketplace')) return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80';
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
}

export default async function RestaurantDetailPage(props: RestaurantDetailPageProps) {
    const params = await props.params;
    const { slug } = params;
    const supabase = await createClient();

    const { data: restaurant, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !restaurant) {
        return notFound();
    }

    const imageUrl = getRestaurantImage(slug);

    // Check if menu is embeddable
    const canEmbed = restaurant.menu_url ? await isEmbeddable(restaurant.menu_url) : false;

    return (
        <div className="min-h-screen bg-brand-cream pt-24 pb-20">
            {/* ... header ... */}
            <div className="container px-4 mx-auto max-w-4xl">
                {/* ... existing code ... */}

                <Link href="/eat" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-orange mb-6 transition-colors font-medium">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Eat
                </Link>

                {/* Hero Section */}
                <div className="relative h-[300px] w-full rounded-3xl overflow-hidden shadow-lg mb-8 group">
                    <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight shadow-sm">{restaurant.name}</h1>
                        {restaurant.address && (
                            <div className="flex items-center gap-2 text-white/90 text-sm md:text-base font-medium">
                                <MapPin className="h-4 w-4 text-brand-orange" />
                                {restaurant.address}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        {restaurant.description && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40">
                                <h2 className="text-xl font-bold text-text-dark mb-4 border-b border-gray-100 pb-2">About</h2>
                                <p className="text-text-dark/80 leading-relaxed">
                                    {restaurant.description}
                                </p>
                            </div>
                        )}

                        {/* Menu Check */}
                        {restaurant.menu_url && (
                            <div className="bg-white rounded-2xl shadow-sm border border-border/40 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                                        <MenuIcon className="h-5 w-5 text-brand-orange" />
                                        Menu
                                    </h2>
                                    <a
                                        href={restaurant.menu_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-semibold text-brand-orange hover:underline uppercase tracking-wide"
                                    >
                                        Open in New Tab <ExternalLink className="h-3 w-3 inline ml-0.5" />
                                    </a>
                                </div>

                                {canEmbed ? (
                                    <div className="w-full h-[600px] bg-secondary/10 relative">
                                        <iframe
                                            src={restaurant.menu_url}
                                            className="w-full h-full border-0"
                                            title={`${restaurant.name} Menu`}
                                            sandbox="allow-scripts allow-same-origin allow-popups"
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-12 flex flex-col items-center justify-center text-center bg-secondary/5">
                                        <div className="h-16 w-16 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
                                            <MenuIcon className="h-8 w-8 text-brand-orange" />
                                        </div>
                                        <h3 className="text-lg font-bold text-text-dark mb-2">View Menu on Website</h3>
                                        <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                                            This restaurant's menu cannot be embedded directly. Please view it on their website.
                                        </p>
                                        <a
                                            href={restaurant.menu_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold shadow-md hover:bg-brand-orange-hover hover:shadow-lg transition-all"
                                        >
                                            Open Menu <ExternalLink className="h-4 w-4 ml-2" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 sticky top-24">
                            <h3 className="font-bold text-text-dark mb-4 text-lg">Details</h3>

                            <div className="space-y-4">
                                {restaurant.website_url && (
                                    <a
                                        href={restaurant.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-text-dark font-medium transition-colors group"
                                    >
                                        <span>Visit Website</span>
                                        <ExternalLink className="h-4 w-4 text-brand-orange group-hover:scale-110 transition-transform" />
                                    </a>
                                )}

                                {restaurant.menu_url && (
                                    <a
                                        href={restaurant.menu_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between w-full p-3 rounded-lg bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange font-medium transition-colors group"
                                    >
                                        <span>Full Menu</span>
                                        <MenuIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
