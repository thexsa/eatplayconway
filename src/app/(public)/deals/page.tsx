import Link from 'next/link'

export default function DealsPage() {
    return (
        <div className="min-h-screen bg-brand-cream pb-20">
            {/* Header */}
            <div className="bg-white/50 pt-32 pb-16 px-4 mb-12 border-b border-gray-100">
                <div className="container mx-auto">
                    <h1 className="font-serif text-5xl font-medium text-text-dark mb-4">Local Deals</h1>
                    <p className="text-xl text-gray-600 font-sans max-w-2xl">
                        Exclusive specials, happy hours, and coupons from Conway businesses.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 text-center py-20">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <h2 className="font-serif text-3xl font-medium text-text-dark mb-4">Coming Soon</h2>
                    <p className="text-gray-600 mb-8">
                        We're currently onboarding local businesses to bring you the best deals in town.
                        Check back later!
                    </p>
                    <Link href="/" className="inline-block rounded-full bg-brand-orange px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-red transition-colors">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
