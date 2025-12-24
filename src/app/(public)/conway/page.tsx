
import Link from 'next/link';
import { Calendar, Newspaper, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/layout/ScrollReveal';

export default function ConwayPage() {
    return (
        <div className="min-h-screen bg-brand-cream pt-24 pb-12 px-4 md:px-8">
            <div className="mb-12 text-center max-w-3xl mx-auto">
                <ScrollReveal>
                    <h1 className="text-4xl font-extrabold tracking-tight text-text-dark md:text-6xl mb-6 font-serif">
                        Experience Conway
                    </h1>
                </ScrollReveal>
                <ScrollReveal threshold={0.2}>
                    <p className="text-lg text-muted-foreground">
                        Stay connected with what’s happening in our vibrant community.
                    </p>
                </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto stagger-grid revealed">
                {/* Events Card */}
                <ScrollReveal threshold={0.3}>
                    <Link href="/events" className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 h-[300px] flex flex-col justify-between p-8">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <Calendar className="w-40 h-40 text-brand-orange" />
                        </div>

                        <div className="bg-brand-orange/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-brand-orange group-hover:scale-110 transition-transform duration-300">
                            <Calendar className="w-7 h-7" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-text-dark mb-2 group-hover:text-brand-orange transition-colors">Events</h2>
                            <p className="text-muted-foreground group-hover:text-text-dark/80 transition-colors">
                                Discover concerts, festivals, and community gatherings happening this week.
                            </p>
                        </div>

                        <div className="flex items-center text-brand-orange font-semibold mt-4">
                            View Calendar <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </ScrollReveal>

                {/* News Card */}
                <ScrollReveal threshold={0.3}>
                    <Link href="/news" className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 h-[300px] flex flex-col justify-between p-8">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                            <Newspaper className="w-40 h-40 text-brand-blue" />
                        </div>

                        <div className="bg-brand-blue/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-brand-blue group-hover:scale-110 transition-transform duration-300">
                            <Newspaper className="w-7 h-7" />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-text-dark mb-2 group-hover:text-brand-blue transition-colors">News</h2>
                            <p className="text-muted-foreground group-hover:text-text-dark/80 transition-colors">
                                Latest updates, local stories, and announcements from around town.
                            </p>
                        </div>

                        <div className="flex items-center text-brand-blue font-semibold mt-4">
                            Read Latest <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </ScrollReveal>
            </div>
        </div>
    );
}
