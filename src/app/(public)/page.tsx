import Link from 'next/link'
import { HomeCarousel } from '@/components/home/HomeCarousel'
import { ArrowRight } from 'lucide-react'
import { ScrollReveal } from '@/components/layout/ScrollReveal'

export const dynamic = 'force-dynamic'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-brand-cream flex flex-col">
            <div className="relative flex-1 flex flex-col justify-center items-center min-h-[90vh] pb-20">
                <HomeCarousel />

                <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
                    <ScrollReveal>
                        <h1 className="font-serif text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl mb-8 drop-shadow-lg">
                            A one-stop-shop for<br />
                            <span className="text-brand-yellow">everything Conway.</span>
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal threshold={0.2}>
                        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-8 text-white/90 font-medium drop-shadow-md">
                            Discover local eats, hidden gems, and the best entertainment.
                        </p>
                    </ScrollReveal>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 stagger-grid revealed">
                        <ScrollReveal threshold={0.3}>
                            <Link href="/conway" className="w-full sm:w-auto rounded-full bg-brand-orange px-8 sm:px-10 py-4 text-base sm:text-lg font-bold text-white shadow-xl hover:bg-brand-red transition-all duration-300 hover:scale-105 border-2 border-transparent text-center">
                                Start Exploring
                            </Link>
                        </ScrollReveal>
                        <ScrollReveal threshold={0.3}>
                            <Link href="/eat" className="w-full sm:w-auto rounded-full bg-white/10 backdrop-blur-md px-8 sm:px-10 py-4 text-base sm:text-lg font-bold text-white shadow-lg border-2 border-white/50 hover:bg-white/20 transition-all duration-300 text-center">
                                Find Food
                            </Link>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </div>
    )
}
