'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Store,
    FileText,
    PlusCircle,
    Zap,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react'
import { signOut } from '@/app/auth/actions'

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', href: '/dashboard/profile', icon: Store },
    { name: 'My Content', href: '/dashboard/content', icon: FileText },
    { name: 'Submit New', href: '/dashboard/submit', icon: PlusCircle },
    { name: 'Promote', href: '/dashboard/promote', icon: Zap },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-brand-cream/30">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 shadow-sm z-30 hidden lg:block">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="size-10 rounded-xl bg-brand-orange flex items-center justify-center font-serif text-2xl font-bold text-white transition-transform group-hover:scale-105">
                                E
                            </div>
                            <span className="font-serif text-xl font-medium text-text-dark">Business Portal</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                            ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                                            : 'text-gray-500 hover:bg-brand-cream/50 hover:text-brand-orange'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`size-5 transition-colors ${isActive ? 'text-white' : 'group-hover:text-brand-orange'}`} />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    {isActive && <ChevronRight className="size-4 opacity-70" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={() => signOut()}
                            className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-2xl transition-all group"
                        >
                            <LogOut className="size-5 transition-colors group-hover:text-brand-red" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:pl-72 min-h-screen flex flex-col">
                {/* Top Header (Subtle) */}
                <header className="h-16 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
                    <div className="text-sm font-medium text-gray-400">
                        {pathname.split('/').filter(Boolean).map((p, i) => (
                            <span key={p} className="flex items-center inline-flex">
                                {i > 0 && <ChevronRight className="size-3 mx-2" />}
                                <span className="capitalize">{p}</span>
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="size-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                            <Settings className="size-4" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
