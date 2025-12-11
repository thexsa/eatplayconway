import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex lg:flex-1">
                        <Link href="/" className="-m-1.5 p-1.5 font-serif text-2xl font-bold tracking-tight text-text-dark hover:text-brand-orange transition-colors">
                            EatPlayConway
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex lg:gap-x-12">
                        <Link href="/events" className="text-sm font-semibold leading-6 text-text-dark hover:text-brand-orange transition-colors">
                            Events
                        </Link>
                        <Link href="/news" className="text-sm font-semibold leading-6 text-text-dark hover:text-brand-orange transition-colors">
                            News
                        </Link>
                        <Link href="/deals" className="text-sm font-semibold leading-6 text-text-dark hover:text-brand-orange transition-colors">
                            Deals
                        </Link>
                        <Link href="/guides" className="text-sm font-semibold leading-6 text-text-dark hover:text-brand-orange transition-colors">
                            Guides
                        </Link>
                        <Link href="/about" className="text-sm font-semibold leading-6 text-text-dark hover:text-brand-orange transition-colors">
                            About
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex flex-1 items-center justify-end gap-x-6">
                        <button className="text-text-dark hover:text-brand-orange transition-colors">
                            <Search className="size-5" />
                        </button>
                        <Link
                            href="/submit"
                            className="hidden lg:block rounded-full bg-text-dark px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange transition-colors duration-300"
                        >
                            Submit Event
                        </Link>
                        {/* Mobile Menu Button - Placeholder for real implementation */}
                        <button className="lg:hidden text-text-dark">
                            <Menu className="size-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
