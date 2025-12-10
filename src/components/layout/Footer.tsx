import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            EatPlay<span className="text-orange-500">Conway</span>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Your automated guide to everything happening in Conway, Arkansas.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Discover</h3>
                        <Link href="/events" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Today&apos;s Events</Link>
                        <Link href="/deals" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Featured Deals</Link>
                        <Link href="/guides" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Weekend Guide</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">For Business</h3>
                        <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Pricing & Plans</Link>
                        <Link href="/login" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Manager Login</Link>
                        <Link href="/submit" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Submit Event</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold">Connect</h3>
                        <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Facebook</Link>
                        <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Instagram</Link>
                        <Link href="#" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">Contact Us</Link>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    © {new Date().getFullYear()} EatPlayConway. Automatically Curated with AI.
                </div>
            </div>
        </footer>
    )
}
