"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Database, Calendar, Check, Settings, Users, BarChart3, Globe, Building2 } from 'lucide-react'
import { clsx } from 'clsx'

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Data Sources', href: '/admin/sources', icon: Database },
    { name: 'Events Queue', href: '/admin/events', icon: Calendar },
    { name: 'Businesses', href: '/admin/businesses', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-gray-100 bg-white">
            <div className="flex h-16 items-center border-b border-gray-100 px-6">
                <Link href="/" className="font-serif text-xl font-bold text-text-dark">
                    EatPlay<span className="text-brand-orange">Conway</span>
                </Link>
            </div>

            <nav className="flex flex-col gap-1 p-4">
                {navigation.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                ? 'bg-brand-orange/10 text-brand-orange'
                                : 'text-gray-600 hover:bg-brand-cream hover:text-text-dark'
                                }`}
                        >
                            {link.name === 'Businesses' ? (
                                <Building2 className="size-4" />
                            ) : (
                                <link.icon className="size-4" />
                            )}
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-gray-100 p-4">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange text-xs font-bold">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-dark">Admin User</span>
                        <span className="text-xs text-gray-500">admin@eatplayconway.com</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
