import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-white border-t border-brand-orange/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="font-serif text-2xl font-bold text-text-dark">
                            EatPlay<span className="text-brand-orange">Conway</span>
                        </Link>
                        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                            Your curated guide to the best events, deals, and local vibes in Conway, Arkansas.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-serif text-lg font-medium text-text-dark mb-4">Discover</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/events" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">Upcoming Events</Link>
                            <Link href="/deals" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">Local Deals</Link>
                            <Link href="/guides" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">City Guides</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-lg font-medium text-text-dark mb-4">Community</h3>
                        <div className="flex flex-col gap-3">
                            <Link href="/submit" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">Submit an Event</Link>
                            <Link href="/about" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">About Us</Link>
                            <Link href="/contact" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-lg font-medium text-text-dark mb-4">Follow Us</h3>
                        <div className="flex flex-col gap-3">
                            <a href="#" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">Instagram</a>
                            <a href="#" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">Facebook</a>
                            <a href="#" className="text-gray-600 hover:text-brand-orange transition-colors text-sm">Newsletter</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} EatPlayConway. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
                        <Link href="/terms" className="hover:text-gray-600">Terms</Link>
                        <Link href="/admin/dashboard" className="hover:text-gray-600">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
