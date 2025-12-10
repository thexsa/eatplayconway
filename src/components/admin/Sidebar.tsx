"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Database, Calendar, Check, Settings, Users, BarChart3, Globe } from 'lucide-react'
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
        <div className="flex h-screen w-64 flex-col border-r bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800">
            <div className="flex h-16 items-center gap-2 border-b px-6 dark:border-zinc-800">
                <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                    <Globe className="size-5" />
                </div>
                <span className="font-bold">EatPlay<span className="text-orange-600">Admin</span></span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-6">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-white text-orange-600 shadow-sm dark:bg-zinc-800 dark:text-orange-500'
                                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
                            )}
                        >
                            <item.icon className={clsx('size-5', isActive ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-400 group-hover:text-zinc-500')} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t p-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Admin User</span>
                        <span className="text-xs text-zinc-500">admin@eatplayconway.com</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
