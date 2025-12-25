'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { cn } from '@/utils/cn'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { href: '/eat', label: 'Eat' },
        { href: '/play', label: 'Play' },
        { href: '/conway', label: 'Conway' },
    ]

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
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-semibold leading-6 text-text-dark hover:text-brand-orange transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex flex-1 items-center justify-end gap-x-4 sm:gap-x-6">
                        <button className="text-text-dark hover:text-brand-orange transition-colors p-2">
                            <Search className="size-5" />
                        </button>

                        <Link
                            href="/submit"
                            className="hidden sm:block rounded-full bg-text-dark px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange transition-colors duration-300"
                        >
                            Submit Event
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden text-text-dark p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={cn(
                "fixed inset-x-0 top-20 bg-brand-cream border-b border-gray-100 lg:hidden transition-all duration-300 ease-in-out z-40 overflow-hidden",
                isMenuOpen ? "max-h-[80vh] opacity-100 py-8" : "max-h-0 opacity-0 py-0"
            )}>
                <nav className="flex flex-col items-center gap-y-6 px-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xl font-serif font-bold text-text-dark hover:text-brand-orange transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/submit"
                        className="w-full text-center rounded-2xl bg-text-dark py-4 text-lg font-bold text-white shadow-lg hover:bg-brand-orange transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Submit Event
                    </Link>
                </nav>
            </div>

            {/* Backdrop for closing menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-30 lg:hidden h-screen"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    )
}
