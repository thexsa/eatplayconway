import Link from 'next/link'
import { HomeCarousel } from '@/components/home/HomeCarousel'
import { ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-brand-cream flex flex-col">
            <div className="relative flex-1 flex flex-col justify-center items-center min-h-[90vh] pb-20">
                <HomeCarousel />

                <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl mb-8 drop-shadow-lg">
                        A one-stop-shop for<br />
                        <span className="text-brand-yellow">everything Conway.</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-white/90 font-medium drop-shadow-md">
                        Discover local eats, hidden gems, and the best entertainment.
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-x-6">
                        <Link href="/conway" className="rounded-full bg-brand-orange px-10 py-4 text-lg font-bold text-white shadow-xl hover:bg-brand-red transition-all duration-300 hover:scale-105 border-2 border-transparent">
                            Start Exploring
                        </Link>
                        <Link href="/eat" className="rounded-full bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-bold text-white shadow-lg border-2 border-white/50 hover:bg-white/20 transition-all duration-300">
                            Find Food
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
