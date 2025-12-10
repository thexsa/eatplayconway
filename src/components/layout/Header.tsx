import Link from 'next/link'
import { Search, Menu, Calendar, MapPin } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 dark:border-zinc-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="size-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                            EP
                        </div>
                        <span className="hidden font-bold text-xl tracking-tight sm:inline-block">
                            EatPlay<span className="text-orange-500">Conway</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/events" className="text-sm font-medium hover:text-orange-500 transition-colors">
                        Events
                    </Link>
                    <Link href="/deals" className="text-sm font-medium hover:text-orange-500 transition-colors">
                        Deals
                    </Link>
                    <Link href="/guides" className="text-sm font-medium hover:text-orange-500 transition-colors">
                        Guides
                    </Link>
                    <Link href="/submit" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                        Submit Event
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button className="p-2 text-zinc-500 hover:bg-zinc-100 rounded-full dark:hover:bg-zinc-800 transition-colors">
                        <Search className="size-5" />
                    </button>
                    <button className="md:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded-lg dark:text-zinc-50 dark:hover:bg-zinc-800">
                        <Menu className="size-5" />
                    </button>
                    <Link
                        href="/login"
                        className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
                    >
                        Business Login
                    </Link>
                </div>
            </div>
        </header>
    )
}
